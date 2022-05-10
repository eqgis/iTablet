/**
 * Created by imobile-xzy on 2019/3/4.
 */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { scaleSize, screen } from '../../../../../../utils'
import { Container, PopMenu, RedDot } from '../../../../../../components'
import { UserType, MsgConstant } from '../../../../../../constants'
import { size, color } from '../../../../../../styles'
import { getLanguage } from '../../../../../../language'
import { Users } from '../../../../../../redux/models/user'
import { readCoworkGroupMsg, ReadMsgParams } from '../../../../../../redux/models/cowork'
import NavigationService from '../../../../../NavigationService'
import { SCoordination } from 'imobile_for_reactnative'
import { TabView, SceneMap, TabBar } from 'react-native-tab-view'
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
  index: number,
  routes: {key: string, title: string}[],
}

class GroupMessagePage extends Component<Props, State> {
  servicesUtils: SCoordination | undefined
  callBack: (data?: any) => any
  pagePopModal: PopMenu | null | undefined
  currentData: any
  currentDataIndex: number | undefined

  constructor(props: Props) {
    super(props)
    this.callBack = this.props.route?.params?.callBack

    if (UserType.isOnlineUser(this.props.user.currentUser)) {
      this.servicesUtils = new SCoordination('online')
    } else if (UserType.isIPortalUser(this.props.user.currentUser)){
      this.servicesUtils = new SCoordination('iportal')
    }
    this.state = {
      index: 0,
      routes: [{
        key: 'ApplyMessages',
        title: getLanguage(this.props.language).Friends.APPLY_MESSAGE,
      }, {
        key: 'InviteMessages',
        title: getLanguage(this.props.language).Friends.INVITE_MESSAGE,
      }],
    }
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    if (
      nextProps.language !== this.props.language ||
      JSON.stringify(nextProps.user) !== JSON.stringify(this.props.user) ||
      JSON.stringify(nextProps.cowork) !== JSON.stringify(this.props.cowork) ||
      JSON.stringify(nextProps.device) !== JSON.stringify(this.props.device) ||
      JSON.stringify(nextState) !== JSON.stringify(this.state)
    ) {
      return true
    }
    return false
  }

  _getWidth = () => {
    let width = screen.getScreenWidth(this.props.device.orientation)
    return width
  }

  goToPage = (index: number) => {
    this.state.index !== index &&
      this.setState({
        index,
      })
  }

  _renderTabBar = (props: any) => (
    <TabBar
      {...props}
      indicatorStyle={{
        backgroundColor: 'rgba(70,128,223,1.0)',
        height: scaleSize(3),
        width: scaleSize(30),
        marginLeft: screen.getScreenWidth(this.props.device.orientation) / 2 / 2 - 10,
      }}
      renderBadge={scene => (
        (
          scene.route.key ==='ApplyMessages' &&
          this.props.cowork.messages[this.props.user.currentUser.userName]?.applyMessages.unread > 0 ||
          scene.route.key === 'InviteMessages' &&
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
      )}
      onTabPress={({route, preventDefault}) => {
        const routes = this.state.routes
        for (const index in routes) {
          if (Object.hasOwnProperty.call(routes, index)) {
            const element = routes[index];
            if (element.key === route.key) {
              this.setState({
                index: parseInt(index),
              })
              // preventDefault()
              break
            }
          }
        }
      }}
      style={{
        height: scaleSize(80),
        marginTop: scaleSize(20),
        borderWidth: 0,
        backgroundColor: color.white,
        elevation: 0,
        shadowRadius: 0,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
      }}
      labelStyle={{
        color: 'black',
        // fontWeight: true ? 'bold' : 'normal',
        fontSize: size.fontSize.fontSizeLg,
        textAlign: 'center',
      }}
      activeColor={'rgba(70,128,223,1.0)'}
    />
  )

  private renderScene = SceneMap({
    'ApplyMessages': () => (
      <ApplyMessages
        language={this.props.language}
        user={this.props.user}
        device={this.props.device}
        servicesUtils={this.servicesUtils}
        readCoworkGroupMsg={this.props.readCoworkGroupMsg}
        unread={this.props.cowork.messages[this.props.user.currentUser.userName]?.applyMessages.unread || 0}
      />
    ),
    'InviteMessages': () => (
      <InviteMessages
        language={this.props.language}
        user={this.props.user}
        device={this.props.device}
        servicesUtils={this.servicesUtils}
        callBack={this.callBack}
        readCoworkGroupMsg={this.props.readCoworkGroupMsg}
        unread={this.props.cowork.messages[this.props.user.currentUser.userName]?.inviteMessages.unread || 0}
      />
    ),
  })

  _back = () => {
    // 退出消息页面，把第一页未读消息归0
    this.props.readCoworkGroupMsg({
      type: MsgConstant.MSG_ONLINE_GROUP_APPLY,
    })
    NavigationService.goBack('GroupMessagePage', null)
  }

  _getRoute = () => ({
    index: 0,
    routes: [{
      key: 'ApplyMessages',
      title: getLanguage(this.props.language).Friends.APPLY_MESSAGE,
    }, {
      key: 'InviteMessages',
      title: getLanguage(this.props.language).Friends.INVITE_MESSAGE,
    }],
  })

  render() {
    return (
      <Container
        headerProps={{
          title: getLanguage(this.props.language).Friends.GROUP_MESSAGE,
          navigation: this.props.navigation,
          // headerRight: this._renderHeaderRight(),
          headerTitleViewStyle: {
            justifyContent: 'flex-start',
            marginLeft: scaleSize(80),
          },
          backAction: this._back,
        }}
      >
        <TabView
          lazy
          navigationState={this.state}
          onIndexChange={this.goToPage}
          renderTabBar={this._renderTabBar}
          renderScene={this.renderScene}
          swipeEnabled={true}
        />
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

