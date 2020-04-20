const template = document.createElement('template');
template.innerHTML = `
<style>
 :host { }
 ::slotted(*) { }
 .highlight {
   color: blue;
 }
</style>
<div class="highlight">Search Input Web Component</div>
<slot></slot>
<slot name="input" ></slot>
`;

class SearchInputComponent extends HTMLElement {
   constructor() {
     super();
     this._shadowRoot = this.attachShadow({ mode:'open' });
   }

   static get observedAttributes() {
     return [''];
   }

   connectedCallback() {
     this._shadowRoot.appendChild(template.content.cloneNode(true));
   }

   attributeChangedCallback(name, oldVal, newVal) {
   }
}
customElements.define('vj-search-input', SearchInputComponent);
