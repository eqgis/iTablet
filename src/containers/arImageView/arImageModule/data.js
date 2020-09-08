import * as React from 'react'
import { getLanguage } from '../../../language'
import ToolbarModule from '../../workspace/components/ToolBar/modules/ToolbarModule'
import { Toast } from '../../../utils'
import { SARImage } from 'imobile_for_reactnative'
import ToolbarBtnType from '../../workspace/components/ToolBar/ToolbarBtnType'
import action from './action'
import XYZSlide from '../../../components/XYZSlide'
import Slide from '../../../components/Slide'

function getData(type) {
  let data = []
  let buttons = []
  let customView = null
  let pageAction = () => {}
  switch (type) {
    case 'ARIMAGEMODULE':
      buttons = [
        {
          type: 'add',
          image: require('../../../assets/mapTools/icon_add_white.png'),
          action: action.selectImage,
        },
        {
          type: 'select',
          image: require('../../../assets/mapEdit/icon_action3d.png'),
          action: () =>
            ToolbarModule.getParams().setToolbarVisible(
              true,
              'ARIMAGEMODULE_select',
            ),
        },
      ]
      pageAction = () => {
        SARImage.setTapAction('NONE')
        SARImage.setPlaneVisible(false)
      }
      break
    case 'ARIMAGEMODULE_add':
      data = [
        {
          key: 'addAtCurrent',
          title: getLanguage(global.language).Map_Main_Menu
            .MAP_AR_ADD_TO_CURRENT_POSITION,
          image: require('../../../assets/mapTools/icon_point_black.png'),
          action: action.addAtCurrent,
        },
        {
          key: 'addAtPlane',
          title: getLanguage(global.language).Map_Main_Menu.MAP_AR_ADD_TO_PLANE,
          image: require('../../../assets/mapTools/icon_free_point_select_black.png'),
          action: action.addAtPoint,
        },
      ]
      buttons = [
        {
          type: ToolbarBtnType.TOOLBAR_BACK,
          action: () =>
            ToolbarModule.getParams().setToolbarVisible(true, 'ARIMAGEMODULE'),
        },
      ]
      pageAction = () => {
        SARImage.setTapAction('NONE')
        SARImage.setPlaneVisible(false)
      }
      break
    case 'ARIMAGEMODULE_addAtPlane':
      buttons = [
        {
          type: ToolbarBtnType.TOOLBAR_BACK,
          action: () =>
            ToolbarModule.getParams().setToolbarVisible(true, 'ARIMAGEMODULE'),
        },
      ]
      break
    case 'ARIMAGEMODULE_select':
      buttons = [
        {
          type: ToolbarBtnType.TOOLBAR_BACK,
          action: () =>
            ToolbarModule.getParams().setToolbarVisible(true, 'ARIMAGEMODULE'),
        },
      ]
      pageAction = () => {
        Toast.show(
          global.language === 'CN' ? '请点选对象' : 'Please tap the object',
        )
        SARImage.setTapAction('SELECT')
        SARImage.setOnTapListener(() => {
          ToolbarModule.getParams().setToolbarVisible(
            true,
            'ARIMAGEMODULE_selected',
          )
        })
        SARImage.setPlaneVisible(false)
      }
      break
    case 'ARIMAGEMODULE_selected':
      data = [
        {
          key: 'modifyLocation',
          title: getLanguage(global.language).Map_Main_Menu.EDIT,
          image: require('../../../assets/function/icon_edit.png'),
          action: () =>
            ToolbarModule.getParams().setToolbarVisible(
              true,
              'ARIMAGEMODULE_modify_location',
            ),
        },
        {
          key: 'modifyStyle',
          title: getLanguage(global.language).Map_Main_Menu.STYLE,
          image: require('../../../assets/function/icon_function_style.png'),
          action: () => {
            ToolbarModule.getParams().setToolbarVisible(
              true,
              'ARIMAGEMODULE_modify_style',
              {
                showMenuDialog: true,
              },
            )
          },
        },
        {
          key: 'delete',
          title: getLanguage(global.language).Analyst_Labels.DELETE,
          image: require('../../../assets/mapTools/icon_delete_black.png'),
          action: () => {
            SARImage.deleteItem()
            ToolbarModule.getParams().setToolbarVisible(true, 'ARIMAGEMODULE')
          },
        },
      ]
      buttons = [
        {
          type: ToolbarBtnType.TOOLBAR_BACK,
          action: () =>
            ToolbarModule.getParams().setToolbarVisible(
              true,
              'ARIMAGEMODULE_select',
            ),
        },
      ]
      pageAction = () => {
        SARImage.setTapAction('NONE')
        SARImage.setPlaneVisible(false)
      }
      break
    case 'ARIMAGEMODULE_modify_location':
      data = [
        {
          key: 'modifyToCurrent',
          title: getLanguage(global.language).Map_Main_Menu
            .MAP_AR_MOVE_TO_CURRENT_POSITION,
          image: require('../../../assets/mapTools/icon_point_black.png'),
          action: () => {
            SARImage.modifyToCurrentPosition()
            ToolbarModule.getParams().setToolbarVisible(true, 'ARIMAGEMODULE')
          },
        },
        {
          key: 'modifyToPlane',
          title: getLanguage(global.language).Map_Main_Menu
            .MAP_AR_MOVE_TO_PLANE,
          image: require('../../../assets/mapTools/icon_free_point_select_black.png'),
          action: () =>
            ToolbarModule.getParams().setToolbarVisible(
              true,
              'ARIMAGEMODULE_modifyToPlane',
            ),
        },
      ]
      buttons = [
        {
          type: ToolbarBtnType.TOOLBAR_BACK,
          action: () =>
            ToolbarModule.getParams().setToolbarVisible(
              true,
              'ARIMAGEMODULE_selected',
            ),
        },
      ]
      pageAction = () => {
        SARImage.setTapAction('NONE')
        SARImage.setPlaneVisible(false)
      }
      break
    case 'ARIMAGEMODULE_modify_style':
      buttons = [
        {
          type: ToolbarBtnType.TOOLBAR_BACK,
          action: () =>
            ToolbarModule.getParams().setToolbarVisible(
              true,
              'ARIMAGEMODULE_selected',
            ),
        },
      ]
      pageAction = () => {
        SARImage.setTapAction('NONE')
        SARImage.setPlaneVisible(false)
      }
      break
    case 'ARIMAGEMODULE_modifyToPlane':
      buttons = [
        {
          type: ToolbarBtnType.TOOLBAR_BACK,
          action: () =>
            ToolbarModule.getParams().setToolbarVisible(
              true,
              'ARIMAGEMODULE_modify_location',
            ),
        },
      ]
      pageAction = () => {
        SARImage.setTapAction('MODIFY')
        SARImage.setPlaneVisible(true)
        SARImage.setOnModifyListener(() => {
          ToolbarModule.getParams().setToolbarVisible(true, 'ARIMAGEMODULE')
        })
      }
      break
    case 'ARIMAGEMODULE_modifyBy':
      buttons = [
        {
          type: ToolbarBtnType.TOOLBAR_BACK,
          action: () => {
            SARImage.move(0, 0, 0)
            ToolbarModule.getParams().setToolbarVisible(
              true,
              'ARIMAGEMODULE_modify_style',
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
            SARImage.move(currentX, currentY, currentZ, true)
            ToolbarModule.getParams().setToolbarVisible(true, 'ARIMAGEMODULE')
          },
        },
      ]
      pageAction = () => {
        SARImage.setTapAction('NONE')
        SARImage.setPlaneVisible(false)
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
            SARImage.move(currentX, currentY, currentZ)
          }}
          onMoveY={value => {
            let currentY = value / 10
            ToolbarModule.addData({ currentY })
            let { currentX, currentZ } = ToolbarModule.getData()
            currentX = currentX === undefined ? 0 : currentX
            currentZ = currentZ === undefined ? 0 : currentZ
            SARImage.move(currentX, currentY, currentZ)
          }}
          onMoveZ={value => {
            let currentZ = value / 10
            ToolbarModule.addData({ currentZ })
            let { currentX, currentY } = ToolbarModule.getData()
            currentX = currentX === undefined ? 0 : currentX
            currentY = currentY === undefined ? 0 : currentY
            SARImage.move(currentX, currentY, currentZ)
          }}
        />
      )
      break
    case 'ARIMAGEMODULE_modifyViewRange':
      buttons = [
        {
          type: ToolbarBtnType.TOOLBAR_BACK,
          action: () => {
            ToolbarModule.getParams().setToolbarVisible(
              true,
              'ARIMAGEMODULE_modify_style',
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
            SARImage.setViewRange(viewRange)
            ToolbarModule.getParams().setToolbarVisible(true, 'ARIMAGEMODULE')
          },
        },
      ]
      pageAction = () => {
        SARImage.setTapAction('NONE')
        SARImage.setPlaneVisible(false)
        ToolbarModule.addData({
          viewRange: undefined,
        })
      }
      customView = () => (
        <Slide
          range={[1, 30]}
          defaultValue={ToolbarModule.getData().defaultViewRange}
          unit={getLanguage(global.language).Map_Main_Menu.METERS}
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
    case 'ARIMAGEMODULE_modify_style':
      data = [
        {
          des: 'modifyBy',
          key: global.language === 'CN' ? '位置调整' : 'Position',
          action: () =>
            ToolbarModule.getParams().setToolbarVisible(
              true,
              'ARIMAGEMODULE_modifyBy',
              { containerType: 'xyzslide' },
            ),
        },
        {
          des: 'viewRange',
          key: global.language === 'CN' ? '可见距离' : 'Visible Distance',
          action: async () => {
            let defaultViewRange = await SARImage.getViewRange()
            ToolbarModule.addData({ defaultViewRange })
            ToolbarModule.getParams().setToolbarVisible(
              true,
              'ARIMAGEMODULE_modifyViewRange',
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
