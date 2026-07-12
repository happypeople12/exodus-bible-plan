const CACHE="exodus-v2";
const ASSETS=["/","/index.html","/style.css","/app.js","/plan.json","/logo.jpg","/icon-192.png","/icon-512.png","/manifest.webmanifest"];

self.addEventListener("install",event=>{
  event.waitUntil(
    caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting())
  );
});

self.addEventListener("activate",event=>{
  event.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key))))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener("fetch",event=>{
  const url=new URL(event.request.url);

  // Внешние ссылки, включая bible.ru, service worker не перехватывает.
  if(url.origin!==self.location.origin || event.request.method!=="GET"){
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(response=>{
        const copy=response.clone();
        caches.open(CACHE).then(cache=>cache.put(event.request,copy));
        return response;
      })
      .catch(()=>caches.match(event.request).then(cached=>cached||caches.match("/index.html")))
  );
});