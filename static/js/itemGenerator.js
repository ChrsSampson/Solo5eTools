const ItemGeneratorTemplate = document.createElement("template");

ItemGeneratorTemplate.innerHTML = `
    <section class="item-generator">
        <link rel="stylesheet" href="/static/css/itemGenerator.css">
        <h2>Item Generator</h2>
        <div class="flex-row">
        <div>
            <div className="input-group">
                <label for="html-check">Magic Item?</label>
                <input id="magic-toggle" type="checkbox" name="magic-check" />
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

    createDisplayTable() {
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

            const innerTable = () => {
                return `
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
            <tbody>
                ${values}
            </tbody>
            `;
            };

            table.innerHTML = innerTable();

            this.itemDisplay.appendChild(table);
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
        this.item = value;
        this.createDisplayTable();
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
