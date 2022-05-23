import { SARMap, ARLayerType, ARElementLayer } from 'imobile_for_reactnative'
import React from 'react'
import { Container, ListSeparator, BackButton, InputDialog } from '../../components'
import { getLanguage } from '../../language'
import { Image, Text, TouchableOpacity, FlatList, StyleSheet, ListRenderItemInfo, View, Platform } from 'react-native'
import { scaleSize, Toast, DialogUtils } from '../../utils'
import { getThemeAssets } from '../../assets'
import { size, color } from '../../styles'
import { UserInfo } from '../../redux/models/user'
import { ARMapInfo } from '../../redux/models/arlayer'
import { ARMapState } from '../../redux/models/armap'
import { DEVICE } from '../../redux/models/device'
import ARLayerItem from './ARLayerItem'
import ToolbarModule from '../workspace/components/ToolBar/modules/ToolbarModule'
import { arDrawingModule, arEditModule } from '../workspace/components/ToolBar/modules'
import ARMapSettingItem from '../arLayerManager/ARMapSettingItem'
import { MapToolbar } from '../workspace/components'
import { ARLayer } from 'imobile_for_reactnative/types/interface/ar'
import NavigationService from '../NavigationService'
import ARLayerMenu from './ARLayerMenu'
import { ConstToolType } from '../../constants'

const styles = StyleSheet.create({
  headerBtnTitle: {
    fontSize: size.fontSize.fontSizeSm,
    marginTop: scaleSize(8),
  },
  headerBtnImage: {
    width: scaleSize(44),
    height: scaleSize(44),
  },
  separator: {
    marginLeft: scaleSize(30),
  },
  headerLeft: {
    flexDirection: 'row',
  },
  headerBack: {
    marginLeft: scaleSize(20),
  },
  headerArrowDown: {
    width: scaleSize(44),
    height: scaleSize(44),
  },
  headerLeftTitle: {
    fontSize: size.fontSize.fontSizeXXl,
    color: color.black,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#rgba(0, 0, 0, 0.3)',
  },
})

interface Props {
  language: string,
  currentUser: UserInfo,
  arlayer: ARMapInfo,
  armap: ARMapState,
  navigation: any,
  device: DEVICE,
  mapModules: {
    modules: any[],
    currentMapModule: number,
  },

  setCurrentARLayer: (layer?: ARLayer) => void,
  getARLayers: () => Promise<ARLayer[]>,
  createARMap: () => Promise<boolean>,
  saveARMap: (name?: string) => Promise<boolean>,
  closeARMap: () => Promise<boolean>,
}

interface State {
  menuVisible: boolean,
  selectLayer?: ARLayer,
  type: string,
}

interface Postion {
  x: number,
  y: number,
}

export default class ARLayerManager extends React.Component<Props, State> {
  inputDialog: InputDialog | undefined | null
  backPositon: Postion
  tabType: string

  // 记录最后一个特效图层的索引
  lastEffectlayerIndex: number
  // 记录当前图层的索引
  curLayerIndex: number

  constructor(props: Props) {
    super(props)

    const { params } = props.navigation.state
    this.state = {
      menuVisible: false,
      type: (params && params.type) || GLOBAL.Type, // 底部Tabbar类型
    }
    this.backPositon = {x:0, y: 0}
    // 获取由添加页面过来的tab的索引
    this.tabType = params && params?.tabType

    // 记录最后一个特效图层的索引，设置初始值为 -1
    this.lastEffectlayerIndex = -1
    // 记录当前图层的索引，设置初始值为 -1
    this.curLayerIndex = -1
  }

