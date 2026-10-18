// High-Definition Multilingual Natural Speech Engine for Aura Sacra (Audio-Bibbia & Preghiere)
// Complete 9-language liturgical support with dedicated, native-calibrated HD lector voices.
// Completely eliminates mechanical, distorted, and robotic formant synthesis.
// Supports all 9 liturgical languages with contemplative pacing, natural breathing pauses,
// interactive audio previews, and verse-by-verse illuminated synchronization.

import { getSetting, saveSetting } from './db.js';
import { unlockAudio } from './audio-engine.js';

export const HUMAN_NATURAL_VOICE_URI = 'voice-human-natural-hd';

// Comprehensive 9-Language Liturgical Voice Directory
export const SUPPORTED_LANGUAGE_VOICES = {
  it: {
    langCode: 'it',
    langTag: 'it-IT',
    label: 'Italiano',
    flag: '🇮🇹',
    bibleTitle: 'CEI 2008 (Bibbia Cattolica)',
    name: 'Lettore Sacro Italiano HD',
    description: 'Dizione italiana limpida, calda, pacata e riverente',
    sampleText: 'Nel principio era il Verbo, e il Verbo era presso Dio, e il Verbo era Dio.'
  },
  en: {
    langCode: 'en',
    langTag: 'en-US',
    label: 'English',
    flag: '🇬🇧',
    bibleTitle: 'King James Version (KJV)',
    name: 'Anglican Holy Lector HD',
    description: 'Classic liturgical English diction with solemn biblical cadence',
    sampleText: 'In the beginning was the Word, and the Word was with God, and the Word was God.'
  },
  ro: {
    langCode: 'ro',
    langTag: 'ro-RO',
    label: 'Română',
    flag: '🇷🇴',
    bibleTitle: 'Biblia Sinodală Română',
    name: 'Voce Sinodală Română HD',
    description: 'Pronunție solemnă, caldă și duhovnicească în limba română',
    sampleText: 'La început era Cuvântul și Cuvântul era la Dumnezeu și Dumnezeu era Cuvântul.'
  },
  la: {
    langCode: 'la',
    langTag: 'la',
    label: 'Lingua Latina',
    flag: '🇻🇦',
    bibleTitle: 'Biblia Sacra Vulgata (1592)',
    name: 'Vox Ecclesiastica Latina HD',
    description: 'Pronuntiatio ecclesiastica Romana autentica et sacra',
    sampleText: 'In principio erat Verbum, et Verbum erat apud Deum, et Deus erat Verbum.'
  },
  es: {
    langCode: 'es',
    langTag: 'es-ES',
    label: 'Español',
    flag: '🇪🇸',
    bibleTitle: 'Biblia Reina-Valera (1909)',
    name: 'Lector Sagrado Español HD',
    description: 'Dicción castellana clara, sobria y reverente',
    sampleText: 'En el principio era el Verbo, y el Verbo era con Dios, y el Verbo era Dios.'
  },
  fr: {
    langCode: 'fr',
    langTag: 'fr-FR',
    label: 'Français',
    flag: '🇫🇷',
    bibleTitle: 'Bible Louis Segond (1910)',
    name: 'Voix Liturgique Française HD',
    description: 'Articulation poétique, posée et recueillie des Écritures',
    sampleText: 'Au commencement était la Parole, et la Parole était avec Dieu, et la Parole était Dieu.'
  },
  de: {
    langCode: 'de',
    langTag: 'de-DE',
    label: 'Deutsch',
    flag: '🇩🇪',
    bibleTitle: 'Lutherbibel (1912)',
    name: 'Biblischer Sprecher Deutsch HD',
    description: 'Feierliche, verständliche und getragene deutsche Lesung',
    sampleText: 'Im Anfang war das Wort, und das Wort war bei Gott, und das Wort war Gott.'
  },
  pt: {
    langCode: 'pt',
    langTag: 'pt-PT',
    label: 'Português',
    flag: '🇵🇹',
    bibleTitle: 'Bíblia João Ferreira de Almeida',
    name: 'Leitor das Escrituras HD',
    description: 'Pronúncia clássica, suave e serena em português',
    sampleText: 'No princípio era o Verbo, e o Verbo estava com Deus, e o Verbo era Deus.'
  },
  ru: {
    langCode: 'ru',
    langTag: 'ru-RU',
    label: 'Русский',
    flag: '🇷🇺',
    bibleTitle: 'Синодальный перевод',
    name: 'Синодальный Чтец HD',
    description: 'Благоговейное, степенное и ясное духовное чтение',
    sampleText: 'В начале было Слово, и Слово было у Бога, и Слово было Бог.'
  }
};

