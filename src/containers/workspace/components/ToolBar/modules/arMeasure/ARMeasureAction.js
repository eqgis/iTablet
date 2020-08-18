import ToolbarModule from '../ToolbarModule'
import { SMeasureView, SMap } from 'imobile_for_reactnative'
import { Toast, LayerUtils } from '../../../../../../utils'
import { getLanguage } from '../../../../../../language'
import NavigationService from '../../../../../NavigationService'

import { FileTools } from '../../../../../../native'
import { ConstPath } from '../../../../../../constants'
import FetchUtils from '../../../../../../utils/FetchUtils'

function close() {}

function memu() {}

function showMenuBox() {}

function commit() {}

// 高精度采集
function collectSceneForm() {
  (async function() {
    const _params = ToolbarModule.getParams()
    const isSupportedARCore = await SMeasureView.isSupportedARCore()
    if (!isSupportedARCore) {
      Toast.show(getLanguage(_params.language).Prompt.DONOT_SUPPORT_ARCORE)
      return
    }

    GLOBAL.toolBox && GLOBAL.toolBox.removeAIDetect(true)
    if (GLOBAL.showAIDetect) {
      GLOBAL.isswitch = true
      ;(await GLOBAL.toolBox) && GLOBAL.toolBox.switchAr()
    }

    // let time = await SCollectSceneFormView.getSystemTime()
    // GLOBAL.mapView.setState({ map: { height: 0 } })
    // GLOBAL.newcollectData = time
    // const datasourceAlias = time
    // const datasetName = 'CollectSceneForm'
    // const datasetPointName = 'CollectPointSceneForm'
    // NavigationService.navigate('CollectSceneFormView', {
    //   datasourceAlias,
    //   datasetName,
    //   datasetPointName,
    // })

    GLOBAL.EnterDatumPointType = 'arCollectSceneForm'
    NavigationService.navigate('EnterDatumPoint')

    // NavigationService.navigate('InputPage', {
    //   headerTitle: getLanguage(global.language).Map_Main_Menu
    //     .MAP_AR_AI_ASSISTANT_NEWDATA,
    //   value: '',
    //   placeholder: getLanguage(global.language).Map_Main_Menu
    //     .MAP_AR_AI_ASSISTANT_SCENE_NEW_DATANAME,
    //   type: 'name',
    //   cb: async value => {
    //     NavigationService.goBack()
    //   },
    //   backcb: () => {
    //     NavigationService.goBack()
    //     if (GLOBAL.isswitch) {
    //       GLOBAL.isswitch = false
    //       GLOBAL.toolBox && GLOBAL.toolBox.switchAr()
    //     }
    //   },
    // })
  })()
}

// 户型图采集
function arMeasureCollect() {
  (async function() {
    const _params = ToolbarModule.getParams()
    const isSupportedARCore = await SMeasureView.isSupportedARCore()
    if (!isSupportedARCore) {
      Toast.show(getLanguage(_params.language).Prompt.DONOT_SUPPORT_ARCORE)
      return
    }
    let currentLayer = GLOBAL.currentLayer
    let isTaggingLayer = false
    if (currentLayer) {
      let layerType = LayerUtils.getLayerType(currentLayer)
      isTaggingLayer = layerType === 'TAGGINGLAYER'
    }
    if (!isTaggingLayer) {
      let hasDefaultTagging = await SMap.hasDefaultTagging(
        _params.user.currentUser.userName,
      )
      if (!hasDefaultTagging) {
        let data = await SMap.newTaggingDataset(
          'Default_Tagging',
          _params.user.currentUser.userName,
        )
        GLOBAL.TaggingDatasetName = data && data.datasetName
      }
      let datasourceAlias = 'Label_' + _params.user.currentUser.userName + '#'
      let datasetName = 'Default_Tagging'
      GLOBAL.MeasureCollectData = {
        datasourceAlias,
        datasetName,
      }
    } else {
      const datasourceAlias = currentLayer.datasourceAlias // 标注数据源名称
      const datasetName = currentLayer.datasetName // 标注图层名称
      GLOBAL.MeasureCollectData = {
        datasourceAlias,
        datasetName,
      }
    }

    // NavigationService.navigate('MeasureView', GLOBAL.MeasureCollectData)
    GLOBAL.EnterDatumPointType = 'arMeasureCollect'
    NavigationService.navigate('EnterDatumPoint')

    GLOBAL.toolBox && GLOBAL.toolBox.removeAIDetect(true)
    if (GLOBAL.showAIDetect) {
      GLOBAL.isswitch = true
      ;(await GLOBAL.toolBox) && GLOBAL.toolBox.switchAr()
    }
  })()
}

