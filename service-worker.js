/**
 * Service Worker v19 - 强制清除所有缓存
 */
const CACHE_NAME = 'daily-workbench-v19';

self.addEventListener('install', e => self.skipWaiting());

self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys()
            .then(keys => Promise.all(keys.map(k => caches.delete(k))))
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', e => {
    if (e.request.method !== 'GET') return;
    e.respondWith(
        fetch(e.request, {cache: 'no-store'}).catch(() => caches.match(e.request))
    );
});