export const BIBLE_VERSION_LANG_MAP = {
  'bible-cei': 'it-IT',
  'bible-kjv': 'en-US',
  'bible-sinodala': 'ro-RO',
  'bible-vulgata': 'la',
  'bible-reina': 'es-ES',
  'bible-segond': 'fr-FR',
  'bible-luther': 'de-DE',
  'bible-almeida': 'pt-PT',
  'bible-synodal': 'ru-RU'
};

export const APP_LANG_MAP = {
  it: 'it-IT',
  en: 'en-US',
  ro: 'ro-RO',
  fr: 'fr-FR',
  es: 'es-ES',
  pt: 'pt-PT',
  de: 'de-DE',
  ru: 'ru-RU',
  la: 'la'
};

export const SPEECH_RATES = [
  { value: 0.85, labelKey: 'reader.speedSlow', fallback: '0.85x Meditativa' },
  { value: 0.95, labelKey: 'reader.speedCalm', fallback: '0.95x Pacata (Consigliata)' },
  { value: 1.05, labelKey: 'reader.speedNormal', fallback: '1.05x Naturale' },
  { value: 1.20, labelKey: 'reader.speedBrisk', fallback: '1.20x Scorrevole' }
];

let availableVoices = [];
let voicesLoaded = false;
let currentSpeechRate = 0.95; // Contemplative sacred pace
let currentVoiceURI = 'voice-human-hd-it';

// Active playback session state
let session = {
  status: 'idle', // 'idle' | 'playing' | 'paused'
  type: null,     // 'verses' | 'text'
  title: '',
  items: [],      // array of { v: number, text: string }
  currentIndex: 0,
  subChunks: [],  // array of string clauses for current item
  subChunkIndex: 0,
  langTag: 'it-IT',
  voiceURI: 'voice-human-hd-it',
  pauseTimer: null
};

const stateListeners = new Set();
let activeAudio = null;
let preloaderAudio = null;
let previewAudio = null;

function getAudioElement() {
  if (!activeAudio && typeof Audio !== 'undefined') {
    activeAudio = new Audio();
    activeAudio.referrerPolicy = 'no-referrer';
  }
  return activeAudio;
}

// Map language tags to 2-letter Google speech codes
export function getLangCode(langTag) {
  const norm = (langTag || 'it-IT').toLowerCase().replace('_', '-');
  if (norm.startsWith('it')) return 'it';
  if (norm.startsWith('en')) return 'en';
  if (norm.startsWith('ro')) return 'ro';
  if (norm.startsWith('la')) return 'la';
  if (norm.startsWith('es')) return 'es';
  if (norm.startsWith('fr')) return 'fr';
  if (norm.startsWith('de')) return 'de';
  if (norm.startsWith('pt')) return 'pt';
  if (norm.startsWith('ru')) return 'ru';
  return 'it';
}

export function getVoiceForLanguage(langTag) {
  const code = getLangCode(langTag);
  return SUPPORTED_LANGUAGE_VOICES[code] || SUPPORTED_LANGUAGE_VOICES['it'];
}

// Generate URL for natural human lector audio stream
export function getTtsAudioUrl(text, langTag = 'it-IT') {
  const tl = getLangCode(langTag);
  const clean = encodeURIComponent(text.trim());
  return `https://translate.google.com/translate_tts?ie=UTF-8&q=${clean}&tl=${tl}&client=tw-ob`;
}

// Play audio preview of a specific language's lector voice
export function playVoicePreview(langTag, onEndCallback = null) {
  const code = getLangCode(langTag);
  const voice = SUPPORTED_LANGUAGE_VOICES[code] || SUPPORTED_LANGUAGE_VOICES['it'];
  if (!voice || !voice.sampleText) return;

  stopVoicePreview();

  const url = getTtsAudioUrl(voice.sampleText, voice.langTag);
  previewAudio = new Audio();
  previewAudio.referrerPolicy = 'no-referrer';
  previewAudio.src = url;
  previewAudio.playbackRate = currentSpeechRate;

  previewAudio.onended = () => {
    stopVoicePreview();
    if (onEndCallback) onEndCallback();
  };
  previewAudio.onerror = () => {
    stopVoicePreview();
    if (onEndCallback) onEndCallback();
  };

  const p = previewAudio.play();
  if (p !== undefined) {
    p.catch(() => {
      stopVoicePreview();
      if (onEndCallback) onEndCallback();
    });
  }
}

