const ItemGeneratorTemplate = document.createElement("template");

ItemGeneratorTemplate.innerHTML = `
    <section>
        <h2>Item Generator</h2>
        <div>
            <div className="input-group">
                <label for="html-check">Magic Item?</label>
                <input id="magic-toggle" type="checkbox" name="magic-check" />
            </div>
            <button id="roll-btn">Roll</button>
        </div>
        <div id="item-display">

        </div>
    </section>
`;

class ItemGenerator extends HTMLElement {
    constructor() {
        super();

        this.shadow = this.attachShadow({ mode: "open" });
        this.shadow.appendChild(ItemGeneratorTemplate.content.cloneNode(true));

        this.rollbtn = this.shadow.querySelector("#roll-btn");
        this.magicToggle = this.shadow.querySelector("#magic-toggle");

        this.is_magic = false;
        this.item = null;
    }

    async getItem() {
        try {
            const r = await fetch(`/api/item/discover${this.is_magic ? "?mgc=true" : ""}`);

            const data = await r.json();

            console.log(data);

            this.setItem(data);
        } catch (err) {
            console.error(err);
        }
    }

    // ----------------Setters------------------
    setMagic(value) {
        this.is_magic = value;
        this.magicToggle.checked = value;
    }

    setItem(value) {
        const [name, price] = value;
        console.log(value);
    }

    // on Mount
    connectedCallback() {
        console.log("Item generator");

        this.magicToggle.addEventListener("change", (e) => {
            this.setMagic(e.target.value);
        });

        this.rollbtn.addEventListener("click", (e) => {
            this.getItem();
        });
    }
}

customElements.define("item-generator", ItemGenerator);
