<template>
  <div>
    <div class="image-wrapper">
      <ion-img v-if="item.imageUrl" :src="item.imageUrl" :alt="item.title" />
      <image-placeholder v-else @click.prevent="onEditImage(item.id)" />
      <item-action-buttons
        :showShareButton="isImageUrlAHttpUrl(item.imageurl)"
        @edit-item="onEditItem(item.id)"
        @delete-item="onDeleteItem(item.id)"
        @share-item="onShareItem(item.id)"
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
import { IonImg } from '@ionic/vue'
import { ref, toRefs, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Share } from '@capacitor/share'
import ImagePlaceholder from './ImagePlaceholder.vue'
import ItemActionButtons from './ItemActionButtons.vue'
import { useCrud } from '../composables/useCrud'
import { COLLECTIONS } from '../utils/constants'
import { isImageUrlAHttpUrl } from '../utils/utils'
export default {
  components: {
    IonImg,
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
    const { t, locale } = useI18n()
    const { deleteItem } = useCrud(COLLECTIONS[collection.value.toUpperCase()])

    const dateOptions = ref({
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    const language = computed(() => locale.value)

    const onShareItem = async item => {
      if (!isImageUrlAHttpUrl(item.imageUrl)) return
      try {
        await Share.share({
          title: t('global.shareTitle'),
          text: item.title,
          url: item.imageUrl,
          dialogTitle: '',
        })
      } catch (error) {
        console.error(error)
      }
    }

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
      onShareItem,
      onEditItem,
      onEditImage,
      onDeleteItem,
      isImageUrlAHttpUrl,
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