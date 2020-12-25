import React, { Component } from 'react'
import { Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Container, PopMenu, InputDialog } from '../../../../../components'
import { getLanguage } from '../../../../../language'
import { scaleSize, Toast } from '../../../../../utils'
import { size, color } from '../../../../../styles'
import { UserType, MsgConstant } from '../../../../../constants'
import NavigationService from '../../../../NavigationService'
import { Users } from '../../../../../redux/models/user'
import { GroupList } from '../components'
import { connect } from 'react-redux'
import { SCoordination, SMessageService } from 'imobile_for_reactnative'
import { GroupMessageType } from '../types'

interface Props {
  navigation: Object,
  user: Users,
  language: string,
  device: any,
}

interface State {
  data: Array<any>,
  isRefresh: boolean,
  showApplyDialog: boolean,
}

class GroupApplyPage extends Component<Props, State> {

  servicesUtils: SCoordination | undefined
  onlineServicesUtils: any
  PagePopModal: PopMenu | null | undefined
  applyDialog: InputDialog | null | undefined
  container: any
  pageSize: number
  currentPage: number
  isLoading:boolean // 防止同时重复加载多次
  isNoMore: boolean // 是否能加载更多
  groupInfo: any // 临时选中的群组数据
  callBack: (data?: any) => void

  constructor(props: Props) {
    super(props)
    let { params } = this.props.navigation.state
    this.callBack = params?.callBack
    if (UserType.isOnlineUser(this.props.user.currentUser)) {
      this.servicesUtils = new SCoordination('online')
    } else if (UserType.isIPortalUser(this.props.user.currentUser)){
      this.servicesUtils = new SCoordination('iportal')
    }

    this.state = {
      data: [],
      isRefresh: false,
      showApplyDialog: false,
    }
    this.pageSize = 10000
    this.currentPage = 1
    this.isLoading = false // 防止同时重复加载多次
    this.isNoMore = false // 是否能加载更多
  }

  _itemPress = (groupInfo: any) => {
    if (groupInfo.creator === this.props.user.currentUser.userId) {
      Toast.show(getLanguage(GLOBAL.language).Friends.GROUP_ALREADY_JOINED)
      return
    }
    this.groupInfo = groupInfo
    this.applyDialog?.setDialogVisible(true)
  }

  _applyToGroup = (groupInfo: any, applyReason: string) => {
    this.servicesUtils?.applyToGroup({
      groupIds: [groupInfo.id],
      applyReason: applyReason,
      applicant: this.props.user.currentUser.userId || '',
    }).then(result => {
      if (result.succeed) {
        let timeStr = new Date().getTime()
        let message: GroupMessageType = {
          id: 'GROUP_APPLY_' + timeStr,
          message: {
            type: MsgConstant.MSG_ONLINE_GROUP_APPLY,
            checkStatus: 'WAITTING',
            applicant: this.props.user.currentUser.userId || '',
            applyTime: timeStr,
          },
          type: MsgConstant.MSG_ONLINE_GROUP,
          user: {
            name: this.props.user.currentUser.nickname || '',
            id: this.props.user.currentUser.userId || '',
          },
          to: {
            name: groupInfo.nickname,
            id: groupInfo.creator,
          },
          group: {
            groupID: groupInfo.id,
            groupName: groupInfo.groupName,
            groupCreator: groupInfo.creator,
          },
          time: timeStr,
        }
        SMessageService.sendMessage(
          JSON.stringify(message),
          groupInfo.creator,
        )
        NavigationService.goBack('GroupApplyPage', null)
        this.callBack && this.callBack(groupInfo)
        Toast.show(getLanguage(this.props.language).Friends.GROUP_APPLY_INFO)
      } else if (result.error) {
        Toast.show(result.error.errorMsg)
      }
    })
  }

  renderRight = () => {
    return (
      <TouchableOpacity
        onPress={event => {
          this.PagePopModal && this.PagePopModal.setVisible(true, {
            x: event.nativeEvent.pageX,
            y: event.nativeEvent.pageY,
          })
        }}
      >
        <Text style={{ fontSize: scaleSize(24), color: color.fontColorBlack }}>
          {getLanguage(GLOBAL.language).Friends.GROUP_MANAGE}
        </Text>
      </TouchableOpacity>
    )
  }

  _renderDialog = () => {
    return (
      <InputDialog
        ref={ref => (this.applyDialog = ref)}
        title={getLanguage(GLOBAL.language).Friends.GROUP_APPLY_REASON}
        multiline={true}
        legalCheck={false}
        confirmAction={value => {
          this._applyToGroup(this.groupInfo, value)
        }}
        cancelAction={() => {
          this.applyDialog?.setDialogVisible(false)
        }}
        confirmBtnTitle={getLanguage(GLOBAL.language).Friends.APPLY}
        cancelBtnTitle={getLanguage(GLOBAL.language).Friends.CANCEL}
      />
    )
  }

  render() {
    return (
      <Container
        showFullInMap={true}
        hideInBackground={false}
        headerProps={{
          title: getLanguage(GLOBAL.language).Friends.GROUP_APPLY,
          navigation: this.props.navigation,
          // headerRight: this.renderRight(),
        }}
      >
        <GroupList
          user={this.props.user.currentUser}
          joinTypes={['CANJOIN']}
          onPress={this._itemPress}
        />
        {this._renderDialog()}
      </Container>
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

const mapStateToProps = (state: any) => ({
  user: state.user.toJS(),
  device: state.device.toJS().device,
  language: state.setting.toJS().language,
})

const mapDispatchToProps = {}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GroupApplyPage)
