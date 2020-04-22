/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */
import * as React from 'react'
import { View, Animated, FlatList, Dimensions } from 'react-native'
import { MTBtn } from '../../../../components'
import { ConstToolType, Const, ChunkType } from '../../../../constants'
import { scaleSize, Toast, setSpText, screen } from '../../../../utils'
import styles from './styles'
import { SMap } from 'imobile_for_reactnative'
import PropTypes from 'prop-types'
import { Bar } from 'react-native-progress'
import { getPublicAssets } from '../../../../assets'

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
  startModule,
  addModule,
  styleModule,
  toolModule,
  shareModule,
  themeModule,
  collectionModule,
  editModule,
  analysisModule,
  plotModule,
  fly3DModule,
  tool3DModule,
  navigationModule,
  aiModule,
  roadNetModule,
  markModule,
  mark3DModule,
  incrementModule,
} from '../ToolBar/modules'

// const HeaderHeight = scaleSize(88)
const BottomHeight = scaleSize(100)

const RIGHT = scaleSize(20)
const RIGHT_LANDSCAPE = 0
const TOP = scaleSize(143)
const TOP_LANDSCAPE = screen.HEADER_HEIGHT_LANDSCAPE
const BOTTOM_LANDSCAPE = 0
export default class FunctionToolbar extends React.Component {
  props: {
    navigation: Object,
    mapModules: Array,
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
    //弹出模型、路网弹窗
    setMap2Dto3D: () => {},
    openOnlineMap: boolean,
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
      top:
        this.props.device.orientation.indexOf('LANDSCAPE') === 0
          ? new Animated.Value(TOP_LANDSCAPE)
          : new Animated.Value(TOP + screen.getIphonePaddingTop()),
      right:
        this.props.device.orientation.indexOf('LANDSCAPE') === 0
          ? new Animated.Value(RIGHT_LANDSCAPE)
          : new Animated.Value(RIGHT),
    }
    this.visible = true
    this.offset = 0
    this.m_maxHeight = 400
    this.onTop = true
    this.onBottom = true
    this.topOpacity = new Animated.Value(0)
    this.bottomOpacity = new Animated.Value(0)
  }

  componentDidMount() {
    setTimeout(this.handlePosition, 2000)
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      JSON.stringify(this.props.online.share) !==
        JSON.stringify(nextProps.online.share) ||
      JSON.stringify(this.state) !== JSON.stringify(nextState) ||
      JSON.stringify(this.props.device) !== JSON.stringify(nextProps.device)
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
    let contentHeight = this.list._listRef._totalCellLength
    let offset = this.offset
    let visibleHeight
    if (this.props.device.orientation.indexOf('LANDSCAPE') === 0) {
      let indicatorHeight = scaleSize(15) * 2
      let windowHeight = Math.min(
        Dimensions.get('window').height,
        Dimensions.get('window').width,
      )
      let headerHeight = screen.HEADER_HEIGHT_LANDSCAPE
      let moreHeight = scaleSize(80) + 1
      visibleHeight = windowHeight - headerHeight - moreHeight - indicatorHeight
    } else {
      // let maxHeight =
      //   this.props.device.height - HeaderHeight - BottomHeight - scaleSize(300)
      visibleHeight = this.m_maxHeight
    }
    let onTop, onBottom
    if (visibleHeight < contentHeight) {
      if (offset === 0) {
        onTop = true
        onBottom = false
      } else if (offset + visibleHeight + 3 > contentHeight) {
        onTop = false
        onBottom = true
      } else {
        onTop = false
        onBottom = false
      }
    } else {
      onTop = true
      onBottom = true
    }
    if (onTop !== this.onTop) {
      this.onTop = onTop
      Animated.timing(this.topOpacity, {
        toValue: onTop ? 0 : 0.6,
        duration: 150,
      }).start()
    }
    if (onBottom !== this.onBottom) {
      this.onBottom = onBottom
      Animated.timing(this.bottomOpacity, {
        toValue: onBottom ? 0 : 0.6,
        duration: 150,
      }).start()
    }
  }

  setVisible = (visible, immediately = false) => {
    if (this.visible === visible) return
    let right =
      this.props.device.orientation.indexOf('LANDSCAPE') === 0
        ? RIGHT_LANDSCAPE
        : RIGHT
    Animated.timing(this.state.right, {
      toValue: visible ? right : scaleSize(-100),
      duration: immediately ? 0 : Const.ANIMATED_DURATION,
    }).start()
    this.visible = visible
  }

  isMapIndoorNavigation = () => {
    this.props.setMap2Dto3D(false)
    GLOBAL.toolBox.props.setOpenOnlineMap(false)
  }

  // showMenuAlertDialog = () => {
  //   if (
  //     !GLOBAL.currentLayer ||
  //     (GLOBAL.currentLayer.themeType <= 0 && !GLOBAL.currentLayer.isHeatmap)
  //   ) {
  //     Toast.show(
  //       getLanguage(this.props.language).Prompt.PLEASE_SELECT_THEMATIC_LAYER,
  //     )
  //     //'提示: 请先选择专题图层。')
  //     NavigationService.navigate('LayerManager')
  //     return
  //   }
  //   let type = ''
  //   if (GLOBAL.currentLayer.isHeatmap) {
  //     type = constants.THEME_HEATMAP
  //   } else {
  //     switch (GLOBAL.currentLayer.themeType) {
  //       case ThemeType.UNIQUE:
  //         type = constants.THEME_UNIQUE_STYLE
  //         break
  //       case ThemeType.RANGE:
  //         type = constants.THEME_RANGE_STYLE
  //         break
  //       case ThemeType.LABEL:
  //         type = constants.THEME_UNIFY_LABEL
  //         break
  //       case ThemeType.LABELUNIQUE:
  //         type = constants.THEME_UNIQUE_LABEL
  //         break
  //       case ThemeType.LABELRANGE:
  //         type = constants.THEME_RANGE_LABEL
  //         break
  //       case ThemeType.GRAPH:
  //         type = constants.THEME_GRAPH_STYLE
  //         break
  //       case ThemeType.DOTDENSITY:
  //         type = constants.THEME_DOT_DENSITY
  //         break
  //       case ThemeType.GRADUATEDSYMBOL:
  //         type = constants.THEME_GRADUATED_SYMBOL
  //         break
  //       case ThemeType.GRIDRANGE:
  //         type = constants.THEME_GRID_RANGE
  //         break
  //       case ThemeType.GRIDUNIQUE:
  //         type = constants.THEME_GRID_UNIQUE
  //         break
  //       case ThemeType.CUSTOM:
  //         Toast.show('提示: 暂不支持编辑的专题图层。')
  //         return
  //       default:
  //         Toast.show(
  //           getLanguage(this.props.language).Prompt
  //             .PLEASE_SELECT_THEMATIC_LAYER,
  //         )
  //         //''提示: 请先选择专题图层。')
  //         NavigationService.navigate('LayerManager')
  //         return
  //     }
  //   }
  //
  //   if (GLOBAL.toolBox) {
  //     GLOBAL.toolBox.setVisible(
  //       true,
  //       type === constants.THEME_GRAPH_STYLE
  //         ? ConstToolType.MAP_THEME_PARAM_GRAPH
  //         : ConstToolType.MAP_THEME_PARAM,
  //       {
  //         containerType: 'list',
  //         isFullScreen: true,
  //         isTouchProgress: false,
  //         themeType: type,
  //         showMenuDialog: true,
  //       },
  //     )
  //     GLOBAL.toolBox.showFullMap()
  //   }
  //
  //   // const menuRef = this.props.getMenuAlertDialogRef()
  //   // if (menuRef) {
  //   //   this.props.showFullMap && this.props.showFullMap(true)
  //   //   menuRef.setMenuType(type)
  //   //   menuRef.showMenuDialog()
  //   // }
  //   //
  //   // const toolRef = this.props.getToolRef()
  //   // if (toolRef) {
  //   //   toolRef.setVisible(true, ConstToolType.MAP_THEME_PARAM, {
  //   //     isFullScreen: false,
  //   //     containerType: 'list',
  //   //     height: ConstToolType.THEME_HEIGHT[1],
  //   //   })
  //   // }
  // }

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
    // TODO 带添加读取配置文件，添加指定模块功能
    let isLicenseNotValid = false
    const currentMapModule = this.props.mapModules.find(function(item) {
      return item.key === type
    })
    const functionModules = currentMapModule.functionModules

    let data = []
    functionModules.forEach(item => {
      switch (item.key) {
        case 'startModule':
          data.push(
            startModule(
              item.type,
              getLanguage(this.props.language).Map_Main_Menu.START,
              !isLicenseNotValid,
            ),
          )
          break
        case 'addModule':
          data.push(
            addModule(
              item.type,
              getLanguage(this.props.language).Map_Main_Menu.OPEN,
              !isLicenseNotValid,
            ),
          )
          break
        case 'styleModule': {
          let styleAction = !isLicenseNotValid
          if (type === ChunkType.MAP_THEME && styleAction) {
            styleAction = () => {
              let currentLayer = this.props.currentLayer
              if (currentLayer.themeType <= 0 && !currentLayer.isHeatmap) {
                styleModule().action(ConstToolType.MAP_STYLE)
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
          data.push(
            styleModule(
              item.type,
              getLanguage(this.props.language).Map_Main_Menu.STYLE,
              styleAction,
            ),
          )
          break
        }
        case 'toolModule':
          data.push(
            toolModule(
              item.type,
              getLanguage(this.props.language).Map_Main_Menu.TOOLS,
              !isLicenseNotValid,
            ),
          )
          break
        case 'markModule':
          data.push(
            markModule(
              item.type,
              getLanguage(this.props.language).Map_Main_Menu.PLOTS,
              !isLicenseNotValid,
            ),
          )
          break
        case 'mark3DModule':
          data.push(
            mark3DModule(
              item.type,
              getLanguage(this.props.language).Map_Main_Menu.PLOTS,
              !isLicenseNotValid,
            ),
          )
          break
        case 'shareModule':
          data.push(
            shareModule(
              item.type,
              getLanguage(this.props.language).Map_Main_Menu.SHARE,
              !isLicenseNotValid,
            ),
          )
          break
        case 'fly3DModule':
          data.push(
            fly3DModule(
              item.type,
              getLanguage(this.props.language).Map_Main_Menu.FLY,
              !isLicenseNotValid,
            ),
          )
          break
        case 'tool3DModule':
          data.push(
            tool3DModule(
              item.type,
              getLanguage(this.props.language).Map_Main_Menu.TOOLS,
              !isLicenseNotValid,
            ),
          )
          break
        case 'arAIAssistant':
          data.push(
            aiModule(
              item.type,
              getLanguage(this.props.language).Map_Main_Menu
                .MAP_AR_AI_ASSISTANT,
              !isLicenseNotValid,
            ),
          )
          break
        case 'navigationModule':
          data.push(
            navigationModule(
              item.type,
              getLanguage(this.props.language).Map_Main_Menu.NAVIGATION_START,
              !isLicenseNotValid,
            ),
          )
          break
        case 'roadNetModule':
          data.push(
            roadNetModule(
              item.type,
              getLanguage(this.props.language).Map_Main_Menu.NETWORK_MODULE,
              !isLicenseNotValid,
            ),
          )
          break
        case 'incrementModule':
          data.push(
            incrementModule(
              item.type,
              getLanguage(this.props.language).Map_Main_Menu.COLLECTION,
              !isLicenseNotValid,
            ),
          )
          break
        case 'themeModule':
          data.push(
            themeModule(
              item.type,
              getLanguage(this.props.language).Map_Main_Menu.THEME,
              !isLicenseNotValid,
            ),
          )
          break
        case 'collectionModule':
          data.push(
            collectionModule(
              item.type,
              getLanguage(this.props.language).Map_Main_Menu.COLLECTION,
              !isLicenseNotValid,
            ),
          )
          break
        case 'editModule':
          data.push(
            editModule(
              // item.type,
              ConstToolType.MAP_EDIT_DEFAULT,
              getLanguage(this.props.language).Map_Main_Menu.EDIT,
              !isLicenseNotValid,
            ),
          )
          break
        case 'plotModule':
          data.push(
            plotModule(
              item.type,
              item.type === ConstToolType.PLOTTING_ANIMATION
                ? getLanguage(this.props.language).Map_Main_Menu
                  .PLOTTING_ANIMATION
                : getLanguage(this.props.language).Map_Main_Menu.PLOT,
              !isLicenseNotValid,
            ),
          )
          break
        case 'analysisModule':
          data.push(
            analysisModule(
              item.type,
              getLanguage(this.props.language).Map_Main_Menu.ANALYSIS,
              !isLicenseNotValid,
            ),
          )
          break
      }
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

  _renderItem = ({ item, index }) => {
    return (
      <View style={styles.btnView} key={this._keyExtractor(item, index)}>
        <MTBtn
          style={styles.btn}
          key={index}
          title={item.title}
          textColor={'black'}
          textStyle={{ fontSize: setSpText(20) }}
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

  renderList = () => {
    this.m_maxHeight =
      (this.props.device.height - screen.getHeaderHeight() - BottomHeight) * 0.6
    // maxHeightN < 4
    let style =
      this.props.device.orientation.indexOf('LANDSCAPE') === 0
        ? {}
        : {
          maxHeight: this.m_maxHeight,
        }
    return (
      <FlatList
        ref={ref => (this.list = ref)}
        style={style}
        data={this.state.data}
        renderItem={this._renderItem}
        keyExtractor={this._keyExtractor}
        onScroll={event => {
          this.offset = event.nativeEvent.contentOffset.y
          this.handlePosition()
        }}
        showsVerticalScrollIndicator={false}
      />
    )
  }

  renderMore = () => {
    return <View style={styles.moreImageView} />
  }

  renderIndicator = location => {
    let style
    if (location === 'top') {
      style = {
        opacity: this.topOpacity,
        transform: [{ rotateX: '180deg' }],
      }
    } else {
      style = {
        opacity: this.bottomOpacity,
      }
    }
    return (
      <View style={styles.indicatorView}>
        <Animated.Image
          style={[styles.indicatorImage, style]}
          source={getPublicAssets().common.icon_arrow_down}
        />
      </View>
    )
  }

  render() {
    if (this.props.hide) {
      return null
    }
    let bottom
    if (this.props.device.orientation.indexOf('LANDSCAPE') === 0) {
      bottom = {
        bottom: BOTTOM_LANDSCAPE,
      }
    }
    return (
      <Animated.View
        style={[
          styles.container,
          bottom,
          this.props.style,
          {
            top: this.state.top,
            right: this.state.right,
          },
        ]}
      >
        {this.renderIndicator('top')}
        {this.renderList()}
        {this.renderIndicator('bottom')}
        {this.props.device.orientation.indexOf('LANDSCAPE') === 0 && (
          <View style={{ height: 1, backgroundColor: '#EEEEEE' }} />
        )}
        {this.props.device.orientation.indexOf('LANDSCAPE') === 0 &&
          this.renderMore()}
      </Animated.View>
    )
  }
}
