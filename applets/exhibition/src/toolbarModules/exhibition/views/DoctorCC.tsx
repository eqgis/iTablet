import React, { Component } from "react"
import { ScaledSize, TouchableOpacity, Image, ViewStyle, View, Text, ScrollView, StyleSheet, ImageSourcePropType } from "react-native"
import { getImage } from '../../../assets'
import { dp } from 'imobile_for_reactnative/utils/size'
import { AppEvent, AppStyle, AppToolBar, Toast ,DataHandler} from '@/utils'
import { SARMap ,ARLayerType, FileTools, ARAction, SExhibition} from 'imobile_for_reactnative'
import Scan from "../components/Scan"
import { ConstPath } from "@/constants"
import { ARElement, ARLayer, ARModelAnimatorParameter, ModelAnimation } from "imobile_for_reactnative/NativeModule/interfaces/ar/SARMap"
import { ARAnimatorCategory, ARAnimatorType, ARElementType } from "imobile_for_reactnative/NativeModule/dataTypes"
import ARArrow from "../components/ARArrow"
import { Vector3 } from "imobile_for_reactnative/types/data"


interface animationListType {
  id:number,
  name: string,
}

interface speakItemType {
  key: 'doctor' | 'pipeLine' | 'mansion' | '3dMap' | 'map' | 'null',
  title: string,
  image: ImageSourcePropType,
}
interface Props {
  windowSize: ScaledSize
}

interface State {
  showScan: boolean
  // showCover: boolean
  /** 选中的功能模块的key */
  selectType: 'speak' | 'action' | 'reloader' | 'photo' | 'video' | 'null'
  /** 模型的动画列表 */
  animations: Array<ModelAnimation>
  /** 选中的动画的key */
  selectAnimationKey: number
  /** 选中皮肤的key */
  selectReloaderKey: 'doctor' | 'superman'
  /** 是否全屏显示地图 true表示全屏显示 */
  isShowFull: boolean
  /** 选中解说模块儿的key */
  selectSpeakKey: 'doctor' | 'pipeLine' | 'mansion' | '3dMap' | 'map' | 'null'
  /** 二级目录是否显示 true显示 false不显示 */
  isSecondaryShow: boolean,
}

class DoctorCC extends Component<Props, State> {

  /** 扫描界面的句柄 */
  scanRef: Scan | null = null
  /** 已添加的动画列表 */
  animationList: Map<number, animationListType> = new Map<number, animationListType>()
  /** 当前地图的图层数 */
  layers: Array<ARLayer> = []
  /** 博士的element 播放动画需要 */
  ARModel: ARElement | undefined = undefined
  /** 解说的数据 */
  speakData: Array<speakItemType> = []
  /** 记录当前显示的解说图层列表 */
  curShowSpeakLayers: Array<ARLayer> = []
  // 窗格动画是否在播放 true表示在播放 false表示未在播放
  isPlay = false
  // 窗格动画播放的定时器
  timer: NodeJS.Timeout | null | undefined = null

  constructor(props: Props) {
    super(props)
    this.state = {
      showScan: false,
      selectType: 'null',
      animations: [],
      selectAnimationKey: -1,
      selectReloaderKey: 'doctor',
      isShowFull: false,
      selectSpeakKey: 'null',
      isSecondaryShow: true,
    }
  }

  componentDidMount = async () => {
    this.getData()
    // 启用增强定位
    SARMap.setAREnhancePosition()
    // 添加监听
    AppEvent.addListener('ar_image_tracking_result', async (result) => {
      if(result) {
        SARMap.stopAREnhancePosition()
        this.setState({showScan: false})
        await this.openDoctorARMap()

        const relativePositin: Vector3 = {
          x: 0,
          y: 0,
          z: -1,
        }
        // SExhibition.removeTempPoint()
        SExhibition.setTrackingTarget({
          pose: result,
          translation: relativePositin
        })
        SExhibition.startTrackingTarget()

        // Toast.show('定位成功')
      }
    })
  }

