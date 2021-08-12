import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import { alertController, toastController } from '@ionic/vue'
import {
  GET_ITEM_BY_ID_STATEMENT,
  INSERT_ITEM_STATEMENT,
  EDIT_ITEM_STATEMENT,
  DELETE_BY_ID_STATEMENT,
  COUNT_STATEMENT,
  COUNT_STATEMENT_SEARCH,
  GET_ITEMS_STATEMENT,
  GET_ITEMS_STATEMENT_SEARCH
} from '../utils/crud-utils'
import { ITEM_METADATA, ORDERS } from '../utils/constants'

export const useCrud = collection => {
  const router = useRouter()
  const store = useStore()
  const { t } = useI18n()
  const database = store.getters.database

  const { FIELDS } = ITEM_METADATA[collection.toUpperCase()]

  const NUMBER_OF_ITEMS_TO_LOAD = 10
  let firstItemToFetch = 0

  const loadMore = async (orderBy, order, keyword) => {
    try {
      firstItemToFetch += NUMBER_OF_ITEMS_TO_LOAD
      const statement = keyword
        ? GET_ITEMS_STATEMENT_SEARCH(
            collection,
            orderBy,
            order,
            NUMBER_OF_ITEMS_TO_LOAD,
            keyword,
            firstItemToFetch
          )
        : GET_ITEMS_STATEMENT(
            collection,
            orderBy,
            order,
            NUMBER_OF_ITEMS_TO_LOAD,
            firstItemToFetch
          )
      const response = await database.query(statement)
      return response.values
    } catch (error) {
      console.error(error)
    }
  }

  const getLatestItems = async nrItemsToLoad => {
    try {
      const countStatement = COUNT_STATEMENT(collection)
      const statement = GET_ITEMS_STATEMENT(
        collection,
        'created',
        ORDERS.DESC,
        nrItemsToLoad
      )

      const [responseCount, responseMeals] = await Promise.all(
        [countStatement, statement].map(
          async query => await database.query(query)
        )
      )
      return {
        items: responseMeals.values,
        count: responseCount.values[0]['COUNT(*)']
      }
    } catch (error) {
      console.error(error)
    }
  }

  const getItems = async (orderBy, order, keyword) => {
    try {
      firstItemToFetch = 0
      const countStatement = keyword
        ? COUNT_STATEMENT_SEARCH(collection, keyword)
        : COUNT_STATEMENT(collection)
      const statement = keyword
        ? GET_ITEMS_STATEMENT_SEARCH(
            collection,
            orderBy,
            order,
            NUMBER_OF_ITEMS_TO_LOAD,
            keyword
          )
        : GET_ITEMS_STATEMENT(
            collection,
            orderBy,
            order,
            NUMBER_OF_ITEMS_TO_LOAD
          )

      const [responseCount, responseMeals] = await Promise.all(
        [countStatement, statement].map(
          async query => await database.query(query)
        )
      )
      return {
        items: responseMeals.values,
        count: responseCount.values[0]['COUNT(*)']
      }
    } catch (error) {
      console.error(error)
    }
  }

  const getItem = async itemId => {
    if (!itemId) return
    try {
      const statement = GET_ITEM_BY_ID_STATEMENT(collection, itemId)
      const response = await database.query(statement)
      return response.values[0]
    } catch (error) {
      console.error(error)
    }
  }

  const saveItem = async (item, itemId) => {
    try {
      const statement = itemId
        ? EDIT_ITEM_STATEMENT(collection, FIELDS, itemId)
        : INSERT_ITEM_STATEMENT(collection, FIELDS)
      const values = FIELDS.map(field => item[field])
      await database.run(statement, values)
      router.replace(`/tabs/${collection}`)
      const toast = await toastController.create({
        message: !itemId ? t('global.addSuccess') : t('global.editSuccess'),
        duration: 2000,
        color: 'success'
      })
      return toast.present()
    } catch (error) {
      const toast = await toastController.create({
        message: t('global.error'),
        duration: 2000,
        color: 'danger'
      })
      return toast.present()
    }
  }

  const onConfirmDeleteItem = async (itemToDeleteId, onConfirmDelete) => {
    try {
      const statement = DELETE_BY_ID_STATEMENT(collection, itemToDeleteId)
      await database.query(statement)
      await onConfirmDelete()
      const toast = await toastController.create({
        message: t('global.deleteSuccess'),
        duration: 2000,
        color: 'success'
      })
      return toast.present()
    } catch (error) {
      const toast = await toastController.create({
        message: t('global.error'),
        duration: 2000,
        color: 'danger'
      })
      return toast.present()
    }
  }

  const deleteItem = async (itemToDelete, onConfirmDelete) => {
    try {
      const alert = await alertController.create({
        cssClass: 'app-alert',
        header: t('global.delete'),
        message: t('global.confirmDelete', {
          title: `<strong>${itemToDelete.title}</strong>`
        }),
        buttons: [
          {
            text: t('global.cancel'),
            role: 'cancel',
            cssClass: 'secondary'
          },
          {
            text: t('global.ok'),
            handler: () => onConfirmDeleteItem(itemToDelete.id, onConfirmDelete)
          }
        ]
      })
      return alert.present()
    } catch (error) {
      console.error(error)
    }
  }

  return {
    getItems,
    getLatestItems,
    loadMore,
    getItem,
    saveItem,
    deleteItem
  }
}
