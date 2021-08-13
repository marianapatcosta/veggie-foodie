import { ref } from 'vue'
import { Storage } from '@capacitor/storage'
import { ORDERS, ITEM_METADATA } from '../utils/constants'
import { showToast } from '../utils/utils'

export const useSortSettings = collection => {
  const { ORDER_STORAGE, ORDER_BY_STORAGE, ORDER_BY_DEFAULT } = ITEM_METADATA[
    collection.toUpperCase()
  ]

  const orderBy = ref(ORDER_BY_DEFAULT)
  const order = ref(ORDERS.DESC)

  const getSortSettings = async () => {
    try {
      const storageKeys = [ORDER_STORAGE, ORDER_BY_STORAGE]
      const [
        { value: orderValue },
        { value: orderByValue }
      ] = await Promise.all(
        storageKeys.map(
          async key =>
            await Storage.get({
              key
            })
        )
      )
      order.value = orderValue || ORDERS.DESC
      orderBy.value = orderByValue || ORDER_BY_DEFAULT
    } catch (error) {
      showToast()
    }
  }

  const updateOrder = async () => {
    try {
      order.value = order.value === ORDERS.ASC ? ORDERS.DESC : ORDERS.ASC
      await Storage.set({
        key: ORDER_STORAGE,
        value: order.value
      })
    } catch (error) {
      showToast()
    }
  }

  const updateOrderBy = async value => {
    try {
      orderBy.value = value
      await Storage.set({
        key: ORDER_BY_STORAGE,
        value: orderBy.value
      })
    } catch (error) {
      showToast()
    }
  }

  return {
    getSortSettings,
    updateOrder,
    updateOrderBy,
    orderBy,
    order
  }
}
