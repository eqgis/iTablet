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

export interface contactItemType {
  ID: number,
  userID: string,
  name: string, // displayName
  phone: string, // phoneNumbers[0].number
}

// interface contactDataType {
//   title: string,
//   data: Array<contactItemType>
// }

interface Props extends ReduxProps {
	navigation: any,
	mapModules: any,
  device: any,
  language: string,
  contacts: any,
  setCurrentSymbol: (param: any) => void,
  addContact: (paran: any) => void
}

interface State {
	// to do
  contactData: Array<contactItemType>
  addName: string
  addNumber: string
  addUserID: string
  selectItem: contactItemType | null,
  morePanShow: boolean,
  phoneTip: boolean,
  userIdTip: boolean,
  contactNameTip: boolean,
}

class ContactsList extends Component<Props, State> {
  _sectionList: SectionList | undefined | null = null
  addDialog: Dialog | undefined | null = null

  constructor(props: Props) {
    super(props)
    console.warn("this.props.contacts: "  + JSON.stringify(this.props.contacts))
    this.state = {
      contactData: this.props.contacts || [],
      addName: '',
      addNumber: '',
      addUserID: '',
      selectItem: null,
      morePanShow: false,
      phoneTip: false,
      userIdTip: false,
      contactNameTip: false,
    }
  }

  itemAction = async (telephone: string, name: string) => {
    try {
      NavigationService.navigate('MapView',{type: 'langchao'})
      const data = {"name":"专用公路","type":"line","id":965018}
      this.props.setCurrentSymbol(data)
      const type = SMCollectorType.LINE_GPS_PATH
      // ToolbarModule.addData({
      //   lastType: type,
      //   lastLayer:undefined,
      // })
      // await collectionModule().actions.createCollector(type, undefined)

      collectionModule().actions.showCollection(type)
      const date = new Date()

      collectionModule().actions.setCallInfo({
        name: name,
        phoneNumber: telephone,
        startTime: date.getTime(),
      })

      const timer = setTimeout(async () => {
        const obj = {
          key: 'start',
          title: getLanguage(global.language).Map_Settings.RECORDING,
          action: () => {
            Toast.show(getLanguage(global.language).Map_Settings.ON_THE_RECORD)
          },
          size: 'large',
          image: getThemeAssets().collection.icon_track_start,
        }
        global.ToolBar?.updateViewData(0,obj)

        await SCollector.startCollect(type)

        // const url = 'tel:' + telephone
        // Linking.openURL(url)
        RNImmediatePhoneCall.immediatePhoneCall(telephone)

        clearTimeout(timer)
      }, 1000)


    } catch (error) {
      console.warn("error：" + JSON.stringify(error))
    }

    // Linking.canOpenURL(url).then((supported: boolean) => {
    //   if (!supported) {
    //     Toast.show('您的系统不支持打电话！')
    //   } else {
    //     return Linking.openURL(url)
    //   }
    // }).catch(err => {
    //   console.log(err)
    // })
  }

  // 字母关联分组跳转
  _onSectionselect = (key: number) => {
    this._sectionList?.scrollToLocation({
      itemIndex: 0,
      sectionIndex: key,
      viewOffset: 20,
    })

  }

  addBtnOnpress = () => {
    this.addDialog?.setDialogVisible(true)
  }

  addConfirm = () => {
    let isEnterRight = true
    if(this.state.addUserID === "") {
      this.setState({
        userIdTip: true,
      })
      isEnterRight = false
    }
    if(this.state.addName === "") {
      this.setState({
        contactNameTip: true,
      })
      isEnterRight = false
    }
    const phone = this.state.addNumber

    if(phone.length < 5 || phone.length > 20 || Number(phone).toString() === 'NaN') {
      this.setState({
        phoneTip: true,
      })
      isEnterRight = false
    }

    if(!isEnterRight) {
      return
    }

    const newcontact = this.state.contactData
    if(this.state.selectItem) {
      const id = this.state.selectItem.ID
      const newcontactItem = {
        ID: id,
        userID: this.state.addUserID,
        name: this.state.addName,
        phone: this.state.addNumber,
      }
      newcontact.splice(id, 1, newcontactItem)
    } else {
      const newcontactItem = {
        ID: newcontact.length,
        userID: this.state.addUserID,
        name: this.state.addName,
        phone: this.state.addNumber,
      }
      newcontact.push(newcontactItem)
    }
    this.props.addContact(newcontact)
    this.addDialog?.setDialogVisible(false)
    this.setState({
      addName: '',
      addNumber: '',
      addUserID: '',
      selectItem: null,
      userIdTip: false,
      contactNameTip: false,
      phoneTip: false,
    })
  }

