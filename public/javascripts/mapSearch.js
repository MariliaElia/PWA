var mymap = L.map('mapid').setView([51.505, -0.09], 13);
var marker = {};

L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(mymap);

/**
 * creates a marker for all events, on the map
 */
function displayOnMap(events) {
    for (var event of events) {
        var lat = event.latitude;
        var lon = event.longitude;
        var marker = L.marker([lat, lon]).addTo(mymap);
    }
}