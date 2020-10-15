import { SScene } from 'imobile_for_reactnative'
import { FileTools } from '../../../../../../native'
import {
  ConstToolType,
  ConstPath,
  ToolbarType,
} from '../../../../../../constants'
import { Toast } from '../../../../../../utils'
import { getLanguage } from '../../../../../../language'
import ToolbarModule from '../ToolbarModule'
import Fly3DData from './Fly3DData'

async function listAction(type, params = {}) {
  const _params = ToolbarModule.getParams()
  if (type === ConstToolType.SM_MAP3D_FLY_LIST) {
    SScene.setPosition(params.index)
    const type = ConstToolType.SM_MAP3D_FLY
    const { data, buttons } = await Fly3DData.getData(type)
    _params.showFullMap && _params.showFullMap(true)
    _params.setToolbarVisible(true, type, {
      data,
      buttons,
      containerType: ToolbarType.table,
      column: data.length,
      isFullScreen: false,
      height: ConstToolType.HEIGHT[0],
    })
  }
}

async function getWorkspaceList() {
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
      for (let index = 0; index < fileList.length; index++) {
        const element = fileList[index]
        if (element.name.indexOf('.pxp') > -1) {
          fileList[index].name = element.name.substr(
            0,
            element.name.lastIndexOf('.'),
          )
          data.push(element)
        }
      }
    }
  } catch (error) {
    Toast.show(getLanguage(params.language).Prompt.NO_SCENE_LIST)
  }
  params.setToolbarVisible(true, ConstToolType.SM_MAP3D_TOOL, {
    containerType: ToolbarType.table,
    isFullScreen: true,
    // height:
    //   params.device.orientation.indexOf('LANDSCAPE') === 0
    //     ? ConstToolType.HEIGHT[2]
    //     : scaleSize(350),
    // column: params.device.orientation.indexOf('LANDSCAPE') === 0 ? 8 : 4,
    data,
    buttons,
  })
}

async function close(type) {
  const params = ToolbarModule.getParams()
  if (type === ConstToolType.SM_MAP3D_FLY) {
    SScene.checkoutListener('startTouchAttribute')
    SScene.flyStop()
    GLOBAL.action3d && SScene.setAction(GLOBAL.action3d)
    params.existFullMap && params.existFullMap()
    params.setToolbarVisible(false)
  } else if (type === ConstToolType.SM_MAP3D_FLY_NEW) {
    SScene.checkoutListener('startTouchAttribute')
    SScene.clearRoutStops()
    SScene.flyStop()
    GLOBAL.action3d && SScene.setAction(GLOBAL.action3d)
    params.existFullMap && params.existFullMap()
    params.setToolbarVisible(false)
  } else {
    ToolbarModule.setData()
    return false
  }
  ToolbarModule.setData()
}

function newFly() {
  const params = ToolbarModule.getParams()
  const _data = Fly3DData.getNewFly()
  params.setToolbarVisible(true, ConstToolType.SM_MAP3D_FLY_NEW, {
    // height: ConstToolType.HEIGHT[0],
    // column: _data.data.length,
    containerType: ToolbarType.table,
    isFullScreen: false,
    ..._data,
  })
}

export default {
  listAction,
  close,

  getWorkspaceList,
  newFly,
}
