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
