import Phaser from 'phaser';
import {
  GAME_WIDTH,
  GAME_HEIGHT,
  COIN_SIZE,
  GEM_SIZE,
  EMERALD_SIZE,
  COLLECTIBLE_SPAWN_CHANCE,
  GEM_CHANCE,
  EMERALD_CHANCE,
  RAINBOWITE_CHANCE,
  COLLECTIBLE_BOB_SPEED,
  COLLECTIBLE_BOB_AMOUNT,
  COIN_VALUE,
  GEM_VALUE,
  EMERALD_VALUE,
  RAINBOWITE_VALUE,
  COLOR,
} from '../constants';
import { randomBetween } from '../utils/MathHelpers';

type CollectibleType = 'coin' | 'gem' | 'emerald' | 'rainbowite';

interface Collectible {
  sprite: Phaser.GameObjects.Sprite;
  type: CollectibleType;
  value: number;
  baseY: number;
  bobOffset: number;
}

export class CollectibleManager {
  private scene: Phaser.Scene;
  private collectibles: Collectible[] = [];
  private time: number = 0;
  private onCollect: ((value: number, type: CollectibleType) => void) | null = null;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  setOnCollect(callback: (value: number, type: CollectibleType) => void): void {
    this.onCollect = callback;
  }

  spawnCollectible(x: number, y: number): void {
    if (Math.random() > COLLECTIBLE_SPAWN_CHANCE) return;

    const rand = Math.random();
    let type: CollectibleType;
    let value: number;
    let texture: string;

    if (rand < RAINBOWITE_CHANCE) {
      type = 'rainbowite';
      value = RAINBOWITE_VALUE;
      texture = 'rainbowite';
    } else if (rand < RAINBOWITE_CHANCE + EMERALD_CHANCE) {
      type = 'emerald';
      value = EMERALD_VALUE;
      texture = 'emerald';
    } else if (rand < RAINBOWITE_CHANCE + EMERALD_CHANCE + GEM_CHANCE) {
      type = 'gem';
      value = GEM_VALUE;
      texture = 'gem';
    } else {
      type = 'coin';
      value = COIN_VALUE;
      texture = 'coin';
    }

    // Spawn above the platform
    const spawnY = y - 30 - randomBetween(0, 20);
    const spawnX = x + randomBetween(-30, 30);

    const sprite = this.scene.add.sprite(spawnX, spawnY, texture);
    sprite.setData('collectible', true);

    this.collectibles.push({
      sprite,
      type,
      value,
      baseY: spawnY,
      bobOffset: Math.random() * Math.PI * 2,
    });
  }

  update(cameraY: number): void {
    this.time += 0.016; // Approximate delta

    // Update bobbing animation
    this.collectibles.forEach((c) => {
      const bob =
        Math.sin(this.time * COLLECTIBLE_BOB_SPEED + c.bobOffset) *
        COLLECTIBLE_BOB_AMOUNT;
      c.sprite.y = c.baseY + bob;
    });

    // Cleanup collectibles below camera
    const destroyY = cameraY + GAME_HEIGHT + 100;
    this.collectibles = this.collectibles.filter((c) => {
      if (c.sprite.y > destroyY) {
        c.sprite.destroy();
        return false;
      }
      return true;
    });
  }

  checkOverlap(
    player: Phaser.GameObjects.GameObject,
    callback?: (value: number, type: CollectibleType, x: number, y: number) => void
  ): void {
    this.collectibles = this.collectibles.filter((c) => {
      const bounds = c.sprite.getBounds();
      const playerBounds = (player as Phaser.GameObjects.Sprite).getBounds();

      if (Phaser.Geom.Intersects.RectangleToRectangle(bounds, playerBounds)) {
        // Collected!
        if (callback) {
          callback(c.value, c.type, c.sprite.x, c.sprite.y);
        }
        if (this.onCollect) {
          this.onCollect(c.value, c.type);
        }
        c.sprite.destroy();
        return false;
      }
      return true;
    });
  }

  getGroup(): Phaser.GameObjects.Sprite[] {
    return this.collectibles.map((c) => c.sprite);
  }
}
