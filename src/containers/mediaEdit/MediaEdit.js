/**
 * 多媒体编辑界面
 */
import * as React from 'react'
import { ScrollView, TouchableOpacity, Text, Platform, View } from 'react-native'
import {
  Container,
  TextBtn,
  ListItem,
  TableList,
  MediaPager,
  PopView,
  ImagePicker,
} from '../../components'
import { SimpleDialog } from '../tabs/Friend'
import { Toast, checkType, OnlineServicesUtils } from '../../utils'
import { FileTools } from '../../native'
import { ConstPath, UserType } from '../../constants'
import styles from './styles'
import MediaItem from './MediaItem'
import { getLanguage } from '../../language'
import NavigationService from '../../containers/NavigationService'
// import ImagePicker from 'react-native-image-crop-picker'
import { SMediaCollector, SOnlineService, SMap, SCoordination } from 'imobile_for_reactnative'
import * as RNFS from 'react-native-fs'
import ImageResizer from 'react-native-image-resizer'

const COLUMNS = 3
const MAX_FILES = 9

export default class MediaEdit extends React.Component {
  props: {
    navigation: Object,
    user: Object,
    language: String,
    device: Object,
    currentTask: Object,
  }

  constructor(props) {
    super(props)
    const { params } = this.props.navigation.state || {}
    this.info = (params && params.info) || {}
    this.cb = (params && params.cb) || {}
    let paths = []

    this.showInfo = {
      mediaName: this.info.mediaName || '',
      coordinate: this.info.coordinate || '',
      modifiedDate: this.info.modifiedDate || '',
      description: this.info.description || '',
      httpAddress: this.info.httpAddress || '',
      mediaFilePaths: this.info.mediaFilePaths || [],
      mediaServiceIds: this.info.mediaServiceIds || [],
    }
    this.state = {
      ...this.showInfo,
      paths,
      showDelete: false,
      showBg: false,
    }
    this.mediaItemRef = []
    this.modifiedData = {} // 修改的信息
    this._newMediaFiles = [] // 临时存放要提交的新多媒体文件
    this._ids = [] // 临时存放要提交的新多媒体文件ID
    if (GLOBAL.coworkMode && GLOBAL.Type.indexOf('3D') < 0 && this.props.user?.currentUser) {
      if (UserType.isOnlineUser(this.props.user.currentUser)) {
        this.servicesUtils = new SCoordination('online')
        this.onlineServicesUtils = new OnlineServicesUtils('online')
      } else if (UserType.isIPortalUser(this.props.user.currentUser)){
        this.servicesUtils = new SCoordination('iportal')
        this.onlineServicesUtils = new OnlineServicesUtils('iportal')
      }
    }
  }

  componentDidMount() {
    (async function() {
      let paths = await this.dealData(this.state.mediaFilePaths)
      this.checkMedia(paths)
      this.setState({
        paths,
      })
    }.bind(this)())
  }

  componentWillUnmount() {
    this.servicesUtils = null
    this.onlineServicesUtils = null
  }

  shouldComponentUpdate(nextProps, nextState) {
    let shouldUpdate =
      JSON.stringify(nextProps.user) !== JSON.stringify(this.props.user) ||
      nextProps.language !== this.props.language ||
      JSON.stringify(nextState) !== JSON.stringify(this.state) ||
      JSON.stringify(nextProps.device) !== JSON.stringify(this.props.device)
    return shouldUpdate
  }

