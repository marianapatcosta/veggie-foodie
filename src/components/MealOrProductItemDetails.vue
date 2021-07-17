<template>
  <div>
    <ion-img v-if="item.imageUrl" :src="item.imageUrl" :alt="item.title" />
    <div v-else class="image-placeholder" />
    <ion-buttons>
      <ion-button
        class="icon-button--clear"
        fill="clear"
        @click.prevent="onShareItem(item)"
      >
        <ion-icon slot="icon-only" :icon="shareSocial" />
      </ion-button>
      <ion-button
        class="icon-button--clear"
        fill="clear"
        @click.prevent="onEditItem(item.id)"
      >
        <ion-icon slot="icon-only" :icon="pencil" />
      </ion-button>
      <ion-button
        class="icon-button--clear"
        fill="clear"
        @click.prevent="onDeleteItem(item)"
      >
        <ion-icon slot="icon-only" :icon="trash" />
      </ion-button>
    </ion-buttons>
    <div class="details-body">
      <h2 class="ion-text-center">{{ item.title }}</h2>
      <p class="ion-text-center">
        {{ collection === COLLECTIONS.MEALS ? item.location : item.store }} -
        {{ new Date(item.date).toLocaleString(language, dateOptions) }}
      </p>
      <p class="ion-text-center">{{ item.description }}</p>
    </div>
  </div>
</template>

<script>
import { IonImg, IonButton, IonButtons, IonIcon } from '@ionic/vue'
import { pencil, trash, shareSocial } from 'ionicons/icons'
import { ref, toRefs, computed } from 'vue'
import { useRouter } from 'vue-router'
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
  props: {
    collection: {
      type: String,
      required: true,
    },
    item: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const { collection } = toRefs(props)
    const router = useRouter()
    const { locale } = useI18n()
    const { deleteItem } = useCrud(COLLECTIONS[collection.value.toUpperCase()])

    const dateOptions = ref({
      weekday: 'short',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    const language = computed(() => locale.value)

    const onShareItem = async item => {
      console.log('share', item)
      await Share.share({
        title: 'See cool stuff',
        text: item.title,
        message: item.title,
        url: item.imageUrl,
        dialogTitle: 'Share with buddies',
      })
    }
    const onEditItem = id => router.push(`/${props.collection}/edit/${id}`)

    const onDeleteItem = itemToDelete => {
      deleteItem(itemToDelete, () =>
        router.replace(`/tabs/${props.collection}`)
      )
    }

    return {
      pencil,
      trash,
      shareSocial,
      dateOptions,
      language,
      onShareItem,
      onEditItem,
      onDeleteItem,
      COLLECTIONS,
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
.details-body {
  margin: 0 0.5rem;
}
</style>