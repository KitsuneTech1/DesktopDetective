// Chat/Messages App - Polished with status indicators and improved UI

class ChatApp {
    constructor(chats) {
        this.chats = chats;
        this.selectedContact = null;
    }

    open() {
        const html = this.render();
        const windowEl = windowManager.createWindow('chat', 'Messages', '💬', html, 700, 500);
        windowEl.querySelector('.window-content').style.padding = '0';
        this.bindEvents(windowEl);
    }

    render() {
        const contacts = Object.keys(this.chats);
        return `
            <div class="chat-app">
                <div class="chat-contacts">
                    <div class="chat-contacts-header">
                        <span>💬 Conversations</span>
                    </div>
                    ${contacts.map(name => {
            const chat = this.chats[name];
            const lastMsg = chat.messages[chat.messages.length - 1];
            const isSuspicious = name.includes('Victor') || name.includes('Mike');
            return `
                            <div class="contact-item ${isSuspicious ? 'suspicious' : ''}" data-contact="${name}">
                                <div class="contact-avatar">${chat.avatar}</div>
                                <div class="contact-info">
                                    <div class="contact-name">${name}</div>
                                    <div class="contact-preview">${lastMsg.text.substring(0, 25)}...</div>
                                </div>
                                <div class="contact-meta">
                                    <div class="contact-time">${this.formatTime(lastMsg.time)}</div>
                                    ${isSuspicious ? '<div class="contact-badge">⚠️</div>' : ''}
                                </div>
                            </div>
                        `;
        }).join('')}
                </div>
                <div class="chat-view">
                    <div class="chat-placeholder">
                        <div class="placeholder-icon">💬</div>
                        <p>Select a conversation</p>
                    </div>
                </div>
            </div>
        `;
    }

    formatTime(timeStr) {
        const parts = timeStr.split(', ');
        if (parts.length > 1) {
            return parts[0].replace('March ', 'Mar ');
        }
        return timeStr;
    }

    bindEvents(windowEl) {
        const contactsList = windowEl.querySelector('.chat-contacts');
        const chatView = windowEl.querySelector('.chat-view');

        contactsList.querySelectorAll('.contact-item').forEach(item => {
            item.addEventListener('click', () => {
                const contactName = item.dataset.contact;
                const chat = this.chats[contactName];

                contactsList.querySelectorAll('.contact-item').forEach(el => el.classList.remove('active'));
                item.classList.add('active');

                const isSuspicious = contactName.includes('Victor') || contactName.includes('Mike');

                chatView.innerHTML = `
                    <div class="chat-header ${isSuspicious ? 'suspicious' : ''}">
                        <div class="chat-header-avatar">${chat.avatar}</div>
                        <div class="chat-header-info">
                            <div class="chat-header-name">${contactName}</div>
                            <div class="chat-header-status">${isSuspicious ? '⚠️ Suspicious contact' : 'View conversation'}</div>
                        </div>
                    </div>
                    <div class="chat-messages">
                        ${chat.messages.map(msg => `
                            <div class="chat-message ${msg.sender === 'me' ? 'sent' : 'received'}">
                                <div class="message-text">${msg.text}</div>
                                <div class="message-time">${msg.time}</div>
                            </div>
                        `).join('')}
                    </div>
                `;

                const messagesContainer = chatView.querySelector('.chat-messages');
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            });
        });
    }
}
