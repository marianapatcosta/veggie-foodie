<template>
  <layout
    :screenTitle="t('user.preferences')"
    pageDefaultBackLink="/tabs/home"
    headerCurved
  >
    <div class="ion-padding preferences">
      <ion-list class="preferences-list">
        <ion-item v-if="userData" class="user-data">
          <div class="username">
            <span>{{ t('user.username') }}</span>
            <span
              ><strong>{{ userData.fullName }}</strong></span
            >
          </div>
          <ion-thumbnail slot="end" class="preferences-avatar">
            <ion-img :src="userData?.avatar" />
          </ion-thumbnail>
        </ion-item>
        <ion-item class="user-data">
          <ion-label>{{ t('user.language') }}</ion-label>
          <ion-select
            :interface-options="customAlertOptions"
            :value="language"
            :placeholder="t('user.selectOne')"
            :ok-text="t('global.ok')"
            :cancel-text="t('global.cancel')"
            @ionChange="updateLanguage"
          >
            <ion-select-option
              v-for="language in languages"
              :key="`language-${language.label}`"
              :value="language.locale"
              >{{ language.label }}</ion-select-option
            >
          </ion-select>
        </ion-item>
        <ion-item class="user-data">
          <ion-label>{{ t('user.theme') }}</ion-label>
          <ion-select
            :interface-options="customAlertOptions"
            :value="theme"
            :placeholder="t('user.selectOne')"
            :ok-text="t('global.ok')"
            :cancel-text="t('global.cancel')"
            @ionChange="updateTheme"
          >
            <ion-select-option
              v-for="theme in themes"
              :key="`theme-${theme.label}`"
              :value="theme.theme"
              >{{ theme.label }}</ion-select-option
            >
          </ion-select>
        </ion-item></ion-list
      >

      <div class="authentication">
        <p v-if="!userData" class="authentication-text">
          {{ t('user.loggedOut') }}
        </p>
        <p v-else class="authentication-text">{{ t('user.loggedIn') }}</p>
        <authentication-button v-if="!userData" />
        <ion-button v-else expand="block" class="submit-button" @click="logout">
          <p>{{ t('user.logout') }}</p></ion-button
        >
      </div>
    </div>
  </layout>
</template>

<script>
import {
  IonList,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonThumbnail,
  IonImg,
} from '@ionic/vue'
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Storage } from '@capacitor/storage'
import { useStore } from 'vuex'
import { AuthenticationButton } from '../components'
import { getLanguages, getThemes } from '../utils/constants'
import { showToast } from '../utils/utils'
import { useAuth } from '../composables/useAuth'
export default {
  components: {
    IonList,
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonThumbnail,
    IonImg,
    AuthenticationButton,
  },
  setup() {
    const { t, locale } = useI18n()
    const store = useStore()
    const { logout } = useAuth()
    const theme = computed(() => store.getters.theme)
    const userData = computed(() => store.getters.userData)
    const customAlertOptions = ref({ cssClass: 'app-alert preferences-alert' })
    const language = computed(() => locale.value)
    const languages = computed(getLanguages)
    const themes = computed(getThemes)

    const updateLanguage = async event => {
      try {
        locale.value = event.target.value
        Storage.set({
          key: 'language',
          value: event.target.value,
        })
      } catch (error) {
        showToast()
      }
    }

    const updateTheme = async event => {
      try {
        const prefersDark = event.target.value === 'dark'
        document.body.classList.toggle('dark', prefersDark)
        store.dispatch('setTheme', event.target.value)
        await Storage.set({
          key: 'theme',
          value: event.target.value,
        })
      } catch (error) {
        showToast()
      }
    }

    return {
      t,
      customAlertOptions,
      userData,
      theme,
      language,
      languages,
      themes,
      updateLanguage,
      updateTheme,
      logout,
    }
  },
}
</script>
<style >
.user-data {
  --background: var(--ion-color-secondary);
  margin: 1.5rem 0 1rem;
}

.preferences {
  background: var(--ion-color-secondary);
  color: var(--ion-color-primary-contrast);
}

.preferences-list {
  height: calc(100vh - 21.5rem);
}

.preferences-avatar {
  background: var(--ion-color-primary);
  padding: 0.1rem;
  border-radius: 0.5rem;
  width: 3.5rem;
  height: 3.5rem;
  align-self: flex-start;
}

.preferences-avatar ion-img {
  border-radius: 0.5rem;
}

.preferences-alert .alert-message {
  display: none;
}

.user-data {
  --inner-padding-bottom: 1.5rem;
}

.username {
  display: flex;
  flex-direction: column;
}

.username span {
  color: var(--ion-color-contrast);
}

.username span:last-child {
  margin-top: 0.5rem;
}

.authentication {
  height: 7rem;
  margin-bottom: 1.5rem;
}

.authentication-text {
  color: var(--ion-color-contrast);
  margin-bottom: 1rem;
}
</style>