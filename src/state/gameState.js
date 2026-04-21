/**
 * Game state + reducer for The Last Sons of Troy.
 *
 * The game is click-driven: the player calls actions (DISPATCH, BUILD,
 * EXPLORE, RESOLVE_EVENT, END_DAY) and the reducer advances state. Time
 * only advances on END_DAY (or inside END_DAY as dispatched tasks tick).
 */

import { TASKS, resolveTask, taskDuration } from './tasks.js';
import { BUILDINGS, canAfford, payCost } from './buildings.js';
import { LOCATIONS, getUndiscoveredLocations } from './locations.js';
import { pickEvent } from './events.js';
import { newId } from './names.js';

export const SEASONS = ['Spring', 'Summer', 'Autumn', 'Winter'];
const DAYS_PER_SEASON = 12;

// ---------------- Initial state ----------------

const FOUNDERS = [
  { name: 'Helenus of Ilion',    origin: 'Born in Troy',        traits: ['Seer-touched', 'Pious'] },
  { name: 'Andromache',          origin: 'Born in Troy',        traits: ['Grieving', 'Temperate'] },
  { name: 'Pandarus the Archer', origin: 'A Lycian ally of the king', traits: ['Swift-footed', 'Scarred'] },
  { name: 'Cassandra',           origin: 'Born in Troy',        traits: ['Seer-touched', 'Dreamer'] },
  { name: 'Dymas of Dardania',   origin: 'Born in Dardania',    traits: ['Ox-strong', 'Fierce'] },
];

export function createInitialState() {
  return {
    colonyName: 'New Ilion',
    day: 1,
    seasonIndex: 0,
    resources: { food: 30, wood: 12, stone: 6, faith: 2, pottery: 0 },
    colonists: FOUNDERS.map((f) => ({
      id: newId('c'),
      name: f.name,
      origin: f.origin,
      traits: f.traits,
      status: 'idle',
      currentTask: null,
      taskDaysRemaining: 0,
      taskResult: null,  // temporary, used to surface completion to UI
    })),
    buildings: [],              // completed buildings
    construction: [],           // under-construction, ticks down with days
    locations: LOCATIONS.map((l) => ({ ...l })),
    chronicle: [
      {
        day: 1,
        season: SEASONS[0],
        text: 'The Trojan ship grounds on the beach. Smoke of Ilium fades astern.',
      },
      {
        day: 1,
        season: SEASONS[0],
        text: 'Our captain steps ashore and names this place New Ilion.',
      },
    ],
    history: [
      {
        day: 1,
        food: 30, wood: 12, stone: 6, faith: 2, pottery: 0,
        colonists: FOUNDERS.length,
      },
    ],
    activeEvent: null,
    eventCooldown: 2,           // days until next event eligibility
    lastEventChoiceLog: null,
  };
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
  if (state.chronicle.length > 200) state.chronicle.length = 200;
}

function snapshotHistory(state) {
  const entry = {
    day: state.day,
    food: Math.round(state.resources.food || 0),
    wood: Math.round(state.resources.wood || 0),
    stone: Math.round(state.resources.stone || 0),
    faith: Math.round(state.resources.faith || 0),
    pottery: Math.round(state.resources.pottery || 0),
    colonists: state.colonists.length,
  };
  const existing = state.history || [];
  const last = existing[existing.length - 1];
  // Replace if same day (helps when same-day actions compound), else append
  if (last && last.day === entry.day) {
    state.history = [...existing.slice(0, -1), entry];
  } else {
    state.history = [...existing, entry];
  }
  if (state.history.length > 120) {
    state.history = state.history.slice(-120);
  }
}

function idleColonists(state) {
  return state.colonists.filter((c) => c.status === 'idle');
}

function addResources(resources, delta) {
  const out = { ...resources };
  for (const [k, v] of Object.entries(delta || {})) {
    out[k] = Math.max(0, (out[k] || 0) + v);
  }
  return out;
}

// ---------------- Reducer ----------------

export function reducer(state, action) {
  switch (action.type) {
    case 'DISPATCH':        return dispatch(state, action);
    case 'BUILD':           return build(state, action);
    case 'EXPLORE_LOCATION': return exploreLocation(state, action);
    case 'RESOLVE_EVENT':   return resolveEvent(state, action);
    case 'END_DAY':         return endDay(state);
    case 'LOAD':            return action.state;
    default: return state;
  }
}

