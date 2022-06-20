/*
 Copyright © SuperMap. All rights reserved.
 Author: Yangshanglong
 E-mail: yangshanglong@supermap.com
 */
/*global global*/
import * as React from 'react'
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native'
import { Container, MTBtn, Dialog, PopModal } from '../../../../components'
import { ConstToolType } from '../../../../constants'
import { Toast, scaleSize, StyleUtils, LayerUtils, screen } from '../../../../utils'
import { getPublicAssets, getThemeAssets } from '../../../../assets'
import { color, zIndexLevel, size } from '../../../../styles'
import NavigationService from '../../../NavigationService'
import { LayerTopBar, DrawerBar, LocationView } from '../../components'
import LayerSelectionAttribute from './LayerSelectionAttribute'
import { TabView, SceneMap, TabBar } from 'react-native-tab-view'
import {
  SMap,
  Action,
  GeoStyle,
  TextStyle,
  GeometryType,
  SMediaCollector,
} from 'imobile_for_reactnative'
import { getLanguage } from '../../../../language'
import ToolbarModule from '../../../workspace/components/ToolBar/modules/ToolbarModule'
import LayerAttributeAdd from '../layerAttributeAdd'

const styles = StyleSheet.create({
  container: {
    // backgroundColor: 'transparent',
    backgroundColor: color.bgW,
    flex: 1,
  },
  drawerOverlay: {
    backgroundColor: color.modalBgColor,
    position: 'absolute',
    zIndex: zIndexLevel.TWO,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  editControllerView: {
    flexDirection: 'row',
    height: scaleSize(100),
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: color.contentColorWhite,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerBtn: {
    height: scaleSize(60),
    width: scaleSize(60),
  },
  locationView: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: color.bgW,
  },
})

export default class LayerAttributeTabs extends React.Component {
  props: {
    language: string,
    navigation: Object,
    currentAttribute: Object,
    currentLayer: Object,
    map: Object,
    device: Object,
    currentTask: Object,
    currentUser: Object,
    selection: Array,
    attributesHistory: Array,
    setCurrentAttribute: () => {},
    setLayerAttributes: () => {},
    setDataAttributes: () => {},
    setNaviAttributes: () => {},
    setAttributeHistory: () => {},
    clearAttributeHistory: () => {},
    setBackAction: () => {},
    removeBackAction: () => {},
    setSelection: () => {},
  }

  constructor(props) {
    super(props)
    const { params } = props.route
    let initTabIndex = 0
    let initIndex =
      props.selection.length > 0 && props.selection[0].ids.length === 1 ? 0 : -1
    let initFieldInfo = []

    this.preAction = params && params.preAction
    this.preToolbarType = params?.preType
    this.type = params?.type //我的里面会传一个type进来区分
    this.datasetName = params?.datasetName
    // 初始化选择的图层和属性（关联后返回属性界面，找到对应的图层属性）
    const selectionAttribute = params && params.selectionAttribute
    if (
      props.selection &&
      props.selection.length > 0 &&
      selectionAttribute &&
      selectionAttribute.layerInfo &&
      selectionAttribute.layerInfo.name
    ) {
      for (let i = 0; i < props.selection.length; i++) {
        if (
          selectionAttribute.layerInfo.name ===
          props.selection[i].layerInfo.name
        ) {
          initFieldInfo = selectionAttribute.data || []
          initIndex =
            selectionAttribute.index >= 0 ? selectionAttribute.index : -1
          initTabIndex = i
          break
        }
      }
    }


    this.state = {
      isShowView: false,
      currentIndex: initIndex,
      currentFieldInfo: initFieldInfo,
      currentTabIndex: initTabIndex,
      isShowDrawer: false,
      initialPage: initTabIndex,
      attributes: {
        head: [],
        data: [],
      },
      canBeUndo: false,
      canBeRedo: false,
      canBeRevert: false,

      isShowSystemFields: true,
      //采集标注后属性为true 默认false add jiakai
      isCollection: params && params.isCollection ? params.isCollection : false, // Selection为空，查询最后一条

      isMediaLayer: false, // 当前图层是否是多媒体图层

      routes: this._getRoutes(),
    }

    // 选择集中当前选中的属性
    global.SelectedSelectionAttribute = selectionAttribute || {
      index: initIndex,
      layerInfo: {},
      data: [],
    }

    this.currentTabRefs = []
    this.init = !!selectionAttribute
    this.backClicked = false
  }

  async componentDidMount() {
    try {
      await this.props.setBackAction({
        key: this.props.route.name,
        action: this.back,
      })
      if (this.preAction && typeof this.preAction === 'function') {
        await this.preAction()
      }
      let layerInfo
      if (this.state.isCollection) {
        layerInfo =  {
          path: this.props.currentLayer.path,
          type: 149,
          selectTable: true,
          Visible: true,
          editable: false,
          caption: this.props.currentLayer.caption,
          name: this.props.currentLayer.name,
        }
        // const layerInfo = this.props.selection[this.state.currentTabIndex].layerInfo
        let id = await SMap.getCurrentGeometryID(this.props.currentLayer.path)
        // let id = await SMap.getCurrentGeometryID(global.currentLayer.name)
        this.props.setSelection && this.props.setSelection([{
          layerInfo: layerInfo,
          ids: [id],
        }])
      } else if (this.type === 'MY_DATA') {
        layerInfo = {
          path: this.datasetName,
          type: 149,
          selectTable: true,
          Visible: true,
          editable: false,
          caption: this.datasetName,
          name: this.datasetName,
        }
        let id = await SMap.getDatasetGeometryID(this.datasetName)
        this.props.setSelection && this.props.setSelection([{
          layerInfo: layerInfo,
          ids: id,
        }])
      } else if (this.type === 'NAVIGATION') {
        layerInfo = {
          path: this.datasetName,
          type: 149,
          selectTable: true,
          Visible: true,
          editable: false,
          caption: this.datasetName,
          name: this.datasetName,
        }
        let id = await SMap.getNavigationDatasetGeometryID(this.datasetName)
        this.props.setSelection && this.props.setSelection([{
          layerInfo: layerInfo,
          ids: id,
        }])
      }else {
        layerInfo = this.props.selection[this.state.currentTabIndex].layerInfo
      }
      this.setState({
        isMediaLayer: await SMediaCollector.isMediaLayer(layerInfo.name),
        isShowView: true,
      })
    } catch(e) {
      this.setState({
        isShowView: true,
      })
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      nextProps.language !== this.props.language ||
      JSON.stringify(nextProps.currentAttribute) !== JSON.stringify(this.props.currentAttribute) ||
      JSON.stringify(nextProps.currentLayer) !== JSON.stringify(this.props.currentLayer) ||
      JSON.stringify(nextProps.map) !== JSON.stringify(this.props.map) ||
      JSON.stringify(nextProps.device) !== JSON.stringify(this.props.device) ||
      JSON.stringify(nextProps.currentTask) !== JSON.stringify(this.props.currentTask) ||
      JSON.stringify(nextProps.currentUser) !== JSON.stringify(this.props.currentUser) ||
      JSON.stringify(nextProps.selection) !== JSON.stringify(this.props.selection) ||
      JSON.stringify(nextProps.attributesHistory) !== JSON.stringify(this.props.attributesHistory) ||
      JSON.stringify(nextState) !== JSON.stringify(this.state)
    ) {
      return true
    }
    return false
  }

  componentWillUnmount() {
    if (Platform.OS === 'android') {
      this.props.removeBackAction({
        key: this.props.route.name,
      })
    }
  }

  showDrawer = isShow => {
    this.locationView && this.locationView.show(false)
    if (!this.drawer) return
    if (isShow !== undefined && isShow !== this.state.isShowDrawer) {
      this.setState(
        {
          isShowDrawer: isShow,
        },
        () => this.drawer.showBar(isShow),
      )
    } else if (isShow === undefined) {
      this.setState(
        {
          isShowDrawer: !this.state.isShowDrawer,
        },
        () => this.drawer.showBar(this.state.isShowDrawer),
      )
    }
  }

  setLoading = (loading = false, info, extra) => {
    this.container && this.container.setLoading(loading, info, extra)
  }

  selectAction = ({ data, index, layerInfo }) => {
    if (this.props.selection.length > 0 && index !== this.state.currentIndex) {
      global.SelectedSelectionAttribute = {
        index,
        layerInfo,
        data,
      }
      this.setState({
        currentIndex: index,
        currentFieldInfo: data,
      })
    } else {
      global.SelectedSelectionAttribute = {
        index: -1,
        layerInfo: {},
        data: [],
      }
      this.setState({
        currentIndex: -1,
        currentFieldInfo: [],
      })
    }
  }

  showUndoView = () => {
    this.popModal && this.popModal.setVisible(true)
  }

  goToSearch = () => {
    let myData = this.type === 'MY_DATA' ? true : false
    let isSelection = this.type === 'MY_DATA' ? false : true
    NavigationService.navigate('LayerAttributeSearch', {
      layerPath: this.props.selection[this.state.currentTabIndex].layerInfo
        .path,
      isSelection: isSelection,
      myData:myData,
    })
  }

  onGetAttribute = attributes => {
    let newState = {}
    // 当数据是一维数组时，则表格只有一条数据，则默认当前index为0
    if (attributes.data.length === 1) {
      // if (attributes.data.length > 0 && !(attributes.data[0] instanceof Array) && this.state.currentIndex !== 0) {
      global.SelectedSelectionAttribute = {
        index: 0,
        layerInfo: this.props.selection[this.state.currentTabIndex].layerInfo,
        data: attributes.data[0],
      }
      if (this.state.currentIndex !== 0) newState.currentIndex = 0
    }

    if (JSON.stringify(this.state.attributes) !== JSON.stringify(attributes)) {
      newState.attributes = attributes
    }

    if (Object.keys(newState).length > 0) this.setState(newState)

    // 初始化第一次进入，多行属性界面，跳转到初始化行
    if (
      this.init &&
      this.props.selection.length > 0 &&
      this.props.selection[this.state.currentTabIndex].ids.length > 1 &&
      this.state.currentIndex >= 0
    ) {
      this.init = false
      this.locateToPosition({
        type: 'absolute',
        index: this.state.currentIndex + 1, // currentIndex从0开始，表格序号从1开始
      })
    }
  }

  onGetToolVisible = (toolVisible = {}) => {
    if (
      this.state.canBeUndo !== toolVisible.canBeUndo ||
      this.state.canBeRedo !== toolVisible.canBeRedo ||
      this.state.canBeRevert !== toolVisible.canBeRevert
    ) {
      this.setState({
        ...toolVisible,
      })
    }
  }

  showLocationView = () => {
    this.locationView && this.locationView.show(true)
  }

  /**
   * 定位到首位
   */
  locateToTop = () => {
    this.currentTabRefs[this.state.currentTabIndex] &&
      this.currentTabRefs[this.state.currentTabIndex].locateToTop(
        ({ currentIndex, currentFieldInfo, layerInfo }) => {
          this.setState({
            currentIndex,
            currentFieldInfo,
          })
          global.SelectedSelectionAttribute = {
            index: currentIndex,
            layerInfo,
            data: currentFieldInfo,
          }
          this.locationView && this.locationView.show(false)
        },
      )
  }

  /**
   * 定位到末尾
   */
  locateToBottom = () => {
    this.currentTabRefs[this.state.currentTabIndex] &&
      this.currentTabRefs[this.state.currentTabIndex].locateToBottom(
        ({ currentIndex, currentFieldInfo, layerInfo }) => {
          this.setState({
            currentIndex,
            currentFieldInfo,
          })
          global.SelectedSelectionAttribute = {
            index: currentIndex,
            layerInfo,
            data: currentFieldInfo,
          }
          this.locationView && this.locationView.show(false)
        },
      )
  }

  /**
   * 定位到指定位置（相对/绝对 位置）
   * @param data {value, inputValue}
   */
  locateToPosition = (data = {}) => {
    this.currentTabRefs[this.state.currentTabIndex] &&
      this.currentTabRefs[this.state.currentTabIndex].locateToPosition(
        data,
        ({ currentIndex, currentFieldInfo, layerInfo }) => {
          this.setState({
            currentIndex,
            currentFieldInfo,
          })
          global.SelectedSelectionAttribute = {
            index: currentIndex,
            layerInfo,
            data: currentFieldInfo,
          }
          this.locationView && this.locationView.show(false)
        },
      )
  }

  /** 删除属性字段 **/
  onAttributeFieldDelete = async fieldInfo => {
    if (!fieldInfo) {
      return
    }
    this.deleteFieldData = fieldInfo
    this.deleteFieldDialog.setDialogVisible(true)
  }

  showLayerAddView = (visible, params) => {
    // global.ToolBar.showFullMap(true)
    this.addPopModal && this.addPopModal.setVisible(visible, params)
  }

  /** 添加属性字段 **/
  addAttributeField = async fieldInfo => {
    // if (this.state.attributes.data.length > 0) {
    if (
      this.state.currentTabIndex >= this.currentTabRefs.length &&
      !this.currentTabRefs[this.state.currentTabIndex]
    )
      return
    let layerPath = this.currentTabRefs[this.state.currentTabIndex].props
      .layerSelection.layerInfo.path
    let result
    if (this.type === 'MY_DATA') {
      result = await SMap.addAttributeFieldInfoByData(layerPath, fieldInfo)
    }else if(this.type === 'NAVIGATION'){
      result = await SMap.addNavigationAttributeFieldInfoByData(layerPath, fieldInfo)
    }else {
      result = await SMap.addAttributeFieldInfo(layerPath, true, fieldInfo)
    }
    if (result) {
      Toast.show(
        getLanguage(this.props.language).Prompt.ATTRIBUTE_ADD_SUCCESS,
      )
      this.refreshAction()
      this.currentTabRefs[this.state.currentTabIndex].getAttribute(
        {
          type: 'reset',
          currentPage: this.currentTabRefs[this.state.currentTabIndex]
            .currentPage,
          startIndex: 0,
          relativeIndex: 0,
          currentIndex: 0,
        },
        () => { },
      )
    } else {
      Toast.show(getLanguage(this.props.language).Prompt.ATTRIBUTE_ADD_FAILED)
    }
    return result
    // }
    // return false
  }

  /** 删除事件 **/
  deleteAction = async () => {
    let smID = -1, // 用于找到删除的对象
      hasMedia = false // 是否包含多媒体图片
    for (let i = 0; i < this.state.attributes.data[this.state.currentIndex].length; i++) {
      if (this.state.attributes.data[this.state.currentIndex][i].name === 'SmID') {
        smID = this.state.attributes.data[this.state.currentIndex][i].value
        if (smID >= 0 && hasMedia) break
      } else if (
        this.state.attributes.data[this.state.currentIndex][i].name === 'MediaFilePaths' &&
        this.state.attributes.data[this.state.currentIndex][i].value != ''
      ) {
        hasMedia = true
        if (smID >= 0 && hasMedia) break
      }
    }
    let result
    let layerInfo
    if (this.state.isCollection) {
      layerInfo = this.props.currentLayer
    } else {
      layerInfo = this.props.selection[this.state.currentTabIndex].layerInfo
    }
    // 若包含多媒体图片，则删除
    if (hasMedia && smID >= 0) {
      result = await SMediaCollector.deleteMedia(layerInfo.path, smID)
    } else if (this.state.isCollection) { // 删除当前图层中的最后一条数据，用于绘图后立即查看属性
      result = await LayerUtils.deleteAttributeByLayer(
        layerInfo.path,
        this.state.currentIndex, this.state.isCollection)
    }else if(this.type === 'MY_DATA'){
      result = await LayerUtils.deleteAttributeByData(
        layerInfo.path,
        this.state.currentIndex)
    } else if (this.type === 'NAVIGATION') {
      result = await LayerUtils.deleteNavigationAttributeByData(
        layerInfo.path,
        this.state.currentIndex)
      if (result) {
        SMap.refreshMap()
      }
    } else { // 删除选择集中指定位置的对象，用于点选/框选
      result = await LayerUtils.deleteSelectionAttributeByLayer(
        layerInfo.path,
        this.state.currentIndex, this.state.isCollection)
    }
    if (result) {
      Toast.show(getLanguage(this.props.language).Prompt.DELETED_SUCCESS)
      if (this.state.isCollection) {
        global.HAVEATTRIBUTE = false
        this.props.navigation.goBack()
      }
    } else {
      Toast.show(getLanguage(this.props.language).Prompt.FAILED_TO_DELETE)
    }
    this.currentTabRefs[this.state.currentTabIndex]?.getAttribute(
      {
        type: 'reset',
        currentPage: 0,
        startIndex: 0,
        relativeIndex: 0,
        currentIndex: 0,
      },
    )
    this.setState({
      currentIndex: -1,
      currentFieldInfo: [],
    })
  }

  /** 拍照后刷新事件 **/
  refreshAction = async () => {
    this.currentTabRefs[this.state.currentTabIndex]?.getAttribute(
      {
        type: 'reset',
        currentPage: 0,
        startIndex: 0,
        relativeIndex: 0,
        currentIndex: 0,
      },
    )
  }

  /** 关联事件 **/
  relateAction = () => {
    if (
      this.state.currentTabIndex >= this.currentTabRefs.length &&
      !this.currentTabRefs[this.state.currentTabIndex]
    )
      return
    let layerPath = this.currentTabRefs[this.state.currentTabIndex].props
        .layerSelection.layerInfo.path,
      selection = this.currentTabRefs[this.state.currentTabIndex].getSelection()

    if (!selection || !selection.data) return

    SMap.setLayerEditable(layerPath, false)
    let objs = []
    let geoStyle = new GeoStyle()
    geoStyle.setFillForeColor(0, 255, 0, 0.5)
    geoStyle.setLineWidth(1)
    geoStyle.setLineColor(70, 128, 223)
    geoStyle.setMarkerHeight(5)
    geoStyle.setMarkerWidth(5)
    geoStyle.setMarkerSize(10)
    // 检查是否是文本对象，若是，则使用TextStyle
    for (let i = 0; i < this.props.selection.length; i++) {
      if (this.props.selection[i].layerInfo.path === layerPath) {
        for (let j = 0; j < selection.data.length; j++) {
          if (
            selection.data[j].name === 'SmGeoType' &&
            selection.data[j].value === GeometryType.GEOTEXT
          ) {
            geoStyle = new TextStyle()
            geoStyle.setForeColor(0, 255, 0, 0.5)
            break
          }
        }

        objs.push({
          layerPath: layerPath,
          // ids: [selection.data[0].value],
          ids: [
            selection.data[0].name === 'SmID'
              ? selection.data[0].value
              : selection.data[1].value,
          ], // 多条数据有序号时：0为序号，1为SmID；无序号时0为SmID
          style: JSON.stringify(geoStyle),
        })
      } else {
        objs.push({
          layerPath: this.props.selection[i].layerInfo.path,
          ids: [],
        })
      }
    }

    SMap.setAction(Action.PAN)

    SMap.clearSelection().then(() => {
      // SMap.selectObjs(objs).then(data => {
      SMap.setTrackingLayer(objs, true).then(data => {
        // TODO 选中对象跳转到地图
        // this.props.navigation && this.props.navigation.navigate('MapView')
        // NavigationService.navigate('MapView')
        this.props.navigation.goBack()
        global.toolBox &&
          global.toolBox.setVisible(
            true,
            ConstToolType.SM_MAP_TOOL_ATTRIBUTE_SELECTION_RELATE,
            {
              isFullScreen: false,
              // height: 0,
            },
          )
        global.toolBox && global.toolBox.showFullMap()
        ToolbarModule.addData({ preType: this.preToolbarType })
        StyleUtils.setSelectionStyle(
          // this.props.currentLayer.path || objs[0].layerPath,
          layerPath,
        )
        if (data instanceof Array && data.length > 0) {
          SMap.moveToPoint({
            x: data[0].x,
            y: data[0].y,
          })
        }
      })
    })
  }

  drawerOnChange = async({ index }) => {
    if (this.state.currentTabIndex !== index) {
      this.currentTabRefs &&
        this.currentTabRefs[this.state.currentTabIndex] &&
        this.currentTabRefs[this.state.currentTabIndex].clearSelection()
      let newState = {
        currentTabIndex: index,
      }
      let toolVisible = {}
      if (this.currentTabRefs && this.currentTabRefs[index]) {
        let attributes = this.currentTabRefs[index].getAttributes()
        newState.attributes = attributes
        newState.currentIndex = attributes.data.length === 1 ? 0 : -1
        toolVisible = this.currentTabRefs[index].getToolIsViable() || {}
      } else {
        newState.currentIndex = -1
        toolVisible = {
          canBeUndo: false,
          canBeRedo: false,
          canBeRevert: false,
        }
      }
      const layerInfo = this.props.selection[index].layerInfo
      const isMediaLayer = await SMediaCollector.isMediaLayer(layerInfo.name)
      this.setState(Object.assign(newState, toolVisible, {isMediaLayer}))
    }

    let timer = setTimeout(() => {
      this.showDrawer(false)
      clearTimeout(timer)
    }, 1000)
  }

  // 显示/隐藏属性
  showSystemFields = () => {
    this.currentTabRefs[this.state.currentTabIndex] &&
      this.currentTabRefs[this.state.currentTabIndex].horizontalScrollToStart()
    this.setState({
      isShowSystemFields: !this.state.isShowSystemFields,
    })
  }

  back = () => {
    if (!this.backClicked) {
      this.backClicked = true
      if (this.locationView && this.locationView.isShow()) {
        this.locationView.show(false)
        this.backClicked = false
        return
      }

      global.SelectedSelectionAttribute = null // 清除选择集中当前选中的属性

      NavigationService.goBack()

      setTimeout(() => {
        this.backClicked = false
      }, 1500)
    }
  }

  setAttributeHistory = type => {
    this.currentTabRefs[this.state.currentTabIndex] &&
      this.currentTabRefs[this.state.currentTabIndex].setAttributeHistory(type)
  }

  //提示是否删除属性字段
  renderDeleteFieldDialog = () => {
    return (
      <Dialog
        ref={ref => (this.deleteFieldDialog = ref)}
        type={'modal'}
        confirmAction={async () => {
          this.deleteFieldDialog.setDialogVisible(false)
          let layerPath = this.currentTabRefs[this.state.currentTabIndex].props
            .layerSelection.layerInfo.path

          let result

          if (this.type === 'MY_DATA') {
            result = await SMap.removeRecordsetFieldInfoByData(
              layerPath,
              this.deleteFieldData.name,
            )
          }else if(this.type === 'NAVIGATION'){
            result = await SMap.removeNavigationRecordsetFieldInfoByData(
              layerPath,
              this.deleteFieldData.name,
            )
            if(result){
              SMap.refreshMap()
            }
          } else {
            result = await SMap.removeRecordsetFieldInfo(
              layerPath,
              false,
              this.deleteFieldData.name,
            )
          }

          if (result) {
            Toast.show(
              getLanguage(this.props.language).Prompt.ATTRIBUTE_DELETE_SUCCESS,
            )
            this.props.clearAttributeHistory &&
              this.props.clearAttributeHistory()
            this.currentTabRefs[this.state.currentTabIndex].getAttribute(
              {
                type: 'reset',
                currentPage: this.currentTabRefs[this.state.currentTabIndex]
                  .currentPage,
                startIndex: 0,
                relativeIndex: 0,
                currentIndex: 0,
              },
              () => { },
            )
          } else {
            Toast.show(
              getLanguage(this.props.language).Prompt.ATTRIBUTE_DELETE_FAILED,
            )
          }
        }}
        confirmBtnTitle={getLanguage(this.props.language).CONFIRM}
        cancelBtnTitle={getLanguage(this.props.language).Prompt.CANCEL}
        opacity={1}
        cancelAction={() => {
          this.deleteFieldDialog.setDialogVisible(false)
        }}
        title={getLanguage(this.props.language).Prompt.ATTRIBUTE_DELETE_CONFIRM}
        info={getLanguage(this.props.language).Prompt.ATTRIBUTE_DELETE_TIPS}
      />
    )
  }

  goToPage = index => {
    this.state.currentTabIndex !== index &&
    this.setState({
      currentTabIndex: index,
    })
  }

  _getRoutes = () => {
    const routes = []
    this.props.selection.forEach(item => {
      routes.push({
        key: item.layerInfo.name,
        title: item.layerInfo.name,
      })
    })
    return routes
  }

  _renderTabBar = props => (
    <TabBar
      {...props}
      scrollEnabled={true}
      indicatorStyle={{
        backgroundColor: 'rgba(70,128,223,1.0)',
        height: scaleSize(3),
        width: scaleSize(30),
        marginLeft: screen.getScreenWidth(this.props.device.orientation) / 2 / 2 - 10,
      }}
      style={{
        height: scaleSize(80),
        marginTop: scaleSize(20),
        borderWidth: 0,
        backgroundColor: color.white,
        elevation: 0,
        shadowRadius: 0,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
      }}
      labelStyle={{
        color: 'black',
        // fontWeight: true ? 'bold' : 'normal',
        fontSize: size.fontSize.fontSizeLg,
        textAlign: 'center',
      }}
      activeColor={'rgba(70,128,223,1.0)'}
    />
  )

  renderScene = (() => {
    const data = {}
    this.props.selection.map((item, index) => {
      data[item.layerInfo.name] = () => this.renderTable({
        data: this.props.selection[index],
        index: index,
      })
    })
    return SceneMap(data)
  })()

  renderTabs = () => {
    return (
      <TabView
        lazy
        navigationState={{
          index: this.state.currentTabIndex,
          routes: this.state.routes,
        }}
        onIndexChange={this.goToPage}
        renderTabBar={() => null}
        renderScene={this.renderScene}
        swipeEnabled={false}
      />
    )
  }

  renderTable = ({ data, index = 0 }) => {
    return (
      <LayerSelectionAttribute
        ref={ref => {
          this.currentTabRefs[index] = ref
        }}
        key={index}
        tabLabel={data.layerInfo.name || ('图层' + index >= 0 ? index + 1 : '')}
        contentContainerStyle={{ backgroundColor: color.bgW }}
        // currentAttribute={this.props.currentAttribute}
        // currentLayer={this.props.currentLayer}
        map={this.props.map}
        layerSelection={data}
        attributesHistory={this.props.attributesHistory}
        setLoading={this.setLoading}
        setCurrentAttribute={this.props.setCurrentAttribute}
        setLayerAttributes={this.props.setLayerAttributes}
        setDataAttributes={this.props.setDataAttributes}
        setNaviAttributes={this.props.setNaviAttributes}
        setAttributeHistory={this.props.setAttributeHistory}
        selectAction={this.selectAction}
        onGetAttribute={this.onGetAttribute}
        onGetToolVisible={this.onGetToolVisible}
        onAttributeFieldDelete={this.onAttributeFieldDelete}
        showAddModal={this.showLayerAddView}
        isShowSystemFields={this.state.isShowSystemFields}
        navigation={this.props.navigation}
        route={this.props.route}
        selection={this.props.selection}
        refreshCurrent={()=>{this.setState({currentIndex:-1})}}
        type={this.type}
        datasetName={this.datasetName}
      />
    )
  }

  renderEditControllerView = () => {
    const paddingBottom = screen.isIphoneX() && this.props.device.orientation.indexOf('LANDSCAPE') === 0 ? screen.X_BOTTOM_L : 0
    return (
      <View
        style={{
          width: '100%',
          height: scaleSize(100) + paddingBottom,
          ...screen.getIphonePaddingHorizontal(
            this.props.device.orientation,
          ),
        }}
      >
        <View
          style={[styles.editControllerView, {
            height: scaleSize(100) + paddingBottom,
            paddingBottom,
          }]}
        >
          <MTBtn
            key={'undo'}
            title={getLanguage(this.props.language).Map_Attribute.ATTRIBUTE_UNDO}
            //{'撤销'}
            style={styles.button}
            textColor={!this.state.canBeUndo && color.contentColorGray}
            image={
              this.state.canBeUndo
                ? getThemeAssets().edit.icon_undo
                : getThemeAssets().edit.icon_undo_ash
            }
            imageStyle={styles.headerBtn}
            onPress={() => this.setAttributeHistory('undo')}
          />
          <MTBtn
            key={'redo'}
            title={getLanguage(this.props.language).Map_Attribute.ATTRIBUTE_REDO}
            //{'恢复'}
            style={styles.button}
            image={
              this.state.canBeRedo
                ? getThemeAssets().edit.icon_redo
                : getThemeAssets().edit.icon_redo_ash
            }
            imageStyle={styles.headerBtn}
            textColor={!this.state.canBeRedo && color.contentColorGray}
            onPress={() => this.setAttributeHistory('redo')}
          />
          <MTBtn
            key={'revert'}
            title={
              getLanguage(this.props.language).Map_Attribute.ATTRIBUTE_REVERT
            }
            //{'还原'}
            style={styles.button}
            textColor={!this.state.canBeRevert && color.contentColorGray}
            image={
              this.state.canBeRevert
                ? getThemeAssets().edit.icon_back_off
                : getThemeAssets().edit.icon_back_off_ash
            }
            imageStyle={styles.headerBtn}
            onPress={() => this.setAttributeHistory('revert')}
          />
          <View style={styles.button} />
        </View>
      </View>
    )
  }

  _renderHeader = () => {
    let itemWidth =
      this.props.device.orientation.indexOf('LANDSCAPE') === 0 ? 100 : 65
    let size =
      this.props.device.orientation.indexOf('LANDSCAPE') === 0 ? 40 : 50

    let buttons = []
    if (this.type !== 'MAP_3D') {
      if (!this.state.isCollection) {
        buttons = [
          <MTBtn
            key={'attribute'}
            image={
              this.state.isShowSystemFields
                ? getThemeAssets().attribute.icon_attribute_hide
                : getThemeAssets().attribute.icon_attribute_show
            }
            imageStyle={{ width: scaleSize(size), height: scaleSize(size) }}
            onPress={this.showSystemFields}
          />,
          <MTBtn
            key={'undo'}
            image={getPublicAssets().common.icon_undo}
            imageStyle={{ width: scaleSize(size), height: scaleSize(size) }}
            onPress={this.showUndoView}
          />,
          <MTBtn
            key={'search'}
            image={getPublicAssets().common.icon_search}
            imageStyle={{ width: scaleSize(size), height: scaleSize(size) }}
            onPress={this.goToSearch}
          />,
        ]
        if(this.type === 'MY_DATA'||this.type === 'NAVIGATION'){
          buttons.splice(1,1)
        }
      } else {
        buttons = [
          <MTBtn
            key={'attribute'}
            image={
              this.state.isShowSystemFields
                ? getThemeAssets().attribute.icon_attribute_hide
                : getThemeAssets().attribute.icon_attribute_show
            }
            imageStyle={{ width: scaleSize(size), height: scaleSize(size) }}
            onPress={this.showSystemFields}
          />,
          <MTBtn
            key={'undo'}
            image={getPublicAssets().common.icon_undo}
            imageStyle={{ width: scaleSize(size), height: scaleSize(size) }}
            onPress={this.showUndoView}
          />,
        ]
      }
    }
    return (
      <View
        style={{
          width: scaleSize(itemWidth * buttons.length),
          flexDirection: 'row',
          justifyContent: buttons.length === 1 ? 'flex-end' : 'space-between',
          alignItems: 'center',
        }}
      >
        {buttons}
      </View>
    )
  }

  render() {
    const dsDescription = LayerUtils.getDatasetDescriptionByLayer(this.props.currentLayer)
    return (
      <Container
        ref={ref => (this.container = ref)}
        showFullInMap={true}
        headerProps={{
          title: getLanguage(this.props.language).Map_Label.ATTRIBUTE,
          navigation: this.props.navigation,
          backAction: this.back,
          headerTitleViewStyle: {
            justifyContent: 'flex-start',
            marginLeft: scaleSize(90),
          },
          headerRight: this._renderHeader(),
        }}
        style={styles.container}
      >
        <LayerTopBar
          hasTabBtn
          hasAddField={!global.coworkMode}
          hasCamera={global.coworkMode && this.state.isMediaLayer || !global.coworkMode} // 协作中若原始数据不带多媒体的图层不能进行多媒体采集
          orientation={this.props.device.orientation}
          tabsAction={this.showDrawer}
          canLocated={this.state.attributes.data.length > 1}
          canRelated={this.state.currentIndex >= 0}
          canDelete={this.state.currentIndex >= 0}
          relateAction={this.relateAction}
          deleteAction={this.deleteAction}
          locateAction={this.showLocationView}
          canAddField={!(dsDescription?.url && dsDescription?.type === 'onlineService')}
          addFieldAction={() => this.showLayerAddView(true)}
          attributesData={this.state.attributes.head}
          currentIndex={this.state.currentIndex}
          refreshAction={this.refreshAction}
          selectionAttribute={this.state.isCollection}
          islayerSelection={true}
          type={this.type}
          attributes={this.state.attributes}
          currentTask={this.props.currentTask}
          currentUser={this.props.currentUser}
          layerInfo={
            this.props.selection?.[this.state.currentTabIndex]?.layerInfo?.name
              ? this.props.selection?.[this.state.currentTabIndex]?.layerInfo
              : this.props.currentLayer
          }
          // layerName={this.props.selection?.[this.state.currentTabIndex]?.layerInfo?.name || this.props.currentLayer.name}
        />
        {this.state.isShowView && (
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'flex-start',
            }}
          >
            {this.props.selection && this.props.selection.length > 0 ? (
              this.props.selection.length > 1 ? (
                this.renderTabs()
              ) : (
                this.renderTable({
                  data: this.props.selection[0],
                  index: 0,
                })
              )
            ) : (
              <View style={{ flex: 1 }} />
            )}
            <LocationView
              language={this.props.language}
              ref={ref => (this.locationView = ref)}
              style={styles.locationView}
              currentIndex={
                // this.currentPage * PAGE_SIZE + this.state.currentIndex
                this.state.currentIndex
              }
              locateToTop={this.locateToTop}
              locateToBottom={this.locateToBottom}
              locateToPosition={this.locateToPosition}
            />
          </View>
        )}
        {this.state.isShowDrawer && (
          <TouchableOpacity
            activeOpacity={1}
            style={styles.drawerOverlay}
            onPress={() => this.showDrawer(false)}
          />
        )}
        <PopModal
          ref={ref => (this.popModal = ref)}
          modalVisible={this.state.editControllerVisible}
        >
          {this.renderEditControllerView()}
        </PopModal>

        <LayerAttributeAdd
          ref={ref => (this.addPopModal = ref)}
          contentStyle={{
            height:
              this.props.device.orientation.indexOf('LANDSCAPE') >= 0
                ? '100%'
                : '80%',
            width:
              this.props.device.orientation.indexOf('LANDSCAPE') >= 0
                ? '40%'
                : '100%',
            right: 0,
            left:
              this.props.device.orientation.indexOf('LANDSCAPE') >= 0
                ? '60%'
                : 0,
          }}
          navigation={this.props.navigation}
          device={this.props.device}
          currentAttribute={this.props.currentAttribute}
          setCurrentAttribute={this.props.setCurrentAttribute}
          data={
            this.state.attributes.head.length > 1 &&
            this.state.attributes.head[this.state.attributes.head.length - 1]
          }
          addAttributeField={this.addAttributeField}
          backAction={() => {
            this.addPopModal && this.addPopModal.setVisible(false)
          }}
        />
        <DrawerBar
          ref={ref => (this.drawer = ref)}
          data={this.props.selection}
          index={this.state.currentTabIndex}
          onChange={this.drawerOnChange}
        />
        {this.renderDeleteFieldDialog()}
      </Container>
    )
  }
}
