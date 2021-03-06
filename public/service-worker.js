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
    '/offline',
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
    if (event.request.method == "POST"){
        const request = new Request(event.request.url, {
            method: 'GET',
            headers: event.request.headers,
            mode: event.request.mode == 'navigate' ? 'cors' : event.request.mode,
            credentials: event.request.credentials,
            redirect: event.request.redirect
        });
        fetch(request).then(function (response) {
            if (response.status !== 200) {
                console.log('Looks like there was a problem. Status Code: ' +
                    response.status);
                return;
            }
            // Examine the text in the response
            console.log(response.json());

            // note: it the network is down, response will contain the error
            // that will be passed to Ajax
            return response;
        }).catch (function(e){
            console.log("service worker error 1: " + e.message);
        })
    } else {
        event.respondWith(async function () {
            const networkPromise = fetch(event.request);

            // Try the cache
            const cachedResponse = await caches.match(event.request);

            try {
                const networkResponse = await networkPromise;
                const cache = await caches.open(cacheName);
                await cache.put(event.request, networkResponse.clone());
                // Fall back to network
                return networkResponse;
            } catch (err) {
                // If both fail, show a generic fallback:
                if (cachedResponse) {
                    return cachedResponse;
                }

                return caches.match('/offline');
                // However, in reality you'd have many different
                // fallbacks, depending on URL & headers.
                // Eg, a fallback silhouette image for avatars.
            }
        }());
    }
});
