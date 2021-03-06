/**
 * searching
 * search happens in this javascript file
 */

/**
 * posting from the search form
 * @param url
 * @param data
 */
function sendSearchQuery(url, data) {
    $.ajax({
        url: url ,
        data: data,
        dataType: 'json',
        type: 'POST',
        success: function (dataR) {
            if (dataR == ''){
                var alertmessage = document.getElementById('alert');
                alertmessage.setAttribute('class', 'alert alert-danger');
                alertmessage.textContent = 'Please fill in the form to search!';
                alertmessage.style.display = 'block';
                $("#alert").fadeTo(2000, 500).slideUp(500, function(){
                    $("#alert").slideUp(500);
                });
                //alert('Please fill in the form to search!');
            } else if (dataR == 'noEvents') {
                document.getElementById("events").innerHTML = "No Events Found!";
            }else{
                displayEvents(dataR);
            }
        },
        error: function (xhr, status, error) {
            searchOfflineWarning();
            loadEvents();
            const dvv= document.getElementById('offline_div');
            if (dvv!=null)
                dvv.style.display='block';
        }
    });
}

/**
 * called from index.ejs when search form is filled
 */
function onSearch() {
    var formArray= $("form").serializeArray();
    var data={};
    for (index in formArray){
        data[formArray[index].name]= formArray[index].value;
    }
    sendSearchQuery('/', data);
    event.preventDefault();
}

/**
 * When the client gets off-line, it shows an off line warning to the user
 * so that it is clear that the data is stale
 */
window.addEventListener('offline', function(e) {
    // Queue up events for server.
    console.log("You are offline");
    showOfflineWarning();
}, false);

/**
 * When the client gets online, it hides the off line warning
 */
window.addEventListener('online', function(e) {
    // Resync data with server.
    console.log("You are online");
    hideOfflineWarning();
    hideSearchOfflineWarning();
}, false);

/**
 * warnings for offline
 */
function showOfflineWarning(){
    if (document.getElementById('offline_div')!=null)
        document.getElementById('offline_div').style.display='block';
}


function hideOfflineWarning(){
    if (document.getElementById('offline_div')!=null)
        document.getElementById('offline_div').style.display='none';
}

function searchOfflineWarning() {
    if (document.getElementById('offline_div')!=null)
        document.getElementById('offline_div').innerHTML = "You can't search while offline!" +
            " <br>Latest offline data are displayed below";
        document.getElementById('offline_div').style.display='block';
}

function hideSearchOfflineWarning(){
    if (document.getElementById('offline_div')!=null)
        document.getElementById('offline_div').style.display='none';
}