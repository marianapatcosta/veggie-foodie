<template>
  <ion-item :router-link="`/${path}/${item.id}`" color="secondary" lines="none">
    <ion-thumbnail slot="start">
      <ion-img v-if="item.imageUrl" :src="item.imageUrl" :alt="item.title" />
      <div v-else class="image-placeholder" />
    </ion-thumbnail>
    <ion-label>{{ item.title }}</ion-label>
    <ion-buttons>
      <ion-button
        class="icon-button--clear"
        fill="clear"
        @click.prevent="editMeal(item.id)"
      >
        <ion-icon slot="icon-only" :icon="pencil" />
      </ion-button>
      <ion-button
        class="icon-button--clear"
        fill="clear"
        @click.prevent="deleteMeal(item)"
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
import { pencil, trash } from 'ionicons/icons'
export default {
  emits: ['edit-item', 'delete-item'],
  props: {
    item: { type: Object, required: true },
    path: { type: String, required: true },
  },
  components: {
    IonItem,
    IonImg,
    IonThumbnail,
    IonLabel,
    IonButton,
    IonButtons,
    IonIcon,
  },
  setup(_, context) {
    const editMeal = id => {
      context.emit('edit-item', id)
    }
    const deleteMeal = meal => {
      context.emit('delete-item', meal)
    }
    return {
      pencil,
      trash,
      editMeal,
      deleteMeal,
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
.image-placeholder {
  background-color: var(--ion-color-primary);
  height: 100%;
}
</style>