  async componentDidMount() {
    this._getLayer()

    if(!this.props.arlayer.layers) return
    // 在此处加过滤条件
    const layers = this.props.arlayer.layers
    const length = layers.length
    const type: string | undefined = this.tabType

    // 图层类型分类数组
    const allTypes = [
      [ARLayerType.AR_MEDIA_LAYER], // poi 0 [105]
      [ARLayerType.AR_TEXT_LAYER, ARLayerType.AR_POINT_LAYER, ARLayerType.AR_LINE_LAYER, ARLayerType.AR_REGION_LAYER], // 矢量 1  [101, 100, 301, 302]
      [ARLayerType.AR3D_LAYER, ARLayerType.AR_SCENE_LAYER], // 三维 2  [3, 4]
      [ARLayerType.AR_MODEL_LAYER], // 模型 3  [106]
      [ARLayerType.EFFECT_LAYER], // 特效 4  [2]
      // [ARLayerType.AR_WIDGET_LAYER], // 小组件 5 [107]
    ]
    if(type){
      // 当类型为有值的情况下，一定是一个数字的字符串
      const typeIndex = parseInt(type)
      for(let i = 0; i < length; i ++){
        // 判断该图层的类型是否属于要过滤的类型 false表示不显示的 true表示显示的
        let isFilter = false
        allTypes[typeIndex].map(item => {
          if(item === layers[i].type) {
            isFilter = true
          }
        } )
        if(isFilter){
          // newLayers.push(layers[i])
          this.props.setCurrentARLayer(layers[i])
        }
      }
    }


    this.lastEffectlayerIndex = await this.getLastEffectLayerIndex()
    // this.curLayerIndex = await this.getLayerIndex()

  }

  /** 获取最后一个特效图层索引值 */
  getLastEffectLayerIndex = async ():Promise<number> => {
    if(!this.props.arlayer.layers) return -1
    // 在此处加过滤条件
    const layers = this.props.arlayer.layers
    let lastEffectlayerIndex = 0
    const layersLength = layers.length
    for(let i = 0; i < layersLength; i++){
      if(layers[i].type === ARLayerType.EFFECT_LAYER){
        lastEffectlayerIndex = i
      }
    }
    return lastEffectlayerIndex
  }

  /** 获取当前图层索引值 */
  getLayerIndex = async (layer: ARElementLayer):Promise<number> => {
    if(!this.props.arlayer.layers) return -1
    // 在此处加过滤条件
    const layers = this.props.arlayer.layers
    let curLayerIndex = -1
    layers.map((item: ARElementLayer, index: number) => {
      if(item.name === layer?.name){
        curLayerIndex = index
      }
    })
    return curLayerIndex
  }

  async componentDidUpdate(){
    this._getLayer()
    this.lastEffectlayerIndex = await this.getLastEffectLayerIndex()
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    return (
      this.props.language !== nextProps.language ||
      JSON.stringify(this.props.currentUser) !== JSON.stringify(nextProps.currentUser) ||
      JSON.stringify(this.props.arlayer) !== JSON.stringify(nextProps.arlayer) ||
      JSON.stringify(this.props.armap) !== JSON.stringify(nextProps.armap) ||
      JSON.stringify(this.props.device.orientation) !== JSON.stringify(nextProps.device.orientation) ||
      JSON.stringify(this.state) !== JSON.stringify(nextState)
    )
  }

