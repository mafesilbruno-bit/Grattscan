// Mantém o app funcionando sem internet. Com internet, sempre busca a versão mais nova.
const C='freq-gratt-v1';
const FILES=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./apple-touch-icon.png'];
self.addEventListener('install',e=>{ e.waitUntil(caches.open(C).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting())); });
self.addEventListener('activate',e=>{ e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET') return;
  const same=new URL(e.request.url).origin===location.origin;
  e.respondWith(fetch(e.request).then(r=>{ if(r.ok&&same){ const cp=r.clone(); caches.open(C).then(c=>c.put(e.request,cp)); } return r; })
    .catch(()=>caches.match(e.request,{ignoreSearch:true}).then(m=>m||caches.match('./index.html'))));
});
