import db from './firebase.js'
import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
const { date, array, utils, text } = ham;
const { asObservable, forkJoin, Observable, iif, BehaviorSubject, AsyncSubject, Subject, interval, of , fromEvent, merge, empty, delay, from } = rxjs;
const { distinctUntilChanged, flatMap, reduce, groupBy, toArray, mergeMap, switchMap, scan, map, tap, filter } = rxjs.operators;
const { fromFetch } = rxjs.fetch;

class FirestoreService {
  constructor(db) {
    this.currentFolder
    this.db = db;

    this.users = this.db.collection('users')

    this.chatrooms = this.db.collection('chatrooms')

    this.fsFolders$ = new Subject();
    this.fsFiles$ = new Subject();

    this.fsSnapQuery$ = merge(this.fsFolders$.asObservable(), this.fsFiles$.asObservable())

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
  paginate(collectionName, orderField) {
    let cn = collectionName
    let field = orderField
    let firstDoc;
    let lastDoc;
    // [START paginate]
    let query = ref => ref.orderBy(field).limit(pageSize);

    function nextPage(last) {
      query = ref => ref.orderBy(field).startAfter(last[field]).limit(pageSize);
    }

    function prevPage(first) {
      query = ref => ref.orderBy(field).endBefore(first[field]).limitToLast(pageSize);
    }

    const first = this.db.collection(collectionName)
      .orderBy('name')
      .limit(26);

    return first.get().then((documentSnapshots) => {

      var lastVisible = documentSnapshots.docs[documentSnapshots.docs.length - 1];

      var next = db.collection(collectionName)
        .startAfter(lastVisible)
        .limit(26);
    })
  }


  async file(id) { return await this.files.doc(id) }

  async findUserById(id) { return (await this.users.doc(id).get()).data() }

  async findUserByUsername(un) {
    return (await db.collection('users')
        .where('username', '==', un)
        .get())
      .docs[0].data()
  }

  async folder(id) {
    this.getFolderChildrenSnap((await this.folders.doc(id).get()).data())
    this._firestoreResponse$.next(
      (
        await this.getFolderChildrenData((await this.folders.doc(id).get()).data())))
  }
  async addUser(user) {
    // console.log('MODEL', msg);
    // msg.id = msg.id ? msg.id : utils.uuid()
    // msg.createdDate = this.Timestamp.now()

    user = {...user,chatrooms:['chatrooms/TNup80srmvCs3pwrP8sX']}
    user = (await this.users.add(user))
   
    // .set(msg);
    // console.warn(await this.chatrooms.doc(chatId).collection('messages').doc().set(msg))
    // const chat = await (await this.chatrooms
    //   .where('name', '==', chatName)
    // );

    // const chatMsgs = await (
    //   await db.collection('/chatrooms/TNup80srmvCs3pwrP8sX/messages').get()
    // ).docs.map((ch, i) => {
    //   return ch.data()
    // });

    // console.log('chatMsgs', chatMsgs)
    // return this.activeChat.
  }
  
  async addMessage(chatId, msg) {
    // console.log('MODEL', msg);
    // msg.id = msg.id ? msg.id : utils.uuid()
    // msg.createdDate = this.Timestamp.now()

    const res = (await this.chatrooms.doc(chatId).collection('messages').add(msg)) //.get())
    // .set(msg);
    // console.warn(await this.chatrooms.doc(chatId).collection('messages').doc().set(msg))
    // const chat = await (await this.chatrooms
    //   .where('name', '==', chatName)
    // );

    // const chatMsgs = await (
    //   await db.collection('/chatrooms/TNup80srmvCs3pwrP8sX/messages').get()
    // ).docs.map((ch, i) => {
    //   return ch.data()
    // });

    // console.log('chatMsgs', chatMsgs)
    // return this.activeChat.
  }

  async getChatroomById(chatId) {
    const chat = await (await this.chatrooms.doc(chatId).get()).data()
    console.log('getChatroomById ', chat)

    return chat
  }
  
  async getChatroomByName(chatName) {
    const chat = await (await this.chatrooms
      .where('name', '==', chatName)
    );
    return chat
  }

  async getMessages(chatId) {
    const msgs = (await (
        await this.chatrooms.doc(chatId).collection('messages')
        .orderBy('createdDate', 'asc')
      ).get()).docs
      .map((ch, i) => {
        const d =  ch.data();
        d.createdDate = new Date(d.createdDate).toDateString()
     return d
      });

    console.warn('getMessages', { msgs });
    return msgs
  }

  getFolderChildrenSnap(doc) {
    let folder = doc
    folder.children = []
    let allChildren = []
    let folderChildren = this.folders
      .where('parentId', '==', folder.id)

    let fileChildren = this.files
      .where('parentId', '==', folder.id)

    folderChildren.onSnapshot(collSnap => {
      collSnap.docs.forEach(doc => {
        this.fsFolders$.next(doc.data())
      })
    })

    fileChildren.onSnapshot(collSnap => {

      collSnap.docs.forEach(doc => {
        this.fsFiles$.next(doc.data())
      })


      //   folder.children = [
      //   ...folder.children,
      //   ...collSnap.docs.map(doc => ({
      //       ...doc.data(),
      //     }))
      // ]
    })

  }

  getChildren(arrayOfIds) {}

  collection(key) { return this.db.collection(key) }

  deleteFile() {}

  add() {}

}

export const Firestore = new FirestoreService(db)