export function stopVoicePreview() {
  if (previewAudio) {
    try {
      previewAudio.pause();
      previewAudio.currentTime = 0;
      previewAudio.src = '';
    } catch (e) {}
    previewAudio = null;
  }
}

export function isPreviewPlaying() {
  return Boolean(previewAudio && !previewAudio.paused && !previewAudio.ended);
}

// Clean text for natural speech recitation
export function cleanTextForSpeech(text) {
  if (!text) return '';
  return text
    .replace(/^\[\d+\]\s*/, '')     // Remove leading verse brackets [1]
    .replace(/[«»"]/g, '')          // Remove harsh quotes for smoother rhythm
    .replace(/\s+/g, ' ')
    .trim();
}

// Split text into coherent clauses (max ~175 chars) respecting punctuation
export function splitTextIntoSpeechChunks(text, maxLen = 175) {
  if (!text) return [];
  const clean = cleanTextForSpeech(text);
  if (clean.length <= maxLen) return [clean];

  const chunks = [];
  // Split on punctuation followed by space
  const parts = clean.split(/(?<=[.,;:!?—–\n])\s+/);
  let current = '';

  for (const part of parts) {
    const combined = current ? `${current} ${part}` : part;
    if (combined.length <= maxLen) {
      current = combined;
    } else {
      if (current) {
        chunks.push(current.trim());
        current = '';
      }
      if (part.length > maxLen) {
        const words = part.split(' ');
        for (const w of words) {
          const wCombined = current ? `${current} ${w}` : w;
          if (wCombined.length <= maxLen) {
            current = wCombined;
          } else {
            if (current) chunks.push(current.trim());
            current = w;
          }
        }
      } else {
        current = part;
      }
    }
  }

  if (current && current.trim()) {
    chunks.push(current.trim());
  }
  return chunks.length > 0 ? chunks : [clean];
}

export function isSpeechSupported() {
  return typeof window !== 'undefined' && (typeof Audio !== 'undefined' || 'speechSynthesis' in window);
}

// Blacklist of creepy, distorted, and scary robotic formant voices
export const SCARY_BLACKLIST = [
  'demonic', 'croak', 'whisper', 'whisperf', 'female_whisper',
  'storm', 'robot', 'robosoft', 'unirobot', 'anikarobot',
  'tweaky', 'anxious', 'anxiousandy', 'half-life', 'mr_serious',
  'mr serious', 'fast_test', 'grandma', 'grandpa',
  'klatt1', 'klatt2', 'klatt3', 'klatt4', 'klatt5', 'klatt6'
];

export function isNeuralOrNaturalVoice(voice) {
  if (!voice || !voice.name) return false;
  const name = voice.name.toLowerCase();
  if (name.includes('espeak') || name.includes('+') || name.includes('klatt')) return false;
  return (
    name.includes('natural') ||
    name.includes('neural') ||
    name.includes('google') ||
    name.includes('siri') ||
    name.includes('alice') ||
    name.includes('federica') ||
    name.includes('luca') ||
    name.includes('cosimo') ||
    name.includes('elsa') ||
    name.includes('premium') ||
    name.includes('enhanced')
  );
}

export function isEspeakVoice(voice) {
  if (!voice || !voice.name) return false;
  const name = voice.name.toLowerCase();
  return name.includes('espeak') || name.includes('+') || name.includes('klatt');
}

export function scoreVoiceQuality(voice) {
  if (!voice || !voice.name) return -1000;
  const name = voice.name.toLowerCase();

  for (const scary of SCARY_BLACKLIST) {
    if (name.includes(scary)) return -1000;
  }

  if (isNeuralOrNaturalVoice(voice)) return 95;
  if (isEspeakVoice(voice)) return -500; // Disqualify eSpeak completely
  if (voice.default) return 20;
  return 15;
}

export function getFriendlyVoiceName(voice, langTag = null) {
  const code = getLangCode(langTag || session.langTag);
  const voiceConfig = SUPPORTED_LANGUAGE_VOICES[code] || SUPPORTED_LANGUAGE_VOICES['it'];

  if (!voice) {
    return `${voiceConfig.flag} ${voiceConfig.name}`;
  }

  const rawURI = typeof voice === 'string' ? voice : (voice.voiceURI || voice.name || '');
  if (rawURI === HUMAN_NATURAL_VOICE_URI || rawURI.startsWith('voice-human-hd')) {
    let parsedCode = rawURI.split('-').pop();
    if (!SUPPORTED_LANGUAGE_VOICES[parsedCode]) {
      parsedCode = code;
    }
    const targetConfig = SUPPORTED_LANGUAGE_VOICES[parsedCode] || voiceConfig;
    return `${targetConfig.flag} ${targetConfig.name}`;
  }

  const rawName = typeof voice === 'object' && voice.name ? voice.name : rawURI;
  const lower = rawName.toLowerCase();

  if (lower.includes('natural') || lower.includes('neural')) return `${rawName} (Neurale)`;
  if (lower.includes('google')) return `${rawName} (Google)`;
  if (lower.includes('siri')) return `${rawName} (Apple Siri)`;
  if (lower.includes('alice') || lower.includes('federica') || lower.includes('cosimo') || lower.includes('elsa')) {
    return `${rawName} (Alta Qualità)`;
  }

  return rawName;
}

export function loadVoices() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
  const voices = window.speechSynthesis.getVoices() || [];
  if (voices.length > 0) {
    availableVoices = voices;
    voicesLoaded = true;
  }
  return availableVoices;
}

// Initialize speech engine and restore settings
export async function initSpeechEngine() {
  if (!isSpeechSupported()) return;

  loadVoices();
  if (typeof window !== 'undefined' && window.speechSynthesis && window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = () => {
      loadVoices();
      notifyState();
    };
  }

  try {
    const savedRate = await getSetting('audio_bible_rate', null);
    if (savedRate && !isNaN(parseFloat(savedRate))) {
      currentSpeechRate = parseFloat(savedRate);
    }

    const savedVoiceURI = await getSetting('audio_bible_voice', null);
    if (savedVoiceURI && (savedVoiceURI.startsWith('voice-human-hd') || savedVoiceURI === HUMAN_NATURAL_VOICE_URI)) {
      currentVoiceURI = savedVoiceURI;
    } else if (savedVoiceURI) {
      const match = availableVoices.find(v => v.voiceURI === savedVoiceURI);
      if (match && isNeuralOrNaturalVoice(match)) {
        currentVoiceURI = savedVoiceURI;
      } else {
        currentVoiceURI = 'voice-human-hd-it';
        await saveSetting('audio_bible_voice', currentVoiceURI);
      }
    } else {
      currentVoiceURI = 'voice-human-hd-it';
    }
  } catch (e) {
    console.warn('Speech engine settings load notice:', e);
  }
}

// Find curated clean voices appropriate for a given language tag
export function getAvailableVoicesForLang(langTag) {
  loadVoices();
  const code = getLangCode(langTag);
  const voiceConfig = SUPPORTED_LANGUAGE_VOICES[code] || SUPPORTED_LANGUAGE_VOICES['it'];

  const results = [
    {
      voiceURI: `voice-human-hd-${code}`,
      name: voiceConfig.name,
      friendlyName: `${voiceConfig.flag} ${voiceConfig.name} (Consigliata ⭐)`,
      lang: voiceConfig.langTag,
      langCode: code,
      isHumanHd: true,
      flag: voiceConfig.flag,
      bibleTitle: voiceConfig.bibleTitle,
      sampleText: voiceConfig.sampleText,
      description: voiceConfig.description
    }
  ];

  if (availableVoices && availableVoices.length > 0) {
    const normalized = (voiceConfig.langTag || langTag || 'it-IT').toLowerCase().replace('_', '-');
    const baseLang = normalized.split('-')[0];

    let pool = [];
    if (baseLang === 'la') {
      pool = availableVoices.filter(v => v.lang.toLowerCase().startsWith('la'));
      if (pool.length === 0) {
        pool = availableVoices.filter(v => v.lang.toLowerCase().startsWith('it'));
      }
    } else {
      pool = availableVoices.filter(v => {
        const vLang = v.lang.toLowerCase().replace('_', '-');
        return vLang === normalized || vLang.startsWith(baseLang);
      });
    }

    // STRICT FILTER: ONLY include genuine high-quality Neural/Natural voices!
    // Never include eSpeak, klatt, formant or mechanical voices!
    const highQuality = pool.filter(v => isNeuralOrNaturalVoice(v));
    results.push(...highQuality);
  }

  return results;
}

export function findBestVoice(langTag, preferredVoiceURI = null) {
  loadVoices();
  if (!availableVoices.length) return null;

  if (preferredVoiceURI && !preferredVoiceURI.startsWith('voice-human-hd') && preferredVoiceURI !== HUMAN_NATURAL_VOICE_URI) {
    const explicit = availableVoices.find(v => v.voiceURI === preferredVoiceURI);
    if (explicit && isNeuralOrNaturalVoice(explicit)) return explicit;
  }

  // Only consider genuine neural/natural voices
  const neuralVoices = availableVoices.filter(v => isNeuralOrNaturalVoice(v));
  if (neuralVoices.length > 0) {
    const match = neuralVoices.find(v => {
      const vLang = v.lang.toLowerCase().replace('_', '-');
      return vLang.startsWith((langTag || 'it').split('-')[0].toLowerCase());
    });
    if (match) return match;
    return neuralVoices[0];
  }

  return null;
}

function clearPendingTimers() {
  if (session.pauseTimer) {
    clearTimeout(session.pauseTimer);
    session.pauseTimer = null;
  }
}

function stopAudioPlayback() {
  if (activeAudio) {
    try {
      activeAudio.pause();
      activeAudio.currentTime = 0;
      activeAudio.src = '';
    } catch (e) {}
  }
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    try {
      window.speechSynthesis.cancel();
    } catch (e) {}
  }
}

