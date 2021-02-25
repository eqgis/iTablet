import * as React from 'react'
import { getLanguage } from '../../../language'
import { getToolbarModule } from '../../workspace/components/ToolBar/modules/ToolbarModule'
import { Toast } from '../../../utils'
import { getThemeAssets } from '../../../assets'
import { SARText } from 'imobile_for_reactnative'
import ToolbarBtnType from '../../workspace/components/ToolBar/ToolbarBtnType'
import action from './action'
import XYZSlide from '../../../components/XYZSlide'
import Slide from '../../../components/Slide'

let ToolbarModule = getToolbarModule('AR')

function getData(type) {
  let data = []
  let buttons = []
  let customView = null
  let pageAction = () => {}
  switch (type) {
    case 'SM_ARTEXTMODULE':
      buttons = [
        {
          type: 'add',
          // image: require('../../../assets/mapTools/icon_add_white.png'),
          image: getThemeAssets().functionBar.icon_tool_add,
          action: action.inputText,
        },
        {
          type: 'select',
          // image: require('../../../assets/mapEdit/icon_action3d.png'),
          image: getThemeAssets().mapTools.icon_tool_click,
          action: () =>
            ToolbarModule.getParams().setToolbarVisible(
              true,
              'SM_ARTEXTMODULE_select',
            ),
        },
      ]
      pageAction = () => {
        SARText.setTapAction('NONE')
        SARText.setPlaneVisible(false)
      }
      break
    case 'SM_ARTEXTMODULE_add':
      data = [
        {
          key: 'addAtCurrent',
          title: getLanguage(GLOBAL.language).Map_Main_Menu
            .MAP_AR_ADD_TO_CURRENT_POSITION,
          image: require('../../../assets/mapTools/icon_point_black.png'),
          action: action.addAtCurrent,
        },
        {
          key: 'addAtPlane',
          title: getLanguage(GLOBAL.language).Map_Main_Menu.MAP_AR_ADD_TO_PLANE,
          image: getThemeAssets().mapTools.icon_tool_click,
          action: action.addAtPoint,
        },
      ]
      buttons = [
        {
          type: ToolbarBtnType.TOOLBAR_BACK,
          action: () =>
            ToolbarModule.getParams().setToolbarVisible(
              true,
              'SM_ARTEXTMODULE',
            ),
        },
      ]
      pageAction = () => {
        SARText.setTapAction('NONE')
        SARText.setPlaneVisible(false)
      }
      break
    case 'SM_ARTEXTMODULE_addAtPlane':
      buttons = [
        {
          type: ToolbarBtnType.TOOLBAR_BACK,
          action: () =>
            ToolbarModule.getParams().setToolbarVisible(
              true,
              'SM_ARTEXTMODULE',
            ),
        },
      ]
      break
    case 'SM_ARTEXTMODULE_select':
      buttons = [
        {
          type: ToolbarBtnType.TOOLBAR_BACK,
          action: () =>
            ToolbarModule.getParams().setToolbarVisible(
              true,
              'SM_ARTEXTMODULE',
            ),
        },
      ]
      pageAction = () => {
        Toast.show(
          GLOBAL.language === 'CN' ? '请点选对象' : 'Please tap the object',
        )
        SARText.setTapAction('SELECT')
        SARText.setOnTapListener(() => {
          ToolbarModule.getParams().setToolbarVisible(
            true,
            'SM_ARTEXTMODULE_selected',
          )
        })
        SARText.setPlaneVisible(false)
      }
      break
    case 'SM_ARTEXTMODULE_selected':
      data = [
        {
          key: 'modifyLocation',
          title: getLanguage(GLOBAL.language).Map_Main_Menu.EDIT,
          image: getThemeAssets().mark.icon_edit,
          action: () =>
            ToolbarModule.getParams().setToolbarVisible(
              true,
              'SM_ARTEXTMODULE_modify_location',
            ),
        },
        {
          key: 'modifyStyle',
          title: getLanguage(GLOBAL.language).Map_Main_Menu.STYLE,
          image: require('../../../assets/function/icon_function_style.png'),
          action: () => {
            ToolbarModule.getParams().setToolbarVisible(
              true,
              'SM_ARTEXTMODULE_modify_style',
              {
                showMenuDialog: true,
              },
            )
          },
        },
        {
          key: 'delete',
          title: getLanguage(GLOBAL.language).Analyst_Labels.DELETE,
          image: getThemeAssets().edit.icon_delete,
          action: () => {
            SARText.deleteItem()
            ToolbarModule.getParams().setToolbarVisible(true, 'SM_ARTEXTMODULE')
          },
        },
      ]
      buttons = [
        {
          type: ToolbarBtnType.TOOLBAR_BACK,
          action: () =>
            ToolbarModule.getParams().setToolbarVisible(
              true,
              'SM_ARTEXTMODULE_select',
            ),
        },
      ]
      pageAction = () => {
        SARText.setTapAction('NONE')
        SARText.setPlaneVisible(false)
      }
      break
    case 'SM_ARTEXTMODULE_modify_location':
      data = [
        {
          key: 'modifyToCurrent',
          title: getLanguage(GLOBAL.language).Map_Main_Menu
            .MAP_AR_MOVE_TO_CURRENT_POSITION,
          image: require('../../../assets/mapTools/icon_point_black.png'),
          action: () => {
            SARText.modifyToCurrentPosition()
            ToolbarModule.getParams().setToolbarVisible(true, 'SM_ARTEXTMODULE')
          },
        },
        {
          key: 'modifyToPlane',
          title: getLanguage(GLOBAL.language).Map_Main_Menu
            .MAP_AR_MOVE_TO_PLANE,
          image: getThemeAssets().mapTools.icon_tool_click,
          action: () =>
            ToolbarModule.getParams().setToolbarVisible(
              true,
              'SM_ARTEXTMODULE_modifyToPlane',
            ),
        },
      ]
      buttons = [
        {
          type: ToolbarBtnType.TOOLBAR_BACK,
          action: () =>
            ToolbarModule.getParams().setToolbarVisible(
              true,
              'SM_ARTEXTMODULE_selected',
            ),
        },
      ]
      pageAction = () => {
        SARText.setTapAction('NONE')
        SARText.setPlaneVisible(false)
      }
      break
    case 'SM_ARTEXTMODULE_modify_style':
      buttons = [
        {
          type: ToolbarBtnType.TOOLBAR_BACK,
          action: () =>
            ToolbarModule.getParams().setToolbarVisible(
              true,
              'SM_ARTEXTMODULE_selected',
            ),
        },
      ]
      pageAction = () => {
        SARText.setTapAction('NONE')
        SARText.setPlaneVisible(false)
      }
      break
    case 'SM_ARTEXTMODULE_modifyToPlane':
      buttons = [
        {
          type: ToolbarBtnType.TOOLBAR_BACK,
          action: () =>
            ToolbarModule.getParams().setToolbarVisible(
              true,
              'SM_ARTEXTMODULE_modify_location',
            ),
        },
      ]
      pageAction = () => {
        SARText.setTapAction('MODIFY')
        SARText.setPlaneVisible(true)
        SARText.setOnModifyListener(() => {
          ToolbarModule.getParams().setToolbarVisible(true, 'SM_ARTEXTMODULE')
        })
      }
      break
    case 'SM_ARTEXTMODULE_modifyBy':
      buttons = [
        {
          type: ToolbarBtnType.TOOLBAR_BACK,
          action: () => {
            SARText.move(0, 0, 0)
            ToolbarModule.getParams().setToolbarVisible(
              true,
              'SM_ARTEXTMODULE_modify_style',
              { showMenuDialog: true },
            )
          },
        },
        {
          type: 'modify_confirm',
          image: require('../../../assets/mapEdit/commit.png'),
          action: () => {
            let { currentX, currentY, currentZ } = ToolbarModule.getData()
            currentX = currentX === undefined ? 0 : currentX
            currentY = currentY === undefined ? 0 : currentY
            currentZ = currentZ === undefined ? 0 : currentZ
            SARText.move(currentX, currentY, currentZ, true)
            ToolbarModule.getParams().setToolbarVisible(true, 'SM_ARTEXTMODULE')
          },
        },
      ]
      pageAction = () => {
        SARText.setTapAction('NONE')
        SARText.setPlaneVisible(false)
        ToolbarModule.addData({
          currentX: undefined,
          currentY: undefined,
          currentZ: undefined,
        })
      }
      customView = () => (
        <XYZSlide
          rangeX={[-20, 20]}
          rangeY={[-20, 20]}
          rangeZ={[-20, 20]}
          onMoveX={value => {
            let currentX = value / 10
            ToolbarModule.addData({ currentX })
            let { currentY, currentZ } = ToolbarModule.getData()
            currentY = currentY === undefined ? 0 : currentY
            currentZ = currentZ === undefined ? 0 : currentZ
            SARText.move(currentX, currentY, currentZ)
          }}
          onMoveY={value => {
            let currentY = value / 10
            ToolbarModule.addData({ currentY })
            let { currentX, currentZ } = ToolbarModule.getData()
            currentX = currentX === undefined ? 0 : currentX
            currentZ = currentZ === undefined ? 0 : currentZ
            SARText.move(currentX, currentY, currentZ)
          }}
          onMoveZ={value => {
            let currentZ = value / 10
            ToolbarModule.addData({ currentZ })
            let { currentX, currentY } = ToolbarModule.getData()
            currentX = currentX === undefined ? 0 : currentX
            currentY = currentY === undefined ? 0 : currentY
            SARText.move(currentX, currentY, currentZ)
          }}
        />
      )
      break
    case 'SM_ARTEXTMODULE_modifyViewRange':
      buttons = [
        {
          type: ToolbarBtnType.TOOLBAR_BACK,
          action: () => {
            ToolbarModule.getParams().setToolbarVisible(
              true,
              'SM_ARTEXTMODULE_modify_style',
              { showMenuDialog: true },
            )
          },
        },
        {
          type: 'modify_confirm',
          image: require('../../../assets/mapEdit/commit.png'),
          action: () => {
            let { viewRange } = ToolbarModule.getData()
            viewRange = viewRange === undefined ? 1 : viewRange
            SARText.setViewRange(viewRange)
            ToolbarModule.getParams().setToolbarVisible(true, 'SM_ARTEXTMODULE')
          },
        },
      ]
      pageAction = () => {
        SARText.setTapAction('NONE')
        SARText.setPlaneVisible(false)
        ToolbarModule.addData({
          viewRange: undefined,
        })
      }
      customView = () => (
        <Slide
          range={[1, 30]}
          defaultValue={ToolbarModule.getData().defaultViewRange}
          unit={getLanguage(GLOBAL.language).Map_Main_Menu.METERS}
          onMove={value => {
            ToolbarModule.addData({ viewRange: value })
          }}
        />
      )
      break
  }

  return { data, buttons, customView, pageAction }
}

function getMenuData(type) {
  let data = []
  switch (type) {
    case 'SM_ARTEXTMODULE_modify_style':
      data = [
        {
          des: 'modifyBy',
          key: GLOBAL.language === 'CN' ? '位置调整' : 'Position',
          action: () =>
            ToolbarModule.getParams().setToolbarVisible(
              true,
              'SM_ARTEXTMODULE_modifyBy',
              { containerType: 'xyzslide' },
            ),
        },
        {
          des: 'viewRange',
          key: GLOBAL.language === 'CN' ? '可见距离' : 'Visible Distance',
          action: async () => {
            let defaultViewRange = await SARText.getViewRange()
            ToolbarModule.addData({ defaultViewRange })
            ToolbarModule.getParams().setToolbarVisible(
              true,
              'SM_ARTEXTMODULE_modifyViewRange',
              { containerType: 'xyzslide' },
            )
          },
        },
      ]
      break
  }
  return data
}

export default {
  getData,
  getMenuData,
}
