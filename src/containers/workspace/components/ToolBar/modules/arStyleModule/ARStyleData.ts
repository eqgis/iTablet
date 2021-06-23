import { ConstToolType, ToolbarType } from '../../../../../../constants'
import { Toast } from '../../../../../../utils'
import { getLanguage } from '../../../../../../language'
import { getThemeAssets } from '../../../../../../assets'
import { color } from '../../../../../../styles'
import ToolbarModule from '../ToolbarModule'
import ToolbarBtnType from '../../ToolbarBtnType'
import { SARMap, ARLayerType } from 'imobile_for_reactnative'
import ARDrawingData from '../arDrawingModule/ARDrawingData'

interface SectionItemData {
  key: string,
  image: any,
  // selectedImage: any,
  title?: string,
  data?: any,
  action: (data: any) => void,
}

interface SectionData {
  title: string,
  containerType?: string,
  data: SectionItemData[]
}

async function getData(type: string, params: {[name: string]: any}) {
  ToolbarModule.setParams(params)
  let data: SectionData[] | SectionData | SectionItemData[] | string[] = []
  let buttons = [
    ToolbarBtnType.TOOLBAR_BACK,
    ToolbarBtnType.MENU,
    ToolbarBtnType.MENU_FLEX,
    ToolbarBtnType.TOOLBAR_COMMIT,
  ]
  switch (type) {
    case ConstToolType.SM_AR_STYLE_TEXT_SIZE:
    case ConstToolType.SM_AR_STYLE_TEXT_OPACITY:
    case ConstToolType.SM_AR_STYLE_BACKGROUND_OPACITY:
    case ConstToolType.SM_AR_STYLE_BORDER_WIDTH:
    case ConstToolType.SM_AR_STYLE_TRANSFROM: {
      const _data = await getLayerStyleData(type)
      if (_data) {
        data = _data.data
        buttons = _data.buttons
      }
      break
    }
    case ConstToolType.SM_AR_STYLE_BORDER_COLOR:
    case ConstToolType.SM_AR_STYLE_BACKGROUND_COLOR:
    case ConstToolType.SM_AR_STYLE_TEXT_COLOR:
      data = color.colors
      break
    case ConstToolType.SM_AR_STYLE_EFFECT: {
      buttons = [
        ToolbarBtnType.CANCEL,
        ToolbarBtnType.MENU_FLEX,
        ToolbarBtnType.TOOLBAR_COMMIT,
      ]
      const effectData: SectionItemData[] = await ARDrawingData.getAREffect()
      data.push({
        title: getLanguage(GLOBAL.language).ARMap.EFFECT,
        data: effectData,
      })
      break
    }
  }
  return { data, buttons }
}

/**
 * 显示滑动条组件
 * @param type
 * @param language
 * @param params Toolbar setVisible中的params
 */
async function showSlideToolbar(type: string, language: string, params: any) {
  GLOBAL.toolBox &&
  GLOBAL.toolBox.setVisible(true, type, {
    containerType: ToolbarType.slider,
    isFullScreen: false,
    showMenuDialog: false,
    ...params,
  })
}

const ARLayerStyleItems = (language: string) => {
  return [
    {
      key: getLanguage(language).Map_Main_Menu.STYLE_TRANSPARENCY,
      action: () => {
        showSlideToolbar(ConstToolType.SM_AR_STYLE_TRANSFROM, language, {
          selectName: getLanguage(language).Map_Main_Menu.STYLE_TRANSPARENCY,
          selectKey: getLanguage(language).Map_Main_Menu.STYLE_TRANSPARENCY,
          // isTouchProgress: true,
        })
      },
      selectKey: getLanguage(language).Map_Main_Menu.STYLE_TRANSPARENCY,
    },
    {
      key: getLanguage(language).Map_Main_Menu.STYLE_FRAME_COLOR,
      action: () => {
        GLOBAL.toolBox && GLOBAL.toolBox.menu({
          type: ConstToolType.SM_AR_STYLE_BORDER_COLOR,
          selectKey: getLanguage(language).Map_Main_Menu.STYLE_FRAME_COLOR,
        })
        showSlideToolbar(ConstToolType.SM_AR_STYLE_BORDER_COLOR, language, {
          containerType: ToolbarType.colorTable,
          selectName: getLanguage(language).Map_Main_Menu.STYLE_FRAME_COLOR,
          selectKey: getLanguage(language).Map_Main_Menu.STYLE_FRAME_COLOR,
          customView: null,
        })
      },
      selectKey: getLanguage(language).Map_Main_Menu.STYLE_FRAME_COLOR,
    },
    {
      key: getLanguage(language).Map_Main_Menu.STYLE_BORDER_WIDTH,
      action: () => {
        showSlideToolbar(ConstToolType.SM_AR_STYLE_BORDER_WIDTH, language, {
          selectName: getLanguage(language).Map_Main_Menu.STYLE_BORDER_WIDTH,
          selectKey: getLanguage(language).Map_Main_Menu.STYLE_BORDER_WIDTH,
          // isTouchProgress: true,
        })
      },
      selectKey: getLanguage(language).Map_Main_Menu.STYLE_BORDER_WIDTH,
    },
  ]
}


