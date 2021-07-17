<template>
  <layout :screenTitle="t('meals.myMeals')">
    <div class="filter-options">
      <ion-searchbar
        color="secondary"
        v-model="keyword"
        :placeholder="t('global.search')"
        @ionChange="fetchItems"
        :style="{
          flex: 1,
        }"
      />
      <ion-item class="select-wrapper" lines="none">
        <ion-label :style="{ display: 'none' }">{{
          t('global.orderBy')
        }}</ion-label>
        <ion-select
          :interface-options="customAlertOptions"
          :value="orderBy"
          :ok-text="t('global.ok')"
          :cancel-text="t('global.cancel')"
          @ionChange="updateItemsOrderBy"
        >
          <ion-select-option
            v-for="option in orderByOptions"
            :key="`language-${option.value}`"
            :value="option.value"
            >{{ option.label }}</ion-select-option
          >
        </ion-select>
      </ion-item>
      <ion-buttons>
        <ion-button
          class="icon-button--clear"
          fill="clear"
          @click.prevent="updateItemsOrder"
        >
          <ion-icon
            :style="{ color: 'var(--ion-color-item)' }"
            :icon="swapVertical"
            slot="icon-only"
          />
        </ion-button>
      </ion-buttons>
    </div>
    <div class="ion-padding" v-if="!!items?.length">
      <ion-list>
        <ion-refresher slot="fixed" @ionRefresh="fetchItems">
          <ion-refresher-content />
        </ion-refresher>
        <list-item
          v-for="item in items"
          :key="item.id"
          :item="item"
          :path="collection"
          @edit-item="onEditItem"
          @delete-item="onDeleteItem"
        />
      </ion-list>
      <ion-infinite-scroll
        @ionInfinite="loadMoreItems"
        threshold="100px"
        :disabled="isInfiniteScrollDisabled"
      >
        <ion-infinite-scroll-content loading-spinner="bubbles">
        </ion-infinite-scroll-content>
      </ion-infinite-scroll>
    </div>
    <ion-card v-else>{{ t('meals.noMeals') }}</ion-card>
    <template v-slot:fab-button>
      <ion-fab-button :router-link="`/${collection}/add`" color="secondary">
        <ion-icon :icon="add" />
      </ion-fab-button>
    </template>
  </layout>
</template>

<script>
import {
  IonList,
  IonFabButton,
  IonIcon,
  IonSearchbar,
  IonCard,
  IonRefresher,
  IonRefresherContent,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonSelect,
  IonSelectOption,
  IonItem,
  IonLabel,
  IonButton,
  IonButtons,
} from '@ionic/vue'
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { add, swapVertical } from 'ionicons/icons'
import { ListItem } from '../components'
import { COLLECTIONS, getMealsOrderBy } from '../utils/constants'
import { useCrud } from '../composables/useCrud'
import { useSortSettings } from '../composables/useSortSettings'
export default {
  components: {
    ListItem,
    IonList,
    IonFabButton,
    IonIcon,
    IonSearchbar,
    IonCard,
    IonRefresher,
    IonRefresherContent,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonSelect,
    IonSelectOption,
    IonItem,
    IonLabel,
    IonButton,
    IonButtons,
  },
  /*  props: {
    collection: {
      type: String,
      required: true
    }
  }, */
  setup() {
    const collection = 'meals'
    const route = useRoute()
    const router = useRouter()
    const { t } = useI18n()
    const { getItems, loadMore, deleteItem } = useCrud(COLLECTIONS.MEALS)

    const { getSortSettings, updateOrderBy, updateOrder, orderBy, order } =
      useSortSettings(COLLECTIONS.MEALS)

    const items = ref([
      /*  {
        id: 'm1',
        date: '2021-06-20T20:11:06.368Z',
        title: 'A trip to Lisbon',
        location: 'Lisbon, Portugal',
        description: 'Very nice trip! Walked a lot!!!!',
        imageUrl: '',
      },
      {
        id: 'm2',
        date: '2021-01-12T11:11:06.368Z',
        location: 'Porto, Portugal',
        title: 'A visit to the garden',
        description: 'Always nice to feel mother nature!',
        imageUrl:
          'https://yachtdouro.pt/wp-content/uploads/2018/03/yachtdouro-sunset-900x600.jpg',
      }, */
    ])
    const keyword = ref('')
    const isInfiniteScrollDisabled = ref(false)
    const totalItemsCount = ref(0)
    const customAlertOptions = ref({ cssClass: 'app-alert list-alert' })

    const orderByOptions = computed(getMealsOrderBy)

    const updateItemsOrder = async () => {
      try {
        await updateOrder()
        await fetchItems()
      } catch (error) {
        console.error(error)
      }
    }

    const updateItemsOrderBy = async event => {
      try {
        await updateOrderBy(event.target.value)
        await fetchItems()
      } catch (error) {
        console.error(error)
      }
    }

    const fetchItems = async () => {
      try {
        const { items: fetchedItems, count } = await getItems(
          orderBy.value,
          order.value,
          keyword.value
        )
        items.value = fetchedItems
        totalItemsCount.value = count
        console.log({ items, totalItemsCount, fetchedItems })
      } catch (error) {
        console.error(error)
      }
    }

    const loadMoreItems = async () => {
      try {
        const fetchedItems = await loadMore(orderBy.value, order.value, keyword.value)
        items.value = [...items.value, ...fetchedItems]

        if (items.value.length >= totalItemsCount.value) {
          isInfiniteScrollDisabled.value = true
        }
      } catch (error) {
        console.error(error)
      }
    }

    const onEditItem = id => router.push(`/${collection}/edit/${id}`)

    const onDeleteItem = (itemToDelete) => {
      deleteItem(itemToDelete, fetchItems)
    }

    watch(route, () => {
      isInfiniteScrollDisabled.value = false
      fetchItems()
    })

    onMounted(async () => {
      await getSortSettings()
      await fetchItems()
    })
    return {
      t,
      add,
      swapVertical,
      items,
      keyword,
      isInfiniteScrollDisabled,
      totalItemsCount,
      customAlertOptions,
      orderBy,
      order,
      orderByOptions,
      collection,
      updateItemsOrder,
      updateItemsOrderBy,
      loadMoreItems,
      onEditItem,
      fetchItems,
      onDeleteItem,
    }
  },
}
</script>
<style >
.filter-options {
  display: flex;
  align-items: center;
  margin: 1rem;
  margin-bottom: 0.5rem;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2),
    0 1px 5px 0 rgba(0, 0, 0, 0.12);
}
.list-alert .alert-message {
  display: none;
}
.select-wrapper {
  --background: var(--ion-color-secondary);
}
.in-item {
  max-width: 100% !important;
}
</style>