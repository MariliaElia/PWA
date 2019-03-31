/**
 * POST data username and password from user
 * @param url
 * @param data
 */
function sendLogInQuery(url, data) {
    $.ajax({
        url: url ,
        data: data,
        dataType: 'json',
        type: 'POST',
        success: function (dataR) {
            var ret = dataR;
            //console.log('login data' + JSON.stringify(ret));
            username = ret.username;
            password = ret.password;
            checkUser(username, password); // checks if user is registered
        },
        error: function (xhr, status, error) {
            alert('Error: ' + error.message);
        }
    });
}

/**
 * onload function for login form
 */
function logIn() {
    var formArray= $("form").serializeArray();
    var data={};
    for (index in formArray){
        data[formArray[index].name]= formArray[index].value;
    }
    sendLogInQuery('/login', data);
    event.preventDefault();
}

/**
 * takes the user to account after registering/logging in
 * @param url
 */
function takeToAccount(url, data) {
    setLoginState(true);
    console.log(data.username);
    setUsername(data.username);
    console.log(user);
    if (url == '/signup' || url == '/login') {
        document.location = '/account';
    }
}

/**
 * checks if user is registered in the indexedDB
 * @param username
 * @param password
 */
function checkUser(username, password) {
    if (dbPromise) {
        dbPromise.then(function (db) {
            var tx = db.transaction('USERS', 'readonly');
            var store = tx.objectStore('USERS');
            var index = store.index('username');
            var request = index.get(IDBKeyRange.only(username.toString()));
            return request;
        }).then(function (request) {
            if (request && request.username == username && request.password == password) {
                //console.log('login successful');
                takeToAccount('/login', username);
            }
            else {
                alert('Incorrect username or password');
            }
        });
    }
}

/**
 * sets the login state in browser's localstorage
 * @param value
 */
function setLoginState(value) {
    localStorage.setItem('isLoggedIn', value);
}

/**
 * gets the login state from localStorage
 * @returns {string}
 */
function getLoginState() {
    return localStorage.getItem("isLoggedIn");
}

/**
 * onload function on sign-out button
 */
function signOut() {
    setLoginState(false);
    localStorage.removeItem('username');
    document.location = 'login';
}

/*
 * gets username from local storage
 * @returns {string}
 */
function getUsername() {
    return localStorage.getItem("username");
}

/*
 * sets username of logged in user in local storage
 * @param username
 */
function setUsername(username) {
    localStorage.setItem('username', username);
}

/**
 * onload function on trying to get into account
 */
function myAcc() {
    loginState = getLoginState();
    if (loginState == 'true') {
        //alert('you are not logged in');
        document.location = '/account';
    }
    else {
        document.location = '/login';
    }
}