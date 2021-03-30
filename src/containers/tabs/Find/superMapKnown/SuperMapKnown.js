import React, { Component } from 'react'
import { FlatList, Image, TouchableOpacity, View, Text ,  RefreshControl , ActivityIndicator} from 'react-native'
import NavigationService from '../../../NavigationService'
import { Container } from '../../../../components'
import styles from './styles'
// import { SOnlineService } from 'imobile_for_reactnative'
import { Toast, OnlineServicesUtils } from '../../../../utils'
import { getLanguage } from '../../../../language/index'
import { FileTools } from '../../../../native'
import RNFS from 'react-native-fs'
import { color } from '../../../../styles'

export default class SuperMapKnown extends Component {
  props: {
    navigation: Object,
  }
  constructor(props) {
    super(props)
    const params = this.props.navigation.state.params
    this.type = params.type
    this.state = {
      alldata:[],
      data: [],
      isLoading: false,
      isRefresh: false,
    }
    this.isLoading = false
    this.cancelLoading = false
    this.current = 20
  }

  componentDidMount() {
    this.getData()
  }

  getData = async () => {
    try {
      let JSOnlineService = new OnlineServicesUtils('online')
      let data
      if (this.type === 'SuperMapGroup') {
        data = await JSOnlineService.getPublicDataByName(
          '927528',
          'SuperMapGroup.geojson',
        )
      } else if (this.type === 'SuperMapKnow') {
        data = await JSOnlineService.getPublicDataByName(
          '927528',
          'zhidao.geojson',
        )
      }
      let url = `https://www.supermapol.com/web/datas/${data.id}/download`

      let fileCachePath = await FileTools.appendingHomeDirectory(
        '/iTablet/Cache/' + data.fileName,
      )

      if (await RNFS.exists(fileCachePath)) {
        await RNFS.unlink(fileCachePath)
      }

      let downloadOptions = {
        fromUrl: url,
        toFile: fileCachePath,
        background: true,
        fileName: data.fileName,
        progressDivider: 1,
      }

      await RNFS.downloadFile(downloadOptions).promise

      if (await RNFS.exists(fileCachePath)) {
        let fileStr = await RNFS.readFile(fileCachePath)
        let data = JSON.parse(fileStr)
        let currentData = data.slice(0,this.current)
        this.setState({ data: currentData ,alldata : data})

        if (this.props.navigation.state.params.callback != null) {
          this.props.navigation.state.params.callback()
        }

        // await RNFS.unlink(fileCachePath)
      }
    } catch (error) {
      Toast.show(getLanguage(GLOBAL.language).Prompt.NETWORK_REQUEST_FAILED)
    }
  }

  loadData = async () => {
    if(this.current>=this.state.alldata.length) return
    if (this.isLoading) return
    this.isLoading = true
    this.setState({ isLoading: true })
    try {
      this.current = this.current + 20
      if(this.current<this.state.alldata.length){
        let currentData = this.state.data.slice(0,this.current)
        this.setState({data:currentData})
      }else{
        this.setState({data:this.state.alldata})
      }
    } catch (e) {
      //
    }
    // this.timer = setTimeout(() => {
    this.isLoading = false
    this.setState({ isLoading: false })
    //   clearTimeout(this.timer)
    //   this.timer = null
    // }, 2000)
  }


  _renderitem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.itemBtn}
        onPress={() => {
          switch (this.type) {
            case 'SuperMapKnow':
              NavigationService.navigate('Protocol', {
                type: 'superMapKnown',
                knownItem: { id: item.id },
              })
              break
            case 'SuperMapGroup':
              NavigationService.navigate('Protocol', {
                type: 'SuperMapGroup',
                knownItem: { id: item.id },
              })
              break
          }
        }}
      >
        <View style={styles.leftView}>
          <Text style={styles.itemTitle}>{item.title}</Text>
          {/* <Text style={styles.itemInformation}>简介:超图知道公众号文章</Text> */}
          <Text style={styles.itemTime}>时间:{item.time}</Text>
        </View>
        <View style={styles.rightView}>
          <Image source={{ uri: item.cover , cache: 'force-cache' }} style={styles.img} />
        </View>
      </TouchableOpacity>
    )
  }

  _itemSeparatorComponent = () => {
    return <View style={styles.itemSeparator} />
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
            {getLanguage(GLOBAL.language).Prompt.LOADING}
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

  _onRefresh = async () => {
    try {
      this.setState({ isRefresh: true })
      setTimeout(() => {
        this.setState({ isRefresh: false })
      }, 3000)
    } catch (e) {
      this.setState({ isRefresh: false })
    }
  }

  render() {
    var tempTitle
    switch (this.type) {
      case 'SuperMapKnow':
        tempTitle = getLanguage(GLOBAL.language).Prompt.SUPERMAP_KNOW
        break
      case 'SuperMapGroup':
        tempTitle = getLanguage(GLOBAL.language).Prompt.SUPERMAP_GROUP
        break
    }
    return (
      <Container
        ref={ref => (this.container = ref)}
        headerProps={{
          title: tempTitle,
          //'超图知道',
          navigation: this.props.navigation,
        }}
      >
        <FlatList
          ref={ref => (this.flast = ref)}
          renderItem={this._renderitem}
          ItemSeparatorComponent={this._itemSeparatorComponent}
          data={this.state.data}
          keyExtractor={(item, index) => index.toString()} //不重复的key
          style={[styles.haveDataViewStyle,
            { backgroundColor: color.contentColorWhite }]}
          initialNumToRender={6}
          onEndReachedThreshold={0.3}
          onEndReached={this.loadData}
          ListFooterComponent={this._footView()}
          // refreshControl={
          //   <RefreshControl
          //     refreshing={this.state.isRefresh}
          //     onRefresh={this._onRefresh}
          //     colors={['orange', 'red']}
          //     tintColor={'orange'}
          //     titleColor={'orange'}
          //     title={getLanguage(GLOBAL.language).Friends.LOADING}
          //     enabled={true}
          //   />
          // }
        />
      </Container>
    )
  }
}
