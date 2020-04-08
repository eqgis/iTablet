import * as React from 'react'
import { StyleSheet, Animated } from 'react-native'
import { scaleSize, setSpText, screen } from '../../../../utils'
import { ListSeparator } from '../../../../components'
import constants from '../../constants'
import { Const } from '../../../../constants'
import PropTypes from 'prop-types'
import NavigationService from '../../../../containers/NavigationService'
import MT_Btn from '../../../../components/mapTools/MT_Btn'
import { getLanguage } from '../../../../language/index'
import { getThemeAssets } from '../../../../assets'
// import { SScene, Utility } from 'imobile_for_reactnative'
// export const MAP_LOCAL = 'MAP_LOCAL'
// export const MAP_3D = 'MAP_3D'

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
    appConfig: PropTypes.object,
  }

  static defaultProps = {
    type: constants.MAP_COLLECTION,
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
      right: new Animated.Value(-this.props.device.width),
    }
    this.visible = false
  }

  setVisible = (visible, immediately) => {
    if (this.visible === visible) return
    // iphone X适配向右侧横屏
    Animated.timing(this.state.right, {
      toValue: visible ? scaleSize(80) : scaleSize(-this.props.device.width),
      duration: immediately ? 0 : Const.ANIMATED_DURATION,
    }).start()
    this.visible = visible
  }

  getToolbar = type => {
    let list = []
    const tabModules = this.props.appConfig.mapModules[
      this.props.appConfig.currentMapModule
    ].tabModules
    for (let i = 0; i < tabModules.length; i++) {
      switch (tabModules[i]) {
        case 'Map':
          list.push({
            key: 'MapView',
            title:
              type === constants.MAP_AR
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
        case 'Layer':
          list.push({
            key: 'LayerManager',
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
        case 'Attribute':
          list.push({
            key: 'LayerAttribute',
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
        case 'Settings':
          list.push({
            key: 'MapSetting',
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
        case 'Scene':
          list.push({
            key: 'scene',
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
        case 'Layer3D':
          list.push({
            key: 'Layer3DManager',
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
        case 'Attribute3D':
          list.push({
            key: 'LayerAttribute3D',
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
        case 'Settings3D':
          list.push({
            key: 'Setting',
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

  _map3Dchange = () => {
    NavigationService.navigate('WorkspaceFileList', { type: constants.MAP_3D })
  }

  _renderItem = ({ item, index }) => {
    return (
      <MT_Btn
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
            if (this.state.data[i].key === this.props.navigation.state.key) {
              current = i
            }
          }
          if (current !== index) {
            item.btnClick && item.btnClick()
            GLOBAL.FUNCTIONTOOLBAR &&
              GLOBAL.FUNCTIONTOOLBAR.setMenuVisible(false)
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
          { right: this.state.right },
          this.props.device.orientation.indexOf('LANDSCAPE') === 0 && {
            bottom: screen.X_BOTTOM,
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
    borderTopLeftRadius: scaleSize(10),
  },
})
