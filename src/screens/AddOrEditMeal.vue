<template>
  <layout
    :screenTitle="!mealId ? t('meals.addMeal') : t('meals.editMeal')"
    pageDefaultBackLink="/tabs/meals"
  >
    <add-or-edit-meal-form :meal="meal" @save-meal="saveMeal" />
  </layout>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { toastController } from '@ionic/vue'
import { AddOrEditMealForm } from '../components'

export default {
  components: {
    AddOrEditMealForm,
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const store = useStore()
    const { t } = useI18n()

    const meal = ref(null)
    const mealId = ref(route.params.id)
    const database = store.getters.database

    const fetchMeal = async () => {
      try {
        const statement = `SELECT * FROM meals WHERE id = ${mealId.value};`
        const response = await database.query(statement)
        meal.value = response.values[0]
      } catch (error) {
        console.error(error)
      }
    }

    const saveMeal = async meal => {
      try {
        const { title, description, imageUrl, location, date } = meal
        // `UPDATE meals SET (title, description, imageUrl, location, date) VALUES(?, ?, ?, ?, ?) WHERE id = ${mealId}`
        const statement = mealId.value
          ? `UPDATE meals SET title = ?, description = ?, imageUrl = ?, location = ?, date = ?  WHERE id = ${mealId.value}`
          : 'INSERT INTO meals (title, description, imageUrl, location, date) VALUES(?, ?, ?, ?, ?);'
        const values = [title, description, imageUrl, location, date]
        await database.run(statement, values)
        router.replace('/tabs/meals')
        const toast = await toastController.create({
          message: !mealId.value
            ? t('global.addSuccess', {
                item: t('meals.meal'),
              })
            : t('global.editSuccess', {
                item: t('meals.meal'),
              }),
          duration: 2000,
          color: 'success',
        })
        return toast.present()
      } catch (error) {
        const toast = await toastController.create({
          message: t('global.error'),
          duration: 2000,
          color: 'danger',
        })
        return toast.present()
      }
    }

    onMounted(fetchMeal)

    return {
      t,
      mealId,
      meal,
      saveMeal,
    }
  },
}
</script>
