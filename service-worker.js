
/* Colorinka UPGRADE: PWA service worker (pro) */
const CACHE = 'Colorinka-v2';
const CORE = [
  "index.html",
  "jghg-main/game.js",
  "jghg-main/service-worker.js",
  "jghg-main/styles.css",
  "jghg-main/ui/audio.js",
  "jghg-main/ui/bg.css",
  "jghg-main/ui/fx.css",
  "jghg-main/ui/fx.js",
  "jghg-main/ui/menu.css",
  "jghg-main/ui/menu_init.js",
  "jghg-main/ui/particles.js",
  "jghg-main/ui/sfx.js",
  "jghg-main/ui/shop.js",
  "jghg-main/ui/side-menu.css",
  "jghg-main/ui/utils.js",
  "manifest.webmanifest",
  "ui/achievements.css",
  "ui/achievements.js",
  "ui/advanced.css",
  "ui/advanced.js",
  "ui/audio.js",
  "ui/game-effects.css",
  "ui/game-effects.js",
  "ui/game.js",
  "ui/progress.css",
  "ui/progress.js",
  "ui/settings.js",
  "ui/shop.css",
  "ui/shop.js",
  "ui/stats.css",
  "ui/stats.js",
  "ui/timer.css",
  "ui/timer.js",
  "ui/upgrade.css",
  "ui/utils.js"
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE)));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))));
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).catch(() => caches.match('offline.html')));
    return;
  }
  e.respondWith(
    caches.match(req).then((hit) => hit || fetch(req).then((res) => {
      const clone = res.clone();
      caches.open(CACHE).then(c => c.put(req, clone));
      return res;
    })).catch(() => caches.match(req))
  );
});
