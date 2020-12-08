import React from 'react'
import { ListSeparator } from '../../../../components'
import { FlatList, View, RefreshControl } from 'react-native'
import { scaleSize } from '../../../../utils'
import { getLanguage } from '../../../../language'
import { SCoordination, SMessageService } from 'imobile_for_reactnative'

import { MemberMessageItem } from './components'
import { GroupMessageType, GroupApplyMessageType } from './types'

import { connect } from 'react-redux'

interface State {
  data: Array<GroupMessageType>,
  isRefresh: boolean,
}

interface Props {
  [name: string]: any,
  messages: any,
  user: any,
  servicesUtils: SCoordination | undefined,
  groupInfo: any,
}

class GroupMessage extends React.Component<Props, State> {

  list: FlatList<object> | null | undefined
  pageSize: number
  currentPage: number
  isLoading:boolean // 防止同时重复加载多次
  isNoMore: boolean // 是否能加载更多

  static defaultProps = {
    messages: [],
  }

  constructor(props: Props) {
    super(props)
    this.state = {
      data: [],
      isRefresh: false,
    }
    this.pageSize = 10
    this.currentPage = 1
    this.isLoading = false // 防止同时重复加载多次
    this.isNoMore = false // 是否能加载更多
  }

  getGroupApply = ({pageSize = this.pageSize, currentPage = 1, orderType = 'DESC', cb = () => {}}: any) => {
    this.props.servicesUtils?.getGroupApply({
      groupId: this.props.groupInfo.id,
      currentPage: currentPage,
      pageSize: pageSize,
      orderType: orderType,
      // checkStatus: 'WAITING',
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
        this.state.isRefresh && this.setState({ isRefresh: false, data: [] })
        this.isLoading = false
      }
    })
  }

  refresh = (cb?: () => any) => {
    if (this.isLoading) return
    this.isLoading = true
    this.isNoMore = false
    this.getGroupApply({
      pageSize: this.pageSize,
      currentPage: 1,
      cb,
    })
    this.setState({ isRefresh: false })
  }

  loadMore = () => {
    if (this.isLoading || this.isNoMore || this.state.data.length < this.pageSize) return
    this.isLoading = true
    this.getGroupApply({
      pageSize: this.pageSize,
      currentPage: this.currentPage + 1,
    })
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    let shouldUpdate = JSON.stringify(nextState) !== JSON.stringify(this.state) ||
    JSON.stringify(nextProps) !== JSON.stringify(this.props)
    return shouldUpdate
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    // 切换用户，重新加载用户配置文件
    if (JSON.stringify(prevProps.messages) !== JSON.stringify(this.props.messages)) {
      // 当有新增数据时，自动滚动到首位
      if (prevProps.messages.length < this.props.messages.length) {
        this.refresh()
        this.list && this.list.scrollToEnd({
          animated: true,
        })
      }
    }
  }

  componentDidMount() {
    this.refresh(() => {
      setTimeout(() => {
        this.list && this.list.scrollToEnd({
          animated: false,
        })
      }, 1000)
    })
  }

  // _onPress = (data: GroupMessageType) => {
  _onPress = (data: GroupApplyMessageType, index: number) => {
    this.props.servicesUtils?.checkGroupApply({
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
        _data[index] = data
        this.setState({
          data: _data,
        })
      }
    })
  }

  _renderItem = ({item, index}: any) => {
    // switch(item.type) {
    //   case 'task':
    //     return <TaskMessageItem data={item.message} />
    //   case 'member':
        return (
          <MemberMessageItem
            data={item}
            // isSelf={item?.group?.groupCreator !== this.props.user.currentUser.id}
            isSelf={item?.applicant !== this.props.user.currentUser.id}
            servicesUtils={this.props.servicesUtils}
            onPress={(data: GroupApplyMessageType) => this._onPress(data, index)}
          />
        )
    // }
    // return null
  }

  _keyExtractor = (item: object, index: number): string => index + ''

  _renderItemSeparatorComponent = () => {
    return <ListSeparator color={'transparent'} height={scaleSize(20)} />
  }

  render() {
    return (
      <View>
        <FlatList
          ref={ref => this.list = ref}
          inverted={true}
          ItemSeparatorComponent={this._renderItemSeparatorComponent}
          // data={this.props.messages}
          data={this.state.data}
          renderItem={this._renderItem}
          keyExtractor={this._keyExtractor}
          extraData={this.state}
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

const mapStateToProps = state => ({
  user: state.user.toJS(),
  language: state.setting.toJS().language,
  messages: state.cowork.toJS().messages,
})

const mapDispatchToProps = {
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GroupMessage)

