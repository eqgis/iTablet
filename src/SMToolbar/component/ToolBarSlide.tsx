import React from 'react'
import { ScaledSize, View } from 'react-native'
import { Text } from 'react-native'
import Slider, {Props as ToolBarSlideItem }  from '../../components/Slider'
import { dp } from '../../utils'
import ToolbarSlideCard from './ToolbarSlideCard'

export { ToolBarSlideItem }

export interface ToolBarSlideOption {
  title?: string
  data: ToolBarSlideItem[]
}

interface Props {
  data: ToolBarSlideOption
  toolbarVisible: boolean
  windowSize: ScaledSize
}

class ToolBarSlide extends React.Component<Props> {

  constructor(props: Props) {
    super(props)
  }

  isVisible = (): boolean => {
    return this.props.toolbarVisible && this.props.data.data.length > 0
  }

  renderItem = (item: ToolBarSlideItem, index: number) => {
    return (
      <Slider
        key={index}
        showManulController={true}
        right={{type: 'indicator'}}
        horizontal={this.isPortrait}
        {...item}
      />
    )
  }

  renderItems = (): JSX.Element[] => {
    const items = []
    for(let i = 0; i < this.props.data.data.length; i++) {
      items.push(this.renderItem(this.props.data.data[i], i))
    }
    return items
  }

  isPortrait = true
  render() {
    this.isPortrait = this.props.windowSize.height > this.props.windowSize.width
    return(
      <ToolbarSlideCard
        visible={this.isVisible()}
        contentContainerStyle={!this.isPortrait && {width: undefined}}
      >
        {this.props.data.title && (
          <Text style={{textAlign: 'center'}}>
            {this.props.data.title }
          </Text>
        )}
        <View style={!this.isPortrait && {flexDirection: 'row', flex: 1, paddingLeft: dp(10)}}>
          {this.renderItems()}
        </View>
      </ToolbarSlideCard>
    )
  }
}

export default ToolBarSlide