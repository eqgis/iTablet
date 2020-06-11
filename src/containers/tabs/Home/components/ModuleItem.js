import React, { Component } from 'react'
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native'
import { fixedSize, fixedText } from '../../../../utils'

export default class ModuleItem extends Component {
  props: {
    downloadData: Object,
    item: Object,
    device: Object,
    oldMapModules: Array,
    importWorkspace: () => {},
    showDialog: () => {},
    getModuleItem: () => {},
    itemAction: () => {},
    setOldMapModule: () => {},
  }

  constructor(props) {
    super(props)
    this.downloading = false
    this.state = {
      isShowProgressView: false,
      progress: '',
      disabled: false,
      dialogCheck: false,
      touch: false,
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      JSON.stringify(this.state) !== JSON.stringify(nextState) ||
      JSON.stringify(this.props) !== JSON.stringify(nextProps)
    ) {
      return true
    }
    return false
  }

  setNewState = data => {
    if (!data) return
    this.setState(data)
  }

  getDialogCheck = () => {
    return this.state.dialogCheck
  }

  getDownloading = () => {
    return this.downloading
  }

  setDownloading = (downloading = false) => {
    this.downloading = downloading
  }

  _renderProgressView = () => {
    if (!this.props.downloadData) return <View />
    let value = this.props.downloadData.progress + '%'
    return (
      <View
        style={[
          {
            position: 'absolute',
            width: value,
            height: fixedSize(5),
            backgroundColor: '#4680DF',
            borderRadius: 5,
            bottom: 0,
          },
        ]}
      />
    )
  }

  render() {
    let item = this.props.item
    let image = this.state.touch ? item.moduleImageTouch : item.moduleImage
    let textColor = this.state.touch ? { color: '#4680DF' } : {}
    let isLandscape = this.props.device.orientation.indexOf('LANDSCAPE') === 0
    return (
      <View style={isLandscape ? styles.moduleViewL : styles.moduleViewP}>
        <TouchableOpacity
          activeOpacity={1}
          disabled={this.state.disabled}
          onPress={() => {
            this.props.itemAction && this.props.itemAction(item)
          }}
          onPressIn={() => {
            this.setState({
              touch: true,
            })
          }}
          onPressOut={() => {
            setTimeout(() => {
              this.setState({
                touch: false,
              })
            }, 3000)
          }}
          style={[styles.module]}
        >
          {/* <Image source={image} style={item.img} /> */}
          {/* <Image source={item.baseImage} style={item.style} /> */}
          <View style={styles.moduleItem}>
            <View style={styles.moduleImage}>
              <Image
                resizeMode={'contain'}
                source={image}
                style={styles.moduleImage}
              />
              {this._renderProgressView()}
            </View>
            <Text style={[styles.title, textColor]}>{item.title}</Text>
            {this.props.oldMapModules.indexOf(item.key) < 0 && (
              <View style={styles.redDot} />
            )}
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  module: {
    width: fixedSize(200),
    height: fixedSize(200),
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: fixedSize(4),
  },
  moduleImage: {
    width: fixedSize(120),
    height: fixedSize(120),
  },
  moduleViewP: {
    width: fixedSize(300),
    height: fixedSize(220),
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  moduleViewL: {
    width: fixedSize(220),
    height: fixedSize(220),
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  moduleItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  title: {
    width: fixedSize(200),
    height: fixedSize(37),
    fontSize: fixedText(25),
    color: '#5E5E5E',
    textAlign: 'center',
    marginTop: fixedSize(13),
  },
  redDot: {
    position: 'absolute',
    left: fixedSize(40),
    top: fixedSize(24),
    width: fixedSize(16),
    height: fixedSize(16),
    borderRadius: fixedSize(8),
    backgroundColor: 'red',
  },
})
