import React, { Component } from 'react'
import {
  Text,
  FlatList,
  TouchableOpacity,
  View,
  TextInput,
  Image,
  ScrollView,
  ListRenderItemInfo,
} from 'react-native'
import { Container, SearchBar } from '../../components'
import { SScene, SMap, SData, GeoStyle } from 'imobile_for_reactnative'
import NavigationService from '../NavigationService'
import { OnlineServicesUtils, scaleSize, screen, setSpText, Toast } from '../../utils'
import styles from './styles'
import { getLanguage } from '../../language/index'
import PropTypes from 'prop-types'
import PoiData from './PoiData'
import color from '../../styles/color'
import { TouchType, ChunkType } from '../../constants'
import { getThemeAssets } from '../../assets'
import LocateUtils, { SeachResult } from './LocateUtils'
import { RouteAnalyzeResult } from '@/utils/OnlineServicesUtils'
import { AltitudeMode, GeoStyle3D } from 'imobile_for_reactnative/NativeModule/interfaces/scene/SScene'
import { GeometryType } from 'imobile_for_reactnative/NativeModule/interfaces/data/SData'
import ScenePositionHelper from '../workspace/pages/map3D/ScenePositionHelper'

interface Props {
  navigation: Object,
  mapSearchHistory: PointInfo[],
  language: string,
  setMapSearchHistory: () => {},
}


interface State {
  searchValue: null | string,
  searchData: (PointInfo & {distance?: string})[],
  /** 3维分析数据结果列表 */
  analystData: PointInfo[],
  firstPoint: null,
  secondPoint: null,
  showList: boolean
}


interface PointInfo {
  x: number,
  y: number,
  pointName: string,
  address: string
}

export default class PointAnalyst extends Component<Props, State> {

  static propTypes = {
    mapNavigation: PropTypes.object,
    navigationChangeAR: PropTypes.bool,
    setMapNavigation: PropTypes.func,
    setNavigationChangeAR: PropTypes.func,
  }

  onlineService = new OnlineServicesUtils('online')

  /** 是否3维模块内 */
  is3D: boolean

  type: 'pointSearch' | 'pointAnalyst'

  constructor(props: Props) {
    super(props)
    const { params } = this.props.route
    this.type = params.type
    this.searchClickedInfo = params.searchClickedInfo || {}
    this.changeNavPathInfo = params.changeNavPathInfo || {}
    this.is3D = global.Type === ChunkType.MAP_3D
    this.PointType = null
    this.state = {
      searchValue: null,
      searchData: [],
      analystData: [],
      firstPoint: null,
      secondPoint: null,
      showList: true,
    }
    //默认搜索半径5km 结果不足十条范围扩大十倍
    this.radius = 5000
    this.orientation =global.getDevice().orientation
  }


  search = async (text: string) => {
    const results = await this.onlineService.searchPoi({'keywords': text, pageSizeNum: 10, pageNum: 0})
    const data: PointInfo[] = results?.poiInfos.map(item => {
      return {
        pointName: item.name,
        address: item.address,
        x: item.location.x,
        y: item.location.y,
      }
    }) || []
    if (this.type === 'pointAnalyst') {
      this.setState({ analystData: data })
    } else {
      this.setState({ searchData: data })
      this.setLoading(false)
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      JSON.stringify(nextState) !== JSON.stringify(this.state) ||
      JSON.stringify(nextProps.mapSearchHistory) !== JSON.stringify(this.props.mapSearchHistory) ||
      nextProps.language !== this.props.language ||
      this.orientation !==  global.getDevice().orientation
    )
  }


  _keyExtractor = (item, index) => index

