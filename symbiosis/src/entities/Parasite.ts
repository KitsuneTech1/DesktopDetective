import Phaser from 'phaser';
import { GAME_CONFIG, PLAYER_COLORS } from '../config/GameConfig';

const CONTROL_SETS = [
    { left: Phaser.Input.Keyboard.KeyCodes.A, right: Phaser.Input.Keyboard.KeyCodes.D, jump: Phaser.Input.Keyboard.KeyCodes.W },
    { left: Phaser.Input.Keyboard.KeyCodes.LEFT, right: Phaser.Input.Keyboard.KeyCodes.RIGHT, jump: Phaser.Input.Keyboard.KeyCodes.UP },
    { left: Phaser.Input.Keyboard.KeyCodes.J, right: Phaser.Input.Keyboard.KeyCodes.L, jump: Phaser.Input.Keyboard.KeyCodes.I },
    { left: Phaser.Input.Keyboard.KeyCodes.NUMPAD_FOUR, right: Phaser.Input.Keyboard.KeyCodes.NUMPAD_SIX, jump: Phaser.Input.Keyboard.KeyCodes.NUMPAD_EIGHT },
];

export class Parasite extends Phaser.Physics.Arcade.Sprite {
    private playerIndex: number;
    private cursors!: {
        left: Phaser.Input.Keyboard.Key;
        right: Phaser.Input.Keyboard.Key;
        jump: Phaser.Input.Keyboard.Key;
    };
    private isGrounded = false;
    private isDead = false;
    private trail: Phaser.GameObjects.Arc[] = [];
    private trailTimer = 0;

    constructor(scene: Phaser.Scene, x: number, y: number, playerIndex: number = 1) {
        super(scene, x, y, 'parasite');
        this.playerIndex = playerIndex;

        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Physics setup - smaller and faster
        this.setCollideWorldBounds(true);
        this.setBounce(0.1);
        this.setDrag(1000, 0);

        // Smaller hitbox
        this.body!.setSize(28, 32);
        this.body!.setOffset(6, 4);

        // Color based on player index
        this.setTint(PLAYER_COLORS[playerIndex]);

        // Setup controls based on player index
        this.setupControls();
    }

    setupControls(): void {
        const keyboard = this.scene.input.keyboard!;
        const controls = CONTROL_SETS[this.playerIndex] || CONTROL_SETS[1]; // Default to player 2 controls

        this.cursors = {
            left: keyboard.addKey(controls.left),
            right: keyboard.addKey(controls.right),
            jump: keyboard.addKey(controls.jump),
        };
    }

    update(time: number, delta: number): void {
        if (this.isDead) return;

        const body = this.body as Phaser.Physics.Arcade.Body;
        this.isGrounded = body.blocked.down || body.touching.down;

        // Horizontal movement (faster than host)
        if (this.cursors.left.isDown) {
            this.setVelocityX(-GAME_CONFIG.PHYSICS.PARASITE_SPEED);
        } else if (this.cursors.right.isDown) {
            this.setVelocityX(GAME_CONFIG.PHYSICS.PARASITE_SPEED);
        }

        // Jump (snappier than host)
        if (this.cursors.jump.isDown && this.isGrounded) {
            this.setVelocityY(GAME_CONFIG.PHYSICS.PARASITE_JUMP);
            this.createJumpParticles();
        }

        // Squash and stretch
        if (this.isGrounded) {
            this.setScale(1.2, 0.8);
        } else if (body.velocity.y < 0) {
            this.setScale(0.8, 1.2);
        } else {
            this.setScale(1, 1);
        }

        // Trail effect
        this.trailTimer += delta;
        if (this.trailTimer > 30 && (Math.abs(body.velocity.x) > 50 || Math.abs(body.velocity.y) > 50)) {
            this.trailTimer = 0;
            this.createTrailParticle();
        }

        // Clean up old trail
        this.trail = this.trail.filter(p => p.alpha > 0);
    }

    createTrailParticle(): void {
        const particle = this.scene.add.circle(
            this.x,
            this.y,
            8,
            PLAYER_COLORS[this.playerIndex],
            0.4
        );
        this.trail.push(particle);

        this.scene.tweens.add({
            targets: particle,
            alpha: 0,
            scale: 0.3,
            duration: 200,
            onComplete: () => particle.destroy(),
        });
    }

    createJumpParticles(): void {
        for (let i = 0; i < 4; i++) {
            const particle = this.scene.add.circle(
                this.x + Phaser.Math.Between(-15, 15),
                this.y + 16,
                Phaser.Math.Between(2, 5),
                PLAYER_COLORS[this.playerIndex],
                0.8
            );

            this.scene.tweens.add({
                targets: particle,
                y: particle.y + 25,
                alpha: 0,
                scale: 0,
                duration: 250,
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
            scale: 0,
            duration: 150,
        });

        // Particles burst
        for (let i = 0; i < 15; i++) {
            const angle = (i / 15) * Math.PI * 2;
            const particle = this.scene.add.circle(
                this.x,
                this.y,
                Phaser.Math.Between(3, 8),
                PLAYER_COLORS[this.playerIndex]
            );

            this.scene.tweens.add({
                targets: particle,
                x: particle.x + Math.cos(angle) * 80,
                y: particle.y + Math.sin(angle) * 80,
                alpha: 0,
                duration: 400,
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
