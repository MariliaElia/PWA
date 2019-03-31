function sendSearchQuery(url, data) {
    console.log("Send search query");
    $.ajax({
        url: url ,
        data: data,
        dataType: 'json',
        type: 'POST',
        success: function (dataR) {
            var ret = dataR;
            console.log('Searching this ' + JSON.stringify(ret));
            eventName = ret.eventName;
            date = ret.date;
            console.log("Event Name: " + eventName);
            console.log("Date:" + date +"hello");
            if ((eventName != "" ) && (date != "")) {
                console.log("date and title not null");
                getEventDateSearch(eventName, date);
            } else if ((date == "") && (eventName!= "")) {
                console.log("title not null");
                getEventSearch(eventName);
            } else if ((date != "") && (eventName == "")){
                console.log("date not null");
                getDateSearch(date);
            } else {

            }
        },
        error: function (xhr, status, error) {
            alert('Error: ' + error.message);
        }
    });
}

function onSearch() {
    console.log('in onsubmit');
    var formArray= $("form").serializeArray();
    console.log('serializing array');
    var data={};
    for (index in formArray){
        data[formArray[index].name]= formArray[index].value;
        console.log(data[formArray[index].name]);
    }
    console.log('serialized array');
    sendSearchQuery('/', data);
    console.log('tried to send ajax query');
    event.preventDefault();
}