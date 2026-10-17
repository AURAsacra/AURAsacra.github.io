// Monastic Hours & Liturgy of the Hours Engine for Aura Sacra
// Coordinates canonical prayer rhythms, Web Push & local notifications, additive cathedral bell chimes, and deep links.
import { getSetting, setSetting } from './db.js';
import { playMonasticBell, unlockAudio } from './audio-engine.js';
import { getCurrentScheduleStatus } from './schedule.js';
import { t } from './i18n.js';

export const MONASTIC_HOURS_PRESETS = {
  // 1. Full Monastic Rhythm (Ora et Labora - 6 Canonical Hours)
  monastic: {
    id: 'monastic',
    label: 'Ritmo Monastico Completo (Ora et Labora)',
    labelEn: 'Full Monastic Rhythm (Ora et Labora)',
    desc: '6 ore canoniche: Lodi (06:00), Terza (09:00), Sesta (12:00), Nona (15:00), Vespri (18:00), Compieta (21:00).',
    descEn: '6 canonical hours: Lauds (06:00), Terce (09:00), Sext (12:00), None (15:00), Vespers (18:00), Compline (21:00).',
    hours: [
      {
        id: 'lauds',
        time: '06:00',
        name: 'Lodi Mattutine',
        nameEn: 'Morning Lauds',
        sub: 'Preghiera dell’Aurora • Risurrezione di Cristo',
        subEn: 'Dawn Praise • Christ’s Resurrection',
        verse: '«O Dio, tu sei il mio Dio, dall’aurora ti cerco: ha sete di te l’anima mia.» • Salmo 63:2',
        verseEn: '«O God, you are my God, early will I seek you; my soul thirsts for you.» • Psalm 63:1',
        tab: 'bible',
        book: 'ps',
        chapter: 63,
        icon: '🌅'
      },
      {
        id: 'terce',
        time: '09:00',
        name: 'Ora Terza',
        nameEn: 'Terce (Third Hour)',
        sub: 'Discesa dello Spirito Santo • Sapienza e Fortezza',
        subEn: 'Descent of the Holy Spirit • Wisdom & Fortitude',
        verse: '«Insegnami, Signore, la via dei tuoi decreti: camminerò con fedeltà. Veni Sancte Spiritus.» • Salmo 119:33',
        verseEn: '«Teach me, Lord, the way of your decrees: that I may follow it to the end.» • Psalm 119:33',
        tab: 'bible',
        book: 'ps',
        chapter: 119,
        icon: '🕊️'
      },
      {
        id: 'sext',
        time: '12:00',
        name: 'Ora Sesta & Angelus',
        nameEn: 'Sext & Midday Angelus',
        sub: 'Crocifissione del Signore • Angelus Domini',
        subEn: 'Crucifixion of Christ • Angelus Memorial',
        verse: '«Chi abita al riparo dell’Altissimo riposa all’ombra dell’Onnipotente.» • Salmo 91:1',
        verseEn: '«He that dwelleth in the secret place of the most High shall abide under the shadow of the Almighty.» • Psalm 91:1',
        tab: 'bible',
        book: 'ps',
        chapter: 91,
        icon: '☀️'
      },
      {
        id: 'none',
        time: '15:00',
        name: 'Ora Nona',
        nameEn: 'None (Ninth Hour)',
        sub: 'Morte di Cristo in Croce • Ora della Divina Misericordia',
        subEn: 'Death of Christ on the Cross • Hour of Divine Mercy',
        verse: '«Padre, nelle tue mani consegno il mio spirito. Tutto è compiuto.» • Salmo 22 / Luca 23:46',
        verseEn: '«Father, into your hands I commit my spirit. It is finished.» • Psalm 22 / Luke 23:46',
        tab: 'bible',
        book: 'ps',
        chapter: 22,
        icon: '✝️'
      },
      {
        id: 'vespers',
        time: '18:00',
        name: 'Vespri della Sera',
        nameEn: 'Evening Vespers',
        sub: 'Luce Serale (Phos Hilaron) • Rendimento di Grazie',
        subEn: 'Evening Light (Phos Hilaron) • Thanksgiving',
        verse: '«Salga la mia preghiera come incenso al tuo cospetto, il sollevarsi delle mie mani come sacrificio della sera.» • Salmo 141:2',
        verseEn: '«Let my prayer be set forth before thee as incense; and the lifting up of my hands as the evening sacrifice.» • Psalm 141:2',
        tab: 'bible',
        book: 'ps',
        chapter: 141,
        icon: '🌇'
      },
      {
        id: 'compline',
        time: '21:00',
        name: 'Compieta & Esame di Coscienza',
        nameEn: 'Compline & Night Exam',
        sub: 'Pace della Notte • Esame di Coscienza ed Affidamento',
        subEn: 'Night Peace • Examination of Conscience & Rest',
        verse: '«In pace mi corico e subito mi addormento: tu solo, Signore, mi fai riposare al sicuro.» • Salmo 4:9',
        verseEn: '«I will both lay me down in peace, and sleep: for thou, Lord, only makest me dwell in safety.» • Psalm 4:8',
        tab: 'evening',
        icon: '🌙'
      }
    ]
  },

  // 2. Simple Daily Rhythm (Secular / Students / Family - 3 Hours)
  simple: {
    id: 'simple',
    label: 'Ritmo Quotidiano Semplice',
    labelEn: 'Simple Daily Rhythm',
    desc: '3 orari fondamentali: Mattino (07:30), Angelus (12:30), Compieta (21:30). Ideale per studio e lavoro.',
    descEn: '3 key prayer hours: Morning (07:30), Angelus (12:30), Compline (21:30). Ideal for work and family life.',
    hours: [
      {
        id: 'morning',
        time: '07:30',
        name: 'Preghiera del Mattino',
        nameEn: 'Morning Prayer',
        sub: 'Consacrazione del Giorno & Offerta a Dio',
        subEn: 'Offering of the Day to God',
        verse: '«Al mattino ascolta la mia voce; al mattino ti espongo la mia preghiera e attendo.» • Salmo 5:4',
        verseEn: '«My voice shalt thou hear in the morning, O Lord; in the morning will I direct my prayer unto thee.» • Psalm 5:3',
        tab: 'bible',
        book: 'ps',
        chapter: 5,
        icon: '🌅'
      },
      {
        id: 'midday',
        time: '12:30',
        name: 'Angelus di Mezzogiorno',
        nameEn: 'Midday Angelus',
        sub: 'Memoria dell’Incarnazione & Pausa Sacra',
        subEn: 'Incarnation Memorial & Sacred Pause',
        verse: '«Ecco la serva del Signore: avvenga per me secondo la tua parola.» • Luca 1:38',
        verseEn: '«Behold the handmaid of the Lord; be it unto me according to thy word.» • Luke 1:38',
        tab: 'bible',
        book: 'luke',
        chapter: 1,
        verseNumber: 38,
        icon: '☀️'
      },
      {
        id: 'evening',
        time: '21:30',
        name: 'Preghiera della Sera (Compieta)',
        nameEn: 'Night Prayer (Compline)',
        sub: 'Rendimento di Grazie & Riposo in Cristo',
        subEn: 'Thanksgiving & Peaceful Rest in Christ',
        verse: '«Nelle tue mani, Signore, raccomando il mio spirito; tu mi riscatti, Signore, Dio fedele.» • Salmo 31:6',
        verseEn: '«Into thine hand I commit my spirit: thou hast redeemed me, O Lord God of truth.» • Psalm 31:5',
        tab: 'evening',
        icon: '🌙'
      }
    ]
  },

  // 3. Free / Disabled
  disabled: {
    id: 'disabled',
    label: 'Preghiera Libera (Senza orari prefissati)',
    labelEn: 'Free Prayer (No fixed hours)',
    desc: 'Nessun orario prefissato o notifica. Prega spontaneamente quando lo desideri.',
    descEn: 'No fixed prayer schedule or notifications. Pray freely whenever your heart desires.',
    hours: []
  }
};

