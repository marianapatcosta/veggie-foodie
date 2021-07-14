<template>
  <form class="ion-padding" @submit.prevent="submitForm">
    <ion-list>
      <ion-item>
        <ion-label position="floating">Title</ion-label>
        <ion-input type="text" required v-model="enteredTitle" />
      </ion-item>
     <!--  <ion-item>
        <ion-label position="floating">Image URL</ion-label>
        <ion-input type="text" required v-model="enteredImageUrl" />
      </ion-item> -->
      <ion-item>
        <ion-thumbnail slot="start">
          <img :src="takenImageUrl" />
        </ion-thumbnail>
        <ion-button type="button" fill="clear" @click="takePhoto">
          <ion-icon slot="start" :icon="camera"></ion-icon>
          Take a Photo
        </ion-button>
      </ion-item>
      <ion-item>
        <ion-label position="floating">Description</ion-label>
        <ion-textarea rows="5" v-model="enteredDescription"></ion-textarea>
      </ion-item>
    </ion-list>
    <ion-button type="submit" expand="block">Save</ion-button>
  </form>
</template>

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
} from '@ionic/vue'
import { camera } from 'ionicons/icons'
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'
export default {
  emits: ['save-recipe'],
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
  data() {
    return {
      enteredTitle: '',
      enteredDescription: '',
      takenImageUrl: null,
      camera,
    }
  },
  methods: {
    async takePhoto() {
      const photo = await Camera.getPhoto({
        resultType: CameraResultType.Uri, // stores images in a temp localition in the device
        source: CameraSource.Camera, // to open the camera or the file explorer so the user can select one image
        quality: 60, // in %
      })
      this.takenImageUrl = photo.webPath // path to the image in the device
    },
    submitForm() {
      const recipe = {
        title: this.enteredTitle,
        imageUrl: this.takenImageUrl,
        description: this.enteredDescription,
      }
      this.$emit('save-recipe', recipe)
    },
  },
}
</script>