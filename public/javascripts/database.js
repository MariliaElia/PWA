function initDatabase() {
    console.log('called initDatabase()');
    dbPromise = idb.openDb('PHOTOFEST_DB', 1, function (upgradeDb) {
        if (!upgradeDb.objectStoreNames.contains('EVENT_OS')) {
            var eventDb = upgradeDb.createObjectStore('EVENT_OS', {keyPath: 'id', autoIncrement: true, unique: true});
            eventDb.createIndex('title', 'title', {unique: false});
            eventDb.createIndex('description', 'description', {unique: false});
            eventDb.createIndex('date', 'date', {unique: false});
            eventDb.createIndex('location', 'location', {unique: false});
        }
        if (!upgradeDb.objectStoreNames.contains('USERS')) {
            var userDb = upgradeDb.createObjectStore('USERS', {keypath: 'id', autoIncrement: true, unique: true});
            userDb.createIndex('username', 'username', {unique: true});
            userDb.createIndex('name', 'name', {unique: false});
            userDb.createIndex('email', 'email', {unique: false});
            userDb.createIndex('password', 'password', {unique: false});
        }
    });
    localStorage.setItem("isLoggedIn", "false");
    console.log('created object store')
}

function storeCachedData(newObject, objectStore) {
    console.log('inserting: '+JSON.stringify(newObject));
    if (dbPromise) {
        dbPromise.then(async db => {
            var tx = db.transaction(objectStore, 'readwrite');
            var store = tx.objectStore(objectStore);
            await store.put(newObject);
            return tx.complete;
        }).then(function () {
            console.log('added item to the store! '+ JSON.stringify(newObject));
        }).catch(function (error) {
            console.log('could not add object to object store');
            alert('could not add object to object store');
        });
    }
}

function getLoginData(loginObject) {
    if (dbPromise) {
        dbPromise.then(function (db) {
            console.log('fetching');
            var tx = db.transaction('USERS', 'readonly');
            var store = tx.objectStore('USERS');
            var index = store.index('username');
            return index.get(IDBKeyRange.only(loginObject.username));
        }).then(function (foundObject) {
            if (foundObject && (foundObject.username==loginObject.username &&
                foundObject.password==loginObject.password)){
                localStorage.setItem("isLoggedIn", "true")
                console.log('login successful');
            } else {
                alert("login or password incorrect")
            }
        });
    }
}

function setLoginState(value) {
    localStorage.setItem("isLoggedIn", JSON.stringify(value));
}

function getLoginState() {
    localStorage.getItem("isLoggedIn");
}