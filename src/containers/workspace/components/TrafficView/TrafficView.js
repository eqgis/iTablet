/**
 * Copyright © SuperMap. All rights reserved.
 * Author: Asort
 * https://github.com/AsortKeven
 */

import * as React from 'react'
import { StyleSheet, TouchableOpacity, Image, Animated } from 'react-native'

import {
  constUtil,
  scaleSize,
  LayerUtils,
  Toast,
  screen,
} from '../../../../utils'
import { color } from '../../../../styles'
import { Const, ConstOnline } from '../../../../constants'
import { SData, SMap, SNavigation } from 'imobile_for_reactnative'
import { DatasetType } from 'imobile_for_reactnative/NativeModule/interfaces/data/SDataType'
import { getThemeAssets } from '../../../../assets'
import { getLanguage } from '../../../../language'
import { SNavigationInner } from 'imobile_for_reactnative/NativeModule/interfaces/navigation/SNavigationInner'

export default class TrafficView extends React.Component {
  props: {
    device: Object,
    language: String,
    getLayers: () => {},
    incrementRoad: () => {},
    setLoading?: () => void,
    mapLoaded: boolean,
    currentFloorID: String,
  }

  constructor(props) {
    super(props)
    this.state = {
      left: new Animated.Value(scaleSize(20)),
      hasAdded: false,
      showIcon: true,
      isIndoor: false,
      layers: [],
      currentFloorID: props.currentFloorID,
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.currentFloorID !== prevState.currentFloorID) {
      if (nextProps.currentFloorID) {
        return {
          currentFloorID: nextProps.currentFloorID,
          isIndoor: true,
        }
      } else {
        return {
          currentFloorID: nextProps.currentFloorID,
          isIndoor: false,
        }
      }
    }
    return null
  }
  incrementRoad = async () => {
    // let rel = await SNavigation.hasLineDataset()
    let rel = false
    let datasources = await SData._getDatasetsByWorkspaceDatasource()
    datasources.forEach(item => {
      item.data.forEach(item2 => {
        if(item2.datasetType === DatasetType.LINE){
          rel = true
        }
      })
    })

    if (rel) {
      this.props.incrementRoad()
    } else {
      Toast.show(getLanguage(this.props.language).Prompt.NO_LINE_DATASETS)
    }
  }

  setVisible = (visible, immediately = false) => {
    if (visible) {
      Animated.timing(this.state.left, {
        toValue: scaleSize(20),
        duration: immediately ? 0 : Const.ANIMATED_DURATION,
        useNativeDriver: false,
      }).start()
    } else {
      Animated.timing(this.state.left, {
        toValue: scaleSize(-200),
        duration: immediately ? 0 : Const.ANIMATED_DURATION,
        useNativeDriver: false,
      }).start()
    }
  }

  trafficChange = async () => {
    try {
      this.props.setLoading && this.props.setLoading(true, getLanguage(this.props.language).Prompt.CHANGING)
      if (this.state.hasAdded) {
        await SMap.removeLayer('tencent@TrafficMap')
      } else {
        let layers = await this.props.getLayers()
        let baseMap = layers.filter(layer =>
          LayerUtils.isBaseLayer(layer),
        )[0]
        if (
          baseMap &&
          baseMap.name !== 'baseMap' &&
          baseMap.isVisible
        ) {
          if(!await SData.isDatasourceOpened(ConstOnline.TrafficMap.DSParams.alias)) {
            await SData.openDatasource(ConstOnline.TrafficMap.DSParams)
          }
          const scale = await SMap.getMapScale()
          const center = await SMap.getMapCenter()
          await SMap.addLayer(ConstOnline.TrafficMap.DSParams.alias, 0)
          await SMap.setMapScale(1 / parseFloat(scale))
          await SMap.setMapCenter(center.x, center.y)
          SMap.refreshMap()
        }
      }
      let hasAdded = !this.state.hasAdded
      this.setState({
        hasAdded,
      })
      this.props.setLoading && this.props.setLoading(false)
    } catch (error) {
      this.props.setLoading && this.props.setLoading(false)
    }
  }

  render() {
    if (!this.props.mapLoaded) return null
    let trafficImg = this.state.hasAdded
      ? getThemeAssets().navigation.icon_traffic_on
      : getThemeAssets().navigation.icon_traffic_off
    let networkImg = getThemeAssets().mine.mine_my_plot_new
    return (
      <Animated.View
        style={[
          styles.container,
          {
            left: this.state.left,
            top: scaleSize(global.coworkMode ? 200 : 143) + screen.getIphonePaddingTop(),
          },
        ]}
      >
        {!this.state.isIndoor ? (
          <TouchableOpacity
            underlayColor={constUtil.UNDERLAYCOLOR_TINT}
            style={{
              flex: 1,
            }}
            onPress={this.trafficChange}
          >
            <Image source={trafficImg} style={styles.icon} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            underlayColor={constUtil.UNDERLAYCOLOR_TINT}
            style={{
              flex: 1,
            }}
            onPress={this.incrementRoad}
          >
            <Image source={networkImg} style={styles.icon} />
          </TouchableOpacity>
        )}
      </Animated.View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: scaleSize(60),
    height: scaleSize(60),
    backgroundColor: color.content_white,
    borderRadius: scaleSize(4),
    elevation: 20,
    shadowOffset: { width: 0, height: 0 },
    shadowColor: 'black',
    shadowOpacity: 1,
    shadowRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    flex: 1,
    width: scaleSize(50),
    height: scaleSize(50),
  },
  text: {
    fontSize: scaleSize(20),
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
})
