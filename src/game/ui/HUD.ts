import Phaser from 'phaser';
import { GAME_WIDTH, COLOR, GOAL_HEIGHT } from '../constants';

interface PickupPopup {
  text: Phaser.GameObjects.Text;
  alpha: number;
  y: number;
}

export class HUD {
  private scene: Phaser.Scene;
  private scoreText!: Phaser.GameObjects.Text;
  private heightText!: Phaser.GameObjects.Text;
  private progressText!: Phaser.GameObjects.Text;
  private player1Indicator!: Phaser.GameObjects.Text;
  private player2Indicator: Phaser.GameObjects.Text | null = null;
  private popups: PickupPopup[] = [];
  private score: number = 0;
  private height: number = 0;
  private playerCount: number = 1;

  constructor(scene: Phaser.Scene, playerCount: number = 1) {
    this.scene = scene;
    this.playerCount = playerCount;
    this.create();
  }

  private create(): void {
    // Player 1 indicator (top left)
    this.player1Indicator = this.scene.add
      .text(16, 12, 'P1', {
        fontSize: '12px',
        color: '#e94560',
        fontFamily: 'Arial',
        stroke: '#000000',
        strokeThickness: 2,
      })
      .setScrollFactor(0)
      .setDepth(100);

    // Score (top left, below P1)
    this.scoreText = this.scene.add
      .text(16, 28, 'Score: 0', {
        fontSize: '18px',
        color: '#ffffff',
        fontFamily: 'Arial',
        stroke: '#000000',
        strokeThickness: 2,
      })
      .setScrollFactor(0)
      .setDepth(100);

    // Player 2 indicator (if 2 player mode)
    if (this.playerCount === 2) {
      this.player2Indicator = this.scene.add
        .text(16, 50, 'P2', {
          fontSize: '12px',
          color: '#00aaff',
          fontFamily: 'Arial',
          stroke: '#000000',
          strokeThickness: 2,
        })
        .setScrollFactor(0)
        .setDepth(100);
    }

    // Height (top right)
    this.heightText = this.scene.add
      .text(GAME_WIDTH - 16, 16, '0m', {
        fontSize: '18px',
        color: '#aaaaaa',
        fontFamily: 'Arial',
        stroke: '#000000',
        strokeThickness: 2,
      })
      .setOrigin(1, 0)
      .setScrollFactor(0)
      .setDepth(100);

    // Progress to goal (below height)
    this.progressText = this.scene.add
      .text(GAME_WIDTH - 16, 40, '0%', {
        fontSize: '14px',
        color: '#666666',
        fontFamily: 'Arial',
        stroke: '#000000',
        strokeThickness: 2,
      })
      .setOrigin(1, 0)
      .setScrollFactor(0)
      .setDepth(100);
  }

  updateScore(score: number): void {
    this.score = score;
    this.scoreText.setText(`Score: ${score}`);
  }

  updateHeight(height: number): void {
    this.height = height;
    const meters = Math.floor(height);
    this.heightText.setText(`${meters}m`);

    // Update progress percentage
    const progress = Math.min(100, Math.floor((height / GOAL_HEIGHT) * 100));
    this.progressText.setText(`${progress}%`);

    // Change color as progress increases
    if (progress >= 100) {
      this.progressText.setColor('#00ff88');
    } else if (progress >= 75) {
      this.progressText.setColor('#00ffff');
    } else if (progress >= 50) {
      this.progressText.setColor('#ffd700');
    } else if (progress >= 25) {
      this.progressText.setColor('#888888');
    }
  }

  showPickupPopup(x: number, y: number, value: number): void {
    const popup = this.scene.add
      .text(x, y, `+${value}`, {
        fontSize: '16px',
        color: value >= 50 ? '#00ffff' : '#ffd700',
        fontFamily: 'Arial',
        stroke: '#000000',
        strokeThickness: 2,
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(101);

    this.popups.push({
      text: popup,
      alpha: 1,
      y: y,
    });
  }

  update(): void {
    // Animate popups
    this.popups = this.popups.filter((p) => {
      p.y -= 1;
      p.alpha -= 0.02;
      p.text.setY(p.y);
      p.text.setAlpha(p.alpha);

      if (p.alpha <= 0) {
        p.text.destroy();
        return false;
      }
      return true;
    });
  }
}
