/**
 * voicebot.js — Smriti AI Heritage Voice Bot
 * Powered by Google Gemini AI & Native Web Speech API
 * Supports real-time spoken voice interactions in Hindi & English
 */

(function () {
  'use strict';

  let isVoiceBotOpen = false;
  let isListening = false;
  let isAudioMuted = false;
  let chatHistory = [];
  let recognition = null;
  let activeUtterance = null;

  // Initialize Speech Recognition
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition || null;

  function initVoiceBot() {
    createVoiceBotElements();
    setupRecognition();
  }

  function setupRecognition() {
    if (!SpeechRecognition) {
      console.warn('[Smriti AI Voice Bot] Web Speech Recognition not supported on this browser.');
      return;
    }

    try {
      recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'hi-IN'; // Default Hindi, auto-switches if needed

      recognition.onstart = () => {
        isListening = true;
        updateMicUi(true);
      };

      recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        const inputEl = document.getElementById('voiceBotInput');
        if (inputEl) {
          inputEl.value = finalTranscript || interimTranscript;
        }

        if (finalTranscript && finalTranscript.trim().length > 1) {
          sendVoiceBotMessage(finalTranscript.trim());
        }
      };

      recognition.onerror = (event) => {
        console.warn('[Smriti AI] Speech recognition error:', event.error);
        isListening = false;
        updateMicUi(false);
      };

      recognition.onend = () => {
        isListening = false;
        updateMicUi(false);
      };
    } catch (err) {
      console.warn('[Smriti AI] Recognition setup error:', err);
    }
  }

  function toggleSpeechRecognition() {
    if (!recognition) {
      alert('Voice input is not supported in this browser. Please type your question in the text box.');
      return;
    }

    if (isListening) {
      recognition.stop();
    } else {
      stopSpeaking();
      try {
        recognition.start();
      } catch (e) {
        console.warn('Speech recognition start failed:', e);
      }
    }
  }

  function updateMicUi(listening) {
    const micBtn = document.getElementById('voiceBotMicBtn');
    const statusText = document.getElementById('voiceBotStatusText');
    if (!micBtn) return;

    if (listening) {
      micBtn.classList.add('voicebot-mic--active');
      if (statusText) statusText.innerText = 'Listening... Speak in Hindi or English (सुन रहा हूँ...)';
    } else {
      micBtn.classList.remove('voicebot-mic--active');
      if (statusText) statusText.innerText = 'Tap mic to speak, or type below';
    }
  }

  function speakText(text, lang = 'hi-IN') {
    if (isAudioMuted || !('speechSynthesis' in window)) return;

    stopSpeaking();

    const utterance = new SpeechSynthesisUtterance(text);
    activeUtterance = utterance;

    // Detect if text contains Devanagari script
    const isHindi = /[\u0900-\u097F]/.test(text);
    utterance.lang = isHindi ? 'hi-IN' : 'en-IN';
    utterance.rate = isHindi ? 0.95 : 1.0;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      const preferred = voices.find(v => (isHindi ? v.lang.includes('hi') : v.lang.includes('en-IN') || v.lang.includes('en')));
      if (preferred) utterance.voice = preferred;
    }

    utterance.onend = () => {
      activeUtterance = null;
      updateSpeakerState(false);
    };

    updateSpeakerState(true);
    window.speechSynthesis.speak(utterance);
  }

  function stopSpeaking() {
    if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      activeUtterance = null;
      updateSpeakerState(false);
    }
  }

  function updateSpeakerState(speaking) {
    const speakerIcon = document.getElementById('voiceBotSpeakerIcon');
    if (speakerIcon) {
      speakerIcon.style.opacity = speaking ? '1' : '0.6';
    }
  }

  function toggleMute() {
    isAudioMuted = !isAudioMuted;
    if (isAudioMuted) {
      stopSpeaking();
    }
    const muteBtn = document.getElementById('voiceBotMuteBtn');
    if (muteBtn) {
      muteBtn.innerHTML = isAudioMuted ? '🔇' : '🔊';
      muteBtn.title = isAudioMuted ? 'Unmute Audio' : 'Mute Audio';
    }
  }

  function createVoiceBotElements() {
    // 1. Floating Launch Pill / Button
    const trigger = document.createElement('button');
    trigger.id = 'voiceBotTriggerBtn';
    trigger.className = 'voicebot-trigger';
    trigger.setAttribute('aria-label', 'Open Smriti AI Heritage Voice Bot');
    trigger.innerHTML = `
      <div class="voicebot-trigger__glow"></div>
      <span class="voicebot-trigger__icon">🎙️</span>
      <span class="voicebot-trigger__label">AI Voice Bot</span>
      <span class="voicebot-trigger__gemini-badge">Gemini</span>
    `;
    trigger.addEventListener('click', toggleVoiceBotModal);
    document.body.appendChild(trigger);

    // 2. Main Modal / Popup Panel
    const modal = document.createElement('div');
    modal.id = 'voiceBotModal';
    modal.className = 'voicebot-modal';
    modal.innerHTML = `
      <div class="voicebot-modal__backdrop" id="voiceBotBackdrop"></div>
      <div class="voicebot-modal__card">
        
        <!-- Header -->
        <div class="voicebot-header">
          <div class="voicebot-header__info">
            <div class="voicebot-avatar">🏛️</div>
            <div>
              <div class="flex items-center gap-1.5">
                <h3 class="voicebot-title">Smriti AI Guide</h3>
                <span class="voicebot-badge">Gemini 3.5</span>
              </div>
              <p class="voicebot-subtitle" id="voiceBotStatusText">Tap mic to speak, or type below</p>
            </div>
          </div>
          <div class="voicebot-header__actions">
            <button class="voicebot-icon-btn" id="voiceBotMuteBtn" title="Mute/Unmute Audio">🔊</button>
            <button class="voicebot-icon-btn" id="voiceBotCloseBtn" title="Close Voice Bot">&times;</button>
          </div>
        </div>

        <!-- Messages Area -->
        <div class="voicebot-body" id="voiceBotMessages">
          <div class="voicebot-msg voicebot-msg--bot">
            <div class="voicebot-msg__avatar">🏛️</div>
            <div class="voicebot-msg__bubble">
              <p>नमस्ते! I am <strong>Smriti</strong>, your AI Heritage & Craft Assistant in Agra.</p>
              <p class="text-xs mt-1 text-slate-500">Ask me anything about Agra marble inlay, our <strong>70:30 Fair Trade Model</strong>, master artisans, or doorstep shipping!</p>
            </div>
          </div>
        </div>

        <!-- Quick Question Chips -->
        <div class="voicebot-chips" id="voiceBotChips">
          <button class="voicebot-chip" onclick="window.sendVoiceBotChip('How does the 70:30 Fair Trade model work?')">💰 70:30 Fair Trade Model</button>
          <button class="voicebot-chip" onclick="window.sendVoiceBotChip('Tell me about Taj Mahal Marble Inlay (Parchin Kari)')">💎 Marble Inlay Craft</button>
          <button class="voicebot-chip" onclick="window.sendVoiceBotChip('Who is Master Artisan Ustad Rashid Khan?')">👨🏽‍🎨 Ustad Rashid Khan</button>
          <button class="voicebot-chip" onclick="window.sendVoiceBotChip('How does insured doorstep shipping work?')">📦 Doorstep Shipping</button>
          <button class="voicebot-chip" onclick="window.sendVoiceBotChip('मुझे आगरा के हस्तशिल्प के बारे में हिंदी में बताएं')">🇮🇳 हिंदी में जानकारी</button>
        </div>

        <!-- Input Bar -->
        <div class="voicebot-footer">
          <button class="voicebot-mic-btn" id="voiceBotMicBtn" title="Click and speak in Hindi or English">
            <span class="mic-wave"></span>
            🎤
          </button>
          <input type="text" id="voiceBotInput" class="voicebot-input" placeholder="Type or speak a question..." autocomplete="off">
          <button class="voicebot-send-btn" id="voiceBotSendBtn" title="Send message">
            ➤
          </button>
        </div>

      </div>
    `;

    document.body.appendChild(modal);

    // Event Listeners
    document.getElementById('voiceBotCloseBtn').addEventListener('click', toggleVoiceBotModal);
    document.getElementById('voiceBotBackdrop').addEventListener('click', toggleVoiceBotModal);
    document.getElementById('voiceBotMuteBtn').addEventListener('click', toggleMute);
    document.getElementById('voiceBotMicBtn').addEventListener('click', toggleSpeechRecognition);

    const input = document.getElementById('voiceBotInput');
    const sendBtn = document.getElementById('voiceBotSendBtn');

    sendBtn.addEventListener('click', () => {
      if (input.value.trim()) {
        sendVoiceBotMessage(input.value.trim());
      }
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && input.value.trim()) {
        sendVoiceBotMessage(input.value.trim());
      }
    });
  }

  function toggleVoiceBotModal() {
    isVoiceBotOpen = !isVoiceBotOpen;
    const modal = document.getElementById('voiceBotModal');
    if (!modal) return;

    if (isVoiceBotOpen) {
      modal.classList.add('voicebot-modal--open');
      const input = document.getElementById('voiceBotInput');
      if (input) setTimeout(() => input.focus(), 250);
    } else {
      modal.classList.remove('voicebot-modal--open');
      stopSpeaking();
      if (isListening && recognition) recognition.stop();
    }
  }

  async function sendVoiceBotMessage(userText) {
    if (!userText) return;

    const input = document.getElementById('voiceBotInput');
    if (input) input.value = '';

    stopSpeaking();
    if (isListening && recognition) recognition.stop();

    // Append User Message to UI
    appendMessage(userText, 'user');
    chatHistory.push({ sender: 'user', text: userText });

    // Show Typing Indicator
    const typingId = appendTypingIndicator();

    try {
      // 1. Query the Intelligent GI Voice Search Engine
      const response = await fetch('/api/ai/voice-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: userText,
          language: 'auto'
        })
      });

      removeTypingIndicator(typingId);

      if (response.ok) {
        const data = await response.json();
        if (data && data.success) {
          const botReply = data.spokenAnswer || "Matching craft information retrieved.";
          chatHistory.push({ sender: 'bot', text: botReply });
          appendVoiceBotResult(botReply, data.data || [], data.detectedLanguage || 'hi-IN');
          speakText(botReply, data.detectedLanguage || 'hi-IN');
          return;
        }
      }

      // 2. Fallback to conversational chat if query is outside GI database
      const chatRes = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          history: chatHistory.slice(-4),
        })
      });

      if (!chatRes.ok) throw new Error(`Server returned ${chatRes.status}`);

      const chatData = await chatRes.json();
      const botReply = chatData.reply || "I am glad to help you explore India's master heritage crafts!";

      chatHistory.push({ sender: 'bot', text: botReply });
      appendMessage(botReply, 'bot', chatData.detectedLang || 'hi-IN');
      speakText(botReply, chatData.detectedLang || 'hi-IN');

    } catch (err) {
      removeTypingIndicator(typingId);
      console.error('[Smriti Voice Bot Error]', err);
      const fallbackMsg = "नमस्ते! स्मृति पास पर आपका स्वागत है। आप कश्मीर और उत्तर प्रदेश के 102 पंजीकृत हस्तशिल्पों के बारे में पूछ सकते हैं।";
      appendMessage(fallbackMsg, 'bot', 'hi-IN');
      speakText(fallbackMsg, 'hi-IN');
    }
  }

  function appendVoiceBotResult(spokenText, items, lang = 'hi-IN') {
    const container = document.getElementById('voiceBotMessages');
    if (!container) return;

    const msg = document.createElement('div');
    msg.className = 'voicebot-msg voicebot-msg--bot';

    let cardsHtml = '';
    if (items && items.length > 0) {
      cardsHtml = `
        <div class="voicebot-result-cards">
          ${items.slice(0, 4).map(item => `
            <div class="voicebot-mini-card">
              <div class="voicebot-mini-card__top">
                <span class="mini-badge">✓ GI</span>
                <span class="mini-cat">${item.category}</span>
                <span class="mini-state">${item.state}</span>
              </div>
              <strong class="mini-title">${item.name}</strong>
              ${item.hindiName ? `<p class="mini-hindi">${item.hindiName}</p>` : ''}
              <div class="mini-meta">Reg: <strong>${item.registrationDate}</strong></div>
              ${item.linkedMarketplaceProduct ? `
                <div class="mini-linked">
                  <span>✨ Authentic Artisan Listing Available</span>
                </div>
              ` : ''}
              <button class="mini-listen-btn" onclick="window.speakAgain('${encodeURIComponent(`This is ${item.name}, a registered ${item.category} from ${item.state}. Registration date is ${item.registrationDate}.`)}', '${lang}')">
                🔊 Listen
              </button>
            </div>
          `).join('')}
        </div>
      `;
    }

    msg.innerHTML = `
      <div class="voicebot-msg__avatar">🏛️</div>
      <div class="voicebot-msg__bubble">
        <p>${escapeHtml(spokenText)}</p>
        ${cardsHtml}
        <div class="voicebot-msg__meta">
          <button class="voicebot-listen-btn" onclick="window.speakAgain('${encodeURIComponent(spokenText)}', '${lang}')">
            🔊 Replay
          </button>
          <button class="voicebot-listen-btn" onclick="window.stopSpeakingUtterance()">
            ⏹ Stop
          </button>
        </div>
      </div>
    `;

    container.appendChild(msg);
    container.scrollTop = container.scrollHeight;
  }

  function appendMessage(text, sender, lang = 'en-IN') {
    const container = document.getElementById('voiceBotMessages');
    if (!container) return;

    const msg = document.createElement('div');
    msg.className = `voicebot-msg voicebot-msg--${sender}`;

    if (sender === 'bot') {
      msg.innerHTML = `
        <div class="voicebot-msg__avatar">🏛️</div>
        <div class="voicebot-msg__bubble">
          <p>${escapeHtml(text)}</p>
          <div class="voicebot-msg__meta">
            <button class="voicebot-listen-btn" onclick="window.speakAgain('${encodeURIComponent(text)}', '${lang}')">
              🔊 Listen
            </button>
            <button class="voicebot-listen-btn" onclick="window.stopSpeakingUtterance()">
              ⏹ Stop
            </button>
          </div>
        </div>
      `;
    } else {
      msg.innerHTML = `
        <div class="voicebot-msg__bubble voicebot-msg__bubble--user">
          <p>${escapeHtml(text)}</p>
        </div>
      `;
    }

    container.appendChild(msg);
    container.scrollTop = container.scrollHeight;
  }

  function appendTypingIndicator() {
    const container = document.getElementById('voiceBotMessages');
    if (!container) return null;

    const typing = document.createElement('div');
    const id = 'typing_' + Date.now();
    typing.id = id;
    typing.className = 'voicebot-msg voicebot-msg--bot';
    typing.innerHTML = `
      <div class="voicebot-msg__avatar">🏛️</div>
      <div class="voicebot-msg__bubble voicebot-typing">
        <span></span><span></span><span></span>
      </div>
    `;
    container.appendChild(typing);
    container.scrollTop = container.scrollHeight;
    return id;
  }

  function removeTypingIndicator(id) {
    if (!id) return;
    const el = document.getElementById(id);
    if (el) el.remove();
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Global window helpers for inline HTML callbacks
  window.sendVoiceBotChip = function (chipText) {
    sendVoiceBotMessage(chipText);
  };

  window.speakAgain = function (encodedText, lang) {
    try {
      const decoded = decodeURIComponent(encodedText);
      speakText(decoded, lang);
    } catch (e) {
      console.warn('Speech playback failed:', e);
    }
  };

  window.stopSpeakingUtterance = function () {
    stopSpeaking();
  };

  window.toggleSmritiVoiceBot = toggleVoiceBotModal;

  // Initialize once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initVoiceBot);
  } else {
    initVoiceBot();
  }
})();
