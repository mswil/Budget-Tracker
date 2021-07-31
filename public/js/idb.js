let db;
const request = indexedDB.open('budget-tracker', 1);

request.onupgradeneeded = function (event) {
    const db = event.target.result;
    db.createObjectStore('new_invoice', { autoIncrement: true });
};

request.onsuccess = function (event) {
    db = event.target.result;

    if (navigator.onLine) {

        // uploadInvoice();
    }
};

request.onerror = function (event) {
    console.error(event.target.errorCode);
};


function saveRecord(record) {
    const transaction = db.transaction(['new_invoice'], 'readwrite');
    const invoiceObjectStore = transaction.objectStore('new_invoice');
    invoiceObjectStore.add(record);
}