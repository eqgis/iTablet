/*
  Copyright © SuperMap. All rights reserved.
  Author: Wang zihao
  E-mail: zihaowang5325@qq.com
*/
/* global GLOBAL */
import * as React from 'react'
import { TouchableOpacity, Text, SectionList, View, Image } from 'react-native'
import { Container, MTBtn, Dialog } from '../../components'
import { Toast, scaleSize, LayerUtils } from '../../utils'
import { MapToolbar, OverlayView } from '../workspace/components'
import {
  SMap,
  ThemeType,
  SMediaCollector,
  DatasetType,
} from 'imobile_for_reactnative'
import { LayerManager_item, LayerManager_tolbar } from './components'
import {
  ConstToolType,
  ConstPath,
  ConstOnline,
  UserType,
  ChunkType,
} from '../../constants'
import { color } from '../../styles'
import {
  getPublicAssets,
  getThemeAssets,
  getLayerIconByType,
  getThemeIconByType,
} from '../../assets'
import { FileTools } from '../../native'
import {
  themeModule,
  styleModule,
  layerSettingImageModule,
} from '../workspace/components/ToolBar/modules'
import NavigationService from '../../containers/NavigationService'
import { getLanguage } from '../../language'
import styles from './styles'
import { getXmlTemplateData } from './components/LayerManager_tolbar/LayerToolbarData'
export default class MT_layerManager extends React.Component {
  props: {
    language: string,
    navigation: Object,
    editLayer: Object,
    map: Object,
    collection: Object,
    layers: Object,
    setEditLayer: () => {},
    setCurrentLayer: () => {},
    getLayers: () => {},
    closeMap: () => {},
    clearAttributeHistory: () => {},
    device: Object,
    currentLayer: Object,
    setMapLegend: () => {},
    setBackAction: () => {},
    removeBackAction: () => {},
    mapToXml: () => {},
    mapFromXml: () => {},
    user: Object,
    baseMaps: Object,
    appConfig: Object,
    mapModules: Object,
  }

  constructor(props) {
    super(props)
    const { params } = props.navigation.state
    this.curUserBaseMaps = this.props.baseMaps[
      this.props.user.currentUser.userId
    ]
    if (!this.curUserBaseMaps) {
      this.curUserBaseMaps = this.props.baseMaps['default'] || []
    }

    let userAddBase = []
    for (let i = 0, n = this.curUserBaseMaps.length; i < n; i++) {
      if (this.curUserBaseMaps[i].userAdd) {
        userAddBase.push(this.curUserBaseMaps[i].layerName)
      }
    }
    LayerUtils.setBaseMap(userAddBase)
    this.state = {
      // datasourceList: [],
      mapName: '',
      refreshing: false,
      currentOpenItemName: '', // 记录左滑的图层的名称
      data: [],
      type: (params && params.type) || GLOBAL.Type, // 底部Tabbar类型
      allLayersVisible: false,
      isOutput: true, // 点击了输出/加载按钮，用于判断dialog行为
    }
    this.itemRefs = {} // 记录列表items
    this.currentItemRef = {} // 当前被选中的item
    this.prevItemRef = {} // 上一个被选中的item
    this.dialog = undefined
  }

  componentDidUpdate(prevProps) {
    if (
      JSON.stringify(prevProps.layers) !== JSON.stringify(this.props.layers)
    ) {
      this.getData()
    }
  }

  componentDidMount() {
    this.getData()
  }

  setRefreshing = refreshing => {
    if (refreshing === this.state.refreshing) return
    this.setState({
      refreshing: refreshing,
    })
  }

