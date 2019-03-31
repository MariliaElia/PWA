var dbPromise;

function initDatabase() {
    console.log('called initDatabase()');
    dbPromise = idb.openDb('PHOTOFEST_DB', 1, function (upgradeDb) {
        if (!upgradeDb.objectStoreNames.contains('EVENT_OS')) {
            var eventDb = upgradeDb.createObjectStore('EVENT_OS', {keyPath: 'id', autoIncrement: true, unique: true});
            eventDb.createIndex('title', 'title', {unique: false});
            eventDb.createIndex('description', 'description', {unique: false});
            eventDb.createIndex('date', 'date', {unique: false});
            eventDb.createIndex('userId', 'userId', {unique: false});
            eventDb.createIndex('latitude', 'latitude', {unique: false});
            eventDb.createIndex('longitude', 'longitude', {unique: false});
            console.log('created object store EVENT_OS')
        } else {
            console.log('could not create object store EVENT_OS')
        }
        if (!upgradeDb.objectStoreNames.contains('STORY_OS')) {
            var storyDb = upgradeDb.createObjectStore('STORY_OS', {keyPath: 'storyId', autoIncrement: true, unique: true});
            storyDb.createIndex('eventId', 'eventId', {unique: false});
            storyDb.createIndex('storyDescription', 'storyDescription', {unique: false});
            storyDb.createIndex('storyLocation', 'storyLocation', {unique: false});
            storyDb.createIndex('storyImage', 'storyImage', {unique: false});
            storyDb.createIndex('userId', 'userId', {unique: false});
            console.log('created object store STORY_OS')
        } else {
            console.log('could not create object store STORY_OS')
        }
        if (!upgradeDb.objectStoreNames.contains('USERS')) {
            var userDb = upgradeDb.createObjectStore('USERS', {keypath: 'id', autoIncrement: true, unique: true});
            userDb.createIndex('username', 'username', {unique: true});
            userDb.createIndex('name', 'name', {unique: false});
            userDb.createIndex('email', 'email', {unique: false});
            userDb.createIndex('password', 'password', {unique: false});
        }
    });
    //console.log('created object store')
}

function storeCachedData(newObject, objectStore) {
    console.log('inserting: '+JSON.stringify(newObject));
    if (dbPromise) {
        dbPromise.then(async db => {
            var tx = db.transaction(objectStore, 'readwrite');
            var store = tx.objectStore(objectStore);
            await store.put(newObject);
            return tx.complete;
        }).then(function () {
            console.log('added item to the store! '+ JSON.stringify(newObject));
        }).catch(function (error) {
            console.log('could not add object to object store');
            alert('could not add object to object store');
        });
    }
}

function getEventData(objectStore) {
    console.log("Get cached data!");
    if (dbPromise) {
        dbPromise.then(function (db) {
            console.log('fetching from: ' + objectStore);
            var transaction = db.transaction(objectStore, "readonly");
            var store = transaction.objectStore(objectStore);
            var request = store.getAll();
            return request;
        }).then(function (request) {
            displayEvents(request);
        });
    }
}

function getStoryData(eventID, objectStore) {
    if (dbPromise) {
        dbPromise.then(function (db) {
            console.log('fetching from: ' + objectStore);
            var transaction = db.transaction(objectStore, "readonly");
            var store = transaction.objectStore(objectStore);
            var index = store.index('eventId');
            var request = index.getAll(eventID.toString());
            console.log(eventID);
            console.log(request);
            return request;
        }).then( function (request) {
            console.log(request);
            displayStories(request);
        });
    }
}

function getEventDateSearch(eventName, date) {
    if (dbPromise) {
        dbPromise.then(function (db) {
            console.log('fetching from: EVENT_OS');
            var transaction = db.transaction('EVENT_OS', "readonly");
            var store = transaction.objectStore('EVENT_OS');
            var index = store.index('title');
            var request = index.getAll(eventName.toString());
            return request;
        }).then( function (request) {
            console.log(request);
            console.log(date);
            if(request && request.length>0) {
                var results = [];
                for (var event of request) {
                    console.log("Event date: " + event.date);
                    if (event.date == date) {
                        results.push(event);
                    }
                }
            }
            console.log(results);
            displayEvents(results);
        });
    }
}

function getDateSearch(date) {
    console.log("Get date search");
    if (dbPromise) {
        dbPromise.then(function (db) {
            console.log('fetching from: EVENT_OS');
            var transaction = db.transaction('EVENT_OS', "readonly");
            var store = transaction.objectStore('EVENT_OS');
            var index = store.index('date');
            var request = index.getAll(date.toString());
            return request;
        }).then( function (request) {
            console.log(request);
            displayEvents(request)
        });
    }
}
function getEventSearch(eventName) {
    console.log("Get event search");
    if (dbPromise) {
        dbPromise.then(function (db) {
            console.log('fetching from: EVENT_OS');
            var transaction = db.transaction('EVENT_OS', "readonly");
            var store = transaction.objectStore('EVENT_OS');
            var index = store.index('title');
            var request = index.getAll(eventName.toString());
            return request;
        }).then( function (request) {
            console.log(request);
            displayEvents(request)
        });
    }
}

function getLoginData(loginObject) {
    if (dbPromise) {
        dbPromise.then(function (db) {
            console.log('fetching');
            var tx = db.transaction('USERS', 'readonly');
            var store = tx.objectStore('USERS');
            var index = store.index('username');
            return index.get(IDBKeyRange.only(loginObject.username));
        }).then(function (foundObject) {
            if (foundObject && (foundObject.username==loginObject.username &&
                foundObject.password==loginObject.password)){
                localStorage.setItem("isLoggedIn", "true")
                console.log('login successful');
            } else {
                alert("login or password incorrect")
            }
        });
    }
}

function getEventByID(id) {
    if (dbPromise) {
        dbPromise.then(function (db) {
            console.log('fetching from: ' + objectStore);
            var transaction = db.transaction(objectStore, "readonly");
            var store = transaction.objectStore(objectStore);
            var request = store.get(id);
            Console.log(id);
            return request;
        }).then( function (request) {
            Console.log(request.title)
        });
    }
}


function getEventByUserId() {
    var userId = getUsername();
    if (dbPromise) {
        dbPromise.then(function (db) {
            console.log('fetching events for user: ' + userId);
            var transaction = db.transaction('EVENT_OS', 'readonly');
            var store = transaction.objectStore('EVENT_OS');
            var index = store.index('userId');
            return index.getAll(IDBKeyRange.only(userId));
        }).then(function (request) {
            displayUserEvents(request);
            console.log("retrieved events");
        });
    }
}


function setLoginState(value) {
    localStorage.setItem("isLoggedIn", JSON.stringify(value));
}

function getLoginState() {
    localStorage.getItem("isLoggedIn");
}

function getAllEvents() {
    console.log("Get cached data!");
    if (dbPromise) {
        dbPromise.then(function (db) {
            console.log('fetching from: \'EVENT_OS\'');
            var transaction = db.transaction('EVENT_OS', "readonly");
            var store = transaction.objectStore('EVENT_OS');
            var request = store.getAll();
            return request;
        }).then(function (request) {
            displayOnMap(request);
        });
    }
}