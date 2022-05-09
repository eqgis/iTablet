import React from 'react'
import { View, Image, StyleSheet, Animated, TouchableOpacity, Text } from 'react-native'
import { dp, Toast} from '../../utils'
import { getThemeAssets } from '../../assets'
import { getLanguage } from '../../language'
import HardwareBackHandler from '../../components/HardwareBackHandler'
interface IProps {
  imageTrackingresultTag: string
  onBack?: () => void
  onSuccess?: () => void
}
interface IState {
  scanning: boolean
}

class AREnhancePosition extends React.Component<IProps, IState> {
  animValue = new Animated.Value(0)
  scanAnimation = Animated.timing(this.animValue, {
    toValue: 1,
    duration: 2000,
    useNativeDriver: true,
  })
  timer: any = null
  constructor(props: IProps){
    super(props)
    this.state = {
      scanning: false,
    }
  }
  componentDidMount(){
    this.setState({
      scanning: true,
    })
    this.startAnimation()
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

  startScan = () =>{
    this.startAnimation()
    const result = this.props.imageTrackingresultTag
    setTimeout(()=>{
      if(result === 'ImageTracking success') {
        // 校准成功
        Toast.show(getLanguage(global.language).Profile.CALIBRATION_SUCCESSFUL)
        this.props.onSuccess?.()
      } else {
        // 校准超时
        Toast.show(getLanguage(global.language).Profile.CALIBRATION_TIMEOUT)
      }
    }, 800)

  }

  render() {
    const transY = this.animValue.interpolate({
      inputRange: [0,1],
      outputRange: [dp(0), dp(256 - 30)],
    })
    const opacity = this.animValue.interpolate({
      inputRange: [0,0.25,0.75,1],
      outputRange: [0,1,1,0],
    })

    return (
      <View style={styles.container}>
        <View style={[styles.col, styles.centerCol]}>
          <View style={styles.window}>
            {/* 提示如何操作部分 */}
            <View style={[styles.col]}>
              <Image source={getThemeAssets().collection.scan_tip} style={styles.scanTip}/>
              <Text style={styles.tip}>{getLanguage(global.language).Profile.ALIGN_LOCATOR_CODE}</Text>
            </View>
            {/* 扫描的动画 */}
            <Animated.Image source={getThemeAssets().collection.bg_scan_line} style={[styles.line, {
              opacity,
              transform: [{translateY: transY}]
            }]}/>
          </View>
        </View>

        <TouchableOpacity style={styles.closeBtn} onPress={()=>{
          this.timer && clearTimeout(this.timer)
          this.props.onBack?.()
        }}>
          <Image source={getThemeAssets().collection.icon_ar_scan_back} style={{width: dp(30), height: dp(30)}}/>
        </TouchableOpacity>
        <HardwareBackHandler onBackPress={()=>{return true}}/>
      </View>
    )
  }
}

export default AREnhancePosition


const SCAN_SIZE = dp(268)
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 100,
    alignItems: 'flex-start',
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
    flex: 0,
    height: SCAN_SIZE,
    width: '100%',
    flexDirection: 'row',
    marginHorizontal: 2,
  },
  window: {
    flex: 0,
    height: '100%',
    width: '100%',
    borderColor: 'rgba(200,200,200,0.6)',
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
