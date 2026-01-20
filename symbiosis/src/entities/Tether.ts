import Phaser from 'phaser';
import { GAME_CONFIG } from '../config/GameConfig';
import { Host } from './Host';
import { Parasite } from './Parasite';

export class Tether {
    private scene: Phaser.Scene;
    private host: Host;
    private parasites: Parasite[];
    private graphics: Phaser.GameObjects.Graphics;
    private warningActive = false;

    constructor(scene: Phaser.Scene, host: Host, parasites: Parasite[]) {
        this.scene = scene;
        this.host = host;
        this.parasites = parasites;
        this.graphics = scene.add.graphics();
        this.graphics.setDepth(-1); // Draw behind players
    }

    update(): { snapped: boolean; stretchPercent: number } {
        this.graphics.clear();

        let maxStretch = 0;
        let anySnapped = false;

        for (const parasite of this.parasites) {
            if (parasite.getIsDead()) continue;

            const distance = Phaser.Math.Distance.Between(
                this.host.x, this.host.y,
                parasite.x, parasite.y
            );

            const stretchPercent = distance / GAME_CONFIG.TETHER.MAX_LENGTH;
            maxStretch = Math.max(maxStretch, stretchPercent);

            // Check if tether snapped
            if (distance > GAME_CONFIG.TETHER.MAX_LENGTH) {
                anySnapped = true;
            }

            // Draw tether line
            this.drawTether(this.host, parasite, stretchPercent);
        }

        // Screen shake when in warning zone
        if (maxStretch > 0.75 && maxStretch < 1) {
            if (!this.warningActive) {
                this.warningActive = true;
            }
            const intensity = (maxStretch - 0.75) * 8;
            this.scene.cameras.main.shake(50, intensity * 0.002);
        } else {
            this.warningActive = false;
        }

        return { snapped: anySnapped, stretchPercent: maxStretch };
    }

    private drawTether(host: Host, parasite: Parasite, stretchPercent: number): void {
        // Determine color based on stretch
        let color: number;
        let alpha: number;
        let lineWidth: number;

        if (stretchPercent < 0.5) {
            // Safe - green
            color = GAME_CONFIG.COLORS.TETHER_SAFE;
            alpha = 0.8;
            lineWidth = 4;
        } else if (stretchPercent < 0.75) {
            // Warning - yellow/orange
            color = GAME_CONFIG.COLORS.TETHER_WARN;
            alpha = 0.9;
            lineWidth = 3;
        } else {
            // Danger - red, pulsing
            color = GAME_CONFIG.COLORS.TETHER_DANGER;
            alpha = 0.7 + Math.sin(Date.now() / 50) * 0.3;
            lineWidth = 2 + Math.sin(Date.now() / 30);
        }

        // Draw electric arc effect
        this.graphics.lineStyle(lineWidth, color, alpha);

        // Create slightly wobbly line
        const points: Phaser.Math.Vector2[] = [];
        const segments = 10;

        for (let i = 0; i <= segments; i++) {
            const t = i / segments;
            const x = Phaser.Math.Linear(host.x, parasite.x, t);
            const y = Phaser.Math.Linear(host.y, parasite.y, t);

            // Add wobble in danger zone
            const wobble = stretchPercent > 0.5
                ? Math.sin(Date.now() / 30 + i * 2) * (stretchPercent * 8)
                : 0;

            points.push(new Phaser.Math.Vector2(x + wobble, y + wobble));
        }

        // Draw the line
        this.graphics.beginPath();
        this.graphics.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            this.graphics.lineTo(points[i].x, points[i].y);
        }
        this.graphics.strokePath();

        // Glow effect
        this.graphics.lineStyle(lineWidth + 4, color, alpha * 0.3);
        this.graphics.beginPath();
        this.graphics.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            this.graphics.lineTo(points[i].x, points[i].y);
        }
        this.graphics.strokePath();
    }

    destroy(): void {
        this.graphics.destroy();
    }
}
