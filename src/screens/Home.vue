<template>
  <layout
    :screenTitle="
      t('global.hello', {
        username: userData?.fullName?.split(' ')[0] || 'Veggie Foodie',
      })
    "
    headerCurved
  >
    <template v-slot:header-right v-if="userData">
      <ion-thumbnail class="avatar">
        <ion-img :src="userData?.avatar" />
      </ion-thumbnail>
    </template>
    <div class="lists-wrapper">
      <ion-refresher slot="fixed" @ionRefresh="onRefresh">
        <ion-refresher-content />
      </ion-refresher>
      <latest-items-list
        :collection="COLLECTIONS.MEALS"
        :title="t('meals.myMeals')"
        :items="meals"
        :total="t('meals.mealsCount', { count: totalMealsCount })"
        :noData="t('meals.noMeals')"
        :onConfirmDeleteItem="fetchMeals"
      />
      <latest-items-list
        :collection="COLLECTIONS.RECIPES"
        :title="t('recipes.myRecipes')"
        :items="recipes"
        :total="t('recipes.recipesCount', { count: totalRecipesCount })"
        :noData="t('recipes.noRecipes')"
        :onConfirmDeleteItem="fetchRecipes"
      />
      <latest-items-list
        :collection="COLLECTIONS.PRODUCTS"
        :title="t('products.myProducts')"
        :items="products"
        :total="t('products.productsCount', { count: totalProductsCount })"
        :noData="t('products.noProducts')"
        :onConfirmDeleteItem="fetchProducts"
      />
    </div>
  </layout>
</template>

<script>
import {
  IonThumbnail,
  IonImg,
  IonRefresher,
  IonRefresherContent,
  onIonViewWillEnter,
} from '@ionic/vue'
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { LatestItemsList } from '../components'
import { useCrud } from '../composables/useCrud'
import { COLLECTIONS } from '../utils/constants'
import { showToast } from '../utils/utils'

export default {
  components: {
    IonThumbnail,
    IonImg,
    IonRefresher,
    IonRefresherContent,
    LatestItemsList,
  },
  setup() {
    const NUMBER_OF_ITEM_TO_LOAD = 3

    const { getLatestItems: getLLatestMeals } = useCrud(COLLECTIONS.MEALS)
    const { getLatestItems: getLLatestRecipes } = useCrud(COLLECTIONS.RECIPES)
    const { getLatestItems: getLLatestProducts } = useCrud(COLLECTIONS.PRODUCTS)
    const { t } = useI18n()

    const store = useStore()
    const userData = computed(() => store.getters.userData)
    const meals = ref([])
    const recipes = ref([])
    const products = ref([])
    const totalMealsCount = ref(0)
    const totalRecipesCount = ref(0)
    const totalProductsCount = ref(0)

    const onRefresh = async event => {
      await fetchItems()
      setTimeout(() => {
        event.target.complete()
      }, 1000)
    }

    const fetchItems = async () => {
      try {
        const [latestMeals, latestRecipes, latestProducts] = await Promise.all([
          getLLatestMeals(NUMBER_OF_ITEM_TO_LOAD),
          getLLatestRecipes(NUMBER_OF_ITEM_TO_LOAD),
          getLLatestProducts(NUMBER_OF_ITEM_TO_LOAD),
        ])
        meals.value = latestMeals?.items
        totalMealsCount.value = latestMeals.count
        recipes.value = latestRecipes?.items
        totalRecipesCount.value = latestRecipes.count
        products.value = latestProducts?.items
        totalProductsCount.value = latestProducts.count
      } catch (error) {
        showToast()
      }
    }

    const fetchMeals = async () => {
      try {
        const latestMeals = await getLLatestMeals(NUMBER_OF_ITEM_TO_LOAD)
        meals.value = latestMeals?.items
        totalMealsCount.value = latestMeals.count
      } catch (error) {
        showToast()
      }
    }

    const fetchRecipes = async () => {
      try {
        const latestRecipes = await getLLatestRecipes(NUMBER_OF_ITEM_TO_LOAD)
        recipes.value = latestRecipes?.items
        totalRecipesCount.value = latestRecipes.count
      } catch (error) {
        showToast()
      }
    }

    const fetchProducts = async () => {
      try {
        const latestProducts = await getLLatestProducts(NUMBER_OF_ITEM_TO_LOAD)
        products.value = latestProducts?.items
        totalProductsCount.value = latestProducts.count
      } catch (error) {
        showToast()
      }
    }
    onIonViewWillEnter(async () => {
      await fetchItems()
    })

    return {
      t,
      userData,
      meals,
      recipes,
      products,
      totalMealsCount,
      totalRecipesCount,
      totalProductsCount,
      COLLECTIONS,
      onRefresh,
      fetchMeals,
      fetchRecipes,
      fetchProducts
    }
  },
}
</script>
<style scoped>
.avatar {
  margin: 0.5rem 0 0.5rem auto;
  background: var(--ion-color-secondary);
  padding: 0.1rem;
  border-radius: 0.5rem;
  width: 3.2rem;
  height: 3.2rem;
}
.avatar ion-img {
  border-radius: 0.5rem;
}
.lists-wrapper {
  padding-top: 0.5rem;
}
</style>
