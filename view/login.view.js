import { EventEmitter } from '../lib/event-emitter.js';
import {View} from './view.js';


const InputEvents = {
  login: 'user:login'
}

export class LoginModal extends View {
  
  
  constructor(id = 'login-modal') {
    super('login-modal');
    // this.init(InputEvents)
    // this.dimmer = document.createElement('div');
    // this.dom.id = id
    // this.dimmer.id = 'modalDimmer'
    
    this.usernameInput = document.createElement('input');
    this.usernameInput.type = 'text';
    this.usernameInput.value = 'cooluser1';
    this.usernameInput.id = 'usernameInput'
    this.loginSubmit = document.createElement('input');
    this.usernameLabel = document.createElement('label');
    this.usernameLabel.textContent = 'Username'
    this.loginSubmit.type = 'button';
    this.loginSubmit.value = 'Ok';
    this.loginSubmit.id = 'loginSubmit'

  //   setTimeout(() => {
  // this.loginSubmit.click()
  //   }, 1000)

    this.dom.appendChild(this.usernameLabel)
    this.dom.appendChild(this.usernameInput)
    this.dom.appendChild(this.loginSubmit)
    this.loginSubmit.addEventListener('click', e => {
      this.submitLogin.bind(this)(this.usernameInput.value)
    });
  }

  display() {
    // document.querySelector('body').insertAdjacentElement('afterbegin', this.dimmer)
    document.querySelector('#app').appendChild(this.dom)
  }
  hide() {
    this.dom.remove()
    // this.dimmer.remove()
  }

  submitLogin(un) {
    this.emit('login', un);

    // this.resetMessage()
    // console.log('events', InputEvents.send, this.events);
    // console.log('listenersOn', InputEvents.send, this.listenersOn(InputEvents.send));

    this.hide()
  }

  // resetMessage() { this.currentMessage = '' }


  get show() { return this.input.value }
  
  get show() { return this.input.value }

  set show(v) { this.input.value = v }

  // get input() { return this.dom.querySelector('#messageInput') };

  // get submitButton() { return this.dom.querySelector('#messageSubmitButton') };
}
