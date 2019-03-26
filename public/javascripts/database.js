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
    });
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
            alert('could not add object to object store')
        });
    }
    //localStorage.setItem('event', JSON.stringify(newObject));
}

/*function getCachedData(objectStore) {
    if (dbPromise) {
        dbPromise.then(function (db) {
            console.log('fetching from: ' + objectStore);
            var tx = db.transaction(objectStore, 'readonly');
            var store = tx.objectStore(objectStore);
            //var index = store.index('title');
            var request = objectStore.getAllKeys();
            console.log(request);
        });
    }
}
*/