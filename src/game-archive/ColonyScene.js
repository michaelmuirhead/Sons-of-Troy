/**
 * ColonyScene — the main gameplay scene.
 *
 * Responsibilities:
 *  - Draw the terrain in pottery-palette tiles
 *  - Place the granary (deposit point) and shrine
 *  - Spawn named Trojan colonists with jobs
 *  - Spawn and respawn resource nodes
 *  - Run the seasonal clock
 *  - Roll for Trojan-flavored story events
 *  - Broadcast state updates over the event bus to the React HUD
 */

import Phaser from 'phaser';
import { eventBus, EVT } from '../eventBus.js';
import { generateAllSprites } from './sprites.js';
import { Colonist, TROJAN_NAMES, ORIGINS, TRAITS_POOL } from './Colonist.js';
import { ResourceNode } from './ResourceNode.js';
import {
  PALETTE,
  GAME_WIDTH,
  GAME_HEIGHT,
  RESOURCE,
  SEASON_LENGTH_MS,
  SEASONS,
  EVENT_ROLL_INTERVAL_MS,
  EVENT_CHANCE,
} from './config.js';
import { EVENT_POOL, pickEvent } from './events.js';

export class ColonyScene extends Phaser.Scene {
  constructor() {
    super({ key: 'ColonyScene' });
  }

  preload() {
    generateAllSprites(this);
  }

