import { createStore } from 'vuex'

const store = createStore({
  state() {
    return {
      database: null,
      userData: null,
      theme: null,
      isOffline: null
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
    },
    setIsOffline(state, isOffline) {
      state.isOffline = isOffline
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
    },
    setIsOffline(context, isOffline) {
      context.commit('setIsOffline', isOffline)
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
    },
    isOffline(state) {
      return state.isOffline
    }
  }
})

export default store
