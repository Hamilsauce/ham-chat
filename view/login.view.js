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

    this.display();

    this.dom.addEventListener('click', e => {
      const targ = e.target;
      const dataset = targ.dataset

      if (targ.id === 'login-button') {
        this.display('loginForm');
      }
      
      else if (targ.id === 'signup-button') {
        this.display('signupForm');
      }
      
      else if (dataset.action && dataset.action.split(':')[1] === 'submit') {
        const submitType = dataset.action.split(':')[0]

        if (submitType == 'login') {
          this.submitLogin.bind(this)(this.$('#login-username-input').value, this.$('#login-password-input').value)
        }

        else if (submitType === 'signup' && this.$('#signup-username-input').value) {
          this.submitSignup.bind(this)(this.$('#signup-username-input').value, this.$('#signup-password-input').value)
        }
      }
    });
  }

  render() {
    return this.dom;
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
  }

  hide() {
    this.dom.remove();
  }

  submitLogin(username, password) {
    this.emit('login', { username, password });

    this.hide();
  }

  submitSignup(username, password) {
    console.log('this.emit(signup, username, password)', this.emit('signup', username, password))
    console.warn('signup', username, password);
    this.emit('signup', { username, password });

    this.hide();
  }

  get activeStep() { return this.dom.firstElementChild.id }

  get activityPrompt() { return this.$('#login-activity-prompt') }

  get loginForm() { return this.$('#login-form') }

  get signupForm() { return this.$('#signup-form') }

  get show() { return this.input.value }

  set show(v) { this.input.value = v }
}