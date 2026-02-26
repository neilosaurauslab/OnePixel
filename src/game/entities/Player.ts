import Phaser from 'phaser';
import {
  PLAYER_WIDTH,
  PLAYER_HEIGHT,
  PLAYER_SPEED,
  PLAYER_ACCELERATION,
  PLAYER_DRAG,
  PLAYER_JUMP_VELOCITY,
  PLAYER_GRAVITY,
  COYOTE_TIME_MS,
  JUMP_BUFFER_MS,
  VARIABLE_JUMP_MULTIPLIER,
  GAME_WIDTH,
  COLOR,
} from '../constants';

export type PlayerControlScheme = 'arrows' | 'wasd';

export class Player extends Phaser.Physics.Arcade.Sprite {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasdKeys!: {
    W: Phaser.Input.Keyboard.Key;
    A: Phaser.Input.Keyboard.Key;
    S: Phaser.Input.Keyboard.Key;
    D: Phaser.Input.Keyboard.Key;
  };
  private wasOnGround: boolean = false;
  private coyoteTimeRemaining: number = 0;
  private jumpBufferRemaining: number = 0;
  private isJumping: boolean = false;
  private onJumpCallback: (() => void) | null = null;
  private controlScheme: PlayerControlScheme;
  private isAlive: boolean = true;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    controlScheme: PlayerControlScheme = 'arrows',
    textureKey: string = 'player'
  ) {
    super(scene, x, y, textureKey);

    this.controlScheme = controlScheme;
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setupPhysics();
    this.setupInput();
  }

  setOnJump(callback: () => void): void {
    this.onJumpCallback = callback;
  }

  private setupPhysics(): void {
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setSize(PLAYER_WIDTH, PLAYER_HEIGHT);
    body.setOffset(0, 0);
    body.setMaxVelocity(PLAYER_SPEED, 800);
    body.setDrag(PLAYER_DRAG, 0);
    body.setGravityY(PLAYER_GRAVITY);
    body.setCollideWorldBounds(false);
  }

  private setupInput(): void {
    if (this.scene.input.keyboard) {
      this.cursors = this.scene.input.keyboard.createCursorKeys();
      this.wasdKeys = {
        W: this.scene.input.keyboard.addKey('W'),
        A: this.scene.input.keyboard.addKey('A'),
        S: this.scene.input.keyboard.addKey('S'),
        D: this.scene.input.keyboard.addKey('D'),
      };
    }
  }

  private getLeftInput(): boolean {
    if (this.controlScheme === 'arrows') {
      return this.cursors.left.isDown;
    }
    return this.wasdKeys.A.isDown;
  }

  private getRightInput(): boolean {
    if (this.controlScheme === 'arrows') {
      return this.cursors.right.isDown;
    }
    return this.wasdKeys.D.isDown;
  }

  private getJumpPressed(): boolean {
    if (this.controlScheme === 'arrows') {
      return Phaser.Input.Keyboard.JustDown(this.cursors.up);
    }
    return Phaser.Input.Keyboard.JustDown(this.wasdKeys.W);
  }

  private getJumpHeld(): boolean {
    if (this.controlScheme === 'arrows') {
      return this.cursors.up.isDown;
    }
    return this.wasdKeys.W.isDown;
  }

  update(_delta: number): void {
    if (!this.isAlive) return;
    if (!this.cursors) return;

    const body = this.body as Phaser.Physics.Arcade.Body;

    // Update coyote time
    if (this.wasOnGround && !body.onFloor()) {
      this.coyoteTimeRemaining = COYOTE_TIME_MS;
    } else if (body.onFloor()) {
      this.coyoteTimeRemaining = 0;
      this.isJumping = false;
    }
    this.coyoteTimeRemaining = Math.max(0, this.coyoteTimeRemaining - _delta);

    // Update jump buffer
    this.jumpBufferRemaining = Math.max(0, this.jumpBufferRemaining - _delta);

    // Track ground state for next frame
    this.wasOnGround = body.onFloor();

    // Horizontal movement with acceleration
    if (this.getLeftInput()) {
      body.setAccelerationX(-PLAYER_ACCELERATION);
      this.setFlipX(true);
    } else if (this.getRightInput()) {
      body.setAccelerationX(PLAYER_ACCELERATION);
      this.setFlipX(false);
    } else {
      body.setAccelerationX(0);
    }

    // Jump input buffering
    if (this.getJumpPressed()) {
      this.jumpBufferRemaining = JUMP_BUFFER_MS;
    }

    // Jump execution (with coyote time and buffer)
    const canJump =
      (body.onFloor() || this.coyoteTimeRemaining > 0) &&
      this.jumpBufferRemaining > 0 &&
      !this.isJumping;

    if (canJump) {
      body.setVelocityY(PLAYER_JUMP_VELOCITY);
      this.coyoteTimeRemaining = 0;
      this.jumpBufferRemaining = 0;
      this.isJumping = true;

      // Emit jump callback for particles
      if (this.onJumpCallback) {
        this.onJumpCallback();
      }
    }

    // Variable jump height (cut jump short if button released)
    if (this.isJumping && !this.getJumpHeld() && body.velocity.y < 0) {
      body.setVelocityY(body.velocity.y * VARIABLE_JUMP_MULTIPLIER);
    }

    // Screen wrap
    this.handleScreenWrap();
  }

  private handleScreenWrap(): void {
    if (this.x < -PLAYER_WIDTH / 2) {
      this.x = GAME_WIDTH + PLAYER_WIDTH / 2;
    } else if (this.x > GAME_WIDTH + PLAYER_WIDTH / 2) {
      this.x = -PLAYER_WIDTH / 2;
    }
  }

  die(): void {
    this.isAlive = false;
    this.setTint(0x666666);
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(0, 0);
    body.setAcceleration(0, 0);
  }

  getIsAlive(): boolean {
    return this.isAlive;
  }

  isFallingBelowScreen(cameraY: number, gameHeight: number): boolean {
    return this.y > cameraY + gameHeight + 100;
  }
}
