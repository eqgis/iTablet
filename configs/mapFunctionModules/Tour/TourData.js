import React from 'react'
import { TouchableOpacity, Image, View } from 'react-native'
import ToolbarBtnType from '../../../src/containers/workspace/components/ToolBar/ToolbarBtnType'
import { TourEditView } from './component'
import ToolbarModule from '../../../src/containers/workspace/components/ToolBar/modules/ToolbarModule'
import { MTBtn } from '../../../src/components'
import { LayerUtils, scaleSize } from '../../../src/utils'
import { getLanguage } from '../../../src/language'

/**
 * 获取自定义弹出框中的数据和自定义组件
 * @param type
 * @returns {Promise.<{data: Array, buttons: Array, customView: *}>}
 */
async function getData(type) {
  let data = []
  let buttons = []
  let customView = null

  switch (type) {
    case 'TourBrowse':
      data = await getTours()
      break
    case 'TourCreate':
    default:
      buttons = [ToolbarBtnType.CANCEL, ToolbarBtnType.TOOLBAR_COMMIT]
      customView = _props => <TourEditView {..._props} /> // 自定义地图弹出框界面
      break
  }

  return { data, buttons, customView }
}

/** 获取旅行轨迹列表数据 **/
async function getTours () {
  const params = ToolbarModule.getParams()
  let layers = params.getLayers && await params.getLayers() || params.layers.layers
  // layers = JSON.parse(JSON.stringify(layers))
  let tourLayers = []
  for (let i = 0; i < layers.length; i++) {
    if (LayerUtils.getLayerType(layers[i]) === 'TAGGINGLAYER') {
      layers[i].name = layers[i].datasetName
      tourLayers.unshift(layers[i])
    }
  }
  tourLayers.forEach(
    item => {
      item.image = require('../../../src/assets/function/Frenchgrey/icon_symbolFly.png')
      item.rightView = (
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          backgroundColor: 'transparent',
        }} >
          <MTBtn
            size={MTBtn.Size.SMALL}
            image={require('../../../src/assets/mapEdit/icon_play.png')}
            onPress={() => {
              // TODO 播放轨迹
            }}
          />
          <MTBtn
            style={{marginLeft: 10}}
            size={MTBtn.Size.SMALL}
            image={require('../../../src/assets/function/icon_shallow_more_gray.png')}
            onPress={() => {
            }}
          />
        </View>
      )
      return item
    },
  )
  const buttons = [] // 底部按钮
  buttons.push(
    <TouchableOpacity
      key="newButton"
      style={{
        height: scaleSize(80),
        width: scaleSize(80),
        justifyContent: 'center',
        alignItems: 'center',
      }}
      onPress={() => {
        ToolbarModule.getData().actions &&
        ToolbarModule.getData().actions.tour &&
        ToolbarModule.getData().actions.tour()
      }}
    >
      <Image
        source={require('../../../src/assets/map/Frenchgrey/scene_addfly_light.png')}
        style={{
          width: scaleSize(55),
          height: scaleSize(55),
        }}
      />
    </TouchableOpacity>,
  )
  const data = [
    {
      image: require('../../../src/assets/function/Frenchgrey/icon_symbolFly_white.png'),
      title: getLanguage(params.language).Map_Main_Menu.FLY_ROUTE,
      data: tourLayers,
      buttons,
    },
  ]

  return data
}

export default {
  getData,
}
