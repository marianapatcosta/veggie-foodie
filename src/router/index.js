import { createRouter, createWebHistory } from '@ionic/vue-router'
import Meals from '../screens/Meals.vue'
import Tabs from '../screens/Tabs.vue'

const routes = [
  {
    path: '/',
    redirect: '/tabs/meals'
  },
  {
    path: '/tabs/',
    component: Tabs,
    children: [
      {
        path: '',
        redirect: '/tabs/meals'
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
        path: 'user',
        name: 'user',
        component: () => import('../screens/UserProfile.vue')
      }
    ]
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
    name: 'recipes-meal',
    component: () => import('../screens/AddOrEditRecipe.vue')
  },
  {
    path: '/recipes/edit/:id',
    name: 'edit-recipe',
    component: () => import('../screens/AddOrEditMeal.vue')
  },
  { path: '/:pathMatch(.*)*', component: Meals }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
