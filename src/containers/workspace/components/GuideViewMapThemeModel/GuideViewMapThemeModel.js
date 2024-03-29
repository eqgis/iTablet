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
  Image,
} from 'react-native'
import {
  scaleSize,
  screen,
} from '../../../../utils'
import { getLanguage } from '../../../../language/index'
import { MTBtn } from '../../../../components'
import styles from './styles'
import { getThemeAssets } from '../../../../assets'



//专题制图引导界面
export default class GuideViewMapThemeModel extends React.Component {
  props: {
    mapArGuide: Boolean,
    mapArMappingGuide: Boolean,
    language: any,
    setMapArGuide: () => {},
    setMapArMappingGuide: () => {},
    setThemeGuide: () => {},
    device: any,
  }


  constructor(props) {
    super(props)
    this.state = {
      count:1,
      title: getLanguage(this.props.language).Profile.ADD_THEME_DATA,
      nextText: getLanguage(this.props.language).Profile.MY_GUIDE_NEXT + '(1/2)',
      sourceImage:getThemeAssets().home.map_add_data,
      rightsourceImage:getThemeAssets().functionBar.icon_tool_add,
      rightTitle:getLanguage(global.language).Map_Main_Menu.OPEN,
      rightViewStyle: {},
      guideStyle: {},
      // landguideStyle: {},
      // landrightViewStyle: {},
      landguideStyle:{left: screen.getScreenSafeWidth('LANDSCAPE') / 2 - scaleSize(290)},
      landrightViewStyle:{left: screen.getScreenSafeWidth('LANDSCAPE') / 2 + scaleSize(100)},
      landSize:- scaleSize(60),
    }
  }

  componentDidMount() {

  }


