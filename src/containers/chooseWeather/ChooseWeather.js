import * as React from 'react'
import { SARWeather } from 'imobile_for_reactnative'
import { Container } from '../../components'
import { scaleSize, OnlineServicesUtils, Toast } from '../../utils'
import { View, TouchableOpacity, FlatList, Text } from 'react-native'
import NavigationService from '../NavigationService'
import { FileTools } from '../../native'
import RNFS from 'react-native-fs'

export default class ChooseWeather extends React.Component {
  props: {
    navigation: Object,
    language: String,
    user: Object,
    nav: Object,
  }

  constructor(props) {
    super(props)
    let params = this.props.navigation.state.params || {}
    this.point = params.point
    this.state = {
      data: this.weatherData,
    }
  }

  weatherData = [
    {
      title: '春天',
      key: 'spring',
    },
    {
      title: '夏天',
      key: 'summer',
    },
    {
      title: '秋天',
      key: 'autumn',
    },
    {
      title: '冬天',
      key: 'winter',
    },
  ]

  renderItem = ({ item }) => {
    return <WeatherItem item={item} />
  }

  renderWeather = () => {
    return (
      <FlatList
        data={this.state.data}
        renderItem={this.renderItem}
        keyExtractor={item => item.key}
        extraData={this.state.count}
      />
    )
  }

  render() {
    return (
      <Container
        ref={ref => (this.Container = ref)}
        headerProps={{
          title: '选择特效',
          navigation: this.props.navigation,
        }}
        bottomProps={{ type: 'fix' }}
      >
        {this.renderWeather()}
      </Container>
    )
  }
}

class WeatherItem extends React.Component {
  props: {
    item: Object,
    currentItemKey: String,
  }

  constructor(props) {
    super(props)
    this.path =
      global.homePath + `/iTablet/Common/Weather/${this.props.item.key}.mp4`
    let isCurrent = this.props.currentItemKey === this.props.item.key

    this.state = {
      status: isCurrent ? 2 : 1, //0.未下载 1.未使用 2.使用中 3.下载中
    }
  }

  componentDidMount() {
    this.getStatus()
  }

  getStatus = async () => {
    let isExist = await FileTools.fileIsExist(this.path)
    if (!isExist) {
      this.setState({
        status: 0,
      })
    }
  }

  download = async () => {
    this.setState({
      status: 3,
    })
    Toast.show('开始下载')
    try {
      let result = false
      let path = global.homePath + '/iTablet/Common/Weather/'
      await FileTools.createDirectory(path)
      let onlineservice = new OnlineServicesUtils('online')
      let item = await onlineservice.getPublicDataByName(
        '927528',
        this.props.item.key + '.mp4',
      )
      if (item) {
        let dataId = item.id
        let dataUrl =
          'https://www.supermapol.com/web/datas/' + dataId + '/download'
        let preProgress = 0
        await RNFS.downloadFile({
          fromUrl: dataUrl,
          toFile: this.path,
          background: true,
          progress: res => {
            let value = ~~res.progress.toFixed(0)
            if (value !== preProgress) {
              preProgress = value
            }
          },
        }).promise
        result = true
      }

      this.setState({
        status: result ? 1 : 0,
      })
      Toast.show(result ? '下载成功' : '下载失败')
    } catch (e) {
      this.setState({
        status: 0,
      })
      Toast.show('下载失败')
    }
  }

  render() {
    let text = ''
    let color = { backgroundColor: '#1296db' }
    switch (this.state.status) {
      case 0:
        text = '下载'
        break
      case 1:
        text = '切换'
        break
      case 2:
        text = '切换'
        color = { backgroundColor: 'grey' }
        break
      case 3:
        text = '下载中'
        break
    }
    return (
      <View
        style={{
          height: 80,
          flexDirection: 'row',
          flex: 1,
          paddingHorizontal: 20,
        }}
      >
        <Text style={{ flex: 1, color: 'black' }}>{this.props.item.title}</Text>
        <TouchableOpacity
          style={[
            {
              height: scaleSize(60),
              width: scaleSize(100),
              borderRadius: scaleSize(10),
              justifyContent: 'center',
              alignItems: 'center',
            },
            color,
          ]}
          onPress={() => {
            if (this.state.status === 1) {
              SARWeather.setWeather(this.path)
              NavigationService.goBack()
            } else if (this.state.status === 0) {
              this.download(this.props.item.key)
            }
          }}
        >
          <Text style={{ color: 'white' }}>{text}</Text>
        </TouchableOpacity>
      </View>
    )
  }
}
