import { getImage } from '../../../assets'
import React from 'react'
import { Animated, Image, ImageSourcePropType, ScaledSize, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Swiper from 'react-native-swiper'
import { AppStyle, AppToolBar, dp } from '@/utils'
import { Easing } from 'react-native'

interface Props {
  windowSize: ScaledSize
}

interface State {
  currentIndex: number
}

interface Item {
  image: ImageSourcePropType
  title: string
  desc: string
  action: () => void
}

class Home extends React.Component<Props, State> {

  scales: [
    Animated.Value,
    Animated.Value,
    Animated.Value
  ] = [
      new Animated.Value(1),
      new Animated.Value(1),
      new Animated.Value(1)
    ]

  constructor(props: Props) {
    super(props)

    this.state = {
      currentIndex: 1
    }
  }

  scale = (current: number) => {
    this.scales.map((scale, index) => {
      Animated.timing(scale, {
        toValue: current === index ? 2: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: false,
      }).start()
    })
  }

  getItems = (): Item[]  => {
    return [
      {
        image: getImage().ar_przt,
        title: 'AR展示',
        desc: '实景窗口投放虚拟内容，与投放内容进行互动',
        action: () => {
          AppToolBar.show('EXHIBITION', 'EXHIBITION_PRESENTATION')
        }
      },
      {
        image: getImage().ar_infra,
        title: 'AR隐蔽设施',
        desc: '查看地下、墙面、屋顶等隐蔽管线',
        action: () => {

        }
      },
      {
        image: getImage().ar_scan,
        title: 'AR识别',
        desc: 'AR扫一扫，图片内容增强显示',
        action: () => {
          AppToolBar.show('EXHIBITION', 'EXHIBITION_SCAN')
        }
      },
    ]
  }

  renderItem = (item: Item, index: number) => {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        {this.renderLItem(item, index)}
      </View>

    )
  }

  renderLItem = (item: Item, index: number) => {
    // const isSelected = this.state.currentIndex === index
    // const awidth = this.scales[index].interpolate({
    //   inputRange: [1, 2],
    //   outputRange: [dp(151), dp(151) * 1.2]
    // })
    // const aheight = this.scales[index].interpolate({
    //   inputRange: [1, 2],
    //   outputRange: [dp(210), dp(210) * 1.2]
    // })
    return (
      <Animated.View
        style={{
          width: dp(151), // (this.isPortrait || !isSelected) ? dp(151) : awidth,
          height: dp(210), // (this.isPortrait || !isSelected) ? dp(210) : aheight,
          marginHorizontal: dp(13),
          alignItems: 'center',
        }}
      >

        <TouchableOpacity
          style={{
            width: dp(151),
            height: dp(210),
            // marginHorizontal: dp(13),
            alignItems: 'center',
          }}
          activeOpacity={0.9}
          onPress={() => {
            // this.scale(index)
            this.setState({
              currentIndex: index
            })
          }}
          disabled={true /**this.isPortrait */}
        >
          <Image
            style={{position: 'absolute', width: '100%', height: '100%'}}
            source={getImage().background_transparent}
            resizeMode="stretch"
          />
          <Image
            source={item.image}
            style={{width: dp(110),height: dp(110)}}
          />
          <View style={{marginHorizontal: dp(8)}}>
            <Text style={AppStyle.h2}>
              {item.title}
            </Text>
            <Text style={[AppStyle.h3, {color: '#191919'}]}>
              {item.desc}
            </Text>
            <TouchableOpacity
              style={{
                alignSelf: 'flex-end',
                width: dp(70),
                height: dp(30),
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: dp(20),
                overflow: 'hidden',
                marginTop: dp(5),
              }}
              onPress={item.action}
            >
              <Image
                style={{position: 'absolute', width: '100%', height: '100%'}}
                source={getImage().background_red}
                resizeMode="stretch"
              />
              <Text style={[AppStyle.h3, {color: 'white'}]}>
                {'进入'}
              </Text>
            </TouchableOpacity>

          </View>
        </TouchableOpacity>

      </Animated.View>
    )
  }

  renderSwiper = () => {
    return (
      <Swiper
        showsPagination
        dotColor='white'
        activeDotColor='red'
        paginationStyle={{bottom: 100}}
        loop={false}
      >
        {this.getItems().map((item, index) => {
          return this.renderItem(item, index)
        })}
      </Swiper>
    )
  }

  renderStatic = () => {
    return (
      <View>
        <View style={{flexDirection: 'row', alignSelf: 'center'}}>
          {this.getItems().map((item, index) => {
            return this.renderLItem(item, index)
          })}
        </View>
      </View>
    )
  }


  isPortrait = this.props.windowSize.height > this.props.windowSize.width
  render() {
    this.isPortrait = this.props.windowSize.height > this.props.windowSize.width
    return(
      <View
        style={[StyleSheet.absoluteFill, {backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'center'}]}
      >
        {this.isPortrait ? this.renderSwiper() : this.renderStatic()}
      </View>
    )
  }
}

export default Home