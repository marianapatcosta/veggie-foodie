<template>
  <layout :screenTitle="t('meals.myMeals')" headerCurved>
    <list collection="meals" :noData="t('meals.noMeals')" />
    <template v-slot:fab-button>
      <add-button link="/meals/add" />
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
