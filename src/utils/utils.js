export const isImageUrlAHttpUrl = imageUrl =>
  imageUrl.toLowerCase().substr(0, 8) === 'https://' ||
  imageUrl.toLowerCase().substr(0, 7) === 'http://'
