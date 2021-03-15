/*
 Copyright © SuperMap. All rights reserved.
 Author: jiakai
 */
import * as React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
} from 'react-native'
import {
  scaleSize,
  screen,
} from '../../../../utils'
import {
  ConstPath,
  ConstToolType,
  TouchType,
  ToolbarType,
  ChunkType,
  MapHeaderButton,
  Const,
} from '../../../../constants'
import GuideView from '../../components/GuideView'
import { getLanguage } from '../../../../language/index'
import { MTBtn } from '../../../../components'
import styles from './styles'
import { getThemeAssets } from '../../../../assets'
import NavigationService from '../../../../containers/NavigationService'
import { SMap } from 'imobile_for_reactnative'

//数据处理引导界面
export default class GuideViewMapAnalystModel extends React.Component {
  props: {
    mapAnalystGuide: Boolean,
    language: any,
    setMapAnalystGuide: () => {},
    device: any,
  }


  constructor(props) {
    super(props)
    this.state = {
      analyst: true,
      process: false,
    }
  }

  componentDidMount() {

  }

  renderAnalystGuide = () => {
    let style, arrowstyle
    if (this.props.device.orientation.indexOf('LANDSCAPE') !== 0) {
      style = {
        top: scaleSize(500) + this.iosTop,
        position: 'absolute',
        backgroundColor: 'transparent',
        right: scaleSize(120),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
      }
      arrowstyle = {}
    } else {
      style = {
        bottom: scaleSize(110),
        position: 'absolute',
        backgroundColor: 'transparent',
        left: screen.getScreenWidth() / 2 - scaleSize(40),
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
      }
      arrowstyle = {
        borderTopWidth: 9,
        borderTopColor: 'white',
        borderLeftWidth: 8,
        borderLeftColor: 'transparent',
        borderRightWidth: 8,
        borderRightColor: 'transparent',
      }
    }
    return (
      <GuideView
        title={getLanguage(this.props.language).Profile.ANALYST_GUIDE}
        style={style}
        arrowstyle={arrowstyle}
      />
    )
  }

  renderProcessGuide = () => {
    let style, arrowstyle
    if (this.props.device.orientation.indexOf('LANDSCAPE') !== 0) {
      style = {
        top: scaleSize(600) + this.iosTop,
        position: 'absolute',
        backgroundColor: 'transparent',
        right: scaleSize(120),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
      }
      arrowstyle = {}
    } else {
      style = {
        bottom: scaleSize(110),
        position: 'absolute',
        backgroundColor: 'transparent',
        left: screen.getScreenWidth() / 2 + scaleSize(50),
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
      }
      arrowstyle = {
        borderTopWidth: 9,
        borderTopColor: 'white',
        borderLeftWidth: 8,
        borderLeftColor: 'transparent',
        borderRightWidth: 8,
        borderRightColor: 'transparent',
      }
    }
    return (
      <GuideView
        title={getLanguage(this.props.language).Profile.PROCESS_GUIDE}
        style={style}
        arrowstyle={arrowstyle}
      />
    )
  }

  renderAnalystBackgr = () => {
    let style
    if (this.props.device.orientation.indexOf('LANDSCAPE') !== 0) {
      style = {
        position: 'absolute',
        backgroundColor: 'white',
        top: scaleSize(490) + this.iosTop,
        right: scaleSize(20),
        width: scaleSize(100),
        height: scaleSize(100),
        borderRadius: scaleSize(50),
        alignItems: 'center',
        justifyContent: 'center',
      }
    } else {
      style = {
        position: 'absolute',
        backgroundColor: 'white',
        bottom: scaleSize(20),
        left: screen.getScreenWidth() / 2 + scaleSize(80),
        width: scaleSize(100),
        height: scaleSize(100),
        borderRadius: scaleSize(50),
        alignItems: 'center',
        justifyContent: 'center',
      }
    }
    return (
      <View
        style={style}
      >
        <MTBtn
          style={styles.btn}
          imageStyle={styles.btnImage}
          key={0}
          title={getLanguage(GLOBAL.language).Map_Main_Menu.ANALYSIS}
          textColor={'black'}
          textStyle={{ fontSize: scaleSize(20), marginTop: scaleSize(8) }}
          size={MTBtn.Size.NORMAL}
          image={getThemeAssets().functionBar.icon_tool_analysis}
          opacity={0}
        // separator={scaleSize(2)}
        />
      </View>
    )
  }

