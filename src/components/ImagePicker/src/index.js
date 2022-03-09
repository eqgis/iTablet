import React from 'react'
import RootSiblings from 'react-native-root-siblings'
import PageKeys from './PageKeys'
import PhotoModalPage from './PhotoModalPage'
import AlbumListView from './AlbumListView'
import AlbumView from './AlbumView'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import ConfigStore from '../../../../src/redux/store'
// import PreviewMultiView from './PreviewMultiView'
const { persistor, store } = ConfigStore()

/**
 * --OPTIONS--
 * maxSize?: number. Camera or Video.
 * sideType?: RNCamera.Constants.Type. Camera or Video.
 * flashMode?: RNCamera.Constants.FlashMode. Camera or Video.
 * pictureOptions?: RNCamera.PictureOptions. Camera.
 * recordingOptions?: RNCamera.RecordingOptions Video.
 * callback: (data: any[]) => void. Donot use Alert.
 */

export const getAlbum = options => showImagePicker(PageKeys.album_list, options)

let sibling = null

function showImagePicker(initialRouteName, options) {
  if (sibling) {
    return null
  }
  sibling = new RootSiblings(
    (
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <PhotoModalPage
            initialRouteName={initialRouteName}
            onDestroy={() => {
              sibling && sibling.destroy()
              sibling = null
            }}
            {...options}
          />
        </PersistGate>
      </Provider>
    ),
  )
}

export function hide () {
  sibling && sibling.destroy()
  sibling = null
}

export {
  PhotoModalPage,
  // PreviewMultiView,
  AlbumListView,
  AlbumView,
}
