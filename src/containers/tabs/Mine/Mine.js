/*
  Copyright © SuperMap. All rights reserved.
  Author: lu cheng dong
  E-mail: 756355668@qq.com
*/
import React, { Component } from 'react'
import { View, Text, TouchableOpacity, Image, ScrollView, Platform } from 'react-native'
import { Container } from '../../../components'
import { FileTools } from '../../../native'
import NavigationService from '../../NavigationService'
import ConstPath from '../../../constants/ConstPath'
import { SOnlineService } from 'imobile_for_reactnative'
import { UserType } from '../../../constants'
import { screen, scaleSize } from '../../../utils'
import { getLanguage } from '../../../language/index'
import { getThemeAssets } from '../../../assets'
import { MineHeader } from './component'
import styles from './styles'
import TabBar from '../TabBar'

export default class Mine extends Component {
  props: {
    language: string,
    navigation: Object,
    user: Object,
    workspace: Object,
    device: Object,
    mineModules: Array,
    closeWorkspace: () => {},
    openWorkspace: () => {},
  }

  constructor(props) {
    super(props)
    this.state = {
      display: 'flex',
    }
    this.searchText = ''
  }

  componentDidUpdate(previousProps) {
    if (
      this.props.user.currentUser.userType !== UserType.PROBATION_USER &&
      this.props.user.currentUser.userName !== undefined &&
      this.props.user.currentUser.userName !== '' &&
      this.props.user.currentUser.userName !==
        previousProps.user.currentUser.userName
    ) {
      this.openUserWorkspace()
      SOnlineService.syncAndroidCookie()
    }
  }

  openUserWorkspace = async () => {
    let userPath = await FileTools.appendingHomeDirectory(
      ConstPath.UserPath +
        this.props.user.currentUser.userName +
        '/' +
        ConstPath.RelativeFilePath.Workspace[
          global.language === 'CN' ? 'CN' : 'EN'
        ],
    )
    // 防止多次打开同一个工作空间
    if (!this.props.workspace || this.props.workspace.server === userPath)
      return
    this.props.closeWorkspace(() => {
      this.props.openWorkspace({
        server: userPath,
      })
    })
  }

  goToMyLocalData = () => {
    let userName =
      this.props.user.currentUser.userType === UserType.PROBATION_USER
        ? 'Customer'
        : this.props.user.currentUser.userName
    NavigationService.navigate('MyLocalData', {
      userName: userName,
    })
  }

  goToMyMap = title => {
    NavigationService.navigate('MyMap', {
      title,
    })
  }

  goToMyARMap = title => {
    NavigationService.navigate('MyARMap', {
      title,
      showMore: true,
    })
  }

  goToMyARModel = title => {
    NavigationService.navigate('MyARModel', {
      title,
      showMore: true,
    })
  }

  goToMyAREffect = title => {
    NavigationService.navigate('MyAREffect', {
      title,
      showMore: true,
    })
  }

  goToMyDatasource = title => {
    NavigationService.navigate('MyDatasource', {
      title,
    })
  }

  goToMyScene = title => {
    NavigationService.navigate('MyScene', {
      title,
    })
  }

  goToMyTemplate = title => {
    NavigationService.navigate('MyTemplate', {
      title,
    })
  }

  goToMySymbol = title => {
    NavigationService.navigate('MySymbol', {
      title,
    })
  }

  goToMyBaseMap = () => {
    NavigationService.navigate('MyBaseMap', {})
  }

  goToMyLabel = title => {
    NavigationService.navigate('MyLabel', {
      title,
    })
  }

  goToMyService = () => {
    NavigationService.navigate('MyService')
  }

