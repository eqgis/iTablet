import { ARAction, ARElementType, ARLayerType, SARMap } from "imobile_for_reactnative"
import { ModuleList } from ".."
import { getImage } from "../../../assets"
import { getLanguage } from "../../../language"
import { IToolbarOption, ToolbarOption } from "imobile_for_reactnative/components/ToolbarKit"
import { AppToolBar, Toast } from "../../../utils"
import { ARAttributeViewOption } from "./ARAttributeView"
import { checkSupportARAttributeByElement, getSandtableAttributeData } from "./Actions"


export function getData(key: ModuleList['ARATTRIBUTE']): IToolbarOption {
  const option = new ToolbarOption<ARAttributeViewOption>()
  option.showBackground = false
  option.moduleData = {
    attribute: 'null',
    showLayer: false
  }
  const selectARElement = AppToolBar.getData().selectARElement
  switch(key) {
    case 'AR_MAP_BROWSE_ELEMENT':
      option.moduleData.showLayer = true
      option.moduleData.attribute = 'null'
      browseElementOption(option)
      break
    case 'AR_MAP_ATTRIBUTE':
      if(selectARElement && selectARElement.type === ARElementType.AR_SAND_TABLE) {
        option.moduleData.attribute = 'sandattribute'
      } else {
        option.moduleData.attribute = 'attribute'
      }
      attributeOption(option)
      break
    case 'AR_MAP_ATTRIBUTE_STYLE':
      styleAttributeOption(option)
      break
    case 'AR_MAP_ATTRIBUTE_SELECTED':
      selectElementOption(option)
      break
  }

  return option
}

async function __styleButtonAction() {
  const selectARElement = AppToolBar.getData().selectARElement


  if (!selectARElement) {
    Toast.show(getLanguage().PLEASE_SELECT_OBJ)
    return
  }

  // 检查是否支持
  const isSupport = checkSupportARAttributeByElement(selectARElement.type)
  if(!isSupport) {
    Toast.show(getLanguage().AR_ATTRIBUTE_NOT_AVAILABLE_OBJ)
    return
  }

  SARMap.appointEditElement(selectARElement.id, selectARElement.layerName)

  const style = await SARMap.getAttributeStyle(selectARElement.layerName, selectARElement.id)


  // 清空属性选择
  AppToolBar.addData({
    selectedAttribute: undefined,
    attributeStyle: style,
  })
  AppToolBar.show('ARATTRIBUTE', 'AR_MAP_ATTRIBUTE_STYLE')
}
/** 选择模型对象 */
function selectElementOption(option: ToolbarOption<ARAttributeViewOption>) {

  option.pageAction = async () => {

    SARMap.setAction(ARAction.SELECT)
  }

  option.bottomData = [
    {
      image: getImage().icon_toolbar_quit,
      onPress: async() => {
        AppToolBar.getProps().setPipeLineAttribute([])
        SARMap.setAction(ARAction.NULL)
        // SARMap.clearSelection()
        AppToolBar.addData({
          selectedAttribute: undefined,
          selectARElement: undefined,
        })
        AppToolBar.hide()
        SARMap.cancel()
      }
    },
  ]
}

