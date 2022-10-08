import { ARAction, ARElementType, SARMap } from "imobile_for_reactnative"
import { ARElement, IAnimationParam } from "imobile_for_reactnative/types/interface/ar"
import { ModuleList } from ".."
import { getImage } from "../../../assets"
import { getLanguage } from "../../../language"
import { ToolbarTabItem } from "imobile_for_reactnative/components/ToolbarKit"
import { IToolbarOption, ToolBarBottomItem, ToolBarListItem, ToolBarListOption, ToolbarOption } from "imobile_for_reactnative/components/ToolbarKit"
import { AppEvent, AppInputDialog, AppLog, AppToolBar, CheckSpell, Toast } from "../../../utils"
import { AddOption, cancelAddARLinePoint, editAddLinePoint} from "../arMapAdd/Actions"
import { ARMapEditViewOption } from "./ARMapEditView"
import { Platform } from "react-native"
import { ARAnimatorType, ARNodeAnimatorType } from "imobile_for_reactnative/NativeModule/dataTypes"
import { ARNodeAnimatorParameter } from "imobile_for_reactnative/NativeModule/interfaces/ar/SARMap"
import NavigationService from "@/containers/NavigationService"
import { COLORS } from "@/utils/AppStyle"
import { ToolBarMenuItem } from "imobile_for_reactnative/components/ToolbarKit/component/ToolBarMenu"


/** 是否是回退到达的编辑工具栏 */
let isBackEdit = false
/** 是否显示了动画类型切换按钮 */
let isShowAnimationChangeBtn = false

export function getData(key: ModuleList['ARMAP_EDIT']): IToolbarOption {
  const option = new ToolbarOption<ARMapEditViewOption>()

  option.showBackground = false
  option.moduleData = {
    showDelete: false,
    addAnimationType: 'null',
  }

  switch(key) {
    case 'AR_MAP_EDIT_ELEMENT':
      editElementOption(option)
      break
    case 'AR_MAP_EDIT_3DLAYER':
      edit3DLayerOption(option)
      break
    /** 矢量线的编辑 */
    case 'AR_MAP_EDIT_GEOMETRY':
      editGeometryOption(option)
      break
    /** 矢量线编辑的节点添加 */
    case 'AR_MAP_EDIT_GEOMETRY_LINE_ADD':
      GeometryLinePointAdd(option, editAddLinePoint)
      break

    case 'AR_MAP_EDIT_ADD_ANIME_NODE':
      option.moduleData.addAnimationType = 'node'
      break
    case 'AR_MAP_EDIT_ADD_ANIME_MODEL':
      option.moduleData.addAnimationType = 'model'
      break
    case 'AR_MAP_EDIT_ADD_ANIME_TRANSLATION':
      addTransAnimeOption(option)
      break
    case 'AR_MAP_EDIT_ADD_ANIME_ROTATION':
      addRotateAnimeOption(option)
      break


    case 'AR_MAP_EDIT_ELEMENT_SETTING':
      settingElementOption(option)
      break
    case 'AR_MAP_EDIT_ELEMENT_SETTING_IITLE':
      settingElementOption_title(option)
      break
    case 'AR_MAP_EDIT_ELEMENT_SETTING_ARRAY':
      settingElementOption_array(option)
      break
    case 'AR_MAP_EDIT_ELEMENT_SETTING_BACKGROUND':
      settingElementOption_background(option)
      break

  }



  return option

}



/** POI/模型位置变换 */
function editElementOption(option: ToolbarOption<ARMapEditViewOption>) {
  const element = AppToolBar.getData().selectARElement
  if(!element)  {
    AppLog.error('未选中对象！')
    return
  }

  if(option.moduleData) {
    option.moduleData.showDelete = true
  }

  option.pageAction = () => {
    AppToolBar.addData({
      transformInfo: {
        layerName: element.layerName,
        id: element.id,
        touchType: element.touchType,
        type: 'position',
        positionX: 0,
        positionY: 0,
        positionZ: 0,
        rotationX: 0,
        rotationY: 0,
        rotationZ: 0,
        scale: 0
      }
    })
  }

  SARMap.appointEditElement(element.id, element.layerName)

  option.bottomData = getPoiEditBottom(element)
  // option.tabOption.isShowToggle = true
  option.menuOption.defaultIndex = 0
  option.menuOption.isShowView = false
  if(element.type === ARElementType.AR_MODEL || element.type === ARElementType.AR_ELEMENT_GROUP) {
    const tabData = _getTransformTabData(element)
    // 不是从编辑的入口进入的编辑工具栏（是从动画添加回退的）
    if(option.moduleData && isBackEdit) {
      option.menuOption.defaultIndex = 3
      option.menuOption.isShowView = true
      isBackEdit = false
    }

    if(option.menuOption.defaultIndex === 3 && AppToolBar.getData().ownModelAnimation) {
      const buttons = getPoiEditBottom(element)
      const button =  {
        image: getImage().swith_animation_type,
        onPress: () => {
          if(animatonMode === 'custome') {
            animatonMode = 'model'
          } else if(animatonMode === 'model'){
            animatonMode = 'custome'
          }
          AppToolBar.resetPage()
        }
      }
      buttons.splice(1, 0, button)
      option.bottomData = buttons
    }
    option.menuOption.data = tabData.concat([Platform.OS === 'ios' ? _getModelAnimationTabList(element) : _getAnimationTabList(element)])
  } else {
    option.menuOption.data = _getTransformTabData(element)
  }
}


/** 设置场景/图层位置变换 */
async function edit3DLayerOption(option: IToolbarOption) {
  const layerName = AppToolBar.getData().selectARLayer?.name
  if(!layerName) {
    AppLog.error('未指定图层！')
    return
  }

  option.pageAction = () => {
    AppToolBar.addData({
      transformInfo: {
        layerName,
        id: 0,
        touchType: 0,
        type: 'position',
        positionX: 0,
        positionY: 0,
        positionZ: 0,
        rotationX: 0,
        rotationY: 0,
        rotationZ: 0,
        scale: 0
      }
    })
  }

  SARMap.appointEditAR3DLayer(layerName)

  option.bottomData = getPoiEditBottom(layerName)
  option.menuOption.data = _getTransformTabData(layerName)
}

