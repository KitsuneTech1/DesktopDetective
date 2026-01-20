import Phaser from 'phaser';
import { GAME_CONFIG, ObstacleType } from '../config/GameConfig';

// Seeded random number generator for consistent levels
class SeededRandom {
    private seed: number;

    constructor(seed: number) {
        this.seed = seed;
    }

    next(): number {
        this.seed = (this.seed * 1103515245 + 12345) & 0x7fffffff;
        return this.seed / 0x7fffffff;
    }

    between(min: number, max: number): number {
        return Math.floor(this.next() * (max - min + 1)) + min;
    }

    pick<T>(array: T[]): T {
        return array[this.between(0, array.length - 1)];
    }
}

export interface LevelElement {
    type: 'platform' | 'spike' | 'saw' | 'checkpoint' | 'finish';
    x: number;
    y: number;
    width?: number;
    height?: number;
    moving?: boolean;
    moveRange?: number;
    moveSpeed?: number;
}

export interface LevelData {
    seed: number;
    name: string;
    width: number;
    height: number;
    timeLimit: number;
    spawnX: number;
    spawnY: number;
    elements: LevelElement[];
}

// Pre-defined level seeds for consistent "campaign" levels
export const CAMPAIGN_LEVELS = [
    { seed: 12345, name: 'Tutorial', time: 60, difficulty: 1 },
    { seed: 67890, name: 'First Steps', time: 50, difficulty: 2 },
    { seed: 11111, name: 'The Gap', time: 45, difficulty: 3 },
    { seed: 22222, name: 'Saw Mill', time: 40, difficulty: 4 },
    { seed: 33333, name: 'Separation Anxiety', time: 35, difficulty: 5 },
];

export class LevelGenerator {
    private rng: SeededRandom;

    constructor() {
        this.rng = new SeededRandom(0);
    }

    generateLevel(seed: number, difficulty: number = 3): LevelData {
        this.rng = new SeededRandom(seed);

        const width = 2500 + difficulty * 500;
        const height = GAME_CONFIG.HEIGHT;
        const timeLimit = Math.max(30, 60 - difficulty * 5);

        const elements: LevelElement[] = [];

        // Ground floor
        elements.push({
            type: 'platform',
            x: 0,
            y: height - 40,
            width: 300,
            height: 40,
        });

        // Generate level segments
        let currentX = 300;
        const segmentCount = 5 + difficulty * 2;

        for (let i = 0; i < segmentCount; i++) {
            const segment = this.generateSegment(currentX, difficulty, i === segmentCount - 1);
            elements.push(...segment.elements);
            currentX = segment.endX;
        }

        // Add checkpoints
        const checkpointInterval = width / (2 + difficulty);
        for (let x = checkpointInterval; x < width - 200; x += checkpointInterval) {
            elements.push({
                type: 'checkpoint',
                x: x,
                y: height - 140,
            });
        }

        // Finish zone
        elements.push({
            type: 'finish',
            x: currentX + 100,
            y: height - 200,
        });

        // Final platform under finish
        elements.push({
            type: 'platform',
            x: currentX + 50,
            y: height - 40,
            width: 200,
            height: 40,
        });

        return {
            seed,
            name: `Level ${seed}`,
            width: currentX + 300,
            height,
            timeLimit,
            spawnX: 100,
            spawnY: height - 150,
            elements,
        };
    }

    private generateSegment(startX: number, difficulty: number, isFinal: boolean): { elements: LevelElement[]; endX: number } {
        const elements: LevelElement[] = [];
        const baseY = GAME_CONFIG.HEIGHT - 40;

        const segmentType = this.rng.between(0, 4);
        let endX = startX;

        switch (segmentType) {
            case 0: // Platform jumps
                endX = this.createPlatformJumps(elements, startX, baseY, difficulty);
                break;
            case 1: // Spike gauntlet
                endX = this.createSpikeGauntlet(elements, startX, baseY, difficulty);
                break;
            case 2: // Moving platforms
                endX = this.createMovingPlatforms(elements, startX, baseY, difficulty);
                break;
            case 3: // Saw dodge
                endX = this.createSawDodge(elements, startX, baseY, difficulty);
                break;
            case 4: // Mixed challenge
                endX = this.createMixedChallenge(elements, startX, baseY, difficulty);
                break;
        }

        return { elements, endX };
    }

