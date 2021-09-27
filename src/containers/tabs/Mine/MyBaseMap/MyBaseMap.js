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

  componentDidMount() {}

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
        {/*{this._showMyDataPopupModal()}*/}
        {this.renderPopupMenu()}
      </Container>
    )
  }
}
