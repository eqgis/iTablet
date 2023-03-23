/**
 * Copyright © SuperMap. All rights reserved.
 * Author: Asort
 * https://github.com/AsortKeven
 */
/* global GLOBAL */
import React, { Component } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  FlatList,
  Platform,
  KeyboardAvoidingView,
} from 'react-native'
import { STheme, SMap, GeoStyle  } from 'imobile_for_reactnative'
import { ThemeType } from 'imobile_for_reactnative/NativeModule/interfaces/mapping/STheme'

import { Container } from '../../components'
import { color } from '../../styles'
import { scaleSize, setSpText, Toast } from '../../utils'
import ToolbarModule from '../workspace/components/ToolBar/modules/ToolbarModule'
import ThemeAction from '../workspace/components/ToolBar/modules/themeModule/ThemeAction'
import { ConstToolType, ToolbarType, TouchType } from '../../constants'
import { getLanguage } from '../../language'
import constants from '../workspace/constants'
import {
  themeModule,
} from '../workspace/components/ToolBar/modules'
import { GeoTextStyle } from 'imobile_for_reactnative/NativeModule/interfaces/data/SData'

export default class CustomModePage extends Component {
  props: {
    device: Object,
    navigation: Object,
    currentLayer: Object,
  }

  constructor(props) {
    super(props)
    const { params } = this.props.route
    this.type = (params && params.type) || ToolbarModule.getData().customType
    this.state = {
      originData: [],
      data: [],
      length: 0,
    }
  }
  async componentDidMount() {
    let data = ToolbarModule.getData().customModeData
    let length
    if (data) {
      length = data.length
    } else {
      const layerParams = {
        LayerName: this.props.currentLayer.name || '',
      }
      switch (this.type) {
        case ConstToolType.SM_MAP_THEME_PARAM_RANGE_MODE:
          data = (await STheme.getThemeRangeInfo(layerParams.LayerName)).items
          // data = await STheme.getRangeList(layerParams)
          break
        case ConstToolType.SM_MAP_THEME_PARAM_RANGELABEL_MODE:
          data = (await STheme.getRangeThemeLabelLayerInfo(layerParams.LayerName)).items
          // data = await STheme.getRangeLabelList(layerParams)
          break
        case ConstToolType.SM_MAP_THEME_PARAM_UNIQUE_COLOR:
          data = (await STheme.getThemeUniqueInfo(layerParams.LayerName)).items
          // data = await STheme.getUniqueList(layerParams)
          break
        case ConstToolType.SM_MAP_THEME_PARAM_UNIQUELABEL_COLOR:
          // data = await STheme.getUniqueLabelList(layerParams)
          data = (await STheme.getUniqueThemeLabelLayerInfo(layerParams.LayerName)).items
          break
      }
      length = data.length
    }
    this.lastLength = length
    this.setState(
      {
        originData: data,
        data,
        length,
      },
      () => {
        global.ToolBar?.showFullMap(true)
      },
    )
  }

  _back = async () => {
    // let mapXml = ToolbarModule.getData().mapXml
    // await SMap.mapFromXml(mapXml) // 不保存专题图修改，还原地图
    this.props.navigation.goBack()
    // global.PreviewHeader?.setVisible(false)
    // global.ToolBar?.setVisible(false)
    // global.ToolBar?.existFullMap()
    const params = ToolbarModule.getParams()
    this.layerListAction(params.currentLayer)
  }

