import React, { Component } from 'react'
import Container from '../../components/Container'
import {
  FlatList,
  RefreshControl,
  Dimensions,
  View,
} from 'react-native'
import { FileTools } from '../../native'
import { Toast, scaleSize, FetchUtils } from '../../utils'
import { Module } from '../../class'
import NavigationService from '../NavigationService'
import { getLanguage } from '../../language'
import SampleMapItem from './SampleMapItem'
import DataHandler from '../tabs/Mine/DataHandler'

export default class SampleMap extends Component {
  props: {
    navigation: Object,
    device: Object,
    user: Object,
    downloads: Array,
    language: string,
    
    downloadFile: () => {},
    deleteDownloadFile: () => {},
    importSceneWorkspace: () => {},
  }

  constructor(props) {
    super(props)
    const { params } = props.route
    this.refreshAction = params && params.refreshAction
    this.screenWidth = Dimensions.get('window').width
    this.state = {
      data: [],
      isRefresh: false,
      type:"",
    }
    this.isfull = params && params.isfull || false
  }
  
  componentDidMount() {
    this.getData()
  }
  
  getData = async () => {
    let examples = this.props.mapModules.modules[this.props.mapModules.currentMapModule]
      .getExampleName(this.props.language)
    let mapType = this.props.mapModules.modules[this.props.mapModules.currentMapModule].mapType
    let keywords = []
    for (let i = 0; i < examples.length; i++) {
      let _name = examples[i].name
      if (!_name.endsWith('_EXAMPLE')) {
        _name += '_EXAMPLE'
      }
      keywords.push(_name)
    }
    if (keywords.length === 0) return
    FetchUtils.getDataInfoByUrl({
      nickname: 'xiezhiyan123',
    }, keywords, '.zip').then(result => {
      let arr = result.content
      if (arr.length % 2 === 1) arr.push({})
      arr.forEach(item => {
        if (Object.keys(item).length > 0) {
          item.mapType = mapType
        }
      })
      this.setState({
        data: arr,
      })
    })
  }
  
  _getCurrentDownloadData = downloadData => {
    if (!downloadData) return null
    if (this.props.downloads.length > 0) {
      for (let i = 0; i < this.props.downloads.length; i++) {
        if (this.props.downloads[i].id === downloadData.id) {
          return this.props.downloads[i]
        }
      }
    }
    return null
  }
  
  _downloadFile = async downloadData => {
    let cachePath = downloadData.cachePath
    let fileName = downloadData.fileName
    let fileDirPath = cachePath + fileName
    let fileCachePath = fileDirPath + '.zip'
    
    Toast.show(getLanguage(this.props.language).Prompt.DOWNLOAD + ' ' + fileName.replace('_EXAMPLE', ''))
    try {
      let downloadOptions = {
        fromUrl: downloadData.url,
        toFile: fileCachePath,
        background: true,
        fileName: fileName,
        progressDivider: 1,
        key: downloadData.id,
        module: global.Type,
      }
      await this.props.downloadFile(downloadOptions)
      await FileTools.unZipFile(fileCachePath, cachePath)
      let tempData = await DataHandler.getExternalData(fileDirPath) || []
      if (downloadData.mapType === Module.MapType.SCENE || downloadData.mapType === Module.MapType.AR) {
        await DataHandler.importWorkspace3D(downloadData.tmpCurrentUser, tempData[0])
      } else if (downloadData.mapType === Module.MapType.MAP) {
        await DataHandler.importWorkspace(tempData[0])
      }
      FileTools.deleteFile(fileDirPath + '_')
      FileTools.deleteFile(fileCachePath)
      this.props.deleteDownloadFile({id: downloadData.id})
  
      Toast.show(fileName.replace('_EXAMPLE', '') + ' ' + getLanguage(this.props.language).Prompt.DOWNLOAD_SUCCESSFULLY)
      return true
    } catch (e) {
      Toast.show(getLanguage(this.props.language).Prompt.NETWORK_ERROR)
      FileTools.deleteFile(fileCachePath)
      this.props.deleteDownloadFile({id: downloadData.id})
      return false
    }
  }
  
  _renderItem = ({item}) => {
    if (!item.fileName) return (
      <View
        style={{
          flex: 1,
          marginHorizontal: this.props.device.orientation.indexOf('LANDSCAPE') === 0
            ? scaleSize(10)
            : scaleSize(20)
        }} />
    )
    return (
      <SampleMapItem
        user={this.props.user}
        data={item}
        style={{
          flex: 1,
          marginHorizontal: this.props.device.orientation.indexOf('LANDSCAPE') === 0
            ? scaleSize(10)
            : scaleSize(20)
        }}
        downloadData={this._getCurrentDownloadData(item)}
        downloadFile={this._downloadFile}
        // downloads={this.props.downloads}
        moduleData={this.props.mapModules.modules[this.props.mapModules.currentMapModule]}
      />
    )
  }

  render() {
    return (
      <Container
        ref={ref => (this.container = ref)}
        headerProps={{
          title: getLanguage(global.language).Profile.SAMPLEDATA,
          //'公共地图',
          navigation: this.props.navigation,
          backAction: () => {
            if (this.refreshAction && typeof this.refreshAction === 'function') {
              this.refreshAction()
            }
            NavigationService.goBack()
          },
        }}
        showFullInMap = {this.isfull}
      >
        <FlatList
          style={{
            marginHorizontal: this.props.device.orientation.indexOf('LANDSCAPE') === 0
              ? scaleSize(20)
              : scaleSize(32)
          }}
          numColumns={2}
          data={this.state.data}
          renderItem={this._renderItem}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefresh}
              onRefresh={this.getData}
              colors={['orange', 'red']}
              tintColor={'orange'}
              titleColor={'orange'}
              title={getLanguage(global.language).Friends.LOADING}
              enabled={true}
            />
          }
          keyExtractor={this._keyExtractor}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator = {false}
        />
      </Container>
    )
  }
}
