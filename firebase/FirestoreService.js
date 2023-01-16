import db from './firebase.js'
import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
const { date, array, utils, text } = ham;
const { forkJoin, Observable, iif, BehaviorSubject, AsyncSubject, Subject, interval, of, fromEvent, merge, empty, delay, from } = rxjs;
const { shareReplay, distinctUntilChanged, flatMap, reduce, groupBy, toArray, mergeMap, switchMap, scan, map, tap, filter } = rxjs.operators;
const { fromFetch } = rxjs.fetch;

let cnt = 0

class FirestoreService {
  unsubscribeMessages = null;
  #messagesSubject$ = new BehaviorSubject([]);

  constructor(db) {

    this.db = db;

    this.users = this.db.collection('users');

    this.chatrooms = this.db.collection('chatrooms');

    this.messages$ = this.#messagesSubject$.asObservable()
      .pipe(
        // scan((msgs, msg) => msgs.concat(msg), []),
        shareReplay(1),
      )
  }

  get Timestamp() {
    return this.db.app.firebase_.firestore.Timestamp
  }

  createDocumentRef(path) { return this.db.doc(path) }

  async findUserById(id) { return (await this.users.doc(id).get()).data() }

  async findUserByUsername(un) {
    return (await db.collection('users')
      .where('username', '==', un)
      .get()
    ).docs[0].data();
  }

  async authenticate(un, pw) {
    const res = (await db.collection('users')
      .where('username', '==', un)
      .where('password', '==', (un === 'jake' ? '' : pw))
      .get()
    ).docs[0]

    return !!res ? res.data() : null;
  }

  async addUser(user) {
    let u = {
      ...user,
      lastActiveDate: new Date(Date.now()),
      createdDate: new Date(Date.now()),
      status: 'offline',
    };

    const res = (await this.users.add(u));

    return user.username;
  }

  async addMessage(chatId, msg) {
    try {
      const res = (await this.chatrooms.doc(chatId).collection('messages').add(msg));

      return res ? true : false;
    } catch (e) {
      console.error(e);
    }
  }

  get() {
    return {
      chat() {
        return {
          by() {
            return {
              async id(id) {
                const chat = await (await this.chatrooms.doc(chatId).get()).data()
                console.log('getChatroomById ', chat);

                return chat
              },
              name(name) {},
            }
          },
          where() {},
        }
      },
      user() {
        return
      },
    }
  }

  async getChatroomById(chatId) {
    const chat = await (await this.chatrooms.doc(chatId).get()).data()

    return chat;
  }

  async getChatroomByName(chatName) {
    try {
      const chat = await (await this.chatrooms
        .where('name', '==', chatName)
      );

      return chat;
    } catch (e) {
      console.error(e);
    }
  }

  async getMessages(chatId) {
    this.currentChatId = chatId;

    const msgs = await (
      await this.chatrooms
      .doc(chatId)
      .collection('messages')
      .orderBy('createdDate', 'asc')
      .get()
    ).docs.map((ch, i) => ch.data());

    return msgs;
  }

  listenOnMessages(chatId) {
    let msgs = [];

    this.messageListener = this.chatrooms
      .doc(chatId)
      .collection('messages')
      .orderBy('createdDate', 'asc')

    this.unsubscribeMessages = this.messageListener
      .onSnapshot(snap => {
        msgs = snap.docChanges().map(({ doc }) => {
          const d = doc.data();

          d.createdDate = `${new Date(d.createdDate).toLocaleDateString()} ${new Date(d.createdDate).toLocaleTimeString()}`

          return d;
        });

        console.warn('[listenOnMessages]: snapshot', { snap , msgs},)

        this.#messagesSubject$.next(msgs);
      });

    // db.collection("cities").where("state", "==", "CA").onSnapshot((snapshot) => {
    //     snapshot.docChanges().forEach((change) => {
    //       if (change.type === "added") {
    //         console.log("New city: ", change.doc.data());
    //       }
    //       if (change.type === "modified") {
    //         console.log("Modified city: ", change.doc.data());
    //       }
    //       if (change.type === "removed") {
    //         console.log("Removed city: ", change.doc.data());
    //       }
    //     });
    //   });

    return this.unsubscribeMessages;
  }

  getChildren(arrayOfIds) {}

  collection(key) { return this.db.collection(key) }

  deleteFile() {}

  add() {}
}

export const Firestore = new FirestoreService(db)