function dispatch(state, { colonistId, taskId }) {
  const task = TASKS[taskId];
  if (!task) return state;
  const idx = state.colonists.findIndex((c) => c.id === colonistId);
  if (idx === -1) return state;
  const c = state.colonists[idx];
  if (c.status !== 'idle') return state;

  const days = taskDuration(task, c);
  const next = { ...state, colonists: [...state.colonists] };
  next.colonists[idx] = {
    ...c,
    status: task.id === 'scout' ? 'scouting' : 'working',
    currentTask: task.id,
    taskDaysRemaining: days,
  };
  log(next, `${c.name} sets out to ${task.label.toLowerCase()}.`);
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
  if (!loc.discovered) return state;
  if (loc.visited) return state;

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

  let next = { ...state };
  if (choice.effects) {
    next.resources = addResources(state.resources, choice.effects);
  }
  if (choice.addColonist) {
    next.colonists = [
      ...state.colonists,
      {
        id: newId('c'),
        name: choice.addColonist.name,
        origin: choice.addColonist.origin,
        traits: choice.addColonist.traits || [],
        status: 'idle',
        currentTask: null,
        taskDaysRemaining: 0,
      },
    ];
  }

  next.activeEvent = null;
  next.lastEventChoiceLog = choice.logLine;
  if (choice.logLine) log(next, choice.logLine);

  // Reset cooldown so the player isn't hit instantly again
  next.eventCooldown = 3;
  return next;
}

function endDay(state) {
  if (state.activeEvent) return state; // must resolve event first

  let next = { ...state };
  next.day = state.day + 1;
  // Season advance
  const dayInYear = (state.day) % (DAYS_PER_SEASON * SEASONS.length);
  const nextSeasonIndex = Math.floor(dayInYear / DAYS_PER_SEASON) % SEASONS.length;
  if (nextSeasonIndex !== state.seasonIndex) {
    next.seasonIndex = nextSeasonIndex;
    log(next, `${SEASONS[nextSeasonIndex]} comes to the harbor.`);
  }

  const season = SEASONS[next.seasonIndex];

  // Tick colonists
  next.colonists = [];
  for (const c of state.colonists) {
    if (c.status === 'idle' || c.taskDaysRemaining <= 0) {
      next.colonists.push(c);
      continue;
    }
    const remaining = c.taskDaysRemaining - 1;
    if (remaining > 0) {
      next.colonists.push({ ...c, taskDaysRemaining: remaining });
    } else {
      // Task completes
      const task = TASKS[c.currentTask];
      const undiscovered = getUndiscoveredLocations(next.locations);
      const { yields, discovered, line } = resolveTask(task, c, {
        season,
        undiscoveredLocations: undiscovered,
      });
      if (yields && Object.keys(yields).length) {
        next.resources = addResources(next.resources, yields);
      }
      if (discovered) {
        const i = next.locations.findIndex((l) => l.id === discovered.id);
        if (i !== -1) {
          next.locations = [...next.locations];
          next.locations[i] = { ...next.locations[i], discovered: true };
        }
      }
      log(next, line);
      next.colonists.push({
        ...c,
        status: 'idle',
        currentTask: null,
        taskDaysRemaining: 0,
      });
    }
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
        next.buildings = [...(next.buildings || []), { id: b.id }];
        log(next, b.completeLine);
      }
    }
  }

  // Consume food (1 per colonist per day)
  const mouths = next.colonists.length;
  const foodEaten = mouths;
  next.resources = addResources(next.resources, { food: -foodEaten });
  if (next.resources.food <= 0 && mouths > 0) {
    log(next, `The colony goes hungry. The granary is bare.`);
  }

  // Event roll
  next.eventCooldown = Math.max(0, (state.eventCooldown || 0) - 1);
  if (next.eventCooldown === 0 && !next.activeEvent) {
    if (Math.random() < 0.45) {
      const evt = pickEvent();
      next.activeEvent = evt;
      log(next, `Event: ${evt.title}`);
      next.eventCooldown = 4; // small floor so nothing fires next turn
    } else {
      next.eventCooldown = 1;
    }
  }

  snapshotHistory(next);
  return next;
}

// ---------------- Persistence ----------------

const SAVE_KEY = 'lsot.save.v1';

export function saveState(state) {
  try {
    const cleaned = { ...state, activeEvent: null }; // don't persist mid-event
    localStorage.setItem(SAVE_KEY, JSON.stringify(cleaned));
    return true;
  } catch {
    return false;
  }
}

export function loadState() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const loaded = JSON.parse(raw);
    // Back-fill for saves created before resource history was tracked.
    if (!loaded.history || loaded.history.length === 0) {
      loaded.history = [
        {
          day: loaded.day || 1,
          food: Math.round(loaded.resources?.food || 0),
          wood: Math.round(loaded.resources?.wood || 0),
          stone: Math.round(loaded.resources?.stone || 0),
          faith: Math.round(loaded.resources?.faith || 0),
          pottery: Math.round(loaded.resources?.pottery || 0),
          colonists: (loaded.colonists || []).length,
        },
      ];
    }
    return loaded;
  } catch {
    return null;
  }
}

export function clearSave() {
  try { localStorage.removeItem(SAVE_KEY); } catch {}
}
