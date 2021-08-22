<template>
  <div>
    <div class="image-wrapper">
      <ion-slides v-if="item?.imageUrl" :options="sliderOptions">
        <ion-slide>
          <div class="swiper-zoom-container">
            <img
              :src="convertFilePathToHttp(item.imageUrl)"
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
      <h2 class="ion-text-center">{{ item.title }}</h2>
      <p>
        {{ collection === COLLECTIONS.MEALS ? item.location : item.store }}
      </p>
      <p>
        {{ new Date(item.date).toLocaleString(language, dateOptions) }}
      </p>
      <p class="description">{{ item.description }}</p>
    </div>
  </div>
</template>

<script>
import { IonSlides, IonSlide } from '@ionic/vue'
import { ref, toRefs, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import ImagePlaceholder from './ImagePlaceholder.vue'
import ItemActionButtons from './ItemActionButtons.vue'
import { useCrud } from '../composables/useCrud'
import { COLLECTIONS } from '../utils/constants'
import { convertFilePathToHttp, onShareItem } from '../utils/utils'
export default {
  components: {
    IonSlides,
    IonSlide,
    ImagePlaceholder,
    ItemActionButtons,
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
    const router = useRouter()
    const { locale } = useI18n()
    const { deleteItem } = useCrud(COLLECTIONS[collection.value.toUpperCase()])
    const store = useStore()
    const isOffline = computed(() => store.getters.isOffline)

    const dateOptions = ref({
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    const language = computed(() => locale.value)

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
    const onEditItem = id => router.push(`/${props.collection}/edit/${id}`)

    const onDeleteItem = itemToDelete => {
      deleteItem(itemToDelete, () =>
        router.replace(`/tabs/${props.collection}`)
      )
    }

    return {
      dateOptions,
      language,
      isOffline,
      sliderOptions,
      onShareItem,
      onEditItem,
      onEditImage,
      onDeleteItem,
      convertFilePathToHttp,
      COLLECTIONS,
    }
  },
}
</script>
<style scoped>
p {
  line-height: 1.5rem;
}
.image-wrapper {
  position: relative;
}
.details-body {
  margin: 0 0.5rem;
}
.description {
  margin-top: 0.75rem;
  font-size: 0.9rem;
  line-height: 1.25rem;
}
</style>