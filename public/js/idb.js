let db;
const request = indexedDB.open('budget-tracker', 1);

request.onupgradeneeded = function (event) {
    const db = event.target.result;
    db.createObjectStore('new_invoice', { autoIncrement: true });
};

request.onsuccess = function (event) {
    db = event.target.result;

    if (navigator.onLine) {

        uploadInvoice();
    }
};

request.onerror = function (event) {
    console.error(event.target.errorCode);
};


function saveRecord(record) {
    const transaction = db.transaction(['new_invoice'], 'readwrite');
    const invoiceObjectStore = transaction.objectStore('new_invoice');
    invoiceObjectStore.add(record);
    alert('Transaction has been added to your local device. Please establish internet connection to upload changes')
}

function uploadInvoice() {
    const transaction = db.transaction(['new_invoice'], 'readwrite');
    const invoiceObjectStore = transaction.objectStore('new_invoice');
    const getAll = invoiceObjectStore.getAll();

    getAll.onsuccess = function () {
        if (getAll.result.length > 0) {
            fetch('/api/transaction', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then(serverResponse => {
                    if (serverResponse.message) {
                        throw new Error(serverResponse);
                    }
                    const transaction = db.transaction(['new_invoice'], 'readwrite');
                    const invoiceObjectStore = transaction.objectStore('new_invoice');
                    invoiceObjectStore.clear();

                    alert('All locally stored transactions have been uploaded!');
                })
                .catch(err => {
                    console.error(err);
                });
        }
    };
};

window.addEventListener('online', uploadInvoice);

