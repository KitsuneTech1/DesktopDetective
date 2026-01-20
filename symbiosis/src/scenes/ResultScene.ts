import Phaser from 'phaser';
import { GAME_CONFIG, PlayerRole } from '../config/GameConfig';
import { CAMPAIGN_LEVELS } from '../systems/LevelGenerator';

interface ResultData {
    levelName: string;
    timeRemaining: number;
    deaths: number;
    levelIndex: number;
    players: { index: number; active: boolean; role: PlayerRole }[];
}

export class ResultScene extends Phaser.Scene {
    private resultData!: ResultData;

    constructor() {
        super({ key: 'ResultScene' });
    }

    init(data: ResultData): void {
        this.resultData = data;
    }

    create(): void {
        const { width, height } = this.cameras.main;

        // Background
        this.createBackgroundGrid();

        // Victory text
        const victoryText = this.add.text(width / 2, height / 4, '🎉 LEVEL COMPLETE!', {
            fontFamily: 'Arial Black, Impact, sans-serif',
            fontSize: '48px',
            color: '#00ff88',
        });
        victoryText.setOrigin(0.5);
        victoryText.setShadow(0, 0, '#00ff88', 15, true, true);

        // Level name
        const levelName = this.add.text(width / 2, height / 4 + 60, this.resultData.levelName, {
            fontFamily: 'monospace',
            fontSize: '24px',
            color: '#888888',
        });
        levelName.setOrigin(0.5);

        // Stats container
        const statsY = height / 2 - 20;

        // Time remaining
        const minutes = Math.floor(this.resultData.timeRemaining / 60);
        const seconds = this.resultData.timeRemaining % 60;
        const timeText = this.add.text(width / 2, statsY,
            `⏱️ Time Remaining: ${minutes}:${seconds.toString().padStart(2, '0')}`, {
            fontFamily: 'monospace',
            fontSize: '20px',
            color: '#00fff7',
        });
        timeText.setOrigin(0.5);

        // Deaths
        const deathsText = this.add.text(width / 2, statsY + 40,
            `💀 Deaths: ${this.resultData.deaths}`, {
            fontFamily: 'monospace',
            fontSize: '20px',
            color: this.resultData.deaths === 0 ? '#00ff88' : '#ff00ff',
        });
        deathsText.setOrigin(0.5);

        // Rating
        const rating = this.calculateRating();
        const ratingText = this.add.text(width / 2, statsY + 100, rating, {
            fontFamily: 'Arial Black, Impact, sans-serif',
            fontSize: '64px',
            color: '#ffaa00',
        });
        ratingText.setOrigin(0.5);

        // Buttons
        const nextY = height * 0.75;

        // Next level button (if available)
        if (this.resultData.levelIndex < CAMPAIGN_LEVELS.length - 1) {
            const nextBtn = this.add.text(width / 2, nextY, '[ NEXT LEVEL - ENTER ]', {
                fontFamily: 'monospace',
                fontSize: '24px',
                color: '#00ff88',
            });
            nextBtn.setOrigin(0.5);
            nextBtn.setInteractive({ useHandCursor: true });

            this.tweens.add({
                targets: nextBtn,
                alpha: 0.5,
                duration: 500,
                yoyo: true,
                repeat: -1,
            });

            nextBtn.on('pointerdown', () => this.nextLevel());
            this.input.keyboard?.on('keydown-ENTER', () => this.nextLevel());
        } else {
            const completeText = this.add.text(width / 2, nextY, '🏆 ALL LEVELS COMPLETE! 🏆', {
                fontFamily: 'Arial Black, Impact, sans-serif',
                fontSize: '28px',
                color: '#ffaa00',
            });
            completeText.setOrigin(0.5);
        }

        // Retry button
        const retryBtn = this.add.text(width / 2, nextY + 50, '[ RETRY - R ]', {
            fontFamily: 'monospace',
            fontSize: '18px',
            color: '#888888',
        });
        retryBtn.setOrigin(0.5);
        retryBtn.setInteractive({ useHandCursor: true });
        retryBtn.on('pointerdown', () => this.retryLevel());
        this.input.keyboard?.on('keydown-R', () => this.retryLevel());

        // Menu button
        const menuBtn = this.add.text(width / 2, nextY + 90, '[ MENU - ESC ]', {
            fontFamily: 'monospace',
            fontSize: '18px',
            color: '#666666',
        });
        menuBtn.setOrigin(0.5);
        menuBtn.setInteractive({ useHandCursor: true });
        menuBtn.on('pointerdown', () => this.goToMenu());
        this.input.keyboard?.on('keydown-ESC', () => this.goToMenu());

        // Floating animation on victory text
        this.tweens.add({
            targets: victoryText,
            y: height / 4 - 10,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
        });

        // Particles celebration
        this.createCelebrationParticles();
    }

    calculateRating(): string {
        const { deaths, timeRemaining } = this.resultData;

        if (deaths === 0 && timeRemaining > 30) return '⭐⭐⭐';
        if (deaths <= 2 && timeRemaining > 15) return '⭐⭐';
        if (deaths <= 5) return '⭐';
        return '💪'; // Completed but needs practice
    }

    createCelebrationParticles(): void {
        const { width, height } = this.cameras.main;
        const colors = [0x00fff7, 0xff00ff, 0xffaa00, 0x00ff88];

        for (let i = 0; i < 30; i++) {
            const x = Phaser.Math.Between(0, width);
            const particle = this.add.circle(
                x,
                height + 20,
                Phaser.Math.Between(4, 10),
                Phaser.Math.RND.pick(colors),
                0.8
            );

            this.tweens.add({
                targets: particle,
                y: Phaser.Math.Between(-50, height / 2),
                x: x + Phaser.Math.Between(-100, 100),
                alpha: 0,
                duration: Phaser.Math.Between(2000, 4000),
                delay: Phaser.Math.Between(0, 1000),
                ease: 'Sine.easeOut',
                onComplete: () => particle.destroy(),
            });
        }
    }

    nextLevel(): void {
        this.scene.start('GameScene', {
            players: this.resultData.players,
            levelIndex: this.resultData.levelIndex + 1,
        });
    }

    retryLevel(): void {
        this.scene.start('GameScene', {
            players: this.resultData.players,
            levelIndex: this.resultData.levelIndex,
        });
    }

    goToMenu(): void {
        this.scene.start('MenuScene');
    }

    createBackgroundGrid(): void {
        const graphics = this.add.graphics();
        graphics.lineStyle(1, GAME_CONFIG.COLORS.GRID, 0.2);

        const gridSize = 50;
        const { width, height } = this.cameras.main;

        for (let x = 0; x <= width; x += gridSize) {
            graphics.lineBetween(x, 0, x, height);
        }
        for (let y = 0; y <= height; y += gridSize) {
            graphics.lineBetween(0, y, width, y);
        }
    }
}
