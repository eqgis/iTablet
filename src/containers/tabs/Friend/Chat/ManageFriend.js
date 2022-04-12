import React, { Component } from 'react'
import {
  ScrollView,
  Text,
  TouchableOpacity,
  // Platform,
  // PermissionsAndroid,
  // NativeModules,
} from 'react-native'
import { Container } from '../../../../components'
import { getLanguage } from '../../../../language/index'
import NavigationService from '../../../NavigationService'
import TouchableItemView from '../TouchableItemView'
import { getThemeAssets } from '../../../../assets'
import { scaleSize, Toast } from '../../../../utils'
import FriendListFileHandle from '../FriendListFileHandle'
import MessageDataHandle from '../MessageDataHandle'
import { SimpleDialog } from '../index'
import { MsgConstant } from '../../../../constants'
import { connect } from 'react-redux'
// let AppUtils = NativeModules.AppUtils

class ManageFriend extends Component {
  props: {
    navigation: Object,
    latestMap: Object,
  }

  constructor(props) {
    super(props)
    this.friend = this.props.route.params.friend
    this.user = this.props.route.params.user
    this.targetId = this.props.route.param.targetId
    this.targetUser = this.friend.getTargetUser(this.targetId)
    this.language = global.language
    this.chat = this.props.route.params.chat
    this.state = {
      contacts: [],
      coworkMode: global.coworkMode,
    }
  }

  _deleteFriend = async () => {
    if (FriendListFileHandle.isFriend(this.targetId)) {
      let ctime = new Date()
      let time = Date.parse(ctime)
      await this.friend._sendMessage(
        JSON.stringify({
          user: {
            name: this.user.userName,
            id: this.user.userName,
            groupID: this.user.userName,
            groupName: '',
          },
          type: MsgConstant.MSG_DEL_FRIEND,
          time: time,
          message: '',
        }),
        this.targetId,
      )
    }
    MessageDataHandle.delMessage({
      userId: this.user.userName, //当前登录账户的id
      talkId: this.targetUser.id, //会话ID
    })
    FriendListFileHandle.delFromFriendList(this.targetUser.id)
    NavigationService.popToTop()
  }

  render() {
    return (
      <Container
        ref={ref => (this.container = ref)}
        headerProps={{
          withoutBack: false,
          navigation: this.props.navigation,
        }}
      >
        {this.renderSimpleDialog()}
        {this.renderSettings()}
      </Container>
    )
  }

  renderSimpleDialog = () => {
    return <SimpleDialog ref={ref => (this.SimpleDialog = ref)} />
  }

  renderSettings = () => {
    return (
      <ScrollView>
        {/* {!this.state.coworkMode && !this.chat.action && (
          <TouchableItemView
            //地图协作
            image={getThemeAssets().friend.friend_map}
            text={getLanguage(global.language).Friends.COWORK}
            onPress={() => {
              NavigationService.navigate('SelectModule')
            }}
          />
        )} */}
        {this.state.coworkMode ? (
          <TouchableItemView
            //退出协作
            image={getThemeAssets().friend.friend_map}
            text={getLanguage(global.language).Friends.EXIT_COWORK}
            onPress={() => {
              this.chat.back()
              // this.friend.setCurMap(undefined)
              // this.setState({coworkMode : false})
              // this.chat.setCoworkMode(false)
            }}
          />
        ) : null}
        <TouchableItemView
          //发消息
          image={getThemeAssets().friend.friend_message}
          text={getLanguage(this.language).Friends.SEND_MESSAGE}
          onPress={() => {
            if (this.chat) {
              NavigationService.goBack('ManageFriend')
            } else {
              this.props.navigation.navigate('Chat', {
                targetId: this.targetId,
                curUser: this.user,
                friend: this.friend,
              })
            }
          }}
        />
        <TouchableItemView
          //设置备注
          image={getThemeAssets().friend.friend_edit}
          text={getLanguage(this.language).Friends.SET_MARKNAME}
          onPress={() => {
            NavigationService.navigate('InputPage', {
              placeholder: FriendListFileHandle.getFriend(this.targetUser.id)
                .markName,
              headerTitle: getLanguage(this.language).Friends.SET_MARKNAME,
              type: 'name',
              cb: value => {
                let len = 0
                for (var i = 0; i < value.length; i++) {
                  if (value.charCodeAt(i) > 127 || value.charCodeAt(i) == 94) {
                    len += 2
                  } else {
                    len++
                  }
                }
                if (len > 40) {
                  Toast.show(
                    getLanguage(this.language).Friends.EXCEED_NAME_LIMIT,
                  )
                  return
                }
                FriendListFileHandle.modifyFriendList(this.targetUser.id, value)
                this.chat && this.chat.onFriendListChanged()
                NavigationService.goBack('InputPage')
              },
            })
          }}
        />
        <TouchableItemView
          //举报
          image={getThemeAssets().friend.friend_report}
          imageStyle={{
            width: scaleSize(40),
            height: scaleSize(40),
          }}
          itemStyle={{paddingLeft: scaleSize(8)}}
          text={getLanguage(this.language).Friends.REPORT}
          onPress={() => {
            NavigationService.navigate('Report',{user: this.user})
          }}
        />
        {/* {删除好友} */}
        <TouchableOpacity
          style={{ alignItems: 'center', paddingVertical: scaleSize(20) }}
          onPress={() => {
            this.SimpleDialog.set({
              text: getLanguage(this.language).Friends.ALERT_DEL_FRIEND,
              confirmAction: () => {
                this._deleteFriend()
              },
            })
            this.SimpleDialog.setVisible(true)
          }}
        >
          <Text style={{ color: 'red', fontSize: scaleSize(26) }}>
            {getLanguage(this.language).Friends.DELETE_FRIEND}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    )
  }
}

const mapStateToProps = state => ({
  latestMap: state.map.toJS().latestMap,
})
const mapDispatchToProps = {}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ManageFriend)