  getData = async () => {
    // this.container.setLoading(true)
    try {
      this.itemRefs = {}
      let allLayers = await this.props.getLayers()

      let baseMap = []
      if (
        allLayers.length > 0 ||
        (allLayers.length === 0 && GLOBAL.Type === ChunkType.MAP_ANALYST)
      ) {
        if (
          (allLayers.length > 0 &&
            !LayerUtils.isBaseLayer(allLayers[allLayers.length - 1])) ||
          (allLayers.length === 0 && GLOBAL.Type === ChunkType.MAP_ANALYST)
        ) {
          baseMap = [
            {
              caption: 'baseMap',
              datasetName: '',
              name: 'baseMap',
              path: '',
              themeType: 0,
              type: 81,
            },
          ]
        } else if (allLayers.length > 0) {
          baseMap = allLayers.filter(layer => {
            return LayerUtils.isBaseLayer(layer)
          })
          allLayers = allLayers.filter(layer => {
            return !LayerUtils.isBaseLayer(layer)
          })
        }
      } else if (allLayers.length === 0) {
        await SMap.openDatasource(
          ConstOnline.Google.DSParams,
          GLOBAL.Type === ChunkType.MAP_COLLECTION
            ? 1
            : ConstOnline.Google.layerIndex,
          false,
          false, // 分析模块下，显示地图
        )
        allLayers = await this.props.getLayers()
        baseMap = allLayers.length > 0 ? [allLayers[allLayers.length - 1]] : []
      }

      //baseMap只显示一个，其他的放到subLayers内，删除和显示隐藏时用
      if (baseMap.length > 1) {
        let subLayers = []
        for (let i = 1; i < baseMap.length; i++) {
          subLayers.push(baseMap[i])
        }
        baseMap[0].subLayers = subLayers
        baseMap.splice(1)
      }

      let taggingLayers = [] // 标注图层
      let layers = [] // 我的图层
      // 加载标注图层后，标注图层会添加到地图中，getLayers获取的图层包含普通图层和标注图层
      for (let i = 0; i < allLayers.length; i++) {
        if (LayerUtils.getLayerType(allLayers[i]) === 'TAGGINGLAYER') {
          taggingLayers.unshift(allLayers[i])
        } else {
          layers.push(allLayers[i])
        }
      }

      // 若无标注图层，则去加载
      if (taggingLayers.length === 0) {
        taggingLayers = await SMap.getTaggingLayers(
          this.props.user.currentUser.userName,
        )
      }
      if (this.props.currentLayer.name) {
        this.prevItemRef = this.currentItemRef
        this.currentItemRef =
          this.itemRefs && this.itemRefs[this.props.currentLayer.name]
      }
      this.setState({
        data: [
          {
            title: getLanguage(this.props.language).Map_Layer.PLOTS,
            //'我的标注',
            data: taggingLayers,
            visible:
              this.state.data.length === 3 ? this.state.data[0].visible : true,
          },
          {
            title: getLanguage(this.props.language).Map_Layer.LAYERS,
            //'我的图层',
            data: layers,
            visible:
              this.state.data.length === 3 ? this.state.data[1].visible : true,
          },
          {
            title: getLanguage(this.props.language).Map_Layer.BASEMAP,
            // '我的底图',
            data: baseMap,
            visible:
              this.state.data.length === 3 ? this.state.data[2].visible : true,
          },
        ],
        refreshing: false,
        allLayersVisible: this.isAllLayersVisible(layers),
      })
      // let mapName = await this.map.getName()
    } catch (e) {
      this.setRefreshing(false)
    }
  }

  getItemLayout = (data, index) => {
    return {
      length: scaleSize(80),
      offset: scaleSize(80 + 1) * index,
      index,
    }
  }

  onAllPressRow = async ({ data, parentData, section }) => {
    if (!data.isVisible) {
      Toast.show(getLanguage(this.props.language).Prompt.INVISIBLE_LAYER_CAN_NOT_BE_SET_CURRENT)
      return
    }
    // 之前点击的图层组中的某一项
    this.prevItemRef = this.currentItemRef
    let prevParentData =
      this.prevItemRef &&
      this.prevItemRef.props &&
      this.prevItemRef.props.parentData
    this.currentItemRef = this.itemRefs && this.itemRefs[data.name]
    if (
      data.type === DatasetType.IMAGE ||
      data.type === DatasetType.MBImage
    ) {
      // 影像图层不能被设为当前图层
      return
    }
    if (this.props.currentLayer.name === data.name) {
      this.props.setCurrentLayer &&
        this.props.setCurrentLayer(null, () => {
          // 取消当前地图，清除历史记录
          this.props.clearAttributeHistory && this.props.clearAttributeHistory()
        })
    } else {
      if (!data.isVisible) return
      this.props.setCurrentLayer &&
        this.props.setCurrentLayer(data, () => {
          // 切换图层，清除历史记录
          if (
            JSON.stringify(this.props.currentLayer) !==
            JSON.stringify(data.name)
          ) {
            this.props.clearAttributeHistory &&
              this.props.clearAttributeHistory()
          }
        })
      if (parentData) {
        this.getChildList({ data: parentData, section }).then(children => {
          this.itemRefs[parentData.name] &&
            this.itemRefs[parentData.name].setChildrenList(children)
        })
      }
      // 若两次选中的item不再同一个图层组中
      if (
        prevParentData &&
        (!parentData || parentData.name !== prevParentData.name)
      ) {
        this.getChildList({ data: prevParentData, section }).then(children => {
          this.itemRefs[prevParentData.name] &&
            this.itemRefs[prevParentData.name].setChildrenList(children)
        })
      }
    }
  }