// AR投射
function arCastModelOperate() {
  (async function() {
    const _params = ToolbarModule.getParams()
    if (GLOBAL.isProjectModelDownload) {
      this.homePath = await FileTools.appendingHomeDirectory()
      const dustbinPath =
        `${this.homePath + ConstPath.Common_AIProjectModel}gltf` +
        '/' +
        'gltf/' +
        'ship.glb'
      const isDustbin = await FileTools.fileIsExist(dustbinPath)

      if (isDustbin) {
        const _params = ToolbarModule.getParams()
        const isSupportedARCore = await SMeasureView.isSupportedARCore()
        if (!isSupportedARCore) {
          Toast.show(getLanguage(_params.language).Prompt.DONOT_SUPPORT_ARCORE)
          return
        }

        GLOBAL.toolBox && GLOBAL.toolBox.removeAIDetect(true)
        if (GLOBAL.showAIDetect) {
          GLOBAL.isswitch = true
          ;(await GLOBAL.toolBox) && GLOBAL.toolBox.switchAr()
        }
        NavigationService.navigate('ARProjectModeView')
      } else {
        GLOBAL.isProjectModelDownload = false
        const downloadData = getDownloadData('gltf', 'gltf')
        _downloadData(downloadData)
        Toast.show(getLanguage(_params.language).Prompt.DOWNLOADING_PLEASE_WAIT)
      }
    } else {
      Toast.show(getLanguage(_params.language).Prompt.DOWNLOADING_PLEASE_WAIT)
    }
  }.bind(this)())
}

function getDownloadData(key, fileName) {
  const cachePath = this.homePath + ConstPath.CachePath
  const toPath = this.homePath + ConstPath.Common_AIProjectModel + fileName
  return {
    key,
    fileName,
    cachePath,
    copyFilePath: toPath,
  }
}

function _downloadData(downloadData) {
  (async function() {
    const _params = ToolbarModule.getParams()
    const keyword = downloadData.fileName
    const dataUrl = await FetchUtils.getFindUserDataUrl(
      'xiezhiyan123',
      keyword,
      '.zip',
    )
    const { cachePath } = downloadData
    const fileDirPath = downloadData.copyFilePath
    const fileCachePath = `${cachePath + downloadData.fileName}.zip`
    await FileTools.deleteFile(fileCachePath)
    try {
      const downloadOptions = {
        fromUrl: dataUrl,
        toFile: fileCachePath,
        background: true,
        fileName: downloadData.fileName,
        progressDivider: 1,
        key: downloadData.key,
      }
      _params
        .downloadFile(downloadOptions)
        .then(async () => {
          await FileTools.unZipFile(fileCachePath, fileDirPath)
          await FileTools.deleteFile(fileCachePath)
          _params.deleteDownloadFile({ id: 'gltf' })
          GLOBAL.isProjectModelDownload = true
          Toast.show(getLanguage(_params.language).Prompt.DOWNLOAD_SUCCESSFULLY)
        })
        .catch(() => {
          Toast.show(getLanguage(_params.language).Prompt.NETWORK_ERROR)
          FileTools.deleteFile(fileCachePath)
        })
    } catch (e) {
      Toast.show(getLanguage(_params.language).Prompt.NETWORK_ERROR)
      // '网络错误，下载失败'
      FileTools.deleteFile(fileCachePath)
    }
  })()
}

