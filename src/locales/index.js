import { createI18n } from 'vue-i18n'
import en from './en.json'
import pt from './pt.json'

export const defaultLocale = 'en'

export const messages = {
  en,
  pt
}

export const i18n = createI18n({
  locale: defaultLocale,
  fallbackLocale: 'en',
  messages
})

export const getLanguages = () => ([
  {
    locale: 'en',
    label: i18n.global.t('global.english')
  },
  {
    locale: 'pt',
    label: i18n.global.t('global.portuguese')
  }
])
