/**
 * A harvestable resource node on the map. Has a position, a type, and a
 * texture. When "consumed" it fades and respawns after a delay so the
 * prototype can loop forever without running out.
 */

import { RESOURCE_JOB } from './config.js';

const RESPAWN_MS = 12_000;

const TEXTURE_BY_TYPE = {
  wheat: 'node_wheat',
  oak: 'node_oak',
  stone: 'node_stone',
  olive: 'node_olive',
  fish: 'node_fish',
};

export class ResourceNode {
  constructor(scene, { id, x, y, resourceType }) {
    this.scene = scene;
    this.id = id;
    this.resourceType = resourceType;
    this.job = RESOURCE_JOB[resourceType];
    this.active = true;

    const textureKey = TEXTURE_BY_TYPE[resourceType] || 'node_oak';
    this.sprite = scene.add.image(x, y, textureKey).setOrigin(0.5, 1);
    this.sprite.setDepth(5);
    this.x = x;
    this.y = y;

    this.respawnTimer = 0;
  }

  consume() {
    this.active = false;
    this.sprite.setAlpha(0.15);
    this.respawnTimer = RESPAWN_MS;
  }

  update(delta) {
    if (!this.active) {
      this.respawnTimer -= delta;
      if (this.respawnTimer <= 0) {
        this.active = true;
        this.sprite.setAlpha(1);
      }
    }
  }

  destroy() {
    this.sprite.destroy();
  }
}
