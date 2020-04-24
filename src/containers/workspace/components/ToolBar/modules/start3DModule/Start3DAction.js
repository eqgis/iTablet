import { FileTools } from '../../../../../../native'
import {
  ConstToolType,
  ConstPath,
  ToolbarType,
} from '../../../../../../constants'
import { Toast } from '../../../../../../utils'
import { getLanguage } from '../../../../../../language'
import ToolbarModule from '../ToolbarModule'

async function getSceneData() {
  const params = ToolbarModule.getParams()
  const buttons = []
  const data = []
  try {
    // let buttons = [ToolbarBtnType.CANCEL, ToolbarBtnType.FLEX]
    const userName = params.user.currentUser.userName || 'Customer'
    const path = await FileTools.appendingHomeDirectory(
      `${ConstPath.UserPath + userName}/${ConstPath.RelativeFilePath.Scene}`,
    )
    const result = await FileTools.fileIsExist(path)
    if (result) {
      const fileList = await FileTools.getPathListByFilter(path, {
        extension: 'pxp',
        type: 'file',
      })
      const _data = []
      for (let index = 0; index < fileList.length; index++) {
        const element = fileList[index]
        if (element.name.indexOf('.pxp') > -1) {
          fileList[index].name = element.name.substr(
            0,
            element.name.lastIndexOf('.'),
          )
          if (params.language === 'EN') {
            const day = element.mtime
              .replace(/年|月|日/g, '/')
              .split('  ')[0]
              .split('/')
            const info = `${day[2]}/${day[1]}/${day[0]}  ${
              element.mtime.split('  ')[1]
            }`
            element.mtime = info
          }
          element.subTitle = element.mtime
          element.image = require('../../../../../../assets/mapToolbar/list_type_map_black.png')
          _data.push(element)
        }
      }
      data.push({
        image: require('../../../../../../assets/mapToolbar/list_type_maps.png'),
        title: getLanguage(params.language).Map_Label.SCENE,
        data: _data,
      })
    }
  } catch (error) {
    Toast.show(getLanguage(params.language).Prompt.NO_SCENE_LIST)
  }
  const type = ConstToolType.MAP3D_WORKSPACE_LIST
  ToolbarModule.getParams().setToolbarVisible(true, type, {
    containerType: ToolbarType.list,
    isFullScreen: true,
    data,
    buttons,
  })
}

export default {
  getSceneData,
}
