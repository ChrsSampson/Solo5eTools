const ItemGeneratorTemplate = document.createElement("template");

ItemGeneratorTemplate.innerHTML = `
    <section class="item-generator">
        <link rel="stylesheet" href="/static/css/itemGenerator.css">
        <h2>Item Generator</h2>
        <p>Generator a random item found in the enviroment.</p>
        <div class="flex-row">
        <div>
            <div className="input-group">
                <label for="magic-toggle">Magic Item?</label>
                <input id="magic-toggle" type="checkbox" />
            </div>
            <button id="roll-btn">Roll</button>
        </div>
        <div id="item-display">

        </div>
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
        this.itemDisplay = this.shadow.querySelector("#item-display");

        this.is_magic = false;
        this.item = null;
    }

    async getItem() {
        try {
            const r = await fetch(`/api/item/discover${this.is_magic ? "?mgc=true" : ""}`);

            const data = await r.json();

            this.setItem(data);
        } catch (err) {
            console.error(err);
        }
    }

    createItemDisplayTable() {
        try {
            this.itemDisplay.innerHTML = "";
            const table = document.createElement("table");
            const item = this.item;

            const values = Object.keys(item).map((v) => {
                return `
                <tr>
                    <td>${v}</td>
                    <td>${item[v]}</td>
                </tr>
                `;
            });

            const head = document.createElement("thead");
            head.innerHTML = `
                <thead>
                    <tr>
                        <th>
                            Item
                        </th>
                        <th>
                            Description
                        </th>
                    </tr>
                </thead>
            `;

            const body = document.createElement("tbody");
            values.forEach((v) => {
                const el = document.createElement("tr");
                el.innerHTML = v;
                body.appendChild(el);
            });

            table.appendChild(head);
            table.appendChild(body);

            this.itemDisplay.appendChild(table);
        } catch (err) {
            console.error(err);
        }
    }

    // ----------------Setters------------------
    setMagic(value) {
        if (this.is_magic) {
            this.is_magic = false;
            this.magicToggle.checked = false;
        } else {
            this.is_magic = value;
            this.magicToggle.checked = value;
        }
    }

    setItem(value) {
        this.item = value;
        this.createItemDisplayTable();
    }

    // on Mount
    connectedCallback() {
        this.magicToggle.addEventListener("change", (e) => {
            this.setMagic(e.target.value);
        });

        this.rollbtn.addEventListener("click", () => {
            this.getItem();
        });
    }
}

customElements.define("item-generator", ItemGenerator);
