import Phaser from 'phaser';
import { Player } from '../entities/Player';
import { PlatformManager } from '../systems/PlatformManager';
import { DifficultyManager } from '../systems/DifficultyManager';
import { CameraController } from '../systems/CameraController';
import { CollectibleManager } from '../systems/CollectibleManager';
import { ScoreManager } from '../systems/ScoreManager';
import { HUD } from '../ui/HUD';
import { ParticleEffects } from '../ui/ParticleEffects';
import { GAME_WIDTH, GAME_HEIGHT, GOAL_HEIGHT } from '../constants';

interface GameSceneData {
  playerCount: number;
}

export class GameScene extends Phaser.Scene {
  private players: Player[] = [];
  private playerCount: number = 1;
  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  private platformManager!: PlatformManager;
  private difficultyManager!: DifficultyManager;
  private cameraController!: CameraController;
  private collectibleManager!: CollectibleManager;
  private scoreManager!: ScoreManager;
  private hud!: HUD;
  private particles!: ParticleEffects;
  private isGameOver: boolean = false;
  private startY: number = 0;

  constructor() {
    super({ key: 'GameScene' });
  }

  create(data: GameSceneData): void {
    this.isGameOver = false;
    this.playerCount = data.playerCount || 1;
    this.players = [];

    // Set world bounds (infinite upward)
    this.physics.world.setBounds(0, -Infinity, GAME_WIDTH, Infinity);

    // Create managers
    this.difficultyManager = new DifficultyManager();
    this.scoreManager = new ScoreManager();
    this.collectibleManager = new CollectibleManager(this);

    // Create particle effects
    this.particles = new ParticleEffects(this);

    // Create HUD
    this.hud = new HUD(this, this.playerCount);

    // Create platforms group
    this.platforms = this.physics.add.staticGroup();

    // Create platform manager and initial platforms
    this.platformManager = new PlatformManager(
      this,
      this.difficultyManager,
      this.physics
    );
    this.platformManager.setCollectibleManager(this.collectibleManager);
    this.platformManager.createInitialPlatforms(this.platforms);

    // Create players
    const spawnX1 = this.playerCount === 2 ? GAME_WIDTH / 3 : GAME_WIDTH / 2;
    const spawnX2 = (GAME_WIDTH * 2) / 3;

    const player1 = new Player(this, spawnX1, GAME_HEIGHT - 100, 'arrows', 'player');
    player1.setOnJump(() => {
      this.particles.emitJump(player1.x, player1.y + 16);
    });
    this.players.push(player1);
    this.physics.add.collider(player1, this.platforms);

    if (this.playerCount === 2) {
      const player2 = new Player(this, spawnX2, GAME_HEIGHT - 100, 'wasd', 'player2');
      player2.setOnJump(() => {
        this.particles.emitJump(player2.x, player2.y + 16);
      });
      this.players.push(player2);
      this.physics.add.collider(player2, this.platforms);
    }

    this.startY = this.players[0].y;

    // Create camera controller (will follow highest alive player)
    this.cameraController = new CameraController(this, this.getHighestAlivePlayer());

    // Setup collectible callback
    this.collectibleManager.setOnCollect((value, _type) => {
      this.scoreManager.addCollectibleScore(value);
      this.hud.updateScore(this.scoreManager.getScore());
    });

    // Press ESC to return to menu
    this.input.keyboard!.on('keydown-ESC', () => {
      this.scene.start('MenuScene');
    });
  }

  private getHighestAlivePlayer(): Player {
    let highest = this.players[0];
    for (const player of this.players) {
      if (player.getIsAlive() && player.y < highest.y) {
        highest = player;
      }
    }
    return highest;
  }

  private getAlivePlayers(): Player[] {
    return this.players.filter((p) => p.getIsAlive());
  }

  private allPlayersDead(): boolean {
    return this.players.every((p) => !p.getIsAlive());
  }

  update(_time: number, _delta: number): void {
    if (this.isGameOver) return;

    // Update all players
    for (const player of this.players) {
      player.update(_delta);
    }

    // Update camera to follow highest alive player
    const highestPlayer = this.getHighestAlivePlayer();
    if (this.cameraController && highestPlayer) {
      this.cameraController.setTarget(highestPlayer);
      this.cameraController.update();
    }

    const cameraY = this.cameras.main.scrollY;

    if (this.platformManager) {
      this.platformManager.update(cameraY, this.platforms);
    }

    if (this.collectibleManager) {
      this.collectibleManager.update(cameraY);

      // Check overlap for all alive players
      for (const player of this.getAlivePlayers()) {
        this.collectibleManager.checkOverlap(
          player,
          (value, type, x, y) => {
            this.hud.showPickupPopup(x, y, value);
            if (type === 'rainbowite') {
              this.particles.emitRainbowCollect(x, y);
            } else if (type === 'emerald') {
              this.particles.emitEmeraldCollect(x, y);
            } else if (type === 'gem') {
              this.particles.emitGemCollect(x, y);
            } else {
              this.particles.emitCoinCollect(x, y);
            }
          }
        );
      }
    }

    // Check for player deaths
    for (const player of this.players) {
      if (player.getIsAlive() && this.cameraController.isPlayerDead(player)) {
        player.die();
        if (!this.allPlayersDead()) {
          this.cameraController.shake();
        }
      }
    }

    // Update height-based score (use highest alive player)
    const highestAlive = this.getHighestAlivePlayer();
    if (highestAlive && this.scoreManager) {
      const height = this.startY - highestAlive.y;
      if (height > 0) {
        this.scoreManager.updateHeight(height);
        this.hud.updateHeight(this.scoreManager.getMaxHeight());
        this.hud.updateScore(this.scoreManager.getScore());

        // Check for win condition
        if (height >= GOAL_HEIGHT) {
          this.gameOver(true);
          return;
        }
      }
    }

    // Update HUD
    if (this.hud) {
      this.hud.update();
    }

    // Check for game over (all players dead)
    if (this.allPlayersDead()) {
      this.gameOver(false);
    }
  }

  private gameOver(isWin: boolean = false): void {
    this.isGameOver = true;

    if (!isWin) {
      this.cameraController.shake();
    }

    // Add score to high scores and get rank
    const rank = this.scoreManager.addFinalScore();

    // Delay before showing game over
    this.time.delayedCall(500, () => {
      this.scene.start('GameOverScene', {
        score: this.scoreManager.getScore(),
        height: this.scoreManager.getMaxHeight(),
        isNewHighScore: this.scoreManager.isNewHighScore(),
        rank: rank,
        isWin: isWin,
      });
    });
  }
}
