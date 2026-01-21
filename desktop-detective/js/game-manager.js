// Game Manager - Simplified (no evidence system, just accusation)

class GameManager {
    constructor() {
        this.currentCase = null;
        this.apps = {};
        this.selectedSuspect = null;
    }

    loadCase(caseData) {
        this.currentCase = caseData;

        // Initialize apps (no evidence callbacks)
        this.apps.fileExplorer = new FileExplorer(
            caseData.fileSystem,
            (name, content) => this.openTextFile(name, content)
        );

        this.apps.email = new EmailClient(caseData.emails);
        this.apps.chat = new ChatApp(caseData.chats);
        this.apps.photos = new PhotoViewer(caseData.photos);
        this.apps.calendar = new CalendarApp(caseData.calendar);
        this.apps.browser = new BrowserApp(caseData.browserHistory, caseData.bookmarks, caseData.browserPages);
    }

    openApp(appId) {
        switch (appId) {
            case 'file-explorer':
                this.apps.fileExplorer.open();
                break;
            case 'email':
                this.apps.email.open();
                break;
            case 'chat':
                this.apps.chat.open();
                break;
            case 'photos':
                this.apps.photos.open();
                break;
            case 'calendar':
                this.apps.calendar.open();
                break;
            case 'browser':
                this.apps.browser.open();
                break;
            case 'recycle':
                this.openRecycleBin();
                break;
        }
    }

    openTextFile(name, content) {
        const html = `<div class="notepad-content">${content}</div>`;
        windowManager.createWindow(`file-${name}`, name, '📄', html, 500, 400);
    }

    openRecycleBin() {
        const recycledFiles = this.currentCase.recycledFiles || [];
        const html = `
            <div class="file-list" style="padding: 15px;">
                <div class="file-grid">
                    ${recycledFiles.map((file, index) => `
                        <div class="file-item" data-index="${index}">
                            <div class="file-icon">${file.icon}</div>
                            <div class="file-name">${file.name}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        const windowEl = windowManager.createWindow('recycle', 'Recycle Bin', '🗑️', html, 400, 350);

        windowEl.querySelector('.file-list').addEventListener('dblclick', (e) => {
            const fileItem = e.target.closest('.file-item');
            if (fileItem) {
                const index = parseInt(fileItem.dataset.index);
                const file = recycledFiles[index];
                this.openTextFile(file.name + ' (Deleted)', file.content);
            }
        });
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            bottom: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--accent);
            color: white;
            padding: 12px 24px;
            border-radius: 6px;
            font-size: 14px;
            z-index: 9999;
            animation: slideUp 0.3s ease;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }

    openAccusationModal() {
        const modal = document.getElementById('accusation-modal');
        const suspectList = document.getElementById('suspect-list');

        // Render suspects
        suspectList.innerHTML = this.currentCase.suspects.map(s => `
            <div class="suspect-option" data-suspect="${s.id}">
                <div class="suspect-name">${s.name}</div>
                <div class="suspect-relation">${s.relation}</div>
            </div>
        `).join('');

        modal.classList.remove('hidden');
        this.bindAccusationEvents();
    }

    bindAccusationEvents() {
        const modal = document.getElementById('accusation-modal');
        const suspectList = document.getElementById('suspect-list');
        const submitBtn = document.getElementById('submit-accusation');
        const cancelBtn = document.getElementById('cancel-accusation');

        // Suspect selection
        suspectList.onclick = (e) => {
            const option = e.target.closest('.suspect-option');
            if (option) {
                suspectList.querySelectorAll('.suspect-option').forEach(el => el.classList.remove('selected'));
                option.classList.add('selected');
                this.selectedSuspect = option.dataset.suspect;
                submitBtn.disabled = false;
            }
        };

        // Submit accusation
        submitBtn.onclick = () => {
            if (this.selectedSuspect) {
                this.submitAccusation();
            }
        };

        // Cancel
        cancelBtn.onclick = () => {
            modal.classList.add('hidden');
            this.selectedSuspect = null;
        };
    }

    submitAccusation() {
        const isCorrect = this.selectedSuspect === this.currentCase.killer;
        document.getElementById('accusation-modal').classList.add('hidden');
        this.showResult(isCorrect);
    }

    showResult(correctKiller) {
        const resultScreen = document.getElementById('result-screen');
        const resultIcon = document.getElementById('result-icon');
        const resultTitle = document.getElementById('result-title');
        const resultText = document.getElementById('result-text');

        document.getElementById('desktop').classList.add('hidden');
        resultScreen.classList.remove('hidden');

        if (correctKiller) {
            resultIcon.textContent = '🏆';
            resultIcon.style.color = 'var(--success)';
            resultTitle.textContent = 'CASE CLOSED';
            resultTitle.style.color = 'var(--success)';
            resultText.innerHTML = `
                <p><strong>Excellent work, Detective!</strong></p>
                <br>
                <p>You correctly identified <strong>Tyler Ross</strong> as the killer.</p>
                <br>
                <p><strong>The Truth:</strong></p>
                <p>Tyler Ross was deep in gambling debt, owing $347,000 to a bookie. He embezzled $2.3 million from NovaTech to cover his losses, but Marcus was about to uncover the fraud.</p>
                <br>
                <p>Desperate, Tyler changed Marcus's life insurance policy to make himself the beneficiary, then poisoned Marcus's coffee during their evening meeting.</p>
                <br>
                <p>Thanks to your investigation, justice will be served.</p>
            `;
        } else {
            resultIcon.textContent = '❌';
            resultIcon.style.color = 'var(--error)';
            resultTitle.textContent = 'WRONG ACCUSATION';
            resultTitle.style.color = 'var(--error)';

            const accusedName = this.currentCase.suspects.find(s => s.id === this.selectedSuspect)?.name || 'Unknown';

            resultText.innerHTML = `
                <p><strong>An innocent person was accused.</strong></p>
                <br>
                <p>You accused <strong>${accusedName}</strong>, but they were innocent. The real killer remains free.</p>
                <br>
                <p><strong>Hint:</strong> Follow the money. Who had the most to gain financially from Marcus's death?</p>
            `;
        }

        document.getElementById('return-menu').onclick = () => {
            resultScreen.classList.add('hidden');
            document.getElementById('main-menu').classList.remove('hidden');
            windowManager.closeAllWindows();
            this.reset();
        };
    }

    reset() {
        this.currentCase = null;
        this.apps = {};
        this.selectedSuspect = null;
    }
}

// Create global instance
const gameManager = new GameManager();
