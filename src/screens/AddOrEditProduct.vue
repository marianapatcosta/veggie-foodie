<template>
  <layout
    :screenTitle="
      !itemId ? t('products.addProduct') : t('products.editProduct')
    "
    :pageDefaultBackLink="`/tabs/${COLLECTIONS.PRODUCTS}`"
  >
    <add-or-edit-meal-product-form
      :collection="COLLECTIONS.PRODUCTS"
      :itemId="itemId"
      :isEditImage="isEditImage"
    />
  </layout>
</template>

<script>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { AddOrEditMealProductForm } from '../components'
import { COLLECTIONS } from '../utils/constants'

export default {
  components: {
    AddOrEditMealProductForm,
  },
  setup() {
    const route = useRoute()
    const { t } = useI18n()
    const itemId = ref(route.params.id)
    const isEditImage = route.query.isEditImage

    return {
      t,
      itemId,
      isEditImage,
      COLLECTIONS,
    }
  },
}
</script>
