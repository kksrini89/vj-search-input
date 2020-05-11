const template = document.createElement('template');
template.innerHTML = `
<style>
.input-control {
  border-radius: 5px;
  color: #333;
  padding: 8px;
  outline: none;
}
.search-results {
  list-style-type: none;
  display: none;
  padding: 5px;
  width: 50%;
  margin: 5px;
}

.search-results li {
  padding: 5px;
}
</style>
<div class="container">
  <input class="input-control" type="text" id="searchInputId" name="searchInput" required />
  <ul class="search-results"></ul>
</div>
`;

class SearchInputComponent extends HTMLElement {
  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: 'open' });
  }

  get displayField() {
    return this._displayField;
  }

  set displayField(val) {
    if (!!val) {
      this._displayField = val;
    }
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
    return ['list', 'displayField'];
  }

  connectedCallback() {
    this._shadowRoot.appendChild(template.content.cloneNode(true));

    // DOM element references
    this.searchInput = this._shadowRoot.querySelector('#searchInputId');
    this.searchBtn = this._shadowRoot.querySelector('#searchBtnId');
    this.resultsContainer = this._shadowRoot.querySelector('.search-results');
    this.searchInput.addEventListener('input', this.onSearch.bind(this));
    this._list = [];
    this._displayField = '';
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (name === 'list') {
      this._list = [...JSON.parse(newVal)];
    }

    if (name === 'displayField' && !!newVal) {
      this._displayField = newVal;
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
        const filteredValues = this._list.filter((data) => {
          if (data && !!this.displayField) {
            return data[this._displayField].toLowerCase().includes(text.toLowerCase());
          }
        });
        filteredValues && filteredValues.length && this.bindFilteredUser(filteredValues);
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
      for (const item of arr) {
        const li = this.bindResultToHtml(item[this._displayField]);
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
    if (!!val) {
      const li = document.createElement('li');
      const text = document.createTextNode(val);
      li.appendChild(text);
      return li;      
    }
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
