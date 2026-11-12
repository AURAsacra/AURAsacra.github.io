import {
  getSaintsForDate,
  getLiturgicalColorMeta,
  getLocalizedSaint,
  getNationalityMeta,
  SUPPORTED_NATIONALITIES,
  renderLiturgicalLegendHtml,
  resolveSaintLiturgicalMeta
} from '../data/saints.js';
import { icons } from '../icons.js';
import { getSetting, saveSetting } from '../db.js';
import { t, getLanguage } from '../i18n.js';

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export async function renderSaintsView(container, onOpenShareCard) {
  const confession = (await getSetting('user_confession', 'ecumenical')).toLowerCase();
  let userNationality = ((await getSetting('user_nationality', 'universal')) || 'universal').toLowerCase();
  const lang = getLanguage();

  function buildFullYearSaints() {
    const curYear = new Date().getFullYear();
    const list = [];
    const monthKeys = [
      'january', 'february', 'march', 'april', 'may', 'june',
      'july', 'august', 'september', 'october', 'november', 'december'
    ];
    for (let m = 0; m < 12; m++) {
      const daysInMonth = new Date(curYear, m + 1, 0).getDate();
      for (let d = 1; d <= daysInMonth; d++) {
        const dt = new Date(curYear, m, d);
        const daySaints = getSaintsForDate(dt, confession, userNationality, lang);
        let formattedDate = '';
        try {
          if (Intl.DateTimeFormat.supportedLocalesOf([lang]).length > 0) {
            formattedDate = dt.toLocaleDateString(lang, {
              day: 'numeric',
              month: 'long'
            });
          } else {
            formattedDate = `${d} ${t(`common.${monthKeys[m]}`, monthKeys[m])}`;
          }
          if (formattedDate) {
            formattedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
          }
        } catch (e) {
          formattedDate = `${d}/${m + 1}`;
        }

        daySaints.forEach((s) => {
          list.push({
            ...s,
            dateObj: dt,
            formattedDate: formattedDate || s.dateStr || ''
          });
        });
      }
    }
    return list;
  }

  function prepareSaintsList() {
    const rawList = buildFullYearSaints();
    return rawList.map((saint) => {
      const locSaint = getLocalizedSaint(saint, lang, confession, userNationality);
      const cMeta = locSaint.colorMeta || resolveSaintLiturgicalMeta(saint, confession, userNationality, lang);
      const cName = locSaint.colorName || cMeta.name;
      const rankName = locSaint.rankName || (locSaint.rank ? t(`ranks.${locSaint.rank}`, locSaint.rank) : t('ranks.memorial'));
      const primaryName = locSaint.displayName || locSaint.name;
      return {
        ...locSaint,
        cMeta,
        cName,
        rankName,
        primaryName,
        formattedDate: saint.formattedDate || locSaint.dateStr || ''
      };
    });
  }

  let allSaints = prepareSaintsList();
  let searchQuery = '';

  function matchesSearch(saint, query) {
    if (!query) return true;
    const q = query.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (!q) return true;

    const terms = q.split(/\s+/).filter(Boolean);

    const searchableText = [
      saint.primaryName,
      saint.name,
      saint.name_it,
      saint.name_la,
      saint.name_ro,
      saint.name_es,
      saint.name_fr,
      saint.name_de,
      saint.name_pt,
      saint.name_ru,
      saint.title,
      saint.displayTitle,
      saint.bio,
      saint.displayBio,
      saint.quote,
      saint.displayQuote,
      saint.scriptureRef,
      saint.formattedDate,
      saint.dateStr,
      saint.cName,
      saint.rankName,
      saint.nationalityMeta?.name
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    return terms.every((term) => searchableText.includes(term));
  }

  function renderCard(locSaint) {
    const cMeta = locSaint.cMeta || {};
    const cName = locSaint.cName || cMeta.name || '';
    const rankName = locSaint.rankName || '';
    const primaryName = locSaint.primaryName || locSaint.name || '';

    return `
      <div class="bg-[var(--bg-parchment)] border-2 ${cMeta.borderClass || 'border-stone-300 dark:border-stone-700'} rounded-2xl p-5 sm:p-6 shadow-md flex flex-col justify-between space-y-4 parchment-border hover:shadow-xl transition min-w-0">
        
        <div>
          <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-stone-200 dark:border-stone-800 pb-3">
            <div class="space-y-1 min-w-0 flex-1">
              ${locSaint.formattedDate ? `
                <span class="inline-flex items-center gap-1 text-[11px] font-semibold font-mono text-amber-700 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                  📅 ${locSaint.formattedDate}
                </span>
              ` : ''}
              <h3 class="text-lg font-bold font-display text-[var(--accent-vermilion)] leading-tight pt-0.5 break-words">
                ${primaryName}
              </h3>
              <p class="text-xs font-serif italic text-[var(--text-muted)]">${locSaint.title || ''}</p>
            </div>

            <!-- Badges: Nationality, Color & Rank -->
            <div class="flex flex-wrap sm:flex-col items-start sm:items-end gap-1 min-w-0 max-w-full sm:flex-shrink-0">
              ${locSaint.nationalityMeta ? `
                <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md border border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-300 text-[11px] font-sans font-bold" title="${locSaint.nationalityMeta.name}">
                  <span>${locSaint.nationalityMeta.flag}</span>
                  <span>${locSaint.nationalityMeta.name}</span>
                </span>
              ` : ''}
              <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[11px] font-sans font-bold ${cMeta.badgeClass || 'bg-stone-500/10 text-stone-700 border-stone-400'}">
                ${cMeta.symbol ? `<span>${cMeta.symbol}</span>` : ''}
                <span>${cName}</span>
              </span>
              <span class="inline-flex items-center px-2 py-0.5 rounded-md border border-stone-300 dark:border-stone-700 bg-[var(--bg-secondary)] text-[var(--text-secondary)] text-[10px] font-sans font-semibold uppercase">
                ${rankName}
              </span>
            </div>
          </div>

          <!-- Quote -->
          ${locSaint.quote ? `
            <blockquote class="my-3 text-sm sm:text-base italic font-serif text-[var(--text-primary)] border-l-4 border-amber-600/70 pl-3 py-1 bg-amber-500/5 rounded-r-lg">
              ${locSaint.quote}
            </blockquote>
          ` : ''}

          <!-- Bio -->
          ${locSaint.bio ? `
            <p class="text-xs sm:text-sm text-[var(--text-secondary)] font-serif leading-relaxed">
              ${locSaint.bio}
            </p>
          ` : ''}
        </div>

        <!-- Card Footer: Scripture Ref & Share -->
        <div class="pt-3 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs">
          <span class="font-mono font-semibold text-amber-600">
            📖 ${locSaint.scriptureRef || getGospelOfChristLabel(lang)}
          </span>

          ${locSaint.quote ? `
            <button class="btn-share-saint flex items-center gap-1.5 font-medium text-amber-600 hover:text-amber-700 px-3 py-1 rounded-lg border border-amber-600/30 hover:border-amber-600 transition cursor-pointer" data-quote="${encodeURIComponent(locSaint.quote)}" data-name="${encodeURIComponent(primaryName)}">
              ${icons.share('w-3.5 h-3.5')}
              <span>${t('saints.shareQuote', 'Share Quote')}</span>
            </button>
          ` : ''}
        </div>

      </div>
    `;
  }

  function getGospelOfChristLabel(currentLang) {
    const labels = {
      it: 'Evangelo di Cristo',
      en: 'Gospel of Christ',
      ro: 'Evanghelia lui Hristos',
      fr: 'Évangile du Christ',
      es: 'Evangelio de Cristo',
      pt: 'Evangelho de Cristo',
      de: 'Evangelium Christi',
      ru: 'Евангелие Христово',
      la: 'Evangelium Christi'
    };
    return labels[currentLang] || labels.en || labels.it;
  }

  function getEmptyQueryMessage(q, currentLang) {
    const escaped = escapeHtml(q);
    const messages = {
      it: `Nessun santo corrisponde alla ricerca «<strong>${escaped}</strong>». Prova con un altro nome, mese o parola chiave.`,
      en: `No saints match «<strong>${escaped}</strong>». Try searching by a different name, month, or keyword.`,
      ro: `Niciun sfânt nu corespunde căutării «<strong>${escaped}</strong>». Încercați cu un alt nume, lună sau cuvânt-cheie.`,
      fr: `Aucun saint ne correspond à la recherche «<strong>${escaped}</strong>». Essayez avec un autre nom, mois ou mot-clé.`,
      es: `Ningún santo coincide con la búsqueda «<strong>${escaped}</strong>». Pruebe con otro nombre, mes o palabra clave.`,
      pt: `Nenhum santo corresponde à pesquisa «<strong>${escaped}</strong>». Tente outro nome, mês ou palavra-chave.`,
      de: `Keine Heiligen entsprechen der Suche «<strong>${escaped}</strong>». Versuchen Sie es mit einem anderen Namen, Monat oder Stichwort.`,
      ru: `Ни один святой не найден по запросу «<strong>${escaped}</strong>». Попробуйте другое имя, месяц или ключевое слово.`,
      la: `Nulli sancti inquisitioni «<strong>${escaped}</strong>» respondent. Alio nomine, mense vel verbo quaerere tempta.`
    };
    return messages[currentLang] || messages.en || messages.it;
  }

  function renderEmptyState(query) {
    return `
      <div class="col-span-1 md:col-span-2 text-center py-12 px-4 bg-[var(--bg-card)] rounded-2xl border border-stone-300 dark:border-stone-800 space-y-3 parchment-border">
        <div class="w-12 h-12 mx-auto rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center">
          ${icons.search('w-6 h-6')}
        </div>
        <h3 class="text-base font-bold font-display text-[var(--accent-vermilion)]">
          ${t('saints.noResults', 'Nessun santo trovato')}
        </h3>
        <p class="text-xs sm:text-sm text-[var(--text-muted)] font-serif max-w-md mx-auto">
          ${getEmptyQueryMessage(query, lang)}
        </p>
        <div class="pt-2">
          <button id="saints-btn-clear-search" class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-sm transition cursor-pointer">
            ${icons.close('w-3.5 h-3.5')}
            <span>${t('saints.clearSearch', 'Cancella ricerca')}</span>
          </button>
        </div>
      </div>
    `;
  }

  // Initial structure render
  container.innerHTML = `
    <div class="space-y-6 pb-32 sm:pb-24 animate-fade-in max-w-5xl mx-auto">
      
      <!-- Header -->
      <div class="bg-[var(--bg-card)] border border-stone-300 dark:border-stone-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="flex items-center gap-3 min-w-0">
            <div class="w-12 h-12 rounded-2xl border border-amber-500/40 bg-[var(--bg-secondary)] flex items-center justify-center text-amber-600 shadow-sm flex-shrink-0">
              ${icons.cross('w-6 h-6')}
            </div>
            <div class="min-w-0 flex-1">
              <div class="flex flex-wrap items-center gap-2">
                <h1 class="text-xl sm:text-2xl font-bold font-display text-[var(--accent-vermilion)] break-words">
                  ${t('saints.title', 'Saints & Church Fathers')}
                </h1>
                <span class="inline-flex px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 text-[11px] font-sans font-bold">
                  ${t('saints.allSaints', 'Tutti i Santi')}
                </span>
              </div>
              <p class="text-xs sm:text-sm text-[var(--text-muted)] italic font-serif">
                ${t('saints.subtitle', 'Cloud of Witnesses across Church history')} • <span class="capitalize font-bold text-amber-600">${t('settings.confessions.' + confession, confession)}</span>
              </p>
            </div>
          </div>

          <!-- Nationality Selector -->
          <div class="flex items-center gap-2 min-w-0 max-w-full sm:flex-shrink-0">
            <select id="saints-nationality-select" class="min-w-0 max-w-full bg-[var(--bg-secondary)] border border-stone-300 dark:border-stone-700 rounded-xl px-2.5 py-1.5 text-xs font-sans font-semibold text-[var(--text-primary)] cursor-pointer focus:outline-none focus:border-amber-600">
              ${SUPPORTED_NATIONALITIES.map((natCode) => {
                const nMeta = getNationalityMeta(natCode, lang);
                return `<option value="${natCode}" ${userNationality === natCode ? 'selected' : ''}>${nMeta.flag} ${nMeta.name}</option>`;
              }).join('')}
            </select>
          </div>
        </div>

        <!-- Search Bar & Results Count -->
        <div class="pt-2 border-t border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div class="relative flex-1">
            <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
              ${icons.search('w-4 h-4')}
            </div>
            <input
              type="text"
              id="saints-search-input"
              placeholder="${t('saints.searchPlaceholder', 'Cerca un santo, festa o parola chiave...')}"
              class="w-full pl-10 pr-10 py-2.5 bg-[var(--bg-secondary)] border border-stone-300 dark:border-stone-700 rounded-xl text-sm font-sans text-[var(--text-primary)] placeholder-stone-400 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition"
              autocomplete="off"
              spellcheck="false"
            />
            <button
              type="button"
              id="saints-search-clear"
              class="hidden absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 cursor-pointer"
              title="${t('saints.clearSearch', 'Cancella ricerca')}"
            >
              ${icons.close('w-4 h-4')}
            </button>
          </div>

          <div class="flex items-center justify-between sm:justify-end gap-2 text-xs font-sans text-[var(--text-muted)] flex-shrink-0">
            <span id="saints-results-count" class="font-semibold bg-amber-500/10 text-amber-800 dark:text-amber-300 px-3 py-1.5 rounded-xl border border-amber-500/20 shadow-xs">
            </span>
          </div>
        </div>

        <!-- Liturgical Color Legend (Authentic to Confession & Zone) -->
        <div id="saints-liturgical-legend" class="w-full">
          ${renderLiturgicalLegendHtml(confession, userNationality, lang, false)}
        </div>
      </div>

      <!-- Saints Cards Grid -->
      <div id="saints-cards-grid" class="grid grid-cols-1 md:grid-cols-2 gap-5">
      </div>

    </div>
  `;

  const searchInput = container.querySelector('#saints-search-input');
  const searchClear = container.querySelector('#saints-search-clear');
  const resultsCount = container.querySelector('#saints-results-count');
  const cardsGrid = container.querySelector('#saints-cards-grid');
  const natSelect = container.querySelector('#saints-nationality-select');

  function updateGrid() {
    const filtered = allSaints.filter((saint) => matchesSearch(saint, searchQuery));

    // Update count badge
    if (searchQuery.trim()) {
      resultsCount.textContent = `${filtered.length} / ${allSaints.length} ${t('tools.badgeSaints', 'Santi')}`;
    } else {
      resultsCount.textContent = `${t('saints.allSaints', 'Tutti i Santi')} (${allSaints.length})`;
    }

    // Toggle clear button
    if (searchClear) {
      searchClear.classList.toggle('hidden', !searchQuery.trim());
    }

    // Render cards or empty state
    if (filtered.length === 0) {
      cardsGrid.innerHTML = renderEmptyState(searchQuery);
      const resetBtn = cardsGrid.querySelector('#saints-btn-clear-search');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          searchQuery = '';
          if (searchInput) {
            searchInput.value = '';
            searchInput.focus();
          }
          updateGrid();
        });
      }
    } else {
      cardsGrid.innerHTML = filtered.map(renderCard).join('');

      // Attach share buttons
      cardsGrid.querySelectorAll('.btn-share-saint').forEach((btn) => {
        btn.addEventListener('click', () => {
          const quote = decodeURIComponent(btn.getAttribute('data-quote') || '');
          const name = decodeURIComponent(btn.getAttribute('data-name') || '');
          if (onOpenShareCard) {
            onOpenShareCard(quote, name);
          }
        });
      });
    }
  }

  // Search input events
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      updateGrid();
    });
  }

  if (searchClear) {
    searchClear.addEventListener('click', () => {
      searchQuery = '';
      if (searchInput) {
        searchInput.value = '';
        searchInput.focus();
      }
      updateGrid();
    });
  }

  // Nationality Selector
  if (natSelect) {
    natSelect.addEventListener('change', async () => {
      userNationality = (natSelect.value || 'universal').toLowerCase();
      await saveSetting('user_nationality', userNationality);
      try {
        localStorage.setItem('aurasacra_user_nationality', userNationality);
      } catch (e) {}
      const legendEl = container.querySelector('#saints-liturgical-legend');
      if (legendEl) {
        legendEl.innerHTML = renderLiturgicalLegendHtml(confession, userNationality, lang, false);
      }
      allSaints = prepareSaintsList();
      updateGrid();
    });
  }

  // Initial populate
  updateGrid();
}