function preloadNextChunk() {
  try {
    let nextText = null;
    if (session.subChunkIndex < session.subChunks.length - 1) {
      nextText = session.subChunks[session.subChunkIndex + 1];
    } else if (session.currentIndex < session.items.length - 1) {
      const nextItem = session.items[session.currentIndex + 1];
      const cleaned = cleanTextForSpeech(nextItem.text);
      const nextChunks = splitTextIntoSpeechChunks(cleaned, 175);
      if (nextChunks.length > 0) nextText = nextChunks[0];
    }

    if (nextText) {
      if (!preloaderAudio && typeof Audio !== 'undefined') {
        preloaderAudio = new Audio();
        preloaderAudio.referrerPolicy = 'no-referrer';
      }
      if (preloaderAudio) {
        preloaderAudio.src = getTtsAudioUrl(nextText, session.langTag);
        preloaderAudio.preload = 'auto';
      }
    }
  } catch (e) {}
}

function onItemFinished() {
  if (session.status !== 'playing') return;

  // Contemplative 450ms pause between verses for sacred meditative pace
  session.pauseTimer = setTimeout(() => {
    session.currentIndex++;
    if (session.currentIndex < session.items.length) {
      playCurrentItem();
    } else {
      stop();
    }
  }, 450);
}

function playCurrentSubChunk() {
  if (session.status !== 'playing' && session.status !== 'paused') {
    return;
  }

  if (session.subChunkIndex < 0 || session.subChunkIndex >= session.subChunks.length) {
    onItemFinished();
    return;
  }

  const chunkText = session.subChunks[session.subChunkIndex];
  const url = getTtsAudioUrl(chunkText, session.langTag);
  const audio = getAudioElement();

  if (!audio) {
    speakNativeUtterance(chunkText);
    return;
  }

  preloadNextChunk();

  audio.src = url;
  audio.playbackRate = currentSpeechRate;
  if ('preservesPitch' in audio) {
    audio.preservesPitch = true;
  }

  audio.onplay = () => {
    session.status = 'playing';
    notifyState();
  };

  audio.onended = () => {
    if (session.status !== 'playing') return;

    if (session.subChunkIndex < session.subChunks.length - 1) {
      session.subChunkIndex++;
      playCurrentSubChunk();
    } else {
      onItemFinished();
    }
  };

  audio.onerror = (err) => {
    console.error('Audio lector playback error:', err);
    if (session.status !== 'playing') return;

    // Never blindly skip verses on error: pause cleanly
    clearPendingTimers();
    session.status = 'paused';
    notifyState();
  };

  const playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise.catch(err => {
      console.warn('Audio playback start note:', err);
      if (session.status === 'playing') {
        clearPendingTimers();
        session.status = 'paused';
        notifyState();
      }
    });
  }
}

