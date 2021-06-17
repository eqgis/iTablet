import React from 'react'
import { StyleSheet, Image, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native'
import { scaleSize, setSpText } from '../../utils'
import { color, size } from '../../styles'
import { getARLayerAssets, getPublicAssets, getThemeAssets } from '../../assets'
import { SARMap, ARLayerType } from 'imobile_for_reactnative'
import { ARLayer } from 'imobile_for_reactnative/types/interface/ar'
import { ARLayers } from './ARLayerManager'
const styles = StyleSheet.create({
  rowOne: {
    height: scaleSize(98),
    paddingHorizontal: scaleSize(20),
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrowImg: {
    height: size.imageSize.middle,
    width: size.imageSize.middle,
  },
  btn: {
    height: scaleSize(50),
    width: scaleSize(60),
    marginLeft: scaleSize(6),
    marginRight: scaleSize(6),
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn_image: {
    height: size.imageSize.middle,
    width: size.imageSize.middle,
  },
  text: {
    fontSize: setSpText(24),
    color: color.black,
    backgroundColor: 'transparent',
  },
  more_image: {
    height: size.imageSize.middle,
    width: size.imageSize.middle,
  },
})

interface ItemProps {
  layer: ARLayer,
  onPress: (layer: ARLayer) => void,
  onPressMore: (layer: ARLayer) => void,
  currentLayer?: ARLayer,
  setCurrentARLayer: (layer?: ARLayer) => void,
}

interface ItemState {
  visible: boolean,
  showChildGroup: boolean,
}

export default class LayerItem extends React.Component<ItemProps, ItemState> {
  constructor(props: ItemProps) {
    super(props)

    this.state = {
      visible: this.props.layer.isVisible,
      showChildGroup: false,
    }
  }

  setVisible = () => {
    const layer = this.props.layer
    SARMap.setLayerVisible(this.props.layer.name, !layer.isVisible)
    layer.isVisible = !layer.isVisible
    this.setState({
      visible: !layer.isVisible,
    })
  }

  _renderSubLayers = () => {
    if(!this.props.layer.ar3DLayers) return null
    return (
      <ARLayers
        layers={this.props.layer.ar3DLayers}
        currentLayer={this.props.currentLayer}
        setCurrentARLayer={this.props.setCurrentARLayer}
        onPress={layer => {
          this.props.onPress(layer)
        }}
        onPressMore={layer => {
          this.props.onPressMore(layer)
        }}
      />
    )
  }

  render() {
    const typeIcon = getARLayerAssets(this.props.layer.type)
    let visibleIcon
    const isCurrentLayer = this.props.currentLayer?.name === this.props.layer.name
    let ItemStyle: ViewStyle = {}, textStyle: TextStyle = {}, moreImg: any, arrowImg: any

    if(isCurrentLayer) {
      ItemStyle = {
        backgroundColor: color.item_selected_bg,
      }
      textStyle = {
        color:  color.white,
      }
      moreImg = getThemeAssets().publicAssets.icon_move_selected
      visibleIcon = this.props.layer.isVisible
        ? getPublicAssets().common.icon_disable_select
        : getPublicAssets().common.icon_disable_none
      arrowImg = this.state.showChildGroup
        ? getThemeAssets().publicAssets.icon_dropdown_selected
        : getThemeAssets().publicAssets.icon_dropup_selected
    } else {
      moreImg = getThemeAssets().publicAssets.icon_move
      visibleIcon = this.props.layer.isVisible
        ? getPublicAssets().common.icon_select
        : getPublicAssets().common.icon_none
      arrowImg = this.state.showChildGroup
        ? getThemeAssets().publicAssets.icon_drop_down
        : getThemeAssets().publicAssets.icon_drop_up
    }
    return (
      <>
        <TouchableOpacity
          onPress={() => {
            this.props.onPress(this.props.layer)
          }}
          // style={[AppStyle.ListItemStyleNS, {marginLeft: 0, paddingLeft: dp(20)}, ItemStyle]}
          style={[styles.rowOne, ItemStyle]}
        >

          <View style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
            {this.props.layer.type === ARLayerType.AR_SCENE_LAYER &&
            <TouchableOpacity onPress={() => {
              this.setState({
                showChildGroup: !this.state.showChildGroup,
              })
            }}>
              <Image
                style={[styles.arrowImg, {marginHorizontal: scaleSize(8)}]}
                source={arrowImg}
              />
            </TouchableOpacity>
            }
            <TouchableOpacity
              style={styles.btn}
              onPress={this.setVisible}>
              <Image
                resizeMode={'contain'}
                style={styles.btn_image}
                source={visibleIcon}
              />
            </TouchableOpacity>
            <Image
              resizeMode={'contain'}
              style={styles.btn_image}
              source={typeIcon}
            />
            <View style={{flex: 1}}>
              <Text
                numberOfLines={2}
                ellipsizeMode={'tail'}
                style={[styles.text, textStyle]}>
                {this.props.layer.caption}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => {
              this.props.onPressMore(this.props.layer)
            }}
          >
            <Image
              resizeMode={'contain'}
              style={styles.more_image}
              source={moreImg}
            />
          </TouchableOpacity>
        </TouchableOpacity>
        {
          this.state.showChildGroup && this.props.layer.type === ARLayerType.AR_SCENE_LAYER &&
          this._renderSubLayers()
        }
      </>
    )
  }
}