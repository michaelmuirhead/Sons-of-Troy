# The Last Sons of Troy — Game Design Document

**Working title:** The Last Sons of Troy
**Genre:** Ancient-world colony sim / grand strategy hybrid
**Platform:** Browser (desktop-first, mouse + keyboard)
**Tech stack:** Vite + React + Phaser 3, deployed via GitHub → Vercel
**Art direction:** Cartoon figures rendered in a Greek pottery palette (black-figure and red-figure pottery references)

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

### Phase 0 — This Prototype (shipped today)
- Project scaffold (Vite + React + Phaser 3, GitHub/Vercel-ready)
- Coastal map in pottery palette
- 5 named Trojan colonists with traits and auto-assigned jobs
- Resource nodes: olive trees, wheat fields, oak forest, stone outcrop, fishing bay
- Basic HUD: resources, season, colonist roster
- Event popup system with initial Trojan-flavored events
- Save-game via browser localStorage (deferred — see Phase 1)

### Phase 1 — Manor Lords layer
- Buildable village: houses, granary, workshop, kiln, dock, shrine
- Placement tool and terrain-following visuals
- Ox-cart logistics between buildings
- Season cycle affecting production
- Save/load to localStorage

### Phase 2 — RimWorld layer deepens
- Colonist needs and moods
- Relationships and children
- Random events tied to traits (the priestess's vision unlocks a shrine upgrade)
- Portrait generator (pottery-style silhouettes)

### Phase 3 — Civilization layer
- Tech tree (Bronze, Masonry, Navigation, Writing, etc.)
- Neighboring peoples as AI civilizations
- Trade and diplomacy screens
- Generations and chronicle

### Phase 4 — Total War layer
- Battle scene that loads when combat triggers
- Unit formations, orders, morale
- Named officers carry village identity into battle

### Phase 5 — Polish and world
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

### Procedural sprites (MVP approach)
To keep the prototype shippable without an art pipeline, all sprites in Phase 0 are generated with Phaser's Graphics API using the palette above. Figures are simple silhouettes (head + torso + limbs). This also makes it trivial to later swap in real pixel art or illustrated sprites without changing gameplay code.

## 6. Core Systems (MVP Scope)

### Resources
- Food (from wheat + fish)
- Wood (from oak)
- Stone (from outcrops)
- Pottery (crafted later — Phase 1)

### Colonists
Each colonist has `{id, name, origin, traits[], job, x, y, carrying}`.
Jobs: `farmer`, `fisher`, `woodcutter`, `quarryman`, `idle`.
The AI is a simple state machine: go to resource node → gather → return to granary (or just despawn resource and increment counter in MVP).

### Events
Lightweight RNG pool. Every ~45 seconds of game time, a chance to roll an event. Initial pool:
- *A sail on the horizon* — choice: welcome / hide
- *Athena's owl in the olive tree* — blessing on crafting
- *A fever passes through the hearths* — morale penalty
- *News from Aeneas' expedition* — flavor-only log entry
- *Stranger claiming Dardanian blood* — recruit a new colonist (or refuse)

### Seasons
A simple 4-season cycle driven by a game clock. Visual tint shifts (warmer in summer, cooler in winter). MVP: purely visual + a few log messages.

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
    ├── App.jsx            ← Layout: HUD + game canvas
    ├── App.css            ← Pottery palette styles
    ├── eventBus.js        ← React ↔ Phaser communication
    ├── game/
    │   ├── PhaserGame.jsx ← Mounts Phaser inside React
    │   ├── config.js      ← Phaser config + palette constants
    │   ├── ColonyScene.js ← Main game scene
    │   ├── Colonist.js    ← Colonist class + AI
    │   ├── ResourceNode.js
    │   └── sprites.js     ← Procedural pottery-style sprites
    └── ui/
        ├── TopBar.jsx
        ├── ColonistPanel.jsx
        └── EventModal.jsx
```

## 9. Design principles

1. **Every system teaches the next.** The Phase 0 colonist is the seed of the Phase 4 soldier.
2. **The camera should always feel like pottery.** Limit the palette, keep lines simple, resist the urge to add gradients or realistic shading.
3. **Small world, deep stakes.** Even with 5 colonists, the player should feel that the survival of Trojan memory rests on their shoulders.
4. **Name everything.** No "Worker #3." Every colonist has a Trojan-flavored name. Every field has a name after the first harvest.
5. **The gods speak through events, not mechanics.** Athena doesn't give you +5 wisdom. Athena sends an owl, and you interpret the omen.

---

*This is a living document. Update it as the game evolves.*
