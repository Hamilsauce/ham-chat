import { EventEmitter } from '../lib/event-emitter.js';


const InputEvents = {
  login: 'user:login'
}

export class LoginModal extends EventEmitter {
  constructor(id = 'loginModal') {
    super();
    // this.init(InputEvents)
    this.self = document.createElement('div');
    this.dimmer = document.createElement('div');
    this.self.id = id
    this.dimmer.id = 'modalDimmer'
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

    this.self.appendChild(this.usernameLabel)
    this.self.appendChild(this.usernameInput)
    this.self.appendChild(this.loginSubmit)
    this.loginSubmit.addEventListener('click', e => {
      this.submitLogin.bind(this)(this.usernameInput.value)
    });
  }

  display() {
    document.querySelector('body').insertAdjacentElement('afterbegin', this.dimmer)
    document.querySelector('#app').appendChild(this.self)
  }
  hide() {
    this.self.remove()
    this.dimmer.remove()
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

  set show(v) { this.input.value = v }

  // get input() { return this.self.querySelector('#messageInput') };

  // get submitButton() { return this.self.querySelector('#messageSubmitButton') };
}
