class InputWithOptions extends HTMLElement {
    constructor() {
        super();
        const unique = Math.random().toString(36).slice(2, 8);
        this.inputId = `input-${unique}`;
        this.listId = `input-options-${unique}`;
        this.options = [];
        this.initialized = false;
    }

    static get observedAttributes() {
        return ['options', 'label', 'placeholder'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;
        if (!this.initialized) return;

        if (name === 'options') {
            this.options = this.parseOptions();
            this.renderOptions(this.options);
            return;
        }

        if (name === 'label' && this.labelEl) {
            this.labelEl.textContent = this.getAttribute('label') || 'Type';
        }

        if (name === 'placeholder' && this.inputEl) {
            this.inputEl.placeholder = this.getAttribute('placeholder') || '';
        }
    }

    connectedCallback() {
        if (!this.initialized) {
            this.render();
        }
    }

    parseOptions() {
        const defaultOptions = [];

        const attr = this.getAttribute('options');
        if (!attr) return defaultOptions;

        try {
            const parsed = JSON.parse(attr);
            if (Array.isArray(parsed)) {
                return parsed
                    .map(item => (typeof item === 'string' ? item : String(item)))
                    .filter(item => item.length);
            }
        } catch (e) {
            console.warn('input-with-options: failed to parse options attribute', e);
        }
        return defaultOptions;
    }

    render() {
        this.options = this.parseOptions();
        const labelText = this.getAttribute('label');
        const placeholder = this.getAttribute('placeholder') || '';

        if (!this.initialized) {
            this.innerHTML = '';

            const wrapper = document.createElement('div');
            wrapper.className = 'wrapper';

            if (labelText) {
                const labelEl = document.createElement('label');
                labelEl.setAttribute('for', this.inputId);
                labelEl.textContent = labelText;

                this.labelEl = labelEl;
                wrapper.append(labelEl);
            }

            const input = document.createElement('input');
            input.id = this.inputId;
            input.setAttribute('autocomplete', 'off');
            if (placeholder) input.placeholder = placeholder;

            const list = document.createElement('ul');
            list.id = this.listId;
            list.className = 'options-list';

            this.inputEl = input;
            this.listEl = list;
            this.wrapperEl = wrapper;

            this.renderOptions(this.options);
            this.bindEvents();

            wrapper.append(input, list);
            this.append(wrapper);
            this.initialized = true;
        } else {
            // Preserve current input value when updating attributes.
            const currentValue = this.inputEl.value;

            this.labelEl.textContent = labelText;
            this.inputEl.placeholder = placeholder;
            this.renderOptions(this.options);

            // Restore input value after rerendering options.
            this.inputEl.value = currentValue;

            this.dispatchEvent(new CustomEvent('input-change', {
                detail: this.inputEl.value,
                bubbles: true
            }));
        }
    }

    setOptions(options) {
        this.setAttribute('options', JSON.stringify(options));
    }

    renderOptions(options) {
        if (!this.listEl) return;
        this.listEl.innerHTML = '';
        options.forEach(option => {
            const li = document.createElement('li');
            li.textContent = option;
            li.dataset.value = option;
            this.listEl.append(li);
        });
    }

    bindEvents() {
        if (!this.inputEl || !this.listEl) return;

        const filterList = () => {
            const term = this.inputEl.value.toLowerCase();
            const filtered = this.options.filter(opt =>
                opt.toLowerCase().includes(term)
            );
            this.renderOptions(filtered);
            this.openList();
            this.dispatchEvent(new CustomEvent('input-change', {
                detail: this.inputEl.value,
                bubbles: true
            }));
        };

        this.inputEl.addEventListener('input', filterList);
        this.inputEl.addEventListener('focus', () => this.openList());

        this.inputEl.addEventListener('blur', () => {
            setTimeout(() => this.closeList(), 120);
        });

        this.listEl.addEventListener('mousedown', (event) => {
            event.preventDefault();
        });

        this.listEl.addEventListener('click', (event) => {
            const target = event.target;
            if (target.tagName.toLowerCase() === 'li') {

                this.inputEl.value = target.dataset.value || target.textContent;

                this.dispatchEvent(new CustomEvent('input-change', {
                    detail: this.inputEl.value,
                    bubbles: true
                }));

                this.closeList();
                this.inputEl.focus();
            }
        });

        this.inputEl.addEventListener('keydown', (event) => {
            const items = Array.from(this.listEl.querySelectorAll('li'));
            if (!items.length) return;

            const active = this.listEl.querySelector('.active');
            let index = items.indexOf(active);

            if (event.key === 'ArrowDown') {
                event.preventDefault();
                index = (index + 1) % items.length;
                this.setActive(items, index);
            } else if (event.key === 'ArrowUp') {
                event.preventDefault();
                index = (index - 1 + items.length) % items.length;
                this.setActive(items, index);
            } else if (event.key === 'Enter') {
                if (active) {
                    event.preventDefault();
                    active.click();
                }
            } else if (event.key === 'Escape') {
                this.closeList();
            }
        });
    }

    setActive(items, index) {
        items.forEach(item => item.classList.remove('active'));
        items[index].classList.add('active');
        items[index].scrollIntoView({ block: 'nearest' });
    }

    openList() {
        if (this.listEl) {
            this.listEl.classList.add('open');
        }
    }

    closeList() {
        if (this.listEl) {
            this.listEl.classList.remove('open');
            const active = this.listEl.querySelector('.active');
            if (active) active.classList.remove('active');
        }
    }
}

customElements.define('input-with-options', InputWithOptions);
