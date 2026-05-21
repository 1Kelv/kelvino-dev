/// <reference lib="webworker" />
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';

declare const self: ServiceWorkerGlobalScope & { __WB_MANIFEST: { url: string; revision: string | null }[] };

precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();

self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? {};
  const title = (data.title as string) ?? 'Mylestone';
  const options: NotificationOptions = {
    body: (data.body as string) ?? '',
    icon: '/pwa-192x192.png',
    badge: '/pwa-192x192.png',
    tag: (data.tag as string) ?? 'mylestone',
    data: { url: (data.url as string) ?? '/app' },
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = (event.notification.data as { url?: string })?.url ?? '/app';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) return (client as WindowClient).focus();
      }
      return self.clients.openWindow(url);
    })
  );
});
