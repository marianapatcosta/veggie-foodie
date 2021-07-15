<template>
  <layout :screenTitle="t('meals.myMeals')">
    <div class="filter-options">
      <ion-searchbar
        color="secondary"
        v-model="keyword"
        :placeholder="t('global.search')"
        @ionChange="fetchMeals"
        :style="{
          flex: 1,
        }"
      />
      <ion-item class="select-wrapper" lines="none">
        <ion-label :style="{ display: 'none' }">{{
          t('global.orderBy')
        }}</ion-label>
        <ion-select
          :interface-options="customAlertOptions"
          :value="orderBy"
          :ok-text="t('global.ok')"
          :cancel-text="t('global.cancel')"
          @ionChange="updateOrderBy"
        >
          <ion-select-option
            v-for="option in orderByOptions"
            :key="`language-${option.value}`"
            :value="option.value"
            >{{ option.label }}</ion-select-option
          >
        </ion-select>
      </ion-item>
      <ion-buttons>
        <ion-button
          class="icon-button--clear"
          fill="clear"
          @click.prevent="updateOrder"
        >
          <ion-icon
            :style="{ color: 'var(--ion-color-item)' }"
            :icon="swapVertical"
            slot="icon-only"
          />
        </ion-button>
      </ion-buttons>
    </div>
    <div class="ion-padding" v-if="!!meals?.length">
      <ion-list>
        <ion-refresher slot="fixed" @ionRefresh="fetchMeals">
          <ion-refresher-content />
        </ion-refresher>
        <list-item
          v-for="meal in meals"
          :key="meal.id"
          :item="meal"
          path="meals"
          @edit-meal="editMeal"
          @delete-meal="deleteMeal"
        />
      </ion-list>
      <ion-infinite-scroll
        @ionInfinite="loadMoreMeals"
        threshold="100px"
        :disabled="isInfiniteScrollDisabled"
      >
        <ion-infinite-scroll-content loading-spinner="bubbles">
        </ion-infinite-scroll-content>
      </ion-infinite-scroll>
    </div>
    <ion-card v-else>{{ t('meals.noMeals') }}</ion-card>
    <template v-slot:fab-button>
      <ion-fab-button router-link="/meals/add" color="secondary">
        <ion-icon :icon="add" />
      </ion-fab-button>
    </template>
  </layout>
</template>

