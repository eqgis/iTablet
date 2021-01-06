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
  FlatList,
  RefreshControl,
  Image,
} from 'react-native'
import { connect } from 'react-redux'
import NavigationService from '../../../../NavigationService'
import { Toast, scaleSize } from '../../../../../utils'
import { getPinYinFirstCharacter } from '../../../../../utils/pinyin'
import { UserType } from '../../../../../constants'
import { Container, ListSeparator, CheckBox, PopMenu, ImageButton, Dialog } from '../../../../../components'
import { color, size } from '../../../../../styles'
import { getThemeAssets } from '../../../../../assets'
import { MsgConstant } from '../../../Friend'
import { getLanguage } from '../../../../../language'
import { Users } from '../../../../../redux/models/user'
import { exitGroup } from '../../../../../redux/models/cowork'
import { SCoordination, SMessageService } from 'imobile_for_reactnative'
import { Person, GroupApplyMessageType } from '../types'
import { ApplyItem } from '../components'

interface Props {
  language: string,
  navigation: any,
  user: Users,
  device: any,
  exitGroup: (params: {groupID: number | string, cb?: Function}) => any,
}

type State = {
  data: Array<any>,
  isRefresh: boolean,
}

class GroupMessagePage extends Component<Props, State> {
  servicesUtils: SCoordination | undefined
  callBack: (data?: any) => any
  popData: Array<any>
  pagePopModal: PopMenu | null | undefined
  pageSize: number
  currentPage: number
  isLoading:boolean // 防止同时重复加载多次
  isNoMore: boolean // 是否能加载更多
  currentData: any
  currentDataIndex: number | undefined

  constructor(props: Props) {
    super(props)
    this.callBack = this.props.navigation?.state?.params?.callBack

    this.state = {
      data: [],
      isRefresh: false,
    }
    if (UserType.isOnlineUser(this.props.user.currentUser)) {
      this.servicesUtils = new SCoordination('online')
    } else if (UserType.isIPortalUser(this.props.user.currentUser)){
      this.servicesUtils = new SCoordination('iportal')
    }
    this.popData = [
      {
        title: getLanguage(GLOBAL.language).Friends.GROUP_APPLY_AGREE,
        action: () => {
          this.currentData.checkStatus = 'ACCEPTED'
          this._popPress(this.currentData)
        },
      },
      {
        title: getLanguage(GLOBAL.language).Friends.GROUP_APPLY_DISAGREE,
        action: () => {
          this.currentData.checkStatus = 'REFUSED'
          this._popPress(this.currentData)
        },
      },
    ]
    this.pageSize = 20
    this.currentPage = 1
    this.isLoading = false // 防止同时重复加载多次
    this.isNoMore = false // 是否能加载更多
  }

  componentDidMount() {
    this.getMessages({
      pageSize: this.pageSize,
      currentPage: 1,
    })
  }

  refresh = (cb?: () => any) => {
    if (this.isLoading) return
    this.isLoading = true
    this.isNoMore = false
    this.getMessages({
      pageSize: this.pageSize,
      currentPage: 1,
      cb,
    })
    this.setState({ isRefresh: false })
  }

  loadMore = () => {
    if (this.isLoading || this.isNoMore || this.state.data.length < this.pageSize) return
    this.isLoading = true
    this.getMessages({
      pageSize: this.pageSize,
      currentPage: this.currentPage + 1,
    })
  }

  getMessages = async ({pageSize = this.pageSize, currentPage = 1, orderBy = 'APPLYTIME', orderType = 'DESC', groupApplyRole = 'CHECKUSER', cb = () => {}}: any) => {
    this.servicesUtils?.getApply({
      currentPage: currentPage,
      pageSize: pageSize,
      orderBy: orderBy,
      orderType: orderType,
      checkStatus: null,
      groupApplyRole: groupApplyRole,
    }).then((result: any) => {
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
        }, () => {
          this.isLoading = false
          cb && cb()
        })
      } else {
        this.state.isRefresh && this.setState({ isRefresh: false })
        this.isLoading = false
      }
    })
  }

  _itemPress = (item: Person) => {
    this.callBack && this.callBack([item])
  }

  _showMore = ({data, index, event}: {data: Person, index: number, event: any}) => {
    this.currentData = data
    this.currentDataIndex = index
    this.pagePopModal?.setVisible(true, {
      x: event.nativeEvent.pageX,
      y: event.nativeEvent.pageY,
    })
  }

  _popPress = (data: GroupApplyMessageType) => {
    if (!data) return
    this.servicesUtils?.checkGroupApply({
      groupId: data.groupId,
      userIds: [data.id],
      isAccepted: data.checkStatus === 'ACCEPTED',
    }).then(result => {
      if (result.succeed) {
        SMessageService.sendMessage(
          JSON.stringify(data),
          data.applicant,
        )
        let _data = this.state.data.deepClone()
        _data[this.currentDataIndex] = data
        this.setState({
          data: _data,
        })
      }
    })
  }

  _renderItem = ({item, index}: {item: Person, index: number}) => {
    return (
      <ApplyItem
        style={styles.item}
        user={this.props.user}
        data={item}
        index={index}
        onPress={(data: any) => this._itemPress(data)}
        showMore={data => this._showMore(data)}
      />
    )
  }

  _renderHeaderRight = () => {
  }

  _renderPagePopup = () => {
    return (
      <PopMenu
        ref={ref => (this.pagePopModal = ref)}
        data={this.popData}
        device={this.props.device}
        hasCancel={false}
      />
    )
  }

  _renderItemSeparatorComponent = () => {
    return <ListSeparator color={color.bgW2} style={styles.separator} />
  }

  _renderList = () => {
    return (
      <FlatList
        data={this.state.data}
        keyExtractor={(item, index) => index.toString()} //不重复的key
        renderItem={this._renderItem}
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
        ItemSeparatorComponent={this._renderItemSeparatorComponent}
      />
    )
  }

  _renderNull = () => {
    <View>
      <Image source={getThemeAssets().cowork.bg_photo_news} />
      <Text></Text>
    </View>
  }

  render() {
    return (
      <Container
        headerProps={{
          title: getLanguage(GLOBAL.language).Friends.GROUP_MESSAGE,
          navigation: this.props.navigation,
          // headerRight: this._renderHeaderRight(),
        }}
      >
        {
          this.state.data.length > 0 ? this._renderList() : this._renderNull()
        }
        {this._renderPagePopup()}
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  headerBtnTitle: {
    fontSize: scaleSize(24),
    color: color.fontColorBlack,
  },
  HeadViewStyle: {
    height: scaleSize(72),
    backgroundColor: color.itemColorGray2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  HeadTextStyle: {
    fontSize: size.fontSize.fontSizeLg,
    color: color.contentColorBlack,
    marginLeft: scaleSize(80),
  },
  ItemViewStyle: {
    paddingLeft: scaleSize(20),
    paddingRight: scaleSize(30),
    height: scaleSize(90),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  item: {
    marginLeft: scaleSize(46),
    marginRight: scaleSize(42),
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
  FlatListViewStyle: {
    position: 'absolute',
    width: scaleSize(26),
    right: scaleSize(15),
    top: scaleSize(35),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  FlatListItemViewStyle: {
    marginVertical: 2,
    height: scaleSize(30),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  separator: {
    marginLeft: scaleSize(46),
    marginRight: scaleSize(200),
  },
})

const mapStateToProps = (state: any) => ({
  user: state.user.toJS(),
  device: state.device.toJS().device,
  language: state.setting.toJS().language,
})

const mapDispatchToProps = {
  exitGroup,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GroupMessagePage)

