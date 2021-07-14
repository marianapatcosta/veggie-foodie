<template>
  <layout :screenTitle="$t('user.preferences')" pageDefaultBackLink="/tabs/meals">
    <ion-list class="ion-padding preferences-list">
      <ion-item class="preferences-select">
        <ion-label>{{ $t('user.language') }}</ion-label>
        <ion-select
          :interface-options="customAlertOptions"
          :value="language"
          :placeholder="$t('user.selectOne')"
          :ok-text="$t('global.ok')"
          :cancel-text="$t('global.cancel')"
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
        <ion-label>{{ $t('user.theme') }}</ion-label>
        <ion-select
          :interface-options="customAlertOptions"
          :value="theme"
          :placeholder="$t('user.selectOne')"
          :ok-text="$t('global.ok')"
          :cancel-text="$t('global.cancel')"
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
  data() {
    return {
      customAlertOptions: { cssClass: 'app-alert preferences-alert' },
      theme: '',
    }
  },
  computed: {
    meal() {
      return this.$store.getters.meal(this.mealId)
    },
    language() {
      return this.$i18n.locale
    },
    languages() {
      return getLanguages()
    },
    themes() {
      return getThemes()
    },
  },
  methods: {
    async updateLanguage(event) {
      try {
        this.$i18n.locale = event.target.value
        await Storage.set({
          key: 'language',
          value: event.target.value,
        })
      } catch (error) {
        console.error(error)
      }
    },
    async updateTheme(event) {
      try {
        this.theme = event.target.value
        const prefersDark = event.target.value === 'dark'
        document.body.classList.toggle('dark', prefersDark)
        await Storage.set({
          key: 'theme',
          value: event.target.value,
        })
      } catch (error) {
        console.error(error)
      }
    },
    async getTheme() {
      try {
        const { value: theme } = await Storage.get({
          key: 'theme',
        })
        this.theme =
          theme ||
          window.matchMedia('(prefers-color-scheme: dark)').matches 
      } catch (error) {
        console.error(error)
      }
    },
  },
  mounted() {
    this.getTheme()
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