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
import GuideView from '../GuideView'
import { getLanguage } from '../../../../language/index'
import { MTBtn } from '../../../../components'
import styles from './styles'
import { getThemeAssets } from '../../../../assets'

import ARMeasureData from '../../components/ToolBar/modules/arMeasure/ARMeasureData'
import ToolbarModule from '../../components/ToolBar/modules/ToolbarModule'

//AR测图引导界面
export default class GuideViewMapArMappingModel extends React.Component {
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
      measure: true,
      tool:false,
      backgroundStyle:{},
    }
  }

  componentDidMount() {

  }

  renderMeasureGuide = () => {
      return (
        <GuideView
          title={getLanguage(this.props.language).Profile.MEASURE_GUIDE}
          style={{
            position: 'absolute',
            backgroundColor: 'transparent',
            top: scaleSize(350) + screen.getIphonePaddingTop(),
            right: scaleSize(120),
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
          }}
        />
      )
  }

  renderToolGuide = () => {
    return (
      <GuideView
        title={getLanguage(this.props.language).Profile.CHOOSE_MEASURE_TYPE}
        style={{
          position: 'absolute',
          alignItems: 'center',
          alignSelf: 'center', 
          bottom:Platform.OS === 'ios' ? scaleSize(110) : scaleSize(110),
        }}
        arrowstyle={{
          borderTopWidth: 9,
          borderTopColor: 'white',
          borderLeftWidth: 8,
          borderLeftColor: 'transparent',
          borderRightWidth: 8,
          borderRightColor: 'transparent',
        }}
      />
    )
  }

  renderMeasurebackgr = () => {
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
          title={getLanguage(GLOBAL.language).Map_Main_Menu.MAP_AR_MEASURE}
          textColor={'black'}
          textStyle={{ fontSize: scaleSize(20), marginTop: scaleSize(8) }}
          size={MTBtn.Size.NORMAL}
          image={getThemeAssets().functionBar.icon_tool_ar_measure}
          activeOpacity={0.5}
        // separator={scaleSize(2)}
        />
      </View>
    )
  }

  next = () => {
    if(this.state.measure){
      this.setState({
        measure:false,
        tool:true,
        backgroundStyle: { opacity: 0.2 },
      })
      const params = ToolbarModule.getParams()
      const _data = ARMeasureData.getData()
      const containerType = ToolbarType.table
      const data = ToolbarModule.getToolbarSize(containerType, {
        data: _data.data,
      })
      params.showFullMap && params.showFullMap(true)
      params.setToolbarVisible(true, ConstToolType.SM_MAP_AR_MEASURE, {
        containerType,
        isFullScreen: true,
        data: _data.data,
        ...data,
      })
    }else{
      ToolbarModule.getParams().setToolbarVisible(false)
      this.props.setMapArMappingGuide(false)
    }
  }

  skip = () => {
    ToolbarModule.getParams().setToolbarVisible(false)
    this.props.setMapArMappingGuide(false)
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
          style={[{
            position: 'absolute',
            backgroundColor: 'black',
            width: '100%',
            height: '100%',
            opacity: 0.8,
          },this.state.backgroundStyle]} />
        {this.state.measure && this.renderMeasureGuide()}
        {this.state.tool && this.renderToolGuide()}

        {this.state.measure&&this.renderMeasurebackgr()}

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
            top: scaleSize(30) + screen.getIphonePaddingTop(),
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
