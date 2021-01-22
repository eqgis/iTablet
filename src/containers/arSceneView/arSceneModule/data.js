/* eslint-disable react/jsx-indent-props */
/* eslint-disable no-inner-declarations */
/* eslint-disable no-case-declarations */
/* eslint-disable indent */
import * as React from 'react'
import { getToolbarModule } from '../../workspace/components/ToolBar/modules/ToolbarModule'
import { SSceneAR ,EngineType} from 'imobile_for_reactnative'
import ToolbarBtnType from '../../workspace/components/ToolBar/ToolbarBtnType'
import XYZSlide from '../../../components/XYZSlide'
import { getThemeAssets } from '../../../assets'
import { FileTools } from '../../../native'
import { ToolbarType ,ConstToolType ,ConstPath} from '../../../constants'
import { getLanguage } from '../../../language'
import DataHandler from '../../tabs/Mine/DataHandler'
import { TouchableOpacity, Text, Image, View } from 'react-native'
import { Toast, scaleSize } from '../../../utils'
import NavigationService from '../../NavigationService'
import { size, color } from '../../../styles'

let ToolbarModule = getToolbarModule('AR')

// 图片识别按钮
const trackData = {
  type: 'track',
  image: getThemeAssets().ar.toolbar.icon_ar_pipe_scan,
  action: async () => {
    await SSceneAR.imageTrack()
    GLOBAL.Loading.setLoading(true,getLanguage(GLOBAL.language).Prompt.TRACKING_LOADING)
  },
}

