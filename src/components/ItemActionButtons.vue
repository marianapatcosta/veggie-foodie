<template>
  <ion-buttons>
    <ion-button
      v-if="showShareButton"
      class="icon-button--clear"
      fill="clear"
      @click.prevent="onShareItem"
    >
      <ion-icon slot="icon-only" :icon="shareSocial" />
    </ion-button>
    <ion-button
      class="icon-button--clear"
      fill="clear"
      @click.prevent="onEditItem"
    >
      <ion-icon slot="icon-only" :icon="pencil" />
    </ion-button>
    <ion-button
      class="icon-button--clear"
      fill="clear"
      @click.prevent="onDeleteItem"
    >
      <ion-icon slot="icon-only" :icon="trash" />
    </ion-button>
  </ion-buttons>
</template>

<script>
import { IonButton, IonButtons, IonIcon } from '@ionic/vue'
import { pencil, trash, shareSocial } from 'ionicons/icons'

export default {
  emits: ['edit-item', 'delete-item', 'share-item'],
  props: {
    showShareButton: {
      type: Boolean,
      default: true,
    },
  },
  components: {
    IonButton,
    IonButtons,
    IonIcon,
  },
  setup(_, context) {
    const onEditItem = () => {
      context.emit('edit-item')
    }
    const onDeleteItem = () => {
      context.emit('delete-item')
    }

    const onShareItem = () => {
      context.emit('share-item')
    }

    return {
      pencil,
      trash,
      shareSocial,
      onEditItem,
      onDeleteItem,
      onShareItem,
    }
  },
}
</script>
<style scoped>
ion-buttons {
  position: absolute;
  bottom: 0;
  right: 0;
  display: flex;
  flex-direction: column;
}
ion-icon {
  color: var(--ion-color-item);
}
</style>