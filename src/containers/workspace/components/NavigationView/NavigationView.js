import * as React from 'react'
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  FlatList,
  Platform,
  Animated,
} from 'react-native'
import {
  FetchUtils,
  scaleSize,
  screen,
  setSpText,
  Toast,
} from '../../../../utils'
import NavigationService from '../../../../containers/NavigationService'
import { TouchType } from '../../../../constants'
import styles from './styles'
import { color } from '../../../../styles'
import PropTypes from 'prop-types'
import { SMap } from 'imobile_for_reactnative'
import { getLanguage } from '../../../../language'
import Loading from '../../../../components/Container/Loading'
import { Dialog } from '../../../../components'
import ToolbarModule from '../ToolBar/modules/ToolbarModule'

const TOOLBARHEIGHT = Platform.OS === 'ios' ? scaleSize(20) : 0

export default class NavigationView extends React.Component {
  props: {
    navigation: Object,
    device: Object,
  }
  static propTypes = {
    mapNavigation: PropTypes.object,
    setMapNavigation: PropTypes.func,
    setNavigationHistory: PropTypes.func,
    navigationhistory: PropTypes.array,
  }

  constructor(props) {
    super(props)
    let { params } = this.props.navigation.state
    this.getNavigationDatas = ToolbarModule.getParams().getNavigationDatas
    this.setNavigationDatas = ToolbarModule.getParams().setNavigationDatas
    this.changeNavPathInfo = params.changeNavPathInfo
    // this.PointType = null
    this.clickable = true
    this.historyclick = true
    this.state = {
      startName: '',
      endName: '',
    }
    this.maxWidth =
      props.device.orientation.indexOf('LANDSCAPE') === 0
        ? new Animated.Value(
          screen.getScreenWidth(props.device.orientation) * 0.45,
        )
        : new Animated.Value(screen.getScreenWidth(props.device.orientation))
  }
  componentDidUpdate(prevProps) {
    if (prevProps.device.orientation !== this.props.device.orientation) {
      let maxWidth =
        this.props.device.orientation.indexOf('LANDSCAPE') === 0
          ? screen.getScreenWidth(this.props.device.orientation) * 0.45
          : screen.getScreenWidth(this.props.device.orientation)
      Animated.timing(this.maxWidth, {
        toValue: maxWidth,
        duration: 300,
      }).start()
    }
  }

  /**
   * 返回按键
   * @returns {Promise<void>}
   */
  close = async () => {
    //点击一次后 this.backClicked 设置为true 防止多次点击
    if (this.backClicked) return
    this.backClicked = true
    //清空相关数据 隐藏相关组件 退出全图 清除点 返回上一级
    this.props.setMapNavigation({ isShow: false, name: '' })
    GLOBAL.MAPSELECTPOINT.setVisible(false)
    GLOBAL.MAPSELECTPOINTBUTTON.setVisible(false)
    GLOBAL.STARTNAME = getLanguage(
      GLOBAL.language,
    ).Map_Main_Menu.SELECT_START_POINT
    GLOBAL.ENDNAME = getLanguage(
      GLOBAL.language,
    ).Map_Main_Menu.SELECT_DESTINATION
    GLOBAL.STARTX = undefined
    GLOBAL.ENDX = undefined
    GLOBAL.TouchType = TouchType.NORMAL
    GLOBAL.ToolBar?.existFullMap()
    await SMap.clearPoint()
    NavigationService.goBack()
  }

  /**
   * 选择起点
   * @returns {Promise<void>}
   */
  selectStartPoint = async () => {
    //点击一次后 this.backClicked 设置为true 防止多次点击
    if (this.backClicked) return
    this.backClicked = true
    //改变GLOBAL.TouchType 使GestureDetectListener的单击事件进入选择起点的逻辑
    GLOBAL.TouchType = TouchType.NAVIGATION_TOUCH_BEGIN
    //显示选点界面的顶部 底部组件
    GLOBAL.MAPSELECTPOINT.setVisible(true)
    GLOBAL.MAPSELECTPOINTBUTTON.setVisible(true, {
      button: getLanguage(GLOBAL.language).Map_Main_Menu.SET_AS_START_POINT,
    })
    //全幅
    GLOBAL.toolBox.showFullMap(true)
    //导航选点 全屏时保留mapController
    GLOBAL.mapController && GLOBAL.mapController.setVisible(true)
    this.props.setMapNavigation({
      isShow: true,
      name: '',
    })
    //考虑搜索界面跳转，不能直接goBack
    NavigationService.navigate('MapView')
  }

