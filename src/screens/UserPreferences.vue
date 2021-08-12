<template>
  <layout
    :screenTitle="t('user.preferences')"
    pageDefaultBackLink="/tabs/home"
    headerCurved
  >
    <ion-list class="ion-padding preferences-list">
      <ion-item class="preferences-select">
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

      <ion-item class="preferences-select">
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
      </ion-item>
    </ion-list>
  </layout>
</template>

<script>
import {
  IonList,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
} from '@ionic/vue'
import { onMounted, ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Storage } from '@capacitor/storage'
import { getLanguages, getThemes } from '../utils/constants'
export default {
  components: {
    IonList,
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption,
  },
  setup() {
    const { t, locale } = useI18n()

    const theme = ref('')
    const customAlertOptions = ref({ cssClass: 'app-alert preferences-alert' })

    const language = computed(() => locale.value)
    const languages = computed(getLanguages)
    const themes = computed(getThemes)

    const updateLanguage = async event => {
      try {
        locale.value = event.target.value
        await Storage.set({
          key: 'language',
          value: event.target.value,
        })
      } catch (error) {
        console.error(error)
      }
    }

    const updateTheme = async event => {
      try {
        theme.value = event.target.value
        const prefersDark = event.target.value === 'dark'
        document.body.classList.toggle('dark', prefersDark)
        await Storage.set({
          key: 'theme',
          value: event.target.value,
        })
      } catch (error) {
        console.error(error)
      }
    }

    const getTheme = async () => {
      try {
        const { value } = await Storage.get({
          key: 'theme',
        })
        theme.value =
          value || window.matchMedia('(prefers-color-scheme: dark)').matches
      } catch (error) {
        console.error(error)
      }
    }

    onMounted(getTheme)

    return {
      t,
      customAlertOptions,
      theme,
      language,
      languages,
      themes,
      updateLanguage,
      updateTheme,
    }
  },
}
</script>
<style >
.preferences-list {
  background: var(--ion-color-secondary);
  color: var(--ion-color-primary-contrast);
}
.preferences-select {
  --background: var(--ion-color-secondary);
  margin: 1.5rem 0 1rem;
}
.preferences-alert .alert-message {
  display: none;
}
</style>