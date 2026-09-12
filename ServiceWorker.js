const cacheName = "tzmazusa-GoggyousatsuOnline-1.1.3";
const contentToCache = [
    "https://storage.googleapis.com/gogyoudama/Build/839cf1333a4343da7d61b0b028bb615b.loader.js",
    "https://storage.googleapis.com/gogyoudama/Build/eed033890c2bdc9bfc5919cf006d15dc.framework.js.unityweb",
    "https://storage.googleapis.com/gogyoudama/Build/94f93b823a0e981a3d4207325c03d435.data.unityweb",
    "https://storage.googleapis.com/gogyoudama/Build/2855c38c8f1b38f3f7bc5ed6d1e29ba4.wasm.unityweb",
    "TemplateData/style.css"

];

self.addEventListener('install', function (e) {
    console.log('[Service Worker] Install');
    
    e.waitUntil((async function () {
      const cache = await caches.open(cacheName);
      console.log('[Service Worker] Caching all: app shell and content');
      await cache.addAll(contentToCache);
    })());
});

self.addEventListener('fetch', function (e) {
    e.respondWith((async function () {
      let response = await caches.match(e.request);
      console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
      if (response) { return response; }

      response = await fetch(e.request);
      const cache = await caches.open(cacheName);
      console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
      cache.put(e.request, response.clone());
      return response;
    })());
});