  layerListAction = async data => {
    const _params = ToolbarModule.getParams()
    let curThemeType
    if (data.isHeatmap) {
      curThemeType = constants.THEME_HEATMAP
    } else {
      switch (data.themeType) {
        case ThemeType.UNIQUE:
          curThemeType = constants.THEME_UNIQUE_STYLE
          break
        case ThemeType.RANGE:
          curThemeType = constants.THEME_RANGE_STYLE
          break
        case ThemeType.LABEL:
          curThemeType = constants.THEME_UNIFY_LABEL
          break
        case ThemeType.LABELUNIQUE:
          curThemeType = constants.THEME_UNIQUE_LABEL
          break
        case ThemeType.LABELRANGE:
          curThemeType = constants.THEME_RANGE_LABEL
          break
        case ThemeType.DOTDENSITY:
          curThemeType = constants.THEME_DOT_DENSITY
          break
        case ThemeType.GRADUATEDSYMBOL:
          curThemeType = constants.THEME_GRADUATED_SYMBOL
          break
        case ThemeType.GRAPH:
          curThemeType = constants.THEME_GRAPH_STYLE
          break
        case ThemeType.GRIDRANGE:
          curThemeType = constants.THEME_GRID_RANGE
          break
        case ThemeType.GRIDUNIQUE:
          curThemeType = constants.THEME_GRID_UNIQUE
          break
        default:
          Toast.show(
            getLanguage(_params.language).Prompt
              .CURRENT_LAYER_DOSE_NOT_SUPPORT_MODIFICATION,
          )
          break
      }
    }
    if (curThemeType) {
      const _type =
        curThemeType === constants.THEME_GRAPH_STYLE
          ? ConstToolType.SM_MAP_THEME_PARAM_GRAPH
          : ConstToolType.SM_MAP_THEME_PARAM
      _params.showFullMap(true)
      // const { orientation } = _params.device
      const xml = await SMap.mapToXml()
      ToolbarModule.setData({
        type: _type,
        getData: themeModule.getData,
        actions:themeModule.actions,
        currentThemeData: data,
        themeCreateType: curThemeType,
        mapXml: xml,
      })
      _params.setToolbarVisible(true, _type, {
        containerType: ToolbarType.list,
        isFullScreen: true,
        // height:
        //   orientation.indexOf('PORTRAIT') >= 0
        //     ? ConstToolType.THEME_HEIGHT[3]
        //     : ConstToolType.TOOLBAR_HEIGHT_2[3],
        // column: orientation.indexOf('PORTRAIT') >= 0 ? 8 : 4,
        themeType: curThemeType,
        isTouchProgress: false,
        showMenuDialog: true,
      })
      _params.navigation.navigate('MapView')
    }
  }

  _changeItemVisible = index => {
    const data = JSON.parse(JSON.stringify(this.state.data))
    data[index].isVisible = !data[index].isVisible
    this.setState({
      data,
    })
  }
  _changeItemValue = (index, text) => {
    if (isNaN(Math.round(text)) || text.indexOf('.') > 0) {
      Toast.show(getLanguage(global.language).Prompt.ONLY_INTEGER)
      return
    }
    const data = JSON.parse(JSON.stringify(this.state.data))
    const item = data[index]
    const nextItem = data[index + 1]
    let val = text
    if (text <= Math.round(item.start)) {
      val = Math.round(item.start) + 1
    } else if (text >= Math.round(nextItem.end)) {
      val = Math.round(nextItem.end) - 1
    }
    data[index].end = val + ''
    data[index].caption = data[index].start + ' <= X < ' + data[index].end
    data[index + 1].start = val + ''
    data[index + 1].caption =
      data[index + 1].start + ' <= X < ' + data[index + 1].end
    this.setState({
      data,
    })
  }

