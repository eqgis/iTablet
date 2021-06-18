/* global GLOBAL */
import {
  SARMap,
  ARAction,
} from 'imobile_for_reactnative'
import { IAnimationParam, IVector3 } from "imobile_for_reactnative/types/interface/ar"
import {
  ConstToolType,
  ToolbarType,
} from '../../../../../../constants'
import { getLanguage } from '../../../../../../language'
import { DialogUtils, Toast } from '../../../../../../utils'
import ToolbarModule from '../ToolbarModule'

async function toolbarBack() {
  const _params: any = ToolbarModule.getParams()
  let prevType
  switch(_params.type) {
    case ConstToolType.SM_AR_EDIT_ANIMATION_TYPE:
      prevType = ConstToolType.SM_AR_EDIT_ANIMATION
      break
    case ConstToolType.SM_AR_EDIT_ANIMATION_TRANSLATION:
    case ConstToolType.SM_AR_EDIT_ANIMATION_ROTATION:
      prevType = ConstToolType.SM_AR_EDIT_ANIMATION_TYPE
      break
    default:
      // const _data = await AREditData.getData(prevType, _params)
  }
  if (
    prevType === ConstToolType.SM_AR_EDIT_ANIMATION ||
    prevType === ConstToolType.SM_AR_EDIT_ANIMATION_TYPE
  ) {
    showAnimationAction(prevType)
  } else {
    if (prevType === undefined) {
      _params.setToolbarVisible(false)
    } else {
      _params.setToolbarVisible(true, ConstToolType.SM_AR_EDIT, {
        isFullScreen: false,
      })
    }
    SARMap.clearSelection()
    SARMap.cancel()
    SARMap.setAction(ARAction.SELECT)
    ToolbarModule.addData({selectARElement: null})
  }
}

function menu(type: string, selectKey: string, params = {}) {

  let showMenu = false

  if (GLOBAL.ToolBar) {
    if (GLOBAL.ToolBar.state.showMenuDialog) {
      showMenu = false
    } else {
      showMenu = true
    }
    GLOBAL.ToolBar.setState({
      isFullScreen: showMenu,
      showMenuDialog: showMenu,
      selectKey: selectKey,
      selectName: selectKey,
    })
  }
}

function showMenuBox(type: string, selectKey: string, params: any) {
  switch(type) {
    case ConstToolType.SM_AR_EDIT_ROTATION:
    case ConstToolType.SM_AR_EDIT_POSITION:
    case ConstToolType.SM_AR_EDIT_SCALE:
    case ConstToolType.SM_AR_EDIT_ANIMATION:
    case ConstToolType.SM_AR_EDIT_ANIMATION_TYPE:
    case ConstToolType.SM_AR_EDIT_ANIMATION_TRANSLATION:
    case ConstToolType.SM_AR_EDIT_ANIMATION_ROTATION:
    case ConstToolType.SM_AR_EDIT_ANIMATION_ROTATION_AXIS:
      if (!GLOBAL.ToolBar.state.showMenuDialog) {
        params.showBox && params.showBox()
      } else {
        params.setData && params.setData({
          showMenuDialog: false,
          isFullScreen: false,
        })
        params.showBox && params.showBox()
      }
      break
  }
}

function commit() {
  // const _params: any = ToolbarModule.getParams()
  // const _data: any = ToolbarModule.getData()
  // if (
  //   (
  //     _params.type === ConstToolType.SM_AR_EDIT_ANIMATION_TRANSLATION ||
  //     _params.type === ConstToolType.SM_AR_EDIT_ANIMATION_ROTATION
  //   ) &&
  //   _data.animationParam
  // ) {
  //   // 添加AR动画,并返回上一个界面
  //   createAnimation()
  //   return true
  // }
  SARMap.clearSelection()
  SARMap.submit()
  // SARMap.setAction(ARAction.NULL)
  SARMap.setAction(ARAction.SELECT)
  return false
}

function close() {
  const _params: any = ToolbarModule.getParams()
  const _data: any = ToolbarModule.getData()
  if (_params.type === ConstToolType.SM_AR_EDIT && _data.selectARElement) {
    SARMap.clearSelection()
    SARMap.setAction(ARAction.SELECT)
    ToolbarModule.addData({selectARElement: null})
    _params.setToolbarVisible(true, _params.type, {
      isFullScreen: false,
    })
    return true
  }
  return false
}

/** 动画 */
function showAnimationAction(type: string) {
  const _params: any = ToolbarModule.getParams()
  _params.showFullMap && _params.showFullMap(true)
  _params.setToolbarVisible(true, type, {
    containerType: ToolbarType.tableTabs,
    isFullScreen: false,
  })
  if (type === ConstToolType.SM_AR_EDIT_ANIMATION_TRANSLATION) {
    const animationParam: IAnimationParam = {
      name: '',
      type: 'translation',
      startPosition: {x: 0, y: 0, z:0},
      direction: 'x',
      distance: 1,
    }
    ToolbarModule.addData({animationParam})
  } else if (type === ConstToolType.SM_AR_EDIT_ANIMATION_ROTATION) {
    const animationParam: IAnimationParam = {
      name: '',
      type: 'rotation',
      rotationAxis: {x: 1, y: 0, z:0},
      clockwise: true,
    }
    ToolbarModule.addData({animationParam})
  }
}

interface IAnimation {
  name?: string,
  type?: 'rotation',
  duration?: number,
  delay?: number,
  repeatCount?: number,
  repeatMode?: 1 | 2,

  rotationAxis?: IVector3,
  clockwise?: boolean,

  startPosition?: IVector3,
  direction?: 'x' | 'y' | 'z',
  distance?: number,
}

/** 创建动画 */
function createAnimation(params?: IAnimation) {
  const _data: any = ToolbarModule.getData()
  DialogUtils.getInputDialog()?.setDialogVisible(true, {
    confirmAction: async (name: string) => {
      if (name !== '' && _data.animationParam) {
        params && Object.assign(_data.animationParam, params)
        _data.animationParam.name = name
        // NavigationService.goBack('InputPage')
        await SARMap.addNodeAnimation(_data.animationParam)
        ToolbarModule.addData({animationParam: null})
        DialogUtils.getInputDialog()?.setDialogVisible(false)
        showAnimationAction(ConstToolType.SM_AR_EDIT_ANIMATION)
      }
    },
  })
}

function deleteARElement() {
  const _params: any = ToolbarModule.getParams()
  const _data: any = ToolbarModule.getData()

  const element = _data.selectARElement
  if(element) {
    GLOBAL.SimpleDialog.set({
      text: getLanguage(GLOBAL.language).Common.DELETE_CURRENT_OBJ_CONFIRM,
      confirmAction: () => {
        SARMap.clearSelection()
        SARMap.removeEditElement()

        _params.setToolbarVisible(false)
      },
    })
    GLOBAL.SimpleDialog.setVisible(true)
  } else {
    Toast.show(getLanguage(GLOBAL.language).Common.NO_SELECTED_OBJ)
  }
}

export default {
  toolbarBack,
  menu,
  showMenuBox,
  commit,
  close,

  showAnimationAction,
  createAnimation,
  deleteARElement,
}
