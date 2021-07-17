<template>
  <form class="ion-padding" @submit.prevent="submitForm">
    <ion-list>
      <ion-item>
        <ion-label position="floating">{{ t('global.title') }}</ion-label>
        <ion-input type="text" required v-model="title" />
      </ion-item>
      <ion-item>
        <ion-label position="floating">{{ t('global.source') }}</ion-label>
        <ion-input type="text" v-model="source" />
      </ion-item>
      <ion-item>
        <ion-label position="floating">{{ t('global.ingredients') }}</ion-label>
        <ion-textarea rows="3" v-model="ingredients"></ion-textarea>
      </ion-item>
      <ion-item
        :style="{
          marginTop: '0.5rem',
        }"
      >
        <ion-label position="floating"
          >{{ t('global.preparation') }}
        </ion-label>
        <ion-textarea rows="3" v-model="preparation"></ion-textarea>
      </ion-item>
    </ion-list>

    <ion-item
      class="item--padding"
      :style="{
        alignItems: 'flex-end',
      }"
    >
      <ion-label
        position="floating"
        :class="['image-label', imageUrl ? 'image-label--small' : '']"
        >{{ t('global.image') }}
      </ion-label>
      <div class="image-wrapper">
        <ion-button class="icon-button" fill="outline" @click="takePhoto">
          <ion-icon slot="icon-only" :icon="camera"></ion-icon>
        </ion-button>

        <ion-thumbnail slot="end" v-if="imageUrl">
          <img :src="imageUrl" />
        </ion-thumbnail>
      </div>
      <ion-input v-model="imageUrl" :placeholder="t('global.imageLink')"/>
    </ion-item>
    <ion-button type="submit" expand="block" class="submit-button"
      >{{ t('global.save') }}
    </ion-button>
  </form>
</template>
 ~
<script>
import { ref, watch, onMounted } from 'vue'
import {
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonButton,
  IonThumbnail,
  IonIcon,
} from '@ionic/vue'
import { useI18n } from 'vue-i18n'
import { camera } from 'ionicons/icons'
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'
import { COLLECTIONS } from '../utils/constants'
import { useCrud } from '../composables/useCrud'
export default {
  emits: ['save-item'],
  props: {
    itemId: { type: Object },
    collection: { type: String, required: true },
  },
  components: {
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonTextarea,
    IonButton,
    IonThumbnail,
    IonIcon,
  },
  // setup takes props and context as args
  setup(props) {
    const { t } = useI18n()
    const { getItem, saveItem } = useCrud(COLLECTIONS.RECIPES)
    const item = ref(null)

    const title = ref('')
    const ingredients = ref('')
    const source = ref('')
    const preparation = ref('')
    const imageUrl = ref('')

    const takePhoto = async () => {
      try {
        const photo = await Camera.getPhoto({
          resultType: CameraResultType.DataUrl, // stores images as data url in base 64
          source: CameraSource.Prompt, // to open the camera or the file explorer so the user can select one image
          quality: 60, // in %
        })
        imageUrl.value = photo.dataUrl
      } catch (error) {
        console.error(error)
      }
    }

    const submitForm = () => {
      const data = {
        title: title.value,
        ingredients: ingredients.value,
        preparation: preparation.value,
        source: source.value,
        imageUrl: imageUrl.value,
      }
      saveItem(data, props.itemId)
    }

    watch(item, () => {
      title.value = item.value.title || ''
      ingredients.value = item.value.ingredients || ''
      preparation.value = item.value.preparation || ''
      source.value = item.value.source || ''
      imageUrl.value = item.value.imageUrl || ''
    })

    onMounted(async () => {
      if (!props.itemId) return
      const responseData = await getItem(props.itemId)
      item.value = responseData
    })

    return {
      t,
      title,
      ingredients,
      preparation,
      imageUrl,
      source,
      camera,
      takePhoto,
      submitForm,
      COLLECTIONS,
    }
  },
}
</script>
<style scoped>
ion-item {
  --background: var(--ion-color-secondary);
  --border-color: rgba(var(--ion-color-item-rgb), 0.5);
}
ion-datetime {
  --placeholder-color: var(--ion-color-primary);
}
ion-icon {
  color: var(--ion-color-item);
}
ion-item.item-has-focus ion-label {
  color: var(--ion-color-focus) !important;
  font-weight: 700;
}
ion-item.item-has-focus {
  --border-color: var(--ion-color-focus) !important;
}
ion-label {
  text-transform: capitalize;
}
.item-datetime {
  margin-top: 1.5rem;
}
span {
  padding-top: 5px;
}
.item--padding {
  --padding-top: 25px;
  --padding-bottom: 25px;
}
.image-label {
  transform: revert;
  margin-top: 0;
  margin-bottom: 0.3rem;
}
.image-label--small {
  transform: scale(0.82);
}
.image-wrapper {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
}
</style>