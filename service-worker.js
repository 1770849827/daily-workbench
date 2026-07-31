/**
 * Service Worker - 离线缓存
 * 版本号变更会自动清除旧缓存，确保用户拿到最新版
 */

const CACHE_NAME = 'daily-workbench-v14';
const ASSETS = [
    './',
    './index.html',
    './manifest.json',
    './icons/icon-192.png',
    './icons/icon-512.png'
];

// 安装 - 缓存资源
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS))
            .then(() => self.skipWaiting())
    );
});

// 激活 - 清理旧缓存（版本号变了就全清）
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames
                    .filter(name => name !== CACHE_NAME)
                    .map(name => caches.delete(name))
            );
        }).then(() => self.clients.claim())
    );
});

// 拦截请求 - 网络优先，离线降级到缓存
self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;

    event.respondWith(
        fetch(event.request)
            .then(response => {
                // 网络成功：缓存副本 + 返回最新
                if (response && response.status === 200 && event.request.url.startsWith(self.location.origin)) {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
                }
                return response;
            })
            .catch(() => {
                // 网络失败：返回缓存
                return caches.match(event.request);
            })
    );
});
