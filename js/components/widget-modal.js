// Interactive Scripture Verse Widget Hub & iOS-First Installation Guide for Aura Sacra
// Provides dynamic iOS 18 Home Screen simulator, Lock Screen verse notifications, and 1-tap setup.

import { getRandomVerse, getDailyVerse } from '../widget-verse.js';
import { icons } from '../icons.js';
import { t } from '../i18n.js';

export async function renderWidgetModal(container, onClose, onNavigate, onOpenShareCard) {
  let currentSize = 'medium'; // 'small' | 'medium' | 'large'
  let currentTheme = 'dark'; // 'dark' | 'light' | 'tinted'
  let activeTab = 'home'; // 'home' | 'lockscreen' | 'shortcuts'
  let verseData = await getDailyVerse();
  let lockScreenFeedback = '';

  function render() {
    container.innerHTML = `
      <div class="fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-black/80 backdrop-blur-md p-3 sm:p-6 flex min-h-full items-center justify-center animate-fade-in" id="widget-modal-overlay">
        <div class="bg-[var(--bg-card)] border-2 border-amber-600/70 rounded-2xl sm:rounded-3xl max-w-2xl w-full max-h-[92dvh] sm:max-h-[90vh] overflow-y-auto overscroll-contain p-4 sm:p-6 shadow-2xl relative space-y-5 parchment-border my-auto custom-scrollbar">
          
          <!-- Close Button -->
          <button id="btn-close-widget-modal" class="absolute top-4 right-4 text-stone-400 hover:text-[var(--text-primary)] p-1.5 rounded-lg transition cursor-pointer" title="Chiudi">
            ${icons.close('w-5 h-5')}
          </button>

          <!-- iOS-First Header -->
          <div class="text-center space-y-1">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-600/15 border border-amber-600/30 text-amber-500 font-sans font-bold text-xs">
              <span>🍏</span>
              <span>Widget iOS 18 & Android</span>
            </div>
            <h2 class="text-xl sm:text-2xl font-bold font-display text-[var(--accent-vermilion)]">
              Widget Sacro del Versetto
            </h2>
            <p class="text-xs sm:text-sm text-[var(--text-muted)] italic font-serif">
              Visualizza la Parola di Dio sulla Schermata Home e di Blocco del tuo iPhone
            </p>
          </div>

          <!-- iOS Mode Switcher Tabs -->
          <div class="flex items-center p-1 bg-[var(--bg-secondary)] rounded-xl border border-stone-200 dark:border-stone-800 text-xs font-bold">
            <button id="tab-btn-home" class="flex-1 py-2 px-2.5 rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'home' ? 'bg-amber-600 text-white shadow-xs' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }">
              <span>📱</span>
              <span>Schermata Home</span>
            </button>
            <button id="tab-btn-lockscreen" class="flex-1 py-2 px-2.5 rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'lockscreen' ? 'bg-amber-600 text-white shadow-xs' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }">
              <span>🔒</span>
              <span>Schermata di Blocco</span>
            </button>
            <button id="tab-btn-shortcuts" class="flex-1 py-2 px-2.5 rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'shortcuts' ? 'bg-amber-600 text-white shadow-xs' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }">
              <span>⚡</span>
              <span>Comandi Rapidi</span>
            </button>
          </div>

          <!-- TAB 1: SCHERMATA HOME (Visual iPhone Mockup & Live Widget) -->
          ${activeTab === 'home' ? `
            <div class="space-y-4 animate-fade-in">
              
              <!-- Size and Appearance Selectors -->
              <div class="flex flex-col sm:flex-row items-center justify-between gap-2 p-2.5 bg-[var(--bg-secondary)] rounded-2xl border border-stone-200 dark:border-stone-800 text-xs">
                
                <!-- Sizes -->
                <div class="flex items-center gap-1 bg-[var(--bg-card)] p-1 rounded-xl border border-stone-300 dark:border-stone-700 w-full sm:w-auto">
                  <button type="button" data-size="small" class="size-btn flex-1 sm:flex-none px-2.5 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                    currentSize === 'small' ? 'bg-amber-600 text-white shadow-xs' : 'text-[var(--text-secondary)]'
                  }">
                    Piccolo 2x2
                  </button>
                  <button type="button" data-size="medium" class="size-btn flex-1 sm:flex-none px-2.5 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                    currentSize === 'medium' ? 'bg-amber-600 text-white shadow-xs' : 'text-[var(--text-secondary)]'
                  }">
                    Medio 4x2
                  </button>
                  <button type="button" data-size="large" class="size-btn flex-1 sm:flex-none px-2.5 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                    currentSize === 'large' ? 'bg-amber-600 text-white shadow-xs' : 'text-[var(--text-secondary)]'
                  }">
                    Grande 4x4
                  </button>
                </div>

                <!-- Themes -->
                <div class="flex items-center gap-1 bg-[var(--bg-card)] p-1 rounded-xl border border-stone-300 dark:border-stone-700 w-full sm:w-auto justify-center">
                  <button type="button" data-theme="dark" class="theme-btn px-2 py-1.5 rounded-lg transition cursor-pointer ${
                    currentTheme === 'dark' ? 'bg-amber-600 text-white font-bold' : 'text-[var(--text-secondary)]'
                  }">
                    🌙 Cattedrale
                  </button>
                  <button type="button" data-theme="light" class="theme-btn px-2 py-1.5 rounded-lg transition cursor-pointer ${
                    currentTheme === 'light' ? 'bg-amber-600 text-white font-bold' : 'text-[var(--text-secondary)]'
                  }">
                    ☀️ Pergamena
                  </button>
                  <button type="button" data-theme="tinted" class="theme-btn px-2 py-1.5 rounded-lg transition cursor-pointer ${
                    currentTheme === 'tinted' ? 'bg-amber-600 text-white font-bold' : 'text-[var(--text-secondary)]'
                  }">
                    ✨ iOS 18 Tinted
                  </button>
                </div>

              </div>

              <!-- iPhone SpringBoard / Home Screen Mockup Frame -->
              <div class="relative mx-auto max-w-sm rounded-[38px] p-4 pt-3 pb-5 border-4 border-stone-700 bg-gradient-to-b from-[#181512] via-[#0d0b09] to-[#050505] shadow-2xl overflow-hidden select-none">
                
                <!-- iPhone Notch / Dynamic Island -->
                <div class="flex items-center justify-between px-3 mb-3 text-[10px] font-sans font-semibold text-stone-300">
                  <span>9:41</span>
                  <div class="w-20 h-4 bg-black rounded-full border border-stone-800 mx-auto"></div>
                  <div class="flex items-center gap-1">
                    <span>5G</span>
                    <span>🔋</span>
                  </div>
                </div>

                <!-- Live Widget Embedded on iPhone Screen -->
                <div class="flex justify-center my-2">
                  <div id="live-widget-card" class="relative transition-all duration-300 cursor-pointer ${
                    currentSize === 'small' ? 'w-[150px] h-[150px] p-3' :
                    currentSize === 'medium' ? 'w-[290px] h-[145px] p-3.5' :
                    'w-[290px] h-[290px] p-4'
                  } ${
                    currentTheme === 'light'
                      ? 'bg-[#fbf9f4] text-[#2b231c] border border-amber-800/40 shadow-xl'
                      : currentTheme === 'tinted'
                      ? 'bg-stone-900/50 backdrop-blur-2xl text-stone-100 border border-white/20 shadow-2xl'
                      : 'bg-stone-950/95 text-stone-200 border border-amber-600/40 shadow-2xl shadow-black'
                  } rounded-[24px] flex flex-col justify-between overflow-hidden group hover:scale-[1.02]">
                    
                    <!-- Header -->
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-1.5">
                        <span class="text-amber-500 text-xs">☩</span>
                        <span class="text-[9px] font-sans font-bold uppercase tracking-widest ${
                          currentTheme === 'light' ? 'text-amber-800' : 'text-amber-500'
                        }">Aura Sacra</span>
                      </div>
                      <span class="text-[8px] font-mono opacity-60 uppercase">${verseData.versionLabel || 'CEI'}</span>
                    </div>

                    <!-- Verse Text -->
                    <div class="my-auto py-0.5">
                      <p class="font-serif italic leading-snug ${
                        currentSize === 'small' ? 'text-[10px] line-clamp-3' :
                        currentSize === 'medium' ? 'text-xs line-clamp-3' :
                        'text-sm line-clamp-6'
                      }">
                        ${verseData.text}
                      </p>
                    </div>

                    <!-- Citation -->
                    <div class="flex items-center justify-between pt-1 border-t border-stone-500/20 text-[9px]">
                      <span class="font-sans font-bold ${
                        currentTheme === 'light' ? 'text-amber-800' : 'text-amber-500'
                      }">
                        ${verseData.citation}
                      </span>
                      <span class="text-[8px] opacity-60">Tocca per leggere ↗</span>
                    </div>
                  </div>
                </div>

                <!-- Mockup App Icons Grid below widget -->
                <div class="grid grid-cols-4 gap-2 pt-2 px-1 text-center opacity-60">
                  <div class="space-y-1">
                    <div class="w-10 h-10 mx-auto rounded-xl bg-amber-600/30 border border-amber-600/40 flex items-center justify-center text-sm">📖</div>
                    <span class="text-[8px] text-stone-400 block truncate">Bibbia</span>
                  </div>
                  <div class="space-y-1">
                    <div class="w-10 h-10 mx-auto rounded-xl bg-blue-600/30 border border-blue-600/40 flex items-center justify-center text-sm">🕊️</div>
                    <span class="text-[8px] text-stone-400 block truncate">Preghiera</span>
                  </div>
                  <div class="space-y-1">
                    <div class="w-10 h-10 mx-auto rounded-xl bg-orange-600/30 border border-orange-600/40 flex items-center justify-center text-sm">🕯️</div>
                    <span class="text-[8px] text-stone-400 block truncate">Candela</span>
                  </div>
                  <div class="space-y-1">
                    <div class="w-10 h-10 mx-auto rounded-xl bg-purple-600/30 border border-purple-600/40 flex items-center justify-center text-sm">⚙️</div>
                    <span class="text-[8px] text-stone-400 block truncate">Opzioni</span>
                  </div>
                </div>

              </div>

              <!-- Quick Action Bar -->
              <div class="flex flex-wrap items-center justify-center gap-2 text-xs">
                <button type="button" id="btn-refresh-verse" class="px-3 py-1.5 rounded-xl bg-amber-600/15 hover:bg-amber-600/25 text-amber-500 border border-amber-600/30 font-semibold flex items-center gap-1.5 transition cursor-pointer">
                  <span>🔄</span>
                  <span>Nuovo Versetto</span>
                </button>
                <button type="button" id="btn-read-verse" class="px-3 py-1.5 rounded-xl bg-stone-700/40 hover:bg-stone-700/60 text-stone-200 border border-stone-600/50 font-semibold flex items-center gap-1.5 transition cursor-pointer">
                  <span>📖</span>
                  <span>Leggi nella Bibbia</span>
                </button>
                <button type="button" id="btn-share-verse" class="px-3 py-1.5 rounded-xl bg-stone-700/40 hover:bg-stone-700/60 text-stone-200 border border-stone-600/50 font-semibold flex items-center gap-1.5 transition cursor-pointer">
                  <span>📤</span>
                  <span>Condividi</span>
                </button>
              </div>

              <!-- 1-Tap iOS Installation Action Button -->
              <div class="p-4 bg-gradient-to-r from-amber-950/40 via-stone-900/60 to-amber-950/40 border border-amber-600/50 rounded-2xl space-y-2 text-left">
                <div class="flex items-center justify-between gap-2">
                  <div class="flex items-center gap-2">
                    <span class="text-xl">📲</span>
                    <div>
                      <h4 class="text-xs sm:text-sm font-bold text-[var(--text-primary)] font-display">Aggiungi Widget su iPhone in 3 Tocchi</h4>
                      <p class="text-[11px] text-[var(--text-muted)]">Crea l'icona widget dedicata direttamente da Safari</p>
                    </div>
                  </div>
                  <a href="./widget.html" target="_blank" class="px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition flex items-center gap-1 flex-shrink-0 cursor-pointer">
                    <span>Installa</span>
                    <span>↗</span>
                  </a>
                </div>

                <div class="grid grid-cols-3 gap-2 pt-2 text-[11px] text-stone-300 font-sans border-t border-amber-600/20">
                  <div class="p-2 rounded-xl bg-black/30 text-center space-y-1">
                    <span class="text-base block">1️⃣ 📤</span>
                    <span class="block text-[10px] leading-tight">Tocca <strong>Condividi</strong> in Safari</span>
                  </div>
                  <div class="p-2 rounded-xl bg-black/30 text-center space-y-1">
                    <span class="text-base block">2️⃣ ➕</span>
                    <span class="block text-[10px] leading-tight">Scegli <strong>«Aggiungi a Home»</strong></span>
                  </div>
                  <div class="p-2 rounded-xl bg-black/30 text-center space-y-1">
                    <span class="text-base block">3️⃣ ⛪</span>
                    <span class="block text-[10px] leading-tight">Widget pronto sulla Home!</span>
                  </div>
                </div>
              </div>

            </div>
          ` : activeTab === 'lockscreen' ? `
            <!-- TAB 2: LOCK SCREEN / SCHERMATA DI BLOCCO -->
            <div class="space-y-4 animate-fade-in text-left">
              
              <div class="p-4 bg-[var(--bg-secondary)] rounded-2xl border border-stone-200 dark:border-stone-800 space-y-3">
                <div class="flex items-center gap-2.5">
                  <span class="p-2 rounded-xl bg-amber-600/10 text-amber-600 text-xl">🔒</span>
                  <div>
                    <h4 class="text-sm font-bold text-[var(--text-primary)] font-display">Versetto su Schermata di Blocco (iOS Lock Screen)</h4>
                    <p class="text-xs text-[var(--text-muted)]">Ricevi il versetto sacro ogni mattina direttamente nella schermata di sblocco dell'iPhone</p>
                  </div>
                </div>

                <!-- Mockup of iPhone Lock Screen Notification -->
                <div class="p-3.5 bg-black/60 backdrop-blur-md rounded-2xl border border-white/15 shadow-xl space-y-2">
                  <div class="flex items-center justify-between text-[10px] text-stone-400">
                    <div class="flex items-center gap-1.5">
                      <img src="./icons/icon-192.png" alt="Aura Sacra" class="w-4 h-4 rounded-md">
                      <span class="font-bold text-stone-200">AURA SACRA</span>
                    </div>
                    <span>Adesso</span>
                  </div>
                  <p class="text-xs font-serif italic text-stone-100 leading-snug">
                    ${verseData.text}
                  </p>
                  <p class="text-[10px] font-sans font-bold text-amber-400">
                    ${verseData.citation}
                  </p>
                </div>

                <!-- Test Lock Screen Notification Button -->
                <button type="button" id="btn-test-lockscreen" class="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer">
                  <span>🔔</span>
                  <span>Invia Versetto sulla Schermata di Blocco Adesso</span>
                </button>

                <p id="lockscreen-status" class="text-[11px] font-sans text-center text-amber-600">${lockScreenFeedback}</p>
              </div>

            </div>
          ` : `
            <!-- TAB 3: COMANDI RAPIDI & HAPTIC TOUCH -->
            <div class="space-y-4 animate-fade-in text-left">
              
              <!-- Haptic Touch Context Menu -->
              <div class="p-4 bg-[var(--bg-secondary)] rounded-2xl border border-stone-200 dark:border-stone-800 space-y-2.5">
                <div class="flex items-center gap-2">
                  <span class="text-xl">⚡</span>
                  <h4 class="text-sm font-bold text-[var(--text-primary)] font-display">Pressione Prolungata (Haptic Touch su Schermata Home)</h4>
                </div>
                <p class="text-xs text-[var(--text-muted)] leading-relaxed">
                  Sulla schermata Home del tuo iPhone, <strong>tieni premuta l'icona di Aura Sacra per un istante</strong>. Nel menu a comparsa troverai il comando rapido:
                </p>

                <div class="p-3 bg-stone-900/80 rounded-xl border border-stone-700/80 space-y-2 max-w-xs mx-auto text-xs font-sans">
                  <div class="flex items-center justify-between text-stone-200 py-1 border-b border-stone-800">
                    <span class="font-semibold">📖 Versetto del Giorno (Widget)</span>
                    <span class="text-stone-400">↗</span>
                  </div>
                  <div class="flex items-center justify-between text-stone-200 py-1 border-b border-stone-800">
                    <span class="font-semibold">🕯️ Candela & Pioggia</span>
                    <span class="text-stone-400">↗</span>
                  </div>
                  <div class="flex items-center justify-between text-stone-200 py-1">
                    <span class="font-semibold">💬 Dialogo con Gesù</span>
                    <span class="text-stone-400">↗</span>
                  </div>
                </div>
              </div>

              <!-- Apple Shortcuts Code Copy -->
              <div class="p-4 bg-[var(--bg-secondary)] rounded-2xl border border-stone-200 dark:border-stone-800 space-y-2.5">
                <div class="flex items-center gap-2">
                  <span class="text-xl">🍏</span>
                  <h4 class="text-sm font-bold text-[var(--text-primary)] font-display">Integrazione con l'App Comandi Rapidi di Apple</h4>
                </div>
                <p class="text-xs text-[var(--text-muted)] leading-relaxed">
                  Puoi copiare il versetto corrente negli appunti per usarlo in qualsiasi automazione personale o widget di terze parti (come Widgy o Scriptable):
                </p>
                <button type="button" id="btn-copy-verse-text" class="w-full py-2.5 rounded-xl bg-amber-600/15 hover:bg-amber-600/25 text-amber-500 border border-amber-600/40 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer">
                  <span>📋</span>
                  <span>Copia Versetto Formattato per Widget iOS</span>
                </button>
                <span id="copy-status" class="text-[11px] font-sans text-emerald-500 block text-center"></span>
              </div>

            </div>
          `}

          <!-- Footer Button -->
          <div class="pt-2 border-t border-stone-200 dark:border-stone-800">
            <button id="btn-close-bottom" class="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-bold text-sm shadow-md transition cursor-pointer">
              Chiudi
            </button>
          </div>

        </div>
      </div>
    `;

    // Event handlers
    container.querySelector('#btn-close-widget-modal')?.addEventListener('click', onClose);
    container.querySelector('#btn-close-bottom')?.addEventListener('click', onClose);

    // Tab buttons
    container.querySelector('#tab-btn-home')?.addEventListener('click', () => {
      activeTab = 'home';
      render();
    });
    container.querySelector('#tab-btn-lockscreen')?.addEventListener('click', () => {
      activeTab = 'lockscreen';
      render();
    });
    container.querySelector('#tab-btn-shortcuts')?.addEventListener('click', () => {
      activeTab = 'shortcuts';
      render();
    });

    if (activeTab === 'home') {
      // Size buttons
      container.querySelectorAll('.size-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          currentSize = btn.getAttribute('data-size');
          render();
        });
      });

      // Theme buttons
      container.querySelectorAll('.theme-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          currentTheme = btn.getAttribute('data-theme');
          render();
        });
      });

      // Refresh verse
      container.querySelector('#btn-refresh-verse')?.addEventListener('click', async () => {
        verseData = await getRandomVerse();
        render();
      });

      // Read in Bible
      const handleReadInBible = () => {
        onClose();
        if (onNavigate) {
          onNavigate('bible', {
            book: verseData.book,
            chapter: verseData.chapter,
            verse: verseData.verse
          });
        }
      };

      container.querySelector('#btn-read-verse')?.addEventListener('click', handleReadInBible);
      container.querySelector('#live-widget-card')?.addEventListener('click', handleReadInBible);

      // Share card
      container.querySelector('#btn-share-verse')?.addEventListener('click', () => {
        onClose();
        if (onOpenShareCard) {
          onOpenShareCard(verseData.text, verseData.citation);
        }
      });
    } else if (activeTab === 'lockscreen') {
      // Test Lock Screen Notification
      const testLockBtn = container.querySelector('#btn-test-lockscreen');
      const statusEl = container.querySelector('#lockscreen-status');

      testLockBtn?.addEventListener('click', async () => {
        if (!('Notification' in window)) {
          if (statusEl) statusEl.textContent = 'Le notifiche web non sono supportate in questo browser.';
          return;
        }

        if (Notification.permission !== 'granted') {
          const perm = await Notification.requestPermission();
          if (perm !== 'granted') {
            if (statusEl) statusEl.textContent = 'Permesso notifiche non concesso. Abilitalo nelle Impostazioni di iOS.';
            return;
          }
        }

        const title = `⛪ Aura Sacra • Versetto del Giorno`;
        const options = {
          body: `«${verseData.text}»\n${verseData.citation}`,
          icon: './icons/icon-192.png',
          badge: './icons/icon-192.png',
          data: `./index.html?tab=bible&book=${verseData.book}&chapter=${verseData.chapter}&verse=${verseData.verse}`,
          vibrate: [200, 100, 200]
        };

        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
          navigator.serviceWorker.ready.then((reg) => {
            reg.showNotification(title, options);
          });
        } else {
          new Notification(title, options);
        }

        if (statusEl) {
          statusEl.textContent = '✓ Versetto inviato! Blocca lo schermo del tuo iPhone per vederlo apparire.';
          statusEl.className = 'text-[11px] font-sans text-center text-emerald-500 font-bold';
        }
      });
    } else if (activeTab === 'shortcuts') {
      // Copy formatted text
      const copyBtn = container.querySelector('#btn-copy-verse-text');
      const copyStatusEl = container.querySelector('#copy-status');
      copyBtn?.addEventListener('click', async () => {
        const textToCopy = `«${verseData.text}» — ${verseData.citation}`;
        try {
          await navigator.clipboard.writeText(textToCopy);
          if (copyStatusEl) copyStatusEl.textContent = '✓ Versetto copiato negli appunti!';
        } catch (e) {
          if (copyStatusEl) copyStatusEl.textContent = 'Seleziona e copia manualmente.';
        }
      });
    }
  }

  render();
}
