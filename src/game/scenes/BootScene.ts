import Phaser from 'phaser';
import { TextureGenerator } from '../utils/TextureGenerator';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload(): void {
    // Nothing to load yet - textures will be generated
  }

  create(): void {
    // Generate all game textures programmatically
    const textureGen = new TextureGenerator(this);
    textureGen.generateAll();

    this.scene.start('PreloadScene');
  }
}
