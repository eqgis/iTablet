import React from 'react'
import { View, TouchableOpacity, FlatList, Image, Text, Platform } from 'react-native'
import { Container, PopMenu, MediaItem, ImagePicker, MediaPager } from '../../../../../src/components'
import { getLanguage } from '../../../../../src/language'
import { scaleSize } from '../../../../../src/utils'
import styles from './styles'

export default class TourEditPage extends React.Component {
  props: {
    language: string,
    device: Object,
    navigation: Object,
  }

  constructor(props) {
    super(props)
    let { params } = this.props.route
    this.state = {
      data: params.data || [],
    }
  }

  _renderItem = ({ item, index }) => {
    return (
      <MediaItem
        data={item}
        index={index}
        onPress={({ data, index }) => {
          if (data === '+') {
            this.openAlbum()
          } else {
            const itemInfo = this.state.data[index]
            let imgPath = itemInfo.uri
            if (
              Platform.OS === 'android' &&
              imgPath.toLowerCase().indexOf('content://') !== 0
            ) {
              imgPath = 'file://' + imgPath
            }
            this.mediaViewer && this.mediaViewer.setVisible(true, index)
          }
        }}
        onDeletePress={item => {
          this.deleteMediaFile(item.index)
        }}
        onLongPress={() => {
          for (let ref of this.mediaItemRef) {
            if (ref.props.data !== '+') ref.setDelete && ref.setDelete(true)
          }
          this.setState({
            showDelete: true,
          })
        }}
      />
    )
  }

  addMediaFiles = async (images = []) => {
    let data = [...this.state.data]

    images.forEach(item => {
      let path
      if (typeof item === 'string') {
        path = item
        if (item.indexOf('file://') === 0) {
          path = item.replace('file://', '')
        }
        data.push(path)
      } else {
        path = item.path || item.uri
        if (path.indexOf('file://') === 0) {
          path = path.replace('file://', '')
        }
        data.push(path)
      }
    })
    data = [...new Set(data)]

    let paths = await this.dealData(data)

    this.mediaItemRef = []
    this.setState({
      data,
      paths,
    })
  }

  deleteMediaFile = async index => {
    if (index >= this.state.data.length) return
    let data = [...this.state.data]

    data.splice(index, 1)

    let paths = await this.dealData(data)

    this.mediaItemRef = []
    this.setState({
      data,
      paths,
    })
  }

  openAlbum = () => {
    ImagePicker.AlbumListView.defaultProps.showDialog = false
    ImagePicker.AlbumListView.defaultProps.dialogConfirm = null
    ImagePicker.AlbumListView.defaultProps.assetType = 'All'
    ImagePicker.AlbumListView.defaultProps.groupTypes = 'All'
    ImagePicker.getAlbum({
      maxSize: 1,
      callback: async data => {
        if (data.length > 0) {
          // TODO 添加
          // this.addMediaFiles(data)
        }
      },
    })
  }

  // renderAlbum = () => {
  //   let data = [...this.state.paths]
  //   if (!this.state.showDelete && this.state.paths.length < 9) {
  //     data.push('+')
  //   }
  //   return (
  //     <TableList
  //       style={[styles.tableView, { width: '100%' }]}
  //       cellStyle={styles.tableCellView}
  //       rowStyle={styles.tableRowStyle}
  //       lineSeparator={20}
  //       column={3}
  //       data={data}
  //       renderCell={this.renderImage}
  //     />
  //   )
  // }

  _getMenuData = () => {
    let data = [
      {
        title: getLanguage(this.props.language).Prompt.RENAME,
        action: this._onToggleAccount,
      },
      {
        title: getLanguage(this.props.language).Map_Main_Menu.SHARE,
        action: this._logoutConfirm,
      },
      {
        title: getLanguage(this.props.language).Profile.DELETE,
        action: this._onToggleAccount,
        titleStyle: {
          color: 'red',
        },
      },
      {
        title: getLanguage(this.props.language).Prompt.CANCEL,
        action: this._logoutConfirm,
      },
    ]
    return data
  }

  renderPopMenu = () => {
    return (
      <PopMenu
        ref={ref => (this.popup = ref)}
        getData={this._getMenuData}
        device={this.props.device}
        hasCancel={false}
      />
    )
  }

  showMorePop = event => {
    this.popup.setVisible(true, {
      x: event.nativeEvent.pageX,
      y: event.nativeEvent.pageY,
    })
  }

  renderListFooter = () => {
    return (
      <View style={styles.footer}>
        <Text>{getLanguage(this.props.language).Tour.PHOTO_CONNECTION_SEQUENCE}</Text>
        <Image source={require('../../../../../src/assets/Mine/mine_my_arrow.png')}/>
      </View>
    )
  }

  render() {
    let imgSize = scaleSize(60)
    if (this.props.device) {
      imgSize =
        this.props.device.orientation.indexOf('LANDSCAPE') === 0
          ? scaleSize(40)
          : scaleSize(60)
    }
    return (
      <Container
        ref={ref => (this.container = ref)}
        headerProps={{
          title: this.title,
          navigation: this.props.navigation,
          withoutBack: true,
          headerRight: (
            <TouchableOpacity
              onPress={event => this.showMorePop(event)}
              style={styles.moreView}
            >
              <Image
                resizeMode={'contain'}
                source={require('../../../../../src/assets/home/Frenchgrey/icon_else_selected.png')}
                style={[styles.moreImg, { width: imgSize, height: imgSize }]}
              />
            </TouchableOpacity>
          ),
        }}
      >
        <FlatList
          ItemSeparatorComponent={this._renderItemSeparatorComponent}
          style={styles.container}
          data={this.state.data}
          renderItem={this._renderItem}
          keyExtractor={this._keyExtractor}
          numColumns={3}
          ListFooterComponent={this.renderListFooter}
        />
        {this.renderPopMenu()}
        <MediaPager
          ref={ref => (this.mediaViewer = ref)}
          data={this.state.paths}
          withBackBtn
          isModal
        />
      </Container>
    )
  }
}