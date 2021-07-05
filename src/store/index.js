import { createStore } from 'vuex'

const store = createStore({
  state() {
    return {
      meals: [
        {
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
        }
      ],
      recipes: [
        {
          id: 'm1',
          title: 'A trip to Lisbon',
          description: 'Very nice trip! Walked a lot!!!!',
          imageUrl:
            'https://viagemeturismo.abril.com.br/wp-content/uploads/2017/01/belem-tower-2809818_1920.jpg'
        },
        {
          id: 'm2',
          title: 'A visit to the garden',
          description: 'Always nice to feel mother nature!',
          imageUrl:
            'https://yachtdouro.pt/wp-content/uploads/2018/03/yachtdouro-sunset-900x600.jpg'
        },
        {
          id: 'm3',
          title: 'Good sunset view',
          description: 'So Beautiful!!',
          imageUrl:
            'https://www.guiadacidade.pt/assets/capas_poi/capa_21147.jpg'
        }
      ]
    }
  },
  mutations: {
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
    },
    addRecipe(state, recipe) {
      const newMeal = {
        id: new Date().toISOString(),
        ...recipe
      }

      state.meals.unshift(newMeal)
    },
    ediRecipe(state, recipeData) {
      const itemToEditIndex = state.recipes.findIndex(
        ({ id }) => id === recipeData.recipeId
      )
      state.recipes.splice(itemToEditIndex, 1, recipeData.meal)
    },
    deleteRecipe(state, recipeId) {
      const itemToDeleteIndex = state.recipes.findIndex(
        ({ id }) => id === recipeId
      )
      state.recipes.splice(itemToDeleteIndex, 1)
    }
  },
  actions: {
    addMeal(context, meal) {
      context.commit('addMeal', meal)
    },
    editMeal(context, mealData) {
      context.commit('editMeal', mealData)
    },
    deleteMeal(context, meal) {
      context.commit('deleteMeal', meal)
    },
    addRecipe(context, recipe) {
      context.commit('addRecipe', recipe)
    },
    editRecipe(context, recipeData) {
      context.commit('editRecipe', recipeData)
    },
    deleteRecipe(context, recipeId) {
      context.commit('deleteRecipe', recipeId)
    }
  },
  getters: {
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
    recipes(state) {
      return state.recipes
    },
    recipe(state) {
      return recipeId => state.recipes.find(({ id }) => id === recipeId)
    }
  }
})

export default store
