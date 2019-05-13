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
            if (ret.data == "wrongData") {
                alert("Incorrect password!");
            } else if (ret.data == "unregistered") {
                alert("Please register!");
            } else {
                takeToAccount('/login', ret);
                // checks if user is registered
                //checkUser(ret);
            }
        },
        error: function (xhr, status, error) {
            alert('Error: ' + error.message);
        }
    });
}

/**
 * onload function used in form in login.ejs
 */
function logIn() {
    var formArray= $("form").serializeArray();
    var data={};
    for (index in formArray){
        data[formArray[index].name]= formArray[index].value;
    }
    if (data.username == '' || data.password == ''){
        alert("Please fill in all the fields to log in!");
    } else {
        sendLogInQuery('/login', data);
        event.preventDefault();
    }
}

/**
 * takes the user to account after registering/logging in
 * @param url
 * @param data received from IndexedDB
 */
function takeToAccount(url, data) {
    // saves loginState as true in localStorage
    setLoginState(true);

    // saves username onto localStorage
    setUsername(data.username);

    // takes the user to the account page
    if (url == '/signup' || url == '/login') {
        document.location = '/account';
    }
}

/**
 * checks if user is registered in the indexedDB
 * @param ret user data
 */
function checkUser(ret) {
    username = ret.username;
    password = ret.password;
    takeToAccount('/login', ret);
    if (dbPromise) {
        dbPromise.then(function (db) {
            var tx = db.transaction('USERS', 'readonly');
            var store = tx.objectStore('USERS');
            var index = store.index('username');
            var request = index.get(IDBKeyRange.only(username.toString()));
            return request;
        }).then(function (request) {
            if (request && request.username == username && request.password == password) {
                // takes to account on matching information
                takeToAccount('/login', ret);
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
 * onload function on sign-out button in account.ejs
 */
function signOut() {
    // set value in localstorage to false
    setLoginState(false);
    // delete username from localstorage
    localStorage.removeItem('username');
    // take back to login
    document.location = '/login';
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
 * onload function called in footer.ejs for navigating to create-event and account
 * if user is logged in, render their account, if not, take to login
 */
function myAcc() {
    loginState = getLoginState();
    if (loginState == 'true') {
        document.location = '/account';
    }
    else {
        document.location = '/login';
    }
}