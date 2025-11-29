// AI Chatbot Integration for Shree Gopinath Dental Care
// This script integrates with n8n webhook to enable automated AI chatbot functionality

class AIChatBot {
    constructor(webhookUrl) {
        this.webhookUrl = webhookUrl;
        this.isInitialized = false;
        this.conversationId = this.generateConversationId();
        this.isTyping = false;
        this.messageHistory = [];
        this.currentTheme = 'light';
        this.soundEnabled = true;
        this.isMinimized = false;
        this.unreadCount = 0;
        this.lastSeen = Date.now();
        this.suggestionsHidden = false; // Track if suggestions are hidden
        this.init();
    }

    generateConversationId() {
        return 'conv_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    init() {
        // Initialize the bot integration
        this.createBotWidget();
        this.setupEventListeners();
        this.isInitialized = true;
        console.log('AI ChatBot initialized with conversation ID:', this.conversationId);
    }

    createBotWidget() {
        // Create a floating AI chatbot button with enhanced features
        const botWidget = document.createElement('div');
        botWidget.id = 'ai-chatbot-widget';
        botWidget.innerHTML = `
            <div class="chatbot-container">
                <div class="chatbot-button" id="chatbot-btn">
                    <i class="fas fa-robot"></i>
                    <span class="bot-indicator">AI</span>
                    <span class="unread-badge" id="unread-badge" style="display: none;">0</span>
                    <div class="pulse-ring"></div>
                </div>
                <div class="chatbot-popup" id="chatbot-popup">
                    <div class="bot-header">
                        <div class="bot-avatar">
                            <i class="fas fa-robot"></i>
                            <div class="status-indicator online"></div>
                        </div>
                        <div class="bot-info">
                            <h4>Dr. Sudha's AI Assistant</h4>
                            <p class="status-text">🟢 Online • Ready to help</p>
                        </div>
                        <div class="header-actions">
                            <button class="minimize-btn" id="minimize-btn" title="Minimize">
                                <i class="fas fa-minus"></i>
                            </button>
                            <button class="theme-btn" id="theme-btn" title="Dark Mode">
                                <i class="fas fa-moon"></i>
                            </button>
                            <button class="sound-btn" id="sound-btn" title="Sound On">
                                <i class="fas fa-volume-up"></i>
                            </button>
                            <button class="close-bot" id="close-bot" title="Close">×</button>
                        </div>
                    </div>
                    <div class="bot-content" id="bot-content">
                        <div class="chat-container" id="chat-container">
                            <div class="chat-messages" id="chat-messages">
                                <div class="bot-message welcome-message">
                                    <div class="message-avatar">
                                        <i class="fas fa-robot"></i>
                                    </div>
                                    <div class="message-content">
                                        <p>👋 Hello! I'm Dr. Sudha's AI assistant for Shree Gopinath Dental Care.</p>
                                        <p>I can help you with:</p>
                                        <ul class="help-list">
                                            <li>🗓️ Booking appointments</li>
                                            <li>🦷 Treatment information</li>
                                            <li>📍 Clinic details & directions</li>
                                            <li>💰 Pricing & insurance</li>
                                            <li>⏰ Working hours</li>
                                        </ul>
                                        <p>How can I assist you today?</p>
                                        <span class="message-time">${this.getCurrentTime()}</span>
                                    </div>
                                </div>
                            </div>
                           
                            <div class="suggestions-container" id="suggestions-container">
                                <div class="suggestions-header">
                                    <span>💡 Quick suggestions:</span>
                                </div>
                                <div class="quick-actions" id="quick-actions">
                                    <button class="quick-btn primary" data-message="I want to book an appointment with Dr. Sudha Singh">
                                        <i class="fas fa-calendar-plus"></i>
                                        <span>Book Appointment</span>
                                    </button>
                                    <button class="quick-btn" data-message="What dental services and treatments do you offer?">
                                        <i class="fas fa-tooth"></i>
                                        <span>Our Services</span>
                                    </button>
                                    <button class="quick-btn" data-message="What are your clinic hours and when are you open?">
                                        <i class="fas fa-clock"></i>
                                        <span>Clinic Hours</span>
                                    </button>
                                    <button class="quick-btn" data-message="Where is your clinic located and how can I reach there?">
                                        <i class="fas fa-map-marker-alt"></i>
                                        <span>Location & Directions</span>
                                    </button>
                                    <button class="quick-btn" data-message="What are your treatment prices and do you accept insurance?">
                                        <i class="fas fa-dollar-sign"></i>
                                        <span>Pricing & Insurance</span>
                                    </button>
                                    <button class="quick-btn" data-message="What should I expect during my first visit?">
                                        <i class="fas fa-user-md"></i>
                                        <span>First Visit</span>
                                    </button>
                                </div>
                            </div>

                            <div class="typing-suggestions" id="typing-suggestions" style="display: none;">
                                <div class="suggestion-chip" data-text="Book appointment">Book appointment</div>
                                <div class="suggestion-chip" data-text="Emergency dental care">Emergency care</div>
                                <div class="suggestion-chip" data-text="Teeth cleaning">Teeth cleaning</div>
                            </div>

                            <div class="chat-input-container">
                                <div class="chat-input-box">
                                    <button class="attachment-btn" id="attachment-btn" title="Attach file">
                                        <i class="fas fa-paperclip"></i>
                                    </button>
                                    <input type="text" id="chat-input" placeholder="Type your message..." autocomplete="off" />
                                    <button class="emoji-btn" id="emoji-btn" title="Add emoji">
                                        <i class="fas fa-smile"></i>
                                    </button>
                                    <button class="send-btn" id="send-btn">
                                        <i class="fas fa-paper-plane"></i>
                                    </button>
                                </div>
                                <div class="input-actions">
                                    <span class="char-counter" id="char-counter">0/500</span>
                                    <span class="typing-indicator-text" id="typing-indicator-text"></span>
                                </div>
                            </div>
                        </div>
                        <div class="bot-footer">
                            <div class="footer-content">
                                <span class="powered-by">🤖 Powered by Advanced AI</span>
                                <div class="footer-actions">
                                    <button class="feedback-btn" id="feedback-btn" title="Rate this conversation">
                                        <i class="fas fa-thumbs-up"></i>
                                    </button>
                                    <button class="refresh-btn" id="refresh-btn" title="Start new conversation">
                                        <i class="fas fa-redo"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Minimized state -->
                    <div class="minimized-content" id="minimized-content" style="display: none;">
                        <div class="minimized-header">
                            <div class="bot-avatar small">
                                <i class="fas fa-robot"></i>
                            </div>
                            <span>Dr. Sudha's AI Assistant</span>
                            <button class="restore-btn" id="restore-btn">
                                <i class="fas fa-expand"></i>
                            </button>
                        </div>
                        <div class="minimized-preview" id="minimized-preview">
                            Click to continue conversation...
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Enhanced styles with modern design and animations
        const styles = `
            <style>
                /* Base styles with responsive considerations */
                * {
                    box-sizing: border-box;
                }

                :root {
                    --primary-color: #2563eb;
                    --primary-dark: #1d4ed8;
                    --secondary-color: #10b981;
                    --accent-color: #f59e0b;
                    --danger-color: #ef4444;
                    --text-primary: #1f2937;
                    --text-secondary: #6b7280;
                    --bg-primary: #ffffff;
                    --bg-secondary: #f9fafb;
                    --border-color: #e5e7eb;
                    --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
                    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
                    --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
                    --blur-backdrop: blur(20px);
                }

                [data-theme="dark"] {
                    --primary-color: #3b82f6;
                    --primary-dark: #2563eb;
                    --secondary-color: #10b981;
                    --text-primary: #f9fafb;
                    --text-secondary: #d1d5db;
                    --bg-primary: #1f2937;
                    --bg-secondary: #111827;
                    --border-color: #374151;
                }

                .chatbot-container {
                    position: fixed;
                    bottom: 24px;
                    right: 24px;
                    z-index: 10000;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                    max-width: calc(100vw - 48px);
                }

                .chatbot-button {
                    width: 64px;
                    height: 64px;
                    background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    box-shadow: var(--shadow-lg);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                    backdrop-filter: var(--blur-backdrop);
                }

                .chatbot-button:hover {
                    transform: scale(1.1) translateY(-2px);
                    box-shadow: var(--shadow-xl);
                }

                .chatbot-button i {
                    font-size: 28px;
                    color: white;
                    transition: transform 0.3s ease;
                }

                .chatbot-button:hover i {
                    transform: rotate(10deg);
                }

                .pulse-ring {
                    position: absolute;
                    inset: -4px;
                    border: 2px solid var(--primary-color);
                    border-radius: 50%;
                    opacity: 0.6;
                    animation: pulse-ring 2s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite;
                }

                .bot-indicator {
                    position: absolute;
                    top: -8px;
                    right: -8px;
                    background: var(--secondary-color);
                    color: white;
                    font-size: 10px;
                    padding: 3px 6px;
                    border-radius: 12px;
                    font-weight: 600;
                    text-transform: uppercase;
                    box-shadow: var(--shadow-md);
                }

                .unread-badge {
                    position: absolute;
                    top: -12px;
                    left: -12px;
                    background: var(--danger-color);
                    color: white;
                    font-size: 12px;
                    padding: 4px 8px;
                    border-radius: 50%;
                    font-weight: 700;
                    min-width: 24px;
                    text-align: center;
                    animation: bounce 0.5s ease;
                }

                .chatbot-popup {
                    position: absolute;
                    bottom: 80px;
                    right: 0;
                    width: 380px;
                    max-width: 90vw;
                    max-height: 85vh;
                    background: var(--bg-primary);
                    border-radius: 16px;
                    box-shadow: var(--shadow-xl);
                    opacity: 0;
                    visibility: hidden;
                    transform: translateY(20px) scale(0.95);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    border: 1px solid var(--border-color);
                    backdrop-filter: var(--blur-backdrop);
                    overflow: hidden;
                    z-index: 10001;
                }

                .chatbot-popup.active {
                    opacity: 1;
                    visibility: visible;
                    transform: translateY(0) scale(1);
                }

                .chatbot-popup.minimized .bot-content {
                    display: none;
                }

                .chatbot-popup.minimized .minimized-content {
                    display: block !important;
                }

                .bot-header {
                    background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
                    color: white;
                    padding: 16px 20px;
                    display: flex;
                    align-items: center;
                    position: relative;
                    border-radius: 16px 16px 0 0;
                }

                .bot-avatar {
                    width: 48px;
                    height: 48px;
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-right: 16px;
                    position: relative;
                    border: 2px solid rgba(255, 255, 255, 0.3);
                }

                .bot-avatar.small {
                    width: 32px;
                    height: 32px;
                    margin-right: 12px;
                }

                .bot-avatar i {
                    font-size: 24px;
                }

                .bot-avatar.small i {
                    font-size: 16px;
                }

                .status-indicator {
                    position: absolute;
                    bottom: 2px;
                    right: 2px;
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    border: 2px solid white;
                }

                .status-indicator.online {
                    background: var(--secondary-color);
                    animation: pulse-dot 2s infinite;
                }

                .bot-info {
                    flex: 1;
                    min-width: 0;
                }

                .bot-info h4 {
                    margin: 0 0 4px 0;
                    font-size: 16px;
                    font-weight: 600;
                    color: white;
                }

                .status-text {
                    margin: 0;
                    font-size: 13px;
                    opacity: 0.9;
                    color: white;
                }

                .header-actions {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .header-actions button {
                    width: 32px;
                    height: 32px;
                    border: none;
                    background: rgba(255, 255, 255, 0.2);
                    color: white;
                    border-radius: 8px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease;
                    font-size: 14px;
                }

                .header-actions button:hover {
                    background: rgba(255, 255, 255, 0.3);
                    transform: scale(1.05);
                }

                .bot-content {
                    display: flex;
                    flex-direction: column;
                    height: 500px;
                    max-height: calc(85vh - 120px);
                    min-height: 350px;
                    background: var(--bg-primary);
                }

                .chat-container {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                }

                .chat-messages {
                    flex: 1;
                    padding: 16px;
                    overflow-y: auto;
                    scroll-behavior: smooth;
                    background: var(--bg-secondary);
                    min-height: 200px;
                    max-height: calc(60vh - 200px);
                }

                .chat-messages::-webkit-scrollbar {
                    width: 6px;
                }

                .chat-messages::-webkit-scrollbar-track {
                    background: transparent;
                }

                .chat-messages::-webkit-scrollbar-thumb {
                    background: var(--border-color);
                    border-radius: 3px;
                }

                .chat-messages::-webkit-scrollbar-thumb:hover {
                    background: var(--text-secondary);
                }

                .bot-message, .user-message {
                    display: flex;
                    margin-bottom: 20px;
                    animation: slideInUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .user-message {
                    flex-direction: row-reverse;
                }

                .message-avatar {
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 16px;
                    margin: 0 12px;
                    flex-shrink: 0;
                    box-shadow: var(--shadow-sm);
                }

                .bot-message .message-avatar {
                    background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
                    color: white;
                }

                .user-message .message-avatar {
                    background: linear-gradient(135deg, var(--secondary-color), #059669);
                    color: white;
                    font-size: 18px;
                }

                .user-message .message-avatar::after {
                    content: '👤';
                }

                .message-content {
                    max-width: calc(100% - 60px);
                    width: fit-content;
                    min-width: 120px;
                    background: var(--bg-primary);
                    padding: 12px 16px;
                    border-radius: 18px;
                    position: relative;
                    box-shadow: var(--shadow-sm);
                    border: 1px solid var(--border-color);
                    word-wrap: break-word;
                    overflow-wrap: break-word;
                }

                .user-message .message-content {
                    background: var(--secondary-color);
                    color: white;
                    border-color: var(--secondary-color);
                }

                .welcome-message .message-content {
                    background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
                    border: 1px solid #bae6fd;
                    border-radius: 20px;
                    padding: 20px;
                }

                .help-list {
                    margin: 12px 0;
                    padding-left: 0;
                    list-style: none;
                }

                .help-list li {
                    padding: 4px 0;
                    font-size: 14px;
                    color: var(--text-secondary);
                }

                .message-content p {
                    margin: 0 0 8px 0;
                    font-size: 14px;
                    line-height: 1.5;
                    color: var(--text-primary);
                }

                .user-message .message-content p {
                    color: white;
                }

                .message-content p:last-of-type {
                    margin-bottom: 0;
                }

                .message-time {
                    font-size: 11px;
                    color: var(--text-secondary);
                    display: block;
                    margin-top: 8px;
                    opacity: 0.7;
                }

                .user-message .message-time {
                    color: rgba(255, 255, 255, 0.8);
                }

                .typing-indicator {
                    display: flex;
                    align-items: center;
                    margin-bottom: 20px;
                    animation: slideInUp 0.3s ease;
                }

                .typing-dots {
                    background: var(--bg-primary);
                    padding: 12px 16px;
                    border-radius: 18px;
                    border: 1px solid var(--border-color);
                    box-shadow: var(--shadow-sm);
                }

                .dots {
                    display: flex;
                    gap: 4px;
                }

                .dots span {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: var(--primary-color);
                    animation: typing-dot 1.4s infinite ease-in-out;
                }

                .dots span:nth-child(1) { animation-delay: 0s; }
                .dots span:nth-child(2) { animation-delay: 0.2s; }
                .dots span:nth-child(3) { animation-delay: 0.4s; }

                .suggestions-container {
                    background: var(--bg-primary);
                    border-top: 1px solid var(--border-color);
                    padding: 12px 16px;
                    max-height: 140px;
                    min-height: auto;
                    overflow-y: auto;
                    flex-shrink: 0;
                }

                .suggestions-header {
                    font-size: 12px;
                    color: var(--text-secondary);
                    margin-bottom: 12px;
                    font-weight: 500;
                }

                .quick-actions {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
                    gap: 6px;
                }

                .chat-input-container {
                    padding: 16px 20px;
                    background: var(--bg-primary);
                    border-top: 1px solid var(--border-color);
                }

                .chat-input-box {
                    display: flex;
                    align-items: center;
                    background: var(--bg-secondary);
                    border-radius: 24px;
                    padding: 8px;
                    border: 2px solid var(--border-color);
                    transition: border-color 0.2s ease;
                }

                .chat-input-box:focus-within {
                    border-color: var(--primary-color);
                    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
                }

                #chat-input {
                    flex: 1;
                    border: none;
                    background: none;
                    padding: 8px 12px;
                    font-size: 14px;
                    outline: none;
                    color: var(--text-primary);
                    min-height: 20px;
                    resize: none;
                }

                #chat-input::placeholder {
                    color: var(--text-secondary);
                }

                .attachment-btn, .emoji-btn {
                    width: 36px;
                    height: 36px;
                    border: none;
                    background: none;
                    color: var(--text-secondary);
                    cursor: pointer;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease;
                }

                .attachment-btn:hover, .emoji-btn:hover {
                    background: var(--border-color);
                    color: var(--primary-color);
                    transform: scale(1.05);
                }

                .send-btn {
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    border: none;
                    background: var(--primary-color);
                    color: white;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease;
                    margin-left: 4px;
                }

                .send-btn:hover {
                    background: var(--primary-dark);
                    transform: scale(1.05);
                }

                .send-btn:disabled {
                    background: var(--border-color);
                    cursor: not-allowed;
                    transform: none;
                }

                .input-actions {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-top: 8px;
                    font-size: 11px;
                    color: var(--text-secondary);
                }

                .char-counter {
                    opacity: 0.6;
                }

                .quick-btn {
                    background: var(--bg-secondary);
                    border: 1px solid var(--border-color);
                    border-radius: 8px;
                    padding: 8px 10px;
                    text-align: left;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    font-size: 11px;
                    font-weight: 500;
                    color: var(--text-primary);
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }

                .quick-btn:hover {
                    background: var(--primary-color);
                    color: white;
                    border-color: var(--primary-color);
                    transform: translateY(-2px);
                    box-shadow: var(--shadow-md);
                }

                .quick-btn.primary {
                    background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
                    color: white;
                    border-color: var(--primary-color);
                    font-weight: 600;
                }

                .quick-btn i {
                    font-size: 14px;
                    opacity: 0.8;
                }

                .bot-footer {
                    background: var(--bg-primary);
                    border-top: 1px solid var(--border-color);
                    padding: 12px 20px;
                }

                .footer-content {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .powered-by {
                    font-size: 11px;
                    color: var(--text-secondary);
                    opacity: 0.8;
                }

                .footer-actions {
                    display: flex;
                    gap: 8px;
                }

                .footer-actions button {
                    width: 28px;
                    height: 28px;
                    border: none;
                    background: var(--bg-secondary);
                    color: var(--text-secondary);
                    border-radius: 6px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease;
                    font-size: 12px;
                }

                .footer-actions button:hover {
                    background: var(--primary-color);
                    color: white;
                    transform: scale(1.05);
                }

                .minimized-content {
                    padding: 16px 20px;
                    background: var(--bg-primary);
                    border-radius: 20px;
                }

                .minimized-header {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 8px;
                }

                .minimized-preview {
                    font-size: 13px;
                    color: var(--text-secondary);
                    cursor: pointer;
                }

                .typing-suggestions {
                    padding: 8px 20px;
                    background: var(--bg-secondary);
                    border-top: 1px solid var(--border-color);
                    display: flex;
                    gap: 8px;
                    flex-wrap: wrap;
                }

                .suggestion-chip {
                    background: var(--bg-primary);
                    border: 1px solid var(--border-color);
                    border-radius: 16px;
                    padding: 6px 12px;
                    font-size: 12px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    color: var(--text-primary);
                }

                .suggestion-chip:hover {
                    background: var(--primary-color);
                    color: white;
                    border-color: var(--primary-color);
                }

                @keyframes pulse-ring {
                    0% {
                        transform: scale(1);
                        opacity: 0.6;
                    }
                    100% {
                        transform: scale(1.4);
                        opacity: 0;
                    }
                }

                @keyframes pulse-dot {
                    0%, 100% {
                        transform: scale(1);
                        opacity: 1;
                    }
                    50% {
                        transform: scale(1.1);
                        opacity: 0.8;
                    }
                }

                @keyframes slideInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes typing-dot {
                    0%, 60%, 100% {
                        transform: translateY(0);
                        opacity: 0.4;
                    }
                    30% {
                        transform: translateY(-10px);
                        opacity: 1;
                    }
                }

                @keyframes bounce {
                    0%, 20%, 53%, 80%, 100% {
                        transform: translateY(0);
                    }
                    40%, 43% {
                        transform: translateY(-8px);
                    }
                    70% {
                        transform: translateY(-4px);
                    }
                    90% {
                        transform: translateY(-2px);
                    }
                }

                /* Large desktop screens */
                @media (min-width: 1200px) {
                    .chatbot-popup {
                        width: 420px;
                        max-height: 700px;
                    }
                    
                    .bot-content {
                        height: 550px;
                    }

                    .chat-messages {
                        max-height: 350px;
                    }
                }

                /* Tablet styles */
                @media (max-width: 1024px) {
                    .chatbot-popup {
                        width: 340px;
                        max-height: 80vh;
                    }
                    
                    .bot-content {
                        height: 450px;
                    }

                    .chat-messages {
                        max-height: 250px;
                    }
                }

                /* Mobile landscape and smaller tablets */
                @media (max-width: 768px) {
                    .chatbot-popup {
                        width: 320px;
                        right: 8px;
                        bottom: 80px;
                        max-height: 75vh;
                    }
                    
                    .quick-actions {
                        grid-template-columns: 1fr;
                        gap: 8px;
                    }
                    
                    .bot-content {
                        height: 400px;
                    }

                    .chat-messages {
                        max-height: 200px;
                        padding: 12px;
                    }

                    .suggestions-container {
                        max-height: 120px;
                        padding: 12px 16px;
                    }

                    .bot-header {
                        padding: 12px 16px;
                    }

                    .bot-avatar {
                        width: 40px;
                        height: 40px;
                        margin-right: 12px;
                    }

                    .bot-avatar i {
                        font-size: 20px;
                    }

                    .bot-info h4 {
                        font-size: 14px;
                    }

                    .status-text {
                        font-size: 12px;
                    }

                    .header-actions button {
                        width: 28px;
                        height: 28px;
                        font-size: 12px;
                    }

                    .quick-btn {
                        padding: 10px 12px;
                        font-size: 12px;
                    }

                    .quick-btn i {
                        font-size: 12px;
                    }
                }

                /* Mobile portrait */
                @media (max-width: 480px) {
                    .chatbot-container {
                        bottom: 16px;
                        right: 16px;
                    }

                    .chatbot-button {
                        width: 56px;
                        height: 56px;
                    }

                    .chatbot-button i {
                        font-size: 24px;
                    }

                    .chatbot-popup {
                        width: calc(100vw - 32px);
                        right: 0;
                        bottom: 72px;
                        max-height: 70vh;
                        border-radius: 12px;
                    }
                    
                    .bot-content {
                        height: 350px;
                    }

                    .chat-messages {
                        max-height: 180px;
                        padding: 10px;
                    }

                    .suggestions-container {
                        max-height: 100px;
                        padding: 8px 12px;
                    }

                    .bot-header {
                        padding: 10px 12px;
                        border-radius: 12px 12px 0 0;
                    }

                    .bot-avatar {
                        width: 36px;
                        height: 36px;
                        margin-right: 10px;
                    }

                    .bot-avatar i {
                        font-size: 18px;
                    }

                    .bot-info h4 {
                        font-size: 13px;
                        margin-bottom: 2px;
                    }

                    .status-text {
                        font-size: 11px;
                    }

                    .header-actions {
                        gap: 4px;
                    }

                    .header-actions button {
                        width: 24px;
                        height: 24px;
                        font-size: 10px;
                    }

                    .chat-input-container {
                        padding: 12px 16px;
                    }

                    .chat-input-box {
                        padding: 6px;
                    }

                    #chat-input {
                        padding: 6px 10px;
                        font-size: 13px;
                    }

                    .attachment-btn, .emoji-btn {
                        width: 32px;
                        height: 32px;
                    }

                    .send-btn {
                        width: 32px;
                        height: 32px;
                    }

                    .quick-btn {
                        padding: 8px 10px;
                        font-size: 11px;
                        border-radius: 6px;
                    }

                    .quick-btn i {
                        font-size: 11px;
                    }

                    .quick-btn span {
                        font-size: 11px;
                    }

                    .bot-footer {
                        padding: 8px 16px;
                    }

                    .footer-actions button {
                        width: 24px;
                        height: 24px;
                        font-size: 10px;
                    }

                    .message-avatar {
                        width: 32px;
                        height: 32px;
                        font-size: 14px;
                        margin: 0 8px;
                    }

                    .message-content {
                        max-width: 80%;
                        padding: 10px 12px;
                        border-radius: 16px;
                    }

                    .message-content p {
                        font-size: 13px;
                        line-height: 1.4;
                    }

                    .message-time {
                        font-size: 10px;
                        margin-top: 6px;
                    }

                    .welcome-message .message-content {
                        padding: 16px;
                        border-radius: 16px;
                    }

                    .help-list li {
                        font-size: 12px;
                        padding: 3px 0;
                    }

                    .suggestions-header {
                        font-size: 11px;
                        margin-bottom: 8px;
                    }

                    .input-actions {
                        margin-top: 6px;
                        font-size: 10px;
                    }
                }

                /* Small mobile devices */
                @media (max-width: 375px) {
                    .chatbot-popup {
                        width: calc(100vw - 24px);
                        right: -4px;
                        bottom: 68px;
                    }

                    .bot-content {
                        height: 320px;
                    }

                    .chat-messages {
                        max-height: 160px;
                        padding: 8px;
                    }

                    .suggestions-container {
                        max-height: 90px;
                        padding: 6px 10px;
                    }

                    .quick-actions {
                        gap: 6px;
                    }

                    .quick-btn {
                        padding: 6px 8px;
                        font-size: 10px;
                    }

                    .quick-btn i {
                        font-size: 10px;
                    }
                }

                /* Landscape orientation adjustments */
                @media (max-height: 600px) and (orientation: landscape) {
                    .chatbot-popup {
                        max-height: 85vh;
                        bottom: 60px;
                    }

                    .bot-content {
                        height: 280px;
                    }

                    .chat-messages {
                        max-height: 140px;
                    }

                    .suggestions-container {
                        max-height: 80px;
                    }
                }

                /* Very small screens */
                @media (max-height: 500px) {
                    .chatbot-popup {
                        max-height: 90vh;
                        bottom: 50px;
                    }

                    .bot-content {
                        height: 250px;
                    }

                    .chat-messages {
                        max-height: 120px;
                        padding: 6px;
                    }

                    .suggestions-container {
                        max-height: 70px;
                        padding: 4px 8px;
                    }

                    .bot-header {
                        padding: 8px 12px;
                    }

                    .chat-input-container {
                        padding: 8px 12px;
                    }

                    .bot-footer {
                        padding: 6px 12px;
                    }
                }
            </style>
        `;

        // Add styles to head
        document.head.insertAdjacentHTML('beforeend', styles);
        
        // Add widget to body
        document.body.appendChild(botWidget);
    }

    getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit', 
            hour12: true 
        });
    }

    setupEventListeners() {
        const botBtn = document.getElementById('chatbot-btn');
        const botPopup = document.getElementById('chatbot-popup');
        const closeBtn = document.getElementById('close-bot');
        const minimizeBtn = document.getElementById('minimize-btn');
        const restoreBtn = document.getElementById('restore-btn');
        const themeBtn = document.getElementById('theme-btn');
        const soundBtn = document.getElementById('sound-btn');
        const chatInput = document.getElementById('chat-input');
        const sendBtn = document.getElementById('send-btn');
        const quickBtns = document.querySelectorAll('.quick-btn');
        const attachmentBtn = document.getElementById('attachment-btn');
        const emojiBtn = document.getElementById('emoji-btn');
        const feedbackBtn = document.getElementById('feedback-btn');
        const refreshBtn = document.getElementById('refresh-btn');

        // Toggle popup
        botBtn.addEventListener('click', () => {
            botPopup.classList.toggle('active');
            if (botPopup.classList.contains('active')) {
                chatInput.focus();
                this.markAsRead();
            }
        });

        // Close popup
        closeBtn.addEventListener('click', () => {
            botPopup.classList.remove('active');
        });

        // Minimize chat
        minimizeBtn.addEventListener('click', () => {
            botPopup.classList.add('minimized');
            this.isMinimized = true;
        });

        // Restore chat
        restoreBtn?.addEventListener('click', () => {
            botPopup.classList.remove('minimized');
            this.isMinimized = false;
            chatInput.focus();
        });

        // Theme toggle
        themeBtn.addEventListener('click', () => {
            this.toggleTheme();
        });

        // Sound toggle
        soundBtn.addEventListener('click', () => {
            this.toggleSound();
        });

        // Handle quick actions
        quickBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const message = e.target.closest('.quick-btn').getAttribute('data-message');
                this.sendMessage(message);
                this.hideSuggestionsAfterUse();
            });
        });

        // Handle chat input
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.handleSendMessage();
            }
        });

        chatInput.addEventListener('input', (e) => {
            this.updateCharCounter();
            this.showTypingSuggestions(e.target.value);
        });

        sendBtn.addEventListener('click', () => {
            this.handleSendMessage();
        });

        // Attachment handling
        attachmentBtn.addEventListener('click', () => {
            this.handleAttachment();
        });

        // Emoji handling
        emojiBtn.addEventListener('click', () => {
            this.showEmojiPicker();
        });

        // Feedback
        feedbackBtn.addEventListener('click', () => {
            this.showFeedbackDialog();
        });

        // Refresh conversation
        refreshBtn.addEventListener('click', () => {
            this.startNewConversation();
        });

        // Handle suggestion chips
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('suggestion-chip')) {
                const text = e.target.getAttribute('data-text');
                chatInput.value = text;
                chatInput.focus();
                this.hideTypingSuggestions();
            }
        });

        // Close popup when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.chatbot-container')) {
                botPopup.classList.remove('active');
            }
        });

        // Handle visibility change
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden && botPopup.classList.contains('active')) {
                this.markAsRead();
            }
        });
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        
        const themeBtn = document.getElementById('theme-btn');
        const icon = themeBtn.querySelector('i');
        
        if (this.currentTheme === 'dark') {
            icon.className = 'fas fa-sun';
            themeBtn.title = 'Light Mode';
        } else {
            icon.className = 'fas fa-moon';
            themeBtn.title = 'Dark Mode';
        }
        
        this.playSound('toggle');
    }

    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        const soundBtn = document.getElementById('sound-btn');
        const icon = soundBtn.querySelector('i');
        
        if (this.soundEnabled) {
            icon.className = 'fas fa-volume-up';
            soundBtn.title = 'Sound On';
        } else {
            icon.className = 'fas fa-volume-mute';
            soundBtn.title = 'Sound Off';
        }
        
        this.playSound('toggle');
    }

    updateCharCounter() {
        const chatInput = document.getElementById('chat-input');
        const charCounter = document.getElementById('char-counter');
        const currentLength = chatInput.value.length;
        charCounter.textContent = `${currentLength}/500`;
        
        if (currentLength > 450) {
            charCounter.style.color = 'var(--danger-color)';
        } else if (currentLength > 350) {
            charCounter.style.color = 'var(--accent-color)';
        } else {
            charCounter.style.color = 'var(--text-secondary)';
        }
    }

    showTypingSuggestions(value) {
        const suggestionsContainer = document.getElementById('typing-suggestions');
        
        if (value.length > 2) {
            const suggestions = this.getSmartSuggestions(value);
            if (suggestions.length > 0) {
                suggestionsContainer.innerHTML = suggestions.map(s => 
                    `<div class="suggestion-chip" data-text="${s}">${s}</div>`
                ).join('');
                suggestionsContainer.style.display = 'flex';
            } else {
                this.hideTypingSuggestions();
            }
        } else {
            this.hideTypingSuggestions();
        }
    }

    hideTypingSuggestions() {
        const suggestionsContainer = document.getElementById('typing-suggestions');
        suggestionsContainer.style.display = 'none';
    }

    getSmartSuggestions(input) {
        const suggestions = [
            'book an appointment',
            'emergency dental care',
            'teeth cleaning cost',
            'root canal treatment',
            'dental implants',
            'teeth whitening',
            'orthodontic treatment',
            'wisdom tooth removal',
            'dental insurance',
            'payment plans'
        ];
        
        return suggestions.filter(s => 
            s.toLowerCase().includes(input.toLowerCase())
        ).slice(0, 3);
    }

    hideSuggestionsAfterUse() {
        if (!this.suggestionsHidden) {
            const suggestionsContainer = document.getElementById('suggestions-container');
            if (suggestionsContainer) {
                suggestionsContainer.style.display = 'none';
                this.suggestionsHidden = true;
            }
        }
    }

    hideQuickActions() {
        // This method is kept for backward compatibility but now calls hideSuggestionsAfterUse
        this.hideSuggestionsAfterUse();
    }

    markAsRead() {
        this.unreadCount = 0;
        this.lastSeen = Date.now();
        const unreadBadge = document.getElementById('unread-badge');
        unreadBadge.style.display = 'none';
    }

    incrementUnreadCount() {
        if (document.hidden || !document.getElementById('chatbot-popup').classList.contains('active')) {
            this.unreadCount++;
            const unreadBadge = document.getElementById('unread-badge');
            unreadBadge.textContent = this.unreadCount;
            unreadBadge.style.display = 'block';
        }
    }

    playSound(type) {
        if (!this.soundEnabled) return;
        
        // Create audio context for different sound types
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        switch (type) {
            case 'message':
                oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
                break;
            case 'send':
                oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);
                break;
            case 'toggle':
                oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
                break;
            default:
                oscillator.frequency.setValueAtTime(500, audioContext.currentTime);
        }
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.1);
    }

    handleAttachment() {
        // Create file input for attachment
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*,.pdf,.doc,.docx';
        fileInput.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                this.handleFileUpload(file);
            }
        };
        fileInput.click();
    }

    handleFileUpload(file) {
        // For demo purposes, we'll just show the file name
        const message = `📎 Attached file: ${file.name} (${this.formatFileSize(file.size)})`;
        this.addMessageToChat(message, 'user');
        this.playSound('send');
        
        // In a real implementation, you would upload the file and include the URL in the webhook
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    showEmojiPicker() {
        const emojis = ['😊', '😃', '😍', '🤔', '👍', '👎', '❤️', '😂', '😎', '🦷', '😷', '💊'];
        const chatInput = document.getElementById('chat-input');
        
        // Create emoji picker
        let emojiPicker = document.getElementById('emoji-picker');
        if (!emojiPicker) {
            emojiPicker = document.createElement('div');
            emojiPicker.id = 'emoji-picker';
            emojiPicker.style.cssText = `
                position: absolute;
                bottom: 60px;
                right: 60px;
                background: var(--bg-primary);
                border: 1px solid var(--border-color);
                border-radius: 12px;
                padding: 12px;
                display: grid;
                grid-template-columns: repeat(6, 1fr);
                gap: 8px;
                box-shadow: var(--shadow-lg);
                z-index: 1001;
            `;
            document.body.appendChild(emojiPicker);
        }
        
        emojiPicker.innerHTML = emojis.map(emoji => 
            `<span style="cursor: pointer; font-size: 20px; padding: 4px; border-radius: 4px; hover:background-color: var(--bg-secondary);" onclick="document.getElementById('chat-input').value += '${emoji}'; this.parentElement.remove();">${emoji}</span>`
        ).join('');
        
        // Remove picker after 5 seconds
        setTimeout(() => {
            if (emojiPicker.parentElement) {
                emojiPicker.remove();
            }
        }, 5000);
    }

    showFeedbackDialog() {
        const feedback = prompt('How was your experience with our AI assistant? (1-5 stars and optional comment)');
        if (feedback) {
            this.sendFeedback(feedback);
        }
    }

    async sendFeedback(feedback) {
        try {
            await this.sendToWebhook(`FEEDBACK: ${feedback}`, 'feedback');
            this.addMessageToChat('Thank you for your feedback! 🙏', 'bot');
        } catch (error) {
            console.error('Failed to send feedback:', error);
        }
    }

    startNewConversation() {
        if (confirm('Start a new conversation? This will clear the current chat.')) {
            this.conversationId = this.generateConversationId();
            this.messageHistory = [];
            
            const chatMessages = document.getElementById('chat-messages');
            chatMessages.innerHTML = `
                <div class="bot-message welcome-message">
                    <div class="message-avatar">
                        <i class="fas fa-robot"></i>
                    </div>
                    <div class="message-content">
                        <p>👋 Hello! I'm Dr. Sudha's AI assistant for Shree Gopinath Dental Care.</p>
                        <p>How can I help you today?</p>
                        <span class="message-time">${this.getCurrentTime()}</span>
                    </div>
                </div>
            `;
            
            // Show quick actions again
            const quickActions = document.getElementById('quick-actions');
            quickActions.style.display = 'grid';
            
            this.playSound('toggle');
        }
    }

    handleSendMessage() {
        const chatInput = document.getElementById('chat-input');
        const message = chatInput.value.trim();
        
        if (message && !this.isTyping) {
            this.sendMessage(message);
            chatInput.value = '';
        }
    }

    async sendMessage(message) {
        if (this.isTyping || !message.trim()) return;

        // Add to message history
        this.messageHistory.push({
            message: message,
            sender: 'user',
            timestamp: new Date().toISOString()
        });

        // Add user message to chat
        this.addMessageToChat(message, 'user');
        this.playSound('send');

        // Show typing indicator
        this.showTypingIndicator();

        try {
            // Send message to n8n webhook and get response
            const response = await this.sendToWebhook(message);
            
            // Hide typing indicator
            this.hideTypingIndicator();

            let botReply;
            if (response && response.output) {
                botReply = response.output;
            } else if (response && response.reply) {
                botReply = response.reply;
            } else if (response && response.message) {
                botReply = response.message;
            } else {
                botReply = this.getDefaultResponse();
            }

            // Add to message history
            this.messageHistory.push({
                message: botReply,
                sender: 'bot',
                timestamp: new Date().toISOString()
            });

            // Add bot response to chat with enhanced formatting
            this.addMessageToChat(botReply, 'bot');
            this.playSound('message');
            this.incrementUnreadCount();

            // Handle special response types
            if (response && response.actions) {
                this.handleBotActions(response.actions);
            }

        } catch (error) {
            console.error('Failed to get bot response:', error);
            this.hideTypingIndicator();
            const errorMessage = this.getErrorMessage();
            this.addMessageToChat(errorMessage, 'bot');
            this.playSound('message');
        }

        this.scrollToBottom();
    }

    getDefaultResponse() {
        const responses = [
            "I apologize, but I'm having trouble processing your request right now. Let me try to help you in another way.",
            "I'm experiencing some technical difficulties at the moment. Please try rephrasing your question.",
            "I want to make sure I give you the best answer. Could you please rephrase your question?",
            "I'm here to help! Could you provide a bit more detail about what you're looking for?"
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    getErrorMessage() {
        const errorMessages = [
            "I'm sorry, I'm experiencing technical difficulties. Please try again in a moment.",
            "It seems there's a connection issue. Please check your internet and try again.",
            "Something went wrong on my end. Please try again or contact us directly at [phone number].",
            "I'm having trouble connecting to my servers. Please try again shortly."
        ];
        return errorMessages[Math.floor(Math.random() * errorMessages.length)];
    }

    handleBotActions(actions) {
        actions.forEach(action => {
            switch (action.type) {
                case 'show_calendar':
                    this.showCalendarWidget();
                    break;
                case 'show_location':
                    this.showLocationMap();
                    break;
                case 'show_services':
                    this.showServicesMenu();
                    break;
                case 'collect_contact':
                    this.showContactForm();
                    break;
                default:
                    console.log('Unknown action:', action);
            }
        });
    }

    addMessageToChat(message, sender) {
        const chatMessages = document.getElementById('chat-messages');
        const messageElement = document.createElement('div');
        messageElement.className = `${sender}-message`;
        
        const avatarIcon = sender === 'bot' ? '<i class="fas fa-robot"></i>' : '';
        const formattedMessage = this.formatMessage(message);
        
        messageElement.innerHTML = `
            <div class="message-avatar">
                ${avatarIcon}
            </div>
            <div class="message-content">
                ${formattedMessage}
                <span class="message-time">${this.getCurrentTime()}</span>
            </div>
        `;

        // Add animation class
        messageElement.style.opacity = '0';
        messageElement.style.transform = 'translateY(20px)';
        
        chatMessages.appendChild(messageElement);
        
        // Trigger animation
        setTimeout(() => {
            messageElement.style.opacity = '1';
            messageElement.style.transform = 'translateY(0)';
            messageElement.style.transition = 'all 0.3s ease';
        }, 10);

        this.scrollToBottom();
    }

    formatMessage(message) {
        // Enhanced message formatting
        let formatted = message
            // Convert URLs to clickable links
            .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener" style="color: var(--primary-color); text-decoration: underline;">$1</a>')
            // Convert phone numbers to clickable links
            .replace(/(\+?[\d\s\-\(\)]{10,})/g, '<a href="tel:$1" style="color: var(--primary-color); text-decoration: underline;">$1</a>')
            // Convert email addresses to clickable links
            .replace(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/g, '<a href="mailto:$1" style="color: var(--primary-color); text-decoration: underline;">$1</a>')
            // Convert line breaks
            .replace(/\n/g, '<br>')
            // Bold text **text**
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            // Italic text *text*
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            // Code blocks `code`
            .replace(/`(.*?)`/g, '<code style="background: var(--bg-secondary); padding: 2px 4px; border-radius: 4px; font-family: monospace;">$1</code>');

        // If message contains multiple paragraphs, wrap in proper structure
        if (formatted.includes('<br><br>')) {
            const paragraphs = formatted.split('<br><br>');
            formatted = paragraphs.map(p => `<p>${p.replace(/<br>/g, ' ')}</p>`).join('');
        } else {
            formatted = `<p>${formatted}</p>`;
        }

        return formatted;
    }

    async sendToWebhook(message, type = 'chat') {
        try {
            const webhookData = {
                message: message,
                conversationId: this.conversationId,
                timestamp: new Date().toISOString(),
                source: 'website_chat',
                type: type,
                messageHistory: this.messageHistory.slice(-5), // Send last 5 messages for context
                userAgent: navigator.userAgent,
                sessionData: {
                    url: window.location.href,
                    referrer: document.referrer,
                    userTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                    userLanguage: navigator.language,
                    screenResolution: `${screen.width}x${screen.height}`,
                    chatTheme: this.currentTheme,
                    soundEnabled: this.soundEnabled
                },
                metadata: {
                    messageCount: this.messageHistory.length,
                    sessionDuration: Date.now() - this.lastSeen,
                    isFirstMessage: this.messageHistory.length === 1
                }
            };

            console.log('Sending webhook data:', webhookData);

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

            const response = await fetch(this.webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(webhookData),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`Webhook request failed: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Webhook response received:', data);
            return data;
        } catch (error) {
            if (error.name === 'AbortError') {
                throw new Error('Request timed out. Please try again.');
            }
            console.error('Webhook error:', error);
            throw error;
        }
    }

