import * as React from 'react'
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  FlatList,
  Platform,
} from 'react-native'
import { FetchUtils, scaleSize, setSpText, Toast } from '../../../../utils'
import NavigationService from '../../../../containers/NavigationService'
import { TouchType } from '../../../../constants'
import styles from './styles'
import { color } from '../../../../styles'
import PropTypes from 'prop-types'
import { SMap } from 'imobile_for_reactnative'
import { getLanguage } from '../../../../language'
import Loading from '../../../../components/Container/Loading'
import { Dialog, Container } from '../../../../components'
import { getPublicAssets } from '../../../../assets'
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
    let { params } = this.props.route
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
    global.MAPSELECTPOINT.setVisible(false)
    global.MAPSELECTPOINTBUTTON.setVisible(false)
    global.STARTNAME = getLanguage(
      global.language,
    ).Map_Main_Menu.SELECT_START_POINT
    global.ENDNAME = getLanguage(
      global.language,
    ).Map_Main_Menu.SELECT_DESTINATION
    global.STARTX = undefined
    global.ENDX = undefined
    global.TouchType = TouchType.NORMAL
    global.ToolBar?.existFullMap()
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
    // global.TouchType = TouchType.NAVIGATION_TOUCH_BEGIN
    global.TouchType = TouchType.NORMAL
    //显示选点界面的顶部 底部组件
    global.MAPSELECTPOINT.setVisible(true)
    global.MAPSELECTPOINTBUTTON.setVisible(true, {
      button: getLanguage(global.language).Map_Main_Menu.SET_AS_START_POINT,
    })
    // //全幅
    global.toolBox.showFullMap(true)
    // //导航选点 全屏时保留mapController
    global.mapController && global.mapController.setVisible(true)
    this.props.setMapNavigation({
      isShow: true,
      name: '',
    })
    //考虑搜索界面跳转，不能直接goBack
    NavigationService.navigate('MapStack', {screen: 'MapView'})
    // 点击后给一个长按选择起点的提示 lyx
    Toast.show(getLanguage(this.props.language).Prompt.LONG_PRESS_START_POINT, {duration: 2500})
  }

  /**
   * 选择终点  逻辑和选择起点相同
   * @returns {Promise<void>}
   */
  selectEndPoint = async () => {
    if (this.backClicked) return
    this.backClicked = true
    global.TouchType = TouchType.NAVIGATION_TOUCH_END
    global.MAPSELECTPOINT.setVisible(true)
    global.MAPSELECTPOINTBUTTON.setVisible(true, {
      button: getLanguage(global.language).Map_Main_Menu.SET_AS_DESTINATION,
    })
    global.toolBox.showFullMap(true)
    //导航选点 全屏时保留mapController
    global.mapController && global.mapController.setVisible(true)
    this.props.setMapNavigation({
      isShow: true,
      name: '',
    })
    NavigationService.navigate('MapStack', {screen: 'MapView'})
    // 点击后给一个长按选择终点的提示 lyx
    Toast.show(getLanguage(this.props.language).Prompt.LONG_PRESS_END_POINT, {duration: 2500})
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
    if (global.STARTX !== undefined && global.ENDX !== undefined) {
      //重置TouchType，显示Loading组件
      global.TouchType = TouchType.NORMAL
      this.loading.setLoading(
        true,
        getLanguage(global.language).Prompt.ROUTE_ANALYSING,
      )
      let startPointInfo //起点所在室内数据源/室外数据集的数组
      let endPointInfo //终点所在室内数据源/室外数据集的数组
      try {
        //获取起点 终点 所在室内外的数据信息
        startPointInfo = await SMap.getPointBelongs(
          global.STARTX,
          global.STARTY,
        )
        endPointInfo = await SMap.getPointBelongs(global.ENDX, global.ENDY)
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
            global.STARTX,
            global.STARTY,
            true,
            global.STARTPOINTFLOOR,
          )
          //添加终点
          await SMap.getEndPoint(
            global.ENDX,
            global.ENDY,
            true,
            global.ENDPOINTFLOOR,
          )
          //设置室内导航参数
          await SMap.startIndoorNavigation(commonIndoorInfo[0].datasourceName)
          //进行室内导航路径分析
          let rel = await SMap.beginIndoorNavigation()
          if (!rel) {
            this.loading.setLoading(false)
            Toast.show(getLanguage(global.language).Prompt.PATH_ANALYSIS_FAILED)
            return
          }
        } catch (e) {
          this.loading.setLoading(false)
          Toast.show(getLanguage(global.language).Prompt.PATH_ANALYSIS_FAILED)
          return
        }
        //获取路径长度、路径详情
        pathLength = await SMap.getNavPathLength(true)
        path = await SMap.getPathInfos(true)
        //设置当前导航模式为室内
        global.CURRENT_NAV_MODE = 'INDOOR'
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
            startX: global.STARTX,
            startY: global.STARTY,
            endX: global.ENDX,
            endY: global.ENDY,
            datasourceName: startIndoorInfo[0].datasourceName,
          }
          let doorPoint = await SMap.getDoorPoint(params)
          //临界点获取成功，存在坐标及楼层信息
          if (doorPoint.x && doorPoint.y && doorPoint.floorID) {
            //构建分段导航相关参数
            global.NAV_PARAMS = [
              {
                startX: global.STARTX,
                startY: global.STARTY,
                endX: doorPoint.x,
                endY: doorPoint.y,
                datasourceName: startIndoorInfo[0].datasourceName,
                startFloor: global.STARTPOINTFLOOR,
                endFloor: doorPoint.floorID,
                isIndoor: true,
                hasNaved: true,
              },
              {
                startX: doorPoint.x,
                startY: doorPoint.y,
                endX: global.ENDX,
                endY: global.ENDY,
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
                global.STARTX,
                global.STARTY,
                true,
                global.STARTPOINTFLOOR || doorPoint.floorID,
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
                  getLanguage(global.language).Prompt.PATH_ANALYSIS_FAILED,
                )
                SMap.clearPoint()
                return
              }
              //添加引导线到跟踪层 室内导航终点到室外导航终点
              await SMap.addLineOnTrackingLayer(doorPoint, {
                x: global.ENDX,
                y: global.ENDY,
              })
            } catch (e) {
              this.loading.setLoading(false)
              Toast.show(
                getLanguage(global.language).Prompt.PATH_ANALYSIS_FAILED,
              )
              return
            }

            //获取路径长度 路径信息
            pathLength = await SMap.getNavPathLength(true)
            path = await SMap.getPathInfos(true)
            //设置导航模式为室内
            global.CURRENT_NAV_MODE = 'INDOOR'
          } else {
            //分析失败(找不到最近的门的情况（数据问题）) 进行在线路径分析
            this.loading.setLoading(false)
            this.dialog.setDialogVisible(true)
          }
          //终点存在室内数据源 两段室内外一体化导航 先室外
        } else if (endIndoorInfo.length > 0) {
          //构造参数获取临界点
          let params = {
            startX: global.STARTX,
            startY: global.STARTY,
            endX: global.ENDX,
            endY: global.ENDY,
            datasourceName: endIndoorInfo[0].datasourceName,
          }
          let doorPoint = await SMap.getDoorPoint(params)
          //获取成功，拿到坐标和楼层id
          if (doorPoint.x && doorPoint.y && doorPoint.floorID) {
            //构建分段导航参数
            global.NAV_PARAMS = [
              {
                startX: global.STARTX,
                startY: global.STARTY,
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
                endX: global.ENDX,
                endY: global.ENDY,
                endFloor: global.ENDPOINTFLOOR || doorPoint.floorID,
                datasourceName: endIndoorInfo[0].datasourceName,
                isIndoor: true,
                hasNaved: false,
              },
            ]

            try {
              //添加起点，添加终点 设置室外导航参数 进行室外路径分析
              await SMap.getStartPoint(global.STARTX, global.STARTY, false)
              await SMap.getEndPoint(global.ENDX, global.ENDY, false)
              await SMap.startNavigation(global.NAV_PARAMS[0])
              let canNav = await SMap.beginNavigation(
                global.STARTX,
                global.STARTY,
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
                x: global.ENDX,
                y: global.ENDY,
              })
            } catch (e) {
              this.loading.setLoading(false)
              Toast.show(
                getLanguage(global.language).Prompt.PATH_ANALYSIS_FAILED,
              )
              return
            }
            //获取室外路径长度 路径信息
            pathLength = await SMap.getNavPathLength(false)
            path = await SMap.getPathInfos(false)
            //设置当前导航模式为室外
            global.CURRENT_NAV_MODE = 'OUTDOOR'
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
              global.STARTX,
              global.STARTY,
              global.ENDX,
              global.ENDY,
            )
            if (result) {
              //室外路径分析成功 获取路径长度 路径信息
              pathLength = await SMap.getNavPathLength(false)
              path = await SMap.getPathInfos(false)
              //当前全局导航模式设置为室外
              global.CURRENT_NAV_MODE = 'OUTDOOR'
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
            Toast.show(getLanguage(global.language).Prompt.PATH_ANALYSIS_FAILED)
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
        global.MAPSELECTPOINT.setVisible(false)
        global.MAPSELECTPOINTBUTTON.setVisible(false, {
          button: '',
        })
        //显示导航路径结果相关组件
        global.NAVIGATIONSTARTBUTTON.setVisible(true, false)
        global.NAVIGATIONSTARTHEAD.setVisible(true)
        this.props.setMapNavigation({
          isShow: true,
          name: '',
        })
        //退出全图
        global.toolBox.showFullMap(true)
        //存历史记录
        let history = this.props.navigationhistory
        history.push({
          sx: global.STARTX,
          sy: global.STARTY,
          ex: global.ENDX,
          ey: global.ENDY,
          sFloor: global.STARTPOINTFLOOR,
          eFloor: global.ENDPOINTFLOOR,
          address: global.STARTNAME + '---' + global.ENDNAME,
          start: global.STARTNAME,
          end: global.ENDNAME,
        })
        if (this.historyclick) {
          this.props.setNavigationHistory(history)
        }
        //跳转回MapView，设置TouchType为NULL，避免导航结果页面点击进入/退出全幅 调整楼层控件、mapController位置
        if (this.clickable) {
          this.clickable = false
          this.loading.setLoading(false)
          global.TouchType = TouchType.NULL
          //考虑搜索界面跳转，不能直接goBack
          NavigationService.navigate('MapStack', {screen: 'MapView'})
          global.mapController?.changeBottom(true)
          global.FloorListView?.changeBottom(true)
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
      getLanguage(global.language).Prompt.ROUTE_ANALYSING,
    )
    //添加起点。终点
    await SMap.getStartPoint(global.STARTX, global.STARTY, false)
    await SMap.getEndPoint(global.ENDX, global.ENDY, false)
    let path, pathLength
    //js请求online，获取路径数据
    let result = await FetchUtils.routeAnalyst(
      global.STARTX,
      global.STARTY,
      global.ENDX,
      global.ENDY,
    )
    //数据获取成功
    if (result && result[0] && result[0].pathInfos) {
      //获取路径长度 路径信息
      pathLength = { length: result[0].pathLength }
      path = result[0].pathInfos
      //绘制路径到跟踪层 移动到起点
      await SMap.drawOnlinePath(result[0].pathPoints)
      await SMap.moveToPoint({ x: global.STARTX, y: global.STARTY })
    } else {
      Toast.show(getLanguage(global.language).Prompt.PATH_ANALYSIS_FAILED)
      this.loading.setLoading(false)
    }
    if (pathLength && path) {
      //设置MapView的路径信息
      this.changeNavPathInfo({ path, pathLength })
      //隐藏地图选点相关组件
      global.MAPSELECTPOINT.setVisible(false)
      global.MAPSELECTPOINTBUTTON.setVisible(false, {
        button: '',
      })
      //显示导航路径结果相关组件
      global.NAVIGATIONSTARTBUTTON.setVisible(true, true)
      global.NAVIGATIONSTARTHEAD.setVisible(true)
      this.props.setMapNavigation({
        isShow: true,
        name: '',
      })
      //退出全图 存历史记录
      global.toolBox.showFullMap(true)
      let history = this.props.navigationhistory
      history.push({
        sx: global.STARTX,
        sy: global.STARTY,
        ex: global.ENDX,
        ey: global.ENDY,
        sFloor: global.STARTPOINTFLOOR,
        eFloor: global.ENDPOINTFLOOR,
        address: global.STARTNAME + '---' + global.ENDNAME,
        start: global.STARTNAME,
        end: global.ENDNAME,
      })
      if (this.historyclick) {
        this.props.setNavigationHistory(history)
      }
      //跳转回MapView，设置TouchType为NULL，避免导航结果页面点击进入/退出全幅 调整楼层控件、mapController位置
      if (this.clickable) {
        this.clickable = false
        this.loading.setLoading(false)
        global.TouchType = TouchType.NULL
        //考虑搜索界面跳转，不能直接goBack
        NavigationService.navigate('MapStack', {screen: 'MapView'})
        global.mapController && global.mapController.changeBottom(true)
        global.FloorListView && global.FloorListView.changeBottom(true)
      }
    }
  }

  render = () => {
    let renderHistory = this.props.navigationhistory
    return (
      <Container
        isOverlayBefore={false}
        navigation={this.props.navigation}
        withoutHeader={true}
        style={{ backgroundColor: '#ebebeb' }}
        headerProps={{
          backAction: this.close,
        }}
      >
        {/* k30 bug 横屏锁屏，竖屏解锁后container背景出现在蒙层下
         这里额外使用一个View当背景 这个View不能填满屏幕（top） 否则也会在蒙层下 zcj*/}
        <View
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundColor: '#ebebeb',
            top: scaleSize(205),
          }} />

        <View
          style={{
            paddingTop: TOOLBARHEIGHT + scaleSize(20),
            height: scaleSize(205) + TOOLBARHEIGHT,
            width: '100%',
            backgroundColor: color.content_white,
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
              source={getPublicAssets().common.icon_back}
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
                    style={[{
                      fontSize: setSpText(24),
                      padding: 0,
                    },
                    // 部分安卓多行文字最后一行显示不全问题 zcj
                    Platform.OS === 'android' && {
                      lineHeight: setSpText(25),
                      paddingTop: setSpText(6),
                    },
                    ]}
                  >
                    {this.state.startName || global.STARTNAME}
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
                    style={[{
                      fontSize: setSpText(24),
                      padding: 0,
                    },
                    Platform.OS === 'android' && {
                      lineHeight: setSpText(25),
                      paddingTop: setSpText(6),
                    },
                    ]}
                  >
                    {this.state.endName || global.ENDNAME}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        <View style={{ flex: 1, marginBottom: scaleSize(180) }}>
          <View>
            <FlatList
              style={{
                // maxHeight: scaleSize(650),
                marginLeft: scaleSize(90),
                marginRight: scaleSize(50),
                borderRadius: 5,
              }}
              data={renderHistory}
              extraData={global.STARTX}
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
                  {getLanguage(global.language).Map_Main_Menu.CLEAR_NAV_HISTORY}
                </Text>
              </TouchableOpacity>
            )}
          </View>
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
              {getLanguage(global.language).Map_Main_Menu.ROUTE_ANALYST}
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
          confirmBtnTitle={getLanguage(global.language).Prompt.YES}
          cancelBtnTitle={getLanguage(global.language).Prompt.NO}
        >
          <View style={styles.dialogHeaderView}>
            <Image
              source={require('../../../../assets/home/Frenchgrey/icon_prompt.png')}
              style={styles.dialogHeaderImg}
            />
            <Text style={styles.promptTitle}>
              {getLanguage(global.language).Prompt.USE_ONLINE_ROUTE_ANALYST}
            </Text>
          </View>
        </Dialog>
      </Container>
    )
  }

  onItemPress = async item => {
    global.STARTNAME = item.start
    global.ENDNAME = item.end

    global.STARTX = item.sx
    global.STARTY = item.sy
    global.ENDX = item.ex
    global.ENDY = item.ey
    global.STARTPOINTFLOOR = item.sFloor
    global.ENDPOINTFLOOR = item.eFloor

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
}