  /** 定义解说数据 */
  getData = () => {
    this.speakData = [
      {
        key: 'doctor',
        title: 'AR超超博士',
        image: getImage().ar_dr_supermap,
      },
      {
        key: 'pipeLine',
        title: 'AR室内管线',
        image: getImage().ar_infra,
      },
      {
        key: 'mansion',
        title: 'AR超图大厦',
        image: getImage().ar_supermap_building,
      },
      {
        key: '3dMap',
        title: 'AR立体地图',
        image: getImage().ar_3d_map,
      },
      {
        key: 'map',
        title: 'AR平面地图',
        image: getImage().ar_flat_map,
      },
    ]
  }

  /** 导入和打开地图 */
  openDoctorARMap = async () => {
    // 关闭之前的地图
    await SARMap.close()
    await DataHandler.closeARRawDatasource()

    // 路径
    const homePath = await FileTools.getHomeDirectory()
    // 源数据路径
    const path =`${homePath + ConstPath.Common}Exhibition/AR超超博士/AR超超博士/AR超超博士.arxml`
    // 导入之后的地图路径
    const arMapPath = homePath + ConstPath.UserPath + 'Customer/Data/ARMap/AR超超博士.arxml'
    // 判断导入之后的地图路径是否存在，不存在才导入
    if(!(await FileTools.fileIsExist(arMapPath))) {
      await SARMap.importMap(path)
    }
    // 打开指定路径的地图
    const result = await SARMap.open(arMapPath)

    if(result) {
      await SARMap.moveToMapCenter()
      this.layers = await SARMap.getLayers()
      const length = this.layers.length

      if (length > 0) {
        for(let i = 0; i < length; i ++) {
          const layer = this.layers[i]
          if(layer.type === ARLayerType.AR_MODEL_LAYER && layer.caption === '博士') {
            SARMap.setLayerVisible(layer.name, true)
            // 把博士设为当前对象
            this.ARModel = {
              layerName: layer.name,
              id: 1,
              type: ARElementType.AR_MODEL,
              touchType: 0,
              select: true,
              videoType: 1,
            }
          } else {
            // 将除博士图层外的其他图层隐藏掉
            SARMap.setLayerVisible(layer.name, false)
          }
        }

      }
      AppToolBar.addData({
        addNewDSourceWhenCreate: false,
      })
      SARMap.setAction(ARAction.NULL)
      Toast.show("地图打开成功")
    } else {
      Toast.show("该地图不存在")
    }
  }

  /** 点击返回按钮执行的方法 */
  back = async () => {
    // 扫描界面未关闭时，关闭扫描界面
    if(this.state.showScan) {
      this.setState({showScan: false})
      return
    }
    // 移除监听
    AppEvent.removeListener('ar_image_tracking_result')
    if(this.state.showScan) {
      SARMap.stopAREnhancePosition()
    }

    // 关闭地图
    const props = AppToolBar.getProps()
    await props.closeARMap()
    await props.setCurrentARLayer()

    SExhibition.stopTrackingTarget()
    // 返回首页
    AppToolBar.goBack()
  }

  /** 点击扫描按钮执行的方法 */
  showScan = async () => {
    if(this.isPlay) {
      SARMap.stopARAnimation()
      this.isPlay = false
    }
    if(this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }

    if(this.ARModel) {
      SARMap.setAnimation(this.ARModel.layerName, this.ARModel.id, -1)
    }

    this.setState({
      showScan: true,
      selectType: 'null',
      selectAnimationKey: -1,
      selectSpeakKey: 'null',
    })
  }

  /** 点击详解按钮执行的方法 */
  speakBtnOnpress = async () => {
    if(this.state.selectType === 'speak') {
      this.setState({
        isSecondaryShow: !this.state.isSecondaryShow,
      })
      return
    }
    if(this.ARModel) {
      SARMap.setAnimation(this.ARModel.layerName, this.ARModel.id, -1)
    }

    this.setState({
      selectType: 'speak',
      selectAnimationKey: -1,
      isSecondaryShow: true,
    })
  }

