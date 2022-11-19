let db;
let dbReq = indexedDB.open('myDatabase', 2);

dbReq.onupgradeneeded = function (event) {
    db = event.target.result;

    let clients = db.createObjectStore('clients', { autoIncrement: true });
}
dbReq.onsuccess = function (event) {
    console.log('Creation success')
    db = event.target.result;
}
dbReq.onerror = function (event) {
    console.log('Creation error')
    alert('error opening database ' + event.target.errorCode);
}