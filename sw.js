

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("nexora").then(cache => {
      return cache.addAll([
        "./",
        "./index.html",
        "./app.js",
        "./style.css",
        "./manifest.json"
      ]);
    })
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request);
    })
  );
});
