import Phaser from 'phaser';
import {
  GAME_WIDTH,
  GAME_HEIGHT,
  PLATFORM_HEIGHT,
  PLATFORM_HORIZONTAL_MARGIN,
  MOVING_PLATFORM_SPEED,
  MOVING_PLATFORM_RANGE_MIN,
  MOVING_PLATFORM_RANGE_MAX,
  COLOR,
} from '../constants';
import { DifficultyManager } from './DifficultyManager';
import { CollectibleManager } from './CollectibleManager';
import { randomBetween } from '../utils/MathHelpers';
import { TextureGenerator } from '../utils/TextureGenerator';

// Minimum horizontal offset between consecutive platforms
const MIN_PLATFORM_OFFSET = 80;

interface PlatformData {
  sprite: Phaser.GameObjects.Rectangle | Phaser.Physics.Arcade.Sprite;
  isMoving: boolean;
  moveDirection: number;
  moveRange: number;
  startX: number;
}

export class PlatformManager {
  private scene: Phaser.Scene;
  private difficultyManager: DifficultyManager;
  private collectibleManager: CollectibleManager | null = null;
  private platforms: PlatformData[] = [];
  private nextSpawnY: number = 0;
  private textureGenerator: TextureGenerator;
  private highestY: number = 0;
  private lastPlatformX: number = GAME_WIDTH / 2;

  constructor(
    scene: Phaser.Scene,
    difficultyManager: DifficultyManager,
    physics: Phaser.Physics.Arcade.ArcadePhysics
  ) {
    this.scene = scene;
    this.difficultyManager = difficultyManager;
    this.textureGenerator = new TextureGenerator(scene);
    this.nextSpawnY = GAME_HEIGHT - 60;
    this.highestY = this.nextSpawnY;
  }

  setCollectibleManager(manager: CollectibleManager): void {
    this.collectibleManager = manager;
  }

  createInitialPlatforms(
    physicsGroup: Phaser.Physics.Arcade.StaticGroup
  ): void {
    // Create ground/starting platform
    this.createPlatform(
      GAME_WIDTH / 2,
      GAME_HEIGHT - 40,
      GAME_WIDTH - 60,
      physicsGroup,
      false
    );
    this.lastPlatformX = GAME_WIDTH / 2;

    // Create initial platforms going up
    let y = GAME_HEIGHT - 160;
    while (y > 100) {
      const width = this.difficultyManager.getPlatformWidth();
      const x = this.getValidPlatformX(width);
      const isMoving = this.difficultyManager.shouldSpawnMovingPlatform();
      this.createPlatform(x, y, width, physicsGroup, isMoving);
      this.lastPlatformX = x;
      y -= this.difficultyManager.getVerticalSpacing();
    }

    this.nextSpawnY = y;
    this.highestY = y;
  }

  private getValidPlatformX(width: number): number {
    const minX = PLATFORM_HORIZONTAL_MARGIN + width / 2;
    const maxX = GAME_WIDTH - PLATFORM_HORIZONTAL_MARGIN - width / 2;

    // Try to find a position that's offset from the last platform
    let attempts = 0;
    let x: number;

    do {
      x = randomBetween(minX, maxX);
      attempts++;
    } while (
      Math.abs(x - this.lastPlatformX) < MIN_PLATFORM_OFFSET &&
      attempts < 10
    );

    return x;
  }

  private createPlatform(
    x: number,
    y: number,
    width: number,
    physicsGroup: Phaser.Physics.Arcade.StaticGroup,
    isMoving: boolean
  ): PlatformData {
    const platform = this.scene.add.rectangle(x, y, width, PLATFORM_HEIGHT, COLOR.PLATFORM);
    this.scene.physics.add.existing(platform, true);
    physicsGroup.add(platform);

    // Spawn collectible on this platform
    if (this.collectibleManager) {
      this.collectibleManager.spawnCollectible(x, y);
    }

    const platformData: PlatformData = {
      sprite: platform,
      isMoving,
      moveDirection: 1,
      moveRange: isMoving
        ? randomBetween(MOVING_PLATFORM_RANGE_MIN, MOVING_PLATFORM_RANGE_MAX)
        : 0,
      startX: x,
    };

    this.platforms.push(platformData);
    return platformData;
  }

  update(
    cameraY: number,
    physicsGroup: Phaser.Physics.Arcade.StaticGroup
  ): void {
    // Update moving platforms
    this.platforms.forEach((p) => {
      if (p.isMoving) {
        const body = p.sprite.body as Phaser.Physics.Arcade.StaticBody;
        const currentX = p.sprite.x;
        const newX =
          currentX + p.moveDirection * MOVING_PLATFORM_SPEED * (1 / 60);

        // Reverse direction at range limits
        if (Math.abs(newX - p.startX) > p.moveRange) {
          p.moveDirection *= -1;
        } else {
          p.sprite.setX(newX);
          body.updateFromGameObject();
        }
      }
    });

    // Spawn new platforms above camera
    while (this.nextSpawnY > cameraY - GAME_HEIGHT) {
      const width = this.difficultyManager.getPlatformWidth();
      const x = this.getValidPlatformX(width);
      const isMoving = this.difficultyManager.shouldSpawnMovingPlatform();
      this.createPlatform(x, this.nextSpawnY, width, physicsGroup, isMoving);
      this.lastPlatformX = x;
      this.nextSpawnY -= this.difficultyManager.getVerticalSpacing();
    }

    // Remove platforms below camera
    this.cleanupPlatforms(cameraY);

    // Update highest Y for difficulty
    this.updateHighestY(cameraY);
  }

  private cleanupPlatforms(cameraY: number): void {
    const destroyY = cameraY + GAME_HEIGHT + 100;

    this.platforms = this.platforms.filter((p) => {
      if (p.sprite.y > destroyY) {
        p.sprite.destroy();
        return false;
      }
      return true;
    });
  }

  private updateHighestY(cameraY: number): void {
    // Find the highest platform
    this.platforms.forEach((p) => {
      if (p.sprite.y < this.highestY) {
        this.highestY = p.sprite.y;
      }
    });

    // Update difficulty based on how high we've gone (from starting position)
    const height = GAME_HEIGHT - this.highestY;
    this.difficultyManager.setHeight(height);
  }

  getHighestY(): number {
    return this.highestY;
  }
}
