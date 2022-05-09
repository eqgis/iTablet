import React, { PureComponent } from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'
import { Dialog } from '../../../../components'
import { scaleSize } from '../../../../utils/screen'
import { color } from '../../../../styles'
import { getLanguage } from '../../../../language/index'

export default class SimpleDialog extends PureComponent {
  props: {
    confirmAction?: () => void,
    cancelAction?: () => void,
    dismissAction?: () => void,
    installAction?: () => void,
    renderExtra?: () => void,
    style?: Object,
    text?: String,
    confirmText?: String,
    installText?: String,
    cancelText?: String,
    disableBackTouch?: boolean,
    buttonMode?: String,
    confirmTitleStyle?: Object,
    cancelTitleStyle?: Object,
    installBtnVisible?:boolean,
  }

  static defaultProps = {
    disableBackTouch: true,
    buttonMode: 'row',
    text: '',
    confirmText: '',
    cancelText: '',
  }

  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      confirmAction: this.confirm,
      cancelAction: this.cancel,
      dismissAction: this.dismiss,
      installAction:this.install,
      text: '',
      textStyle: {},
      renderExtra: props.renderExtra ? props.renderExtra : this.renderExtra,
      dialogStyle: {},
      showTitleImage: true,
      confirmText: '',
      cancelText: '',
      renderCustomeView: undefined,
      disableBackTouch: this.props.disableBackTouch,
      buttonMode: props.buttonMode,
      cancelBtnVisible:true,
      installBtnVisible:this.props.installBtnVisible || false,
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
    dismissAction,
    renderExtra,
    dialogStyle,
    showTitleImage,
    confirmText,
    cancelText,
    renderCustomeView,
    disableBackTouch,
    buttonMode,
    cancelBtnVisible,
  }) => {
    let confirm, cancel, dismiss
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
    if (dismissAction && typeof dismissAction === 'function') {
      dismiss = () => {
        this.setVisible(false)
        dismissAction()
      }
    }
    this.setState({
      text: text || '',
      textStyle: textStyle ? textStyle : {},
      confirmAction: confirmAction ? confirm || this.confirm : this.confirm,
      cancelAction: cancelAction ? cancel || this.cancel : this.cancel,
      dismissAction: dismissAction ? dismiss || this.dismiss : this.dismiss,
      renderExtra: renderExtra ? renderExtra : this.renderExtra,
      dialogStyle: dialogStyle ? dialogStyle : {},
      showTitleImage: showTitleImage !== undefined ? showTitleImage : true,
      confirmText: confirmText || '',
      cancelText: cancelText || '',
      renderCustomeView: renderCustomeView,
      disableBackTouch:
        disableBackTouch === undefined
          ? this.props.disableBackTouch
          : disableBackTouch,
      buttonMode: buttonMode ? buttonMode : this.props.buttonMode,
      cancelBtnVisible: cancelBtnVisible === undefined? true : cancelBtnVisible,
    })
  }

  reset = () => {
    this.setState({
      text: '',
      textStyle: {},
      confirmAction: this.confirm,
      cancelAction: this.cancel,
      dismissAction: this.dismiss,
      renderExtra: this.renderExtra,
      dialogStyle: {},
      showTitleImage: true,
      confirmText: '',
      cancelText: '',
      renderCustomeView: undefined,
      disableBackTouch: this.props.disableBackTouch,
      buttonMode: this.props.buttonMode,
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

  dismiss = () => {
    this.props.dismissAction && this.props.dismissAction()
    this.setVisible(false)
  }

  install = () => {
    this.props.installAction && this.props.installAction()
  }

  renderExtra = () => {
    return <View />
  }

  render() {
    return (
      <Dialog
        ref={ref => (this.Dialog = ref)}
        type={'modal'}
        confirmBtnTitle={
          this.state.confirmText !== ''
            ? this.state.confirmText
            : this.props.confirmText !== ''
              ? this.props.confirmText
              : getLanguage(global.language).Friends.CONFIRM
        }
        installBtnTitle={
          this.props.installText !== ''
            ? this.props.installText
            : getLanguage(global.language).Prompt.INSTALL
        }
        cancelBtnTitle={
          this.state.cancelText !== ''
            ? this.state.cancelText
            : this.props.cancelText !== ''
              ? this.props.cancelText
              : getLanguage(global.language).Friends.CANCEL
        }
        confirmAction={this.state.confirmAction}
        cancelAction={this.state.cancelAction}
        dismissAction={this.state.dismissAction}
        installAction={this.state.installAction}
        confirmTitleStyle={this.props.confirmTitleStyle}
        cancelTitleStyle={this.props.cancelTitleStyle}
        // style={[
        //   styles.dialogBackground,
        //   this.props.style,
        //   this.state.dialogStyle,
        // ]}
        disableBackTouch={this.state.disableBackTouch}
        buttonMode={this.state.buttonMode}
        cancelBtnVisible={this.state.cancelBtnVisible}
        installBtnVisible={this.state.installBtnVisible}
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
            <Text style={[styles.promptTitle, this.state.textStyle]}>
              {this.state.text !== '' ? this.state.text : this.props.text}
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
    flexDirection: 'column',
    alignItems: 'center',
  },
  dialogHeaderImg: {
    marginTop: scaleSize(10),
    width: scaleSize(80),
    height: scaleSize(80),
    opacity: 1,
  },
  promptTitle: {
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
})
