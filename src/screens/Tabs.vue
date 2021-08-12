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
          />
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
  home,
  homeOutline,
  receipt,
  receiptOutline,
  restaurant,
  restaurantOutline,
  settings,
  settingsOutline,
} from 'ionicons/icons'
export default {
  components: {
    IonTabs,
    IonTabBar,
    IonTabButton,
    IonIcon,
    IonPage,
  },
  data() {
    return {
      routes: [
        { name: 'home', icon: home, iconOutline: homeOutline },
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
ion-tabs {
  background: var(--ion-color-secondary);
}
ion-tab-bar {
  border-top-right-radius: 1.5rem;
  border-top-left-radius: 1.5rem;
  background: var(--ion-color-primary);
  border: none;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2),
    0 1px 5px 0 rgba(0, 0, 0, 0.12);
}
ion-tab-button {
  background: var(--ion-color-primary);
}

ion-tab-button ion-icon {
  color: var(--ion-color-primary-contrast);
}
</style>