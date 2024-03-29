import React from 'react'
import { Container, InputDialog, TextBtn, SearchBar } from '../../../../../components'
import { View, Text, FlatList, StyleSheet, Platform, TouchableOpacity, Image } from 'react-native'
import { scaleSize, Toast } from '../../../../../utils'
import { color, size } from '../../../../../styles'
import { getLanguage } from '../../../../../language'
import { UserType, MsgConstant } from '../../../../../constants'
import { getThemeAssets } from '../../../../../assets'
import { SCoordination, SearchUserResponse, SMessageService } from 'imobile_for_reactnative'

import { connect } from 'react-redux'
import FriendList, { FriendInfo } from '../../../Friend/FriendList/FriendList'
import SMessageServiceHTTP from '../../../Friend/SMessageServiceHTTP'

const mapStateToProps = (state: any) => ({
  user: state.user.toJS(),
  language: state.setting.toJS().language,
  device: state.device.toJS().device,
  currentGroup: state.cowork.toJS().currentGroup,
})

const mapDispatchToProps = {
}

interface State {
  data: Array<SearchUserResponse>,
  selectedUser: SearchUserResponse | undefined,
}

interface Props {
  [name: string]: any,
}

const styles = StyleSheet.create({
  container: {
    // marginLeft: scaleSize(60),
    // marginRight: scaleSize(30),
  },
  headerBtnTitle: {
    color: color.fontColorBlack,
    fontSize: 17,
  },
  subView: {
    flexDirection: 'column',
  },
  input: {
    flex: 1,
    fontSize: size.fontSize.fontSizeLg,
    ...Platform.select({
      android: {
        padding: 0,
      },
    }),
  },
  ItemViewStyle: {
    paddingLeft: scaleSize(20),
    paddingRight: scaleSize(30),
    height: scaleSize(90),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  itemImg: {
    marginLeft: scaleSize(32),
    height: scaleSize(60),
    width: scaleSize(60),
    borderRadius: scaleSize(30),
    alignItems: 'center',
    justifyContent: 'center',
  },
  ITemTextViewStyle: {
    paddingHorizontal: scaleSize(32),
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  ITemTextStyle: {
    fontSize: size.fontSize.fontSizeLg,
    color: color.fontColorBlack,
  },
  itemSeparator: {
    height: scaleSize(2),
    backgroundColor: color.separateColorGray3,
    marginLeft: scaleSize(150),
  },
})

class GroupInvitePage extends React.Component<Props, State> {

  servicesUtils: SCoordination | undefined
  onlineServicesUtils: any
  container: any
  inviteDialog: InputDialog | undefined | null
  currentGroup: {
    id: string,
    groupName: string,
    creator: string,
    [name: string]: any,
  }

  constructor(props: Props) {
    super(props)
    this.currentGroup = this.props.route?.params?.groupInfo || this.props.currentGroup
    if (UserType.isOnlineUser(this.props.user.currentUser)) {
      this.servicesUtils = new SCoordination('online')
    } else if (UserType.isIPortalUser(this.props.user.currentUser)){
      this.servicesUtils = new SCoordination('iportal')
    }
    this.state = {
      data: [],
      selectedUser: undefined,
    }
  }

  componentDidMount() {
    // this.search('刘LXY')
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    let shouldUpdate = JSON.stringify(nextState) !== JSON.stringify(this.state) ||
    JSON.stringify(nextProps) !== JSON.stringify(this.props)
    return shouldUpdate
  }

  search = (nickName: string) => {
    this.servicesUtils?.searchUserByName(nickName).then((result) => {
      if (result) {
        this.setState({
          data: result,
        })
      }

      global.Loading.setLoading(false)
    }, () => {
      global.Loading.setLoading(false)
    })
  }

  getUserSerachInfo = (user: FriendInfo): SearchUserResponse => {
    return {
      roles: ["PORTAL_USER","NOPASSWORD","DATA_CENTER"],
      nickname: user.name,
      name: user.id,
    }
  }

  invite = (reason: string) => {
    if (!this.state.selectedUser) return
    this.servicesUtils?.inviteToGroup({
      groupId: this.currentGroup.id,
      inviteReason: reason || '',
      inviteNames: [this.state.selectedUser.name],
    }).then((result: any) => {
      if (result.succeed) {
        Toast.show(getLanguage(global.language).Friends.INVITE_SUCCESS)
        this.inviteDialog?.setDialogVisible(false)

        let timeStr = new Date().getTime()
        let message: any = {
          id: 'GROUP_APPLY_' + timeStr,
          message: {
            // type: MsgConstant.MSG_ONLINE_GROUP_INVITE,
            checkStatus: 'WAITTING',
            applicant: this.props.user.currentUser.userId || '',
            applyTime: timeStr,
          },
          type: MsgConstant.MSG_ONLINE_GROUP_INVITE,
          user: {
            name: this.props.user.currentUser.nickname || '',
            id: this.props.user.currentUser.userId || '',
          },
          to: {
            name: this.state.selectedUser?.nickname,
            id: this.state.selectedUser?.name,
          },
          group: {
            groupID: this.currentGroup.id,
            groupName: this.currentGroup.groupName,
            groupCreator: this.currentGroup.creator,
          },
          time: timeStr,
        }
        // SMessageService.sendMessage(
        //   JSON.stringify(message),
        //   this.state.selectedUser?.name,
        // )
        this.state.selectedUser?.name !== undefined && SMessageServiceHTTP.sendMessage(
          message,
          [this.state.selectedUser?.name],
        )
      } else {
        if (result?.error?.errorMsg) {
          if (result.error.errorMsg.toString().indexOf('已经存在于') >= 0) {
            Toast.show(getLanguage(global.language).Friends.INVITE_GROUP_MEMBERS_ERROR_1)
          } else if (result.error.errorMsg.toString().indexOf('已经邀请过') >= 0) {
            Toast.show(getLanguage(global.language).Friends.INVITE_GROUP_MEMBERS_ERROR_2)
          } else {
            Toast.show(getLanguage(global.language).Friends.INVITE_FAILED)
          }
        } else {
          Toast.show(getLanguage(global.language).Friends.INVITE_FAILED)
        }
      }
    })
  }

  _itemPress = (item: SearchUserResponse) => {
    this.setState({
      selectedUser: item,
    }, () => {
      this.inviteDialog?.setDialogVisible(true)
    })
  }

  _renderTopView = () => {
    return (
      <View style={styles.subView}>
        <SearchBar
          style={{
            marginHorizontal: scaleSize(20),
            marginVertical: scaleSize(10),
            height: scaleSize(60),
          }}
          ref={ref => (this.searchBar = ref)}
          onSubmitEditing={searchKey => {
            global.Loading.setLoading(true, getLanguage(global.language).Prompt.SEARCHING)
            this.search(searchKey)
          }}
          onClear={() => {
            this.search('')
          }}
          placeholder={getLanguage(global.language).Friends.INVITE_SEARCH_PLACEHOLDER}
        />
      </View>
    )
  }

  _renderItem = ({item, index}: {item: SearchUserResponse, index: number}) => {
    return (
      <TouchableOpacity
        style={[styles.ItemViewStyle]}
        activeOpacity={0.75}
        onPress={() => this._itemPress(item)}
      >
        <Image
          style={styles.itemImg}
          resizeMode={'contain'}
          source={getThemeAssets().friend.contact_photo}
        />
        <View style={styles.ITemTextViewStyle}>
          <Text style={styles.ITemTextStyle}>{item.nickname}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  _keyExtractor = (item: SearchUserResponse)=> item.name

  _renderItemSeparatorComponent = () => <View style={styles.itemSeparator} />

  _renderDialog = () => {
    return (
      <InputDialog
        ref={ref => (this.inviteDialog = ref)}
        title={getLanguage(global.language).Friends.INVITE_REASON}
        multiline={true}
        legalCheck={false}
        confirmAction={value => {
          this.invite(value)
        }}
        cancelAction={() => {
          this.inviteDialog?.setDialogVisible(false)
        }}
        confirmBtnTitle={getLanguage(global.language).Friends.INVITE}
        cancelBtnTitle={getLanguage(global.language).Friends.CANCEL}
      />
    )
  }

  render() {
    return (
      <Container
        ref={(ref: any) => (this.container = ref)}
        headerProps={{
          title: getLanguage(this.props.language).Friends.GROUP_INVITE,
          navigation: this.props.navigation,
          // headerRight: (
          //   <TextBtn
          //     btnText={getLanguage(this.props.language).Friends.INVITE}
          //     textStyle={styles.headerBtnTitle}
          //     btnClick={this.invite}
          //   />
          // ),
          headerTitleViewStyle: {
            justifyContent: 'flex-start',
            marginLeft: scaleSize(80),
          },
        }}
      >
        {this._renderTopView()}
        <FlatList
          ItemSeparatorComponent={this._renderItemSeparatorComponent}
          style={styles.container}
          data={this.state.data}
          renderItem={this._renderItem}
          keyExtractor={this._keyExtractor}
          ListEmptyComponent={() => {
            return (
              <FriendList
              language={global.language}
              user={this.props.user.currentUser}
              callBack={(user) => {
                const info = this.getUserSerachInfo(user)
                this._itemPress(info)
              }}
            />
            )
          }}
        />
        {this._renderDialog()}
      </Container>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GroupInvitePage)
