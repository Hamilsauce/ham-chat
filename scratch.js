import { EventEmitter } from './lib/event-emitter.js';
import { InputBar } from './view/input-bar.view.js';
import { store } from './models/store.js';
import db from './firebase/firebase.js';
import { LoginModal } from './view/login.view.js';

const appBody = document.querySelector('#app-body')
const containers = document.querySelectorAll('.container')

const { forkJoin, Observable, iif, BehaviorSubject, AsyncSubject, Subject, interval, of , fromEvent, merge, empty, delay, from } = rxjs;
const { flatMap, reduce, groupBy, toArray, mergeMap, switchMap, scan, map, tap, filter } = rxjs.operators;
const { fromFetch } = rxjs.fetch;

const emptyStr = ''
console.log('!!emptyStr', !!emptyStr)

export class AppView extends EventEmitter {

  constructor() {
    super();
    this.self = document.querySelector('#app');
    this.messageBoxEl = document.createElement('div');
    this.messageBoxEl.id = 'chatMessages';
    
    this.store = store;
    this.inputBar = new InputBar();
    this.loginModal = new LoginModal();
    // this.loginModal.display()
    this.currentUser;
    this.store.registerListener('messages:update', this.handleMessagesUpdate.bind(this))
    this.store.registerListener('chat:loaded', this.handleChatLoaded.bind(this))
    this.inputBar.registerListener('message:send', this.handleMessageSent.bind(this))
    this.loginModal.registerListener('login', this.handleLogin.bind(this))

    this.viewCache = {
      chat: null
    }

    this.messages$ =
      this.store.messageStream$
      .pipe(

        map(this.renderMessages.bind(this)),
      )
    // .subscribe()
    this.setActiveView('login')
  }

  get currentViewId() { return this.activeView.firstElementChild ? this.activeView.firstElementChild.id : null}

  get messageEls() { return [...this.messageBoxEl.querySelectorAll('.message')] }

  get lastMessageEl() { return this.messageEls[this.messageEls.length - 1] }

  get activeView() { return document.querySelector('#active-view'); }

  clearMessages() {
    this.messageBoxEl.innerHTML = ''
  }

  setActiveView(viewName) {
    if (this.currentViewId === viewName) return;
    if (this.activeView.firstElementChild) this.activeView.firstElementChild.remove()
    if (viewName == 'chat') {
      this.messages$
        .subscribe()
      this.activeView.append(this.messageBoxEl)


    } else if (viewName == 'login') {
      // this.activeView.firstElementChild.remove()
      this.activeView.append(this.loginModal.dom)

    }
  }

  renderMessages(msgs) {
    if (!msgs) return;

    this.messageBoxEl.innerHTML = `${
        msgs.reduce((template, curr) => {
          return `${template}
          <div class="message">
            <div class="messageTop">${curr.from || 'Anon'}</div>
            <div class="messageMiddle">${curr.text||''}</div>
            <div class="messageBottom">${curr.createdDate||'no date'}</div>
          </div>`;
        },'')
      }`;

    setTimeout(() => {
      if (this.lastMessageEl) {
        this.lastMessageEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100)
  }

  // toggleLogin() {
  //   // this.self.firstElementChild.style.height = '0px'
  //   // this.self.firstElementChild.style.overflow = 'hidden'
  //   this.viewCache.chat = this.self.innerHTML;

  //   this.self.innerHTML = `
  //   <div id="modalDimmer"></div>
  //   <div id="loginModal">
  //     <label for="usernameInput">Username</label>
  //     <input type="text" name="usernameInput" id="usernameInput">
  //     <button id="loginSubmit">Ok</button>
  //   </div>
  //   `
  // }

  handleMessageSent(msg) {
    this.store.addMessage({ text: msg })
  }

  handleChatLoaded(chat) {}

  async handleLogin(username) {
    console.log('handleLogin', { username })
    this.currentUser = await this.store.logUserIn(username)
    this.setActiveView('chat')
  }

  handleMessagesUpdate(messages) {}
}

const chatApp = new AppView();
