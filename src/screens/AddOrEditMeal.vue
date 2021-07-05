<template>
  <layout
    :screenTitle="!mealId ? $t('meals.addMeal') : $t('meals.editMeal')"
    pageDefaultBackLink="/tabs/meals"
  >
    <add-or-edit-meal-form :meal="meal" @save-meal="saveMeal" />
  </layout>
</template>

<script>
import { AddOrEditMealForm } from '../components'

export default {
  components: {
    AddOrEditMealForm,
  },
  data() {
    return {
      mealId: this.$route.params.id,
    }
  },
  computed: {
    meal() {
      return this.$store.getters.meal(this.mealId)
    },
  },
  methods: {
    saveMeal(meal) {
      !this.mealId
        ? this.$store.dispatch('addMeal', meal)
        : this.$store.dispatch('editMeal', { mealId: this.mealId, meal })
      this.$router.replace('/meals')
    },
  },
}
</script>
