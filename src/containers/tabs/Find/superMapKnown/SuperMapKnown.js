import React, { Component } from 'react'
import { FlatList, Image, TouchableOpacity, View, Text} from 'react-native'
import NavigationService from '../../../NavigationService'
import { Container } from '../../../../components'
import styles from './styles'
// import { SOnlineService } from 'imobile_for_reactnative'
import { Toast, OnlineServicesUtils } from '../../../../utils'
import { getLanguage } from '../../../../language/index'
import { FileTools } from '../../../../native'
import { RNFS  } from 'imobile_for_reactnative'
import { color } from '../../../../styles'

export default class SuperMapKnown extends Component {
  props: {
    navigation: Object,
  }
  constructor(props) {
    super(props)
    const params = this.props.route.params
    this.type = params.type
    this.state = {
      data: [],
    }
    this.Edition = '' //记录版本号
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

      //版本号文件，控制是否重新下载文件
      let Editiondata = await JSOnlineService.getPublicDataByName(
        '927528',
        'SuperMapGroupEdition.geojson',
      )
      let Editionurl = `https://www.supermapol.com/web/datas/${Editiondata.id}/download`
      let EditionfileCachePath = await FileTools.appendingHomeDirectory(
        '/iTablet/Cache/' + Editiondata.fileName,
      )

      if (await RNFS.exists(EditionfileCachePath)) {
        this.Edition = await RNFS.readFile(EditionfileCachePath)
        await RNFS.unlink(EditionfileCachePath)
      }

      let EditiondownloadOptions = {
        fromUrl: Editionurl,
        toFile: EditionfileCachePath,
        background: true,
        fileName: Editiondata.fileName,
        progressDivider: 1,
      }

      await RNFS.downloadFile(EditiondownloadOptions).promise
      if (await RNFS.exists(EditionfileCachePath)) {
        let EditionfileStr = await RNFS.readFile(EditionfileCachePath)
        if(this.Edition !== EditionfileStr)
        {
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
            this.setState({ data: data })
          }
        } else {
          if (await RNFS.exists(fileCachePath)) {
            let fileStr = await RNFS.readFile(fileCachePath)
            let data = JSON.parse(fileStr)
            this.setState({ data: data })
          }else{
            let downloadOptions = {
              fromUrl: url,
              toFile: fileCachePath,
              background: true,
              fileName: data.fileName,
              progressDivider: 1,
            }
            await RNFS.downloadFile(downloadOptions).promise
            let fileStr = await RNFS.readFile(fileCachePath)
            let _data = JSON.parse(fileStr)
            this.setState({ data: _data })
          }
        }

        if (this.props.route.params.callback != null) {
          this.props.route.params.callback()
        }
      }

    } catch (error) {
      Toast.show(getLanguage(global.language).Prompt.NETWORK_REQUEST_FAILED)
    }
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



  render() {
    var tempTitle
    switch (this.type) {
      case 'SuperMapKnow':
        tempTitle = getLanguage(global.language).Prompt.SUPERMAP_KNOW
        break
      case 'SuperMapGroup':
        tempTitle = getLanguage(global.language).Prompt.SUPERMAP_GROUP
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
        />
      </Container>
    )
  }
}
