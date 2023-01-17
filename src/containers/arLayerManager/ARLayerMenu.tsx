import React from 'react'
import { Image, View, TouchableOpacity, Text } from 'react-native'
import { DEVICE } from '../../../src/redux/models/device'
import ToolBarSectionList from '../workspace/components/ToolBar/components/ToolBarSectionList'
import { ARLayerType, SARMap } from 'imobile_for_reactnative'
import { ARLayer } from 'imobile_for_reactnative'
import { getThemeAssets } from '../../assets'
import { dp } from '../../utils'

interface SectionItem {
  title: string,
  data: {
    title: string,
    image: any,
    action: () => Promise<void>
  }[]
}

interface Props {
  sections: SectionItem[],
  device: DEVICE,
  renderItem: (item: any) => any,
  layer: ARLayer,
  getLayer: () => Promise<ARLayer[]>,
}

interface State {
  selectable: boolean,
  isVisible: boolean,
  rotationFix: boolean,
}

class ARLayerMenu extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      selectable: 'isSelectable' in this.props.layer ? this.props.layer.isSelectable : false,
      isVisible: this.props.layer.isVisible,
      rotationFix: false,
    }
  }

  componentDidMount = async () => {
    const layer = this.props.layer
    if(layer && layer.name) {
      const style = await SARMap.getLayerStyle(layer.name)
      this.setState({
        rotationFix: style?.rotationFix || false
      })
    }
  }


  renderHeader = () => {
    if('isSelectable' in this.props.layer) {
      const layer = this.props.layer
      return (
        <View style={{
          backgroundColor: 'white',
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          alignItems: 'center',
          height: dp(50),
        }}>
          <TouchableOpacity
            onPress={() => {
              const isVisible = this.state.isVisible
              this.setState({
                isVisible: !isVisible,
              })
              layer.isVisible = !isVisible
              SARMap.setLayerVisible(this.props.layer.name, !isVisible).then(result => {
                if (result && this.props.getLayer && typeof this.props.getLayer === 'function') {
                  this.props.getLayer()
                }
              })
            }}
          >
            <Image
              style={{width: dp(25), height: dp(25)}}
              source={this.state.isVisible ? getThemeAssets().layer.icon_layer_visible : getThemeAssets().layer.icon_layer_unvisible}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              const selectable = this.state.selectable
              this.setState({
                selectable: !selectable,
              })
              layer.isSelectable = !selectable
              SARMap.setLayerSelectable(this.props.layer.name, !selectable)
            }}
          >
            <Image
              style={{width: dp(25), height: dp(25)}}
              source={this.state.selectable ? getThemeAssets().layer.icon_layer_selectable : getThemeAssets().layer.icon_layer_unselectable}
            />
          </TouchableOpacity>

          {/* 是否属性表方向是否固定 */}
          {this.props.layer?.type !== ARLayerType.AR_WIDGET_LAYER && (
            <TouchableOpacity
              onPress={async () => {
                const rotationFix = this.state.rotationFix
                this.setState({
                  rotationFix: !rotationFix,
                })
                await SARMap.setLayerStyle(layer.name, {rotationFix: !rotationFix})
              }}
            >
              <Image
                style={{width: dp(25), height: dp(25)}}
                source={this.state.rotationFix ? getThemeAssets().layer.icon_tool_rotation_fixed : getThemeAssets().layer.icon_tool_face}
              />
            </TouchableOpacity>
          )}


        </View>
      )
    }
    return null
  }

  render() {
    return(
      <>
        {this.renderHeader()}

        {/* 这是一条分割线 */}
        <View style={[{width:'100%', justifyContent:'center', alignItems:'center', backgroundColor: '#fff'}]}>
          <View style={[{
            width: '90%',
            height: dp(1),
            backgroundColor: '#ebedf0',
          }]}></View>
        </View>

        <ToolBarSectionList
          sections={this.props.sections}
          device={this.props.device}
          renderItem={this.props.renderItem}
        />
      </>
    )
  }
}

export default ARLayerMenu