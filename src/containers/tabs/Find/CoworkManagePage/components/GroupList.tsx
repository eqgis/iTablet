/**
 * Created by imobile-xzy on 2019/3/4.
 */

import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Image,
} from 'react-native'

import NavigationService from '../../../../NavigationService'
import { Toast, scaleSize } from '../../../../../utils'
import { size, color } from '../../../../../styles'
import { getThemeAssets } from '../../../../../assets'
// import FriendListFileHandle from '../FriendListFileHandle'
// eslint-disable-next-line
// import { ActionPopover } from 'teaset'
import { getLanguage } from '../../../../../language'
import { UserType } from '../../../../../constants'
import { SCoordination } from 'imobile_for_reactnative'
import { UserInfo, Users } from '../../../../../redux/models/user'

interface Props {
  user: UserInfo,
  joinTypes?: Array<string>,
  onPress: (data: any) => any,
}

interface State {
  data: Array<any>,
  isRefresh: boolean,
}

export default class GroupList extends Component<Props, State> {
  servicesUtils: SCoordination | undefined
  pageSize: number
  currentPage: number
  isLoading:boolean // 防止同时重复加载多次
  isNoMore: boolean // 是否能加载更多

  static defaultProps = {
    joinTypes: [], // MINE 我的群组（单独，不与后几个类型同时使用） | CREATE 我创建的群组 | JOINED 我加入的群组 ｜ CANJOIN 未加入的群组 | 空数组[]为 所有群组
  }

  constructor(props: Props) {
    super(props)
    if (UserType.isOnlineUser(this.props.user)) {
      this.servicesUtils = new SCoordination('online')
    } else if (UserType.isIPortalUser(this.props.user)){
      this.servicesUtils = new SCoordination('iportal')
    }

    this.state = {
      data: [],
      isRefresh: false,
    }
    this.pageSize = 30
    this.currentPage = 1
    this.isLoading = false // 防止同时重复加载多次
    this.isNoMore = false // 是否能加载更多
  }


  componentDidMount() {
    this.getContacts({
      pageSize: this.pageSize,
      currentPage: 1,
    })
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    let shouldUpdate = JSON.stringify(nextState) !== JSON.stringify(this.state)
    shouldUpdate = shouldUpdate || (
      JSON.stringify(nextProps.user) !== JSON.stringify(this.props.user)
    )
    return shouldUpdate
  }

  refresh = async (refresh = true) => {
    if (this.isLoading) return
    this.isLoading = true
    this.isNoMore = false
    refresh && this.setState({
      isRefresh: true,
    })
    await this.getContacts({
      pageSize: this.pageSize,
      currentPage: 1,
    })
  }

  loadMore = () => {
    if (this.isLoading || this.isNoMore) return
    this.isLoading = true
    this.getContacts({
      pageSize: this.pageSize,
      currentPage: this.currentPage + 1,
    })
  }

  getContacts = async ({pageSize = this.pageSize, currentPage = 1, orderBy = 'CREATETIME', orderType = 'DESC'}) => {
    try {
      let getDataFunc, joinTypes: Array<string> = []
      if (this.props.joinTypes?.indexOf('MINE') >= 0) {
        getDataFunc = this.servicesUtils?.getMyGroupInfos
      } else {
        joinTypes = this.props.joinTypes
        getDataFunc = this.servicesUtils?.getGroupInfos
      }
      if (!getDataFunc) return
      getDataFunc({
        orderBy: orderBy,
        orderType: orderType,
        pageSize: pageSize,
        currentPage: currentPage,
        keywords: '',
        joinTypes: joinTypes,
      }).then(result => {
        if (result && result.content) {
          let _data = []
          if (result.content.length > 0) {
            if (this.currentPage < currentPage) {
              _data = this.state.data.deepClone()
              _data = _data.concat(result.content)
            } else {
              _data = result.content
            }
          }
          // 判断是否还有更多数据
          if (_data.length === result.total) {
            this.isNoMore = true
          }
          this.currentPage = currentPage
          this.setState({
            data: _data,
            isRefresh: false,
          }, () => this.isLoading = false)
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

  _itemPress = (groupInfo: any) => {
    this.props.onPress && this.props.onPress(groupInfo)
  }

  _keyExtractor = (item, index) => index.toString()

  _renderItem = ({ item, index }) => {
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
          <Text numberOfLines={2} style={styles.ITemTextStyle}>{item.groupName}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'flex-start',
          backgroundColor: 'white',
          marginTop: scaleSize(20),
          borderTopLeftRadius: scaleSize(36),
          borderTopRightRadius: scaleSize(36),
          overflow: 'hidden',
        }}
      >
        <FlatList
          style={styles.list}
          ItemSeparatorComponent={() => {
            return <View style={styles.itemSeparator} />
          }}
          data={this.state.data}
          renderItem={this._renderItem}
          keyExtractor={(item, index) => index.toString()}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefresh}
              onRefresh={this.refresh}
              colors={['orange', 'red']}
              tintColor={'orange'}
              titleColor={'orange'}
              title={getLanguage(GLOBAL.language).Friends.LOADING}
              enabled={true}
            />
          }
          onEndReachedThreshold={0.5}
          onEndReached={this.loadMore}
        />
      </View>
    )
  }
}
const styles = StyleSheet.create({
  ItemViewStyle: {
    height: scaleSize(114),
    paddingHorizontal: scaleSize(44),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  ITemHeadTextViewStyle: {
    height: scaleSize(72),
    backgroundColor: color.itemColorGray2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  ITemHeadTextStyle: {
    fontSize: size.fontSize.fontSizeLg,
    color: color.contentColorBlack,
    marginLeft: scaleSize(80),
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
    marginLeft: scaleSize(150),
  },
  list: {
    borderTopLeftRadius: scaleSize(36),
    borderTopRightRadius: scaleSize(36),
    backgroundColor: color.bgW,
  },
})
