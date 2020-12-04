import React, { Component } from 'react'
import { Text, TouchableOpacity } from 'react-native'
import { Container, PopMenu, ImageButton } from '../../../../../components'
import { getLanguage } from '../../../../../language'
import { scaleSize } from '../../../../../utils'
import { color } from '../../../../../styles'
import { getThemeAssets } from '../../../../../assets'
import { UserType } from '../../../../../constants'
import NavigationService from '../../../../NavigationService'
import { Users } from '../../../../../redux/models/user'
import { GroupList } from '../components'
import { connect } from 'react-redux'
import { SCoordination } from 'imobile_for_reactnative'

interface Props {
  navigation: Object,
  user: Users,
  language: string,
  device: any,
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

  _itemPress = (groupInfo: any) => {
    NavigationService.navigate('CoworkManagePage', { groupInfo, callBack: this.groupList?.refresh })
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

  _renderGroupList = () => {
    return (
      <GroupList
        ref={ref => this.groupList = ref}
        user={this.props.user.currentUser}
        joinTypes={['CREATE', 'JOINED']}
        onPress={this._itemPress}
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
})

const mapDispatchToProps = {}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GroupSelectPage)
