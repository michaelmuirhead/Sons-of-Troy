/**
 * The seven Trojan houses that landed with the splinter fleet.
 *
 * Each family is the base political and labor unit. A family has:
 *  - a name, epithet, and accent color (for the UI)
 *  - a ship it arrived on (flavor)
 *  - a current head (age-tracked; succession fires when the head dies)
 *  - 1-2 named notables — rising figures who can inherit the house
 *  - a demographic population split (warriors/craftsmen/women/children/elders)
 *  - preferredTasks (drives specialization bonuses and ambition)
 *  - stance tags (drives council voting on events)
 *  - dynamic state: influence, ambition, loyalty
 *  - relationships: patronage bonds with other houses
 *
 * FAMILIES_SEED is a plain data source; createFamilies() turns it into the
 * runtime objects used by the reducer.
 */

export const STANCE_TAGS = [
  'pious',       // prefers offerings, rites, sacrifices
  'cautious',    // prefers hiding, retreating, keeping low
  'bold',        // prefers direct action, confrontation, going first
  'welcoming',   // prefers embracing outsiders, trade, alliance
  'traditional', // prefers doing the old Trojan way, distrustful of outsiders
  'wrathful',    // prefers revenge, defiance, memory of the fallen
  'wise',        // prefers counsel, deliberation, long view
];

export const FAMILIES_SEED = [
  {
    id: 'antenor',
    name: 'House of Antenor',
    epithet: 'the counselors',
    color: '#2e5c8a', // aegean — diplomats look outward
    ship: 'The Theano', // Antenor's wife, priestess of Athena
    head: { name: 'Helicaon of Antenor', age: 52, note: "Antenor's surviving son, husband to a daughter of Priam" },
    notables: [
      { name: 'Theano the Younger', age: 22, role: 'priestess of Athena', bucket: 'women', trait: 'wise' },
      { name: 'Agenor of Antenor', age: 28, role: 'young statesman', bucket: 'craftsmen', trait: 'diplomat' },
    ],
    preferredTasks: ['tend', 'scout'],
    stance: ['wise', 'welcoming'],
    population: { warriors: 6, craftsmen: 10, women: 14, children: 12, elders: 6 },
  },
  {
    id: 'panthous',
    name: 'House of Panthous',
    epithet: 'the priests of Apollo',
    color: '#e07a5f', // ochre — priestly
    ship: 'The Phoebus',
    head: { name: 'Cassandra', age: 44, note: 'Daughter of Priam, priestess, cursed to speak true prophecy unheeded' },
    notables: [
      { name: 'Polydamas', age: 32, role: 'reader of omens', bucket: 'craftsmen', trait: 'prophetic' },
      { name: 'Chryseis the Younger', age: 19, role: 'novice priestess', bucket: 'women', trait: 'devout' },
    ],
    preferredTasks: ['tend', 'forage'],
    stance: ['pious', 'wise'],
    population: { warriors: 4, craftsmen: 8, women: 18, children: 11, elders: 9 },
  },
  {
    id: 'ucalegon',
    name: 'House of Ucalegon',
    epithet: 'the ruined',
    color: '#7a1a1a', // deep rust — burned house
    ship: 'The Burnt Column',
    head: { name: 'Andromache', age: 42, note: 'Widow of Hector, whose son was cast from the walls of Troy' },
    notables: [
      { name: 'Idomen of Ucalegon', age: 24, role: 'burned son grown to spear', bucket: 'warriors', trait: 'vengeful' },
      { name: 'Halia', age: 35, role: 'matron of the wounded', bucket: 'women', trait: 'grim' },
    ],
    preferredTasks: ['quarry', 'forage'],
    stance: ['wrathful', 'cautious'],
    population: { warriors: 5, craftsmen: 12, women: 16, children: 8, elders: 7 },
  },
  {
    id: 'hicetaon',
    name: 'House of Hicetaon',
    epithet: 'the royal spears',
    color: '#c44536', // terracotta — warrior red
    ship: 'The Ilian Lance',
    head: { name: 'Aretus of Hicetaon', age: 38, note: "Nephew of Priam, one of the last warriors of his uncle's line" },
    notables: [
      { name: 'Polypoetes son of Aretus', age: 21, role: 'spearman, heir apparent', bucket: 'warriors', trait: 'brash' },
      { name: 'Eurymedon', age: 30, role: 'spearmaster', bucket: 'warriors', trait: 'disciplined' },
    ],
    preferredTasks: ['scout', 'fell'],
    stance: ['bold', 'traditional'],
    population: { warriors: 14, craftsmen: 8, women: 12, children: 10, elders: 4 },
  },
  {
    id: 'capys',
    name: 'House of Capys',
    epithet: 'the old blood of Dardania',
    color: '#6b7a3a', // olive — old, rooted
    ship: 'The Anchises',
    head: { name: 'Dymas of Dardania', age: 56, note: 'Dardanian kinsman of Anchises, skeptical of Greek gifts and Greek strangers alike' },
    notables: [
      { name: 'Asius of Dardania', age: 34, role: 'master builder', bucket: 'craftsmen', trait: 'builder' },
      { name: 'Medea of Capys', age: 30, role: 'matron of the hearth', bucket: 'women', trait: 'shrewd' },
    ],
    preferredTasks: ['fell', 'quarry'],
    stance: ['traditional', 'cautious'],
    population: { warriors: 9, craftsmen: 12, women: 14, children: 9, elders: 6 },
  },
  {
    id: 'hyrtacus',
    name: 'House of Hyrtacus',
    epithet: 'the archers of Arisbe',
    color: '#8a5a2b', // tanned leather — frontier hunters
    ship: 'The Hellespont',
    head: { name: 'Pandarus the Archer', age: 48, note: 'Lycian-born ally, the bow that broke the truce at Ilium' },
    notables: [
      { name: 'Nisus of Hyrtacus', age: 23, role: 'swift scout', bucket: 'warriors', trait: 'swift' },
      { name: 'Euryalus of Arisbe', age: 20, role: "Nisus's sworn companion", bucket: 'warriors', trait: 'loyal' },
    ],
    preferredTasks: ['scout', 'fish'],
    stance: ['bold', 'welcoming'],
    population: { warriors: 11, craftsmen: 9, women: 13, children: 11, elders: 4 },
  },
  {
    id: 'thymoetes',
    name: 'House of Thymoetes',
    epithet: 'the lorekeepers',
    color: '#3d2b1f', // dark brown — old memory
    ship: 'The Memory of Ilion',
    head: { name: 'Helenus of Ilion', age: 54, note: 'Son of Priam, seer, reads omens in the flight of birds' },
    notables: [
      { name: 'Daphne of Ilion', age: 26, role: 'young lorekeeper', bucket: 'women', trait: 'scribe' },
      { name: 'Actor the Scribe', age: 45, role: 'keeper of tablets', bucket: 'craftsmen', trait: 'patient' },
    ],
    preferredTasks: ['tend', 'forage'],
    stance: ['pious', 'wise'],
    population: { warriors: 3, craftsmen: 9, women: 15, children: 10, elders: 11 },
  },
];

