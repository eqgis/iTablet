import * as React from 'react'
import { connect } from 'react-redux'
import { View, StyleSheet, Platform } from 'react-native'
import { scaleSize, screen } from '../../utils'
import PropTypes from 'prop-types'
import { getThemeAssets } from '../../assets'
import TabItem from './TabItem'
import InformSpot from './Friend/InformSpot'

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

  getToolbar = () => {
    let list = []
    const tabModules = this.props.appConfig.tabModules
    for (let i = 0; i < tabModules.length; i++) {
      switch (tabModules[i]) {
        case 'Home':
          list.push({
            key: 'Home',
            image: getThemeAssets().tabBar.tab_home,
            selectedImage: getThemeAssets().tabBar.tab_home_selected,
            btnClick: () => {
              this.props.navigation && this.props.navigation.navigate('Home')
            },
          })
          break
        case 'Friend':
          list.push({
            key: 'Friend',
            image: getThemeAssets().tabBar.tab_friend,
            selectedImage: getThemeAssets().tabBar.tab_friend_selected,
            btnClick: () => {
              this.props.navigation && this.props.navigation.navigate('Friend')
            },
          })
          break
        case 'Find':
          list.push({
            key: 'Find',
            image: getThemeAssets().tabBar.tab_discover,
            selectedImage: getThemeAssets().tabBar.tab_discover_selected,
            btnClick: () => {
              this.props.navigation && this.props.navigation.navigate('Find')
            },
          })
          break
        case 'Mine':
          list.push({
            key: 'Mine',
            image: getThemeAssets().tabBar.tab_mine,
            selectedImage: getThemeAssets().tabBar.tab_mine_selected,
            btnClick: () => {
              this.props.navigation && this.props.navigation.navigate('Mine')
            },
          })
          break
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
          item.btnClick && item.btnClick()
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
    let style = isLandscape
      ? [
        styles.containerL,
        screen.isIphoneX() && {
          ...screen.getIphonePaddingHorizontal(this.props.device.orientation),
          width:
              TAB_BAR_WIDTH_L +
              (screen.isIphoneX() &&
              this.props.device.orientation === 'LANDSCAPE-RIGHT'
                ? screen.X_TOP
                : 0),
        },
      ]
      : styles.containerP
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

export const TAB_BAR_HEIGHT_P = scaleSize(96)
export const TAB_BAR_WIDTH_L = scaleSize(96)
const styles = StyleSheet.create({
  containerP: {
    width: '100%',
    height: TAB_BAR_HEIGHT_P,
    backgroundColor: '#EEEEEE',
    alignSelf: 'center',
    borderStyle: 'solid',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  containerL: {
    width: TAB_BAR_WIDTH_L,
    height: '100%',
    backgroundColor: '#EEEEEE',
    alignSelf: 'center',
    borderStyle: 'solid',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
})
