// Spiritual Guide Chat for Aura Sacra
// Powered by Google Gemini (Local On-Device or Cloud)
// Answers questions, doubts, and daily dilemmas with Gospel wisdom.
// Strictly unusable offline if local Gemini is not downloaded.
import { icons } from '../icons.js';
import { 
  sendMessageToJesus, 
  loadConversationHistory, 
  checkAiStatus, 
  downloadLocalGemini, 
  setGeminiApiKey,
  getSelectedGeminiModel,
  AVAILABLE_MODELS
} from '../ai-engine.js';
import { clearChatHistory, getSetting } from '../db.js';
import { renderApiKeyModal } from './api-key-modal.js';
import { t } from '../i18n.js';

// Format dialogue messages and shield Holy Scripture citations from browser translation
function formatChatMessage(text) {
  if (!text) return '';
  const lines = text.split('\n');
  return lines.map((line) => {
    const trimmed = line.trim();
    if (!trimmed) {
      return '<div class="h-2"></div>';
    }
    if (
      trimmed.includes('📖') ||
      trimmed.includes('Scripture Anchor') ||
      (trimmed.startsWith('•') && /\d+:\d+/.test(trimmed)) ||
      /^[1-3]?\s?[A-Za-z]+ \d+:\d+/.test(trimmed)
    ) {
      return `<div class="notranslate font-semibold text-amber-700 dark:text-amber-400 py-0.5 tracking-wide" translate="no">${line}</div>`;
    }
    // Parse markdown bold **text** and italic *text*
    const formatted = line
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>');
    return `<div class="leading-relaxed">${formatted}</div>`;
  }).join('');
}

