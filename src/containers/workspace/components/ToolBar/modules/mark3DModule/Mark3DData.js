/**
 * @author: Asort
 * Copyright © SuperMap. All rights reserved.
 * https://github.com/AsortKeven
 */

import { SScene } from 'imobile_for_reactnative'
import ToolbarModule from '../ToolbarModule'
import { ConstToolType, ChunkType } from '../../../../../../constants'
import { getLanguage } from '../../../../../../language'
import { getThemeAssets } from '../../../../../../assets'
import Mark3DAction from './Mark3DAction'
import ToolbarBtnType from '../../ToolbarBtnType'
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
    case ConstToolType.SM_MAP3D_MARK:
      data = [
        {
          key: 'map3DPoint',
          title: getLanguage(params.language).Map_Main_Menu
            .TOOLS_3D_CREATE_POINT,
          // '兴趣点',
          action: Mark3DAction.createPoint,
          size: 'large',
          image: getThemeAssets().mapTools.icon_spot_collection,
        },
        {
          key: 'map3DText',
          title: getLanguage(params.language).Map_Main_Menu.TOOLS_CREATE_TEXT,
          // ''文字',
          action: Mark3DAction.createText,
          size: 'large',
          image: getThemeAssets().mark.icon_text,
        },
        {
          key: 'map3DPiontLine',
          title: getLanguage(params.language).Map_Main_Menu.TOOLS_CREATE_LINE,
          // ''点绘线',
          action: Mark3DAction.createLine,
          size: 'large',
          image: getThemeAssets().mapTools.icon_collect_line,
        },
        {
          key: 'map3DPointSurface',
          title: getLanguage(params.language).Map_Main_Menu.TOOLS_CREATE_REGION,
          // ''点绘面',
          action: Mark3DAction.createRegion,
          size: 'large',
          image: getThemeAssets().mapTools.icon_collect_region,
        },
        {
          key: 'closeAllLabel',
          title: getLanguage(params.language).Map_Main_Menu
            .TOOLS_CLEAN_PLOTTING,
          // ''清除标注',
          action: Mark3DAction.clearPlotting,
          size: 'large',
          image: getThemeAssets().mark.icon_mark_erase,
        },
      ]
      break
    case ConstToolType.SM_MAP3D_MARK_POINT:
      buttons = [
        ToolbarBtnType.CANCEL,
        {
          type: ToolbarBtnType.BACK,
          image: require('../../../../../../assets/mapEdit/icon_back.png'),
          action: () => {
            if (GLOBAL.Type === ChunkType.MAP_3D) SScene.symbolback()
          },
        },
        {
          type: ToolbarBtnType.SAVE,
          image: require('../../../../../../assets/mapEdit/commit.png'),
          action: async () => {
            try {
              if (GLOBAL.Type === ChunkType.MAP_3D) await SScene.save()
              Toast.show(getLanguage(params.language).Prompt.SAVE_SUCCESSFULLY)
            } catch (error) {
              Toast.show(getLanguage(params.language).Prompt.SAVE_FAILED)
            }
          },
        },
      ]
      break
    case ConstToolType.SM_MAP3D_MARK_POINT_LINE:
    case ConstToolType.SM_MAP3D_MARK_POINT_SURFACE:
    case ConstToolType.SM_MAP3D_MARK_TEXT:
      buttons = [
        ToolbarBtnType.CANCEL,
        {
          type: ToolbarBtnType.BACK,
          image: require('../../../../../../assets/mapEdit/icon_back.png'),
          action: () => {
            if (GLOBAL.Type === ChunkType.MAP_3D) SScene.symbolback()
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
          action: async () => {
            try {
              if (GLOBAL.Type === ChunkType.MAP_3D) await SScene.save()
              Toast.show(getLanguage(params.language).Prompt.SAVE_SUCCESSFULLY)
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
