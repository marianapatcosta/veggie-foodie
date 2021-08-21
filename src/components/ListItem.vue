<template>
  <ion-item :router-link="`/${path}/${item.id}`" color="secondary" lines="none">
    <ion-thumbnail slot="start">
      <ion-img
        v-if="item.imageUrl"
        :src="convertFilePathToHttp(item.imageUrl)"
        :alt="item.title"
      />
      <image-placeholder v-else isSmall />
    </ion-thumbnail>
    <ion-label>{{ item.title }}</ion-label>
    <ion-buttons v-if="showActionButtons">
      <ion-button
        class="icon-button--clear"
        fill="clear"
        @click.prevent="onShareItem(item, isOffline)"
      >
        <ion-icon slot="icon-only" :icon="shareSocial" />
      </ion-button>
      <ion-button
        class="icon-button--clear"
        fill="clear"
        @click.prevent="onDeleteItem(item)"
      >
        <ion-icon slot="icon-only" :icon="trash" />
      </ion-button>
    </ion-buttons>
  </ion-item>
</template>

<script>
import {
  IonItem,
  IonImg,
  IonThumbnail,
  IonLabel,
  IonButton,
  IonButtons,
  IonIcon,
} from '@ionic/vue'
import { shareSocial, trash } from 'ionicons/icons'
import { computed } from 'vue'
import { useStore } from 'vuex'
import ImagePlaceholder from './ImagePlaceholder.vue'
import { convertFilePathToHttp } from '../utils/utils'
export default {
  emits: ['share-item', 'delete-item'],
  props: {
    item: { type: Object, required: true },
    path: { type: String, required: true },
    showActionButtons: { type: Boolean, default: true },
  },
  components: {
    IonItem,
    IonImg,
    IonThumbnail,
    IonLabel,
    IonButton,
    IonButtons,
    IonIcon,
    ImagePlaceholder,
  },
  setup(_, context) {
    const store = useStore()
    const isOffline = computed(() => store.getters.isOffline)
    const onShareItem = (item, isOffline) => {
      context.emit('share-item', item, isOffline)
    }
    const onDeleteItem = item => {
      context.emit('delete-item', item)
    }

    return {
      shareSocial,
      trash,
      isOffline,
      onShareItem,
      onDeleteItem,
      convertFilePathToHttp,
    }
  },
}
</script>
<style scoped>
ion-icon {
  color: var(--ion-color-item);
}
ion-item {
  border-bottom: 0.01rem solid rgba(var(--ion-color-item-rgb), 0.5);
}
ion-item::part(inner) {
  border-color: var(--ion-color-contrast) !important;
}
ion-label {
  padding-left: 8px;
}
ion-thumbnail {
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2),
    0 1px 5px 0 rgba(0, 0, 0, 0.12);
}
</style>