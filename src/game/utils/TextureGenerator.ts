import Phaser from 'phaser';
import {
  PLAYER_WIDTH,
  PLAYER_HEIGHT,
  PLATFORM_HEIGHT,
  COIN_SIZE,
  GEM_SIZE,
  EMERALD_SIZE,
  RAINBOWITE_SIZE,
  COLOR,
} from '../constants';

export class TextureGenerator {
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  generateAll(): void {
    this.generatePlayer('player', COLOR.PLAYER);
    this.generatePlayer('player2', 0x00aaff);
    this.generatePlatform(PLATFORM_HEIGHT * 4, 'platform-small');
    this.generatePlatform(PLATFORM_HEIGHT * 6, 'platform-medium');
    this.generatePlatform(PLATFORM_HEIGHT * 8, 'platform-large');
    this.generateCoin();
    this.generateGem();
    this.generateEmerald();
    this.generateRainbowite();
    this.generateParticle('particle-white', 0xffffff);
    this.generateParticle('particle-gold', COLOR.PARTICLE_COIN);
    this.generateParticle('particle-cyan', COLOR.PARTICLE_GEM);
    this.generateParticle('particle-green', COLOR.PARTICLE_EMERALD);
    this.generateParticle('particle-rainbow', COLOR.PARTICLE_RAINBOW);
  }

  private generatePlayer(key: string, color: number): void {
    const graphics = this.scene.make.graphics({ x: 0, y: 0 });

    // Main body
    graphics.fillStyle(color, 1);
    graphics.fillRect(0, 0, PLAYER_WIDTH, PLAYER_HEIGHT);

    // Eyes (simple representation)
    graphics.fillStyle(0xffffff, 1);
    graphics.fillRect(6, 8, 4, 4);
    graphics.fillRect(14, 8, 4, 4);

    // Pupils
    graphics.fillStyle(0x000000, 1);
    graphics.fillRect(8, 10, 2, 2);
    graphics.fillRect(16, 10, 2, 2);

    graphics.generateTexture(key, PLAYER_WIDTH, PLAYER_HEIGHT);
    graphics.destroy();
  }

  generatePlatform(width: number, key: string): void {
    const graphics = this.scene.make.graphics({ x: 0, y: 0 });
    const height = PLATFORM_HEIGHT;

    // Platform body
    graphics.fillStyle(COLOR.PLATFORM, 1);
    graphics.fillRoundedRect(0, 0, width, height, 4);

    // Top highlight
    graphics.fillStyle(COLOR.PLATFORM_TOP, 1);
    graphics.fillRoundedRect(0, 0, width, 4, { tl: 4, tr: 4, bl: 0, br: 0 });

    graphics.generateTexture(key, width, height);
    graphics.destroy();
  }

  private generateCoin(): void {
    const graphics = this.scene.make.graphics({ x: 0, y: 0 });
    const size = COIN_SIZE;
    const center = size / 2;

    // Outer circle (dark edge)
    graphics.fillStyle(COLOR.COIN_DARK, 1);
    graphics.fillCircle(center, center, center);

    // Inner circle (main color)
    graphics.fillStyle(COLOR.COIN, 1);
    graphics.fillCircle(center, center, center - 2);

    // Shine
    graphics.fillStyle(0xffffff, 0.6);
    graphics.fillCircle(center - 2, center - 2, 2);

    graphics.generateTexture('coin', size, size);
    graphics.destroy();
  }

  private generateGem(): void {
    const graphics = this.scene.make.graphics({ x: 0, y: 0 });
    const size = GEM_SIZE;
    const center = size / 2;

    // Diamond shape
    graphics.fillStyle(COLOR.GEM_DARK, 1);
    graphics.beginPath();
    graphics.moveTo(center, 2);
    graphics.lineTo(size - 2, center);
    graphics.lineTo(center, size - 2);
    graphics.lineTo(2, center);
    graphics.closePath();
    graphics.fillPath();

    // Inner diamond (lighter)
    graphics.fillStyle(COLOR.GEM, 1);
    graphics.beginPath();
    graphics.moveTo(center, 4);
    graphics.lineTo(size - 4, center);
    graphics.lineTo(center, size - 4);
    graphics.lineTo(4, center);
    graphics.closePath();
    graphics.fillPath();

    // Shine
    graphics.fillStyle(0xffffff, 0.7);
    graphics.beginPath();
    graphics.moveTo(center, 5);
    graphics.lineTo(center + 3, center - 2);
    graphics.lineTo(center, center - 4);
    graphics.lineTo(center - 3, center - 2);
    graphics.closePath();
    graphics.fillPath();

    graphics.generateTexture('gem', size, size);
    graphics.destroy();
  }

