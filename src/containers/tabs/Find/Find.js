/*
  Copyright © SuperMap. All rights reserved.
  Author: lu cheng dong
  E-mail: 756355668@qq.com
*/
import React, { Component } from 'react'
import {
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  AsyncStorage,
} from 'react-native'
import { Container } from '../../../components'
import { UserType } from '../../../constants'
import NavigationService from '../../NavigationService'
import { color } from '../../../styles'
import Toast from '../../../utils/Toast'
import { scaleSize, OnlineServicesUtils } from '../../../utils'
import { getLanguage } from '../../../language/index'
import { getPublicAssets, getThemeAssets } from '../../../assets'
import TabBar from '../TabBar'
import FindItem from './FindItem'

var SUPERMAPKNOWN_UPDATE_TIME = 'SUPERMAPKNOWN_UPDATE_TIME'
var SUPERMAPGROUP_UPDATE_TIME = 'SUPERMAPGROUP_UPDATE_TIME'
// var APPLET_UPDATE_TIME = 'APPLET_UPDATE_TIME'

var superMapKnownTime
var superMapGroupTime
let JSOnlineService = null

export default class Find extends Component {
  props: {
    language: string,
    navigation: Object,
    user: Object,
    find: Object,
    laboratory: Object,
  }

  constructor(props) {
    super(props)
    this.state = {
      display: 'flex',
      superMapKnown: false,
      superMapGroup: false,
      appletInfo: false,
    }
    JSOnlineService = new OnlineServicesUtils('online')
  }

  componentDidMount() {
    this._getSuperMapGroupData()
    this._getSuperMapKnownData()
  }

  _getSuperMapGroupData = async () => {
    try {
      let data = await JSOnlineService.getPublicDataByName(
        '927528',
        'SuperMapGroup.geojson',
      )
      if (data) {
        let localUpdataTime = await AsyncStorage.getItem(
          SUPERMAPGROUP_UPDATE_TIME,
        )
        if (
          localUpdataTime == null ||
          localUpdataTime !== data.lastModfiedTime + ''
        ) {
          superMapGroupTime = data.lastModfiedTime + ''
          this.setState({ superMapGroup: true })
        }
      }
    } catch (error) {
      // console.log(error)
    }
  }

  _getSuperMapKnownData = async () => {
    try {
      let data = await JSOnlineService.getPublicDataByName(
        '927528',
        'zhidao.geojson',
      )
      if (data) {
        let localUpdataTime = await AsyncStorage.getItem(
          SUPERMAPKNOWN_UPDATE_TIME,
        )
        if (
          localUpdataTime == null ||
          localUpdataTime !== data.lastModfiedTime + ''
        ) {
          superMapKnownTime = data.lastModfiedTime + ''
          this.setState({ superMapKnown: true })
        }
      }
    } catch (error) {
      // console.log(error)
    }
  }

  /**
   * 获取小程序数据，判断是否有新的小程序
   **/
  // _getAppletData = async () => {
  //   let data = []
  //   let searchParams = {
  //     currentPage: this.currentPage,
  //     keywords: (Platform.OS === 'ios' ? 'ios.' : 'android.') + 'bundle',
  //   }
  //   if (!UserType.isIPortalUser(this.props.user.currentUser)) {
  //     if (!this.JSOnlineService) {
  //       this.JSOnlineService = new OnlineServicesUtils('online')
  //     }
  //     data = await this.JSOnlineService.getPublicDataByTypes(
  //       this.dataTypes,
  //       searchParams,
  //     )
  //   } else {
  //     if (!this.JSIPortalService) {
  //       this.JSIPortalService = new OnlineServicesUtils('iportal')
  //     }
  //     data = await this.JSIPortalService.getPublicDataByTypes(
  //       this.dataTypes,
  //       searchParams,
  //     )
  //   }
  //   let localUpdateTimes =
  //     (await AsyncStorage.getItem(APPLET_UPDATE_TIME)) || []
  //   let isNew = false
  //   if (data.total) {
  //     let applets = data.content
  //     for (let i = 0; i < data.total; i++) {
  //       let isExist = false
  //       for (let j = 0; j < localUpdateTimes.length; j++) {
  //         if (localUpdateTimes[j].fileName === applets[i].fileName) {
  //           if (
  //             localUpdateTimes[j].lastModfiedTime < applets[i].lastModfiedTime
  //           )
  //             isNew = true
  //           isExist = true
  //         }
  //       }
  //       applets[i].lastModfiedTime
  //     }
  //   }
  //   if (isNew !== this.state.appletInfo) {
  //     this.setState({
  //       appletInfo: isNew,
  //     })
  //   }
  //   await AsyncStorage.setItem(APPLET_UPDATE_TIME, visibleValue)
  // }