const ARTextStyleItems = (language: string) => {
  return [
    {
      key: getLanguage(language).ARMap.TEXT_OPACITY,
      action: () => {
        showSlideToolbar(ConstToolType.SM_AR_STYLE_TEXT_OPACITY, language, {
          selectName: getLanguage(language).ARMap.TEXT_OPACITY,
          selectKey: getLanguage(language).ARMap.TEXT_OPACITY,
          // isTouchProgress: true,
        })
      },
      selectKey: getLanguage(language).ARMap.TEXT_OPACITY,
    },
    {
      key: getLanguage(language).ARMap.TEXT_COLOR,
      action: () => {
        GLOBAL.toolBox && GLOBAL.toolBox.menu({
          type: ConstToolType.SM_AR_STYLE_TEXT_COLOR,
          selectKey: getLanguage(language).ARMap.TEXT_COLOR,
        })
        showSlideToolbar(ConstToolType.SM_AR_STYLE_TEXT_COLOR, language, {
          containerType: ToolbarType.colorTable,
          selectName: getLanguage(language).ARMap.TEXT_COLOR,
          selectKey: getLanguage(language).ARMap.TEXT_COLOR,
          customView: null,
        })
      },
      selectKey: getLanguage(language).ARMap.TEXT_COLOR,
    },
    {
      key: getLanguage(language).ARMap.TEXT_SIZE,
      action: () => {
        showSlideToolbar(ConstToolType.SM_AR_STYLE_TEXT_SIZE, language, {
          selectName: getLanguage(language).ARMap.TEXT_SIZE,
          selectKey: getLanguage(language).ARMap.TEXT_SIZE,
          // isTouchProgress: true,
        })
      },
      selectKey: getLanguage(language).ARMap.TEXT_SIZE,
    },
    {
      key: getLanguage(language).ARMap.BACKGROUND_OPACITY,
      action: () => {
        showSlideToolbar(ConstToolType.SM_AR_STYLE_BACKGROUND_OPACITY, language, {
          selectName: getLanguage(language).ARMap.BACKGROUND_OPACITY,
          selectKey: getLanguage(language).ARMap.BACKGROUND_OPACITY,
          // isTouchProgress: true,
        })
      },
      selectKey: getLanguage(language).ARMap.BACKGROUND_OPACITY,
    },
    {
      key: getLanguage(language).ARMap.BACKGROUND_COLOR,
      action: () => {
        GLOBAL.toolBox && GLOBAL.toolBox.menu({
          type: ConstToolType.SM_AR_STYLE_BACKGROUND_COLOR,
          selectKey: getLanguage(language).ARMap.BACKGROUND_COLOR,
        })
        showSlideToolbar(ConstToolType.SM_AR_STYLE_BACKGROUND_COLOR, language, {
          containerType: ToolbarType.colorTable,
          selectName: getLanguage(language).ARMap.BACKGROUND_COLOR,
          selectKey: getLanguage(language).ARMap.BACKGROUND_COLOR,
          customView: null,
        })
      },
      selectKey: getLanguage(language).ARMap.BACKGROUND_COLOR,
    },
  ]
}


function getMenuData() {
  const _params: any = ToolbarModule.getParams()

  let data: { key: string; action: () => void; selectKey: string }[] = []

  let _type = _params.type
  if (
    _type === ConstToolType.SM_AR_STYLE &&
    _params.arlayer.currentLayer.type === ARLayerType.AR_TEXT_LAYER
  ) {
    _type = ConstToolType.SM_AR_STYLE_TEXT
  }

  switch (_type) {
    case ConstToolType.SM_AR_STYLE:
    case ConstToolType.SM_AR_STYLE_BORDER_WIDTH:
    case ConstToolType.SM_AR_STYLE_TRANSFROM:
    case ConstToolType.SM_AR_STYLE_BORDER_COLOR:
      data = ARLayerStyleItems(_params.language)
      break
    case ConstToolType.SM_AR_STYLE_TEXT:
    case ConstToolType.SM_AR_STYLE_TEXT_OPACITY:
    case ConstToolType.SM_AR_STYLE_TEXT_COLOR:
    case ConstToolType.SM_AR_STYLE_TEXT_SIZE:
    case ConstToolType.SM_AR_STYLE_BACKGROUND_OPACITY:
    case ConstToolType.SM_AR_STYLE_BACKGROUND_COLOR:
      data = ARTextStyleItems(_params.language)
      break
  }
  return data
}

