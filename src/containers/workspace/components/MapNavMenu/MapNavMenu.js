import * as React from 'react'
import { StyleSheet, Animated } from 'react-native'
import { scaleSize, setSpText, screen } from '../../../../utils'
import { ListSeparator, MTBtn } from '../../../../components'
import { Const, ChunkType, MapTabs } from '../../../../constants'
import PropTypes from 'prop-types'
import NavigationService from '../../../../containers/NavigationService'
import { getLanguage } from '../../../../language/index'
import { getThemeAssets } from '../../../../assets'
// import { SScene, Utility } from 'imobile_for_reactnative'
// export const MAP_LOCAL = 'MAP_LOCAL'
// export const MAP_3D = 'MAP_3D'

const INVISIBLE = -(scaleSize(100) + scaleSize(96))
const SHOW = 0
const HIDE = -scaleSize(96)

const INVISIBLE_R = -(scaleSize(100) + scaleSize(600))
const SHOW_R = scaleSize(80)
const HIDE_R = -scaleSize(600)

export default class MapNavMenu extends React.Component {
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
    mapColumnNavBar: PropTypes.bool,
    navBarDisplay: PropTypes.bool,
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
        if (data[i].key === props.route.name) {
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
    this.visible = true
    this.right = new Animated.Value(this.getRight())
  }

  componentDidUpdate(prevProps) {
    if (this.props.device.orientation !== prevProps.device.orientation) {
      this.onOrientationChange()
    }
  }

  getRight = () => {
    let right
    if (this.props.device.orientation.indexOf('LANDSCAPE') !== 0) {
      right = this.props.mapColumnNavBar ? INVISIBLE : INVISIBLE_R
    } else {
      if (this.visible) {
        if (this.props.navBarDisplay) {
          right = this.props.mapColumnNavBar ? SHOW : SHOW_R
        } else {
          right = this.props.mapColumnNavBar ? HIDE : HIDE_R
        }
      } else {
        right = this.props.mapColumnNavBar ? INVISIBLE : INVISIBLE_R
      }
    }
    return right
  }

  onOrientationChange = () => {
    let right = this.getRight()
    Animated.timing(this.right, {
      toValue: right,
      duration: 0,
      useNativeDriver: false,
    }).start()
  }

  setVisible = (visible, immediately) => {
    this.visible = visible
    let right = this.getRight()
    Animated.timing(this.right, {
      toValue: right,
      duration: immediately ? 0 : Const.ANIMATED_DURATION,
      useNativeDriver: false,
    }).start()
  }

  locationChange = () => {
    let right
    if (this.props.navBarDisplay) {
      right = this.props.mapColumnNavBar ? HIDE : HIDE_R
    } else {
      right = this.props.mapColumnNavBar ? SHOW : SHOW_R
    }
    Animated.timing(this.right, {
      toValue: right,
      duration: Const.ANIMATED_DURATION,
      useNativeDriver: false,
    }).start()
  }

  getToolbar = type => {
    let list = []
    const tabModules =
      (this.props.mapModules &&
        this.props.mapModules.modules[
          this.props.mapModules.currentMapModule
        ] &&
        this.props.mapModules.modules[this.props.mapModules.currentMapModule]
          .tabModules) ||
      []

    for (let module of tabModules) {
      switch (module) {
        case MapTabs.MapView:
          list.push({
            key: module,
            title:
              type === ChunkType.MAP_AR
                ? getLanguage(global.language).Map_Label.ARMAP
                : getLanguage(global.language).Map_Label.MAP,
            //'地图',
            image: getThemeAssets().tabBar.tab_map,
            selectedImage: getThemeAssets().tabBar.tab_map_selected,
            btnClick: () => {
              this.props.navigation &&
                this.props.navigation.navigate('MapView', { type })
            },
          })
          break
        case MapTabs.LayerManager:
        case MapTabs.ARLayerManager:
          list.push({
            key: module,
            title: getLanguage(global.language).Map_Label.LAYER,
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
        case MapTabs.ARMapSetting:
          list.push({
            key: module,
            title: getLanguage(global.language).Map_Label.SETTING,
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
            key: module,
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
            key: module,
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
            key: module,
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
            key: module,
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
    return (
      <MTBtn
        key={item.key}
        title={item.title}
        textColor={'#505050'}
        textStyle={{ fontSize: setSpText(20) }}
        selected={this.state.currentIndex === index}
        image={item.image}
        selectedImage={item.selectedImage}
        onPress={() => {
          let current = this.props.initIndex
          for (let i = 0; i < this.state.data.length; i++) {
            if (this.state.data[i].key === this.props.route.key) {
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
    return (
      <Animated.View
        style={[
          styles.container,
          this.props.style,
          { right: this.right },
          screen.isIphoneX() &&
            !this.props.mapColumnNavBar &&
            this.props.device.orientation.indexOf('LANDSCAPE') === 0 && {
            bottom: 14,
          },
          !this.props.mapColumnNavBar && {
            borderTopLeftRadius: scaleSize(10),
          },
          this.props.mapColumnNavBar && {
            flexDirection: 'column',
            elevation: 21,
            width: scaleSize(96),
            height: this.props.device.height - screen.getHeaderHeight(),
          },
        ]}
      >
        {this.renderItems(this.state.data)}
      </Animated.View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: scaleSize(600),
    height: scaleSize(96),
    bottom: 0,
    backgroundColor: '#EEEEEE',
    alignSelf: 'center',
    borderStyle: 'solid',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
})
