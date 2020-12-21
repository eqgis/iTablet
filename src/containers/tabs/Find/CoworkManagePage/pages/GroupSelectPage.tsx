import React, { Component } from 'react'
import { FlatList, RefreshControl, View, TouchableOpacity, Image, Text, StyleSheet } from 'react-native'
import { Container, PopMenu, ImageButton } from '../../../../../components'
import { getLanguage } from '../../../../../language'
import { Toast, scaleSize } from '../../../../../utils'
import { size, color } from '../../../../../styles'
import { getThemeAssets } from '../../../../../assets'
import { UserType } from '../../../../../constants'
import NavigationService from '../../../../NavigationService'
import { Users } from '../../../../../redux/models/user'
import { setCoworkGroup } from '../../../../../redux/models/cowork'
import { GroupList } from '../components'
import { connect } from 'react-redux'
import { SCoordination } from 'imobile_for_reactnative'

interface Props {
  navigation: Object,
  user: Users,
  language: string,
  device: any,
  coworkGroups: any,
  setCoworkGroup?: (data: any) => any,
}

interface State {
  data: Array<any>,
  isRefresh: boolean,
}

class GroupSelectPage extends Component<Props, State> {

  servicesUtils: SCoordination | undefined
  onlineServicesUtils: any
  popData: Array<any>
  PagePopModal: PopMenu | null | undefined
  container: any
  pageSize: number
  currentPage: number
  isLoading:boolean // 防止同时重复加载多次
  isNoMore: boolean // 是否能加载更多
  groupList: GroupList | null | undefined

  constructor(props: Props) {
    super(props)
   
    if (UserType.isOnlineUser(this.props.user.currentUser)) {
      this.servicesUtils = new SCoordination('online')
    } else if (UserType.isIPortalUser(this.props.user.currentUser)){
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

    this.popData = [
      {
        title: getLanguage(GLOBAL.language).Friends.GROUP_CREATE,
        action: () => {
          NavigationService.navigate('CreateGroupPage', { callBack: () => this.groupList?.refresh(false) })
        },
      },
      {
        title: getLanguage(GLOBAL.language).Friends.GROUP_APPLY,
        action: () => {
          if (UserType.isOnlineUser(this.props.user.currentUser)) {
            NavigationService.navigate('GroupApplyPage', {
              callBack: this.groupList?.refresh,
            })
          } else {
            NavigationService.navigate('Login', {
              show: ['Online'],
            })
          }
        },
      },
    ]
  }

  componentDidMount() {
    (async function() {
      await this.refresh(false)
    }.bind(this)())
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    if (
      JSON.stringify(nextProps) !== JSON.stringify(this.props) ||
      JSON.stringify(nextState) !== JSON.stringify(this.state)
    ) {
      return true
    }
    return false
  }

  _itemPress = (groupInfo: any) => {
    NavigationService.navigate('CoworkManagePage', { groupInfo, callBack: this.groupList?.refresh })
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
      this.servicesUtils?.getGroupInfos({
        orderBy: orderBy,
        orderType: orderType,
        pageSize: pageSize,
        currentPage: currentPage,
        keywords: '',
        joinTypes: ['CREATE', 'JOINED'],
      }).then(result => {
        if (result && result.content) {
          let _data: any[] = []
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
        icon={getThemeAssets().tabBar.tab_setting_selected}
        onPress={(event: any) => {
          this.PagePopModal && this.PagePopModal.setVisible(true, {
            x: event.nativeEvent.pageX,
            y: event.nativeEvent.pageY,
          })
        }}
      />
    )
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

  _renderGroupList = () => {
    // return (
    //   <GroupList
    //     ref={ref => this.groupList = ref}
    //     user={this.props.user.currentUser}
    //     joinTypes={['CREATE', 'JOINED']}
    //     onPress={this._itemPress}
    //     setCoworkGroup={this.props.setCoworkGroup}
    //   />
    // )

    return (
      <FlatList
        style={styles.list}
        ItemSeparatorComponent={() => {
          return <View style={styles.itemSeparator} />
        }}
        // data={this.state.data}
        data={this.props.coworkGroups}
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
    )
  }

  render() {
    return (
      <Container
        showFullInMap={true}
        hideInBackground={false}
        headerProps={{
          title: getLanguage(GLOBAL.language).Friends.TITLE_CHOOSE_GROUP,
          navigation: this.props.navigation,
          headerRight: this.renderRight(),
        }}
      >
        {this._renderGroupList()}
        {this._renderPagePopup()}
      </Container>
    )
  }
}


const mapStateToProps = (state: any) => ({
  user: state.user.toJS(),
  device: state.device.toJS().device,
  language: state.setting.toJS().language,
  coworkGroups: state.cowork.toJS().groups[state.user.toJS().currentUser.userId],
})

const mapDispatchToProps = {
  setCoworkGroup,
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
