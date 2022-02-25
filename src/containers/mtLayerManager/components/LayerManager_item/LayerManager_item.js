/*
  Copyright © SuperMap. All rights reserved.
  Author: Wang zihao
  E-mail: zihaowang5325@qq.com
*/

import * as React from 'react'
//eslint-disable-next-line
import { ActionPopover } from 'teaset'
import { View, Text, TouchableOpacity, Image, Animated, Easing } from 'react-native'
import { DatasetType, ThemeType, SMap } from 'imobile_for_reactnative'
import { Toast, scaleSize, LayerUtils, screen, setSpText } from '../../../../utils'
import SwipeOut from 'react-native-swipeout'
import styles from './styles'
import { color } from '../../../../styles'
import { ChunkType } from '../../../../constants'
import {
  getThemeIconByType,
  getThemeWhiteIconByType,
  getLayerIconByType,
  getLayerWhiteIconByType,
  getThemeAssets,
  getPublicAssets,
} from '../../../../assets'
import { getLanguage } from '../../../../language'
import PropTypes from 'prop-types'

const LAYER_GROUP = 'layerGroup'

export default class LayerManager_item extends React.Component {
  static propTypes = {
    user: PropTypes.object,
    device: PropTypes.object,
    data: PropTypes.object,
    parentData: PropTypes.object,
    isClose: PropTypes.bool,
    swipeEnabled: PropTypes.bool,
    hasSelected: PropTypes.bool, // 是否有选择Radio
    selected: PropTypes.bool, // 选择Radio
    operable: PropTypes.bool,
    child: PropTypes.array,
    sectionID: PropTypes.number,
    rowID: PropTypes.number,
    isSelected: PropTypes.bool,
    index: PropTypes.number,
    layers: PropTypes.object,
    hasBaseMap: PropTypes.bool,
    cornerMarkImage: PropTypes.any,
    isLoading: PropTypes.bool,

    setLayerVisible: PropTypes.func,
    onArrowPress: PropTypes.func,
    onPress: PropTypes.func,
    onAllPress: PropTypes.func,
    onToolPress: PropTypes.func,
    onOpen: PropTypes.func,
    getLayers: PropTypes.func,
    refreshParent: PropTypes.func,
  }

  static defaultProps = {
    isClose: true,
    isSelected: false,
    swipeEnabled: false,
    hasSelected: false,
    selected: false,
    operable: true,
    child: [],
  }

