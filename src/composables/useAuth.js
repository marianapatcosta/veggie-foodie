import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { Storage } from '@capacitor/storage'
import { showToast } from '../utils/utils'
import { useRouter, useRoute } from 'vue-router'

export const useAuth = () => {
  const { t } = useI18n()
  const store = useStore()
  const router = useRouter()
  const route = useRoute()
  const googleApiClient = window.gapi
  const authenticateWithGoogle = async () => {
    try {
      // Authorization scopes required by the API; multiple scopes can be
      // included, separated by spaces.
      const SCOPES = 'https://www.googleapis.com/auth/userinfo.profile'
      googleApiClient.load('client:auth2', async () => {
        await googleApiClient.client.init({
          apiKey: process.env.VUE_APP_GOOGLE_API_KEY,
          clientId: process.env.VUE_APP_OAUTH_CLIENT_ID,
          scope: SCOPES
        })

        if (googleApiClient.auth2.getAuthInstance().isSignedIn.get()) {
          const userData = googleApiClient.auth2
            .getAuthInstance()
            .currentUser.get()
          return onAuthenticationSuccess(userData)
        }
        await googleApiClient.auth2.getAuthInstance().signIn()
        const userData = googleApiClient.auth2
          .getAuthInstance()
          .currentUser.get()
        return onAuthenticationSuccess(userData)
      })
    } catch (error) {
      showToast(t('global.authenticationError'))
    }
  }

  const onAuthenticationSuccess = async userResponse => {
    try {
      const userData = {
        fullName: userResponse.Ts.Ne,
        avatar: userResponse.Ts.hJ,
        token: `${userResponse.Zb.token_type} ${userResponse.Zb.access_token}`
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
      googleApiClient.auth2.getAuthInstance().signOut()
      store.dispatch('setUserData', null)
      await Storage.remove({ key: 'userData' })
    } catch (error) {
      showToast()
    }
  }

  return { authenticateWithGoogle, loadAuthenticatedUser, logout }
}
