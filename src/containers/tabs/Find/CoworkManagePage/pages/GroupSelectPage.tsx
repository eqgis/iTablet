import React, { Component } from 'react'
import { SectionList, View, TouchableOpacity, Image, Text, StyleSheet, RefreshControl } from 'react-native'
import { Container, PopMenu, ImageButton, ListSeparator, Dialog, RedDot } from '../../../../../components'
import { getLanguage } from '../../../../../language'
import { Toast, scaleSize, SCoordinationUtils } from '../../../../../utils'
import * as OnlineServicesUtils from '../../../../../utils/OnlineServicesUtils'
import { size, color } from '../../../../../styles'
import { getThemeAssets } from '../../../../../assets'
import { UserType } from '../../../../../constants'
import NavigationService from '../../../../NavigationService'
import CoworkInfo from '../../../Friend/Cowork/CoworkInfo'
import { Users } from '../../../../../redux/models/user'
import { setCoworkGroup, setCurrentGroup, MessageType } from '../../../../../redux/models/cowork'
import { connect } from 'react-redux'
import CoworkFileHandle from '../CoworkFileHandle'

interface Props {
  navigation: Object,
  user: Users,
  language: string,
  device: any,
  coworkGroups: any,
  currentGroup: any,
  coworkMessages: {
    [name: string]: MessageType,
  },
  setCoworkGroup: (data: any) => any,
  setCurrentGroup: (data: any) => any,
}

interface State {
  data: Array<any>,
  isRefresh: boolean,
  sectionMap: Map<string, boolean>,
}

class GroupSelectPage extends Component<Props, State> {

  popData: Array<any>
  PagePopModal: PopMenu | null | undefined
  dialog: Dialog | null | undefined
  container: any
  pageSize: number
  currentPage: number
  isLoading:boolean // 防止同时重复加载多次
  isNoMore: boolean // 是否能加载更多
  newGroupData: {
    id: string,
    groupName: string,
    creator: string,
  } | undefined // 新建群组基本信息

  constructor(props: Props) {
    super(props)

    if (UserType.isOnlineUser(this.props.user.currentUser)) {
      SCoordinationUtils.setScoordiantion('online')
      OnlineServicesUtils.setServiceType('online')
    } else if (UserType.isIPortalUser(this.props.user.currentUser)){
      SCoordinationUtils.setScoordiantion('iportal')
      OnlineServicesUtils.setServiceType('iportal')
    }

    let sectionMap = new Map()
    sectionMap.set(getLanguage(global.language).Friends.MY_GROUPS, true)
    sectionMap.set(getLanguage(global.language).Friends.JOINED_GROUPS, true)

    this.state = {
      data: [],
      isRefresh: false,
      sectionMap: sectionMap,
    }
    this.pageSize = 10000
    this.currentPage = 1
    this.isLoading = false // 防止同时重复加载多次
    this.isNoMore = false // 是否能加载更多

    this.popData = [
      {
        title: getLanguage(global.language).Friends.GROUP_CREATE,
        action: () => {
          NavigationService.navigate('CreateGroupPage', {
            callBack: (newGroup: {
              id: string,
              groupName: string,
              creator: string,
            }) => {
              this.newGroupData = newGroup
              this.dialog && this.dialog.setDialogVisible(true)
              this.refresh(false)
            },
          })
        },
      },
      {
        title: getLanguage(global.language).Friends.GROUP_APPLY,
        action: () => {
          if (UserType.isOnlineUser(this.props.user.currentUser) || UserType.isIPortalUser(this.props.user.currentUser)) {
            NavigationService.navigate('GroupApplyPage', {callBack: () => this.refresh(false)})
          } else {
            NavigationService.navigate('Login')
          }
        },
      },
    ]
    CoworkInfo.setGroupGetHandle(() => this.refresh(false))
  }

  componentDidMount() {
    // CoworkFileHandle.initCoworkList(this.props.user.currentUser)
    this.refresh(false)
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    if (
      JSON.stringify(nextProps) !== JSON.stringify(this.props) ||
      JSON.stringify(nextState.data) !== JSON.stringify(this.state.data) ||
      nextState.isRefresh !== this.state.isRefresh ||
      !this.state.sectionMap.compare(nextState.sectionMap)
    ) {
      return true
    }
    return false
  }

