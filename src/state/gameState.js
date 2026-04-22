/**
 * Game state + reducer for The Last Sons of Troy.
 *
 * The colony is organized into seven Trojan houses (families). Each house
 * has its own population, head, specialization, stance, and political
 * standing (influence / ambition / loyalty). The player dispatches crews
 * drawn from a single house, builds, explores, and responds to events —
 * which now resolve as council votes with the families weighing in.
 *
 * Time only advances on END_DAY.
 */

import { TASKS, resolveTask, taskDuration } from './tasks.js';
import { BUILDINGS, canAfford, payCost } from './buildings.js';
import { LOCATIONS, getUndiscoveredLocations } from './locations.js';
import { pickEvent } from './events.js';
import {
  createFamilies,
  colonyPopulation,
  familyPreferredChoice,
  councilTally,
} from './families.js';

export const SEASONS = ['Spring', 'Summer', 'Autumn', 'Winter'];
const DAYS_PER_SEASON = 12;

// ---------------- Initial state ----------------

export function createInitialState() {
  const families = createFamilies();
  const pop = colonyPopulation(families);

  return {
    colonyName: 'New Ilion',
    day: 1,
    seasonIndex: 0,
    // Starting stores scale with population so ~350 settlers can actually eat.
    resources: {
      food: Math.round(pop * 1.2),   // roughly 2 weeks of food
      wood: 30,
      stone: 14,
      faith: 4,
      pottery: 0,
    },
    families,
    buildings: [],
    construction: [],
    locations: LOCATIONS.map((l) => ({ ...l })),
    chronicle: openingChronicle(families),
    history: [
      {
        day: 1,
        food: Math.round(pop * 1.2),
        wood: 30,
        stone: 14,
        faith: 4,
        pottery: 0,
        population: pop,
      },
    ],
    activeEvent: null,
    eventCooldown: 3,
    lastCouncilTally: null, // most recent event's vote, for surfacing in chronicle
  };
}

function openingChronicle(families) {
  const entries = [
    {
      day: 1,
      season: SEASONS[0],
      text:
        'Seven ships ground on the beach at dawn. The smoke of Ilium is a line on the eastern horizon. We are what is left.',
    },
    {
      day: 1,
      season: SEASONS[0],
      text:
        'The captains meet at the high-water line and swear to name this place New Ilion. Seven houses, seven hearths, one council.',
    },
  ];
  for (const f of families) {
    entries.push({
      day: 1,
      season: SEASONS[0],
      text: `${f.ship} carries ${f.name} — ${f.epithet}. ${f.head.name} speaks for them.`,
    });
  }
  return entries;
}

// ---------------- Helpers ----------------

function nowStamp(state) {
  return { day: state.day, season: SEASONS[state.seasonIndex] };
}

function log(state, text) {
  state.chronicle = [
    { ...nowStamp(state), text },
    ...state.chronicle,
  ];
  if (state.chronicle.length > 300) state.chronicle.length = 300;
}

function addResources(resources, delta) {
  const out = { ...resources };
  for (const [k, v] of Object.entries(delta || {})) {
    out[k] = Math.max(0, (out[k] || 0) + v);
  }
  return out;
}

function snapshotHistory(state) {
  const entry = {
    day: state.day,
    food: Math.round(state.resources.food || 0),
    wood: Math.round(state.resources.wood || 0),
    stone: Math.round(state.resources.stone || 0),
    faith: Math.round(state.resources.faith || 0),
    pottery: Math.round(state.resources.pottery || 0),
    population: colonyPopulation(state.families),
  };
  const existing = state.history || [];
  const last = existing[existing.length - 1];
  if (last && last.day === entry.day) {
    state.history = [...existing.slice(0, -1), entry];
  } else {
    state.history = [...existing, entry];
  }
  if (state.history.length > 120) {
    state.history = state.history.slice(-120);
  }
}

/** Reduce a family's population bucket by N, preferring non-warriors first. */
function drawCrew(family, size, warriorsOnly) {
  const p = { ...family.population };
  let remaining = size;
  if (warriorsOnly) {
    const take = Math.min(remaining, p.warriors || 0);
    p.warriors -= take;
    remaining -= take;
  } else {
    // Drain order: craftsmen, women, then warriors.
    for (const bucket of ['craftsmen', 'women', 'warriors']) {
      const take = Math.min(remaining, p[bucket] || 0);
      p[bucket] -= take;
      remaining -= take;
      if (remaining <= 0) break;
    }
  }
  return p;
}

/** Restore a crew of N back into the family's pool (proportional to what was drawn). */
function returnCrew(family, size, warriorsOnly) {
  const p = { ...family.population };
  if (warriorsOnly) {
    p.warriors = (p.warriors || 0) + size;
  } else {
    // We don't perfectly remember what we drew from where; bias return to craftsmen/women.
    let remaining = size;
    for (const bucket of ['craftsmen', 'women', 'warriors']) {
      if (remaining <= 0) break;
      // return up to a fair share to each bucket
      const share = Math.ceil(remaining / 3);
      p[bucket] = (p[bucket] || 0) + share;
      remaining -= share;
    }
  }
  return p;
}

