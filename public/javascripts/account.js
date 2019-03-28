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
            checkUser(username, password);
        },
        error: function (xhr, status, error) {
            alert('Error: ' + error.message);
        }
    });
}

function logIn() {
    //console.log('in onsubmit')
    var formArray= $("form").serializeArray();
    //console.log('serializing array')
    var data={};
    for (index in formArray){
        data[formArray[index].name]= formArray[index].value;
        console.log(data[formArray[index].name]);
    }
    //console.log('serialized array')
    sendLogInQuery('/login', data);
    //console.log('tried to send ajax query')
    event.preventDefault();
}

function takeToAccount(url) {
    setLoginState(true);
    if (url == '/signup' || url == '/login') {
        document.location = 'account';
        //console.log('username ' + object.username);
        //username = object.username;
        //password = object.password;
        //addUserToLocal(username, password);
    }

}

/*function saveToLocal(username, password) {
    localStorage.setItem('username', username);
    localStorage.setItem('password', password)
    console.log('added user ' + username + ' to local storage');
}*/

/*function userExists(username, password) {
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
}*/

function checkUser(username, password) {
    console.log('in getlogindata');
    if (dbPromise) {
        dbPromise.then(function (db) {
            //console.log('fetching');
            var tx = db.transaction('USERS', 'readonly');
            var store = tx.objectStore('USERS');
            var index = store.index('username');
            var request = index.get(IDBKeyRange.only(username.toString()));
            return request;
        }).then(function (request) {
            if (request && request.username == username && request.password == password) {
                console.log('login successful');
                takeToAccount('/login');
                /*if (getLoginState()) {takeToAccount('/login')}*/
            }
            else {
                alert('incorrect username or password');
            }
        });
    }
}

function setLoginState(value) {
    localStorage.setItem('isLoggedIn', value);
}

function getLoginState() {
    return localStorage.getItem("isLoggedIn");
}

function signOut() {
    setLoginState(false);
}

/*function myAcc() {
    console.log(getLoginState());

    if (getLoginState() == true) {
        window.location.href = 'account';
    }
    if (getLoginState() == false) {
        window.location.href = '/login';
    }
}*/