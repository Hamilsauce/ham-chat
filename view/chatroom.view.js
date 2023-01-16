import { store } from '../models/store.js';
import { InputBar } from './input-bar.view.js';
import { View } from './view.js';
import { Message } from './message.view.js';

const { forkJoin, Observable, iif, BehaviorSubject, AsyncSubject, Subject, interval, of, fromEvent, merge, empty, delay, from } = rxjs;
const { shareReplay, distinctUntilChanged, flatMap, reduce, groupBy, toArray, mergeMap, switchMap, scan, map, tap, filter } = rxjs.operators;
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
        shareReplay(1)
      );

    this.store.on('chat:loaded', this.init.bind(this));

    this.init();
  }

  get messageBoxEl() { return this.$('#chatMessages') }

  get messageEls() { return [...this.messageBoxEl.querySelectorAll('.message')] }

  get lastMessageEl() { return this.messageEls[this.messageEls.length - 1] }

  init() {
    this.messageSubscription = this.messages$.subscribe()
  }

  remove() {
    console.warn('REMOVE', this);
    this.messageSubscription.unsubscribe();
    this.clearMessages()
    this.dom.remove()
  }

  clearMessages() {
    this.messageBoxEl.innerHTML = '';
  }

  appendMessage(data) {
    if (!message) return;

    this.messageBoxEl.innerHTML = Message.render(data);

    console.timeEnd('appendMessage');

    setTimeout(() => {
      if (this.lastMessageEl) {
        this.lastMessageEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  }

  renderMessages2(messageData = []) {
    if (!messageData) return;
    console.time('renderMessages');
    // const messages = messageData.map(msg => Message.render(msg))
    // console.warn({ messageData });
    // this.messageBoxEl.append(...messages)
    this.messageBoxEl.innerHTML = `${
        messageData.reduce((template, curr) => {
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

  renderMessages(messageData = []) {
    if (!messageData) return;
    console.time('renderMessages');
    const messages = messageData.map(msg => Message.render(msg))
    // console.warn({ messageData });
    this.messageBoxEl.append(...messages)
    // this.messageBoxEl.innerHTML = `${
    //     msgs.reduce((template, curr) => {
    //       return `${template}
    //       <div class="message">
    //         <div class="messageTop">${curr.from || 'Anon'}</div>
    //         <div class="messageMiddle">${curr.text || ''}</div>
    //         <div class="messageBottom">${curr.createdDate || 'no date'}</div>
    //       </div>`;
    //     },'')
    //   }`;

    console.timeEnd('renderMessages');
    console.log('messageEls count', this.messageEls);
    setTimeout(() => {
      if (this.lastMessageEl) {
        this.lastMessageEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  }

  handleMessageSent(msg) {
    this.store.addMessage({ text: msg });
  }

  handleMessagesUpdate(messages) {}
}