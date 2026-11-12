// Settings & Sacred Preferences Modal for Aura Sacra
import { getSetting, setSetting, exportAllData, importAllData } from '../db.js';
import { setLiturgicalThemeOverride } from '../circadian.js';
import { icons } from '../icons.js';
import { 
  getGeminiApiKey, 
  setGeminiApiKey, 
  testGeminiApiKey,
  getSelectedGeminiModel,
  setSelectedGeminiModel,
  AVAILABLE_MODELS
} from '../ai-engine.js';
import { t, getLanguage, setLanguage, SUPPORTED_LANGUAGES } from '../i18n.js';
import { 
  getMonasticConfig, 
  saveMonasticConfig, 
  requestNotificationPermission, 
  testMonasticNotification, 
  getNextMonasticHour,
  MONASTIC_HOURS_PRESETS 
} from '../monastic-hours.js';
import { playMonasticBell, unlockAudio } from '../audio-engine.js';
import { renderOnboardingModal } from './onboarding-modal.js';

export async function renderSettingsModal(container, onClose, onRefresh) {
  const currentLanguage = getLanguage();
  const currentNationality = await getSetting('user_nationality', 'universal');
  const currentConfession = await getSetting('user_confession', 'ecumenical');
  const currentThemeOverride = await getSetting('theme_override', 'auto');
  const currentUserName = await getSetting('user_name', '');
  const currentGeminiKey = await getGeminiApiKey();
  const currentGeminiModel = getSelectedGeminiModel();
  const monasticConfig = getMonasticConfig();
  const nextHourInfo = getNextMonasticHour();

  function render() {
    container.innerHTML = `
      <div class="fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-black/75 backdrop-blur-sm p-3 sm:p-6 flex min-h-full items-center justify-center animate-fade-in">
        <div class="bg-[var(--bg-card)] border-2 border-stone-300 dark:border-stone-800 rounded-2xl sm:rounded-3xl max-w-lg w-full max-h-[92dvh] sm:max-h-[90vh] overflow-y-auto overscroll-contain p-5 sm:p-6 shadow-2xl relative space-y-6 parchment-border my-auto custom-scrollbar">
          
          <!-- Close Button -->
          <button id="btn-close-settings" class="absolute top-4 right-4 text-stone-400 hover:text-[var(--text-primary)] p-1 cursor-pointer">
            ${icons.close('w-5 h-5')}
          </button>

          <!-- Header -->
          <div class="text-center">
            <div class="w-12 h-12 rounded-full border border-stone-400/40 bg-[var(--bg-secondary)] flex items-center justify-center mx-auto text-amber-600 mb-2">
              ${icons.settings('w-6 h-6')}
            </div>
            <h2 class="text-2xl font-bold font-display text-[var(--accent-vermilion)]">
              ${t('settings.title', 'Impostazioni & Preferenze Sacre')}
            </h2>
            <p class="text-xs text-[var(--text-muted)] italic font-serif">
              ${t('settings.subtitle', 'Personalizza lingua, orario monastico, tema circadiano e backup 100% offline')}
            </p>
          </div>

          <!-- Language Selector -->
          <div class="space-y-2 bg-[var(--bg-secondary)] p-3 rounded-2xl border border-amber-600/30">
            <div class="flex items-center justify-between">
              <label class="block text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-500 font-sans flex items-center gap-1.5">
                <span>🌐</span>
                <span>${t('settings.language', 'Lingua Interfaccia:')}</span>
              </label>
              <span class="text-[10px] text-[var(--text-muted)] font-mono">${SUPPORTED_LANGUAGES.length} ${t('settings.nativeLangs', 'Lingue')}</span>
            </div>
            <select id="setting-language" class="w-full bg-[var(--bg-card)] border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2.5 text-sm text-[var(--text-primary)] font-semibold cursor-pointer">
              ${SUPPORTED_LANGUAGES.map(lang => `
                <option value="${lang.code}" ${currentLanguage === lang.code ? 'selected' : ''}>
                  ${lang.flag} ${lang.name} (${lang.nativeName})
                </option>
              `).join('')}
            </select>
          </div>

          <!-- Nationality & Regional Heritage -->
          <div class="space-y-2 bg-[var(--bg-secondary)] p-3 rounded-2xl border border-stone-300 dark:border-stone-700">
            <div class="flex items-center justify-between">
              <label class="block text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] font-sans flex items-center gap-1.5">
                <span>🌍</span>
                <span>${t('settings.nationality', 'Nazionalità / Devozione Regionale:')}</span>
              </label>
            </div>
            <p class="text-[11px] text-[var(--text-muted)] font-serif italic">
              ${t('settings.nationalityDesc', 'Indipendente dalla lingua dei testi. Scegli le tradizioni devozionali locali o mantieni Universale.')}
            </p>
            <select id="setting-nationality" class="w-full bg-[var(--bg-card)] border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-sm text-[var(--text-primary)] font-medium cursor-pointer">
              <option value="universal" ${currentNationality === 'universal' ? 'selected' : ''}>🌍 ${t('settings.nationalities.universal', 'Universale / Tutte le Nazioni')}</option>
              <option value="it" ${currentNationality === 'it' ? 'selected' : ''}>🇮🇹 ${t('settings.nationalities.it', 'Italia & Tradizione Latina')}</option>
              <option value="gr" ${currentNationality === 'gr' ? 'selected' : ''}>🇬🇷 ${t('settings.nationalities.gr', 'Grecia & Monte Athos')}</option>
              <option value="ro" ${currentNationality === 'ro' ? 'selected' : ''}>🇷🇴 ${t('settings.nationalities.ro', 'Romania & Moldavia')}</option>
              <option value="ru" ${currentNationality === 'ru' ? 'selected' : ''}>☦️ ${t('settings.nationalities.ru', 'Tradizione Slava & Rus’')}</option>
              <option value="ge" ${currentNationality === 'ge' ? 'selected' : ''}>🇬🇪 ${t('settings.nationalities.ge', 'Georgia & Caucaso')}</option>
              <option value="rs" ${currentNationality === 'rs' ? 'selected' : ''}>🇷🇸 ${t('settings.nationalities.rs', 'Serbia & Balcani')}</option>
              <option value="es" ${currentNationality === 'es' ? 'selected' : ''}>🇪🇸 ${t('settings.nationalities.es', 'Spagna & Americhe Ispaniche')}</option>
              <option value="fr" ${currentNationality === 'fr' ? 'selected' : ''}>🇫🇷 ${t('settings.nationalities.fr', 'Francia & Tradizione Gallicana')}</option>
              <option value="de" ${currentNationality === 'de' ? 'selected' : ''}>🇩🇪 ${t('settings.nationalities.de', 'Germania & Europa Centrale')}</option>
              <option value="en" ${currentNationality === 'en' ? 'selected' : ''}>🇬🇧 ${t('settings.nationalities.en', 'Anglosfera & Diaspora Globale')}</option>
              <option value="pt" ${currentNationality === 'pt' ? 'selected' : ''}>🇵🇹 ${t('settings.nationalities.pt', 'Portogallo & Tradizione Lusofona')}</option>
            </select>
          </div>

          <!-- Confession / Tradition Selector -->
          <div class="space-y-2">
            <label class="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] font-sans">
              ${t('settings.confession', 'Tradizione di Fede Cristiana:')}
            </label>
            <select id="setting-confession" class="w-full bg-[var(--bg-secondary)] border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-sm text-[var(--text-primary)] cursor-pointer">
              <option value="catholic" ${currentConfession === 'catholic' ? 'selected' : ''}>${t('settings.confessions.catholic', 'Cattolico (Romano)')}</option>
              <option value="orthodox" ${currentConfession === 'orthodox' ? 'selected' : ''}>${t('settings.confessions.orthodox', 'Ortodosso (Bizantino Orientale)')}</option>
              <option value="protestant" ${currentConfession === 'protestant' ? 'selected' : ''}>${t('settings.confessions.protestant', 'Protestante / Evangelico')}</option>
              <option value="ecumenical" ${currentConfession === 'ecumenical' ? 'selected' : ''}>${t('settings.confessions.ecumenical', 'Ecumenico / Cercatore Spirituale')}</option>
            </select>
          </div>

          <!-- Name -->
          <div class="space-y-2">
            <label class="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] font-sans">
              ${t('settings.name', 'Nome o Titolo con cui rivolgersi:')}
            </label>
            <input type="text" id="setting-username" value="${currentUserName}" placeholder="${t('settings.namePlaceholder', 'es. Giovanni, Maria, o lascia vuoto...')}" class="w-full bg-[var(--bg-secondary)] border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-sm text-[var(--text-primary)]" />
          </div>

          <!-- Circadian Liturgical Theme Override -->
          <div class="space-y-2">
            <label class="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] font-sans">
              ${t('settings.theme', 'Tema Circadiano Liturgico:')}
            </label>
            <select id="setting-theme" class="w-full bg-[var(--bg-secondary)] border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-sm text-[var(--text-primary)] cursor-pointer">
              <option value="auto" ${currentThemeOverride === 'auto' ? 'selected' : ''}>${t('settings.themeAuto', 'Automatico (adattato all’orario solare)')}</option>
              <option value="dawn" ${currentThemeOverride === 'dawn' ? 'selected' : ''}>${t('settings.themeDawn', 'Aurora / Lodi (Luce dorata)')}</option>
              <option value="midday" ${currentThemeOverride === 'midday' ? 'selected' : ''}>${t('settings.themeMidday', 'Mezzogiorno / Studio (Pergamena calda)')}</option>
              <option value="sunset" ${currentThemeOverride === 'sunset' ? 'selected' : ''}>${t('settings.themeSunset', 'Tramonto / Vespri (Ambra cera d’api)')}</option>
              <option value="night" ${currentThemeOverride === 'night' ? 'selected' : ''}>${t('settings.themeNight', 'Notte / Compieta (Cattedrale oscura)')}</option>
            </select>
          </div>

          <!-- ======================================================== -->
          <!-- Monastic Schedule & Liturgy of the Hours Settings -->
          <!-- ======================================================== -->
          <div class="pt-4 border-t border-stone-200 dark:border-stone-800 space-y-3.5">
            <div class="flex items-center justify-between">
              <label class="block text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-500 font-sans flex items-center gap-1.5">
                <span>⛪</span>
                <span>${t('settings.monasticTitle', 'Orario Monastico & Ore Canoniche:')}</span>
              </label>
              ${nextHourInfo ? `
                <span class="text-[10px] text-amber-600 bg-amber-600/10 border border-amber-600/30 px-2 py-0.5 rounded-full font-sans font-bold flex items-center gap-1">
                  <span>⏳</span>
                  <span>${nextHourInfo.hour.name} (${nextHourInfo.countdownStr})</span>
                </span>
              ` : ''}
            </div>

            <p class="text-[11px] text-[var(--text-muted)] font-serif italic">
              ${t('settings.monasticSubtitle', 'Regola la Liturgia delle Ore, le notifiche e la campana monastica della cattedrale.')}
            </p>

            <!-- Mode Selector -->
            <div class="space-y-1.5">
              <label class="block text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] font-sans" for="setting-monastic-mode">
                ${t('settings.monasticMode', 'Ritmo di Preghiera Desiderato:')}
              </label>
              <select id="setting-monastic-mode" class="w-full bg-[var(--bg-secondary)] border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-xs font-semibold text-[var(--text-primary)] cursor-pointer">
                <option value="monastic" ${monasticConfig.mode === 'monastic' ? 'selected' : ''}>⛪ ${t('settings.monasticFull', 'Ritmo Monastico Completo (6 Ore Canoniche)')}</option>
                <option value="simple" ${monasticConfig.mode === 'simple' ? 'selected' : ''}>🕊️ ${t('settings.monasticSimple', 'Ritmo Quotidiano Semplice (3 Ore: Mattino, Angelus, Compieta)')}</option>
                <option value="disabled" ${monasticConfig.mode === 'disabled' ? 'selected' : ''}>🔇 ${t('settings.monasticDisabled', 'Preghiera Libera (Nessun orario prefissato)')}</option>
              </select>
            </div>

            <!-- Toggles Row: Notifications & Cathedral Bell -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <label class="flex items-center gap-2.5 p-2.5 bg-[var(--bg-secondary)] rounded-xl border border-stone-300 dark:border-stone-700/80 cursor-pointer hover:border-amber-600/40 transition">
                <input type="checkbox" id="setting-monastic-notif" ${monasticConfig.notificationsEnabled ? 'checked' : ''} class="w-4 h-4 accent-amber-600 cursor-pointer rounded" />
                <div class="text-left flex-1 min-w-0">
                  <span class="text-xs font-bold text-[var(--text-primary)] block">🔔 ${t('settings.monasticNotif', 'Notifiche Push & Locali')}</span>
                  <span class="text-[10px] text-stone-400 block truncate" id="setting-notif-perm-status">
                    ${'Notification' in window && Notification.permission === 'granted' ? t('settings.notifAllowed', '✓ Consentite') : t('settings.notifPrompt', 'Tocca per attivare')}
                  </span>
                </div>
              </label>

              <label class="flex items-center gap-2.5 p-2.5 bg-[var(--bg-secondary)] rounded-xl border border-stone-300 dark:border-stone-700/80 cursor-pointer hover:border-amber-600/40 transition">
                <input type="checkbox" id="setting-monastic-bell" ${monasticConfig.playBell ? 'checked' : ''} class="w-4 h-4 accent-amber-600 cursor-pointer rounded" />
                <div class="text-left flex-1 min-w-0">
                  <span class="text-xs font-bold text-[var(--text-primary)] block">🛎️ ${t('settings.monasticBell', 'Campana Monastica')}</span>
                  <span class="text-[10px] text-stone-400 block truncate">${t('settings.monasticBellDesc', 'Rintocco cattedrale offline')}</span>
                </div>
              </label>
            </div>

            <!-- Active Hours Preview Cards -->
            <div id="setting-monastic-hours-preview" class="space-y-1.5 pt-1">
              <!-- Dynamically populated -->
            </div>

            <!-- Test Chime & Test Notification Row -->
            <div class="flex items-center gap-2 pt-1">
              <button type="button" id="btn-test-monastic-bell" class="flex-1 py-2 px-2.5 rounded-xl bg-amber-600/10 hover:bg-amber-600/20 text-amber-600 border border-amber-600/30 text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer">
                <span>🛎️</span>
                <span>${t('settings.testBell', 'Prova Campana')}</span>
              </button>

              <button type="button" id="btn-test-monastic-notif" class="flex-1 py-2 px-2.5 rounded-xl bg-stone-500/10 hover:bg-stone-500/20 text-[var(--text-primary)] border border-stone-300 dark:border-stone-700 text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer">
                <span>🔔</span>
                <span>${t('settings.testNotif', 'Test Notifica')}</span>
              </button>
            </div>
          </div>

          <!-- Gemini AI Engine (Questions & Doubts) -->
          <div class="pt-4 border-t border-stone-200 dark:border-stone-800 space-y-3">
            <div class="flex items-center justify-between">
              <label class="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] font-sans">
                ${t('settings.aiTitle', 'Google Gemini AI (Domande & Fede):')}
              </label>
              <span class="text-[11px] font-sans font-semibold text-amber-600 flex items-center gap-1">
                ${icons.sparkles('w-3.5 h-3.5')}
                <span>${t('settings.aiReasoning', 'Ragionamento Teologico')}</span>
              </span>
            </div>

            <!-- Gemini API Key -->
            <div class="space-y-1.5">
              <div class="flex items-center justify-between text-xs">
                <label for="setting-gemini-key" class="text-[var(--text-muted)] font-medium">${t('settings.aiKey', 'Chiave API Google Gemini:')}</label>
                <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" class="text-amber-600 hover:underline font-medium">
                  ${t('settings.aiKeyLink', 'Ottieni chiave gratuita su Google AI Studio ↗')}
                </a>
              </div>
              <div class="relative">
                <input type="password" id="setting-gemini-key" value="${currentGeminiKey}" placeholder="AIza..." autocomplete="off" spellcheck="false" class="w-full bg-[var(--bg-secondary)] border border-stone-300 dark:border-stone-700 rounded-xl pl-3 pr-20 py-2 text-xs font-mono text-[var(--text-primary)]" />
                <div class="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
                  <button type="button" id="btn-clear-setting-key" title="${t('apiKeyModal.clearInput', 'Cancella')}" class="p-1.5 rounded-lg text-stone-400 hover:text-red-500 hover:bg-red-500/10 transition cursor-pointer">
                    ${icons.trash('w-3.5 h-3.5')}
                  </button>
                  <button type="button" id="btn-toggle-setting-key" class="p-1.5 rounded-lg text-stone-400 hover:text-[var(--text-primary)] hover:bg-stone-500/10 transition cursor-pointer">
                    ${icons.eye('w-3.5 h-3.5')}
                  </button>
                </div>
              </div>
              <div class="flex items-center justify-between gap-2 pt-0.5">
                <button type="button" id="btn-test-setting-key" class="py-1.5 px-3 rounded-xl bg-amber-600/10 hover:bg-amber-600/20 text-amber-600 border border-amber-600/30 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50">
                  ${icons.check('w-3.5 h-3.5')}
                  <span>${t('settings.testKey', 'Verifica Connessione')}</span>
                </button>
                <span id="setting-key-feedback" class="text-[11px] font-sans font-semibold text-right"></span>
              </div>
            </div>

            <!-- Gemini Model Selection -->
            <div class="space-y-1.5">
              <label for="setting-gemini-model" class="block text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] font-sans">
                ${t('settings.aiModel', 'Modello / Versione Gemini AI:')}
              </label>
              <select id="setting-gemini-model" class="w-full bg-[var(--bg-secondary)] border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-xs font-semibold text-[var(--text-primary)] cursor-pointer">
                ${AVAILABLE_MODELS.map(m => `
                  <option value="${m.id}" ${m.id === currentGeminiModel ? 'selected' : ''}>${m.name} — ${m.desc}</option>
                `).join('')}
              </select>
              <p class="text-[11px] text-stone-400 italic font-serif">
                ${t('settings.modelRecommended', 'Consigliato: <strong>Gemini 2.5 Flash</strong> per massima stabilità, alta velocità e risposte complete senza troncamenti.')}
              </p>
            </div>

            <!-- Offline Dialogue Policy Notice -->
            <div class="bg-[var(--bg-secondary)] border border-stone-300 dark:border-stone-700 rounded-xl p-3 space-y-1">
              <div class="flex items-center gap-1.5 text-xs font-bold text-[var(--text-primary)]">
                ${icons.shield('w-3.5 h-3.5 text-amber-600')}
                <span>${t('settings.offlinePolicy', 'Politica Dialogo Offline:')}</span>
              </div>
              <p class="text-[11px] text-[var(--text-muted)] leading-relaxed">
                ${t('settings.offlineNotice', 'Se il modello Gemini Nano locale non è scaricato su questo dispositivo, il dialogo AI offline è disabilitato per evitare risposte imprecise o preconfezionate.')}
              </p>
            </div>
          </div>

          <!-- Backup Data (100% Offline) -->
          <div class="pt-4 border-t border-stone-200 dark:border-stone-800 space-y-3">
            <label class="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] font-sans">
              ${t('settings.backupTitle', 'Sovranità dei Dati • Backup JSON 100% Offline:')}
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button type="button" id="btn-export-json" class="py-2.5 px-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-[var(--bg-secondary)] hover:border-amber-600/50 text-xs font-medium text-[var(--text-primary)] flex items-center justify-center gap-2 transition cursor-pointer">
                ${icons.download('w-4 h-4')}
                <span>${t('settings.exportBackup', 'Esporta Tutti i Dati (Backup JSON)')}</span>
              </button>
              <label class="py-2.5 px-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-[var(--bg-secondary)] hover:border-amber-600/50 text-xs font-medium text-[var(--text-primary)] flex items-center justify-center gap-2 transition cursor-pointer">
                <span>${t('settings.importBackup', 'Importa Backup')}</span>
                <input type="file" id="input-import-json" accept=".json,application/json" class="hidden" />
              </label>
            </div>
            <p class="text-[11px] text-[var(--text-muted)] italic font-serif">
              ${t('settings.backupDesc', 'Nessun dato lascia mai il tuo dispositivo. Puoi salvare note, preghiere e conversazioni in un file JSON per trasferirle tra dispositivi.')}
            </p>
          </div>

          <!-- Save Button -->
          <button id="btn-save-settings" type="button" class="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-bold text-sm shadow-md transition active:scale-95 cursor-pointer">
            ${t('settings.save', 'Salva Impostazioni')}
          </button>

          <!-- Re-run Initial Setup / Onboarding Button -->
          <button id="btn-rerun-onboarding" type="button" class="w-full py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 hover:border-amber-600/50 text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)] transition cursor-pointer">
            ${t('settings.rerunOnboarding', 'Rivedi Configurazione Iniziale')}
          </button>

        </div>
      </div>
    `;

    // Render Monastic hours preview based on selected mode
    const previewContainer = container.querySelector('#setting-monastic-hours-preview');
    const monasticModeSelect = container.querySelector('#setting-monastic-mode');

    function updateMonasticPreview() {
      if (!previewContainer || !monasticModeSelect) return;
      const mode = monasticModeSelect.value;
      const preset = MONASTIC_HOURS_PRESETS[mode];

      if (mode === 'disabled' || !preset || !Array.isArray(preset.hours) || preset.hours.length === 0) {
        previewContainer.innerHTML = `
          <div class="p-3 bg-[var(--bg-secondary)] rounded-xl border border-stone-300 dark:border-stone-700 text-center text-[11px] text-[var(--text-muted)] font-serif italic">
            ${t('settings.monasticFreeNote', 'Preghiera libera attiva: nessun allarme o rintocco programmato.')}
          </div>
        `;
        return;
      }

      previewContainer.innerHTML = preset.hours.map(h => `
        <div class="flex items-center justify-between p-2 bg-[var(--bg-secondary)] rounded-xl border border-stone-300 dark:border-stone-700">
          <div class="flex items-center gap-2 min-w-0">
            <span class="text-base flex-shrink-0">${h.icon || '⛪'}</span>
            <div class="min-w-0">
              <span class="text-xs font-bold text-[var(--text-primary)] block truncate">${t(`monasticHours.${h.id}.name`, h.nameEn)}</span>
              <span class="text-[10px] text-stone-400 block truncate">${t(`monasticHours.${h.id}.sub`, h.subEn || '')}</span>
            </div>
          </div>
          <span class="text-[11px] font-mono font-bold text-amber-600 bg-amber-600/10 border border-amber-600/30 px-2 py-0.5 rounded-full flex-shrink-0">${h.time}</span>
        </div>
      `).join('');
    }

    updateMonasticPreview();
    if (monasticModeSelect) {
      monasticModeSelect.addEventListener('change', updateMonasticPreview);
    }

    // Monastic bell test
    const testBellBtn = container.querySelector('#btn-test-monastic-bell');
    if (testBellBtn) {
      testBellBtn.addEventListener('click', async () => {
        try {
          await unlockAudio(false);
          await playMonasticBell();
        } catch (e) {
          console.warn('Bell test error:', e);
        }
      });
    }

    // Monastic notification test
    const testNotifBtn = container.querySelector('#btn-test-monastic-notif');
    if (testNotifBtn) {
      testNotifBtn.addEventListener('click', async () => {
        try {
          const permStatusEl = container.querySelector('#setting-notif-perm-status');
          if ('Notification' in window && Notification.permission !== 'granted') {
            const granted = await requestNotificationPermission();
            if (permStatusEl) {
              permStatusEl.textContent = granted
                ? t('settings.notifAllowed', '✓ Allowed')
                : t('settings.notifDenied', 'Permission not granted');
            }
          }
          await testMonasticNotification();
        } catch (e) {
          console.warn('Notification test error:', e);
        }
      });
    }

    // Close
    container.querySelector('#btn-close-settings')?.addEventListener('click', onClose);

    // Re-run Onboarding Setup
    const rerunBtn = container.querySelector('#btn-rerun-onboarding');
    if (rerunBtn) {
      rerunBtn.addEventListener('click', () => {
        renderOnboardingModal(container, () => {
          container.innerHTML = '';
          if (typeof onRefresh === 'function') onRefresh();
        }, true);
      });
    }

    // Toggle key visibility
    const keyInput = container.querySelector('#setting-gemini-key');
    const toggleKeyBtn = container.querySelector('#btn-toggle-setting-key');
    if (toggleKeyBtn && keyInput) {
      toggleKeyBtn.addEventListener('click', () => {
        const isHidden = keyInput.type === 'password';
        keyInput.type = isHidden ? 'text' : 'password';
        toggleKeyBtn.innerHTML = isHidden ? icons.eyeOff('w-3.5 h-3.5') : icons.eye('w-3.5 h-3.5');
      });
    }

    // Clear key input
    const clearKeyBtn = container.querySelector('#btn-clear-setting-key');
    if (clearKeyBtn && keyInput) {
      clearKeyBtn.addEventListener('click', () => {
        keyInput.value = '';
        keyInput.focus();
      });
    }

    // Test Gemini Key
    const testKeyBtn = container.querySelector('#btn-test-setting-key');
    const feedbackSpan = container.querySelector('#setting-key-feedback');
    if (testKeyBtn && keyInput && feedbackSpan) {
      testKeyBtn.addEventListener('click', async () => {
        const val = keyInput.value.trim().replace(/^["']|["']$/g, '');
        if (!val) {
          feedbackSpan.textContent = t('settings.pasteKeyFirst', 'Incolla prima una chiave API.');
          feedbackSpan.className = 'text-[11px] font-sans font-semibold text-right text-red-500';
          return;
        }
        testKeyBtn.disabled = true;
        feedbackSpan.textContent = t('settings.testingKey', 'Verifica chiave API Gemini in corso...');
        feedbackSpan.className = 'text-[11px] font-sans font-semibold text-right text-stone-500';
        try {
          await testGeminiApiKey(val);
          feedbackSpan.textContent = t('settings.validKey', '✓ Chiave API valida!');
          feedbackSpan.className = 'text-[11px] font-sans font-semibold text-right text-emerald-600';
        } catch (err) {
          feedbackSpan.textContent = err.message;
          feedbackSpan.className = 'text-[11px] font-sans font-semibold text-right text-red-500';
        } finally {
          testKeyBtn.disabled = false;
        }
      });
    }

    // Save Settings
    const saveBtn = container.querySelector('#btn-save-settings');
    if (saveBtn) {
      saveBtn.addEventListener('click', async () => {
        const newLanguage = container.querySelector('#setting-language').value;
        const nationality = container.querySelector('#setting-nationality').value;
        const confession = container.querySelector('#setting-confession').value;
        const userName = container.querySelector('#setting-username').value.trim();
        const themeOverride = container.querySelector('#setting-theme').value;
        const geminiKey = container.querySelector('#setting-gemini-key').value;
        const geminiModel = container.querySelector('#setting-gemini-model').value;
        const monasticMode = container.querySelector('#setting-monastic-mode').value;
        const monasticNotif = container.querySelector('#setting-monastic-notif').checked;
        const monasticBell = container.querySelector('#setting-monastic-bell').checked;

        await setSetting('user_nationality', nationality);
        await setSetting('user_confession', confession);
        // Auto-set bible canon based on confession
        const canonMap = { catholic: 'catholic', orthodox: 'orthodox', protestant: 'protestant' };
        const autoCanon = canonMap[confession] || 'all';
        await setSetting('preferred_canon', autoCanon);
        try {
          localStorage.setItem('aurasacra_user_nationality', nationality);
          localStorage.setItem('aurasacra_user_confession', confession);
        } catch (e) {}
        await setSetting('user_name', userName);
        await setGeminiApiKey(geminiKey);
        setSelectedGeminiModel(geminiModel);
        await setLiturgicalThemeOverride(themeOverride);

        // Save Monastic Config
        await saveMonasticConfig({
          mode: monasticMode,
          notificationsEnabled: monasticNotif && monasticMode !== 'disabled',
          playBell: monasticBell && monasticMode !== 'disabled'
        });

        // Non-blocking notification permission request (UI closes immediately)
        if (monasticNotif && monasticMode !== 'disabled') {
          requestNotificationPermission().catch(() => {});
        }

        if (newLanguage !== currentLanguage) {
          await setLanguage(newLanguage);
        }

        onClose();
        if (typeof onRefresh === 'function') onRefresh();
      });
    }

    // Export JSON Backup
    const exportBtn = container.querySelector('#btn-export-json');
    if (exportBtn) {
      exportBtn.addEventListener('click', async () => {
        const dataStr = await exportAllData();
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `aurasacra_backup_${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
    }

    // Import JSON Backup
    const importInput = container.querySelector('#input-import-json');
    if (importInput) {
      importInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async (ev) => {
          try {
            await importAllData(ev.target.result);
            alert(t('settings.backupRestored', 'Backup ripristinato con successo!'));
            window.location.reload();
          } catch (err) {
            console.error(err);
            alert(t('settings.invalidBackup', 'Formato del file di backup non valido.'));
          }
        };
        reader.readAsText(file);
      });
    }
  }

  render();
}
