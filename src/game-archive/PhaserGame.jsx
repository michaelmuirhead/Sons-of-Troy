import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { ColonyScene } from './ColonyScene.js';
import { GAME_WIDTH, GAME_HEIGHT, PALETTE_HEX } from './config.js';

/**
 * Mounts a Phaser.Game inside a <div>. React owns the DOM parent, Phaser
 * owns the <canvas>. The game communicates with the React HUD via the
 * event bus (see ../eventBus.js).
 */
export default function PhaserGame() {
  const containerRef = useRef(null);
  const gameRef = useRef(null);

  useEffect(() => {
    if (gameRef.current) return; // StrictMode double-mount guard

    const config = {
      type: Phaser.AUTO,
      parent: containerRef.current,
      width: GAME_WIDTH,
      height: GAME_HEIGHT,
      backgroundColor: PALETTE_HEX.parchment,
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      pixelArt: false,
      scene: [ColonyScene],
    };

    gameRef.current = new Phaser.Game(config);

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  return <div className="phaser-container" ref={containerRef} />;
}
