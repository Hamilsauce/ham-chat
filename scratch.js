import { EventEmitter } from './lib/event-emitter.js';
import { InputBar } from './view/input-bar.view.js';
// import { createApp } from 'vue'
import { store } from './models/store.js';
import db from './firebase/firebase.js';
import { LoginModal } from './view/login.view.js';
const appBody = document.querySelector('#appBody')
const containers = document.querySelectorAll('.container')

console.log({ db });
console.log(localStorage);

// const vueapp = createApp({
//   data() {
//     return {
//       message: 'Hello Vue!'
//     }
//   }
// }).mount('#appHeader')


export class AppView extends EventEmitter {
  constructor() {
    super();
    this.self = document.querySelector('#app');
    this.messageBoxEl = document.querySelector('#chatMessages');
    this.store = store;
    this.inputBar = new InputBar();
    this.loginModal = new LoginModal();
    this.loginModal.display()
    this.currentUser;
    this.store.registerListener('messages:update', this.handleMessagesUpdate.bind(this))
    this.store.registerListener('chat:loaded', this.handleChatLoaded.bind(this))
    this.inputBar.registerListener('message:send', this.handleMessageSent.bind(this))
    this.loginModal.registerListener('login', this.handleLogin.bind(this))
    // this.renderMessages(this.store.messages)
    this.viewCache = {
      chat: null
    }
    console.warn('store in App', this.store.messages)
    // document.addEventListener('login', this.handleLogin.bind(this))

  }

  clearMessages() {
    this.messageBoxEl.innerHTML = ''
  }

  renderMessages(msgs) {
    if (!msgs) return;
 console.warn('MSGS', msgs)
    this.messageBoxEl.innerHTML = `
      ${
        msgs.reduce((template, curr) => {
          return `${template}
          <div class="message">
            <div class="messageTop">${curr.from || 'Anon'}</div>
            <div class="messageMiddle">${curr.text||''}</div>
            <div class="messageBottom">${curr.createdDate||'no date'}</div>
          </div>
          `;
        },'')
      }
    `;
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
    console.warn('messsage heard in App', { msg });
    this.store.addMessage({ text: msg })
  }

  handleChatLoaded(chat) {
    console.warn('handleChatLoaded', { chat });
    this.renderMessages(chat.messages)
  }

  async handleLogin(username) {
    console.warn('handleLogin heard in App', { username });
    this.currentUser = await this.store.logUserIn(username)
    console.warn('this.currentUser', this.currentUser);
  }

  handleMessagesUpdate(messages) {
    console.warn('handle Messages Update heard in App', { messages });
    this.renderMessages(messages)
    this.messageBoxEl.children[this.messageBoxEl.children.length - 1].scrollIntoView({ behavior: 'smooth' })
  }
}

const chatApp = new AppView();

setTimeout(() => {
  // chatApp.toggleLogin()

  console.log(' ', );
}, 1500)
