import {DataBaseWorker} from "./scripts/data-base-worker.js";
import {NoteUpdate} from "./scripts/components/note-update/note-update.js";

/**
 * This is a ViewModel class which will be used to interact with the DataBaseWorker which will interact with the IndexDB database
 */
class ViewModel {
    constructor() {
        this.items = [];
        this.serviceWorker = new DataBaseWorker();
        this.serviceWorker.onItemsChanged = items => {
            this.items = items;
        };
    }

    async addItem() {
        //TODO: SA - read item data from dom
        const item = { title: 'Item title', body: 'Item body' };
        await this.serviceWorker.add(item);
    }

    async getAllItems() {
        await this.serviceWorker.getAll();
    }

    async updateItem() {
        //TODO: SA - read item data from dom
        const item = { id: 1, title: 'New title', body: 'New body' };
        await this.serviceWorker.update(item);
    }

    async deleteItem() {
        //TODO: SA - read item id from dom
        const id = 1;
        await this.serviceWorker.delete(id);
    }
}

globalThis.viewModel = new ViewModel();