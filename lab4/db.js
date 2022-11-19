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

function submitCustomerFromButton() {
    let firstName = document.getElementById('firstName');
    let lastName = document.getElementById('lastName');
    let age = document.getElementById('clientAge');

    addCustomer(db, firstName.value, lastName.value, age.value)

    firstName.value = '';
    lastName.value = '';
    age.value = '';
}

function addCustomer(db, firstName, lastName, age) {
    let transaction = db.transaction(['clients'], 'readwrite');
    let store = transaction.objectStore('clients');

    let customer = { firstName: firstName, lastName: lastName, age: age };
    store.add(customer);

    // Success
    transaction.oncomplete = function () {
        console.log('Customer: ', firstName, ' ', lastName, ' aged: ', age, ' added\n')
    }

    // Failed
    transaction.onerror = function (event) {
        alert('Error adding customer: ' + event.target.errorCode);
    }
}