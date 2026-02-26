# OnePixel — Tower Climbing Game

## Context
Creating a new 2D tower climbing game from scratch. The player ascends an endless procedural tower, jumping between platforms and collecting coins/gems for points. Built with Phaser 3 + TypeScript + Vite + pnpm.

## Tech Stack
- **Phaser 3** — HTML5 game framework (arcade physics)
- **TypeScript** — type-safe game logic
- **Vite** — dev server + bundler (port 8080)
- **pnpm** — package manager

## Game Design
- Vertical platformer — player jumps upward through procedurally generated platforms
- Camera follows player up, never scrolls down — falling below the screen = death
- Coins (10pts) and gems (50pts) float above platforms
- Difficulty increases with height: platforms get narrower, spacing increases, moving platforms appear
- Screen wrap: run off one side, appear on the other
- Responsive controls: coyote time, jump buffering, variable jump height (tap vs hold)
- High score persisted in localStorage

## Project Structure
```
OnePixel/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── .gitignore
└── src/
    ├── main.ts                          # Entry point, creates Phaser.Game
    ├── game/
    │   ├── GameConfig.ts                # Phaser config (480x640, arcade physics)
    │   ├── constants.ts                 # All tuning values (physics, spawn rates, colors)
    │   ├── scenes/
    │   │   ├── BootScene.ts             # Generate textures, transition to Preload
    │   │   ├── PreloadScene.ts          # (reserved for future asset loading)
    │   │   ├── MenuScene.ts             # Title screen, high score, start
    │   │   ├── GameScene.ts             # Main game loop orchestrator
    │   │   └── GameOverScene.ts         # Score display, retry/menu
    │   ├── entities/
    │   │   └── Player.ts                # Movement, jump physics, screen wrap
    │   ├── systems/
    │   │   ├── PlatformManager.ts       # Procedural platform generation + recycling
    │   │   ├── CollectibleManager.ts    # Coin/gem spawning + bobbing animation
    │   │   ├── DifficultyManager.ts     # Height-based difficulty scaling
    │   │   ├── CameraController.ts      # Smooth upward-only camera follow
    │   │   └── ScoreManager.ts          # Score tracking + localStorage high score
    │   ├── ui/
    │   │   ├── HUD.ts                   # Score/height overlay
    │   │   └── ParticleEffects.ts       # Jump dust + collect burst
    │   └── utils/
    │       ├── TextureGenerator.ts      # Programmatic sprite generation (no external assets)
    │       └── MathHelpers.ts           # clamp, lerp, randomBetween
```

## Implementation Phases

### Phase 1: Project Scaffold
- `pnpm init`, install `phaser`, dev deps `typescript vite`
- Create `index.html`, `tsconfig.json`, `vite.config.ts`, `.gitignore`
- Create `src/main.ts` + `GameConfig.ts` with Phaser config (480x640, arcade physics)
- Stub all 5 scenes — verify blank Phaser canvas at `localhost:8080`

### Phase 2: Constants + Texture Generation
- `constants.ts` — all physics/spawn/color values in one file
- `TextureGenerator.ts` — programmatic sprites via Phaser graphics (player rectangle, platforms, coins, gems, particles)
- Wire into BootScene → verify textures render

### Phase 3: Player Movement
- `Player.ts` — horizontal acceleration/deceleration, jump with coyote time + jump buffer, variable jump height, screen wrap
- Test on a static platform, tune until controls feel tight

### Phase 4: Platform System
- `DifficultyManager.ts` — height-driven difficulty level (0–10)
- `PlatformManager.ts` — generate initial platforms, spawn new ones above camera, destroy below camera, moving platforms at higher difficulty
- Wire collisions in GameScene

### Phase 5: Camera + Death
- `CameraController.ts` — smooth lerp follow, only moves up, death line detection
- Player falling below screen triggers game over

### Phase 6: Collectibles
- `CollectibleManager.ts` — spawn coins/gems above platforms, bobbing animation, cleanup
- Wire overlap collision → score

### Phase 7: Score + HUD
- `ScoreManager.ts` — height score + collectible score, localStorage persistence
- `HUD.ts` — score top-left, height top-right, pickup popup

### Phase 8: Particles
- `ParticleEffects.ts` — jump dust, collect burst with colored tint

### Phase 9: Menus + Polish
- MenuScene — title, high score, "press space" prompt
- GameOverScene — stats, new high score callout, retry/menu
- Camera shake on death

### Phase 10: Difficulty Tuning
- Moving platforms wired to difficulty level
- Platform width/spacing/moving chance scale with height
- Final playtest + balance pass

## Key Design Decisions
- **480x640 portrait** — classic mobile-friendly arcade ratio
- **No external assets** — all sprites generated programmatically, zero art dependency
- **Screen wrap** — adds emergent strategy (launch off one side, catch platform on other)
- **Coyote time + jump buffer** — invisible polish that makes controls feel fair
- **Systems architecture** — each system is independent, GameScene orchestrates them

## Verification
1. `pnpm dev` → game loads at localhost:8080
2. Menu screen shows, space starts game
3. Player can move left/right, jump between platforms
4. Camera follows upward, platforms generate endlessly
5. Coins/gems appear and can be collected for score
6. Falling below screen → GameOver with score + high score
7. Difficulty increases noticeably after climbing ~5000px
8. Screen wrap works at left/right edges
