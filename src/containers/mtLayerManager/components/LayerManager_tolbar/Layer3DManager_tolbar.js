import React from 'react'
import { ConstToolType } from '../../../../constants/index'
import NavigationService from '../../../NavigationService'
import {
  layere3dImage,
  // layer3dSettingCanNotSelect,
  layer3dDefault,
  layere3dTerrain,
} from './LayerToolbarData'
import {
  View,
  Image,
  TouchableOpacity,
  Animated,
  Text,
  // TextInput,
  TouchableHighlight,
} from 'react-native'
import ToolBarSectionList from '../../../workspace/components/ToolBar/components/ToolBarSectionList'
import styles from './styles'
import { SScene } from 'imobile_for_reactnative'
// import { Dialog } from '../../../../components'
import { color } from '../../../../styles'
import { getThemeAssets } from '../../../../assets'
import { screen, scaleSize, setSpText, dataUtil, Toast } from '../../../../utils'
// import Map3DToolBar from '../../../workspace/components/Map3DToolBar'
import { getLanguage } from '../../../../language/index'
/** 工具栏类型 **/
const list = 'list'

const imgSize = scaleSize(44)

export default class LayerManager_tolbar extends React.Component {
  props: {
    language: string,
    type?: string,
    containerProps?: Object,
    data: Array,
    layerdata?: Object,
    existFullMap: () => {},
    getLayers: () => {}, // 更新数据（包括其他界面）
    setCurrentLayer: () => {},
    layer3dRefresh: () => {},
    onPress: () => {},
    onThisPress: () => {},
    updateTagging: () => {},
    overlayView: () => {},
    device: Object,
    layers: Object,
    user: Object,
    curUserBaseMaps: Array,
    navigation: Object,
  }

  static defaultProps = {
    containerProps: {
      data: [],
      containerType: list,
    },
  }

  constructor(props) {
    super(props)
    this.layer3d = {}
    this.height =
      props.containerProps.height >= 0
        ? props.containerProps.height
        : props.containerProps.containerType === list
          ? ConstToolType.HEIGHT[3]
          : ConstToolType.HEIGHT[1]
    this.state = {
      type: props.type, // 当前传入的类型
      containerType: props.containerProps.containerType,
      data: [],
      bottom: new Animated.Value(-screen.deviceHeight),
      boxHeight: new Animated.Value(this.height),
      showMenuDialog: false,
      isTouch: true,
      layerdata: props.layerdata || '',
      index: 0,
      // layerName: '',
    }
    this.isShow = false
    this.isBoxShow = true
    this.getData = this.getData.bind(this)
  }

  async getData(type) {
    let data = []
    switch (type) {
      case ConstToolType.SM_MAP3D_LAYER3D_BASE:
        data = [
          {
            title: '',
            data: [
              {
                title: getLanguage(global.language).Map_Layer.ADD_A_IMAGE_LAYER,
                image: getThemeAssets().start.icon_new_map,
                type: 'AddImage',
              },
              {
                title: getLanguage(global.language).Map_Layer.BASEMAP_SWITH,
                image: getThemeAssets().start.icon_open_map,
              },
            ],
          },
        ]
        break
      case ConstToolType.SM_MAP3D_LAYER3D_IMAGE:
        data = layere3dImage(global.language)
        break
      case ConstToolType.SM_MAP3D_LAYER3D_TERRAIN:
        data = layere3dTerrain(global.language)
        break
      case ConstToolType.SM_MAP3D_BASE:
        data = [
          {
            header: {
              title: getLanguage(global.language).Map_Layer.ONLINE_BASE_MAP,
              // image: getThemeAssets().layer3dType.layer3d_normal_selected,
              image: getThemeAssets().layer3dType.layer3d_normal,
            },
            data: [
              // {
              //   title: 'BingMap',
              //   name: 'BingMap',
              //   type: 'AddBingmap',
              //   image: require('../../../../assets/map/layers_theme_unique_style_black.png'),
              // },
              {
                title: 'TianDiTu',
                name: 'TianDiTu',
                type: 'AddTianditu',
                image: getThemeAssets().layer3dType.layer3d_normal,
              },
            ],
          },
        ]
        break
      case ConstToolType.SM_MAP3D_LAYER3D_DEFAULT:
        data = layer3dDefault(this.props.language, false)
        break
      case ConstToolType.SM_MAP3D_LAYER3D_DEFAULT_SELECTED:
        data = layer3dDefault(this.props.language, true)
        break
      case 'AddTerrain_second': {
        //地形添加二级界面
        let terrainDatas = {
          header: {
            title: getLanguage(global.language).Map_Layer.TERRAIN,
            // image: getThemeAssets().layer3dType.layer3d_terrain_layer_selected,
            image: getThemeAssets().layer3dType.layer3d_terrain_layer,
            type: 'Terrain',
          },
          data: [],
        }
        let value = await SScene.getTerrainCacheNames()
        if (value) {
          for (let i = 0, n = value.length; i < n; i++) {
            let terrainData = {
              image: getThemeAssets().layer3dType.layer3d_terrain_layer,
              type: 'AddTerrain_second',
            }
            terrainData.path = value[i].path
            terrainData.title = dataUtil.getFileNameWithOutExt(value[i].name)
            terrainDatas.data.push(terrainData)
          }
        }
        data.push(terrainDatas)
        break
      }
      case 'AddImage_second': {
        //影像添加二级界面
        let terrainDatas = {
          header: {
            title: getLanguage(global.language).Map_Layer.IMAGE,
            // image: getThemeAssets().layer3dType.layer3d_image_selected,
            image: getThemeAssets().layer3dType.layer3d_image,
            type: 'Image',
          },
          data: [],
        }
        let value = await SScene.getImageCacheNames()
        if (value) {
          for (let i = 0, n = value.length; i < n; i++) {
            let terrainData = {
              image: getThemeAssets().layer3dType.layer3d_normal,
              type: 'AddImage_second',
            }
            terrainData.path = value[i].path
            terrainData.title = dataUtil.getFileNameWithOutExt(value[i].name)
            terrainDatas.data.push(terrainData)
          }
        }
        data.push(terrainDatas)
        break
      }
    }
    return data
  }

