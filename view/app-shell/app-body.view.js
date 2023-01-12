// import { store } from '../models/store.js';
import { View } from '../view.js';

const { forkJoin, Observable, iif, BehaviorSubject, AsyncSubject, Subject, interval, of, fromEvent, merge, empty, delay, from } = rxjs;
const { flatMap, reduce, groupBy, toArray, mergeMap, switchMap, scan, map, tap, filter } = rxjs.operators;
const { fromFetch } = rxjs.fetch;

export class AppBody extends View {
  // store = store;

  constructor() {
    super('app-body', {
      templateName: 'app-body',
      elementProperties: {},
    });
  }

  async init() {
    this.messageSubscription = this.messages$.subscribe()
  }
}