// ---------------- Factory ----------------

export function createFamilies() {
  return FAMILIES_SEED.map((f) => ({
    ...f,
    head: { ...f.head },
    notables: (f.notables || []).map((n) => ({ ...n })),
    population: { ...f.population },
    influence: 10,        // starting prestige — everyone is equal on the beach
    ambition: 0,          // 0-100; rises when used outside specialty
    loyalty: 70,          // 0-100; decays with ignored ambition, overrides in council
    activeCrew: null,     // { taskId, size, daysRemaining, patronOf? }
    relationships: {},    // { [otherFamilyId]: bondStrength 0-100 } — patronage bonds
    seceded: false,       // true after the house leaves the colony
  }));
}

// ---------------- Labor helpers ----------------

/** Total adults who can do generic labor (warriors + craftsmen + adult women). */
export function availableWorkers(family) {
  if (family.activeCrew) return 0;
  const p = family.population;
  return (p.warriors || 0) + (p.craftsmen || 0) + (p.women || 0);
}

/** Just the warriors of this house (for scout / war tasks). */
export function availableWarriors(family) {
  if (family.activeCrew) return 0;
  return family.population.warriors || 0;
}

/** Total mouths that eat in this house. */
export function totalPopulation(family) {
  const p = family.population;
  return (p.warriors || 0) + (p.craftsmen || 0) + (p.women || 0) + (p.children || 0) + (p.elders || 0);
}

/** Sum of mouths across all houses (only non-seceded count). */
export function colonyPopulation(families) {
  return families
    .filter((f) => !f.seceded)
    .reduce((sum, f) => sum + totalPopulation(f), 0);
}

/** Houses still in the colony. */
export function activeHouses(families) {
  return families.filter((f) => !f.seceded);
}

// ---------------- Specialization / stance ----------------

/** 1.0 baseline, up to 1.5 if the task is in the family's preferredTasks. */
export function specializationBonus(family, taskId) {
  return family.preferredTasks.includes(taskId) ? 1.5 : 1.0;
}

/** Count how many stance tags of this family overlap a choice's tags. */
export function stanceAffinity(family, choiceTags) {
  if (!choiceTags || choiceTags.length === 0) return 0;
  let score = 0;
  for (const t of family.stance) {
    if (choiceTags.includes(t)) score += 1;
  }
  return score;
}

/**
 * For an event with N choices, return the choice each family prefers.
 * Ties break by first-listed choice.
 */
export function familyPreferredChoice(family, choices) {
  let best = choices[0];
  let bestScore = -Infinity;
  for (const ch of choices) {
    const s = stanceAffinity(family, ch.tags || []);
    if (s > bestScore) {
      best = ch;
      bestScore = s;
    }
  }
  return best;
}

/** Compute council tally: { [choiceId]: { families: [...], weight: number } } */
export function councilTally(families, choices) {
  const voters = activeHouses(families);
  const tally = {};
  for (const ch of choices) {
    tally[ch.id] = { families: [], weight: 0 };
  }
  for (const f of voters) {
    const pref = familyPreferredChoice(f, choices);
    tally[pref.id].families.push(f.id);
    tally[pref.id].weight += Math.max(1, Math.round(f.influence));
  }
  return tally;
}
