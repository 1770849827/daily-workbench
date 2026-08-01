/**
 * Service Worker - 离线缓存 (v15 - 多文件部署)
 * 版本号变更会自动清除旧缓存，确保用户拿到最新版
 */

const CACHE_NAME = 'daily-workbench-v15';
// 核心资源（不包含贴纸数据，贴纸按需缓存）
const ASSETS = [
    './',
    './index.html',
    './css/style.css',
    './manifest.json',
    './icons/icon-192.png',
    './icons/icon-512.png',
    './js/storage.js',
    './js/sync.js',
    './js/audio-data.js',
    './js/background-data.js',
    './js/cover-data.js',
    './js/splash-data.js',
    './js/app.js',
    './js/modules/home.js',
    './js/modules/todo.js',
    './js/modules/english.js',
    './js/modules/calligraphy.js',
    './js/modules/fitness.js',
    './js/modules/meal.js',
    './js/modules/savings.js',
    './js/modules/accounting.js',
    './js/modules/places.js',
    './js/modules/weekly.js',
    './js/modules/monthly.js'
];

// 安装 - 缓存核心资源
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS))
            .then(() => self.skipWaiting())
    );
});

// 激活 - 清理旧缓存
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
