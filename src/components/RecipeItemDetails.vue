<template>
  <div>
    <div class="image-wrapper">
      <ion-img
        v-if="item?.imageUrl"
        :src="
          isUrl(item.imageurl)
            ? item.imageUrl
            : convertFilePathToHttp(item.imageUrl)
        "
        :alt="item.title"
      />
      <image-placeholder v-else @click.prevent="onEditImage(item.id)" />
      <item-action-buttons
        @edit-item="onEditItem(item.id)"
        @delete-item="onDeleteItem(item)"
        @share-item="onShareItem(item)"
      />
    </div>
    <div class="details-body">
      <h2>{{ item.title }}</h2>
      <ion-router-link
        v-if="item.source"
        class="ion-text-center"
        :href="item.source"
      >
        {{ t('global.source') }}
      </ion-router-link>
      <h4>{{ t('global.ingredients') }}</h4>
      <div class="recipe-body">{{ item.ingredients }}</div>
      <h4>{{ t('global.preparation') }}</h4>
      <div class="recipe-body">{{ item.preparation }}</div>
    </div>
  </div>
</template>

<script>
import { IonImg, IonRouterLink } from '@ionic/vue'
import { pencil, trash, shareSocial } from 'ionicons/icons'
import { toRefs } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useCrud } from '../composables/useCrud'
import ImagePlaceholder from './ImagePlaceholder.vue'
import ItemActionButtons from './ItemActionButtons.vue'
import { COLLECTIONS } from '../utils/constants'
import { isUrl, convertFilePathToHttp, onShareItem } from '../utils/utils'
export default {
  components: {
    IonImg,
    IonRouterLink,
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
    const { t } = useI18n()
    const router = useRouter()
    const { deleteItem } = useCrud(COLLECTIONS[collection.value.toUpperCase()])

    const onEditItem = id => router.push(`/${props.collection}/edit/${id}`)

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

    return {
      t,
      pencil,
      trash,
      shareSocial,
      onShareItem,
      onEditItem,
      onEditImage,
      onDeleteItem,
      isUrl,
      convertFilePathToHttp,
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