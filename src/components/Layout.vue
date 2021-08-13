<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar :class="{ 'header-curved': headerCurved }">
        <ion-row>
          <ion-col
            class="ion-align-self-center"
            size="1"
            v-if="pageDefaultBackLink"
          >
            <ion-buttons>
              <ion-back-button :default-href="pageDefaultBackLink" text="" />
            </ion-buttons>
          </ion-col>
          <ion-col class="ion-align-self-center" push>
            <h2 class="title">
              {{ screenTitle }}
            </h2>
          </ion-col>

          <ion-col size="3" class="fab-column">
            <ion-fab horizontal="end" >
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
    headerCurved: { type: Boolean, default: false },
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
ion-header {
  background: var(--ion-color-secondary);
}
ion-header::after {
  background: none;
}

ion-toolbar {
  --background: var(--ion-color-primary);
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2),
    0 1px 5px 0 rgba(0, 0, 0, 0.12);
}
ion-icon {
  color: var(--ion-color-primary);
}
ion-button {
  font-weight: 700;
}
.header-curved {
  border-bottom-right-radius: 1.25rem;
  border-bottom-left-radius: 1.25rem;
}
.title {
  padding-left: 1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.fab-column {
  display: flex;
  align-items: center;
}
</style>