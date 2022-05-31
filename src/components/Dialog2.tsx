import React from 'react'
import { Modal, StyleSheet, Text, TextStyle, TouchableOpacity, View } from 'react-native'
import { dp, AppStyle } from '../utils'
import { RootSiblingParent } from 'react-native-root-siblings'
import { getLanguage } from '../language'
import CustomModal from './CustomModal'

export interface DialogOption {
  /** 提示文字 */
  text: string
  /** 自定义内容 */
  renderCustomerView?: () => JSX.Element
  /** 确定回调 */
  confirm: () => void
  /** 取消回调 */
  cancel: () => void
  /** 确定按钮显示文字 */
  confirmText: string
  /** 取消按钮显示文字 */
  cancelText: string
  /** 确定按钮文字风格 */
  confirmTextStyle: TextStyle
  /** 取消按钮文字风格 */
  cancelTextStyle: TextStyle
  /** 是否显示取消按钮 */
  showCancel: boolean
  /** 点击按钮后是否自动隐藏 */
  autoHide:boolean
  /** 按钮排列方向 */
  buttonMode: DialogButtonMode
  /**
   * 是否渲染在新的rootsibling内。
   * 设置为true可解决Toast不在Modal上显示的问题，
   * 但调用Toast后马上隐藏Modal会导致Toast不显示。
   */
  newRoot: boolean
  /**
   * 在此增加额外的button，
   * 横排时渲染在取消和确定之间，
   * 竖排时渲染在确定和取消之间 ，
   */
  extraButtons: DialogButton[]
  /**
   * 使用原生 Modal 渲染
   * 除了需要在原生view之上显示以外，
   * 不建议使用此项
   */
  useModal: boolean
}

export type DialogButtonMode =  'row' | 'column'

export interface DialogButton {
  text: string
  textStyle?: TextStyle
  onPress: () => void
}

interface Props extends Partial<DialogOption> {
  /** 是否可以点击确定 */
  confirmAvailable?: boolean,
  language?:string,
}

interface State extends DialogOption {
  visible: boolean,
}


