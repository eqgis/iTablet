import React from 'react'
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  ListRenderItemInfo,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import Container from '../../Container'
import { getLanguage } from '../../../language'
import { RNFS } from 'imobile_for_reactnative'
import { scaleSize, screen } from '../../../utils'
import { size, color } from '../../../styles'
import Orientation from 'react-native-orientation'
import { ImageUtils } from '.'
import CameraRoll, { AssetType } from '@react-native-community/cameraroll'
import { MainStackScreenNavigationProps, MainStackScreenRouteProp } from '@/types'
import { EmitterSubscription } from 'react-native'
import { AssetItem, SelectedItems } from './types'

interface Props {
  navigation: MainStackScreenNavigationProps<'AlbumView'>,
  route: MainStackScreenRouteProp<'AlbumView'>,
}

interface State {
  column: number,
  selectedItems: SelectedItems,
  orientation: string,
  assets: AssetItem[],
}

export default class AlbumView extends React.PureComponent<Props, State> {

  groupName: string
  assetType: AssetType
  endCursor: string | undefined
  hasNextPage: boolean
  pageSize = 30
  windowChangeListener: EmitterSubscription | undefined | null

  constructor(props: Props) {
    super(props)
    const params = props.route.params
    this.groupName = props.route.params.groupName
    this.assetType = props.route.params.assetType || 'All'
    const selectItems = JSON.parse(JSON.stringify(params.selectedItems)) || {}
    if (!selectItems[this.groupName]) {
      selectItems[this.groupName] = []
    }
    this.state = {
      column: params.column || 4,
      selectedItems: selectItems,
      orientation: screen.getOrientation(),
      assets: [],
    }
    this.hasNextPage = true
  }

  componentDidMount() {
    this.windowChangeListener = Dimensions.addEventListener('change', this._onWindowChanged)
    this.getPhotos(this.groupName, 50, this.assetType)
  }

  componentWillUnmount() {
    this.windowChangeListener?.remove()
  }

  componentDidUpdate() {
    if (Platform.OS === 'ios') {
      Orientation.getSpecificOrientation((e, orientation) => {
        this.setState({orientation: orientation})
      })
    }
  }

  getPhotos = async (groupName: string, count = 50, assetType?: AssetType | undefined) => {
    let arr: AssetItem[] = []
    try {
      if (!this.hasNextPage) return
      const result = await CameraRoll.getPhotos({
        first: count,
        after: this.endCursor,
        groupName: groupName,
        groupTypes: Platform.OS === 'ios' && groupName === 'Recent Photos' ? 'All' : 'Album', // 若不设置,iOS会在所有图片分类中去找
        assetType: assetType || 'All',
        include: ['location', 'playableDuration', 'fileSize']
      })
      this.hasNextPage = result.page_info.has_next_page
      if (result.page_info.has_next_page) {
        this.endCursor = result.page_info.end_cursor
      } else {
        this.endCursor = undefined
      }
      arr = result.edges.map(item => {
        const image = item.node.image
        const node = JSON.parse(JSON.stringify(item.node))
        delete node.image
        return Object.assign({}, image, node)
      })
    } catch(e) {
      arr = []
    } finally {
      this.setState({
        assets: this.state.assets.concat(arr),
      })
    }
  }

  getSelectedLength = () => {
    let length = 0
    for (const key in this.state.selectedItems) {
      if (Object.prototype.hasOwnProperty.call(this.state.selectedItems, key)) {
        const element = this.state.selectedItems[key]
        length += element.length
      }
    }
    return length
  }

