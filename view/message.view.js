import { View } from './view.js';

// import { defineAction } from '../models/actions.js';

// const SelectChat = defineAction('select:chat', {
//   id: String,
// });

// const RemoveChat = defineAction('remove:chat', {
//   id: String,
// });


export class Message extends View {
  #from = null;
  #text = null;
  #createdDate = null;

  constructor({ from, text, createdDate }) {
    super('message', {
      templateName: 'message',
      elementProperties: {},
    });
    
    this.from = from
    this.text = text
    this.createdDate = createdDate

  }

  get content() { return this.dom.querySelector('#message-content').textContent }

  set from(v) {
    this.dom.querySelector('.messageTop').textContent = v;
  }
  
  set text(v) {
    this.dom.querySelector('.messageMiddle').textContent = v;
  }
  
  set createdDate(v) {
    this.dom.querySelector('.messageBottom').textContent = v;
  }


  static render(data) {
    return new Message(data).render()
  }
  
  render() {
    return this.dom;
  }

  hide() {
    this.dom.remove()
  }

  handleClick(e) {
    if (!!this.content) {}
  }
}