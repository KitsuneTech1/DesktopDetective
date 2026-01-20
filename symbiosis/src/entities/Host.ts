import Phaser from 'phaser';
import { GAME_CONFIG, PLAYER_COLORS } from '../config/GameConfig';

export class Host extends Phaser.Physics.Arcade.Sprite {
    private playerIndex: number;
    private cursors!: {
        left: Phaser.Input.Keyboard.Key;
        right: Phaser.Input.Keyboard.Key;
        jump: Phaser.Input.Keyboard.Key;
    };
    private isGrounded = false;
    private isDead = false;

    constructor(scene: Phaser.Scene, x: number, y: number, playerIndex: number = 0) {
        super(scene, x, y, 'host');
        this.playerIndex = playerIndex;

        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Physics setup
        this.setCollideWorldBounds(true);
        this.setBounce(0.1);
        this.setDrag(800, 0);

        // Larger hitbox for host
        this.body!.setSize(48, 56);
        this.body!.setOffset(8, 4);

        // Glow effect
        this.setTint(PLAYER_COLORS[playerIndex]);

        // Setup controls (always player 1 controls for host)
        this.setupControls();
    }

    setupControls(): void {
        const keyboard = this.scene.input.keyboard!;
        this.cursors = {
            left: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            right: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
            jump: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
        };
    }

    update(): void {
        if (this.isDead) return;

        const body = this.body as Phaser.Physics.Arcade.Body;
        this.isGrounded = body.blocked.down || body.touching.down;

        // Horizontal movement
        if (this.cursors.left.isDown) {
            this.setVelocityX(-GAME_CONFIG.PHYSICS.HOST_SPEED);
        } else if (this.cursors.right.isDown) {
            this.setVelocityX(GAME_CONFIG.PHYSICS.HOST_SPEED);
        }

        // Jump
        if (this.cursors.jump.isDown && this.isGrounded) {
            this.setVelocityY(GAME_CONFIG.PHYSICS.HOST_JUMP);
            this.createJumpParticles();
        }

        // Squash and stretch
        if (this.isGrounded) {
            this.setScale(1.1, 0.9);
        } else if (body.velocity.y < 0) {
            this.setScale(0.9, 1.1);
        } else {
            this.setScale(1, 1);
        }
    }

    createJumpParticles(): void {
        for (let i = 0; i < 5; i++) {
            const particle = this.scene.add.circle(
                this.x + Phaser.Math.Between(-20, 20),
                this.y + 28,
                Phaser.Math.Between(3, 6),
                PLAYER_COLORS[this.playerIndex],
                0.8
            );

            this.scene.tweens.add({
                targets: particle,
                y: particle.y + 30,
                alpha: 0,
                scale: 0,
                duration: 300,
                onComplete: () => particle.destroy(),
            });
        }
    }

    die(): void {
        if (this.isDead) return;
        this.isDead = true;

        // Death effect
        this.scene.tweens.add({
            targets: this,
            alpha: 0,
            scale: 2,
            duration: 200,
        });

        // Particles
        for (let i = 0; i < 20; i++) {
            const particle = this.scene.add.circle(
                this.x,
                this.y,
                Phaser.Math.Between(4, 10),
                PLAYER_COLORS[this.playerIndex]
            );

            this.scene.tweens.add({
                targets: particle,
                x: particle.x + Phaser.Math.Between(-100, 100),
                y: particle.y + Phaser.Math.Between(-100, 100),
                alpha: 0,
                duration: 500,
                onComplete: () => particle.destroy(),
            });
        }
    }

    getIsDead(): boolean {
        return this.isDead;
    }

    reset(x: number, y: number): void {
        this.isDead = false;
        this.setPosition(x, y);
        this.setVelocity(0, 0);
        this.setAlpha(1);
        this.setScale(1);
    }
}
