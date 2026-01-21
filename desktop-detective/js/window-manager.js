// Window Manager - handles opening, closing, dragging windows

class WindowManager {
    constructor() {
        this.windows = new Map();
        this.zIndex = 100;
        this.windowPositionOffset = 0;
    }

    createWindow(appId, title, icon, contentHtml, width = 700, height = 500) {
        // Check if window already exists
        if (this.windows.has(appId)) {
            this.focusWindow(appId);
            return this.windows.get(appId);
        }

        const windowEl = document.createElement('div');
        windowEl.className = 'window';
        windowEl.id = `window-${appId}`;
        windowEl.style.width = `${width}px`;
        windowEl.style.height = `${height}px`;
        windowEl.style.zIndex = ++this.zIndex;

        // Position windows with offset
        const startX = 200 + (this.windowPositionOffset * 30);
        const startY = 50 + (this.windowPositionOffset * 30);
        windowEl.style.left = `${startX}px`;
        windowEl.style.top = `${startY}px`;
        this.windowPositionOffset = (this.windowPositionOffset + 1) % 10;

        windowEl.innerHTML = `
            <div class="window-titlebar">
                <div class="window-title">
                    <span class="window-title-icon">${icon}</span>
                    <span>${title}</span>
                </div>
                <div class="window-controls">
                    <button class="window-btn minimize" title="Minimize"></button>
                    <button class="window-btn maximize" title="Maximize"></button>
                    <button class="window-btn close" title="Close"></button>
                </div>
            </div>
            <div class="window-content">
                ${contentHtml}
            </div>
        `;

        document.getElementById('windows-container').appendChild(windowEl);

        // Setup window controls
        this.setupWindowControls(windowEl, appId);

        // Setup dragging
        this.setupDragging(windowEl);

        // Add to taskbar
        this.addToTaskbar(appId, title, icon);

        // Store reference
        this.windows.set(appId, windowEl);

        // Focus on click
        windowEl.addEventListener('mousedown', () => this.focusWindow(appId));

        return windowEl;
    }

    setupWindowControls(windowEl, appId) {
        const closeBtn = windowEl.querySelector('.window-btn.close');
        const minimizeBtn = windowEl.querySelector('.window-btn.minimize');
        const maximizeBtn = windowEl.querySelector('.window-btn.maximize');

        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.closeWindow(appId);
        });

        minimizeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.minimizeWindow(appId);
        });

        maximizeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleMaximize(appId);
        });
    }

    setupDragging(windowEl) {
        const titlebar = windowEl.querySelector('.window-titlebar');
        let isDragging = false;
        let startX, startY, initialX, initialY;

        titlebar.addEventListener('mousedown', (e) => {
            if (e.target.classList.contains('window-btn')) return;
            if (windowEl.classList.contains('maximized')) return;

            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            initialX = windowEl.offsetLeft;
            initialY = windowEl.offsetTop;

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });

        const onMouseMove = (e) => {
            if (!isDragging) return;

            const dx = e.clientX - startX;
            const dy = e.clientY - startY;

            windowEl.style.left = `${initialX + dx}px`;
            windowEl.style.top = `${initialY + dy}px`;
        };

        const onMouseUp = () => {
            isDragging = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };
    }

    addToTaskbar(appId, title, icon) {
        const taskbarApps = document.getElementById('taskbar-apps');

        const taskbarApp = document.createElement('div');
        taskbarApp.className = 'taskbar-app active';
        taskbarApp.id = `taskbar-${appId}`;
        taskbarApp.innerHTML = `<span>${icon}</span> ${title}`;

        taskbarApp.addEventListener('click', () => {
            const windowEl = this.windows.get(appId);
            if (windowEl.classList.contains('hidden')) {
                windowEl.classList.remove('hidden');
                taskbarApp.classList.add('active');
            }
            this.focusWindow(appId);
        });

        taskbarApps.appendChild(taskbarApp);
    }

    closeWindow(appId) {
        const windowEl = this.windows.get(appId);
        if (windowEl) {
            windowEl.remove();
            this.windows.delete(appId);

            const taskbarApp = document.getElementById(`taskbar-${appId}`);
            if (taskbarApp) taskbarApp.remove();
        }
    }

    minimizeWindow(appId) {
        const windowEl = this.windows.get(appId);
        const taskbarApp = document.getElementById(`taskbar-${appId}`);
        if (windowEl) {
            windowEl.classList.add('hidden');
            if (taskbarApp) taskbarApp.classList.remove('active');
        }
    }

    toggleMaximize(appId) {
        const windowEl = this.windows.get(appId);
        if (windowEl) {
            windowEl.classList.toggle('maximized');
        }
    }

    focusWindow(appId) {
        const windowEl = this.windows.get(appId);
        if (windowEl) {
            windowEl.style.zIndex = ++this.zIndex;

            // Update taskbar
            document.querySelectorAll('.taskbar-app').forEach(el => {
                el.classList.remove('active');
            });
            const taskbarApp = document.getElementById(`taskbar-${appId}`);
            if (taskbarApp) taskbarApp.classList.add('active');
        }
    }

    closeAllWindows() {
        this.windows.forEach((_, appId) => this.closeWindow(appId));
        this.windowPositionOffset = 0;
    }
}

// Create global instance
const windowManager = new WindowManager();