  goToSuperMapForum = () => {
    NavigationService.navigate('Protocol', { type: 'superMapForum' })
  }

  goToSuperMap = () => {
    NavigationService.navigate('Protocol', { type: 'supermap' })
  }

  goToGISAcademy = () => {
    NavigationService.navigate('Protocol', { type: 'GISAcademy' })
  }

  _renderItem = (
    itemRequire = {
      title: '',
      subTitle: '',
      leftImagePath: '',
      rightImagePath: '',
      isInformSpot: false,
      onClick: () => {
        Toast.show('test')
      },
    },
  ) => {
    const {
      title,
      subTitle,
      leftImagePath,
      rightImagePath,
      isInformSpot,
      onClick,
    } = itemRequire
    return (
      <FindItem
        title={title}
        subTitle={subTitle}
        leftImagePath={leftImagePath}
        isInformSpot={isInformSpot}
        onClick={onClick}
        rightImagePath={rightImagePath}
      />
    )
  }

  _selectionRender = () => {
    return (
      <View opacity={1} style={{ flex: 1, backgroundColor: color.bgW }}>
        <ScrollView
          style={{ flex: 1 }}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          overScrollMode={'always'}
          bounces={true}
        >
          {this.props.find.showPublicMap &&
            this._renderItem({
              title: getLanguage(this.props.language).Prompt.PUBLIC_MAP,
              subTitle: getLanguage(this.props.language).Find.PUBLIC_MAP_INFO,
              leftImagePath: getThemeAssets().find.public_map,
              isInformSpot: false,
              onClick: () => {
                NavigationService.navigate('PublicMap')
              },
            })}
          {this.props.find.showPublicData &&
            this._renderItem({
              title: getLanguage(this.props.language).Find.PUBLIC_DATA,
              subTitle: getLanguage(this.props.language).Find.PUBLIC_DATA_INFO,
              leftImagePath: getThemeAssets().find.public_data,
              isInformSpot: false,
              onClick: () => {
                NavigationService.navigate('PublicData')
              },
            })}
          {/* {this._renderItem({
            title: Const.FRIENDMAP,
            leftImagePath: require('../../../assets/Find/find_publicmap.png'),
            onClick: () => {
              NavigationService.navigate('FriendMap')
            },
          })} */}
          {this.props.find.showSuperMapGroup &&
            this._renderItem({
              title: getLanguage(this.props.language).Prompt.SUPERMAP_GROUP,
              subTitle: getLanguage(this.props.language).Find.SUPERMAP_INFO,
              leftImagePath: getThemeAssets().find.supermap,
              isInformSpot: this.state.superMapGroup,
              onClick: () => {
                NavigationService.navigate('SuperMapKnown', {
                  type: 'SuperMapGroup',
                  callback: this.state.superMapGroup
                    ? () => {
                      this.setState({ superMapGroup: false })
                      AsyncStorage.setItem(
                        SUPERMAPGROUP_UPDATE_TIME,
                        superMapGroupTime,
                      )
                    }
                    : null,
                })
              },
            })}
          {this.props.find.showSuperMapKnow &&
            this._renderItem({
              title: getLanguage(this.props.language).Prompt.SUPERMAP_KNOW,
              subTitle: getLanguage(this.props.language).Find
                .SUPERMAP_KNOW_INFO,
              leftImagePath: getThemeAssets().find.supermapkonw,
              isInformSpot: this.state.superMapKnown,
              onClick: () => {
                NavigationService.navigate('SuperMapKnown', {
                  type: 'SuperMapKnow',
                  callback: this.state.superMapKnown
                    ? () => {
                      this.setState({ superMapKnown: false })
                      AsyncStorage.setItem(
                        SUPERMAPKNOWN_UPDATE_TIME,
                        superMapKnownTime,
                      )
                    }
                    : null,
                })
              },
            })}
          {this.props.find.showSuperMapForum &&
            this._renderItem({
              title: getLanguage(this.props.language).Prompt.SUPERMAP_FORUM,
              subTitle: getLanguage(this.props.language).Find
                .SUPERMAP_FORUM_INFO,
              leftImagePath: getThemeAssets().find.forum,
              isInformSpot: false,
              onClick: this.goToSuperMapForum,
            })}
          {this.props.find.showGisAcademy &&
            this._renderItem({
              title: getLanguage(this.props.language).Find.GIS_ACADEMY,
              subTitle: getLanguage(this.props.language).Find.GIS_ACADEMY_INFO,
              leftImagePath: getThemeAssets().find.college,
              isInformSpot: false,
              onClick: this.goToGISAcademy,
            })}
          {/*{this._renderItem({*/}
          {/*title: getLanguage(this.props.language).Find.APPLET,*/}
          {/*subTitle: getLanguage(this.props.language).Find.APPLET,*/}
          {/*// subTitle: getLanguage(this.props.language).Find.ONLINE_COWORK_INFO,*/}
          {/*leftImagePath: getThemeAssets().mine.my_applets,*/}
          {/*isInformSpot: this.state.appletInfo,*/}
          {/*onClick: () => {*/}
          {/*NavigationService.navigate('Applet', { type: 'APPLET' })*/}
          {/*},*/}
          {/*})}*/}
          {this.props.find.showCowork &&
            this._renderItem({
              title: getLanguage(this.props.language).Find.ONLINE_COWORK,
              subTitle: getLanguage(this.props.language).Find
                .ONLINE_COWORK_INFO,
              leftImagePath: getThemeAssets().find.onlineCowork,
              isInformSpot: false,
              onClick: () => {
                if (UserType.isOnlineUser(this.props.user.currentUser)) {
                  NavigationService.navigate('GroupSelectPage', {
                    showType: 'group',
                  })
                } else {
                  NavigationService.navigate('Login', {
                    show: ['Online'],
                  })
                }
              },
            })}
          {this.props.find.showLab &&
            this._renderItem({
              title: getLanguage(this.props.language).Find.LABORATORY,
              subTitle: getLanguage(this.props.language).Find.LABORATORY_INFO,
              leftImagePath: getThemeAssets().find.laboratory,
              isInformSpot: false,
              onClick: () => {
                NavigationService.navigate('Laboratory')
              },
            })}
        </ScrollView>
      </View>
    )
  }

  renderTabBar = () => {
    return <TabBar navigation={this.props.navigation} />
  }

  renderHeaderRight = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <TouchableOpacity
          onPress={() => {
            NavigationService.navigate('FindSettingPage')
          }}
        >
          <Image
            resizeMode={'contain'}
            source={getPublicAssets().common.icon_nav_imove}
            style={{
              height: scaleSize(40),
              width: scaleSize(40),
              marginRight: scaleSize(10),
            }}
          />
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    return (
      <Container
        ref={ref => (this.container = ref)}
        hideInBackground={false}
        showFullInMap={true}
        headerProps={{
          title: getLanguage(this.props.language).Navigator_Label.EXPLORE,
          withoutBack: true,
          headerRight: this.renderHeaderRight(),
          navigation: this.props.navigation,
          headerStyle: { borderBottomWidth: 0 },
        }}
        bottomBar={this.renderTabBar()}
      >
        {this._selectionRender()}
      </Container>
    )
  }
}
