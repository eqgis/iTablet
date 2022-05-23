import React from 'react'
import { StyleSheet, Image, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native'
import { scaleSize, setSpText } from '../../utils'
import { color, size } from '../../styles'
import { getARLayerAssets, getPublicAssets, getThemeAssets, getARLayerAssetsGray } from '../../assets'
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
  getARLayers: () => Promise<ARLayer[]>,
  type: string | undefined,
}

interface ItemState {
  visible: boolean,
  showChildGroup: boolean,
}

export default class LayerItem extends React.Component<ItemProps, ItemState> {
  isFilter = true
  constructor(props: ItemProps) {
    super(props)

    this.state = {
      visible: this.props.layer.isVisible,
      showChildGroup: false,
    }
  }


  /** 图层判断 */
  FilterGray(){
    // 图层类型分类数组
    const allTypes = [
      [ARLayerType.AR_MEDIA_LAYER], // poi 0 [105]
      [ARLayerType.AR_TEXT_LAYER, ARLayerType.AR_POINT_LAYER, ARLayerType.AR_LINE_LAYER, ARLayerType.AR_REGION_LAYER], // 矢量 1  [101, 100, 301, 302]
      [ARLayerType.AR3D_LAYER, ARLayerType.AR_SCENE_LAYER], // 三维 2  [3, 4]
      [ARLayerType.AR_MODEL_LAYER], // 模型 3  [106]
      [ARLayerType.EFFECT_LAYER], // 特效 4  [2]
      // [ARLayerType.AR_WIDGET_LAYER], // 小组件 5 [107]
    ]

    // 判断当前项是否可以被设置为当前图层
    if(this.props.type){
      // 当类型为有值的情况下，一定是一个数字的字符串
      const typeIndex = parseInt(this.props.type)
      let isFilter = false
      // 判断该图层的类型是否属于要过滤的类型 false表示不能设置为当前图层的 true表示可以设置为当前图层的
      allTypes[typeIndex].map(item => {
        if(item === this.props.layer.type) {
          isFilter = true
        }
      } )
      this.isFilter = isFilter
    }
  }

  setVisible = () => {
    const layer = this.props.layer
    SARMap.setLayerVisible(this.props.layer.name, !layer.isVisible)
    layer.isVisible = !layer.isVisible
    this.setState({
      visible: !layer.isVisible,
    })
    this.props.getARLayers()
  }

  _renderSubLayers = () => {
    if(!("ar3DLayers" in this.props.layer)) return null
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
        getARLayers={this.props.getARLayers}
      />
    )
  }

  render() {
    let typeIcon = getARLayerAssets(this.props.layer.type)
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

    this.FilterGray()
    if(!this.isFilter) {
      textStyle = {
        color: color.gray,
      }
      // 重新获取浅色图标
      typeIcon = getARLayerAssetsGray(this.props.layer.type)
      moreImg = getThemeAssets().publicAssets.icon_move_gray
    }

    return (
      <>
        <TouchableOpacity
          onPress={() => {
            // 当能够改为当前图层时，点击才生效
            if(this.isFilter){
              this.props.onPress(this.props.layer)
            }
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
              // 当能够改为当前图层时，点击才生效
              if(this.isFilter){
                this.setState({
                  showChildGroup: !this.state.showChildGroup,
                })
              }
            }}>
              <Image
                style={[styles.arrowImg, {marginHorizontal: scaleSize(8)}]}
                source={arrowImg}
              />
            </TouchableOpacity>
            }
            <TouchableOpacity
              style={styles.btn}
              // onPress={this.setVisible}
              onPress={() => {
                // 当能够改为当前图层时，点击才生效
                if(this.isFilter) {
                  this.setVisible()
                }
              }}
            >
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
              // 当能够改为当前图层时，点击才生效
              if(this.isFilter) {
                this.props.onPressMore(this.props.layer)
              }
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