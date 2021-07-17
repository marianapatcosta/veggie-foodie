<template>
  <layout :screenTitle="meal?.title" pageDefaultBackLink="/tabs/meals">
    <div>
      <ion-img
        v-if="meal.imageUrl"
        :src="meal.imageUrl"
        :alt="meal.title"
      ></ion-img>
      <div v-else class="image-placeholder" />
      <ion-buttons>
        <ion-button
          class="icon-button--clear"
          fill="clear"
          @click.prevent="shareMeal(meal)"
        >
          <ion-icon slot="icon-only" :icon="shareSocial" />
        </ion-button>
        <ion-button
          class="icon-button--clear"
          fill="clear"
          @click.prevent="editMeal(meal)"
        >
          <ion-icon slot="icon-only" :icon="pencil" />
        </ion-button>
        <ion-button
          class="icon-button--clear"
          fill="clear"
          @click.prevent="deleteMeal(meal)"
        >
          <ion-icon slot="icon-only" :icon="trash" />
        </ion-button>
      </ion-buttons>
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
import { IonImg, IonButton, IonButtons, IonIcon } from '@ionic/vue'
import { pencil, trash, shareSocial } from 'ionicons/icons'
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Share } from '@capacitor/share'
import { useCrud } from '../composables/useCrud'
import { COLLECTIONS } from '../utils/constants'
export default {
  components: {
    IonImg,
    IonButton,
    IonButtons,
    IonIcon,
  },
  setup() {
    const route = useRoute()
    const { locale } = useI18n()
    const { getItem } = useCrud(COLLECTIONS.MEALS)

    const mealId = ref(route.params.id)
    const meal = ref(null)

    const dateOptions = ref({
      weekday: 'short',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    const language = computed(() => locale.value)

    const shareMeal = async meal => {
      console.log('share', meal)
      await Share.share({
        title: 'See cool stuff',
        text: meal.title,
        message: meal.title,
        url: meal.imageUrl,
        dialogTitle: 'Share with buddies',
      })
    }

    onMounted(async () => {
      const mealResponseData = await getItem(mealId.value)
      meal.value = mealResponseData
    })

    return {
      pencil,
      trash,
      shareSocial,
      mealId,
      meal,
      dateOptions,
      language,
      shareMeal,
    }
  },
}
</script>
<style scoped>
ion-buttons {
  margin: 0.5rem 0 1.5rem;
  justify-content: flex-end;
}
ion-icon {
  color: var(--ion-color-item);
}
.image-placeholder {
  background-color: var(--ion-color-primary);
  width: 100%;
  height: 13rem;
}
</style>