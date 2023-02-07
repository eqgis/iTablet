import * as React from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import { AppUser, FetchUtils, scaleSize, setSpText, Toast } from '../../../../utils'
import color from '../../../../styles/color'
import { FileTools, SIndoorNavigation, SMap, SNavigation } from 'imobile_for_reactnative'
import NavigationService from '../../../../containers/NavigationService'
import { getLanguage } from '../../../../language'
import { TouchType } from '../../../../constants'
import { zIndexLevel } from '../../../../styles'
import { SNavigationInner } from 'imobile_for_reactnative/NativeModule/interfaces/navigation/SNavigationInner'
export default class MapSelectPointButton extends React.Component {
  props: {
    changeNavPathInfo: () => {},
    headerProps?: Object,
    setNavigationHistory: () => {},
    navigationhistory: Array,
    getNavigationDatas: () => {},
    setNavigationDatas: () => {},
    setLoading: () => {},
  }

  constructor(props) {
    super(props)
    this.state = {
      show: false,
      button: '',
      firstpage: true,
    }
  }

  setVisible = (iShow, params = {}, firstpage = true) => {
    this.setState({ show: iShow, button: params.button, firstpage: firstpage })
  }

  setButton = async () => {
    if (
      this.state.button ===
      getLanguage(global.language).Map_Main_Menu.SET_AS_START_POINT
    ) {
      if (global.STARTX) {
        global.STARTNAME =
          (await FetchUtils.getPointName(global.STARTX, global.STARTY)) ||
          `${
            getLanguage(global.language).Map_Main_Menu.START_POINT
          }(${global.STARTX.toFixed(6)},${global.STARTY.toFixed(6)})`
        if (this.state.firstpage) {
          global.STARTPOINTFLOOR = await SNavigationInner.getCurrentFloorID()
          global.TouchType = TouchType.NORMAL
          NavigationService.navigate('NavigationView', {
            changeNavPathInfo: this.props.changeNavPathInfo,
          })
          this.setState({
            show: false,
          })
          global.MAPSELECTPOINT?.setState({
            show: false,
          })
        } else {
          await SNavigationInner.getEndPoint(
            global.ENDX,
            global.ENDY,
            false,
            global.ENDPOINTFLOOR,
          )
          this.routeAnalyst()
        }
      }
    } else {
      if (global.ENDX) {
        global.ENDNAME =
          (await FetchUtils.getPointName(global.ENDX, global.ENDY)) ||
          `${
            getLanguage(global.language).Map_Main_Menu.END_POINT
          }(${global.ENDX.toFixed(6)},${global.ENDY.toFixed(6)})`
        if (this.state.firstpage) {
          global.ENDPOINTFLOOR = await SNavigationInner.getCurrentFloorID()
          global.TouchType = TouchType.NORMAL
          NavigationService.navigate('NavigationView', {
            changeNavPathInfo: this.props.changeNavPathInfo,
          })
          this.setState({
            show: false,
          })
          global.MAPSELECTPOINT?.setState({
            show: false,
          })
        } else {
          await SNavigationInner.getStartPoint(
            global.STARTX,
            global.STARTY,
            false,
            global.STARTPOINTFLOOR,
          )
          this.routeAnalyst()
        }
      } else {
        Toast.show(getLanguage(global.language).Prompt.TOUCH_TO_ADD_END)
      }
    }
  }

  // [{datasourceName:'',datasetName:'',name:''}]
  // [{datasourceName:'',name:''}]
  //获取数组中相同的对象
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

