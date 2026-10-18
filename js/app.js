// Aura Sacra Main Application Controller
import { initDB, getSetting } from './db.js';
import { initCircadianTheme, onThemeChange } from './circadian.js';
import { initSchedule, onScheduleChange } from './schedule.js';
import { initI18n, onLanguageChange, t } from './i18n.js';
import { initMonasticScheduler } from './monastic-hours.js';

// Components
import { renderNavbar } from './components/navbar.js';
import { renderSidebar } from './components/sidebar.js';
import { renderBottomNav } from './components/bottom-nav.js';
import { renderFloatingCandle } from './components/floating-candle.js';
import { renderAudioPlayer } from './components/audio-player.js';
import { renderBibleReader } from './components/bible-reader.js';
import { renderJesusChat } from './components/jesus-chat.js';
import { renderPrayerJournal } from './components/prayer-journal.js';
import { renderSaintsView } from './components/saints-view.js';
import { renderFocusMode } from './components/focus-mode.js';
import { renderPenanceCalendar } from './components/penance-calendar.js';
import { initSpeechEngine } from './speech-engine.js';

// Modals
import { renderOnboardingModal } from './components/onboarding-modal.js';
import { renderSOSTemptationModal } from './components/sos-temptation.js';
import { renderJarPromisesModal } from './components/jar-promises.js';
import { renderEveningExamModal } from './components/evening-exam.js';
import { renderFaithCompassModal } from './components/faith-compass.js';
import { renderShareCardModal } from './components/share-card.js';
import { renderScheduleModal } from './components/schedule-modal.js';
import { renderFeedbackModal } from './components/feedback-modal.js';
import { renderSettingsModal } from './components/settings-modal.js';
import { renderToolsModal } from './components/tools-modal.js';

let activeTab = 'bible';
let pendingPrayerForJesus = null;

// Standalone Web App (PWA) Mode Detection
function setupStandaloneDetection() {
  const check = () => {
    const isStandalone = (
      window.matchMedia('(display-mode: standalone)').matches ||
      window.matchMedia('(display-mode: fullscreen)').matches ||
      window.matchMedia('(display-mode: minimal-ui)').matches ||
      window.navigator.standalone === true ||
      document.referrer.includes('android-app://')
    );
    if (isStandalone) {
      document.documentElement.classList.add('is-standalone-app');
    } else {
      document.documentElement.classList.remove('is-standalone-app');
    }
  };

  check();
  try {
    window.matchMedia('(display-mode: standalone)').addEventListener('change', check);
  } catch (e) {}
}

