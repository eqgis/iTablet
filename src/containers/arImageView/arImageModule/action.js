import { ImagePicker } from '../../../components'
import { SARImage } from 'imobile_for_reactnative'
import { getToolbarModule } from '../../workspace/components/ToolBar/modules/ToolbarModule'

let ToolbarModule = getToolbarModule('AR')

function selectImage() {
  ImagePicker.AlbumListView.defaultProps.showDialog = false
  ImagePicker.AlbumListView.defaultProps.assetType = 'Photos'
  ImagePicker.AlbumListView.defaultProps.groupTypes = 'All'
  ImagePicker.getAlbum({
    maxSize: 1,
    callback: async data => {
      if (data && data.length > 0) {
        let path = data[0].uri
        ToolbarModule.addData({ path: path })
        ToolbarModule.getParams().setToolbarVisible(true, 'ARIMAGEMODULE_add')
      }
    },
  })
}

function addAtCurrent() {
  let { path } = ToolbarModule.getData()
  SARImage.addAtCurrentPosition(path)
  ToolbarModule.getParams().setToolbarVisible(true, 'ARIMAGEMODULE')
}

function addAtPoint() {
  let { path } = ToolbarModule.getData()
  SARImage.setTapAction('ADD')
  SARImage.setImagePath(path)
  SARImage.setPlaneVisible(true)
  SARImage.setOnAddListener(() => {
    ToolbarModule.getParams().setToolbarVisible(true, 'ARIMAGEMODULE')
  })
  ToolbarModule.getParams().setToolbarVisible(true, 'ARIMAGEMODULE_addAtPlane')
}

export default {
  selectImage,
  addAtCurrent,
  addAtPoint,
}
