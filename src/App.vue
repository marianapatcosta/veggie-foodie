<template>
  <ion-app>
    <ion-router-outlet v-if="isDbInitialized" />
  </ion-app>
</template>
<script >
import {
  defineComponent,
  getCurrentInstance,
  ref,
  computed,
  onMounted,
  onUnmounted,
} from 'vue'
import { IonApp, IonRouterOutlet } from '@ionic/vue'
import { Storage } from '@capacitor/storage'
import { Device } from '@capacitor/device'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { CREATE_TABLES, DATABASE_NAME } from './utils/crud-utils'
import { showToast } from './utils/utils'
import { useAuth } from './composables/useAuth'

export default defineComponent({
  name: 'App',
  components: {
    IonApp,
    IonRouterOutlet,
  },
  setup() {
    const store = useStore()
    const { locale } = useI18n()
    const { loadAuthenticatedUser } = useAuth()
    const app = getCurrentInstance()
    const sqlite = ref(null)
    const database = computed(() => store.getters.database)
    const isDbInitialized = ref(false)

    const connectDatabase = async () => {
      try {
        const sqlite = app?.appContext.config.globalProperties.$sqlite
        sqlite.value = sqlite
        const db = await sqlite?.createConnection(
          DATABASE_NAME,
          false,
          'no-encryption'
        )
        await db?.open()
        store.dispatch('setDatabase', db)
        await initDbTables()
        isDbInitialized.value = true
      } catch (error) {
        showToast()
      }
    }

    const initDbTables = async () => {
      try {
        database.value.execute(CREATE_TABLES)
      } catch (error) {
        showToast()
      }
    }

    const setlocale = async () => {
      try {
        let { value: language } = await Storage.get({
          key: 'language',
        })
        if (!language) {
          const deviceLanguage = await Device.getLanguageCode()
          language = deviceLanguage.value.split('-')[0]
          await Storage.set({
            key: 'language',
            value: language,
          })
        }
        language && (locale.value = language)
      } catch (error) {
        showToast()
      }
    }

    const setTheme = async () => {
      try {
        const deviceTheme = window.matchMedia('(prefers-color-scheme: dark)')
          .matches
          ? 'dark'
          : 'light'
        const { value } = await Storage.get({
          key: 'theme',
        })

        const theme = value || deviceTheme

        const prefersDark = theme === 'dark'
        document.body.classList.toggle('dark', prefersDark)
        store.dispatch('setTheme', theme)
        if (!value) {
          await Storage.set({
            key: 'theme',
            value: theme,
          })
        }
      } catch (error) {
        showToast()
      }
    }

    onMounted(async () => {
      await Promise.all([
        connectDatabase(),
        loadAuthenticatedUser(),
        setlocale(),
        setTheme(),
      ])
    })

    onUnmounted(async () => sqlite.value.closeConnection(DATABASE_NAME))

    return {
      app: sqlite,
      isDbInitialized,
    }
  },
})
</script>