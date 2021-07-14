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

export const ORDERS = {
  ASC: 'ASC',
  DESC: 'DESC'
}

export const getMealsOrderBy = () => [
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

export const MEALS_ORDER_BY_DEFAULT = 'created'
