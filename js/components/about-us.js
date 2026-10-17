// About Us / Parrocchia Ortodossa Fossano Component for Aura Sacra (9 Languages)
import { t } from '../i18n.js';

export function renderAboutView() {
  const rawP1 = t(
    'about.communityP1',
    'The Romanian Orthodox Parish <strong>"Saint Jacob of Putna"</strong> (Sfântul Iacob de Putna), belonging to the Romanian Orthodox Diocese of Italy, serves as a spiritual and liturgical center of reference for the faithful in Fossano and the Cuneo province.'
  );
  const firstChar = rawP1.charAt(0);
  const restP1 = rawP1.slice(1);

  return `
    <div class="space-y-8 max-w-4xl mx-auto py-2 animate-fade-in">
      
      <!-- Hero Header -->
      <div class="text-center space-y-3 py-6 border-b border-stone-300 dark:border-stone-800">
        <div class="candle-wrapper my-2">
          <div class="candle-wick"></div>
          <div class="candle-flame"></div>
          <div class="candle-body"></div>
        </div>
        <h1 class="text-2xl sm:text-4xl font-bold tracking-widest text-[var(--accent-vermilion)] uppercase font-display">
          ${t('about.title', 'About Us')}
        </h1>
        <p class="text-base sm:text-lg font-serif italic text-[var(--text-secondary)]">
          ${t('about.subtitle', 'Romanian Orthodox Parish “Sfântul Iacob de Putna” – Fossano')}
        </p>
      </div>

      <!-- Our Community & Parish Info Card -->
      <section class="parchment-border rounded-2xl p-5 sm:p-8 bg-[var(--bg-card)] grid grid-cols-1 md:grid-cols-3 gap-6 shadow-sm">
        <div class="md:col-span-2 space-y-4">
          <h2 class="text-xl sm:text-2xl font-display font-semibold text-[var(--accent-gold)] border-b border-stone-300 dark:border-stone-800 pb-2">
            ${t('about.communityTitle', 'Our Community')}
          </h2>
          <p class="text-base font-serif leading-relaxed text-[var(--text-primary)]">
            <span class="illuminated-initial">${firstChar}</span>${restP1}
          </p>
          <p class="text-base font-serif leading-relaxed text-[var(--text-primary)]">
            ${t(
              'about.communityP2',
              'Placed under the heavenly protection of the Holy Hierarch Jacob of Putna, Metropolitan of Moldavia, the parish gathers regularly for the celebration of the Divine Liturgy, the guardianship of the Byzantine tradition, and the practice of Christian charity.'
            )}
          </p>
        </div>

        <!-- Parish Information Card -->
        <div class="bg-[var(--bg-parchment)] border border-stone-300 dark:border-stone-800 rounded-xl p-4 space-y-3 shadow-inner">
          <h3 class="text-xs font-display font-bold text-center text-[var(--accent-gold)] uppercase tracking-wider border-b border-stone-300 dark:border-stone-800 pb-2">
            ${t('about.infoTitle', 'Parish Information')}
          </h3>
          <ul class="space-y-3 text-xs font-sans">
            <li class="flex items-start gap-2.5">
              <span class="text-[var(--accent-gold)] font-bold">☩</span>
              <div>
                <strong class="block text-[var(--text-primary)]">${t('about.patronLabel', 'Patron Saint')}</strong>
                <span class="text-[var(--text-secondary)]">${t('about.patronValue', 'St. Jacob of Putna (May 15)')}</span>
              </div>
            </li>
            <li class="flex items-start gap-2.5">
              <span class="text-[var(--accent-gold)] font-bold">📍</span>
              <div>
                <strong class="block text-[var(--text-primary)]">${t('about.locationLabel', 'Liturgical Seat')}</strong>
                <span class="text-[var(--text-secondary)]">${t('about.locationValue', 'Via Craveri 93, Fossano (Church of St. George)')}</span>
              </div>
            </li>
            <li class="flex items-start gap-2.5">
              <span class="text-[var(--accent-gold)] font-bold">🏛️</span>
              <div>
                <strong class="block text-[var(--text-primary)]">${t('about.jurisdictionLabel', 'Jurisdiction')}</strong>
                <span class="text-[var(--text-secondary)]">${t('about.jurisdictionValue', 'Romanian Orthodox Diocese of Italy')}</span>
              </div>
            </li>
          </ul>
        </div>
      </section>

      <!-- Spiritual Guide -->
      <section class="parchment-border rounded-2xl p-6 sm:p-8 bg-[var(--bg-card)] text-center space-y-4 shadow-sm">
        <h2 class="text-xl sm:text-2xl font-display font-semibold text-[var(--accent-gold)] border-b border-stone-300 dark:border-stone-800 pb-2">
          ${t('about.guideTitle', 'Spiritual Guide')}
        </h2>
        <div class="w-20 h-20 rounded-full border-2 border-[var(--accent-gold)] mx-auto flex items-center justify-center bg-[var(--bg-secondary)] text-[var(--accent-gold)] text-3xl shadow-inner">
          ☩
        </div>
        <h3 class="text-xl font-display font-bold text-[var(--text-primary)]">
          ${t('about.priestName', 'Father Nicolae Pușcașu')}
        </h3>
        <p class="text-xs font-sans uppercase tracking-widest text-[var(--accent-gold)] font-semibold">
          ${t('about.priestRole', 'Parish Priest of the Community')}
        </p>
        <p class="text-sm font-serif text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
          ${t(
            'about.priestBio',
            'Leading the parish since 2017, Father Nicolae devotedly accompanies the community in the Holy Mysteries, catechesis, and daily fraternal life.'
          )}
        </p>
      </section>

      <!-- Our Pillars -->
      <section class="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div class="parchment-border rounded-xl p-5 bg-[var(--bg-card)] border-l-4 border-l-[var(--accent-gold)] space-y-2">
          <h3 class="text-base font-display font-bold text-[var(--text-primary)]">
            ${t('about.pillar1Title', 'Tradition & Rite')}
          </h3>
          <p class="text-xs font-serif text-[var(--text-secondary)] leading-relaxed">
            ${t('about.pillar1Desc', 'Celebration of the Byzantine Divine Liturgy in fidelity to Sacred Tradition.')}
          </p>
        </div>

        <div class="parchment-border rounded-xl p-5 bg-[var(--bg-card)] border-l-4 border-l-[var(--accent-gold)] space-y-2">
          <h3 class="text-base font-display font-bold text-[var(--text-primary)]">
            ${t('about.pillar2Title', 'Hospitality')}
          </h3>
          <p class="text-xs font-serif text-[var(--text-secondary)] leading-relaxed">
            ${t('about.pillar2Desc', 'Support for families and a welcoming spiritual home for all faithful in the area.')}
          </p>
        </div>

        <div class="parchment-border rounded-xl p-5 bg-[var(--bg-card)] border-l-4 border-l-[var(--accent-gold)] space-y-2">
          <h3 class="text-base font-display font-bold text-[var(--text-primary)]">
            ${t('about.pillar3Title', 'Culture & Faith')}
          </h3>
          <p class="text-xs font-serif text-[var(--text-secondary)] leading-relaxed">
            ${t('about.pillar3Desc', 'Preserving the memory and teachings of the Holy Hierarch Jacob of Putna.')}
          </p>
        </div>
      </section>

    </div>
  `;
}

export function renderAboutUs(container) {
  if (!container) return;
  container.innerHTML = renderAboutView();
}
