import { Capacitor } from '@capacitor/core'
import { Filesystem } from '@capacitor/filesystem'
import { Share } from '@capacitor/share'
import { toastController } from '@ionic/vue'
import { FileSharer } from 'capacitor-plugin-filesharer'
import { i18n } from '../locales'

export const isImageUrlAHttpUrl = imageUrl =>
  imageUrl?.toLowerCase().substr(0, 8) === 'https://' ||
  imageUrl?.toLowerCase().substr(0, 7) === 'http://'

export const isImageFileUrl = imageUrl =>
  imageUrl?.toLowerCase().substr(0, 8) === 'file:///'

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

export const onShareItem = async item => {
  const shareUrl = item.source || item.imageUrl
  try {
    if (!isImageUrlAHttpUrl(shareUrl) && !isImageFileUrl(shareUrl)) {
      return await showToast(i18n.global.t('global.shareError'))
    }

    if (isImageUrlAHttpUrl(shareUrl)) {
      return await Share.share({
        title: i18n.global.t('global.shareTitle'),
        text: item.title,
        url: shareUrl,
        dialogTitle: ''
      })
    }

    // share plugin works for http urls and for file urls if use image.path immediately after taking a photo (with  CameraResultType.Uri)
    // but if the path is saved in the filesystem, the app is killed and got the error in terminal :
    // Android: IllegalArgumentException: Failed to find configured root that contains /data/data/
    // Use FileSharer plugin to share the base64 image data instead of the file url
    const file = await Filesystem.readFile({
      path: shareUrl
    })
    await FileSharer.share({
      filename: 'image.jpeg',
      base64Data: file.data,
      contentType: 'image/jpeg'
    })
  } catch (error) {
    console.error(error)
  }
}
