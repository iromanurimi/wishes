
// Notification System
class NotificationSystem {
    constructor() {
        this.notifications = [];
        this.currentFilter = 'all';
        this.init();
        this.loadSampleNotifications();
    }

    init() {
        // Toggle notification panel
        document.getElementById('notification-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleNotificationPanel();
        });

        // Close notifications button
        document.getElementById('close-notifications-btn').addEventListener('click', () => {
            this.hideNotificationPanel();
        });

        // Mark all as read
        document.getElementById('mark-all-read-btn').addEventListener('click', () => {
            this.markAllAsRead();
        });

        // Clear all notifications
        document.getElementById('clear-all-btn').addEventListener('click', () => {
            this.clearAllNotifications();
        });

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentFilter = btn.dataset.filter;
                this.renderNotifications();
            });
        });

        // Notification settings
        document.getElementById('notification-settings-btn').addEventListener('click', () => {
            this.showNotificationSettings();
        });

        // Close panel when clicking outside
        document.addEventListener('click', (e) => {
            const panel = document.getElementById('notification-panel');
            const btn = document.getElementById('notification-btn');

            if (panel.style.display !== 'none' &&
                !panel.contains(e.target) &&
                !btn.contains(e.target)) {
                this.hideNotificationPanel();
            }
        });

        // Close notification settings modal
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('settings-modal-overlay')) {
                this.hideNotificationSettings();
            }
        });
    }

    toggleNotificationPanel() {
        const panel = document.getElementById('notification-panel');
        if (panel.style.display === 'none' || panel.style.display === '') {
            panel.style.display = 'flex';
            this.updateBadgeCount();
        } else {
            panel.style.display = 'none';
        }
    }

    hideNotificationPanel() {
        document.getElementById('notification-panel').style.display = 'none';
    }

    loadSampleNotifications() {
        // Static notifications in Hausa
        this.notifications = [
            {
                id: 1,
                title: "Tunatarwa: Rana ta ovulation",
                message: "Ranar ovulation tana nan a ranar Juma'a, 15 ga Maris. Wannan shine mafi yawan lokacin haihuwa.",
                type: "reminder",
                timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
                read: false,
                actions: ["Duba lissafin", "Sake saita"]
            },
            {
                id: 2,
                title: "Sabon Labari An Ƙara",
                message: "An ƙara sabon labari game da 'Yadda Ake Kula da Jariri a Rana ta Farko Bayan Haihuwa'.",
                type: "tip",
                timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
                read: false,
                actions: ["Duba labarin"]
            },
            {
                id: 3,
                title: "Sabuwar Fasalin Chatbot",
                message: "Yanzu kuna iya amfani da sabon fasalin chatbot wanda zai iya amsa tambayoyin ku game da ciki da kula da jariri.",
                type: "system",
                timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
                read: true,
                actions: ["Gwada chatbot"]
            },
            {
                id: 4,
                title: "Tunatarwa: Binciken Asibiti",
                message: "Kuna da binciken asibiti a makon gaba. Don Allah ku tuntuɓi likita ku don tabbatar da lokacin.",
                type: "reminder",
                timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
                read: true,
                actions: ["Sake saita", "Ƙirƙira tunatarwa"]
            },
            {
                id: 5,
                title: "Muhimmin Bayani: Abinci Mai Gina Jiki",
                message: "Lokacin ciki yana buƙatar ƙarin abinci mai gina jiki. Duba labaran mu don shawarwari masu amfani.",
                type: "tip",
                timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
                read: true,
                actions: ["Duba shawarwari"]
            },
            {
                id: 6,
                title: "Sabon Tsarin App",
                message: "Mun sabunta tsarin app ɗin don samar muku da ƙarin sauƙi da inganci.",
                type: "system",
                timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
                read: true,
                actions: ["Duba sabbin fasali"]
            },
            {
                id: 7,
                title: "Alamar Rigakafi: COVID-19",
                message: "Don lafiyar ku da ta jariri, ana ba da shawarar yin alamar rigakafin COVID-19.",
                type: "alert",
                timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
                read: true,
                actions: ["Ƙarin bayani", "Nemo asibiti"]
            },
            {
                id: 8,
                title: "Tunatarwa: Ruwa Yayi Yawa",
                message: "Don Allah ku sha ruwa da yawa a yau - aƙalla gilashin ruwa 8.",
                type: "reminder",
                timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
                read: true,
                actions: ["Ƙirƙira tunatarwa"]
            }
        ];

        // Sort by timestamp (newest first)
        this.notifications.sort((a, b) => b.timestamp - a.timestamp);
        this.renderNotifications();
        this.updateBadgeCount();
    }

    renderNotifications() {
        const list = document.getElementById('notification-list');
        const emptyState = document.getElementById('empty-notifications');

        if (!list || !emptyState) return;

        // Filter notifications based on current filter
        let filtered = this.notifications;

        if (this.currentFilter === 'unread') {
            filtered = this.notifications.filter(n => !n.read);
        } else if (this.currentFilter === 'system') {
            filtered = this.notifications.filter(n => n.type === 'system');
        } else if (this.currentFilter === 'reminder') {
            filtered = this.notifications.filter(n => n.type === 'reminder');
        }

        if (filtered.length === 0) {
            list.innerHTML = '';
            emptyState.style.display = 'flex';
            return;
        }

        emptyState.style.display = 'none';
        list.innerHTML = '';

        filtered.forEach(notification => {
            const item = this.createNotificationElement(notification);
            list.appendChild(item);
        });
    }

    createNotificationElement(notification) {
        const item = document.createElement('div');
        item.className = `notification-item ${notification.read ? '' : 'unread'}`;
        item.dataset.id = notification.id;

        // Time ago in Hausa
        const timeAgo = this.getTimeAgo(notification.timestamp);

        // Icon based on type
        let iconClass = '';
        let iconEmoji = '📢';

        switch (notification.type) {
            case 'reminder':
                iconClass = 'reminder';
                iconEmoji = '⏰';
                break;
            case 'tip':
                iconClass = 'tip';
                iconEmoji = '💡';
                break;
            case 'alert':
                iconClass = 'alert';
                iconEmoji = '⚠️';
                break;
            default:
                iconClass = 'system';
                iconEmoji = '📱';
        }

        // Actions buttons
        let actionsHTML = '';
        if (notification.actions && notification.actions.length > 0) {
            actionsHTML = `
                <div class="notification-actions-inline">
                    ${notification.actions.map(action =>
                `<button class="notification-action-btn" data-action="${action}">${action}</button>`
            ).join('')}
                </div>
            `;
        }

        item.innerHTML = `
            <div class="notification-icon ${iconClass}">${iconEmoji}</div>
            <div class="notification-content">
                <div class="notification-title">
                    <span>${notification.title}</span>
                    ${!notification.read ? '<div class="unread-dot"></div>' : ''}
                </div>
                <div class="notification-message">${notification.message}</div>
                <div class="notification-time">${timeAgo}</div>
                ${actionsHTML}
            </div>
        `;

        // Add click event to mark as read
        item.addEventListener('click', (e) => {
            if (!notification.read) {
                this.markAsRead(notification.id);
                item.classList.remove('unread');
            }
        });

        // Add click events to action buttons
        item.querySelectorAll('.notification-action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleAction(notification, btn.dataset.action);
            });
        });

        return item;
    }

    getTimeAgo(timestamp) {
        const now = new Date();
        const diff = now - timestamp;

        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (minutes < 60) {
            return `Da mintoci ${minutes} da suka wuce`;
        } else if (hours < 24) {
            return `Da awowi ${hours} da suka wuce`;
        } else if (days < 7) {
            return `Da kwanaki ${days} da suka wuce`;
        } else {
            return timestamp.toLocaleDateString('ha-NG', {
                month: 'short',
                day: 'numeric'
            });
        }
    }

    markAsRead(id) {
        const notification = this.notifications.find(n => n.id === id);
        if (notification && !notification.read) {
            notification.read = true;
            this.updateBadgeCount();

            // Show a brief confirmation
            this.showToast("An yiwa sanarwa alama a matsayin da aka karanta");
        }
    }

    markAllAsRead() {
        this.notifications.forEach(n => n.read = true);
        this.renderNotifications();
        this.updateBadgeCount();
        this.showToast("Duk sanarwa an yi musu alama a matsayin da aka karanta");
    }

    clearAllNotifications() {
        if (confirm("Shin kuna son share duk sanarwa?")) {
            this.notifications = [];
            this.renderNotifications();
            this.updateBadgeCount();
            this.showToast("An share duk sanarwa");
        }
    }

    updateBadgeCount() {
        const badge = document.querySelector('.notification-badge');
        const unreadCount = this.notifications.filter(n => !n.read).length;

        if (unreadCount > 0) {
            badge.textContent = unreadCount > 9 ? '9+' : unreadCount.toString();
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }
    }

    handleAction(notification, action) {
        // Handle different actions
        switch (action) {
            case 'Duba lissafin':
                // Open ovulation calculator
                const ovulationCard = document.getElementById('ovulation-benefit-card');
                if (!ovulationCard.classList.contains('flipped')) {
                    ovulationCard.classList.add('flipped');
                }
                this.hideNotificationPanel();
                break;

            case 'Duba labarin':
                // Open articles
                const articlesCard = document.getElementById('articles-benefit-card');
                if (!articlesCard.classList.contains('flipped')) {
                    articlesCard.classList.add('flipped');
                }
                this.hideNotificationPanel();
                break;

            case 'Gwada chatbot':
                // Open chatbot
                document.querySelector('[data-page="chat"]').click();
                this.hideNotificationPanel();
                break;

            case 'Ƙirƙira tunatarwa':
                this.showToast("Za a ƙara wannan fasalin nan gaba");
                break;

            default:
                console.log(`Action: ${action} for notification: ${notification.title}`);
        }
    }

    showNotificationSettings() {
        // Create and show settings modal
        this.createSettingsModal();
    }

    createSettingsModal() {
        // Remove existing modal if any
        const existingModal = document.querySelector('.notification-settings-modal');
        if (existingModal) {
            existingModal.remove();
        }

        const modalHTML = `
            <div class="notification-settings-modal">
                <div class="modal-overlay settings-modal-overlay"></div>
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>⚙️ Saitunan Sanarwa</h3>
                        <button class="modal-close" id="close-settings-btn">×</button>
                    </div>
                    <div class="modal-body">
                        <div class="settings-section">
                            <h4>📢 Nau'in Sanarwa</h4>
                            <div class="settings-item">
                                <div>
                                    <div class="settings-label">Sanarwar Tsarin</div>
                                    <div class="settings-description">Sabbin fasali da sabuntawa</div>
                                </div>
                                <label class="toggle-switch">
                                    <input type="checkbox" id="system-notifications" checked>
                                    <span class="toggle-slider"></span>
                                </label>
                            </div>
                            <div class="settings-item">
                                <div>
                                    <div class="settings-label">Tunatarwa</div>
                                    <div class="settings-description">Tunatarwa game da lissafin ovulation da sauran muhimman ranaku</div>
                                </div>
                                <label class="toggle-switch">
                                    <input type="checkbox" id="reminder-notifications" checked>
                                    <span class="toggle-slider"></span>
                                </label>
                            </div>
                            <div class="settings-item">
                                <div>
                                    <div class="settings-label">Shawarwari da Labarai</div>
                                    <div class="settings-description">Sabbin labarai da shawarwari masu amfani</div>
                                </div>
                                <label class="toggle-switch">
                                    <input type="checkbox" id="tips-notifications" checked>
                                    <span class="toggle-slider"></span>
                                </label>
                            </div>
                        </div>
                        
                        <div class="settings-section">
                            <h4>🔔 Yanayi</h4>
                            <div class="settings-item">
                                <div>
                                    <div class="settings-label">Girgiza</div>
                                    <div class="settings-description">Yi girgiza waya lokacin da sanarwa ta zo</div>
                                </div>
                                <label class="toggle-switch">
                                    <input type="checkbox" id="vibration-setting" checked>
                                    <span class="toggle-slider"></span>
                                </label>
                            </div>
                            <div class="settings-item">
                                <div>
                                    <div class="settings-label">Sauti</div>
                                    <div class="settings-description">Yi sauti lokacin da sanarwa ta zo</div>
                                </div>
                                <label class="toggle-switch">
                                    <input type="checkbox" id="sound-setting" checked>
                                    <span class="toggle-slider"></span>
                                </label>
                            </div>
                        </div>
                        
                        <div class="action-buttons">
                            <button class="secondary-btn" id="reset-settings-btn">
                                <span class="btn-text">Sake saita zuwa tsoho</span>
                            </button>
                            <button class="primary-btn" id="save-settings-btn">
                                <span class="btn-text">Ajiye sauye-sauye</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Show modal
        const modal = document.querySelector('.notification-settings-modal');
        modal.style.display = 'flex';

        // Add event listeners
        document.getElementById('close-settings-btn').addEventListener('click', () => {
            this.hideNotificationSettings();
        });

        document.getElementById('save-settings-btn').addEventListener('click', () => {
            this.saveNotificationSettings();
            this.hideNotificationSettings();
        });

        document.getElementById('reset-settings-btn').addEventListener('click', () => {
            this.resetNotificationSettings();
        });
    }

    hideNotificationSettings() {
        const modal = document.querySelector('.notification-settings-modal');
        if (modal) {
            modal.remove();
        }
    }

    saveNotificationSettings() {
        // Here you would save the settings to localStorage or backend
        this.showToast("An ajiye saitunan sanarwa");
    }

    resetNotificationSettings() {
        // Reset all toggles to default (checked)
        document.querySelectorAll('.toggle-switch input').forEach(input => {
            input.checked = true;
        });
        this.showToast("An sake saita saitunan sanarwa");
    }

    showToast(message) {
        // Use existing toast system or create one
        const toast = document.getElementById('error-toast');
        if (toast) {
            toast.querySelector('.toast-message').textContent = message;
            toast.style.display = 'block';

            setTimeout(() => {
                toast.style.display = 'none';
            }, 3000);
        }
    }

    // Method to add a new notification (you can call this from other parts of your app)
    addNotification(title, message, type = 'system') {
        const newNotification = {
            id: Date.now(),
            title,
            message,
            type,
            timestamp: new Date(),
            read: false,
            actions: ["Duba"]
        };

        this.notifications.unshift(newNotification); // Add to beginning
        this.renderNotifications();
        this.updateBadgeCount();

        // Show notification panel if not visible
        const panel = document.getElementById('notification-panel');
        if (panel.style.display !== 'flex') {
            // You could also show a small toast notification here
            this.showToast("Akwai sabon sanarwa");
        }
    }
}

// Initialize notification system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.notificationSystem = new NotificationSystem();

    // Example: Add a test notification after 5 seconds
    setTimeout(() => {
        window.notificationSystem.addNotification(
            "Barka da zuwa Taimakon Ciki!",
            "Mun yi farin cikin ganin kun shiga app ɗin mu. Muna fatan za ku sami amfani da shi.",
            "system"
        );
    }, 5000);
});

// Example usage from other parts of your app:
// To add a notification from anywhere: window.notificationSystem.addNotification("Title", "Message", "type");