  showToolbarAndBox = isShow => {
    // Toolbar的显示和隐藏
    if (this.isShow !== isShow) {
      isShow = isShow === undefined ? true : isShow
      Animated.timing(this.state.bottom, {
        toValue: isShow ? 0 : -screen.deviceHeight,
        duration: 300,
        useNativeDriver: false,
      }).start()
      this.isShow = isShow
    }
    // Box内容框的显示和隐藏
    // if (this.state.type === ConstToolType.SM_MAP_THEME_PARAM) {
    //   Animated.timing(this.state.boxHeight, {
    //     toValue: 0,
    //     duration: 300,
    //   }).start()
    //   this.isBoxShow = false
    // } else
    {
      if (JSON.stringify(this.state.boxHeight) !== this.height.toString()) {
        Animated.timing(this.state.boxHeight, {
          toValue: this.height,
          duration: 300,
          useNativeDriver: false,
        }).start()
      }
      this.isBoxShow = true
    }
  }
  /**
   * 设置是否显示
   * isShow: 是否显示
   * type:   显示数据类型
   * params: {
   *   isFullScreen:    是否全屏，
   *   height:          工具栏高度
   *   column:          表格列数（仅table可用）
   *   containerType:   容器的类型, list | table
   * }
   **/
  setVisible = async (isShow, type, params = {}) => {
    this.height =
      params && typeof params.height === 'number'
        ? params.height
        : ConstToolType.HEIGHT[1]
    let data = await this.getData(type)
    this.setState(
      {
        data: data,
        type: type,
        layerdata: params.layerdata,
        index: params.index,
      },
      () => {
        this.showToolbarAndBox(isShow)
        !isShow && this.props.existFullMap && this.props.existFullMap()
        this.updateOverlayView()
      },
    )
  }

  /**
   * 设置遮罩层的显隐
   * @param visible
   */
  setOverlayViewVisible = visible => {
    global.LayerManagerOverlayView &&
      global.LayerManagerOverlayView.setVisible(visible)
  }

  //更新遮盖层状态
  updateOverlayView = () => {
    this.setOverlayViewVisible(this.isShow)
  }