/** 矢量线或矢量符号线的编辑 */
function editGeometryOption(option: ToolbarOption<ARMapEditViewOption>) {
  const element = AppToolBar.getData().selectARElement
  if(!element)  {
    AppLog.error('未选中对象！')
    return
  }

  option.pageAction = () => {
    AppToolBar.addData({
      transformInfo: {
        layerName: element.layerName,
        id: element.id,
        touchType: element.touchType,
        type: 'position',
        positionX: 0,
        positionY: 0,
        positionZ: 0,
        rotationX: 0,
        rotationY: 0,
        rotationZ: 0,
        scale: 0
      }
    })
  }

  SARMap.appointEditElement(element.id, element.layerName)

  // option.bottomData = getPoiEditBottom(element)
  option.bottomData = [
    {
      image: getImage().icon_toolbar_quit,
      onPress: async() => {
        // AppToolBar.resetTabData()
        AppToolBar.goBack()
        SARMap.cancel()
      }
    },
    {
      image: getImage().icon_submit,
      onPress: () => {
        const transformData = AppToolBar.getData().transformInfo
        const editItem = AppToolBar.getData().selectARElement
        if(!transformData || !editItem) return
        SARMap.submit().then(() => {
          AppToolBar.resetTabData()
          AppToolBar.addData({
            transformInfo: {
              layerName: editItem.layerName,
              id: editItem.id,
              touchType: editItem.touchType,
              type: 'position',
              positionX: 0,
              positionY: 0,
              positionZ: 0,
              rotationX: 0,
              rotationY: 0,
              rotationZ: 0,
              scale: 0
            }
          })
          // SARMap.appointEditElement(editItem.id, editItem.layerName)
          SARMap.setAction(ARAction.NULL)
          SARMap.clearSelection()
          AppToolBar.hide()
        }
        )}
    },
  ]

  // option.tabOption.isShowToggle = true
  option.menuOption.isShowView = false

  if(option.moduleData) {
    option.moduleData.showDelete = true
  }

  if(element.type === ARElementType.AR_MARKER_LINE || element.type === ARElementType.AR_LINE){
    option.menuOption.data = _getGeometryLineObjectTabData()
  }
}

/** 编辑里的 矢量线 或 矢量符号线 的节点添加 */
function GeometryLinePointAdd(option: ToolbarOption<ARMapEditViewOption>, addFunc: (addOption?: AddOption) => Promise<void>) {

  // 底部的按钮
  option.bottomData = [
    {
      image: getImage().icon_toolbar_quit,
      onPress: () => {
        // 返回按钮
        AppToolBar.addData({isLineAdd:false})
        SARMap.setAction(ARAction.NULL)
        AppEvent.emitEvent('ar_map_add_end')

        // const layer = AppToolBar.getProps()?.arMapInfo?.currentLayer
        // if(layer && (layer.type === ARLayerType.AR_LINE_LAYER || layer.type === ARLayerType.AR_MARKER_LINE_LAYER)) {
        //   SARMap.exitAddARLine(layer.name)
        // }
        const elementEdit = AppToolBar.getData().selectARElement
        if(elementEdit) {
          const layerName = elementEdit?.layerName
          SARMap.exitAddARLine(layerName)
        }
        SARMap.cancel()
        // SARMap.exitAddARLine()
        // AppToolBar.goBack()
        AppToolBar.show('ARMAP', 'AR_MAP_SELECT_ELEMENT')
      }
    },
    {
      image: getImage().toolbar_switch,
      onPress: async () => {
        AppToolBar.toggleListVisible()
      }
    },
    {
      image: getImage().undo,
      onPress: async () => {
        // 撤销按钮
        cancelAddARLinePoint()
      },
    },
    {
      image: getImage().icon_submit,
      onPress: () => {
        // 提交或完成按钮
        SARMap.submit().then(() => {
          AppToolBar.addData({isLineAdd:false})
          SARMap.setAction(ARAction.NULL)
          AppEvent.emitEvent('ar_map_add_end')
          AppToolBar.show('ARMAP', 'AR_MAP_SELECT_ELEMENT')
        })
      }
    },
  ]

  option.listData ={data: [{
    image: getImage().ar_add_location,
    onPress: () => {
      // 无焦点添加点
      SARMap.setAction(ARAction.VERTEX_ADD)
      // 添加到当前位置
      AppToolBar.addData({isLineAdd:true})

      // 对点击添加按钮做监听
      AppEvent.removeListener('ar_on_tap_add_buttun')
      AppEvent.addListener('ar_on_tap_add_buttun', async () => {
        const isLineAdd = AppToolBar.getData().isLineAdd
        if(!isLineAdd) return
        const option: AddOption = {
          foucus: false,
          updatefoucus: false,
        }
        // 线的节点添加完成
        addFunc(option).then(() => {
          Toast.show(getLanguage().LINE_POINT_ADD_SUCCESSED)
        }).catch(() => {
          AppToolBar.addData({isLineAdd:false})
        })
      })
      AppEvent.emitEvent('ar_map_add_start')
      AppToolBar.toggleListVisible()
    }
  }, {
    image: getImage().ar_add_point,
    onPress: () => {
      // 添加到指定点的位置
      // AppEvent.emitEvent('ar_map_add_end')
      // 有焦点添加点
      SARMap.setAction(ARAction.VERTEX_ADD_FOUCUS)
      AppToolBar.addData({isLineAdd:true})
      // 对点击添加按钮做监听
      AppEvent.removeListener('ar_on_tap_add_buttun')
      AppEvent.addListener('ar_on_tap_add_buttun', async () => {
        // 获取指定点的中心位置坐标
        const translation = await SARMap.getCurrentCenterHitPoint()
        // 当指定点的位置坐标获取成功时才去添加线的节点
        if(translation) {
          const isLineAdd = AppToolBar.getData().isLineAdd
          if(!isLineAdd) return
          const option: AddOption = {
            translation
          }
          // 线的节点添加完成
          addFunc(option).then(() => {
            Toast.show(getLanguage().LINE_POINT_ADD_SUCCESSED)
          }).catch(() => {
            AppToolBar.addData({isLineAdd:false})
          })
        }
      })
      AppEvent.emitEvent('ar_map_add_start')
      AppToolBar.toggleListVisible()
    }
  },
  ]}


}