function updateFamily(state, familyId, patch) {
  const idx = state.families.findIndex((f) => f.id === familyId);
  if (idx === -1) return state;
  const next = [...state.families];
  next[idx] = { ...state.families[idx], ...patch };
  return { ...state, families: next };
}

// ---------------- Reducer ----------------

export function reducer(state, action) {
  switch (action.type) {
    case 'DISPATCH_CREW':   return dispatchCrew(state, action);
    case 'BUILD':           return build(state, action);
    case 'EXPLORE_LOCATION': return exploreLocation(state, action);
    case 'RESOLVE_EVENT':   return resolveEvent(state, action);
    case 'END_DAY':         return endDay(state);
    case 'LOAD':            return action.state;
    default: return state;
  }
}

function dispatchCrew(state, { familyId, taskId, crewSize }) {
  const task = TASKS[taskId];
  if (!task) return state;
  const family = state.families.find((f) => f.id === familyId);
  if (!family) return state;
  if (family.activeCrew) return state;

  const size = Math.max(1, Math.floor(crewSize));
  const pool = task.warriorsOnly
    ? (family.population.warriors || 0)
    : ((family.population.warriors || 0) + (family.population.craftsmen || 0) + (family.population.women || 0));
  if (size > pool) return state;

  const days = taskDuration(task, family, size);
  const newPop = drawCrew(family, size, !!task.warriorsOnly);
  const inSpec = family.preferredTasks.includes(taskId);
  const ambitionDelta = inSpec ? -2 : +3;

  let next = updateFamily(state, familyId, {
    population: newPop,
    activeCrew: { taskId, size, daysRemaining: days, warriorsOnly: !!task.warriorsOnly },
    ambition: Math.max(0, Math.min(100, family.ambition + ambitionDelta)),
  });

  log(
    next,
    `${family.name} sends a party of ${size} to ${task.label.toLowerCase()}.`,
  );
  return next;
}

function build(state, { buildingId }) {
  const b = BUILDINGS[buildingId];
  if (!b) return state;
  if (!canAfford(state.resources, b.cost)) return state;
  if (state.buildings.some((x) => x.id === b.id)) return state;
  if (state.construction.some((x) => x.id === b.id)) return state;

  const next = { ...state };
  next.resources = payCost(state.resources, b.cost);
  next.construction = [
    ...state.construction,
    { id: b.id, daysRemaining: b.days },
  ];
  log(next, `Work begins on the ${b.label}.`);
  return next;
}

function exploreLocation(state, { locationId }) {
  const idx = state.locations.findIndex((l) => l.id === locationId);
  if (idx === -1) return state;
  const loc = state.locations[idx];
  if (!loc.discovered || loc.visited) return state;

  const next = { ...state, locations: [...state.locations] };
  next.locations[idx] = { ...loc, visited: true };
  if (loc.oneTimeYield) {
    next.resources = addResources(state.resources, loc.oneTimeYield);
    const parts = Object.entries(loc.oneTimeYield)
      .map(([k, v]) => `+${v} ${k}`)
      .join(', ');
    log(next, `The colony investigates ${loc.name}. ${parts}.`);
  } else {
    log(next, `The colony investigates ${loc.name}. ${loc.description}`);
  }
  return next;
}

function resolveEvent(state, { choiceId }) {
  const evt = state.activeEvent;
  if (!evt) return state;
  const choice = evt.choices.find((c) => c.id === choiceId);
  if (!choice) return state;

  // Determine who supported this choice vs. who dissented.
  const tally = councilTally(state.families, evt.choices);
  const supporters = new Set(tally[choice.id].families);
  const dissenters = state.families.filter((f) => !supporters.has(f.id));

  let next = { ...state };
  if (choice.effects) {
    next.resources = addResources(state.resources, choice.effects);
  }

  // "joinsFamily" — new settler joins a specific house as a warrior.
  if (choice.joinsFamily) {
    next.families = state.families.map((f) =>
      f.id === choice.joinsFamily
        ? { ...f, population: { ...f.population, warriors: (f.population.warriors || 0) + 1 } }
        : f,
    );
  }

  // Supporters gain a point of influence; dissenters lose one and gain ambition.
  next.families = (next.families || state.families).map((f) => {
    if (supporters.has(f.id)) {
      return { ...f, influence: f.influence + 1 };
    }
    return {
      ...f,
      influence: Math.max(0, f.influence - 1),
      ambition: Math.min(100, f.ambition + 4),
      loyalty: Math.max(0, f.loyalty - 1),
    };
  });

  next.activeEvent = null;
  next.lastCouncilTally = { choiceId: choice.id, tally, eventId: evt.id };
  if (choice.logLine) log(next, choice.logLine);

  if (dissenters.length > 0) {
    const names = dissenters.map((f) => f.name.replace('House of ', '')).join(', ');
    log(next, `The council grumbles: ${names} disagreed.`);
  } else {
    log(next, 'The council speaks with one voice.');
  }

  next.eventCooldown = 3;
  return next;
}

