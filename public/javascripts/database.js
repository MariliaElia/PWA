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


/**
 * it saves the forecasts for a city in localStorage
 * @param city
 * @param forecastObject
 */
function storeCachedData(event, eventDetails) {
    //localStorage.setItem(event, JSON.stringify(eventDetails));
    dbPromise.then(async db => { // async is necessary as we use await below
        var tx = db.transaction('store', 'readwrite');
        var store = tx.objectStore('store');
        var item = {
            title: 'event 1',
            description: 'my very first event',
            date: new Date(1/1/2019),
            creator: 'cesim'
        };
        await store.add(item); //await necessary as add return a promise
        return tx.complete;
    }).then(function () {
        console.log('added item to the store! '+ JSON.stringify(item));
    }).catch(function (error) {
        //do something
    });
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
                console.log(“login successful”);
            } else {
                alert("login or password incorrect")
            }
        });
    }
}


/**
 * it retrieves the event data for an event from localStorage
 * @param city
 * @returns {*}
 */
function getCachedData(event) {
    const value = localStorage.getItem(event);
    if (value == null)
        return {event: event}
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
