// ContractorPro Service Worker
// Handles offline caching for full PWA functionality

const CACHE_NAME = 'contractorpro-v1.0.0';
const OFFLINE_URL = 'index.html';

// Files to cache on install — the full app shell
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/js/app.js',
  '/data/pricing.js',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/icon-180.png',
  '/icons/icon-152.png',
  '/icons/icon-32.png',
  '/icons/icon-16.png',
  // Google Fonts — cached for offline use
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Barlow+Condensed:wght@600;700&display=swap',
];

// =============================================
// INSTALL — cache all app shell assets
// =============================================
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[SW] Pre-caching app shell');
      // Cache what we can; don't fail install if a resource errors
      return Promise.allSettled(
        PRECACHE_ASSETS.map(url =>
          cache.add(url).catch(err => console.warn('[SW] Failed to cache:', url, err))
        )
      );
    }).then(() => self.skipWaiting())
  );
});

// =============================================
// ACTIVATE — clean up old caches
// =============================================
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      )
    ).then(() => self.clients.claim())
  );
});

// =============================================
// FETCH — Cache-first for app shell, 
//         Network-first for external (fonts/APIs)
// =============================================
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests and browser-extension URLs
  if (request.method !== 'GET') return;
  if (url.protocol === 'chrome-extension:') return;
  if (url.protocol === 'moz-extension:') return;

  // For same-origin app assets: Cache First
  if (url.origin === location.origin) {
    event.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached;
        return fetch(request).then(response => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
          }
          return response;
        }).catch(() => {
          // Offline fallback — return app shell for navigation requests
          if (request.mode === 'navigate') {
            return caches.match(OFFLINE_URL);
          }
        });
      })
    );
    return;
  }

  // For Google Fonts: Stale-while-revalidate
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache =>
        cache.match(request).then(cached => {
          const networkFetch = fetch(request).then(response => {
            if (response && response.status === 200) {
              cache.put(request, response.clone());
            }
            return response;
          }).catch(() => cached);
          return cached || networkFetch;
        })
      )
    );
    return;
  }

  // For all other external resources: Network with cache fallback
  event.respondWith(
    fetch(request).catch(() => caches.match(request))
  );
});

// =============================================
// BACKGROUND SYNC (future: sync estimates)
// =============================================
self.addEventListener('sync', event => {
  if (event.tag === 'sync-estimates') {
    event.waitUntil(syncEstimates());
  }
});

async function syncEstimates() {
  // Placeholder for future server sync
  console.log('[SW] Background sync triggered');
}

// =============================================
// PUSH NOTIFICATIONS (future: payment reminders)
// =============================================
self.addEventListener('push', event => {
  if (!event.data) return;
  const data = event.data.json();
  event.waitUntil(
    self.registration.showNotification(data.title || 'ContractorPro', {
      body: data.body || '',
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-32.png',
      data: data,
    })
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});

console.log('[SW] ContractorPro service worker loaded — v1.0.0');
