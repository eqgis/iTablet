// import React from 'react'
import { SMap, SMediaCollector } from 'imobile_for_reactnative'
import { FileTools } from '../../../src/native'
import { ConstPath } from '../../../src/constants'
import { Toast } from '../../../src/utils'
import { getLanguage } from '../../../src/language'
import { ImagePicker } from '../../../src/components'
import ToolbarModule from '../../../src/containers/workspace/components/ToolBar/modules/ToolbarModule'

function tour() {
  (async function() {
    const _params = ToolbarModule.getParams()
    const targetPath = await FileTools.appendingHomeDirectory(
      `${ConstPath.UserPath + _params.user.currentUser.userName}/${
        ConstPath.RelativeFilePath.Media
      }`,
    )
    SMediaCollector.initMediaCollector(targetPath)

    let tourLayer
    ImagePicker.AlbumListView.defaultProps.showDialog = true
    ImagePicker.AlbumListView.defaultProps.dialogConfirm = (
      value = '',
      cb = () => {},
    ) => {
      if (value !== '') {
        (async function() {
          await SMap.setLabelColor()
          const tagginData = await SMap.newTaggingDataset(
            value,
            _params.user.currentUser.userName,
            false, // 轨迹图层都设置为不可编辑
            'tour',
          )
          tourLayer = tagginData.layerName
          cb && cb()
        })()
      }
      Toast.show(value)
    }
    // }

    ImagePicker.AlbumListView.defaultProps.assetType = 'All'
    ImagePicker.AlbumListView.defaultProps.groupTypes = 'All'

    ImagePicker.getAlbum({
      maxSize: 9,
      callback: async data => {
        if (data.length <= 1) {
          Toast.show(
            getLanguage(global.language).Prompt.SELECT_TWO_MEDIAS_AT_LEAST,
          )
          return
        }
        if (tourLayer) {
          const res = await SMediaCollector.addTour(tourLayer, data)
          res.result && (await SMap.setLayerFullView(tourLayer))

          // let _data = ToolbarModule.getData().getData()
          // _params.showFullMap && _params.showFullMap(true)
          // _params.setToolbarVisible(true, 'TourCreateEdit', {
          //   isFullScreen: false,
          //   ..._data,
          // })
        }
      },
    })
  })()
}

export default {
  tour,
}
