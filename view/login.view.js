// import { EventEmitter } from '../lib/event-emitter.js';
import { store } from '../models/store.js';
import { EventEmitter } from 'https://hamilsauce.github.io/hamhelper/event-emitter.js';
import { View } from './view.js';
import { router } from '../router/router.js';
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

export class LoginView extends View {
  store = store;
  router = router;
  
  constructor() {
    super('login-view', {
      templateName: 'login-view',
      elementProperties: {},
    });

    this.display();

    console.log('this.loginForm', this.loginForm)

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
          this.handleLogin.bind(this)({ username: this.$('#login-username-input').value, password: this.$('#login-password-input').value })
        }

        else if (submitType === 'signup' && this.$('#signup-username-input').value) {
          this.handleSignup().bind(this)(this.$('#signup-username-input').value, this.$('#signup-password-input').value)
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


  async handleUserRegistered(event) {
    const res = await this.store.getUser({ username, password });
    this.currentUser = res
    console.warn('handleUserRegistered event', event)
    setTimeout(() => {
      this.loginModal.display('loginForm');
      // this.setActiveView('chat-list');
      this.setActiveView('login');
    }, 200);
  }

  async handleLogin({ username, password }) {
    const res = await this.store.getUser({ username, password });
    console.log('res', res)
    if (!!res) {
      this.currentUser = res;
      router.push('chats')
      // this.setActiveView('chat-list');
    }

    else {
      setTimeout(() => {
        this.setActiveView('chat-list');
        this.setActiveView(null);
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