// Service Worker for Nihongo Fun Path PWA
const CACHE_NAME = 'nihongo-fun-path-v2';
const OFFLINE_URL = '/offline.html';

// Assets to cache immediately on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/offline.html',
  '/static/js/bundle.js',
  // Background Music tracks for offline use
  'https://cdn.pixabay.com/audio/2023/03/26/audio_1d5c4319b7.mp3',
  'https://cdn.pixabay.com/audio/2025/03/16/audio_5b558f8091.mp3',
  'https://cdn.pixabay.com/audio/2025/06/13/audio_06dd0dd326.mp3',
  'https://cdn.pixabay.com/audio/2024/11/15/audio_157298f798.mp3',
  'https://cdn.pixabay.com/audio/2024/03/18/audio_f9f5488280.mp3'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching static assets and music');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch event - cache-first for media/assets, stale-while-revalidate for others
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Cache-First strategy for Media and Fonts
  if (url.hostname.includes('cdn.pixabay.com') || url.pathname.endsWith('.mp3') || url.pathname.endsWith('.woff2')) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;

        return fetch(event.request).then((networkResponse) => {
          if (networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // Network-First with Cache Fallback for everything else
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          if (event.request.mode === 'navigate') return caches.match(OFFLINE_URL);
          return new Response('Offline', { status: 503 });
        });
      })
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
