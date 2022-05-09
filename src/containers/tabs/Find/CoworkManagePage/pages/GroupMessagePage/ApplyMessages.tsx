/**
 * Created by imobile-xzy on 2019/3/4.
 */

import React, { Component } from 'react'
import {
  Text,
  View,
  FlatList,
  RefreshControl,
  Image,
} from 'react-native'
import { Toast } from '../../../../../../utils'
import { ListSeparator, PopMenu } from '../../../../../../components'
import { MsgConstant } from '../../../../../../constants'
import { color } from '../../../../../../styles'
import { getThemeAssets } from '../../../../../../assets'
import { getLanguage } from '../../../../../../language'
import { Users } from '../../../../../../redux/models/user'
import { ReadMsgParams } from '../../../../../../redux/models/cowork'
import SMessageServiceHTTP from '../../../../Friend/SMessageServiceHTTP'
import { SCoordination, SMessageService, GroupApplyMessageType } from 'imobile_for_reactnative'
import { Person } from '../../types'
import { ApplyItem } from '../../components'

import styles from './styles'

interface Props {
  language: string,
  user: Users,
  device: any,
  unread: number,
  servicesUtils: SCoordination | undefined,
  readCoworkGroupMsg: (params: ReadMsgParams) => Promise<any>,
}

type State = {
  data: Array<any>,
  isRefresh: boolean,
  firstLoad: boolean,
}

export default class ApplyMessages extends Component<Props, State> {
  popData: Array<any>
  pagePopModal: PopMenu | null | undefined
  pageSize: number
  currentPage: number
  isLoading:boolean // 防止同时重复加载多次
  isNoMore: boolean // 是否能加载更多
  currentData: any
  currentDataIndex: number

  constructor(props: Props) {
    super(props)

    this.state = {
      data: [],
      isRefresh: false,
      firstLoad: true,
    }
    this.currentData = {}
    this.currentDataIndex = -1
    this.popData = [
      {
        title: getLanguage(global.language).Friends.GROUP_APPLY_AGREE,
        action: () => {
          this.currentData.checkStatus = 'ACCEPTED'
          this._popPress(this.currentData, this.currentDataIndex)
        },
      },
      {
        title: getLanguage(global.language).Friends.GROUP_APPLY_DISAGREE,
        action: () => {
          this.currentData.checkStatus = 'REFUSED'
          this._popPress(this.currentData, this.currentDataIndex)
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
    this.props.readCoworkGroupMsg({
      type: MsgConstant.MSG_ONLINE_GROUP_APPLY,
    })
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    return (
      JSON.stringify(nextProps) !== JSON.stringify(this.props) ||
      JSON.stringify(nextState) !== JSON.stringify(this.state)
    )
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.unread !== prevProps.unread) {
      this.getMessages({
        pageSize: this.pageSize,
        currentPage: 1,
      })
    }
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

  getMessages = async ({pageSize = this.pageSize, currentPage = 1, orderBy = 'applyTime', orderType = 'DESC', groupApplyRole = 'CHECKUSER', cb = () => {}}: any) => {
    this.props.servicesUtils?.getApply({
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
          firstLoad: false,
        }, () => {
          this.isLoading = false
          cb && cb()
        })
      } else {
        this.setState({ isRefresh: false, firstLoad: false })
        this.isLoading = false
      }
    }).catch(() => {
      this.setState({ isRefresh: false, firstLoad: false })
    })
  }

  _itemPress = ({data, index}: {data: GroupApplyMessageType, index: number}) => {
    this.currentDataIndex = index
    let _data = JSON.parse(JSON.stringify(data))
    _data.checkStatus = 'ACCEPTED'
    this._popPress(_data, index)
  }

  _showMore = ({data, index, event}: {data: Person, index: number, event: any}) => {
    this.currentData = JSON.parse(JSON.stringify(data))
    this.currentDataIndex = index
    this.pagePopModal?.setVisible(true, {
      x: event.nativeEvent.pageX,
      y: event.nativeEvent.pageY,
    })
  }

  _popPress = (message: GroupApplyMessageType, index: number) => {
    if (!message || index === -1) return
    let data = message
    this.props.servicesUtils?.checkGroupApply({
      groupId: data.groupId,
      userIds: [data.id],
      isAccepted: data.checkStatus === 'ACCEPTED',
    }).then(result => {
      if (result.succeed) {
        if (data.checkStatus === 'ACCEPTED') {
          let timeStr = new Date().getTime()
          let _message = {
            id: 'GROUP_APPLY_' + timeStr,
            message: {
              ...message,
              type: MsgConstant.MSG_ONLINE_GROUP_APPLY_AGREE,
            },
            type: MsgConstant.MSG_COWORK,
            user: {
              name: this.props.user.currentUser.nickname || '',
              id: this.props.user.currentUser.userId || '',
            },
            time: timeStr,
          }
          // SMessageService.sendMessage(
          //   JSON.stringify(_message),
          //   data.applicant,
          // )
          SMessageServiceHTTP.sendMessage(
            _message,
            [data.applicant],
          )
        }
        let _data = this.state.data.deepClone()
        _data[index] = message
        this.setState({
          data: _data,
        })
      } else if (result.error?.errorMsg) {
        Toast.show(result.error?.errorMsg)
      }
    })
  }

  _renderItem = ({item, index}: {item: GroupApplyMessageType, index: number}): React.ReactElement => {
    return (
      <ApplyItem
        style={styles.item}
        user={this.props.user}
        data={item}
        index={index}
        onPress={data => this._itemPress(data)}
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
            title={getLanguage(global.language).Friends.LOADING}
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
    return (
      <View style={[styles.nullView]}>
        <View style={styles.nullSubView}>
          <Image style={styles.nullImage} source={getThemeAssets().cowork.bg_photo_task} />
          <Text style={styles.nullTitle}>{getLanguage(global.language).Friends.GROUP_MESSAGE_NULL}</Text>
        </View>
        <View style={{flex: 1, backgroundColor: 'black'}} />
      </View>
    )
  }

  render() {
    return (
      <View style={styles.subContainer}>
        {this.state.data.length === 0 && !this.state.firstLoad && this._renderNull()}
        {this._renderList()}
        {this._renderPagePopup()}
      </View>
    )
  }
}

