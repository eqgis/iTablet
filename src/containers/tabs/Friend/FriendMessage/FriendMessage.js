/**
 * Created by imobile-xzy on 2019/3/4.
 */

import React, { Component } from 'react'
import {
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
} from 'react-native'
import NavigationService from '../../../NavigationService'
import { scaleSize } from '../../../../utils/screen'
import { Dialog, PopoverButtonsView } from '../../../../components'
import { Rect } from 'react-native-popover-view'
import { styles } from './Styles'
import { dialogStyles } from './../Styles'
import FriendListFileHandle from '../FriendListFileHandle'
import MessageDataHandle from './../MessageDataHandle'
import { getLanguage } from '../../../../language'
import { getThemeAssets, getPublicAssets } from '../../../../assets'
import moment from 'moment'

class FriendMessage extends Component {
  props: {
    language: String,
    friend: Object,
    user: Object,
    chat: Array,
  }

  constructor(props) {
    super(props)
    this.screenWidth = Dimensions.get('window').width
    this.inFormData = []
    this.target
    //this.chat;
    this.state = {
      data: [],
      bRefesh: true,
      hasInformMsg: 0,
    }
    this.Popover = undefined // 长按弹窗
    this.listRefs = {} // 列表item ref
  }

  refresh = () => {
    this.getContacts()
  }
  componentDidMount() {
    // this.chat = this.props.friend.props.chat
    this.getContacts()
  }

  shouldComponentUpdate(prevProps, prevState) {
    if (
      JSON.stringify(prevProps.user) !== JSON.stringify(this.props.user) ||
      JSON.stringify(prevProps.chat) !== JSON.stringify(this.props.chat) ||
      JSON.stringify(prevState) !== JSON.stringify(this.state) ||
      prevProps.language !== this.props.language
    ) {
      return true
    }
    return false
  }

  componentDidUpdate(prevProps) {
    if (
      JSON.stringify(prevProps.user) !== JSON.stringify(this.props.user) ||
      JSON.stringify(prevProps.chat) !== JSON.stringify(this.props.chat)
    ) {
      this.getContacts()
    }
  }

  // eslint-disable-next-line
  // componentWillReceiveProps(nextProps) {
  //   this.getContacts(nextProps)
  // }

  getContacts = () => {
    let srcData = []
    this.inFormData = []
    let currentUser
    if (this.props.chat.hasOwnProperty(this.props.user.userName)) {
      currentUser = this.props.chat[this.props.user.userName]
      let keys = Object.keys(currentUser)
      for (let i = 0, key = ''; i < keys.length; i++) {
        key = keys[i]
        let messageHistory = currentUser[key].history
        let unReadMsg = currentUser[key].unReadMsg
        if (key === '1') {
          this.setState({ hasInformMsg: unReadMsg })
          // this.hasInformMsg = unReadMsg;
          //通知类
          for (let i = 0; i < messageHistory.length; i++) {
            let messageStruct = messageHistory[i]
            this.inFormData.push(messageStruct)
          }
        } else {
          let obj = undefined
          if (key.indexOf('Group_') === -1) {
            obj = FriendListFileHandle.findFromFriendList(key)
            if (obj) {
              let friend = {
                id: key,
                users: [obj.markName],
                message: messageHistory,
                title: obj.markName,
                unReadMsg: unReadMsg,
              }
              srcData.push(friend)
            }
          } else {
            //group
            obj = FriendListFileHandle.findFromGroupList(key)
            if (obj) {
              let friend = {
                id: key,
                users: obj.members,
                message: messageHistory,
                title: obj.groupName,
                unReadMsg: unReadMsg,
              }
              srcData.push(friend)
            }
          }
        }
      }
    }
    if (this.inFormData.length > 1) {
      this.inFormData = this.inFormData.sort((obj1, obj2) => {
        let time1 = obj1.time
        let time2 = obj2.time
        return time2 - time1
      })
    }
    if (srcData.length > 1) {
      srcData = srcData.sort((obj1, obj2) => {
        let msg1 = obj1.message[obj1.message.length - 1]
        let msg2 = obj2.message[obj2.message.length - 1]
        if (msg1 && msg2) {
          let time1 = msg1.originMsg.time
          let time2 = msg2.originMsg.time
          return time2 - time1
        } else {
          return true
        }
      })
    }
    this.setState({
      data: srcData,
    })
  }

