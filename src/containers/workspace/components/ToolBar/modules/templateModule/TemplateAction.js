import { SMap } from 'imobile_for_reactnative'
import { ConstToolType, ConstInfo, UserType } from '../../../../../../constants'
import { Toast, OnlineServicesUtils, LayerUtils } from '../../../../../../utils'
import constants from '../../../../constants'
import { FileTools } from '../../../../../../native'
import NavigationService from '../../../../../NavigationService'
import { getLanguage } from '../../../../../../language'
import ToolbarModule from '../ToolbarModule'

/**
 * 分享到SuperMap Online
 */
async function shareMap(type, list = [], name = '') {
  try {
    // GLOBAL.Loading && GLOBAL.Loading.setLoading(true, '分享中')
    if (ToolbarModule.getData().isSharing) {
      Toast.show(getLanguage(global.language).Prompt.SHARING)
      // ConstInfo.SHARE_WAIT)
      return
    }
    ToolbarModule.getParams().setToolbarVisible &&
      ToolbarModule.getParams().setToolbarVisible(false)
    Toast.show(getLanguage(global.language).Prompt.SHARE_PREPARE)

    setTimeout(async () => {
      ToolbarModule.getParams().setSharing({
        module: GLOBAL.Type,
        name,
        progress: 0,
      })

      const layers = await SMap.getLayersByType()
      const notExportMapIndexes = []
      for (let i = 1; i <= GLOBAL.BaseMapSize; i++) {
        if (LayerUtils.isBaseLayer(layers[layers.length - i])) {
          notExportMapIndexes.push(layers.length - i)
        }
      }
      const notExport = {
        [ToolbarModule.getParams().map.currentMap.name]: notExportMapIndexes,
      }

      ToolbarModule.getParams().exportWorkspace(
        {
          maps: list,
          extra: {
            notExport,
          },
        },
        async (result, path) => {
          if (!result) {
            Toast.show(ConstInfo.EXPORT_WORKSPACE_FAILED)
            return
          }
          // 分享
          const fileName = path.substr(path.lastIndexOf('/') + 1)
          const dataName = name || fileName.substr(0, fileName.lastIndexOf('.'))

          // SOnlineService.deleteData(dataName).then(async () => {
          Toast.show(getLanguage(global.language).Prompt.SHARE_START)
          const onProgress = progress => {
            progress = parseInt(progress)
            if (progress % 10 !== 0) {
              return
            }
            let currentSharingProgress = 0
            for (
              let i = 0;
              i < ToolbarModule.getParams().online.share.length;
              i++
            ) {
              if (
                ToolbarModule.getParams().online.share[i].module ===
                  GLOBAL.Type &&
                ToolbarModule.getParams().online.share[i].name === dataName
              ) {
                currentSharingProgress = ToolbarModule.getParams().online.share[
                  i
                ].progress
                break
              }
            }
            if (progress < 100 && currentSharingProgress !== progress / 100) {
              // console.warn('uploading: ' + progress)
              ToolbarModule.getParams().setSharing({
                module: GLOBAL.Type,
                name: dataName,
                progress: (progress > 95 ? 95 : progress) / 100,
              })
            }
          }
          const onResult = async result => {
            if (result) {
              await JSOnlineService.setDatasShareConfig(result, true)
              ToolbarModule.getParams().setSharing({
                module: GLOBAL.Type,
                name: dataName,
                progress: 1,
              })
            }
            setTimeout(() => {
              ToolbarModule.getParams().setSharing({
                module: GLOBAL.Type,
                name: dataName,
              })
            }, 2000)
            GLOBAL.Loading && GLOBAL.Loading.setLoading(false)
            Toast.show(
              result
                ? getLanguage(global.language).Prompt.SHARE_SUCCESS
                : getLanguage(global.language).Prompt.SHARE_FAILED,
            )
            FileTools.deleteFile(path)
            ToolbarModule.addData({ isSharing: false })
          }
          let JSOnlineService
          if (type === constants.SUPERMAP_ONLINE) {
            JSOnlineService = new OnlineServicesUtils('online')
          } else if (type === constants.SUPERMAP_IPORTAL) {
            JSOnlineService = new OnlineServicesUtils('iportal')
          }
          let uploadResult = await JSOnlineService.uploadFile(
            path,
            `${dataName}.zip`,
            'WORKSPACE',
            { onProgress: onProgress },
          )
          onResult(uploadResult)
        },
      )
    }, 500)
  } catch (e) {
    ToolbarModule.addData({ isSharing: false })
  }
}

function showSaveDialog(type) {
  if (
    (type === constants.SUPERMAP_ONLINE &&
      !UserType.isOnlineUser(ToolbarModule.getParams().user.currentUser)) ||
    (type === constants.SUPERMAP_IPORTAL &&
      !UserType.isIPortalUser(ToolbarModule.getParams().user.currentUser))
  ) {
    Toast.show(getLanguage(global.language).Prompt.PLEASE_LOGIN_AND_SHARE)
    // '请登陆后再分享')
    return
  }
  if (
    type !== ConstToolType.MAP_SHARE_MAP3D &&
    !ToolbarModule.getParams().map.currentMap.name
  ) {
    Toast.show(ConstInfo.PLEASE_SAVE_MAP)
    return
  }
  if (ToolbarModule.getData().isSharing) {
    Toast.show(getLanguage(global.language).Prompt.SHARING)
    // '分享中，请稍后')
    return
  }
  NavigationService.navigate('InputPage', {
    headerTitle: getLanguage(global.language).Map_Main_Menu.SHARE,
    // '分享',
    value: ToolbarModule.getParams().map.currentMap.name,
    placeholder: getLanguage(global.language).Prompt.ENTER_MAP_NAME,
    type: 'name',
    cb: async value => {
      const list = [ToolbarModule.getParams().map.currentMap.name]
      shareMap(type, list, value)
      NavigationService.goBack()
    },
  })
}

export default {
  showSaveDialog,
}
