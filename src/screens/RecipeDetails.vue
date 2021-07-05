<template>
  <layout :screenTitle="recipe?.title" pageDefaultBackLink="/tabs/recipes">
    <h2 v-if="!recipe">Could not find a recipe for that id.</h2>
    <div
      v-else
    >
      <ion-img :src="recipe.imageUrl" :alt="recipe.title"></ion-img>
      <h2 class="ion-text-center">{{ recipe.title }}</h2>
      <p class="ion-text-center">{{ recipe.description }}</p>
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
      recipeId: this.$route.params.id,
    }
  },
  computed: {
    recipe() {
      return this.$store.getters.recipe(this.recipeId)
    },
  },
  /*  watch: {
    $route(currentRoute) {
      this.recipeId = currentRoute.params.id
    },
  } */
}
</script>