  onThisPress = async ({ data }) => {
    // 之前点击的图层组中的某一项
    this.prevItemRef = this.currentItemRef
    this.currentItemRef = this.itemRefs && this.itemRefs[data.name]
  }

  updateTagging = async () => {
    // this.setRefreshing(true)
    let dataList = await SMap.getTaggingLayers(
      this.props.user.currentUser.userName,
    )
    for (let item of dataList) {
      if (item.isVisible) {
        // 显示多媒体callouts
        SMediaCollector.showMedia(item.name)
      }
    }
    let data = [...this.state.data]
    data[0] = {
      title: getLanguage(this.props.language).Map_Layer.PLOTS,
      //'我的标注',
      data: dataList,
      visible: true,
    }
    this.setState({ data })
    // this.getData()
  }

  onPressRow = async ({ data, parentData, section }) => {
    // 防止点击图层图标把底图设置为当前图层
    const isBaseMap = (data.type === DatasetType.IMAGE || data.type === DatasetType.MBImage)
    // this.props.setMapLegend(false)
    if (GLOBAL.Type === ChunkType.MAP_EDIT) return
    !isBaseMap && this.props.setCurrentLayer &&
      this.props.setCurrentLayer(data, () => {
        // 切换地图，清除历史记录
        if (
          JSON.stringify(this.props.currentLayer) !== JSON.stringify(data.name)
        ) {
          this.props.clearAttributeHistory && this.props.clearAttributeHistory()
        }
        if (
          GLOBAL.Type !== ChunkType.MAP_EDIT &&
          GLOBAL.Type !== ChunkType.MAP_THEME &&
          GLOBAL.Type !== ChunkType.MAP_ANALYST
        ) {
          return
        }

        if (
          data.type === DatasetType.IMAGE ||
          data.type === DatasetType.MBImage
        ) {
          layerSettingImageModule().actions.showSetting(true)
        } else if (data.themeType <= 0 && !data.isHeatmap) {
          // this.mapEdit(data)
          styleModule().actions.layerListAction &&
            styleModule().actions.layerListAction(data)
        } else if (GLOBAL.Type === ChunkType.MAP_THEME) {
          // this.mapTheme(data)
          themeModule().actions.layerListAction &&
            themeModule().actions.layerListAction(data)
        } else {
          Toast.show(
            getLanguage(this.props.language).Prompt
              .THE_CURRENT_LAYER_CANNOT_BE_STYLED,
          )
        }
      })
    this.prevItemRef = this.currentItemRef
    let prevParentData =
      this.prevItemRef &&
      this.prevItemRef.props &&
      this.prevItemRef.props.parentData
    this.currentItemRef = this.itemRefs && this.itemRefs[data.name]
    if (parentData) {
      this.getChildList({ data: parentData, section }).then(children => {
        this.itemRefs[parentData.name] &&
          this.itemRefs[parentData.name].setChildrenList(children)
      })
    }
    // 若两次选中的item不再同一个图层组中
    if (
      prevParentData &&
      (!parentData || parentData.name !== prevParentData.name)
    ) {
      this.getChildList({ data: prevParentData, section }).then(children => {
        this.itemRefs[prevParentData.name] &&
          this.itemRefs[prevParentData.name].setChildrenList(children)
      })
    }
  }

  onToolBasePress = async ({ data, section }) => {
    this.toolBox.setVisible(true, ConstToolType.SM_MAP_LAYER_BASE_DEFAULT, {
      height: ConstToolType.TOOLBAR_HEIGHT[1],
      layerData: data,
      section: section,
      resetToolModuleData: true,
    })
  }

