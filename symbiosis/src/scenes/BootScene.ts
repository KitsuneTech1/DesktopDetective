import Phaser from 'phaser';
import { GAME_CONFIG } from '../config/GameConfig';

export class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload(): void {
        // Create loading bar
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();
        progressBox.fillStyle(0x1a1a2e, 0.8);
        progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50);

        const loadingText = this.add.text(width / 2, height / 2 - 50, 'LOADING...', {
            fontFamily: 'monospace',
            fontSize: '20px',
            color: '#00fff7',
        });
        loadingText.setOrigin(0.5, 0.5);

        // Loading progress
        this.load.on('progress', (value: number) => {
            progressBar.clear();
            progressBar.fillStyle(0x00fff7, 1);
            progressBar.fillRect(width / 2 - 150, height / 2 - 15, 300 * value, 30);
        });

        this.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
        });
    }

    create(): void {
        // Generate procedural assets in create() where graphics system is ready
        this.createProceduralAssets();

        // Transition to menu
        this.scene.start('MenuScene');
    }

    createProceduralAssets(): void {
        // Host sprite (cyan blob)
        const hostGraphics = this.add.graphics();
        hostGraphics.fillStyle(GAME_CONFIG.COLORS.HOST);
        hostGraphics.fillCircle(32, 32, 28);
        hostGraphics.fillStyle(0xffffff, 0.5);
        hostGraphics.fillCircle(24, 24, 8);
        hostGraphics.generateTexture('host', 64, 64);
        hostGraphics.destroy();

        // Parasite sprite (magenta wisp)
        const parasiteGraphics = this.add.graphics();
        parasiteGraphics.fillStyle(GAME_CONFIG.COLORS.PARASITE_1);
        parasiteGraphics.fillCircle(20, 20, 16);
        parasiteGraphics.fillStyle(0xffffff, 0.6);
        parasiteGraphics.fillCircle(16, 16, 5);
        parasiteGraphics.generateTexture('parasite', 40, 40);
        parasiteGraphics.destroy();

        // Spike
        const spikeGraphics = this.add.graphics();
        spikeGraphics.fillStyle(GAME_CONFIG.COLORS.OBSTACLE);
        spikeGraphics.beginPath();
        spikeGraphics.moveTo(16, 0);
        spikeGraphics.lineTo(32, 32);
        spikeGraphics.lineTo(0, 32);
        spikeGraphics.closePath();
        spikeGraphics.fillPath();
        spikeGraphics.generateTexture('spike', 32, 32);
        spikeGraphics.destroy();

        // Platform
        const platformGraphics = this.add.graphics();
        platformGraphics.fillStyle(GAME_CONFIG.COLORS.PLATFORM);
        platformGraphics.fillRoundedRect(0, 0, 128, 24, 4);
        platformGraphics.lineStyle(2, 0x00fff7, 0.5);
        platformGraphics.strokeRoundedRect(0, 0, 128, 24, 4);
        platformGraphics.generateTexture('platform', 128, 24);
        platformGraphics.destroy();

        // Small platform
        const smallPlatformGraphics = this.add.graphics();
        smallPlatformGraphics.fillStyle(GAME_CONFIG.COLORS.PLATFORM);
        smallPlatformGraphics.fillRoundedRect(0, 0, 64, 24, 4);
        smallPlatformGraphics.lineStyle(2, 0x00fff7, 0.5);
        smallPlatformGraphics.strokeRoundedRect(0, 0, 64, 24, 4);
        smallPlatformGraphics.generateTexture('platform_small', 64, 24);
        smallPlatformGraphics.destroy();

        // Saw blade
        const sawGraphics = this.add.graphics();
        sawGraphics.fillStyle(GAME_CONFIG.COLORS.OBSTACLE);
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const x = 24 + Math.cos(angle) * 20;
            const y = 24 + Math.sin(angle) * 20;
            sawGraphics.fillCircle(x, y, 6);
        }
        sawGraphics.fillStyle(0x1a1a2e);
        sawGraphics.fillCircle(24, 24, 12);
        sawGraphics.generateTexture('saw', 48, 48);
        sawGraphics.destroy();

        // Checkpoint flag
        const checkpointGraphics = this.add.graphics();
        checkpointGraphics.fillStyle(GAME_CONFIG.COLORS.CHECKPOINT);
        checkpointGraphics.fillRect(4, 0, 4, 64);
        checkpointGraphics.fillTriangle(8, 0, 8, 24, 32, 12);
        checkpointGraphics.generateTexture('checkpoint', 32, 64);
        checkpointGraphics.destroy();

        // Finish zone
        const finishGraphics = this.add.graphics();
        finishGraphics.fillStyle(GAME_CONFIG.COLORS.FINISH, 0.3);
        finishGraphics.fillRect(0, 0, 64, 128);
        finishGraphics.lineStyle(4, GAME_CONFIG.COLORS.FINISH);
        finishGraphics.strokeRect(0, 0, 64, 128);
        finishGraphics.generateTexture('finish', 64, 128);
        finishGraphics.destroy();

        // Particle
        const particleGraphics = this.add.graphics();
        particleGraphics.fillStyle(0xffffff);
        particleGraphics.fillCircle(4, 4, 4);
        particleGraphics.generateTexture('particle', 8, 8);
        particleGraphics.destroy();
    }
}
