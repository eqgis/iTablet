import { ImagePicker } from '../../../components'
import { SARVideoView } from 'imobile_for_reactnative'
import { getToolbarModule } from '../../workspace/components/ToolBar/modules/ToolbarModule'

let ToolbarModule = getToolbarModule('AR')

function selectVideo() {
  ImagePicker.AlbumListView.defaultProps.showDialog = false
  ImagePicker.AlbumListView.defaultProps.assetType = 'Videos'
  ImagePicker.AlbumListView.defaultProps.groupTypes = 'All'
  ImagePicker.getAlbum({
    maxSize: 1,
    callback: async data => {
      if (data && data.length > 0) {
        let path = data[0].uri
        ToolbarModule.addData({ path: path })
        ToolbarModule.getParams().setToolbarVisible(
          true,
          'SM_ARVIDEOMODULE_add',
        )
      }
    },
  })
}

function addAtCurrent() {
  let { path } = ToolbarModule.getData()
  SARVideoView.addAtCurrentPosition(path)
  ToolbarModule.getParams().setToolbarVisible(true, 'SM_ARVIDEOMODULE')
}

function addAtPoint() {
  let { path } = ToolbarModule.getData()
  SARVideoView.setTapAction('ADD')
  SARVideoView.setVideoPath(path)
  SARVideoView.setPlaneVisible(true)
  SARVideoView.setOnAddListener(() => {
    ToolbarModule.getParams().setToolbarVisible(true, 'SM_ARVIDEOMODULE')
  })
  ToolbarModule.getParams().setToolbarVisible(
    true,
    'SM_ARVIDEOMODULE_addAtPlane',
  )
}

export default {
  selectVideo,
  addAtCurrent,
  addAtPoint,
}