  /**
   * 检测数据服务的图片是否存在，不存在则下载
   */
  checkMedia = async (paths = []) => {
    // 若没有在线图片,则不下载
    if (this.info.mediaServiceIds.length === 0) return
    // 图片数量和图片id数量保持一致
    // if (paths.length !== this.info.mediaServiceIds.length) return
    const URL = this.onlineServicesUtils.serverUrl + '/datas/%@/download'
    for (let i = 0; i < paths.length; i++) {
      let path = paths[i].uri + ''
      // iTablet/User/ysl0917/Data/Media/8ffc99d6-1330-4794-82d5-a2daf9001021.jpg
      // if (!path.includes(`/${this.props.user.currentUser.userName}/`)) {
      //   let path1 = path.substr(0, path.indexOf('iTablet/User/') + 13)
      //   let path2 = path.substr(path.indexOf('/Data/Media/'))

      //   path = path1 + this.props.user.currentUser.userName + path2
      //   paths[i].uri = path
      // }
      let id = this.info.mediaServiceIds[i]
      if (!(await FileTools.fileIsExist(path)) && id !== undefined) {
        let url = URL.replace('%@', id)
        const downloadOptions = {
          fromUrl: url,
          toFile: path,
          background: true,
          ...Platform.select({
            android: {
              headers: {
                cookie: await SOnlineService.getAndroidSessionID(),
              },
            },
          }),
          progress: res => {
            if (res.progress === 100) {
              this.mediaItemRef[i].forceUpdate()
              // this.tableList.forceUpdate()
            }
          },
        }
        
        await RNFS.downloadFile(downloadOptions).promise
      }
    }
  }

  dealData = async (mediaPaths = []) => {
    let paths = []
    for (let item of mediaPaths) {
      const type = checkType.getMediaTypeByPath(item)
      let info,
        path = item
      if (type === 'video') {
        if (item.indexOf('file://') === 0) {
          path = item.replace('file://', '')
          // item = path
        } else if (item.indexOf('/iTablet') === 0) {
          path = await FileTools.appendingHomeDirectory(item)
        }
        info = await SMediaCollector.getVideoInfo(path)
      } else if (item.indexOf('/iTablet') === 0) {
        // 判断是否是已存的图片
        path = await FileTools.appendingHomeDirectory(item)
      }
      paths.push({
        ...info,
        uri: path,
        type,
      })
    }
    return paths
  }

  uploadMedia = async mediaFilePaths => {
    let resourceIds = []
    try {
      if (GLOBAL.coworkMode && mediaFilePaths.length > 0) {
        // _mediaPaths = [] // 保存修改名称后的图片地址
        for (let i = 0 ; i < mediaFilePaths.length; i++) {
          let name = mediaFilePaths[i].substr(mediaFilePaths[i].lastIndexOf('/') + 1)
          // let suffix = mediaFilePaths[i].substr(mediaFilePaths[i].lastIndexOf('.') + 1)
          //获取缩略图
          // let resizedImageUri = await ImageResizer.createResizedImage(
          //   mediaFilePaths[i],
          //   60,
          //   100,
          //   'PNG',
          //   1,
          //   0,
          //   userPath,
          // )
          let resourceId = await this.onlineServicesUtils.uploadFile(
            mediaFilePaths[i],
            name,
            'PHOTOS',
          )
          // await RNFS.unlink(resizedImageUri.path)
          // TODO是否删除原图
          resourceIds.push(resourceId)

          // let _newPath = `${mediaFilePaths[i].replace(name, resourceId)}.${suffix}`
          // _mediaPaths.push(_newPath)
        }
        // 分享到群组中
        if (resourceIds.length > 0 && this.props.currentTask.groupID) {
          let result = await this.servicesUtils?.shareDataToGroup({
            groupId: this.props.currentTask.groupID,
            ids: resourceIds,
          })
          if (result.succeed) {
            Toast.show(getLanguage(this.props.language).Friends.RESOURCE_UPLOAD_SUCCESS)
            this.cb && typeof this.cb === 'function' && this.cb()
          } else {
            Toast.show(getLanguage(this.props.language).Friends.RESOURCE_UPLOAD_FAILED)
          }
        }
      }
      return resourceIds
    } catch(e) {
      Toast.show(getLanguage(this.props.language).Friends.RESOURCE_UPLOAD_FAILED)
      return resourceIds
    }
  }

