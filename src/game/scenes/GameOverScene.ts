import Phaser from 'phaser';
import { ScoreManager } from '../systems/ScoreManager';
import { GAME_WIDTH, GAME_HEIGHT } from '../constants';

interface GameOverData {
  score: number;
  height: number;
  isNewHighScore: boolean;
  rank: number;
  isWin: boolean;
}

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOverScene' });
  }

  create(data: GameOverData): void {
    const score = data.score || 0;
    const heightM = Math.floor(data.height || 0);
    const isNewHighScore = data.isNewHighScore || false;
    const rank = data.rank;
    const isWin = data.isWin || false;

    // Get updated high scores
    const scoreManager = new ScoreManager();
    const highScores = scoreManager.getHighScores();

    // Title - Victory or Game Over
    const titleText = isWin ? 'VICTORY!' : 'GAME OVER';
    const titleColor = isWin ? '#00ff88' : '#e94560';

    this.add
      .text(GAME_WIDTH / 2, 60, titleText, {
        fontSize: '42px',
        color: titleColor,
        fontFamily: 'Arial',
      })
      .setOrigin(0.5);

    // Win message or high score callout
    if (isWin) {
      const winMsg = this.add
        .text(GAME_WIDTH / 2, 105, 'You reached 110,000m!', {
          fontSize: '18px',
          color: '#ffd700',
          fontFamily: 'Arial',
        })
        .setOrigin(0.5);

      this.tweens.add({
        targets: winMsg,
        scale: 1.05,
        duration: 500,
        yoyo: true,
        repeat: -1,
      });
    } else if (isNewHighScore) {
      const newHS = this.add
        .text(GAME_WIDTH / 2, 105, 'NEW HIGH SCORE!', {
          fontSize: '22px',
          color: '#ffd700',
          fontFamily: 'Arial',
        })
        .setOrigin(0.5);

      this.tweens.add({
        targets: newHS,
        scale: 1.1,
        duration: 300,
        yoyo: true,
        repeat: -1,
      });
    } else if (rank >= 0 && rank < 5) {
      this.add
        .text(GAME_WIDTH / 2, 105, `#${rank + 1} BEST!`, {
          fontSize: '20px',
          color: '#00ffff',
          fontFamily: 'Arial',
        })
        .setOrigin(0.5);
    }

    // Your score
    this.add
      .text(GAME_WIDTH / 2, 150, `Score: ${score}`, {
        fontSize: '28px',
        color: '#ffffff',
        fontFamily: 'Arial',
      })
      .setOrigin(0.5);

    this.add
      .text(GAME_WIDTH / 2, 180, `Height: ${heightM}m`, {
        fontSize: '18px',
        color: '#aaaaaa',
        fontFamily: 'Arial',
      })
      .setOrigin(0.5);

    // Top 5 table
    const tableStartY = 230;
    this.add
      .text(GAME_WIDTH / 2, tableStartY, 'TOP 5', {
        fontSize: '14px',
        color: '#888888',
        fontFamily: 'Arial',
      })
      .setOrigin(0.5);

    if (highScores.length > 0) {
      highScores.forEach((entry, i) => {
        const y = tableStartY + 28 + i * 26;
        const isCurrentScore = rank === i;

        // Rank
        this.add
          .text(GAME_WIDTH / 2 - 90, y, `${i + 1}.`, {
            fontSize: '14px',
            color: isCurrentScore ? '#00ffff' : i === 0 ? '#ffd700' : '#ffffff',
            fontFamily: 'Arial',
          })
          .setOrigin(0, 0.5);

        // Score
        this.add
          .text(GAME_WIDTH / 2 - 30, y, `${entry.score}`, {
            fontSize: '14px',
            color: isCurrentScore ? '#00ffff' : i === 0 ? '#ffd700' : '#ffffff',
            fontFamily: 'Arial',
          })
          .setOrigin(0, 0.5);

        // Height
        this.add
          .text(GAME_WIDTH / 2 + 70, y, `${entry.height}m`, {
            fontSize: '12px',
            color: isCurrentScore ? '#00ffff' : '#666666',
            fontFamily: 'Arial',
          })
          .setOrigin(0, 0.5);
      });
    }

    // Retry prompt
    const retryText = this.add
      .text(
        GAME_WIDTH / 2,
        GAME_HEIGHT - 80,
        'SPACE to Retry   ESC for Menu',
        {
          fontSize: '16px',
          color: '#aaaaaa',
          fontFamily: 'Arial',
        }
      )
      .setOrigin(0.5);

    this.tweens.add({
      targets: retryText,
      alpha: 0.5,
      duration: 400,
      yoyo: true,
      repeat: -1,
    });

    // Input
    this.input.keyboard!.on('keydown-SPACE', () => {
      this.scene.start('GameScene');
    });

    this.input.keyboard!.on('keydown-ESC', () => {
      this.scene.start('MenuScene');
    });
  }
}