  /** 点击动作按钮执行的方法 */
  actionBtnOnPress = async ()=>{
    if(this.state.selectType === 'action') {
      this.setState({
        isSecondaryShow: !this.state.isSecondaryShow,
      })
      return
    }

    const currentElement = this.ARModel
    let animations: Array<ModelAnimation> = []
    if(currentElement) {
      // await SARMap.setAnimation(currentElement.layerName, currentElement.id, -1)
      // 将图层的动画重复播放次数设置为1，对应传参为0
      SARMap.setLayerAnimationRepeatCount(currentElement.layerName, 0)
      animations = await SARMap.getModelAnimation(currentElement.layerName, currentElement.id)
    }

    this.setState({
      selectType: 'action',
      animations: animations,
      isSecondaryShow: true,
      selectSpeakKey: 'null',
    })
    if(this.isPlay) {
      SARMap.stopARAnimation()
      this.isPlay = false
    }
    if(this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }

  }

  /** 点击换装按钮执行的方法 */
  reloaderBtnOnPress = async () => {

    if(this.state.selectType === 'reloader') {
      this.setState({
        isSecondaryShow: !this.state.isSecondaryShow,
      })
      return
    }

    if(this.ARModel) {
      SARMap.setAnimation(this.ARModel.layerName, this.ARModel.id, -1)
    }
    this.setState({
      selectType: 'reloader',
      selectAnimationKey: -1,
      isSecondaryShow: true,
      selectSpeakKey: 'null',
    })
    if(this.isPlay) {
      SARMap.stopARAnimation()
      this.isPlay = false
    }
    if(this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }
  }

  /** 点击合影按钮执行的方法 */
  photoBtnOnPress = async () => {

    if(this.state.selectType === 'photo') {
      this.setState({
        isSecondaryShow: !this.state.isSecondaryShow,
      })
      return
    }

    if(this.isPlay) {
      SARMap.stopARAnimation()
      this.isPlay = false
    }
    if(this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }

    if(this.ARModel) {
      SARMap.setAnimation(this.ARModel.layerName, this.ARModel.id, -1)
    }
    this.setState({
      selectType: 'photo',
      // isShowFull: true,
      selectAnimationKey: -1,
      isSecondaryShow: true,
      selectSpeakKey: 'null',
    })
  }

  /** 点击录像按钮执行的方法 */
  videoBtnOnPress = async () => {

    if(this.state.selectType === 'video') {
      this.setState({
        isSecondaryShow: !this.state.isSecondaryShow,
      })
      return
    }
    if(this.isPlay) {
      SARMap.stopARAnimation()
      this.isPlay = false
    }
    if(this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }

    // 将播放的动画停止播放
    if(this.ARModel) {
      SARMap.setAnimation(this.ARModel.layerName, this.ARModel.id, -1)
    }
    this.setState({
      selectType: 'video',
      selectAnimationKey: -1,
      isSecondaryShow: true,
      selectSpeakKey: 'null',
    })
  }

  /** 返回按钮 */
  renderBackBtn = () => {
    return (
      <TouchableOpacity
        style={{
          position: 'absolute',
          top: dp(20),
          left: dp(20),
          width: dp(60),
          height: dp(60),
          borderRadius: dp(5),
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
        }}
        onPress={this.back}
      >
        <Image
          style={{ position: 'absolute', width: '100%', height: '100%' }}
          source={getImage().icon_return}
        />
      </TouchableOpacity>
    )
  }

  /** 扫描按钮 */
  renderScanBtn = () => {
    return (
      <TouchableOpacity
        style={{
          position: 'absolute',
          top: dp(80),
          left: dp(20),
          width: dp(60),
          height: dp(60),
          borderRadius: dp(5),
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
        }}
        onPress={this.showScan}
      >
        <Image
          style={{ position: 'absolute', width: '100%', height: '100%' }}
          source={getImage().icon_other_scan}
        />
      </TouchableOpacity>
    )
  }

