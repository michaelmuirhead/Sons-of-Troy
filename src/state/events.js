/**
 * Story events. Each event has a title, prose, and 2–3 choices. Choices
 * apply effects (resources, colonist changes, log lines) when selected.
 *
 * Every choice now carries `tags` drawn from the stance vocabulary
 * (pious, cautious, bold, welcoming, traditional, wrathful, wise).
 * Families vote for the choice that best matches their own stance.
 *
 * Trade events (tagged trade: true) fire more often when a harbor is built
 * and shuttle pottery ↔ bronze ↔ amber ↔ grain.
 */

export const EVENTS = [
  {
    id: 'sail_on_horizon',
    title: 'A sail on the horizon',
    description:
      'A dark sail cuts the wine-dark sea. The figures on deck are too distant to name. The gulls wheel above like an omen.',
    choices: [
      {
        id: 'welcome',
        label: 'Hail them. Offer bread and salt.',
        tags: ['welcoming', 'bold'],
        effects: { food: -6 },
        logLine: 'We welcomed the strangers. They ate our bread and sailed on at dawn.',
      },
      {
        id: 'hide',
        label: 'Douse the fires. Let New Ilion be invisible tonight.',
        tags: ['cautious', 'traditional'],
        effects: {},
        logLine: 'We hid in the dunes until their sail vanished into dusk.',
      },
    ],
  },

  {
    id: 'athena_owl',
    title: "Athena's owl",
    description:
      "At dusk an owl perches above the altar and stares unmoving. No one dares speak. The priestess murmurs that the goddess has not yet abandoned us.",
    choices: [
      {
        id: 'sacrifice',
        label: 'Offer grain and oil at the altar.',
        tags: ['pious', 'traditional'],
        effects: { food: -3, faith: 4 },
        logLine: 'The sacrifice was accepted. The colony feels blessed.',
      },
      {
        id: 'carve',
        label: 'Carve the owl into the granary door as a sigil.',
        tags: ['wise', 'pious'],
        effects: { wood: -2, faith: 2 },
        logLine: 'The owl is carved into the granary. The children touch it for luck.',
      },
      {
        id: 'stare',
        label: 'Stare back. Do not bargain.',
        tags: ['bold', 'wrathful'],
        effects: { faith: -2 },
        logLine: 'The owl flew into the night. Some were uneasy.',
      },
    ],
  },

  {
    id: 'fever',
    title: 'A fever passes through the hearths',
    description:
      'A sickness comes with the autumn winds. It touches the lower tents first. Some whisper that Apollo is displeased.',
    choices: [
      {
        id: 'endure',
        label: 'Endure the sickness and bury our dead.',
        tags: ['traditional', 'wrathful'],
        effects: { food: -4 },
        logLine: 'The fever passed. Three were buried beside the dunes.',
      },
      {
        id: 'herbs',
        label: 'Send scouts for sea-fennel along the cliffs.',
        tags: ['bold', 'wise'],
        effects: { food: -2 },
        logLine: 'The scouts returned with sea-fennel. The sick recovered quickly.',
      },
      {
        id: 'pray',
        label: 'Pray to Apollo and pour libations.',
        tags: ['pious', 'cautious'],
        effects: { faith: -3 },
        logLine: 'A jar was emptied into the sand. The fever broke by the third dawn.',
      },
    ],
  },

  {
    id: 'news_aeneas',
    title: 'News of Aeneas',
    description:
      'A fisherman tells of a Trojan fleet that called at a harbor to the west, led by a man with shining armor and his old father on his back. Aeneas lives. He sails ever onward.',
    choices: [
      {
        id: 'raise_cup',
        label: 'Raise a cup to him and sing the songs of Troy.',
        tags: ['pious', 'traditional'],
        effects: { faith: 2 },
        logLine: 'We sang the old songs and remembered the high towers of Ilium.',
      },
      {
        id: 'silent',
        label: 'Say nothing. We have our own road now.',
        tags: ['bold', 'wrathful'],
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
        tags: ['welcoming', 'wise'],
        joinsFamily: 'capys',
        logLine: 'Iphitus joins the colony under the banner of House Capys. He kneels before the shrine and weeps.',
      },
      {
        id: 'send_away',
        label: 'Give him bread and send him down the coast.',
        tags: ['cautious', 'traditional'],
        effects: { food: -2 },
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
        tags: ['pious'],
        effects: { food: -1, faith: -1 },
        logLine: 'The storm broke before dawn. All boats returned.',
      },
      {
        id: 'brace',
        label: 'Brace the granary roof — save what we can.',
        tags: ['cautious', 'wise'],
        effects: { wood: -3 },
        logLine: 'The granary held. Two boats were lost but all hands swam ashore.',
      },
    ],
  },

  {
    id: 'cassandra_vision',
    title: "A vision in the evening fire",
    description:
      'At the evening meal the priestess sets down her cup, pupils wide. "I see a house of stone, and a hearth that burns for a hundred years." She will say no more.',
    choices: [
      {
        id: 'heed',
        label: 'Heed her. Lay the foundation stone of something great.',
        tags: ['pious', 'bold'],
        effects: { stone: -2, faith: 3 },
        logLine: 'The captain lays a foundation-stone with his own hands.',
      },
      {
        id: 'soothe',
        label: 'Soothe her. Take her to rest.',
        tags: ['cautious', 'wise'],
        effects: { faith: -1 },
        logLine: 'They led her away. She slept at last.',
      },
    ],
  },
];

