let db;
export function openIndexedDB() {
    let request = window.indexedDB.open("Performance", 1);
    request.onerror = (err) => {
        console.error("Can't not open IndexedDB to save performance monitor data");
    }
    request.onupgradeneeded = (event) => {
        db = event.target.result;
        if (!db.objectStoreNames.contains("checkLikeMusic")) {
            let checkLikeMusic = db.createObjectStore("checkLikeMusic", { autoIncrement: true });
        }
    };
    request.onsuccess = (event) => {
        db = event.target.result;
    }
}
export async function addData(storeName, data) {
    await openIndexedDB();
    console.log(db);
    if (!db.objectStoreNames.contains(storeName)) {
        throw "store is not exist, please check storename and try again.";
    }
    let transaction = db.transaction([storeName], "readwrite");
    let objectStore = transaction.objectStore(storeName);
    let request = objectStore.add(data);
    transaction.onerror = () => {
        console.error("failed to add data");
    }
}