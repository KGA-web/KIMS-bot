/**
 * KIMS AI Assistant (KAIA) - Premium Chat Widget
 * v2.0 - Production Ready
 */

(function() {
    // --- Configuration ---
    const API_URL = "https://kims-bot.vercel.app/api/chat"; 
    const SHEETS_URL = "https://script.google.com/macros/s/AKfycbzhWZXx8Yog5WrZn-gOxyCezbxpJkNVozTIUBU2K1Mu_wHQGjk32KJm0BVXh1jTfFTPwQ/exec";
    
    // --- State ---
    let isOpen = false;
    let chatHistory = [];
    let messageCount = 0;
    let leadCollected = false;

    // --- Styles ---
    const styles = `
        :root {
            --kims-red: #ab191e;
            --kims-navy: #002e5b;
            --glass-bg: rgba(255, 255, 255, 0.85);
            --bot-bubble: #f1f3f6;
            --user-bubble: #ab191e;
            --font-main: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        #kaia-widget-container {
            position: fixed;
            bottom: 30px;
            right: 30px;
            z-index: 999999;
            font-family: var(--font-main);
        }

        /* Floating Button */
        #kaia-fab {
            width: 65px;
            height: 65px;
            border-radius: 50%;
            background: var(--kims-red);
            box-shadow: 0 8px 32px rgba(171, 25, 30, 0.35);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            color: white;
            font-size: 28px;
            border: none;
        }

        #kaia-fab:hover {
            transform: scale(1.1) rotate(5deg);
            box-shadow: 0 12px 40px rgba(171, 25, 30, 0.45);
        }

        #kaia-fab .close-icon { display: none; }
        #kaia-fab.is-open .chat-icon { display: none; }
        #kaia-fab.is-open .close-icon { display: block; }

        /* Chat Window */
        #kaia-chat-window {
            position: absolute;
            bottom: 85px;
            right: 0;
            width: 400px;
            height: 600px;
            background: var(--glass-bg);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 24px;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            transform: translateY(20px) scale(0.9);
            opacity: 0;
            pointer-events: none;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        #kaia-chat-window.is-open {
            transform: translateY(0) scale(1);
            opacity: 1;
            pointer-events: all;
        }

        /* Header */
        .kaia-header {
            background: var(--kims-navy);
            padding: 20px;
            color: white;
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .kaia-header img {
            width: 45px;
            height: 45px;
            border-radius: 50%;
            background: white;
            padding: 3px;
        }

        .kaia-header h3 { margin: 0; font-size: 16px; font-weight: 600; }
        .kaia-status { font-size: 11px; opacity: 0.8; display: flex; align-items: center; gap: 4px; }
        .kaia-status::before { content: ''; width: 8px; height: 8px; background: #4ADE80; border-radius: 50%; display: inline-block; }

        /* Messages Area */
        #kaia-messages {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            display: flex;
            flex-direction: column;
            gap: 15px;
            scrollbar-width: thin;
        }

        .kaia-bubble {
            max-width: 85%;
            padding: 12px 16px;
            border-radius: 18px;
            font-size: 14px;
            line-height: 1.5;
            animation: bubbleSlide 0.3s ease-out;
        }

        @keyframes bubbleSlide {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .kaia-bot {
            background: var(--bot-bubble);
            color: #1a1a1a;
            align-self: flex-start;
            border-bottom-left-radius: 4px;
        }

        .kaia-user {
            background: var(--user-bubble);
            color: white;
            align-self: flex-end;
            border-bottom-right-radius: 4px;
        }

        /* Interactive Lead Form Bubble */
        .kaia-form-bubble {
            background: white;
            border: 2px solid var(--kims-red);
            border-radius: 20px;
            padding: 20px;
            width: 100%;
            box-sizing: border-box;
            box-shadow: 0 4px 15px rgba(0,0,0,0.05);
        }

        .kaia-form-bubble h4 { margin: 0 0 10px; color: var(--kims-navy); font-size: 15px; }
        .kaia-form-bubble input, .kaia-form-bubble select {
            width: 100%;
            padding: 10px;
            margin-bottom: 12px;
            border: 1px solid #ddd;
            border-radius: 8px;
            font-size: 13px;
        }

        .kaia-form-btn {
            width: 100%;
            background: var(--kims-red);
            color: white;
            border: none;
            padding: 12px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
        }

        /* Input Area */
        .kaia-input-area {
            padding: 15px;
            background: white;
            border-top: 1px solid #eee;
            display: flex;
            gap: 10px;
            align-items: center;
        }

        #kaia-input {
            flex: 1;
            border: none;
            background: #f5f5f5;
            padding: 12px 18px;
            border-radius: 25px;
            outline: none;
            font-size: 14px;
        }

        .kaia-send-btn {
            background: var(--kims-red);
            color: white;
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        /* Typing Indicator */
        .kaia-typing {
            font-size: 12px;
            color: #888;
            margin-left: 20px;
            margin-bottom: 10px;
            display: none;
        }

        /* Quick Chips */
        .kaia-chips {
            display: flex;
            gap: 6px;
            padding: 10px 16px;
            overflow-x: auto;
            background: #fafafa;
            border-bottom: 1px solid #eee;
            scrollbar-width: none;
        }
        .kaia-chips::-webkit-scrollbar { display: none; }
        .kaia-chip {
            background: white;
            border: 1px solid #dce1e7;
            border-radius: 20px;
            padding: 5px 13px;
            font-size: 12px;
            font-weight: 500;
            color: var(--kims-navy);
            cursor: pointer;
            white-space: nowrap;
            transition: all 0.2s;
        }
        .kaia-chip:hover {
            background: var(--kims-navy);
            color: white;
            border-color: var(--kims-navy);
        }

        /* FAB pulse ring */
        #kaia-fab::after {
            content: '';
            position: absolute;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background: var(--kims-red);
            animation: kaiaRing 2s infinite;
            z-index: -1;
        }
        @keyframes kaiaRing {
            0% { transform: scale(1); opacity: 0.6; }
            100% { transform: scale(1.6); opacity: 0; }
        }
        #kaia-fab.is-open::after { animation: none; }

        /* Mic button */
        .kaia-mic-btn {
            background: none;
            border: 1px solid #ddd;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            cursor: pointer;
            font-size: 16px;
            flex-shrink: 0;
            transition: all 0.2s;
        }
        .kaia-mic-btn:hover { border-color: var(--kims-red); }
        .kaia-mic-btn.recording { background: var(--kims-red); border-color: var(--kims-red); }

        @media (max-width: 480px) {
            #kaia-chat-window {
                width: calc(100vw - 40px);
                height: calc(100vh - 120px);
                bottom: 80px;
            }
        }
    `;

    // --- Initialization ---
    function init() {
        // Inject Styles
        const styleSheet = document.createElement("style");
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);

        // Inject HTML
        const container = document.createElement("div");
        container.id = "kaia-widget-container";
        container.innerHTML = `
            <div id="kaia-chat-window">
                <div class="kaia-header">
                    <img src="/assets/img/Ai.png" alt="KAIA">
                    <div>
                        <h3>KAIA — Koshys AI Assistant</h3>
                        <div class="kaia-status">Online &bull; Always here to help</div>
                    </div>
                </div>
                <div class="kaia-chips">
                    <button class="kaia-chip" onclick="kaiaChip('BVA Interior Design')">🏠 Interior Design</button>
                    <button class="kaia-chip" onclick="kaiaChip('B.Com Logistics')">🚛 Logistics</button>
                    <button class="kaia-chip" onclick="kaiaChip('Forensic Science')">🔬 Forensic Science</button>
                    <button class="kaia-chip" onclick="kaiaChip('MBA Admissions')">🎓 MBA</button>
                    <button class="kaia-chip" onclick="kaiaChip('Fee Structure')">💰 Fees</button>
                </div>
                <div id="kaia-messages"></div>
                <div id="kaia-typing-indicator" class="kaia-typing">KAIA is typing...</div>
                <div class="kaia-input-area">
                    <input type="text" id="kaia-input" placeholder="Ask about BBA, admissions..."/>
                    <button class="kaia-mic-btn" id="kaia-mic" title="Voice input">🎤</button>
                    <button class="kaia-send-btn" id="kaia-send">➔</button>
                </div>
            </div>
            <button id="kaia-fab">
                <span class="chat-icon">💬</span>
                <span class="close-icon">✕</span>
            </button>
        `;
        document.body.appendChild(container);

        // Event Listeners
        const fab = document.getElementById('kaia-fab');
        const sendBtn = document.getElementById('kaia-send');
        const micBtn = document.getElementById('kaia-mic');
        const input = document.getElementById('kaia-input');

        fab.onclick = toggleChat;
        sendBtn.onclick = handleSend;
        micBtn.onclick = handleVoice;
        input.onkeypress = (e) => { if (e.key === 'Enter') handleSend(); };

        appendMessage('bot', "Namaskara! 🙏 I'm KAIA, your Koshys AI assistant. Ask me about courses, admissions, fees, or campus life!");

        // Auto-popup after 3 seconds
        setTimeout(() => {
            if (!isOpen) toggleChat();
        }, 3000);
    }

    function toggleChat() {
        isOpen = !isOpen;
        const windowEl = document.getElementById('kaia-chat-window');
        const fabEl = document.getElementById('kaia-fab');
        if (isOpen) {
            windowEl.classList.add('is-open');
            fabEl.classList.add('is-open');
        } else {
            windowEl.classList.remove('is-open');
            fabEl.classList.remove('is-open');
        }
    }

    function appendMessage(role, content) {
        const area = document.getElementById('kaia-messages');
        const bubble = document.createElement('div');
        bubble.className = `kaia-bubble kaia-${role}`;
        bubble.innerHTML = content;
        area.appendChild(bubble);
        area.scrollTop = area.scrollHeight;
        
        if (role !== 'form') {
            chatHistory.push({ role: role === 'bot' ? 'assistant' : 'user', content: content });
        }
    }

    async function handleSend() {
        const input = document.getElementById('kaia-input');
        const text = input.value.trim();
        if (!text) return;

        input.value = '';
        appendMessage('user', text);
        messageCount++;

        showTyping(true);

        try {
            const res = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: chatHistory })
            });
            const data = await res.json();
            showTyping(false);
            appendMessage('bot', data.response);

            // Trigger lead form
            if (messageCount >= 2 && !leadCollected) {
                showLeadForm();
            }
        } catch (e) {
            showTyping(false);
            appendMessage('bot', "I'm having trouble connecting to my central brain. Please call our admission team directly at +91 81472 15707.");
        }
    }

    function showTyping(show) {
        document.getElementById('kaia-typing-indicator').style.display = show ? 'block' : 'none';
    }

    function showLeadForm() {
        const area = document.getElementById('kaia-messages');
        const formDiv = document.createElement('div');
        formDiv.className = 'kaia-form-bubble';
        formDiv.innerHTML = `
            <h4>📋 Register Interest 2026</h4>
            <div style="margin-bottom: 10px;">
                <label style="display:block; font-size:11px; font-weight:700; color:var(--kims-red); margin-bottom:4px;">YOUR NAME *</label>
                <input type="text" id="kaia-lf-name" placeholder="Full Name" required>
            </div>
            <div style="margin-bottom: 10px;">
                <label style="display:block; font-size:11px; font-weight:700; color:var(--kims-red); margin-bottom:4px;">YOU ARE A *</label>
                <select id="kaia-lf-type">
                    <option value="Student">Student</option>
                    <option value="Parent">Parent</option>
                    <option value="Other">Other</option>
                </select>
            </div>
            <div style="margin-bottom: 10px;">
                <label style="display:block; font-size:11px; font-weight:700; color:var(--kims-red); margin-bottom:4px;">MOBILE NUMBER *</label>
                <input type="tel" id="kaia-lf-phone" placeholder="Mobile Number" required>
            </div>
            <div style="margin-bottom: 15px;">
                <label style="display:block; font-size:11px; font-weight:700; color:var(--kims-red); margin-bottom:4px;">COURSE INTERESTED IN</label>
                <select id="kaia-lf-course">
                    <option value="BBA">BBA</option>
                    <option value="BCA">BCA</option>
                    <option value="B.Com">B.Com</option>
                    <option value="B.Com Logistics">B.Com Logistics</option>
                    <option value="BVA Interior Design">BVA Interior Design</option>
                    <option value="Forensic Science">Forensic Science</option>
                    <option value="MBA">MBA</option>
                    <option value="MCA">MCA</option>
                </select>
            </div>
            <div style="margin-bottom: 15px;">
                <label style="display:block; font-size:11px; font-weight:700; color:var(--kims-red); margin-bottom:4px;">ANY SPECIFIC QUESTION?</label>
                <textarea id="kaia-lf-inquiry" placeholder="Ask about fees, hostel, etc." style="width:100%; padding:10px; border:1px solid #ddd; border-radius:8px; font-size:13px; font-family:inherit; min-height:60px;"></textarea>
            </div>
            <button class="kaia-form-btn" onclick="submitLead(this)">Submit & Get Call Back</button>
        `;
        area.appendChild(formDiv);
        area.scrollTop = area.scrollHeight;
        leadCollected = true;
    }

    // Global function for form submission
    window.submitLead = async function(btn) {
        const name = document.getElementById('kaia-lf-name').value;
        const type = document.getElementById('kaia-lf-type').value;
        const phone = document.getElementById('kaia-lf-phone').value;
        const course = document.getElementById('kaia-lf-course').value;
        const inquiry = document.getElementById('kaia-lf-inquiry').value;

        if (!name || !phone) {
            alert("Please fill in your name and phone number.");
            return;
        }

        btn.disabled = true;
        btn.innerText = "Saving...";

        try {
            await fetch(SHEETS_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: name,
                    type: type,
                    phone: phone,
                    course: course,
                    inquiry: inquiry,
                    timestamp: new Date().toLocaleString(),
                    source: "KAIA AI Bot"
                })
            });
            btn.parentElement.innerHTML = "<h4>Thank You!</h4><p>A counselor will call you shortly.</p>";
        } catch (e) {
            alert("Submission failed. Please try again.");
            btn.disabled = false;
            btn.innerText = "Submit & Get Call Back";
        }
    };

    // Global chip handler
    window.kaiaChip = function(topic) {
        const input = document.getElementById('kaia-input');
        if (input) { input.value = topic; handleSend(); }
    };

    // Voice input
    function handleVoice() {
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SR) { alert('Voice input needs Chrome or Edge browser.'); return; }
        const rec = new SR();
        rec.lang = 'en-IN'; rec.interimResults = false;
        const micBtn = document.getElementById('kaia-mic');
        micBtn.classList.add('recording'); micBtn.textContent = '⏹';
        rec.start();
        rec.onresult = (e) => {
            document.getElementById('kaia-input').value = e.results[0][0].transcript;
            handleSend();
        };
        rec.onend = () => { micBtn.classList.remove('recording'); micBtn.textContent = '🎤'; };
        rec.onerror = () => { micBtn.classList.remove('recording'); micBtn.textContent = '🎤'; };
    }

    // Run init on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
