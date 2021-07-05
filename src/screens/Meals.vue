<template>
  <layout :screenTitle="$t('meals.myMeals')">
    <ion-list v-if="!!meals.length" class="ion-padding">
      <ion-searchbar
        color="primary"
        v-model="keyword"
        :placeholder="$t('global.search')"
        @ionChange="searchMeals"
      />
      <list-item
        v-for="meal in meals"
        :key="meal.id"
        :item="meal"
        path="meals"
        @edit-meal="editMeal"
        @delete-meal="deleteMeal"
      />
    </ion-list>
    <ion-card v-else>{{$t('meals.noMeals')}}</ion-card>
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
  alertController,
} from '@ionic/vue'
import { add } from 'ionicons/icons'
import { ListItem } from '../components'
export default {
  components: {
    ListItem,
    IonList,
    IonFabButton,
    IonIcon,
    IonSearchbar,
    IonCard,
  },
  data() {
    return {
      add,
      keyword: '',
      filteredMeals: null,
    }
  },
  computed: {
    meals() {
      return this.filteredMeals || this.$store.getters.meals
    },
  },
  methods: {
    editMeal(id) {
      this.$router.push(`/meals/edit/${id}`)
    },
    onCancelDeleteMeal() {
      this.itemToDeleteId = ''
    },
    onConfirmDeleteMeal(mealToDelete) {
      this.$store.dispatch('deleteMeal', mealToDelete.id)
    },
    setOpen(state) {
      this.isOpenRef.value = state
    },
    async deleteMeal(mealToDelete) {
      const alert = await alertController.create({
        cssClass: 'app-alert',
        header: 'Delete meal?',
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
    },
    searchMeals() {
      this.filteredMeals = this.$store.getters.filteredMeals(this.keyword)
    },
  },
}
</script>
<style scoped>
ion-list {
  background: var(--ion-color-secondary);
}
</style>