/** 浏览模型信息 */
function browseElementOption(option: ToolbarOption<ARAttributeViewOption>) {

  option.pageAction = async () => {
    SARMap.setAction(ARAction.NULL)
  }

  option.bottomData = [
    {
      image: getImage().icon_toolbar_quit,
      onPress: async() => {
        AppToolBar.getProps().setPipeLineAttribute([])
        // SARMap.setAction(ARAction.NULL)
        const preElement = AppToolBar.getData().selectARElement
        if(preElement) {
          await SARMap.hideAttribute(preElement.layerName, preElement.id)
        }
        SARMap.clearSelection()
        AppToolBar.addData({
          selectedAttribute: undefined,
          selectARElement: undefined,
        })
        AppToolBar.show('ARATTRIBUTE', 'AR_MAP_ATTRIBUTE_SELECTED')
        SARMap.cancel()
      }
    },
    {
      image: getImage().my_color,
      onPress: __styleButtonAction
    },
    {
      image: getImage().icon_layer_attribute,
      onPress: async () => {
        const selectARElement = AppToolBar.getData().selectARElement
        const layer = AppToolBar.getProps()?.arMapInfo?.currentLayer

        if (!layer && !selectARElement) {
          Toast.show(getLanguage().ARMap.PLEASE_SELECT_LAYER_OR_OBJECT)
          return
        }
        if (
          !selectARElement && layer &&
          layer.type !== ARLayerType.AR_LINE_LAYER &&
          layer.type !== ARLayerType.AR_POINT_LAYER &&
          layer.type !== ARLayerType.AR_REGION_LAYER &&
          layer.type !== ARLayerType.AR_TEXT_LAYER &&
          layer.type !== ARLayerType.AR_MODEL_LAYER &&
          layer.type !== ARLayerType.AR_WIDGET_LAYER &&
          layer.type !== ARLayerType.AR_MEDIA_LAYER &&
          layer.type !== ARLayerType.AR_SCENE_LAYER
        ) {
          Toast.show(getLanguage().PLEASE_SELECT_AR_OBJECT_LAYER)
          return
        }

        if(selectARElement && selectARElement.type === ARElementType.AR_SAND_TABLE){
          await getSandtableAttributeData()
        }

        AppToolBar.show('ARATTRIBUTE', 'AR_MAP_ATTRIBUTE')
      }
    }
  ]
}

/** 属性表 */
function attributeOption(option: IToolbarOption) {
  option.bottomData=[
    {
      image: getImage().icon_toolbar_quit,
      onPress: () => {
        SARMap.setAction(ARAction.NULL)
        // 清空属性选择
        // AppToolBar.addData({
        //   selectedAttribute: undefined,
        // })
        // AppToolBar.show('ARMAP', 'AR_MAP_BROWSE_ELEMENT')
        AppToolBar.goBack()
      },
    },
    // {
    //   image: getImage().my_color,
    //   onPress: __styleButtonAction
    // },
    {
      image: getImage().icon_submit,
      onPress: () => {
        const selectARElement = AppToolBar.getData().selectARElement
        const selectedAttribute = AppToolBar.getData().selectedAttribute
        const layer = AppToolBar.getProps()?.arMapInfo?.currentLayer

        // 有被选中的属性字段时,添加到地图上,没有则移除
        if (selectedAttribute && selectedAttribute.length > 0) {
          if (selectARElement) {
            SARMap.showAttribute(selectARElement.layerName, selectARElement.id, selectedAttribute)
          } else if (layer) {
            SARMap.showAttribute(layer.name, -1, selectedAttribute)
          }
        } else {
          if (selectARElement) {
            SARMap.hideAttribute(selectARElement.layerName, selectARElement.id)
          } else if (layer) {
            SARMap.hideAttribute(layer.name, -1)
          }
        }

        // 清空属性选择
        AppToolBar.addData({
          selectedAttribute: undefined,
          attribute3D: undefined,
        })

        SARMap.setAction(ARAction.SELECT)
        // SARMap.setCenterHitTest(false)
        // AppToolBar.show('ARMAP', 'AR_MAP_BROWSE_ELEMENT')
        if(selectARElement && selectARElement.type === ARElementType.AR_SAND_TABLE) {
          AppToolBar.show('ARATTRIBUTE', 'AR_MAP_BROWSE_ELEMENT')
        } else {
          AppToolBar.goBack()
        }
      },
    }
  ]
}


