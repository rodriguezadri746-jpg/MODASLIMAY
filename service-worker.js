const CACHE_NAME = 'modas-limay-v1';

// Archivos críticos para que la app abra (el "corazón" de la web)
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './images/icon-192.png',
  './images/icon-512.png'
];

// Instalación: Guarda lo básico
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Caché abierto y guardando archivos críticos');
      return cache.addAll(urlsToCache);
    })
  );
});

// Estrategia: Cache First + Dynamic Caching (Esto arregla tus imágenes)
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(res => {
      // Si el archivo ya está en el caché (como el index), lo devuelve rápido
      if (res) return res;

      // Si NO está (como una foto de un vestido), la busca en internet
      return fetch(e.request).then(networkResponse => {
        // Si es una imagen de tu carpeta de vestidos, la guarda en el caché para la próxima vez
        if (e.request.url.includes('images/')) {
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(e.request, networkResponse.clone());
            return networkResponse;
          });
        }
        return networkResponse;
      });
    })
  );
});