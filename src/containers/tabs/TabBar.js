import * as React from 'react'
import { connect } from 'react-redux'
import { View, StyleSheet, Platform } from 'react-native'
import { scaleSize } from '../../utils'
import { color } from '../../styles'
import PropTypes from 'prop-types'
import { getThemeAssets } from '../../assets'
import TabItem from './TabItem'
import InformSpot from './Friend/InformSpot'
import { getLanguage } from '../../language'
import { AppTabs } from '../../constants'

class TabBar extends React.Component {
  static propTypes = {
    language: PropTypes.string,
    navigation: PropTypes.object,
    style: PropTypes.any,
    appConfig: PropTypes.object,
    device: PropTypes.object,
  }

  constructor(props) {
    super(props)
    const data = this.getToolbar()

    this.state = {
      data: data,
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      nextProps.language !== this.props.language ||
      JSON.stringify(nextProps.style) !== JSON.stringify(this.props.style) ||
      JSON.stringify(nextProps.appConfig) !== JSON.stringify(this.props.appConfig) ||
      JSON.stringify(nextProps.device) !== JSON.stringify(this.props.device) ||
      JSON.stringify(nextState) !== JSON.stringify(this.state)
    ) {
      return true
    }
    return false
  }

  componentDidUpdate(prevProps) {
    if (this.props.language !== prevProps.language) {
      this.setState({
        data: this.getToolbar(),
      })
    }
  }

  getToolbar = () => {
    let list = [
      {
        key: AppTabs.Home,
        title: getLanguage(this.props.language).Navigator_Label.HOME,
        image: getThemeAssets().tabBar.tab_home,
        selectedImage: getThemeAssets().tabBar.tab_home_selected,
        btnClick: () => {
          this.props.navigation && this.props.navigation.navigate('Home')
        },
      },
    ]
    const tabModules = this.props.appConfig.tabModules
    let btnClick = function(key) {
      this.props.navigation && this.props.navigation.navigate(key)
    }.bind(this)
    for (let i = 0; i < tabModules.length; i++) {
      switch (tabModules[i]) {
        // case 'Home':
        //   list.push({
        //     key: 'Home',
        //     image: getThemeAssets().tabBar.tab_home,
        //     selectedImage: getThemeAssets().tabBar.tab_home_selected,
        //     btnClick: () => {
        //       this.props.navigation && this.props.navigation.navigate('Home')
        //     },
        //   })
        //   break
        case AppTabs.Friend:
          list.push({
            key: 'Friend',
            title: getLanguage(this.props.language).Navigator_Label.FRIENDS,
            image: getThemeAssets().tabBar.tab_friend,
            selectedImage: getThemeAssets().tabBar.tab_friend_selected,
            btnClick: () => btnClick(tabModules[i]),
          })
          break
        case AppTabs.Find:
          list.push({
            key: 'Find',
            title: getLanguage(this.props.language).Navigator_Label.EXPLORE,
            image: getThemeAssets().tabBar.tab_discover,
            selectedImage: getThemeAssets().tabBar.tab_discover_selected,
            btnClick: () => btnClick(tabModules[i]),
          })
          break
        case AppTabs.Mine:
          list.push({
            key: 'Mine',
            title: getLanguage(this.props.language).Navigator_Label.PROFILE,
            image: getThemeAssets().tabBar.tab_mine,
            selectedImage: getThemeAssets().tabBar.tab_mine_selected,
            btnClick: () => btnClick(tabModules[i]),
          })
          break
        default:
          if (
            tabModules[i] instanceof Object &&
            tabModules[i].key &&
            tabModules[i].Screen
          ) {
            list.push({
              key: tabModules[i].key,
              title: tabModules[i].getTitle(this.props.language),
              image: tabModules[i].image,
              selectedImage: tabModules[i].selectedImage,
              btnClick: () => btnClick(tabModules[i].key),
            })
          }
      }
    }
    return list
  }

  _renderItem = ({ item }, key) => {
    // let NavIndex = this.props.navigation.state.index
    let routeKey = this.props.navigation.state.key
    return (
      <TabItem
        key={key}
        item={item}
        selected={routeKey === item.key}
        onPress={() => {
          !GLOBAL.clickWait && item.btnClick && item.btnClick()
        }}
        renderExtra={() => {
          if (item.key === 'Friend') {
            return (
              <InformSpot
                style={{
                  right: Platform.OS === 'android' ? scaleSize(50) : 0,
                }}
              />
            )
          }
        }}
      />
    )
  }

  renderItems = data => {
    let toolbar = []
    let key = 0
    data.forEach((item, index) => {
      toolbar.push(this._renderItem({ item, index }, key++))
    })
    return toolbar
  }

  render() {
    let isLandscape = this.props.device.orientation.indexOf('LANDSCAPE') === 0
    let style = isLandscape ? styles.containerL : styles.containerP
    return (
      <View style={[style, this.props.style]}>
        {this.renderItems(this.state.data)}
      </View>
    )
  }
}

const mapStateToProps = state => {
  return {
    user: state.user.toJS(),
    language: state.setting.toJS().language,
    device: state.device.toJS().device,
    appConfig: state.appConfig.toJS(),
  }
}

const mapDispatchToProps = {}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TabBar)

const styles = StyleSheet.create({
  containerP: {
    width: '100%',
    height: scaleSize(120),
    backgroundColor: color.white,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: scaleSize(3),
    borderColor: color.itemColorGray2,
  },
  containerL: {
    width: scaleSize(96),
    height: '100%',
    backgroundColor: color.white,
    alignSelf: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderLeftWidth: scaleSize(3),
    borderColor: color.itemColorGray2,
  },
})