  componentDidUpdate(prevProps: Props) {
    if (
      // 修改群组消息后，判断更新
      JSON.stringify(prevProps.currentGroup) !== JSON.stringify(this.props.currentGroup) ||
      // 退出/被踢出群组，判断更新
      JSON.stringify(prevProps.coworkGroups) !== JSON.stringify(this.props.coworkGroups)
    ) {
      this.refresh(false)
    }
  }

  _itemPress = (groupInfo: any) => {
    this.props.setCurrentGroup && this.props.setCurrentGroup(groupInfo)
    NavigationService.navigate('CoworkManagePage', { callBack: this.refresh })
  }

  refresh = async (refresh = true) => {
    if (this.isLoading) return
    this.isLoading = true
    this.isNoMore = false
    refresh && this.setState({
      isRefresh: true,
    })
    await this.getGroups({
      pageSize: this.pageSize,
      currentPage: 1,
    })
  }

  loadMore = () => {
    if (this.isLoading || this.isNoMore) return
    this.isLoading = true
    this.getGroups({
      pageSize: this.pageSize,
      currentPage: this.currentPage + 1,
    })
  }

  getGroups = async ({pageSize = this.pageSize, currentPage = 1, orderBy = 'CREATETIME', orderType = 'DESC'}) => {
    try {
      SCoordinationUtils.getScoordiantion()?.getGroupInfos({
        orderBy: orderBy,
        orderType: orderType,
        pageSize: pageSize,
        currentPage: currentPage,
        keywords: '',
        joinTypes: ['CREATE', 'JOINED'],
      }).then(result => {
        if (result && result.content) {
          let _data: any[] = [], myGroups: any[] = [], _joinedGroups: any[] = []
          if (result.content.length > 0) {
            if (this.currentPage < currentPage) {
              _data = this.state.data.deepClone()
              _data = _data.concat(result.content)
            } else {
              _data = result.content
            }
          }
          for (const group of result.content) {
            if (group.creator === this.props.user.currentUser.userName) {
              myGroups.push(group)
            } else {
              _joinedGroups.push(group)
            }
          }
          // 判断是否还有更多数据
          if (_data.length === result.total) {
            this.isNoMore = true
          }
          this.currentPage = currentPage
          this.setState({
            data: [{
              title: getLanguage(global.language).Friends.MY_GROUPS,
              data: myGroups,
            }, {
              title: getLanguage(global.language).Friends.JOINED_GROUPS,
              data: _joinedGroups,
            }],
            isRefresh: false,
          }, () => {
            this.isLoading = false
            this.props.setCoworkGroup && this.props.setCoworkGroup(_data)
          })
        } else {
          this.state.isRefresh && this.setState({ isRefresh: false, data: [] })
          this.isLoading = false
        }
      })
    } catch (error) {
      this.isLoading = false
      this.state.isRefresh && this.setState({ isRefresh: false })
      Toast.show(error.message)
    }
  }

  _renderPagePopup = () => {
    return (
      <PopMenu
        ref={ref => (this.PagePopModal = ref)}
        data={this.popData}
        device={this.props.device}
        hasCancel={false}
      />
    )
  }

  renderRight = () => {
    return (
      <ImageButton
        iconStyle={{ width: scaleSize(44), height: scaleSize(44) }}
        icon={getThemeAssets().cowork.icon_nav_add_friends}
        onPress={(event: any) => {
          this.PagePopModal && this.PagePopModal.setVisible(true, {
            x: event.nativeEvent.pageX,
            y: event.nativeEvent.pageY,
          })
        }}
      />
    )
  }

  _keyExtractor = (item: { groupName: string }, index: { toString: () => string }) => item.groupName + '_' + index.toString()