  taggingTool = async ({ data, index }) => {
    this.toolBox.setVisible(true, ConstToolType.SM_MAP_EDIT_TAGGING, {
      height: ConstToolType.TOOLBAR_HEIGHT[0],
      layerData: data,
      index: index,
      resetToolModuleData: true,
    })
  }

  onToolPress = async ({ data, parentData, section }) => {
    // let isGroup = data.type === 'layerGroup'
    let refreshParentList = async () => {
      let prevParentData =
        this.prevItemRef &&
        this.prevItemRef.props &&
        this.prevItemRef.props.parentData
      if (prevParentData || parentData) {
        let parent = prevParentData || parentData
        let children = await this.getChildList({ data: parent, section })
        this.itemRefs[parent.name] &&
          this.itemRefs[parent.name].setChildrenList(children)
      }
    }
    if (GLOBAL.Type === ChunkType.MAP_THEME) {
      let themeType
      switch (data.themeType) {
        case ThemeType.UNIQUE:
        case ThemeType.RANGE:
        case ThemeType.LABEL:
        case ThemeType.LABELUNIQUE:
        case ThemeType.LABELRANGE:
        case ThemeType.GRAPH:
        case ThemeType.GRADUATEDSYMBOL:
        case ThemeType.DOTDENSITY:
        case ThemeType.GRIDUNIQUE:
        case ThemeType.GRIDRANGE:
          themeType = ConstToolType.SM_MAP_LAYER_THEME_MODIFY
          break
        default:
          themeType = ConstToolType.SM_MAP_LAYER_THEME_CREATE
          break
      }
      if (data.isHeatmap) {
        themeType = ConstToolType.SM_MAP_LAYER_THEME_MODIFY
      }
      this.toolBox.setVisible(true, themeType, {
        layerData: data,
        refreshParentList: refreshParentList,
        resetToolModuleData: true,
      })
    } else if (
      GLOBAL.Type === ChunkType.MAP_EDIT ||
      GLOBAL.Type === ChunkType.MAP_ANALYST
    ) {
      this.toolBox.setVisible(true, ConstToolType.SM_MAP_STYLE, {
        layerData: data,
        refreshParentList: refreshParentList,
        resetToolModuleData: true,
      })
    } else if (
      GLOBAL.Type === ChunkType.MAP_PLOTTING &&
      data.name.substring(0, 9) === 'PlotEdit_'
    ) {
      this.toolBox.setVisible(true, ConstToolType.SM_MAP_PLOT, {
        layerData: data,
        refreshParentList: refreshParentList,
        resetToolModuleData: true,
      })
    } else if (GLOBAL.Type === ChunkType.MAP_NAVIGATION) {
      this.toolBox.setVisible(true, ConstToolType.SM_MAP_LAYER_NAVIGATION, {
        layerData: data,
        refreshParentList: refreshParentList,
        resetToolModuleData: true,
      })
    } else {
      this.toolBox.setVisible(true, ConstToolType.SM_MAP_COLLECTION, {
        layerData: data,
        refreshParentList: refreshParentList,
        resetToolModuleData: true,
      })
    }
  }

  getChildList = async ({ data, section }) => {
    try {
      if (data.type !== 'layerGroup') return
      // this.container.setLoading(true)
      let layers = await SMap.getLayersByGroupPath(data.path)
      let child = []
      for (let i = 0; i < layers.length; i++) {
        child.push(
          this._renderItem({ item: layers[i], section, parentData: data }),
        )
      }
      // this.container.setLoading(false)
      return child
    } catch (e) {
      // this.container.setLoading(false)
      Toast.show(getLanguage(this.props.language).Prompt.GET_LAYER_GROUP_FAILD)
      //'获取失败')
      return []
    }
  }

