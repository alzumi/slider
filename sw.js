// Asignar nombre y version de la cache
const CACHE_NAME = 'v1_cache_slider_PWA';

//Fichero a cachear en la aplicacion
var urlsToCache = [
	'./',
	'./index.html',
	'./css/estilos.css',
	'./img/favicon.png',
	'./img/favicon-1024.png',
	'./img/favicon-512.png',
	'./img/favicon-384.png',
	'./img/favicon-256.png',
	'./img/favicon-192.png',
	'./img/favicon-128.png',
	'./img/favicon-96.png',
	'./img/favicon-64.png',
	'./img/favicon-32.png',
	'./img/favicon-16.png',
	'./img/facebook32.png',
	'./img/instagram32.png',
	'./img/linkedin32.png',
	'./img/youtube32.png'
];

// evento install
//Instalacion del service worker y guardar en cache los recursos estaticos
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache)
          .then(() => self.skipWaiting())
      })
      .catch(err => console.log('Falló registro de cache', err))
  )
})


// una vez que se instala el SW, se activa y 
// busca los recursos para hacer que funcione sin conexión
self.addEventListener('activate', e => {
  const cacheWhitelist = [CACHE_NAME]

  e.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            //Eliminamos lo que ya no se necesita en cache
            if (cacheWhitelist.indexOf(cacheName) === -1) {
              return caches.delete(cacheName)
            }
          })
        )
      })
      // Le indica al SW activar el cache actual
      .then(() => self.clients.claim())
  )
})

/*evento fect: cuando solicitemos una url,
 nos devuelve los recursos de la app, o lo solicita a la app que esta en la web
*/
self.addEventListener('fetch', e => {
  //Responder ya sea con el objeto en caché o continuar y buscar la url real
  e.respondWith(
    caches.match(e.request) // si la informacion esta cacheada?
      .then(res => {
        if (res) {
          //recuperar los datos del cache
          return res  
        }
        //hago una  petición a la url desde el servidor para recuperarla y mostrarla
        return fetch(e.request)
      })
  )
})