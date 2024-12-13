const template = document.createElement("template");
template.id = "Oracle-Component";
template.innerHTML = `
    <section>
        <div>
        <h2>Oracle</h2>
        <div class="options">
            <div class="input-group">
                <label>Roll with Context</label>
                <input type="checkbox" />
            </div>
            <div class="input-group">
                <label>Context Length</label>
                <input id="context-slider" type="range" value=3 step=1 min=3 max=5 />
                <span id="context-length-display">3 words</span>
            </div>
        </div>
        </di>
        <div>
            <div class="result-display">
            <h3>Response</h3>
                <h3 class="roll-display" id="roll-display"></h3>
                <div class="roll-display">
                <h3>Context</h3>
                <div id="context"></div>
                </div>
            </div>
            <button id="roll">Roll</button>
        <div>
        
    </section>
    <style>
        section{
            border:1px solid;
            border-radius: .5em;
            padding:1em;
        }
        .input-group{
            display:flex;
            gap:.5em;
            align-items:center;
        }
        .options{
            border-radius:.5em;
            padding:.5em;
            backdrop-filter: brightness(80%);
            margin:0 0 0.25em 0 ;
        }
        .context-slider{
            background: #2A4E6C;
            --webkit-appearance:none;
        }
        .result-display{
        border-radius:.5em;
            padding:.5em;
            backdrop-filter: brightness(80%);
        }
        .content-slider::-moz-range-track{
            background: #2A4E6C
        }
        .roll-display{
            border-radius:.5em;
            padding:.5em;
            backdrop-filter: brightness(80%);
        }
        label{
            font-face:bold;
        }
        button{
            background-color:#2A4E6C;
            border:2px solid;
            border-color: #2A4E6C;
            border-radius: .5em;
            padding: .5em 2em;
        }
        #context{
            display:flex;
            gap:1em;
        }
    </style>
`;

// Create a class for the element
class Oracle extends HTMLElement {
    // static observedAttributes = ["contextLength"];

    constructor() {
        // Always call super first in constructor
        super();

        this.shadow = this.attachShadow({ mode: "open" });
        this.shadow.appendChild(template.content.cloneNode(true));

        this.button = this.shadow.querySelector("button");
        this.rollDisplay = this.shadow.querySelector("#roll-display");
        this.contextDisplay = this.shadow.querySelector("#context");
        this.contextSlider = this.shadow.querySelector("#context-slider");
        this.contextLengthDisplay = this.shadow.querySelector("#context-length-display");

        this.roll = null;
        this.context = [""];
        this.contextLength = 3;
    }

    async getOracleAwnser() {
        try {
            const r = await fetch("/api/oracle");

            const { data } = await r.json();

            this.setRoll(data.oracleAwnser);
            this.setContext(data.context);

            console.log(data);
        } catch (err) {
            console.log(err);
        }
    }

    // ----------Setters-------------
    setRoll(value) {
        this.roll = value;
        this.rollDisplay.innerHTML = this.roll;
    }

    setContext(words) {
        this.context = [...words];
        this.contextDisplay.innerHTML = "";

        words.forEach((e) => {
            const span = document.createElement("span");
            span.innerHTML = e;
            this.contextDisplay.appendChild(span);
        });
    }

    setContextLength(value) {
        this.contextLength = value;
        this.contextLengthDisplay.innerHTML = `${value} words`;
    }

    //------------------ On Mount ------------------
    connectedCallback() {
        if (this.button) {
            this.button.addEventListener("click", async (e) => {
                await this.getOracleAwnser();
            });
        }

        this.contextSlider.addEventListener("change", (e) => {
            this.setContextLength(e.target.value);
        });
    }

    // called on remove
    disconnectedCallback() {
        console.log("Custom element removed from page.");
    }

    adoptedCallback() {
        console.log("Custom element moved to new page.");
    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.log(`Attribute ${name} has changed.`);
    }
}

customElements.define("oracle-component", Oracle);
