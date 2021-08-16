import React from 'react'
import { Image, View, TouchableOpacity } from 'react-native'
import { DEVICE } from '../../../src/redux/models/device'
import ToolBarSectionList from '../workspace/components/ToolBar/components/ToolBarSectionList'
import { SARMap } from 'imobile_for_reactnative'
import { ARLayer } from 'imobile_for_reactnative/types/interface/ar'
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
  layer: ARLayer
}

interface State {
  selectable: boolean
}

class ARLayerMenu extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      selectable: 'isSelectable' in this.props.layer ? this.props.layer.isSelectable : false,
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
          height: dp(40),
        }}>
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
        </View>
      )
    }
    return null
  }

  render() {
    return(
      <>
        {this.renderHeader()}

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