function endDay(state) {
  if (state.activeEvent) return state;

  let next = { ...state };
  next.day = state.day + 1;

  // Season advance
  const dayInYear = state.day % (DAYS_PER_SEASON * SEASONS.length);
  const nextSeasonIndex = Math.floor(dayInYear / DAYS_PER_SEASON) % SEASONS.length;
  if (nextSeasonIndex !== state.seasonIndex) {
    next.seasonIndex = nextSeasonIndex;
    log(next, `${SEASONS[nextSeasonIndex]} comes to the harbor.`);
  }
  const season = SEASONS[next.seasonIndex];

  // Tick active crews per family
  next.families = [];
  for (const f of state.families) {
    if (!f.activeCrew) {
      next.families.push(f);
      continue;
    }
    const remaining = f.activeCrew.daysRemaining - 1;
    if (remaining > 0) {
      next.families.push({
        ...f,
        activeCrew: { ...f.activeCrew, daysRemaining: remaining },
      });
      continue;
    }

    // Task completes
    const task = TASKS[f.activeCrew.taskId];
    const undiscovered = getUndiscoveredLocations(next.locations);
    const { yields, discovered, line, influenceGain } = resolveTask(
      task,
      f,
      f.activeCrew.size,
      { season, undiscoveredLocations: undiscovered },
    );
    if (yields && Object.keys(yields).length) {
      next.resources = addResources(next.resources || state.resources, yields);
    }
    if (discovered) {
      const i = next.locations.findIndex((l) => l.id === discovered.id);
      if (i !== -1) {
        next.locations = [...next.locations];
        next.locations[i] = { ...next.locations[i], discovered: true };
      }
    }
    log(next, line);

    // Return crew and credit influence.
    const returnedPop = returnCrew(f, f.activeCrew.size, f.activeCrew.warriorsOnly);
    next.families.push({
      ...f,
      population: returnedPop,
      activeCrew: null,
      influence: f.influence + influenceGain,
    });
  }

  // Tick construction
  if (state.construction.length) {
    next.construction = [];
    for (const cs of state.construction) {
      const remaining = cs.daysRemaining - 1;
      if (remaining > 0) {
        next.construction.push({ ...cs, daysRemaining: remaining });
      } else {
        const b = BUILDINGS[cs.id];
        next.buildings = [...(next.buildings || state.buildings), { id: b.id }];
        log(next, b.completeLine);
      }
    }
  }

  // Consume food (1 per mouth per day)
  const mouths = colonyPopulation(next.families);
  next.resources = addResources(next.resources || state.resources, { food: -mouths });
  if ((next.resources.food || 0) <= 0 && mouths > 0) {
    log(next, `The colony goes hungry. Stores are bare.`);
  }

  // Ambition tick — high ambition slowly erodes loyalty.
  next.families = next.families.map((f) => {
    if (f.ambition > 60) {
      return {
        ...f,
        loyalty: Math.max(0, f.loyalty - 1),
      };
    }
    // Idle families with ambition let it bleed off slowly
    if (!f.activeCrew && f.ambition > 0) {
      return { ...f, ambition: Math.max(0, f.ambition - 1) };
    }
    return f;
  });

  // Event roll
  next.eventCooldown = Math.max(0, (state.eventCooldown || 0) - 1);
  if (next.eventCooldown === 0 && !next.activeEvent) {
    if (Math.random() < 0.45) {
      const evt = pickEvent();
      next.activeEvent = evt;
      log(next, `Event: ${evt.title}`);
      next.eventCooldown = 4;
    } else {
      next.eventCooldown = 1;
    }
  }

  snapshotHistory(next);
  return next;
}

// ---------------- Persistence ----------------

const SAVE_KEY = 'lsot.save.v2'; // v2: families model
const OLD_SAVE_KEY = 'lsot.save.v1';

export function saveState(state) {
  try {
    const cleaned = { ...state, activeEvent: null };
    localStorage.setItem(SAVE_KEY, JSON.stringify(cleaned));
    return true;
  } catch {
    return false;
  }
}

export function loadState() {
  try {
    // Wipe old v1 save format so it doesn't linger in the browser.
    try { localStorage.removeItem(OLD_SAVE_KEY); } catch {}

    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const loaded = JSON.parse(raw);
    if (!loaded.families || !Array.isArray(loaded.families)) return null;
    return loaded;
  } catch {
    return null;
  }
}

export function clearSave() {
  try { localStorage.removeItem(SAVE_KEY); } catch {}
}