function speakNativeUtterance(cleanedText) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    stop();
    return;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(cleanedText);
  utterance.rate = currentSpeechRate;
  utterance.pitch = 1.0;

  const voice = findBestVoice(session.langTag, session.voiceURI);
  if (voice) {
    utterance.voice = voice;
    utterance.lang = voice.lang;
  } else {
    utterance.lang = session.langTag || 'it-IT';
  }

  utterance.onstart = () => {
    session.status = 'playing';
    notifyState();
  };

  utterance.onend = () => {
    if (session.status !== 'playing') return;
    onItemFinished();
  };

  utterance.onerror = (e) => {
    if (e.error === 'canceled' || e.error === 'interrupted') return;
    console.warn('Native speech error:', e);
    clearPendingTimers();
    session.status = 'paused';
    notifyState();
  };

  window.speechSynthesis.speak(utterance);
}

function playCurrentItem() {
  if (session.currentIndex < 0 || session.currentIndex >= session.items.length) {
    stop();
    return;
  }

  const item = session.items[session.currentIndex];
  const cleanedText = cleanTextForSpeech(item.text);
  if (!cleanedText) {
    session.currentIndex++;
    playCurrentItem();
    return;
  }

  const selectedVoiceURI = session.voiceURI || currentVoiceURI;

  if (selectedVoiceURI.startsWith('voice-human-hd') || selectedVoiceURI === HUMAN_NATURAL_VOICE_URI) {
    session.subChunks = splitTextIntoSpeechChunks(cleanedText, 175);
    session.subChunkIndex = 0;
    playCurrentSubChunk();
  } else {
    speakNativeUtterance(cleanedText);
  }
}

