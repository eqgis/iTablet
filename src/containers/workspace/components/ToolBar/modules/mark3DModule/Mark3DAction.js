/**
 * @author: Asort
 * Copyright © SuperMap. All rights reserved.
 * https://github.com/AsortKeven
 */
import { SScene } from 'imobile_for_reactnative'
import ToolbarModule from '../ToolbarModule'
import { Toast } from '../../../../../../utils'
import { getLanguage } from '../../../../../../language'
import { ConstToolType } from '../../../../../../constants'

/** 兴趣点 * */
function createPoint() {
  const params = ToolbarModule.getParams()
  try {
    if (!GLOBAL.openWorkspace) {
      Toast.show(getLanguage(params.language).Prompt.PLEASE_OPEN_SCENE)
      // '请打开场景')
      return
    }
    SScene.checkoutListener('startLabelOperate')
    GLOBAL.Map3DSymbol = true
    SScene.startDrawFavorite(getLanguage(params.language).Prompt.POI)
    // this.showMap3DTool(ConstToolType.SM_MAP3D_MARK_POINT)
    params.setToolbarVisible(true, ConstToolType.SM_MAP3D_MARK_POINT, {
      isFullScreen: false,
      // height: 0,
    })
  } catch (error) {
    Toast.show(getLanguage(params.language).Prompt.FAILED_TO_CREATE_POINT)
  }
}

/** 文字 * */
function createText() {
  const params = ToolbarModule.getParams()
  try {
    if (!GLOBAL.openWorkspace) {
      Toast.show(getLanguage(params.language).Prompt.PLEASE_OPEN_SCENE)
      // '请打开场景')
      return
    }
    SScene.checkoutListener('startLabelOperate')
    GLOBAL.Map3DSymbol = true
    SScene.startDrawText({
      callback: result => {
        const dialog = params.dialog()
        dialog.setDialogVisible(true)
        ToolbarModule.addData({ point: result })
      },
    })
    // this.showMap3DTool(ConstToolType.SM_MAP3D_MARK_TEXT)
    params.setToolbarVisible(true, ConstToolType.SM_MAP3D_MARK_TEXT, {
      isFullScreen: false,
      // height: 0,
    })
  } catch (error) {
    Toast.show(getLanguage(params.language).Prompt.FAILED_TO_CREATE_TEXT)
  }
}

/** 点绘线 * */
function createLine() {
  const params = ToolbarModule.getParams()
  if (!GLOBAL.openWorkspace) {
    Toast.show(getLanguage(params.language).Prompt.PLEASE_OPEN_SCENE)
    // '请打开场景')
    return
  }
  SScene.checkoutListener('startLabelOperate')
  GLOBAL.Map3DSymbol = true
  try {
    SScene.startDrawLine()
    // this.showMap3DTool(ConstToolType.SM_MAP3D_MARK_POINT_LINE)
    params.setToolbarVisible(true, ConstToolType.SM_MAP3D_MARK_POINT_LINE, {
      isFullScreen: false,
      // height: 0,
    })
  } catch (error) {
    Toast.show(getLanguage(params.language).Prompt.FAILED_TO_CREATE_LINE)
  }
}

/** 点绘面 * */
function createRegion() {
  const params = ToolbarModule.getParams()
  try {
    if (!GLOBAL.openWorkspace) {
      Toast.show(getLanguage(params.language).Prompt.PLEASE_OPEN_SCENE)
      // '请打开场景')
      return
    }
    SScene.checkoutListener('startLabelOperate')
    GLOBAL.Map3DSymbol = true
    SScene.startDrawArea()
    // this.showMap3DTool(ConstToolType.SM_MAP3D_MARK_POINT_SURFACE)
    params.setToolbarVisible(true, ConstToolType.SM_MAP3D_MARK_POINT_SURFACE, {
      isFullScreen: false,
      // height: 0,
    })
  } catch (error) {
    Toast.show(getLanguage(params.language).Prompt.FAILED_TO_CREATE_REGION)
  }
}

/** 清除标注 * */
function clearPlotting() {
  const params = ToolbarModule.getParams()
  if (!GLOBAL.openWorkspace) {
    Toast.show(getLanguage(params.language).Prompt.PLEASE_OPEN_SCENE)
    // '请打开场景')
    return
  }
  GLOBAL.Map3DSymbol = true
  SScene.closeAllLabel()
  params.existFullMap && params.existFullMap()
  params.setToolbarVisible(false)
}

function close(type) {
  const _params = ToolbarModule.getParams()
  if (
    type === ConstToolType.SM_MAP3D_MARK_POINT ||
    type === ConstToolType.SM_MAP3D_MARK_POINT_LINE ||
    type === ConstToolType.SM_MAP3D_MARK_POINT_SURFACE ||
    type === ConstToolType.SM_MAP3D_MARK_TEXT
  ) {
    SScene.clearAllLabel()
    GLOBAL.Map3DSymbol = false
    _params.existFullMap && _params.existFullMap()
    _params.setToolbarVisible(false)
  }
  SScene.checkoutListener('startTouchAttribute')
  SScene.setAction('PAN3D')
  GLOBAL.action3d = 'PAN3D'
  ToolbarModule.setData()
}

export default {
  close,

  createPoint,
  createLine,
  createRegion,
  createText,
  clearPlotting,
}
