import React from 'react'
import { Image, ImageRequireSource, ScrollView, StyleSheet, Text, ViewStyle } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Animated, { EasingNode as Easing } from 'react-native-reanimated'
import { AppStyle, dp } from '../../utils'


/** 浮动底部工具栏所需数据 */
export interface FloatBottomOption {
  /** 选中数据 */
  index?: number
  data: Array<FloatBottomData>
}

interface FloatBottomData {
  image: ImageRequireSource
  text: string
  onPress: () => void
}

interface Props {
  data: FloatBottomOption
  toolbarVisible: boolean
}

const BarHeight = dp(50)

class ToolBarFloatBar extends React.Component<Props> {
  bottom = new Animated.Value(-BarHeight)

  constructor(props: Props) {
    super(props)
  }

  componentDidUpdate(prevProps: Props) {
    if(prevProps.toolbarVisible !== this.props.toolbarVisible ||
      prevProps.data.data.length !== this.props.data.data.length) {
      this.changePostion()
    }
  }


  changePostion = () => {
    Animated.timing(this.bottom, {
      toValue: this.isVisible() ? dp(20) : -BarHeight,
      duration: 300,
      easing: Easing.linear
    }).start()
  }

  isVisible = (): boolean => {
    return this.props.toolbarVisible && this.props.data.data.length > 0
  }


  renderItem = (data: FloatBottomData, index: number) => {
    const isSelect = this.props.data.index === index
    let selectstyle: ViewStyle = {}
    if(isSelect) {
      selectstyle = {
        backgroundColor: AppStyle.Color.Background_Container,
        marginHorizontal: dp(5),
      }
    }
    return (
      <TouchableOpacity
        key={index.toString()}
        style={[styles.item, selectstyle]}
        onPress={data.onPress}
      >
        <Image
          style={{...AppStyle.Image_Style, marginHorizontal: dp(10)}}
          source={data.image}
        />
        {/* {isSelect && ( */}
        <Text style={{...AppStyle.Text_Style_Small_Center, color: AppStyle.Color.Text_Light}}>
          {data.text}
        </Text>
        {/* )} */}
      </TouchableOpacity>
    )
  }


  renderItems = () => {
    const items: JSX.Element[] = []
    for(let i = 0; i < this.props.data.data.length; i++) {
      items.push(this.renderItem(this.props.data.data[i], i))
    }
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {items}
      </ScrollView>
    )
  }

  render() {
    return(
      <Animated.View
        style={[styles.bottomContainer, { bottom: this.bottom}]}
      >
        {this.renderItems()}
      </Animated.View>
    )
  }
}

export default ToolBarFloatBar

const styles = StyleSheet.create({
  bottomContainer: {
    ...AppStyle.FloatStyle,
    position: 'absolute',
    height: BarHeight,
    maxWidth: '80%',
    justifyContent: 'center',
    backgroundColor: AppStyle.Color.Background_Page,
    alignSelf: 'center',
    borderRadius: BarHeight / 2,
    elevation: 3,
    zIndex: 100,
    overflow: 'hidden',
    paddingHorizontal: dp(10),
  },
  ViewContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    flexDirection: 'column',
    height: dp(45),
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: dp(15),
    borderRadius: 17,
  }
})