  listAction = ({ section }) => {
    if (section.action) {
      (async function() {
        await section.action()
        this.props.getLayers()
        this.setVisible(false)
      }.bind(this)())
      return
    }
    if (
      section.title === getLanguage(global.language).Map_Layer.BASEMAP_SWITH
    ) {
      //'切换底图') {
      this.setVisible(true, ConstToolType.SM_MAP3D_BASE, {
        height: ConstToolType.TOOLBAR_HEIGHT[5],
        type: ConstToolType.SM_MAP3D_BASE,
      })
    } else if (section.type && section.type === 'setLayerSelect') {
      //设置图层可选择
      let selectable = this.layer3dItem.selectable
      let canChoose = !selectable
      SScene.setSelectable(this.layer3dItem.name, canChoose).then(result => {
        let type = canChoose
          ? ConstToolType.SM_MAP3D_LAYER3D_DEFAULT_SELECTED
          : ConstToolType.SM_MAP3D_LAYER3D_DEFAULT
        this.setVisible(true, type, {
          height: ConstToolType.TOOLBAR_HEIGHT[1],
        })
        this.layer3dItem.selectable = canChoose
        //this.props.overlayView && this.props.overlayView.setVisible(false)
        if (result) {
          this.changeState(canChoose)
        }
      })
    } else if (section.type && section.type === 'scaleToLayer') {
      //缩放至当前图层
      this.setVisible(false)
      this.props.overlayView && this.props.overlayView.setVisible(false)
      SScene.ensureVisibleLayer(this.layer3dItem.name)
      this.props.navigation.navigate('Map3D')
    } else if (section.type && section.type === 'scaleToLayer') {
      //缩放至当前图层
      this.setVisible(false)
      this.props.overlayView && this.props.overlayView.setVisible(false)
      SScene.ensureVisibleLayer(this.layer3dItem.name)
      this.props.navigation.navigate('Map3D')
    } else if (section.type && section.type === 'AddTerrain') {
      //添加地形图层
      // this.setVisible(false)
      // this.props.overlayView && this.props.overlayView.setVisible(false)
      this.setVisible(true, 'AddTerrain_second', {
        height: ConstToolType.TOOLBAR_HEIGHT[5],
        type: 'AddTerrain_second',
      })
    } else if (section.type && section.type === 'AddImage') {
      //添加地形图层
      // this.setVisible(false)
      // this.props.overlayView && this.props.overlayView.setVisible(false)
      this.setVisible(true, 'AddImage_second', {
        height: ConstToolType.TOOLBAR_HEIGHT[5],
        type: 'AddImage_second',
      })
    } else if (section.type && section.type === 'AddTerrain_second') {
      //添加具体地形
      this.setVisible(false)
      this.props.overlayView && this.props.overlayView.setVisible(false)
      SScene.addTerrainCacheLayer(section.path, section.title).then(name => {
        if (name) {
          this.props.layer3dRefresh()
          SScene.ensureVisibleLayer(name)
        } else {
          Toast.show(getLanguage(global.language).Prompt.ADD_FAILED)
        }
      }).catch(() => {
        Toast.show(getLanguage(global.language).Prompt.ADD_FAILED)
      })
      this.props.navigation.navigate('Map3D')
    } else if (section.type && section.type === 'AddImage_second') {
      //添加具体影像
      this.setVisible(false)
      this.props.overlayView && this.props.overlayView.setVisible(false)
      SScene.addImageCacheLayer(section.path, section.title).then(name => {
        if (name) {
          this.props.layer3dRefresh()
          SScene.ensureVisibleLayer(name)
        } else {
          Toast.show(getLanguage(global.language).Prompt.ADD_FAILED)
        }
      }).catch(() => {
        Toast.show(getLanguage(global.language).Prompt.ADD_FAILED)
      })
      this.props.navigation.navigate('Map3D')
    } else if (section.type && section.type === 'RemoveLayer3d_image') {
      //删除影像图层
      this.setVisible(false)
      this.props.overlayView && this.props.overlayView.setVisible(false)
      SScene.removeImageCacheLayer(this.layer3dItem.name).then(value => {
        value && this.props.layer3dRefresh()
      })
    } else if (section.type && section.type === 'RemoveLayer3d_terrain') {
      //删除地形图层
      this.setVisible(false)
      this.props.overlayView && this.props.overlayView.setVisible(false)
      SScene.removeTerrainCacheLayer(this.layer3dItem.name).then(value => {
        value && this.props.layer3dRefresh()
      })
    } else if (section.type && section.type === 'AddBingmap') {
      //删除地形图层
      this.setVisible(false)
      this.props.overlayView && this.props.overlayView.setVisible(false)
      SScene.changeBaseLayer(2).then(value => {
        value && this.props.layer3dRefresh()
      })
    } else if (section.type && section.type === 'AddTianditu') {
      //删除地形图层
      this.setVisible(false)
      this.props.overlayView && this.props.overlayView.setVisible(false)
      SScene.changeBaseLayer(1).then(value => {
        value && this.props.layer3dRefresh()
      })
    }
  }

