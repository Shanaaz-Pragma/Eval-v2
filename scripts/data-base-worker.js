import { DataBase } from './data-base.js';
/**
 * This is a DataBase Worker class which will be used to interact with the IndexDB database
 */
export class DataBaseWorker {
    /*constructor() {
        this.dbName = 'NotesDB';
        this.dbVersion = 1;
        this.storeName = 'notes';
    }

    async openDB() {
        return new Promise((resolve, reject) => {
            const request = window.indexedDB.open(this.dbName, this.dbVersion);

            request.onerror = (event) => {
                reject(event.target.error);
            };

            request.onsuccess = (event) => {
                resolve(event.target.result);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                const store = db.createObjectStore(this.storeName, { keyPath: 'id', autoIncrement: true });
                store.createIndex('title', 'title', { unique: false });
                store.createIndex('content', 'content', { unique: false });
            };
        });
    }

    async addNote(note) {
        const db = await this.openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([this.storeName], 'readwrite');
            const store = transaction.objectStore(this.storeName);
            const request = store.add(note);

            request.onsuccess = () => {
                resolve();
            };

            request.onerror = (event) => {
                reject(event.target.error);
            };
        });
    }

    async getNotes() {
        const db = await this.openDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([this.storeName], 'readonly');
            const store = transaction.objectStore(this.storeName);
            const request = store.getAll();

            request.onsuccess = (event) => {
                resolve(event.target.result);
            };

            request.onerror = (event) => {
                reject(event.target.error);
            };
        });
    }*/

    constructor() {
        this.dbName = 'notes';
        this.storeName = 'notesStore';
        this.version = 1;
        this.db = null;
        this.onItemsChanged = null;
        this.registerServiceWorker();
    }

    async registerServiceWorker() {
        try {
            const registration = await navigator.serviceWorker.register('/notes-db-service-worker.js');
            const serviceWorker = registration.active;
            serviceWorker.postMessage({ type: 'initDB', dbName: this.dbName, storeName: this.storeName, version: this.version });
            serviceWorker.addEventListener('message', event => {
                if (event.data.type === 'itemsChanged') {
                    if (this.onItemsChanged) {
                        this.onItemsChanged(event.data.notes);
                    }
                }
            });
        } catch (error) {
            console.error(error);
        }
    }

    async add(note) {
        const db = await this.getDB();
        const transaction = db.transaction([this.storeName], 'readwrite');
        const store = transaction.objectStore(this.storeName);
        const request = store.add(note);
        request.onsuccess = () => {
            console.log('Note added to DB');
            this.getAll();
        };
        request.onerror = error => {
            console.error('Error adding note to DB', error);
        };
    }

    async getAll() {
        const db = await this.getDB();
        const transaction = db.transaction([this.storeName], 'readonly');
        const store = transaction.objectStore(this.storeName);
        const request = store.getAll();
        request.onsuccess = event => {
            const notes = event.target.result;
            console.log(`Got ${notes.length} notes from DB`);
            if (this.onItemsChanged) {
                this.onItemsChanged(notes);
            }
        };
        request.onerror = error => {
            console.error('Error getting notes from DB', error);
        };
    }

    async update(note) {
        const db = await this.getDB();
        const transaction = db.transaction([this.storeName], 'readwrite');
        const store = transaction.objectStore(this.storeName);
        const request = store.put(note);
        request.onsuccess = () => {
            console.log('Note updated in DB');
            this.getAll();
        };
        request.onerror = error => {
            console.error('Error updating note in DB', error);
        };
    }

    async delete(id) {
        const db = await this.getDB();
        const transaction = db.transaction([this.storeName], 'readwrite');
        const store = transaction.objectStore(this.storeName);
        const request = store.delete(id);
        request.onsuccess = () => {
            console.log('Note deleted from DB');
            this.getAll();
        };
        request.onerror = error => {
            console.error('Error deleting note from DB', error);
        };
    }

    async getDB() {
        if (this.db) {
            return this.db;
        }
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);
            request.onupgradeneeded = event => {
                const db = event.target.result;
                db.createObjectStore(this.storeName, {keyPath: 'id', autoIncrement: true});
            };
            request.onsuccess = event => {
                this.db = event.target.result;
                resolve(this.db);
            };
            request.onerror = event => {
                reject(event.target.error);
            };
        });
    }
}

customElements.define('data-base-worker', DataBaseWorker);