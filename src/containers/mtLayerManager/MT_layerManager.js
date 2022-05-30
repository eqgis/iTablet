/*
  Copyright © SuperMap. All rights reserved.
  Author: Wang zihao
  E-mail: zihaowang5325@qq.com
*/
/* global GLOBAL */
import * as React from 'react'
import { TouchableOpacity, Text, SectionList, View, Image } from 'react-native'
import { Container, MTBtn, Dialog, Waitting, PopoverButtonsView } from '../../components'
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
import ServiceAction from '../workspace/components/ToolBar/modules/serviceModule/ServiceAction'
import { Rect } from 'react-native-popover-view'

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
    cowork: any,
  }

  constructor(props) {
    super(props)
    const { params } = props.route
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
      type: (params && params.type) || global.Type, // 底部Tabbar类型
      allLayersVisible: false,
      isOutput: true, // 点击了输出/加载按钮，用于判断dialog行为

      isVisible: false,
      buttonRect: new Rect(1, 1, 100, 60),
    }
    this.itemRefs = {} // 记录列表items
    this.currentItemRef = {} // 当前被选中的item
    this.prevItemRef = {} // 上一个被选中的item
    this.dialog = undefined
    this.publishMapServiceWatting = undefined // 发布地图服务,只有在线协作可用
    this.Popover = undefined
  }

  componentDidUpdate(prevProps) {
    if (
      JSON.stringify(prevProps.layers) !== JSON.stringify(this.props.layers)
    ) {
      this.getData()
    }
    
    if (this.props.device.orientation !== prevProps.device.orientation) {
      this.Popover?.setVisible(false)
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
        (allLayers.length === 0 && global.Type === ChunkType.MAP_ANALYST)
      ) {
        // 当图层数量大于0且最后一个图层不是底图时 或者 图层数量为0且为分析模式的时候
        if (
          (allLayers.length > 0 &&
            !LayerUtils.isBaseLayer(allLayers[allLayers.length - 1])) ||
          (allLayers.length === 0 && global.Type === ChunkType.MAP_ANALYST)
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
          // 当图层数量大于0，最后一个图层是底图，对图层显示进行分类,底图放进baseMap里，其他图层放进alllayers里
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
          global.Type === ChunkType.MAP_COLLECTION
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
      this.setState({
        data: [
          {
            title: getLanguage(this.props.language).Map_Layer.PLOTS,
            //'我的标注',
            data: [],
            visible: true,
          },
          {
            title: getLanguage(this.props.language).Map_Layer.LAYERS,
            //'我的图层',
            data: [],
            visible: true,
          },
          {
            title: getLanguage(this.props.language).Map_Layer.BASEMAP,
            // '我的底图',
            data: [
              {
                caption: 'baseMap',
                datasetName: '',
                name: 'baseMap',
                path: '',
                themeType: 0,
                type: 81,
              },
            ],
            visible: true,
          },
        ],
        refreshing: false,
        allLayersVisible: true,
      })
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
      Toast.show(getLanguage(global.language).Prompt.IMAGE_LAYER_CANNOT_BE_CURRENT_LAYER)
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
          if (this.props.currentLayer.path !== data.path) {
            this.props.clearAttributeHistory &&
              this.props.clearAttributeHistory()
          }
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
        })
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
    if (global.Type === ChunkType.MAP_EDIT) return
    !isBaseMap && this.props.setCurrentLayer &&
      this.props.setCurrentLayer(data, () => {
        // 切换地图，清除历史记录
        if (
          JSON.stringify(this.props.currentLayer) !== JSON.stringify(data.name)
        ) {
          this.props.clearAttributeHistory && this.props.clearAttributeHistory()
        }
        if (
          global.Type !== ChunkType.MAP_EDIT &&
          global.Type !== ChunkType.MAP_THEME &&
          global.Type !== ChunkType.MAP_ANALYST
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
        } else if (global.Type === ChunkType.MAP_THEME) {
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
    if (global.Type === ChunkType.MAP_THEME) {
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
      global.Type === ChunkType.MAP_EDIT ||
      global.Type === ChunkType.MAP_ANALYST
    ) {
      this.toolBox.setVisible(true, ConstToolType.SM_MAP_STYLE, {
        layerData: data,
        refreshParentList: refreshParentList,
        resetToolModuleData: true,
      })
    } else if (
      global.Type === ChunkType.MAP_PLOTTING &&
      data.name.substring(0, 9) === 'PlotEdit_'
    ) {
      this.toolBox.setVisible(true, ConstToolType.SM_MAP_PLOT, {
        layerData: data,
        refreshParentList: refreshParentList,
        resetToolModuleData: true,
      })
    } else if (global.Type === ChunkType.MAP_NAVIGATION) {
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
        let layerType = LayerUtils.getLayerType(data)
        // 显示多媒体callouts
        // TODO 普通图层显示和多媒体显示逻辑分开,图层显示的时候,暂时不显示多媒体,由多媒体开关来控制
        layerType === 'TAGGINGLAYER' && SMediaCollector.showMedia(data.name)
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
    global.SaveMapView &&
      global.SaveMapView.setVisible(visible, {
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
              `${value}_${this.props.user.currentUser.userName}`,
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

  _renderCornerMark = item => {
    // 类型图标角标
    let cornerMarkImage = null
    try {
      if (global.coworkMode && !LayerUtils.availableServiceLayer(item.type)) {
        return cornerMarkImage
      }
      if (
        global.coworkMode && this.props.cowork?.currentTask?.groupID &&
        this.props.cowork.services?.[this.props.user.currentUser.userName]?.[this.props.cowork?.currentTask?.groupID]?.[this.props.cowork?.currentTask?.id]?.length > 0
      ) {
        const dsDescription = LayerUtils.getDatasetDescriptionByLayer(item)
        // if (dsDescription.url && dsDescription?.type === 'onlineService') {
        const services = this.props.cowork.services[this.props.user.currentUser.userName][this.props.cowork.currentTask.groupID][this.props.cowork.currentTask.id]
        if (services?.length > 0) {
          for (const service of services) {
            if ((
              dsDescription?.url && service.datasetUrl === dsDescription?.url ||
              service.layerName === item.name
            ) &&
            // item.themeType <= 0 && !item.isHeatmap &&
            service.status !== 'done'
            ) {
              return true
            }
          }
        }
        // }
      }
      if (
        cornerMarkImage === null &&
        global.coworkMode && this.props.cowork?.currentTask?.groupID &&
        this.props.cowork.coworkInfo?.[this.props.user.currentUser.userName]?.[this.props.cowork?.currentTask?.groupID]?.[this.props.cowork?.currentTask?.id]?.messages
      ) {
        const dsDescription = LayerUtils.getDatasetDescriptionByLayer(item)
        if (dsDescription?.url && dsDescription?.type === 'onlineService') {
          const currentCoworkMessage = this.props.cowork.coworkInfo[this.props.user.currentUser.userName][this.props.cowork.currentTask.groupID][this.props.cowork.currentTask.id].messages
          if (currentCoworkMessage?.length > 0) {
            for (const message of currentCoworkMessage) {
              if (
                message.message?.serviceUrl === dsDescription.url && message?.status === 0
                // item.themeType <= 0 && !item.isHeatmap
              ) {
                cornerMarkImage = getThemeAssets().cowork.icon_state_update
                return cornerMarkImage
              }
            }
          }
        }
      }
    } catch (error) {
      cornerMarkImage = null
    }
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
        let cornerMark = this._renderCornerMark(item)
        let cornerMarkImage, isLoading = false
        if (cornerMark !== true) {
          cornerMarkImage = cornerMark
        } else {
          isLoading = cornerMark
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
            isSelected={
              item.name === this.props.currentLayer.name &&
              item.path === this.props.currentLayer.path
            }
            onPress={data => this.onPressRow({ ...data, section })}
            onLongPress={data => this.showPopover(data)}
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
            cornerMarkImage={cornerMarkImage}
            isLoading={isLoading}
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

  // showPopover = ({ref, popoverData}) => {
  //   ref?.measure((ox, oy, width, height, px, py) => {
  //     this.Popover?.setVisible(true, new Rect(px + 1, py + 1, width, height), popoverData)
  //   });
  // }

  showPopover = ({px, py, width, height, popoverData}) => {
    this.Popover?.setVisible(true, new Rect(px + 1, py + 1, width, height), popoverData)
  }

  closePopover = () => {
    this.setState({isVisible: false});
  }

  renderSection = ({ section }) => {
    let image = section.visible
      ? getThemeAssets().publicAssets.icon_drop_down
      : getThemeAssets().publicAssets.icon_drop_up
    let action, rightIcon, publishServiceBtn
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
      if (global.coworkMode && global.Type !== ChunkType.MAP_PLOTTING) { // 标绘没有发布按钮
        let isPublishing = false
        if (
          this.props.cowork?.currentTask?.groupID &&
          this.props.cowork.services?.[this.props.user.currentUser.userName]?.[this.props.cowork?.currentTask?.groupID]?.[this.props.cowork?.currentTask?.id]?.length > 0
        ) {
          const services = this.props.cowork.services[this.props.user.currentUser.userName][this.props.cowork.currentTask.groupID][this.props.cowork.currentTask.id]
          if (services?.length > 0) {
            for (const service of services) {
              if (service.layerName === 'publish-map-service' && service.status !== 'done') {
                isPublishing = true
                break
              }
            }
          }
        }
        let mapServiceUrl = ''
        for (const item of section.data) {
          const dsDescription = LayerUtils.getDatasetDescriptionByLayer(item)
          if (dsDescription?.url) {
            mapServiceUrl = dsDescription.url.substring(0, dsDescription.url.indexOf('/data/datasources'))
            break
          }
        }

        publishServiceBtn =
          this.props.cowork.currentTask?.resource?.resourceCreator &&
          this.props.cowork.currentTask?.resource?.resourceCreator === this.props.user.currentUser?.userName &&
          !mapServiceUrl && (
            <View style={styles.sectionPublishView}>
              <MTBtn
                style={styles.rightIconView}
                imageStyle={styles.icon}
                // image={mapServiceUrl ? getThemeAssets().cowork.icon_nav_import : getThemeAssets().edit.icon_redo}
                image={getThemeAssets().publicAssets.icon_data_upload}
                onPress={async () => {
                  // if (mapServiceUrl) {
                  //   global.SimpleDialog.set({
                  //     text: getLanguage(global.language).Prompt.WHETHER_DOWNLOAD_ALL_SERVICES,
                  //     cancelText: getLanguage(global.language).Prompt.NO,
                  //     cancelAction: async () => {
                  //       global.Loading.setLoading(false)
                  //     },
                  //     confirmText: getLanguage(global.language).Prompt.YES,
                  //     confirmAction: async () => {
                  //       ServiceAction.downloadService(mapServiceUrl)
                  //     },
                  //   })
                  // } else {
                  let datasources = await SMap.getDatasources()
                  let datasrouceNames = ''
                  for (const datasource of datasources) {
                    const datasourceAlias = datasource.alias
                    // 不发布标注图层
                    if (
                      datasourceAlias?.indexOf('Label_') === 0 && datasourceAlias?.indexOf('#') === datasourceAlias?.length - 1 || // 过滤标注数据源
                      datasourceAlias && LayerUtils.isBaseLayerDatasource(datasourceAlias) // 过滤底图数据源
                    ) {
                      continue
                    }
                    datasrouceNames += (datasrouceNames ? ', ' : '') + datasourceAlias
                  }
                  global.SimpleDialog.set({
                    text: getLanguage(global.language).Profile.PUBLISH_SERVICE + ' ' + datasrouceNames,
                    cancelText: getLanguage(global.language).Prompt.NO,
                    cancelAction: async () => {
                      global.Loading.setLoading(false)
                    },
                    confirmText: getLanguage(global.language).Prompt.YES,
                    confirmAction: async () => {
                      ServiceAction.publishMapService()
                    },
                  })
                  // }
                  global.SimpleDialog.setVisible(true)
                }}
              />
              {/* <TextBtn
                btnText={
                  mapServiceUrl
                    ? '下载服务'
                    : getLanguage(global.language).Profile.PUBLISH_SERVICE
                }
                textStyle={styles.title}
                btnClick={async () => {
                }}
              /> */}
              {isPublishing ? <Waitting isLoading={true}/> : <View style={styles.watting}/>}
            </View>
          )
      }
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
              {getLanguage(global.language).Prompt.LONG_PRESS_TO_SORT}
            </Text>
          )}
        </View>
        {publishServiceBtn}
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
    return <OverlayView ref={ref => (global.LayerManagerOverlayView = ref)} />
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
        currentTask={this.props.cowork.currentTask}
      />
    )
  }

  // 专题制图导入导出按钮
  _renderHeaderRight = () =>{
    if(this.state.type !== ChunkType.MAP_THEME || global.coworkMode) return null
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
      global.Loading.setLoading(true)
      this.props.mapToXml({mapName}, result => {
        global.Loading.setLoading(false)
        Toast.show(result ? getLanguage(this.props.language).Prompt.SUCCESS :
          getLanguage(this.props.language).Prompt.FAILED)
      })
    }else {
      // 打开加载xml到地图的xml模板列表
      const data = await getXmlTemplateData()
      if(data[0].data.length === 0){
        Toast.show(getLanguage(global.language).Prompt.NO_TEMPLATE)
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
        confirmBtnTitle={getLanguage(global.language).Prompt.YES}
        cancelBtnTitle={getLanguage(global.language).Prompt.NO}
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
            isOutput ? getLanguage(global.language).Prompt.CONFIRM_OUTPUT_TEMPLATE :
              getLanguage(global.language).Prompt.CONFIRM_LOAD_TEMPLATE
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
          title: this.props.mapModules?.modules?.[
            this.props.mapModules.currentMapModule
          ]?.chunk?.title || getLanguage(global.language).Map_Label.LAYER,
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
          // this.props.navigation.navigate('MapView')
          this.props.navigation.goBack()
        }}
        bottomBar={this.renderToolBar()}
      >
        {this.renderList()}
        {this.renderOverLayer()}
        {this.renderTool()}
        {this._renderDialog()}
        <PopoverButtonsView
          ref={ref => this.Popover = ref}
          backgroundStyle={{backgroundColor: 'rgba(0, 0, 0, 0)'}}
          popoverStyle={{backgroundColor: 'rgba(0, 0, 0, 1)'}}
        />
      </Container>
    )
  }
}
