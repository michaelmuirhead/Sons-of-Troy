/**
 * Game state + reducer for The Last Sons of Troy.
 *
 * The colony is organized into seven Trojan houses (families). Each house
 * has its own population, head, specialization, stance, and political
 * standing (influence / ambition / loyalty). The player dispatches crews
 * drawn from a single house, builds, explores, and responds to events —
 * which resolve as council votes with the families weighing in.
 *
 * Time only advances on END_DAY. A year is 4 seasons × 12 days = 48 days.
 * Each year:
 *   - Heads and notables age.
 *   - Children mature into adult buckets; some adults retire to elders.
 *   - Old heads may die; notables succeed them.
 * Each spring, the women bucket yields new children.
 * Each winter, some elders die.
 *
 * Two crises can interrupt End Day:
 *   - Secession: a house with loyalty < 20 threatens to sail.
 *   - Coup: a house with ambition > 80 and more influence than the rest
 *     combined demands the council be dissolved.
 */

import { TASKS, resolveTask, taskDuration } from './tasks.js';
import { BUILDINGS, canAfford, payCost } from './buildings.js';
import { LOCATIONS, getUndiscoveredLocations } from './locations.js';
import { pickEvent, pickTradeEvent } from './events.js';
import {
  createFamilies,
  colonyPopulation,
  activeHouses,
  familyPreferredChoice,
  councilTally,
} from './families.js';

export const SEASONS = ['Spring', 'Summer', 'Autumn', 'Winter'];
const DAYS_PER_SEASON = 12;
const DAYS_PER_YEAR = DAYS_PER_SEASON * SEASONS.length;

// ---------------- Initial state ----------------

export function createInitialState() {
  const families = createFamilies();
  const pop = colonyPopulation(families);

  return {
    colonyName: 'New Ilion',
    day: 1,
    year: 1,
    seasonIndex: 0,
    // Starting stores scale with population so ~350 settlers can actually eat.
    resources: {
      food: Math.round(pop * 1.2),   // roughly 2 weeks of food
      wood: 30,
      stone: 14,
      faith: 4,
      pottery: 0,
      bronze: 0,
      amber: 0,
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
        bronze: 0,
        population: pop,
      },
    ],
    activeEvent: null,
    eventCooldown: 3,
    lastCouncilTally: null,
    monarchy: null, // { familyId } once a coup has been accepted
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
    bronze: Math.round(state.resources.bronze || 0),
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
    for (const bucket of ['craftsmen', 'women', 'warriors']) {
      const take = Math.min(remaining, p[bucket] || 0);
      p[bucket] -= take;
      remaining -= take;
      if (remaining <= 0) break;
    }
  }
  return p;
}

