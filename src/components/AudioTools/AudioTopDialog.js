/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */
import React, { PureComponent } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
  Animated,
} from 'react-native'
import { scaleSize } from '../../utils'
import { size } from '../../styles'
import { ConstPath } from '../../constants'

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    backgroundColor: 'transparent',
    zIndex: 1000,
    elevation: 6,
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
    flexDirection: 'row',
    elevation: 20,
    shadowOffset: { width: 0, height: 0 },
    shadowColor: 'black',
    shadowOpacity: 1,
    shadowRadius: 5,
    alignItems: 'center',
  },
  contentView: {
    padding: scaleSize(20),
    borderRadius: scaleSize(20),
    // marginHorizontal: scaleSize(30),
    height: scaleSize(200),
  },
  content: {
    fontSize: size.fontSize.fontSizeMd,
    backgroundColor: 'transparent',
  },
  tip: {
    fontSize: size.fontSize.fontSizeXl,
    lineHeight: scaleSize(30),
    backgroundColor: 'transparent',
    textAlign: 'center',
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
    device: Object,
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

    if (
      JSON.stringify(prevProps.device) !== JSON.stringify(this.props.device)
    ) {
      this.onOrientationChange()
    }
  }

  onOrientationChange = () => {
    Animated.parallel([
      Animated.timing(this.left, {
        toValue: this.getFixDistance(),
        duration: 0,
      }),
      Animated.timing(this.right, {
        toValue: this.getFixDistance(),
        duration: 0,
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

  getFixDistance = () => {
    if (this.props.device.orientation === 'PORTRAIT') {
      return scaleSize(30)
    }
    let width = this.props.device.width - this.props.device.height
    if (width < 0) {
      width = this.props.device.height - this.props.device.width
    }
    return width / 2 + scaleSize(30)
  }

  renderAudioBtn = () => {
    let image = this.state.recording
      ? require('../../assets/public/icon-recording.png')
      : require('../../assets/public/icon-audio.png')
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
          source={image}
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
    if (!this.state.visible) return null
    return (
      <View style={styles.container}>
        <TouchableOpacity
          activeOpacity={1}
          style={styles.overlay}
          onPress={() => {
            this.setVisible(false)
          }}
        />
        <Animated.View
          style={[styles.dialogStyle, { left: this.left, right: this.right }]}
        >
          <ScrollView style={styles.contentView}>
            <Text style={styles.content}>{this.state.content}</Text>
            {this.state.content === '' && (
              <Text style={styles.tip}>{this.props.defaultText}</Text>
            )}
          </ScrollView>
          {this.renderAudioBtn()}
          {this.renderCloseBtn()}
        </Animated.View>
      </View>
    )
  }
}
