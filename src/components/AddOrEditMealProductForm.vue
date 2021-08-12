<template>
  <form class="ion-padding" @submit.prevent="submitForm">
    <ion-list>
      <ion-item>
        <ion-label position="floating">{{ t('global.title') }}</ion-label>
        <ion-input required v-model="title" max-length="150" />
      </ion-item>
      <ion-item class="item-datetime">
        <ion-label>{{ t('global.date') }} </ion-label>
        <ion-datetime
          v-model="date"
          display-format="YYYY MM DD HH:mm"
          placeholder="YYYY MM DD HH:mm"
        />
      </ion-item>
      <ion-item v-if="collection === COLLECTIONS.PRODUCTS">
        <ion-label position="floating">{{ t('global.store') }}</ion-label>
        <ion-input v-model="store" max-length="150" />
      </ion-item>
      <ion-item
        v-else
        :style="{
          marginTop: '0.5rem',
        }"
      >
        <div class="location">
          <ion-label position="floating">{{ t('global.location') }} </ion-label>
          <ion-input v-model="location" max-length="150" />
        </div>
        <ion-button
          class="icon-button--absolute"
          fill="outline"
          @click="findCurrentLocation"
        >
          <ion-icon slot="icon-only" :icon="locationIcon"></ion-icon>
        </ion-button>
      </ion-item>
      <ion-item
        :style="{
          marginTop: '0.5rem',
        }"
      >
        <ion-label position="floating"
          >{{ t('global.description') }}
        </ion-label>
        <ion-textarea rows="3" v-model="description"></ion-textarea>
      </ion-item>
    </ion-list>

    <ion-item
      :lines="collection === COLLECTIONS.PRODUCTS ? 'full' : 'none'"
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

        <ion-thumbnail slot="end">
          <img v-if="imageUrl" :src="imageUrl" />
          <image-placeholder v-else isSmall />
        </ion-thumbnail>
      </div>
      <ion-input
        v-if="collection === COLLECTIONS.PRODUCTS"
        v-model="imageUrl"
        :placeholder="t('global.imageLink')"
      />
    </ion-item>
    <ion-button type="submit" expand="block" class="submit-button"
      >{{ t('global.save') }}
    </ion-button>
  </form>
</template>
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
  IonDatetime,
} from '@ionic/vue'
import { useI18n } from 'vue-i18n'
import { camera, location as locationIcon } from 'ionicons/icons'
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'
import { Geolocation } from '@capacitor/geolocation'
import axios from 'axios'
import ImagePlaceholder from './ImagePlaceholder.vue'
import { COLLECTIONS } from '../utils/constants'
import { useCrud } from '../composables/useCrud'
export default {
  emits: ['save-item'],
  props: {
    itemId: { type: Object },
    collection: { type: String, required: true },
    isEditImage: { type: Boolean },
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
    IonDatetime,
    ImagePlaceholder,
  },
  // setup takes props and context as args
  setup(props) {
    const { t, locale } = useI18n()
    const { getItem, saveItem } = useCrud(
      COLLECTIONS[props.collection.toUpperCase()]
    )
    const item = ref(null)
    const title = ref('')
    const description = ref('')
    const imageUrl = ref('')
    const store = ref('')
    const location = ref('')
    const date = ref(new Date().toISOString())

    const takePhoto = async () => {
      try {
        const photo = await Camera.getPhoto({
          resultType: CameraResultType.DataUrl, // stores images as data url in base 64
          source: CameraSource.Prompt, // to open the camera or the file explorer so the user can select one image
          quality: 60, // in %
          allowEditing: true,
        })
        imageUrl.value = photo.dataUrl
      } catch (error) {
        console.error(error)
      }
    }

    const submitForm = () => {
      const data = {
        title: title.value,
        date: date.value,
        imageUrl: imageUrl.value,
        description: description.value,
      }
      if (props.collection === COLLECTIONS.PRODUCTS) {
        data.store = store.value
      }
      if (props.collection === COLLECTIONS.MEALS) {
        data.location = location.value
      }
      saveItem(data, props.itemId)
    }

    const findCurrentLocation = async () => {
      try {
        const language = locale.value
        const GEOLOCATION_KEY = process.env.VUE_APP_GEOLOCATION_KEY
        const coordinates = await Geolocation.getCurrentPosition()
        const geolocationParams = `${coordinates.coords.longitude},${coordinates.coords.latitude}`
        const geolocation = await axios.get(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${geolocationParams}.json?access_token=${GEOLOCATION_KEY}&autocomplete=false&language=${language}`
        )
        location.value = geolocation.data.features[0].place_name
      } catch (error) {
        console.error(error)
      }
    }

    watch(item, () => {
      title.value = item.value.title || ''
      description.value = item.value.description || ''
      imageUrl.value = item.value.imageUrl || ''
      location.value = item.value.location || ''
      store.value = item.value.store || ''
      date.value = item.value.date || new Date().toISOString()
    })

    onMounted(async () => {
      if (!props.itemId) return
      const responseData = await getItem(props.itemId)
      item.value = responseData
      if (props.isEditImage) {
        await takePhoto()
      }
    })

    return {
      t,
      title,
      description,
      imageUrl,
      store,
      location,
      date,
      camera,
      locationIcon,
      takePhoto,
      submitForm,
      findCurrentLocation,
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
ion-thumbnail {
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2),
    0 1px 5px 0 rgba(0, 0, 0, 0.12);
}
.item-datetime {
  margin-top: 1.5rem;
}
span {
  padding-top: 0.3rem;
}
.item--padding {
  --padding-top: 1.5rem;
  --padding-bottom: 1.5rem;
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
.location {
  width: calc(100% - 3.75rem);
}
</style>