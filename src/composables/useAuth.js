import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { Storage } from '@capacitor/storage'
import { useRouter, useRoute } from 'vue-router'
import { showToast } from '../utils/utils'
import { OAuth2Client } from '@byteowls/capacitor-oauth2'

export const useAuth = () => {
  const { t } = useI18n()
  const store = useStore()
  const router = useRouter()
  const route = useRoute()
  const authenticateWithGoogle = async () => {
    const oauth2Options = {
      authorizationBaseUrl: 'https://accounts.google.com/o/oauth2/auth',
      accessTokenEndpoint: 'https://www.googleapis.com/oauth2/v4/token',
      scope: 'email profile',
      resourceUrl: 'https://www.googleapis.com/userinfo/v2/me',
      logsEnabled: true,
      web: {
        appId: process.env.VUE_APP_OAUTH_CLIENT_ID_WEB,
        responseType: 'token',
        accessTokenEndpoint: '',
        redirectUrl: 'http://localhost:8100',
        windowOptions: 'height=600,left=0,top=0'
      },
      android: {
        appId: process.env.VUE_APP_OAUTH_CLIENT_ID,
        responseType: 'code',
        redirectUrl: 'io.costa.mariana.veggie.foodie:/'
      },
      ios: {
        appId: process.env.VUE_APP_OAUTH_CLIENT_ID,
        responseType: 'code',
        redirectUrl: 'io.costa.mariana.veggie.foodie:/'
      }
    }
    try {
      const userData = await OAuth2Client.authenticate(oauth2Options)
      return onAuthenticationSuccess(userData)
    } catch (error) {
      showToast(t('global.authenticationError'))
    }
  }

  const onAuthenticationSuccess = async userResponse => {
    try {
      const userData = {
        fullName: userResponse.name || userResponse.displayName,
        avatar: userResponse.picture,
        accessToken: userResponse.access_token,
        refreshToken: userResponse.authorization_response?.refresh_token
      }
      await Storage.set({
        key: 'userData',
        value: JSON.stringify(userData)
      })
      await Storage.set({
        key: 'alreadyLaunched',
        value: JSON.stringify(true)
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
      await OAuth2Client.logout()
      store.dispatch('setUserData', null)
      await Storage.remove({ key: 'userData' })
      await Storage.remove({ key: 'alreadyLaunched' })
    } catch (error) {
      showToast()
    }
  }

  return { authenticateWithGoogle, loadAuthenticatedUser, logout }
}
