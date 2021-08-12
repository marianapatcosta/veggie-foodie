<template>
  <layout :screenTitle="t('recipes.myRecipes')" headerCurved>
    <list collection="recipes" :noData="t('recipes.noRecipes')" />
    <template v-slot:fab-button>
      <add-button link="/recipes/add" />
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
