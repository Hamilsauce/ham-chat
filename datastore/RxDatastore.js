import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
// import localStore  from '/_datastore/localStore.js'
import { localStore } from '/_datastore/localStore.js'
const { date, array, utils, text } = ham;
const { iif, BehaviorSubject, ReplaySubject, AsyncSubject, Subject, interval, of , fromEvent, merge, empty, delay, from } = rxjs;
const { distinctUntilChanged, throttleTime, mergeMap, switchMap, scan, take, takeWhile, map, tap, startWith, filter, mapTo } = rxjs.operators;
const { fromFetch } = rxjs.fetch;

const seed = {
  users: {
    tom: { id: 'tom', firstName: 'tom', lastName: 'mot', age: 47 },
    john: { id: 'john', firstName: 'john', lastName: 'ham', age: 75 },
    jill: { id: 'jill', firstName: 'jill', lastName: 'jam', age: 33 },
    butt: { id: 'butt', firstName: 'butt', lastName: 'hole', age: 5 },
  },
  chats: {
    chat1: { name: 'Awesome chat', members: ['jill', 'tom'] },
    chat2: { name: 'dumb chat', members: ['john', 'butt'] },
    chat3: { name: 'solo chat', members: ['butt'] },
  },
}

export class RxDataStore {
  #collections

  constructor(seed) {
    this.#collections = Object.entries(seed)
      .reduce((acc, [key, value], i) => {
        return acc.set(key, {
          _source$: new BehaviorSubject(value),
          _data: value
        })
      }, new Map());

    this.lStore = localStore;

    this.lStoreUsers = this.lStore.connect('users');

    this.lStoreUsers.data$.pipe(
        tap(x => console.log('LSTOREUSERS', x)),
      )
      .subscribe();
  }

  NameIdLookup(nameOrRef) {
    const coll = [...this.#collections.get(nameOrRef).entries()]
    return coll.reduce((acc, [k, v], i) => {
      return [v.name, key]
    }, []);
  }

  update(collection, value) {
    value.id = value.id ? value.id : utils.uuid();
    const oldValue = collection._data[value.name];

    collection._source$.next({
      [value.id]: { ...value }
    });

    collection._data = collection._source$.getValue()

  }

  remove(collection, id) {
    collection._source$.next({
      [id]: undefined
    });
  }

  getCollectionKeys(name) {
    return [...this.#collections.get(name).keys()]
  }

  getCollection(name) {
    return [...this.#collections.get(name).values()]
  }

  findByName(name) {
    return [...this.#collections.entries()]
  }

  connect(collName) {
    const coll$ = this.#collections.get(collName);
    const update = (coll$) => (updateObj) => this.update(coll$, updateObj)
    const remove = (coll$) => (id) => this.remove(coll$, id)

    return {
      get: coll$._source$.asObservable().pipe(
        scan((oldValue, newValue) => ({ ...oldValue, ...newValue })),
        distinctUntilChanged((prev, curr) => {
          if (Array.isArray(prev))
            return prev.reduce((isChangeDetected, [key, value], i) => {
              return ![curr[key], false].includes(value) || isChangeDetected ? true : false;
            });

          return Object.entries(prev)
            .reduce((isChangeDetected, [key, value], i) => {
              return [curr[key], false].includes(value) || isChangeDetected !== true ? false : true;
            });
        }),
        tap(this.lStoreUsers.set),
      ),
      set: update(coll$),
      remove: remove(coll$),
    }
  }
}
