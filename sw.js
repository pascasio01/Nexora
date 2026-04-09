

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("nexora").then(cache => {
      return cache.addAll(["./"]);
    })
  );
});