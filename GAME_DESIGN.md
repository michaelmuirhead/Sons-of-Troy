# The Last Sons of Troy — Game Design Document

**Working title:** The Last Sons of Troy
**Genre:** Ancient-world text-based colony sim, with a long-term vision as a hybrid grand strategy game
**Platform:** Browser (desktop-first, mouse-driven)
**Tech stack:** Vite + React, deployed via GitHub → Vercel. Phaser 3 scaffolded and held in reserve for later visual phases.
**Art direction:** Prose foreground, with inlined pottery-style SVG illustrations (red-figure / black-figure conventions) framing key moments.

---

## 1. Premise

Troy has fallen. Smoke rises from the ruins of Priam's city. Aeneas gathers his followers and sails west, destined (the prophecies say) to found a new people in Italy.

You are not Aeneas.

You lead a smaller band — a cousin of Hector, a priestess of Apollo, a freed Dardanian slave, a grizzled chariot-master, and whoever else you could pull onto a single ship. You break with Aeneas on the open sea. His destiny is not yours.

Where will your people settle? Will you build a farming village on a quiet Aegean island? A fortified outpost on the Anatolian coast within sight of smoking Ilium? A trading post alongside the Phoenicians? Your choice — and your people — will decide whether your name survives the centuries or is lost to the wine-dark sea.

## 2. Tone

Light myth flavor. The gods are real in the sense that your priestess will say Athena favors you after a good harvest, a raven omen before a storm, a sacrificed bull before a battle — but you will not fight cyclopes or ride pegasi. The tone should feel like Homer read on a summer porch: a little grand, a little wry, a lot human.

No strict historical accuracy. Late Bronze Age Mediterranean vibes, liberally interpreted.

## 3. The Four Pillars (Full Vision)

The long-term vision weaves together four genre touchstones. Each will be a major layer of the game.

### Pillar 1 — Manor Lords (The Village Layer)
- Grid-free, terrain-following building placement
- Burgages / houses with adjustable plots for gardens, workshops, animal pens
- Logistics chains: ox-cart routes, granaries, pottery kilns feeding traders
- Seasons (grain year, olive harvest, winter dearth) with visible world changes
- Militia composed of villagers called to arms

### Pillar 2 — RimWorld (The People Layer)
- Every colonist has a name, portrait, origin (Troy, Dardania, Thrace, slave-born), and 2–3 traits (e.g. *Grieving*, *Pious*, *Swift-footed*, *Bronze-tongued*)
- Needs: food, rest, beauty, faith, social, safety
- Skills: farming, crafting, combat, trade, scholarship
- Relationships: friendships, grudges, marriages, rivalries
- Mood events and personal stories — the priestess has a vision, the warrior broods on his dead brother, two colonists fall in love across the Trojan/Dardanian divide

### Pillar 3 — Civilization (The Strategy Layer)
- Long game measured in decades and generations — children are born, grow, take up trades, lead
- Tech/culture progression: metallurgy, masonry, seafaring, philosophy, writing (if you invent a script, your deeds survive)
- Diplomacy with nearby peoples: Hittites fraying, Mycenaean city-kings squabbling, Phoenician traders rising, Egyptian dynasties, eventually distant Aeneas in the west
- Legacy mechanic: your choices become *canon in your colony's myth* — an illustrated chronicle you can read

### Pillar 4 — Total War (The Battle Layer)
- When raiders land or armies march, the game zooms from village to battlefield
- Formations of spearmen, archers, chariots fighting in a real-time tactical battle
- Terrain matters (high ground, tree lines, a river ford)
- Named colonists fight as officers; their deaths echo back into the village
- Morale, fatigue, arrow supply — short, decisive engagements

### How the pillars interlock
The individual colonist in the village (RimWorld) grows into the officer on the battlefield (Total War). The village economy (Manor Lords) funds the civilizational push (Civilization). The whole arc is personal at the bottom and world-historical at the top.

