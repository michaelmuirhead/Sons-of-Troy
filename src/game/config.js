/**
 * Central palette + game constants. Colors match Greek pottery references.
 * Kept as hex numbers (Phaser convention) and string hex (CSS convention).
 */

export const PALETTE = {
  terracotta: 0xc44536,
  ochre: 0xe07a5f,
  black: 0x1a1a1a,
  cream: 0xf4ecd8,
  parchment: 0xe8d5b7,
  aegean: 0x2e5c8a,
  olive: 0x6b7a3a,
  darkOlive: 0x4c5a29,
  wheatGold: 0xd4a84b,
  stoneGrey: 0x8a857a,
  border: 0x3d2b1f,
};

export const PALETTE_HEX = Object.fromEntries(
  Object.entries(PALETTE).map(([k, v]) => [k, '#' + v.toString(16).padStart(6, '0')])
);

export const GAME_WIDTH = 960;
export const GAME_HEIGHT = 640;

export const TILE = 32;

// Resource node types used in ColonyScene
export const RESOURCE = {
  WHEAT: 'wheat',
  OAK: 'oak',
  STONE: 'stone',
  FISH: 'fish',
  OLIVE: 'olive',
};

// Map resource type → which job harvests it
export const RESOURCE_JOB = {
  [RESOURCE.WHEAT]: 'farmer',
  [RESOURCE.OAK]: 'woodcutter',
  [RESOURCE.STONE]: 'quarryman',
  [RESOURCE.FISH]: 'fisher',
  [RESOURCE.OLIVE]: 'farmer',
};

// What gets added to the colony stockpile when a node is harvested
export const RESOURCE_YIELD = {
  [RESOURCE.WHEAT]: { food: 12 },
  [RESOURCE.OAK]: { wood: 10 },
  [RESOURCE.STONE]: { stone: 8 },
  [RESOURCE.FISH]: { food: 8 },
  [RESOURCE.OLIVE]: { food: 6 },
};

// Seasons cycle every 60 seconds for the prototype
export const SEASON_LENGTH_MS = 60_000;
export const SEASONS = ['Spring', 'Summer', 'Autumn', 'Winter'];

// How often to roll for a story event
export const EVENT_ROLL_INTERVAL_MS = 45_000;
export const EVENT_CHANCE = 0.55;
