/**
 * general function to POST form data
 * @param url - the url where data is coming from
 * @param data
 * @param objectStore - the store where to save the data
 */
function sendAjaxQuery(url, data, objectStore) {
    $.ajax({
        url: url ,
        data: data,
        dataType: 'json',
        type: 'POST',
        success: function (dataR) {

            // getting the username from the localstorage and saving it for an event/story created by the user
            if (url != '/signup' && url != '/login') {
                dataR['username'] = getUsername();
            }

            var ret = dataR;

            // save to indexedDB
            storeCachedData(ret, objectStore);

            // saving data of current user in localstorage
            takeToAccount(url, ret);

            // take back to view newly created story
            if (url == '/create-story') {
                eventId = ret.eventId;
                document.location = '/view-event/' + eventId;
            }
            // take back to home page after creating a new event
            else if (url == '/create-event') {
                document.location = '/';
            }
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
    var formArray= $("form").serializeArray();
    var data={};
    for (index in formArray){
        data[formArray[index].name]= formArray[index].value;
    }
    // adding the data to the indexedDB
    sendAjaxQuery(url, data, objectStore);
    event.preventDefault();
}

/**
 * body onload function for initialising the databse
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
        document.location = ('/create-event');
    }
    else {
        document.location = '/message';
    }
}

/**
 * called in index.ejs to display events
 */
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
        // retrieving from the indexedDB
        getEventData("EVENT_OS");
    } else {
        console.log('This browser doesn\'t support IndexedDB');
    }
}

/**
 * called in view-event.ejs to display stories for a specific event
 * @param eventID
 */
function loadStories(eventID) {
    if ('indexedDB' in window) {
        initDatabase();
        //retrieves stories for specific event
        getStoryData(eventID, "STORY_OS");
    } else {
        console.log('This browser doesn\'t support IndexedDB');
    }
}

/**
 * called in map.ejs to display events on map
 */
function loadMapEvents() {
    if ('indexedDB' in window) {
        initDatabase();
        //gets all events and displays then on map
        getAllEvents();
    } else {
        console.log('This browser doesn\'t support IndexedDB');
    }
}

/**
 * called in account.ejs to load the user related data
 */
function loadAccount() {
    username = localStorage.getItem('username');
    //sets the value of html tag to the username
    document.getElementById('accountHeader').innerHTML = "<h5 class='card-title'>" + username + "</h5>";
    loadUserEvents();
    loadUserStories();
}

/**
 * called in loadAccount() to load events created by the user
 */
function loadUserEvents() {
    if ('indexedDB' in window ) {
        initDatabase();
        //retrieves events created by the user logged in
        getEventByUsername();
    } else {
        console.log('This browser doesn\'t support IndexedDB');
    }
}

/**
 * called in loadAccount() to load stories created by the user
 */
function loadUserStories() {
    if ('indexedDB' in window ) {
        initDatabase();
        //retrieves stories created by the user logged in
        getStoryByUsername();
    } else {
        console.log('This browser doesn\'t support IndexedDB');
    }
}

/**
 * Displays events
 * @param request - events to be displayed on the related pages
 */
function displayEvents(request) {
    var eventList = "";
    if (request.length == 0 ) {
        document.getElementById('noEvent').innerHTML = 'No events in the database';
    } else {
        //display all the events, from most recent to oldest
        for (var i=request.length-1; i>= 0; i--) {
            eventList +=
                "<a href='/view-event/"+ request[i].id + "' class='list-group list-group-item-action'> " +
                "<p>" + request[i].title + "</p>" +
                "<p>" + request[i].description + "</p>" +
                "<p>" + request[i].date + "</p>" +
                "</a>";
        }
        document.getElementById('events').innerHTML = eventList;
    }
}

/**
 * Displays stories
 * @param request - stories to be displayed
 */
function displayStories(request) {
    var storyList = "";
    //displaying stories from most recent to oldest
    for (var i=request.length-1; i>= 0; i--) {
        storyList +=
            "<a  class='list-group list-group-item-action stories'> " +
            "<p>Description: " + request[i].storyDescription + "</p>" +
            "<p>Location: " + request[i].storyLocation + "</p>" +
            "<img src='" +
            request[i].storyImage +
            "' id='testImg'>" +
            "</a>" ;



    }
    document.getElementById('stories').innerHTML = storyList;
}

/**
 * Displays events created by current user
 * @param request - events created by logged in user
 */
function displayUserEvents(request) {
    var userEvents = "";
    for (var i = 0; i < request.length; i++) {
        userEvents +=
            "<li class='list-group-item'>" +
                "<a href='/view-event/" + request[i].id + "'>" +
                    "<h5 class='card-title'> " + request[i].title + "</h5>" +
                    "<p class='card-text'> " + request[i].description +"</p>" +
                    "<p class='card-text'> " + request[i].date +"</p>" +
                "</a>" +
            "</li>"
    }
    document.getElementById('events').innerHTML = userEvents;
}

/**
 * Displays stories created by current user
 * @param request - stories created by logged in user
 */
function displayStoryEvents(request) {
    var storyList = "";
    for (var i=request.length-1; i>= 0; i--) {
        storyList +=
            "<a class='list-group list-group-item-action stories'> " +
            "<p>Description: " + request[i].storyDescription + "</p>" +
            "<img src='" +
            request[i].storyImage +
            "' id='testImg'>" +
            "</a>" ;
    }
    document.getElementById('stories').innerHTML = storyList;
}

/*
var roomId;
var userId;

var socket = io();
socket.on('updatechat', function (who,text) {
    var div1 = document.getElementById('chat');
    var div2 = document.createElement('div');
    div1.appendChild(div2);
    div2.style.backgroundColor = getChatColor(who);
    var whoisit = (who == userId) ? 'me' : who;
    div2.innerHTML = '<br/>' + whoisit + ':' + text + '<br/><b/>';
});

function sendText() {
    var inpt = document.getElementById('text');
    var text = inpt.value;
    if (text == '')
        return false;
    socket.emit('sendchat', text);
    inpt.value = '';
    return false;
}
 */