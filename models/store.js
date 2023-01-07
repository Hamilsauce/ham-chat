import { EventEmitter } from '../lib/event-emitter.js';
import { messagesSeed } from '../data/message-seed.js';
import { coerceData } from '../lib/coerce.js';
import { localStore } from '../datastore/localStore.service.js';
import { Firestore } from '../firebase/FirestoreService.js';

const { forkJoin, Observable, iif, BehaviorSubject, AsyncSubject, Subject, interval, of, fromEvent, merge, empty, delay, from } = rxjs;
const { flatMap, reduce, groupBy, toArray, mergeMap, switchMap, scan, map, tap, filter } = rxjs.operators;
const { fromFetch } = rxjs.fetch;


const jakeId = '6eCKrY70mvt5lDK0q42c';

const initialState = {
  ...messagesSeed,
};


class Store extends EventEmitter {
  env = 'dev';
  storeKey = 'chatApp';
  state = {
    currentUser: {
      chatrooms: [],
    },
    activeChat: {
      name: null,
      id: null,
      description: '',
      topic: null,
      labels: [],
      messages: new Map(),
    },
  };

  constructor() {
    super();

    this.messageStream$ = Firestore.messages$
      .pipe(
        tap(msg => msg.createdDate = `${new Date(msg.createdDate).toLocaleDateString()} ${new Date(msg.createdDate).toLocaleTimeString()}`),
      );
  }

  async init(initialState = {}) {
    const jake = await Firestore.findUserById(jakeId)
    const chat0 = await Firestore.getMessages('Chat Zero') //.get()
    const chat1 = (await jake.chatrooms[0].get()).data()

    window.chatStore = this.state;
    return this;
  }

  async logUserIn(un = '') {
    this.state.currentUser = await Firestore.findUserByUsername(un)
    const user = this.state.currentUser;
    const userchat = (await (await this.state.currentUser.chatrooms[0]).get()).data() //.get()).data()

    user.chatrooms.forEach(async (ref, i) => {
      const chat = (await (await ref).get()).data();
      user.chatrooms[i] = { ...chat, createdDate: chat.createdDate.toDate().toLocaleDateString() };
    });
    if (!this.state.currentUser) Firestore.addUser({ username: un })

    this.setActiveChat(userchat.id);
    console.warn('LOGIN USER', user);
    return this;
  }

  startMessageStream(roomid) {
    Firestore.listenOnMessages(roomid)
  }

  async setActiveChat(roomId) {

    console.log('setActiveChat', { roomId })
    this.state.activeChat = await Firestore.getChatroomById(roomId);

    this.getMessages(roomId);

    this.emit('chat:loaded', this.activeChat);

    return this;
  }

  setCurrentUser(data) {
    const messages = Object.values(data)
      .reduce((map, curr, i) => {
        for (var prop in curr) {
          curr[prop] = coerceData(curr[prop]);
        }

        return map.set(curr.id, curr);
      }, new Map());

    this.state = { ...this.state, messages };
    return this;
  }

  loadState(data, key) {
    const messages = Object.values(data)
      .reduce((map, curr, i) => {
        for (var prop in curr) {
          curr[prop] = coerceData(curr[prop])
        }
        return map.set(curr.id, curr)
      }, new Map());

    this.state = { ...this.state, messages };
    return this;
  }

  async getMessages(chatId) {
    this.state.activeChat.messages = await Firestore.getMessages(chatId);

    this.startMessageStream(chatId);

    this.emit('messages:update', this.state.activeChat.messages);
  }

  async addMessage(msg) {
    msg = {
      text: msg.text,
      from: this.currentUser.username,
      from_id: this.currentUser.id,
      createdDate: Date.now(),
      type: 'message'
    }

    await Firestore.addMessage(this.activeChat.id, msg);

    this.getMessages(this.activeChat.id);

    this.state.activeChat.messages = await Firestore.getMessages(this.activeChat.id);

    return this.messages;
  }

  loadFromLocalStore(key) {
    return this.loadState(localStore.get(this.storeKey));
  }

  get messages() { return [...this.state.activeChat.messages.values()] };

  get activeChat() { return this.state.activeChat };

  get currentUser() { return this.state.currentUser };
  get userChats() { return this.state.currentUser.chatrooms };
}

export const store = await new Store().init(initialState)