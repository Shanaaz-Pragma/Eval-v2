/**
 * This class will display the selected note information in a form so that it can be updated by the user.
 * @param {string} id - The id of the note to be updated.
 */
export class NoteUpdate extends HTMLElement {
    #shadowRoot;
    #clickHandler = this.#click.bind(this);

    /**
     * Standard constructor
     */
    constructor() {
        super();
        this.#shadowRoot = this.attachShadow({ mode: 'open' });
    }

    /**
     * Standard connectedCallback
     * @returns {Promise<void>}
     */
    async connectedCallback() {
        this.#shadowRoot.innerHTML = await fetch(import.meta.url.replace(".js", ".html")).then(r => r.text());
        await this.#load();
    }

    /**
     * Standard disconnectedCallback
     */
    disconnectedCallback() {
        this.title = null;
        this.text = null;
        this.#shadowRoot.removeEventListener("click", this.#clickHandler);
        this.#shadowRoot = null;
        this.isReady = null;
    }

    async #load() {
        requestAnimationFrame(() => {
            this.#shadowRoot.addEventListener("click", this.#clickHandler);
            this.title = this.#shadowRoot.querySelector("[data-id='title']");
            this.text = this.#shadowRoot.querySelector("[data-id='text']");
            //TODO: SA - Prepopulate title and text from db note data

            this.isReady = true;
        });
    }

    /**
     * Handle click events
     * @param e
     * @returns {Promise<void>}
     */
    async #click(e) {
        if(e.target.dataset.id === "update") {
            await this.#update(e);
        }
    }

    /**
     * Update note detail on database
     * @param e
     * @returns {Promise<void>}
     */
    async #update(e) {
        //get note data from form
        const note = {
            id: this.id,
            title: this.title.value,
            text: this.text.value
        }

        //TODO: SA: persist note data to database
    }
}

customElements.define('note-update', NoteUpdate);