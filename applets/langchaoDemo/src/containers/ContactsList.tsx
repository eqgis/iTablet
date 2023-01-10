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
import { getTelBook, upDateTelBook } from "../utils/langchaoServer"
import { getData } from "@/Toolbar/modules/arSandTable/Data"


interface telBookItemInfoType {
  UserId: string,
  // UserName: string,
  Contacts: string,
  Tel: string,
  MobilePhone: string,
  Email: string,
  PostalCode: string,
  Address: string,
  // OpType: "I" | "U" | "D",
  uuid: string,
}

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
  contactData: Array<telBookItemInfoType>
  selectItem: telBookItemInfoType | null,
  morePanShow: boolean,
}

// const morckdata = [
//   {
//     UserId: '101',
//     Contacts: '张三',
//     Tel: '',
//     MobilePhone: '17711245121',
//     Email: '2648987605@qq.com',
//     PostalCode: '635000',
//     Address: '中国四川成都',
//   },
//   {
//     UserId: '102',
//     Contacts: '李四',
//     Tel: '',
//     MobilePhone: '17358999687',
//     Email: '1540546372@qq.com',
//     PostalCode: '635000',
//     Address: '中国四川达州',
//   },
// ]

class ContactsList extends Component<Props, State> {

  constructor(props: Props) {
    super(props)
    this.state = {
      contactData: [],
      selectItem: null,
      morePanShow: false,
    }
  }

  componentDidMount = async (): void  => {
    try {
      await this.getData()
    } catch (error) {
      // to do
    }
  }

  getData = async () => {
    try {
      const telBookInfo = await getTelBook()
      if(telBookInfo.length > 0) {
        this.setState({
          contactData: telBookInfo,
        })
      }
      // this.setState({
      //   contactData: morckdata,
      // })
    } catch (error) {
      // to do
    }
  }

  itemAction = async (telephone: string, name: string) => {
    try {
      if(telephone === '') return
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
        await SCollector.startCollect(type)

        // const url = 'tel:' + telephone
        // Linking.openURL(url)
        RNImmediatePhoneCall.immediatePhoneCall(telephone)

        clearTimeout(timer)
      }, 1000)


    } catch (error) {
      console.warn("error：" + JSON.stringify(error))
    }
  }


  addBtnOnpress = () => {
    NavigationService.navigate('EditContactItem', {
      type: 'I',
    })
  }

  editItemAction = () => {
    // 编辑对象
    this.setState({
      morePanShow: false,
    })
    const data = {
      ...this.state.selectItem,
      UserName: this.props.userName,
    }
    NavigationService.navigate('EditContactItem', {
      type: 'U',
      data,
    })
  }

  deleteItemAction = async () => {
    // 删除对象
    this.setState({
      morePanShow: false,
      selectItem: null,
    })
    const data = {
      ...this.state.selectItem,
      UserName: this.props.userName,
    }
    const result = await upDateTelBook(data, "D")
    if(result) {
      Toast.show("操作成功")
      await this.getData()
    } else {
      Toast.show("操作失败")
    }
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

  _renderItem(item: telBookItemInfoType, index: number) {
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
            this.itemAction(item.MobilePhone || item.Tel || '', item.Contacts)
          }}
        >
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
            }]}>{item.Contacts}</Text>
            <Text style={[{
              color: '#999',
              fontSize: dp(14)
            }]}>{item.MobilePhone || item.Tel || ''}</Text>
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
        keyExtractor={(item, index) => item.UserId + "-" + index}
        showsVerticalScrollIndicator={false}
      />
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
        {this.state.morePanShow && this.operationView()}

      </Container>
    )
  }
}

const mapStateToProp = (state: RootState) => ({
  mapModules: state.mapModules.toJS(),
  device: state.device.toJS().device,
  language: state.setting.toJS().language,
  // contacts: state.langchao.toJS().contacts,
  userName: state.langchao.toJS().userName,
})

const mapDispatch = {
  setCurrentSymbol,
  // addContact,
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