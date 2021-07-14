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

