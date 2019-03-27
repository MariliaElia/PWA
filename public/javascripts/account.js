function sendLogInQuery(url, data) {
    $.ajax({
        url: url ,
        data: data,
        dataType: 'json',
        type: 'POST',
        success: function (dataR) {
            var ret = dataR;
            console.log(ret);
            getLoginData(ret);

        },
        error: function (xhr, status, error) {
            alert('Error: ' + error.message);
        }
    });
}

function logIn() {
    console.log('in onsubmit')
    var formArray= $("form").serializeArray();
    console.log('serializing array')
    var data={};
    for (index in formArray){
        data[formArray[index].name]= formArray[index].value;
    }
    console.log('serialized array')
    sendLogInQuery('/login', data);
    console.log('tried to send ajax query')
    event.preventDefault();
}