/** 位置调整通用模版 POI/模型/三维场景/三维图层 */
function _getTransformTabData(editItem: ARElement | string): ToolBarMenuItem[] {
  const range: {
    scale: [number , number],
    position: [number, number],
    rotation: [number, number],
  } = {
    scale: [0 , 200],
    position: [-20, 20],
    rotation: [-180, 180],
  }

  const defaultValue = {
    scale: [100],
    position: [0],
    rotation: [0],
  }

  SARMap.setAction(ARAction.MOVE)

  const apply = () => {
    const transformData = AppToolBar.getData().transformInfo
    if(!transformData || !editItem) return
    SARMap.setARElementTransform(transformData)
    SARMap.submit().then(() => {
      AppToolBar.resetTabData()
      if(typeof(editItem) === 'string') {
        AppToolBar.addData({
          transformInfo: {
            layerName: editItem,
            id: 0,
            touchType: 0,
            type: 'position',
            positionX: 0,
            positionY: 0,
            positionZ: 0,
            rotationX: 0,
            rotationY: 0,
            rotationZ: 0,
            scale: 0
          }
        })
        SARMap.appointEditAR3DLayer(editItem)
      } else {
        AppToolBar.addData({
          transformInfo: {
            layerName: editItem.layerName,
            id: editItem.id,
            touchType: editItem.touchType,
            type: 'position',
            positionX: 0,
            positionY: 0,
            positionZ: 0,
            rotationX: 0,
            rotationY: 0,
            rotationZ: 0,
            scale: 0
          }
        })
        SARMap.appointEditElement(editItem.id, editItem.layerName)
      }
    })
  }

  return[
    {
      title: getLanguage().ARMap.TRANSLATION,
      onPress: () => {
        SARMap.setAction(ARAction.MOVE)
        if(isShowAnimationChangeBtn) {
          AppToolBar.deleteBottomBtn(1, 1)
          isShowAnimationChangeBtn = false
        }
      },
      type: 'slide',
      apply: apply,
      showRatio: true,
      slideData: [
        {
          type: 'single',
          left: {type: 'text', text: getLanguage().WEST},
          right: {type: 'text', text: getLanguage().EAST},
          onMove: (loc) => {
            loc = loc / 25
            let transformData = AppToolBar.getData().transformInfo
            if(!transformData) return
            transformData = {
              ...transformData,
              positionX: loc,
              type: 'position'
            }
            AppToolBar.addData({transformInfo: {...transformData}})
            SARMap.setARElementTransform(transformData)
          },
          defaultValue: defaultValue.position[0],
          range: range.position,
        },
        {
          type: 'single',
          left: {type: 'text', text: getLanguage().DOWN},
          right: {type: 'text', text: getLanguage().UP},
          onMove: (loc) => {
            loc = loc / 25
            let transformData = AppToolBar.getData().transformInfo
            if(!transformData) return
            transformData = {
              ...transformData,
              positionY: loc,
              type: 'position'
            }
            AppToolBar.addData({transformInfo: {...transformData}})
            SARMap.setARElementTransform(transformData)
          },
          defaultValue: defaultValue.position[0],
          range: range.position,
        },
        {
          type: 'single',
          left: {type: 'text', text: getLanguage().SOUTH},
          right: {type: 'text', text: getLanguage().NORTH},
          onMove: (loc) => {
            loc = loc / 25
            let transformData = AppToolBar.getData().transformInfo
            if(!transformData) return
            transformData = {
              ...transformData,
              positionZ: loc,
              type: 'position'
            }
            AppToolBar.addData({transformInfo: {...transformData}})
            SARMap.setARElementTransform(transformData)
          },
          defaultValue: defaultValue.position[0],
          range: range.position,
        }
      ]
    },
    {
      title: getLanguage().ARMap.ROTATION,
      onPress: () => {
        SARMap.setAction(ARAction.ROTATE)
        if(isShowAnimationChangeBtn) {
          AppToolBar.deleteBottomBtn(1, 1)
          isShowAnimationChangeBtn = false
        }
      },
      type: 'slide',
      apply: apply,
      slideData: [
        {
          type: 'single',
          left: {type: 'text', text: 'x'},
          right: {type: 'indicator', unit: '°'},
          onMove: (loc) => {
            let transformData = AppToolBar.getData().transformInfo
            if(!transformData) return
            transformData = {
              ...transformData,
              rotationX: loc,
              type: 'rotation'
            }
            AppToolBar.addData({transformInfo: {...transformData}})
            SARMap.setARElementTransform(transformData)
          },
          defaultValue: defaultValue.rotation[0],
          range: range.rotation,
        },
        {
          type: 'single',
          left: {type: 'text', text: 'y'},
          right: {type: 'indicator', unit: '°'},
          onMove: (loc) => {
            let transformData = AppToolBar.getData().transformInfo
            if(!transformData) return
            transformData = {
              ...transformData,
              rotationY: loc,
              type: 'rotation'
            }
            AppToolBar.addData({transformInfo: {...transformData}})
            SARMap.setARElementTransform(transformData)
          },
          defaultValue: defaultValue.rotation[0],
          range: range.rotation,
        },
        {
          type: 'single',
          left: {type: 'text', text: 'z'},
          right: {type: 'indicator', unit: '°'},
          onMove: (loc) => {
            let transformData = AppToolBar.getData().transformInfo
            if(!transformData) return
            transformData = {
              ...transformData,
              rotationZ: loc,
              type: 'rotation'
            }
            AppToolBar.addData({transformInfo: {...transformData}})
            SARMap.setARElementTransform(transformData)
          },
          defaultValue: defaultValue.rotation[0],
          range: range.rotation,
        },
      ]
    },
    {
      title: getLanguage().ARMap.SCALE,
      onPress: () => {
        SARMap.setAction(ARAction.SCALE)
        if(isShowAnimationChangeBtn) {
          AppToolBar.deleteBottomBtn(1, 1)
          isShowAnimationChangeBtn = false
        }
      },
      type: 'slide',
      apply: apply,
      slideData: [{
        type: 'single',
        right: {type: 'indicator', unit: '%'},
        onMove: (loc) => {
          let transformData = AppToolBar.getData().transformInfo
          if(!transformData) return
          const ratio = loc / 100 - 1
          transformData = {
            ...transformData,
            scale: ratio,
            type: 'scale'
          }
          AppToolBar.addData({transformInfo: {...transformData}})
          SARMap.setARElementTransform(transformData)
        },
        defaultValue: defaultValue.scale[0],
        range: range.scale,
      }]
    }
  ]
}

/** 线对象的编辑*/
function _getGeometryLineObjectTabData(): ToolBarMenuItem[] {
  const range: {
    position: [number, number]
  } = {
    position: [-20, 20],
  }

  const defaultValue = {
    position: [0],
  }

  const apply = () => {
    const transformData = AppToolBar.getData().transformInfo
    const editItem = AppToolBar.getData().selectARElement
    if(!transformData || !editItem) return
    // SARMap.setARElementTransform(transformData)
    SARMap.submit().then(() => {
      AppToolBar.resetTabData()
      if(typeof(editItem) === 'string') {
        AppToolBar.addData({
          transformInfo: {
            layerName: editItem,
            id: 0,
            touchType: 0,
            type: 'position',
            positionX: 0,
            positionY: 0,
            positionZ: 0,
            rotationX: 0,
            rotationY: 0,
            rotationZ: 0,
            scale: 0
          }
        })
        SARMap.appointEditAR3DLayer(editItem)
      } else {
        AppToolBar.addData({
          transformInfo: {
            layerName: editItem.layerName,
            id: editItem.id,
            touchType: editItem.touchType,
            type: 'position',
            positionX: 0,
            positionY: 0,
            positionZ: 0,
            rotationX: 0,
            rotationY: 0,
            rotationZ: 0,
            scale: 0
          }
        })
        SARMap.appointEditElement(editItem.id, editItem.layerName)
      }
    })
  }

  // 默认在对象编辑里面
  SARMap.setAction(ARAction.MOVE)

  return[
    {
      title: getLanguage().ARMap.TRANSLATION,
      onPress: () => {
        SARMap.setAction(ARAction.MOVE)
      },
      apply: apply,
      type: 'slide',
      showRatio: true,
      slideData: [
        {
          type: 'single',
          left: {type: 'text', text: getLanguage().WEST},
          right: {type: 'text', text: getLanguage().EAST},
          onMove: (loc) => {
            console.log(loc)
            loc = loc / 25
            let transformData = AppToolBar.getData().transformInfo
            if(!transformData) return
            transformData = {
              ...transformData,
              positionX: loc,
              type: 'position'
            }
            AppToolBar.addData({transformInfo: {...transformData}})
            SARMap.setARElementTransform(transformData)
          },
          defaultValue: defaultValue.position[0],
          range: range.position,
        },
        {
          type: 'single',
          left: {type: 'text', text: getLanguage().DOWN},
          right: {type: 'text', text: getLanguage().UP},
          onMove: (loc) => {
            loc = loc / 25
            let transformData = AppToolBar.getData().transformInfo
            if(!transformData) return
            transformData = {
              ...transformData,
              positionY: loc,
              type: 'position'
            }
            AppToolBar.addData({transformInfo: {...transformData}})
            SARMap.setARElementTransform(transformData)
          },
          defaultValue: defaultValue.position[0],
          range: range.position,
        },
        {
          type: 'single',
          left: {type: 'text', text: getLanguage().SOUTH},
          right: {type: 'text', text: getLanguage().NORTH},
          onMove: (loc) => {
            loc = loc / 25
            let transformData = AppToolBar.getData().transformInfo
            if(!transformData) return
            transformData = {
              ...transformData,
              positionZ: loc,
              type: 'position'
            }
            AppToolBar.addData({transformInfo: {...transformData}})
            SARMap.setARElementTransform(transformData)
          },
          defaultValue: defaultValue.position[0],
          range: range.position,
        }
      ]
    },
  ]
}

