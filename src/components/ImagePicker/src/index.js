import PageKeys from './PageKeys'
import AlbumListView from './AlbumListView'
import AlbumView from './AlbumView'
import * as ImageUtils from './ImageUtils'

export const getAlbum = options => {
  for(let key of Object.keys(options)) {
    AlbumListView.defaultProps[key] = options[key]
  }
  ImageUtils.showImagePicker(PageKeys.album_list, options)
}

function hide() {
  ImageUtils.hide()
}

export {
  AlbumListView,
  AlbumView,
  ImageUtils,
  hide,
}
