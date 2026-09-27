// Minimal service worker — its only job is to make the POS page
// installable as a PWA. It deliberately does NOT cache API responses
// or dynamic data (barcode lookups, sales) since this app is designed
// to work online, in-store, over the counter — same as the desktop
// POS. It just passes every request straight through to the network.

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  // Pass-through — no offline caching, always hit the network.
  event.respondWith(fetch(event.request));
});
