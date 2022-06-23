import React from 'react'
import {
  Image,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  EmitterSubscription,
  ListRenderItemInfo,
} from 'react-native'
import CameraRoll, { AssetType } from "@react-native-community/cameraroll"
import PageKeys from './PageKeys'
import Container from '../../Container'
import { InputDialog } from '../../Dialog'
import { getLanguage } from '../../../language'
import { scaleSize, screen } from '../../../utils'
import { size, color } from '../../../styles'
import Orientation from 'react-native-orientation'
import * as ImageUtils from './ImageUtils'
import { SelectedItems } from './types'

interface Props {
  maxSize: number,
  autoConvertPath: boolean,
  assetType: AssetType,
  groupTypes: string,
  choosePhotoTitle: string,
  cancelLabel: string,
  navigation: any,
  device: Device,
  showDialog?: boolean,

  callback: () => void,
  dialogConfirm: (value: string, cb?: () => void) => void,
  dialogCancel: () => void,
}

interface State {
  data: Item[],
  selectedItems: SelectedItems,
  orientation: string,
  refreshing: boolean,
}

interface Item {
  image: string;
  title: string;
  count: number;
}

export default class AlbumListView extends React.PureComponent<Props, State> {

  windowChangedListener: EmitterSubscription | undefined
  dialog: InputDialog | undefined | null

  static defaultProps = {
    maxSize: 1,
    autoConvertPath: false,
    assetType: 'Photos',
    groupTypes: 'All',
    showDialog: false,
    dialogConfirm: null,
    dialogCancel: null,
  }

  constructor(props: Props) {
    super(props)
    this.state = {
      data: [],
      selectedItems: {},
      orientation: screen.getOrientation(),
      refreshing: false,
    }
  }

  componentDidMount() {
    this.windowChangedListener = Dimensions.addEventListener('change', this._onWindowChanged);
    (async () => {
      if (this.props.showDialog && this.dialog)
        this.dialog.setDialogVisible(this.props.showDialog)
      const data = await this.getAlbums()
      this.setState({ data })
    })()
  }

  componentWillUnmount() {
    // Dimensions.removeEventListener('change', this._onWindowChanged)
    this.windowChangedListener?.remove()
  }

  componentDidUpdate() {
    if (Platform.OS === 'ios') {
      Orientation.getSpecificOrientation((e, orientation: string) => {
        this.setState({ orientation: orientation })
      })
    }
  }

  refresh = () => {
    if (this.state.refreshing) return
    this.setState({refreshing: true}, async () => {
      try {
        const data = await this.getAlbums()
        this.setState({ data, refreshing: false })
      } catch (error) {
        this.setState({ refreshing: false })
      }
    })
  }

