// Smriti Pass 2.0 — Service Worker
const CACHE_NAME = 'smritipass-v2.1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/js/app.js',
  '/js/tourist.js',
  '/js/checkout.js',
  '/js/artisan.js',
  '/js/admin.js',
  '/manifest.webmanifest'
];

const FONT_CACHE = 'smritipass-fonts-v1';
const API_CACHE = 'smritipass-api-v1';

// Install — precache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Precaching static assets');
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate — clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME && key !== FONT_CACHE && key !== API_CACHE)
          .map((key) => {
            console.log('[SW] Removing old cache:', key);
            return caches.delete(key);
          })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch — strategy depends on request type
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // API calls → Network-first, fall back to cache
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(request, API_CACHE));
    return;
  }

  // Google Fonts → Cache-first
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(cacheFirst(request, FONT_CACHE));
    return;
  }

  // Static assets → Cache-first, fall back to network
  event.respondWith(cacheFirst(request, CACHE_NAME));
});

// Network-first strategy
async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await caches.match(request);
    if (cached) return cached;
    return offlineFallback();
  }
}

// Cache-first strategy
async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    return offlineFallback();
  }
}

// Offline fallback page
function offlineFallback() {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Smriti Pass — Offline</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Inter', system-ui, sans-serif;
      background: #f5f0e8;
      color: #1a1a2e;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      text-align: center;
      padding: 2rem;
    }
    .offline-container { max-width: 400px; }
    .offline-icon { font-size: 4rem; margin-bottom: 1.5rem; }
    h1 { font-family: 'Playfair Display', Georgia, serif; color: #1a1a3e; margin-bottom: 0.5rem; font-size: 1.75rem; }
    p { color: #6b6b8d; line-height: 1.6; margin-bottom: 1.5rem; }
    button {
      background: #c9a84c; color: #1a1a3e; border: none; padding: 0.75rem 2rem;
      border-radius: 8px; font-weight: 600; font-size: 1rem; cursor: pointer;
      transition: background 0.2s;
    }
    button:hover { background: #d4b96a; }
  </style>
</head>
<body>
  <div class="offline-container">
    <div class="offline-icon">🏛️</div>
    <h1>You're Offline</h1>
    <p>Smriti Pass needs an internet connection to fetch artisan stories and product data. Please check your connection and try again.</p>
    <button onclick="location.reload()">Try Again</button>
  </div>
</body>
</html>`;
  return new Response(html, {
    headers: { 'Content-Type': 'text/html' },
    status: 503,
    statusText: 'Offline'
  });
}
