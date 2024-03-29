import React, { Component } from 'react'
import { TouchableOpacity, View, Text, Image } from 'react-native'
import { SScene } from 'imobile_for_reactnative'
import styles from './styles'
import { ConstToolType } from '../../constants'
import { color } from '../../styles'
import { scaleSize } from '../../utils'

import { getThemeAssets, getPublicAssets } from '../../assets'

export default class Layer3DItem extends Component {
  props: {
    style?: Object,
    item: Object,
    device: Object,
    toHeightItem: Object,
    index: any,
    onPress?: () => {},
    getlayer3dToolbar: () => {},
    setCurrentLayer3d: () => {},
    overlayView: () => {},
    onRefresh: () => {},
  }
  constructor(props) {
    super(props)
    this.state = {
      // name: props.item.name,
      visible: props.item.visible,
      selectable: props.item.selectable,
      // type: props.item.type,
    }

    this.changeVisible = this.changeVisible.bind(this)
    this.more = this.more.bind(this)
  }

  // changeSelect = async () => {
  //   let newState = this.state
  //   newState.selectable = !this.state.selectable
  //   await SScene.setSelectable(this.state.name, newState.selectable)
  //   this.setState(newState)
  //   // console.log(this.state.visible,this.state.selectable)
  // }
  shouldComponentUpdate(prevProps, prevState) {
    if (
      JSON.stringify(prevProps.toHeightItem) !==
        JSON.stringify(this.props.toHeightItem) ||
      JSON.stringify(prevProps.item) !== JSON.stringify(this.props.item) ||
      JSON.stringify(prevState) !== JSON.stringify(this.state)
    ) {
      return true
    }
    return false
  }
  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps) {}
  setItemSelectable(selectable) {
    this.setState({ selectable: selectable })
  }

  changeVisible() {
    let newState = JSON.parse(JSON.stringify(this.state))
    newState.visible = !this.state.visible
    if (this.props.item.type === 'Terrain') {
      SScene.setTerrainLayerListVisible(this.props.item.name, newState.visible)
    } else {
      SScene.setVisible(this.props.item.name, newState.visible)
    }
    this.setState(newState)
    this.props.onRefresh()
  }

  more() {
    let layer3dToolbar = this.props.getlayer3dToolbar
      ? this.props.getlayer3dToolbar()
      : null
    // let overlayView = this.props.getOverlayView
    //   ? this.props.getOverlayView()
    //   : null
    if (layer3dToolbar) {
      switch (this.props.item.type) {
        case 'IMAGEFILE': {
          if (
            this.props.item.name === 'BingMap' ||
            this.props.item.name === 'TianDiTu'
          ) {
            layer3dToolbar.setVisible(true, ConstToolType.SM_MAP3D_LAYER3D_BASE, {
              isFullScreen: true,
              height: ConstToolType.TOOLBAR_HEIGHT[1],
            })
          } else {
            layer3dToolbar.setVisible(true, ConstToolType.SM_MAP3D_LAYER3D_IMAGE, {
              isFullScreen: true,
              height: ConstToolType.TOOLBAR_HEIGHT[2],
            })
          }
          break
        }
        case 'Terrain':
          layer3dToolbar.setVisible(true, ConstToolType.SM_MAP3D_LAYER3D_TERRAIN, {
            isFullScreen: true,
            height: ConstToolType.TOOLBAR_HEIGHT[2],
          })
          break
        default: {
          let type = ConstToolType.SM_MAP3D_LAYER3D_DEFAULT
          if (this.state.selectable) {
            type = ConstToolType.SM_MAP3D_LAYER3D_DEFAULT_SELECTED
          }
          layer3dToolbar.setVisible(true, type, {
            isFullScreen: true,
            height: ConstToolType.TOOLBAR_HEIGHT[1],
          })
          layer3dToolbar.getLayer3dItem(this.state, this.changeState)
          break
        }
      }
      layer3dToolbar.getLayer3dItem(
        {
          name: this.props.item.name,
          visible: this.state.visible,
          selectable: this.state.selectable,
          type: this.props.item.type,
        },
        this.changeState,
      )
      this.props.overlayView.setVisible(true)
    }
  }

  _onPress = () => {
    if (this.props.onPress && typeof this.props.onPress === 'function') {
      this.props.onPress({ data: this.props.item, index: this.props.index })
    }
  }

  changeState = canSelectable => {
    this.setState({ selectable: canSelectable })
    this.props.onRefresh()
  }
  getIconType = item => {
    let layerIcon
    if (
      this.props.toHeightItem.index === this.props.index &&
      this.props.toHeightItem.itemName === item.name
    ) {
      layerIcon = getThemeAssets().layer3dType.layer3d_normal_selected
      if (item.name === 'TianDiTu' || item.name === 'BingMap') {
        layerIcon = require('../../assets/mapToolbar/Frenchgrey/icon_layer_selected.png')
        return layerIcon
      }
      if (item.name === 'NodeAnimation') {
        layerIcon = require('../../assets/Mine/mine_my_plot_white.png')
        return layerIcon
      }
      switch (item.type) {
        //todo  3维图层组类型是否是layerGroup
        case 'IMAGEFILE':
          layerIcon = getThemeAssets().layer3dType.layer3d_image_selected
          return layerIcon
        case 'KML':
          layerIcon = getThemeAssets().layer3dType.layer_kml_selected
          return layerIcon
        case 'Terrain':
          layerIcon = getThemeAssets().layer3dType.layer3d_terrain_layer_selected
          return layerIcon
        case 'layerGroup':
          layerIcon = getThemeAssets().layerType.layer_group_selected
          return layerIcon
      }
    } else {
      layerIcon = getThemeAssets().layer3dType.layer3d_normal
      if (item.name === 'TianDiTu' || item.name === 'BingMap') {
        layerIcon = require('../../assets/Mine/my_basemap.png')
        return layerIcon
      }
      if (item.name === 'NodeAnimation') {
        layerIcon = require('../../assets/Mine/mine_my_plot.png')
        return layerIcon
      }
      switch (item.type) {
        case 'IMAGEFILE':
          layerIcon = getThemeAssets().layer3dType.layer3d_image
          return layerIcon
        case 'KML':
          layerIcon = getThemeAssets().layer3dType.layer_kml
          return layerIcon
        case 'Terrain':
          layerIcon = getThemeAssets().layer3dType.layer3d_terrain_layer
          return layerIcon
        case 'layerGroup':
          layerIcon = getThemeAssets().layerType.layer_group
          break
      }
    }
    return layerIcon
  }
  render() {
    let visibleImg, textColor, moreImg
    if (
      this.props.toHeightItem.index === this.props.index &&
      this.props.toHeightItem.itemName === this.props.item.name
    ) {
      textColor = { color: color.bgW }
      visibleImg = this.state.visible
        ? getPublicAssets().common.icon_disable_select
        : getPublicAssets().common.icon_disable_none
      moreImg = getThemeAssets().publicAssets.icon_move_selected
    } else {
      visibleImg = this.state.visible
        ? getPublicAssets().common.icon_select
        : getPublicAssets().common.icon_none
      textColor = { color: color.fontColorBlack }
      moreImg = getThemeAssets().publicAssets.icon_move
    }
    let typeImg = this.getIconType(this.props.item)
    // console.log(this.state.visible, this.state.selectable)
    // console.log(selectImg, visibleImg)
    return (
      <TouchableOpacity
        style={[styles.itemBtn, this.props.style]}
        onPress={this._onPress}
      >
        <View style={styles.row}>
          <TouchableOpacity style={styles.btn} onPress={this.changeVisible}>
            <Image source={visibleImg} style={styles.visibleImg} />
          </TouchableOpacity>

          <Image source={typeImg} style={styles.type} />
          <View style={{ flex: 1, marginLeft: scaleSize(30) }}>
            <Text style={[styles.itemName, textColor]}>
              {this.props.item.name}
            </Text>
          </View>
          <TouchableOpacity style={styles.moreView} onPress={this.more}>
            <Image source={moreImg} style={styles.moreImg} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    )
  }
}