  render() {
    return (
      <Container
        style={[
          {
            paddingTop:
              screen.isIphoneX() &&
              this.state.orientation.indexOf('PORTRAIT') >= 0
                ? screen.X_TOP
                : 0,
            paddingBottom: screen.getIphonePaddingBottom(),
            ...screen.getIphonePaddingHorizontal(
              this.state.orientation,
            ),
          },
          styles.view,
        ]}
        showFullInMap={true}
        headerProps={{
          title: this.groupName,
          navigation: this.props.navigation,
          backAction: this._clickBack,
          headerRight: [
            <TouchableOpacity
              key={'addImage'}
              onPress={this._onFinish.bind(this, {})}
            >
              <Text style={styles.headerRight}>
                {getLanguage(global.language).Analyst_Labels.CANCEL}
              </Text>
            </TouchableOpacity>,
          ],
          headerStyle: {
            paddingTop: this.state.orientation.indexOf('LANDSCAPE') !== 0 && (
              screen.isIphoneX()
                ? screen.X_TOP
                : (Platform.OS === 'ios' ? 20 : 0)
            )
          },
        }}
      >
        <FlatList
          key={this._column()}
          style={[styles.list]}
          renderItem={this._renderItem}
          data={this.state.assets}
          keyExtractor={item => item.uri}
          numColumns={this._column()}
          extraData={this.state}
          onEndReached={() => this.getPhotos(this.groupName, 30, this.assetType)}
          onEndReachedThreshold={0.5}
        />
        {this._renderBottomView()}
      </Container>
    )
  }

  renderDuration = (sec: number) => {
    let m = 0,
      duration = '0'
    if (sec !== null) {
      if (sec > 60) {
        m = Math.floor(sec / 60)
        sec -= 60 * m
      }
      const s = parseInt(sec.toFixed())

      duration = (m >= 10 ? '' : '0') + m + ':' + (s >= 10 ? '' : '0') + s
    }
    return <Text style={styles.duration}>{duration}</Text>
  }

  _renderItem = ({ item, index }: ListRenderItemInfo<AssetItem>) => {
    const edge = Dimensions.get('window').width / this._column() - 2
    const isSelected = (this.state.selectedItems[this.groupName] || []).some(
      obj => obj.uri === item.uri,
    )
    const backgroundColor = isSelected ? '#e15151' : 'transparent'
    const hasIcon =
      isSelected || this.getSelectedLength() < this.props.route.params.maxSize
    return (
      <TouchableOpacity onPress={() => this._clickCell(item)}>
        <View style={{ padding: 1 }}>
          <Image
            key={index}
            source={{
              uri:
                (Platform.OS === 'android' &&
                item.uri.indexOf('file://') === -1 &&
                item.uri.indexOf('content://') === -1
                  ? 'file://'
                  : '') + item.uri,
            }}
            style={{ width: edge, height: edge, overflow: 'hidden' }}
            resizeMode="cover"
          />
          {
            item.playableDuration !== null &&
            item.playableDuration >= 0 &&
            item.type.toLowerCase().indexOf('video') >= 0 &&
            this.renderDuration(item.playableDuration)}
          {hasIcon && (
            <View style={styles.selectView}>
              <View style={[styles.selectIcon, { backgroundColor }]}>
                {isSelected && (
                  <Image
                    source={require('./images/check_box.png')}
                    style={styles.selectedIcon}
                  />
                )}
              </View>
            </View>
          )}
        </View>
      </TouchableOpacity>
    )
  }

