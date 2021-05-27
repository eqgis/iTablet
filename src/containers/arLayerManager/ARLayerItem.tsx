import React from 'react'
import { StyleSheet, Image, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native'
import { scaleSize, setSpText } from '../../utils'
import { color, size } from '../../styles'
import { getARLayerAssets, getPublicAssets, getThemeAssets } from '../../assets'
import { SARMap, ARLayer } from 'imobile_for_reactnative'

const styles = StyleSheet.create({
  rowOne: {
    height: scaleSize(98),
    paddingHorizontal: scaleSize(20),
    flexDirection: 'row',
    alignItems: 'center',
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
    height: scaleSize(44),
    width: scaleSize(44),
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
}

interface ItemState {
  visible: boolean
}

export default class LayerItem extends React.Component<ItemProps, ItemState> {
  constructor(props: ItemProps) {
    super(props)

    this.state = {
      visible: this.props.layer.isVisible,
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

  render() {
    const typeIcon = getARLayerAssets(this.props.layer.type)
    const visibleIcon = this.props.layer.isVisible
      ? getPublicAssets().common.icon_select
      : getPublicAssets().common.icon_none
    const isCurrentLayer = this.props.currentLayer?.name === this.props.layer.name
    let ItemStyle: ViewStyle = {}, textStyle: TextStyle = {}, moreImg: any
    if(isCurrentLayer) {
      ItemStyle = {
        backgroundColor: color.item_selected_bg,
      }
      textStyle = {
        color:  color.white,
      }
      moreImg = getThemeAssets().publicAssets.icon_move_selected
    } else {
      moreImg = getThemeAssets().publicAssets.icon_move
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
      </>
    )
  }
}