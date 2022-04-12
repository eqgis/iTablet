/**
 * Created by imobile-xzy on 2019/3/16.
 */

import React from 'react'
import {
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Image,
} from 'react-native'
import { scaleSize } from '../../../../utils/screen'
import { Container } from '../../../../components'
import { styles } from './Styles'
import AddFriend from './../AddFriend'
import { getLanguage } from '../../../../language/index'
import { getThemeAssets } from '../../../../assets'
import MSGconstant from '../../../../constants/MsgConstant'
import FriendListFileHandle from '../FriendListFileHandle'
import { SimpleDialog } from '../index'
import MessageDataHandle from '../MessageDataHandle'
import moment from 'moment'

export default class InformMessage extends React.Component {
  props: {
    navigation: Object,
  }
  constructor(props) {
    super(props)
    this.screenWidth = Dimensions.get('window').width
    this.friend = {}
    this.state = {
      messageInfo: this.props.route.params.messageInfo,
      currentUser: this.props.route.params.user,
    }
    this.language = this.props.route.params.language
    this.friend = this.props.route.params.friend
  }
  componentDidMount() {
    this.setState(() => {
      return {
        messageInfo: this.props.route.params.messageInfo,
        currentUser: this.props.route.params.user,
      }
    })
  }

  // eslint-disable-next-line
  componentWillReceiveProps(nextProps) {
    this.getContacts(nextProps)
  }

  _onSectionselect = item => {
    switch (item.type) {
      case MSGconstant.MSG_ADD_FRIEND:
        if (!FriendListFileHandle.isFriend(item.originMsg.user.id)) {
          this.SimpleDialog.set({
            text: getLanguage(this.language).Friends.FRIEND_RESPOND,
            confirmAction: () => {
              this._acceptFriend(item)
              item.originMsg.consumed = true
              MessageDataHandle.editMessage({
                userId: this.state.currentUser.userName,
                talkId: item.originMsg.user.groupID,
                msgId: item.msgId,
                type: item.type,
                editItem: item,
              })
              this.setState({
                messageInfo: JSON.parse(JSON.stringify(this.state.messageInfo)),
              })
            },
          })
          this.SimpleDialog.setVisible(true)
        } else {
          item.originMsg.consumed = true
          MessageDataHandle.editMessage({
            userId: this.state.currentUser.userName,
            talkId: item.originMsg.user.groupID,
            msgId: item.msgId,
            type: item.type,
            editItem: item,
          })
          this.setState({
            messageInfo: JSON.parse(JSON.stringify(this.state.messageInfo)),
          })
        }
        break
      default:
        break
    }
  }

  _acceptFriend = item => {
    let curUserName = this.state.currentUser.nickname
    let uuid = this.state.currentUser.userName
    let ctime = new Date()
    let time = Date.parse(ctime)
    let message = {
      message: '',
      type: MSGconstant.MSG_ACCEPT_FRIEND,
      user: {
        name: curUserName,
        id: uuid,
        groupID: uuid,
        groupName: '',
      },
      time: time,
    }
    this.friend._sendMessage(
      JSON.stringify(message),
      item.originMsg.user.id || item.originMsg.user.name,
      false,
    )

    AddFriend.acceptFriendAdd(
      [item.originMsg.user.id, item.originMsg.user.name],
      1,
      () => {
        this.friend.refreshList()
      },
    )
  }

  renderSimpleDialog = () => {
    return <SimpleDialog ref={ref => (this.SimpleDialog = ref)} />
  }

  render() {
    //console.log(params.user);
    return (
      <Container
        ref={ref => (this.container = ref)}
        headerProps={{
          title: getLanguage(this.language).Friends.TITLE_NOTIFICATION,
          // '通知消息',
          withoutBack: false,
          navigation: this.props.navigation,
        }}
      >
        <FlatList
          style={{
            top: scaleSize(10),
          }}
          data={this.state.messageInfo}
          ItemSeparatorComponent={() => {
            return <View style={styles.SectionSeparatorLineStyle} />
          }}
          // extraData={this.state}
          // eslint-disable-next-line
          renderItem={({ item, index }) => this._renderItem(item)}
          initialNumToRender={2}
          keyExtractor={(item, index) => index.toString()}
          onEndReached={this._fetchMoreData}
          onEndReachedThreshold={0.3}
          returnKeyType={'search'}
          keyboardDismissMode={'on-drag'}
        />
        {this.renderSimpleDialog()}
      </Container>
    )
  }

  _renderItem(item, index) {
    let lastMessage = this.friend.loadMsg(item)
    let time = item.originMsg.time
    let ctime = new Date(time)
    let timeString = item.originMsg.consumed
      ? getLanguage(this.language).Friends.ADDED
      : moment(ctime).format('YYYY/MM/DD HH:mm')
    // let timeString =
    //   '' +
    //   ctime.getFullYear() +
    //   '/' +
    //   (ctime.getMonth() + 1) +
    //   '/' +
    //   ctime.getDate() +
    //   ' ' +
    //   ctime.getHours() +
    //   ':' +
    //   ctime.getMinutes()
    // let opacity = 1.0
    // if (item.originMsg.consumed) {
    //   opacity = 0.3
    // }
    return (
      <TouchableOpacity
        style={[styles.ItemViewStyle]}
        activeOpacity={0.75}
        disabled={item.originMsg.consumed || false}
        onPress={() => {
          this._onSectionselect(item, index)
        }}
      >
        <Image
          style={styles.itemImg}
          resizeMode={'contain'}
          source={getThemeAssets().friend.contact_photo}
        />
        <View style={styles.ITemTextViewStyle}>
          <Text style={styles.ITemTextStyle}>{item.originMsg.user.name}</Text>
          <Text
            style={{
              fontSize: scaleSize(20),
              color: 'grey',
              top: scaleSize(10),
            }}
          >
            {lastMessage.text}
          </Text>
        </View>
        <View
          style={{
            marginRight: scaleSize(20),
            flexDirection: 'column',
            justifyContent: 'flex-end',
            // flexGrow: 1,
          }}
        >
          <Text
            style={{
              fontSize: scaleSize(20),
              color: 'grey',
              textAlign: 'right',
            }}
          >
            {timeString}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }
}