  /** 扫描界面 */
  renderScan = () => {
    const isPortrait = this.props.windowSize.width < this.props.windowSize.height
    const width = Math.min(this.props.windowSize.width, this.props.windowSize.height)
    const height = Math.max(this.props.windowSize.width, this.props.windowSize.height)
    const isLargeScreen = width > 400 //平板

    const scanSize = dp(300)

    let space: number
    let position: number
    let maxWidth: number

    const positionLargeLand = width / 2 + scanSize / 2 + dp(40)
    const positionLargePortrait = height / 2 + scanSize / 2 + dp(40)
    const postionSmallLand = width * 0.7 / 2 + width / 2 + dp(40)
    const postionSmallPortrait = width * 0.7 / 2 + height / 2 + dp(40)

    const spaceLarge = width - scanSize / 2
    const spaceSmall = width * 0.3 / 2

    const maxWidthLarge = (height / 2- scanSize / 2 ) * 0.9
    const maxWidthSmall = (height / 2- width * 0.7 / 2 ) * 0.9

    if(isLargeScreen) {
      space = spaceLarge
      position = isPortrait ? positionLargePortrait : positionLargeLand
      maxWidth = maxWidthLarge
    } else {
      space = spaceSmall
      position = isPortrait ? postionSmallPortrait : postionSmallLand
      maxWidth = maxWidthSmall
    }

    let style : ViewStyle = {
      position: 'absolute',
      flex: 1,
      width: '100%',
      height: dp(70),
      alignItems: 'center',
      top: position,
      overflow: 'hidden',
    }
    if(!isPortrait && space < dp(70)) {
      style = {
        position: 'absolute',
        flex: 1,
        maxWidth: maxWidth,
        alignItems: 'center',
        top: width / 2,
        right: 0,
      }
    }

    return (
      <>
        <Scan
          ref={ref => this.scanRef = ref}
          windowSize={this.props.windowSize}
          scanSize={scanSize}
          color='red'
        />

        <View
          style={style}
        >
          <TouchableOpacity
            style={{
              width: dp(100),
              height: dp(40),
              justifyContent: 'center',
              alignItems: 'center',
            }}
            // onPress={this.startScan}
          >
            <Image
              style={{ position: 'absolute', width: '100%', height: '100%' }}
              source={getImage().background_red}
              resizeMode="stretch" />
            <Text style={[AppStyle.h3, { color: 'white' }]}>
              {'扫一扫'}
            </Text>
          </TouchableOpacity>
          <Text
            style={{
              color: 'white',
              marginTop: dp(10),
              textAlign: 'center',
            }}
          >
            {'请扫描演示台上的二维码加载展示内容'}
          </Text>
        </View>

      </>
    )
  }


  /** 详解按钮 */
  renderSpeak = () => {
    return(
      <View
        style={{
          position: 'absolute',
          top: dp(40),
          right: dp(0),
          width: dp(50),
          height: dp(50),
          // borderRadius: dp(5),
          borderTopLeftRadius: dp(10),
          borderBottomLeftRadius: dp(10),
          justifyContent: 'center',
          alignItems: 'flex-end',
          overflow: 'hidden',
          backgroundColor: '#fff',
        }}
      >
        <TouchableOpacity
          style={[
            styles.functionItem,
            this.state.selectType === 'speak' && {
              borderRightColor: '#f24f02'
            }
          ]}
          onPress={this.speakBtnOnpress}
        >
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'hidden',
              width: dp(30),
              height: dp(30),
            }}
          >
            <Image
              style={{ position: 'absolute', width: '100%', height: '100%' }}
              source={this.state.selectType === 'speak'? getImage().icon_speak_selected : getImage().icon_speak}
            />
          </View>