  constructor(props) {
    super(props)
    let data = JSON.parse(JSON.stringify(this.props.data))
    let options = this.getOptions(data)
    let { showLevelOne, showLevelTwo, isVectorLayer } = this.getValidate(data)
    this.state = {
      data: data,
      selected: props.selected,
      options: options,
      editable: data.isEditable,
      visible: data.isVisible,
      selectable: data.isSelectable,
      snapable: data.isSnapable,
      rowShow: false,
      image: this.getStyleIconByType(data),
      showLevelOne: showLevelOne,
      showLevelTwo: showLevelTwo,
      isVectorLayer: isVectorLayer,
      isClose: false,
      child: props.child,
      sectionID: props.sectionID || 0,
      rowID: props.rowID || 0,
      loading: new Animated.Value(0),
    }
    this.popKey = ''
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      nextProps.isLoading && !this.aniMotion ||
      JSON.stringify(this.state) !== JSON.stringify(nextState) ||
      JSON.stringify(this.props) !== JSON.stringify(nextProps)
    ) {
      return true
    }
    return false
  }

  componentDidUpdate(prevProps) {
    if (JSON.stringify(prevProps.data) !== JSON.stringify(this.props.data)) {
      this.getData(this.props.data)
    }
    if (this.props.device.orientation !== prevProps.device.orientation && this.popKey) {
      ActionPopover.hide(this.popKey)
      this.popKey = ''
    }
    // 加载图标
    if ((this.props.isLoading !== prevProps.isLoading || !this.aniMotion) && this.props.isLoading) {
      this.aniMotion = null
      this.loading()
    }
  }

  getValidate = data => {
    let isThemeLayer = false,
      showLevelOne = true,
      isVectorLayer = false
    switch (data.themeType) {
      case 0: // 非专题图层
        isThemeLayer = false
        showLevelOne = true
        break
      case ThemeType.UNIQUE:
      case ThemeType.RANGE:
        isThemeLayer = true
        showLevelOne = true
        break
      case ThemeType.LABEL:
      default:
        isThemeLayer = true
        showLevelOne = false
        break
    }
    let showLevelTwo =
      data.type !== DatasetType.CAD && data.type !== LAYER_GROUP
    if (
      data.type === DatasetType.CAD ||
      data.type === DatasetType.LINE ||
      data.type === DatasetType.LINE3D ||
      data.type === DatasetType.POINT ||
      data.type === DatasetType.POINT3D ||
      data.type === DatasetType.REGION ||
      data.type === DatasetType.REGION3D ||
      data.type === DatasetType.TEXT ||
      data.type === DatasetType.TABULAR
    ) {
      isVectorLayer = true
    }

    return { isThemeLayer, showLevelOne, showLevelTwo, isVectorLayer }
  }

  getData = (data = this.props.data) => {
    (async function() {
      let options = this.getOptions(data)
      let { showLevelOne, isVectorLayer } = this.getValidate(data)
      this.setState({
        data,
        showLevelOne: !showLevelOne,
        isVectorLayer: isVectorLayer,
        options: options,
        editable: data.isEditable && !showLevelOne,
        // visible: data.isVisible && !showLevelOne,
        visible: data.isVisible,
        selectable: data.isSelectable && !showLevelOne,
        snapable: data.isSnapable && !showLevelOne,
        rowShow: this.state.rowShow || false,
        image: this.getStyleIconByType(data),
      })
    }.bind(this)())
  }

  getOptions = data => {
    let { isThemeLayer, isVectorLayer } = this.getValidate(data)
    let options = []

    if (
      !isThemeLayer &&
      isVectorLayer &&
      data.type !== DatasetType.TEXT &&
      data.type !== DatasetType.CAD
    ) {
      options.push({
        component: (
          <View style={styles.btnImageView}>
            <Image
              resizeMode={'contain'}
              style={styles.btnImage}
              source={require('../../../../assets/mapEdit/icon-theme-white.png')}
            />
          </View>
        ),
        onPress: this._openTheme,
      })
      options.push({
        component: (
          <View style={styles.btnImageView}>
            <Image
              resizeMode={'contain'}
              style={styles.btnImage}
              source={require('../../../../assets/mapEdit/icon-style-white.png')}
            />
          </View>
        ),
        onPress: this._openStyle,
      })
    } else if (isThemeLayer || data.type === DatasetType.CAD) {
      options.push({
        component: (
          <View style={styles.btnImageView}>
            <Image
              resizeMode={'contain'}
              style={styles.btnImage}
              source={require('../../../../assets/mapEdit/icon-theme-white.png')}
            />
          </View>
        ),
        onPress: this._openTheme,
      })
    }
    options.push({
      component: (
        <View style={styles.btnImageView}>
          <Image
            resizeMode={'contain'}
            style={styles.btnImage}
            source={require('../../../../assets/mapEdit/icon-rename-white.png')}
          />
        </View>
      ),
      onPress: this._rename,
    })

    if (data.type === 'layerGroup') {
      options.push({
        component: (
          <View style={styles.btnImageView}>
            <Image
              resizeMode={'contain'}
              style={styles.btnImage}
              source={require('../../../../assets/mapEdit/icon-ungroup-white.png')}
            />
          </View>
        ),
        onPress: this._unGroup,
      })
    } else {
      options.push({
        component: (
          <View style={styles.btnImageView}>
            <Image
              resizeMode={'contain'}
              style={styles.btnImage}
              source={require('../../../../assets/mapEdit/icon-delete-white.png')}
            />
          </View>
        ),
        onPress: this._remove,
      })
    }

    return options
  }

  action = () => {
    Toast.show('待做')
  }

  _visible_change = async () => {
    let oldVisibe = this.state.visible
    let rel = await this.props.setLayerVisible(this.props.data, !oldVisibe)
    if (this.props.data.subLayers) {
      for (let i = 0; i < this.props.data.subLayers.length; i++) {
        await this.props.setLayerVisible(
          this.props.data.subLayers[i],
          !oldVisibe,
        )
      }
    }
    if (rel) {
      this.setState(() => {
        let newState = {}
        // if (this.state.data.groupName) {
        let data = JSON.parse(JSON.stringify(this.state.data))
        data.isVisible = !oldVisibe
        newState.data = data
        newState.visible = !oldVisibe
        // }
        return newState
      })
    }
  }

  _pop_row = async () => {
    if (this.props.onPress) {
      await this.props.onPress({
        data: this.state.data,
        parentData: this.props.parentData,
      })
      // await SMap.setLayerEditable(this.state.data.path, true)
    } else return
  }

  _all_pop_row = async () => {
    if (this.props.onAllPress) {
      await this.props.onAllPress({
        data: this.state.data,
        parentData: this.props.parentData,
      })
      // await SMap.setLayerEditable(this.state.data.path, true)
    } else return
  }

  _tool_row = async () => {
    if (this.props.onToolPress) {
      await this.props.onToolPress({
        data: this.state.data,
        index: this.props.index,
        parentData: this.props.parentData,
      })
    } else return
  }

  setChildrenList = children => {
    this.setState({
      child: children,
    })
  }

  _arrow_pop_row = async () => {
    let isShow = !this.state.rowShow
    if (this.state.data.type === 'layerGroup') {
      let child = []
      if (isShow) {
        child =
          (this.props.onArrowPress &&
            (await this.props.onArrowPress({
              data: this.state.data,
            }))) ||
          []
      }
      this.setState({
        rowShow: isShow,
        child: child,
      })
    } else {
      this.setSelected(!this.state.selected, async () => {
        this.props.onPress &&
          (await this.props.onPress({
            data: this.state.data,
          }))
      })
    }
  }

  _renderAdditionView = () => {
    return <View style={styles.additionView}>{this.state.child}</View>
  }

  getStyleIconByType = item => {
    if (item.themeType > 0) {
      if (this.props.isSelected) {
        return getThemeWhiteIconByType(item.themeType)
      } else {
        return getThemeIconByType(item.themeType)
      }
    } else if (item.isHeatmap) {
      if (this.props.isSelected) {
        return getThemeAssets().themeType.heatmap_selected
      } else {
        return getThemeAssets().themeType.heatmap
      }
    } else {
      if (this.props.isSelected) {
        return getLayerWhiteIconByType(item.type)
      } else {
        return getLayerIconByType(item.type)
      }
    }
  }

  close = () => {
    this.setState({
      isClose: true,
    })
  }

  /**
   * 设置是否选择
   * @param isSelect
   * @param cb
   */
  setSelected = (isSelect, cb?: () => {}) => {
    let select = isSelect
    if (isSelect === null) {
      select = !this.state.selected
    }
    this.setState(
      {
        selected: select,
      },
      () => {
        cb && cb(this.state.data)
      },
    )
  }

  renderRadioBtn = () => {
    let viewStyle = styles.radioView,
      dotStyle = styles.radioSelected
    return (
      <View style={viewStyle}>
        {this.state.selected && <View style={dotStyle} />}
      </View>
    )
  }

  /**
   * ”我的图层“的子项的设置菜单的管理方法
   * @param {Component} pressView 显示用的组件
   * @param {object} layer 触发组件显示的图层对象
   */
  _showPopover = (pressView, layer) => {
    let items = []
    let upMoveObj = {
      // 将图层向上移一层
      title: getLanguage(GLOBAL.language).Map_Layer.LAYERS_MOVE_UP,
      onPress: () => {
        (async function() {
          // 调用接口方法上移图层
          await SMap.moveUpLayer(layer.path)
          if (this.props.parentData) {
            this.props.refreshParent &&
              this.props.refreshParent(this.props.parentData)
          } else {
            await this.props.getLayers()
          }
          // 重新确定按钮的显示位置
          let { px, py, width, height } = this.PressViewPosition
          if (layer.index > 0) {

            // 点击上移按钮后，检查当前图层是否需要变化按钮显示 lyx
            if(layer.index === 1){
              // 从第二个图层移到第一个图层，要去掉原来items里的置顶和上移按钮
              items.splice(2,1)  
              items.splice(0,1)
            } else if(layer.index === layer.layerCount - 1) {
              // 从最后一个图层移动到倒数第二个图层，需要加上 下移和置底按钮
              items.splice(1, 0, downMoveObj)
              items.push(moveToBottomObj)
            }

            py = py - height
            if (py >= scaleSize(180)) {
              this.popKey = ActionPopover.show(
                {
                  x: px,
                  y: py,
                  width,
                  height,
                },
                items,
              )
            } else {
              this.popKey = ''
            }
            layer.index -= 1
            this.setState({
              data: layer,
            })
            this.PressViewPosition = { px, py, width, height }
          } else {
            this.popKey = ActionPopover.show(
              {
                x: px,
                y: py,
                width,
                height,
              },
              items,
            )
          }
        }.bind(this)())
      },
    }
    let downMoveObj = {
      // 将图层向下移一层
      title: getLanguage(GLOBAL.language).Map_Layer.LAYERS_MOVE_DOWN,
      onPress: () => {
        (async function() {
          await SMap.moveDownLayer(layer.path)
          if (this.props.parentData) {
            this.props.refreshParent &&
              this.props.refreshParent(this.props.parentData)
          } else {
            await this.props.getLayers()
          }
          let { px, py, width, height } = this.PressViewPosition
          if (layer.index < layer.layerCount - 1) {

            // 点击下移按钮后，检查当前图层是否需要变化按钮显示 lyx
            if(layer.index === 0){
              // 从第一个图层移到第二个图层，需要加上 上移和置顶按钮
              items.unshift(upMoveObj)
              items.splice(2, 0, moveToTopObj)
            } else if(layer.index === layer.layerCount - 2) {
              // 从倒数第二个图层移动到最后一个图层，需要去掉原来item里的置底和下移按钮
              items.splice(3, 1)
              items.splice(1, 1)
            }

            py = py + height
            if (
              py < screen.getScreenHeight() - scaleSize(
                screen.getOrientation().indexOf('PORTRAIT') ? 40 : 120,
              )
            ) {
              this.popKey = ActionPopover.show(
                {
                  x: px,
                  y: py,
                  width,
                  height,
                },
                items,
              )
            } else {
              this.popKey = ''
            }
            layer.index += 1
            this.setState({
              data: layer,
            })
            this.PressViewPosition = { px, py, width, height }
          } else {
            this.popKey = ActionPopover.show(
              {
                x: px,
                y: py,
                width,
                height,
              },
              items,
            )
          }
        }.bind(this)())
      },
    }
    let moveToTopObj = {
      // 将图层置顶
      title: getLanguage(GLOBAL.language).Map_Layer.LAYERS_TOP,
      onPress: () => {
        (async function() {
          this.popKey = ''
          await SMap.moveToTop(layer.path)
          if (layer.path.indexOf('/') === -1) {
            let count = await SMap.getTaggingLayerCount(
              (this.props.user.currentUser &&
                this.props.user.currentUser.userName) ||
                'Customer',
            )
            for (let i = 0; i < count; i++) {
              await SMap.moveToTop(layer.path)
            }
          }
          if (this.props.parentData) {
            this.props.refreshParent &&
              this.props.refreshParent(this.props.parentData)
          } else {
            await this.props.getLayers()
          }
        }.bind(this)())
      },
    }
    let moveToBottomObj = {
      // 将图层置底
      title: getLanguage(GLOBAL.language).Map_Layer.LAYERS_BOTTOM,
      onPress: () => {
        (async function() {
          this.popKey = ''
          await SMap.moveToBottom(layer.path)
          if (layer.path.indexOf('/') === -1 && this.props.hasBaseMap) {
            SMap.moveUpLayer(layer.path)
          }
        }.bind(this)())
        // if (
        //   this.props.layers[this.props.layers.length - 1].name.indexOf(
        //     'vec@TD',
        //   ) >= 0
        // ) {
        //   SMap.moveToBottom(layer.name)
        // }
        if (this.props.parentData) {
          this.props.refreshParent &&
            this.props.refreshParent(this.props.parentData)
        } else {
          this.props.getLayers()
        }
      },
    }

    // 根据图层总数和图层当前所处位置调整设置菜单的按钮显示 lyx
    if(layer.layerCount === 1){
      // 当只有一个图层时，什么按钮也不显示
      item = []
    }else if(layer.index === 0){
      // 当前图层是第一个图层时，显示置底和下移按钮
      items = [downMoveObj, moveToBottomObj]
    }else if(layer.index === layer.layerCount - 1){
      // 当前图层是最后一个图层时，显示置顶和上移按钮
      items = [upMoveObj, moveToTopObj]
    } else {
      items = [upMoveObj, downMoveObj, moveToTopObj, moveToBottomObj]
    }

    // 设置菜单的显示的位置坐标
    pressView.measure((ox, oy, width, height, px, py) => {
      this.popKey = ActionPopover.show(
        {
          x: px,
          y: py,
          width,
          height,
        },
        items,
      )
      this.PressViewPosition = {
        width,
        height,
        px,
        py,
      }
    })
  }

  loading = () => {
    if (!this.aniMotion && this.props.isLoading) {
      this.state.loading.setValue(0)
      this.aniMotion = Animated.timing(this.state.loading,{
        toValue: this.state.loading._value === 0 ? 1 : 0,
        duration: 800,
        easing: Easing.linear,
        useNativeDriver: true,
      })
      Animated.loop(this.aniMotion).start()
    }
  }

  renderCornerMark = () => {
    // 应急标绘不支持服务
    if (GLOBAL.Type === ChunkType.MAP_PLOTTING) return null
    if (this.props.isLoading) {
      return (
        <Animated.Image
          resizeMode={'contain'}
          style={[
            styles.cornerMark,
            {
              transform: [{rotate: this.state.loading
                .interpolate({inputRange: [0, 1],outputRange: ['0deg', '360deg']}),
              }],
            },
          ]}
          source={getPublicAssets().common.icon_downloading}
        />
      )
    }
    const dsDescription = LayerUtils.getDatasetDescriptionByLayer(this.state.data)
    let cornerMark
    if (this.props.cornerMarkImage) {
      cornerMark = this.props.cornerMarkImage
    } else if (GLOBAL.coworkMode && dsDescription?.type === 'onlineService' && this.props.data.isModified && LayerUtils.availableServiceLayer(this.state.data.type)) {
      cornerMark = getThemeAssets().cowork.icon_state_published
    } else {
      if (!dsDescription) return null
      switch(dsDescription.type) {
        case 'onlineService':
          // cornerMark = GLOBAL.coworkMode && this.props.data.themeType === 0 ? getThemeAssets().cowork.icon_state_published : null
          cornerMark = GLOBAL.coworkMode && LayerUtils.availableServiceLayer(this.state.data.type) ? getThemeAssets().cowork.icon_complate : null
          break
      }
    }
    if (!cornerMark) return null
    return (
      <Image
        resizeMode={'contain'}
        style={styles.cornerMark}
        source={cornerMark}
      />
    )
  }

  renderItem = () => {
    let name = this.state.data.caption
    const visibleImgWhite = this.state.visible
      ? getPublicAssets().common.icon_disable_select
      : getPublicAssets().common.icon_disable_none
    const visibleImgBlack = this.state.visible
      ? getPublicAssets().common.icon_select
      : getPublicAssets().common.icon_none
    let leftView = this.props.hasSelected ? (
      this.renderRadioBtn()
    ) : this.state.data.groupName ? (
      <View style={styles.btn} />
    ) : null
    let select = 'transparent'
    let selectcolor = color.black
    let visibleImg = visibleImgBlack
    let moreImg, arrowImg
    let image = this.getStyleIconByType(this.state.data)
    if (this.props.isSelected) {
      select = '#4680df'
      selectcolor = color.white
      visibleImg = visibleImgWhite
      moreImg = getThemeAssets().publicAssets.icon_move_selected
      arrowImg = this.state.rowShow
        ? getThemeAssets().publicAssets.icon_dropdown_selected
        : getThemeAssets().publicAssets.icon_dropup_selected
    } else {
      select = 'transparent'
      selectcolor = color.black
      visibleImg = visibleImgBlack
      moreImg = getThemeAssets().publicAssets.icon_move
      arrowImg = this.state.rowShow
        ? getThemeAssets().publicAssets.icon_drop_down
        : getThemeAssets().publicAssets.icon_drop_up
    }
    let iTemView
    return (
      <TouchableOpacity
        ref={ref => (iTemView = ref)}
        activeOpacity={1}
        style={[styles.rowOne, { backgroundColor: select }]}
        onPress={this._all_pop_row}
        onLongPress={() => {
          //非标注，底图
          if (
            this.state.data.name.indexOf('@Label_') === -1 &&
            !LayerUtils.isBaseLayer(this.state.data)
          ) {
            this._showPopover(iTemView, this.state.data)
          }
        }}
      >
        <View style={styles.btn_container}>
          {this.state.data.type === LAYER_GROUP ? (
            <TouchableOpacity style={styles.btn} onPress={this._arrow_pop_row}>
              <Image
                resizeMode={'contain'}
                style={styles.btn_image_big}
                source={arrowImg}
              />
            </TouchableOpacity>
          ) : (
            leftView
          )}
          {this.props.operable && (
            <TouchableOpacity style={styles.btn} onPress={this._visible_change}>
              <Image
                resizeMode={'contain'}
                style={styles.btn_image}
                source={visibleImg}
              />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.btn1} onPress={this._pop_row}>
            <Image
              resizeMode={'contain'}
              style={[
                this.state.data.type === DatasetType.POINT &&
                this.state.data.themeType <= 0
                  ? styles.smallImage
                  : styles.btn_image,
              ]}
              source={image}
            />
            {this.renderCornerMark()}
          </TouchableOpacity>
        </View>
        <View style={styles.text_container}>
          <Text numberOfLines={2} style={[styles.text, { color: selectcolor }]}>{name}</Text>
          {
            this.state.data.datasourceAlias !== '' && this.state.data.datasetName !== '' &&
            <Text numberOfLines={1} style={[styles.text, { fontSize: setSpText(20), color: this.props.isSelected ? selectcolor : color.fontColorGray }]}>
              {this.state.data.datasourceAlias + ' - ' + this.state.data.datasetName + ' - ' + this.state.data.name}
            </Text>
          }
        </View>
        <TouchableOpacity style={styles.btn} onPress={this._tool_row}>
          <Image
            resizeMode={'contain'}
            style={styles.more_image}
            source={moreImg}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    )
  }

  renderSwipeItem = () => {
    return (
      <SwipeOut
        style={styles.container}
        close={this.state.isClose}
        right={this.state.options}
        autoClose={true}
        backgroundColor={'white'}
        onOpen={() => {
          // 参数sectionID, rowID
          this.props.onOpen && this.props.onOpen(this.state.data)
        }}
        buttonWidth={scaleSize(100)}
      >
        {this.renderItem()}
      </SwipeOut>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        {this.props.swipeEnabled ? this.renderSwipeItem() : this.renderItem()}
        {this.state.rowShow && this._renderAdditionView()}
      </View>
    )
  }
}
