import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
import { EventEmitter } from 'https://hamilsauce.github.io/hamhelper/event-emitter.js';
const { template, DOM, utils } = ham;

export const ElementProperties = {
  id: String,
  classList: Array,
  dataset: Object,
}

export const RouterTestAppOptions = {
  templateName: 'map',
  elementProperties: ElementProperties,
  children: [],
}

export class RouterTestApp extends EventEmitter {
  #self;
  #name = 'app';

  constructor(options = RouterTestAppOptions) {
    super();

    if (options && options !== RouterTestAppOptions && (options.tag || options.templateName)) this.#self = DOM.createElement(options);
    else this.#self = document.querySelector('#app');

    if (!this.#self) throw new Error('Failed to find/load a router-app class template. Class/template name: ' + name);
  }


  use(module = {}, options) {
    if (!(module && module.install)) throw new Error('Invalid module passed to use!');

    /*
     * Pass routes in with options 
     */
    module.install(this, options);
  }

  get self() { return this.#self };

  get dom() { return this.#self };

  get dataset() { return this.self.dataset };

  get textContent() { return this.self.textContent };

  set textContent(v) { this.dom.textContent = v }

  get id() { return this.#self.id };

  get name() { return this.#name };

  static #getTemplate(name) {
    return template(name);
  }

  static uuid(name) {
    return (name.slice(0, 1).toLowerCase() || 'o') + utils.uuid();
  }

  create() {
    throw 'Must define create in child class of router-app. Cannot call create on RouterTestApp Class. '
  }

  init(options) {
    throw 'Must define init in child class of router-app. Cannot call create on RouterTestApp Class. '
  }

  selectDOM(selector) {
    const result = [...this.#self.querySelectorAll(selector)];

    return result.length === 1 ? result[0] : result;
  }
};