import MapToolbar from "@/containers/workspace/components/MapToolbar"
import { RootState } from "@/redux/types"
import React, { Component } from "react"
import { SectionList, PermissionsAndroid, View, Text, TouchableOpacity, Linking, FlatList, Image, StyleSheet, TextInput } from "react-native"
import { connect, ConnectedProps } from "react-redux"
import { Container, Dialog } from '../../../../../../src/components'
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

interface contactItemType {
  recordID: string,
  name: string, // displayName
  phone: string, // phoneNumbers[0].number
  firstChar: string,
}

interface contactDataType {
  title: string,
  data: Array<contactItemType>
}

interface Props extends ReduxProps {
	navigation: any,
	mapModules: any,
  device: any,
  language: string,
  setCurrentSymbol: (param: any) => void,
}

interface State {
	// to do
  contactData: Array<contactDataType>
  letterArray: Array<string>
  addName: string
  addNumber: string
}

class ContactsList extends Component<Props, State> {
  _sectionList: SectionList | undefined | null = null
  addDialog: Dialog | undefined | null = null

  constructor(props: Props) {
    super(props)
    this.state = {
      contactData: [],
      letterArray: [],
      addName: '',
      addNumber: '',
    }
  }

  componentDidMount = async (): Promise<void> => {
    this.getContactData()
  }

  componentDidUpdate = (prevProps: Readonly<Props>, prevState: Readonly<State>): void => {
    // if(this.props !== prevProps || prevState !== this.state) {
    //   this.getContactData()
    // }
  }

  /** 获取联系人列表数据 */
  getContactData = async (): Promise<void> => {
    // 临时的联系人数据
    const contactDataTemp: Array<contactDataType> = []
    // 首字母数组
    let letterArray: Array<string> = []
    try {
      // 在使用Contacts的方法之前必须先确定要有相关权限
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        {
          'title': 'Contacts',
          'message': 'This app would like to view your contacts.',
          'buttonPositive': 'Please accept bare mortal'
        }
      )
      // 获取联系人列表
      const contacts = await Contacts.getAll()

      // 获取首字母数组
      await contacts.map((contact) => {
        // console.warn("contact: " + JSON.stringify(contact))
        // 获取名字首字母
        const letterFirst = getPinYin(contact.displayName, "", true).substring(0, 1)
        letterArray.push(letterFirst)
        // 数组排序并去重
        letterArray = [...new Set(letterArray)].sort()
      })

      // 将联系人分类的数据结构搭好
      await letterArray.map((item: string) => {
        contactDataTemp.push({
          title: item,
          data: [],
        })
      })

      // 将联系人放进各自的分类里
      contacts.map((contact) => {
        contactDataTemp.map((item: contactDataType) => {
          try {
            // 获取名字首字母
            const letterFirst = getPinYin(contact.displayName, "", true).substring(0, 1)
            // 获取名字第一个字符
            const firstChar = contact.displayName.substring(0, 1)

            const reg = new RegExp("-", 'gi')
            // 构造联系人对象
            const contactItem: contactItemType = {
              recordID: contact.recordID,
              name: contact.displayName,
              phone: contact.phoneNumbers[0].number.replace(reg, ""),
              firstChar,
            }

            // console.warn("obj: " + JSON.stringify(contactItem))
            if (item.title === letterFirst) {
              item.data.push(contactItem)
            }
          } catch (error) {
            console.warn(item.title + " - " + contact.displayName + " - " + JSON.stringify(error))
          }

        })
      })

      this.setState({
        letterArray: letterArray,
        contactData: JSON.parse(JSON.stringify(contactDataTemp)),
      })


    } catch (error) {
      console.warn("获取联系人列表失败")

      this.setState({
        letterArray: letterArray,
        contactData: JSON.parse(JSON.stringify(contactDataTemp)),
      })
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
    const firstChar = this.state.addName.substring(0, 1)
    const givenName = this.state.addName.substring(1, this.state.addName.length)
    const newPerson = {
      phoneNumbers: [{
        label: "mobile",
        number: this.state.addNumber,
      }],
      familyName: firstChar,
      displayName: this.state.addName,
      givenName: givenName,
    }
    Contacts.addContact(newPerson)
    this.addDialog?.setDialogVisible(false)
    this.setState({
      addName: '',
      addNumber: '',
    })
    this.getContactData()
  }