  saveHandler = () => {
    if (!this.info.layerName) {
      return
    }
    (async function() {
      try {
        this._newMediaFiles = []
        this._ids = []
        let modifiedData = [],
          deleteMedia = false // 用于删除所有图片后，提示是否删除该对象
        for (let key in this.info) {
          if (key === 'mediaServiceIds') { // 后面处理ids
            this._ids = this.state.mediaServiceIds.concat([])
            continue
          }
          if (this.showInfo[key] !== this.state[key]) {
            // 删除所有图片后，提示是否删除该对象
            if (key === 'mediaFilePaths' && this.state[key].length === 0) {
              deleteMedia = true
            }

            if (key === 'mediaFilePaths') {
              this.state.mediaFilePaths.forEach(item => {
                if (item.indexOf('/iTablet/User/') !== 0) {
                  // 把新添加的图片记录下来
                  // TODO 区分同一张图片删除后重新添加
                  this._newMediaFiles.push(item)
                }
              })
            }
            modifiedData.push({
              name: key,
              value: this.state[key],
            })
          }
        }
        if (modifiedData.length === 0) {
          Toast.show(getLanguage(this.props.language).Prompt.NO_NEED_TO_SAVE)
          return
        }
        // let targetPath = await FileTools.appendingHomeDirectory(
        //   ConstPath.UserPath +
        //     this.props.user.currentUser.userName +
        //     '/' +
        //     ConstPath.RelativeFilePath.Media,
        // )
        // let addToMap = this.info.addToMap !== undefined ? this.info.addToMap : true
        // // 若原本有图片，并有callout则不添加到地图上
        // if (this.info.mediaFilePaths.length > 0) {
        //   addToMap = false
        // }

        this.modifiedData = modifiedData
        if (deleteMedia) {
          this.deleteDialog && this.deleteDialog.setVisible(true)
        } else {
          this.save(this.modifiedData, false)
        }

        // let result = await SMediaCollector.saveMediaByDataset(
        //   this.info.layerName,
        //   this.info.geoID,
        //   targetPath,
        //   modifiedData,
        //   addToMap,
        // )
        // if (
        //   result &&
        //   Object.keys(modifiedData).length > 0 &&
        //   typeof this.cb === 'function'
        // ) {
        //   this.cb(modifiedData)
        // }
        // Toast.show(
        //   result
        //     ? getLanguage(this.props.language).Prompt.SAVE_SUCCESSFULLY
        //     : getLanguage(this.props.language).Prompt.SAVE_FAILED,
        // )
      } catch (e) {
        Toast.show(getLanguage(this.props.language).Prompt.SAVE_FAILED)
      }
    }.bind(this)())
  }

