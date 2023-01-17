import MapToolbar from "@/containers/workspace/components/MapToolbar"
import { RootState } from "@/redux/types"
import React, { Component } from "react"
import { SectionList, PermissionsAndroid, View, Text, TouchableOpacity, Linking, FlatList, Image, StyleSheet, TextInput } from "react-native"
import { connect, ConnectedProps } from "react-redux"
import { Container, Dialog } from '../../../../src/components'
import Contacts from 'react-native-contacts'
import { getPinYin } from "@/utils/pinyin"
import { dp } from "imobile_for_reactnative/utils/size"
import { fontSize } from "@/containers/tabs/Mine/Register/Styles"
import { getImage } from "imobile_for_reactnative/components/ToolbarKit/ToolbarResource"
import { getLanguage } from "@/language"
import { getPublicAssets, getThemeAssets } from "@/assets"
import { setCurrentSymbol } from "@/redux/models/symbol"
import { SCollector, SMCollectorType } from "imobile_for_reactnative"
import NavigationService from "@/containers/NavigationService"
import { collectionModule } from "@/containers/workspace/components/ToolBar/modules"
import ToolbarModule from "@/containers/workspace/components/ToolBar/modules/ToolbarModule"
import { Toast } from "@/utils"
import RNImmediatePhoneCall from 'react-native-immediate-phone-call'
import { addContact } from "../reduxModels/langchao"
import { color } from "@/styles"
import { getTelBook, getUUid, opType, telBookItemInfoType, upDateTelBook } from "../utils/langchaoServer"
import { getData } from "@/Toolbar/modules/arSandTable/Data"
import { MainStackScreenRouteProp } from "@/types"
import { VoidTypeAnnotation } from "@babel/types"

interface changeDataType {
	UserId?: string,
  UserName?: string,
  Contacts?: string,
  Tel?: string,
  MobilePhone?: string,
  Email?: string,
  PostalCode?: string,
  Address?: string,
}

interface Props extends ReduxProps {
	navigation: any,
	mapModules: any,
  device: any,
  language: string,
  setCurrentSymbol: (param: any) => void,
	// data: telBookItemInfoType,
	// type: opType,
	route: MainStackScreenRouteProp<'EditContactItem'>
}

// this.props.route.params?.type

interface State {
	UserId: string,
  UserName: string,
  Contacts: string,
  Tel: string,
  MobilePhone: string,
  Email: string,
  PostalCode: string,
  Address: string,
	uuid: string,
	type: opType,

	ContactsTipShow: boolean,
	MobilePhoneTipShow: boolean,
}

class EditContactItem extends Component<Props, State> {

  constructor(props: Props) {
    super(props)
    this.state = {
      UserId: this.props.userId || '',
      UserName: this.props.userName || '',
      Contacts: '',
      Tel: '',
      MobilePhone: '',
      Email: '',
      PostalCode: '',
      Address: '',
      uuid: "",
      type: this.props.route.params?.type || "I",
      ContactsTipShow: false,
      MobilePhoneTipShow: false,
    }
  }

  componentDidMount = async (): void  => {
    try {
      const data =  this.props.route.params?.data
      if(data) {
        this.setState({
          UserId: data.UserId || "",
          UserName: data.UserName || "",
          Contacts: data.Contacts || "",
          Tel: data.Tel || "",
          MobilePhone: data.MobilePhone || "",
          Email: data.Email || "",
          PostalCode: data.PostalCode || "",
          Address: data.Address || "",
          uuid: data.uuid || "",
        })
      }
    } catch (error) {
      // to do
    }
  }

  changeContacts = (text: string) => {
    this.setState({
      Contacts: text,
      ContactsTipShow: !text,
    })
  }

  changeTel = (text: string) => {
    this.setState({
      Tel: text,
    })
  }

  changeMobilePhone = (text: string) => {
    let flag = true
    if(Number(text).toString() !== 'NaN' && text.length >= 5 && text.length <= 20) {
      flag = false
    }
    this.setState({
      MobilePhone: text,
      MobilePhoneTipShow: flag,
    })
  }

  changeEmail = (text: string) => {
    this.setState({
      Email: text,
    })
  }

  changePostalCode = (text: string) => {
    this.setState({
      PostalCode: text,
    })
  }

