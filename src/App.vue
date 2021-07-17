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
import { CREATE_TABLES } from './utils/create-tables'

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
      // if (isDbInitialized.value) return
      try {
        const sqlite = app?.appContext.config.globalProperties.$sqlite

        sqlite.value = sqlite
        const db = await sqlite?.createConnection(
          'veggie-foodie',
          false,
          'no-encryption'
        )
        await db?.open()
        store.dispatch('setDatabase', db)
        await initDbTables()
        //   await setMeals()
        isDbInitialized.value = true
      } catch (error) {
        console.error(error)
      }
    }

    const initDbTables = async () => {
      try {
        database.value.run(CREATE_TABLES)
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

    /* const setMeals = async () => {
      const setMeals = [
        {
          statement:
            'INSERT INTO meals (title, description, imageUrl, location, date) VALUES(?, ?, ?, ?, ?);',
          values: ['c2ogumelos', '', '', 'porto', ''],
        },
        {
          statement:
            'INSERT INTO meals (title, description, imageUrl, location, date) VALUES(?, ?, ?, ?, ?);',
          values: ['p2izza', '', '', 'porto', ''],
        },
        {
          statement:
            'INSERT INTO meals (title, description, imageUrl, location, date) VALUES(?, ?, ?, ?, ?);',
          values: ['fr2ancesinha', '', '', 'porto', ''],
        },
        {
          statement:
            'INSERT INTO meals (title, description, imageUrl, location, date) VALUES(?, ?, ?, ?, ?);',
          values: ['t2ofu', '', '', 'porto', ''],
        },
        {
          statement:
            'INSERT INTO meals (title, description, imageUrl, location, date) VALUES(?, ?, ?, ?, ?);',
          values: ['se2itan', '', '', 'porto', ''],
        },
        {
          statement:
            'INSERT INTO meals (title, description, imageUrl, location, date) VALUES(?, ?, ?, ?, ?);',
          values: ['al2monds', '', '', 'porto', ''],
        },
        {
          statement:
            'INSERT INTO meals (title, description, imageUrl, location, date) VALUES(?, ?, ?, ?, ?);',
          values: ['nu2ts', '', '', 'porto', ''],
        },
        {
          statement:
            ' INSERT INTO meals (title, description, imageUrl, location, date) VALUES(?, ?, ?, ?, ?);',
          values: ['co2gumsoyaelos', '', '', 'porto', ''],
        },
        {
          statement:
            'INSERT INTO meals (title, description, imageUrl, location, date) VALUES(?, ?, ?, ?, ?);',
          values: ['lent2ills', '', '', 'porto', ''],
        },
        {
          statement:
            'INSERT INTO meals (title, description, imageUrl, location, date) VALUES(?, ?, ?, ?, ?);',
          values: ['car2rots', '', '', 'porto', ''],
        },

        {
          statement:
            'INSERT INTO meals (title, description, imageUrl, location, date) VALUES(?, ?, ?, ?, ?);',
          values: ['icecream', '', '', 'porto', ''],
        },
        {
          statement:
            'INSERT INTO meals (title, description, imageUrl, location, date) VALUES(?, ?, ?, ?, ?);',
          values: ['spinash', '', '', 'porto', ''],
        },
        {
          statement:
            'INSERT INTO meals (title, description, imageUrl, location, date) VALUES(?, ?, ?, ?, ?);',
          values: ['peach', '', '', 'porto', ''],
        },
        {
          statement:
            'INSERT INTO meals (title, description, imageUrl, location, date) VALUES(?, ?, ?, ?, ?);',
          values: ['banana', '', '', 'porto', ''],
        },
      ]

      try {
        await this.database.executeSet(setMeals)
        console.log('insert success')
      } catch (error) {
        console.log('insert error', error)
      }
    }, */

    onMounted(() => {
      connectDatabase()
      setlocale()
      setTheme()
    })

    onUnmounted(async () => sqlite.value.closeConnection('veggie-foodie'))

    return {
      app: sqlite,
      isDbInitialized,
    }
  },
})
</script>