/** poi对象编辑时底栏 */
function getPoiEditBottom(editItem: ARElement | string): ToolBarBottomItem[] {
  const data = [
    {
      image: getImage().icon_toolbar_quit,
      onPress: async() => {
        if(typeof(editItem) !== 'string' && (editItem.type === ARElementType.AR_ATTRIBUTE_ALBUM || editItem.type === ARElementType.AR_BROCHOR || editItem.type === ARElementType.AR_ALBUM || editItem.type === ARElementType.AR_VIDEO_ALBUM|| editItem.type === ARElementType.AR_SAND_TABLE_ALBUM)){
          const style = await SARMap.getNodeStyle(editItem)
          // if(style.TextShadow){
          SARMap.setNodeStyle({TextShadow:style.TextShadow},editItem)
          // }
          // if(style.TextBold){
          SARMap.setNodeStyle({TextBold:style.TextBold},editItem)
          // }
          // if(style.TextFlags){
          SARMap.setNodeStyle({Flags:style.TextFlags},editItem)
          // }
          // if(style.TextSize){
          SARMap.setNodeStyle({TextSize:style.TextSize},editItem)
          // }
          // if(style.TextRotation){
          SARMap.setNodeStyle({TextRotation:style.TextRotation},editItem)
          // }
          AppToolBar.show('ARMAP', 'AR_MAP_SELECT_ELEMENT')
        }else{
          SARMap.setAction(ARAction.NULL)
          AppToolBar.goBack()
        }
        SARMap.cancel()
      }
    },
    // {
    //   // 取消变换
    //   image: getImage().undo,
    //   onPress: () => {
    //     SARMap.refresh()
    //     AppToolBar.resetTabData()
    //   }
    // },
    // {
    //   // 列表
    //   image: getImage().plotting_list,
    //   onPress: () => {
    //   }
    // },
    {
      // 设置
      image: getImage().setting,
      onPress: () => {
        AppToolBar.show( 'ARMAP_EDIT', 'AR_MAP_EDIT_ELEMENT_SETTING')
      }
    },
    {
      image: getImage().icon_submit,
      onPress: () => {
        AppToolBar.resetTabData()
        SARMap.submit().then(() => {
          if(typeof(editItem) === 'string') {
            AppToolBar.addData({
              transformInfo: {
                layerName: editItem,
                id: 0,
                touchType: 0,
                type: 'position',
                positionX: 0,
                positionY: 0,
                positionZ: 0,
                rotationX: 0,
                rotationY: 0,
                rotationZ: 0,
                scale: 0
              }
            })
            SARMap.appointEditAR3DLayer(editItem)
            SARMap.setAction(ARAction.NULL)
          } else {
            AppToolBar.addData({
              transformInfo: {
                layerName: editItem.layerName,
                id: editItem.id,
                touchType: editItem.touchType,
                type: 'position',
                positionX: 0,
                positionY: 0,
                positionZ: 0,
                rotationX: 0,
                rotationY: 0,
                rotationZ: 0,
                scale: 0
              }
            })
            // SARMap.appointEditElement(editItem.id, editItem.layerName)
            SARMap.setAction(ARAction.NULL)
            SARMap.clearSelection()
            AppToolBar.hide()
          }
        }
        )}
    },
  ]

  if((typeof(editItem) !== 'string'
    && editItem.type !== ARElementType.AR_ATTRIBUTE_ALBUM
    && editItem.type !== ARElementType.AR_BROCHOR
    && editItem.type !== ARElementType.AR_ALBUM
    && editItem.type !== ARElementType.AR_VIDEO_ALBUM
    && editItem.type !== ARElementType.AR_SAND_TABLE_ALBUM
    && editItem.type !== ARElementType.AR_BAR_CHART
    && editItem.type !== ARElementType.AR_PIE_CHART)
    || typeof(editItem) === 'string'
    || (editItem.type === ARElementType.AR_VIDEO_ALBUM && editItem.touchType !==0)
    || (editItem.type === ARElementType.AR_SAND_TABLE_ALBUM && editItem.touchType !==0)
  ){
    data.splice(1, 1)
  }
  return data
}

let animatonMode: 'model' | 'custome' = 'custome'

