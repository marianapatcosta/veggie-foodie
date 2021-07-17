import { i18n } from '../locales'

export const getThemes = () => [
  {
    theme: 'dark',
    label: i18n.global.t('global.dark')
  },
  {
    theme: 'light',
    label: i18n.global.t('global.light')
  }
]

export const getLanguages = () => [
  {
    locale: 'en',
    label: i18n.global.t('global.english')
  },
  {
    locale: 'pt',
    label: i18n.global.t('global.portuguese')
  }
]

export const COLLECTIONS = {
  MEALS: 'meals',
  RECIPES: 'recipes',
  PRODUCTS: 'products'
}

export const ORDERS = {
  ASC: 'ASC',
  DESC: 'DESC'
}

const getMealsOrderBy = () => [
  {
    value: 'created',
    label: i18n.global.t('global.created')
  },
  {
    value: 'title',
    label: i18n.global.t('global.title')
  },
  {
    value: 'description',
    label: i18n.global.t('global.description')
  },
  {
    value: 'location',
    label: i18n.global.t('global.location')
  },
  {
    value: 'date',
    label: i18n.global.t('global.date')
  }
]
const getRecipesOrderBy = () => [
  {
    value: 'created',
    label: i18n.global.t('global.created')
  },
  {
    value: 'title',
    label: i18n.global.t('global.title')
  },
  {
    value: 'source',
    label: i18n.global.t('global.source')
  }
]

const getProductsOrderBy = () => [
  {
    value: 'created',
    label: i18n.global.t('global.created')
  },
  {
    value: 'title',
    label: i18n.global.t('global.title')
  },
  {
    value: 'description',
    label: i18n.global.t('global.description')
  },
  {
    value: 'store',
    label: i18n.global.t('global.store')
  },
  {
    value: 'date',
    label: i18n.global.t('global.date')
  }
]

export const getItemsOrderBy = {
  meals: getMealsOrderBy,
  recipes: getRecipesOrderBy,
  products: getProductsOrderBy
}

const MEALS_METADATA = {
  FIELDS: ['title', 'description', 'imageUrl', 'location', 'date'],
  ORDER_BY_STORAGE: 'meals-order-by',
  ORDER_STORAGE: 'meals-order',
  ORDER_BY_DEFAULT: 'created'
}

const RECIPES_METADATA = {
  FIELDS: ['title', 'imageUrl', 'ingredients', 'preparation', 'source'],
  ORDER_BY_STORAGE: 'recipes-order-by',
  ORDER_STORAGE: 'recipes-order',
  ORDER_BY_DEFAULT: 'created'
}

const PRODUCTS_METADATA = {
  FIELDS: ['title', 'description', 'imageUrl', 'store', 'date'],
  ORDER_BY_STORAGE: 'products-order-by',
  ORDER_STORAGE: 'products-order',
  ORDER_BY_DEFAULT: 'created'
}

export const ITEM_METADATA = {
  MEALS: MEALS_METADATA,
  RECIPES: RECIPES_METADATA,
  PRODUCTS: PRODUCTS_METADATA
}
