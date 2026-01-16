// Chatbot System
class ChatbotSystem {
    constructor() {
        this.messages = [];
        this.isTyping = false;
        this.isListening = false;
        this.recognition = null;
        this.init();
        this.loadInitialMessages();
    }

    init() {
        // Chat navigation
        document.querySelector('[data-page="chat"]').addEventListener('click', (e) => {
            e.preventDefault();
            this.showChatPage();
        });

        // Chat back button
        document.getElementById('chat-back-btn').addEventListener('click', () => {
            this.hideChatPage();
        });

        // Send message
        document.getElementById('send-btn').addEventListener('click', () => {
            this.sendMessage();
        });

        // Send message on Enter key
        document.getElementById('chat-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Clear chat
        document.getElementById('clear-chat-btn').addEventListener('click', () => {
            this.clearChat();
        });

        // Quick question chips
        document.querySelectorAll('.question-chip').forEach(chip => {
            chip.addEventListener('click', (e) => {
                const question = chip.dataset.question;
                this.addUserMessage(question);
                this.generateBotResponse(question);
            });
        });

        // Voice input
        document.getElementById('voice-btn').addEventListener('click', () => {
            this.toggleVoiceInput();
        });

        // Stop listening
        document.getElementById('stop-listening-btn').addEventListener('click', () => {
            this.stopVoiceInput();
        });

        // Chat theme toggle
        document.getElementById('theme-toggle-chat').addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            this.saveThemePreference();
        });

