import { getImage } from '../../../assets'
import React from 'react'
import { NativeModules, Animated, Image, ImageSourcePropType, ScaledSize, StyleSheet, Text, TouchableOpacity, View, ScrollView, ImageBackground } from 'react-native'
import Swiper from 'react-native-swiper'
import { AppDialog, AppStyle, AppToolBar, dp ,Toast} from '@/utils'
import { Easing } from 'react-native'
import { SARMap } from 'imobile_for_reactnative'

const AppUtils = NativeModules.AppUtils
interface Props {
  windowSize: ScaledSize
}

interface State {
  scales: {
    bgWidth: Animated.Value,
    bgHeight: Animated.Value,
    imgSize: Animated.Value,
    imgBottom: Animated.Value,
  }[],
}

interface Item {
  image: ImageSourcePropType
  title: string
  desc: string
  action: () => void
}

const BG_WIDTH = dp(151)
const BG_HEIGTH = dp(210)
const IMG_SIZE = dp(110)
const IMG_BOTTOM = dp(100)

class Home extends React.Component<Props, State> {

  // scales: [
  //   Animated.Value,
  //   Animated.Value,
  //   Animated.Value
  // ] = [
  //     new Animated.Value(1),
  //     new Animated.Value(1),
  //     new Animated.Value(1)
  //   ]

  lastIndex = -1
  constructor(props: Props) {
    super(props)
    const scales = []
    for (let i = 0; i < this.getItems().length; i++) {
      scales.push({
        bgWidth: new Animated.Value(BG_WIDTH),
        bgHeight: new Animated.Value(BG_HEIGTH),
        imgSize: new Animated.Value(IMG_SIZE),
        imgBottom: new Animated.Value(IMG_BOTTOM),
      })
    }

    this.state = {
      scales: scales,
    }
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    if (
      JSON.stringify(nextProps) !== JSON.stringify(this.props) ||
      JSON.stringify(nextState) !== JSON.stringify(this.state)
    ) {
      return true
    }
    return false
  }

