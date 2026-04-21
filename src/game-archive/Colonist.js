/**
 * Colonist — a named person living in the colony.
 *
 * MVP AI: each colonist has a job. On update, they look for the nearest
 * resource node of their job type, walk to it, harvest it (timer), then
 * deliver to the granary, then repeat. Priestess is a special "tender"
 * who wanders near the shrine/granary (flavor only in MVP).
 */

import Phaser from 'phaser';
import { RESOURCE_YIELD } from './config.js';

const STATE = {
  IDLE: 'idle',
  SEEKING: 'seeking',
  WORKING: 'working',
  RETURNING: 'returning',
  WANDERING: 'wandering',
};

const SPEED = 50; // pixels per second
const HARVEST_MS = 2500;

export class Colonist {
  constructor(scene, { id, name, origin, traits, job, x, y, textureKey }) {
    this.scene = scene;
    this.id = id;
    this.name = name;
    this.origin = origin;
    this.traits = traits || [];
    this.job = job;
    this.carrying = null;

    this.sprite = scene.add.image(x, y, textureKey).setOrigin(0.5, 1);
    this.sprite.setDepth(10);

    // Name label — small, like a pottery inscription
    this.label = scene.add.text(x, y - 40, name, {
      fontFamily: 'Palatino Linotype, serif',
      fontSize: '11px',
      color: '#f4ecd8',
      backgroundColor: '#1a1a1a',
      padding: { x: 3, y: 1 },
    }).setOrigin(0.5, 0.5);
    this.label.setDepth(11);

    this.state = STATE.IDLE;
    this.target = null;
    this.harvestTimer = 0;
    this.wanderTarget = null;
    this.wanderTimer = 0;
  }

  setJob(job) {
    this.job = job;
  }

  get x() { return this.sprite.x; }
  get y() { return this.sprite.y; }

  update(delta) {
    // Keep label pinned above sprite
    this.label.x = this.sprite.x;
    this.label.y = this.sprite.y - 40;

    switch (this.state) {
      case STATE.IDLE:      return this.tickIdle();
      case STATE.SEEKING:   return this.tickSeeking(delta);
      case STATE.WORKING:   return this.tickWorking(delta);
      case STATE.RETURNING: return this.tickReturning(delta);
      case STATE.WANDERING: return this.tickWandering(delta);
    }
  }

  tickIdle() {
    // Find the nearest node of the job-matching type
    const node = this.scene.findNearestNode(this.job, this.x, this.y);
    if (node) {
      this.target = node;
      this.state = STATE.SEEKING;
    } else {
      // No work — wander a bit
      this.wanderTarget = {
        x: this.scene.granary.x + Phaser.Math.Between(-80, 80),
        y: this.scene.granary.y + Phaser.Math.Between(-60, 60),
      };
      this.state = STATE.WANDERING;
      this.wanderTimer = 0;
    }
  }

  tickSeeking(delta) {
    if (!this.target || !this.target.active) {
      this.state = STATE.IDLE;
      return;
    }
    const reached = this.moveToward(this.target.x, this.target.y - 10, delta);
    if (reached) {
      this.state = STATE.WORKING;
      this.harvestTimer = 0;
    }
  }

  tickWorking(delta) {
    this.harvestTimer += delta;
    if (this.harvestTimer >= HARVEST_MS) {
      // Harvest!
      if (this.target && this.target.active) {
        const yieldDef = RESOURCE_YIELD[this.target.resourceType] || {};
        this.carrying = { ...yieldDef };
        this.target.consume(); // removes/respawns the node
      }
      this.target = null;
      this.state = STATE.RETURNING;
    }
  }

  tickReturning(delta) {
    const g = this.scene.granary;
    const reached = this.moveToward(g.x, g.y, delta);
    if (reached) {
      if (this.carrying) {
        this.scene.depositResources(this.carrying, this);
        this.carrying = null;
      }
      this.state = STATE.IDLE;
    }
  }

  tickWandering(delta) {
    this.wanderTimer += delta;
    if (!this.wanderTarget || this.wanderTimer > 3000) {
      this.state = STATE.IDLE;
      return;
    }
    const reached = this.moveToward(this.wanderTarget.x, this.wanderTarget.y, delta);
    if (reached) {
      this.wanderTarget = null;
      this.state = STATE.IDLE;
    }
  }

  moveToward(tx, ty, delta) {
    const dx = tx - this.sprite.x;
    const dy = ty - this.sprite.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 2) return true;
    const step = (SPEED * delta) / 1000;
    if (step >= dist) {
      this.sprite.x = tx;
      this.sprite.y = ty;
      return true;
    }
    this.sprite.x += (dx / dist) * step;
    this.sprite.y += (dy / dist) * step;
    // Flip horizontally based on movement direction
    this.sprite.flipX = dx < 0;
    return false;
  }

  destroy() {
    this.sprite.destroy();
    this.label.destroy();
  }
}

/**
 * Roster of Trojan names. Real names from the Iliad and the broader Trojan
 * legendarium, plus Dardanian / Anatolian flavor names.
 */
export const TROJAN_NAMES = {
  male: [
    'Helenus', 'Pandarus', 'Troilus', 'Aesyetes', 'Antenor',
    'Coroebus', 'Deiphobus', 'Polites', 'Misenus', 'Cleanthes',
    'Cyzicus', 'Dymas', 'Iphitus', 'Panthus', 'Thymbraeus',
  ],
  female: [
    'Cassandra', 'Andromache', 'Briseis', 'Hecuba', 'Polyxena',
    'Laodice', 'Creusa', 'Iliona', 'Thymele', 'Kallirhoe',
    'Aeithusa', 'Xanthe', 'Thetis', 'Pyrrha', 'Melite',
  ],
};

export const ORIGINS = [
  'Born in Troy',
  'Born in Dardania',
  'Born in Thrace',
  'Freed slave of Troy',
  'Lycian ally',
];

export const TRAITS_POOL = [
  'Pious', 'Grieving', 'Swift-footed', 'Bronze-tongued',
  'Scarred', 'Dreamer', 'Ox-strong', 'Honey-voiced',
  'Sea-wary', 'Seer-touched', 'Temperate', 'Fierce',
];