  changeAddress = (text: string) => {
    this.setState({
      Address: text,
    })
  }

  rightAction = async () => {
    try {
      let isEnterRight = true
      if(this.state.UserId === "") {
        isEnterRight = false
      }
      if(this.state.Contacts === "") {
        this.setState({
          ContactsTipShow: true,
        })
        isEnterRight = false
      }
      const phone = this.state.MobilePhone

      if(phone.length < 5 || phone.length > 20 || Number(phone).toString() === 'NaN') {
        this.setState({
          MobilePhoneTipShow: true,
        })
        isEnterRight = false
      }

      if(!isEnterRight) {
        return
      }

      const param = {
        UserId: this.state.UserId,
        UserName: this.state.UserName,
        Contacts: this.state.Contacts,
        Tel: this.state.Tel,
        MobilePhone: this.state.MobilePhone,
        Email: this.state.Email,
        PostalCode: this.state.PostalCode,
        Address: this.state.Address,
        uuid:  this.state.type === 'I' ? getUUid() : this.state.uuid,
      }
      const result = await upDateTelBook(param, this.state.type)
      if(result) {
        Toast.show("操作成功")
      } else {
        Toast.show("操作失败")
      }

    } catch (error) {
      // to do
    }
  }

  renderHeaderRight = () => {
    return (
      <TouchableOpacity
        style={styles.addStyle}
        onPress={this.rightAction}
      >
        {/* <Image style={styles.imgStyle} source={getImage().add_round} /> */}
        <Text>{getLanguage(global.language).Map_Settings.SAVE}</Text>
      </TouchableOpacity>
    )
  }

