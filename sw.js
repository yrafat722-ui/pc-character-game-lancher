/* =========================================================
   PC Character Games - SERVICE WORKER (CACHE SYSTEM)
   ========================================================= */

const CACHE_NAME = 'pc-games-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/games.html',
    '/support.html',
    '/contact.html',
    '/about.html',
    '/whats-new.html',
    '/style.css',
    '/app.js'
];

// تثبيت الكاش وحفظ الملفات
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('تم فتح الكاش بنجاح');
            return cache.addAll(urlsToCache);
        })
    );
});

// تفعيل الكاش وحذف القديم إذا حصل تحديث
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('حذف الكاش القديم:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// جلب الملفات من الكاش مباشرة لتسريع الموقع وتجنب التعليق
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});