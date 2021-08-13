import { Capacitor } from '@capacitor/core'
import { Share } from '@capacitor/share'
import { toastController } from '@ionic/vue'
import { i18n } from '../locales'

export const isImageUrlAHttpUrl = imageUrl =>
  imageUrl?.toLowerCase().substr(0, 8) === 'https://' ||
  imageUrl?.toLowerCase().substr(0, 7) === 'http://'

// 'file://' path to HTTP
export const convertFilePathToHttp = fileUri =>
  fileUri && Capacitor.convertFileSrc(fileUri)

export const showToast = async (message, color, duration) => {
  const toast = await toastController.create({
    message: message || i18n.global.t('global.error'),
    duration: duration || 2000,
    color: color || 'danger'
  })
  toast.present()
}

const getShareUrl = item => {
  if (item.source) {
    return item.source
  }
  return isImageUrlAHttpUrl(item.imageUrl)
    ? item.imageUrl
    : convertFilePathToHttp(item.imageUrl)
}

export const onShareItem = async item => {
  const shareUrl = getShareUrl(item)
  if (!isImageUrlAHttpUrl(shareUrl)) {
    return await showToast(i18n.global.t('global.shareError'))
  }
  try {
    await Share.share({
      title: i18n.global.t('global.shareTitle'),
      text: item.title,
      url: shareUrl,
      dialogTitle: ''
    })
  } catch (error) {
    console.error(error)
  }
}
