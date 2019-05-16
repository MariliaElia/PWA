// Copyright 2016 Google Inc.
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//      http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

var dataCacheName = 'photofestData-v1';
var cacheName = 'photofestPWA-step-8-1';
var filesToCache = [
    '/',
    '/account',
    '/create-event',
    '/login',
    '/message',

    '/stylesheets/style.css',
    '/stylesheets/upload.css',
    '/stylesheets/bootstrap.min.css',
    '/stylesheets/bootstrap-datepicker3.css',

    '/stylesheets/icons/plus.png',
    '/stylesheets/icons/add-button.png',
    '/stylesheets/icons/beer.png',
    '/stylesheets/icons/camera.png',
    '/stylesheets/icons/drink.png',
    '/stylesheets/icons/drums.png',
    '/stylesheets/icons/electric-keyboard.png',
    '/stylesheets/icons/ferris.png',
    '/stylesheets/icons/guitar.png',
    '/stylesheets/icons/heavy-metal.png',
    '/stylesheets/icons/home.png',
    '/stylesheets/icons/ice-cream.png',
    '/stylesheets/icons/microphone.png',
    '/stylesheets/icons/microphone2.png',
    '/stylesheets/icons/pin.png',
    '/stylesheets/icons/screen.png',
    '/stylesheets/icons/search.png',
    '/stylesheets/icons/shirt.png',
    '/stylesheets/icons/add.png',
    '/stylesheets/icons/speaker.png',
    '/stylesheets/icons/spotlight.png',
    '/stylesheets/icons/stage.png',
    '/stylesheets/icons/tickets.png',
    '/stylesheets/icons/user.png',
    '/stylesheets/icons/vinyl.png',
    '/stylesheets/icons/vip.png',

    '/javascripts/app.js',
    '/javascripts/jquery.min.js',
    '/javascripts/bootstrap.js',
    '/javascripts/bootstrap.min.js',
    '/javascripts/bootstrap-datepicker.min.js',
    '/javascripts/idb.js',
    '/javascripts/account.js',
    '/javascripts/datePicker.js',
    '/javascripts/popper.min.js',
    '/javascripts/database.js',
    '/javascripts/search.js',
    '/javascripts/header.js',
    '/javascripts/take-image.js'
];


/**
 * installation event: it adds all the files to be cached
 */
self.addEventListener('install', function (e) {
    console.log('[ServiceWorker] Install');
    e.waitUntil(
        caches.open(cacheName).then(function (cache) {
            console.log('[ServiceWorker] Caching app shell');
            return cache.addAll(filesToCache);
        })
    );
});


/**
 * activation of service worker: it removes all cashed files if necessary
 */
