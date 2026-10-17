// First-run Ecumenical Onboarding & Setup Modal for Aura Sacra
// Fully responsive across all mobile (e.g. iPhone, Samsung) and desktop viewports
import { setSetting, getSetting } from '../db.js';
import { icons } from '../icons.js';
import { t, getLanguage, setLanguage, SUPPORTED_LANGUAGES, TRANSLATIONS } from '../i18n.js';
import { SUPPORTED_NATIONALITIES, getNationalityMeta } from '../data/saints.js';
import { getDefaultBibleForLanguage } from '../data/scripture-archives.js';
import { saveMonasticConfig, requestNotificationPermission } from '../monastic-hours.js';
import { unlockAudio } from '../audio-engine.js';

export function renderOnboardingModal(container, onComplete, canClose = true) {
  if (!container) return;

  // Synchronous initial values from localStorage / i18n for 0ms instant render without blocking
  let selectedLanguage = localStorage.getItem('aurasacra_language') || getLanguage() || 'it';
  let selectedNationality = localStorage.getItem('aurasacra_user_nationality') || 'universal';
  let selectedConfession = localStorage.getItem('aurasacra_user_confession') || 'ecumenical';
  let enteredName = localStorage.getItem('aurasacra_user_name') || '';
  let selectedRhythm = 'monastic';
  let enableNotifications = true;

  // Non-blocking background sync from IndexedDB in case values were not in localStorage
  (async () => {
    try {
      const dbNat = await getSetting('user_nationality', null);
      if (dbNat && selectedNationality === 'universal') selectedNationality = dbNat;
      const dbConf = await getSetting('user_confession', null) || await getSetting('confession', null);
      if (dbConf) selectedConfession = dbConf;
      const dbName = await getSetting('user_name', null);
      if (dbName && !enteredName) enteredName = dbName;
    } catch (e) {}
  })();

  // Dynamic localization helper that responds immediately to local modal language selection
  function obT(keyPath, defaultText = '') {
    if (!keyPath) return defaultText;
    const parts = keyPath.split('.');

    // Try currently selected language dictionary
    const dict = TRANSLATIONS[selectedLanguage];
    if (dict) {
      let cur = dict;
      for (const part of parts) {
        if (!cur || typeof cur !== 'object') { cur = null; break; }
        cur = cur[part];
      }
      if (cur !== null && cur !== undefined) return cur;
    }

    // Try Italian
    const itDict = TRANSLATIONS.it;
    if (itDict) {
      let cur = itDict;
      for (const part of parts) {
        if (!cur || typeof cur !== 'object') { cur = null; break; }
        cur = cur[part];
      }
      if (cur !== null && cur !== undefined) return cur;
    }

    // Fallback to global t
    return t(keyPath, defaultText);
  }

  function handleDismiss() {
    container.innerHTML = '';
    if (typeof onComplete === 'function') {
      try { onComplete(); } catch (e) {}
    }
  }

  function render() {
    container.innerHTML = `
      <div class="fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-black/80 backdrop-blur-md p-3 sm:p-6 flex min-h-full items-center justify-center animate-fade-in" id="onboarding-overlay">
        <div class="bg-[var(--bg-card)] border-2 border-amber-600/70 rounded-2xl sm:rounded-3xl max-w-lg w-full max-h-[92dvh] sm:max-h-[90vh] flex flex-col shadow-2xl relative parchment-border my-auto overflow-hidden text-center" id="onboarding-card">
          
          <!-- Close Button (Always present to ensure user is never trapped or locked out) -->
          <button id="btn-close-onboarding" type="button" class="absolute top-3 right-3 text-stone-400 hover:text-[var(--text-primary)] p-2 rounded-xl transition cursor-pointer z-10" title="${obT('common.close', 'Chiudi (✕)')}">
            ${icons.close('w-5 h-5')}
          </button>

          <!-- Header Section (Fixed at top of modal) -->
          <div class="p-4 sm:p-6 pb-2.5 sm:pb-3 flex-shrink-0 text-center space-y-1.5 sm:space-y-2 border-b border-stone-200/50 dark:border-stone-800/50 pr-10">
            <img src="./icons/logo.png" alt="Aura Sacra" width="64" height="64" style="width: 56px; height: 56px; max-width: 64px; max-height: 64px;" class="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl mx-auto shadow-md border-2 border-amber-600/50 object-cover">
            <div>
              <h2 class="text-xl sm:text-2xl font-bold font-display text-[var(--accent-vermilion)] leading-tight">
                ${obT('onboarding.welcome', 'Benvenuto in Aura Sacra')}
              </h2>
              <p class="text-xs sm:text-sm text-[var(--text-muted)] italic font-serif mt-0.5 leading-snug">
                ${obT('onboarding.subtitle', 'Piattaforma spirituale cristiana universale ed ecumenica, 100% offline.')}
              </p>
            </div>
          </div>

          <!-- Scrollable Content Section (Adapts dynamically to viewport height) -->
          <div class="overflow-y-auto overscroll-contain px-4 sm:px-6 py-3 sm:py-4 space-y-5 flex-1 text-left custom-scrollbar">
            
            <!-- 1. Question 1: Language & Original Nationality (FIRST STEP) -->
            <div class="space-y-3 bg-[var(--bg-secondary)] p-3.5 sm:p-4 rounded-2xl border-2 border-amber-600/40 shadow-xs">
              <div class="flex items-center justify-between">
                <label class="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-500 font-sans flex items-center gap-1.5">
                  <span>🌐</span>
                  <span>${obT('onboarding.step1Title', '1. Lingua dell\'Interfaccia e Nazionalità d\'Origine')}</span>
                </label>
                <span class="text-[10px] bg-amber-500/15 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full font-mono font-semibold">${SUPPORTED_LANGUAGES.length} ${obT('settings.nativeLangs', 'Lingue')}</span>
              </div>

              <!-- Language Selection -->
              <div class="space-y-1.5">
                <label class="block text-xs font-semibold text-[var(--text-primary)] font-sans" for="ob-language">
                  ${obT('onboarding.selectLanguage', 'Lingua dei Testi e dell\'Applicazione:')}
                </label>
                <select id="ob-language" class="w-full bg-[var(--bg-card)] border-2 border-stone-300 dark:border-stone-700 focus:border-amber-600 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-[var(--text-primary)] font-semibold cursor-pointer shadow-sm transition">
                  ${SUPPORTED_LANGUAGES.map((lang) => `
                    <option value="${lang.code}" ${selectedLanguage === lang.code ? 'selected' : ''}>
                      ${lang.flag} ${lang.name} (${lang.nativeName})
                    </option>
                  `).join('')}
                </select>
              </div>

              <!-- Original Nationality Selection -->
              <div class="space-y-1.5 pt-1">
                <div class="flex items-center justify-between">
                  <label class="block text-xs font-semibold text-[var(--text-primary)] font-sans" for="ob-nationality">
                    <span>🌍</span>
                    <span>${obT('onboarding.selectNationality', 'Nazionalità Originale / Radici Regionali:')}</span>
                  </label>
                  <span class="text-[10px] text-amber-600 font-serif italic">«Sinassario & Devozioni»</span>
                </div>
                <p class="text-[10.5px] text-[var(--text-muted)] italic font-serif leading-tight">
                  ${obT('onboarding.nationalityDesc', 'Personalizza il calendario liturgico con i santi patroni e le tradizioni della tua terra natale.')}
                </p>
                <select id="ob-nationality" class="w-full bg-[var(--bg-card)] border-2 border-stone-300 dark:border-stone-700 focus:border-amber-600 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-[var(--text-primary)] font-medium cursor-pointer shadow-sm transition">
                  ${SUPPORTED_NATIONALITIES.map((natCode) => {
                    const meta = getNationalityMeta(natCode, selectedLanguage);
                    return `
                      <option value="${natCode}" ${selectedNationality === natCode ? 'selected' : ''}>
                        ${meta.flag} ${meta.displayName || meta.name}
                      </option>
                    `;
                  }).join('')}
                </select>
              </div>
            </div>

            <!-- 2. Question 2: Confession / Faith Tradition -->
            <div class="space-y-2 pt-1 border-t border-stone-200/50 dark:border-stone-800/50">
              <label class="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] font-sans">
                ${obT('onboarding.traditionQuestion', '2. Qual è la tua tradizione di fede o cammino spirituale?')}
              </label>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
                <button type="button" class="conf-btn p-2.5 sm:p-3 rounded-xl border-2 border-stone-300 dark:border-stone-800 bg-[var(--bg-secondary)] text-left hover:border-amber-600/50 transition cursor-pointer" data-conf="catholic">
                  <span class="conf-title block text-xs sm:text-sm font-bold font-display text-[var(--text-primary)]">${obT('onboarding.traditions.catholicTitle', 'Cattolico (Romano)')}</span>
                  <span class="text-[10px] sm:text-xs text-stone-400 block mt-0.5 leading-tight">${obT('onboarding.traditions.catholicDesc', 'Canone biblico completo, santi e liturgia romana')}</span>
                </button>

                <button type="button" class="conf-btn p-2.5 sm:p-3 rounded-xl border-2 border-stone-300 dark:border-stone-800 bg-[var(--bg-secondary)] text-left hover:border-amber-600/50 transition cursor-pointer" data-conf="traditional">
                  <span class="conf-title block text-xs sm:text-sm font-bold font-display text-[var(--text-primary)]">${obT('onboarding.traditions.traditionalTitle', 'Cattolico Tradizionale (1962)')}</span>
                  <span class="text-[10px] sm:text-xs text-stone-400 block mt-0.5 leading-tight">${obT('onboarding.traditions.traditionalDesc', 'Messa in latino, Quattro Tempora, vigilie e digiuni antichi')}</span>
                </button>

                <button type="button" class="conf-btn p-2.5 sm:p-3 rounded-xl border-2 border-stone-300 dark:border-stone-800 bg-[var(--bg-secondary)] text-left hover:border-amber-600/50 transition cursor-pointer" data-conf="orthodox">
                  <span class="conf-title block text-xs sm:text-sm font-bold font-display text-[var(--text-primary)]">${obT('onboarding.traditions.orthodoxTitle', 'Ortodosso (Bizantino)')}</span>
                  <span class="text-[10px] sm:text-xs text-stone-400 block mt-0.5 leading-tight">${obT('onboarding.traditions.orthodoxDesc', 'Tradizione orientale, Padri della Chiesa ed esicasmo')}</span>
                </button>

                <button type="button" class="conf-btn p-2.5 sm:p-3 rounded-xl border-2 border-stone-300 dark:border-stone-800 bg-[var(--bg-secondary)] text-left hover:border-amber-600/50 transition cursor-pointer" data-conf="protestant">
                  <span class="conf-title block text-xs sm:text-sm font-bold font-display text-[var(--text-primary)]">${obT('onboarding.traditions.protestantTitle', 'Protestante / Evangelico')}</span>
                  <span class="text-[10px] sm:text-xs text-stone-400 block mt-0.5 leading-tight">${obT('onboarding.traditions.protestantDesc', 'Canone di 66 libri e fede evangelica')}</span>
                </button>

                <button type="button" class="conf-btn sm:col-span-2 p-2.5 sm:p-3 rounded-xl border-2 border-amber-600 bg-amber-600/10 text-left transition cursor-pointer shadow-sm" data-conf="ecumenical">
                  <span class="conf-title block text-xs sm:text-sm font-bold font-display text-amber-500">${obT('onboarding.traditions.ecumenicalTitle', 'Ecumenico / Cercatore di Dio')}</span>
                  <span class="text-[10px] sm:text-xs text-stone-400 block mt-0.5 leading-tight">${obT('onboarding.traditions.ecumenicalDesc', 'Terreno sacro comune e condiviso per ogni cercatore di verità')}</span>
                </button>
              </div>
            </div>

            <!-- 3. Question 3: Name / Pseudo-Account -->
            <div class="space-y-1.5 pt-1 border-t border-stone-200/50 dark:border-stone-800/50">
              <label class="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] font-sans" for="ob-username">
                ${obT('onboarding.nameQuestion', '3. Come desideri essere chiamato nel dialogo spirituale?')}
              </label>
              <input type="text" id="ob-username" autocomplete="name" value="${enteredName || ''}" placeholder="${obT('onboarding.namePlaceholder', 'Il tuo nome (oppure lascia vuoto per Discepolo)')}" class="w-full bg-[var(--bg-secondary)] border-2 border-stone-300 dark:border-stone-700 rounded-xl px-3.5 py-2.5 text-sm text-[var(--text-primary)] placeholder-stone-400 focus:outline-none focus:border-amber-600 transition" />
            </div>

            <!-- 4. Question 4: Monastic Schedule / Liturgy of the Hours Rhythm -->
            <div class="space-y-2.5 pt-1 border-t border-stone-200/50 dark:border-stone-800/50">
              <div class="flex items-center justify-between">
                <label class="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] font-sans">
                  ${obT('onboarding.monasticQuestion', '4. Quale ritmo di preghiera monastica desideri seguire?')}
                </label>
                <span class="text-[10px] text-amber-600 font-serif font-bold italic">«Ora et Labora»</span>
              </div>

              <div class="grid grid-cols-1 gap-2">
                <!-- Preset 1: Full Monastic -->
                <button type="button" class="monastic-btn p-2.5 sm:p-3 rounded-xl border-2 border-amber-600 bg-amber-600/10 text-left transition cursor-pointer shadow-sm" data-rhythm="monastic">
                  <div class="flex items-center justify-between">
                    <span class="monastic-title text-xs sm:text-sm font-bold font-display text-amber-500">⛪ ${obT('onboarding.rhythms.monasticTitle', 'Ritmo Monastico Completo (Ora et Labora)')}</span>
                    <span class="text-[10px] bg-amber-600/20 text-amber-600 px-1.5 py-0.5 rounded font-mono font-semibold">6 Ore</span>
                  </div>
                  <span class="text-[10px] sm:text-xs text-stone-400 block mt-1 leading-tight">
                    ${obT('onboarding.rhythms.monasticDesc', '06:00 Lodi • 09:00 Terza • 12:00 Sesta & Angelus • 15:00 Nona • 18:00 Vespri • 21:00 Compieta')}
                  </span>
                </button>

                <!-- Preset 2: Simple Daily -->
                <button type="button" class="monastic-btn p-2.5 sm:p-3 rounded-xl border-2 border-stone-300 dark:border-stone-800 bg-[var(--bg-secondary)] text-left hover:border-amber-600/50 transition cursor-pointer" data-rhythm="simple">
                  <div class="flex items-center justify-between">
                    <span class="monastic-title text-xs sm:text-sm font-bold font-display text-[var(--text-primary)]">🕊️ ${obT('onboarding.rhythms.simpleTitle', 'Ritmo Quotidiano Semplice (Secolare / Famiglia)')}</span>
                    <span class="text-[10px] bg-stone-500/20 text-stone-400 px-1.5 py-0.5 rounded font-mono font-semibold">3 Ore</span>
                  </div>
                  <span class="text-[10px] sm:text-xs text-stone-400 block mt-1 leading-tight">
                    ${obT('onboarding.rhythms.simpleDesc', '07:30 Mattino • 12:30 Angelus di Mezzogiorno • 21:30 Compieta & Riposo')}
                  </span>
                </button>

                <!-- Preset 3: Free / Disabled -->
                <button type="button" class="monastic-btn p-2.5 sm:p-3 rounded-xl border-2 border-stone-300 dark:border-stone-800 bg-[var(--bg-secondary)] text-left hover:border-amber-600/50 transition cursor-pointer" data-rhythm="disabled">
                  <div class="flex items-center justify-between">
                    <span class="monastic-title text-xs sm:text-sm font-bold font-display text-[var(--text-primary)]">🔇 ${obT('onboarding.rhythms.freeTitle', 'Preghiera Libera (Senza orari prefissati)')}</span>
                    <span class="text-[10px] bg-stone-500/20 text-stone-400 px-1.5 py-0.5 rounded font-mono font-semibold">Libero</span>
                  </div>
                  <span class="text-[10px] sm:text-xs text-stone-400 block mt-1 leading-tight">
                    ${obT('onboarding.rhythms.freeDesc', 'Nessuna sveglia o allarme prefissato. Prega spontaneamente secondo il tuo cuore.')}
                  </span>
                </button>
              </div>

              <!-- Notifications & Bell Chimes Toggle -->
              <label class="flex items-center gap-2.5 p-2.5 bg-[var(--bg-secondary)] rounded-xl border border-stone-300 dark:border-stone-700/80 cursor-pointer hover:border-amber-600/50 transition">
                <input type="checkbox" id="ob-notifications" ${enableNotifications ? 'checked' : ''} class="w-4 h-4 sm:w-4.5 sm:h-4.5 accent-amber-600 cursor-pointer rounded" />
                <div class="text-left flex-1 min-w-0">
                  <span class="text-xs sm:text-sm font-bold text-[var(--text-primary)] block">🔔 ${obT('onboarding.notifLabel', 'Attiva notifiche e rintocco della campana monastica')}</span>
                  <span class="text-[10px] text-[var(--text-muted)] block leading-tight">${obT('onboarding.notifSub', 'Risuona ad ogni ora canonica con versetto biblico e invito al raccoglimento')}</span>
                </div>
              </label>
            </div>

          </div>

          <!-- Sticky Footer Action Button (Always visible on mobile & desktop) -->
          <div class="p-3.5 sm:p-5 pt-3 pb-safe bg-[var(--bg-card)] border-t border-stone-200/60 dark:border-stone-800/60 flex-shrink-0">
            <button id="btn-complete-onboarding" type="button" class="w-full py-3.5 rounded-xl bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-bold text-sm sm:text-base shadow-lg transition transform active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2">
              <span>${obT('onboarding.beginJourney', 'Inizia il Cammino con Aura Sacra →')}</span>
            </button>
          </div>

        </div>
      </div>
    `;

    // Close button handler
    const closeBtn = container.querySelector('#btn-close-onboarding');
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        handleDismiss();
      });
    }

    // Dismiss when clicking outer backdrop
    const overlay = container.querySelector('#onboarding-overlay');
    if (overlay) {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          handleDismiss();
        }
      });
    }

    // 1. Language selector change handler (instantly switches language & re-renders modal)
    const langSelect = container.querySelector('#ob-language');
    if (langSelect) {
      langSelect.addEventListener('change', (e) => {
        selectedLanguage = e.target.value;
        const currentNameInput = container.querySelector('#ob-username');
        if (currentNameInput) enteredName = currentNameInput.value;
        const notifBox = container.querySelector('#ob-notifications');
        if (notifBox) enableNotifications = notifBox.checked;

        // Automatically align regional nationality if still on default universal
        if (selectedNationality === 'universal' && SUPPORTED_NATIONALITIES.includes(selectedLanguage)) {
          selectedNationality = selectedLanguage;
        }

        render();
      });
    }

    // 2. Nationality selector change handler
    const natSelect = container.querySelector('#ob-nationality');
    if (natSelect) {
      natSelect.addEventListener('change', (e) => {
        selectedNationality = e.target.value;
      });
    }

    // 3. Confession selection handler
    const updateConfSelection = (selected) => {
      container.querySelectorAll('.conf-btn').forEach((b) => {
        const isSel = b.getAttribute('data-conf') === selected;
        const titleSpan = b.querySelector('.conf-title');
        const isSpan2 = b.getAttribute('data-conf') === 'ecumenical';
        const baseSpan = isSpan2 ? 'sm:col-span-2 ' : '';

        if (isSel) {
          b.className = `conf-btn ${baseSpan}p-2.5 sm:p-3 rounded-xl border-2 border-amber-600 bg-amber-600/10 text-left transition cursor-pointer shadow-sm`;
          if (titleSpan) titleSpan.className = 'conf-title block text-xs sm:text-sm font-bold font-display text-amber-500';
        } else {
          b.className = `conf-btn ${baseSpan}p-2.5 sm:p-3 rounded-xl border-2 border-stone-300 dark:border-stone-800 bg-[var(--bg-secondary)] text-left hover:border-amber-600/50 transition cursor-pointer`;
          if (titleSpan) titleSpan.className = 'conf-title block text-xs sm:text-sm font-bold font-display text-[var(--text-primary)]';
        }
      });
    };

    container.querySelectorAll('.conf-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        selectedConfession = btn.getAttribute('data-conf');
        updateConfSelection(selectedConfession);
      });
    });
    updateConfSelection(selectedConfession);

    // 4. Monastic rhythm selection handler
    const updateRhythmSelection = (selected) => {
      container.querySelectorAll('.monastic-btn').forEach((b) => {
        const isSel = b.getAttribute('data-rhythm') === selected;
        const titleSpan = b.querySelector('.monastic-title');

        if (isSel) {
          b.className = 'monastic-btn p-2.5 sm:p-3 rounded-xl border-2 border-amber-600 bg-amber-600/10 text-left transition cursor-pointer shadow-sm';
          if (titleSpan) titleSpan.className = 'monastic-title text-xs sm:text-sm font-bold font-display text-amber-500';
        } else {
          b.className = 'monastic-btn p-2.5 sm:p-3 rounded-xl border-2 border-stone-300 dark:border-stone-800 bg-[var(--bg-secondary)] text-left hover:border-amber-600/50 transition cursor-pointer';
          if (titleSpan) titleSpan.className = 'monastic-title text-xs sm:text-sm font-bold font-display text-[var(--text-primary)]';
        }
      });
    };

    container.querySelectorAll('.monastic-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        selectedRhythm = btn.getAttribute('data-rhythm');
        updateRhythmSelection(selectedRhythm);
      });
    });
    updateRhythmSelection(selectedRhythm);

    // 5. Complete Button and Save Handler
    const completeBtn = container.querySelector('#btn-complete-onboarding');
    const nameInputEl = container.querySelector('#ob-username');
    const notifCheckbox = container.querySelector('#ob-notifications');

    if (completeBtn) {
      let isSaving = false;
      const handleComplete = async (e) => {
        if (e) e.preventDefault();
        if (isSaving) return;
        isSaving = true;

        completeBtn.disabled = true;
        completeBtn.style.opacity = '0.75';
        completeBtn.innerHTML = `<span>⏳</span> <span>${obT('onboarding.loading', 'Salvataggio in corso...')}</span>`;

        try {
          const nameInput = (nameInputEl?.value || enteredName || '').trim();
          const shouldEnableNotif = notifCheckbox ? notifCheckbox.checked : enableNotifications;

          // 1. Save Language and Nationality (Step 1)
          await setLanguage(selectedLanguage);
          await setSetting('user_language', selectedLanguage);
          await setSetting('user_nationality', selectedNationality);
          try {
            localStorage.setItem('aurasacra_language', selectedLanguage);
            localStorage.setItem('aurasacra_user_nationality', selectedNationality);
          } catch (e) {}

          // Automatically set appropriate historic Bible version for chosen language
          const defaultBible = getDefaultBibleForLanguage(selectedLanguage);
          if (defaultBible) {
            await setSetting('preferred_bible_version', defaultBible);
          }

          // 2. Save Confession (Step 2)
          await setSetting('user_confession', selectedConfession || 'ecumenical');
          await setSetting('confession', selectedConfession || 'ecumenical');
          await setSetting('penance_tradition', selectedConfession || 'ecumenical');
          try {
            localStorage.setItem('aurasacra_user_confession', selectedConfession || 'ecumenical');
          } catch (e) {}

          // 3. Save Name (Step 3)
          await setSetting('user_name', nameInput || 'Discepolo');
          if (nameInput) {
            try {
              localStorage.setItem('aurasacra_user_name', nameInput);
            } catch (e) {}
          }

          // 4. Save Monastic Schedule & Notifications (Step 4)
          await saveMonasticConfig({
            mode: selectedRhythm,
            notificationsEnabled: shouldEnableNotif && selectedRhythm !== 'disabled',
            playBell: shouldEnableNotif && selectedRhythm !== 'disabled'
          });

          // Mark onboarding completed
          await setSetting('onboarding_completed', true);
          try {
            localStorage.setItem('aurasacra_onboarding_completed', 'true');
          } catch (e) {}

          // Non-blocking fire-and-forget: browser notification prompt & audio unlock must NEVER block UI completion!
          if (shouldEnableNotif && selectedRhythm !== 'disabled') {
            requestNotificationPermission().catch(() => {});
            unlockAudio(false).catch(() => {});
          }
        } catch (err) {
          console.error('Onboarding save error:', err);
        } finally {
          container.innerHTML = '';
          if (typeof onComplete === 'function') {
            try { onComplete(); } catch (err) { console.error('onComplete callback err:', err); }
          }
        }
      };

      completeBtn.addEventListener('click', handleComplete);

      if (nameInputEl) {
        nameInputEl.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            handleComplete();
          }
        });
      }
    }
  }

  // Render immediately into the container (synchronous and unblocked)
  render();
}