/** 属性表风格 */
function styleAttributeOption(option: IToolbarOption) {
  const { attributeStyle } = AppToolBar.getData()
  const selectARElement = AppToolBar.getData().selectARElement
  const layer = AppToolBar.getProps()?.arMapInfo?.currentLayer
  let layerName = '', elementID = -1
  if (selectARElement) {
    layerName = selectARElement.layerName
    elementID = selectARElement.id
  } else if (layer) {
    layerName = layer.name
  }

  option.pageAction = () => {
    SARMap.setAction(ARAction.NULL)
  }

  option.bottomData=[
    {
      image: getImage().icon_toolbar_quit,
      onPress: () => {
        SARMap.cancel()
        // 清空属性选择
        AppToolBar.addData({
          selectedAttribute: undefined,
          attributeStyle: undefined,
        })
        AppToolBar.goBack()
      },
    },
    {
      image: getImage().icon_submit,
      onPress: () => {
        SARMap.submit()
        // 清空属性选择
        AppToolBar.addData({
          selectedAttribute: undefined,
          attributeStyle: undefined,
        })
        AppToolBar.goBack()
      },
    }
  ]

  const position: {
    x: [number, number]
    y: [number, number]
    z: [number, number]
  } = {
    x: [-100, 100],
    y: [-100, 100],
    z: [-100, 100],
  }

  const size: {
    width: [number, number]
    height: [number, number]
  } = {
    width: [0, 1000],
    height: [0, 1000],
  }


  AppToolBar.addData({
    transformInfo: {
      layerName: layerName,
      id: elementID,
      touchType: 0,
      type: 'position',
      positionX: 0,
      positionY: 0,
      positionZ: 0,
      rotationX: 0,
      rotationY: 0,
      rotationZ: 0,
      scale: 0,
      width: 0,
      height: 0,
    }
  })

  option.menuOption.isShowView = true
  option.menuOption.data = [
    {
      title: getLanguage().ARMap.TEXT_SIZE,
      type: 'slide',
      slideData: [
        {
          type: 'single',
          left: {type: 'image', image: getImage().ar_distance},
          range: [1,100],
          onMove: (loc) => {
            if(layerName) {
              SARMap.setAttributeStyle(layerName, elementID, {fontSize: loc})
            }
          },
          defaultValue: attributeStyle?.fontSize || 1,
        }
      ]
    },
    {
      title: getLanguage().STYLE_COLOR,
      type: 'color',
      data: {
        colors: COLORS,
        initColor: attributeStyle?.fontColor,
        onSelect: (color) => {
          if(layerName) {
            SARMap.setAttributeStyle(layerName, elementID, {fontColor: color})
          }
        }
      }
    },
    {
      title: getLanguage().ARMap.BACKGROUND_COLOR,
      type: 'color',
      data: {
        colors: COLORS,
        initColor: attributeStyle?.backgroundColor,
        onSelect: (color) => {
          if(layerName) {
            SARMap.setAttributeStyle(layerName, elementID, {backgroundColor: color})
          }
        }
      }
    },
    {
      title: getLanguage().STYLE_TRANSPARENCY,
      type: 'slide',
      slideData: [
        {
          type: 'single',
          left: {type: 'image', image: getImage().ar_opacity},
          right: {type: 'indicator', unit: '%'},
          range: [0,100],
          onMove: loc => {
            if(layerName) {
              SARMap.setAttributeStyle(layerName, elementID, {backgroundOpacity: loc / 100})
            }
          },
          defaultValue: attributeStyle ? parseInt((attributeStyle.backgroundOpacity * 100) + '') : 0,
        }
      ]
    },
    {
      title: getLanguage().ARMap.TRANSLATION,
      type: 'slide',
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
            SARMap.setAttributeStyle(layerName, elementID, {positionX: loc})
          },
          defaultValue: attributeStyle?.positionX,
          range: position.x,
          increment: 50,
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
            SARMap.setAttributeStyle(layerName, elementID, {positionY: loc})
          },
          defaultValue: attributeStyle?.positionY,
          range: position.y,
          increment: 50,
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
            SARMap.setAttributeStyle(layerName, elementID, {positionZ: loc})
          },
          defaultValue: attributeStyle?.positionZ,
          range: position.z,
          increment: 50,
        }
      ]
    },
    {
      title: getLanguage().ARMap.SCALE,
      type: 'slide',
      slideData: [
        {
          type: 'single',
          right: {type: 'text', text: 'W'},
          onMove: (loc) => {
            let transformData = AppToolBar.getData().transformInfo
            if(!transformData) return
            transformData = {
              ...transformData,
              width: loc,
              type: 'size',
            }
            AppToolBar.addData({transformInfo: {...transformData}})
            SARMap.setAttributeStyle(layerName, elementID, {width: loc})
          },
          defaultValue: attributeStyle?.width,
          range: size.width,
          increment: 100,
        },
        {
          type: 'single',
          right: {type: 'text', text: 'H'},
          onMove: (loc) => {
            let transformData = AppToolBar.getData().transformInfo
            if(!transformData) return
            transformData = {
              ...transformData,
              height: loc,
              type: 'size',
            }
            AppToolBar.addData({transformInfo: {...transformData}})
            SARMap.setAttributeStyle(layerName, elementID, {height: loc})
          },
          defaultValue: attributeStyle?.height,
          range: size.height,
          increment: 100,
        },
      ]
    },
  ]
}




