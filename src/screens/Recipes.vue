<template>
  <layout :screenTitle="$t('recipes.myRecipes')" pageDefaultBackLink="/meals">
    <ion-list>
      <list-item
        v-for="recipe in recipes"
        :key="recipe.id"
        :item="recipe"
        path="recipes"
      />
    </ion-list>
    <template v-slot:fab-button>
      <ion-fab-button router-link="/recipes/add" color="tertiary">
        <ion-icon :icon="add" />
      </ion-fab-button>
    </template>
  </layout>
</template>

<script>
import { IonList, IonFabButton, IonIcon } from '@ionic/vue'
import { add } from 'ionicons/icons'
import { ListItem } from '../components'
export default {
  components: {
    ListItem,
    IonList,
    IonFabButton,
    IonIcon,
  },
  data() {
    return { add }
  },
  computed: {
    recipes() {
      return this.$store.getters.recipes
    },
  },
}
</script>
<style scoped>
ion-list {
  background: var(--ion-color-secondary);
}
</style>