const footerTemplate = document.createElement("template");

template.innerHTML = `
    <footer>
    <div>
        <h5 id="year"></h5>
    </div>
    </footer>
`;

class Footer extends HTMLElement {
    constructor() {
        super();

        this.shadow = this.attachShadow({ mode: "open" });
        this.shadow.appendChild(template.content.cloneNode(true));

        const d = new Date(Date.now);
        const footer_year = d.getFullYear();

        this.shadow.querySelector("#year").innerHTML = footer_year;
    }
}

customElements.define("x-footer", Footer);
