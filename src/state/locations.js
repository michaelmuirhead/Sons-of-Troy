/**
 * Discoverable locations along the coast. The starting location is always
 * "The beach" (discovered). Others are revealed by scouting.
 *
 * Phase 0: discovery unlocks flavor + a small one-time yield. Phase 1+ will
 * layer real interactions (trade, settle, raid, ally).
 */

export const LOCATIONS = [
  {
    id: 'beach',
    name: 'The beach of New Ilion',
    discovered: true,
    description: 'Where our ship was beached. The camp is here. The sea is always within sight.',
    oneTimeYield: null,
  },
  {
    id: 'olive_cove',
    name: 'Cove of Olives',
    discovered: false,
    description:
      'A sheltered cove where wild olive trees lean over the water. The fruit is black and bitter, but food nonetheless.',
    oneTimeYield: { food: 12 },
  },
  {
    id: 'ruined_shrine',
    name: 'A ruined shrine in the hills',
    discovered: false,
    description:
      'An older people worshipped here. Moss grows on a fallen column. The priestess trembles at its door.',
    oneTimeYield: { faith: 4, stone: 6 },
  },
  {
    id: 'distant_hearth',
    name: 'A column of distant hearth-smoke',
    discovered: false,
    description:
      'Across a shallow valley, smoke rises from many fires. Another people — perhaps a village — lives within a day\'s walk.',
    oneTimeYield: null,
    unlocksDiplomacy: true,
  },
  {
    id: 'salt_marsh',
    name: 'A salt marsh and reed beds',
    discovered: false,
    description:
      'Reeds taller than a man. Eels in the muck. A useful place for thatch and for fishing in a dry summer.',
    oneTimeYield: { food: 6, wood: 4 },
  },
  {
    id: 'wrecked_ship',
    name: 'A wrecked ship on the rocks',
    discovered: false,
    description:
      'A broken keel half-buried in sand. Bronze rivets, a carved figurehead of a mare. Salvage enough to be worth the trip.',
    oneTimeYield: { wood: 14, stone: 0 },
  },
  {
    id: 'hidden_spring',
    name: 'A hidden spring under laurel',
    discovered: false,
    description:
      'Cold water, clean as silver, welling from under a laurel tree. Cassandra calls the spot sacred.',
    oneTimeYield: { faith: 3 },
  },
];

export function getUndiscoveredLocations(locations) {
  return locations.filter((l) => !l.discovered);
}
