<template>
  <layout
    :screenTitle="!itemId ? t('recipes.addRecipe') : t('recipes.editRecipe')"
    :pageDefaultBackLink="`/tabs/${COLLECTIONS.RECIPES}`"
  >
    <add-or-edit-recipe-form
      :collection="COLLECTIONS.RECIPES"
      :itemId="itemId"
    />
  </layout>
</template>

<script>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { AddOrEditRecipeForm } from '../components'
import { COLLECTIONS } from '../utils/constants'

export default {
  components: {
    AddOrEditRecipeForm,
  },
  setup() {
    const route = useRoute()
    const { t } = useI18n()
    const itemId = ref(route.params.id)

    return {
      t,
      itemId,
      COLLECTIONS,
    }
  },
}
</script>
