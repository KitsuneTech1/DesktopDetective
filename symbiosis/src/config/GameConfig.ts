// Game Configuration Constants
export const GAME_CONFIG = {
  WIDTH: 1280,
  HEIGHT: 720,
  
  // Colors (hex values for Phaser)
  COLORS: {
    BACKGROUND: 0x0a0a0f,
    GRID: 0x1a1a2e,
    HOST: 0x00fff7,
    PARASITE_1: 0xff00ff,
    PARASITE_2: 0xffaa00,
    PARASITE_3: 0x00ff88,
    TETHER_SAFE: 0x00ff88,
    TETHER_WARN: 0xffaa00,
    TETHER_DANGER: 0xff0044,
    OBSTACLE: 0xff0044,
    CHECKPOINT: 0x7b2cbf,
    PLATFORM: 0x333344,
    FINISH: 0x00ff88,
  },

  // Physics
  PHYSICS: {
    GRAVITY: 1200,
    HOST_SPEED: 280,
    HOST_JUMP: -550,
    PARASITE_SPEED: 380,
    PARASITE_JUMP: -480,
  },

  // Tether
  TETHER: {
    MAX_LENGTH: 400,
    WARN_LENGTH: 300,
    SAFE_LENGTH: 200,
  },

  // Timer
  DEFAULT_TIME: 60, // seconds
};

// Player color palette for multiplayer
export const PLAYER_COLORS = [
  0x00fff7, // Cyan (Host)
  0xff00ff, // Magenta (P2)
  0xffaa00, // Orange (P3)
  0x00ff88, // Green (P4)
];

// Control mappings for 4 players
export const CONTROLS = {
  PLAYER_1: { left: 'A', right: 'D', jump: 'W' },
  PLAYER_2: { left: 'LEFT', right: 'RIGHT', jump: 'UP' },
  PLAYER_3: { left: 'J', right: 'L', jump: 'I' },
  PLAYER_4: { left: 'NUMPAD_FOUR', right: 'NUMPAD_SIX', jump: 'NUMPAD_EIGHT' },
};

// Obstacle types
export enum ObstacleType {
  SPIKE = 'spike',
  SAW = 'saw',
  LASER = 'laser',
  CRUSHER = 'crusher',
  PLATFORM = 'platform',
  MOVING_PLATFORM = 'moving_platform',
}

// Player roles
export enum PlayerRole {
  HOST = 'host',
  PARASITE = 'parasite',
}