/**
 * AR图层风格
 * @param type
 * @returns
 */
async function getLayerStyleData(type: string) {
  const _params: any = ToolbarModule.getParams()
  const layer = _params.arlayer.currentLayer
  if(!_params.arlayer.currentLayer)  {
    Toast.show(getLanguage(_params.language).Prompt.CHOOSE_LAYER)
    return
  }
  SARMap.clearSelection()

  const range = {
    borderWidth: [0 , 200],
  }
  const buttons = [
    ToolbarBtnType.TOOLBAR_BACK,
    ToolbarBtnType.MENU,
    ToolbarBtnType.MENU_FLEX,
    ToolbarBtnType.TOOLBAR_COMMIT,
  ]
  let data: any[] = []
  const allData: {
    title: string,
    data: typeof data,
  }[] = []
  const layerStyle = await SARMap.getLayerStyle(layer.name)
  switch(type) {
    case ConstToolType.SM_AR_STYLE_BORDER_WIDTH: {
      data = [{
        key: 'borderWidth',
        leftImage: getThemeAssets().ar.armap.ar_border_width,
        unit: 'mm',
        onMove: (loc: number) => {
          if(layer.name) {
            SARMap.setLayerStyle(layer.name, {borderWidth: loc})
          }
        },
        defaultValue: layerStyle?.borderWidth || 0,
        range: range.borderWidth,
      }]
      allData.push({
        data: data,
        title: getLanguage(_params.language).ARMap.BORDER_WIDTH,
      })
      break
    }
    case ConstToolType.SM_AR_STYLE_TRANSFROM: {
      data = [{
        key: 'transfrom',
        leftImage: getThemeAssets().ar.armap.ar_opacity,
        unit: '%',
        range: [0,100],
        onMove: (loc: number) => {
          if(layer.name) {
            SARMap.setLayerStyle(layer.name, {opacity: loc / 100})
          }
        },
        defaultValue: layerStyle ? layerStyle.opacity * 100 : 0,
      }]
      allData.push({
        data: data,
        title: getLanguage(_params.language).Map_Main_Menu.STYLE_TRANSPARENCY,
      })
      break
    }
    case ConstToolType.SM_AR_STYLE_TEXT_SIZE: {
      data = [{
        key: 'transfrom',
        leftImage: getThemeAssets().ar.armap.ar_distance,
        unit: '%',
        range: [0,100],
        onMove: (loc: number) => {
          if(layer.name) {
            SARMap.setLayerStyle(layer.name, {textSize: loc})
          }
        },
        defaultValue: layerStyle?.textSize || 1,
      }]
      allData.push({
        data: data,
        title: getLanguage(_params.language).ARMap.TEXT_SIZE,
      })
      break
    }
    case ConstToolType.SM_AR_STYLE_TEXT_OPACITY: {
      data = [{
        key: 'transfrom',
        leftImage: getThemeAssets().ar.armap.ar_opacity,
        unit: '%',
        range: [0,100],
        onMove: (loc: number) => {
          if(layer.name) {
            SARMap.setLayerStyle(layer.name, {strokeOpacity: loc / 100})
          }
        },
        defaultValue: layerStyle ? layerStyle.strokeOpacity * 100 : 0,
      }]
      allData.push({
        data: data,
        title: getLanguage(_params.language).ARMap.TEXT_OPACITY,
      })
      break
    }
    case ConstToolType.SM_AR_STYLE_BACKGROUND_OPACITY: {
      data = [{
        key: 'transfrom',
        leftImage: getThemeAssets().ar.armap.ar_opacity,
        unit: '%',
        range: [0,100],
        onMove: (loc: number) => {
          if(layer.name) {
            SARMap.setLayerStyle(layer.name, {fillOpacity: loc / 100})
          }
        },
        defaultValue: layerStyle ? layerStyle.fillOpacity * 100 : 0,
      }]
      allData.push({
        data: data,
        title: getLanguage(_params.language).ARMap.BACKGROUND_OPACITY,
      })
      break
    }
  }
  return {
    buttons,
    data: allData,
  }
}

export default {
  getData,
  getMenuData,
}
