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
      showToast()
    }
  }

  const savePhoto = async (photo, fileName) => {
    try {
      const file = await Filesystem.readFile({
        path: photo.path
      })
      const base64Data = file.data
      const savedFile = await Filesystem.writeFile({
        path: fileName,
        data: base64Data,
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
