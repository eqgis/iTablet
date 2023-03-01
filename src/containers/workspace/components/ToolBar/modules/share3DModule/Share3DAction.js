import {
  SOnlineService,
  SScene,
  SIPortalService,
} from 'imobile_for_reactnative'
import { UserType } from '../../../../../../constants'
import { Toast,OnlineServicesUtils } from '../../../../../../utils'
import constants from '../../../../constants'
import { FileTools } from '../../../../../../native'
import NavigationService from '../../../../../NavigationService'
import { getLanguage } from '../../../../../../language'
import ToolbarModule from '../ToolbarModule'

/**
 * 分享3D到SuperMap Online
 */
async function share3DMap(type, list = []) {
  try {
    if (ToolbarModule.getParams().user.users.length <= 1) {
      Toast.show(getLanguage(global.language).Prompt.PLEASE_LOGIN_AND_SHARE)
      // '请登陆后再分享')
      return
    }
    if (ToolbarModule.getData().isSharing) {
      Toast.show(getLanguage(global.language).Prompt.SHARING)
      // '分享中，请稍后')
      return
    }
    ToolbarModule.getParams().setToolbarVisible &&
      ToolbarModule.getParams().setToolbarVisible(false)
    if (list.length > 0) {
      ToolbarModule.addData({ isSharing: true })
      for (let index = 0; index < list.length; index++) {
        const dataName = list[index]
        ToolbarModule.getParams().setSharing({
          module: global.Type,
          name: dataName,
          progress: 0,
        })
        ToolbarModule.getParams().exportmap3DWorkspace(
          { name: list[index] },
          async (result, zipPath) => {
            let JSOnlineService
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
                    global.Type &&
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
                  module: global.Type,
                  name: dataName,
                  progress: (progress > 95 ? 95 : progress) / 100,
                })
              }
            }
            const onResult = async result => {
              if (result) {
                await JSOnlineService.setDatasShareConfig(result, true)
                ToolbarModule.getParams().setSharing({
                  module: global.Type,
                  name: dataName,
                  progress: 1,
                })
              }
              setTimeout(() => {
                ToolbarModule.getParams().setSharing({
                  module: global.Type,
                  name: dataName,
                })
              }, 2000)
              global.Loading && global.Loading.setLoading(false)
              Toast.show(
                result
                  ? getLanguage(global.language).Prompt.SHARE_SUCCESS
                  : getLanguage(global.language).Prompt.SHARE_FAILED,
              )
              FileTools.deleteFile(zipPath)
              ToolbarModule.addData({ isSharing: false })
            }
            //使用统一接口上传 add xiezhy
            if (result) {
              if (type === constants.SUPERMAP_ONLINE) {
                JSOnlineService = new OnlineServicesUtils('online')
              } else if (type === constants.SUPERMAP_IPORTAL) {
                JSOnlineService = new OnlineServicesUtils('iportal')
              }
              let uploadResult = await JSOnlineService.uploadFileWithCheckCapacity(
                zipPath,
                `${dataName}.zip`,
                'WORKSPACE',
                { onProgress: onProgress },
              )
              onResult(uploadResult)
              // if (type === constants.SUPERMAP_ONLINE) {
              //   await SOnlineService.uploadFile(zipPath, dataName, {
              //     // onProgress: progress => {
              //     //   ToolbarModule.getParams().setSharing({
              //     //     module: global.Type,
              //     //     name: dataName,
              //     //     progress: progress / 100,
              //     //   })
              //     // },
              //     onResult: async () => {
              //       global.Loading && global.Loading.setLoading(false)
              //        
              //       Toast.show(
              //         getLanguage(global.language).Prompt.SHARE_SUCCESS,
              //       )
              //       FileTools.deleteFile(zipPath)
              //       ToolbarModule.addData({ isSharing: false })
              //       setTimeout(() => {
              //         ToolbarModule.getParams().setSharing({
              //           module: global.Type,
              //           name: dataName,
              //         })
              //       }, 2000)
              //     },
              //   })
              // } else if (type === constants.SUPERMAP_IPORTAL) {
              //   await SIPortalService.uploadData(zipPath, `${dataName}.zip`, {
              //     // onProgress:onProgeress,
              //     onResult: async () => {
              //        
              //       global.Loading && global.Loading.setLoading(false)
              //       Toast.show(
              //         getLanguage(global.language).Prompt.SHARE_SUCCESS,
              //       )
              //       FileTools.deleteFile(zipPath)
              //       ToolbarModule.addData({ isSharing: false })
              //       setTimeout(() => {
              //         ToolbarModule.getParams().setSharing({
              //           module: global.Type,
              //           name: dataName,
              //         })
              //       }, 2000)
              //     },
              //   })
              // }
            } else {
              Toast.show(
                  getLanguage(global.language).Prompt.SHARE_FAILED
              )
            }
          },
        )
      }
    }
  } catch (error) {
    ToolbarModule.addData({ isSharing: false })
  }
}

function show3DSaveDialog(type) {
  SScene.getScenes().then(list => {
    const data = [list[0].name]
    ToolbarModule.getParams().map = {
      ...ToolbarModule.getParams().map,
      currentMap: { name: data },
    }
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
        const list = await SScene.getScenes()
        const data = [list[0].name]
        share3DMap(type, data, value)
        NavigationService.goBack()
      },
    })
  })
}

export default {
  show3DSaveDialog,
}
