import React from 'react'
import { View, Image, StyleSheet, Animated, TouchableOpacity, Text, ScaledSize } from 'react-native'
import { SARMap } from "imobile_for_reactnative"
import { dp, Toast } from '../../utils'
import { getImage } from '../../assets'
import { getLanguage } from '../../language'
interface IProps {
  onBack?: () => void
  onSuccess?: (result:{x: number, y: number, h: number}) => void
  windowSize: ScaledSize
}
interface IState {
  scanning: boolean
}

class QRScan extends React.Component<IProps, IState> {
  animValue = new Animated.Value(0)
  scanAnimation = Animated.timing(this.animValue, {
    toValue: 1,
    duration: 2000,
    useNativeDriver: true,
  })
  scanTimes = 0
  timer: any = null
  constructor(props: IProps){
    super(props)
    this.state = {
      scanning: false,
    }
  }

  startAnimation = () => {
    this.scanAnimation.start(({ finished }) => {
      if(finished && this.state.scanning) {
        this.animValue.setValue(0)
        this.startAnimation()
      }
    })
  }

  stopAnimation = () => {
    this.scanAnimation.reset()
    this.animValue.setValue(0)
  }

  checkValid = (data: string | null | undefined) => {
    try {
      if(data == "" || data == undefined || data == null) return false
      const obj = typeof data === 'string' ? JSON.parse(data) : data
      return !isNaN(Number(obj.x))  && !isNaN(Number(obj.y)) && !isNaN(Number(obj.h))
    } catch (error) {
      return false
    }
  }

  startScan = () =>{
    this.startAnimation()
    setTimeout(()=>{
      this.repeatScan()
    },500)
    this.setState({
      scanning: true,
    })
  }

  repeatScan = async () => {
    const data = await SARMap.startScan()
    const result = this.checkValid(data)
    if(result) {
      this.stopAnimation()
      this.setState({scanning: false})
      this.props.onSuccess?.(JSON.parse(data))
    } else if(this.scanTimes < 50){
      this.scanTimes++
      this.timer = setTimeout(() => {
        this.repeatScan()
      }, 200)
    } else {
      // 失败
      this.stopAnimation()
      this.setState({scanning: false})
      this.scanTimes = 0
      Toast.show(getLanguage().MAR_AR_QR_INVALID)
    }
  }

  render() {
    const { scanning } = this.state
    const transY = this.animValue.interpolate({
      inputRange: [0,1],
      outputRange: [dp(0), dp(256 - 30)],
    })
    const opacity = this.animValue.interpolate({
      inputRange: [0,0.25,0.75,1],
      outputRange: [0,1,1,0],
    })
    const isPortrait = this.props.windowSize.height > TIP_HEIGHT + SCAN_BUTTON_HEIGHT + SCAN_SIZE
    return (
      <View style={[styles.container, !isPortrait && {flexDirection: 'row'}]}>
        <View style={[styles.col, styles.mask]}>
          <View style={{height: TIP_HEIGHT, alignItems: 'center', justifyContent: 'center'}}>
            <Image source={getImage().scan_tip} style={styles.scanTip}/>
            <Text style={styles.tip}>{getLanguage().MAP_AR_SCAN_TIP}</Text>
          </View>
        </View>

        <View style={[isPortrait ? styles.centerCol : styles.centerColL]}>
          <View style={[styles.col, styles.mask]}></View>
          <View style={styles.window}>
            <View style={[styles.corner, styles.cornerLT]}></View>
            <View style={[styles.corner, styles.cornerLB]}></View>
            <View style={[styles.corner, styles.cornerRT]}></View>
            <View style={[styles.corner, styles.cornerRB]}></View>
            <Animated.Image source={getImage().bg_scan_line} style={[styles.line, {
              opacity,
              transform: [{translateY: transY}]
            }]}/>
          </View>
          <View style={[styles.col, styles.mask]}></View>
        </View>

        <View style={[styles.col, styles.mask]}>
          {!scanning &&
          <TouchableOpacity onPress={this.startScan} style={{height: SCAN_BUTTON_HEIGHT}} >
            <Image source={getImage().icon_scanit} style={styles.scanBtn}/>
            <Text style={{color: '#ffffff', textAlign: 'center'}}>{getLanguage().MAP_AR_SCAN_IT}</Text>
          </TouchableOpacity>}
        </View>

        <TouchableOpacity style={styles.closeBtn} onPress={()=>{
          this.timer && clearTimeout(this.timer)
          this.props.onBack?.()
        }}>
          <Image source={getImage().icon_ar_scan_back} style={{width: dp(30), height: dp(30)}}/>
        </TouchableOpacity>
      </View>
    )
  }
}

export default QRScan

const TIP_HEIGHT = dp(122)
const SCAN_BUTTON_HEIGHT = dp(78)
const SCAN_SIZE = dp(268)
const CORNER_SIZE = dp(20)
const BORDER_SIZE = 3
const OFFSET = -2
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 100,
    alignItems: 'center',
  },
  mask: {
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  col: {
    flex: 1,
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerCol: {
    height: SCAN_SIZE,
    width: '100%',
    flexDirection: 'row',
    marginHorizontal: 2,
  },
  centerColL: {
    height: '100%',
    width: SCAN_SIZE,
    flexDirection: 'column',
    marginVertical: 2,
  },
  window: {
    flex: 0,
    height: SCAN_SIZE,
    width: SCAN_SIZE,
    borderColor: 'rgba(200,200,200,0.6)',
    borderWidth: 1,
  },
  corner: {
    position: 'absolute',
    height: CORNER_SIZE,
    width: CORNER_SIZE,
  },
  cornerLT: {
    borderTopColor: '#ffffff',
    borderTopWidth: BORDER_SIZE,
    borderLeftColor: '#ffffff',
    borderLeftWidth: BORDER_SIZE,
    top: OFFSET,
    left: OFFSET,
  },
  cornerLB: {
    borderBottomColor: '#ffffff',
    borderBottomWidth: BORDER_SIZE,
    borderLeftColor: '#ffffff',
    borderLeftWidth: BORDER_SIZE,
    bottom: OFFSET,
    left: OFFSET,
  },
  cornerRT: {
    borderTopColor: '#ffffff',
    borderTopWidth: BORDER_SIZE,
    borderRightColor: '#ffffff',
    borderRightWidth: BORDER_SIZE,
    top: OFFSET,
    right: OFFSET,
  },
  cornerRB: {
    borderBottomColor: '#ffffff',
    borderBottomWidth: BORDER_SIZE,
    borderRightColor: '#ffffff',
    borderRightWidth: BORDER_SIZE,
    bottom: OFFSET,
    right: OFFSET,
  },
  line: {
    width: '100%',
    height: dp(30),
  },
  scanTip: {
    width: dp(84),
    height: dp(84)
  },
  scanBtn: {
    width: dp(60),
    height: dp(60)
  },
  closeBtn: {
    position: 'absolute',
    top: dp(30),
    left: dp(10),
  },
  tip: {
    color: '#ffffff',
    marginTop: dp(20),
  },
})
