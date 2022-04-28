'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "d731d3c8e3618e43b9cb684e758f8a61",
"assets/assets%255Cfonts%255CSocialMediaIcons.ttf": "736b5bcb7272edfd2061d1bda9be9c3d",
"assets/FontManifest.json": "5a2176600cfa8545d39f656a2c507e48",
"assets/fonts/MaterialIcons-Regular.otf": "7e7a6cccddf6d7b20012a548461d5d81",
"assets/NOTICES": "3b38a8d0e0f9d7f9ec045237d560c402",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"canvaskit/canvaskit.js": "c2b4e5f3d7a3d82aed024e7249a78487",
"canvaskit/canvaskit.wasm": "4b83d89d9fecbea8ca46f2f760c5a9ba",
"canvaskit/profiling/canvaskit.js": "ae2949af4efc61d28a4a80fffa1db900",
"canvaskit/profiling/canvaskit.wasm": "95e736ab31147d1b2c7b25f11d4c32cd",
"favicon.ico": "56e8f2ce8d80019b5fdb85210c430c71",
"favicon.png": "56e8f2ce8d80019b5fdb85210c430c71",
"icons/android-icon-144x144.png": "4d08d699a94cdf8fcb01e3944ec69557",
"icons/android-icon-192x192.png": "a3b83bdff65224102a794509a3b8fc64",
"icons/android-icon-36x36.png": "132e9007bfb15d354c117c0e5eddb594",
"icons/android-icon-48x48.png": "8919fea459f2417394c8bbbf30099b13",
"icons/android-icon-72x72.png": "76ce5659318c13b8eaa0e5098e0c0243",
"icons/android-icon-96x96.png": "f45eb567c94824ce34d596b483ebb001",
"icons/apple-icon-114x114.png": "f9f0f473ccecd6921c919a5d2cfbe6e5",
"icons/apple-icon-120x120.png": "345ece2aac3e729a6850e881730e01bb",
"icons/apple-icon-57x57.png": "b728246e4b8031f8509a039ebfeb021a",
"icons/apple-icon-60x60.png": "485e71cdeb54cf27b639dbd1b6081ee8",
"icons/apple-icon-72x72.png": "76ce5659318c13b8eaa0e5098e0c0243",
"icons/apple-icon-76x76.png": "4ecb431845bd1f70f051c7cbb71fc57f",
"icons/apple-icon-precomposed.png": "02fefb71ed56c1dcd7e4d1289cf3b2bd",
"icons/apple-icon.png": "02fefb71ed56c1dcd7e4d1289cf3b2bd",
"icons/browserconfig.xml": "653d077300a12f09a69caeea7a8947f8",
"icons/favicon-16x16.png": "2f58ce797af198fdbd044c51e2aae3e6",
"icons/favicon-32x32.png": "68f6debeb7590d4f8d004c7669b28820",
"icons/favicon-96x96.png": "f45eb567c94824ce34d596b483ebb001",
"icons/favicon.ico": "56e8f2ce8d80019b5fdb85210c430c71",
"icons/manifest.json": "b58fcfa7628c9205cb11a1b2c3e8f99a",
"icons/ms-icon-144x144.png": "4d08d699a94cdf8fcb01e3944ec69557",
"icons/ms-icon-150x150.png": "e05887e5da10c9c66b0b82d91fa29156",
"icons/ms-icon-310x310.png": "89063338016ce6d6f804e3ac7f9f1dea",
"icons/ms-icon-70x70.png": "5029ec6cdf4ff5b4c97ec298cb32ee5b",
"index.html": "5905b03bc0794d1498734ec2742c0c8c",
"/": "5905b03bc0794d1498734ec2742c0c8c",
"main.dart.js": "8c1b1cfd70250e6f7d2d5e6b54037a9a",
"manifest.json": "b58fcfa7628c9205cb11a1b2c3e8f99a",
"version.json": "009c9e65172e010890f7f65fde438006"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
