import * as React from 'react'
import {
  TouchableOpacity,
  View,
  Image,
  Text,
  DeviceEventEmitter,
  FlatList,
  NativeModules,
  NativeEventEmitter,
  Platform,
} from 'react-native'
import NavigationService from '../../containers/NavigationService'
import { getThemeAssets } from '../../assets'
import {
  SMCollectSceneFormView,
  SCollectSceneFormView,
  SMap,
  DatasetType,
} from 'imobile_for_reactnative'
import Orientation from 'react-native-orientation'
import styles from './styles'
import { Container, Dialog, ImageButton } from '../../components'
import { FileTools } from '../../native'
import { getLanguage } from '../../language'
import { color } from '../../styles'
import { Toast, dataUtil, scaleSize, LayerUtils,setSpText } from '../../utils'
import ToolbarModule from '../workspace/components/ToolBar/modules/ToolbarModule'
import { ConstPath, UserType } from '../../constants'

let nativeSCollectSceneFormView = NativeModules.SCollectSceneFormView
const nativeEvt = new NativeEventEmitter(nativeSCollectSceneFormView)

/*
 * AR高精度采集界面
 */
export default class CollectSceneFormView extends React.Component {
  props: {
    navigation: Object,
    language: String,
    user: Object,
    nav: Object,
    currentLayer: SMap.LayerInfo,
  }

  constructor(props) {
    super(props)
    const { params } = this.props.navigation.state || {}
    // this.datasourceAlias = params.datasourceAlias || ''
    // this.datasetName = params.datasetName
    // this.datasetPointName = params.datasetPointName
    // 保存记录的数据集，使用当前数据集或者默认标注图层数据集，见this._checkSaveDatset() by zcj
    this.datasourceAlias = ""
    this.datasetName = ""
    this.datasetPointName = ""
    // 判断当前图层类型，用于禁用保存按钮
    // this.disablePoint = true
    // this.disableLine = true
    // this.disableRegion = true

    this.datumPoint = params.point
    this.SceneViewVisible = true
    this.isRecording = true
    this.isNewCreate = false

    const layerType = LayerUtils.getLayerType(GLOBAL.currentLayer)
    let disablePoint = true,
      disableArea = true,
      disbaleLine = true
    // 如果当前没有图层或类型不满足，不能绘制
    // 如果是CAD或者标注图层，则可以绘制点线面 by zcj
    if (["CADLAYER", "TAGGINGLAYER"].indexOf(layerType) != -1) {
      disablePoint = false
      disbaleLine = false
      disableArea = false
    } else if (layerType === "POINTLAYER") {
      disablePoint = false
    } else if (layerType === "REGIONLAYER") {
      disableArea = false
    } else if (layerType === "LINELAYER") {
      disbaleLine = false
    }

    this.data = [
      {
        //新建开始
        key: 'replease',
        title: getLanguage(GLOBAL.language).Map_Main_Menu
          .MAP_AR_AI_ASSISTANT_NEWDATA,
        action: () => { this.switchStatus() },
        size: 'large',
        image: getThemeAssets().ar.toolbar.icon_new,
      },
      {
        //清除
        key: 'critical',
        title: getLanguage(GLOBAL.language).Map_Main_Menu.MAP_AR_AI_CLEAR,
        action: () => { this.clearAll() },
        size: 'large',
        image: getThemeAssets().ar.toolbar.icon_delete,
      },
      {
        //线
        key: 'line',
        title: getLanguage(GLOBAL.language).Map_Main_Menu.MAP_AR_AI_SAVE_LINE,
        action: () => {
          if (!disbaleLine) {
            this.save()
          } else {
            Toast.show(getLanguage(GLOBAL.language).Prompt.PLEASE_CHOOSE_LINE_LAYER)
          }
        },
        size: 'large',
        image: getThemeAssets().ar.toolbar.icon_save_line,
      },
      {
        //保存点
        key: 'POINT',
        title: getLanguage(GLOBAL.language).Map_Main_Menu
          .MAP_AR_AI_SAVE_POINT,
        action: () => {
          if (!disablePoint) {
            this.savepoint()
          } else {
            Toast.show(getLanguage(GLOBAL.language).Prompt.PLEASE_CHOOSE_POINT_LAYER)
          }
        },
        size: 'large',
        image: getThemeAssets().ar.toolbar.icon_save_spot,
      },
      {
        //保存面
        key: 'REGION',
        title: getLanguage(GLOBAL.language).Map_Main_Menu
          .MAP_AR_AI_SAVE_REGION,
        action: () => {
          if (!disableArea) {
            this.saveRegion()
          } else {
            Toast.show(getLanguage(GLOBAL.language).Prompt.PLEASE_CHOOSE_REGION_LAYER)
          }
        },
        size: 'large',
        image: getThemeAssets().ar.toolbar.icon_save_region,
      },
    ]


    this.switchdata = [
      {
        //占位
        key: 'replease',
        title: '',
        action: ()=>{},
        size: 'large',
      },
      {
        //轨迹
        key: 'critical',
        title: getLanguage(GLOBAL.language).Map_Main_Menu
          .MAP_AR_AI_SCENE_TRACK_COLLECT,
        action: ()=>{ this.trackCollect()},
        size: 'large',
        image: getThemeAssets().collection.icon_track_start,
      },
      {
        //点
        key: 'point',
        title: getLanguage(GLOBAL.language).Map_Main_Menu
          .MAP_AR_AI_SCENE_POINT_COLLECT,
        action: ()=>{ this.pointCollect()},
        size: 'large',
        image: require('../../assets/mapTools/icon_point_black.png'),
      },
      {
        //占位
        key: 'replease',
        title: '',
        action: ()=>{},
        size: 'large',
      },
    ]

    this.state = {
      totalLength: 0,
      showHistory: false,
      historyData: Array,
      showbuttons: true,
      showSwithchButtons: false,
      isClickCollect: true, //是否是打点采集
      /** 是否打点采集了第一个点 */
      isClickFirst: false,
      isLine: true,
      leftcolor: {
        color: 'black',
      },
      rightcolor: {
        color: 'black',
      },
      collectData: this.datasourceAlias,
      chooseDataSource: false,
      isnew: false,
      data: this.data,
    }
    this.clickAble = true // 防止重复点击
  }

