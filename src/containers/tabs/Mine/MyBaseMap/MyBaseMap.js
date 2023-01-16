import React, { Component } from 'react'
import { FlatList, View, TouchableOpacity, Image, RefreshControl } from 'react-native'
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
import { GetUserBaseMapUtil, Toast } from '../../../../utils'

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
      title: getLanguage(global.language).Profile.BASEMAP,
      //'底图',
      modalIsVisible: false,
      isRefreshing: false,
      curUserBaseMaps: [],
    }
    // // 根据当前用户id获取当前用户的底图数组
    // this.curUserBaseMaps = this.props.baseMaps[
    //   this.props.user.currentUser.userId
    // ]
    // // 如果当前用户底图数组没有值或不存在就，设置为系统默认的底图数组
    // if (!this.curUserBaseMaps) {
    //   this.curUserBaseMaps = this.props.baseMaps['default']
    // }
    // //仅获取用户自定义底图 zhangxt
    // this.curUserBaseMaps = this.curUserBaseMaps.filter(item => {
    //   return item.userAdd
    // })
    // //添加公共底图 zhangxt
    // this.curUserBaseMaps = this.getCommonBaseMap().concat(this.curUserBaseMaps)
    // let count = this.curUserBaseMaps.length
    // // 矫正当前用户底图数组里元素的index的值，让index的值与他的位置保持相同
    // for (let i = 0; i < count; i++) {
    //   this.curUserBaseMaps[i].index = i
    // }
    // this.setState({curUserBaseMaps: this.curUserBaseMaps})
    this.uploadList = []
  }

  async componentDidMount() {
    let loadText = getLanguage().LOADING
    this.container.setLoading(
      true,
      loadText,
    )
    // 加载用户底图
    await this.loadUserBaseMaps()
    // if(UserType.isOnlineUser(this.props.user.currentUser) || UserType.isIPortalUser(this.props.user.currentUser)){
    //   this._initFirstSectionData()
    // }

    //关闭加载动画
    this.container.setLoading(false)
  }

  /**
   * @author lyx
   * 加载当前用户的底图
   */
  loadUserBaseMaps = async () => {
    let curUserBaseMaps = []
    // 根据当前用户id获取当前用户的底图数组
    if(this.props.user.currentUser.userId){
      curUserBaseMaps = this.props.baseMaps[this.props.user.currentUser.userId]
    }

    // 如果当前用户底图数组没有值或不存在就，设置为系统默认的底图数组
    if (!curUserBaseMaps) {
      curUserBaseMaps = this.props.baseMaps['default']
    }
    let arrPublishServiceList = await GetUserBaseMapUtil.loadUserBaseMaps(this.props.user.currentUser, curUserBaseMaps)
    let listResult = []
    let list = []

    // 当公有服务列表数组有元素时，就遍历这个数组
    if (arrPublishServiceList.length > 0) {
      for (let i = 0, n = arrPublishServiceList.length; i < n; i++) {
        // 当公有服务列表的元素的地图名字和地图信息数组，以及地图信息数组的地图服务地址都存在时，更新当前用户的底图
        if (arrPublishServiceList[i].restTitle && arrPublishServiceList[i].mapInfos[0] && arrPublishServiceList[i].mapInfos[0].mapUrl){
          list = await GetUserBaseMapUtil.addServer(arrPublishServiceList[i].restTitle, arrPublishServiceList[i].mapInfos[0].mapUrl)
        }
      }
    }

    if(list.length > 0){
      // 拿到本地数据里是用户添加的底图
      let userLocalList = curUserBaseMaps.filter(item => {
        return item.userAdd
      })
      // 拿到公有服务里是用户添加的底图
      let tempList = list.filter(item => {
        return item.userAdd
      })
      // 将公共底图和用户公有服务里的底图合并到目标数组
      listResult = this.getCommonBaseMap().concat(tempList)
      let tempListArr = []
      // 获取本地数据里，不属于服务的底图
      userLocalList.map((tempItem) => {
        let indexL = -1
        list.map((item, index) => {
          if(tempItem.mapName === item.mapName && JSON.stringify(tempItem.DSParams) === JSON.stringify(item.DSParams)) {
            indexL = index
          }
        })
        if(indexL === -1) {
          tempListArr.push(tempItem)
        }
      })
      // 将本地数据里，不属于服务的底图添加进目标数组
      listResult =  listResult.concat(tempListArr)
    } else {
      let userLocalList = curUserBaseMaps.filter(item => {
        return item.userAdd
      })
      listResult = this.getCommonBaseMap().concat(userLocalList)
    }

    this.curUserBaseMaps = listResult
    let count = this.curUserBaseMaps.length
    for (let i = 0; i < count; i++) {
      this.curUserBaseMaps[i].index = i
    }

    // 将更改完成后的当前用户的底图数组，进行持久化存储，此处会触发页面刷新（是其他地方能够拿到用户底图的关键）
    this.props.setBaseMap &&
    this.props.setBaseMap({
      userId: this.props.user.currentUser.userId,
      baseMaps: this.curUserBaseMaps,
    })

    // let userLocalList = curUserBaseMaps.filter(item => {
    //   return item.userAdd
    // })
    // listResult = listResult.concat(userLocalList)

    console.warn("this.curUserBaseMaps: " + JSON.stringify(this.curUserBaseMaps))
    this.setState({
      curUserBaseMaps:  this.curUserBaseMaps,
      isRefreshing: false,
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
    if(global.language === 'CN') {
      maps.splice(3, 1)
    }
    return maps
  }

  _renderItem = ({ item, index }) => {
    return (
      <BaseMapItem
        {...this.props}
        curUserBaseMaps={this.state.curUserBaseMaps}
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
            baseMaps: this.state.curUserBaseMaps,
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

      let list = this.state.curUserBaseMaps
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
        title: getLanguage(global.language).Profile.DELETE_DATA,
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
          data={this.state.curUserBaseMaps}
          ItemSeparatorComponent={() => (
            <View
              style={{
                backgroundColor: color.separateColorGray,
                flex: 1,
                height: 1,
              }}
            />
          )}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={() => {
                try {
                  this.setState({ isRefreshing: true })
                  // 加载底图
                  // this.loadUserBaseMaps().then(() => {
                  //   this.setState({ isRefreshing: false })
                  // })
                  this.loadUserBaseMaps()
                } catch (error) {
                  Toast.show('刷新失败')
                }
              }}
              colors={['orange', 'red']}
              titleColor={'orange'}
              tintColor={'orange'}
              title={'刷新中...'}
              enabled={true}
            />
          }
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

