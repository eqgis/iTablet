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
  data: ToolBarSlideOption,
}

class ToolBarSlide extends React.Component<Props> {

  constructor(props: Props) {
    super(props)
  }

  shouldComponentUpdate(nextProps: Props) {
    return (
      JSON.stringify(nextProps) !== JSON.stringify(this.props)
    )
  }

  renderItem = (item: ToolBarSlideItem, index: number) => {
    return (
      <View style={styles.slideItem}>
        <View style={styles.slideSide}>
          {item.leftText && <Text style={styles.slideText}>{item.leftText}</Text>}
          {item.leftImage && <Image style={styles.slideImg} source={item.leftImage} />}
        </View>
        <SlideItem
          key={index}
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
    for(let i = 0; i < this.props.data.data.length; i++) {
      items.push(this.renderItem(this.props.data.data[i], i))
    }
    return items
  }

  render() {
    return(
      <View
        style={styles.container}
      >
        {this.props.data.title && (
          <Text style={styles.title}>
            {this.props.data.title }
          </Text>
        )}
        <View style={styles.items}>
          {this.renderItems()}
        </View>
      </View>
    )
  }
}

interface ItemProps {
  item: ToolBarSlideItem
}

interface ItemState {
  currentValue: number
}

class SlideItem extends React.Component<ItemProps, ItemState> {
  dimensions = Dimensions.get('screen')

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
          style={{
            width: this.dimensions.width - scaleSize(160),
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
            width: scaleSize(100),
            paddingRight: scaleSize(20),
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
    paddingTop: scaleSize(20),
    borderTopLeftRadius: scaleSize(40),
    borderTopRightRadius: scaleSize(40),
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
  },
  items: {
    marginTop: scaleSize(10),
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  slideItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: scaleSize(10),
  },
  slideSide: {
    width: scaleSize(40),
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