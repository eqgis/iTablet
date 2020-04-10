/**
 * Copyright © SuperMap. All rights reserved.
 * Author: Asort
 * https://github.com/AsortKeven
 */
import * as React from 'react'
import {
  Animated,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
} from 'react-native'
import SearchBar from '../../../../components/SearchBar'
import { scaleSize, screen } from '../../../../utils'
import { getLanguage } from '../../../../language'
import { SMap } from 'imobile_for_reactnative'
import NavigationService from '../../../NavigationService'

const HEADER_PADDINGTOP = screen.getIphonePaddingTop()
const HEADER_HEIGHT = scaleSize(88) + HEADER_PADDINGTOP

export default class PoiTopSearchBar extends React.Component {
  props: {
    setMapNavigation: () => {},
    device: Object,
  }

  constructor(props) {
    super(props)
    this.top = new Animated.Value(-HEADER_HEIGHT)
    this.state = {
      defaultValue: '',
      visible: false,
    }
    this.width = props.device.orientation.indexOf('LANDSCAPE') === 0
      ? new Animated.Value(screen.getScreenWidth(props.device.orientation) * 0.45)
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
      Animated.timing(this.width,{
        toValue:width,
        duration:300,
      }).start()
    }
  }
  setVisible = visible => {
    if (visible === this.state.visible) return
    let height = visible ? 0 : -HEADER_HEIGHT
    Animated.timing(this.top, {
      toValue: height,
      duration: 400,
    }).start()
    let obj = {
      visible,
    }
    !visible && (obj.defaultValue = '')
    this.setState(obj)
  }

  render() {
    if (!this.state.visible) return <View />
    const backImg = require('../../../../assets/public/Frenchgrey/icon-back-white.png')
    return (
      <Animated.View style={[styles.container, { top: this.top, width:this.width }]}>
        <TouchableOpacity
          onPress={async () => {
            if (GLOBAL.PoiInfoContainer) {
              let poiData = GLOBAL.PoiInfoContainer.state
              let tempResult = GLOBAL.PoiInfoContainer.tempResult
              if (tempResult.tempList.length > 0 && !poiData.showList) {
                //清除操作分开写，此处需要await，返回搜索界面无需await，加快速度
                await GLOBAL.PoiInfoContainer.clear()
                this.setState({ defaultValue: tempResult.name })
                GLOBAL.PoiInfoContainer.setState(
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
                    GLOBAL.PoiInfoContainer.show()
                    await SMap.addCallouts(tempResult.tempList)
                  },
                )
              } else {
                NavigationService.navigate('PointAnalyst', {
                  type: 'pointSearch',
                })
                GLOBAL.PoiInfoContainer.setVisible(false)
                GLOBAL.PoiInfoContainer.tempResult = {
                  name: '',
                  tempList: [],
                }
                this.props.setMapNavigation({
                  isShow: false,
                  name: '',
                })
                this.setVisible(false)
                GLOBAL.PoiInfoContainer.clear()
              }
            }
          }}
        >
          <Image source={backImg} resizeMode={'contain'} style={styles.back} />
        </TouchableOpacity>
        <View style={styles.searchWrap}>
          <SearchBar
            defaultValue={this.state.defaultValue}
            ref={ref => (this.searchBar = ref)}
            onSubmitEditing={async searchKey => {
              GLOBAL.PoiInfoContainer.clear()
              GLOBAL.PoiInfoContainer.getSearchResult({ keyWords: searchKey })
              GLOBAL.PoiInfoContainer.setState({
                showList: true,
              })
            }}
            placeholder={getLanguage(global.language).Prompt.ENTER_KEY_WORDS}
            //{'请输入搜索关键字'}
          />
        </View>
      </Animated.View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    height: HEADER_HEIGHT,
    paddingTop: HEADER_PADDINGTOP,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: 'black',
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
