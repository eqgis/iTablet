import { ARElementType, SARMap } from 'imobile_for_reactnative'
import { ModelAnimation } from 'imobile_for_reactnative/NativeModule/interfaces/ar/SARMap'
import { ARElement } from 'imobile_for_reactnative'
import React from 'react'
import { FlatList, ListRenderItemInfo, Text, TouchableOpacity, Animated, Easing } from 'react-native'
import { getImage } from '../../../assets'
import { FloatBar } from '../../../components'
import { AppStyle, dp } from '../../../utils'

interface Props {
    addAnimations: ModelAnimation[]
    arElement: ARElement
}

interface State {
    showAnimationList: boolean,
    selectIndex: number,
}

class AnimationList extends React.Component<Props, State> {

  left = new Animated.Value(-dp(110))

  isShowList = false

  constructor(props: Props) {
    super(props)

    this.state = {
      showAnimationList: false,
      selectIndex: -1,
    }
  }

  componentDidUpdate(prevProps: Props) {
    if(this.props.arElement != prevProps.arElement) {
      this.updateCurrentAnimation(this.state.selectIndex)
    }
  }

  updateCurrentAnimation = async (index: number) => {
    if(this.props.arElement?.type === ARElementType.AR_MODEL) {
      await SARMap.appointEditElement(this.props.arElement.id, this.props.arElement.layerName)
      await SARMap.setModelAnimation(this.props.arElement.layerName, this.props.arElement.id, index)
      SARMap.submit()
    }
  }

  showList = () => {
    const show = !this.isShowList
    Animated.timing(this.left, {
      toValue: show ? 0 : -dp(110),
      duration: 100,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start()
    this.isShowList = show
  }

  _renderAnimationItem = (item: ListRenderItemInfo<ModelAnimation>) => {
    const isSelected = this.state.selectIndex === item.index
    return (
      <TouchableOpacity
        style={{
          height: dp(25),
          justifyContent: 'center',
          backgroundColor: isSelected ? AppStyle.Color.BLUE : undefined
        }}
        onPress={async () => {
          let index = item.index
          if(isSelected) {
            index = -1
          }
          this.updateCurrentAnimation(index)
          this.setState({selectIndex: index})
        }}
      >
        <Text style={{...AppStyle.h2, marginLeft: dp(5)}} numberOfLines={1}>
          {item.item.name}
        </Text>
      </TouchableOpacity>
    )
  }

  render() {
    return(
      <>
        <FloatBar
          style={{
            position: 'absolute',
            top: dp(50),
            left: dp(20),
          }}
          data={[{
            key: 'anime setting',
            image: getImage().list,
            action: () => {
              this.showList()
            }
          }]}
        />
        <Animated.View
          style={[{
            top: dp(120), width: dp(100), maxHeight: dp(200),
            left: this.left,
            backgroundColor: AppStyle.Color.Background_Container,
            paddingVertical: dp(10),
            paddingRight: dp(10),
            borderTopRightRadius: dp(10),
            borderBottomRightRadius: dp(10),
          },
          AppStyle.FloatStyle
          ]}
        >

          <FlatList
            data={this.props.addAnimations}
            renderItem={this._renderAnimationItem}
            keyExtractor={item => item.name}
          />

        </Animated.View>
      </>
    )
  }
}

export default AnimationList