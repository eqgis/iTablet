import * as React from 'react'
import { View, StyleSheet } from 'react-native'
import { scaleSize, setSpText } from '../../../../utils'
import { ListSeparator, MTBtn } from '../../../../components'
import { ChunkType, MapTabs } from '../../../../constants'
import PropTypes from 'prop-types'
import { getLanguage } from '../../../../language/index'
import { getThemeAssets } from '../../../../assets'

export default class MapToolbar extends React.Component {
  static propTypes = {
    language: PropTypes.string,
    device: PropTypes.object,
    type: PropTypes.string,
    navigation: PropTypes.object,
    initIndex: PropTypes.number,
    POP_List: PropTypes.func,
    layerManager: PropTypes.func,
    style: PropTypes.any,
    mapModules: PropTypes.object,
    ARView: PropTypes.bool,
  }

  static defaultProps = {
    type: ChunkType.MAP_COLLECTION,
    hidden: false,
    editLayer: {},
    initIndex: -1,
  }

  constructor(props) {
    super(props)

    this.show = false
    this.type = ''
    const data = this.getToolbar(props.type)

    let current = 0
    if (props.initIndex < 0 && data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].key === props.navigation.state.key) {
          current = i
        }
      }
    } else {
      current = props.initIndex
    }

    this.state = {
      data: data,
      currentIndex: current,
    }
  }

  getToolbar = type => {
    let list = []
    if (type === '') return list
    const tabModules = this.props.mapModules.modules[
      this.props.mapModules.currentMapModule
    ].tabModules

    for (let i = 0; i < tabModules.length; i++) {
      switch (tabModules[i]) {
        case MapTabs.MapView:
          list.push({
            key: MapTabs.MapView,
            title:
              type === ChunkType.MAP_AR
                ? getLanguage(global.language).Map_Label.ARMAP
                : getLanguage(global.language).Map_Label.MAP,
            //'地图',
            image: getThemeAssets().tabBar.tab_map,
            selectedImage: getThemeAssets().tabBar.tab_map_selected,
            btnClick: () => {
              GLOBAL.ToolBar.existFullMap()
              this.props.navigation &&
                this.props.navigation.navigate('MapView', { type })
            },
          })
          break
        case MapTabs.LayerManager:
          list.push({
            key: tabModules[i],
            title: getLanguage(global.language).Map_Label.LAYER,
            //'图层',
            image: getThemeAssets().tabBar.tab_layer,
            selectedImage: getThemeAssets().tabBar.tab_layer_selected,
            btnClick: () => {
              this.props.navigation &&
                this.props.navigation.navigate('LayerManager', { type })
            },
          })
          break
        case MapTabs.LayerAttribute:
          list.push({
            key: tabModules[i],
            title: getLanguage(global.language).Map_Label.ATTRIBUTE,
            //'属性',
            image: getThemeAssets().tabBar.tab_attribute,
            selectedImage: getThemeAssets().tabBar.tab_attribute_selected,
            btnClick: () => {
              this.props.navigation &&
                this.props.navigation.navigate('LayerAttribute', { type })
            },
          })
          break
        case MapTabs.MapSetting:
          list.push({
            key: tabModules[i],
            title: getLanguage(global.language).Map_Label.SETTING,
            //'设置',
            image: getThemeAssets().tabBar.tab_setting,
            selectedImage: getThemeAssets().tabBar.tab_setting_selected,
            btnClick: () => {
              this.props.navigation &&
                this.props.navigation.navigate('MapSetting', { type })
            },
          })
          break
        case MapTabs.Scene:
          list.push({
            key: MapTabs.Scene,
            title: getLanguage(global.language).Map_Label.SCENE,
            //'场景',
            image: getThemeAssets().tabBar.tab_scene,
            selectedImage: getThemeAssets().tabBar.tab_scene_selected,
            btnClick: () => {
              this.props.navigation &&
                this.props.navigation.navigate('Map3D', {
                  type: 'MAP_3D',
                })
            },
          })
          break
        case MapTabs.Layer3DManager:
          list.push({
            key: tabModules[i],
            title: getLanguage(global.language).Map_Label.LAYER,
            //'图层',
            image: getThemeAssets().tabBar.tab_layer,
            selectedImage: getThemeAssets().tabBar.tab_layer_selected,
            btnClick: () => {
              this.props.navigation &&
                this.props.navigation.navigate('Layer3DManager', {
                  type: 'MAP_3D',
                })
            },
          })
          break
        case MapTabs.LayerAttribute3D:
          list.push({
            key: tabModules[i],
            title: getLanguage(global.language).Map_Label.ATTRIBUTE,
            //'属性',
            image: getThemeAssets().tabBar.tab_attribute,
            selectedImage: getThemeAssets().tabBar.tab_attribute_selected,
            btnClick: () => {
              this.props.navigation &&
                this.props.navigation.navigate('LayerAttribute3D', {
                  type: 'MAP_3D',
                })
            },
          })
          break
        case MapTabs.Map3DSetting:
          list.push({
            key: tabModules[i],
            title: getLanguage(global.language).Map_Label.SETTING,
            //'设置',
            image: getThemeAssets().tabBar.tab_setting,
            selectedImage: getThemeAssets().tabBar.tab_setting_selected,
            btnClick: () => {
              this.props.navigation &&
                this.props.navigation.navigate('Map3DSetting', {})
            },
          })
          break
      }
    }
    return list
  }

  _renderItem = ({ item, index }) => {
    let title
    if (item.key === MapTabs.MapView) {
      title = this.props.ARView
        ? getLanguage(global.language).Map_Label.ARMAP
        : getLanguage(global.language).Map_Label.MAP
    }
    return (
      <MTBtn
        key={item.key}
        title={title || item.title}
        textColor={'#505050'}
        textStyle={{ fontSize: setSpText(20) }}
        selected={this.state.currentIndex === index}
        image={item.image}
        style={{ width: scaleSize(120) }}
        selectedImage={item.selectedImage}
        onPress={() => {
          let current = this.props.initIndex
          for (let i = 0; i < this.state.data.length; i++) {
            if (this.state.data[i].key === this.props.navigation.state.key) {
              current = i
            }
          }
          if (current !== index) {
            item.btnClick && item.btnClick()
          }
        }}
      />
    )
  }

  _renderItemSeparatorComponent = () => {
    return <ListSeparator mode={ListSeparator.mode.VERTICAL} />
  }

  _keyExtractor = item => item.key

  renderItems = data => {
    let toolbar = []
    data.forEach((item, index) => {
      toolbar.push(this._renderItem({ item, index }))
    })
    return toolbar
  }

  render() {
    let isLandscape = this.props.device.orientation.indexOf('LANDSCAPE') === 0
    let style = isLandscape ? styles.containerL : styles.containerP
    return (
      <View style={[style, this.props.style]}>
        {this.renderItems(this.state.data)}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  containerP: {
    width: '100%',
    height: scaleSize(96),
    backgroundColor: '#EEEEEE',
    alignSelf: 'center',
    borderStyle: 'solid',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  containerL: {
    width: scaleSize(96),
    height: '100%',
    backgroundColor: '#EEEEEE',
    alignSelf: 'center',
    borderStyle: 'solid',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
})
