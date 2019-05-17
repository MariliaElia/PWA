/**
 * javascript for map displaying and
 * saving data from the map
 */

var mymap = L.map('mapid').setView([51.505, -0.09], 13);
var marker = {};
var lat;
var lon;

L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(mymap);

mymap.on('click', function (e) {
    lat = e.latlng.lat;
    lon = e.latlng.lng;
    if (marker != undefined) {
        mymap.removeLayer(marker);
    }
    marker = L.marker([lat,lon]).addTo(mymap);
    document.getElementById("mapid").addEventListener("change", LatLng());
    console.log("LatLng: " + lat + "," +lon);
});

/**
 * gets longitude and latitude of clicked location on map
 */
function LatLng(){
    document.getElementById("lat").value = lat;
    document.getElementById("lon").value = lon;
}