  routeAnalyst = async () => {
    if (global.STARTX !== undefined && global.ENDX !== undefined) {
      this.props.setLoading(
        true,
        getLanguage(global.language).Prompt.ROUTE_ANALYSING,
      )
      let startPointInfo
      let endPointInfo
      try {
        startPointInfo = await SNavigationInner.getPointBelongs(
          global.STARTX,
          global.STARTY,
        )
        endPointInfo = await SNavigationInner.getPointBelongs(global.ENDX, global.ENDY)
      } catch (e) {
        this.props.setLoading(false)
        Toast.show(' 获取数据失败')
        return
      }
      let startIndoorInfo = startPointInfo.filter(item => item.isIndoor)
      let startOutdoorInfo = startPointInfo.filter(item => !item.isIndoor)
      let endIndoorInfo = endPointInfo.filter(item => item.isIndoor)
      let endOutdoorInfo = endPointInfo.filter(item => !item.isIndoor)
      let commonIndoorInfo = this.getSameInfoFromArray(
        startIndoorInfo,
        endIndoorInfo,
      )
      let commonOutdoorInfo = this.getSameInfoFromArray(
        startOutdoorInfo,
        endOutdoorInfo,
      )
      let selectedData = this.props.getNavigationDatas()
      let datasources = selectedData.selectedDatasources
      let datasets = selectedData.selectedDatasets
      let currentDataset = {}
      let currentDatasource = []
      //这个界面导航数据必定已选择，即使用户没有手动选择，上个界面路径分析也选择了
      //if(datasources.length > 0 || datasets.length > 0){
      commonIndoorInfo = this.getSameInfoFromArray(
        commonIndoorInfo,
        datasources,
      )
      commonOutdoorInfo = this.getSameInfoFromArray(commonOutdoorInfo, datasets)
      let selectedDatasources = datasources
      let selectedDatasets = datasets
      console.warn('map',commonIndoorInfo, commonOutdoorInfo)
      if (commonIndoorInfo.length > 0) {
        currentDatasource = commonIndoorInfo
        currentDataset = []
      } else if (commonOutdoorInfo.length > 0) {
        currentDataset = commonOutdoorInfo[0]
        currentDatasource = []
        if (datasources.length === 0) {
          startIndoorInfo = []
          endIndoorInfo = []
        } else {
          startIndoorInfo.length > 0 &&
            currentDatasource.push(startIndoorInfo[0])
          endIndoorInfo.length > 0 && currentDatasource.push(endIndoorInfo[0])
        }
      }
      // }

      this.props.setNavigationDatas({
        selectedDatasources,
        selectedDatasets,
        currentDataset,
        currentDatasource,
      })
      let path, pathLength
      if (commonIndoorInfo.length > 0) {
        // todo 室内点的问题 图标问题 最好统一js显示
        //有公共室内数据源，室内导航
        // await SNavigation.clearPoint
        try {
          await SNavigationInner.getStartPoint(
            global.STARTX,
            global.STARTY,
            true,
            global.STARTPOINTFLOOR,
          )
          await SNavigationInner.getEndPoint(
            global.ENDX,
            global.ENDY,
            true,
            global.ENDPOINTFLOOR,
          )
          await SIndoorNavigation.setRouteAnalyzeData({datasourceAlias: commonIndoorInfo[0].datasourceName})
          let rel = await SIndoorNavigation.routeAnalyst()
          if (!rel) {
            this.props.setLoading(false)
            Toast.show(getLanguage(global.language).Prompt.PATH_ANALYSIS_FAILED)
            return
          }
          pathLength = {length: parseInt(rel.naviPath.length + '')}
          path = rel.naviPath.naviStep.map(step => {
            return {
              roadLength: step.length,
              turnType: step.dirToSwerve
            }
          })
        } catch (e) {
          this.props.setLoading(false)
          Toast.show(getLanguage(global.language).Prompt.PATH_ANALYSIS_FAILED)
          return
        }
        global.CURRENT_NAV_MODE = 'INDOOR'
      } else if (commonOutdoorInfo.length > 0) {
        //有公共室外数据集，分情况
        if (startIndoorInfo.length > 0 && endIndoorInfo.length > 0) {
          //todo 有不同的室内数据源 三段室内外一体化导航
          //getDoorPoint两次 获取最近的两个门的位置，然后启动室内导航
        } else if (startIndoorInfo.length > 0) {
          //起点室内数据源 两段室内外一体化导航 先室内
          let params = {
            startX: global.STARTX,
            startY: global.STARTY,
            endX: global.ENDX,
            endY: global.ENDY,
            datasourceName: startIndoorInfo[0].datasourceName,
          }
          let doorPoint = await SNavigationInner.getDoorPoint(params)
          if (doorPoint && doorPoint.x && doorPoint.y && doorPoint.floorID) {
            global.NAV_PARAMS = [
              {
                startX: global.STARTX,
                startY: global.STARTY,
                endX: doorPoint.x,
                endY: doorPoint.y,
                datasourceName: startIndoorInfo[0].datasourceName,
                isIndoor: true,
                hasNaved: true,
              },
              {
                startX: doorPoint.x,
                startY: doorPoint.y,
                startFloor: doorPoint.floorID,
                endX: global.ENDX,
                endY: global.ENDY,
                endFloor: global.ENDPOINTFLOOR || doorPoint.floorID,
                isIndoor: false,
                hasNaved: false,
                datasourceName: commonOutdoorInfo[0].datasourceName,
                datasetName: commonOutdoorInfo[0].datasetName,
                modelFileName: commonOutdoorInfo[0].modelFileName,
              },
            ]
            try {
              await SNavigationInner.getStartPoint(
                global.STARTX,
                global.STARTY,
                true,
                global.STARTPOINTFLOOR || doorPoint.floorID,
              )
              await SNavigationInner.getEndPoint(
                doorPoint.x,
                doorPoint.y,
                true,
                doorPoint.floorID,
              )
              await SIndoorNavigation.setRouteAnalyzeData({datasourceAlias: startIndoorInfo[0].datasourceName})
              let rel = await SIndoorNavigation.routeAnalyst()
              if (!rel) {
                this.props.setLoading(false)
                Toast.show(
                  getLanguage(global.language).Prompt.PATH_ANALYSIS_FAILED,
                )
                return
              }
              pathLength = {length: parseInt(rel.naviPath.length + '')}
              path = rel.naviPath.naviStep.map(step => {
                return {
                  roadLength: step.length,
                  turnType: step.dirToSwerve
                }
              })
              await SNavigationInner.addLineOnTrackingLayer(doorPoint, {
                x: global.ENDX,
                y: global.ENDY,
              })
            } catch (e) {
              this.props.setLoading(false)
              Toast.show(
                getLanguage(global.language).Prompt.PATH_ANALYSIS_FAILED,
              )
              SNavigationInner.clearPoint()
              return
            }

            global.CURRENT_NAV_MODE = 'INDOOR'
          } else {
            //分析失败(找不到最近的门的情况（数据问题）) 进行在线路径分析
            this.props.setLoading(false)
            global.NavDialog && global.NavDialog.setDialogVisible(true)
          }
        } else if (endIndoorInfo.length > 0) {
          //终点室内数据源 两段室内外一体化导航 先室外
          let params = {
            startX: global.STARTX,
            startY: global.STARTY,
            endX: global.ENDX,
            endY: global.ENDY,
            datasourceName: endIndoorInfo[0].datasourceName,
          }
          let doorPoint = await SNavigationInner.getDoorPoint(params)
          if (doorPoint && doorPoint.x && doorPoint.y && doorPoint.floorID) {
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
              await SNavigationInner.getStartPoint(global.STARTX, global.STARTY, false)
              await SNavigationInner.getEndPoint(global.ENDX, global.ENDY, false)
              const homePath = await FileTools.getHomeDirectory()
              const userName = AppUser.getCurrentUser().userName
              const modelPath = `${homePath}/iTablet/User/${userName}/Data/Datasource/${global.NAV_PARAMS[0].modelFileName}.snm`
              await SNavigation.setRouteAnalyzeData({
                networkDataset: {
                  datasourceAlias: global.NAV_PARAMS[0].datasourceName,
                  datasetName:  global.NAV_PARAMS[0].datasetName
                },
                modelPath: modelPath
              })
              await SNavigation.setRouteAnalyzePoints({
                startPoint: {x: global.STARTX, y: global.STARTY},
                destinationPoint: {x: doorPoint.x, y: doorPoint.y}
              })
              const r = await SNavigation.routeAnalyst()
              if(r) {
                //todo 添加分析起终点到参数起终点之间的虚线
              }
              await SNavigationInner.addLineOnTrackingLayer(doorPoint, {
                x: global.ENDX,
                y: global.ENDY,
              })
              pathLength = {length: parseInt(r.naviPath.length + '')}
              path = r.naviPath.naviStep.map(step => {
                return {
                  roadLength: step.length,
                  turnType: step.dirToSwerve
                }
              })
            } catch (e) {
              this.props.setLoading(false)
              Toast.show(
                getLanguage(global.language).Prompt.PATH_ANALYSIS_FAILED,
              )
              return
            }
            global.CURRENT_NAV_MODE = 'OUTDOOR'
          } else {
            //分析失败(找不到最近的门的情况（数据问题）) 进行在线路径分析
            this.props.setLoading(false)
            global.NavDialog && global.NavDialog.setDialogVisible(true)
          }
        } else {
          //无室内数据源  室外导航
          //直接导航
          try {
            const homePath = await FileTools.getHomeDirectory()
            const userName = AppUser.getCurrentUser().userName
            const modelPath = `${homePath}/iTablet/User/${userName}/Data/Datasource/${commonOutdoorInfo[0].modelFileName}.snm`
            await SNavigation.setRouteAnalyzeData({
              networkDataset: {
                datasourceAlias: commonOutdoorInfo[0].datasourceName,
                datasetName:  commonOutdoorInfo[0].datasetName
              },
              modelPath: modelPath
            })

            await SNavigation.setRouteAnalyzePoints({
              startPoint: {x: global.STARTX, y: global.STARTY},
              destinationPoint: {x: global.ENDX, y: global.ENDY}
            })
            const result = await SNavigation.routeAnalyst()
            if(result) {
              //todo 添加分析起终点到参数起终点之间的虚线
            }
            if (result) {
              pathLength = {length: parseInt(result.naviPath.length + '')}
              path = result.naviPath.naviStep.map(step => {
                return {
                  roadLength: step.length,
                  turnType: step.dirToSwerve
                }
              })
              global.CURRENT_NAV_MODE = 'OUTDOOR'
            } else {
              //分析失败(500m范围内找不到路网点的情况) 进行在线路径分析
              this.props.setLoading(false)
              global.NavDialog && global.NavDialog.setDialogVisible(true)
            }
          } catch (e) {
            this.props.setLoading(false)
            Toast.show(getLanguage(global.language).Prompt.PATH_ANALYSIS_FAILED)
            return
          }
        }
      } else {
        //在线路径分析
        this.props.setLoading(false)
        global.NavDialog && global.NavDialog.setDialogVisible(true)
      }
      if (path && pathLength) {
        global.TouchType = TouchType.NORMAL
        this.props.setLoading(false)
        global.NAVIGATIONSTARTBUTTON.setVisible(true, false)
        global.NAVIGATIONSTARTHEAD.setVisible(true)
        this.setVisible(false)
        global.MAPSELECTPOINT.setVisible(false)
        this.props.changeNavPathInfo &&
          this.props.changeNavPathInfo({ path, pathLength })

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
        this.props.setNavigationHistory(history)
      }
    }
  }

  render() {
    let width =
      global.getDevice().orientation.indexOf('LANDSCAPE') === 0 ? '50%' : '80%'
    if (this.state.show) {
      console.log('show mapselect')
      return (
        <View
          style={{
            position: 'absolute',
            bottom: scaleSize(30),
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: zIndexLevel.FOUR,
          }}
        >
          <TouchableOpacity
            activeOpacity={0.5}
            style={{
              width,
              height: scaleSize(60),
              borderRadius: 50,
              backgroundColor: color.blue1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => {
              this.setButton()
            }}
          >
            <Text
              style={{
                fontSize: setSpText(20),
                color: color.white,
              }}
            >
              {this.state.button}
            </Text>
          </TouchableOpacity>
        </View>
      )
    } else {
      return <View />
    }
  }
}
