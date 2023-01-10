import { getImage } from '../../../assets'
import React from 'react'
import { NativeModules, Animated, Image, ImageSourcePropType, ScaledSize, StyleSheet, Text, TouchableOpacity, View, ScrollView, ImageBackground, PanResponder, PanResponderInstance, GestureResponderEvent, Platform } from 'react-native'
import Swiper from 'react-native-swiper'
import { AppDialog, AppEvent, AppLog, AppToolBar, dp ,SoundUtil,Toast, AppUser, DataHandler,} from '@/utils'
import { Easing } from 'react-native'
import { SARMap, SExhibition,FileTools } from 'imobile_for_reactnative'
import AnimatedUnit from '../components/AnimatedUnit'
import Sound from 'react-native-sound'
import { setModule, getModule } from '../Actions'
import { getLanguage } from '@/language'
import { ILocalData } from '@/utils/DataHandler/DataLocal'
import { ConstPath } from '@/constants'
import NavigationService from '../../../../../../src/containers/NavigationService'

const AppUtils = NativeModules.AppUtils

interface FlatMap {
  extFolderName: string
  mapName: string
}
const flatMaps: FlatMap[] = [
  {
    extFolderName: '红色足迹',
    mapName: '红色足迹'
  },
  {
    extFolderName: '玛多地震',
    mapName: '玛多地震'
  },
  {
    extFolderName: '台风登陆路径',
    mapName: '台风登陆路径'
  },
]
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
  initialPosition: {
    left: number,
    top: number,
    right: number,
    bottom: number,
  },
  currentIndex: number,
  playBg: boolean,
  showSetting: boolean,
}

interface Item {
  image: ImageSourcePropType
  selectedImage: ImageSourcePropType
  title: string
  desc: string
  action: () => void
}