  setLayerVisible = async (data, value, section) => {
    let layers = section.data
    // let layers = this.state.data[1].data
    // let backMaps = this.state.data[2].data
    // let Label = this.state.data[0].data
    // let hasDeal = false
    let name = data.name
    let curData = JSON.parse(JSON.stringify(this.state.data))
    let sectionIndex = 0
    for (let i = 0; i < curData.length; i++) {
      if (section.title === curData[i].title) {
        sectionIndex = i
        break
      }
    }
    let result = false
    if (data.path !== '') {
      for (let i = 0, l = layers.length; i < l; i++) {
        if (name === layers[i].name) {
          curData[sectionIndex].data[i].isVisible = value
          break
        }
      }

      // for (let i = 0, l = layers.length; i < l; i++) {
      //   if (name === layers[i].name) {
      //     curData[1].data[i].isVisible = value
      //     // /*
      //     //    *todo layers中包含了标注和底图，实际标注显示是读取的label中的属性，如果此处hasDeal设置为true
      //     //  *todo 则会造成标注设置不可见，折叠菜单再打开，不可见的标注又被勾上  是否改变数据结构？
      //     //  */
      //     // hasDeal = true
      //     break
      //   }
      // }
      // if (!hasDeal)
      //   for (let j = 0, l = backMaps.length; j < l; j++) {
      //     if (name === backMaps[j].name) {
      //       curData[2].data[j].isVisible = value
      //       hasDeal = true
      //       break
      //     }
      //   }
      // if (!hasDeal)
      //   for (let j = 0, l = Label.length; j < l; j++) {
      //     if (name === Label[j].name) {
      //       curData[0].data[j].isVisible = value
      //       hasDeal = true
      //       break
      //     }
      //   }
      result = await SMap.setLayerVisible(data.path, value)

      if (
        data.groupName &&
        this.itemRefs &&
        this.itemRefs[data.name] &&
        this.itemRefs[data.groupName]
      ) {
        this.getChildList({
          data: this.itemRefs[data.name].props.parentData,
          section,
        }).then(children => {
          this.itemRefs[data.groupName] &&
            this.itemRefs[data.groupName].setChildrenList(children)
        })
      } else {
        this.props.getLayers()
      }

      if (value) {
        // 显示多媒体callouts
        SMediaCollector.showMedia(data.name)
      } else {
        // 隐藏多媒体callouts
        SMediaCollector.hideMedia(data.name)
        if (data.name === this.props.currentLayer.name) {
          this.props.setCurrentLayer(null, () => {
            // 取消当前地图，清除历史记录
            this.props.clearAttributeHistory && this.props.clearAttributeHistory()
          })
        }
      }
    } else {
      Toast.show(getLanguage(this.props.language).Prompt.CHANGE_BASE_MAP)
    }
    return result
  }

  setAllLayersVisible = async section => {
    this.setLoading(true)
    // let layers = section.data
    let layers = JSON.parse(JSON.stringify(section.data))
    let visibles = this.isAllLayersVisible(layers)
    if (visibles) {
      for (let layer of layers) {
        await SMap.setLayerVisible(layer.path, false)
        layer.isVisible = false
        SMediaCollector.hideMedia(layer.name)
      }
    } else {
      for (let layer of layers) {
        if (layer.isVisible === false) {
          await SMap.setLayerVisible(layer.path, true)
          layer.isVisible = true
          SMediaCollector.showMedia(layer.name)
        }
      }
    }
    let data = JSON.parse(JSON.stringify(this.state.data))
    for (let i = 0; i < data.length; i++) {
      if (data[i].title === section.title) {
        data[i].data = layers
        break
      }
    }
    this.setState({ data, allLayersVisible: !visibles })
    this.setLoading(false)
  }

  isAllLayersVisible = layers => {
    if (layers.length > 0) {
      for (let layer of layers) {
        if (layer.isVisible === false) {
          return false
        }
      }
    } else {
      return false
    }
    return true
  }

  setLoading = (loading = false, info, extra) => {
    this.container && this.container.setLoading(loading, info, extra)
  }

  setSaveViewVisible = visible => {
    GLOBAL.SaveMapView &&
      GLOBAL.SaveMapView.setVisible(visible, {
        setLoading: this.setLoading,
      })
  }

  getStyleIconByType = item => {
    if (item.themeType > 0) {
      return getThemeIconByType(item.themeType)
    } else {
      return getLayerIconByType(item.type)
    }
  }

