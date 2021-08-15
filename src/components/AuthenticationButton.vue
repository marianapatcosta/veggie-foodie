<template>
  <ion-button
    expand="block"
    class="submit-button"
    @click="authenticateWithGoogle"
  >
    <ion-icon :icon="logoGoogle" />
    <p>{{ t('global.authenticate') }}</p>
  </ion-button>
</template>

<script>
import { IonButton, IonIcon } from '@ionic/vue'
import { useI18n } from 'vue-i18n'
import { logoGoogle } from 'ionicons/icons'
import { useAuth } from '../composables/useAuth.js'

export default {
  components: {
    IonButton,
    IonIcon,
  },
  setup() {
    const { t } = useI18n()
    const { authenticateWithGoogle } = useAuth()

    return { t, authenticateWithGoogle, logoGoogle }
  },
}
</script>
<style scoped>
ion-button::part(native) .button-inner {
  justify-content: revert;
}
p {
  margin: auto;
  line-height: 0.9rem;
}
</style>