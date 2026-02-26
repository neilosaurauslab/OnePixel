import Phaser from 'phaser';
import { ScoreManager } from '../systems/ScoreManager';
import { GAME_WIDTH, GAME_HEIGHT } from '../constants';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create(): void {
    const scoreManager = new ScoreManager();
    const highScores = scoreManager.getHighScores();

    // Background
    this.add.rectangle(
      GAME_WIDTH / 2,
      GAME_HEIGHT / 2,
      GAME_WIDTH,
      GAME_HEIGHT,
      0x16213e
    );

    // Title
    this.add
      .text(GAME_WIDTH / 2, 50, 'ONEPIXEL', {
        fontSize: '44px',
        color: '#e94560',
        fontFamily: 'Arial',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    // Subtitle
    this.add
      .text(GAME_WIDTH / 2, 90, 'Tower Climb', {
        fontSize: '18px',
        color: '#ffffff',
        fontFamily: 'Arial',
      })
      .setOrigin(0.5);

    // Game mode buttons
    const buttonY = 150;

    // 1 Player button
    const button1P = this.add
      .rectangle(GAME_WIDTH / 2 - 80, buttonY, 140, 40, 0x4a4a6a)
      .setInteractive({ useHandCursor: true });

    const text1P = this.add
      .text(GAME_WIDTH / 2 - 80, buttonY, '1 PLAYER', {
        fontSize: '18px',
        color: '#ffffff',
        fontFamily: 'Arial',
      })
      .setOrigin(0.5);

    button1P.on('pointerover', () => {
      button1P.setFillStyle(0x6a6a8a);
      text1P.setColor('#ffd700');
    });
    button1P.on('pointerout', () => {
      button1P.setFillStyle(0x4a4a6a);
      text1P.setColor('#ffffff');
    });
    button1P.on('pointerdown', () => {
      this.scene.start('GameScene', { playerCount: 1 });
    });

    // 2 Player button
    const button2P = this.add
      .rectangle(GAME_WIDTH / 2 + 80, buttonY, 140, 40, 0x4a4a6a)
      .setInteractive({ useHandCursor: true });

    const text2P = this.add
      .text(GAME_WIDTH / 2 + 80, buttonY, '2 PLAYER', {
        fontSize: '18px',
        color: '#ffffff',
        fontFamily: 'Arial',
      })
      .setOrigin(0.5);

    button2P.on('pointerover', () => {
      button2P.setFillStyle(0x6a6a8a);
      text2P.setColor('#00ffff');
    });
    button2P.on('pointerout', () => {
      button2P.setFillStyle(0x4a4a6a);
      text2P.setColor('#ffffff');
    });
    button2P.on('pointerdown', () => {
      this.scene.start('GameScene', { playerCount: 2 });
    });

    // High scores table
    const tableStartY = 210;
    this.add
      .text(GAME_WIDTH / 2, tableStartY, 'HIGH SCORES', {
        fontSize: '14px',
        color: '#ffd700',
        fontFamily: 'Arial',
      })
      .setOrigin(0.5);

    if (highScores.length > 0) {
      highScores.forEach((entry, i) => {
        const y = tableStartY + 25 + i * 24;
        const rankText = `${i + 1}.`;
        const scoreText = `${entry.score}`;
        const heightText = `${entry.height}m`;

        // Rank
        this.add
          .text(GAME_WIDTH / 2 - 90, y, rankText, {
            fontSize: '14px',
            color: i === 0 ? '#ffd700' : '#ffffff',
            fontFamily: 'Arial',
          })
          .setOrigin(0, 0.5);

        // Score
        this.add
          .text(GAME_WIDTH / 2 - 30, y, scoreText, {
            fontSize: '14px',
            color: i === 0 ? '#ffd700' : '#ffffff',
            fontFamily: 'Arial',
          })
          .setOrigin(0, 0.5);

        // Height
        this.add
          .text(GAME_WIDTH / 2 + 70, y, heightText, {
            fontSize: '12px',
            color: '#888888',
            fontFamily: 'Arial',
          })
          .setOrigin(0, 0.5);
      });
    } else {
      this.add
        .text(GAME_WIDTH / 2, tableStartY + 40, 'No scores yet!', {
          fontSize: '12px',
          color: '#666666',
          fontFamily: 'Arial',
        })
        .setOrigin(0.5);
    }

    // Controls hint
    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT - 70, 'P1: ← → Move   ↑ Jump', {
        fontSize: '12px',
        color: '#888888',
        fontFamily: 'Arial',
      })
      .setOrigin(0.5);

    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT - 50, 'P2: A D Move   W Jump', {
        fontSize: '12px',
        color: '#888888',
        fontFamily: 'Arial',
      })
      .setOrigin(0.5);
  }
}
