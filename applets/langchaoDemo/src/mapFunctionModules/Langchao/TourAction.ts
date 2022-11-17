// import React from 'react'
import { SMap, SMediaCollector } from 'imobile_for_reactnative'
import { FileTools } from '@/native'
import { ConstPath } from '@/constants'
import { Toast } from '@/utils'
import { getLanguage } from '@/language'
import { ImagePicker } from '@/components'
import ToolbarModule from '@/containers/workspace/components/ToolBar/modules/ToolbarModule'
import { MediaData } from 'imobile_for_reactnative/types/interface/collector/SMediaCollector'

/**
 * 右侧创建轨迹事件
 */
async function tour() {
  try {
    await SMap.checkCurrentModule()
    const _params: any = ToolbarModule.getParams()
    const targetPath = await FileTools.appendingHomeDirectory(
      `${ConstPath.UserPath + _params.user.currentUser.userName}/${
        ConstPath.RelativeFilePath.Media
      }`,
    )
    SMediaCollector.initMediaCollector(targetPath)

    let tourLayer: string
    ImagePicker.AlbumListView.defaultProps.showDialog = true
    ImagePicker.AlbumListView.defaultProps.dialogConfirm = async (
      value = '',
      cb = () => {},
    ) => {
      try {
        if (value !== '') {
          await SMap.setLabelColor()
          const tagginData = await SMap.newTaggingDataset(
            value,
            _params.user.currentUser.userName,
            false, // 轨迹图层都设置为不可编辑
            'tour',
          )
          tourLayer = tagginData.layerName
          cb && cb()
        }
        Toast.show(value)
      } catch (error: any) {
        if (error?.code === 'INVALID_MODULE') {
          ImagePicker.hide()
        }
      }
    }

    ImagePicker.AlbumListView.defaultProps.assetType = 'All'
    ImagePicker.AlbumListView.defaultProps.groupTypes = 'All'

    ImagePicker.getAlbum({
      maxSize: 9,
      callback: async (data: MediaData[]) => {
        if (data.length <= 1) {
          Toast.show(
            getLanguage(global.language).Prompt.SELECT_TWO_MEDIAS_AT_LEAST,
          )
          return
        }
        if (tourLayer) {
          const res = await SMediaCollector.addTour(tourLayer, data)
          res.result && (await SMap.setLayerFullView(tourLayer))
        }
      },
    })
  } catch(e) {
    __DEV__ && console.warn(e)
  }
}

export default {
  tour,
}
