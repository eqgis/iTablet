import * as React from 'react'
import { View, StyleSheet } from 'react-native'
import { scaleSize, setSpText ,screen} from '../../../../utils'
import { ListSeparator, MTBtn } from '../../../../components'
import { ChunkType, MapTabs } from '../../../../constants'
import PropTypes from 'prop-types'
import { getLanguage } from '../../../../language'
import { color } from '../../../../styles'
import { getThemeAssets } from '../../../../assets'

export default class MapToolbar extends React.Component {
  static propTypes = {
    language: PropTypes.string,
    device: PropTypes.object,
    type: PropTypes.string,
    navigation: PropTypes.object,
    initIndex: PropTypes.number,
    style: PropTypes.any,
    mapModules: PropTypes.object,
    ARView: PropTypes.bool,
    isAR: PropTypes.bool,
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

  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.props.isAR !== nextProps.isAR ||
      this.props.type !== nextProps.type ||
      this.props.language !== nextProps.language ||
      this.props.initIndex !== nextProps.initIndex ||
      JSON.stringify(this.props.device) !== JSON.stringify(nextProps.device) ||
      JSON.stringify(this.props.mapModules) !== JSON.stringify(nextProps.mapModules) ||
      JSON.stringify(this.state) !== JSON.stringify(nextState)
    ) {
      return true
    }
    return false
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.isAR !== prevProps.isAR ||
      this.props.type !== prevProps.type ||
      this.props.language !== prevProps.language ||
      JSON.stringify(this.props.mapModules) !== JSON.stringify(prevProps.mapModules)
    ) {
      const data = this.getToolbar(this.props.type)
      this.setState({
        data: data,
      })
    }
  }

  getToolbar = type => {
    let list = []
    if (type === '') return list
    // let tabModules = this.props.mapModules.modules[
    //   this.props.mapModules.currentMapModule
    // ].tabModules
    const module = this.props.mapModules.modules[
      this.props.mapModules.currentMapModule
    ]

    let tabModules = []
    if (module.getTabModules) {
      tabModules = module.getTabModules(this.props.isAR ? 'ar' : 'map')
    } else {
      tabModules = module.tabModules
    }

    for (let module of tabModules) {
      switch (module) {
        case MapTabs.MapView:
          list.push({
            key: MapTabs.MapView,
            title:
              this.props.isAR
                ? getLanguage(GLOBAL.language).Map_Label.ARMAP
                : getLanguage(GLOBAL.language).Map_Label.MAP,
            //'地图',
            image: this.props.isAR ? getThemeAssets().tabBar.tab_ar_scene : getThemeAssets().tabBar.tab_map,
            selectedImage: this.props.isAR ? getThemeAssets().tabBar.tab_ar_scene_selected : getThemeAssets().tabBar.tab_map_selected,
            btnClick: () => {
              GLOBAL.ToolBar.existFullMap()
              this.props.navigation &&
                this.props.navigation.navigate('MapView', { type })
            },
          })
          break
        case MapTabs.LayerManager:
        case MapTabs.ARLayerManager:
          list.push({
            key: module,
            title: getLanguage(GLOBAL.language).Map_Label.LAYER,
            //'图层',
            image: getThemeAssets().tabBar.tab_layer,
            selectedImage: getThemeAssets().tabBar.tab_layer_selected,
            btnClick: () => {
              this.props.navigation &&
                this.props.navigation.navigate(module, { type })
            },
          })
          break
        case MapTabs.LayerAttribute:
          list.push({
            key: module,
            title: getLanguage(GLOBAL.language).Map_Label.ATTRIBUTE,
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
        case MapTabs.ARMapSetting:
          list.push({
            key: module,
            title: getLanguage(GLOBAL.language).Map_Label.SETTING,
            //'设置',
            image: getThemeAssets().tabBar.tab_setting,
            selectedImage: getThemeAssets().tabBar.tab_setting_selected,
            btnClick: () => {
              this.props.navigation &&
                this.props.navigation.navigate(module, { type })
            },
          })
          break
        case MapTabs.Scene:
          list.push({
            key: MapTabs.Scene,
            title: getLanguage(GLOBAL.language).Map_Label.SCENE,
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
            key: module,
            title: getLanguage(GLOBAL.language).Map_Label.LAYER,
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
            key: module,
            title: getLanguage(GLOBAL.language).Map_Label.ATTRIBUTE,
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
            key: module,
            title: getLanguage(GLOBAL.language).Map_Label.SETTING,
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
    let isLandscape = this.props.device.orientation.indexOf('LANDSCAPE') === 0
    let width = isLandscape ? scaleSize(96) : this.props.device.width /  this.state.data.length
    let title
    // if (item.key === MapTabs.MapView) {
    //   title = this.props.isAR
    //     ? getLanguage(GLOBAL.language).Map_Label.ARMAP
    //     : getLanguage(GLOBAL.language).Map_Label.MAP
    // }
    return (
      <MTBtn
        key={item.key}
        opacity={1}
        title={title || item.title}
        textColor={'#505050'}
        textStyle={{ fontSize: setSpText(20) }}
        selected={this.state.currentIndex === index}
        image={item.image}
        style={{ width: width }}
        // style={styles.btn}
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
    backgroundColor: 'white',
    alignSelf: 'center',
    borderStyle: 'solid',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: scaleSize(3),
    borderColor: color.itemColorGray2,
  },
  containerL: {
    width: scaleSize(96),
    height: '100%',
    backgroundColor: 'white',
    alignSelf: 'center',
    borderStyle: 'solid',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderLeftWidth: scaleSize(3),
    borderColor: color.itemColorGray2,
  },
})