  _renderBottomView = () => {
    const okButton =
      getLanguage(global.language).Analyst_Labels.ADD +
      ' (' +
      this.getSelectedLength() +
      '/' +
      this.props.route.params.maxSize +
      ')'
    return (
      <View style={[styles.bottom]}>
        <TouchableOpacity onPress={this._clickOk}>
          <Text style={styles.okButton}>{okButton}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  _onFinish = (selectedItems: SelectedItems) => {
    let data: AssetItem[] = []
    for (const key in selectedItems) {
      if (Object.prototype.hasOwnProperty.call(selectedItems, key)) {
        const element = selectedItems[key]
        data = data.concat(element)
      }
    }
    if (this.props.route.params.autoConvertPath && Platform.OS === 'ios') {
      const promises = data.map((item, index) => {
        const { uri } = item
        const params = uri.split('?')
        if (params.length < 1) {
          throw new Error('Unknown URI：' + uri)
        }
        const keyValues = params[1].split('&')
        if (keyValues.length < 2) {
          throw new Error('Unknown URI：' + uri)
        }
        const kvMaps = keyValues.reduce((prv, cur) => {
          const kv = cur.split('=')
          prv[kv[0]] = kv[1]
          return prv
        }, {})
        const itemId = kvMaps.id
        const ext = kvMaps.ext.toLowerCase()
        const destPath = RNFS.CachesDirectoryPath + '/' + itemId + '.' + ext
        let promise
        if (item.type === 'ALAssetTypePhoto') {
          promise = RNFS.copyAssetsFileIOS(uri, destPath, 0, 0)
        } else if (item.type === 'ALAssetTypeVideo') {
          promise = RNFS.copyAssetsVideoIOS(uri, destPath)
        } else {
          throw new Error('Unknown URI：' + uri)
        }
        return promise.then(resultUri => {
          data[index].uri = resultUri
        })
      })
      Promise.all(promises).then(() => {
        this.props.route.params.callback && this.props.route.params.callback(data)
      })
    } else if (this.props.route.params.autoConvertPath && Platform.OS === 'android') {
      const promises = data.map((item, index) => {
        return RNFS.stat(item.uri).then(result => {
          data[index].uri = result.originalFilepath
        })
      })
      Promise.all(promises).then(() => {
        this.props.route.params.callback && this.props.route.params.callback(data)
      })
    } else {
      this.props.route.params.callback && this.props.route.params.callback(data)
      // this.props.navigation.navigate('MapStack')
      ImageUtils.hide()
    }
  }

  _maxSizeChooseAlert = (number: number) =>
    global.language === 'EN'
      ? 'You can only choose ' + number + ' photos at most'
      : '您最多能选择' + number + '张照片'

  _clickBack = () => {
    this.props.route.params.onBack && this.props.route.params.onBack(this.groupName, this.state.selectedItems)
    this.props.navigation.goBack()
    // ImageUtils.hide()
  }

  _clickCell = (itemuri: AssetItem) => {
    let selectedItems: SelectedItems = JSON.parse(JSON.stringify( this.state.selectedItems))
    const isSelected = selectedItems[this.groupName].some(
      item => item.uri === itemuri.uri,
    )
    if (isSelected) {
      const items = selectedItems[this.groupName].filter(
        item => item.uri !== itemuri.uri,
      )
      selectedItems[this.groupName] = items
      this.setState({
        selectedItems: selectedItems,
      })
    } else if (this.getSelectedLength() >= this.props.route.params.maxSize) {
      if (this.props.route.params.maxSize === 1) {
        selectedItems = {
          [this.groupName]: [itemuri],
        }
        this.setState({
          selectedItems: selectedItems,
        })
      } else {
        Alert.alert('', this._maxSizeChooseAlert(this.props.route.params.maxSize))
      }
    } else {
      selectedItems[this.groupName].push(itemuri)
      this.setState({
        selectedItems: selectedItems,
      })
    }
  }

  _clickOk = () => {
    if (this.getSelectedLength() > 0) {
      this._onFinish(this.state.selectedItems)
    }
  }

  _column = () => {
    const width = screen.getScreenWidth(this.state.orientation)
    const height = screen.getScreenHeight(this.state.orientation)
    if (width < height) {
      return this.state.column
    } else {
      const edge = (height * 1.0) / 3
      return parseInt(width / edge + '')
    }
  }

  _onWindowChanged = () => {
    setTimeout(() => {
      this.forceUpdate()
    }, 100)
  }
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: '#201F20',
  },
  headerRight: {
    color: color.content,
    minWidth: scaleSize(100),
    fontSize: size.fontSize.fontSizeXXl,
    textAlign: 'right',
  },
  safeView: {
    flex: 1,
  },
  list: {
    flex: 1,
    backgroundColor: 'white',
  },
  selectView: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 30,
    height: 30,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  selectIcon: {
    marginTop: 2,
    marginRight: 2,
    width: 20,
    height: 20,
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 10,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  selectedIcon: {
    width: 13,
    height: 13,
  },
  bottom: {
    height: scaleSize(80),
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: color.white,
  },
  previewButton: {
    marginLeft: 10,
    padding: 5,
    fontSize: 16,
    color: '#666666',
  },
  okButton: {
    marginRight: 15,
    paddingHorizontal: scaleSize(15),
    paddingVertical: scaleSize(10),
    borderRadius: 6,
    overflow: 'hidden',
    fontSize: size.fontSize.fontSizeMd,
    color: 'white',
    backgroundColor: '#4680DF',
  },
  duration: {
    position: 'absolute',
    bottom: scaleSize(8),
    right: scaleSize(8),
    color: 'white',
    fontSize: 14,
  },
})
