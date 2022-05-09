/**
 * Created by imobile-xzy on 2019/3/4.
 */

import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  RefreshControl,
} from 'react-native'
import { connect } from 'react-redux'
import NavigationService from '../../../../NavigationService'
import { scaleSize } from '../../../../../utils'
import { UserType, MsgConstant } from '../../../../../constants'
import { Container, TextBtn, TableList, ImageButton, Dialog } from '../../../../../components'
import { color, size } from '../../../../../styles'
import { getThemeAssets, getPublicAssets } from '../../../../../assets'
import { getLanguage } from '../../../../../language'
import SMessageServiceHTTP from '../../../Friend/SMessageServiceHTTP'
import { Users } from '../../../../../redux/models/user'
import { setCurrentGroup, exitGroup } from '../../../../../redux/models/cowork'
import { SCoordination, GroupType, SMessageService } from 'imobile_for_reactnative'
import { Person } from '../types'

interface Props {
  language: string,
  navigation: Object,
  user: Users,
  device: any,
  currentGroup: GroupType,
  setCurrentGroup: (data: any) => void,
  exitGroup: (params: { groupID: number | string }) => any,
}

type State = {
  data: Array<any>,
  dialogInfo: string,
  isRefresh: boolean,
}

interface ItemType {
  item: Person | {title: string},
  rowIndex: number,
  cellIndex: number,
}

class GroupSettingPage extends Component<Props, State> {
  title: string
  servicesUtils: SCoordination | undefined
  dialog: Dialog | null | undefined
  callBack: (data?: any) => any
  dialogAction: (() => void) | null | undefined

  constructor(props: Props) {
    super(props)
    this.callBack = this.props.navigation?.state?.params?.callBack
    this.title = this.props.navigation?.state?.params?.title || getLanguage(this.props.language).Friends.TITLE_CHOOSE_MEMBER

    this.state = {
      data: [], // 所有数组
      dialogInfo: '',
      isRefresh: false,
    }
    if (UserType.isOnlineUser(this.props.user.currentUser)) {
      this.servicesUtils = new SCoordination('online')
    } else if (UserType.isIPortalUser(this.props.user.currentUser)) {
      this.servicesUtils = new SCoordination('iportal')
    }
  }

  componentDidMount() {
    this.getMembers()
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    return (
      JSON.stringify(nextState) !== JSON.stringify(this.state) ||
      JSON.stringify(nextProps) !== JSON.stringify(this.props)
    )
  }

  getMembers = async () => {
    if (!this.props.currentGroup.id) return
    this.servicesUtils?.getGroupMembers({
      groupId: this.props.currentGroup.id,
    }).then((result: any) => {
      let persons = result.content
      if (persons.length > 0) {
        this.setState({
          data: persons,
          isRefresh: false,
        })
      } else {
        this.setState({
          data: [],
          isRefresh: false,
        })
      }
    }).catch(() => {
      this.state.isRefresh && this.setState({
        isRefresh: false,
      })
    })
  }

  _setDialogVisible = (visible: boolean, info?: string) => {
    if (visible === false) {
      this.dialogAction = null
    }
    if (info) {
      this.setState({
        dialogInfo: info,
      }, () => {
        this.dialog?.setDialogVisible(visible)
      })
    } else {
      this.dialog?.setDialogVisible(visible)
    }
  }

  _sendDeleteMsg = () => {
    let timeStr = new Date().getTime()
    let _message = {
      id: 'GROUP_DELETE_' + timeStr,
      message: {
        groupId: this.props.currentGroup.id,
        creator: this.props.currentGroup.creator,
        type: MsgConstant.MSG_ONLINE_GROUP_DELETE,
      },
      type: MsgConstant.MSG_COWORK,
      user: {
        name: this.props.user.currentUser.nickname || '',
        id: this.props.user.currentUser.userId || '',
      },
      time: timeStr,
    }

    let temp = []
    for (let i = 0; i < this.state.data.length; i++) {
      if (this.state.data[i].userName === this.props.user.currentUser.userName) {
        continue
      }
      // SMessageService.sendMessage(
      //   JSON.stringify(_message),
      //   this.state.data[i].userName,
      // )
      temp.push(this.state.data[i].userName)
    }
    SMessageServiceHTTP.sendMessage(
      _message,
      temp,
    )
    this.props.exitGroup && this.props.exitGroup({ groupID: this.props.currentGroup.id })
    this._setDialogVisible(false)
    NavigationService.goBack('CoworkManagePage', null)
  }

