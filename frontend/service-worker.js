const CACHE_NAME = "site-static-v0.1";

self.addEventListener("install", (event) => {
  console.log("installed");
  self.skipWaiting(); // makes the new service-worker take effect immediately
});
