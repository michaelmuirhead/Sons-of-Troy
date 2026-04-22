# The Last Sons of Troy

An ancient-world colony sim where a band of Trojan refugees break from Aeneas' expedition and found their own colony. Built as a single-page browser app with **Vite + React**, rendered in a cartoon Greek-pottery palette, and scaffolded for a **GitHub → Vercel** workflow.

This repository contains **Phase 0** — a playable, text-based prototype. The chronicle of New Ilion is written in prose, and a resource-trend graph in the side panel lets you track food, wood, stone, faith, pottery, and colonist count over time. See `GAME_DESIGN.md` for the full vision (Manor Lords + RimWorld + Civilization + Total War) and the phased roadmap toward it.

---

## What's in the prototype

- A click-driven, turn-based loop — each **End Day** advances time, ticks tasks and construction, consumes food, and rolls for story events
- Seven founding **Trojan houses** (Antenor, Panthous, Ucalegon, Hicetaon, Capys, Hyrtacus, Thymoetes), each with its own ship, head, stance, specialty, and ~50 settlers split across warriors / craftsmen / women / children / elders
- Famous founders live on as *house heads* — Helenus, Andromache, Pandarus, Cassandra, Dymas, Aretus, Helicaon — each speaking for their own line
- Five resource types: **food**, **wood**, **stone**, **faith**, **pottery**
- Four interaction types from the action bar:
  - **Dispatch** a crew from one house to a task (forage, fell, quarry, fish, tend, scout). Specialty houses yield +50% and finish a day faster. Scout & war work is warriors-only.
  - **Build** granary, shrine, palisade, kiln, or longhouse
  - **Explore** discovered locations (olive cove, ruined shrine, hidden spring…)
  - **Respond** to story events — now resolved as a **council vote**. Each house aligns with the choice matching its stance (pious, bold, cautious, welcoming, traditional, wrathful, wise). You see who supports each option and their weighted influence. Override the council and dissenters lose loyalty and grow ambition.
- Per-house political stats: **influence** (prestige won through action and council wins), **ambition** (rises when used off-specialty; erodes loyalty when high), **loyalty** (0–100; decays when overridden)
- A rolling prose **Chronicle** that forms the narrative spine of the game
- A side panel with a live **resource-trend graph** (toggle lines for food, wood, stone, faith, pottery, souls), **seven house cards** with demographic bars and stance chips, buildings (complete and under construction), and known locations
- A season clock (Spring → Summer → Autumn → Winter), with seasonal yield modifiers
- **Browser save** via `localStorage` (v2 schema) — close the tab, come back, resume

---

## Running it locally

```bash
# clone or unzip this folder, then
cd "Colony Sims"

# install dependencies
npm install

# start the dev server (auto-opens http://localhost:5173)
npm run dev
```

Requirements: Node 18+ and npm 9+ (or pnpm / yarn if you prefer).

### Build a production bundle

```bash
npm run build      # outputs to ./dist
npm run preview    # serves the production build locally for a sanity check
```

---

## Deploying to Vercel

The project is pre-configured (`vercel.json`) to deploy as a static Vite build.

1. Create a new GitHub repository and push this folder.
   ```bash
   git init
   git add .
   git commit -m "Initial scaffold — The Last Sons of Troy"
   git branch -M main
   git remote add origin https://github.com/<you>/last-sons-of-troy.git
   git push -u origin main
   ```
2. Go to <https://vercel.com/new> and import the repo.
3. Vercel auto-detects Vite — accept the defaults.
4. Hit **Deploy**. Your game ships to `https://<project>.vercel.app`.

Every push to `main` will redeploy automatically. Branch pushes get preview URLs.

### Local sanity-check before deploying

```bash
npm run build && npm run preview
```

If that works, Vercel will work.

---

## Project structure

```
Colony Sims/
├── GAME_DESIGN.md          Full vision + phased roadmap
├── README.md               This file
├── package.json
├── vite.config.js
├── vercel.json
├── index.html
├── public/
│   └── favicon.svg         Pottery-style Trojan icon
└── src/
    ├── main.jsx            React entry
    ├── App.jsx             Top bar + chronicle + roster + action bar
    ├── App.css             Pottery-palette theme
    ├── state/
    │   ├── gameState.js    Reducer, DISPATCH_CREW / BUILD / EXPLORE / RESOLVE_EVENT / END_DAY, save/load v2
    │   ├── families.js     Seven Trojan houses, stance vocabulary, council tally helpers
    │   ├── tasks.js        Tasks (forage, fell, quarry, fish, tend, scout) — per-crew yield, specialization bonus
    │   ├── buildings.js    Buildings (granary, shrine, palisade, kiln, longhouse)
    │   ├── locations.js    Discoverable places along the coast
    │   └── events.js       Story-event pool — each choice carries stance tags for council voting
    ├── components/
    │   ├── TopBar.jsx        Colony name + day + season + resources
    │   ├── Chronicle.jsx     Main prose view (newest-first)
    │   ├── RosterPanel.jsx   Trends graph + seven house cards + buildings + places
    │   ├── FamilyCard.jsx    Compact card per house: demographics, influence/ambition/loyalty, crew status
    │   ├── ResourceGraph.jsx SVG line chart of resources + souls over time
    │   ├── ActionBar.jsx     Dispatch / Build / Explore / End Day / Reset
    │   ├── Modal.jsx         Generic overlay
    │   ├── DispatchModal.jsx 3-step crew picker (task → house → crew size)
    │   ├── BuildModal.jsx
    │   ├── ExploreModal.jsx
    │   └── EventModal.jsx    Non-dismissible council vote with per-choice supporter chips
    └── game-archive/         Earlier Phaser prototype, kept for reference
```

---

## Where we're going next

See `GAME_DESIGN.md` for the full roadmap. In short:

1. **Phase 0 (current):** text + pottery illustrations, click-driven turns
2. **Phase 1 — Manor Lords layer:** buildable village, placement tool, logistics
3. **Phase 2 — RimWorld layer:** needs, moods, relationships, personal events
4. **Phase 3 — Civilization layer:** tech, diplomacy, neighbors, generations
5. **Phase 4 — Total War layer:** tactical battles on a zoom-in battle map
6. **Phase 5 — Polish:** scenarios, music, procedural maps, itch/Steam

---

## Credits and references

Art direction draws on Greek black-figure and red-figure pottery. Names, origins, and event flavor pull from the *Iliad*, the *Aeneid*, and adjacent Trojan legendarium — liberally interpreted.
