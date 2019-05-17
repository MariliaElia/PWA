/**
 * sendAjaxQuery
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
            var ret = dataR;
            // save to indexedDB
            //storeCachedData(ret, objectStore);
            // saving data of current user in localstorage
            //takeToAccount(url, ret);

            // take back to view newly created story
            if (url == '/create-story') {
                var alertmessage = document.getElementById('alert');

                // handle errors
                if (ret.data == "missing") {
                    alertmessage.setAttribute('class', 'alert alert-danger');
                    alertmessage.textContent = 'Please fill in all required fields.';
                    alertmessage.style.display = 'block';
                    $("#alert").fadeTo(2000, 500).slideUp(500, function(){
                        $("#alert").slideUp(500);
                        location.reload();
                    });
                }

                // if event saved in mongodb successfully
                else {
                    alertmessage.setAttribute('class', 'alert alert-success');
                    alertmessage.textContent = 'Story created!';
                    alertmessage.style.display = 'block';
                    $("#alert").fadeTo(500, 500).slideUp(500, function(){
                        $("#alert").slideUp(500);
                        var eventId = ret.eventID;
                        document.location = '/view-event/' + eventId;
                    });
                }

            }
            // take back to home page after creating a new event
            else if (url == '/create-event') {
                var alertmessage = document.getElementById('alert');

                // handle errors
                if (ret.data == "missing") {
                    alertmessage.setAttribute('class', 'alert alert-danger');
                    alertmessage.textContent = 'Please fill in all required fields.';
                    alertmessage.style.display = 'block';
                    $("#alert").fadeTo(2000, 500).slideUp(500, function(){
                        $("#alert").slideUp(500);
                        location.reload();
                    });
                }

                // if event saved in mongodb successfully
                else {
                    alertmessage.setAttribute('class', 'alert alert-success');
                    alertmessage.textContent = 'Event created!';
                    alertmessage.style.display = 'block';
                    $("#alert").fadeTo(500, 500).slideUp(500, function(){
                        $("#alert").slideUp(500);
                        var eventId = ret.eventID;
                        document.location = '/';
                    });
                }

            } else if (url == '/account'){
                var events = ret.events;
                var stories = ret.stories;
                displayEvents(events);
                displayStories(stories);
            } else if (url == '/signup') {
                var alertmessage = document.getElementById('alert');

                // handle errors
                if (ret.data == 'exists' || (ret.data == 'missing')) {
                    if (ret.data == 'exists') {
                        alertmessage.textContent = 'Username already exists';
                    }
                    else if (ret.data == 'missing') {
                        alertmessage.textContent = 'Please fill in all required fields.';
                    }
                    alertmessage.setAttribute('class', 'alert alert-danger');
                    alertmessage.style.display = 'block';
                    $("#alert").fadeTo(1000, 500).slideUp(500, function(){
                        $("#alert").slideUp(500);
                        location.reload();
                    });
                }
                else {
                    alertmessage.setAttribute('class', 'alert alert-success');
                    alertmessage.textContent = 'Success! Redirecting you to login...';
                    alertmessage.style.display = 'block';
                    $("#alert").fadeTo(500, 500).slideUp(500, function(){
                        $("#alert").slideUp(500);
                        location.replace('/account');
                    });

                }
            } else if (url =='/map') {
                displayOnMap(ret);
            }
        },
        error: function (xhr, status, error) {
            alert('Error: ' + error.message);


        }
    });
    return false;
}

/**
 * onSubmit
 * onsubmit for forms
 * @param url
 * @param objectStore
 */
