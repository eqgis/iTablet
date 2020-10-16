/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */
import * as React from 'react'
import { View, Animated, FlatList, TouchableOpacity } from 'react-native'
import { MTBtn } from '../../../../components'
import { ConstToolType, Const, ChunkType, Height } from '../../../../constants'
import { scaleSize, Toast, screen } from '../../../../utils'
import { SMap, DatasetType } from 'imobile_for_reactnative'
import PropTypes from 'prop-types'
import { Bar } from 'react-native-progress'
import { getPublicAssets } from '../../../../assets'
import styles, {
  MAX_VISIBLE_NUMBER,
  ITEM_VIEW_WIDTH_L,
  ITEM_VIEW_HEIGHT_P,
  ITEM_VIEW_HEIGHT_L,
  INDICATOR_VIEW_SIZE,
  BOTTOM_LANDSCAPE,
  PADDING_L,
} from './styles'

const COLLECTION = 'COLLECTION'
const NETWORK = 'NETWORK'
const EDIT = 'EDIT'
// const MAP_THEME = 'MAP_THEME'
/**
 * @deprecated 移除当前的类型，使用constants
 */
export { COLLECTION, NETWORK, EDIT }
import { getLanguage } from '../../../../language'
import {
  styleModule,
  themeModule,
  layerSettingImageModule,
} from '../ToolBar/modules'

// const HeaderHeight = scaleSize(88)
// const BottomHeight = scaleSize(100)

const RIGHT = scaleSize(20)
const RIGHT_LANDSCAPE = 0
const TOP = scaleSize(143)
const TOP_LANDSCAPE = screen.HEADER_HEIGHT_LANDSCAPE
const PREVIOUS = 'previous'
const NEXT = 'next'

export default class FunctionToolbar extends React.Component {
  props: {
    navigation: Object,
    mapModules: Object,
    language: string,
    style?: any,
    hide?: boolean,
    direction?: string,
    separator?: number,
    shareProgress?: number,
    online?: Object,
    device: Object,
    type: string,
    data?: Array,
    currentLayer: PropTypes.object,
    getLayers?: () => {},
    getToolRef: () => {},
    getMenuAlertDialogRef: () => {},
    showFullMap: () => {},
    setMapType: () => {},
    navigation: Object,
    save: () => {},
    saveAs: () => {},
    closeOneMap: () => {},
    addGeometrySelectedListener: () => {},
    removeGeometrySelectedListener: () => {},
    symbol: Object,
    device: Object,
    user: Object,
    map: Object,
    openOnlineMap: boolean,
    ARView: Boolean,
  }

  static defaultProps = {
    type: ChunkType.MAP_COLLECTION,
    hide: false,
    direction: 'column',
    separator: 20,
  }

  constructor(props) {
    super(props)
    let data = props.data || this.getData(props.type)
    this.state = {
      type: props.type,
      data: data,
      top: new Animated.Value(TOP + screen.getIphonePaddingTop()),
      right: new Animated.Value(RIGHT),
      bottom: new Animated.Value(BOTTOM_LANDSCAPE),
    }
    this.visible = true
    this.offset = 0
    this.maxOffset = 100
    this.onPrevious = true
    this.onNext = true
    this.previousOpacity = new Animated.Value(0)
    this.nextOpacity = new Animated.Value(0)
  }

