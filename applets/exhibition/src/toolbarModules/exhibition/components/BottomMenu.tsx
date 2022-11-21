import { dp } from "imobile_for_reactnative/utils/size"
import React, { Component } from "react"
import { ImageSourcePropType, ScrollView, View, ViewStyle, TouchableOpacity, Text, Image, ImageStyle, Dimensions} from "react-native"
import FillAnimationWrap from "./FillAnimationWrap"

export interface itemConmonType {
  /** 唯一标识 如果传参的话，需要与props选择的类型保持一致，默认是number类型 */
  key?: string | number,
  /** 显示的文字 */
  name: string,
	/** 显示的图片资源 */
  image: ImageSourcePropType,
  /** 子项点击的回调 */
  action?: () => void,
}

interface CallBackInfo {
  /** 当前选中索引 当keyType有值时，此值永远为-1，无效 */
  index: number
  /** 是否是重复点击 */
  isRepeatclick: boolean
}

interface Props<T> {
	/** 选string则itemConmonType用string类型的key,选number则itemConmonType用number类型的key,当不传该值时，表示子项里没有key，选中状态由索引决定 */
	keyType?: "string" | "number"
	/** 最外层的容器的样式 */
	containerStyle?: ViewStyle
	/** 单个选项的样式 */
	itemStyle?: ViewStyle
  imageStyle?: ImageStyle & ViewStyle
	/** 渲染界面的数据数组 */
	data: Array<T>
	/** 重复点击是否取消当前选择项 */
	isRepeatClickCancelSelected?: boolean
	/** 当前选中索引，当keyType存在时，无效，与currentKey不同时存在  */
	currentIndex?: number
	/** 当前选中项的key，当keyType存在时，有效，与currentIndex不同时存在  */
	currentKey?: string | number
  /** 外部传入的统一回调方法  参数一：当前选择项 参数二：其他信息 */
  onSelect?: (item: T, callBackInfo: CallBackInfo) => void
  visible: boolean
  onHide?: () => void
}

interface State<T> {
	data: Array<T>
	selectIndex: number
	selectKey: string | number
  // showRollingMode: boolean
}

class BottomMenu<T extends itemConmonType> extends Component<Props<T>, State<T>> {
  constructor(props: Props<T>) {
    super(props)
    this.state = {
      data: this.props.data || [],
      selectIndex: this.props.currentIndex || -1,
      selectKey: this.props.currentKey || (this.props.keyType === "string" ? "null" : -1),
      // showRollingMode: true,
    }
  }

  componentDidUpdate(prevProps: Readonly<Props<T>>, prevState: Readonly<State<T>>): void {
    const newState: State<T> = Object.assign({}, this.state)
    if (
      JSON.stringify(prevState.data) !== JSON.stringify(this.props.data) &&
      JSON.stringify(this.state.data) !== JSON.stringify(this.props.data)
    ) {
      newState.data = this.props.data
      newState.selectIndex = -1
      newState.selectKey = this.props.currentKey || (this.props.keyType === "string" ? "null" : -1)
    }
    if (this.state.selectKey !== this.props.currentKey && prevState.selectKey !== this.props.currentKey) {
      newState.selectKey = this.props.currentKey || (this.props.keyType === "string" ? "null" : -1)
    }
    if (JSON.stringify(newState) !== JSON.stringify(this.state)) {
      this.setState({
        ...newState,
      })
    }
  }

  /** 暴露给外部的显影接口 */
  // setVisible = (visible: boolean) => {
  //   this.setState({
  //     showRollingMode: visible,
  //   })
  // }

  /** 单个选项的点击事件 */
  itemOnpress = (item: T, index: number) => {
    // 是否重复点击了同一选项
    let isRepeatclick = false
    if(this.state.selectIndex === index || this.state.selectKey === item.key) {
      isRepeatclick = true
      // 重复点击，取消当前选择
      if(this.props.isRepeatClickCancelSelected) {
        this.setState({
          selectIndex: -1,
          selectKey: this.props.keyType === "string" ? "null" : -1,
        })
      }
    } else {
      if(this.props.keyType) {
        let keyTemp = this.props.keyType === "string" ? "null" : -1
        // 当keyType为数字时，解决为0时被误判的问题
        if(item.key !== undefined && item.key + ""){
          keyTemp = item.key
        }

        this.setState({
          selectKey: keyTemp,
        })
      } else {
        this.setState({
          selectIndex: index,
        })
      }

    }

    this.props?.onSelect?.(item, {index, isRepeatclick})
    item?.action?.()
    // item?.action?.(item, isRepeatclick)
  }

  /** 具体的选项 */
  renderItem = (item: T, index: number) => {
    return (
      <TouchableOpacity
        key={index + '_'}
        style={[
          {
            width: dp(100),
            height: dp(100),
            marginHorizontal: dp(5),
            backgroundColor: 'rgba(0, 0, 0, .5)',
            borderRadius: dp(8),
            overflow: 'hidden',
            // opacity: 0.9,
            justifyContent: 'flex-start',
            alignItems: 'center',
            position:'relative',
          },
          this.props?.itemStyle,
        ]}
        onPress={() => {
          this.itemOnpress(item, index)
        }}
      >
        <Image
          source={item.image}
          style={[
            {width: dp(60), height: dp(60),marginTop: dp(10)},
            this.props?.imageStyle,
          ]}
        />
        <View style={[
          {backgroundColor: '#000', width: '100%', height: dp(20), justifyContent: 'center', alignItems: 'center', position:'absolute', bottom: dp(0),left:0},
          (this.state.selectIndex === index || this.state.selectKey === item.key) && {
            backgroundColor:"#f24f02",
          },
        ]} >
          <Text style={[
            {fontSize:dp(12), color: '#fff'},
          ]}>{item.name}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  render() {
    const windowWidth = Dimensions.get("window").width
    let left = 0
    let right = 0
    if(this.state.data.length * dp(100) >= windowWidth - dp(40)) {
      left = dp(20)
      right = dp(20)
    }
    return(
      <FillAnimationWrap
        visible={this.props.visible}
        animated={'bottom'}
        style={{
          position: 'absolute',
          alignSelf: 'center',
        }}
        range={[-dp(150), -dp(5)]}
        onHide={() => {
          // this.setState({showRollingMode: false})
          this.props?.onHide?.()
        }}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={[{marginLeft: left, flex: 1,marginRight: right}]}
          contentContainerStyle= {[{height: dp(120), alignItems: 'center'}]}
        >
          {
            this.state.data.map((item, index) => {
              return this.renderItem(item, index)
            })
          }
        </ScrollView>

      </FillAnimationWrap>
    )
    // return (
    //   <View
    //     style={[
    //       this.props.containerStyle || {
    //         position: 'absolute',
    //         bottom: dp(0),
    //         left: 0,
    //         justifyContent: 'center',
    //         alignItems: 'center',
    //         width: '100%',
    //       },
    //     ]}
    //   >
    //     <ScrollView
    //       horizontal
    //       showsHorizontalScrollIndicator={false}
    //       style={[{maxWidth: dp(600)}]}
    //       contentContainerStyle= {[{height: dp(120), alignItems: 'center'}]}
    //     >
    //       {
    //         this.state.data.map((item, index) => {
    //           return this.renderItem(item, index)
    //         })
    //       }
    //     </ScrollView>
    //   </View>
    // )
  }
}

export default BottomMenu