  tool_row = async () => {
    let userPath =
      this.props.user.currentUser.userName &&
      this.props.user.currentUser.userType !== UserType.PROBATION_USER
        ? ConstPath.UserPath + this.props.user.currentUser.userName + '/'
        : ConstPath.CustomerPath
    let mapPath = await FileTools.appendingHomeDirectory(
      userPath + ConstPath.RelativePath.Map,
    )
    let newName = await FileTools.getAvailableMapName(
      mapPath,
      this.props.map.currentMap.name || 'DefaultMap',
    )
    NavigationService.navigate('InputPage', {
      headerTitle: getLanguage(this.props.language).Map_Main_Menu.TOOLS_NAME,
      value: newName,
      placeholder: getLanguage(this.props.language).Prompt.ENTER_NAME,
      type: 'name',
      cb: async value => {
        if (value !== '') {
          (async function() {
            await SMap.setLabelColor()
            await SMap.newTaggingDataset(
              value,
              this.props.user.currentUser.userName,
            )
            // this.setRefreshing(true)
            // this.getData()
            this.updateTagging()
            this.props.getLayers()
          }.bind(this)())
        }
        NavigationService.goBack()
      },
    })
  }

  hasBaseMap = () => {
    let hasBaseMap = false
    if (this.props.layers && this.props.layers.length > 0) {
      hasBaseMap = LayerUtils.isBaseLayer(
        this.props.layers[this.props.layers.length - 1],
      )
    }
    return hasBaseMap
  }

  _renderItem = ({ item, section, index, parentData }) => {
    // sectionID = sectionID || 0
    item.index = index //记录位置用于上下移动
    item.layerCount = section.data.length //记录数目上下移动
    if (section.visible) {
      if (item) {
        let action
        if (
          section.title === getLanguage(this.props.language).Map_Layer.LAYERS
        ) {
          action = this.onToolPress
          if (
            this.props.layers &&
            this.props.layers.length > 0 &&
            item.name === this.props.layers[this.props.layers.length - 1].name
          ) {
            if (LayerUtils.isBaseLayer(item)) return true
          }
          if (
            this.props.layers &&
            this.props.layers.length > 1 &&
            item.name === this.props.layers[this.props.layers.length - 2].name
          ) {
            if (LayerUtils.isBaseLayer(item)) return true
          }
          if (
            this.props.layers &&
            this.props.layers.length > 0 &&
            item.name.indexOf('@Label_') >= 0
          ) {
            return true
          }
        } else if (
          section.title === getLanguage(this.props.language).Map_Layer.BASEMAP
        ) {
          action = this.onToolBasePress
        } else if (
          section.title === getLanguage(this.props.language).Map_Layer.PLOTS
        ) {
          action = this.taggingTool
        }
        return (
          <LayerManager_item
            key={item.name}
            ref={ref => {
              if (!this.itemRefs) {
                this.itemRefs = {}
              }
              this.itemRefs[item.name] = ref
              return this.itemRefs[item.name]
            }}
            // swipeEnabled={true}
            device={this.props.device}
            user={this.props.user}
            data={item}
            parentData={parentData}
            index={index}
            isClose={this.state.currentOpenItemName !== item.name}
            setLayerVisible={(data, value) =>
              this.setLayerVisible(data, value, section)
            }
            onOpen={data => {
              if (this.state.currentOpenItemName !== data.name) {
                let item = this.itemRefs[this.state.currentOpenItemName]
                item && item.close()
              }
              this.setState({
                currentOpenItemName: data.name,
              })
            }}
            getLayers={this.props.getLayers}
            isSelected={item.name === this.props.currentLayer.name}
            onPress={data => this.onPressRow({ ...data, section })}
            onAllPress={data => this.onAllPressRow({ ...data, section })}
            onArrowPress={({ data }) => this.getChildList({ data, section })}
            onToolPress={data => action({ ...data, section })}
            refreshParent={data => {
              this.getChildList({ data, section }).then(children => {
                this.itemRefs[data.name] &&
                  this.itemRefs[data.name].setChildrenList(children)
              })
            }}
            hasBaseMap={this.hasBaseMap()}
          />
        )
      } else {
        return <View />
      }
    } else {
      return <View />
    }
  }

  refreshList = section => {
    let newData = this.state.data
    section.visible = !section.visible
    newData[section.index] = section
    this.setState({
      data: newData.concat(),
    })
  }