  _onSectionselect = item => {
    this.target = item
    NavigationService.navigate('Chat', {
      targetId: item.id,
    })
  }

  render() {
    return (
      <View
        style={styles.contentView}
      >
        {this._renderInformItem()}
        <View style={styles.itemSeparator} />
        <FlatList
          style={styles.list}
          ItemSeparatorComponent={() => {
            return <View style={styles.itemSeparator} />
          }}
          data={this.state.data}
          renderItem={({ item, index }) => this._renderItem(item, index)}
          keyExtractor={(item, index) => index.toString()}
        />
        <PopoverButtonsView
          ref={ref => this.Popover = ref}
          backgroundStyle={{backgroundColor: 'rgba(0, 0, 0, 0)'}}
          popoverStyle={{backgroundColor: 'rgba(0, 0, 0, 1)'}}
        />
        {this.renderDialog()}
      </View>
    )
  }

  _showPopover = (pressView, item) => {
    let items = []
    if (!item) {
      items = [
        {
          title: getLanguage(this.props.language).Friends.CLEAR_NOTIFICATION,
          // '清空通知消息',
          onPress: () => {
            MessageDataHandle.delMessage({
              //清除未读信息
              userId: this.props.user.userName, //当前登录账户的id
              talkId: 1, //会话ID
            })
          },
        },
      ]
    } else {
      this.target = item
      // let friendMsgHandle = this
      let obj = {
        title: getLanguage(this.props.language).Friends.MARK_READ,
        // '标记已读',
        onPress: () => {
          MessageDataHandle.readMessage({
            //清除未读信息
            userId: this.props.user.userName, //当前登录账户的id
            talkId: this.target.id, //会话ID
          })
        },
      }
      if (item.unReadMsg === 0) {
        obj = {
          title: getLanguage(this.props.language).Friends.MARK_UNREAD,
          // '标记未读',
          onPress: () => {
            MessageDataHandle.unReadMessage({
              //清除未读信息
              userId: this.props.user.userName, //当前登录账户的id
              talkId: this.target.id, //会话ID
            })
          },
        }
      }
      items = [
        obj,
        {
          title: getLanguage(this.props.language).Friends.DEL,
          // '删除',
          onPress: () => {
            this.dialog.setDialogVisible(true)
          },
        },
      ]
    }
    pressView?.measure((ox, oy, width, height, px, py) => {
      this.Popover?.setVisible(true, new Rect(px + 1, py + 1, width, height), items)
    })
  }
  
  _renderDot = num => {
    return (
      <View
        style={{
          position: 'absolute',
          backgroundColor: 'red',
          justifyContent: 'center',
          height: scaleSize(25),
          width: scaleSize(25),
          borderRadius: scaleSize(25),
          top: scaleSize(-6),
          right: scaleSize(-12),
        }}
      >
        <Text
          style={{
            fontSize: scaleSize(20),
            color: 'white',
            textAlign: 'center',
          }}
        >
          {num}
        </Text>
      </View>
    )
  }

