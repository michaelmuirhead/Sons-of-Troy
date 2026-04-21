/**
 * Dispatchable tasks. Each task has a duration in days, a base yield, and
 * optional trait modifiers that change the prose and output when the task
 * completes.
 */

export const TASKS = {
  forage: {
    id: 'forage',
    label: 'Forage the hillside',
    description: 'Gather acorns, roots, and wild fennel in the scrub above the beach.',
    days: 1,
    base: { food: 6 },
    seasonYield: { Spring: 1.2, Summer: 1.0, Autumn: 1.3, Winter: 0.6 },
    traitBonus: {
      'Swift-footed': { food: 2 },
      'Sea-wary':     { food: 0 },
    },
    completeLine: (c, y) =>
      `${c.name} returns from the hillside with ${y.food} measures of food.`,
  },

  fell: {
    id: 'fell',
    label: 'Fell an oak',
    description: 'Take an axe to the oak grove behind the dunes.',
    days: 2,
    base: { wood: 8 },
    traitBonus: {
      'Ox-strong':   { wood: 4 },
      'Swift-footed': { wood: 1 },
    },
    completeLine: (c, y) =>
      `${c.name} drags a bundle of oak to the camp — ${y.wood} logs.`,
  },

  quarry: {
    id: 'quarry',
    label: 'Quarry the outcrop',
    description: 'Work the stone outcrops on the headland with hammer and wedge.',
    days: 2,
    base: { stone: 6 },
    traitBonus: {
      'Ox-strong':   { stone: 3 },
    },
    completeLine: (c, y) =>
      `${c.name} returns pale with dust, leading a stone-sledge. ${y.stone} blocks.`,
  },

  fish: {
    id: 'fish',
    label: 'Fish the bay',
    description: 'Launch the little reed boat and cast nets into the morning bay.',
    days: 1,
    base: { food: 5 },
    seasonYield: { Spring: 1.1, Summer: 1.0, Autumn: 1.0, Winter: 0.7 },
    traitBonus: {
      'Sea-wary':    { food: 3 },
    },
    completeLine: (c, y) =>
      `${c.name} beaches the reed boat heavy with silver. ${y.food} measures of fish.`,
  },

  tend: {
    id: 'tend',
    label: "Tend the Shrine of Athena",
    description: 'Keep the altar fire. Pour libations. Listen for the goddess.',
    days: 1,
    base: { faith: 2 },
    traitBonus: {
      'Pious':        { faith: 2 },
      'Seer-touched': { faith: 1 },
    },
    completeLine: (c, y) =>
      `${c.name} rises from the altar at dusk. The flame burned clean. +${y.faith} faith.`,
  },

  scout: {
    id: 'scout',
    label: 'Scout the coast',
    description: 'Walk the cliffs and headlands to map the land around New Ilion.',
    days: 3,
    base: {},
    discoversLocation: true,
    traitBonus: {
      'Swift-footed': { daysDelta: -1 },
      'Dreamer':      {},
    },
    completeLine: (c, discovered) =>
      discovered
        ? `${c.name} returns with news of ${discovered.name} — ${discovered.description}`
        : `${c.name} walks home weary. The coast has no new secret to reveal.`,
  },
};

/**
 * Resolve a dispatched task for a colonist. Returns { yields, discovered, line }.
 */
export function resolveTask(task, colonist, { season, undiscoveredLocations } = {}) {
  const yields = { ...task.base };
  const seasonMul = (task.seasonYield && task.seasonYield[season]) || 1;
  for (const k of Object.keys(yields)) {
    yields[k] = Math.round(yields[k] * seasonMul);
  }

  // Apply trait bonuses
  for (const trait of colonist.traits || []) {
    const bonus = task.traitBonus?.[trait];
    if (!bonus) continue;
    for (const [k, v] of Object.entries(bonus)) {
      if (k === 'daysDelta') continue;
      yields[k] = (yields[k] || 0) + v;
    }
  }

  // Scout discoveries
  let discovered = null;
  if (task.discoversLocation && undiscoveredLocations?.length) {
    discovered = undiscoveredLocations[Math.floor(Math.random() * undiscoveredLocations.length)];
  }

  const line = task.completeLine
    ? task.discoversLocation
      ? task.completeLine(colonist, discovered)
      : task.completeLine(colonist, yields)
    : `${colonist.name} finishes the task.`;

  return { yields, discovered, line };
}

/**
 * Duration for a task with colonist trait modifiers applied.
 */
export function taskDuration(task, colonist) {
  let d = task.days;
  for (const trait of colonist.traits || []) {
    const bonus = task.traitBonus?.[trait];
    if (bonus?.daysDelta) d += bonus.daysDelta;
  }
  return Math.max(1, d);
}
