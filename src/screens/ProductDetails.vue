<template>
  <layout
    :screenTitle="t('products.details')"
    :pageDefaultBackLink="`/tabs/${COLLECTIONS.PRODUCTS}`"
  >
    <meal-or-product-item-details
      :collection="COLLECTIONS.PRODUCTS"
      :item="item"
    />
  </layout>
</template>

<script>
import { onIonViewWillEnter } from '@ionic/vue'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { MealOrProductItemDetails } from '../components'
import { useCrud } from '../composables/useCrud'
import { COLLECTIONS } from '../utils/constants'
export default {
  components: {
    MealOrProductItemDetails,
  },
  setup() {
    const route = useRoute()
    const { t } = useI18n()
    const itemId = ref(route.params.id)
    const item = ref(null)
    const { getItem } = useCrud(COLLECTIONS.PRODUCTS)

    onIonViewWillEnter(async () => {
      const itemResponseData = await getItem(itemId.value)
      item.value = itemResponseData
    })
    return {
      t,
      COLLECTIONS,
      item,
    }
  },
}
</script>