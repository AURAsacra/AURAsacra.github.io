// js/widget-verse.js
// Random & Daily Scripture Verse Provider for Aura Sacra Widgets and Notifications
// Provides canonical verses in the user's chosen Bible translation with deep linking and sharing.

import { BIBLE_BOOKS, ensureFullBibleLoaded, getChapterFromBible, getLoadedBibleBooks } from './data/scriptures.js';
import { SUPPORTED_BIBLES, getDefaultBibleForLanguage } from './data/scripture-archives.js';
import { getSetting } from './db.js';
import { getLanguage } from './i18n.js';

// Curated list of inspirational canonical anchors covering Old and New Testament
export const CORE_WIDGET_VERSES = [
  { book: 'ps', chapter: 23, verse: 1 },
  { book: 'matt', chapter: 5, verse: 3 },
  { book: 'john', chapter: 3, verse: 16 },
  { book: 'phil', chapter: 4, verse: 6 },
  { book: '1cor', chapter: 13, verse: 4 },
  { book: 'isa', chapter: 40, verse: 31 },
  { book: 'rom', chapter: 8, verse: 28 },
  { book: 'prov', chapter: 3, verse: 5 },
  { book: 'matt', chapter: 11, verse: 28 },
  { book: 'ps', chapter: 91, verse: 1 },
  { book: '1pet', chapter: 5, verse: 7 },
  { book: 'josh', chapter: 1, verse: 9 },
  { book: 'ps', chapter: 46, verse: 1 },
  { book: 'jer', chapter: 29, verse: 11 },
  { book: 'john', chapter: 14, verse: 27 },
  { book: 'matt', chapter: 28, verse: 20 },
  { book: 'ps', chapter: 119, verse: 105 },
  { book: '2tim', chapter: 1, verse: 7 },
  { book: 'heb', chapter: 11, verse: 1 },
  { book: 'rev', chapter: 21, verse: 4 },
  { book: 'ps', chapter: 27, verse: 1 },
  { book: 'rom', chapter: 12, verse: 2 },
  { book: 'gal', chapter: 5, verse: 22 },
  { book: 'eph', chapter: 2, verse: 8 },
  { book: 'col', chapter: 3, verse: 14 },
  { book: '1thess', chapter: 5, verse: 16 },
  { book: 'jas', chapter: 1, verse: 5 },
  { book: 'ps', chapter: 34, verse: 8 },
  { book: 'prov', chapter: 16, verse: 3 },
  { book: 'john', chapter: 8, verse: 12 }
];

export async function getActiveBibleVersion() {
  const currentLang = getLanguage ? getLanguage() : 'it';
  const savedVersion = await getSetting('preferred_bible_version', null);
  if (savedVersion) {
    return savedVersion;
  }
  return getDefaultBibleForLanguage(currentLang);
}

// Retrieve formatted verse object with localized text and deep links
export async function getVerseData(target = null, versionId = null) {
  const activeVersion = versionId || await getActiveBibleVersion();
  await ensureFullBibleLoaded(activeVersion);

  const vTarget = target || CORE_WIDGET_VERSES[Math.floor(Math.random() * CORE_WIDGET_VERSES.length)];
  const allBooks = getLoadedBibleBooks(activeVersion) || BIBLE_BOOKS;
  const book = allBooks.find((b) => b.id === vTarget.book) || BIBLE_BOOKS.find((b) => b.id === vTarget.book) || { id: vTarget.book, title: vTarget.book };
  const chapterData = getChapterFromBible(activeVersion, vTarget.book, vTarget.chapter);

  let verseText = '';
  if (chapterData && chapterData.verses) {
    const vObj = chapterData.verses.find((v) => v.v === vTarget.verse);
    if (vObj) {
      verseText = vObj.text || vObj.en || '';
    }
  }

  // Fallback text if chapter was not in the subset
  if (!verseText) {
    verseText = '«Il Signore è il mio pastore: non manco di nulla.»';
  }

  const citation = `${book.title} ${vTarget.chapter}:${vTarget.verse}`;
  const versionInfo = SUPPORTED_BIBLES.find((b) => b.id === activeVersion) || { label: activeVersion.toUpperCase(), name: activeVersion };

  return {
    text: verseText,
    citation,
    book: vTarget.book,
    bookTitle: book.title,
    chapter: vTarget.chapter,
    verse: vTarget.verse,
    versionId: activeVersion,
    versionName: versionInfo.name,
    versionLabel: versionInfo.label,
    deepLink: `./index.html?tab=bible&book=${vTarget.book}&chapter=${vTarget.chapter}&verse=${vTarget.verse}`,
    shareLink: `./index.html?tab=bible&book=${vTarget.book}&chapter=${vTarget.chapter}&verse=${vTarget.verse}&share=1`
  };
}

// Random verse from the chosen Bible
export async function getRandomVerse(versionId = null) {
  const target = CORE_WIDGET_VERSES[Math.floor(Math.random() * CORE_WIDGET_VERSES.length)];
  return getVerseData(target, versionId);
}

// Deterministic Verse of the Day (seeded by day of the year)
export async function getDailyVerse(versionId = null) {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const diff = now - startOfYear;
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  const target = CORE_WIDGET_VERSES[dayOfYear % CORE_WIDGET_VERSES.length];
  return getVerseData(target, versionId);
}
