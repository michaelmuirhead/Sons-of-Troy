/**
 * Buildings the player can construct. Each has a cost, a build time, and
 * an effect applied once complete. Buildings are unique in Phase 0 —
 * one of each at most.
 */

export const BUILDINGS = {
  granary: {
    id: 'granary',
    label: 'Granary',
    description:
      'A stone-footed hut with pithoi and sealed bins. Stores more food and blunts winter loss.',
    cost: { wood: 12, stone: 6 },
    days: 4,
    effects: {
      foodCapBonus: 60,
      foodWinterLossReduction: 0.5,
    },
    completeLine: 'The Granary stands. The captain pours the first measure into its jar.',
  },

  shrine: {
    id: 'shrine',
    label: 'Shrine of Athena',
    description:
      'Two columns, a pediment, an altar. The priestess inscribes an olive-branch in the wet clay.',
    cost: { wood: 6, stone: 10 },
    days: 5,
    effects: {
      unlockTask: 'tend',
      faithPerDay: 0.2,
    },
    completeLine: "The Shrine of Athena is complete. The colony bows its head at dusk.",
  },

  palisade: {
    id: 'palisade',
    label: 'Palisade wall',
    description:
      'A ring of oak stakes around the camp. Not proud, but proud enough to turn away raiders.',
    cost: { wood: 20, stone: 2 },
    days: 6,
    effects: {
      defense: 2,
    },
    completeLine: 'The Palisade is finished. The sentries climb to their first watch.',
  },

  kiln: {
    id: 'kiln',
    label: 'Pottery kiln',
    description:
      'A low domed kiln of clay. The first jars come out red as sunset.',
    cost: { wood: 6, stone: 8 },
    days: 4,
    effects: {
      unlockTask: 'potter',
      potteryPerDay: 0.5,
    },
    completeLine: 'The Kiln breathes its first smoke. The first jars are inscribed with owls.',
  },

  longhouse: {
    id: 'longhouse',
    label: 'Longhouse',
    description:
      'A long hall of oak and thatch where the colony eats together. Draws in more settlers.',
    cost: { wood: 18, stone: 4 },
    days: 6,
    effects: {
      colonistCapBonus: 4,
      moraleBonus: 1,
    },
    completeLine: 'The Longhouse is raised. The first meal within it runs late into the night.',
  },
};

export function canAfford(resources, cost) {
  for (const [k, v] of Object.entries(cost)) {
    if ((resources[k] || 0) < v) return false;
  }
  return true;
}

export function payCost(resources, cost) {
  const next = { ...resources };
  for (const [k, v] of Object.entries(cost)) {
    next[k] = (next[k] || 0) - v;
  }
  return next;
}
