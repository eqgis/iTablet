import React from 'react'
import { Text, View, Dimensions, StyleSheet } from 'react-native'
import { color } from '../../../../../styles'
import { ToolBarSlideItem } from 'imobile_for_reactnative/components/ToolbarKit/component/ToolBarSlide'
import { Slider } from 'imobile_for_reactnative/components'
import { getImage } from '@/assets'

export interface ToolBarSlideOption {
  title?: string,
  data: ToolBarSlideItem[],
}

interface Props {
  data: ToolBarSlideOption,
}

class ToolBarSlide extends React.Component<Props> {
  dimensions = Dimensions.get('screen')
  sliderBars = new Map<number, Slider>()

  static defaultProps = {
    data: [],
  }

  constructor(props: Props) {
    super(props)
  }

  shouldComponentUpdate(nextProps: Props) {
    return (
      JSON.stringify(nextProps) !== JSON.stringify(this.props)
    )
  }

  componentWillUnmount() {
    if (this.sliderBars && this.sliderBars.size > 0) {
      this.sliderBars.clear()
    }
  }

  reset = () => {
    if (this.sliderBars?.size) {
      this.sliderBars.forEach(itemRef => {
        itemRef?.reset()
      })
    }
  }

  renderItem = (item: ToolBarSlideItem, index: number) => {
    return (
      <Slider
        ref={ref => ref && this.sliderBars?.set(index, ref)}
        key={index}
        showManulController={true}
        right={{type: 'indicator'}}
        horizontal={true}
        {...item}
        incrementImage={getImage().icon_enlarge}
        decrementImage={getImage().icon_narrow}
        checkImage={getImage().icon_check}
        uncheckImage={getImage().icon_uncheck}
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

  render() {
    return(
      <View style={styles.container}>
        {this.props.data.title && (
          <Text style={{textAlign: 'center'}}>
            {this.props.data.title }
          </Text>
        )}
        <View style={{width: '100%'}} >
          {this.renderItems()}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default ToolBarSlide