const DEFAULT_CONFIG = {
  mode: 'monastic', // 'monastic' | 'simple' | 'custom' | 'disabled'
  notificationsEnabled: true,
  playBell: true,
  customHours: null,
  lastNotifiedKey: ''
};

let currentConfig = { ...DEFAULT_CONFIG };
let schedulerTimer = null;
const configListeners = [];

// Load config from IndexedDB and localStorage
export async function initMonasticScheduler() {
  try {
    const saved = await getSetting('monastic_schedule', null);
    if (saved && typeof saved === 'object') {
      currentConfig = { ...DEFAULT_CONFIG, ...saved };
    } else {
      const local = localStorage.getItem('aurasacra_monastic_schedule');
      if (local) {
        try {
          currentConfig = { ...DEFAULT_CONFIG, ...JSON.parse(local) };
        } catch (e) {}
      }
    }
  } catch (err) {
    console.warn('Monastic scheduler load warning:', err);
  }

  // Periodic check every 25 seconds to guarantee catching exact minutes without drifting
  if (schedulerTimer) clearInterval(schedulerTimer);
  schedulerTimer = setInterval(() => {
    checkMonasticHourNow().catch((e) => console.error('Monastic tick error:', e));
  }, 25000);

  // Catch up immediately if tab wakes up or regains focus
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      checkMonasticHourNow().catch(() => {});
    }
  });

  // Run initial check
  checkMonasticHourNow().catch(() => {});

  return currentConfig;
}