    private createPlatformJumps(elements: LevelElement[], startX: number, baseY: number, difficulty: number): number {
        const platformCount = 3 + difficulty;
        let x = startX;
        let y = baseY;

        for (let i = 0; i < platformCount; i++) {
            const gap = this.rng.between(100, 150 + difficulty * 20);
            const heightChange = this.rng.between(-80, 60);

            x += gap;
            y = Math.max(200, Math.min(baseY, y + heightChange));

            elements.push({
                type: 'platform',
                x,
                y,
                width: this.rng.between(64, 128),
                height: 24,
            });

            // Add spike on some platforms at higher difficulty
            if (difficulty > 2 && this.rng.next() > 0.6) {
                elements.push({
                    type: 'spike',
                    x: x + 20,
                    y: y - 32,
                });
            }
        }

        return x + 150;
    }

    private createSpikeGauntlet(elements: LevelElement[], startX: number, baseY: number, difficulty: number): number {
        const length = 300 + difficulty * 50;

        // Ground platform
        elements.push({
            type: 'platform',
            x: startX,
            y: baseY,
            width: length,
            height: 40,
        });

        // Spikes on ground with gaps
        const spikeCount = Math.floor(length / 50);
        for (let i = 0; i < spikeCount; i++) {
            if (this.rng.next() > 0.3) { // 70% chance of spike
                elements.push({
                    type: 'spike',
                    x: startX + 30 + i * 50,
                    y: baseY - 32,
                });
            }
        }

        return startX + length;
    }

    private createMovingPlatforms(elements: LevelElement[], startX: number, baseY: number, difficulty: number): number {
        const platformCount = 2 + Math.floor(difficulty / 2);
        let x = startX;

        // Pit below
        for (let i = 0; i < platformCount; i++) {
            x += 180;

            elements.push({
                type: 'platform',
                x,
                y: baseY - 100 - this.rng.between(0, 100),
                width: 100,
                height: 24,
                moving: true,
                moveRange: 80 + difficulty * 20,
                moveSpeed: 50 + difficulty * 10,
            });
        }

        // Landing platform
        x += 150;
        elements.push({
            type: 'platform',
            x,
            y: baseY,
            width: 150,
            height: 40,
        });

        return x + 150;
    }

    private createSawDodge(elements: LevelElement[], startX: number, baseY: number, difficulty: number): number {
        const length = 250 + difficulty * 40;

        // Ground platform
        elements.push({
            type: 'platform',
            x: startX,
            y: baseY,
            width: length,
            height: 40,
        });

        // Saws moving horizontally
        const sawCount = 1 + Math.floor(difficulty / 2);
        for (let i = 0; i < sawCount; i++) {
            elements.push({
                type: 'saw',
                x: startX + 50 + i * (length / sawCount),
                y: baseY - 80 - this.rng.between(0, 60),
                moving: true,
                moveRange: 60 + difficulty * 15,
                moveSpeed: 80 + difficulty * 20,
            });
        }

        return startX + length;
    }

    private createMixedChallenge(elements: LevelElement[], startX: number, baseY: number, difficulty: number): number {
        let x = startX;

        // Small platform
        elements.push({
            type: 'platform',
            x,
            y: baseY,
            width: 100,
            height: 40,
        });

        // Gap with spike at bottom
        x += 180;
        elements.push({
            type: 'platform',
            x,
            y: baseY - 60,
            width: 80,
            height: 24,
        });

        // Saw above
        if (difficulty > 1) {
            elements.push({
                type: 'saw',
                x: x + 40,
                y: baseY - 150,
                moving: true,
                moveRange: 40,
                moveSpeed: 60,
            });
        }

        // Higher platform
        x += 150;
        elements.push({
            type: 'platform',
            x,
            y: baseY - 120,
            width: 100,
            height: 24,
        });

        // Final landing
        x += 180;
        elements.push({
            type: 'platform',
            x,
            y: baseY,
            width: 150,
            height: 40,
        });

        return x + 150;
    }

    // Generate a completely random level (for endless mode)
    generateRandomLevel(): LevelData {
        const seed = Math.floor(Math.random() * 1000000);
        const difficulty = Phaser.Math.Between(2, 5);
        return this.generateLevel(seed, difficulty);
    }

    // Get a specific campaign level
    getCampaignLevel(index: number): LevelData {
        const levelInfo = CAMPAIGN_LEVELS[Math.min(index, CAMPAIGN_LEVELS.length - 1)];
        const level = this.generateLevel(levelInfo.seed, levelInfo.difficulty);
        level.name = levelInfo.name;
        level.timeLimit = levelInfo.time;
        return level;
    }
}
