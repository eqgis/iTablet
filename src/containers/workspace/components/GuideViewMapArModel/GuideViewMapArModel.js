/*
 Copyright © SuperMap. All rights reserved.
 Author: jiakai
 */
import * as React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
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

//ar地图引导界面
export default class GuideViewMapArModel extends React.Component {
  props: {
    mapArGuide: Boolean,
    mapArMappingGuide: Boolean,
    language: any,
    setMapArGuide: () => {},
    setMapArMappingGuide: () => {},
  }


  constructor(props) {
    super(props)
    this.state = {
      effect: true,
      launch: false,
    }
  }

  componentDidMount() {

  }

  renderMapArEffectGuide = () => {
    if (GLOBAL.Type === ChunkType.MAP_AR) {
      return (
        <GuideView
          title={getLanguage(this.props.language).Profile.EFFECT_GUIDE}
        />
      )
    }
  }

  renderMapArLaunchGuide = () => {
    if (GLOBAL.Type === ChunkType.MAP_AR) {
      return (
        <GuideView
          title={getLanguage(this.props.language).Profile.LAUNCH_GUIDE}
          style={{ top: scaleSize(440) + screen.getIphonePaddingTop() }}
        />
      )
    }
  }

  renderEffectBackgr = () => {
    return (
      <View
        style={{
          position: 'absolute',
          backgroundColor: 'white',
          top: scaleSize(340) + screen.getIphonePaddingTop(),
          right: scaleSize(20),
          width: scaleSize(100),
          height: scaleSize(100),
          borderRadius: scaleSize(50),
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <MTBtn
          style={styles.btn}
          imageStyle={styles.btnImage}
          key={0}
          title={getLanguage(GLOBAL.language).Map_Main_Menu.MAP_AR_EFFECT}
          textColor={'black'}
          textStyle={{ fontSize: scaleSize(20), marginTop: scaleSize(8) }}
          size={MTBtn.Size.NORMAL}
          image={getThemeAssets().functionBar.icon_ar_special_effects}
          activeOpacity={0.5}
        // separator={scaleSize(2)}
        />
      </View>
    )
  }

  renderLaynchBackgr = () => {
    return (
      <View
        style={{
          position: 'absolute',
          backgroundColor: 'white',
          top: scaleSize(440) + screen.getIphonePaddingTop(),
          right: scaleSize(20),
          width: scaleSize(100),
          height: scaleSize(100),
          borderRadius: scaleSize(50),
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <MTBtn
          style={styles.btn}
          imageStyle={styles.btnImage}
          key={0}
          title={getLanguage(GLOBAL.language).Map_Main_Menu.MAP_AR_TOOL}
          textColor={'black'}
          textStyle={{ fontSize: scaleSize(20), marginTop: scaleSize(8) }}
          size={MTBtn.Size.NORMAL}
          image={getThemeAssets().functionBar.icon_tool_launch}
          activeOpacity={0.5}
        // separator={scaleSize(2)}
        />
      </View>
    )
  }


  next = () => {
    if (!this.state.launch) {
      this.setState({
        effect: false,
        launch: true,
      })
    } else {
      this.props.setMapArGuide(false)
    }
  }

  skip = () => {
    this.props.setMapArGuide(false)
  }

  render() {
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
        {this.state.effect && this.renderMapArEffectGuide()}
        {this.state.launch && this.renderMapArLaunchGuide()}

        {this.state.effect && this.renderEffectBackgr()}
        {this.state.launch && this.renderLaynchBackgr()}

        <TouchableOpacity
          style={{
            position: 'absolute',
            right: scaleSize(50),
            bottom: scaleSize(50),
            backgroundColor: 'white',
            borderRadius: scaleSize(20),
            opacity: 0.8,
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
            right: scaleSize(50),
            top: scaleSize(50),
            backgroundColor: 'white',
            borderRadius: scaleSize(20),
            opacity: 0.8,
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
