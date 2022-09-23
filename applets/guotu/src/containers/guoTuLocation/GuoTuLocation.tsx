import React, { Component } from 'react'
import { View, TouchableOpacity, Text, StyleSheet, FlatList, ListRenderItemInfo, Image } from 'react-native'
import { Container, PopMenu, ImageButton, Dialog, ListSeparator } from '@/components'
import { getLanguage } from '@/language'
import { Toast, scaleSize, SCoordinationUtils } from '@/utils'
import { size, color } from '@/styles'
import { getPublicAssets, getThemeAssets } from '@/assets'
import { UserType } from '@/constants'
import { Users } from '@/redux/models/user'
import { connect } from 'react-redux'
import NavigationService from '@/containers/NavigationService'

import { setCurrentGroup } from '../../reduxModels/guotu'
import { Color } from '@/utils/AppStyle'
import { GroupInfo } from 'imobile_for_reactnative/types/interface/iserver/types'

interface Props {
  navigation: any,
  user: Users,
  language: string,
  device: any,
  currentGroup: any,
  setCoworkGroup: (data: any) => any,
  setCurrentGroup: (data: any) => any,
}

interface State {
  data: Array<any>,
  isRefresh: boolean,
  sectionMap: Map<string, boolean>,
}

class GuoTuLocation extends Component<Props, State> {

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
  onlineDefualtGroup: GroupInfo

  constructor(props: Props) {
    super(props)
    if (UserType.isOnlineUser(this.props.user.currentUser)) {
      SCoordinationUtils.setScoordiantion('online')
    } else if (UserType.isIPortalUser(this.props.user.currentUser)){
      SCoordinationUtils.setScoordiantion('iportal')
    }

    const sectionMap = new Map()
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
  }

  componentDidMount() {
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

  _itemPress = (groupInfo: any) => {
    this.props.setCurrentGroup && this.props.setCurrentGroup(groupInfo)
  }

  refresh = async (refresh = true) => {
    if (!this.props.user.currentUser?.userName) {
      Toast.show('请先登录')
      return
    }
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
      // online用户自动加入Land_Chengdu示例群组
      if (UserType.isOnlineUser(this.props.user.currentUser)) {
        const groupResult = await SCoordinationUtils.getScoordiantion()?.getGroupInfos({
          orderBy: orderBy,
          orderType: orderType,
          pageSize: pageSize,
          currentPage: currentPage,
          keywords: 'Land_Chengdu',
        })
        if (groupResult.total > 0) {
          for (const group of groupResult.content) {
            if (group.groupName === 'Land_Chengdu') {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              this.onlineDefualtGroup = group
              break
            }
          }
        }
        if (this.onlineDefualtGroup?.id) {
          const result = await SCoordinationUtils.getScoordiantion()?.applyToGroup({
            groupIds: [this.onlineDefualtGroup.id],
            applicant: this.props.user.currentUser.userName,
            applyReason: '',
          })
          console.warn(result)
        }
      }

      SCoordinationUtils.getScoordiantion()?.getGroupInfos({
        orderBy: orderBy,
        orderType: orderType,
        pageSize: pageSize,
        currentPage: currentPage,
        keywords: '',
        joinTypes: ['CREATE', 'JOINED'],
      }).then(result => {
        if (result && result.content) {
          let _data: any[] = []
          const myGroups: any[] = [], _joinedGroups: any[] = []
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
            data: result.content,
            isRefresh: false,
          }, () => {
            this.isLoading = false
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

  _renderItem = ({ item }: ListRenderItemInfo<any>) => {
    return (
      <TouchableOpacity
        style={[styles.ItemViewStyle]}
        activeOpacity={0.75}
        onPress={() => this._itemPress(item)}
      >
        <Image
          style={styles.selectIcon}
          source={this.props.currentGroup?.groupName === item.groupName ? getPublicAssets().common.icon_radio_selected : getPublicAssets().common.icon_radio_unselected }
        />
        <View style={styles.ITemTextViewStyle}>
          <Text numberOfLines={2} style={styles.ITemTextStyle}>{item.groupName}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  _renderItemSeparatorComponent = () => {
    return <ListSeparator color={color.itemColorGray2} style={{marginLeft: scaleSize(110), marginRight: scaleSize(42)}} />
  }

  _renderGroupList = () => {
    return (
      <FlatList
        style={{ flex: 1 }}
        data={this.state.data}
        renderItem={this._renderItem}
        keyExtractor={item => item.groupName}
        ItemSeparatorComponent={this._renderItemSeparatorComponent}
      />
    )
  }

  render() {
    return (
      <Container
        showFullInMap={true}
        hideInBackground={false}
        headerProps={{
          title: '选择区域',
          navigation: this.props.navigation,
          headerTitleViewStyle: {
            justifyContent: 'flex-start',
            marginLeft: scaleSize(90),
            borderBottomWidth: 0,
          },
        }}
      >
        {this._renderGroupList()}
      </Container>
    )
  }
}


const mapStateToProps = (state: any) => ({
  user: state.user.toJS(),
  device: state.device.toJS().device,
  language: state.setting.toJS().language,

  currentGroup: state.guotu.toJS().currentGroup,
})

const mapDispatchToProps = {
  setCurrentGroup,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GuoTuLocation)

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
  selectIcon: {
    width: scaleSize(40),
    height: scaleSize(40),
  },
})
