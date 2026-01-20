import Phaser from 'phaser';
import { GAME_CONFIG, PlayerRole } from '../config/GameConfig';
import { Host } from '../entities/Host';
import { Parasite } from '../entities/Parasite';
import { Tether } from '../entities/Tether';
import { LevelGenerator, CAMPAIGN_LEVELS } from '../systems/LevelGenerator';
import type { LevelData } from '../systems/LevelGenerator';

// Local type definition to avoid import issues
interface LevelElement {
    type: 'platform' | 'spike' | 'saw' | 'checkpoint' | 'finish';
    x: number;
    y: number;
    width?: number;
    height?: number;
    moving?: boolean;
    moveRange?: number;
    moveSpeed?: number;
}

interface PlayerInfo {
    index: number;
    active: boolean;
    role: PlayerRole;
}

export class GameScene extends Phaser.Scene {
    // Players
    private host!: Host;
    private parasites: Parasite[] = [];
    private tether!: Tether;
    private playerData: PlayerInfo[] = [];

    // Level
    private levelGenerator!: LevelGenerator;
    private currentLevel!: LevelData;
    private currentLevelIndex = 0;
    private platforms!: Phaser.Physics.Arcade.StaticGroup;
    private movingPlatforms!: Phaser.Physics.Arcade.Group;
    private spikes!: Phaser.Physics.Arcade.StaticGroup;
    private saws!: Phaser.Physics.Arcade.Group;
    private checkpoints!: Phaser.Physics.Arcade.StaticGroup;
    private finishZone!: Phaser.Physics.Arcade.Sprite;

    // Game state
    private timeRemaining = 60;
    private timerText!: Phaser.GameObjects.Text;
    private levelNameText!: Phaser.GameObjects.Text;
    private isGameOver = false;
    private lastCheckpoint: { x: number; y: number } | null = null;
    private deathCount = 0;

    // UI
    private tetherUI!: Phaser.GameObjects.Graphics;

    constructor() {
        super({ key: 'GameScene' });
    }

    init(data: { players?: PlayerInfo[] }): void {
        // Get player data from lobby or use defaults
        if (data.players && data.players.length > 0) {
            this.playerData = data.players;
        } else {
            // Default 2-player setup for testing
            this.playerData = [
                { index: 0, active: true, role: PlayerRole.HOST },
                { index: 1, active: true, role: PlayerRole.PARASITE },
            ];
        }
    }

    create(): void {
        this.isGameOver = false;
        this.deathCount = 0;

        // Level generation
        this.levelGenerator = new LevelGenerator();
        this.loadLevel(this.currentLevelIndex);

        // Create physics groups
        this.createPhysicsGroups();

        // Build the level
        this.buildLevel();

        // Create players
        this.createPlayers();

        // Create tether
        this.tether = new Tether(this, this.host, this.parasites);

        // Setup collisions
        this.setupCollisions();

        // UI
        this.createUI();

        // Camera follows host
        this.cameras.main.setBounds(0, 0, this.currentLevel.width, this.currentLevel.height);
        this.cameras.main.startFollow(this.host, true, 0.1, 0.1);

        // Timer
        this.time.addEvent({
            delay: 1000,
            callback: this.updateTimer,
            callbackScope: this,
            loop: true,
        });

        // Pause/restart handlers
        this.input.keyboard?.on('keydown-R', () => this.restartLevel());
        this.input.keyboard?.on('keydown-ESC', () => this.scene.start('MenuScene'));
    }

    loadLevel(index: number): void {
        this.currentLevel = this.levelGenerator.getCampaignLevel(index);
        this.timeRemaining = this.currentLevel.timeLimit;
        this.lastCheckpoint = null;
    }

    createPhysicsGroups(): void {
        this.platforms = this.physics.add.staticGroup();
        this.movingPlatforms = this.physics.add.group({ allowGravity: false });
        this.spikes = this.physics.add.staticGroup();
        this.saws = this.physics.add.group({ allowGravity: false });
        this.checkpoints = this.physics.add.staticGroup();
    }

