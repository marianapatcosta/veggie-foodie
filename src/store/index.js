import { createStore } from 'vuex'

const store = createStore({
  state() {
    return {
      database: null,
      userData: null,
      theme: null
    }
  },
  mutations: {
    setDatabase(state, database) {
      state.database = database
    },
    setUserData(state, userData) {
      state.userData = userData
    },
    setTheme(state, theme) {
      state.theme = theme
    }
  },
  actions: {
    setDatabase(context, database) {
      context.commit('setDatabase', database)
    },
    setUserData(context, userData) {
      context.commit('setUserData', userData)
    },
    setTheme(context, theme) {
      context.commit('setTheme', theme)
    }
  },
  getters: {
    database(state) {
      return state.database
    },
    userData(state) {
      return state.userData
    },
    theme(state) {
      return state.theme
    }
  }
})

export default store
