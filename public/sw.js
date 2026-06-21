const CACHE = 'wk-v1';

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const { request } = e;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Skip Next.js internals and API routes
  if (url.pathname.startsWith('/_next/') || url.pathname.startsWith('/api/')) return;

  // Cross-origin images (book illustrations) — cache-first
  if (url.origin !== self.location.origin) {
    e.respondWith(
      caches.open(CACHE).then(cache =>
        cache.match(request).then(hit => {
          if (hit) return hit;
          return fetch(request).then(res => {
            if (res.ok) cache.put(request, res.clone());
            return res;
          }).catch(() => hit ?? new Response('', { status: 503 }));
        })
      )
    );
    return;
  }

  // Same-origin — network first, fall back to cache
  e.respondWith(
    fetch(request)
      .then(res => {
        if (res.ok) {
          caches.open(CACHE).then(c => c.put(request, res.clone()));
        }
        return res;
      })
      .catch(() => caches.match(request).then(hit => hit ?? new Response('Offline', { status: 503 })))
  );
});
