import React, { Component } from 'react'
import { Container } from '../../components'
import NavigationService from '../NavigationService'
import { MapToolbar } from '../workspace/components'
import { View, FlatList } from 'react-native'
import styles from './styles'
import { getThematicMapSettings, getMapARAnalysisSettings } from './settingData'
import { getLanguage } from '../../language'
import { getThemeAssets } from '../../assets'
import { ChunkType } from '../../constants'
import { scaleSize } from '../../utils'
import color from '../../styles/color'
import CoworkInfo from '../tabs/Friend/Cowork/CoworkInfo'
import MapSettingItem from './MapSettingItem'
import { legendModule } from '../workspace/components/ToolBar/modules'
import { TaskRealTimeParams } from '../../redux/models/cowork'
import { Users } from '../../redux/models/user'

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
    user: Users,
    // cowork: any,
    // currentUser: UserInfo,
    currentTaskInfo: any,
    currentTask: any,
    device: Object,
    mapLegend: Object,
    appConfig: Object,
    mapModules: Object,
    setMapLegend: () => {},
    mapColumnNavBar: boolean,
    setColumnNavBar: () => {},
    setIsRealTime: (params: TaskRealTimeParams) => Promise<any>,
  }

  constructor(props) {
    super(props)
    const { params } = this.props.route
    this.type = params && params.type
    this.state = {
      data: [],
      // isRealTime: CoworkInfo.isRealTime,
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
      (JSON.stringify(prevProps.currentMap) !==
      JSON.stringify(this.props.currentMap) &&
    this.props.currentMap.name)
    || this.props.language !== prevProps.language
    ) {
      this.getData()
    }
  }

  getData = async () => {
    let newData = getThematicMapSettings()
    if (global.Type === ChunkType.MAP_AR_ANALYSIS) {
      newData = newData.concat(getMapARAnalysisSettings())
    }
    // if (global.Type === ChunkType.MAP_NAVIGATION) {
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
    global.SaveMapView &&
      global.SaveMapView.setVisible(visible, {
        setLoading: this.setLoading,
      })
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
          if(item.action && typeof(item.action) === 'function') {
            //先处理有自定义action的 zhangxt
            item.action()
          } else if (
            item.title ===
            getLanguage(this.props.language).Map_Settings.LEGEND_SETTING
          ) {
            //图例单独处理
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
        {/*<MapSettingItem*/}
        {/*title={getLanguage(global.language).Map_Setting.COLUMN_NAV_BAR}*/}
        {/*type={'switch'}*/}
        {/*rightAction={value => {*/}
        {/*this.props.setColumnNavBar(value)*/}
        {/*}}*/}
        {/*value={this.props.mapColumnNavBar}*/}
        {/*leftImage={getThemeAssets().setting.icon_horizontal_screen}*/}
        {/*/>*/}
        {/*{this._renderItemSeparatorComponent()}*/}
        {CoworkInfo.coworkId !== '' && (
          <MapSettingItem
            type={'switch'}
            title={getLanguage(global.language).Map_Setting.REAL_TIME_SYNC}
            rightAction={value => {
              // CoworkInfo.setIsRealTime(value)
              this.props.setIsRealTime({
                groupId: this.props.currentTask.groupID,
                taskId: this.props.currentTask.id,
                isRealTime: value,
              })
              // 显示轨迹和位置
              this.props.setMemberShow({
                groupId: this.props.currentTask.groupID,
                taskId: this.props.currentTask.id,
                memberId: this.props.user.currentUser.userName,
                show: value,
              })
              // this.setState({ isRealTime: value })
            }}
            // value={this.state.isRealTime}
            value={
              this.props.currentTaskInfo?.isRealTime === undefined ? false : this.props.currentTaskInfo.isRealTime
            }
            leftImage={getThemeAssets().setting.icon_horizontal_screen}
          />
        )}
        {CoworkInfo.coworkId !== '' && this._renderItemSeparatorComponent()}
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
          // title: this.props.mapModules.modules?.[this.props.user.currentUser.userName]?.[
          //   this.props.mapModules.currentMapModule
          // ]?.chunk?.title,
          title: '设置',
          navigation: this.props.navigation,
          headerTitleViewStyle: {
            justifyContent: 'flex-start',
            marginLeft: scaleSize(90),
          },
          withoutBack: true,
        }}
        onOverlayPress={() => {
          // this.props.navigation.navigate('MapView')
          this.props.navigation.goBack()
        }}
        bottomBar={this.renderToolBar()}
      >
        {this.renderSelection()}
      </Container>
    )
  }
}
