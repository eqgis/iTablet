/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */
import * as React from 'react'
import { View, Animated, FlatList, TouchableOpacity, Platform, Easing } from 'react-native'
import { MTBtn } from '../../../../components'
import { ConstToolType, Const, ChunkType, Height, UserType, ConstPath } from '../../../../constants'
import { scaleSize, Toast, screen, LayerUtils, OnlineServicesUtils, dataUtil } from '../../../../utils'
import { SMap, DatasetType, SCoordination, SMediaCollector,RNFS } from 'imobile_for_reactnative'
import PropTypes from 'prop-types'
import { Bar } from 'react-native-progress'
import { getPublicAssets, getThemeAssets } from '../../../../assets'
import NavigationService from '../../../NavigationService'
import styles, {
  MAX_VISIBLE_NUMBER,
  ITEM_VIEW_WIDTH_L,
  ITEM_VIEW_HEIGHT_P,
  ITEM_VIEW_HEIGHT_L,
  INDICATOR_VIEW_SIZE,
  BOTTOM_LANDSCAPE,
  PADDING_L,
} from './styles'
import { serviceModule } from '../../../workspace/components/ToolBar/modules'
import { FileTools } from '../../../../native'
// import {  } from 'imobile_for_reactnative'

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
    currentTask: PropTypes.object,
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
    currentTaskServices: Object,
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
      isServiceLoading: false,
      serviceLoading: new Animated.Value(0),
    }
    this.visible = true
    this.offset = 0
    this.maxOffset = 100
    this.onPrevious = true
    this.onNext = true
    this.previousOpacity = new Animated.Value(0)
    this.nextOpacity = new Animated.Value(0)

    if (GLOBAL.coworkMode && GLOBAL.Type.indexOf('3D') < 0 && this.props.user?.currentUser) {
      if (UserType.isOnlineUser(this.props.user.currentUser)) {
        this.servicesUtils = new SCoordination('online')
        this.onlineServicesUtils = new OnlineServicesUtils('online')
      } else if (UserType.isIPortalUser(this.props.user.currentUser)){
        this.servicesUtils = new SCoordination('iportal')
        this.onlineServicesUtils = new OnlineServicesUtils('iportal')
      }
    }
  }

  componentDidMount() {
    setTimeout(this.handlePosition, 2000)
  }

  componentWillUnmount() {
    this.servicesUtils = null
    this.onlineServicesUtils = null
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      JSON.stringify(this.props.online.share) !==
        JSON.stringify(nextProps.online.share) ||
      JSON.stringify(this.props.currentTaskServices) !==
        JSON.stringify(nextProps.currentTaskServices) ||
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
    if (this.props.ARView !== prevProps.ARView) {
      const data = this.getData(this.props.type)
      this.setState({data: data})
    }
    if (GLOBAL.coworkMode) {
      // 数据服务下载动画
      if (
        this.props.currentTask?.groupID &&
        this.props.currentTaskServices?.[this.props.user.currentUser.userName]?.[this.props.currentTask?.groupID]?.[this.props.currentTask?.id]
      ) {
        const services = this.props.currentTaskServices[this.props.user.currentUser.userName][this.props.currentTask.groupID][this.props.currentTask.id]
        if (services?.length > 0) {
          for (const service of services) {
            const isLoading = service.status === 'download'
            if (this.state.isServiceLoading !== isLoading) {
              this.setState({
                isServiceLoading: isLoading,
              }, () => {
                this.aniMotion = null
                isLoading && this.loading()
              })
            }
            break
          }
        } else if (this.state.isServiceLoading) {
          this.setState({
            isServiceLoading: false,
          })
        }
      }
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

  /** 获取一级数据 **/
  getData = type => {
    const currentMapModule = this.props.mapModules.modules.find(function(item) {
      return item.key === type
    })
    let functionModules = currentMapModule?.functionModules || []

    if (currentMapModule?.getFunctionModules) {
      functionModules = currentMapModule.getFunctionModules(this.props.ARView ? 'ar' : 'map')
    }

    let data = []
    functionModules.forEach(item => {
      let _item = typeof item === 'function' ? item() : item
      if (_item.type === ConstToolType.SM_MAP_STYLE) {
        _item.action = () => {
          let currentLayer = this.props.currentLayer
          if (currentLayer.type === undefined) {
            // 当前图层为空时，跳转
            NavigationService.navigate('LayerManager')
            Toast.show(getLanguage(this.props.language).Prompt.PLEASE_SELECT_THEMATIC_LAYER)
          } else if (
            currentLayer.type === DatasetType.IMAGE ||
            Platform.OS === 'ios' && currentLayer.type === DatasetType.MBImage
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
      if (
        !GLOBAL.coworkMode ||
        GLOBAL.coworkMode &&
        // _item.type !== ConstToolType.SM_MAP_ADD &&
        _item.type !== ConstToolType.SM_MAP_COLLECTION_TEMPLATE_CREATE &&
        _item.type !== ConstToolType.SM_MAP_NAVIGATION_MODULE
        //  && _item.type !== ConstToolType.SM_MAP_PLOT_ANIMATION
      ) {
        data.push(_item)
      }
    })
    // 在线协作非三维模块，侧边栏新增多媒体采集
    if (GLOBAL.coworkMode && GLOBAL.Type.indexOf('3D') < 0) {
      GLOBAL.Type !== ChunkType.MAP_PLOTTING && data.push({
        isLoading: false,
        ...serviceModule(UserType.isIPortalUser(this.props.user.currentUser) ? 'iportal' : 'online'),
      })
      data.push({
        type: ConstToolType.SM_MAP_MEDIA,
        getTitle: () => getLanguage(GLOBAL.language).Map_Main_Menu.CAMERA,
        size: 'large',
        image: getThemeAssets().mapTools.icon_tool_multi_media,
        disableImage: getThemeAssets().mapTools.icon_tool_multi_media_ash,
        action: async () => {
          if (this.props.currentLayer) {
            if (this.props.currentLayer.themeType) {
              Toast.show(
                getLanguage(this.props.language).Prompt
                  .CANNOT_COLLECT_IN_THEMATIC_LAYERS,
              )
              return
            }
            const layerType = LayerUtils.getLayerType(this.props.currentLayer)
            const isTaggingLayer = layerType === 'TAGGINGLAYER' || layerType === 'CADLAYER' || layerType === 'POINTLAYER'
            const isMediaLayer = await SMediaCollector.isMediaLayer(this.props.currentLayer.name)
            if (isTaggingLayer && isMediaLayer) {
              const { datasourceAlias } = this.props.currentLayer // 标注数据源名称
              const { datasetName } = this.props.currentLayer // 标注图层名称
              NavigationService.navigate('Camera', {
                datasourceAlias,
                datasetName,
                cb: async ({
                  datasourceName,
                  datasetName,
                  mediaPaths,
                }) => {
                // cb: async mediaPaths => {
                  try {
                    if (GLOBAL.coworkMode) {
                      let resourceIds = [],
                        _mediaPaths = [] // 保存修改名称后的图片地址
                      let name = '', suffix = ''
                      let dest = await FileTools.appendingHomeDirectory(ConstPath.UserPath + this.props.user.currentUser.userName + '/' + ConstPath.RelativeFilePath.Media)
                      const newPaths = await FileTools.copyFiles(mediaPaths, dest)
                      for (let mediaPath of newPaths) {
                        if (mediaPath.indexOf('assets-library://') === 0) { // 处理iOS相册文件
                          suffix = dataUtil.getUrlQueryVariable(mediaPath, 'ext') || ''
                          name = dataUtil.getUrlQueryVariable(mediaPath, 'id') || ''
                          dest += `${name}.${suffix}`
                          mediaPath = await RNFS.copyAssetsFileIOS(mediaPath, dest, 0, 0)
                        } else if (mediaPath.indexOf('content://') === 0) { // 处理android相册文件
                          let filePath = await FileTools.getContentAbsolutePathAndroid(mediaPath)
                          name = filePath.substring(filePath.lastIndexOf('/') + 1, filePath.lastIndexOf('.'))
                          suffix = filePath.substr(filePath.lastIndexOf('.') + 1)
                          dest += `${name}.${suffix}`
                          await RNFS.copyFile(filePath, dest)
                          mediaPath = dest
                        } else { // 处理文件目录中的文件
                          name = mediaPath.substring(mediaPath.lastIndexOf('/') + 1, mediaPath.lastIndexOf('.'))
                          suffix = mediaPath.substr(mediaPath.lastIndexOf('.') + 1)
                          dest += `${name}.${suffix}`
                        }
                        let resourceId = await this.onlineServicesUtils.uploadFileWithCheckCapacity(
                          mediaPath,
                          `${name}.${suffix}`,
                          'PHOTOS',
                        )
                        // await RNFS.unlink(resizedImageUri.path)
                        // TODO是否删除原图
                        if (resourceId) {
                          resourceIds.push(resourceId)
  
                          let _newPath = `${mediaPath.replace(name, resourceId)}`
                          _mediaPaths.push(_newPath)
                        }
                      }
                      if (resourceIds.length > 0) {
                        let result = await SMediaCollector.addMedia({
                          datasourceName,
                          datasetName,
                          mediaPaths,
                          mediaIds: resourceIds,
                        })
                      } else {
                        Toast.show(getLanguage(this.props.language).Friends.RESOURCE_UPLOAD_FAILED)
                      }
                      // 分享到群组中
                      if (resourceIds.length > 0 && this.props.currentTask.groupID) {
                        this.servicesUtils?.shareDataToGroup({
                          groupId: this.props.currentTask.groupID,
                          ids: resourceIds,
                        }).then(result => {
                          if (result.succeed) {
                            Toast.show(getLanguage(this.props.language).Friends.RESOURCE_UPLOAD_SUCCESS)
                            this.cb && this.cb()
                          } else {
                            Toast.show(getLanguage(this.props.language).Friends.RESOURCE_UPLOAD_FAILED)
                          }
                        }).catch(() => {
                          Toast.show(getLanguage(this.props.language).Friends.RESOURCE_UPLOAD_FAILED)
                        })
                      }
                    }
                  } catch (e) {
                    // eslint-disable-next-line no-console
                    __DEV__ && console.warn('error')
                  }
                },
              })
            } else {
              Toast.show(
                getLanguage(this.props.language).Prompt
                  .PLEASE_SELECT_MEDIA_LAYER,
              )
              NavigationService.navigate('LayerManager')
              return
            }
          } else {
            Toast.show(
              getLanguage(this.props.language).Prompt
                .PLEASE_SELECT_MEDIA_LAYER,
            )
            NavigationService.navigate('LayerManager')
          }
        },
        // getData: MediaData.getData,
        // actions: MediaAction,
      })
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

  loading = () => {
    if (!this.aniMotion && this.state.isServiceLoading) {
      this.state.serviceLoading.setValue(0)
      this.aniMotion = Animated.timing(this.state.serviceLoading, {
        toValue: this.state.serviceLoading._value === 0 ? 1 : 0,
        duration: 800,
        easing: Easing.linear,
        useNativeDriver: true,
      })
      Animated.loop(this.aniMotion).start()
    }
  }

  /**
   * 服务下载Loading
   * @param {*} param
   * @returns
   */
  _renderLoading = ({ item, index }) => {
    if (this.state.isServiceLoading && item.type === ConstToolType.SM_MAP_SERVICE) {
      return (
        <Animated.Image
          resizeMode={'contain'}
          style={[
            styles.cornerMark,
            {
              transform: [{rotate: this.state.serviceLoading
                .interpolate({inputRange: [0, 1],outputRange: ['0deg', '360deg']}),
              }],
            },
          ]}
          source={getPublicAssets().common.icon_downloading}
        />
      )
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
        {this._renderLoading({ item, index })}
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

  // getCurrentData = () => {
  //   // let filterData = this.state.data.filter(item => {
  //   //   if (this.props.ARView) {
  //   //     if (item.type === ConstToolType.SM_MAP_STYLE) return false
  //   //     if (item.type === ConstToolType.SM_MAP_MARKS) return false
  //   //     if (item.type === ConstToolType.SM_MAP_TOOL) return false
  //   //     if (item.type === ConstToolType.SM_MAP_START) return false
  //   //     if (item.type === ConstToolType.SM_MAP_ADD) return false
  //   //   } else {
  //   //     if (item.type === ConstToolType.SM_MAP_AR_MEASURE) return false
  //   //     if (item.type === ConstToolType.SM_MAP_AR_ANALYSIS) return false
  //   //     if (item.type === ConstToolType.SM_MAP_AR_TOOL) return false
  //   //     if (item.type === ConstToolType.SM_MAP_AR_EFFECT) return false
  //   //     if (item.type === ConstToolType.SM_MAP_AR_MAPPING) return false
  //   //   }
  //   //   return true
  //   // })

  //   let filterData = this.getData(this.props.type)
  //   return filterData || []
  // }

  renderList = () => {
    let isLandscape = this.props.device.orientation.indexOf('LANDSCAPE') === 0
    let filterData = this.state.data
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
    if (this.state.data.length <= MAX_VISIBLE_NUMBER) {
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
      let dataLength = this.state.data.length
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
