/**
 * Service Worker v18 - 单文件部署
 * 只缓存 index.html（自包含）和贴纸文件
 */
const CACHE_NAME = 'daily-workbench-v18';

self.addEventListener('install', e => self.skipWaiting());

self.addEventListener('activate', e => {
    e.waitUntil(caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
    if (e.request.method !== 'GET') return;
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});
