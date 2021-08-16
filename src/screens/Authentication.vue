<template>
  <layout hideHeader>
    <ion-img :src="image" alt="veggie foodie" />
    <div class="ion-padding">
      <p class="intro-text">
        {{ t('global.intro') }} <strong>Veggie Foodie </strong>
      </p>
      <authentication-button />
      <ion-row class="ion-justify-content-end">
        <ion-button
          class="skip-link"
          @click="onSkipAuthentication"
          fill="clear"
        >
          <span>{{ t('global.skipAuth') }}</span>
        </ion-button>
      </ion-row>
    </div>
  </layout>
</template>

<script>
import { useI18n } from 'vue-i18n'
import { IonImg, IonRow, IonButton } from '@ionic/vue'
import { Storage } from '@capacitor/storage'
import { useRouter } from 'vue-router'
import { AuthenticationButton } from '../components'

export default {
  components: {
    IonImg,
    IonRow,
    IonButton,
    AuthenticationButton,
  },
  setup() {
    const { t } = useI18n()
    const router = useRouter()
    const image = require('../assets/images/intro.png')

    const onSkipAuthentication = async () => {
      try {
        await Storage.set({
          key: 'alreadyLaunched',
          value: JSON.stringify(true),
        })
        router.replace('/tabs/home')
      } catch (error) {
        console.error(error)
      }
    }

    return { t, image, onSkipAuthentication }
  },
}
</script>
<style scoped>
ion-img {
  width: 100%;
  margin: auto;
}
ion-row {
  margin-top: 1rem;
}
.intro-text {
  font-size: 16px;
  text-align: start;
  line-height: 1.5rem;
  font-style: italic;
  margin-bottom: 3rem;
}

.skip-link {
  color: var(--ion-color-item);
  font-size: 16px;
}
</style>
