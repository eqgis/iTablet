import React from 'react'
import { ConstToolType, ToolbarType } from '../../../../../../constants'
import { Toast } from '../../../../../../utils'
import { getLanguage } from '../../../../../../language'
import { getThemeAssets } from '../../../../../../assets'
import { color } from '../../../../../../styles'
import ToolbarModule from '../ToolbarModule'
import ToolbarBtnType from '../../ToolbarBtnType'
import ToolBarSlide from '../../components/ToolBarSlide'
import { SARMap } from 'imobile_for_reactnative'

interface SectionItemData {
  key: string,
  image: any,
  // selectedImage: any,
  title: string,
  action: (data: any) => void,
}

interface SectionData {
  title: string,
  containerType?: string,
  data: SectionItemData[]
}

async function getData(type: string, params: {[name: string]: any}) {
  ToolbarModule.setParams(params)
  let data: SectionData[] | SectionItemData[] | string[] = []
  let buttons: any[] = []
  switch (type) {
    case ConstToolType.SM_AR_STYLE: {
      const _data = await getLayerStyleData(type)
      if (_data) {
        data = _data.data
        buttons = _data.buttons
      }
      break
    }
    case ConstToolType.SM_AR_STYLE_BORDER_COLOR:
      data = color.colors
      break
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
  let _data: { buttons: string[]; data: any[] } | undefined
  switch (type) {
    case ConstToolType.SM_AR_STYLE:
    case ConstToolType.SM_AR_STYLE_BORDER_WIDTH:
    case ConstToolType.SM_AR_STYLE_TRANSFROM:
    case ConstToolType.SM_AR_STYLE_BORDER_COLOR:
      _data = await getLayerStyleData(type)
      break
  }
  GLOBAL.toolBox &&
  GLOBAL.toolBox.setVisible(true, type, {
    isFullScreen: false,
    showMenuDialog: false,
    buttons: [
      ToolbarBtnType.TOOLBAR_BACK,
      ToolbarBtnType.MENU,
      ToolbarBtnType.MENU_FLEX,
      ToolbarBtnType.TOOLBAR_COMMIT,
    ],
    customView: () => {
      return (
        <ToolBarSlide
          data={{
            title: params.selectName || '',
            data: _data?.data || [],
          }}
        />
      )
    },
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

function getMenuData() {
  const _params: any = ToolbarModule.getParams()

  let data: { key: string; action: () => void; selectKey: string }[] = []

  switch (_params.type) {
    case ConstToolType.SM_AR_STYLE:
    case ConstToolType.SM_AR_STYLE_BORDER_WIDTH:
    case ConstToolType.SM_AR_STYLE_TRANSFROM:
    case ConstToolType.SM_AR_STYLE_BORDER_COLOR:
      data = ARLayerStyleItems(_params.language)
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
  switch(type) {
    case ConstToolType.SM_AR_STYLE_BORDER_WIDTH: {
      const borderWidth = await SARMap.getLayerBorderWidth(layer.name)
      data = [{
        key: 'borderWidth',
        leftImage: getThemeAssets().ar.armap.ar_border_width,
        unit: 'mm',
        onMove: (loc: number) => {
          SARMap.setLayerBorderWidth(layer.name, loc)
        },
        defaultValue: borderWidth,
        range: range.borderWidth,
      }]
      break
    }
    case ConstToolType.SM_AR_STYLE_TRANSFROM: {
      const opacity = await SARMap.getLayerOpacity(layer.name)
      data = [{
        key: 'transfrom',
        leftImage: getThemeAssets().ar.armap.ar_opacity,
        unit: '%',
        range: [0,100],
        onMove: (loc: number) => {
          if(layer.name) {
            SARMap.setLayerOpacity(layer.name, loc / 100)
          }
        },
        defaultValue: parseInt((opacity * 100).toFixed()),
      }]
      break
    }
  }
  return {
    buttons,
    data,
  }
}

export default {
  getData,
  getMenuData,
}