          <Text
            style={{
              fontSize:10,
            }}
          >
            {'详解'}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  /** 右边的其他按钮 */
  renderFunctionList = () => {
    return(
      <View
        style={{
          position: 'absolute',
          top: dp(100),
          right: dp(0),
          width: dp(50),
          // height: dp(50),
          // borderRadius: dp(5),
          borderTopLeftRadius: dp(10),
          borderBottomLeftRadius: dp(10),
          justifyContent: 'center',
          alignItems: 'flex-end',
          overflow: 'hidden',
          backgroundColor: '#fff',
        }}
      >
        <TouchableOpacity
          style={[
            styles.functionItem,
            this.state.selectType === 'action' && {
              borderRightColor: '#f24f02'
            }
          ]}
          onPress={this.actionBtnOnPress}
        >
          <View
            style={[styles.functionItemImageView]}
          >
            <Image
              style={[styles.functionItemImagee]}
              source={this.state.selectType === 'action'? getImage().icon_action_selected: getImage().icon_action}
            />
          </View>

          <Text style={[styles.functionItemText]}> {'动作'} </Text>
        </TouchableOpacity>

        {/* <TouchableOpacity
          style={[
            styles.functionItem,
            this.state.selectType === 'reloader' && {
              borderRightColor: '#f24f02'
            }
          ]}
          onPress={this.reloaderBtnOnPress}
        >
          <View
            style={[styles.functionItemImageView]}
          >
            <Image
              style={[styles.functionItemImagee]}
              source={this.state.selectType === 'reloader' ? getImage().icon_reloader_selected : getImage().icon_reloader}
            />
          </View>
          <Text style={[styles.functionItemText]}> {'换装'} </Text>
        </TouchableOpacity> */}

        {/* <TouchableOpacity
          style={[
            styles.functionItem,
            this.state.selectType === 'photo' && {
              borderRightColor: '#f24f02'
            }
          ]}
          onPress={this.photoBtnOnPress}
        >
          <View
            style={[styles.functionItemImageView]}
          >
            <Image
              style={[styles.functionItemImagee]}
              source={this.state.selectType === 'photo'? getImage().icon_photo_seleted : getImage().icon_photo}
            />
          </View>
          <Text style={[styles.functionItemText]}> {'合影'} </Text>
        </TouchableOpacity> */}

        {/* <TouchableOpacity
          style={[
            styles.functionItem,
            this.state.selectType === 'video' && {
              borderRightColor: '#f24f02'
            }
          ]}
          onPress={this.videoBtnOnPress}
        >
          <View
            style={[styles.functionItemImageView]}
          >
            <Image
              style={[styles.functionItemImagee]}
              source={this.state.selectType === 'video'? getImage().icon_video_selected : getImage().icon_video}
            />
          </View>
          <Text style={[styles.functionItemText]}> {'录像'} </Text>
        </TouchableOpacity> */}
      </View>
    )
  }

  /** 详解被选中时显示的界面 */
  renderSpeakSelected = () => {
    return (
      <View
        style={[{
          position: 'absolute',
          bottom: dp(15),
          left: 0,
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
        }]}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={[{maxWidth: dp(550)}]}
        >
          {
            this.speakData.map((item) => {
              return this.renderSpeakItem(item)
            })
          }
        </ScrollView>
      </View>
    )
  }

