const CACHE = 'hrj-cache-v1';
const ASSETS = [
  './',
  './index.html',
  './game.js',
  './storage.js',
  './ui.css'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
});
self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});