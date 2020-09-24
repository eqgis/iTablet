/*
  Copyright © SuperMap. All rights reserved.
  Author: lu cheng dong
  E-mail: 756355668@qq.com
*/
import React, { Component } from 'react'
import Container from '../../components/Container'
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  Dimensions,
  ActivityIndicator,
} from 'react-native'
import RenderFindItem from './RenderFindItem'
import { jsonUtil } from '../../utils'
import styles from './Styles'
import color from '../../styles/color'
import FetchUtils from '../../utils/FetchUtils'
import { getLanguage } from '../../language'
import { FileTools } from '../../native'
import { ConstPath } from '../../constants'
import RNFS from 'react-native-fs'
// import { Platform } from 'os'
// import { FileTools } from '../../native'
// import { ConstPath } from '../../constants'
// import FriendListFileHandle from '../tabs/Friend/FriendListFileHandle'
export default class PublicMap extends Component {
  props: {
    navigation: Object,
    user: Object,
  }

  constructor(props) {
    super(props)
    this.screenWidth = Dimensions.get('window').width
    this.state = {
      data: [],
      isRefresh: false,
      progressWidth: this.screenWidth * 0.4,
      isLoading: false,
    }
    this.cacheVer = 0
    this.currentPage = 1
    this.totalPage = 100
    this.isLoading = false
    this.cancelLoading = false
  }
  componentDidMount() {
    FileTools.getHomeDirectory().then(value => {
      let path = value + ConstPath.CachePath + 'publicMap.txt'
      FileTools.fileIsExist(path).then(exist => {
        if (exist) {
          RNFS.readFile(path).then(result => {
            if (result && jsonUtil.isJSON(result)) {
              let data = JSON.parse(result)
              if (data.version !== undefined) {
                this.cacheVer = data.version
                this.setState({ data: data.data })
              } else {
                this.setState({ data })
              }
            }
          })
        } else {
          this.loadData()
        }
      })
    })
  }

  componentWillUnmount() {
    this.cancelLoading = true
    this.saveMapCache()
  }

  loadData = async () => {
    if (this.isLoading) return
    this.isLoading = true
    this.setState({ isLoading: true })
    try {
      let loadCount = 0
      while (this.currentPage < this.totalPage) {
        let pageData = await this.getCurrentPageData(this.currentPage++)
        let content = pageData.content || []
        for (let i = 0; i < content.length; i++) {
          let data = content[i]
          await this.checkData(data)
          if (data.hasMap) {
            loadCount++
            let currentData = this.state.data
            currentData.push(data)
            currentData.sort((a, b) => {
              return b.lastModfiedTime - a.lastModfiedTime
            })
            this.setState({ data: currentData })
          }
          if (loadCount > 10) {
            break
          }
          if (this.cancelLoading) {
            break
          }
        }
        if (loadCount > 10) {
          break
        }
        if (this.cancelLoading) {
          break
        }
      }
    } catch (e) {
      //
    }
    this.isLoading = false
    this.setState({ isLoading: false })
  }

  getCurrentPageData = currentPage => {
    let time = new Date().getTime()
    let uri = `https://www.supermapol.com/web/datas.json?currentPage=${currentPage}&orderBy=LASTMODIFIEDTIME&orderType=DESC&t=${time}&type=WORKSPACE`
    return FetchUtils.getObjJson(uri)
  }

  checkData = async data => {
    if (!this.isDataLoaded(data)) {
      await this.checkService(data)
    }
    return data.hasMap
  }

  isDataLoaded = data => {
    let currentData = this.state.data
    for (let i = 0; i < currentData.length; i++) {
      if (data.id === currentData[i].id) {
        return true
      }
    }
    return false
  }