<script>
import {
  IonList,
  IonFabButton,
  IonIcon,
  IonSearchbar,
  IonCard,
  IonRefresher,
  IonRefresherContent,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonSelect,
  IonSelectOption,
  IonItem,
  IonLabel,
  IonButton,
  IonButtons,
  alertController,
  toastController,
} from '@ionic/vue'
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { Storage } from '@capacitor/storage'
import { add, swapVertical } from 'ionicons/icons'
import { ListItem } from '../components'
import {
  getMealsOrderBy,
  MEALS_ORDER_BY_DEFAULT,
  ORDERS,
} from '../utils/constants'
export default {
  components: {
    ListItem,
    IonList,
    IonFabButton,
    IonIcon,
    IonSearchbar,
    IonCard,
    IonRefresher,
    IonRefresherContent,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonSelect,
    IonSelectOption,
    IonItem,
    IonLabel,
    IonButton,
    IonButtons,
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const store = useStore()
    const { t } = useI18n()
    const database = store.getters.database

    const meals = ref([
    
    ])
    const keyword = ref('')
    const isInfiniteScrollDisabled = ref(false)
    const numberOfMealsToLoad = ref(10)
    const firstItemToFetch = ref(0)
    const totalMealsCount = ref(0)
    const customAlertOptions = ref({ cssClass: 'app-alert list-alert' })
    const orderBy = ref(MEALS_ORDER_BY_DEFAULT)
    const order = ref(ORDERS.DESC)

    const orderByOptions = computed(getMealsOrderBy)

    watch(route, () => {
      firstItemToFetch.value = 0
      isInfiniteScrollDisabled.value = false
      fetchMeals()
    })

    const getSortSettings = async () => {
      try {
        const storageKeys = ['meals-order', 'meals-order-by']
        const [{ value: orderValue }, { value: orderByValue }] = await Promise.all(
          storageKeys.map(
            async key =>
              await Storage.get({
                key,
              })
          )
        )
        order.value = orderValue || ORDERS.DESC
        orderBy.value = orderByValue || MEALS_ORDER_BY_DEFAULT
      } catch (error) {
        console.error(error)
      }
    }
    const updateOrder = async () => {
      try {
        order.value = order.value === ORDERS.ASC ? ORDERS.DESC : ORDERS.ASC
        await Storage.set({
          key: 'meals-order',
          value: order.value,
        })
        await fetchMeals()
      } catch (error) {
        console.error(error)
      }
    }

    const updateOrderBy = async event => {
      try {
        orderBy.value = event.target.value
        await Storage.set({
          key: 'meals-order-by',
          value: event.target.value,
        })
        await fetchMeals()
      } catch (error) {
        console.error(error)
      }
    }
    const editMeal = id => {
      router.push(`/meals/edit/${id}`)
    }

    const onConfirmDeleteMeal = async mealToDelete => {
      try {
        const statement = `DELETE FROM meals WHERE id = ${mealToDelete.id};`
        await database.query(statement)
        await fetchMeals()
        const toast = await toastController.create({
          message: t('global.deleteSuccess', {
            item: t('meals.meal'),
          }),
          duration: 2000,
          color: 'success',
        })
        return toast.present()
      } catch (error) {
        const toast = await toastController.create({
          message: t('global.error'),
          duration: 2000,
          color: 'danger',
        })
        return toast.present()
      }
    }

    const deleteMeal = async mealToDelete => {
      try {
        const alert = await alertController.create({
          cssClass: 'app-alert',
          header: t('global.delete'),
          message: t('global.confirmDelete', {
            title: `<strong>${mealToDelete.title}</strong>`,
          }),
          buttons: [
            {
              text: t('global.cancel'),
              role: 'cancel',
              cssClass: 'secondary'
            },
            {
              text: t('global.ok'),
              handler: () => onConfirmDeleteMeal(mealToDelete),
            },
          ],
        })
        return alert.present()
      } catch (error) {
        console.error(error)
      }
    }

    const fetchMeals = async () => {
      try {
        const countStatement = keyword.value
          ? `SELECT COUNT(*) FROM meals WHERE title LIKE "%${keyword.value}%";`
          : `SELECT COUNT(*) FROM meals;`
        const statement = keyword.value
          ? `SELECT * FROM meals WHERE title LIKE "%${keyword.value}%" ORDER BY ${orderBy.value} ${order.value} LIMIT ${numberOfMealsToLoad.value};`
          : `SELECT * FROM meals ORDER BY ${orderBy.value} ${order.value} LIMIT ${numberOfMealsToLoad.value};`
        const [responseCount, responseMeals] = await Promise.all(
          [countStatement, statement].map(
            async query => await database.query(query)
          )
        )
        meals.value = responseMeals.values
        totalMealsCount.value = responseCount.values[0]['COUNT(*)']
      } catch (error) {
        console.error(error)
      }
    }

    const loadMoreMeals = async () => {
      try {
        firstItemToFetch.value += numberOfMealsToLoad.value
        const statement = keyword.value
          ? `SELECT * FROM meals WHERE title LIKE "%${keyword.value}%" ORDER BY ${orderBy.value} ${order.value} LIMIT ${numberOfMealsToLoad.value} OFFSET ${firstItemToFetch.value};`
          : `SELECT * FROM meals ORDER BY ${orderBy.value} ${order.value} LIMIT ${numberOfMealsToLoad.value} OFFSET ${firstItemToFetch.value};`
        const response = await database.query(statement)
        meals.value = [...meals.value, ...response.values]

        if (meals.value.length >= totalMealsCount.value) {
          isInfiniteScrollDisabled.value = true
        }
      } catch (error) {
        console.error(error)
      }
    }

    onMounted(async () => {
      await getSortSettings()
      await fetchMeals()
    })
    return {
      t,
      add,
      swapVertical,
      meals,
      keyword,
      isInfiniteScrollDisabled,
      numberOfMealsToLoad,
      firstItemToFetch,
      totalMealsCount,
      customAlertOptions,
      orderBy,
      order,
      orderByOptions,
      updateOrder,
      updateOrderBy,
      editMeal,
      deleteMeal,
      loadMoreMeals,
      fetchMeals
    }
  },
}
</script>
<style >
.filter-options {
  display: flex;
  align-items: center;
  margin: 1rem;
  margin-bottom: 0.5rem;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2),
    0 1px 5px 0 rgba(0, 0, 0, 0.12);
}
.list-alert .alert-message {
  display: none;
}
.select-wrapper {
  --background: var(--ion-color-secondary);
}
.in-item {
  max-width: 100% !important;
}
</style>