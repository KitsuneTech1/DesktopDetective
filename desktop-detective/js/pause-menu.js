// Pause Menu Handler

class PauseMenu {
    constructor() {
        this.isPaused = false;
        this.overlay = null;
        this.init();
    }

    init() {
        // Create pause menu overlay
        this.createOverlay();
        
        // Listen for ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.toggle();
            }
        });
    }

    createOverlay() {
        this.overlay = document.createElement('div');
        this.overlay.id = 'pause-menu';
        this.overlay.className = 'hidden';
        this.overlay.innerHTML = `
            <div class="pause-backdrop"></div>
            <div class="pause-container">
                <div class="pause-header">
                    <span class="pause-icon">⏸️</span>
                    <h2>PAUSED</h2>
                </div>
                <div class="pause-buttons">
                    <button class="pause-btn resume-btn" data-action="resume">
                        <span class="btn-icon">▶️</span> Resume Game
                    </button>
                    <button class="pause-btn settings-btn" data-action="settings">
                        <span class="btn-icon">⚙️</span> Settings
                    </button>
                    <button class="pause-btn help-btn" data-action="help">
                        <span class="btn-icon">❓</span> How to Play
                    </button>
                    <button class="pause-btn quit-btn" data-action="quit">
                        <span class="btn-icon">🏠</span> Return to Menu
                    </button>
                </div>
                <div class="pause-footer">
                    <p>Press ESC to resume</p>
                </div>
            </div>
            
            <!-- Settings Panel -->
            <div id="settings-panel" class="pause-panel hidden">
                <div class="panel-header">
                    <h3>⚙️ Settings</h3>
                    <button class="panel-close" data-action="close-settings">✕</button>
                </div>
                <div class="panel-content">
                    <div class="setting-row">
                        <label>🔊 Sound Effects</label>
                        <label class="toggle">
                            <input type="checkbox" id="sfx-toggle" checked>
                            <span class="toggle-slider"></span>
                        </label>
                    </div>
                    <div class="setting-row">
                        <label>🖱️ Double-click to open apps</label>
                        <label class="toggle">
                            <input type="checkbox" id="dblclick-toggle" checked>
                            <span class="toggle-slider"></span>
                        </label>
                    </div>
                </div>
            </div>
            
            <!-- Help Panel -->
            <div id="help-panel" class="pause-panel hidden">
                <div class="panel-header">
                    <h3>❓ How to Play</h3>
                    <button class="panel-close" data-action="close-help">✕</button>
                </div>
                <div class="panel-content">
                    <div class="help-section">
                        <h4>🎯 Objective</h4>
                        <p>Investigate the suspect's computer to find clues about who committed the crime.</p>
                    </div>
                    <div class="help-section">
                        <h4>🖱️ Controls</h4>
                        <ul>
                            <li><kbd>Double-click</kbd> - Open apps/files</li>
                            <li><kbd>ESC</kbd> - Pause game</li>
                            <li><kbd>H</kbd> - Toggle help</li>
                        </ul>
                    </div>
                    <div class="help-section">
                        <h4>🔬 Investigator Tools</h4>
                        <ul>
                            <li><strong>📝 Notes</strong> - Keep track of clues</li>
                            <li><strong>✂️ Snip</strong> - Capture screenshots</li>
                            <li><strong>🎯 Accuse</strong> - Make your accusation</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(this.overlay);
        this.bindEvents();
    }

    bindEvents() {
        this.overlay.addEventListener('click', (e) => {
            const action = e.target.closest('[data-action]')?.dataset.action;
            if (!action) return;
            
            switch(action) {
                case 'resume':
                    this.toggle();
                    break;
                case 'settings':
                    this.showPanel('settings');
                    break;
                case 'help':
                    this.showPanel('help');
                    break;
                case 'quit':
                    this.quitToMenu();
                    break;
                case 'close-settings':
                case 'close-help':
                    this.closePanels();
                    break;
            }
        });
    }

    toggle() {
        // Only allow pause during gameplay
        const desktop = document.getElementById('desktop');
        if (desktop.classList.contains('hidden')) return;
        
        // Don't pause if snipping or accusation modal is open
        const snipOverlay = document.getElementById('snip-overlay');
        const accusationModal = document.getElementById('accusation-modal');
        const notesOverlay = document.getElementById('notes-overlay');
        
        if (snipOverlay && !snipOverlay.classList.contains('hidden')) return;
        if (accusationModal && !accusationModal.classList.contains('hidden')) return;
        if (notesOverlay && !notesOverlay.classList.contains('hidden')) return;
        
        this.isPaused = !this.isPaused;
        
        if (this.isPaused) {
            this.overlay.classList.remove('hidden');
            this.closePanels();
        } else {
            this.overlay.classList.add('hidden');
        }
    }

    showPanel(panelName) {
        this.closePanels();
        const panel = document.getElementById(`${panelName}-panel`);
        if (panel) {
            panel.classList.remove('hidden');
        }
    }

    closePanels() {
        const panels = this.overlay.querySelectorAll('.pause-panel');
        panels.forEach(p => p.classList.add('hidden'));
    }

    quitToMenu() {
        this.isPaused = false;
        this.overlay.classList.add('hidden');
        
        // Hide desktop, show main menu
        document.getElementById('desktop').classList.add('hidden');
        document.getElementById('main-menu').classList.remove('hidden');
        
        // Close all windows and reset game
        if (window.windowManager) {
            windowManager.closeAllWindows();
        }
        if (window.gameManager) {
            gameManager.reset();
        }
    }
}

// Create global instance when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.pauseMenu = new PauseMenu();
});
