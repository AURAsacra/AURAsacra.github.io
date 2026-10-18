// Aura Sacra Service Worker - 100% Offline & Airplane Mode Resilient
// Cross-platform auto-update support for iOS Safari Web App, Android PWA & Desktop
const CACHE_NAME = 'aura-sacra-v1.8.7';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './candle-popup.html',
  './widget.html',
  './manifest.json',
  './css/style.css',
  './js/tailwindcss.js',
  './js/app.js',
  './js/monastic-hours.js',
  './js/candle-timer.js',
  './js/widget-verse.js',
  './js/i18n.js',
  './js/db.js',
  './js/circadian.js',
  './js/schedule.js',
  './js/audio-engine.js',
  './js/speech-engine.js',
  './js/ai-engine.js',
  './js/card-generator.js',
  './js/github-feedback.js',
  './js/icons.js',
  './data/bible-kjv.json',
  './data/bible-cei.json',
  './data/bible-sinodala.json',
  './data/bible-vulgata.json',
  './data/bible-reina.json',
  './data/bible-segond.json',
  './data/bible-luther.json',
  './data/bible-almeida.json',
  './data/bible-synodal.json',
  './js/data/scriptures.js',
  './js/data/bible-books-i18n.js',
  './js/data/scripture-archives.js',
  './js/data/penance.js',
  './js/data/penance-i18n.js',
  './js/data/promises.js',
  './js/data/doubts.js',
  './js/data/saints.js',
  './js/data/saints-i18n.js',
  './js/data/daily-saints.js',
  './js/data/orthodox-saints.js',
  './js/data/national-calendars.js',
  './js/components/navbar.js',
  './js/components/sidebar.js',
  './js/components/bottom-nav.js',
  './js/components/penance-calendar.js',
  './js/components/tools-modal.js',
  './js/components/bible-reader.js',
  './js/components/jesus-chat.js',
  './js/components/prayer-journal.js',
  './js/components/saints-view.js',
  './js/components/focus-mode.js',
  './js/components/floating-candle.js',
  './js/components/audio-player.js',
  './js/components/share-card.js',
  './js/components/settings-modal.js',
  './js/components/api-key-modal.js',
  './js/components/schedule-modal.js',
  './js/components/feedback-modal.js',
  './js/components/sos-temptation.js',
  './js/components/jar-promises.js',
  './js/components/evening-exam.js',
  './js/components/faith-compass.js',
  './js/components/onboarding-modal.js',
  './js/components/widget-modal.js',
  './icons/favicon.png',
  './icons/logo.png',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.all(
        ASSETS_TO_CACHE.map((url) => {
          // Bypass Safari/Chrome HTTP disk cache for code/markup assets during install
          const isCodeAsset =
            url === './' ||
            url.endsWith('.html') ||
            url.endsWith('.js') ||
            url.endsWith('.css') ||
            url.endsWith('.json');
          const req = new Request(url, { cache: isCodeAsset ? 'no-cache' : 'default' });
          return fetch(req)
            .then((res) => {
              if (res && res.status === 200) {
                return cache.put(url, res);
              }
            })
            .catch((err) => {
              console.warn('Asset pre-cache deferred / offline:', url, err);
            });
        })
      );
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      let hadOldCaches = false;
      await Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            hadOldCaches = true;
            console.log('Purging old service worker cache:', key);
            return caches.delete(key);
          }
        })
      );

      await self.clients.claim();

      // Notify all open tabs / iOS Home Screen Web App windows to reload with the fresh version
      if (hadOldCaches) {
        const windowClients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
        for (const client of windowClients) {
          try {
            client.postMessage({ type: 'SW_UPDATED', version: CACHE_NAME });
          } catch (e) {}
        }
      }
    })()
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Never intercept Google Gemini generative language API or Google TTS audio stream
  if (url.hostname.includes('generativelanguage.googleapis.com') || url.hostname.includes('translate.google.com')) {
    return;
  }

  // 1. Navigation requests (HTML documents): network-first with graceful offline fallback
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const cloned = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, cloned);
            });
            return networkResponse;
          }
          return caches.match(event.request).then((cached) => cached || networkResponse);
        })
        .catch(() => {
          return caches.match('./index.html').then((navResponse) => {
            return navResponse || caches.match('./') || new Response('Offline Resource Unavailable', { status: 503, statusText: 'Service Unavailable' });
          });
        })
    );
    return;
  }

  // 2. Code & markup subresources (.js, .css, .html, manifest.json): network-first
  const isCodeOrMarkup =
    url.pathname.endsWith('.html') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('manifest.json');

  if (isCodeOrMarkup) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const cloned = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, cloned);
            });
            return networkResponse;
          }
          return caches.match(event.request, { ignoreSearch: true }).then((cached) => cached || networkResponse);
        })
        .catch(() => {
          return caches.match(event.request, { ignoreSearch: true }).then((cached) => {
            if (cached) return cached;
            return new Response('Offline Resource Unavailable', { status: 503, statusText: 'Service Unavailable' });
          });
        })
    );
    return;
  }

  // Cache-First for heavy static data (Bible JSONs, icons) with background revalidation
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then((cachedResponse) => {
      const fetchPromise = fetch(event.request.url, { credentials: 'same-origin' })
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const cloned = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, cloned);
            });
          }
          return networkResponse;
        })
        .catch(() => null);

      if (cachedResponse) {
        return cachedResponse;
      }

      return fetchPromise.then((networkResponse) => {
        if (networkResponse) return networkResponse;
        return new Response('Offline Resource Unavailable', {
          status: 503,
          statusText: 'Service Unavailable'
        });
      });
    })
  );
});

// ==========================================
// Web Push Notifications & Deep Linking
// ==========================================
self.addEventListener('push', (event) => {
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { title: 'Aura Sacra', body: event.data.text() };
    }
  }

  const title = data.title || 'Aura Sacra — Versetto del Giorno';
  const options = {
    body: data.body || '«Il Signore è il mio pastore: non manco di nulla.» • Salmo 23:1',
    icon: data.icon || './icons/icon-192.png',
    badge: data.badge || './icons/icon-192.png',
    data: data.url || './index.html?tab=bible',
    vibrate: [200, 100, 200],
    actions: [
      { action: 'read', title: '📖 Leggi versetto' },
      { action: 'share', title: '📤 Condividi' }
    ]
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  let targetUrl = event.notification.data || './index.html?tab=bible';

  if (event.action === 'share') {
    targetUrl += (targetUrl.includes('?') ? '&' : '?') + 'share=1';
  }

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url && 'focus' in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});

