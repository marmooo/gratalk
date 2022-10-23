var CACHE_NAME = "2022-10-23 18:40";
var urlsToCache = [
  "/gratalk/",
  "/gratalk/index.js",
  "/gratalk/words.lst",
  "/gratalk/mp3/bgm.mp3",
  "/gratalk/mp3/cat.mp3",
  "/gratalk/mp3/correct.mp3",
  "/gratalk/mp3/end.mp3",
  "/gratalk/mp3/keyboard.mp3",
  "/gratalk/voice.svg",
  "https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css",
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(function (cache) {
        return cache.addAll(urlsToCache);
      }),
  );
});

self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.match(event.request)
      .then(function (response) {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }),
  );
});

self.addEventListener("activate", function (event) {
  var cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );
});
