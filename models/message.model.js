export const MessageInterface = {
  id: 196672,
  type: 'MESSAGETYPE',
  date: 'Date',
  from: 'USERNAME',
  from_id: 'USERID',
  text: 'string'
}

export class Message {
  constructor() {
    this.root;
  }
  
  get prop() { return this._prop };
  set prop(newValue) { this._prop = newValue };
}