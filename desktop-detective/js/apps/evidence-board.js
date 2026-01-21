// Evidence Board App

class EvidenceBoard {
    constructor(suspects, requiredEvidence, onAccuse) {
        this.suspects = suspects;
        this.collectedEvidence = [];
        this.requiredEvidence = requiredEvidence;
        this.onAccuse = onAccuse;
    }

    addEvidence(evidenceId, text, source) {
        if (!this.collectedEvidence.find(e => e.id === evidenceId)) {
            this.collectedEvidence.push({
                id: evidenceId,
                text: text,
                source: source
            });
            this.updateUI();
            return true;
        }
        return false;
    }

    open() {
        const html = this.render();
        const windowEl = windowManager.createWindow('evidence', 'Evidence Board', '🔍', html, 550, 500);
        this.windowEl = windowEl;
        this.bindEvents(windowEl);
    }

    render() {
        return `
            <div class="evidence-board">
                <div class="evidence-header">
                    <h3>Collected Evidence (${this.collectedEvidence.length}/${this.requiredEvidence} required)</h3>
                    <button class="accuse-btn" ${this.collectedEvidence.length < this.requiredEvidence ? 'disabled' : ''}>
                        Make Accusation
                    </button>
                </div>
                <div class="evidence-list">
                    ${this.collectedEvidence.length === 0 ?
                '<p class="evidence-empty">No evidence collected yet.<br><br>Examine emails, chats, files, and browser history to find clues.</p>' :
                this.collectedEvidence.map(e => `
                            <div class="evidence-entry key-evidence">
                                <div class="evidence-source">${e.source}</div>
                                <div class="evidence-text">${e.text}</div>
                            </div>
                        `).join('')
            }
                </div>
                ${this.collectedEvidence.length > 0 ? `
                    <div class="evidence-suspects">
                        <h4>SUSPECTS:</h4>
                        ${this.suspects.map(s => `
                            <span class="suspect-chip">${s.name} - ${s.relation}</span>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `;
    }

    updateUI() {
        if (this.windowEl && document.contains(this.windowEl)) {
            this.windowEl.querySelector('.window-content').innerHTML = this.render();
            this.bindEvents(this.windowEl);
        }

        // Update taskbar evidence count
        document.getElementById('evidence-count').textContent =
            `Evidence: ${this.collectedEvidence.length}/${this.requiredEvidence}`;
    }

    bindEvents(windowEl) {
        const accuseBtn = windowEl.querySelector('.accuse-btn');
        if (accuseBtn) {
            accuseBtn.addEventListener('click', () => {
                if (this.collectedEvidence.length >= this.requiredEvidence) {
                    this.onAccuse();
                }
            });
        }
    }

    getCollectedEvidence() {
        return this.collectedEvidence;
    }
}
