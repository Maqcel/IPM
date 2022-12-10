let db;
let dbReq = indexedDB.open('myDatabase', 2);
let isEditMode = false;
let editedKey;

dbReq.onupgradeneeded = function (event) {
    db = event.target.result;

    let clients;
    if (!db.objectStoreNames.contains('clients')) {
        clients = db.createObjectStore('clients', { autoIncrement: true });
    } else {
        clients = dbReq.transaction.objectStore('clients');
    }

    if (!clients.indexNames.contains('timestamp')) {
        clients.createIndex('timestamp', 'timestamp');
    }
}
dbReq.onsuccess = function (event) {
    console.log('Creation success')
    db = event.target.result;
    getCustomers(db)
}
dbReq.onerror = function (event) {
    console.log('Creation error')
    alert('error opening database ' + event.target.errorCode);
}

function submitCustomerFromButton() {
    let firstName = document.getElementById('firstName');
    let lastName = document.getElementById('lastName');
    let age = document.getElementById('clientAge');

    if (isEditMode) {
        console.log('Editing customer');
        editCustomer(db, firstName.value, lastName.value, age.value);
    } else {
        console.log('Creating customer');
        addCustomer(db, firstName.value, lastName.value, age.value);
    }

    firstName.value = '';
    lastName.value = '';
    age.value = '';
    isEditMode = false;
    showClearButton();
    document.getElementById('submitButton').innerText = 'Add Customer';
}

function editCustomer(db, firstName, lastName, age) {
    var transaction = db.transaction(["clients"], "readwrite");
    var store = transaction.objectStore("clients");

    var request = store.openCursor();
    request.onsuccess = function () {
        let cursor = request.result;
        if (cursor) {
            if (cursor.key == editedKey) {
                store.put({
                    firstName: firstName,
                    lastName: lastName,
                    age: parseInt(age),
                    timestamp: cursor.value.timestamp,
                }, editedKey);
            } else {
                cursor.continue();
            }
        }
    };

    document.location.reload();
}

function addCustomer(db, firstName, lastName, age) {
    if (firstName === '' && lastName === '' && age === '') {
        return;
    }
    let transaction = db.transaction(['clients'], 'readwrite');
    let store = transaction.objectStore('clients');

    let customer = { firstName: firstName, lastName: lastName, age: age, timestamp: Date.now() };
    store.add(customer);

    // Success
    transaction.oncomplete = function () {
        console.log('Customer: ', firstName, ' ', lastName, ' aged: ', age, ' added\n')

        // Just add this customer for view
        displayCustomers([customer]);
    }

    // Failed
    transaction.onerror = function (event) {
        alert('Error adding customer: ' + event.target.errorCode);
    }
}

function getCustomers(db) {
    let transaction = db.transaction(['clients'], 'readonly');
    let store = transaction.objectStore('clients');

    let index = store.index('timestamp');

    let getRequest = index.openCursor(null, 'next');
    let allClients = [];

    getRequest.onsuccess = function (event) {
        let cursor = event.target.result;
        if (cursor != null) {
            allClients.push(cursor.value);

            cursor.continue();
        } else {
            displayCustomers(allClients);
        }
    }

    getRequest.onerror = function (event) {
        alert('Error in get request ' + event.target.errorCode);
    }
}

function displayCustomers(clients) {
    let customerList = document.getElementById('customers');

    clients.forEach((element) => {
        let clientTile = document.createElement("button");
        clientTile.setAttribute('id', element.timestamp);
        clientTile.innerText = `Delete Client\n\n Name: ${element.firstName}\n Surname: ${element.lastName}\n Age: ${element.age}`;

        clientTile.addEventListener('click', function handleClick(_) {
            deleteCustomer(element);
        });

        let editTile = document.createElement("button");
        editTile.setAttribute('id', `${element.timestamp}/edit`);
        editTile.innerText = 'Edit'

        editTile.addEventListener('click', function handleClick(_) {
            editCustomerShowData(element);
        });

        customerList.appendChild(clientTile);
        customerList.appendChild(editTile);

        let newLineTile = document.createElement("br");
        newLineTile.setAttribute('id', `${element.timestamp}/newLine`);
        customerList.appendChild(newLineTile);
    });
}

function deleteCustomer(client) {
    var transaction = db.transaction(["clients"], "readwrite");
    var store = transaction.objectStore("clients");

    var request = store.openCursor();
    request.onsuccess = function () {
        let cursor = request.result;
        if (cursor) {
            let key = cursor.key;
            let value = cursor.value;
            if (cursor.value.timestamp == client.timestamp) {
                console.log(key, value);
                store.delete(key);
                document.getElementById(client.timestamp).remove();
                document.getElementById(`${client.timestamp}/edit`).remove();
                document.getElementById(`${client.timestamp}/newLine`).remove();
            } else {
                cursor.continue();
            }
        }
    };
}
function editCustomerShowData(client) {
    var transaction = db.transaction(["clients"], "readwrite");
    var store = transaction.objectStore("clients");

    var request = store.openCursor();
    request.onsuccess = function () {
        let cursor = request.result;
        if (cursor) {
            if (cursor.value.timestamp == client.timestamp) {
                isEditMode = true;
                showClearButton();
                editedKey = cursor.key;
                let firstName = document.getElementById('firstName');
                let lastName = document.getElementById('lastName');
                let age = document.getElementById('clientAge');

                firstName.value = client.firstName;
                lastName.value = client.lastName;
                age.value = client.age;

                document.getElementById('submitButton').innerText = 'Edit Customer';
            } else {
                cursor.continue();
            }
        }
    };
}

function generateCustomer() {
    let names = ['Marcin', 'Konrad', 'Franek', 'Magda', 'Arek'];
    let lastName = ['Kowalski', 'Rembroski', 'Jokwolska', 'Janowicz', 'Lewandowski'];

    addCustomer(db, names[Math.floor(Math.random() * names.length)], lastName[Math.floor(Math.random() * lastName.length)], Math.floor(Math.random() * 100))
}

function showClearButton() {
    let clearDiv = document.getElementById('cancelEdit');

    if (isEditMode) {
        let clearEdit = document.createElement("button");
        clearEdit.setAttribute('id', cancelEdit);
        clearEdit.innerText = 'Clear'
        clearDiv.appendChild(clearEdit);
    } else {
        document.getElementById(cancelEdit)?.remove();
        isEditMode = false;
    }
}
