// Floating Monastic Audio-Bibbia Player Component for Aura Sacra
// Coordinates play/pause/prev/next, reading progress, live verse highlighting,
// and dedicated 9-language liturgical voice selection with live preview.

import { icons } from '../icons.js';
import { t } from '../i18n.js';
import {
  subscribeSpeechState,
  togglePlayPause,
  stop,
  nextVerse,
  prevVerse,
  setSpeechRate,
  getSpeechRate,
  SPEECH_RATES,
  getAvailableVoicesForLang,
  setSpeechVoiceURI,
  getSpeechVoiceURI,
  getFriendlyVoiceName,
  SUPPORTED_LANGUAGE_VOICES,
  getVoiceForLanguage,
  getLangCode,
  playVoicePreview,
  stopVoicePreview
} from '../speech-engine.js';

let containerEl = null;
let lastHighlightedVerse = null;

export function renderAudioPlayer(container) {
  containerEl = container;
  if (!containerEl) return;

  subscribeSpeechState((state) => {
    updatePlayerUI(state);
    syncVerseHighlight(state);
  });
}

function syncVerseHighlight(state) {
  // If previously highlighted a verse, remove the class
  if (lastHighlightedVerse && (!state || state.status === 'idle' || state.currentVerseNum !== lastHighlightedVerse)) {
    const prevEl = document.querySelector(`[data-verse-num="${lastHighlightedVerse}"]`);
    if (prevEl) {
      prevEl.classList.remove('verse-reading-active', 'verse-reading-pulse');
    }
    lastHighlightedVerse = null;
  }

  // Highlight new active verse in the Bible Reader
  if (state && (state.status === 'playing' || state.status === 'paused') && state.currentVerseNum) {
    lastHighlightedVerse = state.currentVerseNum;
    const activeEl = document.querySelector(`[data-verse-num="${state.currentVerseNum}"]`);
    if (activeEl) {
      activeEl.classList.add('verse-reading-active');
      if (state.status === 'playing') {
        activeEl.classList.add('verse-reading-pulse');
      } else {
        activeEl.classList.remove('verse-reading-pulse');
      }

      // Smoothly scroll into view if outside viewport
      const rect = activeEl.getBoundingClientRect();
      const isVisible = rect.top >= 60 && rect.bottom <= (window.innerHeight - 100);
      if (!isVisible) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }
}

function updatePlayerUI(state) {
  if (!containerEl) return;

  if (!state || state.status === 'idle') {
    containerEl.innerHTML = '';
    return;
  }

  const isPlaying = state.status === 'playing';
  const progressPercent = state.totalVerses > 0
    ? Math.round(((state.currentIndex + 1) / state.totalVerses) * 100)
    : 0;

  const currentRateObj = SPEECH_RATES.find(r => Math.abs(r.value - state.rate) < 0.05) || SPEECH_RATES[1];
  const friendlyVoiceBadge = getFriendlyVoiceName(state.voice || state.voiceURI, state.langTag);

  containerEl.innerHTML = `
    <div class="fixed bottom-24 sm:bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-xl w-[94%] bg-[var(--bg-card)]/95 backdrop-blur-md border-2 border-amber-600/80 rounded-2xl p-3 sm:p-4 shadow-2xl parchment-border animate-fade-in notranslate" translate="no">
      
      <!-- Top Row: Icon, Title, Rate Selector & Close -->
      <div class="flex items-center justify-between gap-2 border-b border-stone-200/70 dark:border-stone-800/80 pb-2 mb-2.5">
        
        <!-- Left: Speaker Icon & Title -->
        <div class="flex items-center gap-2 min-w-0 flex-1">
          <div class="w-8 h-8 rounded-full bg-amber-500/15 text-amber-600 flex items-center justify-center flex-shrink-0">
            ${icons.speaker('w-4 h-4')}
          </div>
          <div class="min-w-0 flex-1">
            <h4 class="text-xs sm:text-sm font-bold font-display text-[var(--accent-vermilion)] truncate">
              ${state.title}
            </h4>
            <div class="flex items-center gap-2 text-[11px] text-[var(--text-muted)] font-serif truncate">
              ${state.totalVerses > 1 ? `<span>${t('reader.verse', 'Versetto')} ${state.currentVerseNum || (state.currentIndex + 1)} ${t('reader.of', 'di')} ${state.totalVerses}</span>` : ''}
              ${friendlyVoiceBadge ? `• <span class="text-amber-700 dark:text-amber-400 font-sans font-semibold">${friendlyVoiceBadge}</span>` : ''}
              ${isPlaying ? `
                <div class="flex items-end gap-0.5 h-3 ml-1">
                  <span class="w-1 bg-amber-500 rounded-full audio-bar-anim"></span>
                  <span class="w-1 bg-amber-600 rounded-full audio-bar-anim"></span>
                  <span class="w-1 bg-amber-500 rounded-full audio-bar-anim"></span>
                </div>
              ` : `<span class="italic text-amber-700 dark:text-amber-400">(${t('reader.paused', 'In pausa')})</span>`}
            </div>
          </div>
        </div>

        <!-- Right: Rate Cycle, Voice Picker, Close -->
        <div class="flex items-center gap-1.5 flex-shrink-0">
          <button id="btn-audio-cycle-rate" class="px-2 py-1 rounded-lg border border-amber-600/40 hover:bg-amber-500/10 text-[11px] font-sans font-semibold text-amber-700 dark:text-amber-400 transition cursor-pointer" title="${t('reader.changeSpeed', 'Velocità di lettura')}">
            ${currentRateObj.value}x
          </button>
          
          <button id="btn-audio-voice-picker" class="p-1.5 rounded-lg border border-stone-300 dark:border-stone-700 text-stone-500 hover:text-amber-600 transition cursor-pointer" title="${t('reader.chooseVoice', 'Scegli Voce Liturgica (9 Lingue)')}">
            ${icons.settings('w-3.5 h-3.5')}
          </button>

          <button id="btn-audio-stop" class="p-1.5 rounded-lg text-stone-400 hover:text-red-500 transition cursor-pointer" title="${t('reader.stopAudio', 'Chiudi Lettore')}">
            ${icons.close('w-4 h-4')}
          </button>
        </div>

      </div>

      <!-- Recited Verse Text Snippet -->
      <div class="text-xs sm:text-sm font-serif italic text-[var(--text-primary)] leading-relaxed line-clamp-2 mb-3 px-1 text-center">
        «${state.currentText || '...'}»
      </div>

      <!-- Playback Timeline Progress Bar -->
      <div class="w-full bg-stone-200 dark:bg-stone-800 rounded-full h-1.5 mb-3 overflow-hidden">
        <div class="bg-amber-600 h-full rounded-full transition-all duration-300" style="width: ${progressPercent}%"></div>
      </div>

      <!-- Bottom Controls Row -->
      <div class="flex items-center justify-center gap-4">
        
        <button id="btn-audio-prev" class="p-2 rounded-xl border border-stone-300 dark:border-stone-700 text-[var(--text-secondary)] hover:text-amber-600 hover:border-amber-600 transition cursor-pointer" title="${t('reader.prevVerse', 'Versetto Precedente')}">
          ${icons.skipBack('w-4 h-4')}
        </button>

        <button id="btn-audio-toggle" class="w-11 h-11 rounded-full bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white flex items-center justify-center shadow-lg transition transform active:scale-95 cursor-pointer" title="${isPlaying ? t('reader.pauseAudio', 'Pausa') : t('reader.resumeAudio', 'Riprendi')}">
          ${isPlaying ? icons.pause('w-5 h-5') : icons.play('w-5 h-5')}
        </button>

        <button id="btn-audio-next" class="p-2 rounded-xl border border-stone-300 dark:border-stone-700 text-[var(--text-secondary)] hover:text-amber-600 hover:border-amber-600 transition cursor-pointer" title="${t('reader.nextVerse', 'Versetto Successivo')}">
          ${icons.skipForward('w-4 h-4')}
        </button>

      </div>

    </div>
  `;

  // Attach event handlers
  containerEl.querySelector('#btn-audio-toggle')?.addEventListener('click', togglePlayPause);
  containerEl.querySelector('#btn-audio-stop')?.addEventListener('click', stop);
  containerEl.querySelector('#btn-audio-prev')?.addEventListener('click', prevVerse);
  containerEl.querySelector('#btn-audio-next')?.addEventListener('click', nextVerse);

  // Rate cycle
  containerEl.querySelector('#btn-audio-cycle-rate')?.addEventListener('click', () => {
    const curIdx = SPEECH_RATES.findIndex(r => Math.abs(r.value - state.rate) < 0.05);
    const nextIdx = (curIdx + 1) % SPEECH_RATES.length;
    setSpeechRate(SPEECH_RATES[nextIdx].value);
  });

  // Voice picker popover
  containerEl.querySelector('#btn-audio-voice-picker')?.addEventListener('click', () => {
    renderVoicePickerModal(state.langTag);
  });
}

function renderVoicePickerModal(initialLangTag) {
  const modalRoot = document.getElementById('modals-container') || document.body;
  let activeLangCode = getLangCode(initialLangTag || 'it');
  let isPreviewing = false;

  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-black/60 backdrop-blur-sm p-3 sm:p-4 flex items-center justify-center animate-fade-in notranslate';
  modal.setAttribute('translate', 'no');

  function updateModalContent() {
    const voiceConfig = SUPPORTED_LANGUAGE_VOICES[activeLangCode] || SUPPORTED_LANGUAGE_VOICES['it'];
    const currentRate = getSpeechRate();
    const availableDevices = getAvailableVoicesForLang(voiceConfig.langTag).filter(v => !v.isHumanHd);
    const activeURI = getSpeechVoiceURI();

    modal.innerHTML = `
      <div class="bg-[var(--bg-card)] border-2 border-amber-600/50 rounded-2xl max-w-md w-full p-4 sm:p-5 shadow-2xl relative parchment-border my-auto">
        
        <!-- Header -->
        <div class="flex items-center justify-between mb-3 pb-2 border-b border-stone-200 dark:border-stone-800">
          <h3 class="font-display font-bold text-sm sm:text-base text-[var(--accent-vermilion)] flex items-center gap-2">
            <span>${icons.speaker('w-4 h-4 text-amber-600')}</span>
            <span>${t('reader.voiceSettings', 'Voci per 9 Lingue Liturgiche')}</span>
          </h3>
          <button id="btn-close-voice-modal" class="text-stone-400 hover:text-[var(--text-primary)] p-1 cursor-pointer">
            ${icons.close('w-4 h-4')}
          </button>
        </div>

        <p class="text-xs text-[var(--text-muted)] italic font-serif mb-3">
          ${t('reader.voiceDesc', 'Ogni lingua liturgica dispone di una voce sacra naturale calibrata per la proclamazione.')}
        </p>

        <!-- 9-Language Selector Pills -->
        <div class="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3 custom-scrollbar">
          ${Object.entries(SUPPORTED_LANGUAGE_VOICES).map(([code, cfg]) => {
            const isActive = code === activeLangCode;
            return `
              <button class="lang-tab-btn flex-shrink-0 px-2.5 py-1 rounded-xl text-xs font-sans transition flex items-center gap-1 cursor-pointer ${
                isActive
                  ? 'bg-amber-600 text-white font-bold shadow-md ring-2 ring-amber-400'
                  : 'bg-stone-100 dark:bg-stone-800/80 text-[var(--text-secondary)] border border-stone-200 dark:border-stone-700 hover:border-amber-600/50'
              }" data-lang="${code}">
                <span>${cfg.flag}</span>
                <span>${code.toUpperCase()}</span>
              </button>
            `;
          }).join('')}
        </div>

        <!-- Compatible HD Voice Card for selected language -->
        <div class="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border-2 border-amber-600/60 rounded-xl p-3.5 mb-3 shadow-sm">
          
          <div class="flex items-start justify-between gap-2 mb-1.5">
            <div class="flex items-center gap-2">
              <span class="text-2xl">${voiceConfig.flag}</span>
              <div>
                <h4 class="font-display font-bold text-xs sm:text-sm text-amber-900 dark:text-amber-300">
                  ${voiceConfig.name}
                </h4>
                <div class="text-[10px] font-serif text-amber-700 dark:text-amber-400">
                  ${voiceConfig.bibleTitle}
                </div>
              </div>
            </div>
            <span class="px-2 py-0.5 rounded-full bg-amber-600/20 text-amber-700 dark:text-amber-300 font-bold text-[10px] uppercase tracking-wider flex-shrink-0">
              ⭐ Compatibile HD
            </span>
          </div>

          <p class="text-xs text-[var(--text-muted)] font-serif mb-2.5">
            ${voiceConfig.description}
          </p>

          <!-- Sample Verse Text -->
          <div class="bg-[var(--bg-card)]/80 border border-amber-600/20 rounded-lg p-2.5 mb-3 text-xs font-serif italic text-[var(--text-primary)] leading-relaxed text-center">
            «${voiceConfig.sampleText}»
          </div>

          <!-- Preview Button -->
          <div class="flex items-center justify-between gap-2">
            <button id="btn-preview-audio" class="flex-1 py-1.5 px-3 rounded-lg border border-amber-600/70 hover:bg-amber-600/15 text-xs font-sans font-semibold text-amber-800 dark:text-amber-300 transition flex items-center justify-center gap-2 cursor-pointer shadow-sm">
              <span>${isPreviewing ? icons.stop('w-3.5 h-3.5 text-amber-600') : icons.play('w-3.5 h-3.5 text-amber-600')}</span>
              <span>${isPreviewing ? t('reader.stopPreview', 'Ferma Anteprima') : t('reader.playPreview', 'Ascolta Anteprima Vocale')}</span>
              ${isPreviewing ? `
                <div class="flex items-end gap-0.5 h-2.5 ml-1">
                  <span class="w-1 bg-amber-500 rounded-full audio-bar-anim"></span>
                  <span class="w-1 bg-amber-600 rounded-full audio-bar-anim"></span>
                  <span class="w-1 bg-amber-500 rounded-full audio-bar-anim"></span>
                </div>
              ` : ''}
            </button>
          </div>

        </div>

        <!-- Optional Device Voices Section (only shown if genuine neural device voices exist) -->
        ${availableDevices.length > 0 ? `
          <div class="mb-3">
            <div class="text-[10px] uppercase tracking-wider font-sans font-bold text-[var(--text-muted)] mb-1 px-1">
              ${t('reader.deviceVoices', 'Altre Voci di Sistema per questa Lingua')}
            </div>
            <div class="space-y-1 max-h-24 overflow-y-auto custom-scrollbar">
              ${availableDevices.map(v => {
                const isSelected = v.voiceURI === activeURI;
                return `
                  <button class="device-voice-btn w-full text-left p-2 rounded-lg border text-xs transition flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'border-amber-600 bg-amber-500/15 font-bold text-amber-700'
                      : 'border-stone-200 dark:border-stone-800 bg-[var(--bg-secondary)]'
                  }" data-uri="${v.voiceURI}">
                    <span class="truncate mr-2">${getFriendlyVoiceName(v)}</span>
                    ${isSelected ? `<span class="text-amber-600">${icons.check('w-3.5 h-3.5')}</span>` : ''}
                  </button>
                `;
              }).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Reading Speed Selector in Modal -->
        <div class="mb-4">
          <label class="block text-[10px] uppercase tracking-wider font-sans font-bold text-[var(--text-muted)] mb-1 px-1">
            ${t('reader.changeSpeed', 'Velocità di Lettura')}
          </label>
          <div class="grid grid-cols-4 gap-1.5">
            ${SPEECH_RATES.map(r => {
              const isSelected = Math.abs(r.value - currentRate) < 0.05;
              return `
                <button class="speed-opt-btn py-1.5 px-1 rounded-lg border text-xs font-sans transition text-center cursor-pointer ${
                  isSelected
                    ? 'border-amber-600 bg-amber-600 text-white font-bold shadow-sm'
                    : 'border-stone-200 dark:border-stone-800 bg-[var(--bg-secondary)] hover:border-amber-600/50'
                }" data-speed="${r.value}">
                  ${r.value}x
                </button>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="flex items-center gap-2">
          <button id="btn-voice-modal-close" class="flex-1 py-2 rounded-xl border border-stone-300 dark:border-stone-700 text-[var(--text-secondary)] font-bold text-xs hover:bg-stone-100 dark:hover:bg-stone-800 transition cursor-pointer">
            ${t('reader.close', 'Chiudi')}
          </button>
          <button id="btn-voice-modal-apply" class="flex-1 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-bold text-xs shadow-md transition cursor-pointer">
            ${t('reader.applyVoice', 'Applica e Conferma')}
          </button>
        </div>

      </div>
    `;

    // Attach handlers
    modal.querySelector('#btn-close-voice-modal')?.addEventListener('click', closeModal);
    modal.querySelector('#btn-voice-modal-close')?.addEventListener('click', closeModal);

    modal.querySelector('#btn-voice-modal-apply')?.addEventListener('click', () => {
      stopVoicePreview();
      const targetURI = `voice-human-hd-${activeLangCode}`;
      setSpeechVoiceURI(targetURI);
      closeModal();
    });

    modal.querySelectorAll('.lang-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        stopVoicePreview();
        isPreviewing = false;
        activeLangCode = btn.getAttribute('data-lang');
        updateModalContent();
      });
    });

    modal.querySelector('#btn-preview-audio')?.addEventListener('click', () => {
      if (isPreviewing) {
        stopVoicePreview();
        isPreviewing = false;
        updateModalContent();
      } else {
        isPreviewing = true;
        updateModalContent();
        playVoicePreview(activeLangCode, () => {
          isPreviewing = false;
          updateModalContent();
        });
      }
    });

    modal.querySelectorAll('.speed-opt-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const speed = parseFloat(btn.getAttribute('data-speed'));
        setSpeechRate(speed);
        updateModalContent();
      });
    });

    modal.querySelectorAll('.device-voice-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        stopVoicePreview();
        const uri = btn.getAttribute('data-uri');
        setSpeechVoiceURI(uri);
        closeModal();
      });
    });
  }

  function closeModal() {
    stopVoicePreview();
    modal.remove();
  }

  updateModalContent();
  modalRoot.appendChild(modal);
}
