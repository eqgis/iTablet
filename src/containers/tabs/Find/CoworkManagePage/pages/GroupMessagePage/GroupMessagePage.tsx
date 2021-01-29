/**
 * Created by imobile-xzy on 2019/3/4.
 */

import React, { Component } from 'react'
import {
  Text,
  TouchableOpacity,
} from 'react-native'
import { connect } from 'react-redux'
import { scaleSize, screen } from '../../../../../../utils'
import { Container, PopMenu, RedDot } from '../../../../../../components'
import { UserType, MsgConstant } from '../../../../../../constants'
import { size } from '../../../../../../styles'
import { getLanguage } from '../../../../../../language'
import { Users } from '../../../../../../redux/models/user'
import { readCoworkGroupMsg, ReadMsgParams } from '../../../../../../redux/models/cowork'
import NavigationService from '../../../../../NavigationService'
import { SCoordination } from 'imobile_for_reactnative'
import ScrollableTabView, {
  DefaultTabBar,
} from 'react-native-scrollable-tab-view'
import ApplyMessages from './ApplyMessages'
import InviteMessages from './InviteMessages'

interface Props {
  language: string,
  navigation: any,
  user: Users,
  device: any,
  cowork: any,
  readCoworkGroupMsg: (params: ReadMsgParams) => Promise<any>,
}

type State = {
  scrollTabViewLocked: boolean,
}

class GroupMessagePage extends Component<Props, State> {
  servicesUtils: SCoordination | undefined
  callBack: (data?: any) => any
  pagePopModal: PopMenu | null | undefined
  currentData: any
  currentDataIndex: number | undefined

  constructor(props: Props) {
    super(props)
    this.callBack = this.props.navigation?.state?.params?.callBack

    if (UserType.isOnlineUser(this.props.user.currentUser)) {
      this.servicesUtils = new SCoordination('online')
    } else if (UserType.isIPortalUser(this.props.user.currentUser)){
      this.servicesUtils = new SCoordination('iportal')
    }
    this.state = {
      scrollTabViewLocked: false,
    }
  }

  _getWidth = () => {
    let width = screen.getScreenWidth(this.props.device.orientation)
    return width
  }

  _renderTabs = () => {
    return (
      <ScrollableTabView
        renderTabBar={() => (
          <DefaultTabBar
            style={{
              height: scaleSize(80),
              marginTop: scaleSize(20),
              borderWidth: 0,
            }}
            renderTab={(name: string, page: number, isTabActive: boolean, onPressHandler: (page: number) => void) => {
              let activeTextColor = 'rgba(70,128,223,1.0)'
              let inactiveTextColor = 'black'
              const textColor = isTabActive
                ? activeTextColor
                : inactiveTextColor
              const fontWeight = isTabActive ? 'bold' : 'normal'

              return (
                <TouchableOpacity
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    paddingTop: scaleSize(20),
                    paddingBottom: scaleSize(10),
                  }}
                  key={name}
                  activeOpacity={1}
                  accessible={true}
                  accessibilityLabel={name}
                  accessibilityTraits="button"
                  onPress={() => {
                    onPressHandler(page)
                    let type = MsgConstant.MSG_ONLINE_GROUP_APPLY
                    if (name === getLanguage(this.props.language).Friends.INVITE_MESSAGE) {
                      type = MsgConstant.MSG_ONLINE_GROUP_INVITE
                    }
                    this.props.readCoworkGroupMsg({
                      type: type,
                    })
                  }}
                >
                  <Text
                    style={{
                      color: textColor,
                      fontWeight,
                      fontSize: size.fontSize.fontSizeLg,
                      textAlign: 'center',
                    }}
                  >
                    {name}
                  </Text>
                  {
                    (
                      name === getLanguage(this.props.language).Friends.APPLY_MESSAGE &&
                      this.props.cowork.messages[this.props.user.currentUser.userName]?.applyMessages.unread > 0 ||
                      name === getLanguage(this.props.language).Friends.INVITE_MESSAGE &&
                      this.props.cowork.messages[this.props.user.currentUser.userName]?.inviteMessages.unread > 0
                    ) &&
                    (
                      <RedDot
                        style={{
                          top: scaleSize(15),
                          right: '38%',
                        }}
                      />
                    )
                  }
                </TouchableOpacity>
              )
            }}
          />
        )}
        initialPage={0}
        prerenderingSiblingsNumber={1}
        tabBarUnderlineStyle={{
          backgroundColor: 'rgba(70,128,223,1.0)',
          height: scaleSize(6),
          width: scaleSize(6),
          borderRadius: scaleSize(3),
          marginLeft: this._getWidth() / 4 - 3,
          marginBottom: scaleSize(12),
        }}
      >
        <ApplyMessages
          // ref={ref => (this.applyMessages = ref)}
          tabLabel={getLanguage(this.props.language).Friends.APPLY_MESSAGE}
          language={this.props.language}
          user={this.props.user}
          device={this.props.device}
          servicesUtils={this.servicesUtils}
          readCoworkGroupMsg={this.props.readCoworkGroupMsg}
          unread={this.props.cowork.messages[this.props.user.currentUser.userName]?.applyMessages.unread || 0}
        />
        <InviteMessages
          // ref={ref => (this.inviteMessages = ref)}
          tabLabel={getLanguage(this.props.language).Friends.INVITE_MESSAGE}
          language={this.props.language}
          user={this.props.user}
          device={this.props.device}
          servicesUtils={this.servicesUtils}
          callBack={this.callBack}
          readCoworkGroupMsg={this.props.readCoworkGroupMsg}
          unread={this.props.cowork.messages[this.props.user.currentUser.userName]?.inviteMessages.unread || 0}
        />
      </ScrollableTabView>
    )
  }

  _back = () => {
    // 退出消息页面，把第一页未读消息归0
    this.props.readCoworkGroupMsg({
      type: MsgConstant.MSG_ONLINE_GROUP_APPLY,
    })
    NavigationService.goBack('GroupMessagePage', null)
  }

  render() {
    return (
      <Container
        headerProps={{
          title: getLanguage(GLOBAL.language).Friends.GROUP_MESSAGE,
          navigation: this.props.navigation,
          // headerRight: this._renderHeaderRight(),
          headerTitleViewStyle: {
            justifyContent: 'flex-start',
            marginLeft: scaleSize(80),
          },
          backAction: this._back,
        }}
      >
        {this._renderTabs()}
        {/* {this._renderPagePopup()} */}
      </Container>
    )
  }
}

const mapStateToProps = (state: any) => ({
  user: state.user.toJS(),
  device: state.device.toJS().device,
  language: state.setting.toJS().language,
  cowork: state.cowork.toJS(),
})

const mapDispatchToProps = {
  readCoworkGroupMsg,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GroupMessagePage)

