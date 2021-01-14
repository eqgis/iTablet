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
import { Container, PopMenu } from '../../../../../../components'
import { UserType } from '../../../../../../constants'
import { size } from '../../../../../../styles'
import { getLanguage } from '../../../../../../language'
import { Users } from '../../../../../../redux/models/user'
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
}

type State = {
  data: Array<any>,
  isRefresh: boolean,
  firstLoad: boolean,
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
  }

  _getWidth = () => {
    let width = screen.getScreenWidth(this.props.device.orientation)
    if (this.props.device.orientation.indexOf('LANDSCAPE') === 0) {
      width = width - scaleSize(96)
    }
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
                  accessible={true}
                  accessibilityLabel={name}
                  accessibilityTraits="button"
                  onPress={() => onPressHandler(page)}
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
                  {/* {name ===
                    getLanguage(this.props.language).Friends.MESSAGES && (
                    <InformSpot
                      style={{
                        top: scaleSize(15),
                        right: '38%',
                      }}
                    />
                  )} */}
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
        />
        <InviteMessages
          // ref={ref => (this.inviteMessages = ref)}
          tabLabel={getLanguage(this.props.language).Friends.INVITE_MESSAGE}
          language={this.props.language}
          user={this.props.user}
          device={this.props.device}
          servicesUtils={this.servicesUtils}
        />
      </ScrollableTabView>
    )
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
})

const mapDispatchToProps = {}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GroupMessagePage)