  onListItemPress = async (item, index) => {
    if (this.searchClickedInfo.isClicked) {
      const title = this.searchClickedInfo.title
      if (
        title === getLanguage(global.language).Map_Main_Menu.SET_AS_START_POINT
      ) {
        //设置起点
        global.STARTX = item.x
        global.STARTY = item.y
        global.STARTNAME = item.pointName
        await SMap.removeCallout('startPoint')
        await SMap.addCallout('startPoint', {x: global.STARTX, y: global.STARTY}, {type: 'image', resource: 'start_point'})
        if (global.ENDX && global.ENDY) {
          await SMap.removeCallout('endPoint')
          await SMap.addCallout('endPoint', {x: global.ENDX, y: global.ENDY}, {type: 'image', resource: 'destination_point'})
        }
      } else {
        //设置终点
        global.ENDX = item.x
        global.ENDY = item.y
        global.ENDNAME = item.pointName
        await SMap.removeCallout('endPoint')
        await SMap.addCallout('endPoint', {x: global.ENDX, y: global.ENDY}, {type: 'image', resource: 'destination_point'})
        if (global.STARTX && global.STARTY) {
          await SMap.removeCallout('startPoint')
          await SMap.addCallout('startPoint', {x: global.STARTX, y: global.STARTY}, {type: 'image', resource: 'start_point'})
        }
      }
      NavigationService.navigate('NavigationView', {
        changeNavPathInfo: this.changeNavPathInfo,
        getNavigationDatas: this.getNavigationDatas,
      })
      this.setState({
        searchValue: null,
        searchData: [],
        analystData: [],
        firstPoint: null,
        secondPoint: null,
        showList: true,
      })
    } else {
      const historyArr = this.props.mapSearchHistory
      let hasAdded = false
      historyArr.map(v => {
        if (v.pointName === item.pointName) hasAdded = true
      })
      if (!hasAdded) {
        historyArr.push({
          x: item.x,
          y: item.y,
          pointName: item.pointName,
          address: item.address,
        })
      }
      this.props.setMapSearchHistory(historyArr)
      this.toLocationPoint({ item, pointName: item.pointName, index })
    }
  }

  renderItem = ({ item, index }: ListRenderItemInfo<PointInfo | SeachResult>) => {
    return (
      <View>
        <TouchableOpacity
          style={styles.itemView}
          onPress={() => {
            this.onListItemPress(item, index)
          }}
        >
          <Image
            style={styles.pointImg}
            source={require('../../assets/mapToolbar/icon_scene_position.png')}
          />
          {item.pointName && (
            <Text style={styles.itemText}>{item.pointName}</Text>
          )}
          {item.distance && (
            <Text style={styles.distance}>{item.distance}</Text>
          )}
        </TouchableOpacity>
        <View style={styles.itemSeparator} />
      </View>
    )
  }

  point1: PointInfo | null = null

  startStyle: Partial<GeoStyle3D> = {
    altitudeMode: AltitudeMode.ABSOLUTE,
    markerScale: 2,
    markerFile: 'APP://config/Resource/icon_start.png'
  }

  endStyle: Partial<GeoStyle3D> = {
    altitudeMode: AltitudeMode.ABSOLUTE,
    markerScale: 2,
    markerFile: 'APP://config/Resource/icon_end.png'
  }

  addRouteOnScene = async (result: RouteAnalyzeResult) => {
    const start = result.pathPoints[0]
    const end = result.pathPoints[result.pathPoints.length - 1]

    SScene.addGeometryToTrackingLayer({type: GeometryType.GEOPLACEMARK, point: {...start, z: 0}, text: '起点'}, 'start', this.startStyle)
    SScene.addGeometryToTrackingLayer({type: GeometryType.GEOPLACEMARK, point: {...end, z: 0}, text: '终点'}, 'end', this.endStyle)

    const line = result.pathPoints

    const style = new GeoStyle()
    style.setLineColor(255, 255, 0)
    style.setLineWidth(4)

    SScene.addGeometryToTrackingLayer({type: GeometryType.GEOLINE, points: [line]}, 'line', style)


    const bounds = await SData.getGeometryBounds({type: GeometryType.GEOLINE, points: [line]})
    bounds && SScene.ensureVisible(bounds)

  }

