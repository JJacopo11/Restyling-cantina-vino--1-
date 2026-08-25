import { createI18n } from 'vue-i18n'
import { messages } from '~/i18n/messages'

export default defineNuxtPlugin(({ vueApp }) => {
  const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: 'it',
    fallbackLocale: 'it',
    messages
  })
  vueApp.use(i18n)
})
