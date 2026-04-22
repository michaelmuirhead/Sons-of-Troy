/**
 * Dispatchable tasks. A task is done by a *crew* drawn from a single family.
 *
 * - `base` is the yield per crew member (scaled linearly by crew size)
 * - `days` is the base duration; crews beyond a threshold reduce it modestly
 * - `warriorsOnly: true` means the crew must be warriors (scouting, raiding)
 * - `influenceReward` is the prestige the family earns on completion, times
 *   specialization bonus
 */

export const TASKS = {
  forage: {
    id: 'forage',
    label: 'Forage the hillside',
    description: 'Gather acorns, roots, and wild fennel in the scrub above the beach.',
    days: 2,
    base: { food: 3 },
    seasonYield: { Spring: 1.2, Summer: 1.0, Autumn: 1.3, Winter: 0.6 },
    warriorsOnly: false,
    influenceReward: 1,
    completeLine: (family, crew, y) =>
      `A foraging party of ${crew} from ${family.name} returns with ${y.food} measures of food.`,
  },

  fell: {
    id: 'fell',
    label: 'Fell the oak grove',
    description: 'Take axes to the oak grove behind the dunes.',
    days: 3,
    base: { wood: 4 },
    warriorsOnly: false,
    influenceReward: 1.5,
    completeLine: (family, crew, y) =>
      `${family.name} drags ${y.wood} logs of oak down to the camp.`,
  },

  quarry: {
    id: 'quarry',
    label: 'Quarry the outcrop',
    description: 'Work the stone outcrops on the headland with hammer and wedge.',
    days: 3,
    base: { stone: 3 },
    warriorsOnly: false,
    influenceReward: 1.5,
    completeLine: (family, crew, y) =>
      `${family.name} returns pale with dust, dragging stone-sledges — ${y.stone} blocks.`,
  },

  fish: {
    id: 'fish',
    label: 'Fish the bay',
    description: 'Launch reed boats into the morning bay.',
    days: 2,
    base: { food: 2.5 },
    seasonYield: { Spring: 1.1, Summer: 1.0, Autumn: 1.0, Winter: 0.7 },
    warriorsOnly: false,
    influenceReward: 1,
    completeLine: (family, crew, y) =>
      `The boats of ${family.name} beach heavy with silver — ${y.food} measures of fish.`,
  },

  tend: {
    id: 'tend',
    label: 'Tend the altars',
    description: 'Keep the fires of household and colony. Pour libations.',
    days: 2,
    base: { faith: 1.2 },
    warriorsOnly: false,
    influenceReward: 1.5,
    completeLine: (family, crew, y) =>
      `${family.name} tends the altars through the watch. The flames burn clean. +${y.faith} faith.`,
  },

  scout: {
    id: 'scout',
    label: 'Scout the coast',
    description: 'Walk the cliffs and headlands. Only warriors may be sent.',
    days: 4,
    base: {},
    warriorsOnly: true,
    discoversLocation: true,
    influenceReward: 2,
    completeLine: (family, crew, discovered) =>
      discovered
        ? `Scouts of ${family.name} return with news of ${discovered.name} — ${discovered.description}`
        : `Scouts of ${family.name} walk home weary. The coast has no new secret tonight.`,
  },
};

/* --------------------------------------------------------------------- */
/* Resolution                                                             */
/* --------------------------------------------------------------------- */

/**
 * Resolve a dispatched crew's task. Returns:
 *   { yields, discovered, line, influenceGain, specBonus, crew }
 */
export function resolveTask(task, family, crew, { season, undiscoveredLocations } = {}) {
  const specBonus = family.preferredTasks.includes(task.id) ? 1.5 : 1.0;
  const seasonMul = (task.seasonYield && task.seasonYield[season]) || 1;

  // Yield per crew member, scaled by crew size, season, and specialization.
  const yields = {};
  for (const [k, v] of Object.entries(task.base || {})) {
    const raw = v * crew * seasonMul * specBonus;
    yields[k] = Math.max(1, Math.round(raw));
  }

  // Scout discovery
  let discovered = null;
  if (task.discoversLocation && undiscoveredLocations?.length) {
    // Bigger scout parties are more likely to find something (cap at 90%)
    const findChance = Math.min(0.9, 0.35 + 0.12 * crew + (specBonus - 1) * 0.5);
    if (Math.random() < findChance) {
      discovered = undiscoveredLocations[
        Math.floor(Math.random() * undiscoveredLocations.length)
      ];
    }
  }

  const influenceGain = (task.influenceReward || 1) * specBonus;

  const line = task.completeLine
    ? task.discoversLocation
      ? task.completeLine(family, crew, discovered)
      : task.completeLine(family, crew, yields)
    : `${family.name} finishes the task.`;

  return { yields, discovered, line, influenceGain, specBonus, crew };
}

/**
 * Duration for a task. Larger crews finish a little faster; specialization
 * shaves another day. Floor at 1 day.
 */
export function taskDuration(task, family, crew) {
  let d = task.days;
  if (crew >= 6) d -= 1;
  if (crew >= 12) d -= 1;
  if (family.preferredTasks.includes(task.id)) d -= 1;
  return Math.max(1, d);
}
