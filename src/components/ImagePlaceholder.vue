<template>
  <div
    :class="[
      'image-placeholder-wrapper',
      { 'image-placeholder-wrapper--small': isSmall },
    ]"
  >
    <ion-img
      :class="['image-placeholder', { 'image-placeholder--small': isSmall }]"
      :src="imagePlaceholder"
      alt="image-placeholder"
    />
    <p class="image-placeholder-text" v-if="!isSmall">
      {{ t('global.noImage') }}
    </p>
  </div>
</template>

<script>
import { IonImg } from '@ionic/vue'
import { useI18n } from 'vue-i18n'

export default {
  props: {
    isSmall: { type: Boolean, default: false },
  },
  components: {
    IonImg,
  },
  setup() {
    const { t } = useI18n()
    const imagePlaceholder = require('../assets/images/image-placeholder.png')

    return {
      t,
      imagePlaceholder,
    }
  },
}
</script>
<style scoped>
.image-placeholder-wrapper {
  width: 100%;
  height: 13rem;
}
.image-placeholder-wrapper--small {
  height: 100%;
  display: flex;
}
.image-placeholder {
  width: 40%;
  padding: 3rem 0 1.5rem;
  margin: 0 auto;
  opacity: 0.3;
}
.image-placeholder--small {
  width: 70%;
  margin: auto;
  padding: 0;
}
.image-placeholder-text {
  text-align: center;
  color: var(--ion-color-item);
  margin: 0 3.5rem;
}
</style>