  _bottomBtnAction = () => {
    if (this.props.user.currentUser.userName === this.props.currentGroup.creator) {
      // deleteGroup
      this._setDialogVisible(true, getLanguage(global.language).Friends.GROUP_DELETE_INFO)
      this.dialogAction = () => {
        this.servicesUtils?.deleteGroup([this.props.currentGroup.id]).then((result: any) => {
          // MSG_ONLINE_GROUP_DELETE
          if (result.succeed) {
            this._sendDeleteMsg()
            // this.props.exitGroup && this.props.exitGroup({ groupID: this.props.currentGroup.id })
            // this._setDialogVisible(false)
            // NavigationService.goBack('CoworkManagePage', null)
          }
        })
      }
    } else {
      this._setDialogVisible(true, getLanguage(global.language).Friends.GROUP_EXIST_INFO)
      this.dialogAction = () => {
        this.servicesUtils?.deleteGroupMembers({
          groupId: this.props.currentGroup.id,
          userIds: [this.props.user.currentUser.userName],
        }).then(result => {
          if (result.succeed) {
            this._sendDeleteMsg()
            // this.props.exitGroup && this.props.exitGroup({ groupID: this.props.currentGroup.id })
            // this._setDialogVisible(false)
            // NavigationService.goBack('CoworkManagePage', null)
          }
        })
      }
    }
  }

