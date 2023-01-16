import { View } from './view.js';
import { store } from '../models/store.js';
import { router } from '../router/router.js';

import { defineAction } from '../models/actions.js';

const SelectChat = defineAction('select:chat', {
  id: String,
});

const RemoveChat = defineAction('remove:chat', {
  id: String,
});


export class UserFab extends View {

  constructor() {
    super('user-fab', {
      templateName: 'user-fab',
      elementProperties: {},
    });


    store.on('user:loggedin', () => {
      this.render();
    })

    this.clickHandler = this.handleClick.bind(this);
  }

  get content() { return this.dom.querySelector('#user-fab-content').textContent }

  set content(v) {
    this.dom.querySelector('#user-fab-content').textContent = v;

    if (!!v && v != '?') {
      this.dom.classList.add('active')
    }
    else this.dom.classList.remove('active')

  }

  get show() { return this.input.value }

  set show(v) { this.input.value = v }

  render() {
    const userName = store.currentUser.username;
    this.content = userName ? userName.slice(0, 1).toUpperCase() : '?';
    // this.content = 
    this.dom.removeEventListener('click', this.clickHandler);
    this.dom.addEventListener('click', this.clickHandler);


    return this.dom;
  }

  hide() {
    this.dom.remove()
  }

  handleClick(e) {
    if (!!this.content) {
      router.push('chats');
    }
  }

}