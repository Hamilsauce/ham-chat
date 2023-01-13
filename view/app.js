import { View, ViewOptions } from './view.js';
import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
import { store } from '../models/store.js';

const { template, DOM, utils } = ham;

export class App extends View {
  #self;
  #name;

  constructor(options = ViewOptions) {
    super('app', options);

    document.querySelector('#app').replaceWith(this.dom)

    this.dom.addEventListener('click', e => {
      const targ = e.target.closest('#app-title');

      if (targ) {
        this.dom.classList.toggle('aux');
      }

      this.emit('click', e)
    });
  }

  use(module = {}, options = {}) {
    if (!(module && module.install)) throw new Error('Invalid module passed to use!');

    /*
     * Pass routes in with options 
     */
    module.install(this, options);
  }
};