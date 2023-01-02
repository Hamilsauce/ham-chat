// import { EventEmitter } from '../lib/event-emitter.js';
import { EventEmitter } from 'https://hamilsauce.github.io/hamhelper/event-emitter.js';
import { View } from './view.js';

import { defineAction } from '../models/actions.js';

const Login = defineAction('login', {
  username: String,
  password: String,
});

const Signup = defineAction('signup', {
  username: String,
  password: String,
});

const InputEvents = {
  login: 'user:login'
}

export class LoginModal extends View {


  constructor(id = 'login-modal') {
    super('login-modal');
    //   // this.init(InputEvents)
    //   // this.dimmer = document.createElement('div');
    //   // this.dom.id = id
    //   // this.dimmer.id = 'modalDimmer'

    //   this.usernameInput = document.createElement('input');
    //   this.usernameInput.type = 'text';
    //   this.usernameInput.value = 'cooluser1';
    //   this.usernameInput.id = 'usernameInput'
    //   this.loginSubmit = document.createElement('input');
    //   this.usernameLabel = document.createElement('label');
    //   this.usernameLabel.textContent = 'Username'
    //   this.loginSubmit.type = 'button';
    //   this.loginSubmit.value = 'Ok';
    //   this.loginSubmit.id = 'loginSubmit'

    // //   setTimeout(() => {
    // // this.loginSubmit.click()
    // //   }, 1000)

    //   this.dom.appendChild(this.usernameLabel)
    //   this.dom.appendChild(this.usernameInput)
    //   this.dom.appendChild(this.loginSubmit)
    this.display();
    console.log('this.activeStep', this.activeStep)

    this.dom.addEventListener('click', e => {

      const targ = e.target;
      const dataset = targ.dataset


      console.log('targ.id ', targ.id)
      if (targ.id === 'login-button') {
        this.display('loginForm');

      }
      else if (targ.id === 'signup-button') {
        this.display('signupForm');

      }
      else if (dataset.action && dataset.action.split(':')[1] === 'submit') {
        const submitType = dataset.action.split(':')[0]

        if (submitType == 'login') {
          this.submitLogin.bind(this)(this.$('#login-username-input').value)
        }

        else if (submitType === 'signup' && this.$('#signup-username-input').value) {
          this.submitSignup.bind(this)(this.$('#signup-username-input').value)
        }
      }
    });
  }
  
  render() {
    return this.dom
  }

  display(state = 'activityPrompt') {
    if (state === 'activityPrompt') {
      this.loginForm.style.display = 'none';
      this.signupForm.style.display = 'none';
      this.activityPrompt.style.display = null;
    }
    else if (state === 'loginForm') {
      this.activityPrompt.style.display = 'none';
      this.signupForm.style.display = 'none';
      this.loginForm.style.display = null;
    }
    else if (state === 'signupForm') {
      this.activityPrompt.style.display = 'none';
      this.loginForm.style.display = 'none';
      this.signupForm.style.display = null;
    }
    // document.querySelector('body').insertAdjacentElement('afterbegin', this.dimmer)
    // document.querySelector('#app').appendChild(this.dom)
  }

  hide() {
    this.dom.remove()
    // this.dimmer.remove(
  }

  submitLogin(username, password) {
    this.emit('login', username);
    // this.emit(Login({ username, password }));

    // this.resetMessage()
    // console.log('events', InputEvents.send, this.events);
    // console.log('listenersOn', InputEvents.send, this.listenersOn(InputEvents.send));

    this.hide()
  }

  submitSignup(un) {
    this.emit('signup', un);

    // this.resetMessage()
    // console.log('events', InputEvents.send, this.events);
    // console.log('listenersOn', InputEvents.send, this.listenersOn(InputEvents.send));

    this.hide()
  }

  // resetMessage() { this.currentMessage = '' }
  get activeStep() { return this.dom.firstElementChild.id }

  get activityPrompt() { return this.$('#login-activity-prompt') }

  get loginForm() { return this.$('#login-form') }

  get signupForm() { return this.$('#signup-form') }

  get show() { return this.input.value }

  set show(v) { this.input.value = v }

  // get input() { return this.dom.querySelector('#messageInput') };

  // get submitButton() { return this.dom.querySelector('#messageSubmitButton') };
}
