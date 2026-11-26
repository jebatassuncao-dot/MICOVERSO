/* Micoverso 2.0 — funcionamento offline */
const CACHE="micoverso-v2.0";
const CORE=["./","./index.html","./app.js","./data.js","./config.js","./manifest.webmanifest","./icon-192.png","./icon-512.png","./apple-touch-icon.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)));self.skipWaiting()});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  const req=e.request; if(req.method!=="GET") return;
  const url=new URL(req.url);
  if(url.hostname.includes("api.inaturalist.org")||url.hostname.includes("vlibras")||url.hostname.includes("anthropic")||url.hostname.includes("workers.dev")||url.hostname.includes("gstatic.com")&&url.pathname.includes("firebase")) return;
  const same=url.origin===self.location.origin;
  if(same){ // rede primeiro (para receber atualizações), cache se estiver offline
    e.respondWith(fetch(req).then(res=>{ if(res.ok){const cp=res.clone(); caches.open(CACHE).then(c=>c.put(req,cp))} return res }).catch(()=>caches.match(req).then(r=>r||caches.match("./index.html"))));
    return;
  }
  if(req.destination==="image"||req.destination==="font"||url.hostname.includes("fonts.g")){ // cache primeiro
    e.respondWith(caches.match(req).then(r=>r||fetch(req).then(res=>{ const cp=res.clone(); caches.open(CACHE).then(c=>c.put(req,cp)); return res })));
  }
});
