// import {Vue} from './Vue'
// import Vuex from './vuex.js'

const store = new Vuex.Store({
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

new Vue({
  el: '#app',
  computed: {
    count() {
      return store.getters.count
    }
  },
  methods: {
    increment() {
    	store.state.count = ++store.state.count
      // store.commit('increment')
    },
    decrement() {
      store.commit('decrement')
    }
  }
})