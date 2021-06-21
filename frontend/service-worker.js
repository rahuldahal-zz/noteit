const CACHE_NAMES = {
  static: "static-v0.7",
  general: "general-v0.3",
};
const STATIC_ASSETS = [
  "/",
  "/static/main.js",
  "/static/vendors~main.js",
  "/static/styles.css",
  "/static/1.styles.css",
  "/manifest.json",
  "https://res.cloudinary.com/rdaahal/image/upload/v1617460505/noteit/icons/noteit-96x96_xvnvdt.png",
];

self.addEventListener("install", (event) => {
  console.log("installed");
  event.waitUntil(
    caches
      .open(CACHE_NAMES.static)
      .then((cache) => {
        console.log("caching static assets");
        cache.addAll(STATIC_ASSETS);
      })
      .catch((err) => console.log(err))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("is activated");
  const cacheWhitelist = [];
  cacheWhitelist.push(CACHE_NAMES.static, CACHE_NAMES.general);

  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
          return null;
        })
      )
    )
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const { host, href, pathname } = new URL(request.url);
  const fetchAndCache = [
    /:\/\/[a-z0-9]+.cloudinary/,
    /:\/\/[a-z0-9]+.googleusercontent/,
    /:\/\/platform-lookaside.fbsbx.com/,
    /\/users\/availableNote/,
    /fonts.(googleapis|gstatic)/,
  ];

  return event.respondWith(
    caches
      .match(request)
      .then((response) => {
        if (response) {
          console.log("returning from cache ", pathname);
          return response;
        }
        if (fetchAndCache.some((regex) => regex.test(href))) {
          console.log("about to fetch and cache");
          return caches
            .open(CACHE_NAMES.general)
            .then((cache) => {
              return fetch(request)
                .then((response) => {
                  console.log("fetching and caching ", href);
                  cache.put(request, response.clone());
                  return response;
                })
                .catch((err) => console.log(err));
            })
            .catch((err) => console.log(err));
        }

        console.log("actually fetching... ", href);
        return fetch(request);
      })
      .catch((err) => console.log(err))
  );
});
