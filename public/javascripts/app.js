/**
 * general function to POST form data
 * @param url
 * @param data
 */
function sendAjaxQuery(url, data, objectStore) {
    $.ajax({
        url: url ,
        data: data,
        dataType: 'json',
        type: 'POST',
        success: function (dataR) {
            // no need to JSON parse the result, as we are using dataType:json, so JQuery knows it and unpacks the object for us before returning it
            var ret = dataR;
            // in order to have the object printed by alert we need to JSON stringify the object
            //document.getElementById('bestresults').innerHTML= JSON.stringify(ret);
            console.log('Success! Adding down below' + JSON.stringify(ret));
            storeCachedData(ret, objectStore);
            takeToAccount(url, ret); // if this is a login or registry form
        },
        error: function (xhr, status, error) {
            alert('Error: ' + error.message);
        }
    });
}

/**
 * onsubmit for forms
 * @param url
 * @param objectStore
 */
function onSubmit(url, objectStore) {
    console.log('in onsubmit')
    var formArray= $("form").serializeArray();
    console.log('serializing array')
    var data={};
    for (index in formArray){
        data[formArray[index].name]= formArray[index].value;
    }
    console.log('serialized array')
    // const data = JSON.stringify($(this).serializeArray());
    sendAjaxQuery(url, data, objectStore);
    console.log('tried to send ajax query')
    event.preventDefault();
}

/**
 * body onload function for initialising the databse, can call in login page
 */
function initDB() {
    //check for support
    if ('indexedDB' in window) {
        initDatabase();
    }
    else {
        console.log('This browser doesn\'t support IndexedDB');
    }
}

/**
 * user should not be able to create event unless they are logged in
 */
function crEvent() {
    loginState = getLoginState();
    if (loginState == 'true') {
        document.location = 'create-event';
    }
    else {
        document.location = 'test';
    }
}

function loadEvents() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('./service-worker.js')
            .then(function () {
                console.log('Service Worker Registered');
            })
            .catch (function (error){
                console.log('Service Worker NOT Registered '+ error.message);
            });
    }
    if ('indexedDB' in window) {
        initDatabase();
        getEventData("EVENT_OS");
    } else {
        console.log('This browser doesn\'t support IndexedDB');
    }
}

function loadStories(eventID) {
    console.log("EVENT ID: " + eventID)
    if ('indexedDB' in window) {
        initDatabase();
        getStoryData(eventID, "STORY_OS");
    } else {
        console.log('This browser doesn\'t support IndexedDB');
    }
}

function loadMapEvents() {
    if ('indexedDB' in window) {
        initDatabase();
        getAllEvents();
    } else {
        console.log('This browser doesn\'t support IndexedDB');
    }
}

function displayEvents(request) {
    var eventList = "";
    for (var i=0; i< request.length; i++) {
        eventList +=
            "<a href='/view-event/"+ request[i].id + "' class='list-group list-group-item-action'> " +
                "<p>" + request[i].title + "</p>" +
                "<p>" + request[i].description + "</p>" +
                "<p>" + request[i].date + "</p>" +
                "<p>" + request[i].location + "</p>" +
            "</a>";
    }
    document.getElementById('events').innerHTML = eventList;

}

function displayStories(request) {
    var storyList = "";
    for (var i=0; i< request.length; i++) {
        storyList +=
            "<a href='#' class='list-group list-group-item-action'> " +
            "<p>" + request[i].storyDescription + "</p>" +
            "<p>" + request[i].storyLocation + "</p>" +
            "</a>";
    }
    document.getElementById('stories').innerHTML = storyList;
}