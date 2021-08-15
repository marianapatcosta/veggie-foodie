<template>
  <layout hideHeader>
    <div class="image-wrapper">
      <ion-img :src="image" alt="veggie foodie" />
    </div>
    <div class="ion-padding">
      <p class="intro-text">
        {{ t('global.intro') }} <strong>Veggie Foodie </strong>
      </p>
      <authentication-button />
      <ion-row class="ion-justify-content-end">
        <ion-button class="skip-link" router-link="/tabs/home" fill="clear">
          <span>{{ t('global.skipAuth') }}</span>
        </ion-button>
      </ion-row>
    </div>
  </layout>
</template>

<script>
import { useI18n } from 'vue-i18n'
import { IonImg, IonRow, IonButton } from '@ionic/vue'
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
    const image = require('../assets/images/image-placeholder.png')
    return { t, image }
  },
}
</script>
<style scoped>
ion-img {
  width: 80%;
  margin: auto;
}
ion-row {
  margin-top: 2.5rem;
}
.intro-text {
  font-size: 16px;
  text-align: start;
  margin: 2rem 0 3rem;
  line-height: 1.5rem;
  font-style: italic;
}
.image-wrapper {
  padding: 3rem 2.5rem;
  background-color: var(--ion-color-primary);
}
.skip-link {
  color: var(--ion-color-item);
  font-size: 16px;
}
</style>
