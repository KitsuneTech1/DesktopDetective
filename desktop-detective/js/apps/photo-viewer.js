// Photo Viewer App - Polished with grid view, albums, and EXIF data

class PhotoViewer {
    constructor(photos) {
        this.photos = photos;
        this.activeAlbum = 'All';
        this.selectedPhotoId = null;
    }

    open() {
        const html = this.render();
        const windowEl = windowManager.createWindow('photos', 'Photos', '🖼️', html, 800, 550);
        windowEl.querySelector('.window-content').style.padding = '0';
        this.bindEvents(windowEl);
    }

    getAlbums() {
        const albums = new Set(['All']);
        this.photos.forEach(p => {
            if (p.album) albums.add(p.album);
        });
        return Array.from(albums);
    }

    getFilteredPhotos() {
        if (this.activeAlbum === 'All') return this.photos;
        return this.photos.filter(p => p.album === this.activeAlbum);
    }

    render() {
        const albums = this.getAlbums();
        const photos = this.getFilteredPhotos();

        return `
            <div class="photos-app">
                <div class="photos-sidebar">
                    <div class="sidebar-section">
                        <h4>Albums</h4>
                        ${albums.map(album => `
                            <div class="album-item ${this.activeAlbum === album ? 'active' : ''}" data-album="${album}">
                                ${this.getAlbumIcon(album)} ${album}
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="photos-main">
                    <div class="photos-grid">
                        ${photos.map(photo => `
                            <div class="photo-card" data-id="${photo.id}">
                                <div class="photo-preview">${photo.icon}</div>
                                <div class="photo-card-info">
                                    <div class="photo-card-title">${photo.caption}</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="photo-detail-overlay hidden">
                    <div class="photo-detail-content">
                        <button class="photo-detail-close">✕</button>
                        <div class="photo-detail-body">
                            <div class="photo-detail-image-container">
                                <div class="large-photo"></div>
                            </div>
                            <div class="photo-detail-sidebar">
                                <h3 class="detail-title"></h3>
                                <p class="detail-desc"></p>
                                <div class="exif-data">
                                    <h4>EXIF Information</h4>
                                    <div class="exif-grid">
                                        <div class="exif-item">
                                            <span class="exif-label">Filename:</span>
                                            <span class="exif-value detail-filename"></span>
                                        </div>
                                        <div class="exif-item">
                                            <span class="exif-label">Metadata:</span>
                                            <span class="exif-value detail-meta"></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getAlbumIcon(album) {
        switch (album) {
            case 'Security': return '👮';
            case 'Personal': return '🏠';
            case 'Downloads': return '📥';
            default: return '🖼️';
        }
    }

    bindEvents(windowEl) {
        const albums = windowEl.querySelectorAll('.album-item');
        const grid = windowEl.querySelector('.photos-grid');
        const overlay = windowEl.querySelector('.photo-detail-overlay');
        const closeBtn = windowEl.querySelector('.photo-detail-close');

        // Album switching
        albums.forEach(item => {
            item.addEventListener('click', () => {
                this.activeAlbum = item.dataset.album;
                this.refreshGrid(windowEl);
                albums.forEach(a => a.classList.remove('active'));
                item.classList.add('active');
            });
        });

        // Photo selection
        this.bindPhotoClicks(windowEl);

        // Close overlay
        closeBtn.addEventListener('click', () => {
            overlay.classList.add('hidden');
        });
    }

    bindPhotoClicks(windowEl) {
        const cards = windowEl.querySelectorAll('.photo-card');
        const overlay = windowEl.querySelector('.photo-detail-overlay');

        cards.forEach(card => {
            card.addEventListener('click', () => {
                const photoId = card.dataset.id;
                const photo = this.photos.find(p => p.id === photoId);
                if (!photo) return;

                this.showPhotoDetail(photo, windowEl);
            });
        });
    }

    showPhotoDetail(photo, windowEl) {
        const overlay = windowEl.querySelector('.photo-detail-overlay');
        overlay.querySelector('.large-photo').innerHTML = photo.icon;
        overlay.querySelector('.detail-title').textContent = photo.caption;
        overlay.querySelector('.detail-desc').textContent = photo.description;
        overlay.querySelector('.detail-filename').textContent = `${photo.id}.jpg`;
        overlay.querySelector('.detail-meta').textContent = photo.meta;

        overlay.classList.remove('hidden');
    }

    refreshGrid(windowEl) {
        const photos = this.getFilteredPhotos();
        const grid = windowEl.querySelector('.photos-grid');

        grid.innerHTML = photos.map(photo => `
            <div class="photo-card" data-id="${photo.id}">
                <div class="photo-preview">${photo.icon}</div>
                <div class="photo-card-info">
                    <div class="photo-card-title">${photo.caption}</div>
                </div>
            </div>
        `).join('');

        this.bindPhotoClicks(windowEl);
    }
}