  renderSection = ({ section }) => {
    let image = section.visible
      ? getThemeAssets().publicAssets.icon_drop_down
      : getThemeAssets().publicAssets.icon_drop_up
    let action, rightIcon
    if (section.title === getLanguage(this.props.language).Map_Layer.PLOTS) {
      action = this.tool_row
      rightIcon = getThemeAssets().publicAssets.icon_edit
    } else if (
      section.title === getLanguage(this.props.language).Map_Layer.LAYERS
    ) {
      action = () => this.setAllLayersVisible(section)
      rightIcon = this.state.allLayersVisible
        ? getThemeAssets().layer.icon_invisible
        : getThemeAssets().layer.icon_visible
    }
    return (
      <TouchableOpacity
        style={styles.sectionHeader}
        onPress={() => {
          this.refreshList(section)
        }}
      >
        <Image resizeMode={'contain'} source={image} style={styles.icon_big} />
        <View style={styles.sectionContent}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          {section.title ===
            getLanguage(this.props.language).Map_Layer.LAYERS && (
            <Text style={styles.sectionSubTitle}>
              {getLanguage(GLOBAL.language).Prompt.LONG_PRESS_TO_SORT}
            </Text>
          )}
        </View>
        <TouchableOpacity style={styles.rightIconView} onPress={action}>
          <Image
            resizeMode={'contain'}
            style={styles.icon}
            source={rightIcon}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    )
  }

  renderToolBar = () => {
    return (
      <MapToolbar
        navigation={this.props.navigation}
        type={this.state.type}
        initIndex={1}
        mapModules={this.props.mapModules}
      />
    )
  }

  renderList = () => {
    return (
      <SectionList
        style={{ flex: 1 }}
        refreshing={this.state.refreshing}
        onRefresh={() => {
          this.setRefreshing(true)
          this.getData()
        }}
        ref={ref => (this.listView = ref)}
        sections={this.state.data}
        renderItem={this._renderItem}
        renderSectionHeader={this.renderSection}
        // getItemLayout={this.getItemLayout}
        keyExtractor={(item, index) => index.toString()}
        initialNumToRender={15}
        // ItemSeparatorComponent={this.renderItemSeparator}
        renderSectionFooter={this.renderSectionFooter}
      />
    )
  }

  /**行与行之间的分隔线组件 */
  renderItemSeparator = ({ section, leadingItem }) => {
    if (section.visible) {
      if (
        this.props.layers.length > 0 &&
        leadingItem.name.indexOf('@Label_') >= 0 &&
        section.title === getLanguage(this.props.language).Map_Layer.LAYERS
      ) {
        return <View />
      } else {
        return (
          <View
            style={{
              flexDirection: 'column',
              marginLeft: scaleSize(84),
              width: '100%',
              height: 1,
              backgroundColor: color.separateColorGray,
            }}
          />
        )
      }
    } else {
      return <View />
    }
  }

  /**Section之间的分隔线组件 */
  renderSectionFooter = ({ section }) => {
    if (
      this.state.data &&
      this.state.data.length > 0 &&
      this.state.data[this.state.data.length - 1].title === section.title
    ) {
      return <View />
    }
    return (
      <View
        style={{
          flexDirection: 'column',
          width: '100%',
          height: scaleSize(10),
          backgroundColor: color.bgW,
        }}
      />
    )
  }

  //遮盖层
  renderOverLayer = () => {
    return <OverlayView ref={ref => (GLOBAL.LayerManagerOverlayView = ref)} />
  }

  renderTool = () => {
    return (
      <LayerManager_tolbar
        language={this.props.language}
        currentLayer={this.props.currentLayer}
        curUserBaseMaps={this.curUserBaseMaps}
        ref={ref => (this.toolBox = ref)}
        onPress={this.onPressRow}
        onThisPress={this.onThisPress}
        updateTagging={this.updateTagging}
        updateData={this.getData}
        getLayers={this.props.getLayers}
        setCurrentLayer={this.props.setCurrentLayer}
        device={this.props.device}
        user={this.props.user}
        navigation={this.props.navigation}
        mapFromXml={this.props.mapFromXml}
      />
    )
  }