        // Load theme preference
        this.loadThemePreference();
    }

    showChatPage() {
        document.getElementById('chatbot-page').style.display = 'flex';
        document.getElementById('chatbot-page').classList.add('active');

        // Hide main content and bottom nav
        document.querySelector('.main-content').style.display = 'none';
        document.querySelector('.bottom-nav').style.display = 'none';
        document.querySelector('.app-header').style.display = 'none';

        // Focus on input
        setTimeout(() => {
            document.getElementById('chat-input').focus();
            this.scrollToBottom();
        }, 100);
    }

    hideChatPage() {
        document.getElementById('chatbot-page').classList.remove('active');
        setTimeout(() => {
            document.getElementById('chatbot-page').style.display = 'none';

            // Show main content and bottom nav
            document.querySelector('.main-content').style.display = 'block';
            document.querySelector('.bottom-nav').style.display = 'flex';
            document.querySelector('.app-header').style.display = 'flex';
        }, 300);
    }

    loadInitialMessages() {
        // Add initial bot message if chat is empty
        if (this.messages.length === 0) {
            this.messages.push({
                type: 'bot',
                text: "Sannu! Ina taimakon Ciki da Raino. Zan iya amsa tambayoyin ku game da ciki, kula da jariri, lafiya, da dai sauransu a cikin Hausa. Me kuke bukata?",
                time: new Date()
            });
            this.renderMessages();
        }
    }

    sendMessage() {
        const input = document.getElementById('chat-input');
        const message = input.value.trim();

        if (!message) return;

        // Add user message
        this.addUserMessage(message);

        // Clear input
        input.value = '';

        // Generate bot response
        this.generateBotResponse(message);
    }

    addUserMessage(text) {
        const message = {
            type: 'user',
            text: text,
            time: new Date()
        };

        this.messages.push(message);
        this.renderMessages();
        this.scrollToBottom();
    }

    addBotMessage(text) {
        const message = {
            type: 'bot',
            text: text,
            time: new Date()
        };

        this.messages.push(message);
        this.renderMessages();
        this.scrollToBottom();
    }

    async generateBotResponse(userMessage) {
        // Show typing indicator
        this.showTypingIndicator();

        // Simulate typing delay
        await this.delay(1000 + Math.random() * 1000);

        // Hide typing indicator
        this.hideTypingIndicator();

        // Generate response based on user message
        const response = this.getResponseForMessage(userMessage);

        // Add bot message
        this.addBotMessage(response);
    }

    getResponseForMessage(userMessage) {
        const lowerMessage = userMessage.toLowerCase();

        // Pregnancy symptoms
        if (lowerMessage.includes('alamun') || lowerMessage.includes('ciki') || lowerMessage.includes('symptoms')) {
            return `Alamun farko na ciki sun haɗa da:
1. Jini bai zo ba (missed period)
2. Ƙauracewa da tashin zuciya (morning sickness)
3. Ƙoshin nono da kumburin nono
4. Gajiya da jin bacci da yawa
5. Ƙarin fitsari
6. Ƙin abinci ko sha'awar wasu abinci

Alamun ciki na iya bambanta daga mace zuwa mace. Idan kuna tsammanin kuna da ciki, gwajin ciki ko ziyarar likita zai tabbatar muku.`;
        }

        // Nutrition
        else if (lowerMessage.includes('abinci') || lowerMessage.includes('gina jiki') || lowerMessage.includes('nutrition')) {
            return `Abinci mai gina jiki ga uwa mai ciki:
1. Kayan lambu iri-iri (da yawa 'ya'yan itatuwa da kayan lambu)
2. Fursunoni (tumatir, dankali, dankalin turawa)
3. Nama, kifi, da ƙwai (don gishiri)
4. Kayan shayarwa (madara, yogurt, cuku)
5. Tsaba da ƙwayoyi (almond, gyada, goro)
6. Ruwa da yawa (aƙalla gilashin ruwa 8 a rana)

Kada ku sha abubuwan da ke da sinadarin sukari da yawa, barasa, da kifi masu yawan mercury.`;
        }

        // Water intake
        else if (lowerMessage.includes('ruwa') || lowerMessage.includes('water') || lowerMessage.includes('sha')) {
            return `Yayin ciki, kuna buƙatar ƙarin ruwa don:
1. Taimakawa cikin haɓakar jini
2. Taimakawa wajen ɗaukar abinci mai gina jiki ga jariri
3. Kiyaye zafin jiki
4. Kare koda da kuma aiki mai kyau

Ana ba da shawarar sha aƙalla gilashin ruwa 8-10 a rana. Ruwa, shayi maras launi, da ruwan 'ya'yan itatuwa suna da kyau.`;
        }

        // Labor signs
        else if (lowerMessage.includes('haihuwa') || lowerMessage.includes('labor') || lowerMessage.includes('alamun haihuwa')) {
            return `Alamun haihuwa:
1. Gudun ciki (Braxton Hicks contractions) masu ƙarfi da tsayawa
2. Ƙauracewar ciki (membranes rupturing)
3. Shanye ciki (cervical dilation)
4. Jin ciwo a ƙashin baya da ƙugu
5. Fitowar jini mai ƙarancin launi

Idan kun ji waɗannan alamun, ku tuntuɓi likita ko asibiti nan da nan.`;
        }

        // Baby care
        else if (lowerMessage.includes('jariri') || lowerMessage.includes('baby') || lowerMessage.includes('kula')) {
            return `Kula da jariri bayan haihuwa:
1. Yin nono da fara'a: Jariri yana buƙatar nono kowane awa 2-3
2. Kiyaye tsabta: Wankewa, canza diapers, kiyaye tsaftar wurin
3. Bacci: Jariri na iya bacci sa'o'i 14-17 a rana
4. Hulɗa: Yi magana, yi waɗa, riƙe jariri
5. Lura da alamun rashin lafiya: zazzabi, ƙin abinci, baƙin ciki

Tuntuɓi likitan yara idan kun ga wani abu da ba na al'ada ba.`;
        }

        // Pregnancy diseases
        else if (lowerMessage.includes('cututtuka') || lowerMessage.includes('diseases') || lowerMessage.includes('lafiya')) {
            return `Cututtukan ciki da za a kiyaye:
1. High blood pressure (preeclampsia)
2. Gestational diabetes
3. Anemia (rashin jini)
4. Infections
5. Depression na ciki

Don kiyaye lafiyar ku da ta jariri:
1. Yin binciken asibiti akai-akai
2. Ci abinci mai gina jiki
3. Yin motsa jiki daidai
4. Yin bacci da yawa
5. Yin gwajin ciki na yau da kullun`;
        }

        // Default response
        else {
            const responses = [
                "Na gane tambayar ku. Zan iya ba ku cikakken bayani game da wannan batu a cikin Hausa.",
                "Wannan tambaya ce mai kyau. Ina so in ba ku shawarwari masu amfani game da wannan.",
                "Na karɓi tambayar ku. Zan ba da amsa cikin Hausa ta hanya mai sauƙi don fahimta.",
                "Taimakon Ciki yana nan don taimaka muku. Bari in ba ku bayani mai amfani game da wannan.",
                "Akwai bayanai masu yawa game da wannan a cikin app ɗin mu. Zan iya gabatar muku da muhimman abubuwa."
            ];

            return responses[Math.floor(Math.random() * responses.length)];
        }
    }

    showTypingIndicator() {
        this.isTyping = true;
        document.getElementById('typing-indicator').style.display = 'flex';
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        this.isTyping = false;
        document.getElementById('typing-indicator').style.display = 'none';
    }

    toggleVoiceInput() {
        if (!this.isListening) {
            this.startVoiceInput();
        } else {
            this.stopVoiceInput();
        }
    }

    startVoiceInput() {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            this.showToast("Aikin murya bai goyi baya a burauzar ku ba");
            return;
        }

        this.isListening = true;
        document.getElementById('voice-listening').style.display = 'flex';

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();

        this.recognition.lang = 'ha-NG'; // Hausa language
        this.recognition.interimResults = false;
        this.recognition.maxAlternatives = 1;

        this.recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            document.getElementById('chat-input').value = transcript;
            this.stopVoiceInput();
        };

        this.recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            this.stopVoiceInput();
            this.showToast("An sami kuskure yayin sauraren murya");
        };

        this.recognition.onend = () => {
            this.stopVoiceInput();
        };

        this.recognition.start();
    }

    stopVoiceInput() {
        if (this.recognition) {
            this.recognition.stop();
        }
        this.isListening = false;
        document.getElementById('voice-listening').style.display = 'none';
    }

    clearChat() {
        if (confirm("Shin kuna son share duk tattaunawar?")) {
            this.messages = [];
            document.getElementById('messages-container').innerHTML = '';

            // Add initial bot message
            this.messages.push({
                type: 'bot',
                text: "Sannu! Ina taimakon Ciki da Raino. Zan iya amsa tambayoyin ku game da ciki, kula da jariri, lafiya, da dai sauransu a cikin Hausa. Me kuke bukata?",
                time: new Date()
            });

            this.renderMessages();
            this.showToast("An share tattaunawar");
        }
    }

    renderMessages() {
        const container = document.getElementById('messages-container');
        container.innerHTML = '';

        this.messages.forEach(msg => {
            const messageElement = this.createMessageElement(msg);
            container.appendChild(messageElement);
        });
    }

    createMessageElement(message) {
        const div = document.createElement('div');
        div.className = `message ${message.type}-message`;

        const timeString = this.formatTime(message.time);

        div.innerHTML = `
            <div class="message-avatar">
                <span>${message.type === 'bot' ? '🤖' : '👤'}</span>
            </div>
            <div class="message-content">
                <p>${message.text}</p>
                <div class="message-time">${timeString}</div>
            </div>
        `;

        return div;
    }

    formatTime(date) {
        const now = new Date();
        const diff = now - new Date(date);

        if (diff < 60000) { // Less than 1 minute
            return 'Yanzu';
        } else if (diff < 3600000) { // Less than 1 hour
            const minutes = Math.floor(diff / 60000);
            return `Da mintoci ${minutes} da suka wuce`;
        } else if (diff < 86400000) { // Less than 1 day
            const hours = Math.floor(diff / 3600000);
            return `Da awowi ${hours} da suka wuce`;
        } else {
            return new Date(date).toLocaleTimeString('ha-NG', {
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    }

    scrollToBottom() {
        setTimeout(() => {
            const container = document.getElementById('messages-container');
            if (container) {
                container.scrollTop = container.scrollHeight;
            }
        }, 100);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    showToast(message) {
        const toast = document.getElementById('error-toast');
        if (toast) {
            toast.querySelector('.toast-message').textContent = message;
            toast.style.display = 'block';

            setTimeout(() => {
                toast.style.display = 'none';
            }, 3000);
        }
    }

    saveThemePreference() {
        const isDarkMode = document.body.classList.contains('dark-mode');
        localStorage.setItem('chatbot-theme', isDarkMode ? 'dark' : 'light');
    }

    loadThemePreference() {
        const theme = localStorage.getItem('chatbot-theme');
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
        }
    }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.chatbotSystem = new ChatbotSystem();

    // Navigation between pages
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();

            const page = item.dataset.page;

            // Remove active class from all nav items
            document.querySelectorAll('.nav-item').forEach(navItem => {
                navItem.classList.remove('active');
            });

            // Add active class to clicked item
            item.classList.add('active');

            // Handle different pages
            if (page === 'chat') {
                window.chatbotSystem.showChatPage();
            } else {
                window.chatbotSystem.hideChatPage();
            }
        });
    });

    // Close chatbot when clicking back button on mobile
    document.addEventListener('backbutton', () => {
        if (document.getElementById('chatbot-page').style.display === 'flex') {
            window.chatbotSystem.hideChatPage();
        }
    }, false);
});