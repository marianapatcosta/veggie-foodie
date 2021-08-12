<template>
  <ion-fab-button :router-link="link" color="secondary">
    <ion-icon :icon="add" />
  </ion-fab-button>
</template>

<script>
import { IonFabButton, IonIcon } from '@ionic/vue'
import { add } from 'ionicons/icons'

export default {
  emits: ['edit-item', 'delete-item', 'share-item'],
  props: {
    link: {
      type: String,
      required: true,
    },
  },
  components: {
    IonFabButton,
    IonIcon,
  },
  setup() {
    return {
      add,
    }
  },
}
</script>