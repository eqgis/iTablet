/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */
import React, { PureComponent } from 'react'
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
  Animated,
} from 'react-native'
import { scaleSize, screen } from '../../utils'
import { size, color } from '../../styles'
import { ConstPath } from '../../constants'

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    backgroundColor: 'transparent',
    zIndex: 1000,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(48,48,48,0.5)',
  },
  dialogStyle: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? scaleSize(150) : scaleSize(130),
    borderRadius: scaleSize(20),
    maxHeight: scaleSize(200),
    backgroundColor: 'white',
    flexDirection: 'column',
    elevation: 20,
    shadowOffset: { width: 0, height: 0 },
    shadowColor: 'black',
    shadowOpacity: 1,
    shadowRadius: 5,
    alignItems: 'center',
  },
  allContentStyle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: 'yellow',
  },
  contentView: {
    padding: scaleSize(20),
    borderRadius: scaleSize(20),
    // marginHorizontal: scaleSize(30),
    height: scaleSize(210),
  },
  topView: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    height: scaleSize(50),
    paddingHorizontal: scaleSize(20),
    alignItems: 'center',
  },
  topImage: {
    width: scaleSize(40),
    height: scaleSize(40),
  },
  content: {
    fontSize: size.fontSize.fontSizeMd,
    backgroundColor: 'transparent',
    marginTop: scaleSize(30),
  },
  tip: {
    fontSize: size.fontSize.fontSizeXl,
    lineHeight: scaleSize(30),
    backgroundColor: 'transparent',
    textAlign: 'left',
    paddingTop: scaleSize(20),
    color: color.contentColorBlack,
  },
  closeBtn: {
    marginTop: scaleSize(100),
    height: scaleSize(60),
    width: scaleSize(60),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  closeImage: {
    height: scaleSize(40),
    width: scaleSize(40),
  },
  audioBtn: {
    height: scaleSize(100),
    width: scaleSize(100),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  audioImage: {
    height: scaleSize(100),
    width: scaleSize(100),
  },
})

export default class AudioTopDialog extends PureComponent {
  props: {
    startRecording: () => {},
    stopRecording: () => {},
    setVisible: () => {},
    confirmTitleStyle?: StyleSheet,
    cancelTitleStyle?: StyleSheet,
    audioSavePath?: string,
    content?: string,
    defaultText?: string,
    activeOpacity?: number,
    visible?: boolean,
    recording?: boolean,
  }

  static defaultProps = {
    audioSavePath: ConstPath.Audio,
    activeOpacity: 0.8,
    visible: false,
    recording: false,
    content: '',
    defaultText: '',
  }

  constructor(props) {
    super(props)
    this.state = {
      visible: props.visible,
      content: props.content,
      recording: props.recording,
    }
    this.left = new Animated.Value(this.getFixDistance())
    this.right = new Animated.Value(this.getFixDistance())
    this.top = new Animated.Value(this.getTopDistance())
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.content !== this.props.content ||
      prevProps.recording !== this.props.recording
    ) {
      this.setState({
        content: this.props.content,
        recording: this.props.recording,
      })
    }

    // if (
    //   JSON.stringify(prevProps.device) !== JSON.stringify(this.props.device)
    // ) {
    //   this.onOrientationChange()
    // }
  }

  orientationChange = orientation => {
    Animated.parallel([
      Animated.timing(this.left, {
        toValue: this.getFixDistance(orientation),
        duration: 0,
        useNativeDriver: false,
      }),
      Animated.timing(this.right, {
        toValue: this.getFixDistance(orientation),
        duration: 0,
        useNativeDriver: false,
      }),
      Animated.timing(this.top, {
        toValue: this.getTopDistance(orientation),
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start()
  }

  //控制Modal框是否可以展示
  setVisible = visible => {
    if (this.props.setVisible) {
      this.props.setVisible()
    } else {
      if (this.state.visible === visible) return
      this.setState({
        visible: visible,
        content: '',
      })
      !visible && this.props.stopRecording && this.props.stopRecording()
    }
  }

  getFixDistance = (orientation = '') => {
    let distance = scaleSize(30)
    if (orientation.indexOf('PORTRAIT') < 0) {
      let width = Math.abs(screen.getScreenHeight() - screen.getScreenWidth())
      distance = width / 2 + scaleSize(30)
    }
    return distance
  }

  getTopDistance = (orientation = '') => {
    let distance = screen.getHeaderHeight(orientation) + scaleSize(20)
    return distance
  }

  renderTop = () => {
    if (!this.state.recording) return null
    return (
      <View style={styles.topView}>
        <Image
          resizeMode={'contain'}
          style={styles.topImage}
          accessible={true}
          accessibilityLabel={'语音'}
          source={require('../../assets/public/icon-audio.png')}
        />
        <Text>正在听</Text>
      </View>
    )
  }

  renderAudioBtn = () => {
    // let image = this.state.recording
    //   ? require('../../assets/public/icon-audio.png')
    //   : require('../../assets/public/icon-recording.png')
    if (this.state.recording) {
      return (
        <View style={styles.audioBtn} />
      )
    }
    return (
      <TouchableOpacity
        activeOpacity={this.props.activeOpacity}
        style={styles.audioBtn}
        onPress={this.props.startRecording}
      >
        <Image
          resizeMode={'contain'}
          style={styles.audioImage}
          accessible={true}
          accessibilityLabel={'语音'}
          source={require('../../assets/public/icon-recording.png')}
        />
      </TouchableOpacity>
    )
  }

  renderCloseBtn = () => {
    return (
      <TouchableOpacity
        activeOpacity={this.props.activeOpacity}
        style={styles.closeBtn}
        onPress={() => this.setVisible(false)}
      >
        <Image
          resizeMode={'contain'}
          style={styles.closeImage}
          accessible={true}
          accessibilityLabel={'语音'}
          source={require('../../assets/map/icon-arrow-up.png')}
        />
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <Animated.View
        style={[styles.dialogStyle, { left: this.left, right: this.right, top: this.top }]}
      >
        {this.renderTop()}
        <View style={styles.allContentStyle}>
          <ScrollView style={styles.contentView}>
            {/* <Text style={styles.content}>{this.state.content}</Text>
            {this.state.content === '' && (
              <Text style={styles.tip}>{this.props.defaultText}</Text>
            )} */}
            {this.state.content !== '' ?
              (<Text style={styles.content}>{this.state.content}</Text>) :
              (
                <Text style={styles.tip}>{this.props.defaultText}</Text>
              )}
          </ScrollView>
          {this.renderAudioBtn()}
          {this.renderCloseBtn()}
        </View>
      </Animated.View>
    )
  }
}
