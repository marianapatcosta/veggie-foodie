import { createStore } from 'vuex'

const store = createStore({
  state() {
    return {
      database: null
    }
  },
  mutations: {
    setDatabase(state, database) {
      state.database = database
    }
  },
  actions: {
    setDatabase(context, database) {
      context.commit('setDatabase', database)
    }
  },
  getters: {
    database(state) {
      return state.database
    }
  }
})

export default store