    showTypingIndicator() {
        this.isTyping = true;
        const chatMessages = document.getElementById('chat-messages');
        const typingElement = document.createElement('div');
        typingElement.className = 'typing-indicator';
        typingElement.id = 'typing-indicator';
        
        typingElement.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="typing-dots">
                <div class="dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;

        chatMessages.appendChild(typingElement);
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        this.isTyping = false;
        const typingElement = document.getElementById('typing-indicator');
        if (typingElement) {
            typingElement.remove();
        }
    }

    scrollToBottom() {
        const chatMessages = document.getElementById('chat-messages');
        setTimeout(() => {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 100);
    }

    async sendToWebhook(message) {
        try {
            const webhookData = {
                message: message,
                conversationId: this.conversationId,
                timestamp: new Date().toISOString(),
                source: 'website_chat',
                userAgent: navigator.userAgent,
                sessionData: {
                    url: window.location.href,
                    referrer: document.referrer
                }
            };

            const response = await fetch(this.webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(webhookData)
            });

            if (!response.ok) {
                throw new Error(`Webhook request failed: ${response.status}`);
            }

            const data = await response.json();
            console.log('Webhook response received:', data);
            return data;
        } catch (error) {
            console.error('Webhook error:', error);
            throw error;
        }
    }

    // Method to trigger bot from external functions
    openChatWithMessage(message) {
        const botPopup = document.getElementById('chatbot-popup');
        const chatInput = document.getElementById('chat-input');
        
        // Open the chat popup
        botPopup.classList.add('active');
        
        // Set the message in input field
        if (message) {
            chatInput.value = message;
            chatInput.focus();
        }
    }