  /** 详解里具体的解说项 */
  renderSpeakItem = (item: speakItemType) => {
    return (
      <TouchableOpacity
        style={[
          {
            width: dp(100),
            height: dp(100),
            marginHorizontal: dp(5),
            backgroundColor: 'rgba(255, 255, 255, .9)',
            // opacity: 0.9,
            justifyContent: 'space-between',
            alignItems: 'center',
          },
          this.state.selectSpeakKey === item.key && {
            shadowOffset: { width: 1, height: 1 },
            shadowColor: 'black',
            shadowOpacity: 1,
          },
        ]}
        onPress={async () => {
          if(this.isPlay) {
            SARMap.stopARAnimation()
            this.isPlay = false
          }
          if(this.timer) {
            clearTimeout(this.timer)
            this.timer = null
          }
          // 当再次点击同一解说模块儿时，停止该模块儿的动画和取消选中状态
          if(this.state.selectSpeakKey === item.key){
            this.setState({
              selectSpeakKey: 'null',
            })
            return
          }

          // 获取地图里的推演动画列表
          const list = await SARMap.getARAnimations()

          // 计算播放的窗格动画的时间
          let time = 22
          let indexTemp = -1
          list.map((animation, index) => {
            if(animation.name.toLocaleUpperCase().indexOf(item.title.toLocaleUpperCase()) !== -1) {
              // console.warn(animation.name + " ----- " + item.title)
              if(animation.type === ARAnimatorType.MODEL_TYPE || animation.type === ARAnimatorType.NODE_TYPE) {
                time += (animation.duration || 0 ) * ((animation.repeatCount || 0) + 1) + (animation.delay || 0)
              } else if(animation.type === ARAnimatorType.GROUP_TYPE){
                const animationTemp = animation.animations
                animationTemp.map((ele) => {
                  if(ele.type === ARAnimatorType.MODEL_TYPE || ele.type === ARAnimatorType.NODE_TYPE){
                    time += (ele.duration || 0) * ((ele.repeatCount || 0) + 1) + (ele.delay || 0)
                  }
                })
              }

              indexTemp = index
            }

          })

          if(time <= 0) {
            Toast.show("该模块儿暂无讲解")
          } else {
            if(indexTemp >= 0) {
              // console.warn("list: " + JSON.stringify(list[index]))
              // 播放窗格动画
              SARMap.playARAnimation(list[indexTemp])
              this.isPlay = true
            }

            this.timer = setTimeout(()=>{

              if(this.isPlay) {
                SARMap.stopARAnimation()
                this.isPlay = false
                this.setState({
                  isSecondaryShow: true,
                  selectSpeakKey: 'null',
                })
              }
              if(this.timer) {
                clearTimeout(this.timer)
                this.timer = null
              }

            }, time * 1000)
          }

          this.setState({
            isSecondaryShow: false,
            selectSpeakKey: item.key,
          })


        }}
      >
        <Image source={item.image} style={[{width: dp(60), height: dp(60),marginTop: dp(10)}]} />
        <View style={[
          {backgroundColor: '#fff', width: '100%', height: dp(20), justifyContent: 'center', alignItems: 'center'},
          this.state.selectSpeakKey === item.key && {
            backgroundColor:"#f24f02",
          },
        ]} >
          <Text style={[
            {fontSize:dp(12), color: '#000'},
            this.state.selectSpeakKey === item.key && {
              color:"#fff",
            },

          ]}>{item.title}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  /** 动作被选中时显示动画列表 */
  renderActionSelected = () => {
    if(this.state.animations?.length <= 0) {
      return null
    } else {
      return(
        <ScrollView
          style={{
            position: 'absolute',
            top: dp(100),
            right: dp(60),
            width: dp(80),
            // height: dp(100),
            maxHeight: dp(240),
            borderRadius: dp(10),
            paddingVertical: dp(10),
            paddingHorizontal: dp(5),
            // justifyContent: 'center',
            // alignItems: 'center',
            overflow: 'hidden',
            backgroundColor: '#fff',
          }}
        >
          {this.state.animations.map((item) => {
            return this.renderActionListItem(item)
          })}
        </ScrollView>
      )
    }

  }

  /** 动作里具体的动画的项 */
  renderActionListItem = (item: ModelAnimation) => {
    return (
      <TouchableOpacity
        key={item.id}
        style={[
          {
            width: dp(70),
            height: dp(33),
            marginVertical: dp(2),
            paddingVertical: dp(2),
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
            // backgroundColor: '#f00',
            borderRadius: dp(10),
          },
          this.state.selectAnimationKey === item.id && {
            backgroundColor: '#EFEFEF'
          }
        ]}
        onPress={async ()=>{
          this.setState({selectAnimationKey: item.id})
          const currentElement = this.ARModel
          if(currentElement) {
            const isAdd = this.animationList.get(item.id)
            if(!isAdd) {
              const params: ARModelAnimatorParameter = {
                category: ARAnimatorCategory.DISAPPEAR,
                // type: ARAnimatorType.NODE_TYPE,
                name: item.name,
                layerName: currentElement.layerName,
                elementID: currentElement.id,
                type: ARAnimatorType.MODEL_TYPE,
                modelAnimationIndex: item.id,

                repeatCount: 0,
                delay:0,

                /** 模型动画时长 单位秒 */
                duration: item.duration,
                // // /** 模型动画开始帧时间 单位秒 */
                startFrame: 0,
                // /** 模型动画结束帧时间 单位秒 */
                endFrame: -1,
              }
              const id = await SARMap.addAnimation(params)
              await SARMap.setAnimation(currentElement.layerName, currentElement.id, id)
              const animationItemtemp = {
                id,
                name: item.name,
              }
              this.animationList.set(item.id, animationItemtemp)
            } else {
              // 动画已经存在了
              await SARMap.setAnimation(currentElement.layerName, currentElement.id, isAdd.id)
            }

          }
        }}
      >
        <Text
          style={{
            fontSize:14,
          }}
        >
          {item.name === 'stand-by' ? "站立" : item.name}
        </Text>
      </TouchableOpacity>)
  }

  /** 换装被选中时显示装扮页面 to do */
  renderReloaderSelected = () => {
    return(
      <View
        style={{
          position: 'absolute',
          top: dp(160),
          right: dp(60),
          width: dp(54),
          maxHeight: dp(120),
          borderRadius: dp(10),
          paddingVertical: dp(10),
          // paddingHorizontal: dp(5),
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
          backgroundColor: '#fff',
        }}
      >
        <TouchableOpacity
          style={[
            styles.ReloaderItem,
            // this.state.selectType === 'action' && {
            //   borderRightColor: '#f24f02'
            // }
          ]}
          onPress={() => {
            this.setState({selectReloaderKey: 'superman'})
          }}
        >
          <View
            style={[styles.functionItemImageView]}
          >
            <Image
              style={[styles.functionItemImagee]}
              source={this.state.selectReloaderKey === 'superman'? getImage().icon_superman_selected : getImage().icon_superman}
            />
          </View>

          <Text style={[styles.functionItemText]}> {'超人'} </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.ReloaderItem,
            // this.state.selectType === 'action' && {
            //   borderRightColor: '#f24f02'
            // }
          ]}
          onPress={() => {
            this.setState({selectReloaderKey: 'doctor'})
          }}
        >
          <View
            style={[styles.functionItemImageView]}
          >
            <Image
              style={[styles.functionItemImagee]}
              source={this.state.selectReloaderKey === 'doctor'? getImage().icon_doctor_selected : getImage().icon_doctor}
            />
          </View>

          <Text style={[styles.functionItemText]}> {'博士'} </Text>
        </TouchableOpacity>
      </View>
    )
  }

