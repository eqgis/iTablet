import * as React from 'react'
import { getToolbarModule } from '../../workspace/components/ToolBar/modules/ToolbarModule'
import { SSceneAR ,EngineType} from 'imobile_for_reactnative'
import ToolbarBtnType from '../../workspace/components/ToolBar/ToolbarBtnType'
import XYZSlide from '../../../components/XYZSlide'
import RevolveSlide from '../../../components/RevolveSlide'
import { FileTools } from '../../../native'
import { ConstPath } from '../../../constants'

let ToolbarModule = getToolbarModule('AR')

async function getData(type) {
  // let defaultpath =(await FileTools.appendingHomeDirectory()) + ConstPath.Common
  let data = []
  let buttons = []
  let customView = null
  let pageAction = () => {}
  switch (type) {
    case 'SM_ARSCENEMODULE':
      buttons = [
        {
          type: 'add',
          image: require('../../../assets/function/icon_function_style.png'),
          action: () => {
            ToolbarModule.getParams().setToolbarVisible(
              true,
              'SM_ARSCENEMODULE_modify_style',
              {
                showMenuDialog: true,
              },
            )
          },
        },
      ]
      break
      case 'SM_ARSCENEMODULE_modify_style':
        buttons = [
          {
            type: ToolbarBtnType.TOOLBAR_BACK,
            action: () =>
              ToolbarModule.getParams().setToolbarVisible(
                true,
                'SM_ARSCENEMODULE',
              ),
          },
        ]
        break
        case 'SM_ARSCENEMODULE_modifyBy':
          buttons = [
            {
              type: ToolbarBtnType.TOOLBAR_BACK,
              action: () => {
                SSceneAR.setSceneTransLation(0, 0, 0)
                ToolbarModule.getParams().setToolbarVisible(
                  true,
                  'SM_ARSCENEMODULE_modify_style',
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
                SSceneAR.saveSceneTransLation(currentX, currentZ, currentY)
                ToolbarModule.getParams().setToolbarVisible(true, 'SM_ARSCENEMODULE')
              },
            },
          ]
          pageAction = () => {
            ToolbarModule.addData({
              currentX: undefined,
              currentY: undefined,
              currentZ: undefined,
            })
          }
          customView = () => (
            <XYZSlide
              rangeX={[-40, 40]}
              rangeY={[-40, 40]}
              rangeZ={[-40, 40]}
              onMoveX={value => {
                let currentX = value / 10
                ToolbarModule.addData({ currentX })
                let { currentY, currentZ } = ToolbarModule.getData()
                currentY = currentY === undefined ? 0 : currentY
                currentZ = currentZ === undefined ? 0 : currentZ
                SSceneAR.setSceneTransLation(currentX, currentZ, currentY)
              }}
              onMoveY={value => {
                let currentY = value / 10
                ToolbarModule.addData({ currentY })
                let { currentX, currentZ } = ToolbarModule.getData()
                currentX = currentX === undefined ? 0 : currentX
                currentZ = currentZ === undefined ? 0 : currentZ
                SSceneAR.setSceneTransLation(currentX, currentZ, currentY)
              }}
              onMoveZ={value => {
                let currentZ = value / 10
                ToolbarModule.addData({ currentZ })
                let { currentX, currentY } = ToolbarModule.getData()
                currentX = currentX === undefined ? 0 : currentX
                currentY = currentY === undefined ? 0 : currentY
                SSceneAR.setSceneTransLation(currentX, currentZ, currentY)
              }}
              style={{ width: 280 }}
            />
          )
          break
          case 'SM_ARSCENEMODULE_revolve':
          buttons = [
            {
              type: ToolbarBtnType.TOOLBAR_BACK,
              action: () => {
                SSceneAR.setSceneRotation(0, 0, 0)
                ToolbarModule.getParams().setToolbarVisible(
                  true,
                  'SM_ARSCENEMODULE_modify_style',
                  { showMenuDialog: true },
                )
              },
            },
            {
              type: 'modify_confirm',
              image: require('../../../assets/mapEdit/commit.png'),
              action: () => {
                let { currentRX, currentRY, currentRZ } = ToolbarModule.getData()
                currentRX = currentRX === undefined ? 0 : currentRX
                currentRY = currentRY === undefined ? 0 : currentRY
                currentRZ = currentRZ === undefined ? 0 : currentRZ
                SSceneAR.saveSceneRotation(currentRX, currentRZ, currentRY)
                ToolbarModule.getParams().setToolbarVisible(true, 'SM_ARSCENEMODULE')
              },
            },
          ]
          pageAction = () => {
            ToolbarModule.addData({
              currentRX: undefined,
              currentRY: undefined,
              currentRZ: undefined,
            })
          }
          customView = () => (
            <XYZSlide
            rangeX={[-180, 180]}
            rangeY={[-180, 180]}
            rangeZ={[-180, 180]}
            onMoveX={value => {
              let currentRX = value
              ToolbarModule.addData({ currentRX })
              let { currentRY, currentRZ } = ToolbarModule.getData()
              currentRY = currentRY === undefined ? 0 : currentRY
              currentRZ = currentRZ === undefined ? 0 : currentRZ
              SSceneAR.setSceneRotation(currentRX, currentRZ, currentRY)
            }}
            onMoveY={value => {
              let currentRY = value
              ToolbarModule.addData({ currentRY })
              let { currentRX, currentRZ } = ToolbarModule.getData()
              currentRX = currentRX === undefined ? 0 : currentRX
              currentRZ = currentRZ === undefined ? 0 : currentRZ
              SSceneAR.setSceneRotation(currentRX, currentRZ, currentRY)
            }}
            onMoveZ={value => {
              let currentRZ = value
              ToolbarModule.addData({ currentRZ })
              let { currentRX, currentRY } = ToolbarModule.getData()
              currentRX = currentRX === undefined ? 0 : currentRX
              currentRY = currentRY === undefined ? 0 : currentRY
              SSceneAR.setSceneRotation(currentRX, currentRZ, currentRY)
            }}
            style={{ width: 280 }}
          />
          )
          break
  }

  return { data, buttons ,customView,pageAction}
}

function getMenuData(type) {
  let data = []
  switch (type) {
    case 'SM_ARSCENEMODULE_modify_style':
      data = [
        {
          des: 'modifyBy',
          key: global.language === 'CN' ? '位置调整' : 'Position',
          action: () =>
            ToolbarModule.getParams().setToolbarVisible(
              true,
              'SM_ARSCENEMODULE_modifyBy',
              { containerType: 'xyzslide' },
            ),
        },
        {
          des: 'revolve',
          key: global.language === 'CN' ? '旋转角度' : 'Revolve',
          action: () =>
            ToolbarModule.getParams().setToolbarVisible(
              true,
              'SM_ARSCENEMODULE_revolve',
              { containerType: 'xyzslide' },
            ),
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