/** 获取AR模型动画Tab的数据 */
function _getModelAnimationTabList(element: ARElement): ToolBarMenuItem {
  /** 自定义动画 */
  const customeAnimationData:ToolBarListItem[] = [
    {
      text: getLanguage().Common.NONE,
      image: getImage().ar_animation_none,
      onPress: () => {
        const selectARElement = AppToolBar.getData().selectARElement
        if(selectARElement) {
          SARMap.clearAnimation(element.layerName, element.id)
        }
      },
    },
    {
      image: getImage().ar_translation,
      text: getLanguage().ARMap.TRANSLATION,
      onPress: async () => {
        AppToolBar.show('ARMAP_EDIT', 'AR_MAP_EDIT_ADD_ANIME_TRANSLATION')
      }
    },
    {
      image: getImage().ar_rotate,
      text: getLanguage().ARMap.ROTATION,
      onPress: () => {
        AppToolBar.show('ARMAP_EDIT', 'AR_MAP_EDIT_ADD_ANIME_ROTATION')
      }
    },]

  const tab:ToolbarTabItem ={
    title: getLanguage().ARMap.ANIMATION,
    type: 'list',
    onPress: () => {
      SARMap.setAction(ARAction.NULL)
      AppToolBar.showTabView(true)
    },
    data: [],
    getExtraData: async () => {
      const modelAnimations = await SARMap.getModelAnimation(element.layerName, element.id)
      if(modelAnimations.length > 0 && animatonMode === 'model') {
        const headData: ToolBarListItem[] = [{
          image: getImage().toolbar_switch,
          text: getLanguage().MODEL_ANIMATION,
          onPress: () => {
            animatonMode = 'custome'
            AppToolBar.resetTabData()
          }
        },
        {
          text: getLanguage().Common.NONE,
          image: getImage().ar_animation_none,
          onPress: () => {
            const selectARElement = AppToolBar.getData().selectARElement
            if(selectARElement) {
              SARMap.setModelAnimation(element.layerName, element.id, -1)
            }
          },
        }]
        const modelAnimationData: ToolBarListItem[] = modelAnimations.map((item, index) => {
          return {
            image: getImage().ar_scale,
            text: item.name,
            onPress: async () => {
              const selectARElement = AppToolBar.getData().selectARElement
              if(selectARElement) {
                SARMap.setModelAnimation(element.layerName, element.id, index)
              } else{
                AppLog.error('没有选中对象')
              }
            }
          }
        })

        return headData.concat(modelAnimationData)

      } else {
        animatonMode = 'custome'
        const change: ToolBarListItem[] = (modelAnimations.length > 0) ? [{
          image: getImage().toolbar_switch,
          text: getLanguage().BONE_ANIMATION,
          onPress: () => {
            animatonMode = 'model'
            AppToolBar.resetTabData()
          }
        }] : []
        const more: ToolBarListItem = {
          image: getImage().icon_more,
          onPress: () => {
            NavigationService.navigate('ARAnimation')
          }
        }
        const animation = await SARMap.getAnimationList()

        const animationData: ToolBarListItem[] = animation.map(item => {
          return {
            image: item.type === 'rotation'
              ? getImage().ar_rotate
              : getImage().ar_translation,
            text: item.name,
            onPress: async () => {
              const selectARElement = AppToolBar.getData().selectARElement
              if(selectARElement) {
                await SARMap.clearAnimation(element.layerName, element.id)
                SARMap.setAnimation(element.layerName, element.id, item.id)
              } else{
                AppLog.error('没有选中对象')
              }
            }
          }
        })

        animationData.push(more)
        return change.concat(customeAnimationData.concat(animationData))
      }
    }
  }

  return tab
}

function _getAnimationTabList(element: ARElement): ToolBarMenuItem {

  const changeA: ToolBarListItem[] = [
    {
      image: getImage().ar_body_posture,
      text: getLanguage().BONE_ANIMATION,
      onPress: () => {
      }
    },
  ]

  const changeB: ToolBarListItem[] = [
    {
      image: getImage().ar_3dmodle,
      text: getLanguage().CUSTOME_ANIMATION,
      onPress: () => {
      }
    },
  ]

  const general: ToolBarListItem[] = [
    {
      text: getLanguage().Common.NONE,
      image: getImage().ar_animation_none,
      onPress: () => {
        const selectARElement = AppToolBar.getData().selectARElement
        if(selectARElement) {
          SARMap.clearAnimation(element.layerName, element.id)
        }
      },
    },
    {
      text: getLanguage().ADD,
      image: getImage().icon_add,
      onPress: () => {
        isBackEdit = true
        if(animatonMode === 'custome') {
          AppToolBar.show('ARMAP_EDIT', 'AR_MAP_EDIT_ADD_ANIME_NODE')
        } else {
          AppToolBar.show('ARMAP_EDIT', 'AR_MAP_EDIT_ADD_ANIME_MODEL')
        }
      },
    }
  ]

  const more: ToolBarListItem = {
    image: getImage().icon_more,
    onPress: () => {
      NavigationService.navigate('ARAnimation')
    }
  }


  return {
    title: getLanguage().ANIMATION,
    type: 'list',
    onPress: () => {
      SARMap.setAction(ARAction.NULL)
      AppToolBar.showMenuView(true)
      if(AppToolBar.getData().ownModelAnimation) {
        const button =  {
          image: getImage().swith_animation_type,
          onPress: () => {
            if(animatonMode === 'custome') {
              animatonMode = 'model'
            } else if(animatonMode === 'model'){
              animatonMode = 'custome'
            }
            AppToolBar.resetPage()
          }
        }
        if(!isShowAnimationChangeBtn) {
          AppToolBar.addBottomBtn([button], 1)
          isShowAnimationChangeBtn = true
        }
      }
    },
    data: [],
    getExtraData: async () => {
      const animations = await SARMap.getAnimations()
      const modelAnimations = await SARMap.getModelAnimation(element.layerName, element.id)

      const nodeAnimation: (ARNodeAnimatorParameter & {id: number})[] = []
      for(let i = 0; i < animations.length; i++) {
        const animation = animations[i]
        if('nodeType' in animation) {
          nodeAnimation.push(animation)
        }
      }
      const modelAnimation = animations.filter(item => {
        return item.type === ARAnimatorType.MODEL_TYPE && item.layerName === element.layerName && item.elementID === element.id
      })

      if(modelAnimations.length > 0 && animatonMode === 'model') {
        const modelAnimationData: ToolBarListItem[] = modelAnimation.map(item => {
          return {
            image: getImage().ar_scale,
            text: item.name,
            onPress: async () => {
              SARMap.setAnimation(element.layerName, element.id, item.id)
            }
          }
        })
        return changeA.concat(general, modelAnimationData , more)
      } else {
        const animationData: ToolBarListItem[] = nodeAnimation.map((item => {
          return {
            image: item.nodeType === ARNodeAnimatorType.TRANSLATION
              ? getImage().ar_translation
              : (item.nodeType === ARNodeAnimatorType.ROTATION
                ? getImage().ar_rotate
                : getImage().ar_scale),
            text: item.name,
            onPress: async () => {
              SARMap.setAnimation(element.layerName, element.id, item.id)
            }
          }
        }))
        return changeB.concat(general, animationData, more)
      }
    }
  }
}

