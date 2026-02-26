import Phaser from 'phaser';

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload(): void {
    // Reserved for future asset loading
  }

  create(): void {
    this.scene.start('MenuScene');
  }
}
