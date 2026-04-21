/**
 * Procedurally-drawn pottery-style sprites.
 *
 * We generate Phaser textures at scene-preload time using the Graphics API,
 * so the prototype has zero external art dependencies while keeping the
 * red-figure / black-figure look. Later phases can replace these with
 * hand-drawn sprites without touching gameplay code.
 */

import { PALETTE } from './config.js';

/**
 * Draw a stylized pottery figure onto a Graphics object and bake it to a
 * texture. Figures are silhouettes in the "red-figure" convention: terracotta
 * body on a dark ground, with simple black detail lines.
 */
function bakeColonistTexture(scene, key, bodyColor) {
  const g = scene.add.graphics();
  const W = 24;
  const H = 36;

  // Transparent background — we're drawing just the figure
  g.fillStyle(bodyColor, 1);

  // Head
  g.fillCircle(W / 2, 6, 5);

  // Neck
  g.fillRect(W / 2 - 1, 10, 2, 3);

  // Torso (chiton — trapezoid)
  g.beginPath();
  g.moveTo(W / 2 - 5, 12);
  g.lineTo(W / 2 + 5, 12);
  g.lineTo(W / 2 + 7, 26);
  g.lineTo(W / 2 - 7, 26);
  g.closePath();
  g.fillPath();

  // Skirt / lower chiton
  g.beginPath();
  g.moveTo(W / 2 - 7, 26);
  g.lineTo(W / 2 + 7, 26);
  g.lineTo(W / 2 + 6, 32);
  g.lineTo(W / 2 - 6, 32);
  g.closePath();
  g.fillPath();

  // Legs
  g.fillRect(W / 2 - 4, 32, 3, 4);
  g.fillRect(W / 2 + 1, 32, 3, 4);

  // Detail lines in black (like pottery brushwork)
  g.lineStyle(1, PALETTE.black, 1);
  g.strokeCircle(W / 2, 6, 5);

  // Chiton fold lines
  g.beginPath();
  g.moveTo(W / 2 - 3, 14);
  g.lineTo(W / 2 - 4, 24);
  g.moveTo(W / 2 + 3, 14);
  g.lineTo(W / 2 + 4, 24);
  g.strokePath();

  // Belt
  g.lineBetween(W / 2 - 5, 22, W / 2 + 5, 22);

  g.generateTexture(key, W, H);
  g.destroy();
}

function bakeOakTexture(scene, key) {
  const g = scene.add.graphics();
  const W = 40;
  const H = 48;

  // Trunk
  g.fillStyle(PALETTE.border, 1);
  g.fillRect(W / 2 - 3, H - 16, 6, 16);
  g.lineStyle(1, PALETTE.black, 1);
  g.strokeRect(W / 2 - 3, H - 16, 6, 16);

  // Canopy — layered pottery-style circles
  g.fillStyle(PALETTE.darkOlive, 1);
  g.fillCircle(W / 2 - 8, H - 26, 10);
  g.fillCircle(W / 2 + 8, H - 26, 10);
  g.fillCircle(W / 2, H - 32, 12);

  g.fillStyle(PALETTE.olive, 1);
  g.fillCircle(W / 2 - 6, H - 28, 6);
  g.fillCircle(W / 2 + 6, H - 28, 6);
  g.fillCircle(W / 2, H - 34, 7);

  // Outline the whole canopy in black
  g.lineStyle(1.5, PALETTE.black, 1);
  g.strokeCircle(W / 2 - 8, H - 26, 10);
  g.strokeCircle(W / 2 + 8, H - 26, 10);
  g.strokeCircle(W / 2, H - 32, 12);

  g.generateTexture(key, W, H);
  g.destroy();
}

function bakeWheatTexture(scene, key) {
  const g = scene.add.graphics();
  const W = 32;
  const H = 28;

  // Ground patch
  g.fillStyle(PALETTE.wheatGold, 1);
  g.fillEllipse(W / 2, H - 4, 28, 10);
  g.lineStyle(1, PALETTE.black, 1);
  g.strokeEllipse(W / 2, H - 4, 28, 10);

  // Stalks
  g.lineStyle(1.5, PALETTE.border, 1);
  for (let i = -3; i <= 3; i++) {
    const x = W / 2 + i * 3.5;
    g.lineBetween(x, H - 6, x, 2);
  }

  // Ears — little triangles at the tops
  g.fillStyle(PALETTE.terracotta, 1);
  for (let i = -3; i <= 3; i++) {
    const x = W / 2 + i * 3.5;
    g.fillTriangle(x - 2, 4, x + 2, 4, x, -1);
  }

  g.generateTexture(key, W, H);
  g.destroy();
}

function bakeStoneTexture(scene, key) {
  const g = scene.add.graphics();
  const W = 32;
  const H = 28;

  g.fillStyle(PALETTE.stoneGrey, 1);
  g.fillEllipse(W / 2, H / 2 + 4, 22, 14);
  g.fillEllipse(W / 2 - 6, H / 2 - 2, 12, 8);
  g.fillEllipse(W / 2 + 6, H / 2 - 4, 14, 10);

  g.lineStyle(1.5, PALETTE.black, 1);
  g.strokeEllipse(W / 2, H / 2 + 4, 22, 14);
  g.strokeEllipse(W / 2 - 6, H / 2 - 2, 12, 8);
  g.strokeEllipse(W / 2 + 6, H / 2 - 4, 14, 10);

  // Shading cracks
  g.lineStyle(1, PALETTE.border, 0.8);
  g.lineBetween(W / 2 - 6, H / 2 + 2, W / 2 + 4, H / 2 + 6);
  g.lineBetween(W / 2 + 2, H / 2 - 4, W / 2 + 8, H / 2 + 2);

  g.generateTexture(key, W, H);
  g.destroy();
}