  renderAddGuide = () => {
    return (
      <View
        style={[{
          position: 'absolute',
          height: scaleSize(500),
          width: scaleSize(400),
          top: scaleSize(340) + screen.getIphonePaddingTop(),
          right: scaleSize(140),
          // justifyContent: 'center',
          alignItems: 'center',
        },this.state.guideStyle]}
      >

        <View
          style={{
            position: 'absolute',
            backgroundColor: 'white',
            borderRadius: scaleSize(20),
            height: scaleSize(400),
            width: scaleSize(400),
            alignItems: 'center',
          }}
        >

          {/* <Image
          style={
            {
              position: 'absolute',
              height: scaleSize(400),
              width: scaleSize(400),
            }}
          source={getThemeAssets().home.map_bgboard}
          resizeMode={'stretch'}
        /> */}

          <Text
            style={{
              marginTop: scaleSize(30),
              textAlign: 'left',
              fontSize: scaleSize(25),
              color: 'black',
              fontWeight: 'bold',
              textAlignVertical: 'center',
              maxWidth: scaleSize(360),
            }}
          >
            {this.state.title}
          </Text>

          <Image
            style={
              {
                height: scaleSize(200),
                width: scaleSize(350),
              }
            }
            source={this.state.sourceImage}
            resizeMode={'contain'}
          />

          <TouchableOpacity
            style={{
              backgroundColor: '#505050',
              borderRadius: scaleSize(50),
              width: scaleSize(220),
              height: scaleSize(60),
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={this.next}
          >
            <Text
              style={{
                textAlign: 'center',
                fontSize: scaleSize(25),
                color: 'white',
                fontWeight: 'bold',
              }}
            >
              {this.state.nextText}
            </Text>
          </TouchableOpacity>

        </View>


        <TouchableOpacity
          style={{
            position: 'absolute',
            bottom: scaleSize(10),
            width: scaleSize(60),
            height: scaleSize(60),
          }}
          onPress={this.skip}
        >
          <Image
            style={
              {
                width: scaleSize(50),
                height: scaleSize(50),
              }}
            source={getThemeAssets().home.icon_map_close}
            resizeMode={'stretch'}
          />
        </TouchableOpacity>

      </View>
    )
  }

  renderAddRight = () => {
    return (
      <View
        style={[{
          position: 'absolute',
          backgroundColor: 'white',
          top: scaleSize(295) + screen.getIphonePaddingTop(),
          right: scaleSize(20),
          width: scaleSize(100),
          height: scaleSize(100),
          borderRadius: scaleSize(50),
          alignItems: 'center',
          justifyContent: 'center',
        },this.state.rightViewStyle]}
      >
        <MTBtn
          style={styles.btn}
          imageStyle={styles.btnImage}
          key={0}
          title={this.state.rightTitle}
          textColor={'black'}
          textStyle={{ fontSize: scaleSize(20), marginTop: scaleSize(8) }}
          size={MTBtn.Size.NORMAL}
          image={this.state.rightsourceImage}
          opacity={0}
        // separator={scaleSize(2)}
        />
      </View>
    )
  }

  renderAddGuideLand = () => {
    return (
      <View
        style={[{
          position: 'absolute',
          height: scaleSize(500),
          width: scaleSize(400),
          bottom: scaleSize(40),
          left: screen.getScreenSafeWidth() / 2 - scaleSize(510),
          // justifyContent: 'center',
          alignItems: 'center',
        },this.state.landguideStyle]}
      >

        <View
          style={{
            position: 'absolute',
            backgroundColor: 'white',
            borderRadius: scaleSize(20),
            height: scaleSize(400),
            width: scaleSize(400),
            alignItems: 'center',
          }}
        >

          {/* <Image
          style={
            {
              position: 'absolute',
              height: scaleSize(400),
              width: scaleSize(400),
            }}
          source={getThemeAssets().home.map_bgboard01}
          resizeMode={'stretch'}
        /> */}

          <Text
            style={{
              marginTop: scaleSize(30),
              textAlign: 'left',
              fontSize: scaleSize(25),
              color: 'black',
              fontWeight: 'bold',
              textAlignVertical: 'center',
              maxWidth: scaleSize(360),
            }}
          >
            {this.state.title}
          </Text>

          <Image
            style={
              {
                height: scaleSize(200),
                width: scaleSize(350),
              }
            }
            source={this.state.sourceImage}
            resizeMode={'contain'}
          />

          <TouchableOpacity
            style={{
              backgroundColor: '#505050',
              borderRadius: scaleSize(50),
              width: scaleSize(220),
              height: scaleSize(60),
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={this.next}
          >
            <Text
              style={{
                textAlign: 'center',
                fontSize: scaleSize(25),
                color: 'white',
                fontWeight: 'bold',
              }}
            >
              {this.state.nextText}
            </Text>
          </TouchableOpacity>

        </View>

        <TouchableOpacity
          style={{
            position: 'absolute',
            bottom: scaleSize(10),
            width: scaleSize(60),
            height: scaleSize(60),
          }}
          onPress={this.skip}
        >
          <Image
            style={
              {
                width: scaleSize(50),
                height: scaleSize(50),
              }}
            source={getThemeAssets().home.icon_map_close}
            resizeMode={'stretch'}
          />
        </TouchableOpacity>

      </View>
    )
  }

  renderAddRightLand = () => {
    return (
      <View
        style={[{
          position: 'absolute',
          backgroundColor: 'white',
          left: screen.getScreenSafeWidth() / 2 + this.state.landSize,
          bottom: scaleSize(20),
          width: scaleSize(100),
          height: scaleSize(100),
          borderRadius: scaleSize(50),
          alignItems: 'center',
          justifyContent: 'center',
        }]}
      >
        <MTBtn
          style={styles.btn}
          imageStyle={styles.btnImage}
          key={0}
          title={this.state.rightTitle}
          textColor={'black'}
          textStyle={{ fontSize: scaleSize(20), marginTop: scaleSize(8) }}
          size={MTBtn.Size.NORMAL}
          image={this.state.rightsourceImage}
          opacity={0}
        // separator={scaleSize(2)}
        />
      </View>
    )
  }



  next = () => {
    if(this.state.count === 1){
      this.setState({
        count:2,
        title:getLanguage(this.props.language).Profile.CHOOSE_THEME_TYPE,
        nextText:getLanguage(this.props.language).Profile.MY_GUIDE_KNOW + '(2/2)',
        sourceImage:getThemeAssets().home.map_making_thematic,
        guideStyle:{top: scaleSize(500) + screen.getIphonePaddingTop('PORTRAIT')},
        rightViewStyle:{top: scaleSize(595) + screen.getIphonePaddingTop('PORTRAIT')},
        rightTitle:getLanguage(global.language).Map_Main_Menu.THEME,
        rightsourceImage:getThemeAssets().functionBar.icon_tool_thematic,
        landguideStyle:{left: screen.getScreenSafeWidth('LANDSCAPE') / 2 - scaleSize(40)},
        landrightViewStyle:{left: screen.getScreenSafeWidth('LANDSCAPE') / 2 + scaleSize(100)},
        landSize:- scaleSize(-210),
      })
    }
    // else if(this.state.count === 2){
    //   this.setState({
    //     count:3,
    //     title:getLanguage(this.props.language).Profile.CHANGE_THEME_STYLE,
    //     nextText:getLanguage(this.props.language).Profile.MY_GUIDE_KNOW,
    //     sourceImage:getThemeAssets().home.map_style,
    //     rightViewStyle:{top: scaleSize(595) + screen.getIphonePaddingTop('PORTRAIT')},
    //     rightTitle:getLanguage(global.language).Map_Main_Menu.STYLE,
    //     rightsourceImage:getThemeAssets().functionBar.icon_tool_style,
    //     landguideStyle:{left: screen.getScreenSafeWidth('LANDSCAPE') / 2 - scaleSize(130)},
    //     landrightViewStyle:{left: screen.getScreenSafeWidth('LANDSCAPE') / 2 + scaleSize(200)},
    //     landSize:scaleSize(200),
    //   })
    // }
    else {
      this.props.setThemeGuide(false)
    }
  }

  skip = () => {
    this.props.setThemeGuide(false)
  }

  render() {
    this.isLand = false
    if (this.props.device.orientation.indexOf('LANDSCAPE') === 0) {
      this.isLand = true
    }
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
          }]} />

        {!this.isLand&&this.renderAddGuide()}

        {!this.isLand&&this.renderAddRight()}

        {this.isLand&&this.renderAddGuideLand()}

        {this.isLand&&this.renderAddRightLand()}

      </View>
    )
  }
}
