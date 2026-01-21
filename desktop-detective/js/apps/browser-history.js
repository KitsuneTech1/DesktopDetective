// Browser App - Full browser simulation with tabs, bookmarks, and fake pages

class BrowserApp {
    constructor(historyData, bookmarks, pages) {
        this.historyData = historyData;
        this.bookmarks = bookmarks || [];
        this.pages = pages || {};
        this.currentTab = 'home';
        this.currentPage = null;
    }

    open() {
        const html = this.render();
        const windowEl = windowManager.createWindow('browser', 'Web Browser', '🌐', html, 800, 550);
        windowEl.querySelector('.window-content').style.padding = '0';
        this.bindEvents(windowEl);
    }

    render() {
        return `
            <div class="browser-app">
                <div class="browser-toolbar">
                    <div class="browser-nav-btns">
                        <button class="browser-nav-btn" disabled>←</button>
                        <button class="browser-nav-btn" disabled>→</button>
                        <button class="browser-nav-btn browser-refresh">🔄</button>
                    </div>
                    <div class="browser-url-bar">
                        <span class="url-icon">🔒</span>
                        <span class="url-text">novatech-laptop://home</span>
                    </div>
                </div>
                <div class="browser-tabs">
                    <div class="browser-tab active" data-tab="home">🏠 Home</div>
                    <div class="browser-tab" data-tab="history">📜 History</div>
                    <div class="browser-tab" data-tab="bookmarks">⭐ Bookmarks</div>
                </div>
                <div class="browser-content">
                    ${this.renderHome()}
                </div>
            </div>
        `;
    }

    renderHome() {
        return `
            <div class="browser-home">
                <div class="browser-home-header">
                    <div class="browser-logo">🔍</div>
                    <h2>Quick Access</h2>
                </div>
                <div class="browser-quick-links">
                    ${this.bookmarks.map(bm => `
                        <div class="quick-link" data-page="${bm.id}">
                            <div class="quick-link-icon">${bm.icon}</div>
                            <div class="quick-link-name">${bm.name}</div>
                        </div>
                    `).join('')}
                </div>
                <div class="browser-recent">
                    <h3>Recent Searches</h3>
                    <div class="recent-searches">
                        ${this.historyData.slice(0, 5).map(item => `
                            <div class="recent-search ${item.suspicious ? 'suspicious' : ''}">
                                ${item.suspicious ? '⚠️' : '🔍'} ${item.title}
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    renderHistory() {
        return `
            <div class="browser-history-view">
                <div class="history-header">
                    <h3>📜 Browsing History</h3>
                    <span class="history-note">Showing all recorded activity</span>
                </div>
                <div class="history-list">
                    ${this.historyData.map(item => `
                        <div class="history-entry ${item.suspicious ? 'suspicious' : ''}">
                            <div class="history-entry-icon">${item.suspicious ? '⚠️' : '🔗'}</div>
                            <div class="history-entry-content">
                                <div class="history-entry-title">${item.title}</div>
                                <div class="history-entry-url">${item.url}</div>
                            </div>
                            <div class="history-entry-time">${item.time}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    renderBookmarks() {
        return `
            <div class="browser-bookmarks-view">
                <div class="bookmarks-header">
                    <h3>⭐ Bookmarks</h3>
                </div>
                <div class="bookmarks-grid">
                    ${this.bookmarks.map(bm => `
                        <div class="bookmark-card" data-page="${bm.id}">
                            <div class="bookmark-icon">${bm.icon}</div>
                            <div class="bookmark-info">
                                <div class="bookmark-name">${bm.name}</div>
                                <div class="bookmark-url">${bm.url}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    renderPage(pageId) {
        const page = this.pages[pageId];
        if (!page) {
            return `
                <div class="browser-error">
                    <div class="error-icon">🚫</div>
                    <h3>Page Not Found</h3>
                    <p>This page could not be loaded.</p>
                </div>
            `;
        }

        return `
            <div class="browser-page">
                <div class="page-header" style="background: ${page.headerColor || '#1a1a2e'}">
                    <div class="page-logo">${page.icon}</div>
                    <div class="page-title">${page.title}</div>
                </div>
                <div class="page-content">
                    ${page.content}
                </div>
            </div>
        `;
    }

    bindEvents(windowEl) {
        const tabs = windowEl.querySelectorAll('.browser-tab');
        const content = windowEl.querySelector('.browser-content');
        const urlText = windowEl.querySelector('.url-text');

        // Tab switching
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this.currentTab = tab.dataset.tab;
                this.currentPage = null;

                switch (this.currentTab) {
                    case 'home':
                        content.innerHTML = this.renderHome();
                        urlText.textContent = 'novatech-laptop://home';
                        break;
                    case 'history':
                        content.innerHTML = this.renderHistory();
                        urlText.textContent = 'novatech-laptop://history';
                        break;
                    case 'bookmarks':
                        content.innerHTML = this.renderBookmarks();
                        urlText.textContent = 'novatech-laptop://bookmarks';
                        break;
                }

                this.bindContentEvents(windowEl);
            });
        });

        this.bindContentEvents(windowEl);
    }

    bindContentEvents(windowEl) {
        const content = windowEl.querySelector('.browser-content');
        const urlText = windowEl.querySelector('.url-text');

        // Quick links and bookmarks
        content.querySelectorAll('.quick-link, .bookmark-card').forEach(link => {
            link.addEventListener('click', () => {
                const pageId = link.dataset.page;
                const bookmark = this.bookmarks.find(b => b.id === pageId);
                if (bookmark) {
                    urlText.textContent = bookmark.url;
                }
                content.innerHTML = this.renderPage(pageId);
                this.currentPage = pageId;
            });
        });
    }
}