  renderDialogChildren = () => {
    return (
      <View style={[{
        width: '100%',
        flexDirection: 'column',
        justifyContent:'center',
        alignItems: 'center',
        paddingBottom: dp(20),
      }]}>
        {/* 标题 */}
        <View style={[{
          width: '96%',
          height: dp(30),
          justifyContent: 'center',
          alignItems: 'center',
          borderBottomColor: '#ccc',
          borderBottomWidth: dp(1),
          marginVertical: dp(10),
        }]} >
          <Text style={[{
            fontSize: dp(18),
            color: '#333',
          }]}>{getLanguage(global.language).Map_Settings.ADD_CONTACT}</Text>
        </View>
        {/* 联系人电话id */}
        <View style={[styles.dialogInputContainer,
          this.state.userIdTip && styles.dialogInputContainerAddStyle
        ]}>
          <TextInput
            style = {[styles.dialogInput]}
            placeholder = {getLanguage(global.language).Map_Settings.USER_ID}
            value = {this.state.addUserID}
            onChangeText = {(text:string) => {
              this.setState({
                addUserID: text,
                userIdTip: text === '',
              })
            }}
          />
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.clearBtn}
            onPress={() => {
              this.setState({
                addUserID: '',
                userIdTip: true,
              })
            }}
          >
            <Image
              style={styles.clearImg}
              resizeMode={'contain'}
              source={getPublicAssets().common.icon_close}
            />
          </TouchableOpacity>
        </View>
        <View style={[styles.tipStyle]}>
          {this.state.userIdTip && (
            <Text
              style={[{
                fontSize: dp(10),
                color: '#f00',
              }]}
            >{getLanguage(this.props.language).Prompt.INPUT_CONTACT_ID}</Text>
          )}
        </View>
        {/* 联系人姓名输入框 */}
        <View style={[styles.dialogInputContainer,
          this.state.contactNameTip && styles.dialogInputContainerAddStyle
        ]}>
          <TextInput
            style = {[styles.dialogInput]}
            placeholder = {getLanguage(global.language).Map_Settings.CONTACT_NAME}
            value = {this.state.addName}
            onChangeText = {(text:string) => {
              this.setState({
                addName: text,
                contactNameTip: text === "",
              })
            }}
          />
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.clearBtn}
            onPress={() => {
              this.setState({
                addName: '',
                contactNameTip: true,
              })
            }}
          >
            <Image
              style={styles.clearImg}
              resizeMode={'contain'}
              source={getPublicAssets().common.icon_close}
            />
          </TouchableOpacity>
        </View>
        <View style={[styles.tipStyle]}>
          {this.state.contactNameTip && (
            <Text
              style={[{
                fontSize: dp(10),
                color: '#f00',
              }]}
            >{getLanguage(this.props.language).Prompt.INPUT_CONTACT_NAME}</Text>
          )}
        </View>
        {/* 联系人电话输入框 */}
        <View style={[styles.dialogInputContainer,
          this.state.phoneTip && styles.dialogInputContainerAddStyle
        ]}>
          <TextInput
            style = {[styles.dialogInput]}
            placeholder = {getLanguage(global.language).Map_Settings.CONTACT_NUMBER}
            value = {this.state.addNumber}
            onChangeText = {(text:string) => {
              let flag = true
              if(Number(text).toString() !== 'NaN' && text.length >= 5 && text.length <= 20) {
                flag = false
              }

              this.setState({
                addNumber: text,
                phoneTip: flag,
              })
            }}
          />
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.clearBtn}
            onPress={() => {
              this.setState({
                addNumber: '',
                phoneTip: true,
              })
            }}
          >
            <Image
              style={styles.clearImg}
              resizeMode={'contain'}
              source={getPublicAssets().common.icon_close}
            />
          </TouchableOpacity>
        </View>
        <View style={[styles.tipStyle]}>
          {this.state.phoneTip && (
            <Text
              style={[{
                fontSize: dp(10),
                color: '#f00',
              }]}
            >{getLanguage(this.props.language).Prompt.CHECK_CONTACT_NUMBER}</Text>
          )}
        </View>

      </View>
    )
  }

  renderItem = (title: string, value: string) => {
    return (
      <View
        style={[styles.itemContainerStyle]}
      >
        <View
          style={[styles.itemTitleView]}
        >
          <Text
            style={[styles.itemTitleText]}
          >{title}</Text>
        </View>
        <View>
          <Text>{value}</Text>
        </View>
      </View>
    )
  }

  renderInputItem = (title: string, value: string, changeTextAction: (text: string) => void, isRequired = false, placeholder= "") => {
    return (
      <View
        style={[styles.itemContainerStyle]}
      >
        <View
          style={[styles.itemTitleView]}
        >
          <Text
            style={[styles.itemTitleText]}
          >{title}</Text>
          {isRequired && (
            <Text style = {[{
              color: '#f00',
              fontSize: dp(10),
              position: 'absolute',
              left: dp(-10),
              top: dp(5),
            }]}>{"*"}</Text>
          )}

        </View>
        <View style={[
          styles.dialogInputContainer,
          // value === "" && isRequired && {
          //   borderColor: '#f00',
          // }
        ]}>
          <TextInput
            style = {[styles.dialogInput]}
            placeholder = {placeholder}
            value = {value}
            onChangeText = {changeTextAction}
          />
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.clearBtn}
            onPress={() => {
              changeTextAction("")
            }}
          >
            <Image
              style={styles.clearImg}
              resizeMode={'contain'}
              source={getPublicAssets().common.icon_close}
            />
          </TouchableOpacity>
        </View>
      </View>
    )
  }


  renderContentView = () => {
    return (
      <View
        style={[styles.partViewStyle]}
      >
        {/* {this.renderItem('用户ID', this.state.UserId)}
        {this.renderItem('用户姓名', this.state.UserName)} */}
        {this.renderInputItem(getLanguage(global.language).Map_Settings.CONTACT_NAME, this.state.Contacts, this.changeContacts, true, getLanguage(global.language).Map_Settings.PLEASE_INPUT_CONTACT)}
        {this.state.ContactsTipShow && (
          <View style={[styles.tipStyle]}>
            <Text
              style={[{
                fontSize: dp(8),
                color: '#f00',
              }]}
            >{getLanguage(this.props.language).Prompt.INPUT_CONTACT_NAME}</Text>
          </View>
        )}

        {this.renderInputItem(getLanguage(global.language).Map_Settings.CONTACT_NAME, this.state.Tel, this.changeTel, false, getLanguage(global.language).Map_Settings.PLEASE_INPUT_LANDLINE_PHONE)}
        {this.renderInputItem(getLanguage(global.language).Map_Settings.CONTACT_NUMBER, this.state.MobilePhone, this.changeMobilePhone, true, getLanguage(global.language).Map_Settings.PLEASE_INPUT_MOBILE_PHONE)}
        {this.state.MobilePhoneTipShow && (
          <View style={[styles.tipStyle]}>
            <Text
              style={[{
                fontSize: dp(10),
                color: '#f00',
              }]}
            >{getLanguage(this.props.language).Prompt.CHECK_CONTACT_NUMBER}</Text>
          </View>
        )}
        {this.renderInputItem(getLanguage(this.props.language).Prompt.EMAIL, this.state.Email, this.changeEmail, false, getLanguage(this.props.language).Prompt.PLEASE_INPUT_EMAIL)}
        {this.renderInputItem(getLanguage(this.props.language).Prompt.POSTCODE, this.state.PostalCode, this.changePostalCode, false, getLanguage(this.props.language).Prompt.PLEASE_INPUT_POSTCODE)}
        {this.renderInputItem(getLanguage(this.props.language).Prompt.CONTACT_ADDRESS, this.state.Address, this.changeAddress, false, getLanguage(this.props.language).Prompt.PLEASE_INPUT_CONTACT_ADDRESS)}
      </View>
    )
  }

  render() {
    return (
      <Container
        // ref={ref => (this.container = ref)}
        hideInBackground={false}
        showFullInMap={true}
        headerProps={{
          title: this.state.type === 'I' ? getLanguage(global.language).Map_Settings.ADD_CONTACT : getLanguage(global.language).Map_Settings.EDIT_CONTACT_INFO,  // 新建联系人 / 修改联系人
          withoutBack: false,
          headerRight: this.renderHeaderRight(),
          navigation: this.props.navigation,
          headerStyle: {
            borderBottomWidth: 0,
            backgroundColor: color.containerHeaderBgColor,
          },
          responseHeaderTitleStyle: {
            color: color.containerTextColor,
            textAlign: 'center',
          },
          isResponseHeader: true,
        }}
        // bottomBar={this.renderToolBar()}
        style={{
          flex: 1,
          backgroundColor: '#f3f3f3',
        }}
      >
        {/* <Text>{"新建联系人"}</Text> */}
        {this.renderContentView()}
      </Container>
    )
  }
}

