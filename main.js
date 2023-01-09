import { EventEmitter } from 'https://hamilsauce.github.io/hamhelper/event-emitter.js';
import { store } from './models/store.js';
import { InputBar } from './view/input-bar.view.js';
import { LoginModal } from './view/login.view.js';
import { ChatList } from './view/chat-list.view.js';

const { forkJoin, Observable, iif, BehaviorSubject, AsyncSubject, Subject, interval, of, fromEvent, merge, empty, delay, from } = rxjs;
const { flatMap, reduce, groupBy, toArray, mergeMap, switchMap, scan, map, tap, filter } = rxjs.operators;
const { fromFetch } = rxjs.fetch;

const firebaseUrl = 'https://www.gstatic.com/firebasejs/8.10.1/firebase-firestore.js'

// setTimeout(async () => {
//   const res = await (await fetch(firebaseUrl)).json();
//   console.warn('res', res);
// }, 3000)


export class AppView extends EventEmitter {
  currentUser;
  store = store;
  inputBar = new InputBar();
  chatList = new ChatList();
  loginModal = new LoginModal();

  constructor() {
    super();

    this.self = document.querySelector('#app');
    this.messageBoxEl = document.createElement('div');
    this.messageBoxEl.id = 'chatMessages';

    this.store.on('messages:update', this.handleMessagesUpdate.bind(this));
    this.store.on('chat:loaded', this.handleChatLoaded.bind(this));
    this.store.on('user:registered', this.handleUserRegistered.bind(this));
    this.store.on('user:authenticated', this.handleUserRegistered.bind(this));

    this.inputBar.on('message:send', this.handleMessageSent.bind(this));
    this.loginModal.on('login', this.handleLogin.bind(this));
    this.loginModal.on('signup', this.handleSignup.bind(this));
    this.chatList.on('select:chat', this.handleChatSelected.bind(this));

    this.viewCache = {
      chat: null
    };

    this.messages$ = this.store.messageStream$
      .pipe(
        map(this.renderMessages.bind(this)),
      );

    this.init();
  }

  get currentViewId() { return this.activeView.firstElementChild ? this.activeView.firstElementChild.id : null }

  get messageEls() { return [...this.messageBoxEl.querySelectorAll('.message')] }

  get lastMessageEl() { return this.messageEls[this.messageEls.length - 1] }

  get activeView() { return document.querySelector('#active-view'); }

  get headerTitle() { return document.querySelector('#app-header-title'); }

  async init() {
    if (this.store.env === 'test') {
      await this.handleLogin({ username: 'pooman', password: '123' });

      this.setActiveView('chat-list');
    }

    else this.setActiveView('login');
  }

  clearMessages() {
    this.messageBoxEl.innerHTML = '';
  }

  async setActiveView(viewName) {
    if (this.currentViewId === viewName) return;
    if (this.activeView.firstElementChild) this.activeView.firstElementChild.remove()

    if (viewName == 'chat') {
      this.messages$.subscribe();

      this.activeView.append(this.messageBoxEl);
    }
    else if (viewName == 'login') {
      this.activeView.append(this.loginModal.dom);
    }
    else if (viewName == 'chat-list') {
      this.activeView.append(await this.chatList.render());
    }

    this.headerTitle.textContent = this.activeView.firstElementChild.dataset.viewName || this.store.activeChat.name
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

  handleChatLoaded(chat) {
    console.warn('[[ HEARD CHAT:LOADED IN MAIN HANDLER]]', { chat });
  
    this.setActiveView('chat');
  }

  async handleUserRegistered() {
    this.loginModal.display('loginForm');
  }

  async handleLogin({ username, password }) {
    const res = await this.store.getUser({ username, password });

    if (!!res) {
      this.currentUser = res;
      this.setActiveView('chat-list');
    }
    else {
      setTimeout(() => {
        this.setActiveView('login');
      }, 0);
      
      console.error('[MAIN.JS HANDLE LOGIN]: FAILED TO AUTHENTICATE USER');
    }
  }

  async handleSignup(creds) {
    const { username, password } = creds;
  
    const res = await this.store.registerUser({ username, password });

    if (!!res) {
      this.setActiveView('chat-list');
    }
   
    else this.setActiveView('login');
  }

  async handleChatSelected({ id }) {
    await this.store.setActiveChat(id);
  }

  handleMessagesUpdate(messages) {}
}



const chatApp = new AppView();

window.onbeforeunload = (e) => {
  store.unsubscribeMessages()
}