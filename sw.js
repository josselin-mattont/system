// SYSTEM — service worker limité à l'app shell.
// Il ne met jamais en cache une donnée applicative, une réponse HAL ou un portfolio externe.
const CACHE = 'system-v0.9.3-production-connectors-rc1-shell';
const SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/system-192.png',
  './icons/system-512.png',
  './icons/system-maskable-512.png',
  './icons/apple-touch-icon.png'
];

self.addEventListener('install', (e) => {
  // Installation atomique : un shell incomplet fait échouer l'installation.
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)));
});

self.addEventListener('activate', (e) => {
  // Seuls les anciens caches SYSTEM sont retirés.
  e.waitUntil(caches.keys().then((keys) => Promise.all(
    keys.filter((k) => k.indexOf('system-') === 0 && k !== CACHE).map((k) => caches.delete(k))
  )));
});

// Activation strictement volontaire : seul ce message précis fait passer le worker en avant.
self.addEventListener('message', (e) => {
  const m = e.data;
  if (m && m.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;                       // POST/PUT/DELETE : réseau normal
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;        // cross-origin : jamais intercepté

  if (req.mode === 'navigate') {
    // Réseau d'abord : la version fraîche prime, le shell en cache sert de secours hors ligne.
    e.respondWith(fetch(req).catch(() => caches.match('./index.html')));
    return;
  }
  // Ressources statiques du shell : cache d'abord, déterministe.
  if (/\/(manifest\.webmanifest|index\.html)$/.test(url.pathname) || /\/icons\/[^/]+$/.test(url.pathname)) {
    e.respondWith(caches.match(req).then((r) => r || fetch(req)));
  }
});