function addTransAnimeOption(option: IToolbarOption) {
  option.pageAction = () => {
    const animationParam: IAnimationParam = {
      name: '',
      type: 'translation',
      startPosition: {x: 0, y: 0, z:0},
      direction: 'x',
      distance: 1,
      duration: 10 * 1000,
    }
    AppToolBar.addData({
      animationParam: animationParam
    })
  }
  option.bottomData = [
    {
      image: getImage().icon_toolbar_quit,
      onPress: () => {
        AppToolBar.goBack()
        //TODO handle tab
      }
    },
    {
      image: getImage().icon_submit,
      onPress: () => {
        AppInputDialog.show({
          'placeholder': getLanguage().Common.INPUT_NAME,
          'defaultValue': getLanguage().ARMap.TRANSLATION,
          'checkSpell': CheckSpell.checkLayerCaption,
          title: 'getLanguage().Common.SAVE_ANIMATION',
          descripton: 'getLanguage().Common.SAVE_ANIMATION_WITH_NAME',
          confirm: text => {
            const param = AppToolBar.getData().animationParam
            if(param) {
              param.name = text
              SARMap.addNodeAnimation(param).then(async id => {
                if(id > -1) {
                  const selectARElement = AppToolBar.getData().selectARElement
                  if(selectARElement) {
                    await SARMap.clearAnimation(selectARElement.layerName, selectARElement.id)
                    SARMap.setAnimation(selectARElement.layerName, selectARElement.id, id)
                  } else{
                    AppLog.error('没有选中对象')
                  }
                }
              })
            }
            AppToolBar.goBack()
          }
        })
      }
    }
  ]
  option.menuOption.data = [
    {
      title: getLanguage().ARMap.DIRECTION,
      type: 'list',
      data: [
        {
          image: getImage().translation_x,
          text: 'x',
          onPress: async () => {
            const param = AppToolBar.getData().animationParam
            if(param && param.type === 'translation') {
              param.direction = 'x'
            }
          }
        },
        {
          image: getImage().translation_y,
          text: 'y',
          onPress: () => {
            const param = AppToolBar.getData().animationParam
            if(param && param.type === 'translation') {
              param.direction = 'y'
            }
          }
        },
        {
          image: getImage().translation_z,
          text: 'z',
          onPress: () => {
            const param = AppToolBar.getData().animationParam
            if(param && param.type === 'translation') {
              param.direction = 'z'
            }
          }
        },
      ],
    },
    {
      title: getLanguage().ARMap.DISTANCE,
      type: 'slide',
      slideData: [
        {
          type: 'single',
          right: {type: 'indicator', unit: 'm'},
          'range': [-5, 5],
          'defaultValue': 1,
          'onMove': (value) => {
            const param = AppToolBar.getData().animationParam
            if(param && param.type === 'translation') {
              param.distance = value
            }
          }
        }
      ]
    },
    {
      title: getLanguage().DURATION,
      type: 'slide',
      slideData: [
        {
          type: 'single',
          right: {type: 'indicator', unit: 's'},
          'range': [1, 20],
          'defaultValue': 10,
          'onMove': (value) => {
            const param = AppToolBar.getData().animationParam
            if(param) {
              param.duration = value * 1000
            }
          }
        }
      ]
    }
  ]
}

function addRotateAnimeOption(option: IToolbarOption) {
  option.pageAction = () => {
    const animationParam: IAnimationParam = {
      name: '',
      type: 'rotation',
      rotationAxis: {x: 1, y: 0, z:0},
      clockwise: true,
      duration: 10 * 1000
    }
    AppToolBar.addData({
      animationParam: animationParam
    })
  }
  option.bottomData = [
    {
      image: getImage().icon_toolbar_quit,
      onPress: () => {
        AppToolBar.goBack()
        //TODO handle tab
      }
    },
    {
      image: getImage().icon_submit,
      onPress: () => {
        AppInputDialog.show({
          'placeholder': getLanguage().Common.INPUT_NAME,
          'defaultValue': getLanguage().ARMap.ROTATION,
          'checkSpell': CheckSpell.checkLayerCaption,
          title: 'getLanguage().Common.SAVE_ANIMATION',
          descripton: 'getLanguage().Common.SAVE_ANIMATION_WITH_NAME',
          confirm: text => {
            const param = AppToolBar.getData().animationParam
            if(param) {
              param.name = text
              SARMap.addNodeAnimation(param).then(async id => {
                if(id > -1) {
                  const selectARElement = AppToolBar.getData().selectARElement
                  if(selectARElement) {
                    await SARMap.clearAnimation(selectARElement.layerName, selectARElement.id)
                    SARMap.setAnimation(selectARElement.layerName, selectARElement.id, id)
                  } else{
                    AppLog.error('没有选中对象')
                  }
                }
              })
            }
            AppToolBar.goBack()
          }
        })
      }
    }
  ]
  option.menuOption.data = [
    {
      title: getLanguage().ARMap.ROTATION_AXIS,
      type: 'list',
      data: [
        {
          image: getImage().rotation_x,
          text: 'x',
          onPress: async () => {
            const param = AppToolBar.getData().animationParam
            if(param && param.type === 'rotation') {
              param.rotationAxis =  {x: 1, y: 0, z: 0}
            }
          }
        },
        {
          image: getImage().rotation_y,
          text: 'y',
          onPress: () => {
            const param = AppToolBar.getData().animationParam
            if(param && param.type === 'rotation') {
              param.rotationAxis =  {x: 0, y: 1, z: 0}
            }
          }
        },
        {
          image: getImage().rotation_z,
          text: 'z',
          onPress: () => {
            const param = AppToolBar.getData().animationParam
            if(param && param.type === 'rotation') {
              param.rotationAxis =  {x: 0, y: 0, z: 1}
            }
          }
        },
      ],
    },
    {
      title: getLanguage().ARMap.ROTATION,
      type: 'list',
      data: [
        {
          image: getImage().clockwise_rotate,
          text: getLanguage().ARMap.CLOCKWISE,
          onPress: async () => {
            const param = AppToolBar.getData().animationParam
            if(param && param.type === 'rotation') {
              param.clockwise = true
            }
          }
        },
        {
          image: getImage().anticlockwise_rotate,
          text: getLanguage().ARMap.COUNTER_CLOCKWISE,
          onPress: () => {
            const param = AppToolBar.getData().animationParam
            if(param && param.type === 'rotation') {
              param.clockwise =false
            }
          }
        },
      ],
    },
    {
      title: getLanguage().DURATION,
      type: 'slide',
      slideData: [
        {
          type: 'single',
          right: {type: 'indicator', unit: 's'},
          'range': [1, 20],
          'defaultValue': 10,
          'onMove': (value) => {
            const param = AppToolBar.getData().animationParam
            if(param) {
              param.duration = value * 1000
            }
          }
        }
      ]
    }
  ]
}

/** 小组件设置 */
function settingElementOption(option: IToolbarOption){
  const element = AppToolBar.getData().selectARElement
  if(!element)  {
    AppLog.error('未选中对象！')
    return
  }

  option.bottomData = getPoiSettingBottom()
  option.listData = _getPoiSettingData(element)
}

/** 小组件设置标题 */
function settingElementOption_title(option: IToolbarOption){
  const element = AppToolBar.getData().selectARElement
  if(!element)  {
    AppLog.error('未选中对象！')
    return
  }

  option.bottomData = getPoiSettingBottom()
  option.menuOption.data = _getPoiSettingData_title(element)
  // option.menuOption.isShowToggle = false
  option.menuOption.isShowView = true
}

/** 小组件设置排列 */
function settingElementOption_array(option: IToolbarOption){
  const element = AppToolBar.getData().selectARElement
  if(!element)  {
    AppLog.error('未选中对象！')
    return
  }

  option.bottomData = getPoiSettingBottom()
  option.menuOption.data = _getPoiSettingData_array(element)
  // option.tabOption.isShowToggle = false
  option.menuOption.isShowView = true
}


