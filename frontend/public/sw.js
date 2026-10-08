/* Network-only worker: never cache listings, account pages, API data or uploads. */
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET" || event.request.mode !== "navigate") return;
  event.respondWith(fetch(event.request).catch(() => new Response(
    `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>ALHADUNICARS — Offline</title><style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#09090b;color:white;font:16px system-ui}main{max-width:420px;padding:32px;text-align:center}p{color:#a1a1aa;line-height:1.8}a{display:inline-block;margin-top:12px;padding:14px 24px;border-radius:14px;background:#c1121f;color:white;text-decoration:none}</style><main><h1>ALHADUNICARS</h1><h2>You're offline</h2><p>Reconnect to view the latest vehicles and access your account.</p><p lang="ar" dir="rtl">لا يوجد اتصال بالإنترنت. أعد الاتصال لعرض أحدث السيارات والوصول إلى حسابك.</p><a href="/">Try again · حاول مجدداً</a></main></html>`,
    { status: 503, headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } }
  )));
});
