import Phaser from 'phaser';
import { GAME_CONFIG } from '../config/GameConfig';

export class MenuScene extends Phaser.Scene {
    private titleText!: Phaser.GameObjects.Text;
    private startText!: Phaser.GameObjects.Text;
    private particles!: Phaser.GameObjects.Graphics;

    constructor() {
        super({ key: 'MenuScene' });
    }

    create(): void {
        const { width, height } = this.cameras.main;

        // Animated background grid
        this.createBackgroundGrid();

        // Floating particles
        this.createFloatingParticles();

        // Title with glow effect
        this.titleText = this.add.text(width / 2, height / 3, 'SYMBIOSIS', {
            fontFamily: 'Arial Black, Impact, sans-serif',
            fontSize: '72px',
            color: '#00fff7',
            stroke: '#0a0a0f',
            strokeThickness: 4,
        });
        this.titleText.setOrigin(0.5);
        this.titleText.setShadow(0, 0, '#00fff7', 20, true, true);

        // Subtitle
        const subtitle = this.add.text(width / 2, height / 3 + 60, 'ASYMMETRIC CO-OP SURVIVAL', {
            fontFamily: 'monospace',
            fontSize: '18px',
            color: '#ff00ff',
        });
        subtitle.setOrigin(0.5);

        // Tagline
        const tagline = this.add.text(width / 2, height / 2 + 20, '"Stay together. Move fast. Don\'t die."', {
            fontFamily: 'Georgia, serif',
            fontSize: '20px',
            color: '#888888',
            fontStyle: 'italic',
        });
        tagline.setOrigin(0.5);

        // Start button
        this.startText = this.add.text(width / 2, height * 0.7, '[ PRESS SPACE TO START ]', {
            fontFamily: 'monospace',
            fontSize: '24px',
            color: '#ffffff',
        });
        this.startText.setOrigin(0.5);
        this.startText.setInteractive({ useHandCursor: true });

        // Pulsing animation for start text
        this.tweens.add({
            targets: this.startText,
            alpha: 0.4,
            duration: 800,
            yoyo: true,
            repeat: -1,
        });

        // Controls hint
        const controls = this.add.text(width / 2, height - 80,
            'P1: WASD  |  P2: Arrow Keys  |  P3: IJKL  |  P4: Numpad', {
            fontFamily: 'monospace',
            fontSize: '14px',
            color: '#555555',
        });
        controls.setOrigin(0.5);

        // Credit
        const credit = this.add.text(width / 2, height - 40, 'A fast-paced party game for 2-4 players', {
            fontFamily: 'monospace',
            fontSize: '12px',
            color: '#333333',
        });
        credit.setOrigin(0.5);

        // Input handlers
        this.input.keyboard?.on('keydown-SPACE', () => {
            this.scene.start('LobbyScene');
        });

        this.startText.on('pointerdown', () => {
            this.scene.start('LobbyScene');
        });

        // Title floating animation
        this.tweens.add({
            targets: this.titleText,
            y: height / 3 - 10,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
        });
    }

    createBackgroundGrid(): void {
        const graphics = this.add.graphics();
        graphics.lineStyle(1, GAME_CONFIG.COLORS.GRID, 0.3);

        const gridSize = 50;
        const { width, height } = this.cameras.main;

        for (let x = 0; x <= width; x += gridSize) {
            graphics.lineBetween(x, 0, x, height);
        }
        for (let y = 0; y <= height; y += gridSize) {
            graphics.lineBetween(0, y, width, y);
        }
    }

    createFloatingParticles(): void {
        // Create simple floating dots
        for (let i = 0; i < 20; i++) {
            const x = Phaser.Math.Between(0, this.cameras.main.width);
            const y = Phaser.Math.Between(0, this.cameras.main.height);
            const dot = this.add.circle(x, y, Phaser.Math.Between(2, 4), 0x00fff7, 0.3);

            this.tweens.add({
                targets: dot,
                y: y - Phaser.Math.Between(50, 150),
                alpha: 0,
                duration: Phaser.Math.Between(3000, 6000),
                repeat: -1,
                onRepeat: () => {
                    dot.x = Phaser.Math.Between(0, this.cameras.main.width);
                    dot.y = this.cameras.main.height + 20;
                    dot.alpha = 0.3;
                },
            });
        }
    }
}