  save = async (modifiedData, isDelete = true) => {
    try {
      let targetPath = await FileTools.appendingHomeDirectory(
        ConstPath.UserPath +
          this.props.user.currentUser.userName +
          '/' +
          ConstPath.RelativeFilePath.Media,
      )
      // 在线协作，上传到服务器
      if (GLOBAL.coworkMode) {
        const newPaths = await FileTools.copyFiles(this._newMediaFiles, targetPath)
        if (this._newMediaFiles.length > 0) {
          // let _newIds = await this.uploadMedia(this._newMediaFiles)
          let _newIds = await this.uploadMedia(newPaths)
          this._ids = this._ids.concat(_newIds)
          modifiedData.push({
            name: 'MediaServiceIds',
            value: this._ids,
          })
        } else {
          modifiedData.push({
            name: 'MediaServiceIds',
            value: this._ids,
          })
        }
      }
      let addToMap = this.info.addToMap !== undefined ? this.info.addToMap : true
      // 若原本有图片,且修改后的图片第一张与修改前一致,或者所有图片都被清除,并有callout则不添加到地图上
      if (this.info.mediaFilePaths.length > 0) {
        for (const item of modifiedData) {
          if (
            item.name === 'mediaFilePaths' && (
              item.value.length > 0 && item.value[0] === this.info.mediaFilePaths[0] || // 修改图片,且第一张图片没有变化
              item.value.length === 0 // 删除所有图片
            )) {
            addToMap = false
            break
          }
        }
      }
      let result = await SMediaCollector.saveMediaByDataset(
        this.info.layerName,
        this.info.geoID,
        targetPath,
        modifiedData,
        addToMap,
        isDelete,
      )
      let newState = {}
      if (GLOBAL.coworkMode && result) {
        this.info.mediaServiceIds = this._ids
        newState.mediaServiceIds = this._ids
        // this.setState({mediaServiceIds: this._ids})
      }
      if (
        result &&
        Object.keys(modifiedData).length > 0 &&
        typeof this.cb === 'function'
      ) {
        this.deleteDialog && this.deleteDialog.setVisible(false)
        this.cb(modifiedData)
      }
      if (result) {
        let info = await SMediaCollector.getMediaInfo(this.info.layerName, this.info.geoID)

        this.showInfo = {
          mediaName: info.mediaName || '',
          coordinate: info.coordinate || '',
          modifiedDate: info.modifiedDate || '',
          description: info.description || '',
          httpAddress: info.httpAddress || '',
          mediaFilePaths: info.mediaFilePaths || [],
          mediaServiceIds: info.mediaServiceIds || [],
        }
        Object.assign(newState, this.showInfo)

        // 保存成功,清除临时数据
        this.modifiedData = {}
        this._newMediaFiles = []
        this._ids = []
      }

      if (Object.keys(newState).length > 0) {
        this.setState(newState)
      }
      Toast.show(
        result
          ? getLanguage(this.props.language).Prompt.SAVE_SUCCESSFULLY
          : getLanguage(this.props.language).Prompt.SAVE_FAILED,
      )
    } catch (e) {
      Toast.show(getLanguage(this.props.language).Prompt.SAVE_FAILED)
    }
  }

  openAlbum = () => {
    let maxFiles = MAX_FILES - this.state.mediaFilePaths.length
    ImagePicker.AlbumListView.defaultProps.showDialog = false
    ImagePicker.AlbumListView.defaultProps.dialogConfirm = null
    ImagePicker.AlbumListView.defaultProps.assetType = 'All'
    ImagePicker.AlbumListView.defaultProps.groupTypes = 'All'
    ImagePicker.getAlbum({
      maxSize: maxFiles,
      callback: async data => {
        if (data.length > 0) {
          console.warn(JSON.stringify(data))
          this.addMediaFiles({mediaPaths: data})
        }
      },
    })
  }

  addMediaFiles = async ({mediaPaths = []}) => {
    let mediaFilePaths = [...this.state.mediaFilePaths]

    mediaPaths.forEach(item => {
      let path
      if (typeof item === 'string') {
        path = item
        if (item.indexOf('file://') === 0) {
          path = item.replace('file://', '')
        }
        mediaFilePaths.push(path)
      } else {
        path = item.path || item.uri
        if (path.indexOf('file://') === 0) {
          path = path.replace('file://', '')
        }
        mediaFilePaths.push(path)
      }
    })
    mediaFilePaths = [...new Set(mediaFilePaths)]

    let paths = await this.dealData(mediaFilePaths)

    this.mediaItemRef = []
    this.setState({
      mediaFilePaths,
      paths,
    })
  }

  deleteMediaFile = async index => {
    if (index >= this.state.mediaFilePaths.length) return
    let mediaFilePaths = [...this.state.mediaFilePaths]
    // 删除图片同时删除对应service id
    let mediaServiceIds = [...this.state.mediaServiceIds]

    if (mediaFilePaths.length > index) {
      mediaFilePaths.splice(index, 1)
    }
    if (mediaServiceIds.length > index) {
      mediaServiceIds.splice(index, 1)
    }

    let paths = await this.dealData(mediaFilePaths)

    this.mediaItemRef = []
    this.setState({
      mediaFilePaths,
      paths,
      mediaServiceIds,
    })
  }

