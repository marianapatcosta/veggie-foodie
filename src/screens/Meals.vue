<template>
  <layout :screenTitle="$t('meals.myMeals')">
    <div class="filter-options">
      <ion-searchbar
        color="secondary"
        v-model="keyword"
        :placeholder="$t('global.search')"
        @ionChange="fetchMeals"
        :style="{
          flex: 1,
        }"
      />
      <ion-item class="select-wrapper" lines="none">
        <ion-label :style="{ display: 'none' }">{{
          $t('global.orderBy')
        }}</ion-label>
        <ion-select
          :interface-options="customAlertOptions"
          :value="orderBy"
          :ok-text="$t('global.ok')"
          :cancel-text="$t('global.cancel')"
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
    <ion-card v-else>{{ $t('meals.noMeals') }}</ion-card>
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
  data() {
    return {
      add,
      swapVertical,
      meals: [
        /*   {
          id: 'm1',
          date: '2021-06-20T20:11:06.368Z',
          title: 'A trip to Lisbon',
          location: 'Lisbon, Portugal',
          description: 'Very nice trip! Walked a lot!!!!',
          imageUrl: '',
        },
        {
          id: 'm2',
          date: '2021-01-12T11:11:06.368Z',
          location: 'Porto, Portugal',
          title: 'A visit to the garden',
          description: 'Always nice to feel mother nature!',
          imageUrl:
            'https://yachtdouro.pt/wp-content/uploads/2018/03/yachtdouro-sunset-900x600.jpg',
        }, */
      ],
      keyword: '',
      database: this.$store.getters.database,
      isInfiniteScrollDisabled: false,
      numberOfMealsToLoad: 10,
      firstItemToFetch: 0,
      totalMealsCount: 0,
      customAlertOptions: { cssClass: 'app-alert list-alert' },
      orderBy: MEALS_ORDER_BY_DEFAULT,
      order: 'DESC',
    }
  },
  computed: {
    orderByOptions() {
      return getMealsOrderBy()
    },
  },
  methods: {
    async getSortSettings() {
      try {
        const storageKeys = ['meals-order', 'meals-order-by']
        const [{ value: order }, { value: orderBy }] = await Promise.all(
          storageKeys.map(
            async key =>
              await Storage.get({
                key,
              })
          )
        )
        this.order = order || ORDERS.DESC
        this.orderBy = orderBy || MEALS_ORDER_BY_DEFAULT
        await this.fetchMeals()
      } catch (error) {
        console.error(error)
      }
    },
    async updateOrder() {
      try {
        this.order = this.order === ORDERS.ASC ? ORDERS.DESC : ORDERS.ASC
        await Storage.set({
          key: 'meals-order',
          value: this.order,
        })
        await this.fetchMeals()
      } catch (error) {
        console.error(error)
      }
    },
    async updateOrderBy(event) {
      try {
        this.orderBy = event.target.value
        await Storage.set({
          key: 'meals-order-by',
          value: event.target.value,
        })
        await this.fetchMeals()
      } catch (error) {
        console.error(error)
      }
    },
    editMeal(id) {
      this.$router.push(`/meals/edit/${id}`)
    },
    onCancelDeleteMeal() {
      this.itemToDeleteId = ''
    },
    async onConfirmDeleteMeal(mealToDelete) {
      try {
        const statement = `DELETE FROM meals WHERE id = ${mealToDelete.id};`
        await this.database.query(statement)
        await this.fetchMeals()
        const toast = await toastController.create({
          message: this.$t('global.deleteSuccess', {
            item: this.$t('meals.meal'),
          }),
          duration: 2000,
          color: 'success',
        })
        return toast.present()
      } catch (error) {
        const toast = await toastController.create({
          message: this.$t('global.error'),
          duration: 2000,
          color: 'danger',
        })
        return toast.present()
      }
    },
    setOpen(state) {
      this.isOpenRef.value = state
    },
    async deleteMeal(mealToDelete) {
      try {
        const alert = await alertController.create({
          cssClass: 'app-alert',
          header: this.$t('global.delete'),
          message: this.$t('global.confirmDelete', {
            title: `<strong>${mealToDelete.title}</strong>`,
          }),
          buttons: [
            {
              text: this.$t('global.cancel'),
              role: 'cancel',
              cssClass: 'secondary',
              handler: this.onCancelDeleteMeal,
            },
            {
              text: this.$t('global.ok'),
              handler: () => this.onConfirmDeleteMeal(mealToDelete),
            },
          ],
        })
        return alert.present()
      } catch (error) {
        console.error(error)
      }
    },
    async fetchMeals() {
      try {
        const countStatement = this.keyword
          ? `SELECT COUNT(*) FROM meals WHERE title LIKE "%${this.keyword}%";`
          : `SELECT COUNT(*) FROM meals;`
        const statement = this.keyword
          ? `SELECT * FROM meals WHERE title LIKE "%${this.keyword}%" ORDER BY ${this.orderBy} ${this.order} LIMIT ${this.numberOfMealsToLoad};`
          : `SELECT * FROM meals ORDER BY ${this.orderBy} ${this.order} LIMIT ${this.numberOfMealsToLoad};`
        const [responseCount, responseMeals] = await Promise.all(
          [countStatement, statement].map(
            async query => await this.database.query(query)
          )
        )
        this.meals = responseMeals.values
        this.totalMealsCount = responseCount.values[0]['COUNT(*)']
        console.log(777, responseMeals.values, this.isInfiniteScrollDisabled)
      } catch (error) {
        console.error(error)
      }
    },
    async loadMoreMeals() {
      try {
        this.firstItemToFetch += this.numberOfMealsToLoad
        const statement = this.keyword
          ? `SELECT * FROM meals WHERE title LIKE "%${this.keyword}%" ORDER BY ${this.orderBy} ${this.order} LIMIT ${this.numberOfMealsToLoad} OFFSET ${this.firstItemToFetch};`
          : `SELECT * FROM meals ORDER BY ${this.orderBy} ${this.order} LIMIT ${this.numberOfMealsToLoad} OFFSET ${this.firstItemToFetch};`
        const response = await this.database.query(statement)
        this.meals = [...this.meals, ...response.values]

        if (this.meals.length >= this.totalMealsCount) {
          this.isInfiniteScrollDisabled = true
        }
      } catch (error) {
        console.error(error)
      }
    },
  },
  watch: {
    $route() {
      this.firstItemToFetch = 0
      this.isInfiniteScrollDisabled = false
      this.fetchMeals()
    },
  },
  mounted() {
    this.getSortSettings()
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