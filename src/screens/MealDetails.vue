<template>
  <layout
    :screenTitle="t('meals.details')"
    :pageDefaultBackLink="`/tabs/${COLLECTIONS.MEALS}`"
  >
    <meal-or-product-item-details
      :collection="COLLECTIONS.MEALS"
      :item="item"
    />
  </layout>
</template>

<script>
import { ref, onMounted } from 'vue'
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
    const { getItem } = useCrud(COLLECTIONS.MEALS)

    onMounted(async () => {
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