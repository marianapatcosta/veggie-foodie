import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { Storage } from '@capacitor/storage'
import { useRouter, useRoute } from 'vue-router'
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth'
import { showToast } from '../utils/utils'

export const useAuth = () => {
  const { t } = useI18n()
  const store = useStore()
  const router = useRouter()
  const route = useRoute()
  const authenticateWithGoogle = async () => {
    try {
      const userData = await GoogleAuth.signIn()
      return onAuthenticationSuccess(userData)
    } catch (error) {
      showToast(t('global.authenticationError'))
    }
  }

  const onAuthenticationSuccess = async userResponse => {
    try {
      const userData = {
        fullName: userResponse.name || userResponse.displayName,
        avatar: userResponse.imageUrl,
        token: userResponse.authentication.idToken/* accessToken */
      }
      await Storage.set({
        key: 'userData',
        value: JSON.stringify(userData)
      })
      store.dispatch('setUserData', userData)
      const currentRoute = route.name
      currentRoute !== 'user' && router.replace('/tabs/home')
    } catch (error) {
      showToast()
    }
  }

  const loadAuthenticatedUser = async () => {
    try {
      const { value: userData } = await Storage.get({
        key: 'userData'
      })
      !!userData && store.dispatch('setUserData', JSON.parse(userData))
    } catch (error) {
      showToast()
    }
  }

  const logout = async () => {
    try {
      store.dispatch('setUserData', null)
      await Storage.remove({ key: 'userData' })
    } catch (error) {
      showToast()
    }
  }

  onMounted(() => {
    GoogleAuth.init()
    loadAuthenticatedUser()
  })

  return { authenticateWithGoogle, logout }
}