  render() {
    console.warn(screen.getOrientation(), this.state.orientation)
    return (
      <Container
        style={[
          // styles.view,
          Platform.OS === 'ios' && {
            width: screen.getScreenSafeWidth(this.state.orientation),
            height: screen.getScreenSafeHeight(this.state.orientation),
          }
        ]}
        showFullInMap={true}
        headerProps={{
          // title: this.title,
          navigation: this.props.navigation,
          withoutBack: true,
          headerRight: [
            <TouchableOpacity key={'addImage'} onPress={() => {
              // NavigationService.goBack('ImagePickerStack')
              ImageUtils.hide()
            }}>
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
        {/*<NaviBar*/}
        {/*title={this.props.choosePhotoTitle}*/}
        {/*leftElement={[]}*/}
        {/*rightElement={this.props.cancelLabel}*/}
        {/*onRight={this._clickCancel}*/}
        {/*/>*/}
        <FlatList
          style={[styles.listView]}
          data={this.state.data}
          renderItem={this._renderItem}
          keyExtractor={item => item.title}
          extraData={this.state}
          refreshing={this.state.refreshing}
          onRefresh={this.getAlbums}
        />
        {this.props.dialogConfirm && (
          <InputDialog
            ref={ref => (this.dialog = ref)}
            title={getLanguage(global.language).Map_Main_Menu.TOUR_NAME}
            confirmAction={value => {
              this.props.dialogConfirm?.(value, () =>
                this.dialog?.setDialogVisible(false),
              )
            }}
            cancelAction={() => {
              if (this.props.dialogCancel) {
                this.props.dialogCancel()
              } else {
                this._clickCancel()
              }
            }}
            confirmBtnTitle={getLanguage(global.language).CONFIRM}
            cancelBtnTitle={getLanguage(global.language).Map_Settings.CANCEL}
          />
        )}
      </Container>
    )
  }

  _renderItem = ({ item }: ListRenderItemInfo<Item>) => {
    const selectedCount = this.state.selectedItems[item.title]?.length || 0
    const uri =
      (Platform.OS === 'android' &&
        item.image.indexOf('file://') === -1 &&
        item.image.indexOf('content://') === -1
        ? 'file://'
        : '') + item.image
    return (
      <TouchableOpacity onPress={this._clickRow.bind(this, item)}>
        <View style={styles.cell}>
          <View style={styles.left}>
            <Image
              style={styles.image}
              source={{ uri: uri }}
              resizeMode="cover"
            />
            <Text style={styles.text}>
              {/* {item.name + ' (' + item.value.length + ')'} */}
              {item.title + (item.count < 0 ? '' : (' (' + item.count + ')'))}
            </Text>
          </View>
          <View style={styles.right}>
            {selectedCount > 0 && (
              <Text style={styles.selectedcount}>{'' + selectedCount}</Text>
            )}
            <Image
              source={require('./images/arrow_right.png')}
              style={styles.arrow}
            />
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  getAlbums = async () => {
    const result = await CameraRoll.getAlbums({assetType: this.props.assetType})
    const albums = []
    for (const album of result) {
      const firstAsset = await this.getPhotos(album.title, 1)
      firstAsset.length > 0 && albums.push({
        ...album,
        image: firstAsset[0].uri,
      })
    }

    if (Platform.OS === 'ios') {
      // 为了iOS查询没有指定相簿的照片
      const firstAsset = await this.getPhotos('Recent Photos', 1)
      firstAsset.length > 0 && albums.unshift({
        title: 'Recent Photos',
        count: -1,
        image: firstAsset[0].uri,
      })
    }

    return albums
  }

  getPhotos = async (groupName: string, count: number, assetType?: AssetType | undefined) => {
    const result = await CameraRoll.getPhotos({
      first: count,
      groupName: groupName,
      groupTypes: Platform.OS === 'ios' && groupName === 'Recent Photos' ? 'All' : 'Album', // 若不设置,iOS会在所有图片分类中去找
      assetType: assetType || 'All',
      include: ['location', 'playableDuration', 'fileSize']
    })
    const arr = result.edges.map(item => {
      const image = item.node.image
      const node = JSON.parse(JSON.stringify(item.node))
      delete node.image
      return Object.assign({}, image, node)
    })
    return arr
  }

  _onBackFromAlbum = (groupName: string, selectedItems: SelectedItems) => {
    this.setState({ selectedItems: selectedItems })
  }

  _clickCancel = () => {
    this.props.callback && this.props.callback([])
    // NavigationService.goBack('ImagePickerStack')
    ImageUtils.hide()
  }

  _clickRow = (item: Item) => {
    this.props.navigation.navigate(PageKeys.album_view, {
      ...this.props,
      groupName: item.title,
      // photos: item.value,
      assetType: this.props.assetType,
      selectedItems: this.state.selectedItems,
      onBack: this._onBackFromAlbum,
    })
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
  listView: {
    flex: 1,
    backgroundColor: 'white',
  },
  cell: {
    height: scaleSize(80),
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e6e6ea',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    overflow: 'hidden',
    width: 44,
    height: 44,
  },
  text: {
    fontSize: size.fontSize.fontSizeMd,
    color: 'black',
    marginLeft: 10,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  selectedcount: {
    width: 18,
    height: 18,
    ...Platform.select({
      ios: { lineHeight: 18 },
      android: { textAlignVertical: 'center' },
    }),
    fontSize: 11,
    textAlign: 'center',
    color: 'white',
    backgroundColor: '#e15151',
    borderRadius: 9,
    overflow: 'hidden',
  },
  arrow: {
    width: 13,
    height: 16,
    marginLeft: 10,
    marginRight: 0,
  },
})
