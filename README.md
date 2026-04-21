# The Last Sons of Troy

An ancient-world colony sim where a band of Trojan refugees break from Aeneas' expedition and found their own colony. Built as a single-page browser app with **Vite + React**, rendered in a cartoon Greek-pottery palette, and scaffolded for a **GitHub → Vercel** workflow.

This repository contains **Phase 0** — a playable, text-based prototype. The chronicle of New Ilion is written in prose, and a resource-trend graph in the side panel lets you track food, wood, stone, faith, pottery, and colonist count over time. See `GAME_DESIGN.md` for the full vision (Manor Lords + RimWorld + Civilization + Total War) and the phased roadmap toward it.

---

## What's in the prototype

- A click-driven, turn-based loop — each **End Day** advances time, ticks tasks and construction, consumes food, and rolls for story events
- Five founding colonists with Trojan names, origins, and traits (Helenus, Andromache, Pandarus, Cassandra, Dymas)
- Five resource types: **food**, **wood**, **stone**, **faith**, **pottery**
- Four interaction types from the action bar:
  - **Dispatch** a colonist to a task (forage, fell, quarry, fish, tend, scout)
  - **Build** granary, shrine, palisade, kiln, or longhouse
  - **Explore** discovered locations (olive cove, ruined shrine, hidden spring…)
  - **Respond** to story events (a sail on the horizon, Athena's owl, fever, news of Aeneas…)
- A rolling prose **Chronicle** that forms the narrative spine of the game
- A side **Roster panel** with a live **resource-trend graph** (toggle lines for food, wood, stone, faith, pottery, colonists), plus colonists, buildings (complete and under construction), and known locations
- A season clock (Spring → Summer → Autumn → Winter), with seasonal yield modifiers
- **Browser save** via `localStorage` — close the tab, come back, resume

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
    │   ├── gameState.js    Reducer, action types, save/load
    │   ├── tasks.js        Tasks (forage, fell, quarry, fish, tend, scout)
    │   ├── buildings.js    Buildings (granary, shrine, palisade, kiln, longhouse)
    │   ├── locations.js    Discoverable places along the coast
    │   ├── events.js       Story-event pool with choices
    │   └── names.js        Trojan names, origins, traits
    ├── components/
    │   ├── TopBar.jsx        Colony name + day + season + resources
    │   ├── Chronicle.jsx     Main prose view (newest-first)
    │   ├── RosterPanel.jsx   Trends graph + colonists + buildings + places
    │   ├── ResourceGraph.jsx SVG line chart of resources over time
    │   ├── ActionBar.jsx     Dispatch / Build / Explore / End Day / Reset
    │   ├── Modal.jsx         Generic overlay
    │   ├── DispatchModal.jsx
    │   ├── BuildModal.jsx
    │   ├── ExploreModal.jsx
    │   └── EventModal.jsx    (non-dismissible)
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
