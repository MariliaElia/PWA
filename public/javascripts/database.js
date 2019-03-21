////////////////// DATABASE //////////////////
// the database receives from the server the following structure
/** class Event{
 * constructor (title, description, date, creator) {
 *   this.title = title;
 *   this.desciption= description;
 *   this.date= date;
 *   this.creator= creator;
 * }
 *}
 *  NOTE! the database is implemented with localstorage. This is not ideal as localStorage
 *  is blocking. It would be best to implement it using indexedDB
 */

var dbPromise;

function initDatabase() {
    dbPromise = idb.openDb('photofest-db', 1,
        function(upgradeDb) {
            console.log('making a new object store');
            if (!upgradeDb.objectStoreNames.contains('event')) {
                var eventOS = upgradeDb.createObjectStore('event', {keyPath: 'title'});
                eventOS.createIndex('id', 'id', {unique: true});
            }
        });
}


/**
 * it saves the forecasts for a city in localStorage
 * @param event
 * @param eventDetails
 */
function storeCachedData(event, eventObject) {
    //localStorage.setItem(event, JSON.stringify(eventDetails));
    if (dbPromise) {
        dbPromise.then(async db => {
            var tx = db.transaction('event', "readwrite");
            var store = tx.objectStore('event');
            await store.put(eventObject); //await is necessary to return a promise
            return tx.complete;
        }).then(function () {
            console.log('added item to the event store' + JSON.stringify(eventObject));
        }).catch(function (error) {
            console.log('could not add');
        });
    }
    else {
        localStorage.setItem(event, JSON.stringify(eventObject));
    }
}

function getLoginData(loginObject) {
    if (dbPromise) {
        dbPromise.then(function (db) {
            console.log('fetching: '+login);
            var tx = db.transaction(LOGIN_STORE_NAME, 'readonly');
            var store = tx.objectStore(LOGIN_STORE_NAME);
            var index = store.index('userId');
            return index.get(IDBKeyRange.only(loginObject.userId));
        }).then(function (foundObject) {
            if (foundObject && (foundObject.userId==loginObject.userId &&
                foundObject.password==loginObject.password)){
                console.log("login successful");
            } else {
                alert("login or password incorrect")
            }
        });
    }
}


/**
 * it retrieves the event data for an event from localStorage
 * @param event
 * @returns {*}
 */
function getCachedData(event) {
    const value = localStorage.getItem(event);
    if (value == null)
        return {event: event};
    else return JSON.parse(value);
}


/**
 * given the server data, it returns the value of the field precipitations
 * @param dataR the data returned by the server
 * @returns {*}
 */
function getTitle(dataR) {
    if (dataR.title == null && dataR.title === undefined)
        return "unavailable";
    return dataR.title
}

/**
 * given the server data, it returns the value of the field wind
 * @param dataR the data returned by the server
 * @returns {*}
 */
function getDescription(dataR){
    if (dataR.description == null && dataR.description === undefined)
        return "unavailable";
    else return dataR.description;
}

/**
 * given the server data, it returns the value of the field temperature
 * @param dataR the data returned by the server
 * @returns {*}
 */
function getCreator(dataR){
    if (dataR.creator == null && dataR.creator === undefined)
        return "unavailable";
    else return dataR.creator;
}
/**
 * given the server data, it returns the value of the field humidity
 * @param dataR the data returned by the server
 * @returns {*}
 */
function getDate(dataR){
    if (dataR.date == null && dataR.date === undefined)
        return "unavailable";
    else return dataR.date;
}
