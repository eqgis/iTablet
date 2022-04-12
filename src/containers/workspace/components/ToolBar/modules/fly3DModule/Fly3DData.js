import * as React from 'react'
import { TouchableOpacity, Image } from 'react-native'
import { SScene } from 'imobile_for_reactnative'
import { ConstToolType } from '../../../../../../constants'
import { Toast, scaleSize } from '../../../../../../utils'
import { getLanguage } from '../../../../../../language'
import { getThemeAssets } from '../../../../../../assets'
import ToolbarModule from '../ToolbarModule'
import ToolbarBtnType from '../../ToolbarBtnType'
import Fly3DAction from './Fly3DAction'

async function getData(type, params) {
  if (params) {
    ToolbarModule.setParams(params)
  }
  let _data = { data: [], buttons: [] }
  if (type === ConstToolType.SM_MAP3D_FLY_LIST) {
    _data = await getFlyList()
  } else if (type === ConstToolType.SM_MAP3D_FLY) {
    _data = getToolFly()
  } else if (type === ConstToolType.SM_MAP3D_FLY_NEW) {
    _data = getNewFly()
  }
  return _data
}

async function getFlyList() {
  const params = ToolbarModule.getParams()
  const buttons = []
  let data = [
    {
      title: getLanguage(params.language).Map_Main_Menu.FLY_ROUTE,
      data: [],
    },
  ]
  try {
    const flyData = await SScene.getFlyRouteNames()
    flyData.forEach(
      item =>
        (item.image = require('../../../../../../assets/function/Frenchgrey/icon_symbolFly.png')),
    )
    const buttons = []
    buttons.push(
      <TouchableOpacity
        key="newButton"
        style={{
          height: scaleSize(80),
          width: scaleSize(80),
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={Fly3DAction.newFly}
      >
        <Image
          // source={require('../../../../../../assets/map/Frenchgrey/scene_addfly_light.png')}
          source={getThemeAssets().dataType.icon_newdata}
          style={{
            width: scaleSize(55),
            height: scaleSize(55),
          }}
        />
      </TouchableOpacity>,
    )
    data = [
      {
        image: require('../../../../../../assets/function/Frenchgrey/icon_symbolFly.png'),
        title: getLanguage(params.language).Map_Main_Menu.FLY_ROUTE,
        data: flyData,
        buttons,
      },
    ]
  } catch (error) {
    Toast.show(getLanguage(params.language).Prompt.NO_FLY)
  }
  return { data, buttons }
}

function getToolFly() {
  const data = [
    {
      key: 'startFly',
      title: getLanguage(global.language).Map_Main_Menu.COLLECTION_START,
      action: () => {
        SScene.flyStart()
      },
      size: 'large',
      image: getThemeAssets().mapTools.icon_tool_play,
      selectedImage: getThemeAssets().mapTools.icon_tool_play,
    },
    {
      key: 'stop',
      title: getLanguage(global.language).Map_Main_Menu.COLLECTION_PAUSE,
      action: () => {
        SScene.flyPause()
      },
      size: 'large',
      image: getThemeAssets().mapTools.icon_tool_suspend,
      selectedImage: getThemeAssets().mapTools.icon_tool_suspend,
    },
  ]
  const buttons = [ToolbarBtnType.CANCEL]
  return { data, buttons }
}

function getNewFly() {
  const data = [
    {
      key: 'startFly',
      title: getLanguage(global.language).Map_Main_Menu.FLY_ADD_STOPS,
      action: () => {
        try {
          SScene.saveCurrentRoutStop().then(result => {
            if (result) {
              Toast.show(getLanguage(global.language).Prompt.ADD_SUCCESS)
            }
          })
        } catch (error) {
          Toast.show(getLanguage(global.language).Prompt.ADD_FAILED)
        }
      },
      size: 'large',
      image: getThemeAssets().mapTools.icon_add_site,
      selectedImage: getThemeAssets().mapTools.icon_add_site,
    },
    {
      key: 'stop',
      title: getLanguage(global.language).Map_Main_Menu.FLY,
      action: () => {
        try {
          SScene.saveRoutStop()
        } catch (error) {
          Toast.show(getLanguage(global.language).Prompt.PLEASE_ADD_STOP)
        }
      },
      size: 'large',
      image: getThemeAssets().mapTools.icon_fly,
      selectedImage: getThemeAssets().mapTools.icon_fly,
    },
    {
      key: 'pause',
      title: getLanguage(global.language).Map_Main_Menu.COLLECTION_PAUSE,
      action: () => {
        try {
          SScene.pauseRoutStop()
        } catch (error) {
          Toast.show(getLanguage(global.language).Prompt.FIELD_TO_PAUSE)
        }
      },
      size: 'large',
      image: getThemeAssets().mapTools.icon_suspend,
      selectedImage: getThemeAssets().mapTools.icon_suspend,
    },
  ]
  const buttons = [ToolbarBtnType.CANCEL]
  return { data, buttons }
}

export default {
  getData,
  getFlyList,
  getToolFly,
  getNewFly,
}