  _renderItem = ({ section, item }: any) => {
    let isShow = this.state.sectionMap.get(section.title)
    if (!isShow) return null
    let unread = 0
    try {
      unread = this.props.coworkMessages?.[this.props.user.currentUser.userName]?.coworkGroupMessages?.[item.id]?.unread || 0
    } catch (error) {
      unread = 0
    }
    return (
      <TouchableOpacity
        style={[styles.ItemViewStyle]}
        activeOpacity={0.75}
        onPress={() => this._itemPress(item)}
      >
        <View>
          <Image
            style={styles.itemImg}
            resizeMode={'contain'}
            source={getThemeAssets().friend.contact_photo}
          />
          {
            unread > 0 &&
            (
              <RedDot
                style={{
                  top: 0,
                  right: 0,
                }}
              />
            )
          }
        </View>
        <View style={styles.ITemTextViewStyle}>
          <Text numberOfLines={2} style={styles.ITemTextStyle}>{item.groupName}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  _renderGroupMessage = () => {
    let applyMessagesUnread = this.props.coworkMessages?.[this.props.user.currentUser.userName]?.applyMessages?.unread || 0
    let inviteMessagesUnread = this.props.coworkMessages?.[this.props.user.currentUser.userName]?.inviteMessages?.unread || 0
    return (
      <View>
        <TouchableOpacity
          activeOpacity={1}
          style={styles.ITemHeadTextViewStyle}
          onPress={() => {
            NavigationService.navigate('GroupMessagePage', { callBack: this.refresh })
          }}
        >
          <View style={styles.arrowImgView}>
            <Image
              resizeMode={'contain'}
              source={getThemeAssets().friend.icon_notice}
              style={styles.arrowImg}
            />
            {
              applyMessagesUnread + inviteMessagesUnread > 0 &&
              (
                <RedDot
                  style={{
                    top: scaleSize(30),
                    right: scaleSize(30),
                  }}
                />
              )
            }
          </View>
          <Text style={styles.ITemHeadTextStyle}>{getLanguage(global.language).Friends.GROUP_MESSAGE}</Text>
          <View style={styles.arrowImgView}>
            <Image
              resizeMode={'contain'}
              source={getThemeAssets().publicAssets.icon_jump}
              style={styles.arrowImg}
            />
          </View>
        </TouchableOpacity>
        <ListSeparator color={color.bgW} height={scaleSize(12)} />
      </View>
    )
  }

  sectionToggle = (section: any) => {
    if (section.title === getLanguage(global.language).Friends.MY_GROUPS) {
      let myGroups = getLanguage(global.language).Friends.MY_GROUPS
      this.setState(state => {
        const sectionMap = new Map().clone(state.sectionMap)
        sectionMap.set(myGroups, !state.sectionMap.get(myGroups))
        return { sectionMap }
      })
    } else if (section.title === getLanguage(global.language).Friends.JOINED_GROUPS) {
      let joinedGroups = getLanguage(global.language).Friends.JOINED_GROUPS
      this.setState(state => {
        const sectionMap = new Map().clone(state.sectionMap)
        sectionMap.set(joinedGroups, !state.sectionMap.get(joinedGroups))
        return { sectionMap }
      })
    }
  }

  _renderSection = (sectionItem: any) => {
    const { section } = sectionItem
    return (
      <TouchableOpacity
        activeOpacity={1}
        style={styles.ITemHeadTextViewStyle}
        onPress={() => this.sectionToggle(section)}
      >
        <View style={styles.arrowImgView}>
          <Image
            resizeMode={'contain'}
            source={this.state.sectionMap.get(section.title) ? getThemeAssets().publicAssets.icon_drop_down : getThemeAssets().publicAssets.icon_drop_up}
            style={styles.arrowImg}
          />
        </View>
        <Text style={styles.ITemHeadTextStyle}>{section.title.toUpperCase()}</Text>
      </TouchableOpacity>
    )
  }

  _renderItemSeparatorComponent = ({ section }: any) => {
    return this.state.sectionMap.get(section.title) ? <View style={styles.itemSeparator} /> : null
  }

  _renderSectionSeparatorComponent = ({trailingItem}: any) => {
    return trailingItem ? null : <ListSeparator color={color.bgW} height={scaleSize(12)} />
  }

  _renderGroupList = () => {
    return (
      <SectionList
        renderSectionHeader={this._renderSection}
        renderItem={this._renderItem}
        keyExtractor={this._keyExtractor}
        sections={this.state.data}
        style={styles.list}
        ItemSeparatorComponent={this._renderItemSeparatorComponent}
        SectionSeparatorComponent={this._renderSectionSeparatorComponent}
        extraData={this.state.sectionMap}
        refreshControl={
          <RefreshControl
            refreshing={this.state.isRefresh}
            onRefresh={this.refresh}
            colors={['orange', 'red']}
            tintColor={'orange'}
            titleColor={'orange'}
            title={getLanguage(global.language).Friends.REFRESHING}
            enabled={true}
          />
        }
      />
    )
  }

  /**
   * 创建任务成功后，提示邀请成员提示框
   */
  _renderInviteDialog = () => {
    return (
      <Dialog
        ref={ref => (this.dialog = ref)}
        type={Dialog.Type.MODAL}
        info={getLanguage(global.language).Friends.INVITE_GROUP_MEMBERS_INFO}
        confirmAction={() => {
          if (this.newGroupData) {
            this.dialog && this.dialog.setDialogVisible(false)
            NavigationService.navigate('GroupInvitePage', {groupInfo: this.newGroupData})
          }
        }}
        confirmBtnTitle={getLanguage(this.props.language).Friends.INVITE_GROUP_MEMBERS}
        confirmTitleStyle={{color: color.selected_blue}}
        cancelBtnTitle={getLanguage(this.props.language).Prompt.CANCEL}
      />
    )
  }

  render() {
    return (
      <Container
        showFullInMap={true}
        hideInBackground={false}
        headerProps={{
          title: getLanguage(global.language).Friends.TITLE_CHOOSE_GROUP,
          navigation: this.props.navigation,
          headerRight: this.renderRight(),
          headerTitleViewStyle: {
            justifyContent: 'flex-start',
            marginLeft: scaleSize(90),
            borderBottomWidth: 0,
          },
        }}
      >
        {this._renderGroupMessage()}
        {this._renderGroupList()}
        {this._renderPagePopup()}
        {this._renderInviteDialog()}
      </Container>
    )
  }
}


const mapStateToProps = (state: any) => ({
  user: state.user.toJS(),
  device: state.device.toJS().device,
  language: state.setting.toJS().language,
  coworkGroups: state.cowork.toJS().groups[state.user.toJS().currentUser.userId],
  currentGroup: state.cowork.toJS().currentGroup,
  coworkMessages: state.cowork.toJS().messages,
})

const mapDispatchToProps = {
  setCoworkGroup,
  setCurrentGroup,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GroupSelectPage)

const styles = StyleSheet.create({
  ItemViewStyle: {
    height: scaleSize(114),
    paddingHorizontal: scaleSize(44),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: color.white,
  },
  ITemHeadTextViewStyle: {
    height: scaleSize(114),
    backgroundColor: color.white,
    flexDirection: 'row',
    alignItems: 'center',
  },
  ITemHeadTextStyle: {
    flex: 1,
    fontSize: size.fontSize.fontSizeLg,
    color: color.contentColorBlack,
    // marginLeft: scaleSize(80),
  },

  ITemTextViewStyle: {
    marginLeft: scaleSize(32),
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  ITemTextStyle: {
    fontSize: size.fontSize.fontSizeLg,
    color: color.fontColorBlack,
  },
  arrowImgView: {
    width: scaleSize(114),
    height: scaleSize(114),
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowImg: {
    width: scaleSize(52),
    height: scaleSize(52),
  },
  itemImg: {
    height: scaleSize(60),
    width: scaleSize(60),
    borderRadius: scaleSize(30),
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeStr: {
    marginRight: scaleSize(44),
    fontSize: size.fontSize.fontSizeSm,
    color: 'grey',
    textAlign: 'right',
  },
  itemSeparator: {
    height: scaleSize(2),
    backgroundColor: color.separateColorGray3,
    marginLeft: scaleSize(52),
  },
  list: {
    borderTopLeftRadius: scaleSize(36),
    borderTopRightRadius: scaleSize(36),
    backgroundColor: color.white,
  },
})