  componentDidMount() {
    setTimeout(this.handlePosition, 2000)
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      JSON.stringify(this.props.online.share) !==
        JSON.stringify(nextProps.online.share) ||
      JSON.stringify(this.state) !== JSON.stringify(nextState) ||
      JSON.stringify(this.props.device) !== JSON.stringify(nextProps.device) ||
      this.props.ARView !== nextProps.ARView
    ) {
      return true
    }
    return false
  }

  componentDidUpdate(prevProps) {
    if (this.props.device.orientation !== prevProps.device.orientation) {
      this.onOrientationChange()
    }
  }

  onOrientationChange = () => {
    let top, right
    if (this.visible) {
      if (this.props.device.orientation.indexOf('LANDSCAPE') === 0) {
        top = TOP_LANDSCAPE
        right = RIGHT_LANDSCAPE
      } else {
        top = TOP + screen.getIphonePaddingTop()
        right = RIGHT
      }
      Animated.parallel([
        Animated.timing(this.state.top, {
          toValue: top,
          duration: 300,
        }),
        Animated.timing(this.state.right, {
          toValue: right,
          duration: 300,
        }),
      ]).start()
    } else {
      if (this.props.device.orientation.indexOf('LANDSCAPE') === 0) {
        top = TOP_LANDSCAPE
      } else {
        top = TOP + screen.getIphonePaddingTop()
      }
      Animated.timing(this.state.top, {
        toValue: top,
        duration: 300,
      }).start()
    }
    this.handlePosition()
  }

  handlePosition = () => {
    let isLandscape = this.props.device.orientation.indexOf('LANDSCAPE') >= 0
    let contentHeight = (this.list && this.list._listRef._totalCellLength) || 0
    let offset = this.offset
    let visibleHeight
    if (isLandscape) {
      // let indicatorHeight = scaleSize(15) * 2
      // let windowHeight = Math.min(
      //   Dimensions.get('window').height,
      //   Dimensions.get('window').width,
      // )
      // let headerHeight = screen.HEADER_HEIGHT_LANDSCAPE
      // let moreHeight = scaleSize(80) + 1
      visibleHeight = ITEM_VIEW_WIDTH_L * MAX_VISIBLE_NUMBER
    } else {
      // let maxHeight =
      //   this.props.device.height - HeaderHeight - BottomHeight - scaleSize(300)
      visibleHeight = ITEM_VIEW_HEIGHT_P * MAX_VISIBLE_NUMBER
    }
    let onPrevious, onNext
    if (visibleHeight < contentHeight) {
      if (offset === 0) {
        onPrevious = true
        onNext = false
      } else if (offset + visibleHeight + 3 > contentHeight) {
        onPrevious = false
        onNext = true
      } else {
        onPrevious = false
        onNext = false
      }
    } else {
      onPrevious = true
      onNext = true
    }
    if (onPrevious !== this.onPrevious) {
      this.onPrevious = onPrevious
      Animated.timing(this.previousOpacity, {
        toValue: onPrevious ? 0 : 1,
        duration: 150,
      }).start()
    }
    if (onNext !== this.onNext) {
      this.onNext = onNext
      Animated.timing(this.nextOpacity, {
        toValue: onNext ? 0 : 1,
        duration: 150,
      }).start()
    }
  }

  setVisible = (visible, immediately = false) => {
    if (this.visible === visible) return
    // let right =
    //   this.props.device.orientation.indexOf('LANDSCAPE') === 0
    //     ? RIGHT_LANDSCAPE
    //     : RIGHT
    Animated.parallel([
      Animated.timing(this.state.bottom, {
        toValue: visible ? BOTTOM_LANDSCAPE : scaleSize(-120),
        duration: immediately ? 0 : Const.ANIMATED_DURATION,
      }).start(),
      Animated.timing(this.state.right, {
        toValue: visible ? RIGHT : scaleSize(-100),
        duration: immediately ? 0 : Const.ANIMATED_DURATION,
      }).start(),
    ]).start()
    this.visible = visible
  }

  isMapIndoorNavigation = () => {
    GLOBAL.toolBox.props.setOpenOnlineMap(false)
  }

  remove = () => {}

  save = async e => {
    this.props.save()
    this.moreToolbar.showMore(false, e)
  }

  saveAs = async e => {
    this.props.saveAs()
    this.moreToolbar.showMore(false, e)
  }

  recent = () => {}

  share = () => {}

  //判断当前模块是否有效
  getLicenseValid = index => {
    return GLOBAL.modulesNumber
      ? (GLOBAL.modulesNumber >> index) % 2 === 1
      : true
  }

  /** 获取一级数据 **/
  getData = type => {
    let isLicenseNotValid = false
    const currentMapModule = this.props.mapModules.modules.find(function(item) {
      return item.key === type
    })
    const functionModules = currentMapModule.functionModules

    let data = []
    functionModules.forEach(item => {
      let _item = typeof item === 'function' ? item() : item
      if (_item.type === ConstToolType.SM_MAP_STYLE) {
        _item.action = () => {
          let currentLayer = this.props.currentLayer
          if (
            currentLayer.type === DatasetType.IMAGE ||
            currentLayer.type === DatasetType.MBImage
          ) {
            layerSettingImageModule().actions.showSetting()
          } else if (currentLayer.themeType <= 0 && !currentLayer.isHeatmap) {
            styleModule().action(ConstToolType.SM_MAP_STYLE)
          } else if (GLOBAL.Type === ChunkType.MAP_THEME) {
            themeModule().actions.layerListAction(this.props.currentLayer)
          } else {
            Toast.show(
              getLanguage(this.props.language).Prompt
                .THE_CURRENT_LAYER_CANNOT_BE_STYLED,
            )
          }
        }
      }
      data.push(_item)
    })

    if (isLicenseNotValid) {
      GLOBAL.licenseModuleNotContainDialog &&
        GLOBAL.licenseModuleNotContainDialog.setDialogVisible(true)
    }
    return data
  }

  /** 设置监听 **/
  /** 选择事件监听 **/
  _addGeometrySelectedListener = async () => {
    await SMap.addGeometrySelectedListener({
      geometrySelected: this.geometrySelected,
      geometryMultiSelected: this.geometryMultiSelected,
    })
  }

  _removeGeometrySelectedListener = async () => {
    await SMap.removeGeometrySelectedListener()
  }

  geometrySelected = event => {
    SMap.appointEditGeometry(event.id, event.layerInfo.path)
  }

  geometryMultiSelected = () => {
    // TODO 处理多选
  }

  indicatorScroll = ({ location, isLandscape }) => {
    let _offset = isLandscape ? scaleSize(120) : scaleSize(96)
    switch (location) {
      case PREVIOUS: {
        this.list &&
          this.list.scrollToOffset({
            offset: this.offset - _offset < 0 ? 0 : this.offset - _offset,
            animated: true,
          })
        break
      }
      case NEXT: {
        this.list &&
          this.list.scrollToOffset({
            offset:
              this.offset + _offset > this.maxOffset
                ? this.maxOffset
                : this.offset + _offset,
            animated: true,
          })
        break
      }
    }
  }

  _renderItem = ({ item, index }) => {
    return (
      <View
        style={
          this.props.device.orientation.indexOf('LANDSCAPE') === 0
            ? styles.btnViewL
            : styles.btnViewP
        }
        key={this._keyExtractor(item, index)}
      >
        <MTBtn
          style={styles.btn}
          imageStyle={styles.btnImage}
          key={index}
          title={item.getTitle()}
          textColor={'black'}
          textStyle={{ fontSize: scaleSize(20), marginTop: scaleSize(8) }}
          size={MTBtn.Size.NORMAL}
          image={item.image}
          onPress={item.action}
          activeOpacity={0.5}
          // separator={scaleSize(2)}
        />
        {item.title === '分享' &&
          this.props.online.share[0] &&
          GLOBAL.Type === this.props.online.share[0].module &&
          this.props.online.share[0].progress !== undefined && (
          <Bar
            style={styles.progress}
            // indeterminate={true}
            progress={
              this.props.online.share[this.props.online.share.length - 1]
                .progress
            }
            width={scaleSize(60)}
          />
        )}
        {/*{item.title === '分享' &&*/}
        {/*this.props.online.share[this.props.online.share.length - 1] &&*/}
        {/*GLOBAL.Type === this.props.online.share[this.props.online.share.length - 1].module &&*/}
        {/*this.props.online.share[this.props.online.share.length - 1].progress !== undefined && (*/}
        {/*<Text>{this.props.online.share[this.props.online.share.length - 1].progress}</Text>*/}
        {/*)}*/}

        {/*<PieProgress*/}
        {/*ref={ref => (this.shareProgress = ref)}*/}
        {/*size={scaleSize(18)}*/}
        {/*style={styles.progress}*/}
        {/*progress={this.props.online.share[0].progress}*/}
        {/*indeterminate={false}*/}
        {/*/>*/}
      </View>
    )
  }

  _renderItemSeparatorComponent = () => {
    return <View style={styles.separator} />
  }

  _keyExtractor = (item, index) => index + '-' + item.title

  getCurrentData = () => {
    let filterData = this.state.data.filter(item => {
      if (this.props.ARView) {
        if (item.type === ConstToolType.SM_MAP_STYLE) return false
        if (item.type === ConstToolType.SM_MAP_MARKS) return false
        if (item.type === ConstToolType.SM_MAP_TOOL) return false
      } else {
        if (item.type === ConstToolType.SM_MAP_AR_MEASURE) return false
        if (item.type === ConstToolType.SM_MAP_AR_ANALYSIS) return false
        if (item.type === ConstToolType.SM_MAP_AR_TOOL) return false
        if (item.type === ConstToolType.SM_MAP_AR_EFFECT) return false
        if (item.type === ConstToolType.SM_MAP_AR_MAPPING) return false
      }
      return true
    })
    return filterData || []
  }

  renderList = () => {
    let isLandscape = this.props.device.orientation.indexOf('LANDSCAPE') === 0
    let filterData = this.getCurrentData()
    return (
      <FlatList
        ref={ref => (this.list = ref)}
        style={isLandscape ? { height: ITEM_VIEW_HEIGHT_L } : {}}
        data={filterData}
        horizontal={isLandscape}
        renderItem={this._renderItem}
        keyExtractor={this._keyExtractor}
        onScroll={event => {
          this.offset = isLandscape
            ? event.nativeEvent.contentOffset.x
            : event.nativeEvent.contentOffset.y
          // console.warn(JSON.stringify(event.nativeEvent))
          this.maxOffset = isLandscape
            ? event.nativeEvent.contentSize.width -
              event.nativeEvent.layoutMeasurement.width
            : event.nativeEvent.contentSize.height -
              event.nativeEvent.layoutMeasurement.height
          this.handlePosition()
        }}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      />
    )
  }

  renderMore = () => {
    return <View style={styles.moreImageView} />
  }

  renderIndicator = location => {
    if (this.getCurrentData().length <= MAX_VISIBLE_NUMBER) {
      return <View />
    }
    let isLandscape = this.props.device.orientation.indexOf('LANDSCAPE') === 0
    let source
    let style = {
      opacity: location === PREVIOUS ? this.previousOpacity : this.nextOpacity,
    }
    if (isLandscape) {
      source =
        location === PREVIOUS
          ? getPublicAssets().common.icon_slide_left
          : getPublicAssets().common.icon_slide_right
    } else {
      source =
        location === PREVIOUS
          ? getPublicAssets().common.icon_slide_up
          : getPublicAssets().common.icon_slide_down
    }
    return (
      <TouchableOpacity
        style={isLandscape ? styles.indicatorViewL : styles.indicatorViewP}
        activeOpacity={1}
        onPress={() => this.indicatorScroll({ location, isLandscape })}
      >
        <Animated.Image
          resizeMode={'contain'}
          style={[
            isLandscape ? styles.indicatorImageL : styles.indicatorImageP,
            style,
          ]}
          source={source}
        />
      </TouchableOpacity>
    )
  }

  render() {
    if (this.props.hide) {
      return null
    }
    let containerStyle = []
    if (this.props.device.orientation.indexOf('LANDSCAPE') === 0) {
      let dataLength = this.getCurrentData().length
      dataLength =
        dataLength > MAX_VISIBLE_NUMBER ? MAX_VISIBLE_NUMBER : dataLength
      let width =
        dataLength * ITEM_VIEW_WIDTH_L +
        PADDING_L * 2 +
        (dataLength > MAX_VISIBLE_NUMBER ? INDICATOR_VIEW_SIZE * 2 : 0)
      containerStyle = [
        styles.containerL,
        this.state.data.length > 0 && styles.containerShadow,
        this.props.style,
        {
          bottom: this.state.bottom,
          left: '50%',
          marginLeft: -((width + Height.TOOLBAR_BUTTONS) / 2),
        },
      ]
    } else {
      containerStyle = [
        styles.containerP,
        this.state.data.length > 0 && styles.containerShadow,
        this.props.style,
        {
          top: this.state.top,
          right: this.state.right,
        },
      ]
    }
    return (
      <Animated.View style={containerStyle}>
        {this.state.data.length > 0 && this.renderIndicator(PREVIOUS)}
        {this.renderList()}
        {this.state.data.length > 0 && this.renderIndicator(NEXT)}
        {/*{this.props.device.orientation.indexOf('LANDSCAPE') === 0 && (*/}
        {/*<View style={{ height: 1, backgroundColor: '#EEEEEE' }} />*/}
        {/*)}*/}
        {/*{this.props.device.orientation.indexOf('LANDSCAPE') === 0 &&*/}
        {/*this.renderMore()}*/}
      </Animated.View>
    )
  }
}
