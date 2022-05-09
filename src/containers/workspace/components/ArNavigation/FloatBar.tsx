import React from 'react'
// import { ImageStyle } from 'react-native'
import { TextStyle, Image, Text, TouchableOpacity, View, ViewStyle,ImageStyle } from 'react-native'
import { scaleSize } from '../../../../../src/utils'

export interface FloatItem {
  /** 显示名 */
  title?: string
  /** 识别key */
  key: string
  /** 图片 */
  image: any
  /** 点击事件 */
  action: () => void
}

type Props = {
  style?: ViewStyle
  textStyle?: TextStyle
  imageStyle?: ImageStyle
  data: FloatItem[]
}  & Partial<typeof defaultProps>


const defaultProps = {
  /** 多个 item 间是否显示分割线 */
  showSeperator: true
}
/** 浮在首页的各种工具栏 */
const FloatBar = class extends React.Component<Props & typeof defaultProps>{
  static defaultProps = defaultProps

  constructor(props: Props & typeof defaultProps) {
    super(props)
  }

  renderSeperator = () => {
    return (
      <View style={{
        width: '100%',
        height: scaleSize(1),
        backgroundColor: '#ECECEC',
        marginVertical: scaleSize(6),
      }}/>
    )
  }

  renderItem = (item: FloatItem, isLast: boolean) => {
    return (
      <View  key={item.key}>
        <TouchableOpacity
          style={{
            margin: scaleSize(3),
            alignItems: 'center'
          }}
          onPress={() => item.action()}
        >
          <Image
            style={[
              {width: scaleSize(30), height: scaleSize(30)},
              this.props.imageStyle
            ]}
            source={item.image}
          />
          {item.title && (
            <Text style={[{fontSize: scaleSize(10),textAlign: 'center',}, this.props.textStyle]}>
              {item.title}
            </Text>
          )}
        </TouchableOpacity>
        {this.props.showSeperator && !isLast && this.renderSeperator()}
      </View>
    )
  }

  renderItems = () => {
    const renderItems = []
    for(let i = 0; i < this.props.data.length; i++) {
      const isLast = i === this.props.data.length - 1
      renderItems.push(this.renderItem(this.props.data[i], isLast))
    }
    return renderItems
  }

  render() {
    return (
      <View style={[
        {
          alignItems: 'center',
          backgroundColor:'#FAFAFA',
          padding: scaleSize(5),
          borderRadius: scaleSize(15),
        },
        {
          elevation: 3,
          shadowOffset: { width: 0, height: 0 },
          shadowColor: '#eee',
          shadowOpacity: 1,
          shadowRadius: 2,
        },
        this.props.style
      ]}>
        {this.renderItems()}
      </View>
    )
  }
} as React.ComponentClass<Props>

export default FloatBar