  addCancel = () => {
    this.addDialog?.setDialogVisible(false)
    this.setState({
      addName: '',
      addNumber: '',
    })
  }

  // /**
  //  * 底部工具栏
  //  * @returns {XML}
  //  */
  // renderToolBar = () => {
  //   return (
  //     <MapToolbar
  //       navigation={this.props.navigation}
  //       mapModules={this.props.mapModules}
  //       initIndex={2}
  //       type={"langchao"}
  //     />
  //   )
  // }
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
    return (
      <TouchableOpacity
        style={[{
          width: '100%',
          height: dp(60),
          backgroundColor: '#fff',
          flexDirection: 'row',
          justifyContent:'flex-start',
          alignItems: 'center',
          paddingHorizontal: dp(10),
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
          }]}>{item.firstChar}</Text>
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
    )
  }

  _renderSectionHeader(sectionItem: { section: any }) {
    const section = sectionItem.section
    return (
      <View style={[
        {
          width: '100%',
          height: dp(24),
          backgroundColor: '#eee',
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignContent: 'center',
        },
      ]}>
        <Text style={[
          {
            color: '#666',
            fontSize: dp(16),
            marginLeft: dp(10),
          },
        ]}>{section.title.toUpperCase()}</Text>
      </View>
    )
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
    return(
      <SectionList
        ref={(ref)=> {this._sectionList = ref}}
        renderItem={({item, index}) => this._renderItem(item, index)}
        renderSectionHeader={this._renderSectionHeader}
        sections={this.state.contactData}
        keyExtractor={(item, index) => item.recordID + "-" + index}
        ItemSeparatorComponent={this.renderSeparator}
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

  renderRightLink = () => {
    return(
      <View>
        <FlatList
          data={this.state.letterArray}
          keyExtractor={(item, index) => item + "-" + index}
          renderItem={({item, index}) => this.renderRightItem(item, index)}
          style={[{
            position: 'absolute',
            right: dp(10),
            bottom: dp(50),
            backgroundColor: 'transparent',
          },
          ]}
        />
      </View>
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
          height: dp(218),
          backgroundColor: '#fff',
        },
        ]}
        style={[{
          height: dp(218),
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
        {/* 联系人姓名输入框 */}
        <View style={[styles.dialogInputContainer]}>
          <TextInput
            style = {[styles.dialogInput]}
            placeholder = {getLanguage(global.language).Map_Settings.CONTACT_NAME}
            value = {this.state.addName}
            onChangeText = {(text:string) => {
              this.setState({
                addName: text,
              })
            }}
          />
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.clearBtn}
            onPress={() => {
              this.setState({
                addName: '',
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
        {/* 联系人电话输入框 */}
        <View style={[styles.dialogInputContainer,{
          marginBottom: dp(20),
        }]}>
          <TextInput
            style = {[styles.dialogInput]}
            placeholder = {getLanguage(global.language).Map_Settings.CONTACT_NUMBER}
            value = {this.state.addNumber}
            onChangeText = {(text:string) => {
              this.setState({
                addNumber: text,
              })
            }}
          />
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.clearBtn}
            onPress={() => {
              this.setState({
                addNumber: '',
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
          headerStyle: { borderBottomWidth: 0 },
        }}
        // bottomBar={this.renderToolBar()}
        style={{
          flex: 1,
          backgroundColor: '#fff',
        }}
      >
        {/* <Text>{"我是通讯录页面"}</Text> */}
        {this.renderList()}
        {this.renderRightLink()}
        {this.renderAddDialog()}

      </Container>
    )
  }
}

const mapStateToProp = (state: RootState) => ({
  mapModules: state.mapModules.toJS(),
  device: state.device.toJS().device,
  language: state.setting.toJS().language,
})

const mapDispatch = {
  setCurrentSymbol,
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
    height: dp(40),
    flexDirection: 'row',
    backgroundColor: '#f3f3f3',
    borderRadius: dp(30),
    marginVertical: dp(5),
    justifyContent: 'center',
    alignItems: 'center',
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
})