async function bootstrap() {
  setupStandaloneDetection();
  try { await initDB(); } catch (e) { console.warn('IndexedDB init:', e); }
  try { await initI18n(); } catch (e) { console.warn('i18n init:', e); }
  try { await initCircadianTheme(); } catch (e) { console.warn('Circadian init:', e); }
  try { await initSchedule(); } catch (e) { console.warn('Schedule init:', e); }
  try { await initMonasticScheduler(); } catch (e) { console.warn('Monastic scheduler init:', e); }
  try { await initSpeechEngine(); } catch (e) { console.warn('Speech engine init:', e); }

  // Deep Link URL Router for Widgets, Web Push Notifications, Monastic Alarms, and Shortcuts
  const urlParams = new URLSearchParams(window.location.search);
  const paramTab = urlParams.get('tab');
  const paramBook = urlParams.get('book');
  const paramChapter = urlParams.get('chapter') ? parseInt(urlParams.get('chapter'), 10) : null;
  const paramVerse = urlParams.get('verse') ? parseInt(urlParams.get('verse'), 10) : null;
  const paramShare = urlParams.get('share') === '1' || urlParams.get('share') === 'true';

  if (paramTab && ['bible', 'chat', 'journal', 'saints', 'focus', 'penance', 'about'].includes(paramTab)) {
    activeTab = paramTab;
  }

  const navbarContainer = document.getElementById('navbar-container');
  const sidebarContainer = document.getElementById('sidebar-container');
  const bottomNavContainer = document.getElementById('bottom-nav-container');
  const floatingCandleContainer = document.getElementById('floating-candle-container');
  const audioPlayerContainer = document.getElementById('audio-player-container');
  const mainContent = document.getElementById('main-content');
  const modalsContainer = document.getElementById('modals-container');

  if (!navbarContainer || !mainContent) {
    console.error('DOM containers not ready yet');
    setTimeout(bootstrap, 50);
    return;
  }

  // Modal Open/Close Manager
  const openModal = (modalType, extraData = {}) => {
    modalsContainer.innerHTML = '';
    const close = () => { modalsContainer.innerHTML = ''; };

    switch (modalType) {
      case 'sos':
        renderSOSTemptationModal(modalsContainer, close);
        break;
      case 'promises':
        renderJarPromisesModal(modalsContainer, close, (quote, cit) => {
          openModal('share', { quote, citation: cit });
        });
        break;
      case 'evening':
        renderEveningExamModal(modalsContainer, close);
        break;
      case 'doubts':
        renderFaithCompassModal(modalsContainer, close, (questionText) => {
          pendingPrayerForJesus = questionText;
          navigate('chat');
        });
        break;
      case 'share':
        renderShareCardModal(modalsContainer, extraData.quote, extraData.citation, close);
        break;
      case 'schedule':
        renderScheduleModal(modalsContainer, close);
        break;
      case 'feedback':
        renderFeedbackModal(modalsContainer, close);
        break;
      case 'settings':
        renderSettingsModal(modalsContainer, close, () => {
          renderAllNavigation();
          renderActiveView();
          renderFloatingCandle(floatingCandleContainer);
        });
        break;
      case 'tools':
        renderToolsModal(modalsContainer, close, navigate, openModal);
        break;
      default:
        break;
    }
  };

  // Tab Navigation
  const navigate = (tabId, options = {}) => {
    activeTab = tabId;
    renderAllNavigation();
    renderActiveView(options);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  function renderAllNavigation() {
    renderNavbar(navbarContainer, { activeTab }, navigate, openModal);
    renderSidebar(sidebarContainer, activeTab, navigate, openModal);
    renderBottomNav(bottomNavContainer, activeTab, navigate, openModal);
  }

  function renderActiveView(options = {}) {
    mainContent.innerHTML = '';
    switch (activeTab) {
      case 'bible':
        renderBibleReader(
          mainContent,
          (quote, ref) => {
            openModal('share', { quote, citation: ref });
          },
          {
            initialBook: options.book || paramBook,
            initialChapter: options.chapter || paramChapter,
            initialVerse: options.verse || paramVerse,
            autoShare: options.autoShare || paramShare
          }
        );
        break;
      case 'chat':
        renderJesusChat(mainContent, pendingPrayerForJesus);
        pendingPrayerForJesus = null;
        break;
      case 'journal':
        renderPrayerJournal(mainContent, (prayerText) => {
          pendingPrayerForJesus = prayerText;
          navigate('chat');
        });
        break;
      case 'saints':
        renderSaintsView(mainContent, (quote, name) => {
          openModal('share', { quote, citation: name });
        });
        break;
      case 'focus':
        renderFocusMode(mainContent);
        break;
      case 'penance':
        renderPenanceCalendar(mainContent, (quote, author) => {
          openModal('share', { quote, citation: author });
        });
        break;
      default:
        renderBibleReader(mainContent, (quote, ref) => openModal('share', { quote, citation: ref }));
        break;
    }
  }

  // Reactive updates for liturgical theme and work/school schedule changes
  onThemeChange(() => {
    renderAllNavigation();
  });

  onScheduleChange(() => {
    renderAllNavigation();
  });

  onLanguageChange(() => {
    renderAllNavigation();
    renderActiveView();
    renderFloatingCandle(floatingCandleContainer);
    if (audioPlayerContainer) renderAudioPlayer(audioPlayerContainer);
  });

  // Render initial static components
  renderAllNavigation();
  renderActiveView();
  renderFloatingCandle(floatingCandleContainer);
  if (audioPlayerContainer) renderAudioPlayer(audioPlayerContainer);

  // Handle modal deep links if present in URL
  if (paramTab === 'evening') {
    openModal('evening');
  } else if (paramTab === 'schedule') {
    openModal('schedule');
  } else if (paramTab === 'settings') {
    openModal('settings');
  } else if (paramTab === 'widget' || paramTab === 'random' || urlParams.get('random') === '1') {
    navigate('bible', { isRandom: true });
  }

  // Check Onboarding safely without blocking bootstrap
  try {
    const isCompletedSync = localStorage.getItem('aurasacra_onboarding_completed') === 'true';
    const onboardingCompleted = isCompletedSync || (await getSetting('onboarding_completed', false));
    if (!onboardingCompleted) {
      renderOnboardingModal(modalsContainer, () => {
        modalsContainer.innerHTML = '';
        renderAllNavigation();
        renderActiveView();
        renderFloatingCandle(floatingCandleContainer);
      }, true);
    }
  } catch (onboardingErr) {
    console.warn('Onboarding check warning:', onboardingErr);
  }

  // In-App Toast Banner for Canonical Monastic Hour Chimes
  window.addEventListener('aurasacra:monastic-chime', (e) => {
    const hour = e.detail?.hour;
    if (!hour) return;

    // Remove any existing toast
    const existing = document.getElementById('monastic-chime-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'monastic-chime-toast';
    toast.className = 'fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-md w-[92%] bg-[var(--bg-card)]/95 backdrop-blur-md border-2 border-amber-600 rounded-2xl p-3 sm:p-3.5 shadow-2xl flex items-center justify-between gap-3 animate-fade-in parchment-border';
    toast.innerHTML = `
      <div class="flex items-center gap-3 min-w-0">
        <span class="text-2xl flex-shrink-0">${hour.icon || '⛪'}</span>
        <div class="min-w-0">
          <h4 class="text-xs sm:text-sm font-bold font-display text-[var(--accent-vermilion)] truncate">
            ⛪ ${hour.name} (${hour.time})
          </h4>
          <p class="text-[11px] text-[var(--text-muted)] truncate">${hour.sub || ''}</p>
        </div>
      </div>
      <div class="flex items-center gap-2 flex-shrink-0">
        <button id="toast-btn-pray" class="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-bold text-xs shadow-md transition cursor-pointer">
          Prega Ora
        </button>
        <button id="toast-btn-close" class="p-1 text-stone-400 hover:text-[var(--text-primary)] transition cursor-pointer" title="Chiudi">
          ✕
        </button>
      </div>
    `;

    document.body.appendChild(toast);

    toast.querySelector('#toast-btn-close')?.addEventListener('click', () => {
      toast.remove();
    });

    toast.querySelector('#toast-btn-pray')?.addEventListener('click', () => {
      toast.remove();
      if (hour.tab === 'evening') {
        openModal('evening');
      } else if (hour.tab === 'focus') {
        navigate('focus');
      } else if (hour.book && hour.chapter) {
        navigate('bible', { book: hour.book, chapter: hour.chapter });
      } else {
        navigate('bible');
      }
    });

    // Auto dismiss after 20 seconds
    setTimeout(() => {
      if (document.body.contains(toast)) {
        toast.remove();
      }
    }, 20000);
  });

  // On mobile PWA reopening from background or returning to tab, load fresh random Scripture
  let lastBackgroundTime = 0;
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      lastBackgroundTime = Date.now();
    } else if (document.visibilityState === 'visible') {
      const elapsed = Date.now() - lastBackgroundTime;
      if (lastBackgroundTime > 0 && elapsed > 20000 && activeTab === 'bible' && !paramBook) {
        navigate('bible', { isRandom: true });
      }
    }
  });

  window.addEventListener('pageshow', (e) => {
    if (e.persisted && activeTab === 'bible' && !paramBook) {
      navigate('bible', { isRandom: true });
    }
  });

  // Keyboard accessibility
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      modalsContainer.innerHTML = '';
      const chimeToast = document.getElementById('monastic-chime-toast');
      if (chimeToast) chimeToast.remove();
    }
  });
}

// Launch safely across all browser lifecycle states
if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', () => {
    bootstrap().catch(err => console.error('Bootstrap error:', err));
  });
} else {
  bootstrap().catch(err => console.error('Bootstrap error:', err));
}