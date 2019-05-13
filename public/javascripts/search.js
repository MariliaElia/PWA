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

            /*eventName = ret.eventName;
            date = ret.date;

            if ((eventName != "" ) && (date != "")) {
                getEventDateSearch(eventName, date);
            } else if ((date == "") && (eventName!= "")) {
                getEventSearch(eventName);
            } else if ((date != "") && (eventName == "")){
                getDateSearch(date);
            } else {
                alert('Please fill in the form to search!');
            }*/
        },
        error: function (xhr, status, error) {
            alert('Error: ' + error.message);
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