<template>
  <div>
    <div class="image-wrapper">
      <ion-slides v-if="item?.imageUrl" :options="sliderOptions">
        <ion-slide>
          <div class="swiper-zoom-container">
            <img
              :src="
                isUrl(item.imageUrl)
                  ? item.imageUrl
                  : convertFilePathToHttp(item.imageUrl)
              "
              :alt="item.title"
            />
          </div>
        </ion-slide>
      </ion-slides>
      <image-placeholder v-else @click.prevent="onEditImage(item.id)" />
      <item-action-buttons
        @edit-item="onEditItem(item.id)"
        @delete-item="onDeleteItem(item)"
        @share-item="onShareItem(item, isOffline)"
      />
    </div>
    <div class="details-body">
      <h2>{{ item.title }}</h2>
      <ion-button
        v-if="item.source"
        class="ion-text-center"
        fill="clear"
        @click="goToSource(item.source)"
      >
        {{ t('global.source') }}
      </ion-button>
      <h4>{{ t('global.ingredients') }}</h4>
      <div class="recipe-body">{{ item.ingredients }}</div>
      <h4>{{ t('global.preparation') }}</h4>
      <div class="recipe-body">{{ item.preparation }}</div>
    </div>
  </div>
</template>

<script>
import { IonButton, IonSlides, IonSlide } from '@ionic/vue'
import { pencil, trash, shareSocial } from 'ionicons/icons'
import { toRefs, computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { Browser } from '@capacitor/browser'
import { useCrud } from '../composables/useCrud'
import ImagePlaceholder from './ImagePlaceholder.vue'
import ItemActionButtons from './ItemActionButtons.vue'
import { COLLECTIONS } from '../utils/constants'
import { isUrl, convertFilePathToHttp, onShareItem } from '../utils/utils'
export default {
  components: {
    IonButton,
    ImagePlaceholder,
    ItemActionButtons,
    IonSlides,
    IonSlide,
  },
  props: {
    collection: {
      type: String,
      required: true,
    },
    item: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const { collection } = toRefs(props)
    const { t } = useI18n()
    const router = useRouter()
    const { deleteItem } = useCrud(COLLECTIONS[collection.value.toUpperCase()])
    const onEditItem = id => router.push(`/${props.collection}/edit/${id}`)
    const store = useStore()
    const isOffline = computed(() => store.getters.isOffline)
    const sliderOptions = ref({
      zoom: { maxRatio: 2 },
      allowSlideNext: false,
      allowSlidePrev: false,
    })

    const onEditImage = id =>
      router.push({
        path: `/${props.collection}/edit/${id}`,
        query: { isEditImage: true },
      })

    const onDeleteItem = itemToDelete => {
      deleteItem(itemToDelete, () =>
        router.replace(`/tabs/${props.collection}`)
      )
    }

    const goToSource = async source => {
      await Browser.open({ url: source })
    }

    return {
      t,
      pencil,
      trash,
      shareSocial,
      isOffline,
      sliderOptions,
      onShareItem,
      onEditItem,
      onEditImage,
      onDeleteItem,
      isUrl,
      convertFilePathToHttp,
      goToSource,
      COLLECTIONS,
    }
  },
}
</script>
<style scoped>
ion-router-link {
  --color: var(--ion-color-item);
  border-bottom: 0.0625rem solid var(--ion-color-item);
}
ion-button {
  color: var(--ion-color-contrast);
  font-size: 1.1rem;
  --padding-start: 0;
  text-transform: capitalize !important;
}
h4 {
  text-transform: capitalize;
}
.image-wrapper {
  position: relative;
}
.recipe-body {
  margin-bottom: 1.5rem;
}
.details-body {
  margin: 0 0.5rem;
  white-space: pre-line;
}
</style>