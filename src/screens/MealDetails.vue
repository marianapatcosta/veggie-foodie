<template>
  <layout :screenTitle="meal?.title" pageDefaultBackLink="/tabs/meals">
    <!--   <ion-card v-if="!meal">{{ t('meals.notFound') }}</ion-card> -->
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
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { Share } from '@capacitor/share'
export default {
  components: {
    IonImg,
    IonButton,
    IonButtons,
    IonIcon,
  },
  setup() {
    const route = useRoute()
    const store = useStore()
    const { locale } = useI18n()

    const database = store.getters.database
    const mealId = ref(route.params.id)
    const meal = ref(
      null /* {
        id: 'm2',
        date: '2021-01-12T11:11:06.368Z',
        location: 'Porto, Portugal',
        title: 'A visit to the garden',
        description: 'Always nice to feel mother nature!',
        imageUrl:
          'https://yachtdouro.pt/wp-content/uploads/2018/03/yachtdouro-sunset-900x600.jpg',
      } */
    )

    const dateOptions = ref({
      weekday: 'short',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    const language = computed(() => locale.value)

    const fetchMeal = async () => {
      try {
        const statement = `SELECT * FROM meals WHERE id = ${mealId.value};`
        const response = await database.query(statement)
        meal.value = response.values[0]
      } catch (error) {
        console.error(error)
      }
    }
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

    onMounted(fetchMeal)

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