    // Method to send predefined messages
    sendPredefinedMessage(intent, message) {
        this.openChatWithMessage(message);
        
        // Auto-send after a short delay
        setTimeout(() => {
            this.handleSendMessage();
        }, 500);
    }
}

// Initialize the Enhanced AI ChatBot when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // n8n webhook URL - Replace with your actual webhook URL
    const webhookUrl = 'https://krishkumar1001.app.n8n.cloud/webhook/21ec3775-fab6-4a83-afe6-a26a652adc4f';
    
    // Initialize the chatbot
    window.chatBot = new AIChatBot(webhookUrl);
    
    // Add Font Awesome for icons if not already included
    if (!document.querySelector('link[href*="font-awesome"]')) {
        const fontAwesome = document.createElement('link');
        fontAwesome.rel = 'stylesheet';
        fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
        fontAwesome.crossOrigin = 'anonymous';
        fontAwesome.referrerPolicy = 'no-referrer';
        document.head.appendChild(fontAwesome);
    }

    // Add meta viewport if not present for mobile responsiveness
    if (!document.querySelector('meta[name="viewport"]')) {
        const viewport = document.createElement('meta');
        viewport.name = 'viewport';
        viewport.content = 'width=device-width, initial-scale=1.0';
        document.head.appendChild(viewport);
    }

    console.log('🤖 Enhanced AI ChatBot initialized successfully');
    console.log('Features: Dark mode, Sound effects, File attachments, Smart suggestions, Message history');
});