export function getMonasticConfig() {
  return { ...currentConfig };
}

export async function saveMonasticConfig(partial) {
  currentConfig = { ...currentConfig, ...partial };
  try {
    await setSetting('monastic_schedule', currentConfig);
    localStorage.setItem('aurasacra_monastic_schedule', JSON.stringify(currentConfig));
  } catch (err) {
    console.error('Save monastic config error:', err);
  }
  notifyConfigListeners();
  return currentConfig;
}

export function onMonasticConfigChange(listener) {
  configListeners.push(listener);
  return () => {
    const idx = configListeners.indexOf(listener);
    if (idx !== -1) configListeners.splice(idx, 1);
  };
}

function notifyConfigListeners() {
  configListeners.forEach((fn) => {
    try { fn(currentConfig); } catch (e) { console.error('Listener err:', e); }
  });
}

// Get array of active hours for current mode
export function getActiveMonasticHours() {
  const { mode, customHours } = currentConfig;
  if (mode === 'disabled') return [];
  if (mode === 'custom' && Array.isArray(customHours) && customHours.length > 0) {
    return customHours;
  }
  if (MONASTIC_HOURS_PRESETS[mode]) {
    return MONASTIC_HOURS_PRESETS[mode].hours;
  }
  return MONASTIC_HOURS_PRESETS.monastic.hours;
}

// Check if current time matches any active canonical hour
export async function checkMonasticHourNow() {
  if (currentConfig.mode === 'disabled') return null;
  if (!currentConfig.notificationsEnabled && !currentConfig.playBell) return null;

  const now = new Date();
  const currentHH = String(now.getHours()).padStart(2, '0');
  const currentMM = String(now.getMinutes()).padStart(2, '0');
  const currentTimeStr = `${currentHH}:${currentMM}`;
  const todayStr = now.toISOString().slice(0, 10);

  const activeHours = getActiveMonasticHours();
  const matchedHour = activeHours.find((h) => h.time === currentTimeStr && h.enabled !== false);

  if (!matchedHour) return null;

  const notificationKey = `${todayStr}_${currentTimeStr}_${matchedHour.id}`;
  if (currentConfig.lastNotifiedKey === notificationKey) {
    return null; // Already notified this minute
  }

  // Check School / Work Focus quiet mode from schedule.js
  const schedStatus = getCurrentScheduleStatus();
  if (schedStatus && schedStatus.status === 'busy') {
    console.log('Monastic chime silenced due to School/Work quiet hours.');
    return null;
  }

  // Save last notified key
  currentConfig.lastNotifiedKey = notificationKey;
  try {
    await saveMonasticConfig({ lastNotifiedKey: notificationKey });
  } catch (e) {}

  // Trigger sound, notification, and event
  await triggerMonasticNotification(matchedHour);
  return matchedHour;
}

