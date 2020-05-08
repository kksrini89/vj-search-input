const template = document.createElement('template');
template.innerHTML = `
<style>
 :host { }
 ::slotted(*) { }
 .highlight {
   color: blue;
 }
.search-form {
  position: relative;
}
.input-control {
  padding: 3px;
  border: none;
  background-color: #fff;
  color: #373737;
  font-weight: bold;
}
.search-results {
  list-style-type: none;
  display: none;
}
</style>
<div class="container">
  <input class="input-control" type="text" id="searchInputId" name="searchInput" required />
  <button class="btn" id="searchBtnId">Search</button>
  <ul class="search-results"></ul>
</div>
`;

class SearchInputComponent extends HTMLElement {
  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: 'open' });
  }
  
  get list() {
    return this.hasAttribute('list');
  }
  
  set list(val) {
    if (val) {
      this.setAttribute('list', val);
    } else {
      this.removeAttribute('list');
    }
  }
  
  static get observedAttributes() {
    return ['list'];
  }
  
  connectedCallback() {
    this._shadowRoot.appendChild(template.content.cloneNode(true));
    // this.resultsContainer.style.display = 'none';
    
    // DOM element references
    this.searchInput = this._shadowRoot.querySelector('#searchInputId');
    this.searchBtn = this._shadowRoot.querySelector('#searchBtnId');
    this.resultsContainer = this._shadowRoot.querySelector('.search-results');
    this.searchInput.addEventListener('input', this.onSearch.bind(this));
    this._list = [];
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (name === 'list') {
      this._list = [...JSON.parse(newVal)];
    }
  }

  /**
   * To search element
   * @param {Event} event 
   */
  onSearch(event) {
    const text = event.target.value;
    if (text !== '') {
      if (this._list && this._list.length) {
        this.bindFilteredUser(this._list.filter((data) => data.name.includes(text)));
      }
    } else {
      this.collapseListElement();
    }
  }

  // Methods
  bindFilteredUser(arr = []) {
    if (arr && arr.length) {
      console.log(arr);
      this.resultsContainer.innerHTML = '';
      for (const { name } of arr) {
        const li = this.bindResultToHtml(name);
        this.resultsContainer.appendChild(li);
      }
      this.resultsContainer.style.display = 'block';
    }
  }

  /**
   * To bind result with Results Container
   * @param {*} val 
   */
  bindResultToHtml(val) {
    const li = document.createElement('li');
    const text = document.createTextNode(val);
    li.appendChild(text);
    return li;
  }

  
  /**
   * To collapse results container element
   */
  collapseListElement() {
    this.resultsContainer.innerHTML = '';
    this.resultsContainer.style.display = 'none';
  }
}

customElements.define('vj-search-input', SearchInputComponent);