  private generateEmerald(): void {
    const graphics = this.scene.make.graphics({ x: 0, y: 0 });
    const size = EMERALD_SIZE;
    const center = size / 2;

    // Hexagonal emerald shape (outer)
    graphics.fillStyle(COLOR.EMERALD_DARK, 1);
    graphics.beginPath();
    graphics.moveTo(center, 2);
    graphics.lineTo(size - 4, 6);
    graphics.lineTo(size - 4, size - 6);
    graphics.lineTo(center, size - 2);
    graphics.lineTo(4, size - 6);
    graphics.lineTo(4, 6);
    graphics.closePath();
    graphics.fillPath();

    // Inner hexagon (lighter)
    graphics.fillStyle(COLOR.EMERALD, 1);
    graphics.beginPath();
    graphics.moveTo(center, 4);
    graphics.lineTo(size - 6, 8);
    graphics.lineTo(size - 6, size - 8);
    graphics.lineTo(center, size - 4);
    graphics.lineTo(6, size - 8);
    graphics.lineTo(6, 8);
    graphics.closePath();
    graphics.fillPath();

    // Shine
    graphics.fillStyle(0xffffff, 0.7);
    graphics.beginPath();
    graphics.moveTo(center, 5);
    graphics.lineTo(center + 3, center - 3);
    graphics.lineTo(center, center - 5);
    graphics.lineTo(center - 3, center - 3);
    graphics.closePath();
    graphics.fillPath();

    graphics.generateTexture('emerald', size, size);
    graphics.destroy();
  }

  private generateRainbowite(): void {
    const graphics = this.scene.make.graphics({ x: 0, y: 0 });
    const size = RAINBOWITE_SIZE;
    const center = size / 2;

    // Rainbow colors
    const rainbowColors = [0xff0000, 0xff7f00, 0xffff00, 0x00ff00, 0x0000ff, 0x4b0082, 0x9400d3];
    const stripeHeight = size / rainbowColors.length;

    // Outer star shape with rainbow stripes
    rainbowColors.forEach((color, i) => {
      graphics.fillStyle(color, 1);
      graphics.beginPath();
      // 8-pointed star
      for (let angle = 0; angle < 8; angle++) {
        const r1 = center - 2;
        const r2 = center - 8;
        const a1 = (angle * Math.PI) / 4;
        const a2 = a1 + Math.PI / 8;
        const x1 = center + Math.cos(a1) * r1;
        const y1 = center + Math.sin(a1) * r1;
        const x2 = center + Math.cos(a2) * r2;
        const y2 = center + Math.sin(a2) * r2;
        if (angle === 0) {
          graphics.moveTo(x1, y1);
        } else {
          graphics.lineTo(x1, y1);
        }
        graphics.lineTo(x2, y2);
      }
      graphics.closePath();
      graphics.fillPath();
    });

    // Inner glow (white)
    graphics.fillStyle(0xffffff, 0.8);
    graphics.fillCircle(center, center, 5);

    // Sparkle
    graphics.fillStyle(0xffffff, 1);
    graphics.fillCircle(center - 2, center - 2, 2);

    graphics.generateTexture('rainbowite', size, size);
    graphics.destroy();
  }

  private generateParticle(key: string, color: number): void {
    const graphics = this.scene.make.graphics({ x: 0, y: 0 });
    const size = 4;

    graphics.fillStyle(color, 1);
    graphics.fillRect(0, 0, size, size);

    graphics.generateTexture(key, size, size);
    graphics.destroy();
  }
}