/** 小组件设置背景 */
function settingElementOption_background(option: IToolbarOption){
  const element = AppToolBar.getData().selectARElement
  if(!element)  {
    AppLog.error('未选中对象！')
    return
  }

  option.bottomData = getPoiSettingBottom()
  option.menuOption.data = _getPoiSettingData_background(element)
  // option.tabOption.isShowToggle = false
  option.menuOption.isShowView = true
}

function getPoiSettingBottom(): ToolBarBottomItem[] {
  return[
    {
      image: getImage().icon_toolbar_quit,
      onPress: () => {
        AppToolBar.goBack()
      }
    },
    // {
    //   image: getImage().icon_submit,
    //   onPress: () => {
    //     AppToolBar.goBack()
    //   }
    // },
  ]
}

/** 小组件设置显示内容 */
function _getPoiSettingData(editItem: ARElement): ToolBarListOption {
  const data = [
    {
      image: getImage().icon_tool_title,
      text: getLanguage().ARMap.TITLE,
      onPress: async () => {
        const style = await SARMap.getCurrentNodeStyle(editItem)
        AppToolBar.addData({currentNodeStyle:style})
        AppToolBar.show( 'ARMAP_EDIT', 'AR_MAP_EDIT_ELEMENT_SETTING_IITLE')
      }
    },
    {
      image: getImage().icon_tool_background,
      text: getLanguage().ARMap.BACKGROUND,
      onPress: async () => {
        const style = await SARMap.getCurrentNodeStyle(editItem)
        AppToolBar.addData({currentNodeStyle:style})
        AppToolBar.show( 'ARMAP_EDIT', 'AR_MAP_EDIT_ELEMENT_SETTING_BACKGROUND')
      }
    },
    {
      image: getImage().icon_tool_array,
      text: getLanguage().ARMap.ARRAY,
      onPress: async () => {
        AppToolBar.show( 'ARMAP_EDIT', 'AR_MAP_EDIT_ELEMENT_SETTING_ARRAY')
      }
    },
    {
      image: getImage().icon_tool_array,
      text: getLanguage().ARMap.DATA,
      onPress: async () => {
        if(typeof(editItem) !== 'string' && editItem.type === ARElementType.AR_BAR_CHART){
          // 柱状图修改数据
          NavigationService.navigate('ChartManager', {
            type: 'update'
          })
        }
        else if(typeof(editItem) !== 'string' && editItem.type === ARElementType.AR_PIE_CHART){
          // 饼图修改数据
          NavigationService.navigate('ChartManager', {
            type: 'pieChartUpdate'
          })
        }
      }
    },
  ]

  if(editItem.type === ARElementType.AR_BAR_CHART || editItem.type === ARElementType.AR_PIE_CHART){
    // 柱状图和饼图，去掉排列
    data.splice(2, 1)
    if(editItem.type === ARElementType.AR_PIE_CHART){
      data.splice(1, 1)
    }
  } else {
    // 其他的去掉柱状图和饼图的更新
    data.splice(3, 1)
  }

  //点击右侧node时不显示标题设置
  if(editItem.touchType !== 0){
    data.splice(0, 1)
    data.splice(1, 1)
  }
  if(editItem.type === ARElementType.AR_ALBUM || editItem.videoType === 0 || editItem.type === ARElementType.AR_SAND_TABLE_ALBUM){
    data.splice(2, 2)
  }
  return{
    data: data
  }
}