async function getData(type) {
  // let defaultpath =(await FileTools.appendingHomeDirectory()) + ConstPath.Common
  let data = []
  let buttons = []
  let customView = null
  let pageAction = () => {}
  let TransLation
  let Rotation
  switch (type) {
    case ConstToolType.SM_ARSCENEMODULE_NOMAL:
        // 退出打开样例数据时的showFullMap
        GLOBAL.toolBox && GLOBAL.toolBox.existFullMap()
        buttons = [
          {
            type: ToolbarBtnType.PLACEHOLDER,
          },
          // {
          //   type: ToolbarBtnType.PLACEHOLDER,
          // },
          trackData,
          {
            type: 'add',
            image: require('../../../assets/mapTools/icon_add_white.png'),
            action: async () => {
              GLOBAL.ARContainer.setHeaderVisible(false)
              const type = ConstToolType.SM_ARSCENEMODULE_WORKSPACE
              ToolbarModule.getParams().setToolbarVisible(true, type, {
                containerType: ToolbarType.list,
                isFullScreen: true,
              })
            },
          },
        ]
      break
    case ConstToolType.SM_ARSCENEMODULE:
      // 退出打开样例数据时的showFullMap
      GLOBAL.toolBox && GLOBAL.toolBox.existFullMap()
      buttons = [
        {
          type: 'style',
          image: require('../../../assets/lightTheme/themeType/theme_create_unique_style_white.png'),
          action: () => {
            GLOBAL.ARContainer.setHeaderVisible(false)
            ToolbarModule.getParams().setToolbarVisible(
              true,
              ConstToolType.SM_ARSCENEMODULE_modify_style,
              {
                showMenuDialog: true,
              },
            )
          },
        },
        {
          type: 'change',
          image: require('../../../assets/lightTheme/collection/icon_collection_change.png'),
          action: () => {
            const containerType = ToolbarType.list
            GLOBAL.ARContainer.setHeaderVisible(false)
            ToolbarModule.getParams().setToolbarVisible(true, ConstToolType.SM_ARSCENEMODULE_CHANGE, {
              containerType,
            })
          },
        },
        {
          type: 'add',
          image: require('../../../assets/mapTools/icon_add_white.png'),
          action: async () => {
            GLOBAL.ARContainer.setHeaderVisible(false)
            const type = ConstToolType.SM_ARSCENEMODULE_WORKSPACE
            ToolbarModule.getParams().setToolbarVisible(true, type, {
              containerType: ToolbarType.list,
              isFullScreen: true,
            })
          },
        },
      ]
      break
      case ConstToolType.SM_ARSCENEMODULE_WORKSPACE:
          let customname = await SSceneAR.getCurrentWorkSpaceName()
          const data1 = []
          try {
            const user = GLOBAL.currentUser
            const path = await FileTools.appendingHomeDirectory(
              `${ConstPath.UserPath + user.userName}/${ConstPath.RelativeFilePath.Scene}`,
            )
            const result = await FileTools.fileIsExist(path)
            if(result){
              let fileList = await DataHandler.getLocalData(user, 'SCENE')
              const _data = []
              for (let index = 0; index < fileList.length; index++) {
                if(fileList[index].Type!==undefined)
                {
                const element = fileList[index]
                if (element.name.indexOf('.pxp') > -1) {
                  fileList[index].name = element.name.substr(
                    0,
                    element.name.lastIndexOf('.'),
                  )
                  if (GLOBAL.language === 'EN') {
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
                  element.image = require('../../../assets/mapToolbar/list_type_map_black.png')
                  if (element.name === customname.name) {
                    element.rightView = (
                      <View
                        style={{
                          height: scaleSize(30),
                          width: scaleSize(120),
                          borderRadius: scaleSize(4),
                          backgroundColor: color.bgG,
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginRight: scaleSize(30),
                        }}
                      >
                        <Text
                          style={{
                            fontSize: size.fontSize.fontSizeSm,
                            color: 'white',
                            backgroundColor: 'transparent',
                          }}
                        >
                          {getLanguage(GLOBAL.language).Map_Main_Menu.CURRENT_SCENCE}
                        </Text>
                      </View>
                    )
                  }
                  _data.push(element)
                }
              }
              }
              data1.push({
                image: require('../../../assets/mapToolbar/list_type_maps.png'),
                title: getLanguage(GLOBAL.language).Map_Label.SCENE,
                data: _data,
              })
            }
          } catch (error) {
            Toast.show(getLanguage(GLOBAL.language).Prompt.NO_SCENE_LIST)
          }
    
          function renderRightButton ({title, image, action}) {
            return (
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  height: scaleSize(80),
                  marginRight: scaleSize(30),
                }}
                onPress={() => action && action()}
              >
                {title && (
                  <Text
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                    style={{
                      fontSize: size.fontSize.fontSizeMd,
                      height: scaleSize(30),
                      backgroundColor: 'transparent',
                      color: color.section_text,
                      textAlignVertical: 'center',
                      textAlign: 'right',
                    }}
                  >
                    {title}
                  </Text>
                )}
                {image && (
                  <Image
                    source={image}
                    resizeMode={'contain'}
                    style={{
                      width: scaleSize(40),
                      height: scaleSize(40),
                    }}
                  />
                )}
              </TouchableOpacity>
            )
          }
    
          data1[0].buttons = [
            renderRightButton({
              title: getLanguage(GLOBAL.language).Profile.SAMPLEDATA,
              action: () => {
                NavigationService.navigate('SampleMap', {
                  refreshAction: getSceneData,
                  // isfull: false,
                })
                // 样例数据界面半屏显示，并且隐藏上一层控件 by zcj
                GLOBAL.toolBox && GLOBAL.toolBox.showFullMap()
              },
            }),
          ]

          let Type
          if(GLOBAL.isSceneOpen){
            Type = ConstToolType.SM_ARSCENEMODULE
          }else{
            Type = ConstToolType.SM_ARSCENEMODULE_NOMAL
          }

          buttons = [
            {
              type: ToolbarBtnType.TOOLBAR_BACK,
              action: () =>{
                // 退出打开样例数据时的showFullMap
                GLOBAL.toolBox && GLOBAL.toolBox.existFullMap()
                GLOBAL.ARContainer.setHeaderVisible(true)
                ToolbarModule.getParams().setToolbarVisible(
                  true,
                  Type,
                )
            },
            },
          ]
          data = data1
        break
      case ConstToolType.SM_ARSCENEMODULE_modify_style:
        buttons = [
          {
            type: ToolbarBtnType.TOOLBAR_BACK,
            action: () =>{
              GLOBAL.ARContainer.setHeaderVisible(true)
              ToolbarModule.getParams().setToolbarVisible(
                true,
                ConstToolType.SM_ARSCENEMODULE,
              )
          },
          },
        ]
        break
        case ConstToolType.SM_ARSCENEMODULE_TransLation:
          TransLation = await SSceneAR.getSceneTransLation()
          buttons = [
            {
              type: ToolbarBtnType.TOOLBAR_BACK,
              action: () => {
                let { currentX, currentY, currentZ } = ToolbarModule.getData()
                currentX = currentX === undefined ? 0 : currentX
                currentY = currentY === undefined ? 0 : currentY
                currentZ = currentZ === undefined ? 0 : currentZ
                SSceneAR.saveSceneTransLation(currentX, currentZ, currentY)
                ToolbarModule.getParams().setToolbarVisible(
                  true,
                  ConstToolType.SM_ARSCENEMODULE_modify_style,
                  { showMenuDialog: true },
                )
              },
            },
            {
              type: 'modify_confirm',
              image: require('../../../assets/mapEdit/icon_clear.png'),
              action: () => {
                SSceneAR.setSceneTransLation(TransLation.TransLationx, TransLation.TransLationy, TransLation.TransLationz)
                this.XYZSlide.onClear()
              },
            },
          ]
          pageAction = () => {
            ToolbarModule.addData({
              currentX: TransLation.TransLationx,
              currentY: TransLation.TransLationz,
              currentZ: TransLation.TransLationy,
            })
          }
          customView = () => (
            <XYZSlide
              ref={ref => (this.XYZSlide = ref)}
              rangeX={[-50, 50]}
              rangeY={[-50, 50]}
              rangeZ={[-50, 50]}
              isTransLation={true}
              hasTitle={true}
              onMoveX={value => {
                let currentX = value*10
                // 每次调整位置，基于上次位置偏移 by zcj
                let total = currentX + TransLation.TransLationx
                ToolbarModule.addData({ currentX: total })
                let { currentY, currentZ } = ToolbarModule.getData()
                currentY = currentY === undefined ? 0 : currentY
                currentZ = currentZ === undefined ? 0 : currentZ
                SSceneAR.setSceneTransLation(total, currentZ, currentY)
              }}
              onMoveY={value => {
                let currentY = value*10
                let total = currentY + TransLation.TransLationz
                ToolbarModule.addData({ currentY: total })
                let { currentX, currentZ } = ToolbarModule.getData()
                currentX = currentX === undefined ? 0 : currentX
                currentZ = currentZ === undefined ? 0 : currentZ
                SSceneAR.setSceneTransLation(currentX, currentZ, total)
              }}
              onMoveZ={value => {
                let currentZ = value*10
                let total = currentZ + TransLation.TransLationy
                ToolbarModule.addData({ currentZ: total })
                let { currentX, currentY } = ToolbarModule.getData()
                currentX = currentX === undefined ? 0 : currentX
                currentY = currentY === undefined ? 0 : currentY
                SSceneAR.setSceneTransLation(currentX, total , currentY)
              }}
              style={{ width: 280 }}
              // defaultValuex={TransLation.TransLationx/10}
              // defaultValuey={TransLation.TransLationz/10}
              // defaultValuez={TransLation.TransLationy/10}
              // 每次调整位置时，起始位置在上次位置
              defaultValuex={0}
              defaultValuey={0}
              defaultValuez={0}
            />
          )
          break
          case ConstToolType.SM_ARSCENEMODULE_Rotation:
          Rotation = await SSceneAR.getSceneRotation()
          buttons = [
            {
              type: ToolbarBtnType.TOOLBAR_BACK,
              action: () => {
                let { currentRX, currentRY, currentRZ } = ToolbarModule.getData()
                currentRX = currentRX === undefined ? 0 : currentRX
                currentRY = currentRY === undefined ? 0 : currentRY
                currentRZ = currentRZ === undefined ? 0 : currentRZ
                SSceneAR.saveSceneRotation(currentRX, currentRY, currentRZ)
                ToolbarModule.getParams().setToolbarVisible(
                  true,
                  ConstToolType.SM_ARSCENEMODULE_modify_style,
                  { showMenuDialog: true },
                )
              },
            },
            {
              type: 'modify_confirm',
              image: require('../../../assets/mapEdit/icon_clear.png'),
              action: () => {
                SSceneAR.setSceneRotation(Rotation.Rotationx, Rotation.Rotationy, Rotation.Rotationz)
                this.XYZSlide.onClear()
              },
            },
          ]
          pageAction = () => {
            ToolbarModule.addData({
              currentRX: Rotation.Rotationx,
              currentRY: Rotation.Rotationy,
              currentRZ: Rotation.Rotationz,
            })
          }
          customView = () => (
            <XYZSlide
            ref={ref => (this.XYZSlide = ref)}
            rangeX={[-180, 180]}
            rangeY={[-180, 180]}
            rangeZ={[-180, 180]}
            isRotation={true}
            hasTitle={true}
            onMoveX={value => {
              let currentRX = value
              ToolbarModule.addData({ currentRX })
              let { currentRY, currentRZ } = ToolbarModule.getData()
              currentRY = currentRY === undefined ? 0 : currentRY
              currentRZ = currentRZ === undefined ? 0 : currentRZ
              SSceneAR.setSceneRotation(currentRX, currentRY, currentRZ)
            }}
            onMoveY={value => {
              let currentRY = value
              ToolbarModule.addData({ currentRY })
              let { currentRX, currentRZ } = ToolbarModule.getData()
              currentRX = currentRX === undefined ? 0 : currentRX
              currentRZ = currentRZ === undefined ? 0 : currentRZ
              SSceneAR.setSceneRotation(currentRX, currentRY, currentRZ)
            }}
            onMoveZ={value => {
              let currentRZ = value
              ToolbarModule.addData({ currentRZ })
              let { currentRX, currentRY } = ToolbarModule.getData()
              currentRX = currentRX === undefined ? 0 : currentRX
              currentRY = currentRY === undefined ? 0 : currentRY
              SSceneAR.setSceneRotation(currentRX, currentRY, currentRZ)
            }}
            style={{ width: 280 }}
            defaultValuex={Rotation.Rotationx}
            defaultValuey={Rotation.Rotationy}
            defaultValuez={Rotation.Rotationz}
          />
          )
          break
          case ConstToolType.SM_ARSCENEMODULE_CHANGE:
              let mapData = await SSceneAR.getSceneLayer()
              let CurrentLayer = await SSceneAR.getCurrentLayerName()
              const _data = []
              for (let index = 0; index < mapData.length; index++) {
                const element = mapData[index]
                element.image = require('../../../assets/mapToolbar/list_type_map_black.png')
                element.name = mapData[index].name
                if (element.name=== CurrentLayer.name) {
                  element.rightView = (
                    <View
                      style={{
                        height: scaleSize(30),
                        width: scaleSize(120),
                        borderRadius: scaleSize(4),
                        backgroundColor: color.bgG,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: scaleSize(30),
                      }}
                    >
                      <Text
                        style={{
                          fontSize: size.fontSize.fontSizeSm,
                          color: 'white',
                          backgroundColor: 'transparent',
                        }}
                      >
                        {getLanguage(GLOBAL.language).Map_Main_Menu.CURRENT_MODEL}
                      </Text>
                    </View>
                  )
                }
                _data.push(element)
              }

              
              // mapData.forEach(item => {
              //   item.image = require('../../../assets/mapToolbar/list_type_map_black.png')
              //   item.name = item.name
              
              // })
          buttons = [
                {
                  type: ToolbarBtnType.TOOLBAR_BACK,
                  action: () => {
                    GLOBAL.ARContainer.setHeaderVisible(true)
                    ToolbarModule.getParams().setToolbarVisible(true, ConstToolType.SM_ARSCENEMODULE)
                  },
                },
              ]

          data = [ 
            {
            title: getLanguage(GLOBAL.language).Map_Main_Menu
              .NETWORK_MODEL,
            image: require('../../../assets/mapToolbar/list_type_map.png'),
            data: _data,
            }
          ]
          break
  }

  return { data, buttons ,customView,pageAction}
}

function getMenuData(type) {
  let data = []
  switch (type) {
    case ConstToolType.SM_ARSCENEMODULE_modify_style:
      data = [
        {
          des: 'modifyBy',
          key: global.language === 'CN' ? '位置调整' : 'Position',
          action: () =>
            ToolbarModule.getParams().setToolbarVisible(
              true,
              ConstToolType.SM_ARSCENEMODULE_TransLation,
              { containerType: 'xyzslide' },
            ),
        },
        {
          des: 'revolve',
          key: global.language === 'CN' ? '旋转角度' : 'Revolve',
          action: () =>
            ToolbarModule.getParams().setToolbarVisible(
              true,
              ConstToolType.SM_ARSCENEMODULE_Rotation,
              { containerType: 'xyzslide' },
            ),
        },
      ]
      break
  }
  return data
}


async function getSceneData() {
  const type = ConstToolType.SM_ARSCENEMODULE_WORKSPACE
  ToolbarModule.getParams().setToolbarVisible(true, type, {
    containerType: ToolbarType.list,
    isFullScreen: true,
  })
}

export default {
  getData,
  getMenuData,
}
