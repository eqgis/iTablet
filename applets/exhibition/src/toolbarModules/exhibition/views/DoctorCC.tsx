import React, { Component } from "react"
import { ScaledSize, TouchableOpacity, Image, ViewStyle, View, Text, ScrollView, StyleSheet, ImageSourcePropType, Platform, Animated, StyleProp, NativeModules } from "react-native"
import { getImage } from '../../../assets'
import { dp } from 'imobile_for_reactnative/utils/size'
import { AppEvent, AppToolBar, Toast ,DataHandler, SoundUtil} from '@/utils'
import { SARMap ,ARLayerType, FileTools, ARAction, SExhibition, SMediaCollector} from 'imobile_for_reactnative'
import Scan from "../components/Scan"
import { ConstPath } from "@/constants"
import { ARElement, ARLayer, ARModelAnimatorParameter, ModelAnimation, positionInfoType } from "imobile_for_reactnative/NativeModule/interfaces/ar/SARMap"
import { ARAnimatorCategory, ARAnimatorType, ARElementType } from "imobile_for_reactnative/NativeModule/dataTypes"
import ARArrow from "../components/ARArrow"
import GuideView from "@/containers/workspace/components/GuideView/GuideView"
import Video from 'react-native-video'
import { getLanguage } from "@/language"
import ARGuide from '../components/ARGuide'
import Sound from 'react-native-sound'
import { getRoute } from "../data/route"
import SideBar, { Item } from "../components/SideBar"

const appUtilsModule = NativeModules.AppUtils


interface animationListType {
  id:number,
  name: string,
  duration: number,
}

interface speakItemType {
  key: 'doctor' | 'pipeLine' | 'mansion' | '3dMap' | 'map' | 'null',
  title: string,
  name: string,
  image: ImageSourcePropType,
}

interface reloaderItemType {
  key: 'doctor' | 'doctorStudy',
  image:  ImageSourcePropType,
  name: string,
  action: () => void,
}

interface routeItemType {
  key: 'position1'| 'position2' | 'position3' | 'null',
  title: string,
  name: string,
  image: ImageSourcePropType,
  // route: string,
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
  selectReloaderKey: 'doctor' | 'doctorStudy'
  /** 是否全屏显示地图 true表示全屏显示 */
  isShowFull: boolean
  /** 选中解说模块儿的key */
  selectSpeakKey: 'doctor' | 'pipeLine' | 'mansion' | '3dMap' | 'map' | 'null'
  /** 二级目录是否显示 true显示 false不显示 */
  isSecondaryShow: boolean,
  /** 点击合影按钮后截屏获取的图片uri */
  uri: string,
  /** 是否正在录像 */
  isVideoStart: boolean,
  /** 解说模块的按钮引导 */
  isSpeakGuideShow: boolean,
  /** 点击录像按钮后录屏的视屏url */
  videoUrl: string,
  /** 视屏是否播放 1为播放 0为暂停 */
  rate: number,
  /** 视屏录制的时间 */
  videoTime: number,
  /** 录像界面的动画选择引导 */
  isVideoGuideShow: boolean,
  /** 录像里面的引导提示文字 */
  videoGuideText: string,
  /** 模块解说引导 */
  showGuide: boolean,
  /** 合影里按钮的选项的key */
  photoBtnKey: 'action' | 'position' | 'operation' | 'null',
  /** 当前选择路线的key */
  selectRouteKey: 'position1'| 'position2' | 'position3' | 'null',
  /** 路线的推演是否在进行中 */
  isRoutePlay: boolean,

  /** 右边工具栏的动画 */
  btRight:Animated.Value
  /** 左边工具栏的动画 */
  btLeft:Animated.Value
  /** 下边二级菜单的动画 */
  btBottom: Animated.Value
  /** 全局背景音乐是否在播放 */
  isBackground: boolean,
}

homePath = ""

class DoctorCC extends Component<Props, State> {

  /** 扫描界面的句柄 */
  scanRef: Scan | null = null
  /** 博士已添加的动画列表 */
  animationList: Map<number, animationListType> = new Map<number, animationListType>()
  /** 超人已添加的动画列表 */
  supermanAnimationList: Map<number, animationListType> = new Map<number, animationListType>()
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
  /** 合影图片保存的本地路径 */
  imgPath: string
  /** 模型图层的名字列表 */
  modelMap = new Map<string, ARElement>()
  /** 视屏录屏的定时器 */
  videoTimer: NodeJS.Timer | null | undefined = null
  /** 是否能够推出超超博士模块 true可以退出 false不可以退出 */
  isBack: boolean

  /** 动画重读播放的定时器 */
  animationTimer: NodeJS.Timer | null | undefined = null
  /** 合影的位置路线数据 */
  photoRouteDate: Array<routeItemType> = []
  /** 模型的初始位置信息 包含位置，方向和大小 */
  positionInfo: positionInfoType | null = null
  /** 动作的声音资源 */
  soundSource = ["standby", "greet", "walk", "turnaround", "handshake", "speak", "please", "followme", "risus", "click"]
  /** 当前是否有动作的声音在播放 */
  isActionSoundPlay: string | null = null

  show = true

  constructor(props: Props) {
    super(props)
    this.state = {
      showScan: true,
      selectType: 'null',
      animations: [],
      selectAnimationKey: -1,
      selectReloaderKey: 'doctor',
      isShowFull: false,
      selectSpeakKey: 'null',
      isSecondaryShow: true,
      uri: 'null',
      isVideoStart: false,
      isSpeakGuideShow: false,
      videoUrl: 'null',
      rate: 1,
      videoTime: -1,
      isVideoGuideShow: true,
      videoGuideText: "请选择录像动作",
      showGuide: false,
      photoBtnKey: 'null',
      selectRouteKey: 'position1',
      isRoutePlay: false,
      btRight: new Animated.Value (
        0,
      ),
      btLeft: new Animated.Value (
        dp(20),
      ),
      btBottom: new Animated.Value (
        0,
      ),
      isBackground: SoundUtil.isPlaying("background") || false
    }
    this.imgPath = ''
    this.isBack = false

  }

