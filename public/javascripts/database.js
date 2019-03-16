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
    localStorage.setItem(event, JSON.stringify(eventDetails));
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
