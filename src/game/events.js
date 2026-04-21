/**
 * Story events — small Trojan-flavored interruptions.
 *
 * Each event has an id, title, prose description, and 2–3 choices with
 * mechanical effects. The ColonyScene rolls for these on a fixed cadence.
 */

export const EVENT_POOL = [
  {
    id: 'sail_on_horizon',
    title: 'A sail on the horizon',
    description:
      'A dark sail cuts the wine-dark sea. The figures on deck are too distant to name. Helenus sees an omen of Athena in the gulls that wheel above.',
    choices: [
      {
        id: 'welcome',
        label: 'Hail them from the shore — offer bread and salt.',
        effects: { food: -8 },
        logLine: 'We welcomed the strangers. They ate our bread and sailed on at dawn.',
      },
      {
        id: 'hide',
        label: 'Douse the fires. Let New Ilion be invisible tonight.',
        effects: {},
        logLine: 'We hid in the dunes until their sail vanished into dusk.',
      },
    ],
  },
  {
    id: 'athena_owl',
    title: "Athena's owl in the olive tree",
    description:
      'At dusk an owl perches above the shrine and stares unmoving into the priestess\'s eyes. No one dares speak. Cassandra murmurs that the goddess has not yet abandoned us.',
    choices: [
      {
        id: 'sacrifice',
        label: 'Offer grain and oil at the altar.',
        effects: { food: -4 },
        logLine: 'The sacrifice was accepted. The colony feels blessed.',
      },
      {
        id: 'carve',
        label: 'Carve the owl into the granary door as a sigil.',
        effects: { wood: -2 },
        logLine: 'The owl is carved into the granary. The children touch it for luck.',
      },
    ],
  },
  {
    id: 'fever',
    title: 'A fever passes through the hearths',
    description:
      'A sickness comes with the autumn winds. Andromache tends those it touches. Some whisper that Apollo is displeased.',
    choices: [
      {
        id: 'endure',
        label: 'Endure the sickness and bury our dead.',
        effects: { food: -6 },
        logLine: 'The fever passed. Three laid to rest beside the dunes.',
      },
      {
        id: 'herbs',
        label: 'Send Pandarus for herbs along the cliffs.',
        effects: { food: -2 },
        logLine: 'Pandarus returned with sea-fennel. The sick recovered quickly.',
      },
    ],
  },
  {
    id: 'news_aeneas',
    title: 'News of Aeneas',
    description:
      'A fisherman tells of a Trojan fleet that called at a harbor to the west, led by a man with a shining armor and his old father on his back. Aeneas lives. He sails ever onward.',
    choices: [
      {
        id: 'raise_cup',
        label: 'Raise a cup to him and sing the song of Troy.',
        effects: {},
        logLine: 'We sang the old songs and remembered the high towers of Ilium.',
      },
      {
        id: 'silent',
        label: 'Say nothing. We have our own road now.',
        effects: {},
        logLine: 'The captain let the news pass like wind over grass.',
      },
    ],
  },
  {
    id: 'dardanian_stranger',
    title: 'Stranger claiming Dardanian blood',
    description:
      'A lean man crests the hill at evening, weary, carrying a bronze knife and nothing else. He says his mother was of Dardania and he has walked a long road to find other Trojans.',
    choices: [
      {
        id: 'welcome',
        label: 'Take him in. There are too few of us as it is.',
        addColonist: {
          name: 'Iphitus the Walker',
          origin: 'Born in Dardania',
          traits: ['Scarred', 'Swift-footed'],
          job: 'woodcutter',
        },
        logLine: 'Iphitus joins the colony. He kneels before the shrine and weeps.',
      },
      {
        id: 'send_away',
        label: 'Give him bread and send him down the coast.',
        effects: { food: -3 },
        logLine: 'We sent him on with bread. Some say we will regret this.',
      },
    ],
  },
  {
    id: 'storm_at_sea',
    title: 'A storm over the bay',
    description:
      "Black clouds pile against the hills. Lightning forks over the sea. The fishers' boats are still out.",
    choices: [
      {
        id: 'pray',
        label: 'Pray to Poseidon with libations of wine.',
        effects: { food: -2 },
        logLine: 'The storm broke before dawn. All boats returned.',
      },
      {
        id: 'brace',
        label: 'Brace the granary roof — save what we can.',
        effects: { wood: -4 },
        logLine: 'The granary held. Two boats were lost but all hands swam ashore.',
      },
    ],
  },
  {
    id: 'amber_trader',
    title: 'An amber trader walks the beach',
    description:
      'A stranger in rough northern furs walks up the beach with a pouch of amber beads. He speaks only a few words of our tongue. He wants grain.',
    choices: [
      {
        id: 'trade',
        label: 'Trade grain for amber — the priestess asks for it.',
        effects: { food: -6, pottery: 0 },
        logLine: 'Amber beads are added to the shrine of Athena.',
      },
      {
        id: 'decline',
        label: 'Send him on. We need our grain.',
        effects: {},
        logLine: 'The trader left, calling us graceless in his own tongue.',
      },
    ],
  },
];

// Simple weighted picker that avoids firing the same event twice in a row
let lastEventId = null;
export function pickEvent() {
  const candidates = EVENT_POOL.filter((e) => e.id !== lastEventId);
  const evt = candidates[Math.floor(Math.random() * candidates.length)];
  lastEventId = evt.id;
  return evt;
}
