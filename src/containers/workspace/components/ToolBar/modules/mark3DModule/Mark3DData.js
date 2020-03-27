/**
 * @author: Asort
 * Copyright © SuperMap. All rights reserved.
 * https://github.com/AsortKeven
 */

import { SScene } from 'imobile_for_reactnative'
import ToolbarModule from '../ToolbarModule'
import { ConstToolType } from '../../../../../../constants'
import { getLanguage } from '../../../../../../language'
import Mark3DAction from './Mark3DAction'
import ToolbarBtnType from '../../ToolbarBtnType'
import constants from '../../../../constants'
import { Toast } from '../../../../../../utils'

async function getData(type, params) {
  if (params) {
    ToolbarModule.setParams(params)
  } else {
    params = ToolbarModule.getParams()
  }
  let data = []
  let buttons = []
  switch (type) {
    case ConstToolType.MAP3D_MARK:
      data = [
        {
          key: 'map3DPoint',
          title: getLanguage(params.language).Map_Main_Menu
            .TOOLS_3D_CREATE_POINT,
          // '兴趣点',
          action: Mark3DAction.createPoint,
          size: 'large',
          image: require('../../../../../../assets/function/Frenchgrey/icon_favorite.png'),
        },
        {
          key: 'map3DText',
          title: getLanguage(params.language).Map_Main_Menu.TOOLS_CREATE_TEXT,
          // ''文字',
          action: Mark3DAction.createText,
          size: 'large',
          image: require('../../../../../../assets/function/Frenchgrey/icon_text.png'),
        },
        {
          key: 'map3DPiontLine',
          title: getLanguage(params.language).Map_Main_Menu.TOOLS_CREATE_LINE,
          // ''点绘线',
          action: Mark3DAction.createLine,
          size: 'large',
          image: require('../../../../../../assets/function/Frenchgrey/icon_pointLine.png'),
        },
        {
          key: 'map3DPointSurface',
          title: getLanguage(params.language).Map_Main_Menu.TOOLS_CREATE_REGION,
          // ''点绘面',
          action: Mark3DAction.createRegion,
          size: 'large',
          image: require('../../../../../../assets/function/Frenchgrey/icon_pointSuerface.png'),
        },
        {
          key: 'closeAllLabel',
          title: getLanguage(params.language).Map_Main_Menu
            .TOOLS_CLEAN_PLOTTING,
          // ''清除标注',
          action: Mark3DAction.clearPlotting,
          size: 'large',
          image: require('../../../../../../assets/mapEdit/Frenchgrey/icon_clear.png'),
        },
      ]
      break
    case ConstToolType.MAP3D_SYMBOL_POINT:
      buttons = [
        ToolbarBtnType.CANCEL,
        {
          type: ToolbarBtnType.BACK,
          image: require('../../../../../../assets/mapEdit/icon_back.png'),
          action: () => {
            if (GLOBAL.Type === constants.MAP_3D) SScene.symbolback()
          },
        },
        {
          type: ToolbarBtnType.SAVE,
          image: require('../../../../../../assets/mapEdit/commit.png'),
          action: () => {
            try {
              if (GLOBAL.Type === constants.MAP_3D) SScene.save()
              // getParams.getMap3DAttribute()
              Toast.show(getLanguage(params.language).Prompt.SAVE_SUCCESSFULLY)
              // '保存成功')
            } catch (error) {
              Toast.show(getLanguage(params.language).Prompt.SAVE_FAILED)
            }
          },
        },
      ]
      break
    case ConstToolType.MAP3D_SYMBOL_POINTLINE:
    case ConstToolType.MAP3D_SYMBOL_POINTSURFACE:
    case ConstToolType.MAP3D_SYMBOL_TEXT:
      buttons = [
        ToolbarBtnType.CANCEL,
        {
          type: ToolbarBtnType.BACK,
          image: require('../../../../../../assets/mapEdit/icon_back.png'),
          action: () => {
            if (GLOBAL.Type === constants.MAP_3D) SScene.symbolback()
          },
        },
        {
          type: ToolbarBtnType.CLEAR_CURRENT_LABEL,
          image: require('../../../../../../assets/mapEdit/icon_clear.png'),
          action: () => SScene.clearcurrentLabel(),
        },
        {
          type: ToolbarBtnType.SAVE,
          image: require('../../../../../../assets/mapEdit/commit.png'),
          action: () => {
            try {
              if (GLOBAL.Type === constants.MAP_3D) SScene.save()
              // getParams.getMap3DAttribute()
              Toast.show(getLanguage(params.language).Prompt.SAVE_SUCCESSFULLY)
              // '保存成功')
            } catch (error) {
              Toast.show(getLanguage(params.language).Prompt.SAVE_FAILED)
            }
          },
        },
      ]
      break
  }
  return { data, buttons }
}

export default {
  getData,
}
