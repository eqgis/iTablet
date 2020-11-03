import * as React from 'react'
import { SARWeather } from 'imobile_for_reactnative'
import { Container } from '../../components'
import { scaleSize, OnlineServicesUtils, Toast } from '../../utils'
import { View, TouchableOpacity, FlatList, Text, ListRenderItemInfo } from 'react-native'
import NavigationService from '../NavigationService'
import { FileTools } from '../../native'
import { getLanguage } from '../../language'
import { NavigationScreenProp } from 'react-navigation'
import  { Downloads, IDownloadProps } from '../../redux/models/down'

interface IProps {
  navigation: NavigationScreenProp<{}>
  downloads: Downloads,
  downloadFile: (param: IDownloadProps) => void
}

interface IState {
  data: IWeather[]
}

interface IWeather {
  title: string,
  key: string,
}

export default class ChooseWeather extends React.Component<IProps, IState> {
    /** 当前使用的特效名 string */
  currentItemKey: string
    /** 切换特效回调 function */
  onSelectCallback: (key: string) => void

  constructor(props: IProps) {
    super(props)
    let params = this.props.navigation.state.params || {}
    this.currentItemKey = params.currentItemKey || ''
    this.onSelectCallback = params.onSelectCallback
    this.state = {
      data: this.weatherData,
    }
  }

  weatherData = [
    {
      title: GLOBAL.language === 'CN' ? '春天' : 'spring',
      key: 'SpringFlower',
    },
    {
      title: GLOBAL.language === 'CN' ? '夏天' : 'summer',
      key: 'CloudLightening',
    },
    {
      title: GLOBAL.language === 'CN' ? '秋天' : 'autumn',
      key: 'AutumnLeave',
    },
    {
      title: GLOBAL.language === 'CN' ? '冬天' : 'winter',
      key: 'Snow',
    },
    {
      title: GLOBAL.language === 'CN' ? '雪花' : 'snow',
      key: 'CartoonSnow',
    },
    {
      title: GLOBAL.language === 'CN' ? '云' : 'Clouds',
      key: 'Clouds',
    },
  ]

  renderItem = ({item}: ListRenderItemInfo<IWeather>) => {
    return (
      <WeatherItem
        item={item}
        downloads={this.props.downloads}
        downloadFile={this.props.downloadFile}
        currentItemKey={this.currentItemKey}
        onSelectCallback={this.onSelectCallback}
      />
    )
  }

  renderWeather = () => {
    return (
      <FlatList
        data={this.state.data}
        renderItem={this.renderItem}
        keyExtractor={item => item.key}
        extraData={this.props.downloads}
      />
    )
  }

  render() {
    return (
      <Container
        headerProps={{
          title: getLanguage(GLOBAL.language).Map_Main_Menu
            .MAP_AR_SELECT_EFFECT,
          navigation: this.props.navigation,
        }}
        bottomProps={{ type: 'fix' }}
      >
        {this.renderWeather()}
      </Container>
    )
  }
}

interface IWeatherProps {
  item: IWeather,
  currentItemKey: String,
  downloads: Downloads,
  downloadFile: (param: IDownloadProps) => void,
  onSelectCallback: (key: string) => void,
}

interface IWeatherState {
  /** 0.未下载 1.未使用 2.使用中 3.下载中 */
  status: number
}

class WeatherItem extends React.Component<IWeatherProps, IWeatherState> {
  /** 特效视频路径 */
  path: string
  /** 下载进度查询timer */
  timer: NodeJS.Timer | null

  constructor(props: IWeatherProps) {
    super(props)
    this.path =
      GLOBAL.homePath + `/iTablet/Common/Weather/${this.props.item.key}.mp4`
    let isCurrent = this.props.currentItemKey === this.props.item.key

    this.state = {
      status: isCurrent ? 2 : 1,
    }
    this.timer = null
  }

  componentDidMount() {
    this.getStatus()
  }

  componentWillUnmount() {
    this.removeDownloadListner()
  }

  /** 获取并设置此特效的状态 */
  getStatus = async () => {
    if (this.state.status !== 2) {
      let progress = this.getDownloadProgress()
      if (progress > 0) {
        this.setState({
          status: 3,
        })
        this.addDownloadListener()
      } else {
        let isExist = await FileTools.fileIsExist(this.path)
        if (!isExist) {
          this.setState({
            status: 0,
          })
        }
      }
    }
  }

  /**
   * 获取下载进度
   * @returns {Number} 下载进度，1-100。未下载时返回-1
   */
  getDownloadProgress = () => {
    let downloads = this.props.downloads
    if (downloads.length > 0) {
      for (let i = 0; i < downloads.length; i++) {
        if (
          downloads[i].id === this.props.item.key &&
          !downloads[i].downloaded
        ) {
          return downloads[i].progress
        }
      }
    }
    return -1
  }

  /** 从online上下载特效视频 */
  download = async () => {
    this.setState({
      status: 3,
    })
    try {
      let path = GLOBAL.homePath + '/iTablet/Common/Weather/'
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
        await this.props.downloadFile({
          key: this.props.item.key,
          fromUrl: dataUrl,
          toFile: this.path,
          background: true,
        })
        this.addDownloadListener()
      }
    } catch (e) {
      this.setState({
        status: 0,
      })
      Toast.show(getLanguage(GLOBAL.language).Prompt.DOWNLOAD_FAILED)
    }
  }

  /** 下载完成监听 */
  addDownloadListener = () => {
    this.timer = setInterval(() => {
      let downloaded = false
      let downloads = this.props.downloads
      if (downloads.length > 0) {
        for (let i = 0; i < downloads.length; i++) {
          if (downloads[i].id === this.props.item.key) {
            downloaded = downloads[i].downloaded
            break
          }
        }
      }
      if (downloaded) {
        this.setState({
          status: 1,
        })
        this.removeDownloadListner()
      }
    }, 2000)
  }

  /** 移除下载监听 */
  removeDownloadListner() {
    if (this.timer !== null) {
      clearInterval(this.timer)
      this.timer = null
    }
  }

  render() {
    let text = ''
    let color = { backgroundColor: '#1296db' }
    let progress
    switch (this.state.status) {
      case 0:
        text = getLanguage(GLOBAL.language).Prompt.DOWNLOAD
        break
      case 1:
        text = getLanguage(GLOBAL.language).Profile.SWITCH
        break
      case 2:
        text = getLanguage(GLOBAL.language).Profile.SWITCH
        color = { backgroundColor: 'grey' }
        break
      case 3:
        text = getLanguage(GLOBAL.language).Prompt.DOWNLOADING
        progress = this.getDownloadProgress()
        if (progress > -1) {
          text = progress + '%'
        }
        break
    }
    return (
      <View>
        <View
          style={{
            height: scaleSize(100),
            flexDirection: 'row',
            flex: 1,
            paddingHorizontal: 25,
            alignItems: 'center',
          }}
        >
          <Text style={{ flex: 1, color: 'black', fontSize: scaleSize(26) }}>
            {this.props.item.title}
          </Text>
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
                this.props.onSelectCallback &&
                  this.props.onSelectCallback(this.props.item.key)
                NavigationService.goBack()
              } else if (this.state.status === 0) {
                this.download()
              }
            }}
          >
            <Text style={{ color: 'white' }}>{text}</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            marginLeft: 25,
            height: 1,
            flex: 1,
            backgroundColor: '#EFEFEF',
          }}
        />
      </View>
    )
  }
}
