import Phaser from 'phaser';
import {
  PARTICLE_JUMP_LIFESPAN,
  PARTICLE_JUMP_COUNT,
  PARTICLE_COLLECT_LIFESPAN,
  PARTICLE_COLLECT_COUNT,
} from '../constants';

export class ParticleEffects {
  private scene: Phaser.Scene;
  private jumpEmitter!: Phaser.GameObjects.Particles.ParticleEmitter;
  private coinEmitter!: Phaser.GameObjects.Particles.ParticleEmitter;
  private gemEmitter!: Phaser.GameObjects.Particles.ParticleEmitter;
  private emeraldEmitter!: Phaser.GameObjects.Particles.ParticleEmitter;
  private rainbowEmitter!: Phaser.GameObjects.Particles.ParticleEmitter;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.createEmitters();
  }

  private createEmitters(): void {
    // Jump dust emitter
    if (this.scene.textures.exists('particle-white')) {
      this.jumpEmitter = this.scene.add
        .particles(0, 0, 'particle-white', {
          speed: { min: 20, max: 60 },
          angle: { min: 230, max: 310 },
          scale: { start: 0.6, end: 0 },
          lifespan: PARTICLE_JUMP_LIFESPAN,
          gravityY: 100,
          quantity: 0,
          emitting: false,
        })
        .setDepth(50);
    }

    // Coin collect emitter
    if (this.scene.textures.exists('particle-gold')) {
      this.coinEmitter = this.scene.add
        .particles(0, 0, 'particle-gold', {
          speed: { min: 60, max: 120 },
          angle: { min: 0, max: 360 },
          scale: { start: 0.8, end: 0 },
          lifespan: PARTICLE_COLLECT_LIFESPAN,
          gravityY: 50,
          quantity: 0,
          emitting: false,
        })
        .setDepth(50);
    }

    // Gem collect emitter
    if (this.scene.textures.exists('particle-cyan')) {
      this.gemEmitter = this.scene.add
        .particles(0, 0, 'particle-cyan', {
          speed: { min: 80, max: 150 },
          angle: { min: 0, max: 360 },
          scale: { start: 0.8, end: 0 },
          lifespan: PARTICLE_COLLECT_LIFESPAN,
          gravityY: 50,
          quantity: 0,
          emitting: false,
        })
        .setDepth(50);
    }

    // Emerald collect emitter
    if (this.scene.textures.exists('particle-green')) {
      this.emeraldEmitter = this.scene.add
        .particles(0, 0, 'particle-green', {
          speed: { min: 100, max: 180 },
          angle: { min: 0, max: 360 },
          scale: { start: 1, end: 0 },
          lifespan: PARTICLE_COLLECT_LIFESPAN,
          gravityY: 50,
          quantity: 0,
          emitting: false,
        })
        .setDepth(50);
    }

    // Rainbow collect emitter (legendary!)
    if (this.scene.textures.exists('particle-rainbow')) {
      this.rainbowEmitter = this.scene.add
        .particles(0, 0, 'particle-rainbow', {
          speed: { min: 150, max: 300 },
          angle: { min: 0, max: 360 },
          scale: { start: 1.5, end: 0 },
          lifespan: 800,
          gravityY: 30,
          quantity: 0,
          emitting: false,
        })
        .setDepth(50);
    }
  }

  emitJump(x: number, y: number): void {
    if (this.jumpEmitter) {
      this.jumpEmitter.emitParticleAt(x, y, PARTICLE_JUMP_COUNT);
    }
  }

  emitCoinCollect(x: number, y: number): void {
    if (this.coinEmitter) {
      this.coinEmitter.emitParticleAt(x, y, PARTICLE_COLLECT_COUNT);
    }
  }

  emitGemCollect(x: number, y: number): void {
    if (this.gemEmitter) {
      this.gemEmitter.emitParticleAt(x, y, PARTICLE_COLLECT_COUNT);
    }
  }

  emitEmeraldCollect(x: number, y: number): void {
    if (this.emeraldEmitter) {
      this.emeraldEmitter.emitParticleAt(x, y, PARTICLE_COLLECT_COUNT);
    }
  }

  emitRainbowCollect(x: number, y: number): void {
    if (this.rainbowEmitter) {
      // Epic particle burst for the legendary rainbowite!
      this.rainbowEmitter.emitParticleAt(x, y, 30);
    }
  }
}