// AR测量面积
function arMeasureArea() {
  (async function() {
    const _params = ToolbarModule.getParams()
    const isSupportedARCore = await SMeasureView.isSupportedARCore()
    if (!isSupportedARCore) {
      Toast.show(getLanguage(_params.language).Prompt.DONOT_SUPPORT_ARCORE)
      return
    }

    GLOBAL.toolBox && GLOBAL.toolBox.removeAIDetect(true)
    if (GLOBAL.showAIDetect) {
      GLOBAL.isswitch = true
      ;(await GLOBAL.toolBox) && GLOBAL.toolBox.switchAr()
    }
    NavigationService.navigate('MeasureAreaView', {
      measureType: 'measureArea',
    })
  })()
}

// AR测量距离
function arMeasureLength() {
  (async function() {
    const _params = ToolbarModule.getParams()
    const isSupportedARCore = await SMeasureView.isSupportedARCore()
    if (!isSupportedARCore) {
      Toast.show(getLanguage(_params.language).Prompt.DONOT_SUPPORT_ARCORE)
      return
    }

    GLOBAL.toolBox && GLOBAL.toolBox.removeAIDetect(true)
    if (GLOBAL.showAIDetect) {
      GLOBAL.isswitch = true
      ;(await GLOBAL.toolBox) && GLOBAL.toolBox.switchAr()
    }
    NavigationService.navigate('MeasureAreaView', {
      measureType: 'measureLength',
    })
  })()
}

// AR测量距离
function arMeasureHeight() {
  (async function() {
    const _params = ToolbarModule.getParams()
    const isSupportedARCore = await SMeasureView.isSupportedARCore()
    if (!isSupportedARCore) {
      Toast.show(getLanguage(_params.language).Prompt.DONOT_SUPPORT_ARCORE)
      return
    }

    GLOBAL.toolBox && GLOBAL.toolBox.removeAIDetect(true)
    if (GLOBAL.showAIDetect) {
      GLOBAL.isswitch = true
      ;(await GLOBAL.toolBox) && GLOBAL.toolBox.switchAr()
    }
    NavigationService.navigate('MeasureAreaView', {
      measureType: 'arMeasureHeight',
    })
  })()
}

// AR画线
function arDrawLine() {
  (async function() {
    const _params = ToolbarModule.getParams()
    const isSupportedARCore = await SMeasureView.isSupportedARCore()
    if (!isSupportedARCore) {
      Toast.show(getLanguage(_params.language).Prompt.DONOT_SUPPORT_ARCORE)
      return
    }
    let currentLayer = GLOBAL.currentLayer
    let isTaggingLayer = false
    if (currentLayer) {
      let layerType = LayerUtils.getLayerType(currentLayer)
      isTaggingLayer = layerType === 'TAGGINGLAYER'
    }
    if (!isTaggingLayer) {
      let hasDefaultTagging = await SMap.hasDefaultTagging(
        _params.user.currentUser.userName,
      )
      if (!hasDefaultTagging) {
        let data = await SMap.newTaggingDataset(
          'Default_Tagging',
          _params.user.currentUser.userName,
        )
        GLOBAL.TaggingDatasetName = data && data.datasetName
      }
      let datasourceAlias = 'Label_' + _params.user.currentUser.userName + '#'
      let datasetName = 'Default_Tagging'
      GLOBAL.MeasureCollectData = {
        datasourceAlias,
        datasetName,
      }
    } else {
      const datasourceAlias = currentLayer.datasourceAlias // 标注数据源名称
      const datasetName = currentLayer.datasetName // 标注图层名称
      GLOBAL.MeasureCollectData = {
        datasourceAlias,
        datasetName,
      }
    }

    let _point = await SMap.getCurrentLocation()
    let point = { x: _point.longitude, y: _point.latitude }
    GLOBAL.MeasureCollectData.point = point

    GLOBAL.toolBox && GLOBAL.toolBox.removeAIDetect(true)
    if (GLOBAL.showAIDetect) {
      GLOBAL.isswitch = true
      ;(await GLOBAL.toolBox) && GLOBAL.toolBox.switchAr()
    }
    GLOBAL.MeasureCollectData.measureType = 'drawLine'
    NavigationService.navigate('MeasureAreaView', GLOBAL.MeasureCollectData)
  })()
}

