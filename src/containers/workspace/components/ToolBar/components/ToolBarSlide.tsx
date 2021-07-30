import React from 'react'
import { Text, View, Dimensions, StyleSheet, Image } from 'react-native'
import { color, size } from '../../../../../styles'
import { SlideBar } from '../../../../../components'
import { scaleSize } from '../../../../../utils'

export interface ToolBarSlideOption {
  title?: string,
  data: ToolBarSlideItem[],
}

export interface ToolBarSlideItem {
  key: string,
  title: string,
  unit?: string,
  defaultValue: number,
  onMove: (value: number) => void,
  range?: number[],
  leftText?: string,
  leftImage?: any,
  rightText?: string,
  rightImage?: any,
}

interface Props {
  data: ToolBarSlideOption[],
}

class ToolBarSlide extends React.Component<Props> {
  dimensions = Dimensions.get('screen')
  sliderBars: Map<string, SlideItem> | null | undefined

  static defaultProps = {
    data: [],
  }

  constructor(props: Props) {
    super(props)
    this.sliderBars = new Map<string, SlideItem>()
  }

  shouldComponentUpdate(nextProps: Props) {
    return (
      JSON.stringify(nextProps) !== JSON.stringify(this.props)
    )
  }

  componentWillUnmount() {
    if (this.sliderBars && this.sliderBars.size > 0) {
      this.sliderBars.clear()
      this.sliderBars = null
    }
  }

  reset = () => {
    if (this.sliderBars?.size) {
      this.sliderBars.forEach(itemRef => {
        itemRef?.reset()
      })
    }
  }

  renderItem = (item: ToolBarSlideItem) => {
    let itemsWidth = (item.leftText ? styles.slideText.width : 0)
      + (item.leftImage ? styles.slideText.width : 0)
      + (item.rightText ? styles.slideText.width : 0)
      + (item.rightImage ? styles.slideText.width : 0)
      + scaleSize(15) * 4 // slideSide marginHorizontal
      + scaleSize(90)     // SlideItem right text
    return (
      <View style={styles.slideItem}>
        <View style={styles.slideSide}>
          {item.leftText && <Text style={styles.slideText}>{item.leftText}</Text>}
          {item.leftImage && <Image style={styles.slideImg} source={item.leftImage} />}
        </View>
        <SlideItem
          ref={ref => ref && this.sliderBars?.set(item.key, ref)}
          width={this.dimensions.width - itemsWidth}
          key={item.key}
          item={item}
        />
        {
          (item.rightText || item.rightImage) &&
          <View style={styles.slideSide}>
            {item.rightText && <Text style={styles.slideText}>{item.rightText}</Text>}
            {item.rightImage && <Image style={styles.slideImg} source={item.rightImage} />}
          </View>
        }
      </View>
    )
  }

  // eslint-disable-next-line no-undef
  renderItems = (): JSX.Element[] => {
    const items = []
    for(let item of this.props.data) {
      item.title && items.push(
        <Text style={styles.title}>
          {item.title}
        </Text>
      )
      for (let dataItem of item.data) {
        items.push(this.renderItem(dataItem))
      }
    }
    return items
  }

  render() {
    return(
      <View style={styles.container}>
        {this.renderItems()}
      </View>
    )
  }
}

interface ItemProps {
  item: ToolBarSlideItem,
  width: number,
}

interface ItemState {
  currentValue: number
}

class SlideItem extends React.Component<ItemProps, ItemState> {

  sliderBar: SlideBar | null | undefined

  constructor(props: ItemProps) {
    super(props)

    this.state = {
      currentValue: this.props.item.defaultValue,
    }
  }

  shouldComponentUpdate(nextProps:ItemProps, nextState: ItemState) {
    return (
      JSON.stringify(nextState) !== JSON.stringify(this.state) ||
      JSON.stringify(nextProps) !== JSON.stringify(this.props)
    )
  }

  componentDidUpdate(prevProps: ItemProps) {
    if (
      JSON.stringify(prevProps.item.range) !== JSON.stringify(this.props.item.range) ||
      prevProps.item.defaultValue !== this.props.item.defaultValue
    ) {
      this.setState({
        currentValue: this.props.item.defaultValue,
      })
    }
  }

  reset = () => {
    this.setState({
      currentValue: this.props.item.defaultValue,
    }, () => {
      this.sliderBar?.reset()
    })
  }

  render() {
    return (
      <View style={{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
      }}>
        {/* <Text
          numberOfLines={1}
          style={{
            width: scaleSize(60),
            textAlign: 'center',
            fontSize: size.fontSize.fontSizeSm,
          }}
        >
          {this.props.item.title}
        </Text> */}
        <SlideBar
          ref={ref => this.sliderBar = ref}
          key={this.props.item.key}
          style={{
            width: this.props.width,
          }}
          onMove={loc => {
            this.props.item.onMove(loc)
            this.setState({
              currentValue: loc,
            })
          }}
          range={this.props.item.range}
          // defaultValue={this.props.item.defaultValue}
          defaultValue={this.state.currentValue}
        />
        <Text
          numberOfLines={1}
          style={{
            width: scaleSize(80),
            // paddingRight: scaleSize(10),
            textAlign: 'right',
            fontSize: size.fontSize.fontSizeSm,
          }}
        >
          {this.state.currentValue +( this.props.item.unit || '')}
        </Text>
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
  title: {
    textAlign: 'center',
  },
  slideItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: scaleSize(10),
  },
  slideSide: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: scaleSize(15),
  },
  slideText: {
    textAlign: 'center',
    fontSize: size.fontSize.fontSizeMd,
    width: scaleSize(40),
  },
  rightSlideText: {
    textAlign: 'center',
    fontSize: size.fontSize.fontSizeMd,
    width: scaleSize(80),
  },
  slideImg: {
    width: scaleSize(40),
    height: scaleSize(40),
  },
})

export default ToolBarSlide