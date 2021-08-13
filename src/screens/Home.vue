<template>
  <layout
    :screenTitle="t('global.hello', { username: 'Veggie Foodie' })"
    headerCurved
  >
    <div class="lists-wrapper">
      <ion-refresher slot="fixed" @ionRefresh="onRefresh">
        <ion-refresher-content />
      </ion-refresher>
      <latest-items-list
        :collection="COLLECTIONS.MEALS"
        :title="t('meals.myMeals')"
        :items="meals"
        :total="`${totalMealsCount} ${t('meals.meals')}`"
        :noData="t('meals.noMeals')"
      />
      <latest-items-list
        :collection="COLLECTIONS.RECIPES"
        :title="t('recipes.myRecipes')"
        :items="recipes"
        :total="`${totalRecipesCount} ${t('recipes.recipes')}`"
        :noData="t('recipes.noRecipes')"
      />
      <latest-items-list
        :collection="COLLECTIONS.PRODUCTS"
        :title="t('products.myProducts')"
        :items="products"
        :total="`${totalProductsCount} ${t('products.products')}`"
        :noData="t('products.noProducts')"
      />
    </div>
  </layout>
</template>

<script>
import { IonRefresher, IonRefresherContent } from '@ionic/vue'
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { LatestItemsList } from '../components'
import { useCrud } from '../composables/useCrud'
import { COLLECTIONS } from '../utils/constants'
import { showToast } from '../utils/utils'
export default {
  components: {
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
    onMounted(async () => {
      await fetchItems()
    })
    return {
      t,
      meals,
      recipes,
      products,
      totalMealsCount,
      totalRecipesCount,
      totalProductsCount,
      COLLECTIONS,
      onRefresh,
    }
  },
}
</script>
<style scoped>
.lists-wrapper {
  padding-top: 0.5rem;
}
</style>
