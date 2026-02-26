// Game dimensions
export const GAME_WIDTH = 480;
export const GAME_HEIGHT = 640;

// Player physics
export const PLAYER_WIDTH = 24;
export const PLAYER_HEIGHT = 32;
export const PLAYER_SPEED = 200;
export const PLAYER_ACCELERATION = 2000;
export const PLAYER_DRAG = 2000;
export const PLAYER_JUMP_VELOCITY = -600;
export const PLAYER_GRAVITY = 980;

// Jump feel
export const COYOTE_TIME_MS = 80;
export const JUMP_BUFFER_MS = 100;
export const VARIABLE_JUMP_MULTIPLIER = 0.4;

// Platform settings
export const PLATFORM_HEIGHT = 16;
export const PLATFORM_MIN_WIDTH = 60;
export const PLATFORM_MAX_WIDTH = 140;
export const PLATFORM_VERTICAL_SPACING_MIN = 80;
export const PLATFORM_VERTICAL_SPACING_MAX = 140;
export const PLATFORM_HORIZONTAL_MARGIN = 30;

// Moving platforms
export const MOVING_PLATFORM_SPEED = 80;
export const MOVING_PLATFORM_RANGE_MIN = 60;
export const MOVING_PLATFORM_RANGE_MAX = 120;

// Collectibles
export const COIN_SIZE = 16;
export const GEM_SIZE = 20;
export const EMERALD_SIZE = 22;
export const RAINBOWITE_SIZE = 28;
export const COIN_VALUE = 10;
export const GEM_VALUE = 50;
export const EMERALD_VALUE = 100;
export const RAINBOWITE_VALUE = 1000000000000;
export const COLLECTIBLE_BOB_SPEED = 2;
export const COLLECTIBLE_BOB_AMOUNT = 4;
export const COLLECTIBLE_SPAWN_CHANCE = 0.4;
export const GEM_CHANCE = 0.15;
export const EMERALD_CHANCE = 0.05;
export const RAINBOWITE_CHANCE = 0.0000000000000001;

// Difficulty scaling
export const DIFFICULTY_MAX_LEVEL = 10;
export const DIFFICULTY_HEIGHT_PER_LEVEL = 10000;

// Goal
export const GOAL_HEIGHT = 110000;
export const DIFFICULTY_MOVING_PLATFORM_CHANCE_BASE = 0.1;
export const DIFFICULTY_MOVING_PLATFORM_CHANCE_MAX = 0.5;
export const DIFFICULTY_WIDTH_MULTIPLIER_MIN = 0.5;
export const DIFFICULTY_SPACING_MULTIPLIER_MAX = 1.5;

// Camera
export const CAMERA_LERP = 0.1;
export const CAMERA_DEAD_ZONE = 50;

// Colors (hex values for Phaser)
export const COLOR = {
  BACKGROUND: 0x16213e,
  PLAYER: 0xe94560,
  PLATFORM: 0x4a4a6a,
  PLATFORM_TOP: 0x6a6a8a,
  COIN: 0xffd700,
  COIN_DARK: 0xb8860b,
  GEM: 0x00ffff,
  GEM_DARK: 0x008b8b,
  EMERALD: 0x50c878,
  EMERALD_DARK: 0x2e8b57,
  RAINBOWITE: 0xffffff,
  TEXT: 0xffffff,
  PARTICLE_JUMP: 0xcccccc,
  PARTICLE_COIN: 0xffd700,
  PARTICLE_GEM: 0x00ffff,
  PARTICLE_EMERALD: 0x50c878,
  PARTICLE_RAINBOW: 0xffffff,
};

// Particle settings
export const PARTICLE_JUMP_LIFESPAN = 300;
export const PARTICLE_JUMP_COUNT = 5;
export const PARTICLE_COLLECT_LIFESPAN = 400;
export const PARTICLE_COLLECT_COUNT = 8;

// Score
export const HEIGHT_SCORE_INTERVAL = 100;
export const HEIGHT_SCORE_POINTS = 1;
