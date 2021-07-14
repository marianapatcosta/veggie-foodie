<template>
<ion-page>
  <ion-tabs ref="tabs" @ionTabsDidChange="setCurrentTab()">
    
    <ion-tab-bar slot="bottom">
      <ion-tab-button
        v-for="route in routes"
        :key="`route-${route.name}`"
        :tab="route.name"
        :href="`/tabs/${route.name}`"
      >
        <ion-icon
          :icon="route.name === selectedTab ? route.icon : route.iconOutline"
        ></ion-icon>
      </ion-tab-button>
    </ion-tab-bar>
  </ion-tabs>
  </ion-page>
</template>

<script>
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonPage } from '@ionic/vue'
import {
  cart,
  cartOutline,
  receipt,
  receiptOutline,
  restaurant,
  restaurantOutline,
  settings,
  settingsOutline
} from 'ionicons/icons'
export default {
  components: {
    IonTabs,
    IonTabBar,
    IonTabButton,
    IonIcon,
    IonPage
  },
  data() {
    return {
      routes: [
        { name: 'meals', icon: restaurant, iconOutline: restaurantOutline },
        { name: 'recipes', icon: receipt, iconOutline: receiptOutline },
        { name: 'products', icon: cart, iconOutline: cartOutline },
        { name: 'user', icon: settings, iconOutline: settingsOutline },
      ],
      selectedTab: undefined,
    }
  },
  computed: {
    meals() {
      return this.$store.getters.meals
    },
  },
  methods: {
    setCurrentTab() {
      this.selectedTab = this.$route.name
      /* this.selectedTab = this.$refs.tabs.getSelected() */
    },
  },
}
</script>
<style scoped>
ion-tab-bar,
ion-tab-button {
  background: var(--ion-color-primary);
}

ion-tab-button ion-icon {
  color: var(--ion-color-primary-contrast);
}
</style>