/* global GLOBAL */
import ToolbarModule from '../ToolbarModule'
import { SMeasureView } from 'imobile_for_reactnative'
import { Toast } from '../../../../../../utils'
import { getLanguage } from '../../../../../../language'
import NavigationService from '../../../../../NavigationService'

import { FileTools } from '../../../../../../native'
import { ConstPath } from '../../../../../../constants'
import FetchUtils from '../../../../../../utils/FetchUtils'
import Orientation from 'react-native-orientation'

let isProjectModelDownload = true // ar沙盘模型文件下载判断

function close() {}

function memu() {}

function showMenuBox() {}

function commit() {}

// AR沙盘
function arCastModelOperate() {
  (async function() {
    const _params = ToolbarModule.getParams()
    const isSupportedARCore = await SMeasureView.isSupportedARCore()
    if (!isSupportedARCore) {
      GLOBAL.ARDeviceListDialog.setVisible(true)
      return
    }
    if (isProjectModelDownload) {
      this.homePath = await FileTools.appendingHomeDirectory()
      const dustbinPath =
        `${this.homePath + ConstPath.Common_AIProjectModel}gltf` +
        '/' +
        'gltf/' +
        'ship.glb'
      const isDustbin = await FileTools.fileIsExist(dustbinPath)

      if (isDustbin) {
        // 其他文件正在下载
        if (_params.downloads?.length > 0) {
          Toast.show(getLanguage(_params.language).Prompt.DOWNLOADING_OTHERS_PLEASE_WAIT)
          return
        }
        GLOBAL.toolBox && GLOBAL.toolBox.removeAIDetect(true)
        if (GLOBAL.showAIDetect) {
          GLOBAL.arSwitchToMap = true
          ;(await GLOBAL.toolBox) && GLOBAL.toolBox.switchAr()
        }
        NavigationService.navigate('ARProjectModeView')
      } else {
        isProjectModelDownload = false
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
          isProjectModelDownload = true
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

async function arVideo() {
  let isSupportedARCore = await SMeasureView.isSupportedARCore()
  if (!isSupportedARCore) {
    GLOBAL.ARDeviceListDialog.setVisible(true)
    return
  }

  if (GLOBAL.showAIDetect) {
    GLOBAL.arSwitchToMap = true
    ;(await GLOBAL.toolBox) && GLOBAL.toolBox.switchAr()
  }
  GLOBAL.toolBox && GLOBAL.toolBox.removeAIDetect(true)
  GLOBAL.EnterDatumPointType = 'arVideo'
  // NavigationService.navigate('EnterDatumPoint')
  NavigationService.navigate('ARVideoView')
}

async function arImage() {
  let isSupportedARCore = await SMeasureView.isSupportedARCore()
  if (!isSupportedARCore) {
    GLOBAL.ARDeviceListDialog.setVisible(true)
    return
  }

  if (GLOBAL.showAIDetect) {
    GLOBAL.arSwitchToMap = true
    ;(await GLOBAL.toolBox) && GLOBAL.toolBox.switchAr()
  }
  GLOBAL.toolBox && GLOBAL.toolBox.removeAIDetect(true)
  GLOBAL.EnterDatumPointType = 'arImage'
  // NavigationService.navigate('EnterDatumPoint')
  NavigationService.navigate('ARImageView')
}

async function arWebView() {
  let isSupportedARCore = await SMeasureView.isSupportedARCore()
  if (!isSupportedARCore) {
    GLOBAL.ARDeviceListDialog.setVisible(true)
    return
  }

  if (GLOBAL.showAIDetect) {
    GLOBAL.arSwitchToMap = true
    ;(await GLOBAL.toolBox) && GLOBAL.toolBox.switchAr()
  }
  GLOBAL.toolBox && GLOBAL.toolBox.removeAIDetect(true)
  GLOBAL.EnterDatumPointType = 'arWebView'
  // NavigationService.navigate('EnterDatumPoint')
  NavigationService.navigate('ARWebView')
}

async function arText() {
  let isSupportedARCore = await SMeasureView.isSupportedARCore()
  if (!isSupportedARCore) {
    GLOBAL.ARDeviceListDialog.setVisible(true)
    return
  }

  if (GLOBAL.showAIDetect) {
    GLOBAL.arSwitchToMap = false
    ;(await GLOBAL.toolBox) && GLOBAL.toolBox.switchAr()
  }
  GLOBAL.toolBox && GLOBAL.toolBox.removeAIDetect(true)
  GLOBAL.EnterDatumPointType = 'arText'
  // NavigationService.navigate('EnterDatumPoint')
  NavigationService.navigate('ARTextView')
}

async function ar3D() {
  let isSupportedARCore = await SMeasureView.isSupportedARCore()
  if (!isSupportedARCore) {
    global.ARDeviceListDialog.setVisible(true)
    return
  }

  if (GLOBAL.showAIDetect) {
    GLOBAL.isswitch = true
    GLOBAL.toolBox && GLOBAL.toolBox.removeAIDetect(true)
    ;(await GLOBAL.toolBox) && GLOBAL.toolBox.switchAr()
  }

  GLOBAL.toolBox && GLOBAL.toolBox.setVisible(false)
  NavigationService.navigate('ARSceneView')
}

export default {
  close,
  memu,
  showMenuBox,
  commit,

  arCastModelOperate,
  arVideo,
  arImage,
  arWebView,
  arText,
  ar3D,
}
