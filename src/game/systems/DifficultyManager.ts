import {
  DIFFICULTY_MAX_LEVEL,
  DIFFICULTY_HEIGHT_PER_LEVEL,
  DIFFICULTY_MOVING_PLATFORM_CHANCE_BASE,
  DIFFICULTY_MOVING_PLATFORM_CHANCE_MAX,
  DIFFICULTY_WIDTH_MULTIPLIER_MIN,
  DIFFICULTY_SPACING_MULTIPLIER_MAX,
  PLATFORM_MIN_WIDTH,
  PLATFORM_MAX_WIDTH,
  PLATFORM_VERTICAL_SPACING_MIN,
  PLATFORM_VERTICAL_SPACING_MAX,
} from '../constants';

export class DifficultyManager {
  private currentHeight: number = 0;

  setHeight(height: number): void {
    this.currentHeight = Math.max(0, height);
  }

  getLevel(): number {
    const level = Math.floor(this.currentHeight / DIFFICULTY_HEIGHT_PER_LEVEL);
    return Math.min(level, DIFFICULTY_MAX_LEVEL);
  }

  getMovingPlatformChance(): number {
    const level = this.getLevel();
    const progress = level / DIFFICULTY_MAX_LEVEL;
    return (
      DIFFICULTY_MOVING_PLATFORM_CHANCE_BASE +
      progress *
        (DIFFICULTY_MOVING_PLATFORM_CHANCE_MAX -
          DIFFICULTY_MOVING_PLATFORM_CHANCE_BASE)
    );
  }

  getPlatformWidthMultiplier(): number {
    const level = this.getLevel();
    const progress = level / DIFFICULTY_MAX_LEVEL;
    // Platforms get narrower as difficulty increases
    return 1 - progress * (1 - DIFFICULTY_WIDTH_MULTIPLIER_MIN);
  }

  getSpacingMultiplier(): number {
    const level = this.getLevel();
    const progress = level / DIFFICULTY_MAX_LEVEL;
    // Spacing increases with difficulty
    return 1 + progress * (DIFFICULTY_SPACING_MULTIPLIER_MAX - 1);
  }

  getPlatformWidth(): number {
    const multiplier = this.getPlatformWidthMultiplier();
    const minWidth = PLATFORM_MIN_WIDTH * multiplier;
    const maxWidth = PLATFORM_MAX_WIDTH * multiplier;
    return Math.max(PLATFORM_MIN_WIDTH * 0.6, minWidth + Math.random() * (maxWidth - minWidth));
  }

  getVerticalSpacing(): number {
    const multiplier = this.getSpacingMultiplier();
    const minSpacing = PLATFORM_VERTICAL_SPACING_MIN * multiplier;
    const maxSpacing = PLATFORM_VERTICAL_SPACING_MAX * multiplier;
    return minSpacing + Math.random() * (maxSpacing - minSpacing);
  }

  shouldSpawnMovingPlatform(): boolean {
    return Math.random() < this.getMovingPlatformChance();
  }
}