  renderProcessBackgr = () => {
    let style
    if (this.props.device.orientation.indexOf('LANDSCAPE') !== 0) {
      style = {
        position: 'absolute',
        backgroundColor: 'white',
        top: scaleSize(590) + this.iosTop,
        right: scaleSize(20),
        width: scaleSize(100),
        height: scaleSize(100),
        borderRadius: scaleSize(50),
        alignItems: 'center',
        justifyContent: 'center',
      }
    } else {
      style = {
        position: 'absolute',
        backgroundColor: 'white',
        bottom: scaleSize(20),
        left: screen.getScreenWidth() / 2 + scaleSize(205),
        width: scaleSize(100),
        height: scaleSize(100),
        borderRadius: scaleSize(50),
        alignItems: 'center',
        justifyContent: 'center',
      }
    }
    return (
      <View
        style={style}
      >
        <MTBtn
          style={styles.btn}
          imageStyle={styles.btnImage}
          key={0}
          title={getLanguage(GLOBAL.language).Map_Main_Menu.PROCESS}
          textColor={'black'}
          textStyle={{ fontSize: scaleSize(20), marginTop: scaleSize(8) }}
          size={MTBtn.Size.NORMAL}
          image={getThemeAssets().functionBar.icon_tool_handle}
          opacity={0}
        // separator={scaleSize(2)}
        />
      </View>
    )
  }


  next = async () => {
    if (!this.state.process) {
      this.setState({
        analyst: false,
        process: true,
      })
    } else {
      if (Platform.OS === 'android') {
        let sdk = await SMap.getPhoneSDK()
        if (sdk <= 24) {
          this.props.setMapAnalystGuide(false)
        } else {
          NavigationService.navigate('RegistrationDatasetPage', {})
        }
      } else {
        NavigationService.navigate('RegistrationDatasetPage', {})
      }
    }
  }

  skip = () => {
    this.props.setMapAnalystGuide(false)
  }

  render() {
    if (this.props.device.orientation.indexOf('LANDSCAPE') !== 0) {
      this.iosTop = screen.getIphonePaddingTop()
    } else {
      this.iosTop = 0
    }
    return (
      <View
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
        }}>
        <View
          style={{
            position: 'absolute',
            backgroundColor: 'black',
            width: '100%',
            height: '100%',
            opacity: 0.8,
          }} />
        {this.state.analyst && this.renderAnalystGuide()}
        {this.state.process && this.renderProcessGuide()}

        {this.state.analyst && this.renderAnalystBackgr()}
        {this.state.process && this.renderProcessBackgr()}

        <TouchableOpacity
          style={{
            position: 'absolute',
            right: scaleSize(40),
            bottom: scaleSize(30),
            backgroundColor: 'white',
            borderRadius: scaleSize(20),
            opacity: 0.8,
            borderColor: 'black',
            borderWidth: scaleSize(2),
          }}
          onPress={this.next}
        >
          <Text
            style={{
              textAlign: 'center',
              fontSize: scaleSize(25),
              color: 'black',
              fontWeight: 'bold',
              padding: scaleSize(10),
            }}>
            {getLanguage(this.props.language).Profile.MY_GUIDE_NEXT}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            position: 'absolute',
            right: scaleSize(40),
            top: scaleSize(30) + this.iosTop,
            backgroundColor: 'white',
            borderRadius: scaleSize(20),
            opacity: 0.8,
            borderColor: 'black',
            borderWidth: scaleSize(2),
          }}
          onPress={this.skip}
        >
          <Text
            style={{
              textAlign: 'center',
              fontSize: scaleSize(25),
              color: 'black',
              fontWeight: 'bold',
              padding: scaleSize(10),
            }}>
            {getLanguage(this.props.language).Profile.MY_GUIDE_SKIP}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }
}
