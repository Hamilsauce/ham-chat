import db from './firebase.js'
import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
const { date, array, utils, text } = ham;
const { asObservable, forkJoin, Observable, iif, BehaviorSubject, AsyncSubject, Subject, interval, of, fromEvent, merge, empty, delay, from } = rxjs;
const { distinctUntilChanged, flatMap, reduce, groupBy, toArray, mergeMap, switchMap, scan, map, tap, filter } = rxjs.operators;
const { fromFetch } = rxjs.fetch;

class FirestoreService {
  constructor(db) {
    this.currentFolder
    this.db = db;

    this.users = this.db.collection('users');

    this.chatrooms = this.db.collection('chatrooms');

    this.messages$ = new BehaviorSubject([]);

    this.fsFolders$ = new Subject();

    this.fsFiles$ = new Subject();

    this.fsSnapQuery$ = merge(this.fsFolders$.asObservable(), this.fsFiles$.asObservable());

    // this.fsQuery$
    //   .pipe(
    //   tap(x => console.log('FS fsQuery$ SNAPPER', x))
    // )
    // .subscribe()


    // this._firestoreResponse$ = new Subject()
    // this.fsQuery$ = new Subject()

    // this.firestoreResponse$ = this._firestoreResponse$.asObservable().pipe(
    //     distinctUntilChanged((a, b) => a.id === b.id),
    //     // tap(x => console.log('AFTER DISTINCY JN FS', x)),
    //   );
  }

  get Timestamp() {
    return this.db.app.firebase_.firestore.Timestamp
  }

  async file(id) { return await this.files.doc(id) }

  async findUserById(id) { return (await this.users.doc(id).get()).data() }

  async findUserByUsername(un) {
    return (await db.collection('users')
      .where('username', '==', un)
      .get()
    ).docs[0].data();
  }

  async folder(id) {
    this.getFolderChildrenSnap((await this.folders.doc(id).get()).data())

    this._firestoreResponse$.next(
      await this.getFolderChildrenData(
        (await this.folders.doc(id).get()).data())
    );
  }

  async addUser(user) {
    user = (await this.users.add(user))
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
    console.log('getChatroomById ', chat);

    return chat
  }

  async getChatroomByName(chatName) {
    try {
      const chat = await (await this.chatrooms
        .where('name', '==', chatName)
      );

      return chat;
    } catch (e) {
      console.error(e)
    }
  }

  async getMessages(chatId) {
    const msgs = await (
      await this.chatrooms
      .doc(chatId)
      .collection('messages')
      .orderBy('createdDate', 'asc')
      .get()
    ).docs.map((ch, i) => ch.data());

    console.warn('getMessages', { msgs });

    return msgs;
  }

  listenOnMessages(chatId) {
    this.messageListener = this.chatrooms
      .doc(chatId)
      .collection('messages')
      .orderBy('createdDate', 'asc')

    this.messageListener.onSnapshot(snap => {
      const msgs = snap.docs
        .map(doc => {
          const d = doc.data();

          d.createdDate = `${new Date(d.createdDate).toLocaleDateString()} ${new Date(d.createdDate).toLocaleTimeString()}`

          return d;
        });

      this.messages$.next(msgs);
    });

    return this.messages$;
  }

  getChildren(arrayOfIds) {}

  collection(key) { return this.db.collection(key) }

  deleteFile() {}

  add() {}
}

export const Firestore = new FirestoreService(db)