/** Restore a crew of N back into the family's pool (biased to craftsmen/women). */
function returnCrew(family, size, warriorsOnly) {
  const p = { ...family.population };
  if (warriorsOnly) {
    p.warriors = (p.warriors || 0) + size;
  } else {
    let remaining = size;
    for (const bucket of ['craftsmen', 'women', 'warriors']) {
      if (remaining <= 0) break;
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

/** Bound a number into [lo, hi]. */
function clamp(n, lo, hi) { return Math.max(lo, Math.min(hi, n)); }

/** Push a bond between families a and b (directional a → b, capped 0..100). */
function addBond(family, otherId, delta) {
  const rel = { ...(family.relationships || {}) };
  rel[otherId] = clamp((rel[otherId] || 0) + delta, 0, 100);
  return rel;
}

// ---------------- Reducer ----------------

export function reducer(state, action) {
  switch (action.type) {
    case 'DISPATCH_CREW':    return dispatchCrew(state, action);
    case 'BUILD':            return build(state, action);
    case 'EXPLORE_LOCATION': return exploreLocation(state, action);
    case 'RESOLVE_EVENT':    return resolveEvent(state, action);
    case 'END_DAY':          return endDay(state);
    case 'LOAD':             return action.state;
    default: return state;
  }
}

// ---------------- Dispatch (with optional patronage) ----------------

function dispatchCrew(state, { familyId, taskId, crewSize, patronOf }) {
  const task = TASKS[taskId];
  if (!task) return state;
  const family = state.families.find((f) => f.id === familyId);
  if (!family || family.seceded) return state;
  if (family.activeCrew) return state;

  // Gate potter task on the kiln being built
  if (task.requiresBuilding) {
    const built = state.buildings.some((b) => b.id === task.requiresBuilding);
    if (!built) return state;
  }

  const size = Math.max(1, Math.floor(crewSize));
  const pool = task.warriorsOnly
    ? (family.population.warriors || 0)
    : ((family.population.warriors || 0) + (family.population.craftsmen || 0) + (family.population.women || 0));
  if (size > pool) return state;

  // Patronage target must be a valid, non-seceded, *other* family.
  let realPatronOf = null;
  if (patronOf && patronOf !== familyId) {
    const target = state.families.find((f) => f.id === patronOf);
    if (target && !target.seceded) realPatronOf = patronOf;
  }

  const days = taskDuration(task, family, size);
  const newPop = drawCrew(family, size, !!task.warriorsOnly);
  const inSpec = family.preferredTasks.includes(taskId);
  // Working outside spec raises ambition; doing it as patronage is a favor,
  // slightly less ambitious because prestige will flow.
  const ambitionDelta = inSpec ? -2 : (realPatronOf ? +1 : +3);

  let next = updateFamily(state, familyId, {
    population: newPop,
    activeCrew: {
      taskId,
      size,
      daysRemaining: days,
      warriorsOnly: !!task.warriorsOnly,
      patronOf: realPatronOf,
    },
    ambition: clamp(family.ambition + ambitionDelta, 0, 100),
  });

  if (realPatronOf) {
    const target = next.families.find((f) => f.id === realPatronOf);
    log(
      next,
      `${family.name} sends a party of ${size} to ${task.label.toLowerCase()}, on behalf of ${target.name}.`,
    );
  } else {
    log(
      next,
      `${family.name} sends a party of ${size} to ${task.label.toLowerCase()}.`,
    );
  }
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

// ---------------- Event resolution ----------------

function resolveEvent(state, { choiceId }) {
  const evt = state.activeEvent;
  if (!evt) return state;
  const choice = evt.choices.find((c) => c.id === choiceId);
  if (!choice) return state;

  // Crisis events resolve through their own handler — they mutate houses.
  if (evt.isCrisis) {
    return resolveCrisis(state, evt, choice);
  }

  // Regular event: council vote decides supporters vs. dissenters.
  const tally = councilTally(state.families, evt.choices);
  const supporters = new Set(tally[choice.id].families);
  const dissenters = activeHouses(state.families).filter((f) => !supporters.has(f.id));

  let next = { ...state };
  if (choice.effects) {
    next.resources = addResources(state.resources, choice.effects);
  }

  if (choice.joinsFamily) {
    next.families = state.families.map((f) =>
      f.id === choice.joinsFamily
        ? { ...f, population: { ...f.population, warriors: (f.population.warriors || 0) + 1 } }
        : f,
    );
  }

  next.families = (next.families || state.families).map((f) => {
    if (f.seceded) return f;
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

/** Resolve a secession / coup choice. */
function resolveCrisis(state, evt, choice) {
  let next = { ...state, activeEvent: null, lastCouncilTally: null };
  next.eventCooldown = 5;

  if (choice.effects) {
    next.resources = addResources(state.resources, choice.effects);
  }

  const target = state.families.find((f) => f.id === evt.crisisFamilyId);

  if (choice.crisisAction === 'let_secede' && target) {
    next.families = state.families.map((f) =>
      f.id === target.id ? { ...f, seceded: true, activeCrew: null } : f,
    );
    log(next, `${target.ship} cuts her moorings in the dark. ${target.name} is gone from New Ilion.`);
  } else if (choice.crisisAction === 'beg_stay' && target) {
    next.families = state.families.map((f) =>
      f.id === target.id
        ? { ...f, loyalty: Math.max(f.loyalty, 45), ambition: Math.max(0, f.ambition - 10) }
        : f,
    );
    log(next, `The other houses kneel on the strand. ${target.head.name} accepts the gifts, and stays — for now.`);
  } else if (choice.crisisAction === 'burn_ship' && target) {
    next.families = state.families.map((f) => {
      if (f.id === target.id) {
        // Half the house scatters in rage; the rest are trapped.
        const p = f.population;
        const halved = Object.fromEntries(
          Object.entries(p).map(([k, v]) => [k, Math.floor(v / 2)]),
        );
        return { ...f, population: halved, loyalty: 10, ambition: 100 };
      }
      return {
        ...f,
        loyalty: Math.max(0, f.loyalty - 8),
        ambition: Math.min(100, f.ambition + 6),
      };
    });
    log(next, `${target.ship} burns to the waterline. Half of ${target.name} melts into the dunes by dawn; the rest curse the council under their breath.`);
  } else if (choice.crisisAction === 'accept_crown' && target) {
    // Monarchy flag set. Target house becomes overlord; gets big influence; others lose loyalty.
    next.monarchy = { familyId: target.id };
    next.families = state.families.map((f) => {
      if (f.id === target.id) {
        return { ...f, influence: f.influence + 20, ambition: 20, loyalty: 90 };
      }
      return {
        ...f,
        loyalty: Math.max(0, f.loyalty - 15),
        ambition: Math.min(100, f.ambition + 5),
      };
    });
    log(next, `${target.head.name} is crowned by firelight. The council is dissolved. New Ilion is a kingdom.`);
  } else if (choice.crisisAction === 'resist_coup' && target) {
    // Civil war: target house + their warriors walk. Other houses take sides.
    next.families = state.families.map((f) => {
      if (f.id === target.id) {
        // The rebel house leaves.
        return { ...f, seceded: true, activeCrew: null };
      }
      return {
        ...f,
        influence: f.influence + 2,
        loyalty: Math.max(0, f.loyalty - 5),
      };
    });
    log(next, `${target.name} marches out of the camp with their spears shouldered. The shore is quieter without them — and smaller.`);
  }

  return next;
}

// ---------------- Seasonal & yearly demographics ----------------

/** Returns { families, log: [text] } after applying spring births. */
function applySpringBirths(families) {
  const log = [];
  const next = families.map((f) => {
    if (f.seceded) return f;
    const women = f.population.women || 0;
    const babies = Math.floor(women / 6); // ~1 child per 6 women per spring
    if (babies <= 0) return f;
    return {
      ...f,
      population: {
        ...f.population,
        children: (f.population.children || 0) + babies,
      },
    };
  });
  const totalBorn = next.reduce((s, f) => {
    const prev = families.find((x) => x.id === f.id);
    return s + ((f.population.children || 0) - (prev.population.children || 0));
  }, 0);
  if (totalBorn > 0) {
    log.push(`Spring brings ${totalBorn} new children to the hearths of New Ilion.`);
  }
  return { families: next, log };
}

/** Winter culls some elders. */
function applyWinterDeaths(families) {
  const log = [];
  let totalDead = 0;
  const next = families.map((f) => {
    if (f.seceded) return f;
    const elders = f.population.elders || 0;
    // ~1 in 6 elders die each winter (avg). Scaled by family size.
    const dead = Math.floor(elders * 0.15 + Math.random() * 0.5);
    if (dead <= 0) return f;
    totalDead += dead;
    return {
      ...f,
      population: {
        ...f.population,
        elders: Math.max(0, elders - dead),
      },
    };
  });
  if (totalDead > 0) {
    log.push(`Winter takes ${totalDead} of the elders. The long hall is quieter at the evening meal.`);
  }
  return { families: next, log };
}

/** Annual aging transitions: children mature; some adults retire to elders. */
function applyAnnualAging(families) {
  return families.map((f) => {
    if (f.seceded) return f;
    const p = { ...f.population };

    // Children mature (~15% per year). Distribute 1:1:3 into warriors/craftsmen/women-ish.
    // Favor craftsmen + women to keep warrior numbers controlled (young warriors earned via events).
    const matured = Math.floor((p.children || 0) * 0.15);
    if (matured > 0) {
      p.children = (p.children || 0) - matured;
      const toWarriors = Math.round(matured * 0.25);
      const toCraftsmen = Math.round(matured * 0.30);
      const toWomen = matured - toWarriors - toCraftsmen;
      p.warriors = (p.warriors || 0) + toWarriors;
      p.craftsmen = (p.craftsmen || 0) + toCraftsmen;
      p.women = (p.women || 0) + toWomen;
    }

    // Adults retire into elders (~3% per year across all adult buckets).
    const retireFromBucket = (bucket) => {
      const n = p[bucket] || 0;
      const retired = Math.floor(n * 0.03);
      if (retired > 0) {
        p[bucket] = n - retired;
        p.elders = (p.elders || 0) + retired;
      }
    };
    retireFromBucket('warriors');
    retireFromBucket('craftsmen');
    retireFromBucket('women');

    return { ...f, population: p };
  });
}

/** Age head and notables by one year. */
function applyAnnualHeadAging(families) {
  return families.map((f) => {
    if (f.seceded) return f;
    return {
      ...f,
      head: { ...f.head, age: (f.head.age || 0) + 1 },
      notables: (f.notables || []).map((n) => ({ ...n, age: (n.age || 0) + 1 })),
    };
  });
}

/** Roll for old-head death. Returns { families, log: [text] }. */
function applyHeadDeathRoll(families) {
  const log = [];
  const next = families.map((f) => {
    if (f.seceded) return f;
    const age = f.head.age || 0;
    if (age < 60) return f;
    const chance = clamp((age - 60) * 0.04, 0, 0.5);
    if (Math.random() >= chance) return f;

    // Head dies. Find successor among notables (oldest adult).
    const notables = f.notables || [];
    const sorted = [...notables].sort((a, b) => (b.age || 0) - (a.age || 0));
    const successor = sorted[0];

    if (successor) {
      const newHead = {
        name: successor.name,
        age: successor.age,
        note: successor.role || 'heir of the house',
      };
      const remainingNotables = notables.filter((n) => n.name !== successor.name);
      log.push(
        `${f.head.name} is laid upon a pyre at the water's edge. ${successor.name} takes the head-seat of ${f.name}.`,
      );
      return { ...f, head: newHead, notables: remainingNotables };
    }

    // No notable — synthesize a generic heir.
    const fallback = { name: `An unnamed heir of ${f.name.replace('House of ', '')}`, age: 30, note: 'stepped forward from the ranks' };
    log.push(
      `${f.head.name} is laid upon a pyre. ${f.name} has no clear heir; the elders name a new voice by dawn.`,
    );
    return { ...f, head: fallback };
  });
  return { families: next, log };
}

// ---------------- Crisis detection ----------------

/**
 * If any non-seceded house is flirting with secession, return a crisis event.
 * Prefers the lowest-loyalty house.
 */
function checkSecessionCrisis(families) {
  const eligible = activeHouses(families)
    .filter((f) => f.loyalty < 20)
    .sort((a, b) => a.loyalty - b.loyalty);
  if (eligible.length === 0) return null;
  const f = eligible[0];
  return {
    id: `crisis_secession_${f.id}`,
    title: `${f.name.replace('House of ', 'House of ')} threatens to sail`,
    description: `${f.head.name} has drawn their people down to the water. ${f.ship} has been readied through the night. New Ilion, they say, is not what was promised. The tide runs out before sunrise.`,
    isCrisis: true,
    crisisFamilyId: f.id,
    choices: [
      {
        id: 'let_go',
        label: `Let them sail. ${f.ship} is theirs.`,
        crisisAction: 'let_secede',
      },
      {
        id: 'beg',
        label: 'Kneel on the sand. Offer gifts. Beg them to stay.',
        crisisAction: 'beg_stay',
        effects: { food: -18, faith: -3 },
      },
      {
        id: 'burn',
        label: `Burn ${f.ship} in the night. No one leaves.`,
        crisisAction: 'burn_ship',
        effects: { faith: -6 },
      },
    ],
  };
}

/**
 * If a house has ambition > 80 and influence greater than everyone else
 * combined, a coup attempt fires.
 */
function checkCoupCrisis(families) {
  const houses = activeHouses(families);
  for (const f of houses) {
    if (f.ambition <= 80) continue;
    const others = houses
      .filter((o) => o.id !== f.id)
      .reduce((s, o) => s + o.influence, 0);
    if (f.influence <= others) continue;

    return {
      id: `crisis_coup_${f.id}`,
      title: `${f.head.name} demands the crown`,
      description: `${f.head.name} has stood on the altar stone and called the council a mouthful of old men. ${f.name} demand that ${f.head.name} be hailed as king of New Ilion — and the other houses bend the knee.`,
      isCrisis: true,
      crisisFamilyId: f.id,
      choices: [
        {
          id: 'accept',
          label: `Hail ${f.head.name} king. Dissolve the council.`,
          crisisAction: 'accept_crown',
        },
        {
          id: 'resist',
          label: 'Refuse. Let them march out if they will not sit with us.',
          crisisAction: 'resist_coup',
        },
      ],
    };
  }
  return null;
}

// ---------------- End Day ----------------

function endDay(state) {
  if (state.activeEvent) return state;

  let next = { ...state };
  const prevDay = state.day;
  const nextDay = prevDay + 1;
  next.day = nextDay;

  // Season advance
  const dayInYear = (nextDay - 1) % DAYS_PER_YEAR;
  const nextSeasonIndex = Math.floor(dayInYear / DAYS_PER_SEASON) % SEASONS.length;
  if (nextSeasonIndex !== state.seasonIndex) {
    next.seasonIndex = nextSeasonIndex;
    log(next, `${SEASONS[nextSeasonIndex]} comes to the harbor.`);
  }
  const season = SEASONS[next.seasonIndex];

  // Year advance
  const prevYear = state.year || 1;
  const nextYear = Math.floor((nextDay - 1) / DAYS_PER_YEAR) + 1;
  const yearChanged = nextYear !== prevYear;
  if (yearChanged) {
    next.year = nextYear;
    log(next, `A new year turns. ${nextYear - 1} summers since the fall of Troy.`);
  }

  // Tick active crews per family
  next.families = [];
  for (const f of state.families) {
    if (f.seceded) {
      next.families.push(f);
      continue;
    }
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

    // Patronage: if this crew was dispatched on behalf of another house,
    // split the influence and grow the bond.
    const patronId = f.activeCrew.patronOf;
    let updatedFamily = {
      ...f,
      population: returnedPop,
      activeCrew: null,
      influence: f.influence + influenceGain,
    };

    if (patronId) {
      // Lending house gets +1 extra influence, bond toward receiving house.
      updatedFamily = {
        ...updatedFamily,
        influence: updatedFamily.influence + 1,
        relationships: addBond(updatedFamily, patronId, 8),
      };
      log(next, `${f.name} earns quiet prestige for the favor to ${patronId}.`);
    }
    next.families.push(updatedFamily);
  }

  // If this dispatch was a patronage, update the *receiving* house too.
  // Walk completed crews again to find patronOf credits.
  next.families = next.families.map((receiver) => {
    const credits = state.families.filter(
      (src) =>
        src.activeCrew &&
        src.activeCrew.patronOf === receiver.id &&
        src.activeCrew.daysRemaining === 1,
    );
    if (credits.length === 0) return receiver;
    let loyaltyDelta = 0;
    let newRel = receiver.relationships || {};
    for (const src of credits) {
      loyaltyDelta += 3;
      newRel = addBond({ relationships: newRel }, src.id, 10);
    }
    return {
      ...receiver,
      loyalty: Math.min(100, (receiver.loyalty || 0) + loyaltyDelta),
      relationships: newRel,
    };
  });

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

  // Consume food (1 per mouth per day; winter costs 20% more)
  const mouths = colonyPopulation(next.families);
  const winterMul = season === 'Winter' ? 1.2 : 1.0;
  const foodBurn = Math.round(mouths * winterMul);
  next.resources = addResources(next.resources || state.resources, { food: -foodBurn });
  if ((next.resources.food || 0) <= 0 && mouths > 0) {
    log(next, `The colony goes hungry. Stores are bare.`);
  }

  // Ambition tick — high ambition slowly erodes loyalty
  next.families = next.families.map((f) => {
    if (f.seceded) return f;
    if (f.ambition > 60) {
      return { ...f, loyalty: Math.max(0, f.loyalty - 1) };
    }
    if (!f.activeCrew && f.ambition > 0) {
      return { ...f, ambition: Math.max(0, f.ambition - 1) };
    }
    return f;
  });

  // Seasonal demographics
  if (nextSeasonIndex !== state.seasonIndex) {
    if (season === 'Spring') {
      const { families, log: births } = applySpringBirths(next.families);
      next.families = families;
      births.forEach((l) => log(next, l));
    } else if (season === 'Winter') {
      const { families, log: deaths } = applyWinterDeaths(next.families);
      next.families = families;
      deaths.forEach((l) => log(next, l));
    }
  }

  // Annual demographics + head aging + succession
  if (yearChanged) {
    next.families = applyAnnualAging(next.families);
    next.families = applyAnnualHeadAging(next.families);
    const { families, log: deaths } = applyHeadDeathRoll(next.families);
    next.families = families;
    deaths.forEach((l) => log(next, l));
  }

  // Crisis checks — these supersede normal events
  let crisis = checkCoupCrisis(next.families);
  if (!crisis) crisis = checkSecessionCrisis(next.families);
  if (crisis) {
    next.activeEvent = crisis;
    log(next, `Event: ${crisis.title}`);
    next.eventCooldown = 5;
    snapshotHistory(next);
    return next;
  }

  // Regular event roll
  next.eventCooldown = Math.max(0, (state.eventCooldown || 0) - 1);
  if (next.eventCooldown === 0 && !next.activeEvent) {
    if (Math.random() < 0.45) {
      // Harbor unlocks trade events at higher frequency.
      const hasHarbor = next.buildings.some((b) => b.id === 'harbor');
      const tradeBias = hasHarbor ? 0.5 : 0.15;
      const evt = (Math.random() < tradeBias ? pickTradeEvent() : null) || pickEvent();
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

const SAVE_KEY = 'lsot.save.v3'; // v3: years, notables, bronze, seceded, relationships
const OLD_SAVE_KEYS = ['lsot.save.v1', 'lsot.save.v2'];

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
    for (const k of OLD_SAVE_KEYS) {
      try { localStorage.removeItem(k); } catch {}
    }
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
