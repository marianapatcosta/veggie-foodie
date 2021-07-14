<template>
  <ion-app>
    <ion-router-outlet v-if="isDbInitialized" />
  </ion-app>
</template>

<script >
import { getCurrentInstance } from 'vue'

import { IonApp, IonRouterOutlet } from '@ionic/vue'
import { Storage } from '@capacitor/storage'
import { defineComponent } from 'vue'
import { defaultLocale } from './locales'
import { CREATE_TABLES } from './utils/create-tables'

export default defineComponent({
  name: 'App',
  components: {
    IonApp,
    IonRouterOutlet,
  },
  data() {
    return {
      app: getCurrentInstance(),
      sqlite: null,
      database: this.$store.getters.database,
      isDbInitialized: false,
    }
  },
  methods: {
    async connectDatabase() {
      try {
        const sqlite = this.app?.appContext.config.globalProperties.$sqlite
        this.sqlite = sqlite
        const db = await this.sqlite?.createConnection(
          'veggie-foodie',
          false,
          'no-encryption'
        )
        await db?.open()
        this.database = db
        this.$store.dispatch('setDatabase', db)
        await this.initDbTables()
        this.isDbInitialized = true
      } catch (error) {
        console.error(error)
      }
    },
    async initDbTables() {
      try {
        this.database.run(CREATE_TABLES)
      } catch (error) {
        console.error(error)
      }
    },
    async setlocale() {
      try {
        const { value: language } = await Storage.get({
          key: 'language',
        })
        this.$i18n.locale = language || defaultLocale
      } catch (error) {
        console.error(error)
      }
    },
    async setTheme() {
      try {
        const { value } = await Storage.get({
          key: 'theme',
        })
        const theme = value || 'light'
        const prefersDark = theme === 'dark'
        document.body.classList.toggle('dark', prefersDark)
        await Storage.set({
          key: 'theme',
          value: theme,
        })
      } catch (error) {
        console.error(error)
      }
    },
   
  },
  created() {
      this.connectDatabase()
  },
  mounted() {
    this.setlocale()
    this.setTheme()
  },
})
</script>