  renderItem = ({ title, type, action, value }) => {
    return (
      <ListItem
        key={title}
        title={title}
        value={value}
        type={type}
        onPress={action}
      />
    )
  }

  renderImage = ({ item, rowIndex, cellIndex }) => {
    return (
      <MediaItem
        ref={ref => {
          if (ref && ref.props.data.uri !== '+') {
            this.mediaItemRef[rowIndex * COLUMNS + cellIndex] = ref
          }
        }}
        data={item}
        index={rowIndex * COLUMNS + cellIndex}
        onPress={({ data, index }) => {
          if (data.uri === '+') {
            // this.openAlbum()
            this.popModal && this.popModal.setVisible(true)
          } else {
            // this.imageViewer &&
            //   this.imageViewer.setVisible(true, rowIndex * COLUMNS + cellIndex)
            const itemInfo = this.state.paths[rowIndex * COLUMNS + cellIndex]
            let imgPath = itemInfo.uri
            if (
              Platform.OS === 'android' &&
              imgPath.toLowerCase().indexOf('content://') !== 0
            ) {
              imgPath = 'file://' + imgPath
            }
            // this.mediaViewer && this.mediaViewer.setVisible(true, imgPath)
            this.mediaViewer && this.mediaViewer.setVisible(true, index)
            // this.mediaViewer.setVisible(true, this.state.mediaFilePaths[rowIndex * COLUMNS + cellIndex])
          }
        }}
        onDeletePress={item => {
          this.deleteMediaFile(item.index)
        }}
        onLongPress={() => {
          for (let ref of this.mediaItemRef) {
            if (ref.props.data.uri !== '+') ref.setDelete && ref.setDelete(true)
          }
          this.setState({
            showDelete: true,
          })
        }}
      />
    )
  }

  renderAlbum = () => {
    let data = [...this.state.paths]
    if (!this.state.showDelete && this.state.paths.length < 9) {
      data.push({uri: '+', type: 'addMedia'})
    }
    return (
      <TableList
        ref={ref => this.tableList = ref}
        style={[styles.tableView, { width: '100%' }]}
        cellStyle={styles.tableCellView}
        rowStyle={styles.tableRowStyle}
        lineSeparator={20}
        column={3}
        data={data}
        renderCell={this.renderImage}
      />
    )
  }

