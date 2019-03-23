function sendAjaxQuery(url, data) {
    $.ajax({
        url: url ,
        data: data,
        dataType: 'json',
        type: 'POST',
        success: function (dataR) {
            // no need to JSON parse the result, as we are using
            // dataType:json, so JQuery knows it and unpacks the
            // object for us before returning it
            var ret = dataR;
            // in order to have the object printed by alert
            // we need to JSON stringify the object
            document.getElementById('bestresults').innerHTML= JSON.stringify(ret);
            console.log('Success! Adding down below' + JSON.stringify(ret));
            storeCachedData(ret, 'EVENT_OS');

        },
        error: function (xhr, status, error) {
            alert('Error: ' + error.message);
        }
    });
}

function onSubmit() {
    console.log('in onsubmit')
    var formArray= $("form").serializeArray();
    console.log('serializing array')
    var data={};
    for (index in formArray){
        data[formArray[index].name]= formArray[index].value;
    }
    console.log('serialized array')
    // const data = JSON.stringify($(this).serializeArray());
    sendAjaxQuery('/create-event', data);
    console.log('tried to send ajax query')
    event.preventDefault();
}

function initEvents() {
    //check for support
    if ('indexedDB' in window) {
        initDatabase();
    }
    else {
        console.log('This browser doesn\'t support IndexedDB');
    }
}