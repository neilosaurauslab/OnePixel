import { HEIGHT_SCORE_INTERVAL, HEIGHT_SCORE_POINTS } from '../constants';

const HIGH_SCORES_KEY = 'onepixel_highscores';
const MAX_HIGH_SCORES = 5;

interface HighScoreEntry {
  score: number;
  height: number;
  date: string;
}

export class ScoreManager {
  private score: number = 0;
  private highScores: HighScoreEntry[] = [];
  private maxHeight: number = 0;
  private lastHeightScore: number = 0;

  constructor() {
    this.loadHighScores();
  }

  private loadHighScores(): void {
    try {
      const stored = localStorage.getItem(HIGH_SCORES_KEY);
      if (stored) {
        this.highScores = JSON.parse(stored) || [];
      }
    } catch {
      this.highScores = [];
    }
  }

  private saveHighScores(): void {
    try {
      localStorage.setItem(HIGH_SCORES_KEY, JSON.stringify(this.highScores));
    } catch {
      // localStorage might not be available
    }
  }

  addCollectibleScore(value: number): void {
    this.score += value;
  }

  updateHeight(currentHeight: number): void {
    if (currentHeight > this.maxHeight) {
      this.maxHeight = currentHeight;

      // Award points for height milestones
      const heightMilestone =
        Math.floor(currentHeight / HEIGHT_SCORE_INTERVAL) * HEIGHT_SCORE_INTERVAL;
      if (heightMilestone > this.lastHeightScore) {
        const milestones =
          (heightMilestone - this.lastHeightScore) / HEIGHT_SCORE_INTERVAL;
        this.score += milestones * HEIGHT_SCORE_POINTS;
        this.lastHeightScore = heightMilestone;
      }
    }
  }

  addFinalScore(): number {
    const entry: HighScoreEntry = {
      score: this.score,
      height: Math.floor(this.maxHeight),
      date: new Date().toLocaleDateString(),
    };

    // Find where this score ranks
    let rank = -1;
    for (let i = 0; i < this.highScores.length; i++) {
      if (this.score > this.highScores[i].score) {
        rank = i;
        break;
      }
    }

    if (rank === -1 && this.highScores.length < MAX_HIGH_SCORES) {
      rank = this.highScores.length;
    }

    // Insert into high scores
    if (rank >= 0) {
      this.highScores.splice(rank, 0, entry);
      this.highScores = this.highScores.slice(0, MAX_HIGH_SCORES);
      this.saveHighScores();
    }

    return rank;
  }

  getScore(): number {
    return this.score;
  }

  getHighScores(): HighScoreEntry[] {
    return this.highScores;
  }

  getHighScore(): number {
    return this.highScores.length > 0 ? this.highScores[0].score : 0;
  }

  getMaxHeight(): number {
    return this.maxHeight;
  }

  isNewHighScore(): boolean {
    return (
      this.score > 0 &&
      (this.highScores.length === 0 || this.score > this.highScores[0].score)
    );
  }

  reset(): void {
    this.score = 0;
    this.maxHeight = 0;
    this.lastHeightScore = 0;
  }
}
