<template>
  <layout :screenTitle="t('recipes.myRecipes')">
    <list collection="recipes" :noData="t('recipes.noRecipes')" />
    <template v-slot:fab-button>
      <ion-fab-button :router-link="`/recipes/add`" color="secondary">
        <ion-icon :icon="add" />
      </ion-fab-button>
    </template>
  </layout>
</template>

<script>
import { IonFabButton, IonIcon } from '@ionic/vue'
import { useI18n } from 'vue-i18n'
import { add } from 'ionicons/icons'
import { List } from '../components'
export default {
  components: {
    IonFabButton,
    IonIcon,
    List,
  },
  setup() {
    const { t } = useI18n()
    return { t, add }
  },
}
</script>
