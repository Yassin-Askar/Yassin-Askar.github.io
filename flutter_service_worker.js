'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "363fcec43dd7a006f0fe1adf8b8d1e10",
"assets/assets/images/manhal.png": "3c88a4029783ff972ce181614821bf0b",
"assets/assets/images/manhal2.png": "4a9012ec6ced3a607059edcf85f39d59",
"assets/assets/images/MS/s1.png": "3d6312092af766089e79e83ada6b77e8",
"assets/assets/images/MS/s2.png": "cc98c209e047c0a140e2d248aa7e309b",
"assets/assets/images/MS/s3.png": "1908799e2a5443db2fb76dcd306f1fcd",
"assets/assets/images/MS/s4.png": "f907402fc3348aae851b5c50a3c93b7c",
"assets/assets/images/programming.svg": "ac6a41a570245dd8ba794f2d36144149",
"assets/assets/images/RR/m1.png": "f029fd0612deb1070c7c45cdbe793349",
"assets/assets/images/RR/m2.png": "3fddc17437ddf1e0e7b89a60e522656b",
"assets/assets/images/RR/m3.png": "06b24ed7344a329d1bb162c8ff07884d",
"assets/assets/images/RR/m4.png": "413efb7a2740a54ecccf4f6e5450b4a1",
"assets/assets/images/RR/w1.png": "8231a81532c22e131d641c5b52c72d77",
"assets/assets/images/RR/w2.png": "9d8789e4b8ff29132551a5e25020ecd7",
"assets/assets/images/RR/w3.png": "fba8e0f7cf9cda69b345de04732c236c",
"assets/assets/images/RR/w4.png": "fdf1910c6f0d2704998c1525a872f133",
"assets/assets/images/RR/w5.png": "1b830cd517387f74bdf09f6ada9b3242",
"assets/assets/images/RR.png": "6fba28209ea88e2b1ea23e19a83f970c",
"assets/assets%255Cfonts%255CSocialMediaIcons.ttf": "736b5bcb7272edfd2061d1bda9be9c3d",
"assets/FontManifest.json": "5a2176600cfa8545d39f656a2c507e48",
"assets/fonts/MaterialIcons-Regular.otf": "95db9098c58fd6db106f1116bae85a0b",
"assets/loading.gif": "02ef21e57a84dcff9c2af7b53ab01e77",
"assets/NOTICES": "11d7db14c3898f2bfcc70229695b6104",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"canvaskit/canvaskit.js": "c2b4e5f3d7a3d82aed024e7249a78487",
"canvaskit/canvaskit.wasm": "4b83d89d9fecbea8ca46f2f760c5a9ba",
"canvaskit/profiling/canvaskit.js": "ae2949af4efc61d28a4a80fffa1db900",
"canvaskit/profiling/canvaskit.wasm": "95e736ab31147d1b2c7b25f11d4c32cd",
"favicon.ico": "56e8f2ce8d80019b5fdb85210c430c71",
"favicon.png": "56e8f2ce8d80019b5fdb85210c430c71",
"flutter.js": "0816e65a103ba8ba51b174eeeeb2cb67",
"icons/android-chrome-192x192.png": "ee2810e4758a4a6a1f0ace483d91f154",
"icons/android-chrome-512x512.png": "625a7b7c40e57d3d0b4f15a699c13e47",
"icons/apple-touch-icon.png": "38f167bbcd9d046cbe38816251b3c3b1",
"icons/favicon-16x16.png": "208e13987fe28dd92f8fafc2c91b211d",
"icons/favicon-32x32.png": "a193481ec31559f7101d474db1616608",
"icons/favicon.ico": "99e4678257116b6b17b0d916f9422522",
"icons/site.webmanifest": "053100cb84a50d2ae7f5492f7dd7f25e",
"index.html": "dbbd28a8b7ced48db3d81304c054e2a5",
"/": "dbbd28a8b7ced48db3d81304c054e2a5",
"main.dart.js": "a2bcdb6ba6ae7d0f1ffa5e4b49fe5118",
"manifest.json": "45cf7b55a033a0c6dd2d6dc8cc8b8a19",
"version.json": "009c9e65172e010890f7f65fde438006"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
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
