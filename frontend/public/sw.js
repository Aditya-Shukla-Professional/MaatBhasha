// MaatBhasha Service Worker v5 — Fresh Dev & Offline Cache
const CACHE_NAME = 'maatbhasha-v5';

const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/fonts/NotoSansOlChiki-Regular.woff2',
];

// Install: precache shell + local font
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

// Activate: clean old caches immediately
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch strategy:
//   /api/*       — network-only (never cached)
//   vite/src/css — network-first in development
//   /fonts/*     — cache-first (offline Ol Chiki font)
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Always network for API calls
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(fetch(request));
    return;
  }

  // Cache-first for fonts
  if (url.pathname.startsWith('/fonts/')) {
    event.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached;
        return fetch(request).then(response => {
          if (!response || response.status !== 200) return response;
          const toCache = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, toCache));
          return response;
        });
      })
    );
    return;
  }

  // Network-first for development & assets so edits reflect instantly
  event.respondWith(
    fetch(request).then(response => {
      if (response && response.status === 200 && response.type === 'basic') {
        const toCache = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, toCache));
      }
      return response;
    }).catch(() => {
      return caches.match(request).then(cached => cached || caches.match('/index.html'));
    })
  );
});

