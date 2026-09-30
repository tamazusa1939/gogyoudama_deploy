const cacheName = "tzmazusa-GoggyousatsuOnline-1.1.7";
const contentToCache = [
    "https://storage.googleapis.com/gogyoudama/Build/9d2c11d802b56810a4d964005e8bc50c.loader.js",
    "https://storage.googleapis.com/gogyoudama/Build/f05899c7385b76e53a3a8d213df0b3a8.framework.js.unityweb",
    "https://storage.googleapis.com/gogyoudama/Build/cd1b0cc709f15c822c1091e7d638d774.data.unityweb",
    "https://storage.googleapis.com/gogyoudama/Build/1a9562158f7275936dff0627c18d1728.wasm.unityweb",
    "TemplateData/style.css"

];

self.addEventListener('install', function (e) {
    console.log('[Service Worker] Install');
    // 旧バージョンのSWが開いているタブを握り続けないよう、待機せず即座に有効化する
    self.skipWaiting();

    e.waitUntil((async function () {
      const cache = await caches.open(cacheName);
      console.log('[Service Worker] Caching all: app shell and content');
      await cache.addAll(contentToCache);
    })());
});

self.addEventListener('activate', function (e) {
    e.waitUntil((async function () {
      // バージョン違いの古いキャッシュを削除する。
      // 残しておくと caches.match が古い index.html / manifest を返し続け、更新が反映されない
      const keys = await caches.keys();
      await Promise.all(keys.filter(k => k !== cacheName).map(k => caches.delete(k)));
      await self.clients.claim();
      console.log('[Service Worker] Activated: ' + cacheName);
    })());
});

self.addEventListener('fetch', function (e) {
    e.respondWith((async function () {
      // 現行バージョンのキャッシュだけを参照する（全キャッシュ横断の caches.match は使わない）
      const cache = await caches.open(cacheName);
      let response = await cache.match(e.request);
      console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
      if (response) { return response; }

      response = await fetch(e.request);
      console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
      cache.put(e.request, response.clone());
      return response;
    })());
});
