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
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { defaultLocale } from './locales'
import { CREATE_TABLES, DATABASE_NAME } from './utils/crud-utils'

export default defineComponent({
  name: 'App',
  components: {
    IonApp,
    IonRouterOutlet,
  },
  setup() {
    const store = useStore()
    const { locale } = useI18n()
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
        console.error(error)
      }
    }

    const initDbTables = async () => {
      try {
        database.value.execute(CREATE_TABLES)
      } catch (error) {
        console.error(error)
      }
    }

    const setlocale = async () => {
      try {
        const { value: language } = await Storage.get({
          key: 'language',
        })
        locale.value = language || defaultLocale
      } catch (error) {
        console.error(error)
      }
    }

    const setTheme = async () => {
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
    }

    onMounted(() => {
      connectDatabase()
      setlocale()
      setTheme()
    })

    onUnmounted(async () => sqlite.value.closeConnection(DATABASE_NAME))

    return {
      app: sqlite,
      isDbInitialized,
    }
  },
})
</script>