  _getMenuData = () => {
    let menuData = [{
      title: '',
      data: [
        // {
        //   title: getLanguage(GLOBAL.language).Map_Layer.LAYERS_LAYER_STYLE,
        //   image: getThemeAssets().layer.icon_layer_style,
        //   action: async () => {
        //     if (this.props.arlayer.currentLayer) {
        //       const _params: any = ToolbarModule.getParams()
        //       _params.setToolbarVisible(true, ConstToolType.SM_AR_DRAWING_STYLE, {
        //         isFullScreen: true,
        //         showMenuDialog: true,
        //       })
        //       NavigationService.goBack('ARLayerManager', null)
        //     }
        //   },
        // },
        {
          title: getLanguage(GLOBAL.language).Map_Layer.LAYERS_RENAME,
          image: getThemeAssets().layer.icon_layer_rename02,
          action: async () => {
            let layer = this.state.selectLayer
            // if (this.props.arlayer.currentLayer) {
            if (layer) {
              DialogUtils.showInputDailog({
                // value: this.props.arlayer.currentLayer.caption,
                value: layer.caption,
                confirmAction: async (name: string) => {
                  if (layer) {
                    await SARMap.setLayerCaption(layer.name, name)
                    await this.props.getARLayers()
                    DialogUtils.hideInputDailog()
                    this.setState({
                      menuVisible: false,
                    })
                  }
                },
              })
            }
          },
        },
        {
          title: getLanguage(GLOBAL.language).Map_Layer.LAYERS_REMOVE,
          image: getThemeAssets().layer.icon_tool_delete,
          action: async () => {
            GLOBAL.SimpleDialog.set({
              text: getLanguage(GLOBAL.language).Prompt.DELETE_LAYER,
              confirmText: getLanguage(GLOBAL.language).Prompt.DELETE,
              cancelText: getLanguage(GLOBAL.language).Prompt.CANCEL,
              confirmAction: async () => {
                if (this.state.selectLayer) {
                  await SARMap.removeARLayer(this.state.selectLayer.name)
                  this.props.setCurrentARLayer()
                  await this.props.getARLayers()
                  this.setState({
                    menuVisible: false,
                  })
                }
              },
            })
            GLOBAL.SimpleDialog.setVisible(true)
          },
        },
      ],
    }]

    // 特效图层下移
    if(this.state.selectLayer && "secondsToPlay" in this.state.selectLayer) {
      menuData[0].data.unshift({
        title: getLanguage().Map_Layer.LAYERS_MOVE_DOWN,
        image: getThemeAssets().layer.icon_edit_movedown,
        action: async () => {

          if(Platform.OS === 'android') {
            const isMoveup = await SARMap.moveLayerDown(this.state.selectLayer.name)
            if(isMoveup) {
              // 更新页面数据
              await this._getLayer()
              Toast.show(getLanguage().Map_Layer.LAYER_MOVEDOWN_SUCCESS)
            } else {
              this.curLayerIndex = await this.getLayerIndex(this.state.selectLayer)
              if(this.curLayerIndex !== this.lastEffectlayerIndex){
                Toast.show(getLanguage().Map_Layer.LAYER_MOVEDOWN_FAIL)
              } else {
                // 最后一个特效图层不能下移
                Toast.show(getLanguage().Map_Layer.LAST_EFFECT_LAYER_NOT_MOVEDOWN)
              }
            }
          } else {
            // IOS TODO
          }
          // 隐藏菜单列表
          this.setState({
            menuVisible: false,
          })


        },
      })
    }

    // 特效图层上移
    if(this.state.selectLayer && "secondsToPlay" in this.state.selectLayer) {
      menuData[0].data.unshift({
        title: getLanguage().Map_Layer.LAYERS_MOVE_UP,
        image: getThemeAssets().layer.icon_edit_moveup,
        action: async () => {
          if(Platform.OS === 'android') {
            const isMoveup = await SARMap.moveLayerUp(this.state.selectLayer.name)
            if(isMoveup) {
              // 更新页面数据
              await this._getLayer()
              Toast.show(getLanguage().Map_Layer.LAYER_MOVEUP_SUCCESS)
            } else {
              this.curLayerIndex = await this.getLayerIndex(this.state.selectLayer)
              if(this.curLayerIndex !== 0){
                Toast.show(getLanguage().Map_Layer.LAYER_MOVEUP_FAIL)
              } else {
                // 第一个特效图层不能上移
                Toast.show(getLanguage().Map_Layer.FIRST_EFFECT_LAYER_NOT_MOVEUP)
              }
            }
          } else {
            // IOS TODO
          }
          // 隐藏菜单列表
          this.setState({
            menuVisible: false,
          })

        },
      })
    }


    //ARElementLayer添加可见范围
    if(this.state.selectLayer && 'maxVisibleBounds' in this.state.selectLayer) {
      if('maxAnimationBounds' in this.state.selectLayer) {
        // 非特效图层的可见距离的设置
        menuData[0].data.unshift({
          title: getLanguage().Map_Layer.LAYERS_VISIBLE_DISTANCE,
          image: getThemeAssets().layer.icon_visible_distance,
          action: async () => {
            console.warn("点击了非特效图层的可见距离设置按钮")

            let layer = this.state.selectLayer
            if (layer && 'maxVisibleBounds' in layer) {
              const _params: any = ToolbarModule.getParams()
              arEditModule().setModuleData()
              _params.showFullMap(true)
              // 将类型换成特效图层的
              _params.setToolbarVisible(true, ConstToolType.SM_AR_EDIT_LAYER_VISIBLE_BOUNDS, {
                isTouchProgress: true,
                showMenuDialog: false,
                isFullScreen: true,
              })
              ToolbarModule.addData({selectARElementLayer: layer, ARElementLayerVisibleBounds: layer.maxVisibleBounds})
              NavigationService.goBack()
            }
          },
        })
      } else if("secondsToPlay" in this.state.selectLayer) {
        // 特效图层的可见距离的设置
        menuData[0].data.unshift({
          title: getLanguage().Map_Layer.LAYERS_VISIBLE_DISTANCE,
          image: getThemeAssets().layer.icon_visible_distance,
          action: async () => {
            console.warn("点击了特效图层的可见距离设置按钮")

            let layer = this.state.selectLayer

            if (layer && 'maxVisibleBounds' in layer) {
              // 获取参数对象
              const _params: any = ToolbarModule.getParams()
              // 存放数据到ToolBarModule
              arEditModule().setModuleData()
              _params.showFullMap(true)
              // 设置工具栏是否可见
              _params.setToolbarVisible(true, ConstToolType.SM_AR_EDIT_EFFECT_LAYER_VISIBLE_BOUNDS, {
                isTouchProgress: true,
                showMenuDialog: false,
                isFullScreen: true,
              })
              // 禁止左右拖动滑块的时候出现上下位移而调用dialog框
              GLOBAL.isEffectProgress = true
              ToolbarModule.addData({selectAREffectLayer: layer, ARElementLayerVisibleBounds: layer.maxVisibleBounds, AREffectLayerVisibleBounds: layer.maxVisibleBounds})
              NavigationService.goBack()
            }
          },
        })
      }

    }

    // 特效图层可持续时间
    if(this.state.selectLayer && "secondsToPlay" in this.state.selectLayer) {
      menuData[0].data.unshift({
        title: getLanguage().Map_Layer.LAYERS_SECONDS_TO_PLAY,
        image: getThemeAssets().layer.icon_tool_duration,
        action: async () => {
          let layer = this.state.selectLayer

          if("secondsToPlay" in this.state.selectLayer){
            // 获取参数对象
            const _params: any = ToolbarModule.getParams()
            // 存放数据到ToolBarModule
            arEditModule().setModuleData()
            _params.showFullMap(true)
            // 设置工具栏是否可见
            _params.setToolbarVisible(true, ConstToolType.SM_AR_EDIT_EFFECT_LAYER_SECONDS_TO_PLAY, {
              isTouchProgress: true,
              showMenuDialog: false,
              isFullScreen: true,
            })
            // 禁止左右拖动滑块的时候出现上下位移而调用dialog框
            GLOBAL.isEffectProgress = true
            ToolbarModule.addData({selectAREffectLayer: layer, AREffectLayerSecondsToPlay: layer?.secondsToPlay })
            NavigationService.goBack()

          }

        },
      })
    }


    // 三维图层编辑功能
    if (
      this.state.selectLayer?.type === ARLayerType.AR3D_LAYER ||
      this.state.selectLayer?.type === ARLayerType.AR_SCENE_LAYER
    ) {
      menuData[0].data.unshift({
        title: getLanguage(GLOBAL.language).Map_Main_Menu.EDIT,
        image: getThemeAssets().functionBar.icon_tool_edit,
        action: async () => {
          if (this.props.arlayer.currentLayer?.name !== this.state.selectLayer?.name) {
            await this.props.setCurrentARLayer(this.state.selectLayer)
          }
          arEditModule().action()
          NavigationService.navigate('MapView')
        },
      })
    }
    return menuData
  }

