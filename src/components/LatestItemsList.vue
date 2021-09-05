<template>
  <div class="ion-padding">
    <div class="list-header">
      <h4>{{ title }}</h4>
      <ion-button :router-link="`/tabs/${collection}`" fill="clear"
        >{{ total }}
      </ion-button>
    </div>
    <ion-list v-if="!!items?.length">
      <list-item
        v-for="item in items"
        :key="item.id"
        :item="item"
        :path="collection"
        @share-item="onShareItem"
        @delete-item="onDeleteItem"
      />
    </ion-list>
    <ion-card v-else
      >{{ noData }} <add-button :link="`/${collection}/add`" />
    </ion-card>
  </div>
</template>

<script>
import { IonList, IonCard, IonButton } from '@ionic/vue'
import { useI18n } from 'vue-i18n'
import AddButton from './AddButton.vue'
import ListItem from './ListItem.vue'
import { useCrud } from '../composables/useCrud'
import { onShareItem } from '../utils/utils'
import { COLLECTIONS } from '../utils/constants'
export default {
  components: {
    IonList,
    IonCard,
    IonButton,
    AddButton,
    ListItem,
  },
  props: {
    collection: {
      type: String,
      required: true,
    },
    items: {
      type: Array,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    noData: {
      type: String,
      required: true,
    },
    onConfirmDeleteItem: {
      type: Object,
      required: false,
    },
  },
  setup(props) {
    const { t } = useI18n()
    const { deleteItem } = useCrud(COLLECTIONS[props.collection.toUpperCase()])
    const onDeleteItem = itemToDelete =>
      deleteItem(itemToDelete, props.onConfirmDeleteItem)

    return {
      t,
      onShareItem,
      onDeleteItem,
    }
  },
}
</script>
<style scoped >
h4 {
  color: var(--ion-color-item);
  font-weight: 700 !important;
}
h4,
ion-list {
  margin: 0 !important;
  padding: 0 !important;
}
ion-card {
  width: 100%;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 1rem;
}
ion-button {
  color: var(--ion-color-item);
  font-size: 16px;
}
.list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>