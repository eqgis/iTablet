import React, { Component } from 'react'
import { FlatList, View, TouchableOpacity, Image } from 'react-native'
// import { ConstPath, ConstInfo } from '../../../../constants'
// import { FileTools } from '../../../../native'
// import { SMap, EngineType, SOnlineService } from 'imobile_for_reactnative'
// import UserType from '../../../../constants/UserType'
import { Container, PopMenu } from '../../../../components'
// import MyDataPopupModal from '../MyData/MyDataPopupModal'
import BaseMapItem from './BaseMapItem'
import { color } from '../../../../styles'
import NavigationService from '../../../NavigationService'
import { getLanguage } from '../../../../language/index'
// import { InputDialog } from '../../../../components/Dialog'
// import { Toast } from '../../../../utils'
import styles from './styles'
import { ConstOnline } from '../../../../constants'
import RenderServiceItem from '../MyService/RenderServiceItem'
import { UserType } from '../../../../constants'
import { SOnlineService, SIPortalService } from 'imobile_for_reactnative'

let _arrPrivateServiceList = []
let _arrPublishServiceList = []
export default class MyBaseMap extends Component {
  props: {
    user: any,
    navigation: Object,
    baseMaps: Object,
    setBaseMap: () => {},
    device: Object,
  }

  constructor(props) {
    super(props)
    this.state = {
      title: getLanguage(GLOBAL.language).Profile.BASEMAP,
      //'底图',
      modalIsVisible: false,
    }
    this.curUserBaseMaps = this.props.baseMaps[
      this.props.user.currentUser.userId
    ]
    if (!this.curUserBaseMaps) {
      this.curUserBaseMaps = this.props.baseMaps['default']
    }
    //仅获取用户自定义底图 zhangxt
    this.curUserBaseMaps = this.curUserBaseMaps.filter(item => {
      return item.userAdd
    })
    //添加公共底图 zhangxt
    this.curUserBaseMaps = this.getCommonBaseMap().concat(this.curUserBaseMaps)
    let count = this.curUserBaseMaps.length
    for (let i = 0; i < count; i++) {
      this.curUserBaseMaps[i].index = i
    }
    this.uploadList = []
  }

  componentDidMount() {
    if(UserType.isOnlineUser(this.props.user.currentUser) || UserType.isIPortalUser(this.props.user.currentUser)){
      this._initFirstSectionData()
    }
  }