  getLayer3dItem = (layer3dItem, changeState = () => {}) => {
    this.layer3dItem = layer3dItem
    this.changeState = changeState
  }

  // getLayer3d = () => {
  //   return this.layer3dItem
  // }
  getoverlayView = () => {
    return this.props.overlayView
  }
  renderList = () => {
    if (this.state.data.length === 0) return
    return (
      <ToolBarSectionList
        sections={this.state.data}
        device={this.props.device}
        renderItem={this.renderItem}
        renderSectionHeader={this.renderHeader}
        // layerManager={true}
      />
    )
  }

  renderHeader = ({ section }) => {
    if (!section.header) {
      return <View style={{ height: 0 }} />
    }
    let thisHandle = this
    return (
      <View
        style={{
          height: scaleSize(80),
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: color.white,
        }}
      >
        <View
          style={{
            height: scaleSize(80),
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: color.white,
          }}
        >
          <Image
            source={section.header.image}
            style={{
              width: imgSize,
              height: imgSize,
              marginLeft: scaleSize(30),
            }}
          />
          <Text
            style={{
              fontSize: setSpText(28),
              color: color.themeText2,
              paddingLeft: scaleSize(30),
            }}
          >
            {section.header.title}
          </Text>
        </View>
        <TouchableOpacity
          style={{
            flex: 1,
            height: scaleSize(80),
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
          onPress={() => {
            this.props.navigation.navigate('InputPage', {
              headerTitle: getLanguage(global.language).Map_Layer.ADD_LAYER_URL,
              value: '',
              placeholder: section.header.type === 'Image'
                ? 'http://<service address>/rest/realspace/datas/layer'
                : 'http://<service address>/rest/realspace/datas/terrain',
              cb: async value => {
                let bRes = false
                let type = 'AddTerrain_second'
                if (section.header.type === 'Image') {
                  bRes = await SScene.setImageCacheName(value)
                  type = 'AddImage_second'
                } else if (section.header.type === 'Terrain') {
                  bRes = await SScene.setTerrainCacheName(value)
                }
                NavigationService.goBack()
                if (bRes) {
                  thisHandle.setVisible(true, type, {
                    height: ConstToolType.TOOLBAR_HEIGHT[5],
                    type: type,
                  })
                }
                // console.warn("add " + value)
              },
            })
          }}
        >
          <Image
            // source={require('../../../../assets/map/Frenchgrey/scene_addfly_light.png')}
            source={getThemeAssets().mapTools.icon_enlarge}
            style={{
              width: imgSize,
              height: imgSize,
              marginRight: scaleSize(15),
            }}
          />
        </TouchableOpacity>
      </View>
    )
  }
  renderItem = ({ item }) => {
    return (
      <View>
        <TouchableHighlight
          onPress={() => {
            this.listAction({ section: item })
          }}
          underlayColor={color.headerBackground}
        >
          <View
            style={{
              height: scaleSize(86),
              backgroundColor: color.content_white,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            {item.image && (
              <Image
                resizeMode={'contain'}
                style={{
                  marginLeft: scaleSize(60),
                  height: imgSize,
                  width: imgSize,
                }}
                source={item.image}
              />
            )}
            <Text
              style={{
                fontSize: setSpText(24),
                marginLeft: scaleSize(60),
                textAlign: 'center',
                backgroundColor: 'transparent',
              }}
            >
              {item.title}
            </Text>
          </View>
        </TouchableHighlight>
      </View>
    )
  }

  renderView = () => {
    let box
    // if(this.state.type === ConstToolType.SM_MAP3D_BASE){
    //   box = this.renderMap3DList()
    // }else
    {
      box = this.renderList()
    }
    return (
      <Animated.View style={{ height: this.state.boxHeight }}>
        {box}
      </Animated.View>
    )
  }

  render() {
    let containerStyle = styles.fullContainer
    return (
      <Animated.View
        style={[
          containerStyle,
          { height: this.props.device.height, bottom: this.state.bottom },
        ]}
      >
        {
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              this.setVisible(false)
              if (this.props.overlayView) {
                this.props.overlayView.setVisible(false)
              }
            }}
            style={styles.overlay}
          />
        }
        <View style={styles.containers}>{this.renderView()}</View>
        {/*{this.renderDialog()}*/}
      </Animated.View>
    )
  }
}