  scale = (current: number) => {
    let animates: Animated.CompositeAnimation[] = []

    if (current !== this.lastIndex && current >= 0) {
      if (this.lastIndex >= 0) {
        // 还原上一个
        animates = animates.concat([
          Animated.timing(this.state.scales[this.lastIndex].bgHeight, {
            toValue: BG_HEIGTH,
            duration: 120,
            easing: Easing.linear,
            useNativeDriver: false,
          }),
          Animated.timing(this.state.scales[this.lastIndex].bgWidth, {
            toValue: BG_WIDTH,
            duration: 120,
            easing: Easing.linear,
            useNativeDriver: false,
          }),
          Animated.timing(this.state.scales[this.lastIndex].imgSize, {
            toValue: IMG_SIZE,
            duration: 120,
            easing: Easing.linear,
            useNativeDriver: false,
          }),
          Animated.timing(this.state.scales[this.lastIndex].imgBottom, {
            toValue: IMG_BOTTOM,
            duration: 120,
            easing: Easing.linear,
            useNativeDriver: false,
          }),
        ])
      }
      // 选中放大动画
      animates = animates.concat([
        Animated.timing(this.state.scales[current].bgHeight, {
          toValue: BG_HEIGTH * 1.1,
          duration: 160,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
        Animated.timing(this.state.scales[current].bgWidth, {
          toValue: BG_WIDTH * 1.1,
          duration: 160,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
        Animated.timing(this.state.scales[current].imgSize, {
          toValue: IMG_SIZE * 1.2,
          duration: 160,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
        // Animated.timing(this.state.scales[current].imgBottom, {
        //   toValue: IMG_BOTTOM * 1.2,
        //   duration: 140,
        //   easing: Easing.linear,
        //   useNativeDriver: false,
        // }),
      ])
      this.lastIndex = current

      // 点击缩小动画
      const animates1 = [
        Animated.timing(this.state.scales[current].bgHeight, {
          toValue: BG_HEIGTH * 0.9,
          duration: 200,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
        Animated.timing(this.state.scales[current].bgWidth, {
          toValue: BG_WIDTH * 0.9,
          duration: 200,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
        Animated.timing(this.state.scales[current].imgSize, {
          toValue: IMG_SIZE * 0.9,
          duration: 200,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
      ]

      // 先缩小,再放大
      const a1 = Animated.parallel(animates1)
      const a2 = Animated.parallel(animates)
      const a3 = Animated.parallel([
        Animated.timing(this.state.scales[current].imgBottom, {
          toValue: IMG_BOTTOM * 1.2,
          duration: 200,
          easing: Easing.linear,
          useNativeDriver: false,
          // delay: 200,
        }),
        // Animated.timing(this.state.scales[current].imgSize, {
        //   toValue: IMG_SIZE * 1.2,
        //   duration: 200,
        //   easing: Easing.linear,
        //   useNativeDriver: false,
        //   delay: 200,
        // }),
      ])
      Animated.sequence([a1, a2, a3]).start()
    }
  }

  getItems = (): Item[]  => {
    return [
      // {
      //   image: getImage().ar_przt,
      //   title: 'AR展示',
      //   desc: '实景窗口投放虚拟内容，与投放内容进行互动',
      //   action: () => {
      //     AppToolBar.show('EXHIBITION', 'EXHIBITION_PRESENTATION')
      //   }
      // },
      // {
      //   image: getImage().ar_infra,
      //   title: 'AR隐蔽设施',
      //   desc: '查看地下、墙面、屋顶等隐蔽管线',
      //   action: () => {
      //     AppToolBar.show('EXHIBITION', 'EXHIBITION_INFRA')
      //   }
      // },
      // {
      //   image: getImage().ar_scan,
      //   title: 'AR识别',
      //   desc: 'AR扫一扫，图片内容增强显示',
      //   action: () => {
      //     AppToolBar.show('EXHIBITION', 'EXHIBITION_SCAN')
      //   }
      // },
      {
        image: getImage().ar_dr_supermap,
        title: 'AR超超博士',
        desc: '虚拟人物互动，一件换装，合影留念',
        action: () => {
          AppToolBar.show('EXHIBITION', 'EXHIBITION_DR_SUPERMAP')
        }
      },
      {
        image: getImage().ar_infra,
        title: 'AR室内管线',
        desc: '地下、墙面、屋顶隐蔽管线浏览',
        action: async() => {
          const hw = await SARMap.isHuawei()
          if(hw){
            Toast.show('暂不支持此功能')
            return
          }
          AppToolBar.show('EXHIBITION', 'EXHIBITION_INFRA')
        }
      },
      {
        image: getImage().ar_supermap_building,
        title: 'AR超图大厦',
        desc: '建筑立体模型浏览、剖切，灯效显示',
        action: () => {
          AppToolBar.show('EXHIBITION', 'EXHIBITION_SUPERMAP_BUILDING')
        }
      },
      {
        image: getImage().ar_3d_map,
        title: 'AR立体地图',
        desc: '立体地图交互浏览，车辆模拟',
        action: () => {
          AppToolBar.show('EXHIBITION', 'EXHIBTION_AR_3D_MAP')
        }
      },
      {
        image: getImage().ar_flat_map,
        title: 'AR平面地图',
        desc: '二维地图浏览、配图、分析、查询',
        action: () => {
          AppToolBar.show('EXHIBITION', 'EXHIBITION_FLAT_MAP')
        }
      }
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
    return (
      <View
        style={{
          width: BG_WIDTH * 1.2,
          // height: this.state.scales[index].bgHeight,
          // marginHorizontal: dp(13),
          alignItems: 'center',
        }}
      >
        <Animated.View
          style={{
            width: this.state.scales[index].bgWidth,
            height: this.state.scales[index].bgHeight,
            marginHorizontal: dp(13),
            alignItems: 'center',
          }}
        >
          <TouchableOpacity
            style={{
              flex: 1,
              alignItems: 'center',
            }}
            activeOpacity={0.9}
            // onPress={() => {
            //   this.scale(index)
            // }}
            onPressIn={() => {
              this.scale(index)
            }}
            // onPressOut={() => {
            //   this.scale(index)
            // }}
            // disabled={true /**this.isPortrait */}
            // onPress={item.action}
          >
            <ImageBackground
              style={{position: 'absolute', width: '100%', height: '100%', justifyContent: 'flex-end'}}
              source={getImage().background_transparent}
              resizeMode="stretch"
            >
              <View style={{marginHorizontal: dp(8), paddingVertical: dp(13)}}>
                <View style={{width: '100%', alignItems: 'center'}}>
                  <View style={{width: dp(140), justifyContent: 'center'}}>
                    <Text style={[AppStyle.h2, {fontWeight: 'bold'}]}>
                      {item.title}
                    </Text>
                    <Text style={[AppStyle.h3, {color: '#191919'}]}>
                      {item.desc}
                    </Text>
                  </View>
                </View>
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
            </ImageBackground>
            <Animated.Image
              source={item.image}
              style={{
                position: 'absolute',
                width: this.state.scales[index].imgSize,
                height: this.state.scales[index].imgSize,
                // top: -20,
                bottom: this.state.scales[index].imgBottom,
              }}
            />
          </TouchableOpacity>
        </Animated.View>
      </View>
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
      <View style={{paddingHorizontal: dp(10)}}>
        <ScrollView
          horizontal
          style={{
            height: BG_HEIGTH * 1.5,
          }}
          contentContainerStyle={{
            paddingTop: dp(40),
            alignItems: 'flex-start',
            // backgroundColor: 'yellow',
          }}
          showsHorizontalScrollIndicator={false}
        >
          {this.getItems().map((item, index) => {
            return this.renderLItem(item, index)
          })}
        </ScrollView>
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
        <TouchableOpacity
          style={{
            position: 'absolute',
            top: dp(25),
            right: dp(20),
          }}
          onPress={() => {
            AppDialog.show({
              text: '是否退出展厅应用？',
              confirm: AppUtils.AppExit
            })
          }}
        >
          <Image
            style={{
              width: dp(50),
              height: dp(50)
            }}
            source={getImage().close}
          />
        </TouchableOpacity>
      </View>
    )
  }
}

export default Home