  /**
   * 选择终点  逻辑和选择起点相同
   * @returns {Promise<void>}
   */
  selectEndPoint = async () => {
    if (this.backClicked) return
    this.backClicked = true
    GLOBAL.TouchType = TouchType.NAVIGATION_TOUCH_END
    GLOBAL.MAPSELECTPOINT.setVisible(true)
    GLOBAL.MAPSELECTPOINTBUTTON.setVisible(true, {
      button: getLanguage(GLOBAL.language).Map_Main_Menu.SET_AS_DESTINATION,
    })
    GLOBAL.toolBox.showFullMap(true)
    //导航选点 全屏时保留mapController
    GLOBAL.mapController && GLOBAL.mapController.setVisible(true)
    this.props.setMapNavigation({
      isShow: true,
      name: '',
    })
    NavigationService.navigate('MapView')
  }

  // [{datasourceName:'',datasetName:'',name:''}]
  // [{datasourceName:'',name:''}]
  /**
   * 获取数组中name相同的对象  用于获取起始点公共数据 然后再获取用户选择的数据和公共数据的相同部分
   * @param arr1
   * @param arr2
   * @returns {[]}
   */
  getSameInfoFromArray = (arr1, arr2) => {
    let result = []
    if (!arr1 || !arr2 || arr1.length === 0 || arr2.length === 0) return result
    arr1.forEach(item => {
      arr2.forEach(item2 => {
        if (item.name === item2.name) {
          result.push(item)
        }
      })
    })
    return result
  }