  _getLayer = async () => {
    try {
      await this.props.getARLayers()
    } catch (error) {
      Toast.show(error)
    }
  }

  _renderLayers = () => {
    if(!this.props.arlayer.layers) return null
    const type: string | undefined = this.tabType

    return (
      <ARLayers
        layers={this.props.arlayer.layers}
        type = {type}
        currentLayer={this.props.arlayer.currentLayer}
        setCurrentARLayer={this.props.setCurrentARLayer}
        onPress={layer => {
          this.props.setCurrentARLayer(layer)
        }}
        onPressMore={layer => {
          // this.props.setCurrentARLayer(layer)
          this.setState({
            menuVisible: true,
            selectLayer: layer,
          })
        }}
        getARLayers={this.props.getARLayers}
      />
    )
  }

  _renderHeaderLeft = () => {
    let mapName = getLanguage().ARMap.OPEN_MAP
    if(this.props.armap.currentMap) {
      if(this.props.armap.currentMap?.mapName) {
        mapName = this.props.armap.currentMap.mapName
      } else {
        mapName = getLanguage().ARMap.UNTITLED_MAP
      }
    }
    return (
      <View style={styles.headerLeft}>
        <BackButton
          // style={styles.headerBack}
          onPress={() => {
            this.props.navigation.goBack()
          }}
        />
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
          onPress={()=>{
            this.props.navigation.navigate('MyARMap', {
              showMode: 'tap',
            })
          }}
        >
          <Text
            style={styles.headerLeftTitle}
            numberOfLines={1}
          >
            {mapName}
          </Text>
          <Image
            source={getThemeAssets().publicAssets.icon_drop_down}
            style={styles.headerArrowDown}
          />
        </TouchableOpacity>
      </View>
    )
  }

