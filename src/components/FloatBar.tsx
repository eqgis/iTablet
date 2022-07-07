import React from 'react'
import { ImageRequireSource, ImageStyle } from 'react-native'
import { TextStyle, Image, Text, TouchableOpacity, View, ViewStyle } from 'react-native'
import { dp, AppStyle } from '../utils'

export interface FloatItem {
  /** 显示名 */
  title?: string
  /** 识别key */
  key: string
  /** 图片 */
  image: ImageRequireSource
  /** 点击事件 */
  action: () => void
}

// interface ItemStyle {
//   height?: number | string
//   width?: number | string
// }

type Props = {
  style?: ViewStyle
  textStyle?: TextStyle
  imageStyle?: ImageStyle
  data: FloatItem[]
  itemStyle?: ViewStyle
}  & Partial<DefaultProps>

interface DefaultProps {
   /** 多个 item 间是否显示分割线 */
   showSeperator: boolean

   /** 是否横向排列，默认纵向排列 */
   horizontal: boolean
}

const defaultProps: DefaultProps = {
  showSeperator: true,
  horizontal: false,
}

/** 浮在首页的各种工具栏 */
export default class FloatBar extends React.Component<Props & DefaultProps>{
  static defaultProps = defaultProps

  constructor(props: Props & DefaultProps) {
    super(props)
  }

  renderSeperator = () => {
    return (
      <View style={{
        width: '100%',
        height: dp(1),
        backgroundColor: AppStyle.Color.Seperator,
        marginVertical: dp(6),
      }}/>
    )
  }

  renderItem = (item: FloatItem, isLast: boolean) => {
    return (
      <View  key={item.key}>
        <TouchableOpacity
          style={[{
            alignItems: 'center',
            justifyContent: 'center',
            height: dp(40),
            width: dp(40),
          },
          this.props?.itemStyle,
          this.props.horizontal ? (this.props.data.length > 1 && {
            marginHorizontal: dp(8),
            width: undefined
          }) : (this.props.data.length > 1 && {
            marginVertical: dp(4),
            height: undefined
          })
          ]}
          onPress={() => item.action()}
        >
          <Image
            style={[
              {width: dp(30), height: dp(30)},
              this.props.imageStyle
            ]}
            source={item.image}
          />
          {item.title && (
            <Text style={[{fontSize: dp(10),textAlign: 'center',}, this.props.textStyle]} numberOfLines={2}>
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
          backgroundColor: AppStyle.Color.Background_Toolbar,
          padding: dp(5),
          borderRadius: dp(15),
        },
        AppStyle.FloatStyle,
        this.props.style,
        this.props.horizontal ? {
          flexDirection: 'row'
        } : {
          flexDirection: 'column'
        }
      ]}>
        {this.renderItems()}
      </View>
    )
  }
}