  /** 合影被选中时显示的拍照页面 to do */
  renderPhotoSelected = () => {
    return (
      <TouchableOpacity
        style={{
          position: 'absolute',
          top: dp(20),
          right: dp(20),
          width: dp(60),
          height: dp(60),
          borderRadius: dp(5),
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
        }}
        // onPress={this.back}
      >
        {/* <Image
          style={{ position: 'absolute', width: '100%', height: '100%' }}
          source={getImage().icon_return}
        /> */}
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <>
        {/* 右边按钮的响应界面 */}
        {!this.state.isShowFull && this.state.isSecondaryShow && this.state.selectType === 'speak' && this.ARModel && this.renderSpeakSelected()}
        {!this.state.isShowFull && this.state.isSecondaryShow && this.state.selectType === 'action' && this.renderActionSelected()}
        {!this.state.isShowFull && this.state.isSecondaryShow && this.state.selectType === 'reloader' && this.renderReloaderSelected()}

        {/* 右边按钮 */}
        {!this.state.isShowFull && this.renderSpeak()}
        {!this.state.isShowFull && this.renderFunctionList()}

        {/* 扫描界面 */}
        {!this.state.isShowFull && this.state.showScan && this.renderScan()}
        {/* 左边按钮 */}
        {!this.state.isShowFull && !this.state.showScan && this.renderScanBtn()}
        {!this.state.isShowFull && this.renderBackBtn()}

        <ARArrow />

      </>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  functionItem: {
    width: dp(48),
    height: dp(55),
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: 'white',
    borderRightWidth: dp(2),
    borderRightColor: '#fff',
  },
  functionItemImageView: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    width: dp(30),
    height: dp(30),
  },
  functionItemImagee: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  functionItemText: {
    fontSize:10,
  },

  ReloaderItem: {
    width: dp(50),
    height: dp(55),
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: 'white',
    borderRightColor: '#fff',
  },

})

export default DoctorCC