  _initFirstSectionData = async () => {
    await this._initSectionsData(9, 9)
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

            if (arrMapInfos.length > 0 || arrScenes.length > 0) {
              let objSectionsData = JSON.parse(strSectionsData)
              if (bIsPublish) {
                arrPublishServiceList.push(objSectionsData)
              } else {
                arrPrivateServiceList.push(objSectionsData)
              }
            }
          }
        }
        /** 重新赋值，避免浅拷贝*/
        _arrPrivateServiceList = arrPrivateServiceList
        _arrPublishServiceList = arrPublishServiceList
      }

      if (_arrPublishServiceList.length > 0) {
        for (let i = 0, n = _arrPublishServiceList.length; i < n; i++) {
          if (_arrPublishServiceList[i].restTitle && _arrPublishServiceList[i].mapInfos[0] && _arrPublishServiceList[i].mapInfos[0].mapUrl){
            this.addServer(_arrPublishServiceList[i].restTitle, _arrPublishServiceList[i].mapInfos[0].mapUrl)
          }
        }
        // this.curUserBaseMaps.push.apply(this.curUserBaseMaps,_arrPublishServiceList)
      }

      if (_arrPrivateServiceList.length === 0) {
        _arrPrivateServiceList.push({})
      }
      if (_arrPublishServiceList.length === 0) {
        _arrPublishServiceList.push({})
      }
    } catch (e) {
      console.warn(e)
    }
  }

  addServer = (strRestTitle,server) => {
    let alias = strRestTitle

    // 拿到图层名字前面的组成部分（从服务地址的最后一个“/”后拿）
    let layerNameTitle = server.substring(
      server.lastIndexOf('/') + 1,
      server.length,
    )
    // [\u4e00-\u9fa5] 中文字符的范围
    let rex = /.*[\u4e00-\u9fa5]+.*$/g
    let layerName = ""
    if(rex.test(decodeURIComponent(layerNameTitle))) {
      // 这个图层名字的标题部分解码后包含中文，则直接简单拼接就好
      layerName = layerNameTitle + '@' + alias  //this.state.server.lastIndexOf('/')
    } else {
      // 这个图层名字的标题部分解码后不包含中文，就加一个前缀“en-”标识（注：如果其他地方需要用图层名字进行地址拼接的，需要先将前缀给去掉）
      layerName = 'en-' + layerNameTitle + '@' + alias
    }

    // let layerName =
    //   server.substring(
    //     server.lastIndexOf('/') + 1,
    //     server.length,
    //   ) +
    //   '@' +
    //   alias //this.state.server.lastIndexOf('/')

    let _DSParams = {}
    // if (this.state.engineType === 23) {
    //   _DSParams = {
    //     server: this.state.server,
    //     engineType: this.state.engineType,
    //     alias: alias,
    //     driver: this.state.driver,
    //     // datasetIndex: this.state.selcetIndex,
    //     layerIndex: this.state.selcetIndex,
    //   }
    // } else {
    _DSParams = {
      server: server,
      engineType: 225,
      alias: alias,
      // datasetIndex: this.state.selcetIndex,
      layerIndex: 0,
    }
    // }
    let item = {
      type: 'Datasource',
      DSParams: _DSParams,
      // DSParams: {
      //   server: this.state.server,
      //   engineType: this.state.engineType,
      //   alias: alias,
      // },
      // layerIndex: 0,
      layerIndex: 0,
      mapName: strRestTitle,
      layerName: layerName,
      userAdd: true,
      nodeleteBT: true,
    }
    let list = this.curUserBaseMaps
    if (item != undefined) {
      for (let i = 0, n = list.length; i < n; i++) {
        if (
          list[i].DSParams.server === item.DSParams.server &&
          list[i].mapName === item.mapName
        ) {
          list.splice(i, 1)
          break
        }
      }
    }
    list.push(item)
    let count = list.length
    for (let i = 0; i < count; i++) {
      list[i].index = i
    }
    this.props.setBaseMap &&
      this.props.setBaseMap({
        userId: this.props.user.currentUser.userId,
        baseMaps: list,
      })
  }

  /**
   * @author zhangxt
   * @description 获取公共的底图列表
   * @returns {Array}
   */
  getCommonBaseMap = () => {
    const maps = [
      // ConstOnline.GAODE,
      ConstOnline.BingMap,
      ConstOnline.Baidu,
      ConstOnline.Google,
      ConstOnline.OSM,
      ConstOnline.tianditu(),
    ]
    if(GLOBAL.language === 'CN') {
      maps.splice(3, 1)
    }
    return maps
  }

  _renderItem = ({ item, index }) => {
    return (
      <BaseMapItem
        {...this.props}
        curUserBaseMaps={this.curUserBaseMaps}
        item={item}
        index={index}
        saveItemInfo={this.saveItemInfo}
        itemOnPress={this.itemOnPress}
      />
    )
  }

  _renderServiceItem = ({ item, index }) => {
    let restTitle = item.restTitle
    if (restTitle !== undefined) {
      let imageUri = item.thumbnail
      let isPublish = item.isPublish
      let itemId = item.id
      let scenes = item.scenes
      let mapInfos = item.mapInfos
      return (
        <RenderServiceItem
          data={item}
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
  }

  _keyExtractor = index => {
    return index
  }

  itemOnPress = (item, event) => {
    this.itemInfo = item
    this.BaseMapPopupModal &&
      this.BaseMapPopupModal.setVisible(true, {
        x: event.nativeEvent.pageX,
        y: event.nativeEvent.pageY,
      })
  }

  // saveItemInfo = ({ item, index }) => {
  //   this.itemInfo = { item, index }
  //   this.setState({ modalIsVisible: true },()=>{
  //     this.MyDataPopModal.setVisible(true)
  //   })
  // }

  // _showMyDataPopupModal = () => {
  //   let data = [
  //     {
  //       title: '游览地图',
  //       action: () => {
  //         // SMap.removeDatasetByName(this.state.udbPath, this.itemInfo.item.title)
  //       },
  //     },
  //   ]
  //   return (
  //     <MyDataPopupModal
  //       // onDeleteData={this._onDeleteData}
  //       ref={ref=>(this.MyDataPopModal = ref)}
  //       data={data}
  //       modalVisible={this.state.modalIsVisible}
  //     />
  //   )
  // }

  _renderHeaderBtn = () => {
    let Img = require('../../../../assets/Mine/mine_my_local_import_light.png')
    return (
      <TouchableOpacity
        onPress={() => {
          NavigationService.navigate('LoadServer', {
            setBaseMap: this.props.setBaseMap,
            baseMaps: this.curUserBaseMaps,
            user: this.props.user,
          })
        }}
      >
        <Image source={Img} style={styles.rightBtn} />
      </TouchableOpacity>
    )
  }

  _closeModal = () => {
    this.BaseMapPopupModal && this.BaseMapPopupModal.setVisible(false)
  }

  deleteData = () => {
    this._closeModal()
    if (this.itemInfo && this.itemInfo.index !== undefined) {
      //下标为index的item

      let list = this.curUserBaseMaps
      for (let i = 0, n = list.length; i < n; i++) {
        if (
          list[i].DSParams.server === this.itemInfo.DSParams.server &&
          list[i].mapName === this.itemInfo.mapName &&
          list[i].index === this.itemInfo.index
        ) {
          list.splice(i, 1)
          break
        }
      }
      let count = list.length
      for (let i = 0; i < count; i++) {
        list[i].index = i
      }
      this.props.setBaseMap &&
        this.props.setBaseMap({
          userId: this.props.user.currentUser.userId,
          baseMaps: list,
        })
    }
  }

  getPopMenuData = () => {
    let data = []
    let item = this.itemInfo
    if (item) {
      data.push({
        title: getLanguage(GLOBAL.language).Profile.DELETE_DATA,
        action: this.deleteData,
      })
    }
    return data
  }

  renderPopupMenu = () => {
    return (
      <PopMenu
        ref={ref => (this.BaseMapPopupModal = ref)}
        getData={this.getPopMenuData}
        device={this.props.device}
        hasCancel={true}
      />
    )
  }

  render() {
    return (
      <Container
        ref={ref => (this.container = ref)}
        hideInBackground={false}
        showFullInMap={true}
        headerProps={{
          title: this.state.title,
          navigation: this.props.navigation,
          headerRight: this._renderHeaderBtn(),
        }}
      >
        <FlatList
          initialNumToRender={20}
          ref={ref => (this.ref = ref)}
          renderItem={this._renderItem}
          keyExtractor={(item, index) => index.toString()}
          data={this.curUserBaseMaps}
          ItemSeparatorComponent={() => (
            <View
              style={{
                backgroundColor: color.separateColorGray,
                flex: 1,
                height: 1,
              }}
            />
          )}
        />
        {/* <FlatList
          initialNumToRender={20}
          ref={ref => (this.serviceref = ref)}
          renderItem={this._renderServiceItem}
          keyExtractor={(item, index) => index.toString()}
          data={this.state.arrPrivateServiceList}
          ItemSeparatorComponent={() => (
            <View
              style={{
                backgroundColor: color.separateColorGray,
                flex: 1,
                height: 1,
              }}
            />
          )}
        /> */}
        {/*{this._showMyDataPopupModal()}*/}
        {this.renderPopupMenu()}
      </Container>
    )
  }
}