// AR画面
function arDrawArea() {
  (async function() {
    const _params = ToolbarModule.getParams()
    const isSupportedARCore = await SMeasureView.isSupportedARCore()
    if (!isSupportedARCore) {
      Toast.show(getLanguage(_params.language).Prompt.DONOT_SUPPORT_ARCORE)
      return
    }
    let currentLayer = GLOBAL.currentLayer
    let isTaggingLayer = false
    if (currentLayer) {
      let layerType = LayerUtils.getLayerType(currentLayer)
      isTaggingLayer = layerType === 'TAGGINGLAYER'
    }
    if (!isTaggingLayer) {
      let hasDefaultTagging = await SMap.hasDefaultTagging(
        _params.user.currentUser.userName,
      )
      if (!hasDefaultTagging) {
        let data = await SMap.newTaggingDataset(
          'Default_Tagging',
          _params.user.currentUser.userName,
        )
        GLOBAL.TaggingDatasetName = data && data.datasetName
      }
      let datasourceAlias = 'Label_' + _params.user.currentUser.userName + '#'
      let datasetName = 'Default_Tagging'
      GLOBAL.MeasureCollectData = {
        datasourceAlias,
        datasetName,
      }
    } else {
      const datasourceAlias = currentLayer.datasourceAlias // 标注数据源名称
      const datasetName = currentLayer.datasetName // 标注图层名称
      GLOBAL.MeasureCollectData = {
        datasourceAlias,
        datasetName,
      }
    }

    let _point = await SMap.getCurrentLocation()
    let point = { x: _point.longitude, y: _point.latitude }
    GLOBAL.MeasureCollectData.point = point

    GLOBAL.toolBox && GLOBAL.toolBox.removeAIDetect(true)
    if (GLOBAL.showAIDetect) {
      GLOBAL.isswitch = true
      ;(await GLOBAL.toolBox) && GLOBAL.toolBox.switchAr()
    }

    GLOBAL.MeasureCollectData.measureType = 'arDrawArea'
    NavigationService.navigate('MeasureAreaView', GLOBAL.MeasureCollectData)
  })()
}

// AR画点
function arDrawPoint() {
  (async function() {
    const _params = ToolbarModule.getParams()
    const isSupportedARCore = await SMeasureView.isSupportedARCore()
    if (!isSupportedARCore) {
      Toast.show(getLanguage(_params.language).Prompt.DONOT_SUPPORT_ARCORE)
      return
    }
    let currentLayer = GLOBAL.currentLayer
    let isTaggingLayer = false
    if (currentLayer) {
      let layerType = LayerUtils.getLayerType(currentLayer)
      isTaggingLayer = layerType === 'TAGGINGLAYER'
    }
    if (!isTaggingLayer) {
      let hasDefaultTagging = await SMap.hasDefaultTagging(
        _params.user.currentUser.userName,
      )
      if (!hasDefaultTagging) {
        let data = await SMap.newTaggingDataset(
          'Default_Tagging',
          _params.user.currentUser.userName,
        )
        GLOBAL.TaggingDatasetName = data && data.datasetName
      }
      let datasourceAlias = 'Label_' + _params.user.currentUser.userName + '#'
      let datasetName = 'Default_Tagging'
      GLOBAL.MeasureCollectData = {
        datasourceAlias,
        datasetName,
      }
    } else {
      const datasourceAlias = currentLayer.datasourceAlias // 标注数据源名称
      const datasetName = currentLayer.datasetName // 标注图层名称
      GLOBAL.MeasureCollectData = {
        datasourceAlias,
        datasetName,
      }
    }

    let _point = await SMap.getCurrentLocation()
    let point = { x: _point.longitude, y: _point.latitude }
    GLOBAL.MeasureCollectData.point = point

    GLOBAL.toolBox && GLOBAL.toolBox.removeAIDetect(true)
    if (GLOBAL.showAIDetect) {
      GLOBAL.isswitch = true
      ;(await GLOBAL.toolBox) && GLOBAL.toolBox.switchAr()
    }

    GLOBAL.MeasureCollectData.measureType = 'arDrawPoint'
    NavigationService.navigate('MeasureAreaView', GLOBAL.MeasureCollectData)
  })()
}

