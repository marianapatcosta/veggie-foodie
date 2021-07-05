<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script >
import { IonApp, IonRouterOutlet } from '@ionic/vue'
import { Storage } from '@capacitor/storage'
import { defineComponent } from 'vue'
import { defaultLocale } from './locales'
export default defineComponent({
  name: 'App',
  components: {
    IonApp,
    IonRouterOutlet,
  },
  methods: {
    async setlocale() {
      const { value: language } = await Storage.get({
        key: 'language',
      })
      this.$i18n.locale = language || defaultLocale
    },
    async setTheme() {
      const { value: theme } = await Storage.get({
        key: 'theme',
      })
      const prefersDark = theme === 'dark'
      document.body.classList.toggle('dark', prefersDark)
    },
  },
  mounted() {
    this.setlocale()
    this.setTheme()
  },
})
</script>