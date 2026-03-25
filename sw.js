// Název mezipaměti - ZMĚŇ ČÍSLO PŘI KAŽDÉM UPDATU WEBU (např. v1 -> v2)
const CACHE_NAME = 'kotak-cache-v1';

// Seznam souborů, které se mají uložit pro offline a rychlý start
const urlsToCache = [
  './',
  './index.html',
  './main.html',
  './send.html',
  './accept.html',
  './settings.html',
  './manifest.json',
  './logo.png'
];

// Instalace Service Workeru a uložení souborů do cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Vytvářím novou cache: ' + CACHE_NAME);
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting()) // Vynutí aktivaci nové verze hned
  );
});

// Aktivace a MAZÁNÍ STARÉ CACHE
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Mažu starou cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // Okamžitě převezme kontrolu nad stránkami
  );
});

// Načítání souborů (Network first - zkusí síť, když nejde, vezme cache)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