    buildLevel(): void {
        // World bounds
        this.physics.world.setBounds(0, 0, this.currentLevel.width, this.currentLevel.height);

        // Background grid
        this.createBackgroundGrid();

        // Build elements from level data
        for (const element of this.currentLevel.elements) {
            switch (element.type) {
                case 'platform':
                    this.createPlatform(element);
                    break;
                case 'spike':
                    this.createSpike(element);
                    break;
                case 'saw':
                    this.createSaw(element);
                    break;
                case 'checkpoint':
                    this.createCheckpoint(element);
                    break;
                case 'finish':
                    this.createFinish(element);
                    break;
            }
        }
    }

    createBackgroundGrid(): void {
        const graphics = this.add.graphics();
        graphics.lineStyle(1, GAME_CONFIG.COLORS.GRID, 0.15);

        const gridSize = 50;

        for (let x = 0; x <= this.currentLevel.width; x += gridSize) {
            graphics.lineBetween(x, 0, x, this.currentLevel.height);
        }
        for (let y = 0; y <= this.currentLevel.height; y += gridSize) {
            graphics.lineBetween(0, y, this.currentLevel.width, y);
        }

        graphics.setScrollFactor(0.5); // Parallax effect
    }

    createPlatform(element: LevelElement): void {
        const width = element.width || 128;
        const height = element.height || 24;

        // Create platform graphic
        const graphics = this.make.graphics({ x: 0, y: 0 });
        graphics.fillStyle(GAME_CONFIG.COLORS.PLATFORM);
        graphics.fillRoundedRect(0, 0, width, height, 4);
        graphics.lineStyle(2, 0x00fff7, 0.4);
        graphics.strokeRoundedRect(0, 0, width, height, 4);
        graphics.generateTexture(`platform_${width}_${height}`, width, height);
        graphics.destroy();

        if (element.moving) {
            const platform = this.movingPlatforms.create(element.x, element.y, `platform_${width}_${height}`) as Phaser.Physics.Arcade.Sprite;
            platform.setImmovable(true);
            (platform.body as Phaser.Physics.Arcade.Body).allowGravity = false;

            // Moving animation
            this.tweens.add({
                targets: platform,
                x: element.x + (element.moveRange || 100),
                duration: 2000 / ((element.moveSpeed || 50) / 50),
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut',
            });
        } else {
            const platform = this.platforms.create(element.x + width / 2, element.y + height / 2, `platform_${width}_${height}`) as Phaser.Physics.Arcade.Sprite;
            platform.refreshBody();
        }
    }

    createSpike(element: LevelElement): void {
        const spike = this.spikes.create(element.x, element.y, 'spike') as Phaser.Physics.Arcade.Sprite;
        spike.setOrigin(0.5, 1);
        spike.refreshBody();
        (spike.body as Phaser.Physics.Arcade.StaticBody).setSize(24, 24);
    }

    createSaw(element: LevelElement): void {
        const saw = this.saws.create(element.x, element.y, 'saw') as Phaser.Physics.Arcade.Sprite;
        saw.setCircle(24);

        // Rotation
        this.tweens.add({
            targets: saw,
            angle: 360,
            duration: 1000,
            repeat: -1,
        });

        // Movement
        if (element.moving) {
            this.tweens.add({
                targets: saw,
                x: element.x + (element.moveRange || 60),
                duration: 2000 / ((element.moveSpeed || 50) / 50),
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut',
            });
        }
    }

    createCheckpoint(element: LevelElement): void {
        const checkpoint = this.checkpoints.create(element.x, element.y, 'checkpoint') as Phaser.Physics.Arcade.Sprite;
        checkpoint.setOrigin(0, 1);
        checkpoint.setAlpha(0.7);
        checkpoint.refreshBody();
    }

    createFinish(element: LevelElement): void {
        this.finishZone = this.physics.add.sprite(element.x, element.y, 'finish');
        this.finishZone.setOrigin(0, 1);
        (this.finishZone.body as Phaser.Physics.Arcade.Body).allowGravity = false;
        (this.finishZone.body as Phaser.Physics.Arcade.Body).setImmovable(true);

        // Pulsing effect
        this.tweens.add({
            targets: this.finishZone,
            alpha: 0.5,
            duration: 500,
            yoyo: true,
            repeat: -1,
        });
    }

