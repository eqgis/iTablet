import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  FlatList,
  PermissionsAndroid,
  Platform,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Animated,
} from 'react-native'
import { Container, Dialog } from '../../../components'
import { dialogStyles } from './Styles'
import { getLanguage } from '../../../language'
// eslint-disable-next-line
import Contacts from 'react-native-contacts'
import { Toast, OnlineServicesUtils, scaleSize } from '../../../utils'
import { getThemeAssets } from '../../../assets'
import { size, color } from '../../../styles'
import FriendListFileHandle from './FriendListFileHandle'
import { MsgConstant } from '../../../constants'
import NavigationService from '../../NavigationService'

const JSOnlineServices = new OnlineServicesUtils('online')
class RecommendFriend extends Component {
  props: {
    navigation: Object,
    user: Object,
  }

  constructor(props) {
    super(props)
    this.screenWidth = Dimensions.get('window').width
    this.target
    this.friend = this.props.navigation.getParam('friend')
    this.user = this.props.navigation.getParam('user')
    this.state = {
      loading: false,
      contacts: [],
    }
    this.language = this.props.navigation.getParam('language')
    this.search = this.search.bind(this)
    this._renderItem = this._renderItem.bind(this)
    this.addFriendRequest = this.addFriendRequest.bind(this)
    this.exit = false
    this.loadingHeight = new Animated.Value(0)
  }

  componentDidMount() {
    setTimeout(this.requestPermission, 1000)
  }

  componentWillUnmount() {
    this.exit = true
  }

