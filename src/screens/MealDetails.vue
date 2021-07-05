<template>
  <layout :screenTitle="meal?.title" pageDefaultBackLink="/tabs/meals">
    <h2 v-if="!meal">Could not find a meal for that id.</h2>
    <div v-else>
      <ion-img :src="meal.imageUrl" :alt="meal.title"></ion-img>
      <h2 class="ion-text-center">{{ meal.title }}</h2>
      <p class="ion-text-center">
        {{ meal.location }} -
        {{ new Date(meal.date).toLocaleString(language, dateOptions) }}
      </p>
      <p class="ion-text-center">{{ meal.description }}</p>
    </div>
  </layout>
</template>

<script>
import { IonImg } from '@ionic/vue'
export default {
  components: {
    IonImg,
  },
  data() {
    return {
      mealId: this.$route.params.id,
      dateOptions: {
        weekday: 'short',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      },
    }
  },
  computed: {
    meal() {
      return this.$store.getters.meal(this.mealId)
    },
    language() {
      return this.$i18n.locale
    },
  },
  /*  watch: {
    $route(currentRoute) {
      this.mealId = currentRoute.params.id
    },
  } */
}
</script>