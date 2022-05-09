import PageKeys from './PageKeys'
import PhotoModalPage from './PhotoModalPage'
import AlbumListView from './AlbumListView'
import AlbumView from './AlbumView'
import * as ImageUtils from './ImageUtils'

export const getAlbum = options => {
  for(let key of Object.keys(options)) {
    AlbumListView.defaultProps[key] = options[key]
  }
  ImageUtils.showImagePicker(PageKeys.album_list, options)
}

export {
  PhotoModalPage,
  // PreviewMultiView,
  AlbumListView,
  AlbumView,
  ImageUtils,
}