// Trigger bell, system notification, and custom app event
export async function triggerMonasticNotification(hourObj) {
  // 1. Play cathedral monastic bell chime if enabled
  if (currentConfig.playBell) {
    try {
      await playMonasticBell();
    } catch (err) {
      console.warn('Could not play monastic bell:', err);
    }
  }

  // 2. Dispatch custom in-app event for UI toasts/banners
  try {
    const event = new CustomEvent('aurasacra:monastic-chime', {
      detail: { hour: hourObj, timestamp: Date.now() }
    });
    window.dispatchEvent(event);
  } catch (e) {}

  // 3. Web Push / Native System Notification
  if (currentConfig.notificationsEnabled && 'Notification' in window) {
    if (Notification.permission === 'granted') {
      sendSystemNotification(hourObj);
    } else if (Notification.permission === 'default') {
      // Don't spam permission prompts automatically; wait for user action
    }
  }
}

// Request notification permission safely from a user gesture
export async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    return false;
  }
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      await saveMonasticConfig({ notificationsEnabled: true });
      return true;
    }
    return false;
  } catch (e) {
    console.warn('Request notification permission err:', e);
    return false;
  }
}

// Send system notification via ServiceWorker or fallback Notification API
function sendSystemNotification(hourObj) {
  const title = `⛪ ${hourObj.name} (${hourObj.time})`;
  const deepLink = getDeepLinkForHour(hourObj);
  const options = {
    body: `${hourObj.sub}\n${hourObj.verse}`,
    icon: './icons/icon-192.png',
    badge: './icons/icon-192.png',
    tag: `monastic-${hourObj.id}`,
    renotify: true,
    vibrate: [300, 150, 300, 150, 600],
    data: deepLink,
    actions: [
      { action: 'pray', title: '🙏 Prega Ora' },
      { action: 'close', title: '✕ Chiudi' }
    ]
  };

  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.ready
      .then((reg) => {
        reg.showNotification(title, options);
      })
      .catch(() => {
        new Notification(title, options);
      });
  } else {
    try {
      const n = new Notification(title, options);
      n.onclick = () => {
        window.focus();
        if (deepLink) window.location.href = deepLink;
        n.close();
      };
    } catch (e) {}
  }
}

// Generate deep-link URL for an hour
export function getDeepLinkForHour(hourObj) {
  if (hourObj.tab === 'evening') {
    return './index.html?tab=evening&hour=' + hourObj.id;
  }
  if (hourObj.tab === 'focus') {
    return './index.html?tab=focus&hour=' + hourObj.id;
  }
  if (hourObj.tab === 'bible' && hourObj.book && hourObj.chapter) {
    return `./index.html?tab=bible&book=${hourObj.book}&chapter=${hourObj.chapter}&hour=${hourObj.id}`;
  }
  return `./index.html?tab=bible&hour=${hourObj.id}`;
}

// Test trigger for settings
export async function testMonasticNotification(hourId = null) {
  await unlockAudio(false);
  const activeHours = getActiveMonasticHours();
  const target = hourId ? activeHours.find((h) => h.id === hourId) : activeHours[0] || MONASTIC_HOURS_PRESETS.monastic.hours[2];
  if (!target) return;

  await triggerMonasticNotification({
    ...target,
    name: `[Prova] ${target.name}`,
    verse: target.verse || '«Signore, apri le mie labbra e la mia bocca proclamerà la tua lode.»'
  });
}

// Compute the next upcoming canonical hour and remaining time
export function getNextMonasticHour() {
  const activeHours = getActiveMonasticHours();
  if (!activeHours.length) return null;

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const sorted = activeHours
    .filter((h) => h.enabled !== false)
    .map((h) => {
      const [hh, mm] = h.time.split(':').map(Number);
      const totalMin = hh * 60 + mm;
      let diff = totalMin - currentMinutes;
      if (diff <= 0) diff += 24 * 60; // Tomorrow
      return { ...h, diffMinutes: diff };
    })
    .sort((a, b) => a.diffMinutes - b.diffMinutes);

  if (!sorted.length) return null;

  const next = sorted[0];
  const hoursLeft = Math.floor(next.diffMinutes / 60);
  const minsLeft = next.diffMinutes % 60;
  const countdownStr = hoursLeft > 0 ? `${hoursLeft}h ${minsLeft}m` : `${minsLeft} min`;

  return {
    hour: next,
    countdownStr,
    diffMinutes: next.diffMinutes
  };
}