  // 专题制图导入导出按钮
  _renderHeaderRight = () =>{
    if(this.state.type !== ChunkType.MAP_THEME || GLOBAL.coworkMode) return null
    let itemWidth =
      this.props.device.orientation.indexOf('LANDSCAPE') === 0 ? 100 : 65
    let size =
      this.props.device.orientation.indexOf('LANDSCAPE') === 0 ? 30 : 40
    let buttons = [
      <MTBtn
        key={'import'}
        image={getThemeAssets().nav.icon_nav_import}
        title={getLanguage(this.props.language).Map_Main_Menu.MAP_LOAD_XML}
        imageStyle={{ width: scaleSize(size), height: scaleSize(size) }}
        style={{marginRight: scaleSize(10)}}
        onPress={()=>{
          this.setState({
            isOutput: false,
          })
          this.dialog.setDialogVisible(true)
        }} />,
      <MTBtn
        key={'export'}
        image={getThemeAssets().nav.icon_nav_export}
        title={getLanguage(this.props.language).Map_Main_Menu.MAP_OUTPUT_XML}
        imageStyle={{ width: scaleSize(size), height: scaleSize(size) }}
        onPress={()=>{
          this.setState({
            isOutput: true,
          })
          this.dialog.setDialogVisible(true)
        }} />,
    ]

    return (
      <View style={{
        width: scaleSize((itemWidth + 10)* buttons.length),
        marginRight: scaleSize(10),
        flexDirection: 'row',
        justifyContent: buttons.length === 1 ? 'flex-end' : 'space-between',
        alignItems: 'center',
      }}>
        {buttons}
      </View>
    )
  }

  _onDialogConfirm = async () => {
    const { isOutput } = this.state
    this.dialog.setDialogVisible(false)
    if(isOutput) {
      // 地图输出为xml
      const mapName = this.props.map.currentMap.name || 'DefaultMap'
      GLOBAL.Loading.setLoading(true)
      this.props.mapToXml({mapName}, result => {
        GLOBAL.Loading.setLoading(false)
        Toast.show(result ? getLanguage(this.props.language).Prompt.SUCCESS :
          getLanguage(this.props.language).Prompt.FAILED)
      })
    }else {
      // 打开加载xml到地图的xml模板列表
      const data = await getXmlTemplateData()
      if(data[0].data.length === 0){
        Toast.show(getLanguage(GLOBAL.language).Prompt.NO_TEMPLATE)
        return
      }
      this.toolBox.setVisible(true, "GET_XML_TEMPLATE")
    }
  }

  _renderDialog = () => {
    const { isOutput } = this.state
    return (
      <Dialog
        ref={ref => (this.dialog = ref)}
        cancelBtnVisible={true}
        confirmBtnTitle={getLanguage(GLOBAL.language).Prompt.YES}
        cancelBtnTitle={getLanguage(GLOBAL.language).Prompt.NO}
        confirmAction={async ()=>{
          this.dialog && this._onDialogConfirm()
        }}
        cancelAction={async ()=>{
          this.dialog && this.dialog.setDialogVisible(false)
        }}
        opacity={1}
        defaultVisible={false}
        style={{height: scaleSize(300),backgroundColor: "#fff"}}
      >
        <View style={styles.dialogContent}>
          <Image source={require('../../assets/home/Frenchgrey/icon_prompt.png')} style={styles.dialogTitleImg}/>
          <Text style={styles.dialogTextStyle}>{
            isOutput ? getLanguage(GLOBAL.language).Prompt.CONFIRM_OUTPUT_TEMPLATE :
              getLanguage(GLOBAL.language).Prompt.CONFIRM_LOAD_TEMPLATE
          }</Text>
        </View>
      </Dialog>
    )
  }

  render() {
    return (
      <Container
        ref={ref => (this.container = ref)}
        headerProps={{
          title: this.props.mapModules.modules[
            this.props.mapModules.currentMapModule
          ].chunk.title,
          navigation: this.props.navigation,
          // backAction: this.back,
          // backImg: require('../../assets/mapTools/icon_close.png'),
          headerTitleViewStyle: {
            justifyContent: 'flex-start',
            marginLeft: scaleSize(90),
          },
          withoutBack: true,
          headerRight: this._renderHeaderRight(),
        }}
        onOverlayPress={() => {
          this.props.navigation.navigate('MapView')
        }}
        bottomBar={this.renderToolBar()}
      >
        {this.renderList()}
        {this.renderOverLayer()}
        {this.renderTool()}
        {this._renderDialog()}
      </Container>
    )
  }
}
