# The Last Sons of Troy

An ancient-world colony sim where a band of Trojan refugees break from Aeneas' expedition and found their own colony. Built as a single-page browser app with **Vite + React + Phaser 3**, rendered in a cartoon Greek-pottery palette, and scaffolded for a **GitHub → Vercel** workflow.

This repository contains **Phase 0** — a playable prototype. See `GAME_DESIGN.md` for the full vision (Manor Lords + RimWorld + Civilization + Total War) and the phased roadmap toward it.

---

## What's in the prototype

- A small coastal map rendered in the pottery palette (terracotta, black, cream, Aegean blue)
- Five founding colonists with Trojan names, origins, and traits (Helenus, Andromache, Pandarus, Cassandra, Dymas)
- Four resource types: food (wheat, olive, fish), wood (oak), stone, pottery
- A granary that receives deliveries and a shrine to Athena
- A season clock that cycles the screen's tint (Spring → Summer → Autumn → Winter)
- A rolling **Chronicle** log in the side panel
- A story-event system with choices (a sail on the horizon, Athena's owl, a fever, news of Aeneas…)

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
├── GAME_DESIGN.md         Full vision + phased roadmap
├── README.md              This file
├── package.json
├── vite.config.js
├── vercel.json
├── index.html
├── public/
│   └── favicon.svg        Pottery-style Trojan icon
└── src/
    ├── main.jsx           React entry
    ├── App.jsx            Grid layout: top bar + game canvas + side panel
    ├── App.css            Pottery-palette theme
    ├── eventBus.js        Pub/sub between React and Phaser
    ├── game/
    │   ├── PhaserGame.jsx Mounts Phaser inside React
    │   ├── config.js      Palette + game constants
    │   ├── sprites.js     Procedural pottery-style sprites
    │   ├── ColonyScene.js Main gameplay scene
    │   ├── Colonist.js    Named colonist + simple AI
    │   ├── ResourceNode.js
    │   └── events.js      Story-event pool
    └── ui/
        ├── TopBar.jsx
        ├── ColonistPanel.jsx
        └── EventModal.jsx
```

---

## Where we're going next

See `GAME_DESIGN.md` for the full roadmap. In short:

1. **Phase 1 — Manor Lords layer:** buildable village, placement tool, logistics
2. **Phase 2 — RimWorld layer:** needs, moods, relationships, personal events
3. **Phase 3 — Civilization layer:** tech, diplomacy, neighbors, generations
4. **Phase 4 — Total War layer:** tactical battles on a zoom-in battle map
5. **Phase 5 — Polish:** scenarios, music, procedural maps, itch/Steam

---

## Credits and references

Art direction draws on Greek black-figure and red-figure pottery. Names, origins, and event flavor pull from the *Iliad*, the *Aeneid*, and adjacent Trojan legendarium — liberally interpreted.
