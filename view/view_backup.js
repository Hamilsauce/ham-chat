import { AppObject } from '../lib/AppObject.js';
import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';

const { template, utils, DOM } = ham;

import { viewRegistery } from './view-registery.js';

export const ElementProperties = {
  id: String,
  classList: Array,
  dataset: Object,
}

export const ViewOptions = {
  templateName: '',
  elementProperties: ElementProperties,
  children: [],
}

export class View extends AppObject {
  #self;
  #selectedElements = [];
  #children = new Map();
  #selectedElement;

  constructor(name, options) {
    if (!name) throw new Error('No name passed to constructor for ', this.constructor.name);

    super(name, 'view');

    viewRegistery.register(this.name, this.constructor)

    if (options && options !== ViewOptions && (options.tag || options.templateName)) this.#self = DOM.createElement(options);

    else this.#self = document.querySelector('#app');

    if (!this.#self) throw new Error('Failed to find/load a router-app class template. Class/template name: ' + name);

this.init()
    this.bindData();

    this.#selectedElement = this.dom;

    // console.warn(
    //   'this.constructor', { con: this.constructor },
    // );


  };

  set textContent(v) { this.dom.textContent = v }

  get textContent() { return this.dom.textContent }

  get id() { return this.#self.id };

  get dom() { return this.#self };

  get dataset() { return this.#self.dataset }


  init(name) {
    this.$$('[data-view-child]').forEach((el, i) => {
      const name = el.dataset.viewChild;
      console.log('viewRegistery.entries', viewRegistery.entries)
      console.log('el.dataset', el.dataset)
console.log('name', name)
      this.#children.set(name, viewRegistery.load(name));
      console.warn({ name, view: this.#children.get(name) });
      el.replaceWith(this.#children.get(name).dom)
    })

  }

  static getChildView(name) {

    return viewRegistery.load(name);
  }

  bindData() {
    const boundEls = [...this.dom.querySelectorAll('[data-bind]')]

    boundEls.forEach((el, i) => {
      const [attr, valueName] = el.dataset.bind.split(':');

      if (attr === 'textContent') {
        el.textContent = this[valueName];
      }
    });

  }

  // static getTemplate(name) {
  //   return template(name);
  // }

  // render() {

  // }

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


  create() {
    throw 'Must define create in child class of router-app. Cannot call create on RouterTestApp Class. '
  }

  // init(options) {
  //   throw 'Must define init in child class of router-app. Cannot call create on RouterTestApp Class. '
  // }

};