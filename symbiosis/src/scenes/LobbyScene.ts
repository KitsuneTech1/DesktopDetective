import Phaser from 'phaser';
import { GAME_CONFIG, PLAYER_COLORS, CONTROLS, PlayerRole } from '../config/GameConfig';

interface PlayerSlot {
    active: boolean;
    role: PlayerRole;
    ready: boolean;
}

export class LobbyScene extends Phaser.Scene {
    private players: PlayerSlot[] = [];
    private playerDisplays: Phaser.GameObjects.Container[] = [];
    private startButton!: Phaser.GameObjects.Text;
    private canStart = false;

    constructor() {
        super({ key: 'LobbyScene' });
    }

    create(): void {
        const { width, height } = this.cameras.main;

        // Initialize 4 player slots
        this.players = [
            { active: false, role: PlayerRole.HOST, ready: false },
            { active: false, role: PlayerRole.PARASITE, ready: false },
            { active: false, role: PlayerRole.PARASITE, ready: false },
            { active: false, role: PlayerRole.PARASITE, ready: false },
        ];

        // Background
        this.createBackgroundGrid();

        // Title
        const title = this.add.text(width / 2, 60, 'PLAYER LOBBY', {
            fontFamily: 'Arial Black, Impact, sans-serif',
            fontSize: '48px',
            color: '#00fff7',
        });
        title.setOrigin(0.5);

        // Instructions
        const instructions = this.add.text(width / 2, 110, 'Press your JUMP key to join!', {
            fontFamily: 'monospace',
            fontSize: '18px',
            color: '#888888',
        });
        instructions.setOrigin(0.5);

        // Create player slots (2x2 grid)
        this.createPlayerSlots();

        // Start button (hidden until 2+ players)
        this.startButton = this.add.text(width / 2, height - 80, '[ PRESS ENTER TO START ]', {
            fontFamily: 'monospace',
            fontSize: '24px',
            color: '#00ff88',
        });
        this.startButton.setOrigin(0.5);
        this.startButton.setAlpha(0.3);

        // Back button
        const backBtn = this.add.text(40, height - 40, '< BACK (ESC)', {
            fontFamily: 'monospace',
            fontSize: '16px',
            color: '#666666',
        });
        backBtn.setInteractive({ useHandCursor: true });
        backBtn.on('pointerdown', () => this.scene.start('MenuScene'));

        // Input handlers
        this.setupInputHandlers();
    }

    createPlayerSlots(): void {
        const { width, height } = this.cameras.main;
        const slotWidth = 250;
        const slotHeight = 280;
        const startX = width / 2 - slotWidth - 40;
        const startY = 180;

        const controlHints = [
            'WASD',
            'Arrow Keys',
            'IJKL',
            'Numpad 4/6/8',
        ];

        for (let i = 0; i < 4; i++) {
            const col = i % 2;
            const row = Math.floor(i / 2);
            const x = startX + col * (slotWidth + 80);
            const y = startY + row * (slotHeight + 30);

            const container = this.add.container(x, y);

            // Slot background
            const bg = this.add.rectangle(0, 0, slotWidth, slotHeight, 0x1a1a2e, 0.5);
            bg.setStrokeStyle(2, PLAYER_COLORS[i], 0.5);
            container.add(bg);

            // Player number
            const playerNum = this.add.text(0, -slotHeight / 2 + 30, `PLAYER ${i + 1}`, {
                fontFamily: 'monospace',
                fontSize: '20px',
                color: '#ffffff',
            });
            playerNum.setOrigin(0.5);
            container.add(playerNum);

            // Role label
            const roleLabel = this.add.text(0, -20, i === 0 ? 'HOST' : 'PARASITE', {
                fontFamily: 'monospace',
                fontSize: '16px',
                color: i === 0 ? '#00fff7' : '#ff00ff',
            });
            roleLabel.setOrigin(0.5);
            container.add(roleLabel);

            // Status text
            const status = this.add.text(0, 20, 'Press to join...', {
                fontFamily: 'monospace',
                fontSize: '14px',
                color: '#555555',
            });
            status.setOrigin(0.5);
            status.setName('status');
            container.add(status);

            // Player icon (hidden until joined)
            const icon = this.add.circle(0, -60, i === 0 ? 28 : 20, PLAYER_COLORS[i]);
            icon.setAlpha(0.2);
            icon.setName('icon');
            container.add(icon);

            // Controls hint
            const controls = this.add.text(0, slotHeight / 2 - 40, controlHints[i], {
                fontFamily: 'monospace',
                fontSize: '12px',
                color: '#444444',
            });
            controls.setOrigin(0.5);
            container.add(controls);

            this.playerDisplays.push(container);
        }
    }

    setupInputHandlers(): void {
        const keyboard = this.input.keyboard!;

        // Player 1 - W to join
        keyboard.on('keydown-W', () => this.togglePlayer(0));

        // Player 2 - UP to join
        keyboard.on('keydown-UP', () => this.togglePlayer(1));

        // Player 3 - I to join
        keyboard.on('keydown-I', () => this.togglePlayer(2));

        // Player 4 - Numpad 8 to join
        keyboard.on('keydown-NUMPAD_EIGHT', () => this.togglePlayer(3));

        // Start game
        keyboard.on('keydown-ENTER', () => {
            if (this.canStart) {
                this.startGame();
            }
        });

        // Back to menu
        keyboard.on('keydown-ESC', () => {
            this.scene.start('MenuScene');
        });
    }

    togglePlayer(index: number): void {
        this.players[index].active = !this.players[index].active;
        this.updatePlayerDisplay(index);
        this.checkCanStart();
    }

    updatePlayerDisplay(index: number): void {
        const container = this.playerDisplays[index];
        const player = this.players[index];
        const icon = container.getByName('icon') as Phaser.GameObjects.Arc;
        const status = container.getByName('status') as Phaser.GameObjects.Text;

        if (player.active) {
            icon.setAlpha(1);
            status.setText('READY!');
            status.setColor('#00ff88');

            // Bounce animation
            this.tweens.add({
                targets: icon,
                scale: 1.2,
                duration: 100,
                yoyo: true,
            });
        } else {
            icon.setAlpha(0.2);
            status.setText('Press to join...');
            status.setColor('#555555');
        }
    }

    checkCanStart(): void {
        const activePlayers = this.players.filter(p => p.active).length;

        // Need at least 2 players (1 host + 1 parasite)
        this.canStart = activePlayers >= 2 && this.players[0].active;

        if (this.canStart) {
            this.startButton.setAlpha(1);
            this.tweens.add({
                targets: this.startButton,
                alpha: 0.6,
                duration: 500,
                yoyo: true,
                repeat: -1,
            });
        } else {
            this.tweens.killTweensOf(this.startButton);
            this.startButton.setAlpha(0.3);
        }
    }

    startGame(): void {
        // Pass player data to game scene
        const activePlayers = this.players
            .map((p, i) => ({ ...p, index: i }))
            .filter(p => p.active);

        this.scene.start('GameScene', { players: activePlayers });
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
