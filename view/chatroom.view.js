import { store } from '../models/store.js';
import { InputBar } from './input-bar.view.js';
import { View } from './view.js';

const { forkJoin, Observable, iif, BehaviorSubject, AsyncSubject, Subject, interval, of, fromEvent, merge, empty, delay, from } = rxjs;
const { flatMap, reduce, groupBy, toArray, mergeMap, switchMap, scan, map, tap, filter } = rxjs.operators;
const { fromFetch } = rxjs.fetch;

export class ChatroomView extends View {
  store = store;
  inputBar = new InputBar();
  messageSubscription = null;

  constructor() {
    super('chatroom', {
      templateName: 'chatroom-view',
      elementProperties: {},
    });

    this.store.on('messages:update', this.handleMessagesUpdate.bind(this));

    this.inputBar.on('message:send', this.handleMessageSent.bind(this));

    this.messages$ = this.store.messageStream$
      .pipe(
        map(this.renderMessages.bind(this)),
      );

    this.store.on('chat:loaded', this.init.bind(this));

    this.init();
  }

  get messageBoxEl() { return this.$('#chatMessages') }
  
  get messageEls() { return [...this.messageBoxEl.querySelectorAll('.message')] }

  get lastMessageEl() { return this.messageEls[this.messageEls.length - 1] }

  async init() {
    this.messageSubscription = this.messages$.subscribe()
  }

  clearMessages() {
    this.messageBoxEl.innerHTML = '';
  }

  renderMessages(msgs) {
    if (!msgs) return;

    console.time('renderMessages');

    this.messageBoxEl.innerHTML = `${
        msgs.reduce((template, curr) => {
          return `${template}
          <div class="message">
            <div class="messageTop">${curr.from || 'Anon'}</div>
            <div class="messageMiddle">${curr.text || ''}</div>
            <div class="messageBottom">${curr.createdDate || 'no date'}</div>
          </div>`;
        },'')
      }`;

    console.timeEnd('renderMessages');

    setTimeout(() => {
      if (this.lastMessageEl) {
        this.lastMessageEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  }

  handleMessageSent(msg) {
    this.store.addMessage({ text: msg });
  }

  // handleChatLoaded(chat) {
  //   console.warn('[[ HEARD CHAT:LOADED IN MAIN HANDLER]]', { chat });

  //   // this.setActiveView('chat');
  // }

  handleMessagesUpdate(messages) {}
}