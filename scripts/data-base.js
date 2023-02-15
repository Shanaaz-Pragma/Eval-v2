/**
 * This is an IndexDB database class
 */
export class DataBase {

    /**
     * Standard constructor
     * @param dbName
     * @param storeName
     * @param version
     */
    constructor(dbName, storeName, version) {
        this.dbName = dbName;
        this.storeName = storeName;
        this.version = version;
        this.db = null;
        this.initDB();
    }

    /**
     * This method will initialize the database
     */
    initDB() {
        const request = indexedDB.open(this.dbName, this.version);
        request.onupgradeneeded = event => {
            const db = event.target.result;
            db.createObjectStore(this.storeName, { keyPath: 'id', autoIncrement: true });
        };
        request.onsuccess = event => {
            this.db = event.target.result;
        };
        request.onerror = event => {
            console.error('Error initializing IndexedDB', event.target.error);
        };
    }

    /**
     * This method will return the database
     * @returns {Promise<unknown>}
     */
    async getDB() {
        if (this.db) {
            return this.db;
        }
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);
            request.onsuccess = event => {
                this.db = event.target.result;
                resolve(this.db);
            };
            request.onerror = event => {
                reject(event.target.error);
            };
        });
    }

    /**
     * This method will return all items from the database
     * @returns {Promise<unknown>}
     */
    async getAll() {
        const db = await this.getDB();
        const transaction = db.transaction([this.storeName], 'readonly');
        const store = transaction.objectStore(this.storeName);
        const request = store.getAll();
        return new Promise((resolve, reject) => {
            request.onsuccess = event => {
                const items = event.target.result;
                console.log(`Got ${items.length} items from DB`);
                resolve(items);
            };
            request.onerror = error => {
                console.error('Error getting items from DB', error);
                reject(error);
            };
        });
    }

    /**
     * This method will add a item to the database
     * @param item
     * @returns {Promise<void>}
     */
    async add(item) {
        const db = await this.getDB();
        const transaction = db.transaction([this.storeName], 'readwrite');
        const store = transaction.objectStore(this.storeName);
        const request = store.add(item);
        request.onsuccess = () => {
            console.log('Note added to DB');
        };
        request.onerror = error => {
            console.error('Error adding item to DB', error);
        };
    }

    async update(item) {
        const db = await this.getDB();
        const transaction = db.transaction([this.storeName], 'readwrite');
        const store = transaction.objectStore(this.storeName);
        const request = store.put(item);
        request.onsuccess = () => {
            console.log('Item updated in DB');
        };
        request.onerror = error => {
            console.error('Error updating item in DB', error);
        };
    }

    async delete(id) {
        const db = await this.getDB();
        const transaction = db.transaction([this.storeName], 'readwrite');
        const store = transaction.objectStore(this.storeName);
        const request = store.delete(id);
        request.onsuccess = () => {
            console.log('Item deleted from DB');
        };
        request.onerror = error => {
            console.error('Error deleting item from DB', error);
        };
    }
}

customElements.define('data-base', DataBase);