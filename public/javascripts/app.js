/**
 * called by the HTML onload
 * showing any cached data and declaring the service worker
 */
function initEvents() {
    loadData();
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('./service-worker.js')
            .then(function() { console.log('Service Worker Registered'); })
            .catch ( function(error) {
                console.log(error.message);
            });
    }

    // check that the browser supports IndexedDB
    (function() {
        'use strict'; // impose strict syntax checks on the Javascript code
        //check for support
        if (!('indexedDB' in window)) {
            console.log('This browser doesn\'t support IndexedDB');
            return;
        }
        else {
            console.log('We support IndexedDB');
        }
        // To ensure database integrity, object
        // stores can only be created and removed in the callback function in idb.open
        var dbPromise = idb.openDb('test-db1', 1,
        function(upgradeDb) {
            console.log('making a new object store');
            if (!upgradeDb.objectStoreNames.contains('eventOS')) {
                var eventOS = upgradeDb.createObjectStore('eventOS', {keyPath: 'id', autoIncrement:true}, {keyPath: 'title'});
                eventOS.createIndex('id', 'id', {unique:true});

                dbPromise.then(async db => {
                    var tx = db.transaction('eventOS', "readwrite");
                    var eventOS = tx.objectStore('eventOS');
                    var myevent = {
                        id: '1',
                        title: 'my event!'
                    };
                    await eventOS.add(myevent); //await is necessary to return a promise
                    return tx.complete;
                }).then(function () {
                    console.log('added item to the event store' + JSON.stringify(myevent));
                }).catch(function (error) {
                    console.log('could not add');
                });
            }
        });

    })();
}

/**
 * given the list of events created by the user, it will retrieve all the data from
 * the server (or failing that) from the database
 */
function loadData(){
    var eventList=JSON.parse(localStorage.getItem('events'));
    eventList=removeDuplicates(eventList);
    retrieveAllEventsData(eventList);
}

/**
 * it cycles through the list of events and requests the data from the server for each
 * event
 * @param eventList the list of the most popular events
 */
function retrieveAllEventsData(eventList){
    //refreshEventList();
    for (index in eventList)
        loadEventData(eventList[index]);
}

/**
 * given one city and a date, it queries the server via Ajax to get the latest
 * weather forecast for that city
 * if the request to the server fails, it shows the data stored in the database
 * @param event
 * @param date
 */
function loadEventData(event){
    getCachedData(event);
    const input = JSON.stringify({event: event});
    $.ajax({
        url: '/event_data',
        data: input,
        contentType: 'application/json',
        type: 'POST',
        success: function (dataR) {
            // no need to JSON parse the result, as we are using
            // dataType:json, so JQuery knows it and unpacks the
            // object for us before returning it
            addToResults(dataR);
            storeCachedData(dataR.event, dataR);
            if (document.getElementById('offline_div')!=null)
                document.getElementById('offline_div').style.display='none';
        },
        // the request to the server has failed. Let's show the cached data
        error: function (xhr, status, error) {
            showOfflineWarning();
            addToResults(getCachedData(event));
            const dvv= document.getElementById('offline_div');
            if (dvv!=null)
                dvv.style.display='block';
        }
    });
    // hide the list of events if currently shown
    if (document.getElementById('event_list')!=null)
        document.getElementById('event_list').style.display = 'none';
}


///////////////////////// INTERFACE MANAGEMENT ////////////


/**
 * given the event data returned by the server,
 * it adds a row of event to the results div
 * @param dataR the data returned by the server:
 * class Event{
 * constructor (title, description, date, creator) {
 *   this.title = title;
 *   this.desciption= description;
 *   this.date= date;
 *   this.creator= creator;
 * }
 */
function addToResults(dataR) {
    if (document.getElementById('results') != null) {
        const row = document.createElement('div');
        // appending a new row
        document.getElementById('results').appendChild(row);
        // formatting the row by applying css classes
        row.classList.add('card');
        row.classList.add('my_card');
        row.classList.add('bg-faded');
        // the following is far from ideal. we should really create divs using javascript
        // rather than assigning innerHTML
        row.innerHTML = "<div class='card-block'>" +
            "<div class='row'>" +
            "<div class='col-xs-2'><h4 class='card-title'>" + dataR.title + "</h4></div>" +
            "<div class='col-xs-2'>" + getDescription(dataR) + "</div>" +
            "<div class='col-xs-2'>" + getDate(dataR) + "</div>" +
            "<div class='col-xs-2'>" + getCreator(dataR) + "</div>" +
            "<div class='col-xs-2'></div></div></div>";
    }
}


/**
 * it removes all forecasts from the result div
 */
function refreshCityList(){
    if (document.getElementById('results')!=null)
        document.getElementById('results').innerHTML='';
}


/*
*
 * it enables selecting the city from the drop down menu
 * it saves the selected city in the database so that it can be retrieved next time
 * @param city
 * @param date
function selectCity(city, date) {
    var cityList=JSON.parse(localStorage.getItem('cities'));
    if (cityList==null) cityList=[];
    cityList.push(city);
    cityList = removeDuplicates(cityList);
    localStorage.setItem('cities', JSON.stringify(cityList));
    retrieveAllCitiesData(cityList, date);
}
*/



/**
 * When the client gets off-line, it shows an off line warning to the user
 * so that it is clear that the data is stale
 */
window.addEventListener('offline', function(e) {
    // Queue up events for server.
    console.log("You are offline");
    showOfflineWarning();
}, false);

/**
 * When the client gets online, it hides the off line warning
 */
window.addEventListener('online', function(e) {
    // Resync data with server.
    console.log("You are online");
    hideOfflineWarning();
    loadData();
}, false);


function showOfflineWarning(){
    if (document.getElementById('offline_div')!=null)
        document.getElementById('offline_div').style.display='block';
}

function hideOfflineWarning(){
    if (document.getElementById('offline_div')!=null)
        document.getElementById('offline_div').style.display='none';
}


/**
 * it shows the city list in the browser
 */
function showCityList() {
    if (document.getElementById('city_list')!=null)
        document.getElementById('city_list').style.display = 'block';
}



/**
 * Given a list of cities, it removes any duplicates
 * @param eventList
 * @returns {Array}
 */
function removeDuplicates(eventList) {
    // remove any duplicate
    var uniqueNames=[];
    $.each(eventList, function(i, el){
        if($.inArray(el, uniqueNames) === -1) uniqueNames.push(el);
    });
    return uniqueNames;
}
