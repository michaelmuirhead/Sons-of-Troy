/**
 * Trojan and Dardanian names pulled from the Iliad, the Aeneid, and
 * adjacent legendarium. Used for founders and event-recruited colonists.
 */

export const MALE_NAMES = [
  'Helenus', 'Pandarus', 'Troilus', 'Antenor', 'Coroebus',
  'Deiphobus', 'Polites', 'Misenus', 'Cleanthes', 'Cyzicus',
  'Dymas', 'Iphitus', 'Panthus', 'Thymbraeus', 'Acamas',
  'Ascanius', 'Echion', 'Euphorbus', 'Othryades',
];

export const FEMALE_NAMES = [
  'Cassandra', 'Andromache', 'Briseis', 'Polyxena', 'Laodice',
  'Creusa', 'Iliona', 'Thymele', 'Kallirhoe', 'Aeithusa',
  'Xanthe', 'Pyrrha', 'Melite', 'Hesione', 'Theano',
];

export const EPITHETS = [
  'the Archer', 'of Ilion', 'the Walker', 'Bronze-hand',
  'the Seer-touched', 'the Fleet', 'Dusk-eyed', 'the Elder',
  'of the Shore', 'Olive-gatherer', 'the Quiet', 'Sun-browned',
];

export const ORIGINS = [
  'Born in Troy',
  'Born in Dardania',
  'Born in Thrace',
  'A freed slave of Troy',
  'A Lycian ally of the king',
];

export const TRAITS_POOL = [
  { key: 'Pious',          note: 'gains extra faith at the shrine' },
  { key: 'Grieving',       note: 'slower to work, but resolute' },
  { key: 'Swift-footed',   note: 'returns from scouting faster' },
  { key: 'Bronze-tongued', note: 'useful in diplomacy' },
  { key: 'Scarred',        note: 'a veteran of the walls of Troy' },
  { key: 'Dreamer',        note: 'sometimes receives omens' },
  { key: 'Ox-strong',      note: 'extra yield when felling or quarrying' },
  { key: 'Honey-voiced',   note: 'lifts the spirits of others' },
  { key: 'Sea-wary',       note: 'extra fish in the bay' },
  { key: 'Seer-touched',   note: 'may foresee events' },
  { key: 'Temperate',      note: 'eats and sleeps little' },
  { key: 'Fierce',         note: 'stands firm in a raid' },
];

let _counter = 0;
export function newId(prefix = 'id') {
  _counter += 1;
  return `${prefix}_${Date.now().toString(36)}_${_counter}`;
}

export function pickOne(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function pickN(arr, n) {
  const copy = [...arr];
  const out = [];
  for (let i = 0; i < n && copy.length; i++) {
    const idx = Math.floor(Math.random() * copy.length);
    out.push(copy.splice(idx, 1)[0]);
  }
  return out;
}

export function randomColonist() {
  const isFemale = Math.random() < 0.5;
  const base = isFemale ? pickOne(FEMALE_NAMES) : pickOne(MALE_NAMES);
  const epithet = Math.random() < 0.4 ? ' ' + pickOne(EPITHETS) : '';
  return {
    id: newId('c'),
    name: base + epithet,
    origin: pickOne(ORIGINS),
    traits: pickN(TRAITS_POOL.map((t) => t.key), 1 + (Math.random() < 0.3 ? 1 : 0)),
    status: 'idle',
    currentTask: null,
    taskDaysRemaining: 0,
  };
}