  // eslint-disable-next-line
  componentWillMount() {
    SMap.setDynamicviewsetVisible(false)
    Orientation.lockToPortrait()
  }

  async componentDidMount() {
    //安排任务在交互和动画完成之后执行
    // setTimeout(async () => {
    //   // 初始化数据
    //   let udbPath = await FileTools.appendingHomeDirectory(
    //     ConstPath.UserPath +
    //       this.props.user.currentUser.userName +
    //       '/' +
    //       ConstPath.RelativeFilePath.AR,
    //   )
    //   await SCollectSceneFormView.initSceneFormView(
    //     this.datasourceAlias,
    //     this.datasetName,
    //     this.datasetPointName,
    //     this.props.language,
    //     udbPath,
    //   )

    //   let point = this.datumPoint

    //   //设置基点
    //   SCollectSceneFormView.fixedPosition(false, point.x, point.y, 0)
    //   SCollectSceneFormView.startRecording()
    // }, 500)

    // this.DatumPointDialog.setDialogVisible(true)
    GLOBAL.Loading.setLoading(true)
    //注册监听
    if (Platform.OS === 'ios') {
      nativeEvt.addListener('onTotalLengthChanged', this.onTotalLengthChanged)
    } else {
      DeviceEventEmitter.addListener(
        'onTotalLengthChanged',
        this.onTotalLengthChanged,
      )
    }

    // 判断图层类型，是否显示相应保存按钮
    await this._checkSaveDatset()
  }

  componentWillUnmount() {
    SMap.setDynamicviewsetVisible(true)
    Orientation.unlockAllOrientations()
    //移除监听
    if (Platform.OS === 'ios') {
      nativeEvt.removeListener(
        'onTotalLengthChanged',
        this.onTotalLengthChanged,
      )
    } else {
      DeviceEventEmitter.removeListener(
        'onTotalLengthChanged',
        this.onTotalLengthChanged,
      )
    }
  }

  // 判断图层类型，是否显示相应保存按钮
  _checkSaveDatset = () => {
    // 没有选择图层或者类型不正确时，外部按钮被禁用，所以不用判断是否有当前图层
    let layerType = layerType = LayerUtils.getLayerType(GLOBAL.currentLayer)
    const {datasourceAlias,datasetName}=GLOBAL.currentLayer
    this.datasourceAlias = datasourceAlias
    this.datasetName = datasetName
    this.datasetPointName = datasetName

    // 判断当前图层类型，如果是CAD/标注图层，可以保存点线面，否则只能保存对应类型
    // if(["CADLAYER","TAGGINGLAYER"].indexOf(layerType) != -1){
    //   this.disablePoint = false
    //   this.disableLine = false
    //   this.disableRegion = false
    // }else if (layerType === "POINTLAYER"){
    //   this.disablePoint = false
    // } else if(layerType === "REGIONLAYER"){
    //   this.disableRegion = false
    // }else if(layerType === "LINELAYER"){
    //   this.disableLine = false
    // }
  }

  /** 判断是否可以使用相应采集功能 */
  shouldShow = (type: 'point' | 'line' | 'region'): boolean => {
    if(this.props.currentLayer.themeType !== 0) return false
    if(this.props.currentLayer.type === DatasetType.CAD) return true
    switch(type) {
      case 'point':
        return this.props.currentLayer.type === DatasetType.POINT
      case 'line':
        return this.props.currentLayer.type === DatasetType.LINE
      case 'region':
        return this.props.currentLayer.type === DatasetType.REGION
    }
  }

