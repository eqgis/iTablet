import { getImage } from '../../../assets'
import React from 'react'
import { NativeModules, Animated, Image, ImageSourcePropType, ScaledSize, StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native'
import Swiper from 'react-native-swiper'
import { AppDialog, AppStyle, AppToolBar, dp ,Toast} from '@/utils'
import { Easing } from 'react-native'
import { SARMap } from 'imobile_for_reactnative'

const AppUtils = NativeModules.AppUtils
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
          // onPress={() => {
          //   // this.scale(index)
          //   this.setState({
          //     currentIndex: index
          //   })
          // }}
          // disabled={true /**this.isPortrait */}
          onPress={item.action}
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
      <View style={{paddingHorizontal: dp(10)}}>
        <ScrollView
          horizontal
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
        {this.isPortrait ? this.renderSwiper() : this.renderStatic()}
      </View>
    )
  }
}

export default Home