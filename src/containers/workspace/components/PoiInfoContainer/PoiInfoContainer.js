/**
 * Copyright © SuperMap. All rights reserved.
 * Author: Asort
 * https://github.com/AsortKeven
 */
import * as React from 'react'
import {
  Animated,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native'
import { SMap } from 'imobile_for_reactnative'
import styles from './style'
import { scaleSize, screen } from '../../../../utils'
import PoiData from '../../../pointAnalyst/PoiData'
import Toast from '../../../../utils/Toast'
import { getLanguage } from '../../../../language'
import { ChunkType, TouchType } from '../../../../constants'
import NavigationService from '../../../NavigationService'
import LocateUtils from '../../../pointAnalyst/LocateUtils'
import { ScrollView } from 'react-native-gesture-handler'

export default class PoiInfoContainer extends React.Component {
  props: {
    device: Object,
    changeNavPathInfo: () => {},
    setMapNavigation: () => {},
    mapSearchHistory: Array,
    setMapSearchHistory: () => {},
    setNavigationPoiView: () => {},
    setNavigationChangeAR: () => {},
    getNavigationDatas: () => {},
    //获取mapView中的getSearchClickedInfo属性,判断是从哪个页面跳转搜索 得出的结果
    getSearchClickedInfo: () => {},
    setLoading: () => {},
  }

  constructor(props) {
    super(props)
    this.state = {
      destination: '',
      location: {},
      address: '',
      showMore: false,
      showList: false,
      neighbor: [],
      resultList: [],
      visible: false,
      radius: 5000,
    }
    this.tempResult = {
      name: '',
      tempList: [],
    } //暂存搜索结果，用于返回事件
    this.bottom = new Animated.Value(
      -screen.getScreenHeight(props.device.orientation),
    )
    this.boxHeight = new Animated.Value(0)
    this.height = new Animated.Value(0)
    this.width = new Animated.Value(0)
  }

  componentDidMount() {
    let animParams = this.getAnimParams()
    this.startAnim(animParams)
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      JSON.stringify(nextState) !== JSON.stringify(this.state) ||
      JSON.stringify(nextProps.device) !== JSON.stringify(this.props.device) ||
      JSON.stringify(nextProps.mapSearchHistory) !== JSON.stringify(this.props.mapSearchHistory)
    )
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.device.orientation !== this.props.device.orientation ||
      prevState.visible !== this.state.visible
    ) {
      let animParams = this.getAnimParams()
      this.startAnim(animParams)
    }
  }

  getAnimParams = () => {
    let width, height, bottom, boxHeight
    if (this.props.device.orientation.indexOf('LANDSCAPE') === 0) {
      width = screen.getScreenWidth(this.props.device.orientation) * 0.45
      if (this.state.showMore) {
        height = scaleSize(80)
        bottom =
          screen.getScreenHeight(this.props.device.orientation) -
          screen.getHeaderHeight() -
          scaleSize(80)
        boxHeight = scaleSize(80)
      }
      if (!this.state.showList && this.state.destination) {
        boxHeight = scaleSize(200)
        height = scaleSize(200)
        bottom =
          screen.getScreenHeight(this.props.device.orientation) -
          screen.getHeaderHeight() -
          scaleSize(200)
      }
      if (this.state.showList && this.state.resultList.length === 0) {
        boxHeight = scaleSize(340)
        height = scaleSize(340)
        bottom =
          screen.getScreenHeight(this.props.device.orientation) -
          screen.getHeaderHeight() -
          scaleSize(340)
      }
      if (
        this.state.showList &&
        this.state.resultList.length !== 0 &&
        !this.state.showMore
      ) {
        boxHeight =
          screen.getScreenHeight(this.props.device.orientation) -
          screen.getHeaderHeight()
        height =
          screen.getScreenHeight(this.props.device.orientation) -
          screen.getHeaderHeight()
        bottom = 0
      }
    } else {
      width = screen.getScreenWidth(this.props.device.orientation)
      bottom = 0
      if (this.state.showMore) {
        boxHeight = scaleSize(80)
        height = scaleSize(80)
      }
      if (!this.state.showList) {
        height = scaleSize(200)
        boxHeight = scaleSize(200)
      }
      if (this.state.showList && this.state.resultList.length === 0) {
        height = scaleSize(340)
        boxHeight = scaleSize(340)
      }
      if (
        this.state.showList &&
        this.state.resultList.length !== 0 &&
        !this.state.showMore
      ) {
        boxHeight = scaleSize(450)
        height = scaleSize(450)
      }
    }
    //隐藏状态
    if (!this.state.visible) {
      bottom = -screen.getScreenHeight(this.props.device.orientation)
    }
    return { width, height, bottom, boxHeight }
  }

  startAnim = ({ width, height, bottom, boxHeight }) => {
    let AnimationList = []
    width !== undefined &&
      AnimationList.push(
        Animated.timing(this.width, {
          toValue: width,
          duration: 300,
          useNativeDriver: false,
        }),
      )
    height !== undefined &&
      AnimationList.push(
        Animated.timing(this.height, {
          toValue: height,
          duration: 300,
          useNativeDriver: false,
        }),
      )
    bottom !== undefined &&
      AnimationList.push(
        Animated.timing(this.bottom, {
          toValue: bottom,
          duration: 300,
          useNativeDriver: false,
        }),
      )
    boxHeight !== undefined &&
      AnimationList.push(
        Animated.timing(this.boxHeight, {
          toValue: boxHeight,
          duration: 300,
          useNativeDriver: false,
        }),
      )
    Animated.parallel(AnimationList).start()
  }

  // 显示 底部存在搜周边按钮的状态  / 隐藏
  setVisible = (visible, state = {
    radius: 5000,
    resultList: this.state.resultList,
    showList: this.state.resultList,
  }) => {
    if (visible === this.state.visible) {
      return
    }
    global.TouchType = visible ? TouchType.MAP_NAVIGATION : TouchType.NORMAL
    let value = visible ? 0 : scaleSize(-screen.getScreenHeight())
    Animated.timing(this.bottom, {
      toValue: value,
      duration: 400,
      useNativeDriver: false,
    }).start()
    global.toolBox && global.toolBox.showFullMap()
    if (!visible) {
      Animated.timing(this.height, {
        toValue: 0,
        duration: 400,
        useNativeDriver: false,
      }).start()
      Animated.timing(this.boxHeight, {
        toValue: 0,
        duration: 10,
        useNativeDriver: false,
      }).start()
      //同时隐藏顶部框
      global.PoiTopSearchBar && global.PoiTopSearchBar.setVisible(false)
      global.toolBox && global.toolBox.existFullMap()
    }
    this.setState({
      visible,
      ...state,
    })
  }

  getDistance = (p1, p2) => {
    //经纬度差值转距离 单位 m
    let R = 6371393
    return Math.abs(
      ((p2.x - p1.x) *
        Math.PI *
        R *
        Math.cos((((p2.y + p1.y) / 2) * Math.PI) / 180)) /
        180,
    )
  }

  //属性排序
  compare = prop => (a, b) => {
    return a[prop] - b[prop]
  }

  //online返回存在的缺陷，没有直接返回楼层，地址中包含有楼层，但格式不统一，无法拿到，后续导航无法到正确楼层
  getSearchResult = (params, cb) => {
    try {
      global.Loading.setLoading(
        true,
        getLanguage(global.language).Prompt.SEARCHING,
      )
      LocateUtils.getSearchResult(params, this.state.location, data => {
        if (data) {
          let newState = {resultList: data.resultList, radius: 50000, showList: true}
          if (data.radius !== undefined) {
            newState.radius = data.radius
          }
          this.setState(newState,
            async () => {
              this.show()
              await SMap.addCallouts(data.resultList)
              cb && cb(data)
              global.Loading.setLoading(false)
            },
          )
        } else {
          cb && cb()
          global.Loading.setLoading(false)
        }
      })
    } catch (error) {
      global.Loading.setLoading(false)
    }
  }

  //搜索结果列表点击事件
  onListItemClick = async item => {
    let searchClickedInfo =
      this.props.getSearchClickedInfo && this.props.getSearchClickedInfo()
    if (searchClickedInfo.isClicked) {
      let title = searchClickedInfo.title
      if (
        title === getLanguage(global.language).Map_Main_Menu.SET_AS_START_POINT
      ) {
        //设置起点
        global.STARTX = item.x
        global.STARTY = item.y
        global.STARTNAME = item.pointName
        await SMap.getStartPoint(global.STARTX, global.STARTY, false)
      } else {
        //设置终点
        global.ENDX = item.x
        global.ENDY = item.y
        global.ENDNAME = item.pointName
        await SMap.getEndPoint(global.ENDX, global.ENDY, false)
      }
      SMap.removeAllCallout()
      this.setVisible(false)
      global.PoiTopSearchBar && global.PoiTopSearchBar.setVisible(false)
      global.STARTPOINTFLOOR = await SMap.getCurrentFloorID()
      NavigationService.navigate('NavigationView', {
        changeNavPathInfo: this.props.changeNavPathInfo,
        getNavigationDatas: this.props.getNavigationDatas,
      })
    } else {
      global.mapController && global.mapController.setVisible(false)
      let historyArr = this.props.mapSearchHistory
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
      let tempName = global.PoiTopSearchBar.state.defaultValue
      global.PoiTopSearchBar.setState({ defaultValue: item.pointName })
      this.showTable()
      setTimeout(async () => {
        let tempList = JSON.parse(JSON.stringify(this.state.resultList))
        this.tempResult = {
          name: tempName,
          tempList,
        }
        this.setState(
          {
            destination: item.pointName,
            address: item.address,
            showList: false,
            neighbor: [],
            resultList: [],
            location: { x: item.x, y: item.y },
          },
          async () => {
            await this.clear()
            await SMap.toLocationPoint(item)
          },
        )
      })
    }
  }

  //显示 '点击查看更多' 时的状态
  hidden = () => {
    if (this.state.showList) {
      Animated.timing(this.boxHeight, {
        toValue: scaleSize(80),
        duration: 0,
        useNativeDriver: false,
      }).start()
      Animated.timing(this.height, {
        toValue: scaleSize(80),
        duration: 0,
        useNativeDriver: false,
      }).start()
      if (this.props.device.orientation.indexOf('LANDSCAPE') === 0) {
        Animated.timing(this.bottom, {
          toValue:
            screen.getScreenHeight(this.props.device.orientation) -
            screen.getHeaderHeight() -
            scaleSize(80),
          duration: 0,
          useNativeDriver: false,
        }).start()
      }
      this.setState({
        showMore: true,
      })
    }
  }

  showTable = () => {
    let boxHeight, height, bottom
    boxHeight = scaleSize(200)
    height = scaleSize(200)
    if (this.props.device.orientation.indexOf('LANDSCAPE') === 0) {
      bottom =
        screen.getScreenHeight(this.props.device.orientation) -
        screen.getHeaderHeight() -
        scaleSize(200)
    } else {
      bottom = 0
    }
    this.startAnim({ boxHeight, height, bottom })
  }

  show = () => {
    let height,
      boxHeight,
      bottom = 0
    if (this.props.device.orientation.indexOf('LANDSCAPE') === 0) {
      boxHeight =
        screen.getScreenHeight(this.props.device.orientation) -
        screen.getHeaderHeight()
      height =
        screen.getScreenHeight(this.props.device.orientation) -
        screen.getHeaderHeight()
    } else {
      height = scaleSize(450)
      boxHeight = scaleSize(450)
    }
    this.startAnim({ height, bottom, boxHeight })
    this.setState({
      showMore: false,
    })
  }

  //重置为初始状态
  setInitialState = () => {
    this.setState(
      {
        destination: '',
        location: {},
        address: '',
        showMore: false,
        showList: false,
        neighbor: [],
        resultList: [],
        visible: false,
        radius: 5000,
      },
      () => {
        this.tempResult = {
          name: '',
          tempList: [],
        }
        let bottom, boxHeight, height, width
        bottom = -screen.getScreenHeight(this.props.device.orientation)
        boxHeight = 0
        height = 0
        width = 0
        this.startAnim({ width, height, boxHeight, bottom })
      },
    )
  }

  clear = async () => {
    let rel1 = await SMap.removePOICallout()
    let rel2 = await SMap.removeAllCallout()
    return rel1 && rel2
  }

  close = () => {
    if (this.props.device.orientation.indexOf('LANDSCAPE') === 0) return
    SMap.removePOICallout()
    this.setVisible(false)
    this.props.setMapNavigation({
      isShow: false,
      name: '',
    })
    this.setInitialState()
  }

  searchNeighbor = () => {
    let boxHeight, height, bottom
    boxHeight = scaleSize(340)
    height = scaleSize(340)
    if (this.props.device.orientation.indexOf('LANDSCAPE') === 0) {
      bottom =
        screen.getScreenHeight(this.props.device.orientation) -
        screen.getHeaderHeight() -
        scaleSize(340)
    } else {
      bottom = 0
    }
    this.startAnim({ boxHeight, height, bottom })
    this.setState({
      showList: true,
    })
  }

  navitoHere = async () => {
    SMap.clearTrackingLayer()
    SMap.removePOICallout()
    let position = await SMap.getCurrentPosition()
    global.STARTX = position.x
    global.STARTY = position.y
    global.ENDX = this.state.location.x
    global.ENDY = this.state.location.y

    global.STARTNAME = getLanguage(global.language).Map_Main_Menu.MY_LOCATION
    global.ENDNAME = this.state.destination
    //先跳转，尽量减少用户界面等待时间
    NavigationService.navigate('NavigationView', {
      changeNavPathInfo: this.props.changeNavPathInfo,
      getNavigationDatas: this.props.getNavigationDatas,
    })
    await SMap.getStartPoint(global.STARTX, global.STARTY, false)
    await SMap.getEndPoint(global.ENDX, global.ENDY, false)
    global.PoiTopSearchBar && global.PoiTopSearchBar.setVisible(false)
    this.setInitialState()
  }

  renderView = () => {
    if (global.Type !== ChunkType.MAP_NAVIGATION) {
      return (
        <View
          style={{
            flex: 1,
          }}
        >
          <View style={styles.rowContent}>
            <Text style={styles.title} numberOfLines={1} ellipsizeMode={'tail'}>
              {this.state.destination}
            </Text>
          </View>
          <View style={styles.rowContent}>
            <Text style={styles.info} numberOfLines={1} ellipsizeMode={'tail'}>
              {this.state.address}
            </Text>
          </View>
          <View style={styles.searchBox}>
            <TouchableOpacity
              activeOpacity={0.5}
              style={styles.navi}
              onPress={() => {
                this.searchNeighbor()
              }}
            >
              <Text style={styles.searchTxt}>
                {getLanguage(global.language).Prompt.SEARCH_AROUND}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )
    } else {
      return (
        <View
          style={{
            flex: 1,
            paddingTop: scaleSize(10),
          }}
        >
          <View style={styles.rowContent}>
            <Text style={styles.title}>{this.state.destination}</Text>
          </View>
          <View style={styles.rowContent}>
            <Text style={styles.info} numberOfLines={1} ellipsizeMode={'tail'}>
              {this.state.address}
            </Text>
          </View>
          <View style={styles.searchBox}>
            <TouchableOpacity
              activeOpacity={0.5}
              style={styles.navi}
              onPress={() => {
                this.searchNeighbor()
              }}
            >
              <Text style={styles.searchTxt}>
                {getLanguage(global.language).Prompt.SEARCH_AROUND}
              </Text>
            </TouchableOpacity>
            <View style={{ width: 20 }} />
            <TouchableOpacity
              activeOpacity={0.5}
              style={styles.navi}
              onPress={() => {
                this.navitoHere()
              }}
            >
              <Text style={styles.searchTxt}>
                {getLanguage(global.language).Prompt.GO_HERE}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )
    }
  }

  renderTable = () => {
    let data = PoiData()
    let renderIcons = ({ item }) => {
      return (
        <TouchableOpacity
          onPress={async () => {
            await this.clear()
            this.getSearchResult({
              keyWords: item.title,
              location: JSON.stringify(this.state.location),
              radius: this.state.radius,
            })
            global.PoiTopSearchBar &&
              global.PoiTopSearchBar.setState({ defaultValue: item.title })
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

    return (
      <FlatList
        style={styles.wrapper}
        renderItem={renderIcons}
        data={data}
        keyExtractor={(item, index) => item.title + index}
        numColumns={4}
      />
    )
  }

  renderList = () => {
    let renderList = ({ item }) => {
      return (
        <View>
          <TouchableOpacity
            style={styles.itemView}
            onPress={() => {
              this.onListItemClick(item)
            }}
          >
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
              }}
            >
              {/*<Image style={styles.pointImg} source={img} />*/}
              <Text
                style={styles.itemText}
                numberOfLines={1}
                ellipsizeMode={'tail'}
              >
                {item.pointName}
              </Text>
              <Text style={styles.distance}>{item.distance}</Text>
            </View>
            <Text
              style={styles.address}
              numberOfLines={1}
              ellipsizeMode={'tail'}
            >
              {item.address}
            </Text>
          </TouchableOpacity>
          <View style={styles.itemSeparator} />
        </View>
      )
    }
    return (
      <FlatList
        style={styles.wrapper}
        renderItem={renderList}
        data={this.state.resultList}
        keyExtractor={(item, index) => item.pointName + index}
        numColumns={1}
      />
    )
  }

  renderMore = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          this.show()
        }}
        style={styles.moreWrap}
      >
        <Text style={styles.moreText}>
          {getLanguage(global.language).Prompt.SHOW_MORE_RESULT}
        </Text>
      </TouchableOpacity>
    )
  }
  render() {
    return (
      <Animated.View
        style={{
          ...styles.box,
          bottom: this.bottom,
          height: this.boxHeight,
          width: this.width,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            this.close()
          }}
          style={styles.overlayer}
        />
        <Animated.View
          style={{
            ...styles.container,
            height: this.height,
          }}
        >
          {this.state.showMore && this.renderMore()}
          {!this.state.showList && this.renderView()}
          {this.state.showList &&
            this.state.resultList.length === 0 &&
            this.renderTable()}
          {this.state.showList &&
            this.state.resultList.length !== 0 &&
            !this.state.showMore &&
            this.renderList()}
          {/* {
            this.state.showList &&
            <ScrollView
              style={styles.wrapper}
            >
              {this.state.resultList.length === 0 && this.renderTable()}
              {this.state.resultList.length !== 0 && !this.state.showMore && this.renderList()}
            </ScrollView>
          } */}
        </Animated.View>
      </Animated.View>
    )
  }
}
