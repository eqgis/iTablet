/*
 Copyright © SuperMap. All rights reserved.
 Author: jiakai
 */
import * as React from 'react'
import {
  View,
  Text,
} from 'react-native'
import {
  scaleSize,
  screen,
} from '../../../../utils'

//气泡弹窗控件
export default class GuideView extends React.Component {
  props: {
    title: any,//显示内容
    arrowstyle: any,//弹窗风格
    style: any,//弹窗箭头风格
  }


  constructor(props) {
    super(props)
    this.state = {
      visible: true,
    }
  }

  componentDidMount() {

  }

  render() {
    return (
      <View
        style={[{
          position: 'absolute',
          backgroundColor: 'transparent',
          top: scaleSize(350) + screen.getIphonePaddingTop(),
          right: scaleSize(120),
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
        }, this.props.style]}>

        <View
          style={{
            backgroundColor: 'white',
            borderRadius: scaleSize(20),
            // height: scaleSize(80),
            // opacity: 0.5,
            justifyContent: 'center',
            alignItems: 'center',
            paddingLeft: scaleSize(30),
            paddingRight: scaleSize(30),
            paddingTop: scaleSize(20),
            paddingBottom: scaleSize(20),
          }}>
          <Text
            style={{
              textAlign: 'center',
              fontSize: scaleSize(25),
              color: 'black',
              maxWidth: scaleSize(400),
            }}>
            {this.props.title}
          </Text>
        </View>
        <View style={[{
          width: 0,
          height: 0,
          borderTopWidth: 8,
          borderTopColor: 'transparent',
          borderLeftWidth: 9,
          borderLeftColor: 'white',
          borderBottomWidth: 8,
          borderBottomColor: 'transparent',
          // opacity: 0.5,
        }, this.props.arrowstyle]} />
      </View>
    )
  }
}