// Export for global access
window.AIChatBot = AIChatBot;

// Enhanced global functions for integration with existing website
window.openDentalChatBot = function(message = '', autoSend = false) {
    if (window.chatBot) {
        window.chatBot.openChatWithMessage(message);
        if (autoSend && message) {
            setTimeout(() => {
                window.chatBot.handleSendMessage();
            }, 500);
        }
    }
};

window.bookAppointmentWithBot = function() {
    if (window.chatBot) {
        window.chatBot.sendPredefinedMessage('appointment', 
            'I would like to book an appointment with Dr. Sudha Singh. Please help me schedule a convenient time.');
    }
};

window.askAboutServices = function() {
    if (window.chatBot) {
        window.chatBot.sendPredefinedMessage('services', 
            'What dental services and treatments do you offer? I would like to know about your specialties.');
    }
};

window.askAboutEmergency = function() {
    if (window.chatBot) {
        window.chatBot.sendPredefinedMessage('emergency', 
            'I have a dental emergency. Can you help me with immediate care or urgent appointment?');
    }
};

window.askAboutLocation = function() {
    if (window.chatBot) {
        window.chatBot.sendPredefinedMessage('location', 
            'Where is your clinic located? Can you provide directions and parking information?');
    }
};

window.askAboutInsurance = function() {
    if (window.chatBot) {
        window.chatBot.sendPredefinedMessage('insurance', 
            'Do you accept dental insurance? What are your payment options and pricing?');
    }
};

