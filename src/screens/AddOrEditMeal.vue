<template>
  <layout
    :screenTitle="!mealId ? t('meals.addMeal') : t('meals.editMeal')"
    pageDefaultBackLink="/tabs/meals"
  >
    <add-or-edit-meal-form :meal="meal" @save-meal="onSaveItem" />
  </layout>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useCrud } from '../composables/useCrud'
import { AddOrEditMealForm } from '../components'
import { COLLECTIONS } from '../utils/constants'

export default {
  components: {
    AddOrEditMealForm,
  },
  setup() {
    const route = useRoute()
    const { t } = useI18n()
    const { getItem, saveItem } = useCrud(COLLECTIONS.MEALS)
    const meal = ref(null)
    const mealId = ref(route.params.id)

    const onSaveItem = meal => {
      saveItem(meal, mealId.value)
    }

    onMounted(async () => {
      const mealResponseData = await getItem(mealId.value)
      meal.value = mealResponseData
    })

    return {
      t,
      mealId,
      meal,
      onSaveItem,
    }
  },
}
</script>