    createPlayers(): void {
        const spawnX = this.currentLevel.spawnX;
        const spawnY = this.currentLevel.spawnY;

        this.parasites = [];

        for (const player of this.playerData) {
            if (player.role === PlayerRole.HOST) {
                this.host = new Host(this, spawnX, spawnY, player.index);
            } else {
                const offset = this.parasites.length * 30;
                const parasite = new Parasite(this, spawnX + 50 + offset, spawnY, player.index);
                this.parasites.push(parasite);
            }
        }
    }

    setupCollisions(): void {
        // Platforms
        this.physics.add.collider(this.host, this.platforms);
        this.physics.add.collider(this.host, this.movingPlatforms);
        this.parasites.forEach(p => {
            this.physics.add.collider(p, this.platforms);
            this.physics.add.collider(p, this.movingPlatforms);
        });

        // Deadly obstacles - host
        this.physics.add.overlap(this.host, this.spikes, () => this.onPlayerDeath('spike'));
        this.physics.add.overlap(this.host, this.saws, () => this.onPlayerDeath('saw'));

        // Deadly obstacles - parasites
        this.parasites.forEach(p => {
            this.physics.add.overlap(p, this.spikes, () => this.onPlayerDeath('spike'));
            this.physics.add.overlap(p, this.saws, () => this.onPlayerDeath('saw'));
        });

        // Checkpoints
        this.physics.add.overlap(this.host, this.checkpoints, (_, checkpoint) => {
            this.activateCheckpoint(checkpoint as Phaser.Physics.Arcade.Sprite);
        });

        // Finish zone
        this.physics.add.overlap(this.host, this.finishZone, () => this.onLevelComplete());
    }

    activateCheckpoint(checkpoint: Phaser.Physics.Arcade.Sprite): void {
        if (this.lastCheckpoint?.x === checkpoint.x) return;

        this.lastCheckpoint = { x: checkpoint.x, y: checkpoint.y - 50 };
        checkpoint.setTint(0x00ff88);
        checkpoint.setAlpha(1);

        // Flash effect
        this.cameras.main.flash(100, 0, 255, 136, true);
    }

    createUI(): void {
        // Timer
        this.timerText = this.add.text(GAME_CONFIG.WIDTH / 2, 30, '', {
            fontFamily: 'monospace',
            fontSize: '32px',
            color: '#ffffff',
        });
        this.timerText.setOrigin(0.5);
        this.timerText.setScrollFactor(0);
        this.timerText.setDepth(100);

        // Level name
        this.levelNameText = this.add.text(GAME_CONFIG.WIDTH / 2, 70, this.currentLevel.name, {
            fontFamily: 'monospace',
            fontSize: '18px',
            color: '#888888',
        });
        this.levelNameText.setOrigin(0.5);
        this.levelNameText.setScrollFactor(0);
        this.levelNameText.setDepth(100);

        // Deaths counter
        const deathsText = this.add.text(20, 20, `Deaths: ${this.deathCount}`, {
            fontFamily: 'monospace',
            fontSize: '16px',
            color: '#ff0044',
        });
        deathsText.setScrollFactor(0);
        deathsText.setDepth(100);
        deathsText.setName('deathsText');

        // Controls hint
        const hint = this.add.text(20, GAME_CONFIG.HEIGHT - 30, 'R - Restart | ESC - Menu', {
            fontFamily: 'monospace',
            fontSize: '14px',
            color: '#444444',
        });
        hint.setScrollFactor(0);

        // Tether UI
        this.tetherUI = this.add.graphics();
        this.tetherUI.setScrollFactor(0);
        this.tetherUI.setDepth(100);
    }

    updateTimer(): void {
        if (this.isGameOver) return;

        this.timeRemaining--;

        if (this.timeRemaining <= 0) {
            this.onPlayerDeath('timeout');
        }
    }

    onPlayerDeath(cause: string): void {
        if (this.isGameOver) return;

        this.isGameOver = true;
        this.deathCount++;

        // Kill all players
        this.host.die();
        this.parasites.forEach(p => p.die());

        // Screen shake
        this.cameras.main.shake(300, 0.02);

        // Restart after delay
        this.time.delayedCall(1000, () => {
            this.respawnPlayers();
        });
    }