  create() {
    // ---- Colony state ----
    this.state = {
      colonyName: 'New Ilion',
      day: 1,
      seasonIndex: 0,
      season: SEASONS[0],
      resources: { food: 40, wood: 20, stone: 10, pottery: 0 },
      colonists: [],
      log: [],
      paused: false,
    };

    this.drawTerrain();
    this.drawGranary();
    this.drawShrine();
    this.spawnResourceNodes();
    this.spawnInitialColonists();

    this.seasonTimer = 0;
    this.eventTimer = 0;

    // Listen for event-modal choice results from React
    this.unsubChoice = eventBus.on(EVT.EVENT_CHOICE, ({ eventId, choiceId }) => {
      this.applyEventChoice(eventId, choiceId);
    });

    // Initial log + state broadcast
    this.log('The Trojan ship grounds on the beach. Smoke of Ilium fades astern.');
    this.log('Our captain steps ashore and names this place New Ilion.');
    this.broadcast();

    // Tooltip when hovering a colonist
    this.input.on('gameobjectover', (_p, obj) => {
      if (obj._colonistRef) {
        obj._colonistRef.label.setColor('#c44536');
      }
    });
    this.input.on('gameobjectout', (_p, obj) => {
      if (obj._colonistRef) {
        obj._colonistRef.label.setColor('#f4ecd8');
      }
    });

    this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
      if (this.unsubChoice) this.unsubChoice();
    });
  }

  // ---------------- Terrain ----------------

  drawTerrain() {
    // Big cream background (unfired clay)
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, PALETTE.parchment);

    // Sea band along the bottom
    const seaBand = this.add.graphics();
    seaBand.fillStyle(PALETTE.aegean, 1);
    seaBand.fillRect(0, GAME_HEIGHT - 120, GAME_WIDTH, 120);
    // Sea/land border — stylized wave line
    seaBand.lineStyle(3, PALETTE.black, 1);
    seaBand.beginPath();
    seaBand.moveTo(0, GAME_HEIGHT - 120);
    for (let x = 0; x <= GAME_WIDTH; x += 16) {
      const y = GAME_HEIGHT - 120 + Math.sin(x / 20) * 3;
      seaBand.lineTo(x, y);
    }
    seaBand.strokePath();

    // Sea meander pattern (Greek key) in cream on top of the water
    seaBand.lineStyle(2, PALETTE.cream, 0.8);
    for (let x = 20; x < GAME_WIDTH; x += 60) {
      const y = GAME_HEIGHT - 60;
      seaBand.strokeRect(x, y, 20, 10);
      seaBand.lineBetween(x + 5, y + 2, x + 15, y + 2);
    }

    // A few cream sand dunes
    const sand = this.add.graphics();
    sand.fillStyle(PALETTE.cream, 1);
    sand.fillEllipse(140, GAME_HEIGHT - 125, 200, 30);
    sand.fillEllipse(520, GAME_HEIGHT - 130, 240, 36);
    sand.fillEllipse(820, GAME_HEIGHT - 125, 180, 28);

    // Hills / inland elevations
    const hills = this.add.graphics();
    hills.fillStyle(PALETTE.ochre, 0.55);
    hills.fillEllipse(220, 140, 280, 80);
    hills.fillEllipse(720, 110, 340, 90);
    hills.lineStyle(2, PALETTE.black, 0.35);
    hills.strokeEllipse(220, 140, 280, 80);
    hills.strokeEllipse(720, 110, 340, 90);

    // Top decorative meander border (like a pottery frieze)
    this.drawFrieze(0, 0, GAME_WIDTH, 20);
    // Bottom frieze above the sea
    this.drawFrieze(0, GAME_HEIGHT - 140, GAME_WIDTH, 10);
  }

  drawFrieze(x, y, width, height) {
    const g = this.add.graphics();
    g.fillStyle(PALETTE.black, 1);
    g.fillRect(x, y, width, height);
    g.lineStyle(2, PALETTE.terracotta, 1);
    for (let i = x; i < x + width; i += 30) {
      g.strokeRect(i + 4, y + 3, 20, height - 6);
      g.lineBetween(i + 8, y + height / 2, i + 20, y + height / 2);
    }
  }

  // ---------------- Buildings ----------------

  drawGranary() {
    const gx = 460;
    const gy = 280;
    this.granary = this.add.image(gx, gy, 'building_granary').setOrigin(0.5, 1);
    this.granary.setDepth(6);

    // Nameplate
    this.add.text(gx, gy + 4, 'Granary of the Captain', {
      fontFamily: 'Palatino Linotype, serif',
      fontSize: '11px',
      color: '#1a1a1a',
      backgroundColor: '#f4ecd8',
      padding: { x: 4, y: 2 },
    }).setOrigin(0.5, 0).setDepth(7);
  }

  drawShrine() {
    const x = 620;
    const y = 180;
    const g = this.add.graphics();
    // Platform
    g.fillStyle(PALETTE.stoneGrey, 1);
    g.fillRect(x - 22, y, 44, 8);
    g.lineStyle(1, PALETTE.black, 1);
    g.strokeRect(x - 22, y, 44, 8);

    // Two columns
    g.fillStyle(PALETTE.cream, 1);
    g.fillRect(x - 18, y - 30, 6, 30);
    g.fillRect(x + 12, y - 30, 6, 30);
    g.strokeRect(x - 18, y - 30, 6, 30);
    g.strokeRect(x + 12, y - 30, 6, 30);

    // Pediment
    g.fillStyle(PALETTE.terracotta, 1);
    g.beginPath();
    g.moveTo(x - 22, y - 30);
    g.lineTo(x, y - 46);
    g.lineTo(x + 22, y - 30);
    g.closePath();
    g.fillPath();
    g.strokePath();

    // Flame / altar inside
    g.fillStyle(PALETTE.ochre, 1);
    g.fillTriangle(x, y - 10, x - 4, y - 2, x + 4, y - 2);

    g.setDepth(6);

    this.add.text(x, y + 10, 'Shrine of Athena', {
      fontFamily: 'Palatino Linotype, serif',
      fontSize: '11px',
      color: '#1a1a1a',
      backgroundColor: '#f4ecd8',
      padding: { x: 4, y: 2 },
    }).setOrigin(0.5, 0).setDepth(7);
  }

  // ---------------- Resource nodes ----------------

  spawnResourceNodes() {
    this.nodes = [];

    const nodeSpecs = [
      // wheat fields (inland meadow)
      ...this.grid(120, 220, 3, 2, 44, 40, RESOURCE.WHEAT),
      // olive grove
      ...this.grid(260, 360, 3, 2, 46, 42, RESOURCE.OLIVE),
      // oaks
      ...this.grid(60, 60, 2, 2, 60, 60, RESOURCE.OAK),
      ...this.grid(820, 260, 2, 2, 54, 54, RESOURCE.OAK),
      // stone outcrops
      ...this.grid(720, 330, 3, 1, 48, 0, RESOURCE.STONE),
      // fishing spots along the coast
      ...this.grid(160, GAME_HEIGHT - 80, 4, 1, 120, 0, RESOURCE.FISH),
    ];

    nodeSpecs.forEach((spec, i) => {
      const node = new ResourceNode(this, {
        id: `node_${i}`,
        x: spec.x,
        y: spec.y,
        resourceType: spec.type,
      });
      this.nodes.push(node);
    });
  }

  grid(startX, startY, cols, rows, dx, dy, type) {
    const out = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        out.push({
          x: startX + c * dx + Phaser.Math.Between(-4, 4),
          y: startY + r * dy + Phaser.Math.Between(-4, 4),
          type,
        });
      }
    }
    return out;
  }

  findNearestNode(job, fromX, fromY) {
    let best = null;
    let bestD = Infinity;
    for (const n of this.nodes) {
      if (!n.active) continue;
      if (n.job !== job) continue;
      const dx = n.x - fromX;
      const dy = n.y - fromY;
      const d = dx * dx + dy * dy;
      if (d < bestD) {
        bestD = d;
        best = n;
      }
    }
    return best;
  }

  // ---------------- Colonists ----------------

  spawnInitialColonists() {
    const captainJobs = ['farmer', 'woodcutter', 'fisher', 'quarryman', 'farmer'];
    const textureKeys = [
      'colonist_trojan', 'colonist_warrior', 'colonist_dardanian',
      'colonist_priestess', 'colonist_trojan',
    ];

    // Hand-crafted starting five — the founding Trojans
    const founders = [
      { name: 'Helenus of Ilion',    origin: 'Born in Troy',        traits: ['Seer-touched', 'Pious'] },
      { name: 'Andromache',          origin: 'Born in Troy',        traits: ['Grieving', 'Temperate'] },
      { name: 'Pandarus the Archer', origin: 'Lycian ally',         traits: ['Swift-footed', 'Scarred'] },
      { name: 'Cassandra',           origin: 'Born in Troy',        traits: ['Seer-touched', 'Dreamer'] },
      { name: 'Dymas of Dardania',   origin: 'Born in Dardania',    traits: ['Ox-strong', 'Fierce'] },
    ];

    founders.forEach((f, i) => {
      const c = new Colonist(this, {
        id: `colonist_${i}`,
        name: f.name,
        origin: f.origin,
        traits: f.traits,
        job: captainJobs[i],
        x: this.granary.x + Phaser.Math.Between(-60, 60),
        y: this.granary.y + Phaser.Math.Between(-40, 40),
        textureKey: textureKeys[i],
      });
      c.sprite._colonistRef = c;
      c.sprite.setInteractive();
      this.state.colonists.push(c);
    });
  }

  // ---------------- Core loop ----------------

  update(_time, delta) {
    if (this.state.paused) return;

    for (const c of this.state.colonists) c.update(delta);
    for (const n of this.nodes) n.update(delta);

    // Seasons
    this.seasonTimer += delta;
    if (this.seasonTimer >= SEASON_LENGTH_MS) {
      this.seasonTimer = 0;
      this.state.seasonIndex = (this.state.seasonIndex + 1) % SEASONS.length;
      this.state.season = SEASONS[this.state.seasonIndex];
      this.state.day += 1;
      this.log(`${this.state.season} comes to the harbor.`);
      this.applySeasonTint();
      this.broadcast();
    }

    // Events
    this.eventTimer += delta;
    if (this.eventTimer >= EVENT_ROLL_INTERVAL_MS) {
      this.eventTimer = 0;
      if (Math.random() < EVENT_CHANCE) {
        this.fireRandomEvent();
      }
    }
  }

  applySeasonTint() {
    // Subtle full-screen tint via a semi-transparent overlay that we reuse
    if (!this.tintOverlay) {
      this.tintOverlay = this.add.rectangle(
        GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, PALETTE.cream, 0
      ).setDepth(50);
    }
    const tints = {
      Spring: { color: PALETTE.olive,     alpha: 0.05 },
      Summer: { color: PALETTE.wheatGold, alpha: 0.08 },
      Autumn: { color: PALETTE.terracotta, alpha: 0.08 },
      Winter: { color: PALETTE.aegean,    alpha: 0.12 },
    };
    const t = tints[this.state.season];
    this.tintOverlay.fillColor = t.color;
    this.tintOverlay.fillAlpha = t.alpha;
  }

  depositResources(carry, colonist) {
    if (!carry) return;
    for (const [k, v] of Object.entries(carry)) {
      this.state.resources[k] = (this.state.resources[k] || 0) + v;
    }
    const line = Object.entries(carry).map(([k, v]) => `+${v} ${k}`).join(', ');
    this.log(`${colonist.name} delivers ${line}.`);
    this.broadcast();
  }

  // ---------------- Story events ----------------

  fireRandomEvent() {
    const evt = pickEvent(this.state);
    if (!evt) return;
    eventBus.emit(EVT.EVENT_FIRE, evt);
    this.log(`Event: ${evt.title}`);
    this.broadcast();
  }

  applyEventChoice(eventId, choiceId) {
    const evt = EVENT_POOL.find((e) => e.id === eventId);
    if (!evt) return;
    const choice = evt.choices.find((c) => c.id === choiceId);
    if (!choice) return;

    // Apply resource effects
    if (choice.effects) {
      for (const [k, v] of Object.entries(choice.effects)) {
        this.state.resources[k] = (this.state.resources[k] || 0) + v;
      }
    }

    // Apply colonist effects
    if (choice.addColonist) {
      const i = this.state.colonists.length;
      const c = new Colonist(this, {
        id: `colonist_${Date.now()}`,
        name: choice.addColonist.name,
        origin: choice.addColonist.origin,
        traits: choice.addColonist.traits,
        job: choice.addColonist.job,
        x: this.granary.x + Phaser.Math.Between(-40, 40),
        y: this.granary.y + Phaser.Math.Between(-20, 20),
        textureKey: 'colonist_dardanian',
      });
      c.sprite._colonistRef = c;
      c.sprite.setInteractive();
      this.state.colonists.push(c);
    }

    this.log(`→ ${choice.logLine || choice.label}`);
    this.broadcast();
  }

  // ---------------- State broadcast ----------------

  log(line) {
    const entry = { day: this.state.day, season: this.state.season, line };
    this.state.log.unshift(entry);
    if (this.state.log.length > 50) this.state.log.length = 50;
    eventBus.emit(EVT.LOG, entry);
  }

  broadcast() {
    eventBus.emit(EVT.STATE_UPDATE, {
      colonyName: this.state.colonyName,
      day: this.state.day,
      season: this.state.season,
      resources: { ...this.state.resources },
      colonists: this.state.colonists.map((c) => ({
        id: c.id,
        name: c.name,
        origin: c.origin,
        traits: c.traits,
        job: c.job,
      })),
      log: [...this.state.log],
    });
  }
}