  _renderHeaderRightBtn = (item: {
    image: any,
    title: string,
    action: (params?: any) => void,
  }) => {
    return (
      <TouchableOpacity
        key={item.title}
        style={{
          marginHorizontal: scaleSize(20),
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onPress={() => {
          item.action && item.action()
        }}
      >
        <Image
          source={item.image}
          style={styles.headerBtnImage}
        />
        <Text style={styles.headerBtnTitle}>{item.title}</Text>
      </TouchableOpacity>
    )
  }

  _renderHeaderRight = () => {
    if (!this.props.armap.currentMap?.mapName && !this.props.arlayer.layers?.length) return null
    return [
      // this._renderHeaderRightBtn({
      //   image: getThemeAssets().publicAssets.icon_cancel,
      //   title: getLanguage().ARMap.CLOSE_MAP,
      //   action: async () => {
      //     await this.props.closeARMap()
      //     await this.props.getARLayers()
      //   },
      // }),
      this._renderHeaderRightBtn({
        image: getThemeAssets().layer.icon_add_layer,
        title: getLanguage().ARMap.ADD_LAYER,
        action: () => {
          this.props.navigation.navigate('MapView')
          arDrawingModule().action()
          // 点击新建图层，将特效图层是否正在添加中的标识设置为false，即添加完成
          GLOBAL.isNotEndAddEffect = false
          let type = this.tabType
          if(!type) {
            type = "0"
          }
          ToolbarModule.addData({
            addNewDsetWhenCreate: true,
            moduleIndex: Number(type),
          })
        },
      }),
      // this._renderHeaderRightBtn({
      //   image: getThemeAssets().start.icon_save,
      //   title: getLanguage().ARMap.SAVE,
      //   action: () => {
      //     this.inputDialog && this.inputDialog.setDialogVisible(true)
      //   },
      // }),
    ]
  }
  /** 返回按钮执行的方法 */
  _back = () => {
    this.props.navigation.navigate('MapView')
    arDrawingModule().action()
    let type = this.tabType
    if(!type) {
      type = "0"
    }
    ToolbarModule.addData({
      moduleIndex: Number(type),
    })

  }

  _renderInputDialog = () => {
    return (
      <InputDialog
        ref={ref => (this.inputDialog = ref)}
        title={getLanguage(GLOBAL.language).Map_Main_Menu.START_SAVE_MAP}
        placeholder={getLanguage(GLOBAL.language).Profile.MAP_NAME}
        confirmAction={value => {
          this.props.saveARMap(value)
          this.inputDialog?.setDialogVisible(false)
        }}
        confirmBtnTitle={getLanguage(GLOBAL.language).Prompt.SAVE_YES}
        cancelBtnTitle={getLanguage(GLOBAL.language).Prompt.CANCEL}
      />
    )
  }

  _renderListItem = ({ item }: any) => {
    return (
      <ARMapSettingItem
        data={item}
      />
    )
  }

  _renderList = () => {
    if (!this.state.selectLayer || !this.state.menuVisible || this._getMenuData().length === 0) return
    return (
      <>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            this.setState({
              menuVisible: false,
            })
          }}
          style={styles.overlay}
        />
        <ARLayerMenu
          sections={this._getMenuData()}
          device={this.props.device}
          renderItem={this._renderListItem}
          layer={this.state.selectLayer}
          getLayer={this._getLayer}
        />
      </>
    )
  }

