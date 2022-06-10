// const { Observable, iif, ReplaySubject, AsyncSubject, Subject, interval, of , fromEvent, merge, empty, delay, from } = rxjs;
// const { throttleTime, mergeMap, switchMap, scan, take, takeWhile, map, tap, startWith, filter, mapTo } = rxjs.operators;
// const { fromFetch } = rxjs.fetch;

// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAHY3xGRELWZs9qfxM4AsgCzsAazjbqMo8",
  authDomain: "ham-chat-9478f.firebaseapp.com",
  projectId: "ham-chat-9478f",
  storageBucket: "ham-chat-9478f.appspot.com",
  messagingSenderId: "39617759304",
  appId: "1:39617759304:web:bcafe6234046b007c8307d"
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);

// const firebaseConfig = {
//   apiKey: "AIzaSyBVnhy7RGLeKxhzywHJ2e5RV5HjYaQYQhQ",
//   authDomain: "home-db-ed6f0.firebaseapp.com",
//   projectId: "ham-chat-9478f",
//   storageBucket: "home-db-ed6f0.appspot.com",
//   messagingSenderId: "3177858927",
//   appId: "1:3177858927:web:aeb4b8b013b35165564a9a"
// };
// Project ID
// ham - chat - 9478 f
// Project number
// 39617759304

const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

export default db




// let observable = Observable.create(observer => db
//   .collection('conversations')
//   .where('members.' + auth.currentUser.uid, '==', true)
//   .onSnapshot(observer)
// );

// observable.subscribe({
//   next(value) { console.log('value', value); }
// });


/*
var docRef = db.collection("files") //.doc("SF");

let bigFiles = []
db.collection("files").where("size", ">", 1000000000)
  .get()
  .then(function(querySnapshot) {
    querySnapshot.forEach(async function(doc) {
      // const snap = (await querySnapshot)
      console.log('snap', doc.data())
    });
  })
  .catch(function(error) {
    console.log("Error getting documents: ", error);
  });
*/