  toLocationPoint = async ({ item, pointName, index }: {item: PointInfo | SeachResult, pointName: string, index: number}) => {
    try {
      if (this.is3D) {
        if (this.PointType) {
          if (this.PointType === 'firstPoint') {
            this.point1 = item
            this.setState({ firstPoint: pointName, analystData: [] })
          } else {
            this.container.setLoading(
              true,
              getLanguage(global.language).Prompt.ANALYSING,
            )
            //'路径分析中')
            this.setState({ secondPoint: pointName, analystData: [] })

            const result = await this.onlineService.routeAnalyze({
              startPoint: {x: this.point1?.x, y: this.point1?.y},
              endPoint: {x: item.x, y: item.y},
              routeType: 'MINLENGTH'
            })
            if (result) {
              this.addRouteOnScene(result)
              this.container.setLoading(false)
              NavigationService.goBack()
            } else {
              Toast.show(getLanguage(global.language).Prompt.NETWORK_ERROR)
              //'网络错误')
            }
          }
        } else {
          this.container.setLoading(
            true,
            getLanguage(global.language).Prompt.SERCHING,
          )
          // '位置搜索中')
          this.setState({ searchValue: pointName, searchData: [] })
          ScenePositionHelper.flyToPlace(pointName, {longitude: item.x, latitude: item.y})
          const result = true
          if (result) {
            this.container.setLoading(false)
            NavigationService.goBack()
          } else {
            Toast.show(getLanguage(global.language).Prompt.NETWORK_ERROR)
            //'网络错误')
          }
        }
      } else {
        this.container.setLoading(
          true,
          getLanguage(global.language).Prompt.SEARCHING,
        )
        const x = item.x
        const y = item.y
        const address = item.address
        this.setState({ searchValue: pointName, searchData: [] })
        if (global.Type === ChunkType.MAP_NAVIGATION) {
          await SMap.clearTrackingLayer()
          this.props.setMapNavigation({
            isShow: true,
            name: pointName,
          })
        }
        const result = await SMap._toLocationPoint(item)
        if (result) {
          global.PoiTopSearchBar.setVisible(true)
          global.PoiTopSearchBar.setState({ defaultValue: item.pointName })
          global.PoiInfoContainer &&
            global.PoiInfoContainer.setState(
              {
                destination: this.state.searchValue,
                location: { x, y },
                address,
                showList: false,
                showMore: false,
                neighbor: [],
                resultList: [],
              },
              () => {
                global.PoiInfoContainer.setVisible(true, {radius: this.radius})
                this.container.setLoading(false)
                NavigationService.goBack()
              },
            )
        } else {
          Toast.show(getLanguage(global.language).Prompt.NETWORK_ERROR)
        }
      }
    } catch (error) {
      Toast.show(getLanguage(global.language).Prompt.NETWORK_ERROR)
      this.container && this.container.setLoading(false)
      //'网络错误')
    }
  }

  renderPointAnalyst = () => {
    return (
      <View>
        <View style={styles.pointAnalystView}>
          <View style={{ flexDirection: 'column', flex: 1 }}>
            <View style={styles.pointAnalystRow}>
              <Image
                resizeMode={'contain'}
                source={require('../../assets/mapToolbar/icon_scene_tool_start.png')}
                style={styles.startPoint}
              />
              <TextInput
                onChangeText={text => {
                  if (text === null || text === '') {
                    this.setState({ firstPoint: text, analystData: [] })
                    return
                  }
                  this.search(text)
                  this.PointType = 'firstPoint'
                  this.setState({ firstPoint: text })
                }}
                value={this.state.firstPoint}
                style={styles.onInput}
                placeholder={
                  getLanguage(global.language).Prompt.CHOOSE_STARTING_POINT
                }
                placeholderTextColor={color.fontColorGray}
              />
            </View>
            <View style={styles.pointAnalystRow}>
              <Image
                resizeMode={'contain'}
                source={require('../../assets/mapToolbar/icon_scene_tool_end.png')}
                style={styles.endPoint}
              />
              <TextInput
                onChangeText={text => {
                  if (text === null || text === '') {
                    this.setState({ secondPoint: text, analystData: [] })
                    return
                  }
                  this.search(text)
                  this.PointType = 'secondPoint'
                  this.setState({ secondPoint: text })
                }}
                value={this.state.secondPoint}
                style={styles.secondInput}
                placeholder={
                  getLanguage(global.language).Prompt.CHOOSE_DESTINATION
                }
                placeholderTextColor={color.fontColorGray}
              />
            </View>
          </View>
          <Image
            resizeMode={'contain'}
            source={getThemeAssets().mapTools.icon_path_analysis}
            style={styles.analyst}
          />
        </View>
        <View>
          <FlatList
            data={this.state.analystData}
            renderItem={this.renderItem}
          />
        </View>
      </View>
    )
  }

