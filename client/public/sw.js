const CACHE_NAME = 'gombe-safe-v1';
const urlsToCache = [
  '/',
  '/src/main.tsx',
  '/src/index.css',
  'https://api.mapbox.com/mapbox-gl-js/v3.0.1/mapbox-gl.css',
  'https://api.mapbox.com/mapbox-gl-js/v3.0.1/mapbox-gl.js'
];

// Install service worker and cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch from cache when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// Background sync for offline incident reports
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync-incident') {
    event.waitUntil(doBackgroundSync());
  }
});

function doBackgroundSync() {
  // Get pending incident reports from IndexedDB and sync when online
  return new Promise((resolve) => {
    console.log('Background sync for incidents');
    resolve();
  });
}

// Handle messages from the main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Update cache when new version is available
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