  addCancel = () => {
    this.addDialog?.setDialogVisible(false)
    this.setState({
      addName: '',
      addNumber: '',
      addUserID: '',
      selectItem: null,
      userIdTip: false,
      contactNameTip: false,
      phoneTip: false,
    })
  }

  editItemAction = () => {
    // 编辑对象
    this.setState({
      morePanShow: false,
      // selectItem: null,
      addName: this.state.selectItem?.name || "",
      addUserID: this.state.selectItem?.userID || "",
      addNumber: this.state.selectItem?.phone || "",
    })
    this.addDialog?.setDialogVisible(true)
  }

  deleteItemAction = () => {
    const id = this.state.selectItem?.ID
    const newdata = JSON.parse(JSON.stringify(this.state.contactData))
    let tempData = []
    if(id !== undefined && id >= 0) {
      // const newcontact = this.state.contactData.splice(id, 1)
      // this.props.addContact(newcontact)
      newdata.splice(id, 1)
      for(let i = newdata.length - 1; i >= 0; i --) {
        const item = {
          ...newdata[i],
          ID: i,
        }
        console.warn("item: " + i + " - " + JSON.stringify(item))
        // obj.ID = i
        tempData.unshift(item)
      }


      console.warn("tempData: " +  JSON.stringify(tempData))
      this.props.addContact(tempData)
    } else {
      tempData = JSON.parse(JSON.stringify(newdata))
    }

    // 删除对象
    this.setState({
      morePanShow: false,
      selectItem: null,
      contactData: tempData,
    })
  }

  /** 分隔线 */
  renderSeparator = () => {
    return (
      <View style={{
        width: '100%',
        height: dp(1),
        backgroundColor: '#ccc',
      }}/>
    )
  }

