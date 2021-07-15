<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-row>
          <ion-col class="ion-align-self-center" size="1" v-if="pageDefaultBackLink">
            <ion-buttons>
              <ion-back-button :default-href="pageDefaultBackLink" text="" />
            </ion-buttons>
          </ion-col>
          <ion-col class="ion-align-self-center" push>
            <h2 class="title">
              {{ screenTitle }}
            </h2>
          </ion-col>

          <ion-col size="3">
            <ion-fab horizontal="end">
              <slot name="fab-button" />
            </ion-fab>
          </ion-col>
        </ion-row>
      </ion-toolbar>
    </ion-header>
    <ion-content color="secondary" :fullscreen="false">
      <slot />
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonContent,
  IonBackButton,
  IonButtons,
  IonFab,
  IonCol,
  IonRow,
} from '@ionic/vue'

export default {
  props: {
    screenTitle: String,
    pageDefaultBackLink: String,
  },

  components: {
    IonPage, // wrapps a page (a component loaded through router) to ensure that ionic can load the page qith animations and transitions)
    IonHeader,
    IonToolbar,
    IonContent,
    IonBackButton,
    IonButtons,
    IonFab,
    IonCol,
    IonRow,
  },
}
</script>
<style scoped>
ion-toolbar {
  --background: var(--ion-color-primary);
}
ion-icon {
  color: var(--ion-color-primary);
}
ion-button {
  font-weight: 700;
}
.title {
  padding-left: 1rem;
}
</style>