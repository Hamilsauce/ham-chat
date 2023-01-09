import { EventEmitter } from '../lib/event-emitter.js';


const InputEvents = {
  send: 'message:send'
}

export class InputBar extends EventEmitter {
  constructor(selector = '#inputContainer') {
    super();

    this.init(InputEvents)
    this.self = document.querySelector(selector);
    console.log('this.input', this.input)

    this.submitButton.addEventListener('click', e => {
      this.sendMessage.bind(this)(this.currentMessage)
    });

    this.input.addEventListener('keyup', e => {
      console.log({ e });
      const { key, shiftKey, target } = e;

      console.log('shiftKey', shiftKey)
      if (key && key.toLowerCase() === 'enter') {
        console.warn('KEY IS ENTER, curr message: ', this.currentMessage)
        this.sendMessage.bind(this)(this.currentMessage)
      }

    });
  }

  init(eventMap = {}) {
    for (var prop in eventMap) {
      this.registerEvent(eventMap[prop])
    }

    console.log(this);
  }

  sendMessage(msg) {
    this.emit(InputEvents.send, msg);
    this.resetMessage()
    console.log('events', InputEvents.send, this.events);
    console.log('listenersOn', InputEvents.send, this.listenersOn(InputEvents.send));
  }

  resetMessage() { this.currentMessage = '' }

  get hasMessage() { return !!this.currentMessage }

  get currentMessage() { return this.input.textContent.trim() }

  set currentMessage(v) { this.input.textContent = v }

  get input() { return this.self.querySelector('#messageInput') };

  get submitButton() { return this.self.querySelector('#messageSubmitButton') };
}