  _renderItem(item: contactItemType, index: number) {
    const firstChar = item.name.substring(0, 1)
    return (
      <View
        style={[{
          width: '100%',
          height: dp(60),
          backgroundColor: '#fff',
          flexDirection: 'row',
          justifyContent:'flex-start',
          alignItems: 'center',
          paddingHorizontal: dp(10),
        }]}
      >
        <TouchableOpacity
          style={[{
            // width: '100%',
            flex:1,
            height: dp(60),
            backgroundColor: '#fff',
            flexDirection: 'row',
            justifyContent:'flex-start',
            alignItems: 'center',
            // paddingHorizontal: dp(10),
          }]}
          onPress={() => {
            this.itemAction(item.phone, item.name)
          }}
        >
          <View style={[{
            width: dp(50),
            height: dp(50),
            borderRadius: dp(8),
            backgroundColor: '#ccc',
            justifyContent: 'center',
            alignItems: 'center',
          }]}>
            <Text style={[{
              color: '#fff',
              fontSize: dp(30),
              fontWeight: 'bold',
            }]}>{firstChar}</Text>
          </View>

          <View style={[{
            flex:1,
            height: dp(50),
            flexDirection:'column',
            justifyContent:'space-around',
            alignItems:'flex-start',
            marginLeft: dp(10),
          }]}>
            <Text style={[{
              color:'#333',
              fontSize: dp(18),
            }]}>{item.name}</Text>
            <Text style={[{
              color: '#999',
              fontSize: dp(14)
            }]}>{item.phone}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[{
            width: dp(60),
            height: dp(60),
            justifyContent:'center',
            alignItems: 'flex-end',
            paddingRight: dp(10),
            // backgroundColor: '#ccc',
          }]}
          onPress={() => {
            this.setState({
              morePanShow: true,
              selectItem: item,
            })
          }}
        >
          {/* <Text>{"更多"}</Text> */}
          <Image
            source={getPublicAssets().common.icon_more}
            style={[{
              width: dp(16),
              height: dp(16),
            }]}
          />
        </TouchableOpacity>
      </View>
    )
  }

  _renderSectionHeader(sectionItem: { section: any }) {
    // const section = sectionItem.section
    return null
    // return (
    //   <View style={[
    //     {
    //       width: '100%',
    //       height: dp(24),
    //       backgroundColor: '#eee',
    //       flexDirection: 'row',
    //       justifyContent: 'flex-start',
    //       alignContent: 'center',
    //     },
    //   ]}>
    //     <Text style={[
    //       {
    //         color: '#666',
    //         fontSize: dp(16),
    //         marginLeft: dp(10),
    //       },
    //     ]}>{section.title.toUpperCase()}</Text>
    //   </View>
    // )
  }

  renderList = () => {
    if(this.state.contactData.length <= 0) {
      return (
        <View style={[{
          width: '100%',
          height: "100%",
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#fafafa',
        }]}>
          <Text
            style={[{
              color: '#999',
              fontSize: dp(14),
            }]}
          >{"当前设备的联系人为空"}</Text>
        </View>
      )
    }
    return (
      <FlatList
        renderItem={({item, index}) => this._renderItem(item, index)}
        data={this.state.contactData}
        keyExtractor={(item, index) => item.ID + "-" + index}
        showsVerticalScrollIndicator={false}
      />
    )
  }

  renderRightItem = (item: string, index: number) => {
    return(
      <TouchableOpacity
        style={[{
          width: dp(20),
          height: dp(20),
          borderRadius: dp(5),
          justifyContent: 'center',
          alignItems: 'center',
        }]}
        onPress={() => {
          this._onSectionselect(index)
        }}
      >
        <Text style={[{
          color: '#333',
          fontSize: dp(12),
        }]}>{item}</Text>
      </TouchableOpacity>
    )
  }

  renderHeaderRight = () => {
    return (
      <TouchableOpacity
        style={styles.addStyle}
        onPress={this.addBtnOnpress}
      >
        <Image style={styles.imgStyle} source={getImage().add_round} />
      </TouchableOpacity>
    )
  }

  renderAddDialog = () => {
    return (
      <Dialog
        ref={ref => (this.addDialog = ref)}
        type={'modal'}
        confirmBtnTitle={getLanguage(this.props.language).Prompt.CONFIRM}
        cancelBtnTitle={getLanguage(this.props.language).Prompt.CANCEL}
        confirmAction={this.addConfirm}
        cancelAction={this.addCancel}
        opacity={1}
        opacityStyle={[{
          height: dp(298),
          backgroundColor: '#fff',
        },
        ]}
        style={[{
          height: dp(298),
          backgroundColor: '#fff',
        },
        ]}
      >
        {this.renderDialogChildren()}
      </Dialog>
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

  operationView = () => {
    return (
      <View
        style={[{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: "100%",
          height: '100%',
          flexDirection: 'column',
        }]}
      >
        <TouchableOpacity
          style={[{
            width: '100%',
            flex: 1,
            backgroundColor: '#000',
            opacity: 0.5,
          }]}
          onPress={() => {
            this.setState({
              morePanShow: false,
              selectItem: null,
            })
          }}
        ></TouchableOpacity>
        <View
          style={[{
            width: "100%",
            height: dp(150),
            backgroundColor: '#fff',
            paddingVertical: dp(10),
          }]}
        >
          <TouchableOpacity
            style={[{
              width: '100%',
              height: dp(40),
              justifyContent: 'center',
              alignItems: 'center',
              marginVertical: dp(10),
            }]}
            onPress={this.editItemAction}
          >
            <Text
              style={[{
                color: '#000',
              }]}
            >{getLanguage(global.language).EDIT}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[{
              width: '100%',
              height: dp(40),
              justifyContent: 'center',
              alignItems: 'center',
            }]}
            onPress={this.deleteItemAction}
          >
            <Text
              style={[{
                color: '#000',
              }]}
            >{getLanguage(global.language).DELETE}</Text>
          </TouchableOpacity>
        </View>
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
          title: getLanguage(global.language).Map_Settings.ADDRESS_BOOK,
          withoutBack: false,
          headerRight: this.renderHeaderRight(),
          navigation: this.props.navigation,
          headerStyle: {
            borderBottomWidth: 0,
            backgroundColor: color.containerHeaderBgColor,
          },
          responseHeaderTitleStyle: {color: color.containerTextColor},
          isResponseHeader: true,
        }}
        // bottomBar={this.renderToolBar()}
        style={{
          flex: 1,
          backgroundColor: '#f3f3f3',
        }}
      >
        {/* <Text>{"我是通讯录页面"}</Text> */}
        {this.renderList()}
        {this.renderAddDialog()}
        {this.state.morePanShow && this.operationView()}

      </Container>
    )
  }
}

const mapStateToProp = (state: RootState) => ({
  mapModules: state.mapModules.toJS(),
  device: state.device.toJS().device,
  language: state.setting.toJS().language,
  contacts: state.langchao.toJS().contacts,
})

const mapDispatch = {
  setCurrentSymbol,
  addContact,
}

type ReduxProps = ConnectedProps<typeof connector>
const connector = connect(mapStateToProp, mapDispatch)

export default connector(ContactsList)

const styles = StyleSheet.create({
  addStyle: {
    // marginTop: dp(50),
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
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
    width: '80%',
    height: dp(44),
    flexDirection: 'row',
    backgroundColor: '#f3f3f3',
    borderRadius: dp(30),
    // marginVertical: dp(5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialogInputContainerAddStyle: {
    borderColor: '#f00',
    borderWidth: dp(1),
  },
  dialogInput: {
    flex: 1,
    height: dp(40),
    paddingVertical: dp(5),
    paddingHorizontal: dp(10),
    backgroundColor: '#f3f3f3',
    borderRadius: dp(30),
    textAlign: 'center',
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

  tipStyle: {
    width: '80%',
    height: dp(12),
    flexDirection: 'row',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: dp(3),
  },
})