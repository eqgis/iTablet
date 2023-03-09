import { getThemeAssets } from "@/assets"
import { AppEvent, dp, screen } from "@/utils"
import React, {Component} from "react"
import { View, Image, UIManager,  findNodeHandle, Text, PixelRatio, Platform} from 'react-native'
import { SCollector, SData, SMap, SMCollectorType } from "imobile_for_reactnative"
import styles from './styles'
import { Point2D } from "imobile_for_reactnative/types/data"


interface Props {
	// to do
	device: any,
}

interface State {
	/** 准星是否显示标识 */
	isShowAimPoint: boolean,
	/** 横坐标 */
	x: string,
	/** 纵坐标 */
	y: string,
}


class AimPointCollector extends Component<Props, State> {

  /** 准星采集的准星图片 */
  aimPointImageRef: typeof Image | null | undefined = null
  aimPointTimer: NodeJS.Timer | null | undefined = null

  constructor(props: Props) {
    super(props)
    this.state = {
      isShowAimPoint: false,
      x: 0,
      y: 0,
    }
  }

  componentDidMount = async () => {
    // 添加准星采集的准星显隐监听
    AppEvent.addListener('collector_aim_point_show', this.setAimPointVisible)
    // // 添加画点监听
    // AppEvent.addListener("collector_aim_point_add", this.draw)
  }

  /**
	 * 显隐准星采集的准星
	 * @param visible 显示与否 true为显示，false为隐藏
	 */
  setAimPointVisible = (visible: boolean) => {
    this.setState({
      isShowAimPoint: visible,
    })
    if(visible) {
      // 准星显示，准星采集的打点的监听的打点的消息  aim_point_add   在SMAp里加监听
      // 添加画点监听
      AppEvent.addListener("collector_aim_point_add", this.draw)

      if(!(this.aimPointTimer)) {
        this.aimPointTimer = setInterval(() => {
          this.aimPointLLDraw()
        },1000)
      }
    } else {
      // 移除准星采集的打点的监听
      // 移除画点监听
      AppEvent.removeListener('collector_aim_point_add',this.draw)
      if(this.aimPointTimer) {
        clearInterval(this.aimPointTimer)
        this.aimPointTimer = null
      }
    }
  }

  /**
	 * 画点监听的函数
	 * @param type  画的点的类型
	 */
  draw = (type: number) => {
    if(type === SMCollectorType.POINT_AIM_POINT     // 画点 10
      || type === SMCollectorType.LINE_AIM_POINT    // 画线 11
      || type === SMCollectorType.REGION_AIM_POINT  // 画面 12
    ) {
      this.aimPointLLDraw(this.drawPoint)
    }
  }

  /** 画点 */
  drawPoint = async (LLPoint: Point2D) => {
    await SCollector.addGPSPoint(LLPoint)
  }

  /**
	 * 获取屏幕坐标
	 */
  aimPointLLDraw = async(callback?: (mapPoint: Point2D) => void) => {
    if(this.aimPointImageRef) {
      UIManager.measure(findNodeHandle(this.aimPointImageRef),async (x: number, y: number,width: number,height: number,pageX: number,pageY: number)=>{
        // console.warn("x: " + x + "\ny: " + y + "\nwidth: " + width + "\nheight: " + height + "\npageX: " + pageX + "\npageY: " + pageY)
        // andoid 屏幕x坐标 = 屏幕宽度 * 像素密度   屏幕y坐标 = 屏幕高度 * 像素密度
        // ios 屏幕x坐标 = 屏幕宽度   屏幕y坐标 = 屏幕高度
        let pointX = pageX + width / 2
        let pointY = pageY + height / 2
        const pixel = PixelRatio.get()
        if (Platform.OS === 'android') {
          pointX *= pixel
          pointY *= pixel
        }
        const point: Point2D = {
          x: pointX,
          y: pointY,
        }
        // 屏幕坐标转地图坐标
        const mapPoint = await SMap.pixelToMap(point)
        // 获取地图的投影坐标系
        const mapPrj = await SMap.getPrjCoordSys()
        // 地图坐标转经纬度坐标
        const LLPoints = await SData.CoordSysTranslatorPrjToGPS(mapPrj, [mapPoint])
        const LLPoint = LLPoints[0]
        this.setState({
          x: (LLPoint.x).toFixed(6) || "0",
          y: (LLPoint.y).toFixed(6) || "0",
        })
        // console.warn("MapPoint: " + JSON.stringify(mapPoint))
        // 告诉原生，在指定坐标位置画点
        callback?.(LLPoint)
      })
    }

  }

  componentWillUnmount = async() => {
    // 移除准星采集的准星显隐监听
    AppEvent.removeListener('collector_aim_point_show', this.setAimPointVisible)
    // // 移除画点监听
    // AppEvent.removeListener('collector_aim_point_add',this.draw)
  }

  rendercollectorAimPoint = () => {
    const width = dp(100)
    const height = dp(70)
    let top = 0
    let left = 0
    // 竖屏
    if(this.props.device.orientation.indexOf('LANDSCAPE') >= 0) {
      left = screen.deviceHeight / 2 - width / 2
      top = screen.deviceWidth / 2 - height / 2

    } else {
      // 横屏
      left = screen.deviceWidth / 2 - width / 2
      top = screen.deviceHeight / 2 - height / 2
    }
    return (
      <View
        style={[{
          width: width,
          height: height,
          position: 'absolute',
          left: left,
          top: top,
          // backgroundColor: '#0ff',
          justifyContent: 'center',
          alignItems: 'center',
        }]}
      >
        <Image
          ref={(ref: typeof Image) => {
            this.aimPointImageRef = ref
          }}
          source={getThemeAssets().mark.icon_aim_point}
          style= {[{
            // backgroundColor:'#ff0',
            width: dp(60),
            height: dp(60),
          }]}
        />
        {/* 准星对应的地图坐标显示 */}
        <View style={[styles.textContainer]}>
          <Text style={[styles.textstyle]}>{"X: " + this.state.x}</Text>
          <Text style={[styles.textstyle]}>{"Y: " + this.state.y}</Text>
        </View>
      </View>
    )
  }


  render() {
    if(this.state.isShowAimPoint) {
      return this.rendercollectorAimPoint()
    } else {
      return null
    }
  }
}

export default AimPointCollector