/**
 * Trade events — pottery ↔ bronze ↔ amber ↔ grain cycle.
 * These fire at higher frequency once the harbor is built.
 */
export const TRADE_EVENTS = [
  {
    id: 'amber_trader',
    trade: true,
    title: 'An amber trader walks the beach',
    description:
      'A stranger in rough northern furs walks up the beach with a pouch of amber beads. He speaks only a few words of our tongue. He wants grain.',
    choices: [
      {
        id: 'trade',
        label: 'Five measures of grain for a pouch of amber.',
        tags: ['welcoming', 'wise'],
        effects: { food: -5, amber: 3, faith: 1 },
        logLine: 'Amber beads are added to the shrine of Athena. The trader departs well-fed.',
      },
      {
        id: 'pottery_deal',
        label: 'Offer him painted jars instead of bread.',
        tags: ['bold', 'wise'],
        effects: { pottery: -4, amber: 4 },
        logLine: 'The trader turns the jars in his hands, whistles low, and takes them for twice the amber.',
      },
      {
        id: 'decline',
        label: 'Send him on. We need our grain.',
        tags: ['cautious', 'traditional'],
        effects: {},
        logLine: 'The trader left, calling us graceless in his own tongue.',
      },
    ],
  },

  {
    id: 'greek_merchant',
    trade: true,
    title: 'A Greek merchant puts in',
    description:
      'A long black ship with a painted eye on her prow slides into the bay. The captain, a broad-shouldered Achaean, steps ashore with a chest of bronze ingots. He wants pottery — the best we have.',
    choices: [
      {
        id: 'trade_pottery',
        label: 'Trade 6 jars for 4 ingots of bronze.',
        tags: ['welcoming', 'wise'],
        effects: { pottery: -6, bronze: 4 },
        logLine: 'The Achaean sails with our jars stacked in straw. We have bronze for the spear-tips.',
      },
      {
        id: 'hard_bargain',
        label: 'Drive a hard bargain. Offer 4 jars for 4 ingots.',
        tags: ['bold', 'traditional'],
        effects: { pottery: -4, bronze: 4, faith: -1 },
        logLine: 'He scowls and spits in the sand, but takes the deal. Some gods were offended.',
      },
      {
        id: 'refuse',
        label: 'Refuse the man of Argos. We remember Mycenae.',
        tags: ['wrathful', 'traditional'],
        effects: { faith: 1 },
        logLine: 'The black ship turns from the harbor. Old wounds do not bleed, but they remember.',
      },
    ],
  },

  {
    id: 'northern_smith',
    trade: true,
    title: 'A wandering smith seeks tin',
    description:
      'A smith in a leather apron sets his hammer on a flat stone at the kiln. He has four bronze blades to sell and wants amber for his woman in the north.',
    choices: [
      {
        id: 'amber_for_bronze',
        label: 'Two pouches of amber for four bronze blades.',
        tags: ['welcoming', 'wise'],
        effects: { amber: -2, bronze: 4 },
        logLine: 'The smith pockets the amber and leaves his blades. He sings as he walks the strand.',
      },
      {
        id: 'pottery_for_bronze',
        label: 'Offer him jars of honey wine and a brace of owls.',
        tags: ['bold', 'welcoming'],
        effects: { pottery: -3, bronze: 3, food: -2 },
        logLine: 'He laughs and takes the jars, leaves three blades behind. Good enough for a summer.',
      },
      {
        id: 'turn_away',
        label: 'We have no need of another strange-tongued smith.',
        tags: ['cautious', 'traditional'],
        effects: {},
        logLine: 'The smith moves on down the coast. Someone else gets the blades.',
      },
    ],
  },

  {
    id: 'grain_caravan',
    trade: true,
    title: 'A grain caravan from the plains',
    description:
      'An inland caravan of mules and goat-skin tents winds down out of the hills. Their leader, a broad old woman, wants amber and bronze. She has twenty measures of barley.',
    choices: [
      {
        id: 'pay_amber',
        label: 'Pay in amber for the grain.',
        tags: ['wise', 'welcoming'],
        effects: { amber: -3, food: 20 },
        logLine: 'The caravan unloads barley in the long evening. The granary is full for the first time.',
      },
      {
        id: 'pay_bronze',
        label: 'Pay in bronze for the grain.',
        tags: ['bold', 'welcoming'],
        effects: { bronze: -2, food: 18 },
        logLine: 'She takes the bronze ingots in rough hands and hefts them approvingly.',
      },
      {
        id: 'turn_away',
        label: 'We will not part with bronze or amber for bread.',
        tags: ['cautious', 'traditional'],
        effects: {},
        logLine: 'She shrugs and turns her mules east.',
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

/** Picks a trade event if any exist. Same anti-repeat guard. */
export function pickTradeEvent() {
  const candidates = TRADE_EVENTS.filter((e) => e.id !== _lastEventId);
  if (candidates.length === 0) return null;
  const evt = candidates[Math.floor(Math.random() * candidates.length)];
  _lastEventId = evt.id;
  return evt;
}