async function arVideo() {
  let isSupportedARCore = await SMeasureView.isSupportedARCore()
  if (!isSupportedARCore) {
    Toast.show(getLanguage(global.language).Prompt.DONOT_SUPPORT_ARCORE)
    return
  }

  GLOBAL.toolBox && GLOBAL.toolBox.removeAIDetect(true)
  if (GLOBAL.showAIDetect) {
    GLOBAL.isswitch = true
    ;(await GLOBAL.toolBox) && GLOBAL.toolBox.switchAr()
  }
  GLOBAL.EnterDatumPointType = 'arVideo'
  NavigationService.navigate('EnterDatumPoint')
}

async function arImage() {
  let isSupportedARCore = await SMeasureView.isSupportedARCore()
  if (!isSupportedARCore) {
    Toast.show(getLanguage(global.language).Prompt.DONOT_SUPPORT_ARCORE)
    return
  }

  GLOBAL.toolBox && GLOBAL.toolBox.removeAIDetect(true)
  if (GLOBAL.showAIDetect) {
    GLOBAL.isswitch = true
    ;(await GLOBAL.toolBox) && GLOBAL.toolBox.switchAr()
  }
  GLOBAL.EnterDatumPointType = 'arImage'
  NavigationService.navigate('EnterDatumPoint')
}

async function arWeather() {
  let isSupportedARCore = await SMeasureView.isSupportedARCore()
  if (!isSupportedARCore) {
    Toast.show(getLanguage(global.language).Prompt.DONOT_SUPPORT_ARCORE)
    return
  }

  GLOBAL.toolBox && GLOBAL.toolBox.removeAIDetect(true)
  if (GLOBAL.showAIDetect) {
    GLOBAL.isswitch = true
    ;(await GLOBAL.toolBox) && GLOBAL.toolBox.switchAr()
  }

  NavigationService.navigate('ARWeatherView')
}

async function arWebView() {
  let isSupportedARCore = await SMeasureView.isSupportedARCore()
  if (!isSupportedARCore) {
    Toast.show(getLanguage(global.language).Prompt.DONOT_SUPPORT_ARCORE)
    return
  }

  GLOBAL.toolBox && GLOBAL.toolBox.removeAIDetect(true)
  if (GLOBAL.showAIDetect) {
    GLOBAL.isswitch = true
    ;(await GLOBAL.toolBox) && GLOBAL.toolBox.switchAr()
  }
  GLOBAL.EnterDatumPointType = 'arWebView'
  NavigationService.navigate('EnterDatumPoint')
}
async function arText() {
  let isSupportedARCore = await SMeasureView.isSupportedARCore()
  if (!isSupportedARCore) {
    Toast.show(getLanguage(global.language).Prompt.DONOT_SUPPORT_ARCORE)
    return
  }

  GLOBAL.toolBox && GLOBAL.toolBox.removeAIDetect(true)
  if (GLOBAL.showAIDetect) {
    GLOBAL.isswitch = true
    ;(await GLOBAL.toolBox) && GLOBAL.toolBox.switchAr()
  }
  GLOBAL.EnterDatumPointType = 'arText'
  NavigationService.navigate('EnterDatumPoint')
}

export default {
  close,
  memu,
  showMenuBox,
  commit,

  collectSceneForm,
  arMeasureCollect,
  arCastModelOperate,
  arMeasureArea,
  arMeasureLength,
  arDrawLine,
  arDrawArea,
  arDrawPoint,
  arMeasureHeight,
  arVideo,
  arImage,
  arWeather,
  arWebView,
  arText,
}
