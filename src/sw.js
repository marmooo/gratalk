const CACHE_NAME = "2024-05-22 09:50";
const urlsToCache = [
  "/gratalk/",
  "/gratalk/index.js",
  "/gratalk/words.lst",
  "/gratalk/mp3/bgm.mp3",
  "/gratalk/mp3/correct3.mp3",
  "/gratalk/mp3/end.mp3",
  "/gratalk/voice.svg",
  "/gratalk/img/cat8.webp",
  "/gratalk/img/cat53.webp",
  "/gratalk/img/cat54.webp",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    }),
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    }),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName)),
      );
    }),
  );
});