    respawnPlayers(): void {
        this.isGameOver = false;

        const spawnX = this.lastCheckpoint?.x || this.currentLevel.spawnX;
        const spawnY = this.lastCheckpoint?.y || this.currentLevel.spawnY;

        this.host.reset(spawnX, spawnY);
        this.parasites.forEach((p, i) => {
            p.reset(spawnX + 50 + i * 30, spawnY);
        });

        // Reset timer if no checkpoint
        if (!this.lastCheckpoint) {
            this.timeRemaining = this.currentLevel.timeLimit;
        }

        // Update deaths display
        const deathsText = this.children.getByName('deathsText') as Phaser.GameObjects.Text;
        if (deathsText) {
            deathsText.setText(`Deaths: ${this.deathCount}`);
        }
    }

    restartLevel(): void {
        this.lastCheckpoint = null;
        this.scene.restart({ players: this.playerData });
    }

    onLevelComplete(): void {
        if (this.isGameOver) return;
        this.isGameOver = true;

        // Victory effect
        this.cameras.main.flash(500, 0, 255, 136);

        // Show results
        this.time.delayedCall(1500, () => {
            this.scene.start('ResultScene', {
                levelName: this.currentLevel.name,
                timeRemaining: this.timeRemaining,
                deaths: this.deathCount,
                levelIndex: this.currentLevelIndex,
                players: this.playerData,
            });
        });
    }

    update(time: number, delta: number): void {
        if (this.isGameOver) return;

        // Update players
        this.host.update();
        this.parasites.forEach(p => p.update(time, delta));

        // Update tether and check for snap
        const tetherStatus = this.tether.update();
        if (tetherStatus.snapped) {
            this.onPlayerDeath('tether');
        }

        // Update UI
        this.updateUI(tetherStatus.stretchPercent);

        // Check for falling off
        if (this.host.y > this.currentLevel.height + 100) {
            this.onPlayerDeath('fall');
        }
        this.parasites.forEach(p => {
            if (p.y > this.currentLevel.height + 100 && !p.getIsDead()) {
                this.onPlayerDeath('fall');
            }
        });
    }

    updateUI(tetherStretch: number): void {
        // Timer display
        const minutes = Math.floor(this.timeRemaining / 60);
        const seconds = this.timeRemaining % 60;
        this.timerText.setText(`${minutes}:${seconds.toString().padStart(2, '0')}`);

        // Timer color
        if (this.timeRemaining <= 10) {
            this.timerText.setColor('#ff0044');
            this.timerText.setScale(1 + Math.sin(Date.now() / 100) * 0.1);
        } else if (this.timeRemaining <= 20) {
            this.timerText.setColor('#ffaa00');
        } else {
            this.timerText.setColor('#ffffff');
        }

        // Tether indicator
        this.tetherUI.clear();
        const barWidth = 200;
        const barHeight = 8;
        const barX = GAME_CONFIG.WIDTH - barWidth - 20;
        const barY = 20;

        // Background
        this.tetherUI.fillStyle(0x1a1a2e, 0.8);
        this.tetherUI.fillRoundedRect(barX, barY, barWidth, barHeight, 4);

        // Fill based on stretch
        let color = GAME_CONFIG.COLORS.TETHER_SAFE;
        if (tetherStretch > 0.75) color = GAME_CONFIG.COLORS.TETHER_DANGER;
        else if (tetherStretch > 0.5) color = GAME_CONFIG.COLORS.TETHER_WARN;

        this.tetherUI.fillStyle(color, 1);
        this.tetherUI.fillRoundedRect(barX, barY, barWidth * Math.min(tetherStretch, 1), barHeight, 4);

        // Label
        if (!this.children.getByName('tetherLabel')) {
            const label = this.add.text(barX + barWidth / 2, barY + 18, 'TETHER', {
                fontFamily: 'monospace',
                fontSize: '10px',
                color: '#666666',
            });
            label.setOrigin(0.5);
            label.setScrollFactor(0);
            label.setDepth(100);
            label.setName('tetherLabel');
        }
    }
}