  _getItems = () => {
    let data = []
    for (let module of this.props.mineModules) {
      if (Platform.OS === 'ios' && module.key === 'ARMODEL') {
        continue
      }
      switch (module.key) {
        case 'IMPORT':
          data.push({
            title: getLanguage(this.props.language).Profile.IMPORT,
            image: getThemeAssets().mine.my_import,
            onClick: this.goToMyLocalData,
          })
          break
        case 'MY_SERVICE':
          data.push({
            title: getLanguage(this.props.language).Profile.MY_SERVICE,
            image: getThemeAssets().mine.my_service,
            onClick: this.goToMyService,
          })
          break
        case 'DATA':
          data.push({
            title: getLanguage(this.props.language).Profile.DATA,
            image: getThemeAssets().mine.my_data,
            onClick: () =>
              this.goToMyDatasource(
                getLanguage(this.props.language).Profile.DATA,
              ),
          })
          break
        case 'MARK':
          data.push({
            title: getLanguage(this.props.language).Profile.MARK,
            image: getThemeAssets().mine.my_plot,
            onClick: () => {
              this.goToMyLabel(getLanguage(this.props.language).Profile.MARK)
            },
          })
          break
        case 'MAP':
          data.push({
            title: getLanguage(this.props.language).Profile.MAP,
            image: getThemeAssets().mine.my_map,
            onClick: () =>
              this.goToMyMap(getLanguage(this.props.language).Profile.MAP),
          })
          break
        case 'ARMAP':
          data.push({
            title: getLanguage(this.props.language).Profile.ARMAP,
            image: getThemeAssets().mine.my_armap,
            onClick: () =>
              this.goToMyARMap(getLanguage(this.props.language).Profile.ARMAP),
          })
          break
        case 'ARMODEL':
          data.push({
            title: getLanguage(this.props.language).Profile.ARMODEL,
            image: getThemeAssets().mine.my_dynamic_model,
            onClick: () =>
              this.goToMyARModel(getLanguage(this.props.language).Profile.ARMODEL),
          })
          break
        case 'AREFFECT':
          data.push({
            title: getLanguage(this.props.language).Profile.AREFFECT,
            image: getThemeAssets().ar.armap.ar_effect,
            onClick: () =>
              this.goToMyAREffect(getLanguage(this.props.language).Profile.AREFFECT),
          })
          break
        case 'SCENE':
          data.push({
            title: getLanguage(this.props.language).Profile.SCENE,
            image: getThemeAssets().mine.my_scene,
            onClick: () =>
              this.goToMyScene(getLanguage(this.props.language).Profile.SCENE),
          })
          break
        case 'BASE_MAP':
          data.push({
            title: getLanguage(this.props.language).Profile.BASEMAP,
            image: getThemeAssets().mine.my_basemap,
            onClick: this.goToMyBaseMap,
          })
          break
        case 'SYMBOL':
          data.push({
            title: getLanguage(this.props.language).Profile.SYMBOL,
            image: getThemeAssets().mine.my_symbol,
            onClick: () =>
              this.goToMySymbol(
                getLanguage(this.props.language).Profile.SYMBOL,
              ),
          })
          break
        case 'TEMPLATE':
          data.push({
            title: getLanguage(this.props.language).Profile.TEMPLATE,
            image: getThemeAssets().mine.icon_my_template,
            onClick: () =>
              this.goToMyTemplate(
                getLanguage(this.props.language).Profile.TEMPLATE,
              ),
          })
          break
        case 'MyColor':
          data.push({
            title: getLanguage(this.props.language).Profile.COLOR_SCHEME,
            image: getThemeAssets().mine.my_color,
            onClick: () =>
              NavigationService.navigate('MyColor', {
                title: getLanguage(this.props.language).Profile.COLOR_SCHEME,
              }),
          })
          break
        case 'MyApplet':
          data.push({
            title: getLanguage(this.props.language).Find.APPLET,
            image: getThemeAssets().mine.my_applets,
            onClick: () => NavigationService.navigate('AppletManagement'),
          })
          break
        case 'AIModel':
          data.push({
            title: getLanguage(this.props.language).Profile.AIMODEL,
            image: getThemeAssets().mine.my_ai,
            onClick: () =>
              NavigationService.navigate('MyAIModel', {
                title: getLanguage(this.props.language).Profile.AIMODEL,
              }),
          })
          break
      }
    }
    return data
  }

  _renderProfile = () => {
    return (
      <MineHeader
        language={this.props.language}
        user={this.props.user}
        device={this.props.device}
      />
    )
  }

  _renderDatas = () => {
    return (
      <View style={styles.datasContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={
            this.props.device.orientation.indexOf('LANDSCAPE') === 0
              ? styles.scrollContentStyleL
              : styles.scrollContentStyleP
          }
        >
          {this._renderItems()}
        </ScrollView>
      </View>
    )
  }

  _renderItems = () => {
    let colNum =
      this.props.device.orientation.indexOf('LANDSCAPE') === 0 ? 8 : 4
    let items = this._getItems()
    let renderItems = []
    let key = 0
    for (let i = 0; i < items.length; i++) {
      let show = this._itemFilter(items[i])
      if (show) {
        renderItems.push(this.renderItem(items[i], colNum, key++))
      }
    }
    return renderItems
  }

  renderItem = (item, colNum, key) => {
    return (
      <TouchableOpacity
        key={key}
        onPress={item.onClick}
        style={[
          styles.itemView,
          {
            width: this.width / colNum,
          },
        ]}
      >
        <Image style={styles.itemImg} source={item.image} />
        <Text style={styles.itemText}>{item.title}</Text>
      </TouchableOpacity>
    )
  }

  _itemFilter = item => {
    if (UserType.isProbationUser(this.props.user.currentUser)) {
      if (item.title === getLanguage(this.props.language).Profile.MY_SERVICE) {
        return false
      }
    } else if (UserType.isOnlineUser(this.props.user.currentUser)) {
      //
    } else if (UserType.isIPortalUser(this.props.user.currentUser)) {
      //
    } else {
      return false
    }

    return true
  }

  renderTabBar = () => {
    return <TabBar navigation={this.props.navigation} />
  }

  render() {
    this.width = screen.getScreenWidth(this.props.device.orientation)
    if (this.props.device.orientation.indexOf('LANDSCAPE') === 0) {
      this.width = this.width - scaleSize(96) - scaleSize(160)
    }
    return (
      <Container
        ref={ref => (this.container = ref)}
        navigation={this.props.navigation}
        hideInBackground={false}
        showFullInMap={true}
        withoutHeader={true}
        bottomBar={this.renderTabBar()}
      >
        <View style={styles.mineContainer}>
          {this._renderProfile()}
          {this._renderDatas()}
        </View>
      </Container>
    )
  }
}
