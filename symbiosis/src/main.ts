import Phaser from 'phaser';
import { GAME_CONFIG } from './config/GameConfig';
import { BootScene } from './scenes/BootScene';
import { MenuScene } from './scenes/MenuScene';
import { LobbyScene } from './scenes/LobbyScene';
import { GameScene } from './scenes/GameScene';
import { ResultScene } from './scenes/ResultScene';

// Phaser Game Configuration
const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: GAME_CONFIG.WIDTH,
  height: GAME_CONFIG.HEIGHT,
  parent: 'game-container',
  backgroundColor: GAME_CONFIG.COLORS.BACKGROUND,
  pixelArt: false,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: GAME_CONFIG.PHYSICS.GRAVITY },
      debug: false, // Set to true for hitbox visualization
    },
  },
  scene: [BootScene, MenuScene, LobbyScene, GameScene, ResultScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};

// Create the game instance
const game = new Phaser.Game(config);

export default game;
