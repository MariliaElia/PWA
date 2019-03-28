
function sendLogInQuery(url, data) {
    console.log('in sendLogInQuery');
    $.ajax({
        url: url ,
        data: data,
        dataType: 'json',
        type: 'POST',
        success: function (dataR) {
            var ret = dataR;
            console.log('login data' + JSON.stringify(ret));
            username = ret.username;
            password = ret.password;
            if (userExists(username, password)) {
                document.location = 'account';
                loggedIn();
            }
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
        console.log(data[formArray[index].name]);
    }
    console.log('serialized array')
    sendLogInQuery('/login', data);
    console.log('tried to send ajax query')
    event.preventDefault();
}

function takeToAccount(url, object) {
    if (url == '/signup') {
        document.location = 'account';
        //console.log('username ' + object.username);
        username = object.username;
        password = object.password;
        addUserToLocal(username, password);
    }
}

function addUserToLocal(username, password) {
    localStorage.setItem('username', username);
    localStorage.setItem('password', password)
    console.log('added user ' + username + ' to local storage');
}

function userExists(username, password) {
    //console.log('in userExists');
    //console.log('in the function they gave me ' + username);
    //console.log('in the local storage i have ' + localStorage.getItem('username'));
    if (username === localStorage.getItem('username') && password === localStorage.getItem('password')) {
        //return true;
        //console.log('user exists!');
        return true;
    }
    else {
        alert('Incorrect username or password');
    }
}
var logged;
function loggedIn() {
    logged = true;
}

//module.exports.logged = logged;