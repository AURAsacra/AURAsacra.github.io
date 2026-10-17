// Sacred Monastic Schedule & School/Work Focus Planner Modal for Aura Sacra
import { getSchedule, saveSchedule, getCurrentScheduleStatus } from '../schedule.js';
import { 
  getMonasticConfig, 
  saveMonasticConfig, 
  requestNotificationPermission, 
  testMonasticNotification, 
  getNextMonasticHour,
  getActiveMonasticHours,
  MONASTIC_HOURS_PRESETS 
} from '../monastic-hours.js';
import { playMonasticBell, unlockAudio } from '../audio-engine.js';
import { icons } from '../icons.js';
import { t } from '../i18n.js';

export function renderScheduleModal(container, onClose) {
  let activeTab = 'monastic'; // 'monastic' | 'focus'

  function render() {
    const currentFocus = getSchedule();
    const focusStatus = getCurrentScheduleStatus();
    const monasticConfig = getMonasticConfig();
    const nextHour = getNextMonasticHour();
    const activeHours = getActiveMonasticHours();

    container.innerHTML = `
      <div class="fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-black/75 backdrop-blur-sm p-3 sm:p-6 flex min-h-full items-center justify-center animate-fade-in">
        <div class="bg-[var(--bg-card)] border-2 border-stone-300 dark:border-stone-800 rounded-2xl sm:rounded-3xl max-w-lg w-full max-h-[92dvh] sm:max-h-[90vh] overflow-y-auto overscroll-contain p-5 sm:p-6 shadow-2xl relative space-y-5 parchment-border my-auto custom-scrollbar">
          
          <!-- Close Button -->
          <button id="btn-close-schedule" class="absolute top-4 right-4 text-stone-400 hover:text-[var(--text-primary)] p-1 cursor-pointer">
            ${icons.close('w-5 h-5')}
          </button>

          <!-- Header -->
          <div class="text-center">
            <div class="w-12 h-12 rounded-full border border-amber-500/40 bg-[var(--bg-secondary)] flex items-center justify-center mx-auto text-amber-600 mb-2">
              ${icons.clock('w-6 h-6')}
            </div>
            <h2 class="text-xl sm:text-2xl font-bold font-display text-[var(--accent-vermilion)]">
              ${t('scheduleModal.title', 'Orario Sacro & Routine Quotidiana')}
            </h2>
            <p class="text-xs text-[var(--text-muted)] italic font-serif">
              ${t('scheduleModal.subtitle', '«Ora et Labora» • Liturgia delle Ore monastiche e ore di concentrazione nello studio e lavoro')}
            </p>
          </div>

          <!-- Segmented Tab Switcher -->
          <div class="flex items-center p-1 bg-[var(--bg-secondary)] rounded-xl border border-stone-200 dark:border-stone-800 text-xs font-bold">
            <button id="tab-btn-monastic" class="flex-1 py-2 px-3 rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'monastic' 
                ? 'bg-amber-600 text-white shadow-sm' 
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }">
              <span>⛪</span>
              <span>Ore Canoniche</span>
            </button>
            <button id="tab-btn-focus" class="flex-1 py-2 px-3 rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'focus' 
                ? 'bg-amber-600 text-white shadow-sm' 
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }">
              <span>💼</span>
              <span>Studio & Lavoro</span>
            </button>
          </div>

          <!-- TAB 1: Monastic Hours -->
          ${activeTab === 'monastic' ? `
            <div class="space-y-4 animate-fade-in">
              <!-- Next Upcoming Hour Card -->
              ${nextHour ? `
                <div class="p-3.5 rounded-2xl bg-amber-600/10 border border-amber-600/30 flex items-center justify-between gap-3">
                  <div class="flex items-center gap-2.5 min-w-0">
                    <span class="text-2xl flex-shrink-0">${nextHour.hour.icon}</span>
                    <div class="min-w-0">
                      <p class="text-[10px] uppercase tracking-wider font-bold text-amber-600">Prossima Ora Canonica</p>
                      <h4 class="text-sm font-bold text-[var(--text-primary)] truncate">${nextHour.hour.name}</h4>
                      <p class="text-[11px] text-[var(--text-muted)] truncate">${nextHour.hour.sub}</p>
                    </div>
                  </div>
                  <div class="text-right flex-shrink-0">
                    <span class="px-2.5 py-1 rounded-xl bg-amber-600 text-white font-mono font-bold text-xs shadow-xs block text-center">
                      ${nextHour.hour.time}
                    </span>
                    <span class="text-[10px] text-amber-600 dark:text-amber-400 font-bold block mt-1">
                      tra ${nextHour.countdownStr}
                    </span>
                  </div>
                </div>
              ` : `
                <div class="p-3 rounded-xl bg-[var(--bg-secondary)] border border-stone-200 dark:border-stone-800 text-center text-xs text-[var(--text-muted)]">
                  Nessun orario monastico programmato (Modalità libera).
                </div>
              `}

              <!-- Monastic Rhythm Mode Select -->
              <div class="space-y-1.5">
                <label class="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] font-sans">
                  Ritmo di Preghiera Attivo:
                </label>
                <select id="modal-monastic-mode" class="w-full bg-[var(--bg-secondary)] border border-stone-300 dark:border-stone-700 rounded-xl px-3 py-2 text-xs font-semibold text-[var(--text-primary)] cursor-pointer">
                  <option value="monastic" ${monasticConfig.mode === 'monastic' ? 'selected' : ''}>⛪ Ritmo Monastico Completo (6 Ore Canoniche)</option>
                  <option value="simple" ${monasticConfig.mode === 'simple' ? 'selected' : ''}>🕊️ Ritmo Quotidiano Semplice (3 Ore)</option>
                  <option value="disabled" ${monasticConfig.mode === 'disabled' ? 'selected' : ''}>🔇 Preghiera Libera (Nessun allarme)</option>
                </select>
              </div>

              <!-- Notifications & Bell Toggles -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <label class="flex items-center gap-2.5 p-2.5 bg-[var(--bg-secondary)] rounded-xl border border-stone-300 dark:border-stone-700 cursor-pointer hover:border-amber-600/40 transition">
                  <input type="checkbox" id="modal-monastic-notif" ${monasticConfig.notificationsEnabled ? 'checked' : ''} class="w-4 h-4 accent-amber-600 rounded cursor-pointer" />
                  <div class="text-left flex-1 min-w-0">
                    <span class="text-xs font-bold text-[var(--text-primary)] block">🔔 Notifiche Orarie</span>
                    <span class="text-[10px] text-stone-400 block truncate">Push e locali</span>
                  </div>
                </label>

                <label class="flex items-center gap-2.5 p-2.5 bg-[var(--bg-secondary)] rounded-xl border border-stone-300 dark:border-stone-700 cursor-pointer hover:border-amber-600/40 transition">
                  <input type="checkbox" id="modal-monastic-bell" ${monasticConfig.playBell ? 'checked' : ''} class="w-4 h-4 accent-amber-600 rounded cursor-pointer" />
                  <div class="text-left flex-1 min-w-0">
                    <span class="text-xs font-bold text-[var(--text-primary)] block">🛎️ Campana Monastica</span>
                    <span class="text-[10px] text-stone-400 block truncate">Cattedrale bronzea</span>
                  </div>
                </label>
              </div>

              <!-- Canonical Hours List -->
              <div class="space-y-2">
                <label class="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] font-sans">
                  Ore Canoniche in Programma:
                </label>
                <div class="space-y-1.5 max-h-52 overflow-y-auto overscroll-contain pr-1 custom-scrollbar">
                  ${activeHours.map(h => `
                    <div class="flex items-center justify-between p-2.5 rounded-xl bg-[var(--bg-secondary)] border border-stone-200 dark:border-stone-800 text-xs">
                      <div class="flex items-center gap-2.5 min-w-0">
                        <span class="text-lg flex-shrink-0">${h.icon}</span>
                        <div class="min-w-0">
                          <span class="font-bold text-[var(--text-primary)] block truncate">${h.name}</span>
                          <span class="text-[10px] text-stone-400 block truncate">${h.sub}</span>
                        </div>
                      </div>
                      <span class="px-2 py-0.5 rounded-lg bg-amber-600/15 border border-amber-600/30 text-amber-600 font-mono font-bold text-xs flex-shrink-0">
                        ${h.time}
                      </span>
                    </div>
                  `).join('')}
                </div>
              </div>

              <!-- Quick Tests -->
              <div class="flex items-center gap-2 pt-1">
                <button type="button" id="modal-btn-test-bell" class="flex-1 py-2 px-3 rounded-xl bg-amber-600/10 hover:bg-amber-600/20 text-amber-600 border border-amber-600/30 text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer">
                  <span>🛎️</span>
                  <span>Rintocco di Prova</span>
                </button>
                <button type="button" id="modal-btn-test-notif" class="flex-1 py-2 px-3 rounded-xl bg-stone-500/10 hover:bg-stone-500/20 text-[var(--text-primary)] border border-stone-300 dark:border-stone-700 text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer">
                  <span>🔔</span>
                  <span>Notifica di Prova</span>
                </button>
              </div>
            </div>
          ` : `
            <!-- TAB 2: School & Work Focus Quiet Hours -->
            <div class="space-y-4 animate-fade-in">
              <!-- Current Status Banner -->
              <div class="p-3.5 rounded-xl border flex items-center gap-3 ${
                focusStatus.status === 'busy' ? 'border-red-500/40 bg-red-950/20 text-red-500 dark:text-red-400' :
                focusStatus.status === 'break' ? 'border-amber-500/40 bg-amber-950/20 text-amber-500 dark:text-amber-400' :
                'border-emerald-500/40 bg-emerald-950/20 text-emerald-600 dark:text-emerald-400'
              }">
                <span class="p-2 rounded-full bg-black/20">${icons.clock('w-5 h-5')}</span>
                <div>
                  <p class="text-xs font-bold uppercase tracking-wider font-sans">${t('scheduleModal.currentStatus', 'Stato Attuale:')} ${focusStatus.label}</p>
                  <p class="text-xs opacity-90">${focusStatus.description}</p>
                </div>
              </div>

              <form id="schedule-form" class="space-y-4 text-left">
                <!-- Enable Routine Toggle -->
                <div class="flex items-center justify-between p-3 bg-[var(--bg-secondary)] rounded-xl border border-stone-200 dark:border-stone-800">
                  <div>
                    <span class="text-sm font-bold text-[var(--text-primary)]">${t('scheduleModal.enableRoutine', 'Attiva Routine Studio / Lavoro')}</span>
                    <p class="text-xs text-[var(--text-muted)]">${t('scheduleModal.enableRoutineDesc', 'Silenzia i rintocchi durante le ore di lezione o riunioni')}</p>
                  </div>
                  <input type="checkbox" id="sched-enabled" ${currentFocus.enabled ? 'checked' : ''} class="w-5 h-5 accent-amber-600 cursor-pointer">
                </div>

                <!-- Busy Hours (Start - End) -->
                <div class="p-3.5 bg-[var(--bg-secondary)] rounded-xl border border-stone-200 dark:border-stone-800 space-y-2.5">
                  <span class="text-xs font-bold uppercase tracking-wider text-red-500 font-sans block">${t('scheduleModal.busyHoursTitle', '1. Ore di Impegno (Lezioni o Turno Lavorativo):')}</span>
                  <div class="grid grid-cols-2 gap-3">
                    <div>
                      <label class="block text-[11px] text-[var(--text-muted)] mb-1">${t('scheduleModal.busyStart', 'Inizio (es. 08:30):')}</label>
                      <input type="time" id="sched-busy-start" value="${currentFocus.busyStart}" class="w-full bg-[var(--bg-card)] border border-stone-300 dark:border-stone-700 rounded-lg px-3 py-1.5 text-sm font-mono text-[var(--text-primary)]" />
                    </div>
                    <div>
                      <label class="block text-[11px] text-[var(--text-muted)] mb-1">${t('scheduleModal.busyEnd', 'Fine (es. 16:30):')}</label>
                      <input type="time" id="sched-busy-end" value="${currentFocus.busyEnd}" class="w-full bg-[var(--bg-card)] border border-stone-300 dark:border-stone-700 rounded-lg px-3 py-1.5 text-sm font-mono text-[var(--text-primary)]" />
                    </div>
                  </div>
                </div>

                <!-- Break Times (Start - End) -->
                <div class="p-3.5 bg-[var(--bg-secondary)] rounded-xl border border-stone-200 dark:border-stone-800 space-y-2.5">
                  <span class="text-xs font-bold uppercase tracking-wider text-amber-500 font-sans block">${t('scheduleModal.breakTimesTitle', '2. Pausa Pranzo o Ricreazione:')}</span>
                  <div class="grid grid-cols-2 gap-3">
                    <div>
                      <label class="block text-[11px] text-[var(--text-muted)] mb-1">${t('scheduleModal.breakStart', 'Inizio Pausa (es. 12:30):')}</label>
                      <input type="time" id="sched-break-start" value="${currentFocus.breakStart}" class="w-full bg-[var(--bg-card)] border border-stone-300 dark:border-stone-700 rounded-lg px-3 py-1.5 text-sm font-mono text-[var(--text-primary)]" />
                    </div>
                    <div>
                      <label class="block text-[11px] text-[var(--text-muted)] mb-1">${t('scheduleModal.breakEnd', 'Fine Pausa (es. 13:30):')}</label>
                      <input type="time" id="sched-break-end" value="${currentFocus.breakEnd}" class="w-full bg-[var(--bg-card)] border border-stone-300 dark:border-stone-700 rounded-lg px-3 py-1.5 text-sm font-mono text-[var(--text-primary)]" />
                    </div>
                  </div>
                </div>

                <!-- Micro-pause duration -->
                <div class="p-3 bg-[var(--bg-secondary)] rounded-xl border border-stone-200 dark:border-stone-800 flex items-center justify-between">
                  <div>
                    <span class="text-xs font-bold text-[var(--text-primary)]">${t('scheduleModal.microPauseTitle', 'Micro-Pausa di Raccoglimento:')}</span>
                    <p class="text-[11px] text-[var(--text-muted)]">${t('scheduleModal.microPauseDesc', 'Breve momento di preghiera silenziosa durante le pause')}</p>
                  </div>
                  <select id="sched-micro" class="bg-[var(--bg-card)] border border-stone-300 dark:border-stone-700 rounded-lg px-2 py-1 text-xs font-sans text-[var(--text-primary)]">
                    <option value="30" ${currentFocus.microPauseDuration === 30 ? 'selected' : ''}>${t('scheduleModal.sec30', '30 Secondi')}</option>
                    <option value="60" ${currentFocus.microPauseDuration === 60 ? 'selected' : ''}>${t('scheduleModal.sec60', '60 Secondi')}</option>
                  </select>
                </div>

                <!-- Submit Button -->
                <button type="submit" class="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-bold text-sm shadow-md transition transform active:scale-95 cursor-pointer">
                  ${t('scheduleModal.save', 'Salva Routine')}
                </button>
              </form>
            </div>
          `}

        </div>
      </div>
    `;

    // Event handlers
    container.querySelector('#btn-close-schedule').addEventListener('click', onClose);

    container.querySelector('#tab-btn-monastic').addEventListener('click', () => {
      activeTab = 'monastic';
      render();
    });

    container.querySelector('#tab-btn-focus').addEventListener('click', () => {
      activeTab = 'focus';
      render();
    });

    if (activeTab === 'monastic') {
      const modeSelect = container.querySelector('#modal-monastic-mode');
      const notifCheck = container.querySelector('#modal-monastic-notif');
      const bellCheck = container.querySelector('#modal-monastic-bell');

      const saveChanges = async () => {
        const mode = modeSelect.value;
        const notif = notifCheck.checked;
        const bell = bellCheck.checked;
        await saveMonasticConfig({
          mode,
          notificationsEnabled: notif && mode !== 'disabled',
          playBell: bell && mode !== 'disabled'
        });
        if (notif && mode !== 'disabled') {
          try { await requestNotificationPermission(); } catch (e) {}
        }
        render();
      };

      modeSelect.addEventListener('change', saveChanges);
      notifCheck.addEventListener('change', saveChanges);
      bellCheck.addEventListener('change', saveChanges);

      container.querySelector('#modal-btn-test-bell').addEventListener('click', async () => {
        await unlockAudio(false);
        await playMonasticBell();
      });

      container.querySelector('#modal-btn-test-notif').addEventListener('click', async () => {
        if ('Notification' in window && Notification.permission !== 'granted') {
          await requestNotificationPermission();
        }
        await testMonasticNotification();
      });
    } else {
      const form = container.querySelector('#schedule-form');
      if (form) {
        form.addEventListener('submit', async (e) => {
          e.preventDefault();
          const enabled = container.querySelector('#sched-enabled').checked;
          const busyStart = container.querySelector('#sched-busy-start').value;
          const busyEnd = container.querySelector('#sched-busy-end').value;
          const breakStart = container.querySelector('#sched-break-start').value;
          const breakEnd = container.querySelector('#sched-break-end').value;
          const microPauseDuration = parseInt(container.querySelector('#sched-micro').value, 10);

          await saveSchedule({
            enabled,
            busyStart,
            busyEnd,
            breakStart,
            breakEnd,
            microPauseDuration
          });

          onClose();
        });
      }
    }
  }

  render();
}