/** 小组件设置标题 */
function _getPoiSettingData_title(editItem: ARElement): ToolBarMenuItem[] {
  const range: {
    rotation: [number, number],
    size: [number, number],
    buttonsize: [number, number],
    opacity:[number,number],
  } = {
    rotation: [-180, 180],
    size: [10, 40],
    buttonsize: [12, 30],
    opacity:[0,100],
  }

  // const defaultValue = {
  //   rotation: [0],
  //   size: [20],
  // }

  const style = AppToolBar.getData().currentNodeStyle

  let data:ToolBarMenuItem[] = []

  if(editItem.type === ARElementType.AR_ALBUM){
    data = [
      {
        title: getLanguage().ARMap.COLOR,
        type: 'color',
        data: {
          colors: COLORS,
          onSelect: (color) => {
            SARMap.setNodeStyle({ TextColor: color }, editItem)
          }
        }
      },
      {
        title: getLanguage().ARMap.LINE_COLOR,
        type: 'color',
        data: {
          colors: COLORS,
          onSelect: (color) => {
            SARMap.setNodeStyle({ LineColor: color }, editItem)
          }
        }
      },
      {
        title: getLanguage().ARMap.TIME_COLOR,
        type: 'color',
        data: {
          colors: COLORS,
          onSelect: (color) => {
            SARMap.setNodeStyle({ TimeColor: color }, editItem)
          }
        }
      },
    ]
    return data
  } else if(editItem.type === ARElementType.AR_BAR_CHART || editItem.type === ARElementType.AR_PIE_CHART){

    // 柱状图和饼图的标题设置
    data = [
      {
        title: getLanguage().ARMap.TITLE,
        type: 'input',
        data: {
          textTitle: getLanguage().ARMap.TITLE,
          text: '',
          apply:async (text: string)=>{
            // console.warn('title: ' + text)
            SARMap.setNodeTextTitle(text, editItem)
          }
        }
      },
      {
        title: getLanguage().ARMap.COLOR,
        type: 'color',
        data: {
          colors: COLORS,
          initColor: style?.TextColor || undefined,
          onSelect: (color) => {
            SARMap.setNodeStyle({ TextColor: color }, editItem)
          }
        }
      },
      {
        title: getLanguage().ARMap.OPACITY,
        onPress: () => {
        },
        type: 'slide',
        slideData: [{
          type: 'single',
          right: {type: 'indicator', unit: '%'},
          onMove: (loc) => {
            SARMap.setNodeStyle({TextOpacity:loc/100},editItem)
          },
          defaultValue: style?.TextOpacity? style.TextOpacity*100 : 100,
          range: range.opacity,
        }]
      },
      {
        title: getLanguage().ARMap.TEXT_SIZE,
        onPress: () => {
        },
        type: 'slide',
        slideData: [
          {
            type: 'single',
            onMove: (loc) => {
              SARMap.setNodeStyle({TextSize:loc},editItem)
            },
            defaultValue: style?.TextSize,
            range: range.size,
            right: {type: 'indicator', unit: 'mm'},
          },
        ]
      },
    ]
    if(editItem.type === ARElementType.AR_PIE_CHART){
      data.splice(2,0,{
        title: getLanguage().ARMap.BACKGROUND_COLOR,
        type: 'color',
        data: {
          colors: COLORS,
          initColor: style?.fillColor || undefined,
          onSelect: (color: string) => {
            SARMap.setNodeStyle({fillColor:color},editItem)
          }
        }
      })
    }
    return data
  }else{
    const text_shape = [
      {
        image: getImage().icon_tool_bold,
        text: getLanguage().ARMap.BOLD,
        onPress: async () => {
          SARMap.setNodeStyle({TextBold:1},editItem)
        }
      },
      {
        image: getImage().icon_tool_tilt,
        text: getLanguage().ARMap.TILT,
        onPress: async () => {
          SARMap.setNodeStyle({TextBold:2},editItem)
        }
      },
      {
        image: getImage().icon_tool_underline,
        text: getLanguage().ARMap.UNDERLINE,
        onPress: async () => {
          SARMap.setNodeStyle({Flags:3},editItem)
        }
      },
      {
        image: getImage().icon_tool_strikethrough,
        text: getLanguage().ARMap.STRIKETHROUGH,
        onPress: async () => {
          SARMap.setNodeStyle({Flags:4},editItem)
        }
      },
      {
        image: getImage().icon_tool_shadow,
        text: getLanguage().ARMap.SHADOW,
        onPress: async () => {
          SARMap.setNodeStyle({TextShadow:5},editItem)
        }
      },
    ]
    if(Platform.OS === 'ios'){
      text_shape.splice(1,1)
    }

    data =  [
      {
        title: getLanguage().ARMap.TITLE,
        type: 'input',
        data: {
          textTitle: getLanguage().ARMap.TITLE,
          text: '',
          apply:async (text: string)=>{
            SARMap.setNodeTextTitle(text, editItem)
          }
        }
      },
      {
        title: getLanguage().ARMap.TEXT_SHAPE,
        onPress: () => {
        },
        type: 'list',
        data: text_shape
      },
      {
        title: getLanguage().ARMap.TEXT_SIZE,
        onPress: () => {
        },
        type: 'slide',
        slideData: [
          {
            type: 'single',
            onMove: (loc) => {
              SARMap.setNodeStyle({TextSize:loc},editItem)
            },
            defaultValue: style?.TextSize,
            range: range.size,
            right: {type: 'indicator', unit: 'mm'},
          },
        ]
      },
      {
        title: getLanguage().ARMap.COLOR,
        type: 'color',
        data: {
          colors: COLORS,
          onSelect: (color) => {
            SARMap.setNodeStyle({TextColor:color},editItem)
          }
        }
      },
      {
        title: getLanguage().ARMap.ROTATION_ANGLE,
        onPress: () => {
        },
        type: 'slide',
        slideData: [{
          type: 'single',
          right: {type: 'indicator', unit: '°'},
          onMove: (loc) => {
            SARMap.setNodeStyle({TextRotation:loc},editItem)
          },
          defaultValue: style?.TextRotation,
          range: range.rotation,
        }]
      },
      {
        title: getLanguage().ARMap.OPACITY,
        onPress: () => {
        },
        type: 'slide',
        slideData: [{
          type: 'single',
          right: {type: 'indicator', unit: '%'},
          onMove: (loc) => {
            SARMap.setNodeStyle({TextOpacity:loc/100},editItem)
          },
          defaultValue: style?.TextOpacity? style.TextOpacity*100 : 100,
          range: range.opacity,
        }]
      },
    ]

    if(Platform.OS === 'ios'){
      data.splice(4,1)
    }

    if(editItem.touchType === 0 && editItem.videoType === 0){
      data.push({
        title: getLanguage().ARMap.BUTTON_TEXT_SIZE,
        onPress: () => {
        },
        type: 'slide',
        slideData: [
          {
            type: 'single',
            onMove: (loc) => {
              SARMap.setNodeStyle({ButtonTextSize:loc},editItem)
            },
            defaultValue: style?.ButtonTextSize,
            range: range.buttonsize,
            right: {type: 'indicator', unit: 'mm'},
          },
        ]
      })
    }

    return data
  }
}

/** 小组件设置排列 */
function _getPoiSettingData_array(editItem: ARElement): ToolBarMenuItem[] {
  return [
    {
      title: getLanguage().ARMap.ARRAY,
      type: 'list',
      showSelect:false,
      data: [
        {
          image: getImage().icon_array_1_3,
          onPress: async () => {
            SARMap.setNodeStyle({Array:0},editItem)
          }
        },
        {
          image: getImage().icon_array_2_3,
          onPress: async () => {
            SARMap.setNodeStyle({Array:1},editItem)
          }
        },
        {
          image: getImage().icon_array_2_4,
          onPress: async () => {
            SARMap.setNodeStyle({Array:2},editItem)
          }
        },
        {
          image: getImage().icon_array_3_3,
          onPress: async () => {
            SARMap.setNodeStyle({Array:3},editItem)
          }
        },
        {
          image: getImage().icon_array_4_4,
          onPress: async () => {
            SARMap.setNodeStyle({Array:4},editItem)
          }
        },
      ]
    },
  ]
}

/** 小组件设置背景 */
function _getPoiSettingData_background(editItem: ARElement): ToolBarMenuItem[] {
  const range: {
    opacity: [number, number],
    width: [number, number],
  }= {
    opacity: [0, 100],
    width: [0, 20],
  }

  const defaultValue = {
    opacity: [95],
    width: [0],
  }
  const style = AppToolBar.getData().currentNodeStyle
  defaultValue.opacity[0] = (style?.opacity || 0.95) * 100
  let data:ToolBarMenuItem[] = []

  data = [
    {
      title: getLanguage().ARMap.FILLCOLOR,
      type: 'color',
      data: {
        colors: COLORS,
        initColor: style?.fillColor || undefined,
        onSelect: (color: string) => {
          SARMap.setNodeStyle({fillColor:color},editItem)
        }
      }
    },
    {
      title: getLanguage().ARMap.OPACITY,
      onPress: () => {
      },
      type: 'slide',
      slideData: [{
        type: 'single',
        right: {type: 'indicator', unit: '%'},
        onMove: (loc: number) => {
          SARMap.setNodeStyle({opacity:loc/100},editItem)
        },
        defaultValue: style?.opacity? parseInt(style?.opacity * 100 + ''):defaultValue.opacity[0],
        range: range.opacity,
      }]
    },
    {
      title: getLanguage().ARMap.BORDER_COLOR,
      type: 'color',
      data: {
        colors: COLORS,
        onSelect: (color: string) => {
          SARMap.setNodeStyle({borderColor:color},editItem)
        }
      }
    },
    {
      title: getLanguage().ARMap.BORDER_WIDTH,
      onPress: () => {
      },
      type: 'slide',
      slideData: [{
        type: 'single',
        onMove: (loc: number) => {
          SARMap.setNodeStyle({borderWidth:loc},editItem)
        },
        defaultValue: style?.borderWidth?style?.borderWidth:defaultValue.width[0],
        range: range.width,
      }]
    }
  ]

  if(editItem.type === ARElementType.AR_BAR_CHART || editItem.type === ARElementType.AR_PIE_CHART){
    data.splice(2, 2)
  }
  return data
}

