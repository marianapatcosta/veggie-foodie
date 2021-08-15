<template>
  <ion-fab horizontal="end">
    <ion-fab-button :router-link="link" color="secondary">
      <ion-icon :icon="add" />
    </ion-fab-button>
  </ion-fab>
</template>

<script>
import { IonFab, IonFabButton, IonIcon } from '@ionic/vue'
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
    IonFab,
  },
  setup() {
    return {
      add,
    }
  },
}
</script>
<style scoped>
ion-fab-button {
  --box-shadow: 0 0.2rem var(--ion-color-primary-shade);
  width: 3rem;
  height: 3rem;
}

ion-fab-button:active {
  --box-shadow: 0 0.1rem var(--ion-color-primary-shade);
  transform: translateY(0.1rem);
}

ion-fab-button ion-icon {
  color: var(--ion-color-item);
}
</style>