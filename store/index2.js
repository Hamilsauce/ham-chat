// import {Vue} from './Vue'
// import Vuex from './vuex.js'

export const store2 = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment: state => state.count++,
    decrement: state => state.count--
  },
  getters: {
  	count(state) {
  		return state.count;
  	}
  },
  actions: {
  	loadSongs() {
  		
  	}
  }
})

{
	store2
}