export async function renderGuideChat(container, initialQuestion = null) {
  let messages = await loadConversationHistory();
  const userName = (await getSetting('user_name', '')) || 'Child of God';
  let aiStatus = await checkAiStatus();
  let isSubmitting = false;
  let downloadProgress = null;

  async function refreshStatus() {
    aiStatus = await checkAiStatus();
  }

  function openKeyModal() {
    const modalRoot = document.getElementById('modals-container') || document.body;
    renderApiKeyModal(
      modalRoot,
      async (newKey) => {
        await refreshStatus();
        renderView();
      },
      () => {
        modalRoot.innerHTML = '';
      }
    );
  }

  // Listen to browser online/offline events
  window.addEventListener('online', async () => {
    await refreshStatus();
    renderView();
  });
  window.addEventListener('offline', async () => {
    await refreshStatus();
    renderView();
  });

  function renderView() {
    const curModelId = getSelectedGeminiModel();
    const curModel = AVAILABLE_MODELS.find(m => m.id === curModelId) || AVAILABLE_MODELS[0];

    // Single unified API Key / Status button in the header (no duplicates!)
    let headerKeyButton = '';
    if (!aiStatus.isOnline) {
      if (aiStatus.localGeminiStatus === 'ready') {
        headerKeyButton = `
          <button type="button" id="btn-chat-api-key" class="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-sans font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/30 hover:bg-emerald-500/20 transition cursor-pointer flex-shrink-0" title="${t('jesus.geminiNanoOffline', 'Gemini Nano (Offline On-Device)')}">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>${t('jesus.nanoOffline', 'Offline Nano')}</span>
          </button>
        `;
      } else {
        headerKeyButton = `
          <button type="button" id="btn-chat-api-key" class="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-sans font-semibold bg-red-500/10 text-red-600 border border-red-500/30 hover:bg-red-500/20 transition cursor-pointer flex-shrink-0" title="${t('jesus.offlineRequired', 'Offline • Local Gemini Required')}">
            ${icons.lock('w-3.5 h-3.5')}
            <span>${t('jesus.offlineStatus', 'Offline')}</span>
          </button>
        `;
      }
    } else {
      if (aiStatus.localGeminiStatus === 'ready') {
        headerKeyButton = `
          <button type="button" id="btn-chat-api-key" class="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-sans font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/30 hover:bg-emerald-500/20 transition cursor-pointer flex-shrink-0">
            <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Gemini Nano</span>
          </button>
        `;
      } else if (aiStatus.hasApiKey) {
        headerKeyButton = `
          <button type="button" id="btn-chat-api-key" class="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-sans font-semibold bg-amber-500/10 text-amber-600 border border-amber-500/30 hover:bg-amber-500/20 transition cursor-pointer flex-shrink-0" title="${t('jesus.changeKey', 'Change Key')}">
            ${icons.sparkles('w-3.5 h-3.5')}
            <span class="hidden sm:inline">${curModel.name}</span>
            <span class="sm:hidden">${t('jesus.apiKeyShort', 'API Key')}</span>
          </button>
        `;
      } else {
        headerKeyButton = `
          <button type="button" id="btn-chat-api-key" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-sans font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-sm transition cursor-pointer flex-shrink-0 animate-pulse" title="${t('jesus.connectApiKey', 'Connect API Key')}">
            ${icons.key('w-3.5 h-3.5')}
            <span>${t('jesus.apiKey', 'Collega Chiave')}</span>
          </button>
        `;
      }
    }

    container.innerHTML = `
      <div class="bg-[var(--bg-card)] border border-stone-300 dark:border-stone-800 rounded-2xl shadow-lg flex flex-col h-[calc(100dvh-13.5rem)] sm:h-[78vh] min-h-[380px] overflow-hidden">
        
        <!-- Header (Clean, single-row, perfectly balanced) -->
        <div class="px-4 py-3 border-b border-stone-200 dark:border-stone-800 bg-[var(--bg-secondary)] flex items-center justify-between gap-3 flex-shrink-0">
          <div class="flex items-center gap-2.5 min-w-0 flex-1">
            <div class="w-9 h-9 rounded-full border border-amber-500/40 bg-[var(--bg-card)] flex items-center justify-center text-amber-500 shadow-sm flex-shrink-0">
              ${icons.cross('w-4 h-4')}
            </div>
            <div class="min-w-0 flex-1">
              <h2 class="text-sm sm:text-base font-bold font-display text-[var(--accent-vermilion)] truncate">
                ${t('jesus.title', 'DIALOGO CON LA GUIDA')}
              </h2>
              <p class="text-[11px] text-[var(--text-muted)] italic font-serif truncate">
                ${t('jesus.subtitle', 'Risponde a dubbi, domande e dilemmi con la sapienza del Vangelo')}
              </p>
            </div>
          </div>

          <!-- Header Right Actions: Single API Key Button + Reset Button -->
          <div class="flex items-center gap-1.5 flex-shrink-0">
            ${headerKeyButton}

            <button id="btn-clear-chat" class="p-1.5 rounded-xl border border-stone-300/40 dark:border-stone-700/40 hover:border-red-500/40 text-stone-400 hover:text-red-500 transition cursor-pointer flex-shrink-0" title="${t('jesus.reset', 'Reset')}">
              ${icons.trash('w-4 h-4')}
            </button>
          </div>
        </div>

        <!-- Chat Messages & Interactive Setup Scroll Area -->
        <div id="chat-messages-container" class="flex-1 overflow-y-auto p-3 sm:p-5 space-y-4">
          
          <!-- Offline Unusable Warning (Inside Scroll Area) -->
          ${!aiStatus.isOnline && aiStatus.localGeminiStatus !== 'ready' ? `
            <div class="p-4 rounded-2xl bg-red-500/10 border-2 border-red-500/40 text-red-800 dark:text-red-200 flex items-start gap-3 shadow-sm animate-fade-in">
              <div class="p-2 rounded-xl bg-red-500/20 text-red-600 flex-shrink-0">
                ${icons.lock('w-5 h-5')}
              </div>
              <div class="space-y-1 text-xs sm:text-sm">
                <div class="font-bold font-display text-sm sm:text-base text-red-600 dark:text-red-400">
                  ${t('jesus.offlineBannerTitle', 'Offline AI Disabled • Local Gemini Model Required')}
                </div>
                <p class="leading-relaxed">
                  ${t('jesus.offlineBannerBody', 'The local Gemini Nano model is not downloaded on this device. To answer open questions, theological doubts, and life dilemmas without internet, the local Gemini Nano model must be downloaded in Chrome.')}
                </p>
              </div>
            </div>
          ` : ''}

          <!-- Setup Card (Inside Scroll Area so it never pushes the input off-screen!) -->
          ${aiStatus.isOnline && !aiStatus.canChat ? `
            <div class="p-4 rounded-2xl bg-[var(--bg-secondary)] border-2 border-amber-600/40 shadow-sm space-y-3 animate-fade-in max-w-lg mx-auto">
              <div class="flex items-start gap-3">
                <div class="p-2 rounded-xl bg-amber-500/20 text-amber-600 flex-shrink-0">
                  ${icons.sparkles('w-5 h-5')}
                </div>
                <div class="space-y-0.5 flex-1">
                  <div class="font-bold font-display text-sm sm:text-base text-[var(--accent-vermilion)]">
                    ${t('jesus.enableGeminiTitle', 'Attiva Gemini AI per Domande e Dubbi')}
                  </div>
                  <p class="text-xs text-[var(--text-muted)] leading-relaxed">
                    ${t('jesus.enableGeminiDesc', 'Per fornire risposte profonde e guidate alla luce del Vangelo, Aura Sacra si collega a Google Gemini.')}
                  </p>
                </div>
              </div>

              ${aiStatus.localGeminiStatus === 'needs_download' ? `
                <div class="bg-[var(--bg-card)] border border-amber-600/30 rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div class="text-xs">
                    <div class="font-bold text-[var(--text-primary)]">${t('jesus.chromeNanoDetected', 'Rilevato Gemini Nano Integrato in Chrome')}</div>
                    <div class="text-[var(--text-muted)]">${t('jesus.chromeNanoDesc', 'Scarica il modello (~1.5 GB) per il ragionamento 100% offline.')}</div>
                  </div>
                  <button id="btn-download-gemini" class="w-full sm:w-auto px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 transition">
                    ${icons.download('w-4 h-4')}
                    <span>${t('jesus.downloadLocal', 'Scarica Gemini Locale')}</span>
                  </button>
                </div>
              ` : ''}

              ${downloadProgress !== null ? `
                <div class="bg-[var(--bg-card)] border border-amber-600/40 rounded-xl p-3 space-y-1.5">
                  <div class="flex items-center justify-between text-xs font-semibold text-amber-600">
                    <span>${t('jesus.downloading', 'Download in corso...')}</span>
                    <span>${downloadProgress}%</span>
                  </div>
                  <div class="w-full bg-stone-200 dark:bg-stone-700 rounded-full h-2 overflow-hidden">
                    <div class="bg-amber-600 h-2 rounded-full transition-all duration-300" style="width: ${downloadProgress}%"></div>
                  </div>
                </div>
              ` : ''}

              <!-- Connect API Key Button -->
              <div class="bg-[var(--bg-card)] border border-stone-300 dark:border-stone-700 rounded-xl p-3 space-y-2">
                <div class="flex items-center justify-between text-xs">
                  <span class="font-bold text-[var(--text-primary)]">${t('jesus.connectKeyPrompt', 'Collega Chiave API Google Gemini:')}</span>
                  <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" class="text-amber-600 hover:underline flex items-center gap-0.5">
                    ${t('jesus.getFreeKey', 'Ottieni Chiave Gratuita ↗')}
                  </a>
                </div>
                <button 
                  type="button" 
                  id="btn-open-key-modal-banner" 
                  class="w-full py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  ${icons.key('w-4 h-4')}
                  <span>${t('jesus.configureKeyBtn', 'Inserisci e Verifica Chiave API')}</span>
                </button>
              </div>

            </div>
          ` : ''}

          <!-- Empty State with Question Chips when chat is ready -->
          ${messages.length === 0 && aiStatus.canChat ? `
            <div class="text-center py-4 px-3 max-w-lg mx-auto space-y-3">
              <div class="w-11 h-11 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto">
                ${icons.sparkles('w-5 h-5')}
              </div>
              <h3 class="text-sm sm:text-base font-bold font-display text-[var(--accent-vermilion)]">
                ${t('jesus.welcomeTitle', 'Poni Domande, Chiarisci Dubbi e Ricevi Sapienza')}
              </h3>
              <p class="text-xs text-[var(--text-muted)] leading-relaxed font-serif italic">
                ${t('jesus.welcomeDesc', 'Approfondisci questioni teologiche, dubbi personali o dilemmi morali con la Guida Spirituale e citazioni bibliche.')}
              </p>

              <!-- Chips -->
              <div class="flex flex-wrap justify-center gap-1.5 pt-2">
                <button type="button" class="chat-prompt-chip text-xs bg-[var(--bg-secondary)] hover:bg-amber-600/20 text-[var(--text-secondary)] hover:text-amber-600 border border-stone-300 dark:border-stone-700 px-3 py-1.5 rounded-full transition cursor-pointer text-left">
                  ${t('jesus.prompt1', 'Perché Dio permette la sofferenza nel mondo?')}
                </button>
                <button type="button" class="chat-prompt-chip text-xs bg-[var(--bg-secondary)] hover:bg-amber-600/20 text-[var(--text-secondary)] hover:text-amber-600 border border-stone-300 dark:border-stone-700 px-3 py-1.5 rounded-full transition cursor-pointer text-left">
                  ${t('jesus.prompt2', 'Come discernere la volontà di Dio nelle mie scelte?')}
                </button>
                <button type="button" class="chat-prompt-chip text-xs bg-[var(--bg-secondary)] hover:bg-amber-600/20 text-[var(--text-secondary)] hover:text-amber-600 border border-stone-300 dark:border-stone-700 px-3 py-1.5 rounded-full transition cursor-pointer text-left">
                  ${t("jesus.prompt4", "Come trovare pace interiore e superare l'ansia?")}
                </button>
                <button type="button" class="chat-prompt-chip text-xs bg-[var(--bg-secondary)] hover:bg-amber-600/20 text-[var(--text-secondary)] hover:text-amber-600 border border-stone-300 dark:border-stone-700 px-3 py-1.5 rounded-full transition cursor-pointer text-left">
                  ${t('jesus.prompt6', 'Come pregare quando Dio sembra in silenzio?')}
                </button>
              </div>
            </div>
          ` : ''}

          <!-- Messages List -->
          ${messages.map((m) => {
            const isUser = m.sender === 'user';
            const isErrorMessage = !isUser && (
              m.text.includes('Google Gemini Error') || 
              m.text.includes('API key') || 
              m.text.includes('GEMINI_SETUP_REQUIRED') ||
              m.text.includes('OFFLINE_GEMINI_REQUIRED') ||
              m.text.includes('404') ||
              m.text.includes('400')
            );
            return `
              <div class="flex flex-col ${isUser ? 'items-end' : 'items-start'} animate-fade-in">
                <div class="max-w-[88%] sm:max-w-[78%] rounded-2xl p-3 sm:p-4 shadow-sm text-sm sm:text-base leading-relaxed ${
                  isUser 
                    ? 'bg-amber-700 text-white rounded-tr-none' 
                    : isErrorMessage
                      ? 'bg-red-500/10 border-2 border-red-500/30 text-red-900 dark:text-red-200 rounded-tl-none font-sans'
                      : 'bg-[var(--bg-secondary)] border border-stone-300 dark:border-stone-800 text-[var(--text-primary)] rounded-tl-none font-serif'
                }">
                  <div class="space-y-1">${formatChatMessage(m.text)}</div>
                  ${isErrorMessage ? `
                    <div class="pt-3 border-t border-red-500/20 mt-3 flex items-center gap-2">
                      <button type="button" class="btn-bubble-change-key text-xs font-semibold px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white shadow-sm flex items-center gap-1.5 transition cursor-pointer">
                        ${icons.key('w-3.5 h-3.5')}
                        <span>${t('jesus.changeKey', 'Verifica Chiave API')}</span>
                      </button>
                    </div>
                  ` : ''}
                </div>
                <span class="text-[10px] text-stone-400 mt-1 px-1 font-sans">
                  ${isUser ? (userName || t('jesus.you', 'Tu')) : t('jesus.guide', 'Guida Spirituale')} • ${new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            `;
          }).join('')}

          ${isSubmitting ? `
            <div class="flex flex-col items-start animate-fade-in">
              <div class="bg-[var(--bg-secondary)] border border-stone-300 dark:border-stone-800 text-[var(--text-primary)] rounded-2xl rounded-tl-none p-3 font-serif text-sm flex items-center gap-2.5">
                <span class="w-2 h-2 rounded-full bg-amber-600 animate-ping"></span>
                <span class="italic text-[var(--text-muted)]">${t('jesus.reflecting', 'La Guida Spirituale sta riflettendo sulla tua domanda...')}</span>
              </div>
            </div>
          ` : ''}
        </div>

        <!-- Chat Input Form Footer (ALWAYS LOCKED VISIBLE at bottom with flex-shrink-0!) -->
        <div id="chat-form-container" class="p-2.5 sm:p-3.5 border-t border-stone-200 dark:border-stone-800 bg-[var(--bg-secondary)] flex-shrink-0">
          <form id="chat-form" class="flex items-end gap-2">
            <div class="flex-1 bg-[var(--bg-card)] border border-stone-300 dark:border-stone-700 rounded-2xl px-3 py-2 focus-within:border-amber-600 transition shadow-inner">
              <textarea 
                id="chat-input" 
                rows="1"
                placeholder="${
                  !aiStatus.canChat
                    ? (!aiStatus.isOnline 
                        ? t('jesus.offlineInputDisabled', 'Offline: modello locale non scaricato...') 
                        : t('jesus.connectInputPrompt', 'Collega la Chiave API sopra per iniziare a scrivere...'))
                    : t('jesus.inputPlaceholder', 'Fai una domanda o esponi un dubbio alla Guida...')
                }"
                class="w-full bg-transparent text-sm sm:text-base text-[var(--text-primary)] placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:outline-none resize-none leading-relaxed max-h-32 overflow-y-auto custom-scrollbar cursor-text"
                autocomplete="off"
                autocapitalize="sentences"
                enterkeyhint="send"
                spellcheck="true"
              ></textarea>
            </div>
            <button 
              type="submit" 
              id="chat-submit-btn"
              class="h-[40px] px-3.5 sm:px-4 rounded-xl bg-[var(--accent-vermilion)] hover:bg-red-800 text-white font-medium shadow-md transition transform active:scale-95 flex items-center justify-center gap-1.5 flex-shrink-0 cursor-pointer"
              title="${t('jesus.ask', 'Invia')}"
            >
              ${icons.send('w-4 h-4')}
              <span class="hidden sm:inline text-xs font-sans uppercase tracking-wider font-bold">${t('jesus.ask', 'Invia')}</span>
            </button>
          </form>
        </div>

      </div>
    `;

    // Auto-scroll to bottom
    const scrollArea = container.querySelector('#chat-messages-container');
    if (scrollArea) {
      scrollArea.scrollTop = scrollArea.scrollHeight;
    }

    // Handlers
    const form = container.querySelector('#chat-form');
    const input = container.querySelector('#chat-input');

    // Auto-resizing textarea & desktop Enter-to-send
    if (input) {
      input.addEventListener('focus', () => {
        // Smooth scroll message container when virtual keyboard pops up on mobile
        setTimeout(() => {
          if (scrollArea) {
            scrollArea.scrollTop = scrollArea.scrollHeight;
          }
        }, 280);
      });

      input.addEventListener('input', () => {
        input.style.height = 'auto';
        input.style.height = Math.min(input.scrollHeight, 140) + 'px';
      });

      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          // On screens >= 640px (desktop/laptop/tablet), Enter sends, Shift+Enter adds newline
          if (window.innerWidth >= 640) {
            e.preventDefault();
            form.dispatchEvent(new Event('submit', { cancelable: true }));
          }
          // On mobile phones, Enter naturally adds a newline so users can write full paragraphs!
        }
      });
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const text = input ? input.value.trim() : '';
      if (!text || isSubmitting) return;

      if (!aiStatus.canChat) {
        if (!aiStatus.isOnline) {
          alert(t('jesus.offlineBannerBody', 'Offline AI is disabled because the local Gemini model is not downloaded on this device. Please connect to the internet to download Gemini Nano or use online Gemini.'));
        } else {
          openKeyModal();
        }
        return;
      }

      // Optimistically push the user message so they see their COMPLETE message immediately
      const optimisticUserMsg = {
        sender: 'user',
        text: text,
        timestamp: Date.now()
      };
      messages.push(optimisticUserMsg);

      if (input) {
        input.value = '';
        input.style.height = 'auto';
      }
      isSubmitting = true;
      renderView();

      try {
        await sendMessageToJesus(text, userName);
        messages = await loadConversationHistory();
      } catch (err) {
        // Restore user text in input box so they never lose what they wrote
        if (input) {
          input.value = text;
          input.style.height = 'auto';
          input.style.height = Math.min(input.scrollHeight, 140) + 'px';
        }
        // Remove optimistic message on failure
        const optIdx = messages.indexOf(optimisticUserMsg);
        if (optIdx !== -1) messages.splice(optIdx, 1);

        alert(err.message || t('jesus.errorCommunicating', 'Error communicating with Gemini AI.'));
        if (err.message && (err.message.includes('Google Gemini Error') || err.message.includes('API key') || err.message.includes('GEMINI_SETUP_REQUIRED') || err.message.includes('404') || err.message.includes('400'))) {
          openKeyModal();
        }
      } finally {
        isSubmitting = false;
        renderView();
      }
    });

    // Quick chips handler
    container.querySelectorAll('.chat-prompt-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const text = chip.textContent.trim();
        if (!text) return;
        input.value = text;
        form.dispatchEvent(new Event('submit'));
      });
    });

    // API Key Modal open triggers
    container.querySelectorAll('.btn-open-api-modal, .btn-bubble-change-key, #btn-chat-api-key, #btn-open-key-modal-banner').forEach(btn => {
      btn.addEventListener('click', openKeyModal);
    });

    // Clear history handler
    container.querySelector('#btn-clear-chat').addEventListener('click', async () => {
      if (confirm(t('jesus.confirmClear', 'Clear the entire conversation history with Jesus?'))) {
        await clearChatHistory();
        messages = [];
        renderView();
      }
    });

    // Download Local Gemini button (if present)
    const downloadBtn = container.querySelector('#btn-download-gemini');
    if (downloadBtn) {
      downloadBtn.addEventListener('click', async () => {
        downloadBtn.disabled = true;
        downloadProgress = 0;
        renderView();
        try {
          await downloadLocalGemini((pct) => {
            downloadProgress = pct;
            renderView();
          });
          alert(t('jesus.downloadSuccess', 'Gemini Nano downloaded successfully! Offline dialogue is now active.'));
          downloadProgress = null;
          await refreshStatus();
          renderView();
        } catch (err) {
          alert(`${t('jesus.downloadFailed', 'Download failed')}: ${err.message}`);
          downloadProgress = null;
          renderView();
        }
      });
    }

    // Save Quick API key button (if present)
    const saveKeyBtn = container.querySelector('#btn-save-quick-api-key');
    if (saveKeyBtn) {
      saveKeyBtn.addEventListener('click', async () => {
        const keyInput = container.querySelector('#chat-quick-api-key');
        const key = keyInput.value.trim();
        if (!key || key.length < 10) {
          alert(t('apiKeyModal.pasteBeforeSaving', 'Please enter a valid Google Gemini API Key.'));
          return;
        }
        await setGeminiApiKey(key);
        alert(t('apiKeyModal.verifiedSuccess', 'Gemini API Key connected successfully!'));
        await refreshStatus();
        renderView();
      });
    }
  }

  renderView();

  // If passed an initial question/thought, auto-submit if AI is ready
  if (initialQuestion && aiStatus.canChat) {
    setTimeout(async () => {
      isSubmitting = true;
      renderView();
      try {
        await sendMessageToJesus(initialQuestion, userName);
        messages = await loadConversationHistory();
      } catch (err) {
        console.warn('Initial prompt error:', err);
      } finally {
        isSubmitting = false;
        renderView();
      }
    }, 400);
  }
}