function onSubmit(url, objectStore) {
    if(url == '/create-story'){
        document.getElementById("username").value = getUsername();
    }
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
 * initDB
 * body onload function for initialising the databse
 */
function initDB() {
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
    //check for support
    if ('indexedDB' in window) {
        initDatabase();
    }
    else {
        console.log('This browser doesn\'t support IndexedDB');
    }
}

/**
 * crEvent
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

function saveEvent(event) {
    //check for support
    if ('indexedDB' in window) {
        initDatabase();
    }
    else {
        console.log('This browser doesn\'t support IndexedDB');
    }
    var data={};
    storeCachedData(event, 'EVENT_OS');
}

/**
 * loadEvents
 * called in index.ejs to display events
 */
function loadEvents() {
    if ('indexedDB' in window) {
        initDatabase();
        // retrieving from the indexedDB
        getEventData("EVENT_OS");
    } else {
        console.log('This browser doesn\'t support IndexedDB');
    }
}

/**
 * loadStories
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
 * loadMapEvents
 * called in map.ejs to display events on map
 */
function loadMapEvents(events) {
    var formArray= $("form").serializeArray();
    var data={};
    for (index in formArray){
        data[formArray[index].name]= formArray[index].value;
    }

    // adding the data to the indexedDB
    sendAjaxQuery('/map', data, 'USER_OS');
    event.preventDefault();
}

/**
 * loadAccount
 * called in account.ejs to load the user related data
 */
function loadAccount() {
    //username = localStorage.getItem('username');
    //sets the value of html tag to the username
    //document.getElementById('accountHeader').innerHTML = "<h5 class='card-title'>" + username + "</h5>";
    //document.getElementById('username').value = username;
    var formArray= $("form").serializeArray();
    var data={};
    for (index in formArray){
        data[formArray[index].name]= formArray[index].value;
    }

    // adding the data to the indexedDB
    sendAjaxQuery('/account', data, 'USER_OS');
    event.preventDefault();
}

/**
 * loadUserEvents
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
 * loadUserStories
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
 * displayEvents
 * Displays events
 * @param request - events to be displayed on the related pages
 */
function displayEvents(request) {
    var eventList = "";
    document.getElementById('events').innerHTML = '';
    if (request.length == 0 ) {
        var noEvent = "<a  class='list-group list-group-item-action stories'>No events created</a>";
        document.getElementById('events').innerHTML = noEvent;
    } else {
        //display all the events, from most recent to oldest
        for (var i=request.length-1; i>= 0; i--) {
            eventList +=
                "<a href='/view-event/"+ request[i]._id + "' class='list-group list-group-item-action'> " +
                "<div class='card text-center'>" +
                "<div class='card-header'>" +
                "<h5 class='card-title'>" + request[i].title + "</h5>" + "</div>" +
                "<div class='card-body'>" +
                "<p>" + request[i].description + "</p>" +
                "<p>" + request[i].date + "</p>" +
                "<img src='/stylesheets/icons/right-arrow.png' width='15' float='right'>" +
                "</div>" +
                "</div>" +
                "</a>";
        }
        document.getElementById('events').innerHTML = eventList;
        event.preventDefault();
    }
}

/**
 * displayStories
 * @param request - stories to be displayed
 */
function displayStories(request) {
    var storyList = "";
    if (request.length == 0 ) {
        var noStory = "<a  class='list-group list-group-item-action stories'>No stories posted</a>";
        document.getElementById('stories').innerHTML = noStory;
    } else {
    //displaying stories from most recent to oldest
        for (var i=request.length-1; i>= 0; i--) {
            storyList +=
                "<a href='/view-story/"+ request[i]._id + "' class='list-group list-group-item-action stories'> " +
                "<div class='card text-center'>" +
                "<img src='" +
                request[i].storyImage +
                "' id='testImg'>" +
                "<div class='card-body'>" +
                "<h5 class='card-title'>Description:</h5>" +
                "<p>" + request[i].storyDescription + "</p>" +
                "<img src='/stylesheets/icons/right-arrow.png' width='15' float='right'>" +
                "</div> </div> </a>";
        }
        document.getElementById('stories').innerHTML = storyList;
        return false;
    }
}

/**
 * displayUserEvents
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
    event.preventDefault();
}

/**
 * displayStoryEvents
 * Displays stories created by current user
 * @param request - stories created by logged in user
 */
function displayStoryEvents(request) {
    var storyList = "";
    for (var i = request.length - 1; i >= 0; i--) {
        storyList +=
            "<a class='list-group list-group-item-action stories'> " +
            "<p>Description: " + request[i].storyDescription + "</p>" +
            "<img src='" +
            request[i].storyImage +
            "' id='testImg'>" +
            "</a>";
    }
    document.getElementById('stories').innerHTML = storyList;
    event.preventDefault();
}