  checkService = async item => {
    let dataUrl = 'https://www.supermapol.com/web/datas/' + item.id + '.json'
    let dataInfo = await FetchUtils.getObjJson(dataUrl)
    let arrDataItemServices = dataInfo.dataItemServices
    if (arrDataItemServices) {
      let length = arrDataItemServices.length
      let serviceUrl
      for (let i = 0; i < length; i++) {
        let dataItemServices = arrDataItemServices[i]
        if (
          dataItemServices &&
          dataItemServices.serviceType === 'RESTMAP' &&
          dataItemServices.serviceStatus === 'PUBLISHED'
        ) {
          serviceUrl = dataItemServices.address
          break
        }
      }
      if (serviceUrl && serviceUrl !== '') {
        let mapsUrl = serviceUrl + '/maps.json'
        let mapsInfo = await FetchUtils.getObjJson(mapsUrl, 6000)
        if (mapsInfo && mapsInfo.length > 0) {
          item.thumbnail = mapsInfo[0].path + '/entireImage.png'
          item.hasMap = true
        }
      }
    }
  }

  async saveMapCache() {
    if (this.state.data.length < 1) return
    let dataObj = {
      version: this.cacheVer,
      data: this.state.data,
    }
    let data = JSON.stringify(dataObj)
    let path =
      (await FileTools.getHomeDirectory()) +
      ConstPath.CachePath +
      'publicMap.txt'
    RNFS.writeFile(path, data, 'utf8')
      .then(() => {})
      .catch(() => {})
  }

  _onRefresh = async () => {
    try {
      this.setState({ isRefresh: true })
      setTimeout(() => {
        this.setState({ isRefresh: false })
      }, 3000)
      let pageData = await this.getCurrentPageData(1)
      let content = pageData.content || []
      for (let i = 0; i < content.length; i++) {
        let data = content[i]
        await this.checkData(data)
        if (data.hasMap) {
          let currentData = this.state.data
          currentData.push(data)
          currentData.sort((a, b) => {
            return b.lastModfiedTime - a.lastModfiedTime
          })
          this.setState({ data: currentData })
        }
      }
    } catch (e) {
      this.setState({ isRefresh: false })
    }
  }

  _footView() {
    if (this.state.isLoading) {
      return (
        <View
          style={{
            flex: 1,
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
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
              color: 'orange',
            }}
          >
            {getLanguage(global.language).Prompt.LOADING}
            {/* 加载中... */}
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
            }}
          >
            {/* -----这是底线----- */}
          </Text>
        </View>
      )
    }
  }

  _keyExtractor = (item, index) => {
    if (item.id !== undefined) {
      return item.id + '' + index * index
    }
    return index * index
  }

  _selectRender = () => {
    if (this.state.data.length === 1 && this.state.data[0].id === undefined) {
      return (
        <View
          style={[
            styles.noDataViewStyle,
            { backgroundColor: color.contentColorWhite },
          ]}
        >
          <View
            style={{
              height: 2,
              width: this.state.progressWidth,
              backgroundColor: '#1c84c0',
            }}
          />
        </View>
      )
    }

    return (
      <FlatList
        style={[
          styles.haveDataViewStyle,
          { backgroundColor: color.contentColorWhite },
        ]}
        data={this.state.data}
        renderItem={data => {
          return <RenderFindItem user={this.props.user} data={data.item} />
        }}
        refreshControl={
          <RefreshControl
            refreshing={this.state.isRefresh}
            onRefresh={this._onRefresh}
            colors={['orange', 'red']}
            tintColor={'orange'}
            titleColor={'orange'}
            title={getLanguage(global.language).Friends.LOADING}
            enabled={true}
          />
        }
        keyExtractor={this._keyExtractor}
        onEndReachedThreshold={0.5}
        onEndReached={this.loadData}
        ListFooterComponent={this._footView()}
      />
    )
  }

  render() {
    return (
      <Container
        ref={ref => (this.container = ref)}
        headerProps={{
          title: getLanguage(global.language).Prompt.PUBLIC_MAP,
          //'公共地图',
          navigation: this.props.navigation,
        }}
      >
        {this._selectRender()}
      </Container>
    )
  }
}