  /**
   * 路径分析
   * @returns {Promise<void>}
   */
  routeAnalyst = async () => {
    //起点终点都选择完成的情况下，进入路径分析
    if (GLOBAL.STARTX !== undefined && GLOBAL.ENDX !== undefined) {
      //重置TouchType，显示Loading组件
      GLOBAL.TouchType = TouchType.NORMAL
      this.loading.setLoading(
        true,
        getLanguage(GLOBAL.language).Prompt.ROUTE_ANALYSING,
      )
      let startPointInfo //起点所在室内数据源/室外数据集的数组
      let endPointInfo //终点所在室内数据源/室外数据集的数组
      try {
        //获取起点 终点 所在室内外的数据信息
        startPointInfo = await SMap.getPointBelongs(
          GLOBAL.STARTX,
          GLOBAL.STARTY,
        )
        endPointInfo = await SMap.getPointBelongs(GLOBAL.ENDX, GLOBAL.ENDY)
      } catch (e) {
        this.loading.setLoading(false)
        Toast.show(' 获取数据失败')
        return
      }
      //分别获取 起点室内信息  起点室外信息 终点室内信息 终点室外信息
      let startIndoorInfo = startPointInfo.filter(item => item.isIndoor)
      let startOutdoorInfo = startPointInfo.filter(item => !item.isIndoor)
      let endIndoorInfo = endPointInfo.filter(item => item.isIndoor)
      let endOutdoorInfo = endPointInfo.filter(item => !item.isIndoor)
      //获取起点终点公共室内信息
      let commonIndoorInfo = this.getSameInfoFromArray(
        startIndoorInfo,
        endIndoorInfo,
      )
      //获取起点终点公共室外信息
      let commonOutdoorInfo = this.getSameInfoFromArray(
        startOutdoorInfo,
        endOutdoorInfo,
      )

      //获取用户选择数据
      let selectedData = this.getNavigationDatas()
      let datasources = selectedData.selectedDatasources
      let datasets = selectedData.selectedDatasets
      //需要重新设置回MapView的四个数据
      let selectedDatasets = [] //当前选中数据集
      let selectedDatasources = [] //当前选中数据源
      let currentDataset = {} //当前使用中的数据集
      let currentDatasource = [] //当前使用中的数据源
      //用户选择了导航数据
      if (datasources.length > 0 || datasets.length > 0) {
        //使用刚才获取到的室内外公共信息，分别和用户选择的datasources(室内) datasets(室外)再重新获取公共的室内外信息
        commonIndoorInfo = this.getSameInfoFromArray(
          commonIndoorInfo,
          datasources,
        )
        commonOutdoorInfo = this.getSameInfoFromArray(
          commonOutdoorInfo,
          datasets,
        )
        //当前选中数据集 数据源 设置为用户之前选择的
        selectedDatasources = datasources
        selectedDatasets = datasets
        //如果存在公共室内信息
        if (commonIndoorInfo.length > 0) {
          //把当前使用中的数据源设置成公共室内信息，情况当前使用中的数据集
          currentDatasource = commonIndoorInfo
          currentDataset = {}
          //如果存在公共室外信息
        } else if (commonOutdoorInfo.length > 0) {
          //把当前使用中的数据集摄制为公共室外数据集的第一个 当前室内数据源置空
          currentDataset = commonOutdoorInfo[0]
          currentDatasource = []
          //如果不存在用户选中数据源
          if (datasources.length === 0) {
            //清除掉起点终点的室内信息
            startIndoorInfo = []
            endIndoorInfo = []
          } else {
            //否则把起点、终点的室内数据源添加到当前使用中的数据源
            startIndoorInfo.length > 0 &&
              currentDatasource.push(startIndoorInfo[0])
            endIndoorInfo.length > 0 && currentDatasource.push(endIndoorInfo[0])
          }
        }
        //用户没有选择导航数据
      } else {
        //存在公共室内数据
        if (commonIndoorInfo.length > 0) {
          //设置选中数据源 当前使用中的数据源 清空选中的数据集 清空当前数据集
          selectedDatasources = commonIndoorInfo
          currentDatasource = commonIndoorInfo
          selectedDatasets = []
          currentDataset = {}
          //不存在公共室内数据 但是存在公共室外数据
        } else if (commonOutdoorInfo.length > 0) {
          //设置选中数据集 当前使用中数据集   清空室内数据源 当前选中数据源
          selectedDatasets = commonOutdoorInfo
          currentDataset = commonOutdoorInfo[0]
          selectedDatasources = []
          currentDatasource = []
          //如果起点存在室内数据
          if (startIndoorInfo.length > 0) {
            //添加起点室内数据到选中数据源 当前数据源
            selectedDatasources.push(startIndoorInfo[0])
            currentDatasource.push(startIndoorInfo[0])
          }
          //如果终点存在室内数据
          if (endIndoorInfo.length > 0) {
            //添加终点室内数据到选中数据源 当前数据源
            selectedDatasources.push(endIndoorInfo[0])
            currentDatasource.push(endIndoorInfo[0])
          }
        }
      }

      //设置数据到MapView
      this.setNavigationDatas({
        selectedDatasources,
        selectedDatasets,
        currentDataset,
        currentDatasource,
      })
      let path, pathLength
      //有公共室内数据源，室内导航
      if (commonIndoorInfo.length > 0) {
        try {
          //添加起点
          await SMap.getStartPoint(
            GLOBAL.STARTX,
            GLOBAL.STARTY,
            true,
            GLOBAL.STARTPOINTFLOOR,
          )
          //添加终点
          await SMap.getEndPoint(
            GLOBAL.ENDX,
            GLOBAL.ENDY,
            true,
            GLOBAL.ENDPOINTFLOOR,
          )
          //设置室内导航参数
          await SMap.startIndoorNavigation(commonIndoorInfo[0].datasourceName)
          //进行室内导航路径分析
          let rel = await SMap.beginIndoorNavigation()
          if (!rel) {
            this.loading.setLoading(false)
            Toast.show(getLanguage(GLOBAL.language).Prompt.PATH_ANALYSIS_FAILED)
            return
          }
        } catch (e) {
          this.loading.setLoading(false)
          Toast.show(getLanguage(GLOBAL.language).Prompt.PATH_ANALYSIS_FAILED)
          return
        }
        //获取路径长度、路径详情
        pathLength = await SMap.getNavPathLength(true)
        path = await SMap.getPathInfos(true)
        //设置当前导航模式为室内
        GLOBAL.CURRENT_NAV_MODE = 'INDOOR'
        //存在室外公共数据集
      } else if (commonOutdoorInfo.length > 0) {
        //起点和终点存在不同的室内数据源
        if (startIndoorInfo.length > 0 && endIndoorInfo.length > 0) {
          //todo 有不同的室内数据源 三段室内外一体化导航
          //todo getDoorPoint两次 获取最近的两个临界点位置，然后启动室内导航
          //只有起点存在室内数据源 两段室内外一体化导航 先室内
        } else if (startIndoorInfo.length > 0) {
          //构造参数，获取临界点
          let params = {
            startX: GLOBAL.STARTX,
            startY: GLOBAL.STARTY,
            endX: GLOBAL.ENDX,
            endY: GLOBAL.ENDY,
            datasourceName: startIndoorInfo[0].datasourceName,
          }
          let doorPoint = await SMap.getDoorPoint(params)
          //临界点获取成功，存在坐标及楼层信息
          if (doorPoint.x && doorPoint.y && doorPoint.floorID) {
            //构建分段导航相关参数
            GLOBAL.NAV_PARAMS = [
              {
                startX: GLOBAL.STARTX,
                startY: GLOBAL.STARTY,
                endX: doorPoint.x,
                endY: doorPoint.y,
                datasourceName: startIndoorInfo[0].datasourceName,
                startFloor: GLOBAL.STARTPOINTFLOOR,
                endFloor: doorPoint.floorID,
                isIndoor: true,
                hasNaved: true,
              },
              {
                startX: doorPoint.x,
                startY: doorPoint.y,
                endX: GLOBAL.ENDX,
                endY: GLOBAL.ENDY,
                isIndoor: false,
                hasNaved: false,
                datasourceName: commonOutdoorInfo[0].datasourceName,
                datasetName: commonOutdoorInfo[0].datasetName,
                modelFileName: commonOutdoorInfo[0].modelFileName,
              },
            ]
            // 先进行室内导航
            try {
              //添加起点终点
              await SMap.getStartPoint(
                GLOBAL.STARTX,
                GLOBAL.STARTY,
                true,
                GLOBAL.STARTPOINTFLOOR || doorPoint.floorID,
              )
              await SMap.getEndPoint(
                doorPoint.x,
                doorPoint.y,
                true,
                doorPoint.floorID,
              )
              //设置室内导航参数
              await SMap.startIndoorNavigation(
                startIndoorInfo[0].datasourceName,
              )
              //进行室内路径分析
              let rel = await SMap.beginIndoorNavigation()
              if (!rel) {
                this.loading.setLoading(false)
                Toast.show(
                  getLanguage(GLOBAL.language).Prompt.PATH_ANALYSIS_FAILED,
                )
                SMap.clearPoint()
                return
              }
              //添加引导线到跟踪层 室内导航终点到室外导航终点
              await SMap.addLineOnTrackingLayer(doorPoint, {
                x: GLOBAL.ENDX,
                y: GLOBAL.ENDY,
              })
            } catch (e) {
              this.loading.setLoading(false)
              Toast.show(
                getLanguage(GLOBAL.language).Prompt.PATH_ANALYSIS_FAILED,
              )
              return
            }

            //获取路径长度 路径信息
            pathLength = await SMap.getNavPathLength(true)
            path = await SMap.getPathInfos(true)
            //设置导航模式为室内
            GLOBAL.CURRENT_NAV_MODE = 'INDOOR'
          } else {
            //分析失败(找不到最近的门的情况（数据问题）) 进行在线路径分析
            this.loading.setLoading(false)
            this.dialog.setDialogVisible(true)
          }
          //终点存在室内数据源 两段室内外一体化导航 先室外
        } else if (endIndoorInfo.length > 0) {
          //构造参数获取临界点
          let params = {
            startX: GLOBAL.STARTX,
            startY: GLOBAL.STARTY,
            endX: GLOBAL.ENDX,
            endY: GLOBAL.ENDY,
            datasourceName: endIndoorInfo[0].datasourceName,
          }
          let doorPoint = await SMap.getDoorPoint(params)
          //获取成功，拿到坐标和楼层id
          if (doorPoint.x && doorPoint.y && doorPoint.floorID) {
            //构建分段导航参数
            GLOBAL.NAV_PARAMS = [
              {
                startX: GLOBAL.STARTX,
                startY: GLOBAL.STARTY,
                endX: doorPoint.x,
                endY: doorPoint.y,
                isIndoor: false,
                hasNaved: true,
                datasourceName: commonOutdoorInfo[0].datasourceName,
                datasetName: commonOutdoorInfo[0].datasetName,
                modelFileName: commonOutdoorInfo[0].modelFileName,
              },
              {
                startX: doorPoint.x,
                startY: doorPoint.y,
                startFloor: doorPoint.floorID,
                endX: GLOBAL.ENDX,
                endY: GLOBAL.ENDY,
                endFloor: GLOBAL.ENDPOINTFLOOR || doorPoint.floorID,
                datasourceName: endIndoorInfo[0].datasourceName,
                isIndoor: true,
                hasNaved: false,
              },
            ]

            try {
              //添加起点，添加终点 设置室外导航参数 进行室外路径分析
              await SMap.getStartPoint(GLOBAL.STARTX, GLOBAL.STARTY, false)
              await SMap.getEndPoint(GLOBAL.ENDX, GLOBAL.ENDY, false)
              await SMap.startNavigation(GLOBAL.NAV_PARAMS[0])
              let canNav = await SMap.beginNavigation(
                GLOBAL.STARTX,
                GLOBAL.STARTY,
                doorPoint.x,
                doorPoint.y,
              )
              if (!canNav) {
                Toast.show(
                  '当前选点不在路网数据集范围内,请重新选点或者重设路网数据集',
                )
                this.loading.setLoading(false)
                return
              }
              //添加引导线到跟踪层 临界点到导航终点
              await SMap.addLineOnTrackingLayer(doorPoint, {
                x: GLOBAL.ENDX,
                y: GLOBAL.ENDY,
              })
            } catch (e) {
              this.loading.setLoading(false)
              Toast.show(
                getLanguage(GLOBAL.language).Prompt.PATH_ANALYSIS_FAILED,
              )
              return
            }
            //获取室外路径长度 路径信息
            pathLength = await SMap.getNavPathLength(false)
            path = await SMap.getPathInfos(false)
            //设置当前导航模式为室外
            GLOBAL.CURRENT_NAV_MODE = 'OUTDOOR'
          } else {
            //分析失败(找不到最近的门的情况（数据问题）) 进行在线路径分析
            this.loading.setLoading(false)
            this.dialog.setDialogVisible(true)
          }
        } else {
          //无室内数据源  室外导航
          //直接导航
          try {
            //设置室外导航相关参数，进行室外导航路径分析
            await SMap.startNavigation(commonOutdoorInfo[0])
            let result = await SMap.beginNavigation(
              GLOBAL.STARTX,
              GLOBAL.STARTY,
              GLOBAL.ENDX,
              GLOBAL.ENDY,
            )
            if (result) {
              //室外路径分析成功 获取路径长度 路径信息
              pathLength = await SMap.getNavPathLength(false)
              path = await SMap.getPathInfos(false)
              //当前全局导航模式设置为室外
              GLOBAL.CURRENT_NAV_MODE = 'OUTDOOR'
            } else {
              //分析失败(500m范围内找不到路网点的情况)或者选择的点不在选择的路网数据集bounds范围内
              Toast.show(
                '当前选点不在路网数据集范围内,请重新选点或者重设路网数据集',
              )
              this.loading.setLoading(false)
              return
            }
          } catch (e) {
            this.loading.setLoading(false)
            Toast.show(getLanguage(GLOBAL.language).Prompt.PATH_ANALYSIS_FAILED)
            return
          }
        }
        //无公共室内数据源 且 无公共室外数据集 在线路径分析
      } else {
        //隐藏Loaqding 显示在线路径分析弹窗
        this.loading.setLoading(false)
        this.dialog.setDialogVisible(true)
      }
      //如果path和pathLength都成功获取到
      if (path && pathLength) {
        //设置MapView的路径信息
        this.changeNavPathInfo({ path, pathLength })
        //隐藏地图选点相关组件
        GLOBAL.MAPSELECTPOINT.setVisible(false)
        GLOBAL.MAPSELECTPOINTBUTTON.setVisible(false, {
          button: '',
        })
        //显示导航路径结果相关组件
        GLOBAL.NAVIGATIONSTARTBUTTON.setVisible(true, false)
        GLOBAL.NAVIGATIONSTARTHEAD.setVisible(true)
        this.props.setMapNavigation({
          isShow: true,
          name: '',
        })
        //退出全图
        GLOBAL.toolBox.showFullMap(true)
        //存历史记录
        let history = this.props.navigationhistory
        history.push({
          sx: GLOBAL.STARTX,
          sy: GLOBAL.STARTY,
          ex: GLOBAL.ENDX,
          ey: GLOBAL.ENDY,
          sFloor: GLOBAL.STARTPOINTFLOOR,
          eFloor: GLOBAL.ENDPOINTFLOOR,
          address: GLOBAL.STARTNAME + '---' + GLOBAL.ENDNAME,
          start: GLOBAL.STARTNAME,
          end: GLOBAL.ENDNAME,
        })
        if (this.historyclick) {
          this.props.setNavigationHistory(history)
        }
        //跳转回MapView，设置TouchType为NULL，避免导航结果页面点击进入/退出全幅 调整楼层控件、mapController位置
        if (this.clickable) {
          this.clickable = false
          this.loading.setLoading(false)
          GLOBAL.TouchType = TouchType.NULL
          //考虑搜索界面跳转，不能直接goBack
          NavigationService.navigate('MapView')
          GLOBAL.mapController?.changeBottom(true)
          GLOBAL.FloorListView?.changeBottom(true)
        }
      }
    }
  }