class Dialog extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    const initOption = this.getCurrentOption({})
    this.state = {
      visible: false,
      ...initOption,
    }
  }

  componentDidUpdate = (PrvePos:Props) =>{
    if(PrvePos.language!==this.props.language){
      const currentOption = this.getCurrentOption({})
      this.setState({
        ...currentOption,
      })
    }
  }

 _getDefaultOption = (): DialogOption => {
   return {
     text: '',
     renderCustomerView: undefined,
     confirm: () => {},
     cancel: () => {},
     confirmText: getLanguage().CONFIRM,
     cancelText: getLanguage().CANCEL,
     showCancel: true,
     autoHide: true,
     buttonMode: 'row',
     newRoot: false,
     confirmTextStyle: {},
     cancelTextStyle: {},
     extraButtons: [],
     useModal: false,
   }
 }

  /** 获取当前设置，优先顺序：当前参数 > this.props > 默认参数 */
  getCurrentOption = (currentOption: Partial<DialogOption>): DialogOption => {
    const option: DialogOption = {
      ...this._getDefaultOption(),
      ...this.props,
      ...currentOption,
    }

    return option
  }

  setVisible = (visible: boolean) => {
    this.setState({
      visible: visible,
    })
  }

  set = (option: Partial<DialogOption>) => {
    const currentOption = this.getCurrentOption(option)
    this.setState({
      ...currentOption,
    })
  }

  confirm = () => {
    this.state.autoHide && this.setVisible(false)
    this.state.confirm()
  }

  cancel = () => {
    this.state.autoHide && this.setVisible(false)
    this.state.cancel()
  }

  onExtraPress = (action: () => void) => {
    this.state.autoHide && this.setVisible(false)
    action()
  }

  renderDialog = () => {
    return (
      <View style={styles.dialogContainer}>
        {this.state.renderCustomerView ? (
          this.state.renderCustomerView()
        ) : (
          <View style={styles.dialogContentView}>
            <Text style={AppStyle.Text_Style_Center}>
              {this.state.text}
            </Text>
          </View>
        )}
        {this.renderButton()}
      </View>
    )
  }

  renderButton = () => {
    if(this.state.buttonMode === 'row') {
      return (
        <View style={styles.buttonContainer}>
          {this._renderCancel()}
          {this.state.extraButtons.length > 0 && this._renderExtraButtons()}
          {this._renderConfirm()}
        </View>
      )
    } else {
      return (
        <View style={styles.buttonContainer_List}>
          {this._renderConfirm()}
          {this.state.extraButtons.length > 0 && this._renderExtraButtons()}
          {this._renderCancel()}
        </View>
      )
    }
  }

  _renderConfirm = () => {
    const confirmAvailable = this.props.confirmAvailable !== undefined ? this.props.confirmAvailable : true
    return (
      <>
        <TouchableOpacity
          onPress={this.confirm}
          disabled={!confirmAvailable}
          style={this.state.buttonMode === 'row' ? styles.buttonView : styles.buttonView_List}
        >
          <Text style={[AppStyle.Text_Style, this.state.confirmTextStyle, !confirmAvailable && { color: AppStyle.Color.LIGHT_GRAY}]}>
            {this.state.confirmText}
          </Text>
        </TouchableOpacity>
      </>
    )
  }

  _renderCancel = () => {
    return (
      <>
        {this.state.showCancel && (
          <TouchableOpacity
            onPress={this.cancel}
            style={this.state.buttonMode === 'row' ? styles.buttonView : styles.buttonView_List}
          >
            <Text style={[AppStyle.Text_Style, this.state.cancelTextStyle]}>
              {this.state.cancelText}
            </Text>
          </TouchableOpacity>
        )}
        {this.state.showCancel && <View style={{ width: dp(1), backgroundColor: AppStyle.Color.Seperator}}/>}

      </>
    )
  }

  _renderExtraButtons = () => {
    const views: JSX.Element[] = []
    for(let i = 0; i < this.state.extraButtons.length; i++) {
      const button = this.state.extraButtons[i]
      views.push(this._renderExtraButton(button, i))
    }
    return views
  }

  _renderExtraButton = (button: DialogButton, index: number) => {
    return (
      <View key={index.toString()}>
        <TouchableOpacity
          onPress={() => this.onExtraPress(button.onPress)}
          style={this.state.buttonMode === 'row' ? styles.buttonView : styles.buttonView_List}
        >
          <Text style={[AppStyle.Text_Style, button.textStyle]}>
            {button.text}
          </Text>
        </TouchableOpacity>
        <View style={{ width: dp(1), backgroundColor: AppStyle.Color.Seperator }} />
      </View>
    )
  }

  renderCustomModal = () => {
    return (
      <CustomModal
        visible={this.state.visible}
        transparent
      >
        <>
          <View style={[styles.background, StyleSheet.absoluteFill]} />
          <View style={styles.container}>
            {this.renderDialog()}
          </View>
        </>
      </CustomModal>
    )
  }

  renderModal() {
    return(
      <Modal
        visible={this.state.visible}
        transparent={true}
        animationType={'fade'}
        statusBarTranslucent={true}
      >
        {this.state.newRoot ? (
          <RootSiblingParent>
            <View style={[styles.background, StyleSheet.absoluteFill]} />
            <View style={styles.container}>
              {this.renderDialog()}
            </View>
          </RootSiblingParent>
        ) : (
          <>
            <View style={[styles.background, StyleSheet.absoluteFill]} />
            <View style={styles.container}>
              {this.renderDialog()}
            </View>
          </>
        )}
      </Modal>
    )
  }

  render() {
    return this.state.useModal ? this.renderModal() : this.renderCustomModal()
  }
}

export default Dialog

const styles = StyleSheet.create({
  background: {
    backgroundColor: AppStyle.Color.GRAY,
    opacity: 0.6,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialogContainer: {
    backgroundColor: AppStyle.Color.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: dp(10),
    width: dp(280)
  },
  dialogContentView: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    margin: dp(25),
  },
  buttonContainer: {
    flexDirection: 'row',
    height: dp(45),
    borderTopWidth: dp(1),
    borderTopColor: AppStyle.Color.Seperator,
  },
  buttonContainer_List: {
    flexDirection: 'column',
    width: '100%',
  },
  buttonView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonView_List: {
    height: dp(45),
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: dp(1),
    borderTopColor: AppStyle.Color.Seperator,
  }
})