// Advanced integration functions
window.chatBotAPI = {
    // Send custom message
    sendMessage: (message) => {
        if (window.chatBot) {
            window.chatBot.sendMessage(message);
        }
    },
    
    // Open chat with specific intent
    openWithIntent: (intent, message) => {
        if (window.chatBot) {
            window.chatBot.sendPredefinedMessage(intent, message);
        }
    },
    
    // Toggle chat visibility
    toggle: () => {
        if (window.chatBot) {
            const popup = document.getElementById('chatbot-popup');
            popup.classList.toggle('active');
        }
    },
    
    // Get conversation history
    getHistory: () => {
        return window.chatBot ? window.chatBot.messageHistory : [];
    },
    
    // Set theme
    setTheme: (theme) => {
        if (window.chatBot && ['light', 'dark'].includes(theme)) {
            window.chatBot.currentTheme = theme;
            document.documentElement.setAttribute('data-theme', theme);
        }
    },
    
    // Configure sound
    setSound: (enabled) => {
        if (window.chatBot) {
            window.chatBot.soundEnabled = !!enabled;
        }
    }
};

// Event listeners for enhanced integration
document.addEventListener('chatbot:ready', function() {
    console.log('🚀 ChatBot API ready for integration');
});

document.addEventListener('chatbot:message', function(event) {
    console.log('📬 New message:', event.detail);
});

document.addEventListener('chatbot:error', function(event) {
    console.error('❌ ChatBot error:', event.detail);
});

// Dispatch ready event
setTimeout(() => {
    document.dispatchEvent(new CustomEvent('chatbot:ready'));
}, 1000);

