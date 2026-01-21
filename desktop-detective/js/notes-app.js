// Investigator Notes App - Obsidian-style with sidebar and real screenshot capture

class NotesApp {
    constructor() {
        this.notes = [];
        this.activeNoteId = null;
        this.capturedSnip = null;
        this.windowOpen = false;

        this.init();
    }

    init() {
        this.loadNotes();

        document.getElementById('btn-notes').addEventListener('click', () => this.openNotesWindow());
        document.getElementById('btn-snip').addEventListener('click', () => this.startSnipping());

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (!document.getElementById('snip-overlay').classList.contains('hidden')) {
                    this.cancelSnipping();
                }
            }
        });

        this.setupSnippingTool();
    }

    // ===== NOTES MANAGEMENT =====

    loadNotes() {
        try {
            const saved = localStorage.getItem('detective_notes');
            if (saved) {
                this.notes = JSON.parse(saved);
            }
        } catch (e) {
            this.notes = [];
        }

        if (this.notes.length === 0) {
            // Create case briefing note with info
            this.notes.push({
                id: 'case-briefing',
                title: '📋 Case Briefing',
                content: `<b>VICTIM:</b> Marcus Chen, 42, CEO of NovaTech Solutions<br><br>
<b>CAUSE OF DEATH:</b> Poisoning (suspected ethylene glycol/antifreeze)<br><br>
<b>LOCATION:</b> NovaTech headquarters, private office<br><br>
<b>TIME OF DEATH:</b> March 15, 2024, approximately 7:30 PM<br><br>
<b>DISCOVERY:</b> Found dead at his desk by cleaning staff at 9:15 PM<br><br>
<hr><br>
<b>SUSPECTS:</b><br>
• <b>Diana Chen</b> - Wife, recently discovered his affair<br>
• <b>Tyler Ross</b> - Business Partner & CFO<br>
• <b>Alex Kim</b> - Former employee, fired 2 weeks ago<br>
• <b>Sam Chen</b> - Victim's brother, cut from family trust<br><br>
<hr><br>
<b>YOUR TASK:</b> Examine the suspect's laptop - files, emails, messages, browser history - to figure out who murdered Marcus Chen.`,
                created: new Date().toISOString(),
                updated: new Date().toISOString()
            });

            // Create empty investigation notes
            this.notes.push({
                id: Date.now().toString(),
                title: 'My Notes',
                content: '',
                created: new Date().toISOString(),
                updated: new Date().toISOString()
            });

            this.saveNotes();
        }

        this.activeNoteId = this.notes[0].id;
    }

    saveNotes() {
        try {
            localStorage.setItem('detective_notes', JSON.stringify(this.notes));
        } catch (e) {
            console.error('Failed to save notes:', e);
        }
    }

    openNotesWindow() {
        if (this.windowOpen && windowManager.windows.has('investigator-notes')) {
            windowManager.focusWindow('investigator-notes');
            return;
        }

        const html = this.renderNotesWindow();
        const windowEl = windowManager.createWindow(
            'investigator-notes',
            '📝 Investigator Notes',
            '📝',
            html,
            650,
            450
        );

        // Position
        windowEl.style.right = '20px';
        windowEl.style.left = 'auto';
        windowEl.style.bottom = '100px';
        windowEl.style.top = 'auto';

        // Purple theme for "your" notes
        windowEl.style.borderColor = '#9333ea';
        windowEl.querySelector('.window-titlebar').style.background = 'linear-gradient(90deg, #4c1d95, #1e1b4b)';

        // Make resizable
        this.makeResizable(windowEl);

        // Remove default padding from window content
        windowEl.querySelector('.window-content').style.padding = '0';

        this.windowOpen = true;
        this.bindNotesEvents(windowEl);

        // Handle window close
        const originalClose = windowManager.closeWindow.bind(windowManager);
        windowManager.closeWindow = (appId) => {
            if (appId === 'investigator-notes') {
                this.saveCurrentNote();
                this.windowOpen = false;
            }
            originalClose(appId);
        };
    }

    makeResizable(windowEl) {
        // Add resize handle
        const resizeHandle = document.createElement('div');
        resizeHandle.className = 'resize-handle';
        resizeHandle.innerHTML = '⟋';
        windowEl.appendChild(resizeHandle);

        let isResizing = false;
        let startX, startY, startWidth, startHeight;

        resizeHandle.addEventListener('mousedown', (e) => {
            isResizing = true;
            startX = e.clientX;
            startY = e.clientY;
            startWidth = windowEl.offsetWidth;
            startHeight = windowEl.offsetHeight;
            e.preventDefault();
            e.stopPropagation();

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });

        const onMouseMove = (e) => {
            if (!isResizing) return;
            const newWidth = startWidth + (e.clientX - startX);
            const newHeight = startHeight + (e.clientY - startY);
            windowEl.style.width = `${Math.max(400, newWidth)}px`;
            windowEl.style.height = `${Math.max(300, newHeight)}px`;
        };

        const onMouseUp = () => {
            isResizing = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };
    }

    renderNotesWindow() {
        const currentNote = this.notes.find(n => n.id === this.activeNoteId) || this.notes[0];

        return `
            <div class="obsidian-notes">
                <div class="obsidian-sidebar">
                    <div class="obsidian-sidebar-header">
                        <span>📁 NOTES</span>
                        <button class="obsidian-new-btn" title="New Note">+</button>
                    </div>
                    <div class="obsidian-note-list">
                        ${this.notes.map(note => `
                            <div class="obsidian-note-item ${note.id === this.activeNoteId ? 'active' : ''}" data-id="${note.id}">
                                <span class="note-icon">📄</span>
                                <span class="note-name">${note.title || 'Untitled'}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="obsidian-editor">
                    <div class="obsidian-editor-header">
                        <input type="text" class="obsidian-title" value="${currentNote.title}" placeholder="Note title...">
                        <button class="obsidian-delete" title="Delete note">🗑️</button>
                    </div>
                    <div class="obsidian-content" contenteditable="true" placeholder="Start typing your investigation notes...">${currentNote.content}</div>
                    <div class="obsidian-footer">
                        <button class="obsidian-paste-snip ${this.capturedSnip ? 'has-snip' : ''}" ${!this.capturedSnip ? 'disabled' : ''}>
                            📸 ${this.capturedSnip ? 'Paste Screenshot' : 'No screenshot captured'}
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    bindNotesEvents(windowEl) {
        const content = windowEl.querySelector('.obsidian-content');
        const title = windowEl.querySelector('.obsidian-title');
        const deleteBtn = windowEl.querySelector('.obsidian-delete');
        const newBtn = windowEl.querySelector('.obsidian-new-btn');
        const pasteBtn = windowEl.querySelector('.obsidian-paste-snip');

        content.addEventListener('input', () => this.saveCurrentNote(windowEl));
        title.addEventListener('input', () => {
            this.saveCurrentNote(windowEl);
            this.updateSidebar(windowEl);
        });

        deleteBtn.addEventListener('click', () => this.deleteCurrentNote(windowEl));
        newBtn.addEventListener('click', () => this.addNote(windowEl));
        pasteBtn.addEventListener('click', () => this.pasteSnipToNote(windowEl));

        windowEl.querySelectorAll('.obsidian-note-item').forEach(item => {
            item.addEventListener('click', () => this.switchToNote(item.dataset.id, windowEl));
        });
    }

    saveCurrentNote(windowEl) {
        if (!this.activeNoteId) return;

        const note = this.notes.find(n => n.id === this.activeNoteId);
        if (note && windowEl) {
            const title = windowEl.querySelector('.obsidian-title');
            const content = windowEl.querySelector('.obsidian-content');
            if (title && content) {
                note.title = title.value || 'Untitled';
                note.content = content.innerHTML;
                note.updated = new Date().toISOString();
                this.saveNotes();
            }
        }
    }

    updateSidebar(windowEl) {
        const list = windowEl.querySelector('.obsidian-note-list');
        list.innerHTML = this.notes.map(note => `
            <div class="obsidian-note-item ${note.id === this.activeNoteId ? 'active' : ''}" data-id="${note.id}">
                <span class="note-icon">📄</span>
                <span class="note-name">${note.title || 'Untitled'}</span>
            </div>
        `).join('');

        list.querySelectorAll('.obsidian-note-item').forEach(item => {
            item.addEventListener('click', () => this.switchToNote(item.dataset.id, windowEl));
        });
    }

    switchToNote(noteId, windowEl) {
        this.saveCurrentNote(windowEl);
        this.activeNoteId = noteId;

        const note = this.notes.find(n => n.id === noteId);
        if (note) {
            windowEl.querySelector('.obsidian-title').value = note.title;
            windowEl.querySelector('.obsidian-content').innerHTML = note.content;
            this.updateSidebar(windowEl);
        }
    }

    addNote(windowEl) {
        this.saveCurrentNote(windowEl);

        const newNote = {
            id: Date.now().toString(),
            title: 'New Note',
            content: '',
            created: new Date().toISOString(),
            updated: new Date().toISOString()
        };

        this.notes.push(newNote);
        this.saveNotes();
        this.activeNoteId = newNote.id;

        windowEl.querySelector('.obsidian-title').value = newNote.title;
        windowEl.querySelector('.obsidian-content').innerHTML = '';
        this.updateSidebar(windowEl);
    }

    deleteCurrentNote(windowEl) {
        if (this.notes.length <= 1) {
            if (typeof gameManager !== 'undefined') {
                gameManager.showNotification("Can't delete the last note!");
            }
            return;
        }

        this.notes = this.notes.filter(n => n.id !== this.activeNoteId);
        this.saveNotes();
        this.activeNoteId = this.notes[0].id;

        const note = this.notes[0];
        windowEl.querySelector('.obsidian-title').value = note.title;
        windowEl.querySelector('.obsidian-content').innerHTML = note.content;
        this.updateSidebar(windowEl);
    }

    pasteSnipToNote(windowEl) {
        if (!this.capturedSnip) return;

        const content = windowEl.querySelector('.obsidian-content');
        const img = document.createElement('img');
        img.src = this.capturedSnip;
        img.alt = 'Screenshot';

        content.appendChild(document.createElement('br'));
        content.appendChild(img);
        content.appendChild(document.createElement('br'));

        this.capturedSnip = null;
        const pasteBtn = windowEl.querySelector('.obsidian-paste-snip');
        pasteBtn.classList.remove('has-snip');
        pasteBtn.disabled = true;
        pasteBtn.textContent = '📸 No screenshot captured';

        this.saveCurrentNote(windowEl);
    }

    // ===== SNIPPING TOOL WITH REAL CAPTURE =====

    setupSnippingTool() {
        const overlay = document.getElementById('snip-overlay');
        const selection = document.getElementById('snip-selection');

        let isDrawing = false;
        let startX, startY;

        overlay.addEventListener('mousedown', (e) => {
            isDrawing = true;
            startX = e.clientX;
            startY = e.clientY;

            selection.style.left = `${startX}px`;
            selection.style.top = `${startY}px`;
            selection.style.width = '0px';
            selection.style.height = '0px';
            selection.style.display = 'block';
        });

        overlay.addEventListener('mousemove', (e) => {
            if (!isDrawing) return;

            const left = Math.min(startX, e.clientX);
            const top = Math.min(startY, e.clientY);
            const width = Math.abs(e.clientX - startX);
            const height = Math.abs(e.clientY - startY);

            selection.style.left = `${left}px`;
            selection.style.top = `${top}px`;
            selection.style.width = `${width}px`;
            selection.style.height = `${height}px`;
        });

        overlay.addEventListener('mouseup', async (e) => {
            if (!isDrawing) return;
            isDrawing = false;

            const rect = {
                left: parseInt(selection.style.left),
                top: parseInt(selection.style.top),
                width: parseInt(selection.style.width),
                height: parseInt(selection.style.height)
            };

            selection.style.display = 'none';
            overlay.classList.add('hidden');

            if (rect.width > 10 && rect.height > 10) {
                await this.captureArea(rect);
            }
        });
    }

    startSnipping() {
        document.getElementById('snip-overlay').classList.remove('hidden');
    }

    cancelSnipping() {
        document.getElementById('snip-overlay').classList.add('hidden');
        document.getElementById('snip-selection').style.display = 'none';
    }

    async captureArea(rect) {
        try {
            // Wait for overlay to be fully hidden
            await new Promise(resolve => setTimeout(resolve, 50));

            // Capture the entire page
            const canvas = await html2canvas(document.body, {
                x: rect.left,
                y: rect.top,
                width: rect.width,
                height: rect.height,
                useCORS: true,
                allowTaint: true,
                backgroundColor: null,
                scale: 1
            });

            this.capturedSnip = canvas.toDataURL('image/png');

            // Update paste button if notes window is open
            if (this.windowOpen && windowManager.windows.has('investigator-notes')) {
                const windowEl = windowManager.windows.get('investigator-notes');
                const pasteBtn = windowEl.querySelector('.obsidian-paste-snip');
                if (pasteBtn) {
                    pasteBtn.classList.add('has-snip');
                    pasteBtn.disabled = false;
                    pasteBtn.textContent = '📸 Paste Screenshot';
                }
            }

            if (typeof gameManager !== 'undefined' && gameManager.showNotification) {
                gameManager.showNotification('📸 Screenshot captured! Open Notes to paste.');
            }

        } catch (e) {
            console.error('Screenshot capture failed:', e);
            if (typeof gameManager !== 'undefined' && gameManager.showNotification) {
                gameManager.showNotification('Screenshot failed - try again');
            }
        }
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    window.notesApp = new NotesApp();
});
