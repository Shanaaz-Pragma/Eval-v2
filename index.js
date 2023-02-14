import {DataBaseWorker} from "./scripts/data-base-worker.js";
import {NoteUpdate} from "./scripts/components/note-update/note-update.js";

/**
 * This is a ViewModel class which will be used to interact with the DataBaseWorker which will interact with the IndexDB database
 */
//class ViewModel {
    const worker = new DataBaseWorker();

    worker.addNote({ title: 'Note 1', text: 'This is a sample note' })
    .then(() => {
        return worker.getNotes();
    })
    .then((notes) => {
        console.log(notes);
    })
    .catch((error) => {
        console.error(error);
    });
//}