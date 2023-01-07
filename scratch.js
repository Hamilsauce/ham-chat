// import { EventEmitter } from './lib/event-emitter.js';
import { InputBar } from './view/input-bar.view.js';
import { store } from './models/store.js';
import db from './firebase/firebase.js';
import { LoginModal } from './view/login.view.js';
import { ChatList } from './view/chat-list.view.js';
import { EventEmitter } from 'https://hamilsauce.github.io/hamhelper/event-emitter.js';
const appBody = document.querySelector('#app-body')
const containers = document.querySelectorAll('.container')

const { forkJoin, Observable, iif, BehaviorSubject, AsyncSubject, Subject, interval, of, fromEvent, merge, empty, delay, from } = rxjs;
const { flatMap, reduce, groupBy, toArray, mergeMap, switchMap, scan, map, tap, filter } = rxjs.operators;
const { fromFetch } = rxjs.fetch;

const emptyStr = ''
console.log('!!emptyStr', !!emptyStr)
console.log('EventEmitter', EventEmitter)
export class AppView extends EventEmitter {

  constructor() {
    super();
    this.self = document.querySelector('#app');
    this.messageBoxEl = document.createElement('div');
    this.messageBoxEl.id = 'chatMessages';

    this.store = store;
    this.inputBar = new InputBar();
    this.chatList = new ChatList();
    this.loginModal = new LoginModal();
    // this.loginModal.display()
    this.currentUser;
    this.store.on('messages:update', this.handleMessagesUpdate.bind(this))
    this.store.on('chat:loaded', this.handleChatLoaded.bind(this))
    this.inputBar.on('message:send', this.handleMessageSent.bind(this))
    this.loginModal.on('login', this.handleLogin.bind(this))


    this.chatList.on('select:chat', this.handleChatSelected.bind(this))



    this.viewCache = {
      chat: null
    }

    this.messages$ =
      this.store.messageStream$
      .pipe(
        map(this.renderMessages.bind(this)),
      )
    // .subscribe()
this.init()
  }

  async init() {
    if (this.store.env === 'dev') {
      await this.store.logUserIn('jake')
      this.setActiveView('chat-list');

    }
    else this.setActiveView('login');
  }


  get currentViewId() { return this.activeView.firstElementChild ? this.activeView.firstElementChild.id : null }

  get messageEls() { return [...this.messageBoxEl.querySelectorAll('.message')] }

  get lastMessageEl() { return this.messageEls[this.messageEls.length - 1] }

  get activeView() { return document.querySelector('#active-view'); }

  clearMessages() {
    this.messageBoxEl.innerHTML = ''
  }

 async setActiveView(viewName) {
    if (this.currentViewId === viewName) return;
    if (this.activeView.firstElementChild) this.activeView.firstElementChild.remove()

    if (viewName == 'chat') {
      this.messages$.subscribe()
      this.activeView.append(this.messageBoxEl)
    } else if (viewName == 'login') {
      this.activeView.append(this.loginModal.dom)
    }
    else if (viewName == 'chat-list') {
      this.activeView.append(await this.chatList.render())
    }
  }

  renderMessages(msgs) {
    if (!msgs) return;

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

    setTimeout(() => {
      if (this.lastMessageEl) {
        this.lastMessageEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100)
  }


  handleMessageSent(msg) {
    this.store.addMessage({ text: msg })
  }

  handleChatLoaded(chat) {}

  async handleLogin(username) {
    console.log('handleLogin', { username })
    this.currentUser = await this.store.logUserIn(username)
    this.setActiveView('chat-list')
  }

  async handleChatSelected({ id }) {
    console.log('handleChatSelected', { id })
    this.currentUser = await this.store.getMessages(id)
    this.setActiveView('chat')
  }

  handleMessagesUpdate(messages) {}
}

const chatApp = new AppView();