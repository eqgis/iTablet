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
import GuideView from '../GuideView'
import { getLanguage } from '../../../../language/index'
import styles from './styles'


//地图浏览引导界面
export default class GuideViewMapEditModel extends React.Component {
  props: {
    language: any,
    device: any,
    setMapEditGuide: () => {},
  }


  constructor(props) {
    super(props)
    this.state = {
      start: true,
      mark: false,
    }
    this.timer = null
  }

  componentDidMount() {
    this.timer = setInterval(() => {
      this.next()
    }, 5000)
  }

  componentWillUnmount() {
    if (this.timer !== null) {
      clearInterval(this.timer)
      this.timer = null
    }
  }

  renderStartGuide = () => {
    let style , arrowstyle ,left
    if (this.props.device.orientation.indexOf('LANDSCAPE') === 0) {
      if(this.props.language === 'CN'){
        left = scaleSize(400)
      }else{
        left = scaleSize(430)
      }
      style = {
        position: 'absolute',
        backgroundColor: 'transparent',
        left: screen.getScreenSafeWidth() / 2 - left,
        bottom: scaleSize(110),
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
      }
      arrowstyle = {
        borderTopWidth: 9,
        borderTopColor: '#737073',
        borderLeftWidth: 8,
        borderLeftColor: 'transparent',
        borderRightWidth: 8,
        borderRightColor: 'transparent',
      }
    }else{
      style = {
        position: 'absolute',
        backgroundColor: 'transparent',
        top: scaleSize(150) + screen.getIphonePaddingTop(),
        right: scaleSize(120),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
      }
      arrowstyle={borderLeftColor: '#737073'}
    }
    return (
      <GuideView
        title={getLanguage(this.props.language).Profile.MAP_BROWSE}
        style={style}
        arrowstyle={arrowstyle}
        winstyle={{backgroundColor: '#737073'}}
        titlestyle={{color: 'white'}}
        delete={true}
        deleteAction={this.next}
      />
    )
  }


  renderMarkGuide = () => {
    let style , arrowstyle
    if (this.props.device.orientation.indexOf('LANDSCAPE') === 0) {
      style = {
        position: 'absolute',
        backgroundColor: 'transparent',
        left: screen.getScreenSafeWidth() / 2 - scaleSize(210),
        bottom: scaleSize(110),
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
      }
      arrowstyle = {
        borderTopWidth: 9,
        borderTopColor: '#737073',
        borderLeftWidth: 8,
        borderLeftColor: 'transparent',
        borderRightWidth: 8,
        borderRightColor: 'transparent',
      }
    }else{
      style = {
        position: 'absolute',
        backgroundColor: 'transparent',
        top: scaleSize(350) + screen.getIphonePaddingTop(),
        right: scaleSize(120),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
      }
      arrowstyle = {borderLeftColor: '#737073'}
    }
    return (
      <GuideView
        title={getLanguage(this.props.language).Profile.MAP_TAGGINGL}
        style={style}
        arrowstyle={arrowstyle}
        winstyle={{backgroundColor: '#737073'}}
        titlestyle={{color: 'white'}}
        delete={true}
        deleteAction={this.next}
      />
    )
  }


  next = () => {
    if (this.state.start) {
      this.setState({
        start: false,
        mark:true,
      })
    } else if(this.state.mark){
      this.props.setMapEditGuide(false)
    }else{
      return
    }
  }

  render() {
    return (
      <View
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
        }}>

        {this.state.start && this.renderStartGuide()}

        {this.state.mark && this.renderMarkGuide()}
      </View>
    )
  }
}
