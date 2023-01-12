import { View, ViewOptions } from './view/view.js';
import { LoginView } from './view/login.view.js';
import { ChatroomView } from './view/chatroom.view.js';
import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
const { template, DOM, utils } = ham;

export class App extends View {
  #self;
  #name;

  constructor(options = ViewOptions) {
    super('app', options);

    // if (options && options !== RouterTestAppOptions && (options.tag || options.templateName)) this.#self = DOM.createElement(options);

    // else this.#self = document.querySelector('#app');

    // if (!this.#self) throw new Error('Failed to find/load a router-app class template. Class/template name: ' + name);
document.querySelector('#app').replaceWith(this.dom)
    this.dom.addEventListener('click', e => {
      this.emit('click', e)
    });
  }


  use(module = {}, options = {}) {
    if (!(module && module.install)) throw new Error('Invalid module passed to use!');

    /*
     * Pass routes in with options 
     */
    module.install(this, options);
console.log('IN APP USE', {module, options});
console.log('IN APP USE', {app: this});
  }

  // get self() { return this.#self };

  // get dom() { return this.#self };

  // get dataset() { return this.self.dataset };

  // get textContent() { return this.self.textContent };

  // set textContent(v) { this.dom.textContent = v }

  // get id() { return this.#self.id };

  // get name() { return this.#name };

  // static #getTemplate(name) {
  //   return template(name);
  // }

  // static uuid(name) {
  //   return (name.slice(0, 1).toLowerCase() || 'o') + utils.uuid();
  // }


  // selectDOM(selector) {
  //   const result = [...this.#self.querySelectorAll(selector)];

  //   return result.length === 1 ? result[0] : result;
  // }
};