  _initData = async () => {
    let udbPath = await FileTools.appendingHomeDirectory(
      ConstPath.UserPath +
        this.props.user.currentUser.userName +
        '/' +
        ConstPath.RelativeFilePath.AR,
    )

    await SCollectSceneFormView.initSceneFormView(
      this.datasourceAlias,
      this.datasetName,
      this.datasetPointName,
      this.props.language,
      udbPath,
    )

    // let point = this.datumPoint
    let DatumPointDialogTemp = this.DatumPointDialog
    setTimeout(function() {
      //设置基点
      // SCollectSceneFormView.fixedPosition(false, point.x, point.y, 0)
      // SCollectSceneFormView.startRecording()
      GLOBAL.Loading.setLoading(false)
      DatumPointDialogTemp.setDialogVisible(true)
    }, 500)
  }

  _onGetInstance = async view => {
    this.view = view
    SCollectSceneFormView.setViewMode(1)
    this._initData()
  }

  onTotalLengthChanged = params => {
    this.setState({
      totalLength: params.totalLength,
    })
  }

  /** 新建开始 **/
  switchStatus = async () => {
    // this.isRecording = !this.isRecording
    // if (this.isRecording) {
    //   Toast.show(
    //     getLanguage(GLOBAL.language).Map_Main_Menu
    //       .MAP_AR_AI_ASSISTANT_SCENE_FORM_COLLECT_START,
    //   )
    //   await SCollectSceneFormView.startRecording()
    // } else {
    Toast.show(
      getLanguage(GLOBAL.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_SCENE_FORM_COLLECT_START,
    )
    await SCollectSceneFormView.startRecording()
    this.setState({ isnew: true })
    this.isNewCreate = true
    // }
  }

  /** 切换视角 **/
  switchViewMode = async () => {
    await SCollectSceneFormView.switchViewMode()
  }

  /** 历史 **/
  history = async () => {
    let data = await SCollectSceneFormView.getHistoryData()
    NavigationService.navigate('CollectSceneFormHistoryView', {
      history: data?.history || [],
      datasourceAlias: this.datasourceAlias,
    })
  }

  /** 设置 */
  setting = () => {
    NavigationService.navigate('CollectSceneFormSet', {
      point: this.datumPoint,
      fixedPositions: point => {
        NavigationService.goBack()
        SCollectSceneFormView.fixedPosition(false, point.x, point.y, 0)
      },
      collectScene: true,
    })
  }

  /** 清除 **/
  clearAll = async () => {
    await SCollectSceneFormView.clearData()
    this.setState({
      totalLength: 0,
    })
  }

  /** 轨迹式 **/
  trackCollect = () => {
    try {
      SCollectSceneFormView.setViewMode(0)
      this.setState({
        showbuttons: true,
        showSwithchButtons: false,
        isClickCollect: false,
        data:this.data,
      })
    } catch (e) {
      () => {}
    }
  }

  /** 打点式 **/
  pointCollect = () => {
    try {
      SCollectSceneFormView.setViewMode(1)
      this.setState({
        // showbuttons: true,
        showSwithchButtons: false,
        showbuttons:true,
        isClickCollect: true,
        data:this.data,
      })
    } catch (e) {
      () => {}
    }
  }

  /** 保存 **/
  save = async () => {
    try {
      GLOBAL.Loading.setLoading(
        true,
        getLanguage(GLOBAL.language).Map_Main_Menu.MAP_AR_AI_SAVE_LINE,
      )
      if(this.props.currentLayer.datasourceAlias && this.props.currentLayer.datasetName) {
        await SCollectSceneFormView.setCurrentLayer(
          this.props.currentLayer.datasourceAlias,
          this.props.currentLayer.datasetName
        )
      }
      await SCollectSceneFormView.stopRecording()
      let result = await SCollectSceneFormView.saveData('line')
      await SCollectSceneFormView.routeAdd()
      GLOBAL.Loading.setLoading(false)
      this.setState({ isnew: false })
      if (result) {
        Toast.show(
          getLanguage(GLOBAL.language).Map_Main_Menu.MAP_AR_AI_SAVE_SUCCESS,
        )
      } else {
        Toast.show(getLanguage(GLOBAL.language).Prompt.SAVE_FAILED)
      }
    } catch (e) {
      GLOBAL.Loading.setLoading(false)
      Toast.show(getLanguage(GLOBAL.language).Prompt.SAVE_FAILED)
    }
    // NavigationService.navigate('InputPage', {
    //   headerTitle: getLanguage(GLOBAL.language).Map_Main_Menu
    //     .MAP_AR_AI_ASSISTANT_SCENE_FORM_COLLECT,
    //   value: '',
    //   placeholder: getLanguage(GLOBAL.language).Map_Main_Menu
    //     .MAP_AR_AI_ASSISTANT_SCENE_FORM_COLLECT_NAME,
    //   type: 'name',
    //   cb: async value => {
    //     NavigationService.goBack()
    //     await SCollectSceneFormView.saveData(value)
    //     this.setState({ isnew: false })
    //   },
    // })
  }

  /** 保存面 */
  saveRegion = async () => {
    try {
      GLOBAL.Loading.setLoading(
        true,
        getLanguage(GLOBAL.language).Map_Main_Menu.MAP_AR_AI_SAVE_REGION,
      )
      if(this.props.currentLayer.datasourceAlias && this.props.currentLayer.datasetName) {
        await SCollectSceneFormView.setCurrentLayer(
          this.props.currentLayer.datasourceAlias,
          this.props.currentLayer.datasetName
        )
      }
      await SCollectSceneFormView.stopRecording()
      let result = await SCollectSceneFormView.saveRegionData()
      await SCollectSceneFormView.routeAdd()
      GLOBAL.Loading.setLoading(false)
      this.setState({ isnew: false })
      if (result) {
        Toast.show(
          getLanguage(GLOBAL.language).Map_Main_Menu.MAP_AR_AI_SAVE_SUCCESS,
        )
      } else {
        Toast.show(getLanguage(GLOBAL.language).Prompt.SAVE_FAILED)
      }
    } catch (e) {
      GLOBAL.Loading.setLoading(false)
      Toast.show(getLanguage(GLOBAL.language).Prompt.SAVE_FAILED)
    }
  }
  /** 保存点 **/
  savepoint = async () => {
    try {
      GLOBAL.Loading.setLoading(
        true,
        getLanguage(GLOBAL.language).Map_Main_Menu.MAP_AR_AI_SAVE_POINT,
      )
      if(this.props.currentLayer.datasourceAlias && this.props.currentLayer.datasetName) {
        await SCollectSceneFormView.setCurrentLayer(
          this.props.currentLayer.datasourceAlias,
          this.props.currentLayer.datasetName
        )
      }
      // await SCollectSceneFormView.stopRecording()
      let result =  await SCollectSceneFormView.saveGPSData('point')
      GLOBAL.Loading.setLoading(false)
      this.setState({ isnew: false })
      if (result) {
        Toast.show(
          getLanguage(GLOBAL.language).Map_Main_Menu.MAP_AR_AI_SAVE_SUCCESS,
        )
      } else {
        Toast.show(getLanguage(GLOBAL.language).Prompt.SAVE_FAILED)
      }
    } catch (e) {
      GLOBAL.Loading.setLoading(false)
      Toast.show(getLanguage(GLOBAL.language).Prompt.SAVE_FAILED)
    }
    // NavigationService.navigate('InputPage', {
    //   headerTitle: getLanguage(GLOBAL.language).Map_Main_Menu
    //     .MAP_AR_AI_ASSISTANT_SCENE_FORM_COLLECT,
    //   value: '',
    //   placeholder: getLanguage(GLOBAL.language).Map_Main_Menu
    //     .MAP_AR_AI_ASSISTANT_SCENE_FORM_COLLECT_NAME,
    //   type: 'name',
    //   cb: async value => {
    //     NavigationService.goBack()
    //     await SCollectSceneFormView.saveGPSData(value)
    //     this.setState({ isnew: false })
    //   },
    // })
  }

  /** 打点采集时添加点 */
  addNewRecord = () => {
    SCollectSceneFormView.addPoint()
    if(!this.state.isClickFirst) {
      this.setState({
        isClickFirst: true,
      })
    }
  }

  back = async () => {
    if (this.clickAble) {
      this.clickAble = false
      setTimeout(() => {
        this.clickAble = true
      }, 1500)
      // if (GLOBAL.arSwitchToMap) {
      //   GLOBAL.arSwitchToMap = false
      //   GLOBAL.toolBox && GLOBAL.toolBox.switchAr()
      // }
      await SCollectSceneFormView.onDestroy()
      NavigationService.goBack('CollectSceneFormView')

      GLOBAL.toolBox && GLOBAL.toolBox.removeAIDetect(false)
      if(GLOBAL.arSwitchToMap){
        GLOBAL.toolBox.switchAr()
      }
      return true
    }
  }

  _renderItemSeparatorComponent = () => {
    return <View style={styles.ItemSeparatorComponent} />
  }

  _keyExtractor = item => item.name + item.index

  cancel = async () => {
    if (this.state.chooseDataSource) {
      let data = await SCollectSceneFormView.getHistoryData()
      if (data && data.history.length > 0) {
        this.setState({
          showHistory: true,
          showbuttons: false,
          historyData: data.history,
          chooseDataSource: false,
        })
      } else {
        this.setState({
          showHistory: true,
          showbuttons: false,
          historyData: [],
          chooseDataSource: false,
        })
      }
    } else {
      this.setState({
        showHistory: false,
        showbuttons: true,
      })
    }
  }

  renderDialog = () => {
    return (
      <Dialog
        ref={ref => (this.DatumPointDialog = ref)}
        // type={'modal'}
        cancelBtnVisible={false}
        confirmBtnTitle={getLanguage(GLOBAL.language).Prompt.CONFIRM}
        confirmAction={async () => {
          let point = this.datumPoint
          //设置基点
          // SCollectSceneFormView.startRecording()
          await SCollectSceneFormView.clearData()
          SCollectSceneFormView.fixedPosition(false, point.x, point.y, 0)
          this.DatumPointDialog.setDialogVisible(false)
        }}
        opacity={1}
        opacityStyle={styles.opacityView}
        style={styles.dialogBackground}
      >
        {this.renderLicenseDialogChildren()}
      </Dialog>
    )
  }

  renderLicenseDialogChildren = () => {
    return (
      <View style={styles.dialogHeaderView}>
        <Image
          source={require('../../assets/home/Frenchgrey/icon_prompt.png')}
          style={styles.dialogHeaderImg}
        />
        <Text style={styles.promptTitle}>
          {
            getLanguage(GLOBAL.language).Profile
              .MAP_AR_DATUM_PLEASE_TOWARDS_NORTH
          }
        </Text>
      </View>
    )
  }

  getDatasource = async () => {
    let userUDBPath, userUDBs
    //过滤掉标注和标绘匹配正则
    let checkLabelAndPlot = /^(Label_|PlotEdit_(.*)@)(.*)((#$)|(#_\d+$)|(##\d+$))/
    if (
      ToolbarModule.getParams().user &&
      ToolbarModule.getParams().user.currentUser.userName &&
      ToolbarModule.getParams().user.currentUser.userType !==
        UserType.PROBATION_USER
    ) {
      let userPath =
        (await FileTools.appendingHomeDirectory(ConstPath.UserPath)) +
        ToolbarModule.getParams().user.currentUser.userName +
        '/'
      userUDBPath = userPath + ConstPath.RelativePath.Datasource
      userUDBs = await FileTools.getPathListByFilter(userUDBPath, {
        extension: 'udb',
        type: 'file',
      })
      //过滤掉标注和标绘
      let filterUDBs = userUDBs.filter(item => {
        item.name = dataUtil.getNameByURL(item.path)
        return !item.name.match(checkLabelAndPlot)
      })
      filterUDBs.map(item => {
        item.image = getThemeAssets().dataType.icon_data_source
        item.info = {
          infoType: 'mtime',
          lastModifiedDate: item.mtime,
        }
      })
      this.setState({
        showHistory: true,
        historyData: filterUDBs,
        chooseDataSource: true,
      })
    } else {
      let customerUDBPath = await FileTools.appendingHomeDirectory(
        ConstPath.CustomerPath + ConstPath.RelativePath.Datasource,
      )
      let customerUDBs = await FileTools.getPathListByFilter(customerUDBPath, {
        extension: 'udb',
        type: 'file',
      })
      //过滤掉标注和标绘
      let filterUDBs = customerUDBs.filter(item => {
        item.name = dataUtil.getNameByURL(item.path)
        return !item.name.match(checkLabelAndPlot)
      })
      filterUDBs.map(item => {
        item.image = getThemeAssets().dataType.icon_data_source
        item.info = {
          infoType: 'mtime',
          lastModifiedDate: item.mtime,
        }
      })
      this.setState({
        showHistory: true,
        historyData: filterUDBs,
        chooseDataSource: true,
      })
    }
  }

  changeSelect = async item => {
    let newData = this.state.historyData
    item.select = !item.select
    newData[item.index] = item
    this.setState({
      historyData: newData.concat(),
    })
  }

  onChooseDataSource = async item => {
    await SCollectSceneFormView.setDataSource(item.name, item.path)
    let data = await SCollectSceneFormView.getHistoryData()
    if (data && data.history.length > 0) {
      this.setState({
        showHistory: true,
        showbuttons: false,
        historyData: data.history,
        isLine: true,
        collectData: item.name,
        leftcolor: {
          color: color.blue1,
        },
        rightcolor: {
          color: 'black',
        },
        chooseDataSource: false,
      })
    } else {
      this.setState({
        showHistory: true,
        showbuttons: false,
        historyData: [],
        isLine: true,
        collectData: item.name,
        leftcolor: {
          color: color.blue1,
        },
        rightcolor: {
          color: 'black',
        },
        chooseDataSource: false,
      })
    }
  }

  onHistoryItemPress = async item => {
    let isShowtrace = await SCollectSceneFormView.isShowTrace()
    if (!isShowtrace) {
      await SCollectSceneFormView.startRecording()
    }
    item.forEach(async item => {
      if (item.select) {
        let isline = await SCollectSceneFormView.isLineDataset(item.index)
        await SCollectSceneFormView.loadData(item.index, isline)
      }
    })
    this.setState({
      showHistory: false,
      showbuttons: true,
    })
  }

  renderItem = ({ item }) => {
    const visibleImgBlack = item.select
      ? require('../../assets/mapTools/icon_multi_selected_disable_black.png')
      : require('../../assets/mapTools/icon_multi_unselected_disable_black.png')
    let visibleImg = visibleImgBlack

    if (this.state.chooseDataSource) {
      return (
        <View style={styles.itemView}>
          <TouchableOpacity
            activeOpacity={0.6}
            style={styles.historyItem}
            onPress={() => {
              this.onChooseDataSource(item)
            }}
          >
            <Text style={styles.historyItemText}>{item.name}</Text>
          </TouchableOpacity>
        </View>
      )
    } else {
      return (
        <View style={styles.itemView}>
          <TouchableOpacity
            activeOpacity={0.6}
            style={styles.historySelect}
            onPress={() => {
              this.changeSelect(item)
            }}
          >
            <Image
              resizeMode={'contain'}
              style={styles.smallIcon}
              source={visibleImg}
            />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.6}
            style={styles.historyItem}
            onPress={() => {}}
          >
            <Text style={styles.historyItemText}>{item.name}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.deleteHistory(item)}
            style={styles.historyDelete}
          >
            <Image
              resizeMode={'contain'}
              source={getThemeAssets().ar.toolbar.icon_ar_toolbar_delete}
              style={styles.smallIcon}
            />
          </TouchableOpacity>
        </View>
      )
    }
  }

  deleteHistory = async item => {
    await SCollectSceneFormView.deleteData(item.index)
    let data
    data = await SCollectSceneFormView.getHistoryData()
    if (data) {
      this.setState({
        showHistory: true,
        historyData: data.history,
      })
    } else {
      this.setState({
        showHistory: true,
        historyData: [],
      })
      Toast.show(
        getLanguage(GLOBAL.language).Map_Main_Menu
          .MAP_AR_AI_ASSISTANT_SCENE_FORM_COLLECT_NO_HISTORY,
      )
    }
  }

  renderHistoryView = () => {
    return (
      <View style={styles.historyDataView}>
        <View style={styles.historypoint}>
          <TouchableOpacity
            onPress={async () => {
              this.getDatasource()
            }}
            style={styles.historyCloseIcon}
          >
            <Text style={[styles.historyTitle]}>{this.state.collectData}</Text>
            <Image
              resizeMode={'contain'}
              source={getThemeAssets().ar.toolbar.icon_down}
              style={styles.smallIcons}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            width: '100%',
            height: scaleSize(3),
            backgroundColor: 'black',
          }}
        />
        <FlatList
          data={this.state.historyData}
          ItemSeparatorComponent={this._renderItemSeparatorComponent}
          style={styles.list}
          renderItem={this.renderItem}
          keyExtractor={this._keyExtractor}
          extraData={this.state}
        />
        <View style={styles.listaction}>
          <TouchableOpacity
            onPress={() => {
              this.cancel()
            }}
            style={styles.btn_image}
          >
            <Text style={[styles.historyTitle]}>
              {getLanguage(GLOBAL.language).Map_Main_Menu.MAP_AR_AI_CANCEL}
            </Text>
          </TouchableOpacity>
          {!this.state.chooseDataSource && (
            <TouchableOpacity
              onPress={() => {
                this.onHistoryItemPress(this.state.historyData)
              }}
              style={styles.btn_image2}
            >
              <Text style={[styles.historyTitle]}>
                {getLanguage(GLOBAL.language).Map_Main_Menu.MAP_AR_AI_CONFIRM}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    )
  }

  renderBottomBtns = () => {
    return (
      <View style={styles.toolbar}>
        <View style={styles.buttonView}>

          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              height: scaleSize(150),
              marginTop: scaleSize(10),
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            {this.renderItems()}
          </View>
          {/* <TouchableOpacity
            onPress={() => this.switchStatus()}
            style={styles.iconView}
          >
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Image
                resizeMode={'contain'}
                source={getThemeAssets().ar.toolbar.icon_new}
                style={styles.smallIcon}
              />

              <Text style={styles.buttonname}>
                {
                  getLanguage(GLOBAL.language).Map_Main_Menu
                    .MAP_AR_AI_ASSISTANT_NEWDATA
                }
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.clearAll()}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Image
                resizeMode={'contain'}
                source={getThemeAssets().ar.toolbar.icon_delete}
                style={styles.smallIcon}
              />
              <Text style={styles.buttonname}>
                {getLanguage(GLOBAL.language).Map_Main_Menu.MAP_AR_AI_CLEAR}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.save()}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}
            disabled={!this.shouldShow('line')}
          >
            <View
              style={[{
                justifyContent: 'center',
                alignItems: 'center',
              }, !this.shouldShow('line') && {
                opacity: 0.2
              }]}
            >
              <Image
                resizeMode={'contain'}
                source={getThemeAssets().ar.toolbar.icon_save_line}
                style={styles.smallIcon}
              />
              <Text style={styles.buttonname}>
                {getLanguage(GLOBAL.language).Map_Main_Menu.MAP_AR_AI_SAVE_LINE}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.savepoint()}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}
            disabled={!this.shouldShow('point')}
          >
            <View
              style={[{
                justifyContent: 'center',
                alignItems: 'center',
              }, !this.shouldShow('point') && {
                opacity: 0.2
              }]}
            >
              <Image
                resizeMode={'contain'}
                source={getThemeAssets().ar.toolbar.icon_save_spot}
                style={styles.smallIcon}
              />
              <Text style={styles.buttonname}>
                {
                  getLanguage(GLOBAL.language).Map_Main_Menu
                    .MAP_AR_AI_SAVE_POINT
                }
              </Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => this.saveRegion()}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}
            disabled={!this.shouldShow('region')}
          >
             <View
              style={[{
                justifyContent: 'center',
                alignItems: 'center',
              }, !this.shouldShow('region') && {
                opacity: 0.2
              }]}
            >
              <Image
                resizeMode={'contain'}
                source={getThemeAssets().ar.toolbar.icon_save_region}
                style={styles.smallIcon}
              />
              <Text style={styles.buttonname}>
                {
                  getLanguage(GLOBAL.language).Map_Main_Menu
                    .MAP_AR_AI_SAVE_REGION
                }
              </Text>
            </View>
          </TouchableOpacity> */}


          {/* <TouchableOpacity
              onPress={() => this.switchViewMode()}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >

              <Image
                resizeMode={'contain'}
                source={getThemeAssets().ar.toolbar.ar_view_mode}
                style={styles.smallIcon}
              />

              <Text style={styles.buttonname}>
                {getLanguage(GLOBAL.language).Map_Main_Menu.MAP_AR_AI_CHANGE}
              </Text>
            </View>
          </TouchableOpacity> */}
        </View>
      </View>
    )
  }

  renderItems = () => {
    let items = []
    for (let i = 0; i < this.state.data.length; i++) {
      items.push(this.renderItem(this.state.data[i]))
    }
    return items
  }


  renderItem = (item) => {
    let backgroundColor = '#E5E5E6'
    if(item.image === undefined){
      backgroundColor = 'transparent'
    }
    return (
      <View
        style={{
          width: scaleSize(80),
          height: scaleSize(100),
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <TouchableOpacity
          onPress={item.action}
          style={[{
            width: scaleSize(80),
            height: scaleSize(80),
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: scaleSize(40),
            backgroundColor: backgroundColor,
          }]}
        >
          <Image
            resizeMode={'contain'}
            source={item.image}
            style={styles.smallIcon}
          />
        </TouchableOpacity>

        <Text
          style={[
            {
              marginTop: scaleSize(10),
              color: color.font_color_white,
              fontSize: setSpText(15),
              backgroundColor: 'transparent',
              textAlign: 'center',
            },
          ]}
        >
          {item.title}
        </Text>
      </View>
    )
  }


  renderBottomSwitchBtns = () => {
    return (
      <View style={styles.toolbar}>
        <View style={styles.buttonView}>

          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              height: scaleSize(150),
              marginTop: scaleSize(10),
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            {this.renderItems()}
          </View>



          {/* <TouchableOpacity
            onPress={() => {
              try {
                SCollectSceneFormView.setViewMode(0)
                this.setState({
                  showbuttons: true,
                  showSwithchButtons: false,
                  isClickCollect: false,
                })
              } catch (e) {
                () => {}
              }
            }}
            style={styles.iconView}
          >
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Image
                resizeMode={'contain'}
                // source={getThemeAssets().ar.toolbar.icon_new}
                source={getThemeAssets().collection.icon_track_start}
                style={styles.smallIcon}
              />

              <Text style={styles.buttonname}>
                {
                  getLanguage(GLOBAL.language).Map_Main_Menu
                    .MAP_AR_AI_SCENE_TRACK_COLLECT
                }
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              try {
                SCollectSceneFormView.setViewMode(1)
                this.setState({
                  showbuttons: true,
                  showSwithchButtons: false,
                  isClickCollect: true,
                })
              } catch (e) {
                () => {}
              }
            }}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Image
                resizeMode={'contain'}
                source={require('../../assets/mapTools/icon_point_black.png')}
                style={styles.smallIcon}
              />
              <Text style={styles.buttonname}>
                {
                  getLanguage(GLOBAL.language).Map_Main_Menu
                    .MAP_AR_AI_SCENE_POINT_COLLECT
                }
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}
          />
          <TouchableOpacity
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}
          /> */}
        </View>
      </View>
    )
  }

  renderBottomBtn() {
    return (
      <View style={styles.toolbarb}>
        <View style={styles.buttonViewb}>
          <TouchableOpacity
            onPress={() => {
              NavigationService.navigate('ChooseLayer')
            }}
            style={styles.iconView}
          >
            <Image
              resizeMode={'contain'}
              // source={getThemeAssets().ar.toolbar.icon_classify_settings}
              source={getThemeAssets().toolbar.icon_toolbar_option}
              style={styles.smallIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              if (this.state.showSwithchButtons) {
                this.setState({ showbuttons: false, showSwithchButtons: false })
              } else {
                this.setState({ showbuttons: false, showSwithchButtons: true ,data:this.switchdata})
              }
            }}
            style={styles.iconView}
          >
            <Image
              resizeMode={'contain'}
              source={getThemeAssets().toolbar.icon_toolbar_switch}
              style={styles.smallIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              if (this.state.showbuttons) {
                this.setState({ showbuttons: false, showSwithchButtons: false })
              } else {
                this.setState({ showbuttons: true, showSwithchButtons: false ,data:this.data})
              }
            }}
            style={styles.iconView}
          >
            <Image
              resizeMode={'contain'}
              // source={getThemeAssets().ar.toolbar.icon_flex}
              source={getThemeAssets().toolbar.icon_toolbar_style}
              style={styles.smallIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.setting()
            }}
            style={styles.iconView}
          >
            <Image
              resizeMode={'contain'}
              // source={getThemeAssets().ar.toolbar.ai_setting}
              source={getThemeAssets().toolbar.icon_toolbar_setting}
              style={styles.smallIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  renderLengthChangeView() {
    return (
      <View style={styles.lengthChangeView}>
        <Text style={styles.titleTotal}>
          {getLanguage(GLOBAL.language).Map_Main_Menu
            .MAP_AR_AI_ASSISTANT_SCENE_FORM_COLLECT_TOTALLENGTH +
            this.state.totalLength +
            'm'}
        </Text>
      </View>
    )
  }
  renderClickCollectHintView() {
    return (
      <View style={styles.clickHintView}>
        <Text style={styles.clickHintText}>
          {
            getLanguage(GLOBAL.language).Map_Main_Menu
              .MAP_AR_AI_SCENE_POINT_COLLECT_CLICK_HINT
          }
        </Text>
      </View>
    )
  }

  renderADDPoint = () => {
    let text
    GLOBAL.language === 'CN' ? text = '添加点' : text = 'Add Point'
    let image = getThemeAssets().ar.icon_ar_measure_add_toast
    // GLOBAL.language === 'CN' ? image = getThemeAssets().ar.icon_ar_measure_add_toast : image = getThemeAssets().ar.icon_ar_measure_add_toast_en
    return (
      <View style={styles.addcaptureView}>
        <ImageButton
          containerStyle={styles.addcapture}
          iconStyle={styles.addiconView}
          activeOpacity={0.3}
          icon={image}
        />
        <Text style={styles.addText}>
          {text}
        </Text>
      </View>
    )
  }

  renderCenterBtn = () => {
    return (
      <ImageButton
        containerStyle={styles.capture}
        iconStyle={styles.addButtonView}
        activeOpacity={0.5}
        icon={getThemeAssets().ar.icon_ar_measure_add}
        onPress={() => {
          this.addNewRecord()
        }}
      />
    )
  }


  render() {
    return (
      <Container
        ref={ref => (this.Container = ref)}
        headerProps={{
          title: getLanguage(GLOBAL.language).Map_Main_Menu
            .MAP_AR_AI_ASSISTANT_SCENE_FORM_COLLECT,
          navigation: this.props.navigation,
          backAction: this.back,
          type: 'fix',
        }}
        bottomProps={{ type: 'fix' }}
      >
        <SMCollectSceneFormView
          ref={ref => (this.SMCollectSceneFormView = ref)}
          onGetInstance={this._onGetInstance}
        />
        {/*{this.state.showHistory && this.renderHistoryView()}*/}
        <View style={styles.toolbarView}>
          {this.state.showbuttons && this.renderBottomBtns()}
          {this.state.showSwithchButtons && this.renderBottomSwitchBtns()}
          {this.renderBottomBtn()}
        </View>
        {this.renderLengthChangeView()}
        {/* {this.state.isClickCollect && this.renderClickCollectHintView()} */}
        {this.state.isnew && this.state.isClickCollect && !this.state.isClickFirst && this.renderADDPoint()}
        {this.state.isnew && this.state.isClickCollect && this.renderCenterBtn()}
        {this.renderDialog()}
      </Container>
    )
  }
}
