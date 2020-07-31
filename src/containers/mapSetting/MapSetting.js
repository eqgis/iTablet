import React, { Component } from 'react'
import { Container } from '../../components'
import NavigationService from '../NavigationService'
import { MapToolbar } from '../workspace/components'
import {
  View,
  FlatList,
  Platform,
} from 'react-native'
import styles from './styles'
import {
  getThematicMapSettings,
  getMapARSettings,
} from './settingData'
import { getLanguage } from '../../language'
import { getThemeAssets } from '../../assets'
import { ChunkType } from '../../constants'
import { scaleSize } from '../../utils'
import color from '../../styles/color'
import CoworkInfo from '../tabs/Friend/Cowork/CoworkInfo'
import MapSettingItem from './MapSettingItem'
import { legendModule } from '../workspace/components/ToolBar/modules'

export default class MapSetting extends Component {
  props: {
    nav: string,
    language: string,
    navigation: Object,
    currentMap: Object,
    data: Array,
    setMapSetting: () => {},
    closeMap: () => {},
    mapSetting: any,
    device: Object,
    mapLegend: Object,
    appConfig: Object,
    mapModules: Object,
    setMapLegend: () => {},
    mapColumnNavBar: boolean,
    setColumnNavBar: () => {},
  }

  constructor(props) {
    super(props)
    const { params } = this.props.navigation.state
    this.type = params && params.type
    this.state = {
      data: [],
      isRealTime: CoworkInfo.isRealTime,
    }
  }

  componentDidMount() {
    this.getData()
  }

  componentDidUpdate(prevProps) {
    if (
      JSON.stringify(prevProps.mapSetting) !==
      JSON.stringify(this.props.mapSetting)
    ) {
      this.setState({ data: this.props.mapSetting })
    } else if (
      JSON.stringify(prevProps.currentMap) !==
        JSON.stringify(this.props.currentMap) &&
      this.props.currentMap.name
    ) {
      this.getData()
    }
  }

  getData = async () => {
    let newData = getThematicMapSettings()
    if (GLOBAL.Type === ChunkType.MAP_AR) {
      newData = newData.concat(getMapARSettings())
      //ios先暂时屏蔽POI设置和检测类型
      if (Platform.OS === 'ios') {
        newData.splice(4, 1)
      }
    }
    // if (GLOBAL.Type === ChunkType.MAP_NAVIGATION) {
    //   newData = newData.concat(getNavigationSetting())
    // }
    this.setState({
      data: newData,
    })
  }

  headerAction = section => {
    let newData = JSON.parse(JSON.stringify(this.state.data))
    section.visible = !section.visible

    for (let i = 0; i < newData.length; i++) {
      if (newData[i].title === section.title) {
        newData[i] = section
        break
      }
    }

    this.setState({
      data: newData,
    })
  }

  setLoading = (loading = false, info, extra) => {
    this.container && this.container.setLoading(loading, info, extra)
  }

  setSaveViewVisible = visible => {
    GLOBAL.SaveMapView &&
      GLOBAL.SaveMapView.setVisible(visible, this.setLoading)
  }

  _renderItemSeparatorComponent = () => {
    return <View style={styles.itemSeparator} />
  }
  
  renderFlatListItem = ({ item }) => {
    return (
      <MapSettingItem
        title={item.title}
        style={this.props.device.orientation.indexOf('LANDSCAPE') < 0 && {}}
        action={() => {
          //图例单独处理
          if (
            item.title === getLanguage(this.props.language).Map_Settings.LEGEND_SETTING
          ) {
            legendModule().action()
          } else {
            //根据title跳转
            NavigationService.navigate('SecondMapSettings', {
              title: item.title,
              language: this.props.language,
              //
              device: this.props.device,
            })
          }
        }}
        rightAction={item.rightAction}
        leftImage={item.leftImage}
        rightImage={item.rightImage}
        type={item.type}
      />
    )
  }

  renderSelection = () => {
    if (this.state.data.length === 0)
      return <View style={{ flex: 1, backgroundColor: color.contentWhite }} />
    return (
      <FlatList
        style={{ backgroundColor: color.contentWhite }}
        renderItem={this.renderFlatListItem}
        ItemSeparatorComponent={this._renderItemSeparatorComponent}
        data={this.state.data}
        keyExtractor={(item, index) => item.title + index}
        numColumns={1}
        ListFooterComponent={this.renderFooterComponent}
      />
    )
  }

  renderFooterComponent = () => {
    return (
      <View>
        {this._renderItemSeparatorComponent()}
        <MapSettingItem
          title={getLanguage(global.language).Map_Setting.COLUMN_NAV_BAR}
          type={'switch'}
          rightAction={value => {
            this.props.setColumnNavBar(value)
          }}
          value={this.props.mapColumnNavBar}
          leftImage={getThemeAssets().setting.icon_horizontal_screen}
        />
        {this._renderItemSeparatorComponent()}
        {
          CoworkInfo.coworkId !== '' &&
          <MapSettingItem
            title={getLanguage(global.language).Profile.REAL_TIME_SYNC}
            rightAction={value => {
              CoworkInfo.setIsRealTime(value)
              this.setState({ isRealTime: value })
            }}
            value={this.state.isRealTime}
            leftImage={getThemeAssets().setting.icon_horizontal_screen}
          />
        }
        {this._renderItemSeparatorComponent()}
      </View>
    )
  }

  renderToolBar = () => {
    return (
      <MapToolbar
        navigation={this.props.navigation}
        mapModules={this.props.mapModules}
        initIndex={3}
        type={this.type}
      />
    )
  }

  render() {
    return (
      <Container
        style={styles.container}
        ref={ref => (this.container = ref)}
        headerProps={{
          title: this.props.mapModules.modules[
            this.props.mapModules.currentMapModule
            ].chunk.title,
          navigation: this.props.navigation,
          headerTitleViewStyle: {
            justifyContent: 'flex-start',
            marginLeft: scaleSize(80),
          },
          withoutBack: true,
        }}
        onOverlayPress={() => {
          this.props.navigation.navigate('MapView')
        }}
        bottomBar={this.renderToolBar()}
      >
        {this.renderSelection()}
      </Container>
    )
  }
}