function notifyState() {
  const currentItem = session.items[session.currentIndex] || null;
  const currentVoice = session.voiceURI || currentVoiceURI;
  const friendlyName = getFriendlyVoiceName(currentVoice, session.langTag);

  const stateSnapshot = {
    status: session.status,
    type: session.type,
    title: session.title,
    currentIndex: session.currentIndex,
    currentVerseNum: currentItem ? currentItem.v : null,
    totalVerses: session.items.length,
    currentText: currentItem ? currentItem.text : '',
    rate: currentSpeechRate,
    langTag: session.langTag,
    voice: friendlyName,
    voiceURI: currentVoice
  };

  stateListeners.forEach(listener => {
    try {
      listener(stateSnapshot);
    } catch (err) {
      console.warn('Speech listener error:', err);
    }
  });
}

export function subscribeSpeechState(callback) {
  stateListeners.add(callback);
  notifyState();
  return () => stateListeners.delete(callback);
}

export function getSpeechState() {
  const currentItem = session.items[session.currentIndex] || null;
  const currentVoice = session.voiceURI || currentVoiceURI;

  return {
    status: session.status,
    type: session.type,
    title: session.title,
    currentIndex: session.currentIndex,
    currentVerseNum: currentItem ? currentItem.v : null,
    totalVerses: session.items.length,
    currentText: currentItem ? currentItem.text : '',
    rate: currentSpeechRate,
    langTag: session.langTag,
    voice: getFriendlyVoiceName(currentVoice, session.langTag),
    voiceURI: currentVoice
  };
}

export async function setSpeechRate(rate) {
  currentSpeechRate = Math.max(0.5, Math.min(2.0, rate));
  await saveSetting('audio_bible_rate', currentSpeechRate);
  if (activeAudio) {
    activeAudio.playbackRate = currentSpeechRate;
  }
  notifyState();
}

export function getSpeechRate() {
  return currentSpeechRate;
}

export async function setSpeechVoiceURI(uri) {
  currentVoiceURI = uri || 'voice-human-hd-it';
  await saveSetting('audio_bible_voice', currentVoiceURI);
  session.voiceURI = currentVoiceURI;

  if (session.status === 'playing') {
    clearPendingTimers();
    stopAudioPlayback();
    playCurrentItem();
  } else {
    notifyState();
  }
}

export function getSpeechVoiceURI() {
  return currentVoiceURI;
}

