/**
 * Copyright © SuperMap. All rights reserved.
 * Author: Asort
 * https://github.com/AsortKeven
 */
import * as React from 'react'
import { Animated, StyleSheet, View } from 'react-native'
import { SearchBar, Header } from '../../../../components'
import { scaleSize, screen } from '../../../../utils'
import { color } from '../../../../styles'
import { getLanguage } from '../../../../language'
import { SMap } from 'imobile_for_reactnative'
import NavigationService from '../../../NavigationService'
import HardwareBackHandler from '../../../../components/HardwareBackHandler'

export default class PoiTopSearchBar extends React.Component {
  props: {
    setMapNavigation: () => {},
    device: Object,
    navigation: Object,
  }

  constructor(props) {
    super(props)
    this.top = new Animated.Value(-screen.getHeaderHeight())
    this.state = {
      defaultValue: '',
      visible: false,
    }
    this.width =
      props.device.orientation.indexOf('LANDSCAPE') === 0
        ? new Animated.Value(
          screen.getScreenWidth(props.device.orientation) * 0.45,
        )
        : new Animated.Value(screen.getScreenWidth(props.device.orientation))
  }

  componentDidUpdate(prevProps) {
    if (prevProps.device.orientation !== this.props.device.orientation) {
      let width
      if (this.props.device.orientation.indexOf('LANDSCAPE') === 0) {
        width = screen.getScreenWidth(this.props.device.orientation) * 0.45
      } else {
        width = screen.getScreenWidth(this.props.device.orientation)
      }
      Animated.timing(this.width, {
        toValue: width,
        duration: 300,
        useNativeDriver: false,
      }).start()
    }
  }
  setVisible = visible => {
    if (visible === this.state.visible) return
    let height = visible ? 0 : -screen.getHeaderHeight()
    Animated.timing(this.top, {
      toValue: height,
      duration: 400,
      useNativeDriver: false,
    }).start()
    let obj = {
      visible,
    }
    !visible && (obj.defaultValue = '')
    this.setState(obj)
  }

  back = async () => {
    if (global.PoiInfoContainer) {
      let poiData = global.PoiInfoContainer.state
      let tempResult = global.PoiInfoContainer.tempResult
      if (tempResult.tempList.length > 0 && !poiData.showList) {
        //清除操作分开写，此处需要await，返回搜索界面无需await，加快速度
        await global.PoiInfoContainer.clear()
        this.setState({ defaultValue: tempResult.name })
        global.PoiInfoContainer.setState(
          {
            destination: '',
            location: {},
            address: '',
            showMore: false,
            showList: true,
            neighbor: [],
            resultList: tempResult.tempList,
          },
          async () => {
            global.PoiInfoContainer.show()
            await SMap.addCallouts(tempResult.tempList)
          },
        )
      } else {
        NavigationService.navigate('PointAnalyst', {
          type: 'pointSearch',
        })
        global.PoiInfoContainer.setVisible(false)
        global.PoiInfoContainer.tempResult = {
          name: '',
          tempList: [],
        }
        this.props.setMapNavigation({
          isShow: false,
          name: '',
        })
        this.setVisible(false)
        global.PoiInfoContainer.clear()
      }
    }
  }

  _renderSearchBar = () => {
    return (
      <SearchBar
        defaultValue={this.state.defaultValue}
        ref={ref => (this.searchBar = ref)}
        onSubmitEditing={async searchKey => {
          global.PoiInfoContainer.clear()
          //zhangxt 2020-10-12 补全接口需要的参数
          let location = await SMap.getMapcenterPosition()
          global.PoiInfoContainer.getSearchResult({
            keyWords: searchKey,
            location: JSON.stringify(location),
            radius: 5000,
          })
          global.PoiInfoContainer.setState({
            showList: true,
          })
        }}
        placeholder={getLanguage(global.language).Prompt.ENTER_KEY_WORDS}
        //{'请输入搜索关键字'}
      />
    )
  }

  render() {
    if (!this.state.visible) return <View />
    return (
      <Animated.View
        style={[
          styles.container,
          {
            height: screen.getHeaderHeight(),
            top: this.top,
            width: this.width,
          },
        ]}
      >
        <HardwareBackHandler onBackPress={this.back}/>
        <Header
          ref={ref => (this.containerHeader = ref)}
          navigation={this.props.navigation}
          title={
            this.type === 'pointSearch'
              ? ''
              : getLanguage(global.language).Map_Main_Menu.TOOLS_PATH_ANALYSIS
          }
          backAction={this.back}
          headerCenter={this._renderSearchBar()}
        />
      </Animated.View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    // height: HEADER_HEIGHT,
    // paddingTop: HEADER_PADDINGTOP,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: color.bgW,
  },
  searchWrap: {
    flex: 1,
    flexDirection: 'column',
  },
  back: {
    width: scaleSize(60),
    height: scaleSize(60),
    backgroundColor: '#rgba(255, 255, 255, 0)',
  },
})