self.addEventListener('activate', function (e) {
    console.log('[ServiceWorker] Activate');
    e.waitUntil(
        caches.keys().then(function (keyList) {
            return Promise.all(keyList.map(function (key) {
                if (key !== cacheName) {
                    console.log('[ServiceWorker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    /*
     * Fixes a corner case in which the app wasn't returning the latest data.
     * You can reproduce the corner case by commenting out the line below and
     * then doing the following steps: 1) load app for first time so that the
     * initial New York City data is shown 2) press the refresh button on the
     * app 3) go offline 4) reload the app. You expect to see the newer NYC
     * data, but you actually see the initial data. This happens because the
     * service worker is not yet activated. The code below essentially lets
     * you activate the service worker faster.
     */
    return self.clients.claim();
});


/**
 * this is called every time a file is fetched. This is a middleware, i.e. this method is
 * called every time a page is fetched by the browser
 * there are two main branches:
 * /weather_data posts cities names to get data about the weather from the server. if offline, the fetch will fail and the
 *      control will be sent back to Ajax with an error - you will have to recover the situation
 *      from there (e.g. showing the cached data)
 * all the other pages are searched for in the cache. If not found, they are returned
 */
self.addEventListener('fetch', function (event) {
    console.log('[Service Worker] Fetch', event.request.url);
    event.respondWith(
        caches.match(event.request).then(function(response) {
            if(response) {
                console.log("[Service Worker]: Found In Cache", event.request.url);
                return response;
            }

            var requestClone = event.request.clone();

            fetch(requestClone)
                .then(function(response){
                    if(!response){
                        console.log("[Service Worker] No response from fetch");
                        return response;
                    }

                    var responseClone = response.clone();

                    caches.open(cacheName).then(function (cache) {
                        cache.put(event.request, responseClone);
                        return response;
                    });
                })
                .catch(function(err){
                console.log("[Service Worker]Error Fetching and Caching ", err);
                })


        }))
});
/*    event.respondWith(
        caches.match(event.request).then(function(response) {
            return response
                || fetch(event.request)
                    .then(function (response) {
                        // note if network error happens, fetch does not return
                        // an error. it just returns response not ok
                        // https://www.tjvantoll.com/2015/09/13/fetch-and-errors/
                        if (!response.ok) {
                            console.log("error: " + err);
                        }
                    }) // here we capture HTTP errors such as 404 file not found
                    .catch(function (event) {
                        console.log("error: " + err);
                    })
        }))*/

  /*      caches.match(event.request)
            .then(function(response) {
                    // Cache hit - return response
                    if (response) {
                        return response;
                    }
                    return fetch(event.request).then(
                        function(response) {
                            // Check if we received a valid response
                            if(!response || response.status !== 200 || response.type !== 'basic') {
                                return response;
                            }

                            // IMPORTANT: Clone the response. A response is a stream
                            // and because we want the browser to consume the response
                            // as well as the cache consuming the response, we need
                            // to clone it so we have two streams.
                            var responseToCache = response.clone();

                            caches.open(CACHE_NAME)
                                .then(function(cache) {
                                    cache.put(event.request, responseToCache);
                                });

                            return response;
                        }
                    );
            })
*/
    /*//if the request is '/', post to the server
    if (event.request.url.indexOf(dataUrl) > -1 || event.request.url.indexOf('/account') > -1) {
        /!*
         * When the request URL contains dataUrl, the app is asking for fresh
         * weather data. In this case, the service worker always goes to the
         * network and then caches the response. This is called the "Cache then
         * network" strategy:
         * https://jakearchibald.com/2014/offline-cookbook/#cache-then-network
         *!/
        return fetch(event.request).then(function (response) {
            // note: it the network is down, response will contain the error
            // that will be passed to Ajax
            return response;
        }).catch (function(e){
            console.log("service worker error 1: " + e.message);
        })
    } else {
        /!*
         * The app is asking for app shell files. In this scenario the app uses the
         * "Cache, then if netowrk available, it will refresh the cache
         * see stale-while-revalidate at
         * https://jakearchibald.com/2014/offline-cookbook/#on-activate
         *!/
        event.respondWith(async function () {
            const cache = await caches.open('mysite-dynamic');
            const cachedResponse = await cache.match(event.request);
            const networkResponsePromise = fetch(event.request);

            event.waitUntil(async function () {
                const networkResponse = await networkResponsePromise;
                await cache.put(event.request, networkResponse.clone());
            }());

            // Returned the cached response if we have one, otherwise return the network response.
            return cachedResponse || networkResponsePromise;
        }());
    }*/
/*event.respondWith(
    caches.match(event.request)
        .then(function (response) {
            if (response) {
                return response;
            }
            return fetch(event.request);
        })
)*/
    //var dataUrl = '/';
    //if the request is '/weather_data', post to the server
    //if (event.request.url.indexOf(dataUrl) > -1) {
        /*
         * When the request URL contains dataUrl, the app is asking for fresh
         * weather data. In this case, the service worker always goes to the
         * network and then caches the response. This is called the "Cache then
         * network" strategy:
         * https://jakearchibald.com/2014/offline-cookbook/#cache-then-network
         */
        /*return fetch(event.request).then(function (response) {
            // note: it the network is down, response will contain the error
            // that will be passed to Ajax
            return response;
        }).catch (function(e){
            console.log("service worker error 1: " + e.message);
        })*/
    //} else {
        /*
         * The app is asking for app shell files. In this scenario the app uses the
         * "Cache, then if netowrk available, it will refresh the cache
         * see stale-while-revalidate at
         * https://jakearchibald.com/2014/offline-cookbook/#on-activate
         */
        /*event.respondWith(async function () {
            const cache = await caches.open('mysite-dynamic');
            const cachedResponse = await cache.match(event.request);
            const networkResponsePromise = fetch(event.request);

            event.waitUntil(async function () {
                const networkResponse = await networkResponsePromise;
                await cache.put(event.request, networkResponse.clone());
            }());

            // Returned the cached response if we have one, otherwise return the network response.
            return cachedResponse || networkResponsePromise;
        }());
    }*/