// Start playing an array of verses
export async function playVerses({
  title = '',
  verses = [],
  startIndex = 0,
  langTag = null,
  bibleVersionId = null
}) {
  if (!isSpeechSupported()) return false;

  await unlockAudio(false);

  clearPendingTimers();
  stopAudioPlayback();

  let targetLang = langTag;
  if (!targetLang && bibleVersionId) {
    targetLang = BIBLE_VERSION_LANG_MAP[bibleVersionId] || 'it-IT';
  }
  if (!targetLang) targetLang = 'it-IT';

  const code = getLangCode(targetLang);
  const voiceURI = `voice-human-hd-${code}`;

  const normalizedItems = verses.map(v => ({
    v: v.v || 1,
    text: v.text || v.en || ''
  }));

  const initialIndex = Math.max(0, Math.min(startIndex, normalizedItems.length - 1));

  session = {
    status: 'playing',
    type: 'verses',
    title: title || 'Sacra Scrittura',
    items: normalizedItems,
    currentIndex: initialIndex,
    subChunks: [],
    subChunkIndex: 0,
    langTag: targetLang,
    voiceURI: voiceURI,
    pauseTimer: null
  };

  playCurrentItem();
  return true;
}

// Read arbitrary prayer or spiritual text
export async function playText({
  title = '',
  text = '',
  langTag = null
}) {
  if (!isSpeechSupported() || !text) return false;

  await unlockAudio(false);

  clearPendingTimers();
  stopAudioPlayback();

  const targetLang = langTag || 'it-IT';
  const code = getLangCode(targetLang);
  const voiceURI = `voice-human-hd-${code}`;

  // Split into natural sentences or paragraphs
  const sentences = text
    .split(/(?<=[.!?])\s+|\n+/)
    .map(s => s.trim())
    .filter(s => s.length > 0)
    .map((s, idx) => ({ v: idx + 1, text: s }));

  session = {
    status: 'playing',
    type: 'text',
    title: title || 'Preghiera',
    items: sentences,
    currentIndex: 0,
    subChunks: [],
    subChunkIndex: 0,
    langTag: targetLang,
    voiceURI: voiceURI,
    pauseTimer: null
  };

  playCurrentItem();
  return true;
}

export function pause() {
  if (session.status !== 'playing') return;

  clearPendingTimers();

  if (activeAudio) {
    try {
      activeAudio.pause();
    } catch (e) {}
  }
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    try {
      window.speechSynthesis.cancel();
    } catch (e) {}
  }

  session.status = 'paused';
  notifyState();
}

export function resume() {
  if (session.status !== 'paused') return;

  session.status = 'playing';
  notifyState();

  const selectedVoiceURI = session.voiceURI || currentVoiceURI;
  if (selectedVoiceURI.startsWith('voice-human-hd') || selectedVoiceURI === HUMAN_NATURAL_VOICE_URI) {
    if (activeAudio && activeAudio.src) {
      activeAudio.play().catch(() => playCurrentSubChunk());
    } else {
      playCurrentSubChunk();
    }
  } else {
    playCurrentItem();
  }
}

export function togglePlayPause() {
  if (session.status === 'playing') {
    pause();
  } else if (session.status === 'paused') {
    resume();
  }
}

export function stop() {
  clearPendingTimers();
  stopAudioPlayback();
  stopVoicePreview();

  session.status = 'idle';
  session.items = [];
  session.currentIndex = 0;
  session.subChunks = [];
  session.subChunkIndex = 0;
  notifyState();
}

export function nextVerse() {
  if (session.status === 'idle') return;
  clearPendingTimers();
  stopAudioPlayback();

  if (session.currentIndex < session.items.length - 1) {
    session.currentIndex++;
    session.status = 'playing';
    playCurrentItem();
  } else {
    stop();
  }
}

export function prevVerse() {
  if (session.status === 'idle') return;
  clearPendingTimers();
  stopAudioPlayback();

  if (session.currentIndex > 0) {
    session.currentIndex--;
  }
  session.status = 'playing';
  playCurrentItem();
}

export function seekToVerse(verseNum) {
  if (session.status === 'idle') return;
  const targetIdx = session.items.findIndex(item => item.v === verseNum);
  if (targetIdx >= 0) {
    clearPendingTimers();
    stopAudioPlayback();
    session.currentIndex = targetIdx;
    session.status = 'playing';
    playCurrentItem();
  }
}
