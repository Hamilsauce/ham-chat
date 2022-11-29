import { AppObject } from '../lib/AppObject.js';
import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';

const { template, utils } = ham;

export class View extends AppObject {
  #self;
  #selectedElements = [];
  #selectedElement;

  constructor(name) {
    if (!name) throw new Error('No name passed to constructor for ', this.constructor.name);

    super(name, 'view');

    this.#self = View.#getTemplate(name);

    this.#selectedElement = this.dom;
  };

  get dom() { return this.#self };

  get dataset() { return this.#self.dataset }



  static #getTemplate(name) {
    return template(name);
  }

  selectElement(selector) {
    const el = this.$(selector);

    if (el) {
      this.#selectedElement = el;
    }

    return this;
  }

  setDomAttrs(attrs = {}) {
    const target = !!this.#selectedElement ? this.#selectedElement : this.dom;
    const { dataset, ...attrs2 } = attrs;
    if (dataset) {
      Object.assign(target.dataset, dataset)
    }

    if (attrs2) {
      Object.assign(target, attrs2)
    }

    return this;
  }

  deselectElement() {
    this.#selectedElement = this.dom;
    return this;
  }

  $(selector) { return this.#self.querySelector(selector); }

  $$(selector) { return [...this.#self.querySelectorAll(selector)]; }

  append(...els) {
    this.#self.append(...els)
  }
};