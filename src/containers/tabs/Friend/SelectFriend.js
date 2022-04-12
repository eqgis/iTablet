import React, { Component } from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import FriendList from './FriendList/FriendList'
import FriendGroup from './FriendGroup/FriendGroup'
import { Container } from '../../../components'
import { getLanguage } from '../../../language/index'
import { scaleSize, screen } from '../../../utils'
import { size, color } from '../../../styles'
import { connect } from 'react-redux'
import { TabView, SceneMap, TabBar } from 'react-native-tab-view'

class SelectFriend extends Component {
  props: {
    navigation: Object,
    user: Object,
    device: Object,
  }

  constructor(props) {
    super(props)
    let { params } = this.props.route
    this.showType = params.showType || 'friend'
    this.callBack = params.callBack
    this.title = params.title || ''
    if (this.title === '') {
      switch(this.showType) {
        case 'allGroup':  // 所有群组
        case 'group':  // 我的群组
        case 'joinedGroup':  // 我加入的群组
        case 'createGroup':  // 我创建的群组
        case 'canJoinGroup':  // 没加入的群组
          this.title = getLanguage(global.language).Friends.TITLE_CHOOSE_GROUP
          break
        default:
          this.title = getLanguage(global.language).Friends.TITLE_CHOOSE_FRIEND
      }
    }
    this.state = {
      index: 0,
      routes: [{
        key: 'FriendList',
        title: getLanguage(this.props.language).Friends.FRIENDS,
      }, {
        key: 'FriendGroup',
        title: getLanguage(this.props.language).Friends.GROUPS,
      }],
    }
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

  renderGroupList = (joinTypes = []) => {
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
        joinTypes={joinTypes}
      />
    )
  }

  goToPage = index => {
    this.state.index !== index &&
      this.setState({
        index,
      })
  }

  _renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={{
        backgroundColor: 'rgba(70,128,223,1.0)',
        height: scaleSize(3),
        width: scaleSize(30),
        marginLeft: screen.getScreenWidth(this.props.device.orientation) / 2 / 2 - 10,
      }}
      renderBadge={scene => (
        scene.route.key === 'FriendMessage' &&
        <InformSpot
          style={{
            top: scaleSize(15),
            right: '38%',
          }}
        />
      )}
      onTabPress={({route, preventDefault}) => {
        const routes = this.state.routes
        for (const index in routes) {
          if (Object.hasOwnProperty.call(routes, index)) {
            const element = routes[index];
            if (element.key === route.key) {
              this.setState({
                currentPage: parseInt(index),
              })
              preventDefault()
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
  
  _renderTabs = () => {
    return SceneMap({
      'FriendList': this.renderFriendList,
      'FriendGroup': () => this.renderGroupList(['MINE']),
    })
  }


  renderLists = () => {
    let width = screen.getScreenWidth(this.props.device.orientation)
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <TabView
          navigationState={this.state}
          onIndexChange={this.goToPage}
          renderTabBar={this._renderTabBar}
          renderScene={this._renderTabs()}
          swipeEnabled={true}
        />
      </View>
    )
  }

  renderContent = () => {
    switch(this.showType) {
      case 'friend':
        return this.renderFriendList()
      case 'allGroup':
        return this.renderGroupList()
      case 'group':
        return this.renderGroupList(['MINE'])
      case 'joinedGroup':
        return this.renderGroupList(['JOINED'])
      case 'createGroup':
        return this.renderGroupList(['CREATE'])
      case 'canJoinGroup':
        return this.renderGroupList(['CANJOIN'])
      case 'all':
      default:
        return this.renderLists()
    }
  }

  render() {
    return (
      <Container
        headerProps={{
          title: this.title,
          navigation: this.props.navigation,
        }}
      >
        {this.renderContent()}
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
