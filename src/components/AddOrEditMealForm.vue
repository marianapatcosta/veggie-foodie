<template>
  <form class="ion-padding" @submit.prevent="submitForm">
    <ion-list>
      <ion-item>
        <ion-label position="floating">{{ $t('meals.title') }}</ion-label>
        <ion-input type="text" required v-model="title" />
      </ion-item>
      <ion-item class="item-datetime">
        <ion-label>{{ $t('meals.date') }} </ion-label>
        <ion-datetime
          v-model="date"
          display-format="YYYY MM DD HH:mm"
          placeholder="YYYY MM DD HH:mm"
        ></ion-datetime>
      </ion-item>
      <ion-item
        :style="{
          marginTop: '0.5rem',
        }"
      >
        <div>
          <ion-label position="floating">{{ $t('meals.location') }} </ion-label>
          <ion-input type="text" v-model="location" />
        </div>
        <ion-button
          class="icon-button--absolute"
          fill="outline"
          @click="findCurrentLocation"
        >
          <ion-icon slot="icon-only" :icon="yourLocation"></ion-icon>
        </ion-button>
      </ion-item>
      <ion-item
        :style="{
          marginTop: '0.5rem',
        }"
      >
        <ion-label position="floating"
          >{{ $t('meals.description') }}
        </ion-label>
        <ion-textarea rows="3" v-model="description"></ion-textarea>
      </ion-item>
    </ion-list>

    <ion-item
      lines="none"
      class="item--padding"
      :style="{
        alignItems: 'flex-end',
      }"
    >
      <ion-label
        position="floating"
        :class="['image-label', imageUrl ? 'image-label--small' : '']"
        >{{ $t('meals.image') }}
      </ion-label>
      <ion-button class="icon-button" fill="outline" @click="takePhoto">
        <ion-icon slot="icon-only" :icon="camera"></ion-icon>
      </ion-button>

      <ion-thumbnail slot="end" v-if="imageUrl">
        <img :src="imageUrl" />
      </ion-thumbnail>
    </ion-item>
    <ion-button type="submit" expand="block" class="submit-button"
      >{{ $t('global.save') }}
    </ion-button>
  </form>
</template>
 ~
<script>
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
import { camera, location as locationIcon } from 'ionicons/icons'
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'
import { Geolocation } from '@capacitor/geolocation'
import axios from 'axios'
export default {
  emits: ['save-meal'],
  props: {
    meal: Object,
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
  },
  data() {
    return {
      title: this.meal?.title || '',
      description: this.meal?.description || '',
      imageUrl: this.meal?.imageUrl || '',
      location: this.meal?.location || '',
      date: this.meal?.date || new Date().toISOString(),
      camera,
      yourLocation: locationIcon,
    }
  },
  methods: {
    async takePhoto() {
      const photo = await Camera.getPhoto({
        resultType: CameraResultType.Uri, // stores images in a temp localition in the device
        source: CameraSource.Prompt, // to open the camera or the file explorer so the user can select one image
        quality: 60, // in %
      })
      this.imageUrl = photo.webPath // path to the image in the device
    },
    submitForm() {
      const meal = {
        title: this.title,
        date: this.date,
        imageUrl: this.imageUrl,
        description: this.description,
      }
      this.$emit('save-meal', meal)
    },
    getLocationName(location) {
      if (!location) {
        return
      }
      let locationArray = location.split(',')
      locationArray = locationArray.slice(
        locationArray.length - 3 >= 0 ? locationArray.length - 3 : 0,
        locationArray.length
      )
      const wordsToDelete = [
        this.$t('meals.municipality'),
        this.$t('meals.region'),
        this.$t('meals.district'),
      ]
      const itemToKeep = +this.$t('meals.itemToKeep')
      wordsToDelete.forEach(word => {
        locationArray.forEach((item, index) => {
          locationArray[index] = item.includes(word)
            ? item.split(word)[itemToKeep].trim()
            : item.trim()
        })
      })

      if (locationArray[0].includes(locationArray[1])) {
        locationArray.splice(0, 1)
      }
      return locationArray.join(', ')
    },
    async findCurrentLocation() {
      const language = 'pt'
      const GEOLOCATION_KEY = process.env.VUE_APP_GEOLOCATION_KEY
      const coordinates = await Geolocation.getCurrentPosition()
      const geolocationParams = `${coordinates.coords.longitude},${coordinates.coords.latitude}`
      const geolocation = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${geolocationParams}.json?access_token=${GEOLOCATION_KEY}&autocomplete=false&language=${language}`
      )
      this.location = this.getLocationName(
        geolocation.data.features[3].place_name
      )
    },
  },
}
</script>
<style scoped>
ion-list {
  background: var(--ion-color-secondary);
}
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
</style>