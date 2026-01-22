// Help Overlay Handler - Quick reference for controls (H key toggle)

class HelpOverlay {
    constructor() {
        this.isVisible = false;
        this.overlay = null;
        this.init();
    }

    init() {
        this.createOverlay();

        // Listen for H key
        document.addEventListener('keydown', (e) => {
            if (e.key.toLowerCase() === 'h' && !this.isInputFocused()) {
                this.toggle();
            }
        });
    }

    isInputFocused() {
        const activeEl = document.activeElement;
        return activeEl.tagName === 'INPUT' ||
            activeEl.tagName === 'TEXTAREA' ||
            activeEl.isContentEditable;
    }

    createOverlay() {
        this.overlay = document.createElement('div');
        this.overlay.id = 'help-overlay';
        this.overlay.className = 'hidden';
        this.overlay.innerHTML = `
            <div class="help-backdrop"></div>
            <div class="help-card">
                <div class="help-card-header">
                    <span class="help-icon">🎮</span>
                    <h2>QUICK CONTROLS</h2>
                    <button class="help-close" aria-label="Close">✕</button>
                </div>
                <div class="help-card-body">
                    <div class="help-grid">
                        <div class="help-item">
                            <kbd>Double-click</kbd>
                            <span>Open apps & files</span>
                        </div>
                        <div class="help-item">
                            <kbd>ESC</kbd>
                            <span>Pause game</span>
                        </div>
                        <div class="help-item">
                            <kbd>H</kbd>
                            <span>Toggle this help</span>
                        </div>
                    </div>
                    
                    <div class="help-tools">
                        <h3>🔬 Investigator Tools</h3>
                        <div class="tool-list">
                            <div class="tool-item">
                                <span class="tool-icon">📝</span>
                                <div>
                                    <strong>Notes</strong>
                                    <p>Keep track of clues & evidence</p>
                                </div>
                            </div>
                            <div class="tool-item">
                                <span class="tool-icon">✂️</span>
                                <div>
                                    <strong>Snip</strong>
                                    <p>Capture screenshots of evidence</p>
                                </div>
                            </div>
                            <div class="tool-item">
                                <span class="tool-icon">🎯</span>
                                <div>
                                    <strong>Accuse</strong>
                                    <p>Make your accusation when ready</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="help-card-footer">
                    <p>Press <kbd>H</kbd> to close</p>
                </div>
            </div>
        `;

        document.body.appendChild(this.overlay);

        // Close button
        this.overlay.querySelector('.help-close').addEventListener('click', () => {
            this.hide();
        });

        // Click backdrop to close
        this.overlay.querySelector('.help-backdrop').addEventListener('click', () => {
            this.hide();
        });
    }

    toggle() {
        // Only allow during gameplay
        const desktop = document.getElementById('desktop');
        if (desktop.classList.contains('hidden')) return;

        // Don't show if pause menu is visible
        const pauseMenu = document.getElementById('pause-menu');
        if (pauseMenu && !pauseMenu.classList.contains('hidden')) return;

        // Don't show if notes overlay is visible
        const notesOverlay = document.getElementById('notes-overlay');
        if (notesOverlay && !notesOverlay.classList.contains('hidden')) return;

        if (this.isVisible) {
            this.hide();
        } else {
            this.show();
        }
    }

    show() {
        this.isVisible = true;
        this.overlay.classList.remove('hidden');
    }

    hide() {
        this.isVisible = false;
        this.overlay.classList.add('hidden');
    }
}

// Create global instance when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.helpOverlay = new HelpOverlay();
});
