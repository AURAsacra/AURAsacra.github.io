// js/candle-timer.js
// Centralized, synchronized Living Candle Focus Timer for Aura Sacra
// Handles cross-tab sync, standalone popup sync, PiP continuity, Date.now() drift immunity,
// and harmonious monastic bell sequencing before completion messages.

import { playMonasticBell, unlockAudio } from './audio-engine.js';
import { t } from './i18n.js';

const STORAGE_KEY = 'aurasacra_candle_timer';
const SYNC_CHANNEL_NAME = 'aurasacra_candle_sync';

let channel = null;
if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  try {
    channel = new BroadcastChannel(SYNC_CHANNEL_NAME);
  } catch (e) {
    channel = null;
  }
}

// In-memory state with defaults
let timerState = {
  running: false,
  targetEndTime: null, // timestamp in ms when running
  remainingSeconds: 25 * 60,
  initialSeconds: 25 * 60,
  lastFinishedAt: 0
};

// Registered listeners
const listeners = new Set();
const completionListeners = new Set();

let intervalId = null;

// Load persisted state from localStorage
function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (typeof parsed === 'object' && parsed !== null) {
        timerState.running = !!parsed.running;
        timerState.targetEndTime = parsed.targetEndTime || null;
        timerState.initialSeconds = Number.isFinite(parsed.initialSeconds) ? parsed.initialSeconds : 25 * 60;
        timerState.lastFinishedAt = parsed.lastFinishedAt || 0;

        if (timerState.running && timerState.targetEndTime) {
          const now = Date.now();
          const rem = Math.max(0, Math.ceil((timerState.targetEndTime - now) / 1000));
          timerState.remainingSeconds = rem;
          if (rem <= 0) {
            handleCompletion(true);
          }
        } else if (Number.isFinite(parsed.remainingSeconds)) {
          timerState.remainingSeconds = parsed.remainingSeconds;
        } else {
          timerState.remainingSeconds = timerState.initialSeconds;
        }
      }
    }
  } catch (err) {
    console.warn('Candle timer load error:', err);
  }
}

// Save state to localStorage & broadcast across tabs/popups
function saveAndBroadcast(origin = 'local') {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      running: timerState.running,
      targetEndTime: timerState.targetEndTime,
      remainingSeconds: timerState.remainingSeconds,
      initialSeconds: timerState.initialSeconds,
      lastFinishedAt: timerState.lastFinishedAt,
      timestamp: Date.now()
    }));
  } catch (e) {}

  if (channel) {
    try {
      channel.postMessage({
        type: 'TIMER_SYNC',
        origin,
        state: { ...timerState }
      });
    } catch (e) {}
  }
}

// Calculate true remaining seconds right now
export function getRemainingSeconds() {
  if (timerState.running && timerState.targetEndTime) {
    const diff = Math.max(0, Math.ceil((timerState.targetEndTime - Date.now()) / 1000));
    return diff;
  }
  return timerState.remainingSeconds;
}

export function getTimerState() {
  const rem = getRemainingSeconds();
  return {
    running: timerState.running,
    remainingSeconds: rem,
    initialSeconds: timerState.initialSeconds,
    targetEndTime: timerState.targetEndTime
  };
}

function notifyListeners() {
  const state = getTimerState();
  listeners.forEach(cb => {
    try {
      cb(state);
    } catch (e) {
      console.error('Timer listener error:', e);
    }
  });
}

function handleCompletion(fromStorageLoad = false) {
  timerState.running = false;
  timerState.targetEndTime = null;
  timerState.remainingSeconds = 0;

  const now = Date.now();
  // Prevent duplicate bell chimes if multiple windows/tabs detect completion concurrently
  const shouldPlayBell = (!timerState.lastFinishedAt || (now - timerState.lastFinishedAt > 5000));
  if (shouldPlayBell) {
    timerState.lastFinishedAt = now;
  }

  saveAndBroadcast('completion');
  notifyListeners();

  // Play monastic bell chime immediately at completion
  if (shouldPlayBell) {
    try {
      playMonasticBell();
    } catch (e) {
      console.warn('Bell sound error:', e);
    }
  }

  // Notify completion subscribers (for UI glow, banners, and delayed alert dialog)
  completionListeners.forEach(cb => {
    try {
      cb({ shouldPlayBell });
    } catch (e) {
      console.error('Completion listener error:', e);
    }
  });
}

