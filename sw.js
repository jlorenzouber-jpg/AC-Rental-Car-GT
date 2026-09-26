const CACHE_NAME="ac-rental-car-gt-v2";
const APP_SHELL=["./","./index.html","./ac-logo.png","./manifest.webmanifest"];
self.addEventListener("install",event=>event.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(APP_SHELL)).then(()=>self.skipWaiting())));
self.addEventListener("activate",event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",event=>{
 if(event.request.method!=="GET")return;
 const u=new URL(event.request.url);
 if(u.pathname.endsWith("/index.html")||u.pathname.endsWith("/")){
   event.respondWith(fetch(event.request,{cache:"no-store"}).then(r=>{const c=r.clone();caches.open(CACHE_NAME).then(x=>x.put(event.request,c));return r}).catch(()=>caches.match(event.request).then(x=>x||caches.match("./index.html"))));
   return;
 }
 event.respondWith(caches.match(event.request).then(c=>c||fetch(event.request).then(r=>{const x=r.clone();caches.open(CACHE_NAME).then(y=>y.put(event.request,x));return r}).catch(()=>caches.match("./index.html"))));
});
