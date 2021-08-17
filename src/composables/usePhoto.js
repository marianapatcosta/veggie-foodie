import { Filesystem, Directory } from '@capacitor/filesystem'
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'
import { showToast } from '../utils/utils'

export const usePhoto = () => {
  const takePhoto = async () => {
    try {
      const newPhoto = await Camera.getPhoto({
        resultType: CameraResultType.Uri,
        source: CameraSource.Prompt, // to open the camera or the file explorer so the user can select one image
        quality: 70, // in %
        correctOrientation: false
        /* allowEditing: true */ // there are bugs using this allowEditing: true : it is not possible to store
        // non-edited image and cannot edit images upload from device, only images capture by the camera
      })
      return newPhoto
    } catch (error) {
      console.error(error)
    }
  }

  const savePhoto = async photo => {
    try {
      const fileName = `${new Date().getTime()}.jpeg`
      const file = await Filesystem.readFile({
        path: photo.path
      })
      const base64Data = file.data
      const savedFile = await Filesystem.writeFile({
        path: fileName,
        data: base64Data, // image.webPath will contain a path that can be set as an image src.
        directory: Directory.Data
      })

      return savedFile.uri
    } catch (error) {
      showToast()
    }
  }

  const deletePhoto = async imageFilePath => {
    try {
      const filename = imageFilePath.substr(imageFilePath.lastIndexOf('/') + 1)
      await Filesystem.deleteFile({
        path: filename,
        directory: Directory.Data
      })
    } catch (error) {
      showToast()
    }
  }
  return { takePhoto, deletePhoto, savePhoto }
}
