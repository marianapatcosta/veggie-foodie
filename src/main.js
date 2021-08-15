import { createApp } from 'vue'
import { useSQLite } from 'vue-sqlite-hook/dist'
import { useState } from './composables/useState'
import App from './App.vue'
import router from './router'
import store from './store'

import { IonicVue } from '@ionic/vue'

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css'

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css'
import '@ionic/vue/css/structure.css'
import '@ionic/vue/css/typography.css'

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css'
import '@ionic/vue/css/float-elements.css'
import '@ionic/vue/css/text-alignment.css'
import '@ionic/vue/css/text-transformation.css'
import '@ionic/vue/css/flex-utils.css'
import '@ionic/vue/css/display.css'

import { i18n } from './locales'

/* Theme variables */
import './themes/variables.css'
import './themes/core.css'

import { Layout } from './components'

const app = createApp(App)
  .use(IonicVue)
  .use(router)
  .use(store)
  .use(i18n)

app.component('layout', Layout)

/* SQLite Global Variables and Hook */
const [jsonListeners, setJsonListeners] = useState(false)
const [isModal, setIsModal] = useState(false)
const [message, setMessage] = useState('')
app.config.globalProperties.$isModalOpen = {
  isModal: isModal,
  setIsModal: setIsModal
}
app.config.globalProperties.$isJsonListeners = {
  jsonListeners: jsonListeners,
  setJsonListeners: setJsonListeners
}
app.config.globalProperties.$messageContent = {
  message: message,
  setMessage: setMessage
}

const onProgressImport = async progress => {
  if (app.config.globalProperties.$isJsonListeners.jsonListeners.value) {
    if (!app.config.globalProperties.$isModalOpen.isModal.value)
      app.config.globalProperties.$isModalOpen.setIsModal(true)
    app.config.globalProperties.$messageContent.setMessage(
      app.config.globalProperties.$messageContent.message.value.concat(
        `${progress}\n`
      )
    )
  }
}
const onProgressExport = async progress => {
  if (app.config.globalProperties.$isJsonListeners.jsonListeners.value) {
    if (!app.config.globalProperties.$isModalOpen.isModal.value)
      app.config.globalProperties.$isModalOpen.setIsModal(true)
    app.config.globalProperties.$messageContent.setMessage(
      app.config.globalProperties.$messageContent.message.value.concat(
        `${progress}\n`
      )
    )
  }
}

// SQLite Hook
const {
  echo,
  getPlatform,
  createConnection,
  closeConnection,
  retrieveConnection,
  retrieveAllConnections,
  closeAllConnections,
  addUpgradeStatement,
  importFromJson,
  isJsonValid,
  copyFromAssets,
  isAvailable
} = useSQLite({
  onProgressImport,
  onProgressExport
})

// Singleton SQLite Hook
app.config.globalProperties.$sqlite = {
  echo,
  getPlatform,
  createConnection,
  closeConnection,
  retrieveConnection,
  retrieveAllConnections,
  closeAllConnections,
  addUpgradeStatement,
  importFromJson,
  isJsonValid,
  copyFromAssets,
  isAvailable
}

//  Existing Connections Store
const [existConn, setExistConn] = useState(false)
app.config.globalProperties.$existingConn = {
  existConn,
  setExistConn
}
router.isReady().then(() => {
  app.mount('#app')
})
