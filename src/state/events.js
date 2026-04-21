/**
 * Story events. Each event has a title, prose, optional illustration key,
 * and 2–3 choices. Choices apply effects (resources, colonist changes,
 * log lines) when selected.
 */

export const EVENTS = [
  {
    id: 'sail_on_horizon',
    title: 'A sail on the horizon',
    illustration: 'sail',
    description:
      'A dark sail cuts the wine-dark sea. The figures on deck are too distant to name. Helenus sees an omen of Athena in the gulls that wheel above.',
    choices: [
      {
        id: 'welcome',
        label: 'Hail them. Offer bread and salt.',
        effects: { food: -6 },
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
    title: "Athena's owl",
    illustration: 'owl',
    description:
      'At dusk an owl perches above the altar and stares unmoving into the priestess\'s eyes. No one dares speak. Cassandra murmurs that the goddess has not yet abandoned us.',
    choices: [
      {
        id: 'sacrifice',
        label: 'Offer grain and oil at the altar.',
        effects: { food: -3, faith: 4 },
        logLine: 'The sacrifice was accepted. The colony feels blessed.',
      },
      {
        id: 'carve',
        label: 'Carve the owl into the granary door as a sigil.',
        effects: { wood: -2, faith: 2 },
        logLine: 'The owl is carved into the granary. The children touch it for luck.',
      },
      {
        id: 'stare',
        label: 'Stare back. Do not bargain.',
        effects: { faith: -2 },
        logLine: 'The owl flew into the night. Some were uneasy.',
      },
    ],
  },
  {
    id: 'fever',
    title: 'A fever passes through the hearths',
    illustration: 'fever',
    description:
      'A sickness comes with the autumn winds. Andromache tends those it touches. Some whisper that Apollo is displeased.',
    choices: [
      {
        id: 'endure',
        label: 'Endure the sickness and bury our dead.',
        effects: { food: -4 },
        logLine: 'The fever passed. Three were buried beside the dunes.',
      },
      {
        id: 'herbs',
        label: 'Send Pandarus for herbs along the cliffs.',
        effects: { food: -2 },
        logLine: 'Pandarus returned with sea-fennel. The sick recovered quickly.',
      },
      {
        id: 'pray',
        label: 'Pray to Apollo and pour libations.',
        effects: { faith: -3 },
        logLine: 'The priestess emptied a jar into the sand. The fever broke by the third dawn.',
      },
    ],
  },
  {
    id: 'news_aeneas',
    title: 'News of Aeneas',
    illustration: 'ship',
    description:
      'A fisherman tells of a Trojan fleet that called at a harbor to the west, led by a man with shining armor and his old father on his back. Aeneas lives. He sails ever onward.',
    choices: [
      {
        id: 'raise_cup',
        label: 'Raise a cup to him and sing the song of Troy.',
        effects: { faith: 2 },
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
    illustration: 'stranger',
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
        },
        logLine: 'Iphitus joins the colony. He kneels before the shrine and weeps.',
      },
      {
        id: 'send_away',
        label: 'Give him bread and send him down the coast.',
        effects: { food: -2 },
        logLine: 'We sent him on with bread. Some say we will regret this.',
      },
    ],
  },
  {
    id: 'storm_at_sea',
    title: 'A storm over the bay',
    illustration: 'storm',
    description:
      "Black clouds pile against the hills. Lightning forks over the sea. The fishers' boats are still out.",
    choices: [
      {
        id: 'pray',
        label: 'Pray to Poseidon with libations of wine.',
        effects: { food: -1, faith: -1 },
        logLine: 'The storm broke before dawn. All boats returned.',
      },
      {
        id: 'brace',
        label: 'Brace the granary roof — save what we can.',
        effects: { wood: -3 },
        logLine: 'The granary held. Two boats were lost but all hands swam ashore.',
      },
    ],
  },
  {
    id: 'amber_trader',
    title: 'An amber trader walks the beach',
    illustration: 'trader',
    description:
      'A stranger in rough northern furs walks up the beach with a pouch of amber beads. He speaks only a few words of our tongue. He wants grain.',
    choices: [
      {
        id: 'trade',
        label: 'Trade grain for amber.',
        effects: { food: -5, faith: 3 },
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
  {
    id: 'cassandra_vision',
    title: "Cassandra's vision",
    illustration: 'vision',
    description:
      'At the evening meal Cassandra sets down her cup, her pupils wide. "I see a house of stone, and a hearth that burns for a hundred years." She will say no more.',
    choices: [
      {
        id: 'heed',
        label: 'Heed her. Begin the first stone of something great.',
        effects: { stone: -2, faith: 3 },
        logLine: 'The captain lays a foundation-stone with his own hands.',
      },
      {
        id: 'soothe',
        label: 'Soothe her. Take her to rest.',
        effects: { faith: -1 },
        logLine: 'The priestess led her away. She slept at last.',
      },
    ],
  },
];

// Track last to avoid immediate repeats
let _lastEventId = null;
export function pickEvent() {
  const candidates = EVENTS.filter((e) => e.id !== _lastEventId);
  const evt = candidates[Math.floor(Math.random() * candidates.length)];
  _lastEventId = evt.id;
  return evt;
}
