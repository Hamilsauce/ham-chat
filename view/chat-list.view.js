import { EventEmitter } from 'https://hamilsauce.github.io/hamhelper/event-emitter.js';
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


export class ChatList extends View {
  #chats = [];
  store = store;

  constructor() {
    super('chat-list', {
      templateName: 'chat-list-view',
      elementProperties: {},
    });

    this.render();

    this.dom.addEventListener('click', e => {
      const targ = e.target.closest('.chat-list-item');
    
      if (!targ) return;
  
      const dataset = targ.dataset;

      this.emit('select:chat', { id: targ.id });

      this.store.setActiveChat(targ.id);

      router.push('chatroom');

      return;
    });
  }

  async render() {
    let chatData;

    await setTimeout(async () => {
      chatData = await this.store.currentUser.chatrooms

      const items = chatData.map((_) => this.createItem(_));

      this.list.innerHTML = '';

      this.list.append(...items);
    }, 200);

    return this.dom;
  }

  hide() {
    this.dom.remove()
  }

  createItem(data) {
    const item = View.getTemplate('chat-list-item');

    item.id = data.id;

    item.querySelector('.chat-name').textContent = data.name;
    item.querySelector('.chat-detail').textContent = data.description;

    return item;
  }

  handleChatSelected(id) {
    this.emit('select:chat', { id });
  }

  get list() { return this.dom.querySelector('#chat-list') }

  get show() { return this.input.value }

  set show(v) { this.input.value = v }
}