  renderPointSearch = () => {
    return (
      <View>
        <View>
          <FlatList
            data={this.state.searchData}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => (item.pointName + index).toString()}
          />
        </View>
      </View>
    )
  }

  setLoading = (loading = false, info, extra) => {
    this.container && this.container.setLoading(loading, info, extra)
  }

  /**
   * zhangxt 2020-10-12 通过关键字查询，结果显示在本页面列表内
   * @param {*} key 查询关键字
   */
  getSearchResult = async key => {
    let location, currentLocation
    if (this.is3D) {
      location = await SScene.getCameraLocation()
      currentLocation = location
    } else {
      location = (await SData.CoordSysTranslatorPrjToGPS(await SMap.getPrjCoordSys(),[await SMap.getMapCenter()]))[0]
      // location = await SMap.getMapcenterPosition()
      const _location = await SMap.getCurrentLocation()
      currentLocation = { x: _location.longitude, y: _location.latitude }
    }
    this.location = location
    LocateUtils.getSearchResult(
      {
        keyWords: key,
        location: JSON.stringify(location),
        radius: this.radius,
      },
      currentLocation,
      res => {
        if (!res) return
        this.setState({
          searchData: res.resultList,
          // poiInfos: res.poiInfos,
          showList: false,
        })
        if (res && res.radius) {
          this.radius = res.radius
        }
      },
    )
  }

  renderSearchBar = () => {
    return (
      <SearchBar
        ref={ref => (this.searchBar = ref)}
        onClear={() => {
          if (!this.is3D && this.type === 'pointSearch') {
            this.setState({
              showList: true,
              searchData: [],
            })
          }
        }}
        onSubmitEditing={async searchKey => {
          // this.setLoading(true, getLanguage(global.language).Prompt.SERCHING)
          //zhangxt 2020-10-12 通过关键字搜索,其他参数在方法内获得
          this.getSearchResult(searchKey)
        }}
        placeholder={getLanguage(global.language).Prompt.ENTER_KEY_WORDS}
        placeholderTextColor={color.fontColorGray}
      />
    )
  }

  renderIconItem = () => {
    const orientation = global.getDevice().orientation
    this.orientation =  orientation
    const maxHeight = screen.getScreenHeight(orientation)
    const headerHeight = screen.getHeaderHeight(orientation)
    const data = PoiData()
    return (
      <View
        style={{
          width: '100%',
        }}
      >
        <FlatList
          style={{
            //最大高度为 屏幕高度 - 前一个Flatlist的高度 - 清除历史按键高度 - 顶部搜索栏高度
            maxHeight:
              maxHeight - (scaleSize(70) + headerHeight),
          }}
          ListHeaderComponent={() => {
            return (
              <FlatList
                style={styles.wrapper}
                renderItem={this.renderIcons}
                data={data}
                keyExtractor={(item, index) => item.title + index}
                numColumns={4}
              />
            )
          }}
          renderItem={this.renderItem}
          data={this.props.mapSearchHistory}
          keyExtractor={(item, index) => item.pointName + index}
          numColumns={1}
        />
        {this.props.mapSearchHistory.length > 0 && (
          <TouchableOpacity
            style={{
              backgroundColor: color.background,
              width: '100%',
              height: scaleSize(70),
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => {
              this.props.setMapSearchHistory &&
                this.props.setMapSearchHistory([])
            }}
          >
            <Text
              style={{
                fontSize: setSpText(20),
              }}
            >
              {getLanguage(global.language).Prompt.CLEAR_SEARCH_HISTORY}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    )
  }
  renderIcons = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={async () => {
          //zhangxt 2020-10-12 将3维搜索从原接口分离，走关键字搜索的流程
          if (!this.is3D) {
            LocateUtils.SearchPoiInMapView(
              {
                ...item,
                radius: this.radius,
                is3D: this.is3D,
              },
              async () => {
                if (!this.is3D) {
                  if (global.Type === ChunkType.MAP_NAVIGATION) {
                    global.TouchType = TouchType.NORMAL
                    await SMap.clearTrackingLayer()
                    // this.props.setNavigationChangeAR(true)
                    this.props.setMapNavigation({
                      isShow: true,
                      name: item.title,
                    })
                  }
                }
              },
            )
          } else {
            this.getSearchResult(item.title)
          }
        }}
        style={styles.searchIconWrap}
      >
        <Image
          style={styles.searchIcon}
          source={item.icon}
          resizeMode={'contain'}
        />
        <Text style={styles.iconTxt}>{item.title}</Text>
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <Container
        isOverlayBefore={false}
        style={styles.container}
        ref={ref => (this.container = ref)}
        initWithLoading={false}
        headerProps={{
          title:
            this.type === 'pointSearch'
              ? ''
              : getLanguage(this.props.language).Map_Main_Menu
                .TOOLS_PATH_ANALYSIS,
          // navigation: this.props.navigation,
          backAction: () => {
            // if (this.searchClickedInfo.isClicked) {
            //   global.LocationView && global.LocationView.setVisible(true, true)
            // }
            this.props.navigation.goBack()
            global.PoiTopSearchBar && global.PoiTopSearchBar.setVisible(false)
          },
          headerCenter:
            this.type === 'pointSearch' ? this.renderSearchBar() : null,
        }}
      >
        {this.type === 'pointSearch' &&
          this.state.showList &&
          this.renderIconItem()}
        {this.type === 'pointSearch'
          ? this.renderPointSearch()
          : this.renderPointAnalyst()}
      </Container>
    )
  }
}
