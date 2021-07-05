<template>
  <ion-item :router-link="`/${path}/${item.id}`" color="secondary" lines="none">
    <ion-thumbnail slot="start">
      <ion-img :src="item.imageUrl" :alt="item.title" />
    </ion-thumbnail>
    <ion-label>{{ item.title }}</ion-label>
    <ion-buttons>
      <ion-button fill="clear" @click.prevent="editMeal(item.id)">
        <ion-icon slot="icon-only" :icon="pencil" />
      </ion-button>
      <ion-button fill="clear" @click.prevent="deleteMeal(item)">
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
  emits: ['edit-item', 'delete-meal'],
  props: {
    item: Object,
    path: String,
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
  data() {
    return {
      pencil,
      trash,
    }
  },
  methods: {
    editMeal(id) {
      this.$emit('edit-meal', id)
    },
    deleteMeal(meal) {
      this.$emit('delete-meal', meal)
    },
  },
}
</script>
<style scoped>
ion-button {
  width: 2.8rem;
  height: 2.8rem;
}
ion-icon {
  color: var(--ion-color-item);
}
ion-item {
  border-bottom: 0.01rem solid rgba(var(--ion-color-item-rgb), 0.5);
}
ion-item::part(inner) {
  border-color: var(--ion-color-contrast) !important;
}
</style>