function bakeOliveTexture(scene, key) {
  const g = scene.add.graphics();
  const W = 34;
  const H = 38;

  // Trunk — gnarled and crooked
  g.fillStyle(PALETTE.border, 1);
  g.fillRect(W / 2 - 2, H - 14, 4, 14);
  g.fillRect(W / 2 - 4, H - 8, 2, 8);
  g.lineStyle(1, PALETTE.black, 1);
  g.strokeRect(W / 2 - 2, H - 14, 4, 14);

  // Silver-green canopy
  g.fillStyle(PALETTE.olive, 1);
  g.fillCircle(W / 2 - 6, H - 22, 8);
  g.fillCircle(W / 2 + 6, H - 22, 8);
  g.fillCircle(W / 2, H - 26, 9);

  // Olive dots (black, like fruit on the tree)
  g.fillStyle(PALETTE.black, 1);
  g.fillCircle(W / 2 - 8, H - 22, 1.5);
  g.fillCircle(W / 2 + 4, H - 24, 1.5);
  g.fillCircle(W / 2 - 2, H - 28, 1.5);
  g.fillCircle(W / 2 + 8, H - 20, 1.5);

  g.lineStyle(1, PALETTE.black, 1);
  g.strokeCircle(W / 2 - 6, H - 22, 8);
  g.strokeCircle(W / 2 + 6, H - 22, 8);
  g.strokeCircle(W / 2, H - 26, 9);

  g.generateTexture(key, W, H);
  g.destroy();
}

function bakeFishTexture(scene, key) {
  const g = scene.add.graphics();
  const W = 32;
  const H = 20;

  // Wave crest (the fishing spot is a stylized wave with a fish leap)
  g.fillStyle(PALETTE.cream, 1);
  g.fillEllipse(W / 2, H - 2, 28, 8);
  g.lineStyle(1, PALETTE.black, 1);
  g.strokeEllipse(W / 2, H - 2, 28, 8);

  // Leaping fish silhouette
  g.fillStyle(PALETTE.terracotta, 1);
  g.beginPath();
  g.moveTo(W / 2 + 4, 4);
  g.lineTo(W / 2 + 10, 8);
  g.lineTo(W / 2 + 14, 2);
  g.lineTo(W / 2 + 14, 14);
  g.lineTo(W / 2 + 10, 8);
  g.closePath();
  g.fillPath();

  g.lineStyle(1, PALETTE.black, 1);
  g.strokePath();

  // Fish eye
  g.fillStyle(PALETTE.black, 1);
  g.fillCircle(W / 2 + 6, 8, 1);

  g.generateTexture(key, W, H);
  g.destroy();
}

function bakeGranaryTexture(scene, key) {
  const g = scene.add.graphics();
  const W = 44;
  const H = 50;

  // Stone platform
  g.fillStyle(PALETTE.stoneGrey, 1);
  g.fillRect(2, H - 8, W - 4, 6);
  g.lineStyle(1.5, PALETTE.black, 1);
  g.strokeRect(2, H - 8, W - 4, 6);

  // Walls — amphora storage hut
  g.fillStyle(PALETTE.parchment, 1);
  g.fillRect(6, 18, W - 12, H - 26);
  g.strokeRect(6, 18, W - 12, H - 26);

  // Roof — pottery tiles
  g.fillStyle(PALETTE.terracotta, 1);
  g.beginPath();
  g.moveTo(2, 18);
  g.lineTo(W / 2, 2);
  g.lineTo(W - 2, 18);
  g.closePath();
  g.fillPath();
  g.strokePath();

  // Roof ridge lines
  g.lineStyle(0.8, PALETTE.black, 0.7);
  for (let i = 0; i < 4; i++) {
    g.lineBetween(6 + i * 4, 18 - i * 4, W - 6 - i * 4, 18 - i * 4);
  }

  // Door
  g.fillStyle(PALETTE.black, 1);
  g.fillRect(W / 2 - 4, H - 18, 8, 10);

  // Decorative meander on wall
  g.lineStyle(1, PALETTE.terracotta, 1);
  g.strokeRect(8, 20, W - 16, 3);

  g.generateTexture(key, W, H);
  g.destroy();
}

/**
 * Register every game texture with the scene. Call once from preload().
 */
export function generateAllSprites(scene) {
  bakeColonistTexture(scene, 'colonist_trojan', PALETTE.terracotta);
  bakeColonistTexture(scene, 'colonist_dardanian', PALETTE.ochre);
  bakeColonistTexture(scene, 'colonist_priestess', PALETTE.cream);
  bakeColonistTexture(scene, 'colonist_warrior', PALETTE.terracotta);

  bakeOakTexture(scene, 'node_oak');
  bakeWheatTexture(scene, 'node_wheat');
  bakeStoneTexture(scene, 'node_stone');
  bakeOliveTexture(scene, 'node_olive');
  bakeFishTexture(scene, 'node_fish');

  bakeGranaryTexture(scene, 'building_granary');
}
