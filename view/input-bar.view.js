import { EventEmitter } from 'https://hamilsauce.github.io/hamhelper/event-emitter.js';
import { View } from './view.js';

const InputEvents = {
  send: 'message:send'
}

export class InputBar extends EventEmitter {
  constructor(selector = '#inputContainer') {
    super();

    this.init(InputEvents);

    this.self = document.querySelector(selector);

    this.submitButton.addEventListener('click', e => {
      this.sendMessage.bind(this)(this.currentMessage);
    });

    this.input.addEventListener('keyup', e => {
      const { key, shiftKey, target } = e;

      if (key && key.toLowerCase() === 'enter') {

        console.warn('KEY IS ENTER, curr message: ', this.currentMessage);

        this.sendMessage.bind(this)(this.currentMessage);
      }
    });
  }

  init(eventMap = {}) {
    console.log(this);
  }

  sendMessage(msg) {
    this.emit(InputEvents.send, msg);
    this.resetMessage();
  }

  resetMessage() { this.currentMessage = ''; }

  get hasMessage() { return !!this.currentMessage }

  get currentMessage() { return this.input.textContent.trim() }

  set currentMessage(v) { this.input.textContent = v }

  get input() { return this.self.querySelector('#messageInput') };

  get submitButton() { return this.self.querySelector('#messageSubmitButton') };
}