let BG_WIDTH = dp(151)
let BG_HEIGTH = dp(210)
let IMG_SIZE = dp(110)
let IMG_BOTTOM = dp(100)
const CIRCLE_SIZE = dp(120)

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
  animatedUnit: AnimatedUnit | undefined | null
  _panResponder: PanResponderInstance
  container: View | undefined | null
  containerHeight = 0
  clickSound: Sound | undefined | null

  lastIndex = -1
  constructor(props: Props) {
    super(props)
    const scales = []
    if(global.isPad) {
      IMG_SIZE = dp(186)
      IMG_BOTTOM = dp(64)
      BG_WIDTH = dp(180)
      BG_HEIGTH = dp(250)
    }
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
      initialPosition: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
      },
      currentIndex: getModule(),
      playBg: AppToolBar.getProps().backgroundSoundPlaystate === false ? false : true,
      showSetting: false,
    }

    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => {
        return true
      },
      onMoveShouldSetPanResponder: () => {
        return true
      },
      onPanResponderGrant: () => {
      },
      onPanResponderMove: () => {
        this._onPanResponderMove()
      },
      onPanResponderRelease: (evt: GestureResponderEvent) => {
        this._onPanResponderRelease(evt)
      },
      onPanResponderTerminate: () => {
      },
    })
  }

  componentDidMount() {
    try {
      // Sound.setCategory('Playback')
      SoundUtil.setSound('homeclick', 'homeclick.mp3', Sound.MAIN_BUNDLE)
      // this.clickSound = new Sound('homeclick.mp3', Sound.MAIN_BUNDLE, (error) => {
      //   if (error) {
      //     console.log('failed to load the sound', error)
      //     return
      //   }
      // })
    } catch (error) {
      __DEV__ && AppLog.error(error)
    }
  }

  componentWillUnmount() {
    SoundUtil.release('homeclick')
    // this.clickSound?.stop()
    // this.clickSound?.release()
  }

  _onPanResponderMove = () => { }

  _onPanResponderRelease = ({ nativeEvent }: GestureResponderEvent) => {
    this.setState({
      initialPosition: {
        ...this.state.initialPosition,
        left: nativeEvent.pageX,
        // top: nativeEvent.pageY - this.containerHeight + CIRCLE_SIZE / 3,
        top: nativeEvent.pageY,
      },
    }, () => {
      this.animatedUnit?.startAnimation()

      SoundUtil.play('homeclick')
      // this.clickSound?.stop(() => {
      //   this.clickSound?.play((success) => {
      //     if (success) {
      //       console.log('successfully finished playing')
      //     } else {
      //       console.log('playback failed due to audio decoding errors')
      //     }
      //   })
      // })
    })
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

  _clickAction = ({ nativeEvent }: GestureResponderEvent, action?: () => void, delay = 0) => {
    this.setState({
      initialPosition: {
        ...this.state.initialPosition,
        left: nativeEvent.pageX,
        top: nativeEvent.pageY - this.containerHeight + CIRCLE_SIZE / 3,
      },
    }, () => {
      this.animatedUnit?.startAnimation()

      SoundUtil.play('homeclick', false, {
        preAction: () => {
          if (delay > 0) {
            setTimeout(() => {
              action?.()
            }, delay)
          } else {
            action?.()
          }
        }
      })
      // this.clickSound?.stop(() => {
      //   this.clickSound?.play()
      //   if (delay > 0) {
      //     setTimeout(() => {
      //       action?.()
      //     }, delay)
      //   } else {
      //     action?.()
      //   }
      // })
    })
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
        // Animated.timing(this.state.scales[current].imgSize, {
        //   toValue: IMG_SIZE * 1.2,
        //   duration: 160,
        //   easing: Easing.linear,
        //   useNativeDriver: false,
        // }),
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
          delay: 20,
        }),
        Animated.timing(this.state.scales[current].imgSize, {
          toValue: IMG_SIZE * 1.2,
          duration: 200,
          easing: Easing.linear,
          useNativeDriver: false,
          delay: 20,
        }),
      ])
      Animated.sequence([a1, a2, a3]).start()
    }
  }

  getItems = (): Item[]  => {
    return [
      // {
      //   image: getImage().ar_ccdoctor_unselected,
      //   selectedImage: getImage().ar_ccdoctor_selected,
      //   title: getLanguage().DOCTORCC,
      //   desc: '虚拟人物互动，一件换装，合影留念',
      //   action: () => {
      //     AppEvent.emitEvent('show_ar_map', true)
      //     AppToolBar.show('EXHIBITION', 'EXHIBITION_DR_SUPERMAP')
      //   }
      // },
      {
        image: getImage().ar_infra_unselected,
        selectedImage: getImage().ar_infra_selected,
        title: getLanguage().COVER,
        desc: '地下、墙面、屋顶隐蔽管线浏览',
        action: async() => {
          // const hw = await SARMap.isHuawei()
          // if(hw){
          //   Toast.show('暂不支持此功能', {
          //     backgroundColor: 'rgba(0,0,0,.5)',
          //     textColor: '#fff',
          //   })
          //   return
          // }
          SExhibition.setCustomOcclusionEnable(true).then(() => {
            AppEvent.emitEvent('show_ar_map', true)
          })
          AppToolBar.show('EXHIBITION', 'EXHIBITION_INFRA')
        }
      },
      {
        image: getImage().ar_sandbox_unselected,
        selectedImage: getImage().ar_sandbox_selected,
        title: getLanguage().SANDTABLE,
        desc: '建筑立体模型浏览、剖切，灯效显示',
        action: () => {
          AppEvent.emitEvent('show_ar_map', true)
          // AppToolBar.show('EXHIBITION', 'EXHIBITION_SUPERMAP_BUILDING')
          AppToolBar.show('EXHIBITION', 'EXHIBITION_SANDBOX')
        }
      },
      // {
      //   image: getImage().ar_3d_map_unselected,
      //   selectedImage: getImage().ar_3d_map_selected,
      //   title: getLanguage().AR3DMAP,
      //   desc: '立体地图交互浏览，车辆模拟',
      //   action: () => {
      //     AppEvent.emitEvent('show_ar_map', true)
      //     AppToolBar.show('EXHIBITION', 'EXHIBTION_AR_3D_MAP')
      //   }
      // },
      // {
      //   image: getImage().ar_flat_map_unselected,
      //   selectedImage: getImage().ar_flat_map_selected,
      //   title: getLanguage().ARFLATMAP,
      //   desc: '二维地图浏览、配图、分析、查询',
      //   action: () => {
      //     AppEvent.emitEvent('show_ar_map', true)
      //     AppToolBar.show('EXHIBITION', 'EXHIBITION_FLAT_MAP')
      //   }
      // }
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
          width: BG_WIDTH,
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
            onPressOut={(e) => {
              // this.scale(index)
              // this.setState({
              //   currentIndex: index,
              // })
              this._clickAction(e, () => {
                this.setState({
                  currentIndex: index,
                })
                setModule(index)
              })
            }}
          >
            <ImageBackground
              style={{position: 'absolute', width: '100%', height: '100%', justifyContent: 'flex-end'}}
              source={this.state.currentIndex === index ? item.selectedImage : item.image}
              resizeMode='contain'
            >
            </ImageBackground>
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
      <View style={{paddingHorizontal: dp(10), flexDirection: 'row', justifyContent: 'space-around'}}>
        {/* <ScrollView
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
        > */}
        {this.getItems().map((item, index) => {
          return this.renderLItem(item, index)
        })}
        {/* </ScrollView> */}
      </View>
    )
  }

  renderStartButton = () => {
    return (
      <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: dp(26),
          left: '50%',
          right: '50%',
          width: dp(160),
          height: dp(41),
          marginLeft: dp(-80),
        }}
        // onPress={(e: GestureResponderEvent) => {
        //   if (this.state.currentIndex === -1) {
        //     Toast.show('请选择模块')
        //     return
        //   }
        //   this._clickAction(e, () => {
        //     const item = this.getItems()[this.state.currentIndex]
        //     item?.action()
        //   }, 1000)
        // }}
        onPressOut={(e: GestureResponderEvent) => {
          if (this.state.currentIndex === -1) {
            Toast.show('请选择模块', {
              backgroundColor: 'rgba(0,0,0,.5)',
              textColor: '#fff',
            })
            return
          }
          SoundUtil.play('homeclick', false, {
            preAction: () => {
              setTimeout(() => {
                const item = this.getItems()[this.state.currentIndex]
                item?.action()
              }, 1000)
            }
          })
          // this._clickAction(e, () => {
          //   const item = this.getItems()[this.state.currentIndex]
          //   item?.action()
          // }, 1000)
        }}
      >
        <Image
          style={{
            width: dp(160),
            height: dp(41),
          }}
          source={this.state.currentIndex > -1 ? getImage().btn_start_selected : getImage().btn_start_unselected}
        />
      </TouchableOpacity>
    )
  }

  onLayout = () => {
    this.container?.measure((x, y, width, height) => {
      this.containerHeight = height
    })
  }

  renderClose = () => {
    return (
      <TouchableOpacity
        style={{
          position: 'absolute',
          top: dp(21),
          right: dp(24),
        }}
        onPressOut={() => {
          AppDialog.show({
            text: getLanguage().EXITEXHIBITION,
            confirm: () => {
              SoundUtil.releaseAll()
              AppUtils.AppExit()
            },
          })
        }}
      >
        <Image
          style={{
            width: dp(50),
            height: dp(50)
          }}
          source={getImage().icon_other_quit}
        />
      </TouchableOpacity>
    )
  }

  renderSound = () => {
    return (
      <TouchableOpacity
        style={{
          position: 'absolute',
          top: dp(20),
          right: dp(24),
        }}
        onPressOut={() => {
          if (this.state.playBg) {
            this.setState({
              playBg: false
            }, () => {
              SoundUtil.pause('background')
              AppToolBar.getProps().setBackgroundSoundPlayState(false)
            })
          } else {
            this.setState({
              playBg: true
            }, () => {
              SoundUtil.play('background', true)
              AppToolBar.getProps().setBackgroundSoundPlayState(true)
            })
          }
        }}
      >
        <Image
          style={{
            width: dp(60),
            height: dp(60)
          }}
          source={this.state.playBg ? getImage().icon_music_selected : getImage().icon_music}
        />
      </TouchableOpacity>
    )
  }

  renderSetting = () => {
    return (
      <TouchableOpacity
        style={{
          position: 'absolute',
          top: dp(25),
          right: dp(80),
        }}
        onPressOut={() => {
          this.setState({showSetting:!this.state.showSetting})
        }}
      >
        <Image
          style={{
            width: dp(50),
            height: dp(50)
          }}
          source={getImage().icon_setting}
        />
      </TouchableOpacity>
    )
  }
  importMap = async (map: FlatMap, localMaps: ILocalData[]) => {
    const hasFlatMap = localMaps.find(item => {
      return item.name === `${map.mapName}.xml`
    })

    if(hasFlatMap) {
      const homePath = await FileTools.getHomeDirectory()
      const mapPath = homePath + hasFlatMap.path
      const mapExpPath = mapPath.substring(0, mapPath.lastIndexOf('.')) + '.exp'
      await FileTools.deleteFile(mapPath)
      await FileTools.deleteFile(mapExpPath)
      const animationPath = homePath + ConstPath.UserPath + `Customer/Data/Animation/${map.mapName}`
      await FileTools.deleteFile(animationPath)

      const path = homePath + ConstPath.Common + `Exhibition/AR平面地图/${map.extFolderName}`
      const data = await DataHandler.getExternalData(path)
      if (data.length > 0 && data[0].fileType === 'workspace') {
        await DataHandler.importExternalData(AppUser.getCurrentUser(), data[0])
      }
    }

    global.Loading.setLoading(false)
    Toast.show(getLanguage().SETTING_CLEAR_CACHE_SUCCESS, {
      backgroundColor: 'rgba(0,0,0,.5)',
      textColor: '#fff',
    })
  }

  renderSettingView = () => {
    return (
      <View
        style={{
          position: 'absolute',
          top: dp(80),
          right: dp(45),
          backgroundColor:'#191919CC',
          width: dp(120),
          height: dp(170),
          borderRadius: dp(8),
          borderWidth:dp(2),
          borderColor:'#696969',
        }}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            flexDirection: 'row',
            width: '100%',
            alignItems: 'center',
            // justifyContent: 'center',
          }}
          onPressOut={() => {
            NavigationService.navigate('LanguageSetting')
          }}
        >
          <Image
            style={{
              width: dp(40),
              height: dp(40),
              marginLeft:dp(5),
            }}
            source={getImage().icon_language}
          />
          <Text
            style={{
              height:'100%',
              textAlign: 'center',
              fontSize: dp(15),
              color: 'white',
              textAlignVertical:'center',
            }}
          >{getLanguage().SETTING_LANGUAGE}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            flex: 1,
            flexDirection: 'row',
            width: '100%',
            alignItems: 'center',
            // justifyContent: 'center',
          }}
          onPressOut={async() => {
            global.Loading.setLoading(true)
            const data = await DataHandler.getLocalData(AppUser.getCurrentUser(), 'MAP')
            flatMaps.map(async map => {
              return this.importMap(map, data)
            })
          }}
        >
          <Image
            style={{
              width: dp(40),
              height: dp(40),
              marginLeft:dp(5),
            }}
            source={getImage().icon_clear}
          />
          <Text
            style={{
              height:'100%',
              textAlign: 'center',
              fontSize: dp(15),
              color: 'white',
              textAlignVertical:'center',
              width:dp(70),
            }}
            numberOfLines={1}
          >{getLanguage().SETTING_CLEAR_CACHE}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            flex: 1,
            flexDirection: 'row',
            width: '100%',
            alignItems: 'center',
            // justifyContent: 'center',
          }}
          onPressOut={() => {
            AppDialog.show({
              text: getLanguage().EXITEXHIBITION,
              confirm: () => {
                SoundUtil.releaseAll()
                AppUtils.AppExit()
              },
            })
          }}
        >
          <Image
            style={{
              width: dp(40),
              height: dp(40),
              marginLeft:dp(5),
            }}
            source={getImage().icon_quit}
          />
          <Text
            style={{
              height:'100%',
              textAlign: 'center',
              fontSize: dp(15),
              color: 'white',
              textAlignVertical:'center',
            }}
          >{ getLanguage().LICENSE_EXIT}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  isPortrait = this.props.windowSize.height > this.props.windowSize.width
  render() {
    this.isPortrait = this.props.windowSize.height > this.props.windowSize.width
    return(
      <View
        ref={ref => { this.container = ref }}
        style={[StyleSheet.absoluteFill, { justifyContent: 'center' }]}
        {...this._panResponder.panHandlers}
        onLayout={this.onLayout}
        pointerEvents={'box-none'}
      >
        <ImageBackground
          style={[StyleSheet.absoluteFill, {
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            justifyContent: 'center',
          }]}
          source={getImage().img_bg}
          resizeMode="stretch"
        >

          <Image
            style={[{
              position: 'absolute',
              top: dp(0),
              bottom: dp(176),
              left: '50%',
              right: '50%',
              marginLeft: dp(-176),
              width: dp(352),
              height: dp(139),
            },
            global.isPad && {
              top: -dp(22),
              marginLeft: dp(-260),
              width: dp(520),
              height: dp(248),
            }]}
            source={ global.isPad ? getImage().img_bg_title : getImage().img_bg_title_paid}
            resizeMode="contain"
          />
          {this.isPortrait ? this.renderSwiper() : this.renderStatic()}
          {this.renderStartButton()}
          {/* {this.renderClose()} */}
          {this.renderSound()}
          {this.renderSetting()}
          {this.state.showSetting && this.renderSettingView()}
          <AnimatedUnit ref={ref => this.animatedUnit = ref} initialPosition={this.state.initialPosition} endDiameter={CIRCLE_SIZE} />
        </ImageBackground>
      </View>
    )
  }
}

export default Home