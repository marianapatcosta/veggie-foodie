<template>
  <div>
    <ion-img v-if="item.imageUrl" :src="item.imageUrl" :alt="item.title" />
    <div v-else class="image-placeholder" />
    <div class="recipe-actions">
      <ion-router-link class="ion-text-center" :href="item.source">
        {{ t('global.source') }}
      </ion-router-link>
      <ion-buttons>
        <ion-button
          v-if="
            isImageUrlAHttpUrl(item.source) || isImageUrlAHttpUrl(item.imageurl)
          "
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
    </div>
    <div class="details-body">
      <h2>{{ item.title }}</h2>
      <h4>{{ t('global.ingredients') }}</h4>
      <div class="recipe-body">{{ item.ingredients }}</div>
      <h4>{{ t('global.preparation') }}</h4>
      <div class="recipe-body">{{ item.preparation }}</div>
    </div>
  </div>
</template>

<script>
import {
  IonImg,
  IonButton,
  IonButtons,
  IonIcon,
  IonRouterLink,
} from '@ionic/vue'
import { pencil, trash, shareSocial } from 'ionicons/icons'
import { toRefs } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { Share } from '@capacitor/share'
import { useCrud } from '../composables/useCrud'
import { COLLECTIONS } from '../utils/constants'
import { isImageUrlAHttpUrl } from '../utils/utils'
export default {
  components: {
    IonImg,
    IonButton,
    IonButtons,
    IonIcon,
    IonRouterLink,
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
    const { t } = useI18n()
    const router = useRouter()
    const { deleteItem } = useCrud(COLLECTIONS[collection.value.toUpperCase()])

    const onShareItem = async item => {
      if (
        !isImageUrlAHttpUrl(item.imageurl) &&
        !isImageUrlAHttpUrl(item.source)
      )
        return
      try {
        await Share.share({
          title: t('global.shareTitle'),
          text: item.title,
          url: isImageUrlAHttpUrl(item.source) ? item.source : item.imageUrl,
          dialogTitle: '',
        })
      } catch (error) {
        console.error(error)
      }
    }
    const onEditItem = id => router.push(`/${props.collection}/edit/${id}`)

    const onDeleteItem = itemToDelete => {
      deleteItem(itemToDelete, () =>
        router.replace(`/tabs/${props.collection}`)
      )
    }

    return {
      t,
      pencil,
      trash,
      shareSocial,
      onShareItem,
      onEditItem,
      onDeleteItem,
      isImageUrlAHttpUrl,
      COLLECTIONS,
    }
  },
}
</script>
<style scoped>
ion-icon {
  color: var(--ion-color-item);
}
ion-router-link {
  margin-left: 0.5rem;
  --color: var(--ion-color-link);
  border-bottom: 0.0625rem solid var(--ion-color-link);
}
h4 {
  text-transform: capitalize;
}
.recipe-actions {
  margin: 0.5rem 0 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.recipe-body {
  margin-bottom: 1.5rem;
}
.image-placeholder {
  background-color: var(--ion-color-primary);
  width: 100%;
  height: 13rem;
}
.details-body {
  margin: 0 0.5rem;
  white-space: pre-line;
}
</style>