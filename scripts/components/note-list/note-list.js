/**
 * This is a NoteList class which will be used to list all notes
 */
export class NoteList extends HTMLElement {
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
        this.#shadowRoot.removeEventListener("click", this.#clickHandler);
        this.#shadowRoot = null;
        this.isReady = null;
    }

    async #load() {
        requestAnimationFrame(() => {
            this.#shadowRoot.addEventListener("click", this.#clickHandler);

            this.isReady = true;
        });
    }

    /**
     * Handle click events
     * @param e
     * @returns {Promise<void>}
     */
    async #click(e) {
        //TODO: SA - handle click events for note list
    }
}

customElements.define('note-list', NoteList);