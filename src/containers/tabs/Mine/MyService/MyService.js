/*
  Copyright © SuperMap. All rights reserved.
  Author: lu cheng dong
  E-mail: 756355668@qq.com
*/
import React, { Component } from 'react'
import {
  View,
  Text,
  RefreshControl,
  ActivityIndicator,
  SectionList,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native'
import { Container, PopMenu } from '../../../../components'
import { getThemeAssets } from '../../../../assets'
import RenderServiceItem from './RenderServiceItem'
import { SOnlineService, SIPortalService } from 'imobile_for_reactnative'
import styles from './Styles'
import { color, size } from '../../../../styles'
import Toast from '../../../../utils/Toast'
import { scaleSize, OnlineServicesUtils,  GetUserBaseMapUtil} from '../../../../utils'
import { getLanguage } from '../../../../language/index'
import { ConstOnline, UserType } from '../../../../constants'
import NavigationService from '../../../NavigationService'

/**
 * 变量命名规则：私有为_XXX, 若变量为一个对象，则命名为 objXXX,若为一个数组，则命名为 arrXXX,...
 * */

let _arrPrivateServiceList = []
let _arrPublishServiceList = []
/** 当前页加载多少条服务数据*/
let _iServicePageSize = 9
let _loadCount = 1

var JSIPortalService
var JSOnlineService
export default class MyService extends Component {
  props: {
    navigation: Object,
    user: Object,
    device: Object,
    setUser: () => {},
    setBaseMap: () => {},
  }
  constructor(props) {
    super(props)
    this.screenWidth = Dimensions.get('window').width
    ;(this.publishServiceTitle = getLanguage(
      GLOBAL.language,
    ).Profile.PUBLIC_SERVICE),
    (this.privateServiceTitle = getLanguage(
      GLOBAL.language,
    ).Profile.PRIVATE_SERVICE),
    (this.state = {
      arrPrivateServiceList: _arrPrivateServiceList,
      arrPublishServiceList: _arrPublishServiceList,
      bPrivateServiceShow: true,
      bPublishServiceShow: true,
      selections: [
        { title: this.privateServiceTitle, data: _arrPrivateServiceList },
        { title: this.publishServiceTitle, data: _arrPublishServiceList },
      ],
      isRefreshing: false,
      progressWidth: this.screenWidth * 0.6,
    })
    JSIPortalService = new OnlineServicesUtils('iportal')
    JSOnlineService = new OnlineServicesUtils('online')

    this.serviceListTotal = -1
    this._renderItem = this._renderItem.bind(this)
    this._renderSectionHeader = this._renderSectionHeader.bind(this)
  }

  componentDidMount() {
    this._initFirstSectionData()
  }

  componentWillUnmount() { 
    this._clearInterval()
  }

  /**
   * @author lyx
   * 加载当前用户的底图
   */
   async loadUserBaseMaps(){
    let arrPublishServiceList = await GetUserBaseMapUtil.loadUserBaseMaps(this.props.user.currentUser)
    // debugger
    // GetUserBaseMapUtil.setCurUserBaseMapsTool()
    // let arrPublishServiceList = _arrPublishServiceList
    // 当公有服务列表数组有元素时，就遍历这个数组
    if (arrPublishServiceList.length > 0) {
      for (let i = 0, n = arrPublishServiceList.length; i < n; i++) {
        // 当公有服务列表的元素的地图名字和地图信息数组，以及地图信息数组的地图服务地址都存在时，更新当前用户的底图
        if (arrPublishServiceList[i].restTitle && arrPublishServiceList[i].mapInfos[0] && arrPublishServiceList[i].mapInfos[0].mapUrl){
          let list = await GetUserBaseMapUtil.addServer(arrPublishServiceList[i].restTitle, arrPublishServiceList[i].mapInfos[0].mapUrl)
          // 将更改完成后的当前用户的底图数组，进行持久化存储，此处会触发页面刷新（是其他地方能够拿到用户底图的关键）
          this.props.setBaseMap &&
            this.props.setBaseMap({
              userId: currentUser.userId,
              baseMaps: list,
            })
        }
      }
    } else if(arrPublishServiceList.length === 0) {
      let list = GetUserBaseMapUtil.getCommonBaseMap()
      this.props.setBaseMap &&
      this.props.setBaseMap({
        userId: currentUser.userId,
        baseMaps: list,
      })
    }
  }

  _clearInterval = () => {
    if (this.objProgressWidth !== undefined) {
      clearInterval(this.objProgressWidth)
      this.setState({ progressWidth: this.screenWidth })
    }
  }
  _initFirstSectionData = async () => {
    try {
      this._showLoadProgressView()
      await this._initSectionsData(1, _iServicePageSize)
    } finally {
      this._clearInterval()
    }
  }
  _showLoadProgressView = () => {
    this.objProgressWidth = setInterval(() => {
      let prevProgressWidth = this.state.progressWidth
      let currentPorWidth
      if (prevProgressWidth >= this.screenWidth - 200) {
        currentPorWidth = prevProgressWidth + 1
        if (currentPorWidth >= this.screenWidth - 50) {
          currentPorWidth = this.screenWidth - 50
          return
        }
      } else {
        currentPorWidth = prevProgressWidth * 1.01
      }
      this.setState({ progressWidth: currentPorWidth })
    }, 100)
  }
  _initSectionsData = async (currentPage, pageSize) => {
    try {
      let arrPublishServiceList = []
      let arrPrivateServiceList = []
      let strServiceList
      if (UserType.isOnlineUser(this.props.user.currentUser)) {
        strServiceList = await SOnlineService.getServiceList(1, pageSize)
      } else if (UserType.isIPortalUser(this.props.user.currentUser)) {
        strServiceList = await SIPortalService.getMyServices(1, pageSize)
      }
      if (typeof strServiceList === 'string') {
        let objServiceList = JSON.parse(strServiceList)
        this.serviceListTotal = objServiceList.total

        /** 构造SectionsData数据*/
        for (let page = 1; page <= currentPage; page++) {
          if (page > 1) {
            if (UserType.isOnlineUser(this.props.user.currentUser)) {
              strServiceList = await SOnlineService.getServiceList(
                page,
                pageSize,
              )
            } else if (UserType.isIPortalUser(this.props.user.currentUser)) {
              strServiceList = await SIPortalService.getMyServices(
                page,
                pageSize,
              )
            }
            objServiceList = JSON.parse(strServiceList)
          }

          let objArrServiceContent = objServiceList.content
          for (let objContent of objArrServiceContent) {
            let arrScenes = objContent.scenes
            let arrMapInfos = objContent.mapInfos
            let strThumbnail = objContent.thumbnail
            let strRestTitle = objContent.resTitle
            let strID = objContent.id
            let bIsPublish = false
            let objArrAuthorizeSetting = objContent.authorizeSetting
            let authorizeSetting = objContent.authorizeSetting
            for (let strPermission of objArrAuthorizeSetting) {
              let strPermissionType = strPermission.permissionType
              if (strPermissionType === 'READ') {
                bIsPublish = true
                break
              }
            }
            let strSectionsData =
              '{"restTitle":"' +
              strRestTitle +
              '","thumbnail":"' +
              strThumbnail +
              '","id":"' +
              strID +
              '","scenes":' +
              JSON.stringify(arrScenes) +
              ',"mapInfos":' +
              JSON.stringify(arrMapInfos) +
              ',"isPublish":' +
              bIsPublish +
              ',"authorizeSetting":' +
              JSON.stringify(authorizeSetting) +
              '}'
            let objSectionsData = JSON.parse(strSectionsData)
            if (bIsPublish) {
              arrPublishServiceList.push(objSectionsData)
            } else {
              arrPrivateServiceList.push(objSectionsData)
            }
          }
        }
        /** 重新赋值，避免浅拷贝*/
        _arrPrivateServiceList = arrPrivateServiceList
        _arrPublishServiceList = arrPublishServiceList
      }
      if (_arrPrivateServiceList.length === 0) {
        _arrPrivateServiceList.push({})
      }
      if (_arrPublishServiceList.length === 0) {
        _arrPublishServiceList.push({})
      }
      this.setState({
        arrPrivateServiceList: _arrPrivateServiceList,
        arrPublishServiceList: _arrPublishServiceList,
      })
    } catch (e) {
      Toast.show('登录失效，请重新登录')
      this.setState({ isRefreshing: false })
    }
  }

  _publishService = async () => {
    this._onCloseModal()
    let isPublish = !this.onClickItemIsPublish
    let result
    if (UserType.isOnlineUser(this.props.user.currentUser)) {
      result = await SOnlineService.changeServiceVisibilityWithServiceId(
        this.onClickItemId,
        isPublish,
      )
    } else if (UserType.isIPortalUser(this.props.user.currentUser)) {
      result = await JSIPortalService.setServicesShareConfig(
        this.onClickItemId,
        isPublish,
      )
    }

    let loadText = getLanguage(this.props.language).Prompt.LOADING
    this.container.setLoading(
      true,
      loadText,
    )

    if (typeof result === 'boolean' && result) {
      // Toast.show(getLanguage(GLOBAL.language).Prompt.SETTING_SUCCESS)
      this._onModalRefresh2(
        null,
        this.onClickItemIsPublish,
        false,
        this.onClickItemIndex,
      )
    } else {
      //关闭加载动画
      this.container.setLoading(false)
      Toast.show(getLanguage(GLOBAL.language).Prompt.SETTING_FAILED)
    }
  }

  _deleteService = async () => {
    try {
      this._onCloseModal()
      GLOBAL.Loading.setLoading(
        true,
        getLanguage(GLOBAL.language).Prompt.DELETING_SERVICE,
      )

      let deletPromise
      let requestPromise
      if (UserType.isOnlineUser(this.props.user.currentUser)) {
        deletPromise = SOnlineService.deleteServiceWithServiceId(
          this.onClickItemId,
        )
        await new Promise(resolve => {
          setTimeout(() => resolve(true), 2000)
        })
        requestPromise = JSOnlineService.getService(this.onClickItemId)
      } else if (UserType.isIPortalUser(this.props.user.currentUser)) {
        deletPromise = SIPortalService.deleteMyService(this.onClickItemId)
        await new Promise(resolve => {
          setTimeout(() => resolve(true), 2000)
        })
        requestPromise = JSIPortalService.getService(this.onClickItemId)
      }
      let result = await requestPromise
      if (result === false) {
        result = true
      } else {
        result = await deletPromise
      }

      if (typeof result === 'boolean' && result) {
        this.deleteService = true
        this._onModalRefresh2(
          null,
          this.onClickItemIsPublish,
          true,
          this.onClickItemIndex,
        )
        Toast.show(getLanguage(GLOBAL.language).Prompt.DELETED_SUCCESS)
        //'删除成功')
      } else if (typeof result === 'boolean' && !result) {
        this.deleteService = true
        this._onModalRefresh2(
          null,
          this.onClickItemIsPublish,
          true,
          this.onClickItemIndex,
        )
        Toast.show(getLanguage(GLOBAL.language).Prompt.DELETED_SUCCESS)
        //'删除成功')
      } else {
        Toast.show(getLanguage(GLOBAL.language).Prompt.FAILED_TO_DELETE)
        //'删除失败')
      }
      GLOBAL.Loading.setLoading(false)
    } catch (error) {
      GLOBAL.Loading.setLoading(false)
      Toast.show(getLanguage(GLOBAL.language).Prompt.FAILED_TO_DELETE)
      //'删除失败')
    }
  }

  _isShowRenderItem = (isShow: boolean, title: string) => {
    if (title === this.publishServiceTitle) {
      this.setState({ bPublishServiceShow: !isShow })
    } else if (title === this.privateServiceTitle) {
      this.setState({ bPrivateServiceShow: !isShow })
    }
  }

  _renderSectionHeader(section) {
    let title = section.section.title
    let imageSource = section.section.isShowItem
      ? getThemeAssets().publicAssets.icon_drop_down
      : getThemeAssets().publicAssets.icon_drop_up
    if (title !== undefined) {
      let height = scaleSize(80)
      let fontSize = size.fontSize.fontSizeXl
      return (
        <TouchableOpacity
          style={{
            backgroundColor: color.bgW2,
            // justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: height,
            flexDirection: 'row',
          }}
          onPress={() => {
            this._isShowRenderItem(section.section.isShowItem, title)
          }}
        >
          <Image
            source={imageSource}
            style={{
              tintColor: color.imageColorWhite,
              marginLeft: 10,
              width: scaleSize(52),
              height: scaleSize(52),
            }}
          />
          <Text
            style={{
              color: color.fontColorBlack,
              fontSize: fontSize,
              fontWeight: 'bold',
              paddingLeft: 15,
              backgroundColor: 'transparent',
            }}
          >
            {title}
          </Text>
        </TouchableOpacity>
      )
    }
    return <View />
  }
  _renderItem(info) {
    let restTitle = info.item.restTitle
    let display = info.section.isShowItem ? 'flex' : 'none'
    if (restTitle !== undefined) {
      let index = info.index
      let imageUri = info.item.thumbnail
      let isPublish = info.item.isPublish
      let itemId = info.item.id
      let scenes = info.item.scenes
      let mapInfos = info.item.mapInfos
      return (
        <RenderServiceItem
          data={info.item}
          display={display}
          onItemPress={this._onItemPress}
          imageUrl={imageUri}
          restTitle={restTitle}
          isPublish={isPublish}
          itemId={itemId}
          index={index}
          scenes={scenes}
          mapInfos={mapInfos}
        />
      )
    }
    return (
      <View display={display}>
        <Text
          style={[
            styles.titleTextStyle,
            { backgroundColor: color.content_white, textAlign: 'center' },
          ]}
        >
          {getLanguage(GLOBAL.language).Profile.NO_SERVICE}
          {/* 没有服务 */}
        </Text>
      </View>
    )
  }

  _keyExtractor = (item, index) => {
    if (item.id === undefined) {
      return index * index
    }
    return item.id
  }

  _onItemPress = (isPublish, itemId, restTitle, index, event, data) => {
    this.onClickItemId = itemId
    this.onClickItemRestTitle = restTitle
    this.onClickItemIsPublish = isPublish
    this.onClickItemIndex = index
    this.popMenu.setVisible(true, {
      x: event.nativeEvent.pageX,
      y: event.nativeEvent.pageY,
    })
    this.currentData = data
  }

  _onCloseModal = () => {
    this.popMenu.setVisible(false)
  }

  _shareToGroup = () => {
    NavigationService.navigate('ServiceShareSettings', {
      data: this.currentData,
      cb: this._onRefresh,
    })
  }

  _getPopMenuData = () => {
    let data = [
      {
        title: this.onClickItemIsPublish
          ? getLanguage(GLOBAL.language).Profile.SET_AS_PRIVATE_SERVICE
          : getLanguage(GLOBAL.language).Profile.SET_AS_PUBLIC_SERVICE,
        action: this._publishService,
      },
      {
        title: getLanguage(GLOBAL.language).Cowork.SERVICE_SHARING_SETTINGS,
        action: this._shareToGroup,
      },
      {
        title: getLanguage(GLOBAL.language).Profile.DELETE,
        action: this._deleteService,
      },
    ]
    return data
  }

  _renderPopMenu = () => {
    return (
      <PopMenu
        ref={ref => (this.popMenu = ref)}
        getData={this._getPopMenuData}
        device={this.props.device}
        hasCancel={false}
      />
    )
  }

  _onModalRefresh2 = async (itemId, isPublish, isDelete, index) => {
    if (index !== undefined) {
      if (isPublish) {
        if (isDelete) {
          _arrPublishServiceList.splice(index, 1)
          let total = this.serviceListTotal - 1
          this.serviceListTotal = total
        } else {
          let objPublishList = _arrPublishServiceList[index]
          let strRestTitle = objPublishList.restTitle
          let strThumbnail = objPublishList.thumbnail
          let strID = objPublishList.id
          let arrScenes = objPublishList.scenes
          let arrMapInfos = objPublishList.mapInfos
          let authorizeSetting = objPublishList.authorizeSetting
          let bIsPublish = false
          let strSectionsData =
            '{"restTitle":"' +
            strRestTitle +
            '","thumbnail":"' +
            strThumbnail +
            '","id":"' +
            strID +
            '","scenes":' +
            JSON.stringify(arrScenes) +
            ',"mapInfos":' +
            JSON.stringify(arrMapInfos) +
            ',"isPublish":' +
            bIsPublish +
            ',"authorizeSetting":' +
            JSON.stringify(authorizeSetting) +
            '}'
          let objPrivateList = JSON.parse(strSectionsData)
          if (
            _arrPrivateServiceList.length === 1 &&
            _arrPrivateServiceList[0].id === undefined
          ) {
            _arrPrivateServiceList.splice(0, 1)
          }

          _arrPrivateServiceList.push(objPrivateList)
          _arrPublishServiceList.splice(index, 1)
        }
      } else {
        if (isDelete) {
          _arrPrivateServiceList.splice(index, 1)
          let total = this.serviceListTotal - 1
          this.serviceListTotal = total
        } else {
          let objPrivateList = _arrPrivateServiceList[index]
          let strRestTitle = objPrivateList.restTitle
          let strThumbnail = objPrivateList.thumbnail
          let strID = objPrivateList.id
          let arrScenes = objPrivateList.scenes
          let arrMapInfos = objPrivateList.mapInfos
          let authorizeSetting = objPrivateList.authorizeSetting
          let bIsPublish = true
          let strSectionsData =
            '{"restTitle":"' +
            strRestTitle +
            '","thumbnail":"' +
            strThumbnail +
            '","id":"' +
            strID +
            '","scenes":' +
            JSON.stringify(arrScenes) +
            ',"mapInfos":' +
            JSON.stringify(arrMapInfos) +
            ',"isPublish":' +
            bIsPublish +
            ',"authorizeSetting":' +
            JSON.stringify(authorizeSetting) +
            '}'
          let objPublishList = JSON.parse(strSectionsData)
          if (
            _arrPublishServiceList.length === 1 &&
            _arrPublishServiceList[0].id === undefined
          ) {
            _arrPublishServiceList.splice(0, 1)
          }
          _arrPublishServiceList.push(objPublishList)
          _arrPrivateServiceList.splice(index, 1)
        }
      }
      if (_arrPrivateServiceList.length === 0) {
        _arrPrivateServiceList.push({})
      }
      if (_arrPublishServiceList.length === 0) {
        _arrPublishServiceList.push({})
      }
    }

    this.setState({
      arrPrivateServiceList: _arrPrivateServiceList,
      arrPublishServiceList: _arrPublishServiceList,
    }, async () => {
      await this.loadUserBaseMaps()
      //关闭加载动画
      this.container.setLoading(false)
      Toast.show(getLanguage(GLOBAL.language).Prompt.SETTING_SUCCESS)
    })
  }

  _onRefresh = async () => {
    if (!this.state.isRefreshing) {
      _loadCount = 1
      this.setState({
        isRefreshing: true,
        bPrivateServiceShow: true,
        bPublishServiceShow: true,
      })
      await this._initSectionsData(1, _iServicePageSize)
      this.setState({ isRefreshing: false })
    }
  }
  _loadData = async () => {
    let publishLength = _arrPublishServiceList.length
    if (
      _arrPublishServiceList.length === 1 &&
      _arrPublishServiceList[0].id === undefined
    ) {
      publishLength = 0
    }
    let privateLength = _arrPrivateServiceList.length
    if (
      _arrPrivateServiceList.length === 1 &&
      _arrPrivateServiceList[0].id === undefined
    ) {
      privateLength = 0
    }
    let loadServiceCount = publishLength + privateLength
    if (
      this.serviceListTotal > _loadCount * _iServicePageSize &&
      this.serviceListTotal > loadServiceCount &&
      (this.state.bPublishServiceShow || this.state.bPrivateServiceShow)
    ) {
      _loadCount = ++_loadCount
      await this._initSectionsData(_loadCount, _iServicePageSize)
    }
  }
  _footView = () => {
    let publishLength = _arrPublishServiceList.length
    if (
      _arrPublishServiceList.length === 1 &&
      _arrPublishServiceList[0].id === undefined
    ) {
      publishLength = 0
    }
    let privateLength = _arrPrivateServiceList.length
    if (
      _arrPrivateServiceList.length === 1 &&
      _arrPrivateServiceList[0].id === undefined
    ) {
      privateLength = 0
    }
    let loadServiceCount = publishLength + privateLength
    if (
      this.serviceListTotal > loadServiceCount &&
      this.serviceListTotal > _loadCount * _iServicePageSize &&
      (this.state.bPublishServiceShow || this.state.bPrivateServiceShow) &&
      !this.state.isRefreshing
    ) {
      return (
        <View
          style={{
            flex: 1,
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: color.content_white,
          }}
        >
          <ActivityIndicator
            style={{
              flex: 1,
              height: 30,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            color={'orange'}
            animating={true}
          />
          <Text
            style={{
              flex: 1,
              lineHeight: 20,
              fontSize: 12,
              textAlign: 'center',
              color: color.font_color_white,
            }}
          >
            {getLanguage(GLOBAL.language).Prompt.LOADING}
            {/* //加载中... */}
          </Text>
        </View>
      )
    } else {
      return (
        <View>
          <Text
            style={{
              flex: 1,
              lineHeight: 30,
              fontSize: 12,
              textAlign: 'center',
              backgroundColor: color.content_white,
            }}
          >
            {/* -----这是底线----- */}
          </Text>
        </View>
      )
    }
  }
  _render = () => {
    if (
      _arrPublishServiceList.length === 0 &&
      _arrPrivateServiceList.length === 0
    ) {
      return (
        <View style={styles.noDataViewStyle}>
          <View
            style={{
              height: 2,
              width: this.state.progressWidth,
              backgroundColor: '#1c84c0',
            }}
          />
        </View>
      )
    } else {
      return (
        <View style={{ flex: 1 }}>
          <SectionList
            style={styles.haveDataViewStyle}
            sections={[
              {
                title: this.privateServiceTitle,
                data: this.state.arrPrivateServiceList,
                isShowItem: this.state.bPrivateServiceShow,
              },
              {
                title: this.publishServiceTitle,
                data: this.state.arrPublishServiceList,
                isShowItem: this.state.bPublishServiceShow,
              },
            ]}
            renderItem={this._renderItem}
            renderSectionHeader={this._renderSectionHeader}
            keyExtractor={this._keyExtractor}
            refreshControl={
              <RefreshControl
                refreshing={this.state.isRefreshing}
                onRefresh={this._onRefresh}
                colors={['orange', 'red']}
                tintColor={'orange'}
                title={'刷新中...'}
                titleColor={'orange'}
                enabled={true}
              />
            }
            onEndReachedThreshold={0.1}
            onEndReached={this._loadData}
            ListFooterComponent={this._footView}
          />
        </View>
      )
    }
  }

  render() {
    return (
      <Container
        ref={ref => (this.container = ref)}
        headerProps={{
          title: getLanguage(GLOBAL.language).Profile.MY_SERVICE,

          //'我的服务',
          withoutBack: false,
          navigation: this.props.navigation,
        }}
      >
        {this._render()}
        {this._renderPopMenu()}
      </Container>
    )
  }
}
