const CACHE_NAME = 'gombe-safe-v2';
const STATIC_CACHE = 'gombe-safe-static-v2';
const DYNAMIC_CACHE = 'gombe-safe-dynamic-v2';

const urlsToCache = [
  '/',
  '/src/main.tsx',
  '/src/index.css',
  '/manifest.json',
  'https://api.mapbox.com/mapbox-gl-js/v3.15.0/mapbox-gl.css',
  'https://api.mapbox.com/mapbox-gl-js/v3.15.0/mapbox-gl.js'
];

// Offline incident reports storage
const OFFLINE_INCIDENTS_KEY = 'offline-incidents';

// Install service worker and cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then(cache => cache.addAll(urlsToCache)),
      self.skipWaiting()
    ])
  );
});

// Activate service worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              return caches.delete(cacheName);
            }
          })
        );
      }),
      self.clients.claim()
    ])
  );
});

// Enhanced fetch handling with offline support
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request));
    return;
  }

  // Handle static assets
  event.respondWith(handleStaticRequest(request));
});

async function handleApiRequest(request) {
  const url = new URL(request.url);
  
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Network failed, try cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline response for incidents
    if (url.pathname === '/api/incidents') {
      return new Response(JSON.stringify([]), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Return offline response for security areas
    if (url.pathname === '/api/security-areas') {
      return new Response(JSON.stringify([
        {
          id: 'bolari-offline',
          name: 'Bolari District',
          description: 'High-risk area with documented Kalare gang activity',
          riskLevel: 'high',
          latitude: 10.2937,
          longitude: 11.1694,
          radius: 2000,
          incidentCount: 23,
          lastUpdated: new Date().toISOString()
        }
      ]), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    throw error;
  }
}

async function handleStaticRequest(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return caches.match('/');
    }
    throw error;
  }
}

// Background sync for offline incident reports
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync-incident') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  try {
    // Get offline incidents from IndexedDB
    const offlineIncidents = await getOfflineIncidents();
    
    if (offlineIncidents.length > 0) {
      console.log(`Syncing ${offlineIncidents.length} offline incidents`);
      
      // Sync each incident
      for (const incident of offlineIncidents) {
        try {
          const response = await fetch('/api/incidents', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(incident)
          });
          
          if (response.ok) {
            // Remove from offline storage
            await removeOfflineIncident(incident.id);
            console.log(`Synced incident: ${incident.id}`);
          }
        } catch (error) {
          console.error(`Failed to sync incident ${incident.id}:`, error);
        }
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// IndexedDB helpers for offline incidents
async function getOfflineIncidents() {
  return new Promise((resolve) => {
    const request = indexedDB.open('GombeSafeDB', 1);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('offlineIncidents')) {
        db.createObjectStore('offlineIncidents', { keyPath: 'id' });
      }
    };
    
    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(['offlineIncidents'], 'readonly');
      const store = transaction.objectStore('offlineIncidents');
      const getAllRequest = store.getAll();
      
      getAllRequest.onsuccess = () => {
        resolve(getAllRequest.result || []);
      };
      
      getAllRequest.onerror = () => {
        resolve([]);
      };
    };
    
    request.onerror = () => {
      resolve([]);
    };
  });
}

async function removeOfflineIncident(id) {
  return new Promise((resolve) => {
    const request = indexedDB.open('GombeSafeDB', 1);
    
    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(['offlineIncidents'], 'readwrite');
      const store = transaction.objectStore('offlineIncidents');
      const deleteRequest = store.delete(id);
      
      deleteRequest.onsuccess = () => resolve();
      deleteRequest.onerror = () => resolve();
    };
    
    request.onerror = () => resolve();
  });
}

// Handle messages from the main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'STORE_OFFLINE_INCIDENT') {
    storeOfflineIncident(event.data.incident);
  }
});

async function storeOfflineIncident(incident) {
  return new Promise((resolve) => {
    const request = indexedDB.open('GombeSafeDB', 1);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('offlineIncidents')) {
        db.createObjectStore('offlineIncidents', { keyPath: 'id' });
      }
    };
    
    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(['offlineIncidents'], 'readwrite');
      const store = transaction.objectStore('offlineIncidents');
      const addRequest = store.add(incident);
      
      addRequest.onsuccess = () => resolve();
      addRequest.onerror = () => resolve();
    };
    
    request.onerror = () => resolve();
  });
}