  _changeLength = length => {
    if (isNaN(Math.round(length)) || length.includes('.') || length < 3) {
      Toast.show(
        getLanguage(global.language).Prompt.ONLY_INTEGER_GREATER_THAN_2,
      )
      return
    }
    const data = JSON.parse(JSON.stringify(this.state.data))
    const min = data[0].end - 0
    const max = data[this.lastLength - 1].start - 0

    const rand = (max - min) / (length - 2)

    const minusRel = this.lastLength - length
    if (minusRel > 0) {
      data.splice(this.lastLength - 1 - minusRel, minusRel)
    } else {
      for (let i = 0; i < Math.abs(minusRel); i++) {
        const geoStyle = new GeoStyle()
        geoStyle.setFillForeColor(255,255,255)
        geoStyle.setLineColor(255,255,255)
        geoStyle.setPointColor(255,255,255)
        const newObj = {
          style:JSON.stringify(geoStyle),
          isVisible: true,
        }
        data.splice(this.lastLength - 1, 0, newObj)
      }
    }
    data.map((item, index) => {
      if (item.start === 'min' || item.end === 'max') {
        return
      }
      item.start = min + rand * (index - 1)
      item.end = min + rand * index
      item.caption = item.start + ' <= X < ' + item.end
    })
    this.lastLength = ~~length
    this.setState({
      data,
      length: ~~length,
    })
  }

  _preView = async () => {
    const data = {
      LayerName: this.props.currentLayer.name,
      items: this.state.data,
    }
    const rel = await this._setAttrToMap(data)
    if (rel) {
      const params = ToolbarModule.getParams()
      params.showFullMap && params.showFullMap(true)
      global.PreviewHeader && global.PreviewHeader.setVisible(true)
      ToolbarModule.addData({
        customModeData: this.state.data,
        customType: this.type,
      })
      this.props.navigation.goBack()
    } else {
      Toast.show(getLanguage(global.language).Prompt.PARAMS_ERROR)
    }
  }

  _confirm = async () => {
    const data = {
      LayerName: this.props.currentLayer.name,
      items: this.state.data,
    }
    const rel = await this._setAttrToMap(data)
    if (rel) {
      global.PreviewHeader && global.PreviewHeader.setVisible(false)
      global.ToolBar && global.ToolBar.existFullMap()
      global.TouchType = TouchType.NORMAL
      // 在线协作,专题,实时同步
      if (global.coworkMode) {
        const layerInfo = await SMap.getLayerInfo(this.props.currentLayer.path)
        ThemeAction.sendUpdateThemeMsg(layerInfo)
      }
      ToolbarModule.setData({})
      this.props.navigation.goBack()
    } else {
      Toast.show(getLanguage(global.language).Prompt.PARAMS_ERROR)
    }
  }

  _pressColor = index => {
    const _params = ToolbarModule.getParams()
    const type = ConstToolType.SM_MAP_COLOR_PICKER
    ToolbarModule.addData({
      customModeData: this.state.data,
      customType: this.type,
      index,
    })
    _params.showFullMap(true)
    _params.setToolbarVisible &&
      _params.setToolbarVisible(true, type, {
        isFullScreen: false,
        containerType: ToolbarType.colorPicker,
        resetToolModuleData: true,
      })
    this.props.navigation.goBack()
  }

  _setAttrToMap = async params => {
    let result
    switch (this.type) {
      case ConstToolType.SM_MAP_THEME_PARAM_RANGE_MODE:
        result = await STheme.modifyThemeRangeLayer(params.LayerName,params)
        // result = await STheme.setCustomThemeRange(params)
        break
      case ConstToolType.SM_MAP_THEME_PARAM_RANGELABEL_MODE:
        result = await STheme.modifyRangeThemeLabelLayer(params.LayerName,params)
        // result = await STheme.setCustomRangeLabel(params)
        break
      case ConstToolType.SM_MAP_THEME_PARAM_UNIQUE_COLOR:
        result = await STheme.modifyThemeUniqueLayer(params.LayerName,params)
        // result = await STheme.setCustomThemeUnique(params)
        break
      case ConstToolType.SM_MAP_THEME_PARAM_UNIQUELABEL_COLOR:
        result = true
        break
    }
    return result
  }

