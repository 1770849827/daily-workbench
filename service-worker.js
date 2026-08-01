/**
 * Service Worker - 离线缓存 (v17 - 强制刷新版)
 * 版本号变更会自动清除旧缓存，确保用户拿到最新版
 */

const CACHE_NAME = 'daily-workbench-v17';

// 安装 - 跳过等待直接激活
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

// 激活 - 清理所有旧缓存（强制刷新）
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(name => caches.delete(name))
            );
        }).then(() => self.clients.claim())
    );
});

// 拦截请求 - 网络优先，不缓存（让浏览器自己管理缓存）
self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;

    event.respondWith(
        fetch(event.request)
            .catch(() => caches.match(event.request))
    );
});
