// Email Client App - Polished with folders, search, and better UI

class EmailClient {
    constructor(emails) {
        this.emails = emails;
        this.selectedEmail = null;
        this.currentFolder = 'inbox';
        this.searchQuery = '';
    }

    open() {
        const html = this.render();
        const windowEl = windowManager.createWindow('email', 'Email', '📧', html, 900, 550);
        windowEl.querySelector('.window-content').style.padding = '0';
        this.bindEvents(windowEl);
    }

    getFilteredEmails() {
        let filtered = this.emails;

        // Filter by folder
        if (this.currentFolder === 'drafts') {
            filtered = filtered.filter(e => e.subject.includes('[DRAFT]'));
        } else if (this.currentFolder === 'sent') {
            filtered = filtered.filter(e => e.from.includes('Tyler Ross'));
        } else {
            // inbox - exclude drafts
            filtered = filtered.filter(e => !e.subject.includes('[DRAFT]'));
        }

        // Filter by search
        if (this.searchQuery) {
            const query = this.searchQuery.toLowerCase();
            filtered = filtered.filter(e =>
                e.subject.toLowerCase().includes(query) ||
                e.from.toLowerCase().includes(query) ||
                e.body.toLowerCase().includes(query)
            );
        }

        return filtered;
    }

    render() {
        const filtered = this.getFilteredEmails();
        const inboxCount = this.emails.filter(e => !e.subject.includes('[DRAFT]') && !e.from.includes('Tyler Ross')).length;
        const draftCount = this.emails.filter(e => e.subject.includes('[DRAFT]')).length;

        return `
            <div class="email-app">
                <div class="email-sidebar">
                    <div class="email-search">
                        <input type="text" placeholder="🔍 Search emails..." class="email-search-input" value="${this.searchQuery}">
                    </div>
                    <div class="email-folders">
                        <div class="email-folder ${this.currentFolder === 'inbox' ? 'active' : ''}" data-folder="inbox">
                            <span>📥 Inbox</span>
                            <span class="folder-count">${inboxCount}</span>
                        </div>
                        <div class="email-folder ${this.currentFolder === 'sent' ? 'active' : ''}" data-folder="sent">
                            <span>📤 Sent</span>
                        </div>
                        <div class="email-folder ${this.currentFolder === 'drafts' ? 'active' : ''}" data-folder="drafts">
                            <span>📝 Drafts</span>
                            ${draftCount > 0 ? `<span class="folder-count draft">${draftCount}</span>` : ''}
                        </div>
                    </div>
                </div>
                <div class="email-list">
                    ${filtered.length === 0 ? '<div class="email-empty">No emails found</div>' : ''}
                    ${filtered.map((email, index) => `
                        <div class="email-item" data-id="${email.id}">
                            <div class="email-item-header">
                                <div class="email-sender">${this.extractName(email.from)}</div>
                                <div class="email-date">${this.formatDate(email.date)}</div>
                            </div>
                            <div class="email-subject">${email.subject}</div>
                            <div class="email-preview">${this.getPreview(email.body)}</div>
                        </div>
                    `).join('')}
                </div>
                <div class="email-view">
                    <div class="email-placeholder">
                        <div class="placeholder-icon">📧</div>
                        <p>Select an email to read</p>
                    </div>
                </div>
            </div>
        `;
    }

    extractName(fromString) {
        const match = fromString.match(/^([^<]+)/);
        return match ? match[1].trim() : fromString;
    }

    formatDate(dateStr) {
        const parts = dateStr.split(' - ');
        return parts[0].replace(', 2024', '');
    }

    getPreview(body) {
        return body.replace(/\n/g, ' ').substring(0, 60) + '...';
    }

    bindEvents(windowEl) {
        const emailList = windowEl.querySelector('.email-list');
        const emailView = windowEl.querySelector('.email-view');
        const searchInput = windowEl.querySelector('.email-search-input');
        const folders = windowEl.querySelectorAll('.email-folder');

        // Folder switching
        folders.forEach(folder => {
            folder.addEventListener('click', () => {
                this.currentFolder = folder.dataset.folder;
                this.refreshList(windowEl);
            });
        });

        // Search
        searchInput.addEventListener('input', (e) => {
            this.searchQuery = e.target.value;
            this.refreshList(windowEl);
        });

        // Email selection
        this.bindEmailClicks(windowEl);
    }

    bindEmailClicks(windowEl) {
        const emailList = windowEl.querySelector('.email-list');
        const emailView = windowEl.querySelector('.email-view');

        emailList.querySelectorAll('.email-item').forEach(item => {
            item.addEventListener('click', () => {
                const emailId = item.dataset.id;
                const email = this.emails.find(e => e.id === emailId);
                if (!email) return;

                emailList.querySelectorAll('.email-item').forEach(el => el.classList.remove('active'));
                item.classList.add('active');

                emailView.innerHTML = `
                    <div class="email-full">
                        <div class="email-full-header">
                            <h2>${email.subject}</h2>
                            <div class="email-full-meta">
                                <div><strong>From:</strong> ${email.from}</div>
                                <div><strong>To:</strong> ${email.to}</div>
                                <div><strong>Date:</strong> ${email.date}</div>
                            </div>
                        </div>
                        <div class="email-full-body">${email.body.replace(/\n/g, '<br>')}</div>
                    </div>
                `;
            });
        });
    }

    refreshList(windowEl) {
        const filtered = this.getFilteredEmails();
        const emailList = windowEl.querySelector('.email-list');
        const folders = windowEl.querySelectorAll('.email-folder');

        folders.forEach(f => f.classList.remove('active'));
        windowEl.querySelector(`[data-folder="${this.currentFolder}"]`).classList.add('active');

        emailList.innerHTML = filtered.length === 0 ? '<div class="email-empty">No emails found</div>' :
            filtered.map(email => `
                <div class="email-item" data-id="${email.id}">
                    <div class="email-item-header">
                        <div class="email-sender">${this.extractName(email.from)}</div>
                        <div class="email-date">${this.formatDate(email.date)}</div>
                    </div>
                    <div class="email-subject">${email.subject}</div>
                    <div class="email-preview">${this.getPreview(email.body)}</div>
                </div>
            `).join('');

        this.bindEmailClicks(windowEl);
    }
}