  _renderRight = () => {
    return (
      <View style={styles.rightContainer}>
        <TouchableOpacity style={styles.btn} onPress={this._preView}>
          <Text style={styles.rightText}>
            {getLanguage(global.language).Map_Main_Menu.PREVIEW}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={this._confirm}>
          <Text style={styles.rightText}>
            {getLanguage(global.language).CONFIRM}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  _renderInput = () => {
    const minus = require('../../assets/mapTool/icon_minus.png')
    const plus = require('../../assets/mapTool/icon_plus.png')
    const length = this.state.length
    return (
      <View style={styles.row}>
        <Text style={styles.itemTitle}>
          {getLanguage(global.language).Map_Main_Menu.RANGES}
        </Text>

        <View style={styles.inputView}>
          <TouchableOpacity
            style={styles.minus}
            onPress={() => {
              this._changeLength(this.state.length - 1 + '')
            }}
          >
            <Image style={styles.icon} source={minus} resizeMode={'contain'} />
          </TouchableOpacity>
          <TextInput
            defaultValue={length + ''}
            value={this.state.length + ''}
            style={styles.inputItem}
            keyboardType={'number-pad'}
            returnKeyType={'done'}
            onChangeText={text => {
              if (text === '') {
                text = ''
              } else if (isNaN(text) || isNaN(Math.round(text)) || text.includes('.')) {
                text = this.state.length
              } else {
                text = parseInt(text)
              }
              this.setState({
                length: text,
              })
            }}
            onEndEditing={evt => {
              let text = evt.nativeEvent.text
              if (text === '' || text < 3) {
                text = 3
              }
              this.setState({
                length: text,
              }, () => {
                this._changeLength(text + '')
              })
            }}
          />
          <TouchableOpacity
            style={styles.plus}
            onPress={() => {
              this._changeLength(this.state.length + 1 + '')
            }}
          >
            <Image style={styles.icon} source={plus} resizeMode={'contain'} />
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  _renderItem = ({ item, index }) => {
    const visibleImg = item.isVisible
      ? require('../../assets/mapTools/icon_multi_selected_disable_black.png')
      : require('../../assets/mapTools/icon_multi_unselected_disable_black.png')
    let start, end, str
    if (item.start) {
      start = index === 0 ? 'min' : Math.round(item.start)
      end = index === this.state.data.length-1 ? 'max' : Math.round(item.end)
      str = `${start}<=X<`
    } else {
      str = item.caption
    }
    let color
    if(typeof item.style == 'string'){
      const geoStyle = new GeoStyle(item.style)
      const colorObj = geoStyle.getFillForeColor() || geoStyle.getLineColor() || geoStyle.getPointColor()
      color = colorObj && `rgb(${colorObj.r},${colorObj.g},${colorObj.b})`
    }else{
      // const geoTextStyle:GeoTextStyle = item.style
      const colorObj = item.color
      color = colorObj && `rgb(${colorObj.r},${colorObj.g},${colorObj.b})`
    }
    return (
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' && 'padding'}>
        <View style={styles.itemRow}>
          <View style={styles.left}>
            <TouchableOpacity
              style={styles.icon}
              onPress={() => {
                this._changeItemVisible(index)
              }}
            >
              <Image
                source={visibleImg}
                resizeMode={'contain'}
                style={styles.checkImg}
              />
            </TouchableOpacity>
            <Text style={styles.constText}>{str}</Text>
            {end !== undefined &&
              (end === 'max' ? (
                <Text style={[styles.constText, { marginLeft: 0 }]}>{end}</Text>
              ) : (
                <TextInput
                  value={end + ''}
                  style={styles.normalText}
                  keyboardType={'number-pad'}
                  returnKeyType={'done'}
                  onChangeText={text => {
                    const data = JSON.parse(JSON.stringify(this.state.data))
                    data[index].end = ~~text
                    this.setState({
                      data,
                    })
                  }}
                  onEndEditing={evt => {
                    this._changeItemValue(index, evt.nativeEvent.text)
                  }}
                />
              ))}
          </View>
          <TouchableOpacity
            style={[styles.right, { backgroundColor: color }]}
            activeOpacity={1}
            onPress={() => {
              this._pressColor(index)
            }}
          />
        </View>
      </KeyboardAvoidingView>
    )
  }

  render() {
    let title, hasSubTitle
    switch (this.type) {
      case ConstToolType.SM_MAP_THEME_PARAM_RANGELABEL_MODE:
        title = getLanguage(global.language).Map_Main_Menu
          .THEME_RANGES_LABEL_MAP_TITLE
        hasSubTitle = true
        break
      case ConstToolType.SM_MAP_THEME_PARAM_RANGE_MODE:
        hasSubTitle = true
        title = getLanguage(global.language).Map_Main_Menu
          .THEME_RANGES_MAP_TITLE
        break
      case ConstToolType.SM_MAP_THEME_PARAM_UNIQUE_COLOR:
        hasSubTitle = false
        title = getLanguage(global.language).Map_Main_Menu
          .THEME_UNIQUE_VALUES_MAP_TITLE
        break
      case ConstToolType.SM_MAP_THEME_PARAM_UNIQUELABEL_COLOR:
        hasSubTitle = false
        title = getLanguage(global.language).Map_Main_Menu
          .THEME_UNIQUE_VALUE_LABEL_MAP_TITLE
        break
    }
    return (
      <Container
        ref={ref => (this.container = ref)}
        style={styles.container}
        onOverlayPress={this._back}
        headerProps={{
          title,
          backAction: this._back,
          navigation: this.props.navigation,
          headerRight: this._renderRight(),
          headerTitleViewStyle: {
            marginLeft: scaleSize(90),
            textAlign: 'left',
          },
        }}
      >
        <View style={styles.pageContainer}>
          {hasSubTitle && this._renderInput()}
          <FlatList
            style={styles.list}
            keyExtractor={(item, index) => item.toString() + index}
            data={this.state.data}
            renderItem={this._renderItem}
          />
        </View>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.separateColorGray,
  },
  //headerRight
  rightContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  btn: {
    height: scaleSize(60),
    maxWidth: scaleSize(120),
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginLeft: scaleSize(10),
  },
  rightText: {
    fontSize: setSpText(20),
    color: color.fontColorBlack,
  },
  //page
  pageContainer: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    paddingHorizontal: scaleSize(20),
    height: scaleSize(80),
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: color.white,
  },
  icon: {
    width: scaleSize(40),
    height: scaleSize(40),
    tintColor: color.imageColorBlack,
  },
  inputView: {
    width: scaleSize(100),
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  inputItem: {
    textAlign: 'center',
    width: scaleSize(60),
    height: scaleSize(40),
    fontSize: setSpText(16),
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: color.USUAL_SEPARATORCOLOR,
    backgroundColor: color.white,
    ...Platform.select({
      android: {
        padding: 0,
      },
    }),
  },
  plus: {
    width: scaleSize(40),
    height: scaleSize(40),
    borderWidth: 1,
    borderColor: color.USUAL_SEPARATORCOLOR,
    backgroundColor: color.white,
  },
  minus: {
    width: scaleSize(40),
    height: scaleSize(40),
    borderWidth: 1,
    borderColor: color.USUAL_SEPARATORCOLOR,
    backgroundColor: color.white,
  },
  itemTitle: {
    fontSize: setSpText(18),
    flex: 1,
  },

  //FlatList
  list: {
    marginTop: scaleSize(20),
    backgroundColor: color.white,
  },
  itemRow: {
    height: scaleSize(80),
    marginHorizontal: scaleSize(20),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  checkImg: {
    width: scaleSize(40),
    height: scaleSize(40),
  },
  left: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  right: {
    width: scaleSize(120),
    height: scaleSize(40),
  },
  constText: {
    marginLeft: scaleSize(40),
    fontSize: scaleSize(18),
    color: color.gray,
  },
  normalText: {
    fontSize: scaleSize(18),
    width: scaleSize(60),
    height: scaleSize(40),
    ...Platform.select({
      android: {
        padding: 0,
      },
    }),
  },
})