const COLORS = [
  '#FFFFFF',
  '#000000',
  '#F0EDE1',
  '#1E477C',
  '#4982BC',
  '#00A1E9',
  '#803000',
  '#BD5747',
  '#36E106',
  '#9CBB58',
  '#8364A1',
  '#4AADC7',
  '#F89746',
  '#E7A700',
  '#E7E300',
  '#D33248',
  '#F1F1F1',
  '#7D7D7D',
  '#DDD9C3',
  '#C9DDF0',
  '#DBE4F3',
  '#BCE8FD',
  '#E5C495',
  '#F4DED9',
  '#DBE9CE',
  '#EBF4DE',
  '#E5E1ED',
  '#DDF0F3',
  '#FDECDC',
  '#FFE7C4',
  '#FDFACA',
  '#F09CA0',
  '#D7D7D7',
  '#585858',
  '#C6B797',
  '#8CB4EA',
  '#C1CCE4',
  '#7ED2F6',
  '#B1894F',
  '#E7B8B8',
  '#B0D59A',
  '#D7E3BD',
  '#CDC1D9',
  '#B7DDE9',
  '#FAD6B1',
  '#F5CE88',
  '#FFF55A',
  '#EF6C78',
  '#BFBFBF',
  '#3E3E3E',
  '#938953',
  '#548ED4',
  '#98B7D5',
  '#00B4F0',
  '#9A6C34',
  '#D79896',
  '#7EC368',
  '#C5DDA5',
  '#B1A5C6',
  '#93CDDD',
  '#F9BD8D',
  '#F7B550',
  '#FFF100',
  '#E80050',
  '#A6A6A7',
  '#2D2D2B',
  '#494428',
  '#1D3A5F',
  '#376192',
  '#825320',
  '#903635',
  '#13B044',
  '#76933C',
  '#5E467C',
  '#31859D',
  '#E46C07',
  '#F39900',
  '#B7AB00',
  '#A50036',
  '#979D99',
  '#0C0C0C',
  '#1C1A10',
  '#0C263D',
  '#005883',
  '#693904',
  '#622727',
  '#005E14',
  '#4F6028',
  '#3E3050',
  '#245B66',
  '#974805',
  '#AD6A00',
  '#8B8100',
  '#7C0022',
  '#F0DCBE',
  '#F2B1CF',
  '#D3FFBF',
  '#00165F',
  '#6673CB',
  '#006EBF',
  '#89CF66',
  '#70A900',
  '#93D150',
  '#70319F',
  '#D38968',
  '#FFBF00',
  '#FFFF00',
  '#C10000',
  '#F0F1A6',
  '#FF0000',
]
