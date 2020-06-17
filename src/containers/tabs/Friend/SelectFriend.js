import React, { Component } from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import FriendList from './FriendList/FriendList'
import FriendGroup from './FriendGroup/FriendGroup'
import { Container } from '../../../components'
import { getLanguage } from '../../../language/index'
import { scaleSize, screen } from '../../../utils'
import { connect } from 'react-redux'
import ScrollableTabView, {
  DefaultTabBar,
} from 'react-native-scrollable-tab-view'

class SelectFriend extends Component {
  props: {
    navigation: Object,
    user: Object,
    device: Object,
  }

  constructor(props) {
    super(props)
    let { params } = this.props.navigation.state
    this.showType = params.showType || 'friend'
    this.callBack = params.callBack
  }

  renderFriendList = () => {
    return (
      <FriendList
        ref={ref => (this.friendList = ref)}
        tabLabel={getLanguage(global.language).Friends.FRIENDS}
        language={global.language}
        user={this.props.user.currentUser}
        friend={global.getFriend()}
        callBack={targetId => {
          this.callBack && this.callBack(targetId)
        }}
      />
    )
  }

  renderGroupList = () => {
    return (
      <FriendGroup
        ref={ref => (this.friendGroup = ref)}
        tabLabel={getLanguage(global.language).Friends.GROUPS}
        language={global.language}
        user={this.props.user.currentUser}
        friend={global.getFriend()}
        callBack={targetId => {
          this.callBack && this.callBack(targetId)
        }}
      />
    )
  }

  renderLists = () => {
    let width = screen.getScreenWidth(this.props.device.orientation)
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <ScrollableTabView
          renderTabBar={() => (
            <DefaultTabBar
              style={{ height: scaleSize(60) }}
              renderTab={(name, page, isTabActive, onPressHandler) => {
                let activeTextColor = 'rgba(70,128,223,1.0)'
                let inactiveTextColor = 'black'
                const textColor = isTabActive
                  ? activeTextColor
                  : inactiveTextColor
                const fontWeight = isTabActive ? 'bold' : 'normal'

                return (
                  <TouchableOpacity
                    style={{ flex: 1 }}
                    key={name}
                    accessible={true}
                    accessibilityLabel={name}
                    accessibilityTraits="button"
                    onPress={() => onPressHandler(page)}
                  >
                    <View
                      style={{
                        flex: 1,
                        alignItems: 'center',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        paddingVertical: scaleSize(10),
                      }}
                    >
                      <View>
                        <Text
                          style={{
                            color: textColor,
                            fontWeight,
                            fontSize: scaleSize(25),
                            textAlign: 'center',
                          }}
                        >
                          {name}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                )
              }}
            />
          )}
          initialPage={0}
          prerenderingSiblingsNumber={1}
          tabBarUnderlineStyle={{
            backgroundColor: 'rgba(70,128,223,1.0)',
            height: scaleSize(3),
            width: scaleSize(30),
            marginLeft: width / 2 / 2 - 10,
          }}
        >
          {this.renderFriendList()}
          {this.renderGroupList()}
        </ScrollableTabView>
      </View>
    )
  }

  render() {
    return (
      <Container
        headerProps={{
          title: getLanguage(global.language).Friends.TITLE_CHOOSE_FRIEND,
          navigation: this.props.navigation,
        }}
      >
        {this.showType === 'friend' && this.renderFriendList()}
        {this.showType === 'all' && this.renderLists()}
      </Container>
    )
  }
}

const mapStateToProps = state => ({
  user: state.user.toJS(),
  device: state.device.toJS().device,
})

const mapDispatchToProps = {}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SelectFriend)