## 4. Phased Roadmap

A realistic path from prototype to full vision.

### Phase 0 — Text-based prototype (current)
- Project scaffold (Vite + React, GitHub/Vercel-ready)
- Click-driven turns: each click advances a day or commits an action
- 5 named Trojan founders with traits and a growing roster
- **Dispatch** — send a colonist to a task (forage, fell, quarry, fish, tend the shrine, scout)
- **Build** — spend resources to construct the Granary, Shrine, Walls, Kiln, Longhouse
- **Explore** — scout and discover new locations along the coast; later, send envoys
- **Story events** — pottery-framed interruptions with choices (a sail, Athena's owl, a fever, news of Aeneas, a Dardanian stranger)
- A scrolling **Chronicle** panel in Palatino type, with inline pottery illustrations for key moments
- Seasonal clock (Spring → Summer → Autumn → Winter) with narrative effect on foraging yields
- Save game to browser localStorage

### Phase 1 — Deepen the text sim
- More colonists with real needs (hunger, rest, mood, faith)
- Relationships and children across generations
- Expanded building tree and dependencies
- Exploration map with 8–12 named locations
- Weather and storms affecting tasks

### Phase 2 — Manor Lords visual layer (revisited)
- Buildable village rendered as a 2D top-down scene
- Placement tool and terrain-following visuals
- Ox-cart logistics between buildings
- The text sim becomes a sidebar / optional view

### Phase 3 — RimWorld layer deepens
- Portraits (pottery-style silhouettes) generated per colonist
- Events tied to individual traits (the priestess's vision unlocks a shrine upgrade)
- Scripted character arcs alongside the random event pool

### Phase 4 — Civilization layer
- Tech tree (Bronze, Masonry, Navigation, Writing, etc.)
- Neighboring peoples as AI civilizations
- Trade and diplomacy screens
- Generations and chronicle

### Phase 5 — Total War layer
- Battle scene that loads when combat triggers
- Unit formations, orders, morale
- Named officers carry village identity into battle

### Phase 6 — Polish and world
- Scenarios (3–5 different starting locations with unique flavor)
- Music and SFX (cithara, aulos, Aegean soundscape)
- Procedural map generator
- Steam / itch.io release consideration (still shippable as web build)

## 5. Art Direction

### Palette (canonical)
- **Terracotta orange** `#C44536` — figures, highlights, hot areas
- **Warm ochre** `#E07A5F` — secondary figures, worn surfaces
- **Black basalt** `#1A1A1A` — silhouettes, outlines, pottery black
- **Bone cream** `#F4ECD8` — parchment, background, UI surfaces
- **Aegean blue** `#2E5C8A` — sea, night, sparingly used
- **Olive** `#6B7A3A` — trees, vegetation, accent

### Rendering style
- Flat shapes, no gradients, hard edges
- Figures are cartoon-proportioned but rendered in the silhouette-and-detail style of Greek pottery
- Ground textures are flat cream/ochre, like unfired clay
- UI panels look like papyrus/pottery fragments with subtle border ornament (meander/Greek-key patterns)

### Illustrations (Phase 0)
The text game is framed by inline SVG illustrations in the pottery palette. Each scene is a hand-authored React component — small enough to bundle freely, stylized enough to evoke Attic vase painting without needing an art pipeline. Illustrations appear in the Chronicle when the narrative calls for them (the founding, a sail, a storm, a vision, a battle).

## 6. Core Systems (Phase 0 text scope)

### Resources
- **Food** (foraging, fishing, olive harvest)
- **Wood** (felling oak)
- **Stone** (quarrying outcrops)
- **Faith** (tending the shrine — unlocks divine-favor events)

### Colonists
Each colonist has `{id, name, origin, traits[], status, currentTask, taskDaysRemaining}`.
Statuses: `idle`, `working`, `scouting`, `building`, `ill`.
Founders: Helenus, Andromache, Pandarus, Cassandra, Dymas.

### Tasks (dispatch)
Each task takes N days and yields resources and chronicle lines. Random trait-based variance (e.g. Ox-strong = +wood on felling; Swift-footed = faster scouting).
- **Forage** (1 day, food)
- **Fell oak** (2 days, wood)
- **Quarry stone** (2 days, stone)
- **Fish the bay** (1 day, food)
- **Tend the shrine** (1 day, faith)
- **Scout the coast** (3 days, discovers a new location)

### Buildings
Each building costs resources and takes days to complete. Once built it unlocks new tasks or buffs.
- **Granary** — stores more food, food no longer spoils each winter
- **Shrine of Athena** — unlocks divine-favor events, faith decay slows
- **Palisade wall** — defensive modifier in raid events
- **Kiln** — crafts pottery (future trade good)
- **Longhouse** — increases colonist cap

### Locations (exploration)
Start with **The beach** (home). Scouting reveals new locations with their own interactions:
- **Cove of Olives** — grants olive harvests
- **Ruined shrine** — yields faith and a scripted event
- **Distant hearth-smoke** — unlocks first diplomatic contact

### Events
Authored pool. Each End Day rolls with a cooldown. A chosen event pauses the day and requires a choice. Each event can be illustrated with a pottery SVG. Starting pool: a sail on the horizon, Athena's owl, a fever, news of Aeneas, a Dardanian stranger, a storm, an amber trader.

### Seasons
A 12-day month, 4 months per year. Season affects foraging/fishing yields and visual accent color in the Chronicle header.

## 7. Out of Scope for Prototype
- Building placement
- Combat of any kind
- Diplomacy
- Tech tree
- Multi-colonist AI beyond simple gather loop
- Save/load

Everything above is staged for Phase 1+.

## 8. File Layout

```
Colony Sims/
├── GAME_DESIGN.md         ← this document
├── README.md              ← how to run, how to deploy
├── package.json
├── vite.config.js
├── vercel.json
├── index.html
├── .gitignore
└── src/
    ├── main.jsx           ← React entry
    ├── App.jsx            ← Layout: top bar + chronicle + actions + roster
    ├── App.css            ← Pottery palette styles
    ├── state/
    │   ├── gameState.js   ← Reducer + initial state
    │   ├── tasks.js       ← Dispatchable tasks and their effects
    │   ├── buildings.js   ← Building catalog with costs
    │   ├── locations.js   ← Discoverable locations
    │   ├── events.js      ← Story-event pool
    │   └── names.js       ← Trojan name generator
    ├── components/
    │   ├── TopBar.jsx
    │   ├── Chronicle.jsx  ← Big prose log with inline illustrations
    │   ├── ActionBar.jsx  ← Dispatch / Build / Explore / End Day buttons
    │   ├── RosterPanel.jsx
    │   ├── Modal.jsx
    │   ├── DispatchModal.jsx
    │   ├── BuildModal.jsx
    │   ├── ExploreModal.jsx
    │   └── EventModal.jsx
    ├── illustrations/
    │   └── (pottery-style SVG React components)
    └── game-archive/      ← Phaser Phase 0 code, preserved for reuse
```

## 9. Design principles

1. **Every system teaches the next.** The Phase 0 colonist is the seed of the Phase 4 soldier.
2. **The camera should always feel like pottery.** Limit the palette, keep lines simple, resist the urge to add gradients or realistic shading.
3. **Small world, deep stakes.** Even with 5 colonists, the player should feel that the survival of Trojan memory rests on their shoulders.
4. **Name everything.** No "Worker #3." Every colonist has a Trojan-flavored name. Every field has a name after the first harvest.
5. **The gods speak through events, not mechanics.** Athena doesn't give you +5 wisdom. Athena sends an owl, and you interpret the omen.

---

*This is a living document. Update it as the game evolves.*
