/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */
import React, { PureComponent } from 'react'
import { AudioAnalyst } from '../../utils'
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
    defaultText?: string,
    device: Object,
  }

  static defaultProps = {
    audioSavePath: ConstPath.Audio,
    activeOpacity: 0.8,
    is3D: false,
    defaultText: '',
  }

  constructor(props) {
    super(props)
    this.state = {
      type: 'top',
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

  componentWillUnmount() {
    (async function() {
      try {
        if (!this.state.visible) {
          await SSpeechRecognizer.removeListener()
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

  //控制Modal框是否可以展示
  setVisible = (visible, type) => {
    let newState = { recording: false }
    if (this.state.visible !== visible) newState.visible = visible
    if (type) newState.type = type
    newState.content = visible ? this.state.content : ''
    this.setState(newState)
    ;(async function() {
      try {
        if (visible) {
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
              this.setState({ content: info }, () => {
                setTimeout(() => {
                  AudioAnalyst.analyst(info)
                }, 1000)
              })
            },
          })
          this.startRecording()
        } else {
          await SSpeechRecognizer.removeListener()
        }
      } catch (e) {
        () => {}
      }
    }.bind(this)())
  }

  startRecording = () => {
    this.setState({
      content: '',
      recording: true,
    })
    ;(async function() {
      try {
        SSpeechRecognizer.start()
      } catch (e) {
        () => {}
      }
    }.bind(this)())
  }

  stopRecording = () => {
    (async function() {
      try {
        SSpeechRecognizer.removeListener()
      } catch (e) {
        () => {}
      }
    }.bind(this)())
  }

  render() {
    if (!this.state.visible || !this.state.type) return null
    switch (this.state.type) {
      case 'top':
        return (
          <AudioTopDialog
            ref={ref => (this.topDialog = ref)}
            startRecording={this.startRecording}
            stopRecording={this.stopRecording}
            setVisible={this.setVisible}
            visible={true}
            content={this.state.content}
            recording={this.state.recording}
            defaultText={this.props.defaultText}
            device={this.props.device}
          />
        )
      case 'bottom':
        return (
          <AudioBottomDialog
            ref={ref => (this.bottomDialog = ref)}
            startRecording={this.startRecording}
            stopRecording={this.stopRecording}
            setVisible={this.setVisible}
            visible={true}
            content={this.state.content}
            recording={this.state.recording}
            defaultText={this.props.defaultText}
            device={this.props.device}
          />
        )
      case 'center':
        return (
          <AudioCenterDialog
            ref={ref => (this.centerDialog = ref)}
            startRecording={this.startRecording}
            stopRecording={this.stopRecording}
            setVisible={this.setVisible}
            visible={true}
            content={this.state.content}
            recording={this.state.recording}
            defaultText={this.props.defaultText}
            device={this.props.device}
          />
        )
    }
  }
}