  renderPopView = () => {
    return (
      <PopView ref={ref => (this.popModal = ref)}>
        <TouchableOpacity
          style={[styles.popBtn, { width: '100%' }]}
          onPress={() => {
            this.popModal && this.popModal.setVisible(false)
            NavigationService.navigate('Camera', {
              limit: MAX_FILES - this.state.mediaFilePaths.length,
              cb: this.addMediaFiles,
            })
          }}
        >
          <Text style={styles.popText}>
            {getLanguage(this.props.language).Map_Tools.TAKE_PHOTO}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.popBtn, { width: '100%' }]}
          onPress={() => {
            this.popModal &&
              this.popModal.setVisible(false, () => {
                this.openAlbum()
              })
          }}
        >
          <Text style={styles.popText}>
            {getLanguage(this.props.language).Map_Tools.FROM_ALBUM}
          </Text>
        </TouchableOpacity>
      </PopView>
    )
  }

  renderDeleteDialog = () => {
    return (
      <SimpleDialog
        ref={ref => (this.deleteDialog = ref)}
        text={getLanguage(this.props.language).Prompt.DELETE_OBJ_WITHOUT_MEDIA_TIPS}
        disableBackTouch={false}

        confirmAction={async () => {
          await this.save(this.modifiedData, true)
          SMap.refreshMap()
          NavigationService.goBack('MediaEdit')
        }}
        confirmText={getLanguage(this.props.language).Prompt.DELETE}
        cancelAction={() => {
          this.save(this.modifiedData, false)
        }}
        cancelText={getLanguage(this.props.language).Prompt.SAVE_YES}
      />
    )
  }

  render() {
    let coordinate =
      this.state.coordinate.x !== undefined &&
      this.state.coordinate.y !== undefined
        ? this.state.coordinate.x.toFixed(6) +
          ',' +
          this.state.coordinate.y.toFixed(6)
        : ''
    return (<>
      <Container
        ref={ref => (this.container = ref)}
        style={styles.container}
        headerProps={{
          navigation: this.props.navigation,
          headerRight: (
            <TextBtn
              btnText={
                this.state.showDelete
                  ? getLanguage(this.props.language).Prompt.COMPLETE
                  : getLanguage(this.props.language).Prompt.SAVE_YES
              }
              textStyle={styles.headerBtnTitle}
              btnClick={() => {
                if (this.state.showDelete) {
                  for (let ref of this.mediaItemRef) {
                    if (ref && ref.props.data.uri !== '+')
                      ref.setDelete && ref.setDelete(false)
                  }
                  this.setState({
                    showDelete: false,
                  })
                } else {
                  this.saveHandler()
                }
              }}
            />
          ),
        }}
      >
        <ScrollView style={{ flex: 1 }}>
          {this.renderItem({
            title: getLanguage(this.props.language).Map_Label.NAME,
            value: this.state.mediaName,
            type: 'arrow',
            action: () => {
              NavigationService.navigate('InputPage', {
                value: this.state.mediaName,
                headerTitle: getLanguage(GLOBAL.language).Map_Label.NAME,
                type: 'name',
                cb: async value => {
                  this.setState({
                    mediaName: value,
                  })
                  NavigationService.goBack()
                },
              })
            },
          })}
          {this.renderItem({
            title: getLanguage(this.props.language).Map_Main_Menu.COORDINATE,
            value: coordinate,
            type: 'arrow',
          })}
          {this.renderItem({
            title: getLanguage(this.props.language).Map_Main_Menu.COLLECT_TIME,
            value: this.state.modifiedDate,
            type: 'arrow',
          })}
          {this.renderItem({
            title: getLanguage(this.props.language).Map_Main_Menu.TOOLS_HTTP,
            value: this.state.httpAddress,
            type: 'arrow',
            action: () => {
              NavigationService.navigate('InputPage', {
                value: this.state.httpAddress,
                headerTitle: getLanguage(GLOBAL.language).Map_Main_Menu
                  .TOOLS_HTTP,
                type: 'http',
                cb: async value => {
                  this.setState({
                    httpAddress: value,
                  })
                  NavigationService.goBack()
                },
              })
            },
          })}
          {this.renderItem({
            title: getLanguage(this.props.language).Map_Main_Menu.TOOLS_REMARKS,
            value: this.state.description,
            type: 'arrow',
            action: () => {
              NavigationService.navigate('InputPage', {
                value: this.state.description,
                headerTitle: getLanguage(GLOBAL.language).Map_Main_Menu
                  .TOOLS_REMARKS,
                cb: async value => {
                  this.setState({
                    description: value,
                  })
                  NavigationService.goBack()
                },
              })
            },
          })}
          {this.renderAlbum()}
        </ScrollView>
        {this.renderPopView()}
        {/*<MediaViewer*/}
        {/*ref={ref => (this.mediaViewer = ref)}*/}
        {/*withBackBtn*/}
        {/*isModal*/}
        {/*/>*/}
        <MediaPager
          ref={ref => (this.mediaViewer = ref)}
          data={this.state.paths}
          withBackBtn
          isModal
          device={this.props.device}
          onVisibleChange={visible => {
            this.setState({
              showBg: visible,
            })
          }}
        />
        {this.renderDeleteDialog()}
      </Container>
      {/* 部分安卓设备竖屏进入MediaPager切换横屏 状态栏把MediaPager往下挤 看到底图 所以打开时显示个背景 zcj */}
      {Platform.OS === 'android' && this.state.showBg &&
        <View style={{width: '100%', height: '100%', position: 'absolute', backgroundColor: '#000'}}></View>}
    </>)
  }
}
