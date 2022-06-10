const app = document.querySelector('#app');
const appBody = document.querySelector('#app-body')
const containers = document.querySelectorAll('.container')
const DEFAULT_APP = {

}
import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
const { DOM,date, array, utils, text } = ham;
console.log(DOM.newElement);




export class AppView {
  #elements
  constructor() {
    this.#elements = new Map();


  }

  ui(name) { return this.#elements.get(name) }
}
