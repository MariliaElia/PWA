/**
 * indexeddb file
 * for carrying out operations on indexeddb
 * like saving to and getting from indexed db
 */
var dbPromise;

/**
 * creates object stores
 */
function initDatabase() {
    dbPromise = idb.openDb('PHOTOFEST_DB', 1, function (upgradeDb) {
        if (!upgradeDb.objectStoreNames.contains('EVENT_OS')) {
            var eventDb = upgradeDb.createObjectStore('EVENT_OS', {key: 'evid', autoIncrement: true, unique: true});
            eventDb.createIndex('title', 'title', {unique: false});
            eventDb.createIndex('description', 'description', {unique: false});
            eventDb.createIndex('date', 'date', {unique: false});
            eventDb.createIndex('username', 'username', {unique: false});
            eventDb.createIndex('latitude', 'latitude', {unique: false});
            eventDb.createIndex('longitude', 'longitude', {unique: false});
        } else {
            console.log('could not create object store EVENT_OS')
        }
        if (!upgradeDb.objectStoreNames.contains('STORY_OS')) {
            var storyDb = upgradeDb.createObjectStore('STORY_OS', {keyPath: 'storyId', autoIncrement: true, unique: true});
            storyDb.createIndex('eventId', 'eventId', {unique: false});
            storyDb.createIndex('storyDescription', 'storyDescription', {unique: false});
            storyDb.createIndex('storyImage', 'storyImage', {unique: false});
            storyDb.createIndex('username', 'username', {unique: false});
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
}

/**
 * method for storing with the indexedDB
 * @param newObject
 * @param objectStore - name of the store to put the object in
 */
function storeCachedData(newObject, objectStore) {
    if (dbPromise) {
        dbPromise.then(async db => {
            var tx = db.transaction(objectStore, 'readwrite');
            var store = tx.objectStore(objectStore);
            await store.put(newObject);
            return tx.complete;
        }).then(function () {
            //console.log('added item to the store! '+ JSON.stringify(newObject));
        }).catch(function (error) {
            console.log('could not add object to object store' + error);
        });
    }
}

/**
 * used to get all events from indexedDB and display them on main page
 * @param objectStore
 */
function getEventData(objectStore) {
    if (dbPromise) {
        dbPromise.then(function (db) {
            var transaction = db.transaction(objectStore, "readonly");
            var store = transaction.objectStore(objectStore);
            var request = store.getAll();
            return request;
        }).then(function (request) {
            displayEvents(request);
        });
    }
}

/**
 * get all stories form indexedDB
 * @param eventID - used to retrieve stories associated with it
 * @param objectStore
 */
function getStoryData(eventID, objectStore) {
    if (dbPromise) {
        dbPromise.then(function (db) {
            var transaction = db.transaction(objectStore, "readonly");
            var store = transaction.objectStore(objectStore);
            var index = store.index('eventId');
            var request = index.getAll(eventID.toString());
            return request;
        }).then( function (request) {
            displayStories(request);
        });
    }
}

/**
 * for search; retrieves events depending on both event name and event date
 * @param eventName
 * @param date
 */
function getEventDateSearch(eventName, date) {
    if (dbPromise) {
        dbPromise.then(function (db) {
            var transaction = db.transaction('EVENT_OS', "readonly");
            var store = transaction.objectStore('EVENT_OS');
            var index = store.index('title');
            var request = index.getAll(eventName.toString());
            return request;
        }).then( function (request) {
            if(request && request.length>0) {
                var results = [];
                //check event date against date inserted by the user
                for (var event of request) {
                    if (event.date == date) {
                        results.push(event);
                    }
                }
            }
            displayEvents(results);
        });
    }
}

/**
 * for search; retrieves events depending on only date of event
 * @param date
 */
function getDateSearch(date) {
    if (dbPromise) {
        dbPromise.then(function (db) {
            var transaction = db.transaction('EVENT_OS', "readonly");
            var store = transaction.objectStore('EVENT_OS');
            var index = store.index('date');
            var request = index.getAll(date.toString());
            return request;
        }).then( function (request) {
            displayEvents(request)
        });
    }
}

/**
 * for search; retrieves events depending on only name of event
 * @param eventName
 */
function getEventSearch(eventName) {
    if (dbPromise) {
        dbPromise.then(function (db) {
            var transaction = db.transaction('EVENT_OS', "readonly");
            var store = transaction.objectStore('EVENT_OS');
            var index = store.index('title');
            var request = index.getAll(eventName.toString());
            return request;
        }).then( function (request) {
            displayEvents(request)
        });
    }
}

/**
 * retrieves events created by current user
 */
function getEventByUsername() {
    //get username from local storage
    var username = getUsername();
    if (dbPromise) {
        dbPromise.then(function (db) {
            var transaction = db.transaction('EVENT_OS', 'readonly');
            var store = transaction.objectStore('EVENT_OS');
            var index = store.index('username');
            return index.getAll(IDBKeyRange.only(username.toString()));
        }).then(function (request) {
            displayUserEvents(request);
        });
    }
}

/**
 * retrieves stories created by current user
 */
function getStoryByUsername() {
    // get username from local storage
    var username = getUsername();
    if (dbPromise) {
        dbPromise.then(function (db) {
            var transaction = db.transaction('STORY_OS', 'readonly');
            var store = transaction.objectStore('STORY_OS');
            var index = store.index('username');
            return index.getAll(IDBKeyRange.only(username.toString()));
        }).then(function (request) {
            displayStoryEvents(request);
        });
    }
}

/**
 * retrieves all events from indexedDB and displays then on map
 */
function getAllEvents() {
    if (dbPromise) {
        dbPromise.then(function (db) {
            var transaction = db.transaction('EVENT_OS', "readonly");
            var store = transaction.objectStore('EVENT_OS');
            var request = store.getAll();
            return request;
        }).then(function (request) {
            displayOnMap(request);
        });
    }
}