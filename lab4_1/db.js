let db;
let dbReq = indexedDB.open('myDatabase', 2);

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

    addCustomer(db, firstName.value, lastName.value, age.value)

    firstName.value = '';
    lastName.value = '';
    age.value = '';
}

function addCustomer(db, firstName, lastName, age) {
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
        clientTile.innerText = `Delete Client\n\n Name: ${element.firstName}\n Surname: ${element.lastName}\n Age: ${element.age}`;

        clientTile.addEventListener('click', function handleClick(_) {
            deleteCustomer(element);
        });

        customerList.appendChild(clientTile);
    })
}

function deleteCustomer(client) {
    const request = db.transaction(['clients'], 'readwrite')
        .objectStore('clients')
        .index('timestamp')

    index.openCursor().onsuccess = function (e) {
        var cursor = e.target.result;
        if (cursor) {
            console.log(cursor.value.id)
            cursor.continue();
        }
    }

    // request.onsuccess = () => {
    //     console.log(`Student deleted, email: ${request.result}`);
    // }

    // request.onerror = (err) => {
    //     console.error(`Error to delete student: ${err}`)
    // }
}