import { createStore } from 'vuex'

const store = createStore({
  state() {
    return {
      database: null,
      meals: [
        /* {
          id: 'm1',
          date: '2021-06-20T20:11:06.368Z',
          title: 'A trip to Lisbon',
          location: 'Lisbon, Portugal',
          description: 'Very nice trip! Walked a lot!!!!',
          imageUrl:
            'https://viagemeturismo.abril.com.br/wp-content/uploads/2017/01/belem-tower-2809818_1920.jpg'
        },
        {
          id: 'm2',
          date: '2021-01-12T11:11:06.368Z',
          location: 'Porto, Portugal',
          title: 'A visit to the garden',
          description: 'Always nice to feel mother nature!',
          imageUrl:
            'https://yachtdouro.pt/wp-content/uploads/2018/03/yachtdouro-sunset-900x600.jpg'
        },
        {
          id: 'm3',
          location: 'Paris, France',
          date: '2021-04-03T23:31:06.368Z',
          title: 'Good sunset view',
          description: 'So Beautiful!!',
          imageUrl:
            'https://www.guiadacidade.pt/assets/capas_poi/capa_21147.jpg'
        } */
      ],
    }
  },
  mutations: {
    setDatabase(state, database) {
      state.database = database;
    },
    addMeal(state, meal) {
      const newMeal = {
        id: new Date().toISOString(),
        ...meal
      }

      state.meals.unshift(newMeal)
    },
    editMeal(state, mealData) {
      const itemToEditIndex = state.meals.findIndex(
        ({ id }) => id === mealData.mealId
      )
      state.meals.splice(itemToEditIndex, 1, mealData.meal)
    },
    deleteMeal(state, mealId) {
      const itemToDeleteIndex = state.meals.findIndex(({ id }) => id === mealId)
      state.meals.splice(itemToDeleteIndex, 1)
    }
  },
  actions: {
    setDatabase(context, database) {
      context.commit('setDatabase', database)
    },
    addMeal(context, meal) {
      context.commit('addMeal', meal)
    },
    editMeal(context, mealData) {
      context.commit('editMeal', mealData)
    },
    deleteMeal(context, meal) {
      context.commit('deleteMeal', meal)
    },
  },
  getters: {
    database(state) {
      return state.database
    },
    meals(state) {
      return state.meals
    },
    filteredMeals(state) {
      return keyword =>
        state.meals.filter(({ title }) => title.includes(keyword))
    },
    meal(state) {
      return mealId => state.meals.find(({ id }) => id === mealId)
    },
  }
})

export default store