  renderToolBar = () => {
    return (
      <MapToolbar
        navigation={this.props.navigation}
        type={this.state.type}
        initIndex={1}
        mapModules={this.props.mapModules}
        ARView={true}
      />
    )
  }

  render() {
    return(
      <Container
        ref={ref => (this.container = ref)}
        headerProps={{
          title: this.props.mapModules.modules[
            this.props.mapModules.currentMapModule
          ].chunk.title,
          navigation: this.props.navigation,
          withoutBack: !this.tabType,
          // headerLeft: this._renderHeaderLeft(),
          headerRight: this._renderHeaderRight(),
          headerTitleViewStyle: {
            justifyContent: 'flex-start',
            marginLeft: scaleSize(90),
          },
          backBtnType: 'gray',
          backAction: this._back,
        }}
        bottomBar={!this.tabType && this.renderToolBar()}
      >
        {this._renderLayers()}
        {this._renderInputDialog()}
        {this._renderList()}
      </Container>
    )
  }
}
interface ARLayersProps {
  layers: ARLayer[],
  currentLayer?: ARLayer,
  setCurrentARLayer: (layer?: ARLayer) => void,
  onPress: (layer: ARLayer) => void,
  onPressMore: (layer: ARLayer) => void,
  getARLayers: () => Promise<ARLayer[]>,
  type: string | undefined,
}

export class ARLayers extends React.Component<ARLayersProps> {

  _renderLayerItem = ({item}: ListRenderItemInfo<ARLayer>) => {
    return (
      <ARLayerItem
        layer={item}
        type={this.props.type}
        currentLayer={this.props.currentLayer}
        onPress={layer => {
          this.props.onPress(layer)
        }}
        onPressMore={layer => {
          this.props.onPressMore(layer)
        }}
        setCurrentARLayer={this.props.setCurrentARLayer}
        getARLayers={this.props.getARLayers}
      />)
  }

  _renderSeperator = () => {
    return <ListSeparator color={color.bgW2} style={styles.separator} />
  }

  render() {
    if(!this.props.layers) return null
    return (
      <FlatList
        data={this.props.layers}
        renderItem={this._renderLayerItem}
        keyExtractor={item => item.name}
        ItemSeparatorComponent={this._renderSeperator}
      />
    )
  }
}