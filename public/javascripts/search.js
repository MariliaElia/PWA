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
                alert('Please fill in the form to search!');
            } else if (dataR == 'noEvents') {
                document.getElementById("events").innerHTML = "No Events Found!";
            }else{
                displayEvents(dataR);
            }

        },
        error: function (xhr, status, error) {
            showOfflineWarning();
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
}, false);

function showOfflineWarning(){
    if (document.getElementById('offline_div')!=null)
        document.getElementById('offline_div').style.display='block';
}

function hideOfflineWarning(){
    if (document.getElementById('offline_div')!=null)
        document.getElementById('offline_div').style.display='none';
}
