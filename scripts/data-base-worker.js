import { DataBase } from './data-base.js';
/**
 * This is a DataBase Worker class which will be used to interact with the IndexDB database
 */
export class DataBaseWorker {
    constructor() {
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
    }
}

customElements.define('data-base-worker', DataBaseWorker);