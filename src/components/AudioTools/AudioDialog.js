/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */
import React, { PureComponent } from 'react'
import { Platform } from 'react-native'
import Orientation from 'react-native-orientation'
import { AudioAnalyst, screen } from '../../utils'
import { getLanguage } from '../../language'
import { ConstPath } from '../../constants'
import AudioTopDialog from './AudioTopDialog'
import AudioCenterDialog from './AudioCenterDialog'
import AudioBottomDialog from './AudioBottomDialog'
import { SSpeechRecognizer } from 'imobile_for_reactnative'

export default class AudioDialog extends PureComponent {
  props: {
    confirmTitleStyle?: StyleSheet,
    cancelTitleStyle?: StyleSheet,
    audioSavePath?: string,
    activeOpacity?: number,
    data?: Object,
    is3D?: boolean,
    language: string,
    type: string,
    defaultText?: string,
    device: Object,
    close: () => {},
    arSearch?: boolean,
    cb?: () => {},
  }

  static defaultProps = {
    audioSavePath: ConstPath.Audio,
    activeOpacity: 0.8,
    is3D: false,
    defaultText: '',
    type: 'top',
  }

  constructor(props) {
    super(props)
    this.state = {
      type: this.props.type,
      visible: false,
      recording: false,
      content: '',
    }
    if (this.props.language === 'CN') {
      SSpeechRecognizer.setParameter('language', 'zh_cn')
    } else {
      SSpeechRecognizer.setParameter('language', 'en_us ')
    }
  }
  
  componentDidMount() {
    (async function() {
      try {
        this.initOrientation()
        await SSpeechRecognizer.addListenser({
          onBeginOfSpeech: () => {
            this.setState({ content: '', recording: true })
          },
          onEndOfSpeech: () => {
            this.setState({ recording: false })
          },
          onError: e => {
            let error = getLanguage(this.props.language).Prompt.SPEECH_ERROR
            if (e.indexOf('没有说话') !== -1) {
              error = getLanguage(this.props.language).Prompt.SPEECH_NONE
            }
            this.setState({ content: error })
          },
          onResult: ({ info, isLast }) => {
            if (isLast) return
            if(this.props.arSearch){
              this.props.cb(info)
            }else{
              this.setState({ content: info }, () => {
                setTimeout(() => {
                  AudioAnalyst.analyst(info)
                }, 1000)
              })
            }
          },
        })
        await this.startRecording()
      } catch (e) {
        () => {}
      }
    }.bind(this)())
  }

  componentWillUnmount() {
    (async function() {
      try {
        // if (!this.state.visible) {
        //   await SSpeechRecognizer.removeListener()
        // }
        this.state.recording && (await SSpeechRecognizer.stop())
        await SSpeechRecognizer.removeListener()
        if (Platform.OS === 'ios') {
          Orientation.removeSpecificOrientationListener(this.setOrientation)
        } else {
          Orientation.removeOrientationListener(this.setOrientation)
        }
      } catch (e) {
        () => {}
      }
    }.bind(this)())
  }

  componentDidUpdate(prevProps) {
    if (prevProps.language !== this.props.language) {
      if (this.props.language === 'CN') {
        SSpeechRecognizer.setParameter('language', 'zh_cn')
      } else {
        SSpeechRecognizer.setParameter('language', 'en_us ')
      }
    }
  }
  
  setOrientation = orientation => {
    if (this.AudioRef && this.AudioRef.orientationChange) {
      this.AudioRef.orientationChange(orientation)
    }
  }
  
  initOrientation = async () => {
    if (Platform.OS === 'ios') {
      Orientation.getSpecificOrientation((e, orientation) => {
        this.setOrientation(orientation)
      })
      Orientation.removeSpecificOrientationListener(this.setOrientation)
      Orientation.addSpecificOrientationListener(this.setOrientation)
    } else {
      Orientation.getOrientation((e, orientation) => {
        this.setOrientation(orientation)
      })
      Orientation.removeOrientationListener(this.setOrientation)
      Orientation.addOrientationListener(this.setOrientation)
    }
  }

  //控制Modal框是否可以展示
  setVisible = async (visible, type) => {
    let newState = { recording: false }
    if (this.state.visible !== visible) newState.visible = visible
    if (type) newState.type = type
    newState.content = visible ? this.state.content : ''
    this.setState(newState)
    if (!visible) {
      await this.stopRecording()
      this.props.close && this.props.close()
    }
  }

  startRecording = async () => {
    this.setState({
      content: '',
      recording: true,
    })
    try {
      SSpeechRecognizer.start()
    } catch (e) {
      () => {}
    }
  }

  stopRecording = async () => {
    try {
      this.state.recording && await SSpeechRecognizer.stop()
      await SSpeechRecognizer.removeListener()
    } catch (e) {
      () => {}
    }
  }

  render() {
    // if (!this.state.visible || !this.state.type) return null
    this.AudioRef
    switch (this.state.type) {
      case 'top':
        return (
          <AudioTopDialog
            ref={ref => this.AudioRef = ref}
            startRecording={this.startRecording}
            stopRecording={this.stopRecording}
            setVisible={this.setVisible}
            visible={true}
            content={this.state.content}
            recording={this.state.recording}
            defaultText={this.props.defaultText}
          />
        )
      case 'bottom':
        return (
          <AudioBottomDialog
            ref={ref => this.AudioRef = ref}
            startRecording={this.startRecording}
            stopRecording={this.stopRecording}
            setVisible={this.setVisible}
            visible={true}
            content={this.state.content}
            recording={this.state.recording}
            defaultText={this.props.defaultText}
          />
        )
      case 'center':
        return (
          <AudioCenterDialog
            ref={ref => this.AudioRef = ref}
            startRecording={this.startRecording}
            stopRecording={this.stopRecording}
            setVisible={this.setVisible}
            visible={true}
            content={this.state.content}
            recording={this.state.recording}
            defaultText={this.props.defaultText}
          />
        )
    }
  }
}
