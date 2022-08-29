import * as React from 'react'
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native'
import { scaleSize, setSpText, AppToolBar} from '../../../../utils'
import { ListSeparator, MTBtn } from '../../../../components'
import ChunkType, { TChunkType } from '../../../../constants/custom/ChunkType'
import MapTabs, { TMapTabs } from '../../../../constants/custom/MapTabs'
import { getLanguage } from '../../../../language'
import { color } from '../../../../styles'
import { getThemeAssets } from '../../../../assets'

interface Props {
  language: string,
  device: Device,
  type: TChunkType[keyof TChunkType],
  navigation: any,
  initIndex: number,
  style?: StyleProp<ViewStyle>,
  mapModules?: any,
  ARView?: boolean,
  isAR?: boolean,
  currentAction?: () => void, // 点击当前Tab触发的事件
}

interface TabItem {
  key: TMapTabs[keyof TMapTabs],
  title: string,
  image: any,
  selectedImage: any,
  btnClick: () => void,
}

interface State {
  data: TabItem[],
  currentIndex: number,
}

export default class MapToolbar extends React.Component<Props, State> {

  static defaultProps = {
    type: ChunkType.MAP_COLLECTION,
    hidden: false,
    editLayer: {},
    initIndex: -1,
  }

  show = false

  constructor(props: Props) {
    super(props)

    this.show = false
    const data = this.getToolbar(props.type)

    let current = 0
    if (props.initIndex < 0 && data.length > 0) {
      // for (let i = 0; i < data.length; i++) {
      //   if (data[i].key === props.route.name) {
      //     current = i
      //   }
      // }
    } else {
      current = props.initIndex
    }

    this.state = {
      data: data,
      currentIndex: current,
    }
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
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

  componentDidUpdate(prevProps: Props) {
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

  getToolbar = (type: TChunkType[keyof TChunkType] | '') => {
    const list: TabItem[] = []
    if (type === '') return list
    // let tabModules = this.props.mapModules.modules[
    //   this.props.mapModules.currentMapModule
    // ].tabModules
    const _module = this.props.mapModules.modules[
      this.props.mapModules.currentMapModule
    ]

    let tabModules = []
    if (_module.getTabModules) {
      tabModules = _module.getTabModules(this.props.isAR ? 'ar' : 'map')
    } else {
      tabModules = _module.tabModules
    }

    for (const module of tabModules) {
      switch (module) {
        case MapTabs.MapView:
          list.push({
            key: MapTabs.MapView,
            title:
              this.props.isAR
                ? getLanguage(global.language).Map_Label.AR_SCENE
                : getLanguage(global.language).Map_Label.MAP,
            //'地图',
            image: this.props.isAR ? getThemeAssets().tabBar.tab_ar_scene : getThemeAssets().tabBar.tab_map,
            selectedImage: this.props.isAR ? getThemeAssets().tabBar.tab_ar_scene_selected : getThemeAssets().tabBar.tab_map_selected,
            btnClick: () => {
              AppToolBar.getCurrentOption() === undefined && global.ToolBar?.existFullMap()
              this.props.navigation &&
                this.props.navigation.navigate('MapView', { type })
            },
          })
          break
        case MapTabs.LayerManager:
        case MapTabs.ARLayerManager:
        case MapTabs.Layer3DManager:
          list.push({
            key: module,
            title: getLanguage(global.language).Map_Label.LAYER,
            //'图层',
            image: getThemeAssets().tabBar.tab_layer,
            selectedImage: getThemeAssets().tabBar.tab_layer_selected,
            btnClick: () => {
              if (this.props.navigation) {
                if (this.props.navigation.getState().type === 'tab') {
                  this.props.navigation.navigate(module, { type })
                } else {
                  this.props.navigation.replace(module, { type })
                }
              }
              // this.props.navigation &&
              //   this.props.navigation.navigate(module, { type })
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
              this.props.currentAction?.()
            },
          })
          break
        case MapTabs.MapSetting:
        case MapTabs.ARMapSetting:
        case MapTabs.Map3DSetting:
          list.push({
            key: module,
            title: getLanguage(global.language).Map_Label.SETTING,
            //'设置',
            image: getThemeAssets().tabBar.tab_setting,
            selectedImage: getThemeAssets().tabBar.tab_setting_selected,
            btnClick: () => {
              if (this.props.navigation) {
                if (this.props.navigation.getState().type === 'tab') {
                  this.props.navigation.navigate(module, { type })
                } else {
                  this.props.navigation.replace(module, { type })
                }
              }
              // this.props.navigation &&
              //   this.props.navigation.replace(module, { type })
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
        case MapTabs.LayerAttribute3D:
          list.push({
            key: module,
            title: getLanguage(global.language).Map_Label.ATTRIBUTE,
            //'属性',
            image: getThemeAssets().tabBar.tab_attribute,
            selectedImage: getThemeAssets().tabBar.tab_attribute_selected,
            btnClick: () => {
              this.props.navigation &&
                this.props.navigation.navigate('LayerAttribute3D', { type })
            },
          })
          break
      }
    }
    return list
  }

  _renderItem = ({ item, index }: { item: TabItem, index: number }) => {
    const isLandscape = this.props.device.orientation.indexOf('LANDSCAPE') === 0
    const width = isLandscape ? scaleSize(96) : this.props.device.width /  this.state.data.length
    let title
    // if (item.key === MapTabs.MapView) {
    //   title = this.props.isAR
    //     ? getLanguage(global.language).Map_Label.AR_SCENE
    //     : getLanguage(global.language).Map_Label.MAP
    // }
    return (
      <MTBtn
        key={item.key}
        opacity={1}
        title={title || item.title}
        textColor={'#505050'}
        textStyle={{ fontSize: setSpText(18), marginTop: scaleSize(5), }}
        selected={this.state.currentIndex === index}
        imageStyle= {{width: scaleSize(48), height: scaleSize(48)}}
        image={item.image}
        style={{ width: width }}
        // style={styles.btn}
        selectedImage={item.selectedImage}
        onPress={() => {
          let current = this.props.initIndex
          const navState = this.props.navigation.getState()
          for (let i = 0; i < this.state.data.length; i++) {
            if (this.state.data[i].key === navState.routes[navState.index].name) {
              current = i
            }
          }
          if (current !== index) {
            item.btnClick && item.btnClick()
          } else {
            this.props.currentAction?.()
          }
        }}
      />
    )
  }

  _renderItemSeparatorComponent = () => {
    return <ListSeparator mode={ListSeparator.mode.VERTICAL} />
  }

  _keyExtractor = item => item.key

  renderItems = (data: TabItem[]) => {
    const toolbar: JSX.Element[] = []
    data.forEach((item, index) => {
      toolbar.push(this._renderItem({ item, index }))
    })
    return toolbar
  }

  render() {
    const isLandscape = this.props.device.orientation.indexOf('LANDSCAPE') === 0
    const style = isLandscape ? styles.containerL : styles.containerP
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