const mapStateToProp = (state: RootState) => ({
  mapModules: state.mapModules.toJS(),
  device: state.device.toJS().device,
  language: state.setting.toJS().language,
  // contacts: state.langchao.toJS().contacts,
  userId: state.langchao.toJS().userId,
  userName: state.langchao.toJS().userName,
})

const mapDispatch = {
  setCurrentSymbol,
  // addContact,
}

type ReduxProps = ConnectedProps<typeof connector>
const connector = connect(mapStateToProp, mapDispatch)

export default connector(EditContactItem)

const styles = StyleSheet.create({
  addStyle: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  partViewStyle:{
    width: '100%',
    backgroundColor: '#fff',
    marginTop: dp(10),
    paddingLeft: dp(20),
    paddingRight: dp(10),
  },
  itemContainerStyle: {
    width: '100%',
    height: dp(50),
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: '#f00'
  },
  itemTitleView: {
    width: dp(140),
  },
  itemTitleText: {
    fontSize: dp(16),
  },

  textStyle: {
    fontSize: dp(16),
  },
  imgStyle: {
    height: dp(30),
    width: dp(30),
  },
  // dialog
  dialogInputContainer: {
    flex:1,
    height: dp(40),
    flexDirection: 'row',
    marginVertical: dp(5),
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#fff',
    borderWidth: dp(1),
  },
  dialogInput: {
    flex: 1,
    height: dp(40),
    paddingVertical: dp(5),
    marginLeft: dp(-5),
    textAlign: 'left',
  },

  // 清空按钮
  clearBtn: {
    width: dp(26),
    height: dp(26),
    paddingRight: dp(10),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  clearImg: {
    width: dp(26),
    height: dp(26),
  },
  titleStyle: {
    width: '90%',
    paddingHorizontal: dp(10),
  },
  titleText: {
    fontSize: dp(16),
    fontWeight: '400'
  },

  pickerSize: {
    width: '100%',
    height: dp(20),
    fontSize: dp(16),
    marginLeft: -dp(10),
  },
  tipStyle: {
    position: 'relative',
    right: dp(10),
    width: '100%',
    height: dp(12),
    flexDirection: 'row',
    backgroundColor: '#fff',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: dp(3),
  },
})