  requestPermission = async () => {
    if (Platform.OS === 'android') {
      let granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
      )
      if (granted == PermissionsAndroid.RESULTS.GRANTED) {
        this.getContacts()
      } else {
        this.permissionDeniedDialog.setDialogVisible(true)
      }
    } else {
      Contacts.checkPermission((err, permission) => {
        if (err) throw err
        if (permission === 'undefined') {
          Contacts.requestPermission((err, permission) => {
            if (err) throw err
            if (permission === 'authorized') {
              this.getContacts()
            }
            if (permission === 'denied') {
              this.permissionDeniedDialog.setDialogVisible(true)
            }
          })
        }
        if (permission === 'authorized') {
          this.getContacts()
        }
        if (permission === 'denied') {
          this.permissionDeniedDialog.setDialogVisible(true)
        }
      })
    }
  }

  setLoadingVisible = visible => {
    Animated.timing(this.loadingHeight, {
      toValue: visible ? 40 : 0,
      duration: 800,
    }).start()
    this.setState({
      loading: visible,
    })
  }

  getContacts = async () => {
    Contacts.getAll(async (err, contacts) => {
      if (err === 'denied') {
        this.permissionDeniedDialog.setDialogVisible(true)
      } else {
        this.setLoadingVisible(true)
        let contactsArr = []
        let subContacts = []
        contacts.forEach((item, index) => {
          subContacts.push(item)
          if (index > 0 && (index + 1) % 5 === 0) {
            contactsArr.push(subContacts)
            subContacts = []
          }
          if (index === contacts.length - 1 && subContacts.length > 0) {
            contactsArr.push(subContacts)
          }
        })
        for (let n = 0; n < contactsArr.length; n++) {
          let results = []
          let subArr = contactsArr[n]
          //5个一组同时查询
          for (let i = 0; i < subArr.length; i++) {
            let item = subArr[i]
            if (
              item.phoneNumbers.length > 0 ||
              item.emailAddresses.length > 0
            ) {
              results.push(
                this.search({
                  familyName: item.familyName,
                  givenName: item.givenName,
                  phoneNumbers: item.phoneNumbers,
                  emails: item.emailAddresses,
                }),
              )
              if (this.exit) {
                GLOBAL.Loading.setLoading(false)
                return
              }
            }
          }
          await Promise.all(results)
        }
        this.setLoadingVisible(false)
        if (this.state.contacts.length === 0) {
          Toast.show(getLanguage(this.language).Friends.FIND_NONE)
        }
      }
    })
  }

  async search(val) {
    for (let i = 0; i < val.phoneNumbers.length; i++) {
      if (!val.phoneNumbers[i]) {
        break
      }
      if (val.phoneNumbers[i].label !== 'mobile') {
        break
      }
      let number = this.formatPhoneNumber(val.phoneNumbers[i].number)
      let result = await JSOnlineServices.getUserInfo(number, false)
      if (result !== false && result !== '获取用户id失败') {
        if (
          result.userId &&
          result.userId !== this.user.userId &&
          !FriendListFileHandle.isFriend(result.userId) &&
          result.nickname
        ) {
          let array = this.state.contacts
          array.push({
            familyName: val.familyName,
            givenName: val.givenName,
            phoneNumbers: val.phoneNumbers[i],
            id: result.userId,
            name: result.nickname,
          })
          this.setState({
            contacts: this.state.contacts.map(item => {
              return item
            }),
          })
        }
      }
    }
    for (let i = 0; i < val.emails.length; i++) {
      let result = await JSOnlineServices.getUserInfo(val.emails[i].email, true)
      if (result !== false && result !== '获取用户id失败') {
        if (
          result.userId &&
          result.userId !== this.user.userId &&
          !FriendListFileHandle.isFriend(result.userId) &&
          result.nickname
        ) {
          let array = this.state.contacts
          array.push({
            familyName: val.familyName,
            givenName: val.givenName,
            email: val.emails[i].email,
            id: result.userId,
            name: result.nickname,
          })
          this.setState({
            contacts: this.state.contacts.map(item => {
              return item
            }),
          })
        }
      }
    }
  }

  formatPhoneNumber = number => {
    number = number.replace(/\s+/g, '')
    number = number.replace(/\D+/g, '')
    return number
  }

  async addFriendRequest() {
    this.dialog.setDialogVisible(false)

    let ctime = new Date()
    let time = Date.parse(ctime)
    let message = {
      message: this.user.nickname + ' 请求添加您为好友',
      type: MsgConstant.MSG_ADD_FRIEND,
      user: {
        name: this.user.nickname,
        id: this.user.userId,
        groupID: this.user.userId,
        groupName: '',
      },
      time: time,
    }

    this.friend._sendMessage(JSON.stringify(message), this.target.id, true)

    FriendListFileHandle.addToFriendList({
      markName: this.target.name,
      name: this.target.name,
      id: this.target.id,
      info: { isFriend: 1 },
    })
  }

  render() {
    return (
      <Container
        ref={ref => (this.container = ref)}
        headerProps={{
          title: getLanguage(GLOBAL.language).Friends.RECOMMEND_FRIEND,
          withoutBack: false,
          navigation: this.props.navigation,
        }}
      >
        <Animated.View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            height: this.loadingHeight,
          }}
        >
          {this.state.loading && (
            <ActivityIndicator size="small" color="#505050" />
          )}
          {this.state.loading && (
            <Text
              style={{
                marginLeft: 10,
                fontSize: scaleSize(24),
                color: 'black',
              }}
            >
              {getLanguage(this.language).Friends.SEARCHING}
            </Text>
          )}
        </Animated.View>
        <FlatList
          style={{
            top: scaleSize(10),
          }}
          data={this.state.contacts}
          renderItem={this._renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
        {this.renderDialog()}
        {this.renderPermissionDenidDialog()}
      </Container>
    )
  }

  _renderItem({ item }) {
    return (
      <View>
        <TouchableOpacity
          style={[styles.ItemViewStyle]}
          activeOpacity={0.75}
          onPress={() => {
            this.target = item //[id,name]
            if (this.target.id === this.user.userId) {
              Toast.show(getLanguage(this.language).Friends.ADD_SELF)
              return
            }
            if (FriendListFileHandle.isFriend(this.target.id)) {
              NavigationService.navigate('Chat', {
                targetId: this.target.id,
              })
            } else {
              this.dialog.setDialogVisible(true)
            }
          }}
        >
          <Image
            style={styles.itemImg}
            resizeMode={'contain'}
            source={getThemeAssets().friend.contact_photo}
          />
          <View style={{ flexDirection: 'column', justifyContent: 'space-between' }}>
            <View style={[styles.ItemTextViewStyle, { opacity: 1 }]}>
              <Text style={styles.ItemTextStyle}>{item.name}</Text>
            </View>
            <View style={styles.ItemSubTextViewStyle}>
              <Text style={styles.ItemSubTextStyle}>
                {item.familyName === null || item.familyName === ''
                  ? ''
                  : item.familyName + ' '}
                {item.givenName === null ? '' : item.givenName}
              </Text>
              <Text style={styles.ItemSubTextStyle}>
                {item.phoneNumbers ? item.phoneNumbers.number : item.email}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  renderDialog = () => {
    return (
      <Dialog
        ref={ref => (this.dialog = ref)}
        type={'modal'}
        confirmBtnTitle={getLanguage(this.language).Friends.CONFIRM}
        cancelBtnTitle={getLanguage(this.language).Friends.CANCEL}
        confirmAction={this.addFriendRequest}
        opacity={1}
        opacityStyle={dialogStyles.dialogBackgroundX}
        style={dialogStyles.dialogBackgroundX}
      >
        {this.renderDialogChildren()}
      </Dialog>
    )
  }

  renderDialogChildren = () => {
    return (
      <View style={dialogStyles.dialogHeaderViewX}>
        <Image
          source={require('../../../assets/home/Frenchgrey/icon_prompt.png')}
          style={dialogStyles.dialogHeaderImgX}
        />
        <Text style={dialogStyles.promptTtileX}>
          {getLanguage(this.language).Friends.ADD_AS_FRIEND}
        </Text>
      </View>
    )
  }

  renderPermissionDenidDialog = () => {
    return (
      <Dialog
        ref={ref => (this.permissionDeniedDialog = ref)}
        type={'modal'}
        confirmBtnTitle={getLanguage(this.language).Friends.CONFIRM}
        cancelBtnTitle={getLanguage(this.language).Friends.CANCEL}
        confirmAction={() => {
          this.permissionDeniedDialog.setDialogVisible(false)
        }}
        opacity={1}
        opacityStyle={dialogStyles.dialogBackgroundX}
        style={dialogStyles.dialogBackgroundX}
      >
        <View style={dialogStyles.dialogHeaderViewX}>
          <Image
            source={require('../../../assets/home/Frenchgrey/icon_prompt.png')}
            style={dialogStyles.dialogHeaderImgX}
          />
          <Text style={dialogStyles.promptTtileX}>
            {getLanguage(this.language).Friends.PERMISSION_DENIED_CONTACT}
          </Text>
        </View>
      </Dialog>
    )
  }
}

// eslint-disable-next-line no-unused-vars
var styles = StyleSheet.create({
  SectionSeparatorLineStyle: {
    height: scaleSize(1),
    backgroundColor: 'rgba(160,160,160,1.0)',
    marginHorizontal: scaleSize(10),
    marginLeft: scaleSize(120),
  },
  ItemViewStyle: {
    paddingLeft: scaleSize(20),
    paddingRight: scaleSize(30),
    height: scaleSize(90),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  ItemHeadViewStyle: {
    marginLeft: scaleSize(20),
    height: scaleSize(40),
    width: scaleSize(40),
    borderRadius: scaleSize(40),
    backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ItemTextStyle: {
    fontSize: size.fontSize.fontSizeLg,
    color: color.fontColorGray2,
  },
  itemImg: {
    marginLeft: scaleSize(32),
    height: scaleSize(60),
    width: scaleSize(60),
    borderRadius: scaleSize(30),
    alignItems: 'center',
    justifyContent: 'center',
  },
  ItemTextViewStyle: {
    marginLeft: scaleSize(32),
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  ItemHeadTextStyle: {
    fontSize: size.fontSize.fontSizeLg,
    color: color.contentColorBlack,
  },
  ItemSubTextViewStyle: {
    marginLeft: scaleSize(32),
    flexDirection: 'row',
  },
  ItemSubTextStyle: {
    fontSize: size.fontSize.fontSizeMd,
    marginRight: scaleSize(10),
    color: color.fontColorGray2,
  },
})
export default RecommendFriend