// Master tick runner: resilient to background throttling and activation/deactivation
function tick() {
  if (timerState.running && timerState.targetEndTime) {
    const rem = Math.max(0, Math.ceil((timerState.targetEndTime - Date.now()) / 1000));
    timerState.remainingSeconds = rem;
    if (rem <= 0) {
      handleCompletion();
    } else {
      notifyListeners();
    }
  }
}

function ensureTicker() {
  if (!intervalId && typeof window !== 'undefined') {
    intervalId = setInterval(tick, 300); // 300ms interval guarantees continuous smooth countdown
  }
}

// Public API
export function startCandleTimer() {
  unlockAudio().catch(() => {});
  const currentRem = getRemainingSeconds();
  const dur = currentRem > 0 ? currentRem : timerState.initialSeconds;
  timerState.running = true;
  timerState.remainingSeconds = dur;
  timerState.targetEndTime = Date.now() + dur * 1000;
  saveAndBroadcast('start');
  ensureTicker();
  notifyListeners();
}

export function pauseCandleTimer() {
  const rem = getRemainingSeconds();
  timerState.running = false;
  timerState.targetEndTime = null;
  timerState.remainingSeconds = Math.max(0, rem);
  saveAndBroadcast('pause');
  notifyListeners();
}

export function toggleCandleTimer() {
  if (timerState.running) {
    pauseCandleTimer();
  } else {
    startCandleTimer();
  }
}

export function resetCandleTimer() {
  timerState.running = false;
  timerState.targetEndTime = null;
  timerState.remainingSeconds = timerState.initialSeconds;
  saveAndBroadcast('reset');
  notifyListeners();
}

export function setCandleTimerPreset(minutes) {
  const sec = minutes * 60;
  timerState.running = false;
  timerState.targetEndTime = null;
  timerState.initialSeconds = sec;
  timerState.remainingSeconds = sec;
  saveAndBroadcast('preset');
  notifyListeners();
}

export function adjustCandleTimer(deltaSeconds) {
  if (timerState.running && timerState.targetEndTime) {
    timerState.targetEndTime += deltaSeconds * 1000;
    const rem = Math.max(10, Math.ceil((timerState.targetEndTime - Date.now()) / 1000));
    timerState.remainingSeconds = rem;
  } else {
    const cur = getRemainingSeconds();
    const next = Math.max(60, cur + deltaSeconds);
    timerState.remainingSeconds = next;
    timerState.initialSeconds = next;
  }
  saveAndBroadcast('adjust');
  notifyListeners();
}

export function subscribeCandleTimer(callback) {
  listeners.add(callback);
  ensureTicker();
  try {
    callback(getTimerState());
  } catch (e) {}
  return () => {
    listeners.delete(callback);
  };
}

export function onCandleTimerFinished(callback) {
  completionListeners.add(callback);
  return () => {
    completionListeners.delete(callback);
  };
}

// Lifecycle listeners: handle window focus, activation, blur, deactivation, and tab switching
if (typeof window !== 'undefined') {
  loadFromStorage();
  ensureTicker();

  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY) {
      loadFromStorage();
      notifyListeners();
    }
  });

  if (channel) {
    channel.onmessage = (evt) => {
      if (evt.data && evt.data.type === 'TIMER_SYNC') {
        loadFromStorage();
        notifyListeners();
      }
    };
  }

  // Reactivate instantly upon window or tab focus
  window.addEventListener('focus', () => {
    loadFromStorage();
    notifyListeners();
  });

  window.addEventListener('pageshow', () => {
    loadFromStorage();
    notifyListeners();
  });

  if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', () => {
      loadFromStorage();
      notifyListeners();
    });
  }
}
