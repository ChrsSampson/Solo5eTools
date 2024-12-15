const template = document.createElement("template");
template.id = "Oracle-Component";
template.innerHTML = `
<link rel="stylesheet" href="/static/css/oracle.css">
    <section class="container">
        
        <section class="grid">
        <div>
            <div>
            <h2>The Oracle</h2>
            <p>Propse a question (yes or no) to the oracle. Context keywords are up to your interpretation.</p>
        </div>
            <div class="result-display">
            <h3>Response</h3>
                <h3 class="roll-display" id="roll-display"></h3>
                <div class="roll-display">
                <h3>Context</h3>
                <div id="context"></div>
                </div>
            </div>
            <div class="bottom-bar">
                <button class="main-btn" id="roll">Roll</button>
                <div class="input-group">
                    <label>Context Length</label>
                    <input id="context-slider" type="range" value=3 step=1 min=3 max=5 />
                    <span id="context-length-display">3 words</span>
                </div>
            </div>
        </div>
        <div>
            <h2>Likelihood Modifiers</h2>
            <p>Given the circumstances, how likely is it that the answer will be yes?</p>
            <table>
                <thead>
                    <tr>
                        <th>
                            Likelihood
                        </th>
                        <th>
                            Modifier
                        </th>
                        <th>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            Impossible
                        </td>
                        <td>
                            -8
                        </td>
                        <td>
                            <input type="radio" value="-8" name="modifier" />
                        </rd>
                    </tr>
                    <tr>
                        <td>
                            Highly Unlikley
                        </td>
                        <td>
                            -5
                        </td>
                        <td>
                            <input type="radio" value="-5" name="modifier" />
                        </rd>
                    </tr>
                    <tr>
                        <td>
                            Unlikeley
                        </td>
                        <td>
                            -3
                        </td>
                        <td>
                            <input type="radio" value="-3" name="modifier" />
                        </rd>
                    </tr>
                    <tr>
                        <td>
                            Possible
                        </td>
                        <td>
                            0
                        </td>
                        <td>
                            <input type="radio" value="0" name="modifier" checked="true" />
                        </rd>
                    </tr>
                    <tr>
                        <td>
                            Likley
                        </td>
                        <td>
                            +3
                        </td>
                        <td>
                            <input type="radio" value="3" name="modifier" />
                        </rd>
                    </tr>
                    <tr>
                        <td>
                            Highly Likley
                        </td>
                        <td>
                            +5
                        </td>
                        <td>
                            <input type="radio" value="5" name="modifier" />
                        </rd>
                    </tr>
                    <tr>
                        <td>
                            A Certainty
                        </td>
                        <td>
                            +8
                        </td>
                        <td>
                            <input type="radio" value="8" name="modifier" />
                        </rd>
                    </tr>
                </tbody>
            </table>
        </div>
        </section>
    </section>
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
        this.radioButtons = this.shadow.querySelectorAll("input[type='radio']");

        this.roll = null;
        this.context = [""];
        this.contextLength = 3;
        this.modifier = 0;
    }

    async getOracleAwnser() {
        try {
            const r = await fetch(`/api/oracle?ctxl=${this.contextLength}&mod=${this.modifier}`);

            const { data } = await r.json();

            this.setRoll(data.oracleAwnser);
            this.setContext(data.context);
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

    setModifier(value) {
        this.modifier = Number(value);
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

        this.radioButtons.forEach((btn) => {
            btn.addEventListener("change", (e) => {
                this.setModifier(e.target.value);
            });
        });
    }

    // // called on remove
    // disconnectedCallback() {
    //     console.log("Custom element removed from page.");
    // }

    // adoptedCallback() {
    //     console.log("Custom element moved to new page.");
    // }

    // attributeChangedCallback(name, oldValue, newValue) {
    //     console.log(`Attribute ${name} has changed.`);
    // }
}

customElements.define("oracle-component", Oracle);