  _renderInformItem() {
    return (
      <TouchableOpacity
        style={styles.listHeader}
        ref={ref => (this.listRefs['info'] = ref)}
        activeOpacity={0.75}
        onLongPress={() => {
          this._showPopover(this.listRefs['info'])
        }}
        onPress={() => {
          MessageDataHandle.readMessage({
            //清除未读信息
            userId: this.props.user.userName, //当前登录账户的id
            talkId: 1, //会话ID
          })
          NavigationService.navigate('InformMessage', {
            user: this.props.user,
            messageInfo: this.inFormData,
            friend: this.props.friend,
            language: this.props.language,
          })
        }}
      >
        <ImageBackground
          style={styles.itemImg}
          resizeMode={'contain'}
          source={getThemeAssets().friend.icon_notice}
        >
          {
            this.state.hasInformMsg > 0 &&
            this._renderDot(this.state.hasInformMsg)
          }
        </ImageBackground>
        <View style={styles.ITemTextViewStyle}>
          <Text style={styles.ITemTextStyle}>
            {getLanguage(this.props.language).Friends.NOTIFICATION}
          </Text>
        </View>
        <Image
          source={getPublicAssets().common.icon_move}
          style={styles.rightImg}
        />
      </TouchableOpacity>
    )
  }
  _renderItem(item, index) {
    if (item && item['message'].length > 0) {
      let lastMessage = item['message'][item['message'].length - 1]
      lastMessage = this.props.friend.loadMsg(lastMessage)
      let time = lastMessage.originMsg.time
      let ctime = new Date(time)
      let timeString = moment(ctime).format('YYYY/MM/DD HH:mm')
      return (
        <TouchableOpacity
          ref={ref => (this.listRefs[item.id] = ref)}
          style={styles.ItemViewStyle}
          activeOpacity={0.75}
          onPress={() => {
            this._onSectionselect(item, index)
          }}
          onLongPress={() => {
            this._showPopover(this.listRefs[item.id], item)
          }}
        >
          <View>
            <Image
              style={styles.itemImg}
              resizeMode={'contain'}
              source={getThemeAssets().friend.contact_photo}
            />
            {
              item.unReadMsg > 0 &&
              this._renderDot(item.unReadMsg)
            }
          </View>
          <View style={styles.ITemTextViewStyle}>
            {this._renderItemTitleView(item)}
            <Text
              numberOfLines={2}
              style={{
                fontSize: scaleSize(20),
                color: 'grey',
                top: scaleSize(10),
              }}
            >
              {lastMessage.text.replace(/[\r\n]/g, '')}
            </Text>
          </View>
          <Text style={styles.timeStr}>
            {timeString}
          </Text>
        </TouchableOpacity>
      )
    }
  }

  _renderItemHeadView(item) {
    if (item.users.length > 1) {
      let texts = []
      for (let i = 0; i < item['users'].length; i++) {
        if (i > 4) break
        texts.push(
          <Text
            key={i}
            style={{ fontSize: scaleSize(18), color: 'white', top: 2, left: 1 }}
          >
            {item['users'][i].name[0].toUpperCase() + ' '}
          </Text>,
        )
      }
      return texts
    } else {
      return <Text style={styles.ITemHeadTextStyle}>{item['users'][0][0]}</Text>
    }
  }
  // eslint-disable-next-line
  _renderItemTitleView(item) {
    return (
      <Text style={styles.ITemTextStyle} ellipsizeMode="tail" numberOfLines={1}>
        {item['title']}
      </Text>
    )
  }

  renderDialogChildren = () => {
    return (
      <View style={dialogStyles.dialogHeaderViewX}>
        <Image
          source={require('../../../../assets/home/Frenchgrey/icon_prompt.png')}
          style={dialogStyles.dialogHeaderImgX}
        />
        <Text style={dialogStyles.promptTtileX}>
          {getLanguage(this.props.language).Friends.ALERT_DEL_HISTORY}
          {/* 删除后,将清空该聊天的消息记录 */}
        </Text>
      </View>
    )
  }
  renderDialog = () => {
    return (
      <Dialog
        ref={ref => (this.dialog = ref)}
        type={'modal'}
        confirmBtnTitle={getLanguage(this.props.language).Friends.CONFIRM}
        cancelBtnTitle={getLanguage(this.props.language).Friends.CANCEL}
        confirmAction={() => {
          MessageDataHandle.delMessage({
            //清除未读信息
            userId: this.props.user.userName, //当前登录账户的id
            talkId: this.target.id, //会话ID
          })
          if (this.listRefs[this.target.id]) {
            delete this.listRefs[this.target.id]
          }
          this.dialog.setDialogVisible(false)
        }}
        opacity={1}
        opacityStyle={dialogStyles.dialogBackgroundX}
        style={dialogStyles.dialogBackgroundX}
      >
        {this.renderDialogChildren()}
      </Dialog>
    )
  }
}

export default FriendMessage
