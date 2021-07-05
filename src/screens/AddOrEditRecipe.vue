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
    saveRecipe(recipe) {
      this.$store.dispatch('addRecipe', recipe)
      this.$router.replace('/recipes')
    },
  },
}
</script>
