<template>
  <layout
    :screenTitle="t('recipes.details')"
    :pageDefaultBackLink="`/tabs/${COLLECTIONS.RECIPES}`"
  >
    <recipe-item-details :collection="COLLECTIONS.RECIPES" :item="item" />
  </layout>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { RecipeItemDetails } from '../components'
import { useCrud } from '../composables/useCrud'
import { COLLECTIONS } from '../utils/constants'
export default {
  components: {
    RecipeItemDetails,
  },
  setup() {
    const route = useRoute()
    const { t } = useI18n()
    const itemId = ref(route.params.id)
    const item = ref(null)
    const { getItem } = useCrud(COLLECTIONS.RECIPES)

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