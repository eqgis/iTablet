/*
 Copyright © SuperMap. All rights reserved.
 Author: jiakai
 */
import * as React from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native'
import {
  scaleSize,
  screen,
} from '../../../../utils'
import { getThemeAssets } from '../../../../assets'

//气泡弹窗控件
export default class GuideView extends React.Component {
  props: {
    title: any,//显示内容
    arrowstyle: any,//弹窗风格
    style: any,//弹窗箭头风格
    type: any,//控制箭头和气泡排列顺序
    winstyle: any,//弹窗内容风格
    titlestyle:any,//显示内容风格
    delete:any,//控制是否显示删除按钮
    deleteAction:()=>{},
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
        style={[this.props.style]}>

        {this.props.type &&
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
          }, this.props.arrowstyle]} />}

        <View
          style={[{
            flexDirection:'row',
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
          },this.props.winstyle]}>
          <Text
            style={[{
              textAlign: 'left',
              fontSize: scaleSize(25),
              color: 'black',
              maxWidth: scaleSize(350),
            },this.props.titlestyle]}>
            {this.props.title}
          </Text>

          {this.props.delete &&
            <TouchableOpacity
              activeOpacity={1}
              style={ {
                marginLeft: scaleSize(20),
                height: scaleSize(40),
                width: scaleSize(40),
              }}
              onPress={() => {
                this.props.deleteAction()
              }}
            >
              <Image
                style={
                  {
                    height: scaleSize(40),
                    width: scaleSize(40),
                  }
                }
                source={getThemeAssets().home.icon_small_close}
                resizeMode={'contain'}
              />
            </TouchableOpacity>}
        </View>

        {!this.props.type &&
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
          }, this.props.arrowstyle]} />}

      </View>
    )
  }
}