  _renderItem = (data: ItemType) => {
    if (data.item.title === 'plus') {
      return (
        <TouchableOpacity
          style={styles.itemViewStyle}
          activeOpacity={0.8}
          onPress={() => {
            NavigationService.navigate('GroupInvitePage')
          }}
        >
          <View style={styles.plusView}>
            <Image
              style={styles.plusImg}
              resizeMode={'contain'}
              source={getPublicAssets().common.icon_plus_gray}
            />
          </View>
          <View style={styles.itemTextViewStyle}>
            <Text style={styles.itemTextStyle} numberOfLines={1}>{data.item.nickname}</Text>
          </View>
        </TouchableOpacity>
      )
    }
    return (
      <TouchableOpacity
        style={styles.itemViewStyle}
        activeOpacity={0.8}
        onPress={() => {}}
      >
        <Image
          style={styles.itemImg}
          resizeMode={'contain'}
          source={getThemeAssets().friend.contact_photo}
        />
        <View style={styles.itemTextViewStyle}>
          <Text style={styles.itemTextStyle} numberOfLines={1}>{data.item.nickname}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  _renderMembers = () => {
    let _data = [], column, row, maxLength
    if (this.props.device.orientation.indexOf('LANDSCAPE') === 0) {
      column = 8
      row = 2
    } else {
      column = 5
      row = 3
    }

    maxLength = column * row - 1

    if (this.state.data.length > maxLength) {
      _data = this.state.data.slice(0, maxLength)
    } else {
      _data = this.state.data.concat([])
    }
    if (this.props.user.currentUser.userName === this.props.currentGroup.creator) {
      _data.push({
        title: 'plus',
      })
    }

    return (
      <View style={styles.tableView}>
        <TableList
          cellStyle={styles.tableCellView}
          lineSeparator={20}
          column={column}
          data={_data}
          renderCell={this._renderItem}
        />
        <TouchableOpacity
          style={styles.moreView}
          onPress={() => {
            NavigationService.navigate('GroupFriendListPage', {
              mode: 'manage', // 管理模式
              title: getLanguage(global.language).Friends.GROUP_MEMBER,
              callBack: this.getMembers,
            })
          }}
        >
          <Text style={styles.moreTitle}>{getLanguage(this.props.language).Friends.VIEW_MORE_MEMBERS}</Text>
          <Image style={styles.moreImg} source={getThemeAssets().publicAssets.icon_jump} />
        </TouchableOpacity>
      </View>
    )
  }

  _renderSettings = () => {
    return (
      <View style={{flex: 1}}>
        <View
          style={styles.settingItem2}
        >
          <Text numberOfLines={1} style={styles.settingItemTitle}>{getLanguage(this.props.language).Friends.GROUP_NAME}</Text>
          <Text numberOfLines={1} style={styles.settingItemContent2}>{this.props.currentGroup.groupName}</Text>
        </View>

        <View style={styles.settingItem2}>
          <Text numberOfLines={1} style={styles.settingItemTitle}>{getLanguage(this.props.language).Friends.GROUP_TAG}</Text>
          <Text numberOfLines={1} style={styles.settingItemContent2}>{this.props.currentGroup.tags}</Text>
        </View>
        <View style={styles.settingItem3}>
          <Text numberOfLines={1} style={styles.settingItemTitle}>{getLanguage(this.props.language).Friends.GROUP_REMARK}</Text>
          <Text numberOfLines={3} style={styles.settingItemContent2}>{this.props.currentGroup.description}</Text>
        </View>
      </View>
    )
  }

  _renderBottom = () => {
    let title
    if (this.props.user.currentUser.userName === this.props.currentGroup.creator) {
      title = getLanguage(this.props.language).Friends.GROUP_DELETE
    } else {
      title = getLanguage(this.props.language).Friends.GROUP_EXIST
    }
    return (
      <TextBtn
        btnText={title}
        containerStyle={styles.bottomBtn}
        textStyle={styles.bottomBtnText}
        btnClick={this._bottomBtnAction}
      />
    )
  }

  _renderDeleteDialog = () => {
    return (
      <Dialog
        ref={ref => (this.dialog = ref)}
        type={Dialog.Type.MODAL}
        info={this.state.dialogInfo}
        confirmAction={() => {
          if (this.dialogAction) {
            this.dialogAction()
          }
        }}
        confirmBtnTitle={getLanguage(this.props.language).Prompt.CONFIRM}
        cancelBtnTitle={getLanguage(this.props.language).Prompt.CANCEL}
      />
    )
  }

  _renderRight = () => {
    if (this.props.user.currentUser.userName !== this.props.currentGroup.creator) {
      return null
    }
    return (
      <ImageButton
        containerStyle={{
          marginLeft: scaleSize(30),
          marginRight: scaleSize(6),
          width: scaleSize(44),
          height: scaleSize(44),
        }}
        icon={getThemeAssets().functionBar.icon_tool_mark}
        onPress={() => {
          NavigationService.navigate('CreateGroupPage', {
            initData: this.props.currentGroup,
            callBack: (groupInfo: any) => {
              if (JSON.stringify(this.props.currentGroup) !== JSON.stringify(groupInfo)) {
                this.props.setCurrentGroup && this.props.setCurrentGroup(groupInfo)
              }
            },
          })
        }}
      />
    )
  }

  render() {
    return (
      <Container
        headerProps={{
          title: getLanguage(this.props.language).Friends.GROUP_SETTING,
          navigation: this.props.navigation,
          headerTitleViewStyle: {
            justifyContent: 'flex-start',
            marginLeft: scaleSize(80),
          },
          headerRight: this._renderRight(),
        }}
      >
        <ScrollView
          style={{
            flex: 1,
            flexDirection: 'column',
            paddingTop: scaleSize(20),
          }}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefresh}
              onRefresh={this.getMembers}
              colors={['orange', 'red']}
              tintColor={'orange'}
              titleColor={'orange'}
              enabled={true}
            />
          }
        >
          {this._renderMembers()}
          {this._renderSettings()}
        </ScrollView>
        {this._renderBottom()}
        {this._renderDeleteDialog()}
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  tableView: {
    // flex: 1,
    // flexDirection: 'column',
    // backgroundColor: 'red',
    // height: 100,
  },
  itemViewStyle: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  tableCellView: {
    // flex: 1,
    height: scaleSize(150),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: color.white,
  },
  tableRowStyle: {
    height: scaleSize(150),
  },

  itemImg: {
    height: scaleSize(88),
    width: scaleSize(88),
    borderRadius: scaleSize(44),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.imageColorWhite,
  },

  plusView: {
    height: scaleSize(88),
    width: scaleSize(88),
    borderRadius: scaleSize(44),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.itemColorGray2,
  },
  plusImg: {
    height: scaleSize(50),
    width: scaleSize(50),
    backgroundColor: 'transparent',
  },

  itemTextViewStyle: {
    height: scaleSize(40),
    minWidth: scaleSize(40),
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemTextStyle: {
    fontSize: size.fontSize.fontSizeLg,
    color: color.fontColorGray3,
  },

  moreView: {
    flexDirection: 'row',
    height: scaleSize(150),
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreTitle: {
    fontSize: size.fontSize.fontSizeXXl,
    color: color.contentColorGray,
  },
  moreImg: {
    height: scaleSize(36),
    width: scaleSize(36),
  },

  // 中间设置
  settingItem: {
    flexDirection: 'row',
    height: scaleSize(116),
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scaleSize(52),
  },
  settingItem2: {
    flexDirection: 'column',
    height: scaleSize(116),
    justifyContent: 'space-between',
    paddingHorizontal: scaleSize(52),
    paddingVertical: scaleSize(8),
  },
  settingItem3: {
    paddingVertical: scaleSize(8),
    flexDirection: 'column',
    height: scaleSize(200),
    justifyContent: 'space-between',
    paddingHorizontal: scaleSize(52),
  },
  settingItemTitle: {
    fontSize: size.fontSize.fontSizeXXl,
    color: color.contentColorGray,
  },
  settingItemContent: {
    flex: 2,
    fontSize: size.fontSize.fontSizeXXl,
    color: color.contentColorGray,
    textAlign: 'right',
  },
  settingItemContent2: {
    flex: 2,
    fontSize: size.fontSize.fontSizeXXl,
    color: color.fontColorGray,
    // marginLeft: scaleSize(30),
    marginTop: scaleSize(10),
  },
  list: {
    paddingBottom: scaleSize(130),
  },

  // 底部按钮
  bottomView: {
    flexDirection: 'row',
    height: scaleSize(120),
    backgroundColor: color.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomBtn: {
    position: 'absolute',
    width: scaleSize(480),
    height: scaleSize(80),
    borderRadius: scaleSize(40),
    bottom: scaleSize(38),
    left: '50%',
    right: '50%',
    marginLeft: scaleSize(-240),
    backgroundColor: color.contentColorGray,
  },
  bottomBtnText: {
    fontSize: size.fontSize.fontSizeXXXl,
    color: color.white,
  },
})

const mapStateToProps = (state: any) => ({
  user: state.user.toJS(),
  device: state.device.toJS().device,
  language: state.setting.toJS().language,
  currentGroup: state.cowork.toJS().currentGroup,
})

const mapDispatchToProps = {
  setCurrentGroup,
  exitGroup,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GroupSettingPage)