  //在线路径分析确定
  _confirm = async () => {
    //隐藏Dialog 显示Loading
    this.dialog.setDialogVisible(false)
    this.loading.setLoading(
      true,
      getLanguage(GLOBAL.language).Prompt.ROUTE_ANALYSING,
    )
    //添加起点。终点
    await SMap.getStartPoint(GLOBAL.STARTX, GLOBAL.STARTY, false)
    await SMap.getEndPoint(GLOBAL.ENDX, GLOBAL.ENDY, false)
    let path, pathLength
    //js请求online，获取路径数据
    let result = await FetchUtils.routeAnalyst(
      GLOBAL.STARTX,
      GLOBAL.STARTY,
      GLOBAL.ENDX,
      GLOBAL.ENDY,
    )
    //数据获取成功
    if (result && result[0] && result[0].pathInfos) {
      //获取路径长度 路径信息
      pathLength = { length: result[0].pathLength }
      path = result[0].pathInfos
      //绘制路径到跟踪层 移动到起点
      await SMap.drawOnlinePath(result[0].pathPoints)
      await SMap.moveToPoint({ x: GLOBAL.STARTX, y: GLOBAL.STARTY })
    } else {
      Toast.show(getLanguage(GLOBAL.language).Prompt.PATH_ANALYSIS_FAILED)
      this.loading.setLoading(false)
    }
    if (pathLength && path) {
      //设置MapView的路径信息
      this.changeNavPathInfo({ path, pathLength })
      //隐藏地图选点相关组件
      GLOBAL.MAPSELECTPOINT.setVisible(false)
      GLOBAL.MAPSELECTPOINTBUTTON.setVisible(false, {
        button: '',
      })
      //显示导航路径结果相关组件
      GLOBAL.NAVIGATIONSTARTBUTTON.setVisible(true, true)
      GLOBAL.NAVIGATIONSTARTHEAD.setVisible(true)
      this.props.setMapNavigation({
        isShow: true,
        name: '',
      })
      //退出全图 存历史记录
      GLOBAL.toolBox.showFullMap(true)
      let history = this.props.navigationhistory
      history.push({
        sx: GLOBAL.STARTX,
        sy: GLOBAL.STARTY,
        ex: GLOBAL.ENDX,
        ey: GLOBAL.ENDY,
        sFloor: GLOBAL.STARTPOINTFLOOR,
        eFloor: GLOBAL.ENDPOINTFLOOR,
        address: GLOBAL.STARTNAME + '---' + GLOBAL.ENDNAME,
        start: GLOBAL.STARTNAME,
        end: GLOBAL.ENDNAME,
      })
      if (this.historyclick) {
        this.props.setNavigationHistory(history)
      }
      //跳转回MapView，设置TouchType为NULL，避免导航结果页面点击进入/退出全幅 调整楼层控件、mapController位置
      if (this.clickable) {
        this.clickable = false
        this.loading.setLoading(false)
        GLOBAL.TouchType = TouchType.NULL
        //考虑搜索界面跳转，不能直接goBack
        NavigationService.navigate('MapView')
        GLOBAL.mapController && GLOBAL.mapController.changeBottom(true)
        GLOBAL.FloorListView && GLOBAL.FloorListView.changeBottom(true)
      }
    }
  }
  _renderSearchView = () => {
    // let renderHistory = this.props.navigationhistory.filter(
    //   item => item.isOutDoor === GLOBAL.ISOUTDOORMAP,
    // )
    let renderHistory = this.props.navigationhistory
    return (
      <Animated.View
        style={{
          flex: 1,
          maxWidth: this.maxWidth,
          backgroundColor: '#ebebeb',
        }}
      >
        <View
          style={{
            paddingTop: TOOLBARHEIGHT + scaleSize(20),
            height: scaleSize(205) + TOOLBARHEIGHT,
            width: '100%',
            backgroundColor: '#303030',
            flexDirection: 'row',
          }}
        >
          <TouchableOpacity
            onPress={() => {
              this.close()
            }}
            style={{
              width: scaleSize(60),
              alignItems: 'center',
              paddingTop: scaleSize(10),
              justifyContent: 'flex-start',
            }}
          >
            <Image
              resizeMode={'contain'}
              source={require('../../../../assets/public/Frenchgrey/icon-back-white.png')}
              style={styles.backbtn}
            />
          </TouchableOpacity>
          <View style={styles.pointAnalystView}>
            <View
              style={{
                flexDirection: 'column',
                alignItems: 'flex-start',
                flex: 1,
                marginHorizontal: scaleSize(20),
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  flex: 1,
                }}
              >
                <View
                  style={{
                    width: scaleSize(12),
                    height: scaleSize(12),
                    borderRadius: scaleSize(6),
                    marginRight: scaleSize(20),
                    backgroundColor: '#0dc66d',
                  }}
                />
                <TouchableOpacity
                  style={styles.onInput}
                  onPress={() => {
                    this.selectStartPoint()
                  }}
                >
                  <Text
                    numberOfLines={2}
                    ellipsizeMode={'tail'}
                    style={{ fontSize: setSpText(24) }}
                  >
                    {this.state.startName || GLOBAL.STARTNAME}
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  width: '100%',
                  height: 2,
                  backgroundColor: color.separateColorGray,
                }}
              />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  flex: 1,
                }}
              >
                <View
                  style={{
                    width: scaleSize(12),
                    height: scaleSize(12),
                    borderRadius: scaleSize(6),
                    marginRight: scaleSize(20),
                    backgroundColor: '#f14343',
                  }}
                />
                <TouchableOpacity
                  style={styles.secondInput}
                  onPress={() => {
                    this.selectEndPoint()
                  }}
                >
                  <Text
                    numberOfLines={2}
                    ellipsizeMode={'tail'}
                    style={{ fontSize: setSpText(24) }}
                  >
                    {this.state.endName || GLOBAL.ENDNAME}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        <View style={{ flex: 1, paddingBottom: scaleSize(130) }}>
          <FlatList
            style={{
              maxHeight: scaleSize(650),
              marginLeft: scaleSize(90),
              marginRight: scaleSize(50),
              borderRadius: 5,
            }}
            data={renderHistory}
            extraData={GLOBAL.STARTX}
            keyExtractor={(item, index) => item.toString() + index}
            renderItem={this.renderItem}
          />
          {renderHistory.length > 0 && (
            <TouchableOpacity
              style={{
                backgroundColor: color.content_white,
                height: scaleSize(70),
                justifyContent: 'center',
                alignItems: 'center',
                marginLeft: scaleSize(90),
                marginRight: scaleSize(50),
                borderRadius: 5,
              }}
              onPress={() => {
                this.props.setNavigationHistory &&
                  this.props.setNavigationHistory([])
              }}
            >
              <Text
                style={{
                  fontSize: setSpText(20),
                }}
              >
                {getLanguage(GLOBAL.language).Map_Main_Menu.CLEAR_NAV_HISTORY}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <View
          style={{
            position: 'absolute',
            bottom: scaleSize(30),
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <TouchableOpacity
            activeOpacity={0.5}
            style={{
              width: '80%',
              height: scaleSize(60),
              borderRadius: 50,
              backgroundColor: color.blue1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => {
              this.routeAnalyst()
            }}
          >
            <Text
              style={{
                fontSize: setSpText(20),
                color: color.white,
              }}
            >
              {getLanguage(GLOBAL.language).Map_Main_Menu.ROUTE_ANALYST}
            </Text>
          </TouchableOpacity>
        </View>
        <Loading ref={ref => (this.loading = ref)} initLoading={false} />
        <Dialog
          ref={ref => (this.dialog = ref)}
          confirmAction={this._confirm}
          opacity={1}
          opacityStyle={styles.dialogBackground}
          style={styles.dialogBackground}
          confirmBtnTitle={getLanguage(GLOBAL.language).Prompt.YES}
          cancelBtnTitle={getLanguage(GLOBAL.language).Prompt.NO}
        >
          <View style={styles.dialogHeaderView}>
            <Image
              source={require('../../../../assets/home/Frenchgrey/icon_prompt.png')}
              style={styles.dialogHeaderImg}
            />
            <Text style={styles.promptTitle}>
              {getLanguage(GLOBAL.language).Prompt.USE_ONLINE_ROUTE_ANALYST}
            </Text>
          </View>
        </Dialog>
      </Animated.View>
    )
  }

  onItemPress = async item => {
    GLOBAL.STARTNAME = item.start
    GLOBAL.ENDNAME = item.end

    GLOBAL.STARTX = item.sx
    GLOBAL.STARTY = item.sy
    GLOBAL.ENDX = item.ex
    GLOBAL.ENDY = item.ey
    GLOBAL.STARTPOINTFLOOR = item.sFloor
    GLOBAL.ENDPOINTFLOOR = item.eFloor

    await SMap.getStartPoint(item.sx, item.sy, false, item.sFloor)

    await SMap.getEndPoint(item.ex, item.ey, false, item.eFloor)

    this.historyclick = false
    this.setState({
      startName: item.start,
      endName: item.end,
    })
  }
  renderItem = ({ item }) => {
    return (
      <View>
        <TouchableOpacity
          style={styles.itemView}
          onPress={() => {
            this.onItemPress(item)
          }}
        >
          <Image
            style={styles.pointImg}
            source={require('../../../../assets/Navigation/naviagtion-road.png')}
          />
          {item.address && (
            <Text
              numberOfLines={2}
              ellipsizeMode={'tail'}
              style={styles.itemText}
            >
              {item.address}
            </Text>
          )}
        </TouchableOpacity>
        <View style={styles.itemSeparator} />
      </View>
    )
  }

  render() {
    return this._renderSearchView()
  }
}
