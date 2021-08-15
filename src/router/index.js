import { createRouter, createWebHistory } from '@ionic/vue-router'
import { Storage } from '@capacitor/storage'
import Home from '../screens/Home.vue'
import Tabs from '../screens/Tabs.vue'

const routes = [
  {
    path: '/',
    beforeEnter: async (to, from, next) => {
      const { value: alreadyLaunched } = await Storage.get({
        key: 'alreadyLaunched'
      })

      if (!alreadyLaunched) {
        await Storage.set({
          key: 'alreadyLaunched',
          value: true
        })
      }

      next({ name: alreadyLaunched ? 'home' : 'authenticate' })
    }
  },
  {
    path: '/tabs/',
    component: Tabs,
    children: [
      {
        path: '',
        redirect: '/tabs/home'
      },
      {
        path: 'home',
        name: 'home',
        component: () => import('../screens/Home.vue')
      },
      {
        path: 'meals',
        name: 'meals',
        component: () => import('../screens/Meals.vue')
      },
      {
        path: 'recipes',
        name: 'recipes',
        component: () => import('../screens/Recipes.vue')
      },
      {
        path: 'products',
        name: 'products',
        component: () => import('../screens/Products.vue')
      },
      {
        path: 'user',
        name: 'user',
        component: () => import('../screens/UserPreferences.vue')
      }
    ]
  },
  {
    path: '/authenticate',
    name: 'authenticate',
    component: () => import('../screens/Authenticate.vue')
  },
  {
    path: '/meals/:id',
    component: () => import('../screens/MealDetails.vue')
  },
  {
    path: '/meals/add',
    name: 'add-meal',
    component: () => import('../screens/AddOrEditMeal.vue')
  },
  {
    path: '/meals/edit/:id',
    name: 'edit-meal',
    component: () => import('../screens/AddOrEditMeal.vue')
  },
  {
    path: '/recipes/:id',
    name: 'recipe-details',
    component: () => import('../screens/RecipeDetails.vue')
  },
  {
    path: '/recipes/add',
    name: 'add-recipe',
    component: () => import('../screens/AddOrEditRecipe.vue')
  },
  {
    path: '/recipes/edit/:id',
    name: 'edit-recipe',
    component: () => import('../screens/AddOrEditRecipe.vue')
  },
  {
    path: '/products/:id',
    name: 'product-details',
    component: () => import('../screens/ProductDetails.vue')
  },
  {
    path: '/products/add',
    name: 'add-product',
    component: () => import('../screens/AddOrEditProduct.vue')
  },
  {
    path: '/products/edit/:id',
    name: 'edit-product',
    component: () => import('../screens/AddOrEditProduct.vue')
  },
  { path: '/:pathMatch(.*)*', component: Home }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