  componentDidMount = async () => {
    // Enable playback in silence mode
    // Sound.setCategory('Playback')

    this.addSound()

    this.getDoctorData()
    await this.openDoctorARMap()
    // 启用增强定位
    SARMap.setAREnhancePosition()
    // 添加监听
    AppEvent.addListener('ar_image_tracking_result', async (result) => {
      if(result) {
        SARMap.stopAREnhancePosition()
        this.setState({showScan: false})

        // 进入模块儿暂时屏蔽模块引导讲解
        // if(!isDoctorMapGuided()) {
        //   setDoctorMapGuided()
        //   this.showGuide(true)
        // }

        if(this.ARModel) {
          // 获取校准之后的模型位置信息
          this.positionInfo = await SARMap.getElementPositionInfo(this.ARModel.layerName, this.ARModel.id)

          const relativePositin = await SARMap.getElementPosition(this.ARModel.layerName, this.ARModel.id)
          // console.warn("relativePositin: " + JSON.stringify(relativePositin))
          if(relativePositin) {
            await SExhibition.setTrackingTarget(relativePositin)
            await SExhibition.startTrackingTarget()
          }
        }

        Toast.show('定位成功')
      }
    })
    // 添加语音结束的监听
    SARMap.addSpeakStopListener({
      callback: async () => {
        // 语音结束三秒后停止推演动画
        const speakStopTimer = setTimeout(() => {
          if(this.isPlay) {
            SARMap.stopARAnimation()
            this.isPlay = false
            this.setState({
              isSecondaryShow: true,
              selectSpeakKey: 'null',
            })
          }
          clearTimeout(speakStopTimer)
          this.showGuide(false)
        }, 3000)

      },
    })

    /** 屏幕单击事件监听 */
    AppEvent.addListener('ar_single_click', () =>{
      let right
      let left
      let bottom
      if (this.show) {
        right = -100
        left = -200
        bottom = -200
      }else {
        right = 0
        left = dp(20)
        bottom = 0
      }
      this.show = !this.show
      Animated.parallel([
        Animated.timing(this.state.btRight, {
          toValue: right,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(this.state.btLeft, {
          toValue: left,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(this.state.btBottom, {
          toValue: bottom,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start()

      if(!this.state.showScan && !this.state.showGuide && this.state.isSpeakGuideShow) {
        this.setState({
          isSpeakGuideShow: false,
        })
      }

      if(this.state.isShowFull && this.state.selectType === 'video' && this.state.isVideoGuideShow) {
        this.setState({
          isVideoGuideShow: false,
        })
      }
    })

    // 推演动画结束监听
    SARMap.addStopARAnimationListen({
      callback: async () => {
        if(this.state.isRoutePlay) {
          if(this.ARModel) {
            const positionInfo =  await SARMap.getElementPositionInfo(this.ARModel.layerName, this.ARModel.id)
            // console.warn("positionInfo" + JSON.stringify(positionInfo))

            SARMap.stopARAnimation()
            const tempTimer =  setTimeout(async () => {
              if(this.state.isRoutePlay && this.ARModel && positionInfo?.animationNode){
                await SARMap.appointEditElement(this.ARModel.id, this.ARModel.layerName)
                await SARMap.setElementPositionInfo(this.ARModel.layerName, this.ARModel.id, positionInfo.animationNode)
                // this.isPlay = false
                this.setState({
                  isRoutePlay: false,
                })

                // 更新箭头追踪的位置和范围
                const relativePositin = await SARMap.getElementPosition(this.ARModel.layerName, this.ARModel.id)
                if(relativePositin) {
                  await SExhibition.setTrackingTarget(relativePositin)
                  await SExhibition.startTrackingTarget()
                }

              }
              clearTimeout(tempTimer)

              // 走到指定位置后，如果之前有选择动画，则继续播放之前的动画
              const currentElement = this.ARModel
              if(currentElement) {
                const id = this.state.selectAnimationKey
                let isAdd: animationListType | null | undefined = null
                if(this.state.selectReloaderKey === 'doctor'){
                  isAdd = this.animationList.get(id)
                } else if(this.state.selectReloaderKey === 'doctorStudy'){
                // supermanAnimationList
                  isAdd = this.supermanAnimationList.get(id)
                }
                if(isAdd) {
                // 动画已经存在了
                  await SARMap.setAnimation(currentElement.layerName, currentElement.id, isAdd.id)
                  // 启动动画定时器，每当上一个动画播放完2秒后重启动画
                  this.animationTimer = setInterval(async () => {
                    if(this.state.selectAnimationKey === id) {
                      await SARMap.setAnimation(currentElement.layerName, currentElement.id, -1)
                    }
                    isAdd && await SARMap.setAnimation(currentElement.layerName, currentElement.id, isAdd.id)
                  },(isAdd.duration + 2) * 1000)
                }
              }

            },300)

          }

          // SARMap.stopARAnimation()
        }

      },
    })
  }

  componentDidUpdate = () => {
    if(!this.state.showScan && !this.state.showGuide && this.state.isSpeakGuideShow) {
      const timer = setTimeout(() => {
        this.setState({
          isSpeakGuideShow: false,
        })
        clearTimeout(timer)
      },2000)
    }

    if(this.state.isShowFull && this.state.selectType === 'video' && this.state.photoBtnKey === 'action' && this.state.isVideoGuideShow) {
      const videoGuideTimer = setTimeout(() => {
        this.setState({
          isVideoGuideShow: false,
        })
        clearTimeout(videoGuideTimer)
      }, 2000)
    }
  }

  showGuide = (show: boolean) => {
    this.setState({showGuide: show})
  }

  addSound = () => {
    this.soundSource.map((item) => {
      SoundUtil.setSound(item, `${item}.mp3`, Sound.MAIN_BUNDLE)
    })
  }

  /** 博士的解说数据 */
  getDoctorData = () => {
    this.speakData = [
      {
        key: 'doctor',
        title: 'AR超超博士',
        name: 'AR超超博士',
        image: getImage().ar_dr_supermap,
      },
      {
        key: 'pipeLine',
        title: 'AR室内管线',
        name: 'AR室内管线',
        image: getImage().ar_infra,
      },
      {
        key: 'mansion',
        title: 'AR超图大厦',
        name: 'AR超图大厦',
        image: getImage().ar_supermap_building,
      },
      {
        key: '3dMap',
        title: 'AR立体地图',
        name: 'AR立体地图',
        image: getImage().ar_3d_map,
      },
      {
        key: 'map',
        title: 'AR平面地图',
        name: 'AR平面地图',
        image: getImage().ar_flat_map,
      },
    ]
    this.photoRouteDate = [
      {
        key: 'position1',
        title: '路线1',
        name: '洞见之光',
        image: getImage().img_route_route01,
        // route: getRoute().route0_11,
      },
      {
        key: 'position2',
        title: '路线2',
        name: '企业使命',
        image: getImage().img_route_route02,
        // route: getRoute().route0_12,
      },
      {
        key: 'position3',
        title: '路线3',
        name: '超图研究院',
        image: getImage().img_route_route03,
        // route: getRoute().route0_13,
      },
    ]
  }

  /** 超人的解说数据 */
  getSupermanData = () => {
    this.speakData = [
      {
        key: 'doctor',
        title: 'AR超超博士_学',
        name: 'AR超超博士',
        image: getImage().ar_dr_supermap,
      },
      {
        key: 'pipeLine',
        title: 'AR室内管线_学',
        name: 'AR室内管线',
        image: getImage().ar_infra,
      },
      {
        key: 'mansion',
        title: 'AR超图大厦_学',
        name: 'AR超图大厦',
        image: getImage().ar_supermap_building,
      },
      {
        key: '3dMap',
        title: 'AR立体地图_学',
        name: 'AR立体地图',
        image: getImage().ar_3d_map,
      },
      {
        key: 'map',
        title: 'AR平面地图_学',
        name: 'AR平面地图',
        image: getImage().ar_flat_map,
      },
    ]
    this.photoRouteDate = [
      {
        key: 'position1',
        title: '路线1',
        name: '洞见之光',
        image: getImage().img_route_route01,
        // route: getRoute().route11,
      },
      {
        key: 'position2',
        title: '路线2',
        name: '企业使命',
        image: getImage().img_route_route02,
        // route: getRoute().route12,
      },
      {
        key: 'position3',
        title: '路线3',
        name: '超图研究院',
        image: getImage().img_route_route03,
        // route: getRoute().route13,
      },
    ]
  }

  /** 详解按钮 */
  getSideBarSpeakItem = (): Item[] => {
    return [
      {
        image: getImage().icon_speak,
        image_selected: getImage().icon_speak_selected,
        title: '详解',
        action: this.speakBtnOnpress
      }
    ]
  }

  /** 右侧其他按钮 */
  getSideBarItems = (): Item[] => {
    return [
      {
        image: getImage().icon_action,
        image_selected: getImage().icon_action_selected,
        title: '动作',
        action: this.actionBtnOnPress
      },
      {
        image: getImage().icon_reloader,
        image_selected: getImage().icon_reloader_selected,
        title: '换装',
        action: this.reloaderBtnOnPress
      },
      {
        image: getImage().icon_photo,
        image_selected: getImage().icon_photo_seleted,
        title: '合影',
        action: this.photoBtnOnPress
      },
      {
        image: getImage().icon_video,
        image_selected: getImage().icon_video_selected,
        title: '录像',
        action: this.videoBtnOnPress
      }
    ]
  }

  /** 打开地图 */
  openDoctorARMap = async () => {
    // 关闭之前的地图
    await SARMap.close()
    await DataHandler.closeARRawDatasource()

    // 路径
    homePath = await FileTools.getHomeDirectory()
    // // 源数据路径
    // const path =`${homePath + ConstPath.Common}Exhibition/AR超超博士/AR超超博士/AR超超博士.arxml`
    // 导入之后的地图路径
    const arMapPath = homePath + ConstPath.UserPath + 'Customer/Data/ARMap/AR超超博士.arxml'

    // // 1. 数据是否更新
    // const dataUpate =  await SARMap.needToImport()
    // // 2. 导入之后的地图路径是否存在
    // const mapExist = await FileTools.fileIsExist(arMapPath)
    // // 当数据更新且存在导入后的地图，删掉原来的导入地图
    // if(dataUpate && mapExist) {
    //   FileTools.deleteFile(arMapPath)
    // }
    // // 当数据更新或没有导入后的地图，才进行重新导入
    // if(dataUpate || !mapExist) {
    //   await SARMap.importMap(path)
    // }

    // 打开指定路径的地图
    const result = await SARMap.open(arMapPath)

    if(result) {
      await SARMap.moveToMapCenter()
      this.layers = await SARMap.getLayers()
      const length = this.layers.length

      if (length > 0) {
        for(let i = 0; i < length; i ++) {
          const layer = this.layers[i]
          // console.warn("layer: " + JSON.stringify(layer))
          if(layer.type === ARLayerType.AR_MODEL_LAYER) {

            SARMap.setLayerMaxAnimationBounds(layer.name, 15)
            if(layer.caption === '博士') {
              SARMap.setLayerVisible(layer.name, true)
              const model = {
                layerName: layer.name,
                id: 1,
                type: ARElementType.AR_MODEL,
                touchType: 0,
                select: true,
                videoType: 1,
              }
              this.modelMap.set(layer.caption, model)
              // 把博士设为当前对象
              this.ARModel = model
              // 获取模型的初始位置信息
              this.positionInfo = await SARMap.getElementPositionInfo(this.ARModel.layerName, this.ARModel.id)
            } else if(layer.caption === '博士_学') {
              SARMap.setLayerVisible(layer.name, false)
              const model = {
                layerName: layer.name,
                id: 3,
                type: ARElementType.AR_MODEL,
                touchType: 0,
                select: true,
                videoType: 1,
              }
              this.modelMap.set(layer.caption, model)
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
      this.isBack = true
      // 博士加载完成值后再允许显示引导内容
      this.setState({
        isSpeakGuideShow: true,
      })
      // Toast.show("地图打开成功")
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

    // 当在拍照界面或录像界面时，点击返回按钮退出拍照或录像界面
    if(this.state.isShowFull && (this.state.selectType === 'photo' || this.state.selectType === 'video')) {
      if(this.ARModel) {
        // SARMap.setAnimation(this.ARModel.layerName, this.ARModel.id, -1)

        if(this.state.isRoutePlay) {
          SARMap.stopARAnimation()

          const tempTimer =  setTimeout(async () => {
            if(this.ARModel) {
              if(this.positionInfo?.renderNode) {
                await SARMap.appointEditElement(this.ARModel.id, this.ARModel.layerName)
                await SARMap.setElementPositionInfo(this.ARModel.layerName, this.ARModel.id, this.positionInfo.renderNode)
                // this.isPlay = false
              }

              // 更新箭头追踪的位置和范围
              await SExhibition.stopTrackingTarget()
              const relativePositin = await SARMap.getElementPosition(this.ARModel.layerName, this.ARModel.id)
              if(relativePositin) {
                await SExhibition.setTrackingTarget(relativePositin)
                await SExhibition.startTrackingTarget()
              }
            }

            clearTimeout(tempTimer)

            SARMap.setAction(ARAction.NULL)
            SARMap.clearSelection()

            this.ARModel && await SARMap.setAnimation(this.ARModel.layerName, this.ARModel.id, -1)
            if(this.animationTimer !== null){
              clearInterval(this.animationTimer)
              this.animationTimer = null
            }

            this.setState({
              isShowFull: false,
              selectAnimationKey: -1,
              isVideoGuideShow: false,
              selectRouteKey: 'null',
              photoBtnKey: 'null',
              isRoutePlay: false,
            })

          },300)
        } else {
          if(this.positionInfo?.renderNode) {
            await SARMap.appointEditElement(this.ARModel.id, this.ARModel.layerName)
            await SARMap.setElementPositionInfo(this.ARModel.layerName, this.ARModel.id, this.positionInfo.renderNode)
            // this.isPlay = false

            // 更新箭头追踪的位置和范围
            await SExhibition.stopTrackingTarget()
            const relativePositin = await SARMap.getElementPosition(this.ARModel.layerName, this.ARModel.id)
            if(relativePositin) {
              await SExhibition.setTrackingTarget(relativePositin)
              await SExhibition.startTrackingTarget()
            }

            SARMap.setAction(ARAction.NULL)
            SARMap.clearSelection()

          }

          await SARMap.setAnimation(this.ARModel.layerName, this.ARModel.id, -1)
          if(this.animationTimer !== null){
            clearInterval(this.animationTimer)
            this.animationTimer = null
          }

          this.setState({
            isShowFull: false,
            selectAnimationKey: -1,
            isVideoGuideShow: false,
            selectRouteKey: 'null',
            photoBtnKey: 'null',
            isRoutePlay: false,
          })
        }
      }
      return
    }
    // 数据未加载完成，点击返回无效
    if(!this.isBack) {
      Toast.show("请等待数据加载完成再退出!")
      return
    }
    // 移除监听
    AppEvent.removeListener('ar_image_tracking_result')
    // 移除语音结束监听
    SARMap.removeSpeakStopListener()
    SARMap.removeStopARAnimationListen()
    if(this.state.showScan) {
      SARMap.stopAREnhancePosition()
    }

    // 释放音频资源
    this.soundSource.map((item) => {
      SoundUtil.release(item)
    })

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

    if(this.ARModel) {
      SARMap.setAnimation(this.ARModel.layerName, this.ARModel.id, -1)
    }
    if(this.animationTimer !== null){
      clearInterval(this.animationTimer)
      this.animationTimer = null
    }

    SExhibition.stopTrackingTarget()
    SARMap.setAREnhancePosition()
    this.setState({
      showScan: true,
      selectType: 'null',
      selectAnimationKey: -1,
      selectSpeakKey: 'null',
      isSpeakGuideShow: false,
    })
  }

  /** 点击合影界面的动作按钮执行的方法 */
  photoBtnOnpress = async () => {
    SARMap.setAction(ARAction.NULL)
    if(this.state.photoBtnKey === 'action') {
      this.setState({
        isSecondaryShow: !this.state.isSecondaryShow,
        isVideoGuideShow: false,
      })
      return
    }
    this.setState({
      isSecondaryShow: true,
      // isVideoGuideShow: false,
      photoBtnKey: 'action',
    })
  }

  /** 点击合影界面的路线按钮执行的方法 */
  routeBtnOnpress = async () => {
    SARMap.setAction(ARAction.NULL)
    if(this.state.photoBtnKey === 'position') {
      this.setState({
        isSecondaryShow: !this.state.isSecondaryShow,
      })
      return
    }
    this.setState({
      isSecondaryShow: true,
      isVideoGuideShow: false,
      photoBtnKey: 'position',
    })
  }

  /** 点击合影界面的编辑操作按钮执行的方法 */
  operationBtnOnpress = async () => {
    if(this.state.photoBtnKey === 'operation') {
      SARMap.setAction(ARAction.NULL)
      this.setState({
        isSecondaryShow: !this.state.isSecondaryShow,
      })
      return
    }
    if(this.ARModel) {
      SARMap.appointEditElement(this.ARModel.id, this.ARModel.layerName)
      SARMap.setAction(ARAction.SCALE)
    }

    this.setState({
      isSecondaryShow: true,
      isVideoGuideShow: false,
      photoBtnKey: 'operation',
    })
  }

  /** 点击合影界面的具体路线按钮执行的方法 */
  routeItemOnPress = async (item: routeItemType) => {

    // 动作的动画停掉
    if(this.ARModel) {
      SARMap.setAnimation(this.ARModel.layerName, this.ARModel.id, -1)
    }
    if(this.animationTimer !== null){
      clearInterval(this.animationTimer)
      this.animationTimer = null
    }

    let route = getRoute().route0_11
    switch(this.state.selectRouteKey) {
      case "position1" : {
        if(item.key === 'position2') {
          if(this.state.selectReloaderKey === 'doctor') {
            route = getRoute().route0_12
          } else if(this.state.selectReloaderKey === 'doctorStudy') {
            route = getRoute().route1_12
          }
        } else if(item.key === 'position3') {
          if(this.state.selectReloaderKey === 'doctor') {
            route = getRoute().route0_13
          } else if(this.state.selectReloaderKey === 'doctorStudy') {
            route = getRoute().route1_13
          }
        }
        break
      }
      case 'position2' : {
        if(item.key === 'position1') {
          if(this.state.selectReloaderKey === 'doctor') {
            route = getRoute().route0_21
          } else if(this.state.selectReloaderKey === 'doctorStudy') {
            route = getRoute().route1_21
          }
        } else if(item.key === 'position3') {
          if(this.state.selectReloaderKey === 'doctor') {
            route = getRoute().route0_23
          } else if(this.state.selectReloaderKey === 'doctorStudy') {
            route = getRoute().route1_23
          }
        }
        break
      }
      case 'position3' : {
        if(item.key === 'position1') {
          if(this.state.selectReloaderKey === 'doctor') {
            route = getRoute().route0_31
          } else if(this.state.selectReloaderKey === 'doctorStudy') {
            route = getRoute().route1_31
          }
        } else if(item.key === 'position2') {
          if(this.state.selectReloaderKey === 'doctor') {
            route = getRoute().route0_32
          } else if(this.state.selectReloaderKey === 'doctorStudy') {
            route = getRoute().route1_32
          }
        }
        break
      }
      default: {
        if(this.state.selectReloaderKey === 'doctor') {
          route = getRoute().route0_11
        } else if(this.state.selectReloaderKey === 'doctorStudy') {
          route = getRoute().route1_11
        }
      }
    }

    const animation = JSON.parse(JSON.stringify(route))

    // 1. 添加动画
    await SARMap.addARAnimation(animation)
    // console.warn(routeId)
    // 2. 播放动画
    const tempTimer =  setTimeout(async () => {

      // 路线动画开始前，停掉箭头追踪功能
      await SExhibition.stopTrackingTarget()
      // 开始播放推演动画
      // SARMap.playARAnimation(JSON.parse(JSON.stringify(item.route)))
      SARMap.playARAnimation(JSON.parse(JSON.stringify(route)))
      clearTimeout(tempTimer)
    },300)

    this.setState({
      selectRouteKey: item.key,
      isSecondaryShow: false,
      isRoutePlay: true,
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
    if(this.animationTimer !== null){
      clearInterval(this.animationTimer)
      this.animationTimer = null
    }

    this.setState({
      selectType: 'speak',
      selectAnimationKey: -1,
      isSecondaryShow: true,
      isSpeakGuideShow: false,
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
      // 将图层的动画重复播放次数设置为1，对应传参为0
      SARMap.setLayerAnimationRepeatCount(currentElement.layerName, 0)
      animations = await SARMap.getModelAnimation(currentElement.layerName, currentElement.id)
      await SARMap.setAnimation(currentElement.layerName, currentElement.id, -1)
      if(this.animationTimer !== null){
        clearInterval(this.animationTimer)
        this.animationTimer = null
      }
    }

    this.setState({
      selectType: 'action',
      animations: animations,
      isSecondaryShow: true,
      selectSpeakKey: 'null',
      selectAnimationKey: -1,
      isSpeakGuideShow: false,
    })
    if(this.isPlay) {
      SARMap.stopARAnimation()
      this.isPlay = false
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
    if(this.animationTimer !== null){
      clearInterval(this.animationTimer)
      this.animationTimer = null
    }

    this.setState({
      selectType: 'reloader',
      selectAnimationKey: -1,
      isSecondaryShow: true,
      selectSpeakKey: 'null',
      isSpeakGuideShow: false,
    })
    if(this.isPlay) {
      SARMap.stopARAnimation()
      this.isPlay = false
    }
  }

  /** 点击合影按钮执行的方法 */
  photoBtnOnPress = async () => {

    // if(this.state.selectType === 'photo') {
    //   this.setState({
    //     isSecondaryShow: !this.state.isSecondaryShow,
    //   })
    //   return
    // }

    if(this.isPlay) {
      SARMap.stopARAnimation()
      this.isPlay = false
    }

    // if(this.ARModel) {
    //   SARMap.setAnimation(this.ARModel.layerName, this.ARModel.id, -1)
    // }

    const currentElement = this.ARModel
    let animations: Array<ModelAnimation> = []
    if(currentElement) {
      // 将图层的动画重复播放次数设置为1，对应传参为0
      SARMap.setLayerAnimationRepeatCount(currentElement.layerName, 0)
      animations = await SARMap.getModelAnimation(currentElement.layerName, currentElement.id)
      await SARMap.setAnimation(currentElement.layerName, currentElement.id, -1)
      if(this.animationTimer !== null){
        clearInterval(this.animationTimer)
        this.animationTimer = null
      }
    }

    // 暂时隐藏箭头追踪功能
    // SExhibition.stopTrackingTarget()

    this.setState({
      selectType: 'photo',
      isShowFull: true,
      selectAnimationKey: -1,
      isSecondaryShow: false,
      selectSpeakKey: 'null',
      animations: animations,
      isSpeakGuideShow: false,
      photoBtnKey: 'null',
      selectRouteKey: 'position1',
    })
  }

  /** 点击录像按钮执行的方法 */
  videoBtnOnPress = async () => {

    // if(this.state.selectType === 'video') {
    //   this.setState({
    //     isSecondaryShow: !this.state.isSecondaryShow,
    //   })
    //   return
    // }
    if(this.isPlay) {
      SARMap.stopARAnimation()
      this.isPlay = false
    }

    // 将播放的动画停止播放
    // if(this.ARModel) {
    //   SARMap.setAnimation(this.ARModel.layerName, this.ARModel.id, -1)
    // }
    const currentElement = this.ARModel
    let animations: Array<ModelAnimation> = []
    if(currentElement) {
      // 将图层的动画重复播放次数设置为1，对应传参为0
      SARMap.setLayerAnimationRepeatCount(currentElement.layerName, 0)
      animations = await SARMap.getModelAnimation(currentElement.layerName, currentElement.id)

      await SARMap.setAnimation(currentElement.layerName, currentElement.id, -1)
      if(this.animationTimer !== null){
        clearInterval(this.animationTimer)
        this.animationTimer = null
      }
    }

    this.setState({
      selectType: 'video',
      animations:animations,
      selectAnimationKey: -1,
      isSecondaryShow: true,
      selectSpeakKey: 'null',
      isShowFull: true,
      isSpeakGuideShow: false,
      photoBtnKey: 'null',
      selectRouteKey: 'position1',
    })
  }

  /** 点击了超人服的换装按钮 */
  doctorReloaderOnPress = () => {
    // 如果当前就是该模型就不做任何改动
    if(this.state.selectReloaderKey === 'doctor') {
      return
    }
    const newModel = this.modelMap.get('博士')
    if(newModel && this.ARModel) {
      // 更新解说数据为博士的数据
      this.getDoctorData()
      // 先隐藏之前的模型图层
      const layerName = this.ARModel.layerName
      SARMap.setLayerVisible(layerName, false)
      // 再显示新的模型图层
      SARMap.setLayerVisible(newModel.layerName, true)
      // 然后将模型给替换为新图层的模型
      this.ARModel = newModel
      // 修改选择模型的类型
      this.setState({selectReloaderKey: 'doctor'})
    }

  }

  /** 点击了博士服的换装按钮 */
  doctorStudyReloaderOnPress = () => {
    // 如果当前就是该模型就不做任何改动
    if(this.state.selectReloaderKey === 'doctorStudy') {
      return
    }
    const newModel = this.modelMap.get('博士_学')
    if(newModel && this.ARModel) {
      // 更新解说数据为超人的数据
      this.getSupermanData()
      // 先隐藏之前的模型图层
      const layerName = this.ARModel.layerName
      SARMap.setLayerVisible(layerName, false)
      // 再显示新的模型图层
      SARMap.setLayerVisible(newModel.layerName, true)
      // 然后将模型给替换为新图层的模型
      this.ARModel = newModel
      // 修改选择模型的类型
      this.setState({selectReloaderKey: 'doctorStudy'})
    }
  }


  /** 点击合影(截屏)按钮响应的方法 */
  shot = async () => {
    try {

      // 截屏03
      const date = new Date().getTime().toString()
      // const location = await SMap.getCurrentPosition()
      const homePath = await FileTools.getHomeDirectory()
      const targetPath = homePath + ConstPath.UserPath
        + 'Customer/' +
        ConstPath.RelativeFilePath.Media
      await SMediaCollector.initMediaCollector(targetPath)
      let imgPath = targetPath + `IMG_${date}.jpg`
      const result = await SARMap.captureImage(imgPath)
      // console.warn("result: " + JSON.stringify(result))
      if(result) {
        this.imgPath = imgPath
        if (
          Platform.OS === 'android' &&
          imgPath.toLowerCase().indexOf('content://') !== 0
        ) {
          imgPath = 'file://' + imgPath
        }
      }

      this.setState({
        uri: imgPath,
        // isShowFull: false,
        isSecondaryShow: false,
      })
    } catch (error) {
      console.warn("error: " + JSON.stringify(error))
    }


  }

  /** 保存合影到本地的方法 */
  savePhotoLocal = async () => {

    if(await FileTools.fileIsExist(this.imgPath)) {
      await SARMap.saveImgFileToAlbum(this.imgPath)
      // console.warn("合影保存成功: " + album)
      FileTools.deleteFile(this.imgPath)
      Toast.show("合影保存成功")
    }

    this.imgPath = ''
    this.setState({
      uri: 'null',
      // isSecondaryShow: true,
      isShowFull: true,
    })
  }

  /** 取消保存合影图片的方法 */
  cancelPhoto = async () => {
    // 因为在截屏时就已经保存到本地里，所以如果取消保存的话，得删去之前保存的图片
    if(await FileTools.fileIsExist(this.imgPath)) {
      FileTools.deleteFile(this.imgPath)
    }
    this.imgPath = ''
    this.setState({
      uri: 'null',
      // isSecondaryShow: true,
      isShowFull: true,
    })
  }

  /** 合影分享到微信 */
  shareImageToWechat = async () => {
    const date = new Date()
    const name = "ZT_Image_" + date.getTime()
    await this.shareToWechat(this.imgPath, name)

    if(await FileTools.fileIsExist(this.imgPath)) {
      FileTools.deleteFile(this.imgPath)
    }
    this.imgPath = ''
    this.setState({
      uri: 'null',
      // isSecondaryShow: true,
    })
  }

  /** 分享到微信 */
  shareToWechat = async (filePath: string, name: string) => {
    try {

      let result
      let isInstalled
      if (Platform.OS === 'ios') {
        isInstalled = true
      } else {
        isInstalled = await appUtilsModule.isWXInstalled()
      }
      // let isInstalled = await appUtilsModule.isWXInstalled()
      if (isInstalled) {
        result = await appUtilsModule.sendFileOfWechat({
          filePath: filePath,
          title: name,
          description: 'SuperMap iTablet',
        })

        if (!result) {
          Toast.show(getLanguage().Prompt.WX_SHARE_FAILED)
          return undefined
        }
      } else {
        Toast.show(getLanguage().Prompt.WX_NOT_INSTALLED)
      }
      return result === false ? result : undefined
    } catch (error) {
      if (error.message.includes('File size cannot exceeds 10M')) {
        Toast.show(getLanguage().Prompt.SHARE_WX_FILE_SIZE_LIMITE)
      }
    }
  }


  /** 录像按钮被点击时的响应方法 */
  videoRecord = async () => {
    if(this.state.isVideoStart) {
      // 清除录屏的定时器
      if(this.videoTimer) {
        clearInterval(this.videoTimer)
        this.videoTimer = null
      }

      // 停止录屏
      await SARMap.stopRecordVideo()
      // 获取录屏保存路径
      let url = await SARMap.getVideoRecordPath()
      if(url === '') {
        url = 'null'
      }

      // 停止录像
      this.setState({
        isVideoStart: false,
        // isShowFull: false,
        isSecondaryShow: false,
        videoUrl: url,
        videoTime: -1,
      })
    } else {
      await SARMap.startRecordVideo()
      // 开始录像
      this.setState({
        isVideoStart: true,
        videoTime: 0,
        isSecondaryShow: false,
        isVideoGuideShow: false,
      })
      this.videoTimer = setInterval(() => {
        this.setState({
          videoTime: this.state.videoTime + 1,
        })
      },1000)
    }

  }

  /** 时间格式化方法 */
  fixedTime = (number: number) => {
    let result = number + ''
    if(number < 10) {
      result = "0" + number
    }
    return result
  }

  /** 视屏加载出错的回调执行方法 */
  videoError = () => {
    console.warn("视频加载出错了")
  }

  /** 视屏保存到本地 */
  saveVideoLocal = async () => {
    if(await FileTools.fileIsExist(this.state.videoUrl)){
      await SARMap.saveVideoFileToAlbum(this.state.videoUrl)
      FileTools.deleteFile(this.state.videoUrl)
      // console.warn("录屏保存成功: " + result)
      Toast.show("录屏保存成功")
    }

    this.setState({
      videoUrl: 'null',
      isShowFull: true,
    })
  }

  /** 视屏分享到微信 */
  shareVideoToWechat = async () => {
    const date = new Date()
    const name = "ZT_Video_" + date.getTime()
    await this.shareToWechat(this.state.videoUrl, name)
    if(await FileTools.fileIsExist(this.state.videoUrl)) {
      // 删掉录屏原来的文件
      FileTools.deleteFile(this.state.videoUrl)
    }
    this.setState({
      videoUrl: 'null',
      isShowFull: true,
    })
  }

  /** 录屏取消保存 */
  cancelVideo = async () => {
    if(await FileTools.fileIsExist(this.state.videoUrl)) {
      // 删掉录屏原来的文件
      FileTools.deleteFile(this.state.videoUrl)
    }
    this.setState({
      videoUrl: 'null',
      isShowFull: true,
    })
  }

  /** 返回按钮 */
  renderBackBtn = () => {
    return (
      <TouchableOpacity
        style={{
          position: 'absolute',
          top: dp(20),
          // left: dp(20),
          width: dp(45),
          height: dp(45),
          borderRadius: dp(8),
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
          backgroundColor:'rgba(30,30,30,0.65)',
        }}
        onPress={this.back}
      >
        <Image
          style={{ position: 'absolute', width: dp(30), height: dp(30) }}
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
          top: dp(75),
          // left: dp(20),
          width: dp(45),
          height: dp(45),
          borderRadius: dp(8),
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
          backgroundColor:'rgba(30,30,30,0.65)',
        }}
        onPress={this.showScan}
      >
        <Image
          style={{ position: 'absolute', width: dp(30), height: dp(30) }}
          source={getImage().icon_other_scan}
        />
      </TouchableOpacity>
    )
  }

  /** 合影里动作显隐按钮 */
  renderPhotoBtn = () => {
    return (
      <TouchableOpacity
        style={[
          {
            position: 'absolute',
            top: dp(75),
            // left: dp(20),
            width: dp(45),
            height: dp(45),
            borderRadius: dp(8),
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
            backgroundColor:'rgba(30,30,30,0.65)',
          },
          this.state.isSecondaryShow && (((this.state.selectType === 'photo' || this.state.selectType === 'video') && this.state.photoBtnKey === 'action'))
          && {
            backgroundColor: 'rgba(229,82,12,0.65)',
          },
          this.state.selectType === 'video' && this.state.isVideoStart && {
            top: dp(20),
          },
        ]}
        onPress={this.photoBtnOnpress}
      >
        <Image
          style={{ position: 'absolute', width: dp(30), height: dp(30) }}
          source={this.state.isSecondaryShow && (
            ((this.state.selectType === 'photo' || this.state.selectType === 'video') && this.state.photoBtnKey === 'action')
          )
            ? getImage().icon_action_selected : getImage().icon_action}
        />
      </TouchableOpacity>
    )
  }

  /** 合影里路线的显隐按钮 */
  renderRouteBtn = () => {
    return (
      <TouchableOpacity
        style={[{
          position: 'absolute',
          top: dp(130),
          // left: dp(20),
          width: dp(45),
          height: dp(45),
          borderRadius: dp(8),
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
          backgroundColor:'rgba(30,30,30,0.65)',
        },
        this.state.isSecondaryShow && (((this.state.selectType === 'photo' || this.state.selectType === 'video') && this.state.photoBtnKey === 'position'))
        && {
          backgroundColor: 'rgba(229,82,12,0.65)',
        },
        this.state.selectType === 'video' && this.state.isVideoStart && {
          top: dp(75),
        },
        ]}
        onPress={this.routeBtnOnpress}
      >
        <Image
          style={[
            { position: 'absolute', width: dp(30), height: dp(30)},
          ]}
          source={this.state.isSecondaryShow && (
            ((this.state.selectType === 'photo' || this.state.selectType === 'video') && this.state.photoBtnKey === 'position')
          )
            ? getImage().icon_route_selected : getImage().icon_route}
        />
      </TouchableOpacity>
    )
  }

  /** 合影里编辑操作的显隐按钮 */
  renderOperationBtn = () => {
    return (
      <TouchableOpacity
        style={[{
          position: 'absolute',
          top: dp(185),
          // left: dp(20),
          width: dp(45),
          height: dp(45),
          borderRadius: dp(8),
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
          backgroundColor:'rgba(30,30,30,0.65)',
        },
        this.state.isSecondaryShow && (((this.state.selectType === 'photo' || this.state.selectType === 'video') && this.state.photoBtnKey === 'operation'))
        && {
          backgroundColor: 'rgba(229,82,12,0.65)',
        },
        this.state.selectType === 'video' && this.state.isVideoStart && {
          top: dp(130),
        },
        ]}
        onPress={this.operationBtnOnpress}
      >
        <Image
          style={[
            { position: 'absolute', width: dp(30), height: dp(30) },
          ]}
          source={this.state.isSecondaryShow && (
            ((this.state.selectType === 'photo' || this.state.selectType === 'video') && this.state.photoBtnKey === 'operation')
          )
            ? getImage().tool_location_selected : getImage().tool_location}
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
    const maxWidthSmall = (height / 2- width * 0.7 / 2 )

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
        // top: width / 2,
        bottom: dp(10),
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
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              color: 'white',
              marginTop: dp(10),
              textAlign: 'center',
            }}
          >
            {'扫码定位'}
          </Text>
        </View>
        <View
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            bottom: dp(10),
          }}
        >
          <View
            style={style}
          >
            {/* <TouchableOpacity
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
          </TouchableOpacity> */}
            <Text
              style={{
                color: 'white',
                marginTop: dp(10),
                textAlign: 'center',
              }}
            >
              {'请对准地面上的二维码进行扫描'}
            </Text>
          </View>
        </View>
      </>
    )
  }


  /** 详解按钮 已弃用 */
  renderSpeak = () => {
    return(
      <View
        style={{
          position: 'absolute',
          top: dp(40),
          right: dp(20),
          width: dp(50),
          height: dp(50),
          borderRadius: dp(10),
          // borderTopLeftRadius: dp(10),
          // borderBottomLeftRadius: dp(10),
          justifyContent: 'center',
          alignItems: 'flex-end',
          overflow: 'hidden',
          backgroundColor: 'transparent',
        }}
      >
        <TouchableOpacity
          style={[
            styles.functionItem,
            this.state.selectType === 'speak' && {
              backgroundColor: '#f24f02',
            }
          ]}
          onPress={this.speakBtnOnpress}
        >
          <View
            style={[
              styles.functionItemImageView,
              // this.state.selectType === 'speak' && {
              //   borderRightColor: '#f24f02'
              // }
            ]}
          >
            <Image
              style={[styles.functionItemImagee]}
              source={this.state.selectType === 'speak'? getImage().icon_speak_selected : getImage().icon_speak}
            />
            <Text style={[styles.functionItemText]}> {'详解'} </Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  /** 右边的其他按钮 已弃用 */
  renderFunctionList = () => {
    return(
      <View
        style={{
          position: 'absolute',
          top: dp(100),
          right: dp(20),
          width: dp(50),
          // height: dp(50),
          borderRadius: dp(10),
          // borderTopLeftRadius: dp(10),
          // borderBottomLeftRadius: dp(10),
          justifyContent: 'center',
          alignItems: 'flex-end',
          overflow: 'hidden',
          backgroundColor: 'transparent',
        }}
      >
        <TouchableOpacity
          style={[
            styles.functionItem,
            this.state.selectType === 'action' && {
              backgroundColor: '#f24f02',
            }
          ]}
          onPress={this.actionBtnOnPress}
        >
          <View
            style={[
              styles.functionItemImageView,
              // this.state.selectType === 'action' && {
              //   borderRightColor: '#f24f02'
              // }
            ]}
          >
            <Image
              style={[styles.functionItemImagee]}
              source={this.state.selectType === 'action'? getImage().icon_action_selected: getImage().icon_action}
            />
            <Text style={[styles.functionItemText]}> {'动作'} </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.functionItem,
            this.state.selectType === 'reloader' && {
              backgroundColor: '#f24f02',
            }
          ]}
          onPress={this.reloaderBtnOnPress}
        >
          <View
            style={[
              styles.functionItemImageView,
              this.state.selectType === 'reloader' && {
                borderRightColor: '#f24f02'
              }
            ]}
          >
            <Image
              style={[styles.functionItemImagee]}
              source={this.state.selectType === 'reloader' ? getImage().icon_reloader_selected : getImage().icon_reloader}
            />
            <Text style={[styles.functionItemText]}> {'换装'} </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.functionItem,
            this.state.selectType === 'photo' && {
              backgroundColor: '#f24f02',
            }
          ]}
          onPress={this.photoBtnOnPress}
        >
          <View
            style={[
              styles.functionItemImageView,
              this.state.selectType === 'photo' && {
                borderRightColor: '#f24f02'
              }
            ]}
          >
            <Image
              style={[styles.functionItemImagee]}
              source={this.state.selectType === 'photo'? getImage().icon_photo_seleted : getImage().icon_photo}
            />
            <Text style={[styles.functionItemText]}> {'合影'} </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.functionItem,
            this.state.selectType === 'video' && {
              backgroundColor: '#f24f02',
            }
          ]}
          onPress={this.videoBtnOnPress}
        >
          <View
            style={[
              styles.functionItemImageView,
              this.state.selectType === 'video' && {
                borderRightColor: '#f24f02'
              }
            ]}
          >
            <Image
              style={[styles.functionItemImagee]}
              source={this.state.selectType === 'video'? getImage().icon_video_selected : getImage().icon_video}
            />
            <Text style={[styles.functionItemText]}> {'录像'} </Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  /** 右侧的按钮 */
  renderSideBar = () => {
    return (
      <View>
        <SideBar
          sections={[
            this.getSideBarSpeakItem(),
            this.getSideBarItems()
          ]}
          showIndicator
        />
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
          contentContainerStyle= {[{height: dp(120), alignItems: 'center'}]}
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
            backgroundColor: 'rgba(0, 0, 0, .5)',
            borderRadius: dp(8),
            overflow: 'hidden',
            // opacity: 0.9,
            justifyContent: 'space-between',
            alignItems: 'center',
          },
          this.state.selectSpeakKey === item.key && {
            shadowOffset: { width: 1, height: 1 },
            shadowColor: 'black',
            shadowOpacity: 1,
            width: dp(112),
            height: dp(112),
          },
        ]}
        onPress={async () => {
          if(this.isPlay) {
            SARMap.stopARAnimation()
            this.isPlay = false
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
            if(item.title.toLocaleUpperCase() === animation.name.toLocaleUpperCase()) {
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
              // 播放窗格动画 延迟300ms 等上一个推演动画的stop方法走完
              const tempTimer =  setTimeout(() => {
                SARMap.playARAnimation(list[indexTemp])
                clearTimeout(tempTimer)
              },300)
              this.isPlay = true
            }

          }

          this.setState({
            isSecondaryShow: false,
            selectSpeakKey: item.key,
          })


        }}
      >
        <Image
          source={item.image}
          style={[
            {width: dp(60), height: dp(60),marginTop: dp(10)},
            this.state.selectSpeakKey === item.key && {
              width: dp(69),
              height: dp(69),
            }
          ]}
        />
        <View style={[
          {backgroundColor: '#000', width: '100%', height: dp(20), justifyContent: 'center', alignItems: 'center'},
          this.state.selectSpeakKey === item.key && {
            backgroundColor:"#f24f02",
            height: dp(23)
          },
        ]} >
          <Text style={[
            {fontSize:dp(12), color: '#fff'},
            this.state.selectSpeakKey === item.key && {
              color:"#fff",
            },

          ]}>{item.name}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  /** 换装被选中时显示的换装页面 */
  renderReloaderSelected = () => {
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
          contentContainerStyle= {[{height: dp(120), alignItems: 'center'}]}
        >
          {
            this.renderReloaderItem({
              key: 'doctor',
              image:  getImage().img_doctor,
              name: "超人服",
              action: this.doctorReloaderOnPress,
            })
          }

          {
            this.renderReloaderItem({
              key: 'doctorStudy',
              image:  getImage().img_doctor_study,
              name: "博士服",
              action: this.doctorStudyReloaderOnPress,
            })
          }
        </ScrollView>
      </View>
    )
  }

  /** 换装里具体的换装项 */
  renderReloaderItem = (item: reloaderItemType) => {
    return (
      <TouchableOpacity
        style={[
          {
            width: dp(100),
            height: dp(100),
            marginHorizontal: dp(5),
            backgroundColor: 'rgba(0, 0, 0, .5)',
            borderRadius: dp(8),
            overflow: 'hidden',
            // opacity: 0.9,
            justifyContent: 'space-between',
            alignItems: 'center',
          },
          this.state.selectReloaderKey === item.key && {
            shadowOffset: { width: 1, height: 1 },
            shadowColor: 'black',
            shadowOpacity: 1,
            width: dp(112),
            height: dp(112),
          },
        ]}
        onPress={item.action}
      >
        <Image
          source={item.image}
          style={[
            {width: dp(80), height: dp(80),marginTop: dp(10)},
            this.state.selectReloaderKey === item.key && {
              width: dp(90),
              height: dp(90),
            }
          ]}
        />
        <View style={[
          { position:'absolute', bottom: 0, left: 0 ,backgroundColor: '#000',opacity: 0.7 , width: '100%', height: dp(20), justifyContent: 'center', alignItems: 'center'},
          this.state.selectReloaderKey === item.key && {
            backgroundColor:"#f24f02",
            opacity: 1,
            height: dp(23)
          },
        ]} >
          <Text style={[
            {fontSize:dp(12), color: '#fff'},
            this.state.selectReloaderKey === item.key && {
              color:"#fff",
            },

          ]}>{item.name}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  /** 合影按钮被选中时显示的选择合影动画的页面 也是录像里的和外面的动作页面 */
  renderActionSelected = () => {
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
          style={[{maxWidth: dp(600),}]}
          contentContainerStyle= {[{height: dp(84), alignItems: 'center'}]}
          onLayout={(event:any) => {
            const layout = event.nativeEvent.layout
            const contentWidth = 9 * dp(56)
            if(layout.width < contentWidth) {
              this.setState({
                videoGuideText: "请滑动，选择录像动画"
              })
            }
          }}
        >
          {
            this.state.animations.map((item) => {
              return this.renderPhotoItem(item)
            })
          }
        </ScrollView>
      </View>
    )
  }

  /** 合影的动画具体选择项 */
  renderPhotoItem = (item: ModelAnimation) => {
    let image = getImage().icon_action_stand_by
    let title = item.name
    let source = "standby"
    switch(item.name){
      case 'stand-by':
        image = getImage().icon_action_stand_by
        source = "standby"
        title = "站立"
        break
      case '打招呼':
        image = getImage().icon_action_greet
        source = "greet"
        break
      case '行走':
        image = getImage().icon_action_walk
        source = "walk"
        break
      case '转圈':
        image = getImage().icon_action_turn_around
        source = "turnaround"
        break
      case '握手':
        image = getImage().icon_action_handshake
        source = "handshake"
        break
      case '说话':
        image = getImage().icon_action_speak
        source = "speak"
        break
      case '请':
        image = getImage().icon_action_please
        source = "please"
        break
      case '跟我走':
        image = getImage().icon_action_follow_me
        source = "followme"
        break
      case '大笑':
        image = getImage().icon_action_risus
        source = "risus"
        title = "高兴"
        break
      case '点击':
        image = getImage().icon_action_stand_by
        source = "click"
        break
      default:
        return null
    }
    // 源数据路径
    // const audioPath = `${homePath + ConstPath.Common}Exhibition/AR超超博士/AR超超博士/Audio/${source}`
    return (
      <TouchableOpacity
        key={item.id}
        style={[
          {
            width: dp(56),
            height: dp(74),
            marginVertical: dp(2),
            marginHorizontal: dp(5),
            paddingVertical: dp(2),
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
            backgroundColor: 'rgba(0, 0, 0, .5)',
            borderRadius: dp(8),
          },
          this.state.selectAnimationKey === item.id && {
            width: dp(60),
            height: dp(82)
          }
        ]}
        onPress={async ()=>{
          const currentElement = this.ARModel
          if(currentElement) {
            // 当两次点击同一动作动画时需要将之前的动画清掉
            if(this.state.selectAnimationKey === item.id) {
              await SARMap.setAnimation(currentElement.layerName, currentElement.id, -1)

              if(this.animationTimer !== null){
                clearInterval(this.animationTimer)
                this.animationTimer = null
              }
              this.setState({
                selectAnimationKey: -1,
                // isShowFull: true,
                // isSecondaryShow: false,
                isVideoGuideShow: false,
              })
              return
            }
            // 清掉上一个动画的定时器
            if(this.animationTimer !== null){
              clearInterval(this.animationTimer)
              this.animationTimer = null
            }
            let isAdd: animationListType | null | undefined = null
            if(this.state.selectReloaderKey === 'doctor'){
              isAdd = this.animationList.get(item.id)
            } else if(this.state.selectReloaderKey === 'doctorStudy'){
              // supermanAnimationList
              isAdd = this.supermanAnimationList.get(item.id)
            }
            // const isAdd = this.animationList.get(item.id)
            if(!isAdd) {
              const params: ARModelAnimatorParameter = {
                category: ARAnimatorCategory.DISAPPEAR,
                // type: ARAnimatorType.NODE_TYPE,
                name: item.name,
                layerName: currentElement.layerName,
                elementID: currentElement.id,
                type: ARAnimatorType.MODEL_TYPE,
                modelAnimationIndex: item.id,

                // repeatCount: 0,
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

              // 启动动画定时器，每当上一个动画播放完2秒后重启动画
              this.animationTimer = setInterval(async () => {
                if(this.state.selectAnimationKey === item.id) {
                  await SARMap.setAnimation(currentElement.layerName, currentElement.id, -1)
                }
                await SARMap.setAnimation(currentElement.layerName, currentElement.id, id)
              },(item.duration + 2) * 1000)

              const animationItemtemp = {
                id,
                name: item.name,
                duration: item.duration,
              }

              if(this.state.selectReloaderKey === 'doctor'){
                this.animationList.set(item.id, animationItemtemp)
              } else if(this.state.selectReloaderKey === 'doctorStudy'){
                this.supermanAnimationList.set(item.id, animationItemtemp)
              }
              // this.animationList.set(item.id, animationItemtemp)
            } else {
              // 动画已经存在了
              await SARMap.setAnimation(currentElement.layerName, currentElement.id, isAdd.id)
              // 启动动画定时器，每当上一个动画播放完2秒后重启动画
              this.animationTimer = setInterval(async () => {
                if(this.state.selectAnimationKey === item.id) {
                  await SARMap.setAnimation(currentElement.layerName, currentElement.id, -1)
                }
                isAdd && await SARMap.setAnimation(currentElement.layerName, currentElement.id, isAdd.id)
              },(isAdd.duration + 2) * 1000)
            }

            if(this.state.selectType === 'action') {
              // 如果当前有动作的声音正在播放，则停止改声音的播放
              if(this.isActionSoundPlay){
                SoundUtil.stop(this.isActionSoundPlay)
                this.isActionSoundPlay = null
              }

              // 当进入模块儿的时候和当前都在播背景音乐时，才暂停背景音乐
              console.warn(this.state.isBackground + " - " + SoundUtil.isPlaying("background"))
              if(this.state.isBackground && SoundUtil.isPlaying("background")) {
                SoundUtil.stop("background", () => {
                })
              }

              SoundUtil.play(source, false, () => {
                if(this.isActionSoundPlay){
                  SoundUtil.stop(this.isActionSoundPlay)
                  this.isActionSoundPlay = null
                }
                if(this.state.isBackground) {
                  SoundUtil.play("background",true)
                }
              })
              this.isActionSoundPlay = source

            }

          }

          this.setState({
            selectAnimationKey: item.id,
            // isShowFull: true,
            // isSecondaryShow: false,
            isVideoGuideShow: false,
          })
        }}
      >
        <Image
          source={image}
          style={[
            {width: dp(33), height: dp(49),marginTop: dp(10)},
            this.state.selectAnimationKey === item.id && {
              width: dp(38),
              height: dp(53),
            }
          ]}
        />
        <View style={[
          {backgroundColor: '#000', width: '100%', height: dp(18), justifyContent: 'center', alignItems: 'center'},
          this.state.selectAnimationKey === item.id && {
            height: dp(22),
            backgroundColor: '#f24f02',
          }
        ]} >
          <Text style={[
            {fontSize:dp(10), color: '#fff'},
            this.state.selectAnimationKey === item.id && {
              color: '#fff',
            }
          ]}>{title}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  /** 合影的位置路线被选中时的选择合影地点的页面 */
  renderPhotoPositionSelected = () => {
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
          contentContainerStyle= {[{height: dp(120), alignItems: 'center'}]}
        >
          {
            this.photoRouteDate.map((item) => {
              return this.renderPhotoPositionItem(item)
            })
          }
        </ScrollView>
      </View>
    )
  }

  /** 路线里里具体的位置路线项 */
  renderPhotoPositionItem = (item: routeItemType) => {
    return (
      <TouchableOpacity
        style={[
          {
            width: dp(126),
            height: dp(82),
            marginHorizontal: dp(5),
            backgroundColor: 'rgba(255, 255, 255, 1)',
            // borderRadius: dp(8),
            overflow: 'hidden',
            // opacity: 0.9,
            // justifyContent: 'space-between',
            justifyContent: 'center',
            alignItems: 'center',
          },
          this.state.selectRouteKey === item.key && {
            shadowOffset: { width: 1, height: 1 },
            shadowColor: 'black',
            shadowOpacity: 1,
            width: dp(136),
            height: dp(89),
            backgroundColor:"#f24f02",
          },
        ]}
        onPress={() => {
          this.routeItemOnPress(item)
        }}
      >
        <Image
          source={item.image}
          style={[
            {width: dp(120), height: dp(76)},
            this.state.selectRouteKey === item.key && {
              width: dp(130),
              height: dp(83),
            }
          ]}
        />
        {/* <View style={[
          {backgroundColor: '#000', width: '100%', height: dp(20), justifyContent: 'center', alignItems: 'center'},
          this.state.selectRouteKey === item.key && {
            backgroundColor:"#f24f02",
            height: dp(23)
          },
        ]} >
          <Text style={[
            {fontSize:dp(12), color: '#fff'},
            this.state.selectRouteKey === item.key && {
              color:"#fff",
            },

          ]}>{item.name}</Text>
        </View> */}
      </TouchableOpacity>
    )
  }


  /** 合影被选中时显示的拍照页面 */
  renderPhotoShot = () => {
    return (
      <View
        style={[{
          position:'absolute',
          top: 0,
          right: dp(10),
          bottom: 0,
          justifyContent: 'center',
          alignItems: 'center',
        }]}
      >
        <TouchableOpacity
          style={{
            width: dp(56),
            height: dp(56),
            borderRadius: dp(28),
            backgroundColor: 'rgba(255, 255, 255, 1)',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
            borderColor: 'rgba(255, 255, 255, .3)',
            borderWidth: dp(3),
          }}
          onPress={this.shot}
        >
          {/* <Image
          style={{ position: 'absolute', width: '100%', height: '100%' }}
          source={getImage().icon_return}
        /> */}
        </TouchableOpacity>
      </View>
    )
  }

  /** 合影预览界面 */
  renderPhotoImage = () => {
    return (
      <View
        style={[{
          position:'absolute',
          width:"100%",
          height: '100%',
          top: 0,
          bottom:0,
          left: 0,
          right: 0,
          justifyContent: 'center',
          alignItems: 'center',
        }]}
      >
        {/* 遮罩 */}
        <View style={[{
          position:'absolute',
          width:"100%",
          height: '100%',
          top: 0,
          bottom:0,
          left: 0,
          right: 0,
          backgroundColor: "#000",
          opacity: 0.5,
        }]}></View>
        {/* 具体的内容 */}
        <View
        >
          <Image
            source={{uri:this.state.uri}}
            style={[{
              width: dp(400),
              height: dp(248),
              borderRadius: dp(15),
            }]}
          />

          <View
            style={[{
              maxWidth: dp(400),
              marginTop: dp(10),
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'transparent',
            }]}
          >
            <TouchableOpacity
              style={[styles.imageBtn]}
              onPress={this.savePhotoLocal}
            >
              <View
                style={[styles.imageBtnView]}
              >
                <Image
                  style={[styles.imageBtnImg]}
                  source={getImage().icon_save_local}
                />
              </View>

              <Text style={[styles.imageBtnText]} >
                {'保存到本地'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.imageBtn]}
              onPress={this.shareImageToWechat}
            >
              <View
                style={[styles.imageBtnView]}
              >
                <Image
                  style={[styles.imageBtnImg]}
                  source={getImage().icon_weChat}
                />
              </View>

              <Text style={[styles.imageBtnText]} >
                {'分享到微信'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.imageBtn]}
              onPress={this.cancelPhoto}
            >
              <View
                style={[styles.imageBtnView]}
              >
                <Image
                  style={[styles.imageBtnImg]}
                  source={getImage().icon_cancel02}
                />
              </View>

              <Text style={[styles.imageBtnText]} >
                {'取消'}
              </Text>
            </TouchableOpacity>

          </View>

        </View>
      </View>
    )
  }

  /** 录像被选中时的录相界面 */
  renderVideoSelected = () => {
    return (
      <View
        style={[{
          position:'absolute',
          top: 0,
          right: dp(10),
          bottom: 0,
          justifyContent: 'center',
          alignItems: 'center',
        }]}
      >
        <TouchableOpacity
          style={{
            width: dp(56),
            height: dp(56),
            borderRadius: dp(28),
            // backgroundColor: 'rgba(255, 255, 255, 1)',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
            borderColor: 'rgba(255, 255, 255, 1)',
            borderWidth: dp(2),
          }}
          onPress={this.videoRecord}
        >
          <View
            style={[{
              width: dp(28),
              height: dp(28),
              backgroundColor: '#F24F02',
              borderRadius: dp(5),
            }]}
          ></View>
        </TouchableOpacity>
      </View>
    )
  }

  /** 点击录像按钮后录像的时间显示界面 */
  renderVideotime = () => {
    const time = this.state.videoTime
    const s = time % 60
    const h = parseInt(time / (60 * 60 * 60) + "")
    const m = (time - h * (60 * 60 * 60) - s) / 60
    return (
      <View
        style={[{
          position:'absolute',
          top: dp(20),
          right: 0,
          left: 0,
          justifyContent: 'center',
          alignItems: 'center',
        }]}
      >
        <View
          style={[{
            width: dp(100),
            height: dp(24),
            backgroundColor: '#F24F02',
            borderRadius: dp(5),
            justifyContent: 'center',
            alignItems: 'center',
          }]}
        >
          <Text
            style={[{
              color: '#fff',
            }]}
          >{`${this.fixedTime(h)} : ${this.fixedTime(m)} : ${this.fixedTime(s)}`}</Text>
        </View>
      </View>
    )
  }

  /** 录像预览界面 */
  renderVideo = () => {
    return(
      <View
        style={[{
          position:'absolute',
          width:"100%",
          height: '100%',
          top: 0,
          bottom:0,
          left: 0,
          right: 0,
          justifyContent: 'center',
          alignItems: 'center',
        }]}
      >
        {/* 遮罩 */}
        <View style={[{
          position:'absolute',
          width:"100%",
          height: '100%',
          top: 0,
          bottom:0,
          left: 0,
          right: 0,
          backgroundColor: "#000",
          opacity: 0.5,
        }]}></View>
        {/* 具体的内容 */}
        <View
        >
          <Video
            source={{uri: this.state.videoUrl}}
            style={[{
              width: dp(400),
              height: dp(248),
              borderRadius: dp(15),
            }]}
            rate={this.state.rate} // 控制暂停/播放，0 代表暂停paused, 1代表播放normal.
            paused={false}
            volume={1}             // 声音的放大倍数，0 代表没有声音，就是静音muted, 1 代表正常音量 normal，更大的数字表示放大的倍数
            muted={true}           // true代表静音，默认为false.
            resizeMode='contain'   // 视频的自适应伸缩铺放行为，
            // controls={true}        //显示控制按钮
            // onLoad={this.onLoad}           // 当视频加载完毕时的回调函数
            // onLoadStart={this.loadStart}   // 当视频开始加载时的回调函数
            // onProgress={this.onProgress}   //  进度控制，每250ms调用一次，以获取视频播放的进度
            // onEnd={this.onEnd}             // 当视频播放完毕后的回调函数
            onError={this.videoError}         // 当视频不能加载，或出错后的回调函数

            repeat={true}                     // 是否重复播放
          />

          <View
            style={[{
              maxWidth: dp(400),
              marginTop: dp(10),
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'transparent',
            }]}
          >
            <TouchableOpacity
              style={[styles.imageBtn]}
              onPress={this.saveVideoLocal}
            >
              <View
                style={[styles.imageBtnView]}
              >
                <Image
                  style={[styles.imageBtnImg]}
                  source={getImage().icon_save_local}
                />
              </View>

              <Text style={[styles.imageBtnText]} >
                {'保存到本地'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.imageBtn]}
              onPress={this.shareVideoToWechat}
            >
              <View
                style={[styles.imageBtnView]}
              >
                <Image
                  style={[styles.imageBtnImg]}
                  source={getImage().icon_weChat}
                />
              </View>

              <Text style={[styles.imageBtnText]} >
                {'分享到微信'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.imageBtn]}
              onPress={this.cancelVideo}
            >
              <View
                style={[styles.imageBtnView]}
              >
                <Image
                  style={[styles.imageBtnImg]}
                  source={getImage().icon_cancel02}
                />
              </View>

              <Text style={[styles.imageBtnText]} >
                {'取消'}
              </Text>
            </TouchableOpacity>

          </View>

        </View>
      </View>
    )
  }


  /** 解说模块的按钮引导界面 */
  renderStartGuide = () => {
    const style = {
      position: 'absolute',
      backgroundColor: 'transparent',
      right: dp(105),
      top: dp(28),
      flexDirection: 'column',
      justifyContent: 'center',
      // alignItems: 'center',
      // alignSelf: 'center',
    }
    const arrowstyle = {
      position: 'absolute',
      right: -15,
      top: 12,
      borderTopWidth: 9,
      borderTopColor: 'transparent',
      borderLeftWidth: 8,
      borderLeftColor: 'rgba(0, 0, 0, .5)',
      borderRightWidth: 8,
      borderRightColor: 'transparent',
    }
    return (
      <GuideView
        title={"查看各模块应用讲解"}
        style={style}
        type={1}
        arrowstyle={arrowstyle}
        winstyle={{backgroundColor: 'rgba(0, 0, 0, .5)'}}
        titlestyle={{color: 'white'}}
        delete={false}
        deleteAction={() =>{
          return {}
        }}
      />
    )
  }

  /** 录屏模块的选择动画引导界面 */
  renderVideoGuide = () => {
    const style = {
      position: 'absolute',
      backgroundColor: 'transparent',
      left: dp(185),
      bottom: dp(110),
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
    }
    const arrowstyle = {
      position: 'absolute',
      left:50,
      bottom: -17,
      borderTopWidth: 9,
      borderTopColor: 'rgba(0, 0, 0, .5)',
      borderLeftWidth: 8,
      borderLeftColor: 'transparent',
      borderRightWidth: 8,
      borderRightColor: 'transparent',
    }

    const winstyle = {
      backgroundColor: 'rgba(0, 0, 0, .5)',
      paddingHorizontal: dp(17),
      paddingVertical: dp(11),
    }

    return (
      <GuideView
        title={this.state.videoGuideText}
        style={style}
        type={1}
        arrowstyle={arrowstyle}
        // winstyle={{backgroundColor: 'rgba(0, 0, 0, .5)'}}
        winstyle={winstyle}
        titlestyle={{color: 'white'}}
        delete={false}
        deleteAction={() =>{
          return {}
        }}
      />
    )
  }

  render() {
    return (
      <>

        {/* 右边按钮的响应界面 */}
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            height: '100%',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            // alignItems: 'flex-end',
          }}
        >
          <Animated.View
            style={{
              bottom: this.state.btBottom,
              // flexDirection: 'row',
              width: '100%',
              height: dp(130),
            }}
          >
            {!this.state.isShowFull && this.state.isSecondaryShow && this.state.selectType === 'speak' && this.ARModel && this.renderSpeakSelected()}
            {/* {!this.state.isShowFull && this.state.isSecondaryShow && this.state.selectType === 'action' && this.renderActionSelected()} */}
            {!this.state.isShowFull && this.state.isSecondaryShow && this.state.selectType === 'action' && this.renderActionSelected()}
            {!this.state.isShowFull && this.state.isSecondaryShow && this.state.selectType === 'reloader' && this.renderReloaderSelected()}
            {this.state.isShowFull && this.state.isSecondaryShow && ((this.state.selectType === 'video' || this.state.selectType === 'photo') && this.state.photoBtnKey === 'action') && this.renderActionSelected()}
            {this.state.isShowFull && this.state.isSecondaryShow && ((this.state.selectType === 'video' || this.state.selectType === 'photo') && this.state.photoBtnKey === 'position') && this.renderPhotoPositionSelected()}

          </Animated.View>

        </View>

        {/* 右边按钮 */}
        <View
          style={{
            position: 'absolute',
            right: 0,
            width: '100%',
            height: '100%',
            // justifyContent: 'center',
            alignItems: 'flex-end',
          }}
        >
          <Animated.View
            style={{
              right: this.state.btRight,
              flexDirection: 'row',
              width: dp(90),
              height: '100%',
            }}
          >
            {/* {!this.state.isShowFull && !this.state.showGuide && this.renderSpeak()}
            {!this.state.isShowFull && !this.state.showGuide && this.renderFunctionList()} */}
            {!this.state.isShowFull && !this.state.showGuide && this.renderSideBar()}

            {/* 拍照按钮 */}
            {this.state.isShowFull && this.state.selectType === 'photo' && this.state.videoUrl === 'null' && this.state.uri === 'null' && this.renderPhotoShot()}
            {/* 录像按钮 */}
            {this.state.isShowFull && this.state.selectType === 'video' && this.state.videoUrl === 'null' && this.state.uri === 'null' && this.renderVideoSelected()}
          </Animated.View>

        </View>

        {/* 扫描界面 */}
        {!this.state.isShowFull && this.state.showScan && this.renderScan()}
        {/* 左边按钮 */}
        <Animated.View
          style={{
            position: 'absolute',
            // top: dp(20),
            left: this.state.btLeft,
            width: dp(50),
            height: "100%",
            overflow: 'hidden',
          }}
        >
          {!this.state.isShowFull && !this.state.showGuide && !this.state.showScan && this.renderScanBtn()}
          {!this.state.isVideoStart && !this.state.showGuide && this.state.videoUrl === 'null' && this.state.uri === 'null' && this.renderBackBtn()}
          {this.state.isShowFull && (this.state.selectType === 'video' || this.state.selectType === 'photo') && this.state.videoUrl === 'null' && this.state.uri === 'null' && !this.state.isRoutePlay && this.renderPhotoBtn()}
          {this.state.isShowFull && (this.state.selectType === 'video' || this.state.selectType === 'photo') && this.state.videoUrl === 'null' && this.state.uri === 'null' && !this.state.isRoutePlay && this.renderRouteBtn()}
          {this.state.isShowFull && this.state.selectType === 'photo' && this.state.videoUrl === 'null' && this.state.uri === 'null' && !this.state.isVideoStart && !this.state.isRoutePlay && this.renderOperationBtn()}

        </Animated.View>

        {/* 合影预览界面 */}
        {this.state.selectType === 'photo' && this.state.uri !== 'null' && this.renderPhotoImage()}

        {/* 录屏的预览和录像中界面 */}
        {this.state.isShowFull && this.state.selectType === 'video' && this.state.videoTime >= 0 && this.renderVideotime()}
        {this.state.selectType === 'video' && this.state.videoUrl !== 'null' && this.renderVideo()}


        {/* 解说模块的按钮引导 */}
        {!this.state.showScan && !this.state.showGuide && this.state.isSpeakGuideShow && this.renderStartGuide()}

        {this.state.isShowFull && this.state.selectType === 'video' && this.state.photoBtnKey === 'action' && this.state.isVideoGuideShow && this.renderVideoGuide()}

        <ARArrow
          arrowShowed={() => {
            Toast.show('请按照箭头引导转动屏幕查看内容')
          }}
        />

        <ARGuide
          show={this.state.showGuide}
          animationName={'Ar超超博士'}
          onSkip={() => {
            this.showGuide(false)
          }}
          onGuideEnd={() => {
            SARMap.stopARAnimation()
            // const globlaPose = getGlobalPose()
            // if(globlaPose != null) {
            //   this.start(globlaPose)
            // }
          }}
        />

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
    width: dp(50),
    height: dp(55),
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: '#000',
    // borderRightWidth: dp(2),
    // borderRightColor: '#fff',
    opacity: 0.6
  },
  functionItemImageView: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    width: dp(50),
    height: dp(42),
    // borderRightWidth: dp(2),
    // borderRightColor: '#fff',
  },
  functionItemImagee: {
    // position: 'absolute',
    width:  dp(30),
    height:  dp(30),
  },
  functionItemText: {
    fontSize:10,
    color: '#fff',
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

  imageBtn: {
    width: dp(60),
    height: dp(70),
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginHorizontal: dp(10),
  },
  imageBtnView: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    width: dp(45),
    height: dp(45),
    backgroundColor: '#000',
    opacity: 0.7,
    borderRadius: dp(10),
  },
  imageBtnImg: {
    position: 'absolute',
    width: dp(26),
    height: dp(26)
  },
  imageBtnText: {
    marginTop: dp(5),
    fontSize:10,
    color: '#fff',
  },

})

export default DoctorCC