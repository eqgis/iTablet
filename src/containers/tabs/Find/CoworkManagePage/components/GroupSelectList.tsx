/**
 * Created by imobile-xzy on 2019/3/4.
 */

import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SectionList,
  RefreshControl,
  Image,
} from 'react-native'

import { Toast, scaleSize } from '../../../../../utils'
import { size, color } from '../../../../../styles'
import { getThemeAssets } from '../../../../../assets'
// import FriendListFileHandle from '../FriendListFileHandle'
// eslint-disable-next-line
// import { ActionPopover } from 'teaset'
import { getLanguage } from '../../../../../language'
import { UserType } from '../../../../../constants'
import { SCoordination } from 'imobile_for_reactnative'
import { UserInfo } from '../../../../../redux/models/user'

interface Props {
  user: UserInfo,
  onPress: (data: any) => void,
}

interface State {
  data: Array<any>,
  isRefresh: boolean,
}

class GroupSelectList extends Component<Props, State> {
  servicesUtils: SCoordination | undefined
  pageSize: number
  currentPage: number
  isLoading:boolean // 防止同时重复加载多次
  isNoMore: boolean // 是否能加载更多

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
    this.pageSize = 10000
    this.currentPage = 1
    this.isLoading = false // 防止同时重复加载多次
    this.isNoMore = false // 是否能加载更多
  }


  componentDidMount() {
    this.refresh()
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    let shouldUpdate = JSON.stringify(nextState) !== JSON.stringify(this.state)
    shouldUpdate = shouldUpdate || (
      JSON.stringify(nextProps.user) !== JSON.stringify(this.props.user)
    )
    return shouldUpdate
  }

  refresh = () => {
    if (this.isLoading) return
    this.isLoading = true
    this.isNoMore = false
    this.getContacts({
      pageSize: this.pageSize,
      currentPage: 1,
    })
    this.setState({ isRefresh: false })
  }

  getContacts = async ({pageSize = this.pageSize, currentPage = 1, orderBy = 'CREATETIME', orderType = 'DESC'}) => {
    try {
      let _data = []
      let myGroupResult = await this.servicesUtils?.getMyGroupInfos({
        orderBy: orderBy,
        orderType: orderType,
        pageSize: pageSize,
        currentPage: currentPage,
        keywords: '',
      })

      if (myGroupResult && myGroupResult.content) {
        let myGroupData = myGroupResult.content
        _data.push({
          title: '我的群组',
          data: myGroupData,
        })
      }

      let joinedGroupResult = await this.servicesUtils?.getGroupInfos({
        orderBy: orderBy,
        orderType: orderType,
        pageSize: pageSize,
        currentPage: currentPage,
        keywords: '',
        joinTypes: ['JOINED'],
      })

      if (joinedGroupResult && joinedGroupResult.content && joinedGroupResult.content.length > 0) {
        let joinedGroupData = joinedGroupResult.content
        _data.push({
          title: '加入的群组',
          data: joinedGroupData,
        })
      }

      this.setState({
        data: _data,
      }, () => this.isLoading = false)
    } catch (error) {
      this.isLoading = false
      Toast.show(error.message)
    }
  }

  _itemPress = (groupInfo: any) => {
    this.props.onPress && this.props.onPress(groupInfo)
  }

  _keyExtractor = (item, index) => index.toString()

  _renderItem = ({item}) => {
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

  _renderSection = (sectionItem: any) => {
    const { section } = sectionItem
    let isFirstSection = section.title === this.state.data[0].title
    return (
      <View style={[
        styles.ITemHeadTextViewStyle,
        isFirstSection && {
          borderTopLeftRadius: scaleSize(36),
          borderTopRightRadius: scaleSize(36),
        },
      ]}>
        <Text style={styles.ITemHeadTextStyle}>{section.title.toUpperCase()}</Text>
      </View>
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
        <SectionList
          renderSectionHeader={this._renderSection}
          renderItem={this._renderItem}
          keyExtractor={this._keyExtractor}
          sections={this.state.data}
          // ItemSeparatorComponent={this._renderItemSeparatorComponent}
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
})
export default GroupSelectList
