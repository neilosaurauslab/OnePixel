import Phaser from 'phaser';
import { GAME_HEIGHT, CAMERA_LERP } from '../constants';

export class CameraController {
  private scene: Phaser.Scene;
  private camera: Phaser.Cameras.Scene2D.Camera;
  private lowestY: number = 0;
  private target: Phaser.GameObjects.Sprite;

  constructor(scene: Phaser.Scene, target: Phaser.GameObjects.Sprite) {
    this.scene = scene;
    this.target = target;
    this.camera = scene.cameras.main;

    // Initialize camera position
    this.lowestY = target.y - GAME_HEIGHT / 2;
    this.camera.scrollY = this.lowestY;
  }

  setTarget(target: Phaser.GameObjects.Sprite): void {
    this.target = target;
  }

  update(): void {
    // Camera follows target up, but never down
    const targetY = this.target.y - GAME_HEIGHT / 2;

    if (targetY < this.lowestY) {
      this.lowestY = targetY;
    }

    // Smooth lerp to lowest point (only moves up)
    this.camera.scrollY = Phaser.Math.Linear(
      this.camera.scrollY,
      this.lowestY,
      CAMERA_LERP
    );
  }

  isPlayerDead(player: Phaser.GameObjects.Sprite): boolean {
    // Player is dead if they fall below the visible screen
    const deathLine = this.camera.scrollY + GAME_HEIGHT + 50;
    return player.y > deathLine;
  }

  shake(): void {
    this.camera.shake(200, 0.02);
  }
}
