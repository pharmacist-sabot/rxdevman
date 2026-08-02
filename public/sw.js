const CACHE_NAME = 'rxdevman-v1';
const PRECACHE_URLS = [
  '/',
  '/blog',
  '/blog/series',
  '/blog/categories',
  '/blog/tags',
  '/favicon.svg',
  '/icon.svg',
  '/icon-192.png',
  '/icon-512.png',
  '/apple-touch-icon.svg',
  '/site.webmanifest',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS)),
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)),
      ),
    ),
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET')
    return;

  const url = new URL(request.url);

  // Pagefind: CacheFirst (search index)
  if (url.pathname.startsWith('/pagefind/')) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) =>
        cache.match(request).then((cached) => {
          if (cached)
            return cached;
          return fetch(request).then((response) => {
            if (response.ok)
              cache.put(request, response.clone());
            return response;
          });
        }),
      ),
    );
    return;
  }

  // API: NetworkFirst with timeout
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      Promise.race([
        fetch(request).then((response) => {
          if (response.ok) {
            caches.open(CACHE_NAME).then((cache) => cache.put(request, response.clone()));
          }
          return response;
        }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('timeout')), 5000)),
      ]).catch(() => caches.match(request)),
    );
    return;
  }

  // HTML: NetworkFirst (serve offline fallback from cache)
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match(request)),
    );
    return;
  }

  // Static assets: CacheFirst
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) =>
      cache.match(request).then((cached) => {
        if (cached)
          return cached;
        return fetch(request).then((response) => {
          if (response.ok && url.origin === self.location.origin)
            cache.put(request, response.clone());
          return response;
        });
      }),
    ),
  );
});
