<template>
  <layout
    :screenTitle="!mealId ? $t('meals.addMeal') : $t('meals.editMeal')"
    pageDefaultBackLink="/tabs/meals"
  >
    <add-or-edit-meal-form :meal="meal" @save-meal="saveMeal" />
  </layout>
</template>

<script>
import { toastController } from '@ionic/vue'
import { AddOrEditMealForm } from '../components'

export default {
  components: {
    AddOrEditMealForm,
  },
  data() {
    return {
      database: this.$store.getters.database,
      mealId: this.$route.params.id,
      meal: null,
    }
  },
  methods: {
    async fetchMeal() {
      try {
        const statement = `SELECT * FROM meals WHERE id = ${this.mealId};`
        const response = await this.database.query(statement)
        this.meal = response.values[0]
      } catch (error) {
        console.error(error)
      }
    },
    async saveMeal(meal) {
      try {
        const { title, description, imageUrl, location, date } = meal
        // `UPDATE meals SET (title, description, imageUrl, location, date) VALUES(?, ?, ?, ?, ?) WHERE id = ${this.mealId}`
        const statement = this.mealId
          ? `UPDATE meals SET title = ?, description = ?, imageUrl = ?, location = ?, date = ?  WHERE id = ${this.mealId}`
          : 'INSERT INTO meals (title, description, imageUrl, location, date) VALUES(?, ?, ?, ?, ?);'
        const values = [title, description, imageUrl, location, date]
         await this.database.run(statement, values)
        this.$router.replace('/tabs/meals')
        const toast = await toastController.create({
          message: !this.mealId
            ? this.$t('global.addSuccess', {
            item: this.$t('meals.meal'),
          })
            : this.$t('global.editSuccess', {
            item: this.$t('meals.meal'),
          }),
          duration: 2000,
          color: 'success',
        })
        return toast.present()
      } catch (error) {
        const toast = await toastController.create({
          message: this.$t('global.error'),
          duration: 2000,
          color: 'danger',
        })
        return toast.present()
      }
    },
  },
  mounted() {
    this.fetchMeal()
  },
}
</script>
