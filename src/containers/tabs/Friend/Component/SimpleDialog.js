import React, { PureComponent } from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'
import { Dialog } from '../../../../components'
import { scaleSize } from '../../../../utils/screen'
import { color } from '../../../../styles'
import { getLanguage } from '../../../../language/index'

export default class SimpleDialog extends PureComponent {
  props: {
    confirmAction: () => {},
    cancelAction: () => {},
    renderExtra: () => {},
    style: Object,
    text: String,
    disableBackTouch: boolean,
  }

  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      confirmAction: this.confirm,
      cancelAction: this.cancel,
      text: this.props.text,
      textStyle: {},
      renderExtra: props.renderExtra ? props.renderExtra : this.renderExtra,
      dialogStyle: {},
      showTitleImage: true,
      confirmText: getLanguage(global.language).Friends.CONFIRM,
      cancelText: getLanguage(global.language).Friends.CANCEL,
      renderCustomeView: undefined,
    }
  }

  setVisible(visible) {
    this.Dialog.setDialogVisible(visible)
  }

  set = ({
    text,
    textStyle,
    confirmAction,
    cancelAction,
    renderExtra,
    dialogStyle,
    showTitleImage,
    confirmText,
    cancelText,
    renderCustomeView,
  }) => {
    let confirm, cancel
    if (confirmAction && typeof confirmAction === 'function') {
      confirm = () => {
        this.setVisible(false)
        confirmAction()
      }
    }
    if (cancelAction && typeof cancelAction === 'function') {
      cancel = () => {
        this.setVisible(false)
        cancelAction()
      }
    }
    this.setState({
      text: text || this.props.text,
      textStyle: textStyle ? textStyle : {},
      confirmAction: confirmAction ? confirm || this.confirm : this.confirm,
      cancelAction: cancelAction ? cancel || this.cancel : this.cancel,
      renderExtra: renderExtra ? renderExtra : this.renderExtra,
      dialogStyle: dialogStyle ? dialogStyle : {},
      showTitleImage: showTitleImage !== undefined ? showTitleImage : true,
      confirmText: confirmText
        ? confirmText
        : getLanguage(global.language).Friends.CONFIRM,
      cancelText: cancelText
        ? cancelText
        : getLanguage(global.language).Friends.CANCEL,
      renderCustomeView: renderCustomeView,
    })
  }

  reset = () => {
    this.setState({
      text: this.props.text,
      textStyle: {},
      confirmAction: this.confirm,
      cancelAction: this.cancel,
      renderExtra: this.renderExtra,
      dialogStyle: {},
      showTitleImage: true,
      confirmText: getLanguage(global.language).Friends.CONFIRM,
      renderCustomeView: undefined,
    })
  }

  confirm = () => {
    this.props.confirmAction && this.props.confirmAction()
    this.setVisible(false)
  }

  cancel = () => {
    this.props.cancelAction && this.props.cancelAction()
    this.setVisible(false)
  }

  renderExtra = () => {
    return <View />
  }

  render() {
    return (
      <Dialog
        ref={ref => (this.Dialog = ref)}
        type={'modal'}
        confirmBtnTitle={this.state.confirmText}
        cancelBtnTitle={this.state.cancelText}
        confirmAction={this.state.confirmAction}
        cancelAction={this.state.cancelAction}
        opacity={1}
        opacityStyle={styles.opacityView}
        style={[
          styles.dialogBackground,
          this.props.style,
          this.state.dialogStyle,
        ]}
        disableBackTouch={this.props.disableBackTouch}
      >
        {this.state.renderCustomeView ? (
          this.state.renderCustomeView()
        ) : (
          <View style={styles.dialogHeaderView}>
            {this.state.showTitleImage && (
              <Image
                source={require('../../../../assets/home/Frenchgrey/icon_prompt.png')}
                style={styles.dialogHeaderImg}
              />
            )}
            <Text style={[styles.promptTtile, this.state.textStyle]}>
              {this.state.text}
            </Text>
            {this.state.renderExtra()}
          </View>
        )}
      </Dialog>
    )
  }
}

const styles = StyleSheet.create({
  dialogHeaderView: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  dialogHeaderImg: {
    marginTop: scaleSize(10),
    width: scaleSize(80),
    height: scaleSize(80),
    opacity: 1,
  },
  promptTtile: {
    fontSize: scaleSize(24),
    lineHeight: scaleSize(32),
    color: color.theme_white,
    marginTop: scaleSize(5),
    marginHorizontal: scaleSize(10),
    textAlign: 'center',
  },
  dialogBackground: {
    height: scaleSize(250),
  },
  opacityView: {
    height: scaleSize(250),
  },
})
