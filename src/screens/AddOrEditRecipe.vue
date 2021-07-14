<template>
  <layout screenTitle="Add a Recipe" pageDefaultBackLink="/recipes">
    <add-or-edit-recipe-form @save-recipe="saveRecipe" />
  </layout>
</template>

<script>
import { AddOrEditRecipeForm } from '../components'

export default {
  components: {
    AddOrEditRecipeForm,
  },
  methods: {
    data() {
      return {
        recipeId: this.$route.params.id,
      }
    },
    
  },
}
</script>
