// File Explorer App - Polished with search, sorting, and metadata

class FileExplorer {
    constructor(fileSystem, onFileOpen) {
        this.fileSystem = fileSystem;
        this.onFileOpen = onFileOpen;
        this.currentPath = [];
        this.searchQuery = '';
        this.sortBy = 'name'; // name, size, date
    }

    open() {
        const html = this.render();
        const windowEl = windowManager.createWindow('file-explorer', 'File Explorer', '📁', html, 800, 500);
        windowEl.querySelector('.window-content').style.padding = '0';
        this.bindEvents(windowEl);
    }

    render() {
        return `
            <div class="explorer-app">
                <div class="explorer-toolbar">
                    <div class="explorer-nav">
                        <button class="nav-btn-back" title="Back">⬅️</button>
                        <button class="nav-btn-up" title="Up one level">⬆️</button>
                    </div>
                    <div class="explorer-address-bar">
                        <span class="path-icon">📂</span>
                        <div class="path-breadcrumbs">${this.renderBreadcrumbs()}</div>
                    </div>
                    <div class="explorer-search">
                        <input type="text" placeholder="Search files..." class="explorer-search-input" value="${this.searchQuery}">
                    </div>
                </div>
                <div class="explorer-body">
                    <div class="explorer-sidebar">
                        <div class="sidebar-item active" data-path="">📁 Quick Access</div>
                        <div class="sidebar-item" data-path="Documents">📂 Documents</div>
                        <div class="sidebar-item" data-path="Downloads">📥 Downloads</div>
                        <div class="sidebar-item" data-path="Voicemails">🎤 Voicemails</div>
                    </div>
                    <div class="explorer-main">
                        <div class="explorer-list-header">
                            <div class="col-name" data-sort="name">Name</div>
                            <div class="col-date" data-sort="date">Date Modified</div>
                            <div class="col-size" data-sort="size">Size</div>
                        </div>
                        <div class="explorer-list-content">
                            ${this.renderFolderContents()}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderBreadcrumbs() {
        let html = '<span class="breadcrumb-item" data-path="">Root</span>';
        let currentPath = '';
        this.currentPath.forEach(segment => {
            currentPath += (currentPath ? '/' : '') + segment;
            html += `<span class="breadcrumb-sep">›</span><span class="breadcrumb-item" data-path="${currentPath}">${segment}</span>`;
        });
        return html;
    }

    renderFolderContents() {
        const folder = this.getFolderAtPath(this.currentPath);
        if (!folder) return '<div class="empty-folder">Folder not found</div>';

        let items = [];
        const contentSource = folder.children || folder;

        for (const [name, item] of Object.entries(contentSource)) {
            if (this.searchQuery && !name.toLowerCase().includes(this.searchQuery.toLowerCase())) continue;
            items.push({ name, ...item });
        }

        // Sort items
        items.sort((a, b) => {
            if (a.type === 'folder' && b.type !== 'folder') return -1;
            if (a.type !== 'folder' && b.type === 'folder') return 1;

            if (this.sortBy === 'size') {
                return (a.size || '').localeCompare(b.size || '');
            } else if (this.sortBy === 'date') {
                return (a.date || '').localeCompare(b.date || '');
            } else {
                return a.name.localeCompare(b.name);
            }
        });

        if (items.length === 0) {
            return `<div class="empty-folder">${this.searchQuery ? 'No results found' : 'This folder is empty'}</div>`;
        }

        return items.map(item => `
            <div class="explorer-row ${item.type === 'folder' ? 'is-folder' : 'is-file'}" data-name="${item.name}">
                <div class="col-name">
                    <span class="file-icon">${item.icon || (item.type === 'folder' ? '📂' : '📄')}</span>
                    <span class="file-name">${item.name}</span>
                </div>
                <div class="col-date">${item.date || '--'}</div>
                <div class="col-size">${item.size || '--'}</div>
            </div>
        `).join('');
    }

    bindEvents(windowEl) {
        const main = windowEl.querySelector('.explorer-main');
        const searchInput = windowEl.querySelector('.explorer-search-input');
        const breadcrumbs = windowEl.querySelector('.path-breadcrumbs');
        const sidebar = windowEl.querySelector('.explorer-sidebar');
        const backBtn = windowEl.querySelector('.nav-btn-back');
        const upBtn = windowEl.querySelector('.nav-btn-up');

        // Nav buttons
        backBtn.addEventListener('click', () => {
            if (this.currentPath.length > 0) {
                this.currentPath.pop();
                this.refresh(windowEl);
            }
        });

        upBtn.addEventListener('click', () => {
            if (this.currentPath.length > 0) {
                this.currentPath.pop();
                this.refresh(windowEl);
            }
        });

        // Search
        searchInput.addEventListener('input', (e) => {
            this.searchQuery = e.target.value;
            this.refresh(windowEl);
        });

        // Sorting
        windowEl.querySelectorAll('.explorer-list-header div').forEach(header => {
            header.addEventListener('click', () => {
                this.sortBy = header.dataset.sort;
                this.refresh(windowEl);
            });
        });

        // Breadcrumbs
        breadcrumbs.addEventListener('click', (e) => {
            const item = e.target.closest('.breadcrumb-item');
            if (item) {
                this.currentPath = item.dataset.path ? item.dataset.path.split('/') : [];
                this.refresh(windowEl);
            }
        });

        // Sidebar
        sidebar.addEventListener('click', (e) => {
            const item = e.target.closest('.sidebar-item');
            if (item) {
                this.currentPath = item.dataset.path ? item.dataset.path.split('/') : [];
                sidebar.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                this.refresh(windowEl);
            }
        });

        // File/Folder dblclick
        this.bindRowEvents(windowEl);
    }

    bindRowEvents(windowEl) {
        const rows = windowEl.querySelectorAll('.explorer-row');
        rows.forEach(row => {
            row.addEventListener('dblclick', () => {
                const name = row.dataset.name;
                const folder = this.getFolderAtPath(this.currentPath);
                const contentSource = folder.children || folder;
                const item = contentSource[name];

                if (item.type === 'folder') {
                    this.currentPath.push(name);
                    this.refresh(windowEl);
                } else {
                    this.onFileOpen(name, item.content);
                }
            });

            row.addEventListener('click', () => {
                rows.forEach(r => r.classList.remove('selected'));
                row.classList.add('selected');
            });
        });
    }

    refresh(windowEl) {
        windowEl.querySelector('.path-breadcrumbs').innerHTML = this.renderBreadcrumbs();
        windowEl.querySelector('.explorer-list-content').innerHTML = this.renderFolderContents();
        this.bindRowEvents(windowEl);
    }

    getFolderAtPath(path) {
        let current = this.fileSystem;
        for (const segment of path) {
            if (current[segment]) {
                current = current[segment].children || current[segment];
            } else {
                return null;
            }
        }
        return current;
    }
}
