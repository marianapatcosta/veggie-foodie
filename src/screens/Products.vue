<template>
  <layout :screenTitle="t('products.myProducts')" headerCurved>
    <list collection="products" :noData="t('products.noProducts')" />
    <template v-slot:header-right>
      <add-button link="/products/add" />
    </template>
  </layout>
</template>

<script>
import { useI18n } from 'vue-i18n'
import { AddButton, List } from '../components'
export default {
  components: {
    AddButton,
    List,
  },
  setup() {
    const { t } = useI18n()
    return { t }
  },
}
</script>
