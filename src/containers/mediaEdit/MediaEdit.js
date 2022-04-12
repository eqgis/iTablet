/**
 * 多媒体编辑界面
 */
import * as React from 'react'
import { ScrollView, TouchableOpacity, Text, Platform, View , Image, DeviceEventEmitter, RefreshControl } from 'react-native'
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
import { Toast, checkType, OnlineServicesUtils, DownloadUtil } from '../../utils'
import { FileTools } from '../../native'
import { ConstPath, UserType, ChunkType, EventConst } from '../../constants'
import { getThemeAssets } from '../../assets'
import styles from './styles'
import MediaItem from './MediaItem'
import { getLanguage } from '../../language'
import NavigationService from '../../containers/NavigationService'
// import ImagePicker from 'react-native-image-crop-picker'
import { SMediaCollector, SOnlineService, SIPortalService, SMap, SCoordination, RNFS, SARMap } from 'imobile_for_reactnative'
import PropTypes from 'prop-types'

const COLUMNS = 3
const MAX_FILES = 9

let that // 用于同步上一次进入界面,正在下载数据后退出,再次进入时,下载onProgress中的this指向上一次的界面.componentWillUnmount时记得清空

export default class MediaEdit extends React.Component {
  props: {
    navigation: Object,
    user: Object,
    language: String,
    device: Object,
    currentTask: Object,

    setCurrentLayer: PropTypes.func,
  }

  constructor(props) {
    super(props)
    const { params } = this.props.route || {}
    this.info = (params && params.info) || {}
    this.layerInfo = params && params.layerInfo
    this.cb = params && params.cb
    this.gocb = params && params.gocb
    this.backAction = params && params.backAction
    let paths = []

    this.showInfo = {
      mediaName: this.info.mediaName || '',
      coordinate: this.info.coordinate || '',
      modifiedDate: this.info.modifiedDate || '',
      description: this.info.description || '',
      httpAddress: this.info.httpAddress || '',
      mediaFilePaths: this.info.mediaFilePaths || [],
      mediaServiceIds: this.info.mediaServiceIds || [],
      mediaData: this.info.mediaData && (
        typeof this.info.mediaData === 'string' ? JSON.parse(this.info.mediaData) : this.info.mediaData
      ) || {},
      isRefresh: false,
    }
    let title = params && params.title || ''
    if (!title && this.showInfo.mediaData.type) {
      switch (this.showInfo.mediaData.type) {
        case 'AI_AGGREGATE':
          title = getLanguage(global.language).Map_Main_Menu.MAP_AR_AI_ASSISTANT_AGGREGATE_COLLECT
          break
        case 'AI_DETECT':
          title = getLanguage(global.language).Map_Main_Menu.MAP_AR_AI_ASSISTANT_TARGET_COLLECT
          break
        case 'AI_VEHICLE':
          title = getLanguage(global.language).Map_Main_Menu.MAP_AR_AI_ASSISTANT_VIOLATION_COLLECT
          break
        case 'AI_CLASSIFY':
          title = getLanguage(global.language).Map_Main_Menu.MAP_AR_AI_ASSISTANT_CLASSIFY
          break
      }
    }
    this.state = {
      ...this.showInfo,
      paths,
      title: title,
      showDelete: false,
      showBg: false,
      category:this.showInfo.mediaData.category? this.showInfo.mediaData.category : '',
    }
    this.mediaItemRef = []
    this.modifiedData = [] // 修改的信息
    this._newMediaFiles = [] // 临时存放要提交的新多媒体文件
    this._ids = [] // 临时存放要提交的新多媒体文件ID
    if (global.coworkMode && global.Type.indexOf('3D') < 0 && this.props.user?.currentUser) {
      if (UserType.isOnlineUser(this.props.user.currentUser)) {
        this.servicesUtils = new SCoordination('online')
        this.onlineServicesUtils = new OnlineServicesUtils('online')
      } else if (UserType.isIPortalUser(this.props.user.currentUser)){
        this.servicesUtils = new SCoordination('iportal')
        this.onlineServicesUtils = new OnlineServicesUtils('iportal')
      }
    }

    that = this
  }

  componentDidMount() {
    (async function() {
      this.subscription = DeviceEventEmitter.addListener(EventConst.DOWNLOAD_MEDIA, async downloadMedia => {
        DownloadUtil.downloadMedia(downloadMedia)
        downloadMedia?.progress >= 0 && this.mediaItemRef?.[0]?.undateProgress(downloadMedia?.progress)
        if (downloadMedia?.progress === 1) {
          DownloadUtil.deleteDownloadMedia({
            toPath: downloadMedia.data.toPath,
            url: downloadMedia.data.url,
          })
          let paths = await this.dealData(this.state.mediaFilePaths)
          this.setState({
            paths,
          })
        }
      })
      let paths = await this.dealData(this.state.mediaFilePaths)
      this.checkMedia(paths)
      this.setState({
        paths,
      })
    }.bind(this)())
  }

  componentWillUnmount() {
    this.subscription.remove()
    this.servicesUtils = null
    this.onlineServicesUtils = null
    that = null
  }

  shouldComponentUpdate(nextProps, nextState) {
    let shouldUpdate =
      JSON.stringify(nextProps.user) !== JSON.stringify(this.props.user) ||
      nextProps.language !== this.props.language ||
      JSON.stringify(nextState) !== JSON.stringify(this.state) ||
      JSON.stringify(nextProps.device) !== JSON.stringify(this.props.device)
    return shouldUpdate
  }

  refresh = async () => {
    try {
      this.setState({
        isRefresh: true,
      }, async () => {
        let paths = await this.dealData(this.state.mediaFilePaths)
        this.setState({
          paths,
          isRefresh: false,
        })
      })
    } catch (error) {
      this.setState({
        isRefresh: false,
      })
    }
  }

  /**
   * 检测数据服务的图片是否存在，不存在则下载
   */
  checkMedia = async (paths = []) => {
    // 若没有在线图片,则不下载
    if (this.info.mediaServiceIds?.length === 0 || !this.onlineServicesUtils) return
    // 图片数量和图片id数量保持一致
    // if (paths.length !== this.info.mediaServiceIds.length) return
    const URL = this.onlineServicesUtils.serverUrl + '/datas/%@/download'
    for (let i = 0; i < paths.length; i++) {
      let path = paths[i].uri + ''
      let id = this.info.mediaServiceIds[i]
      let url = URL.replace('%@', id)
      const downloadMedia = DownloadUtil.getDownloadMedia({
        url,
        toPath: path,
      })
      if (
        downloadMedia === undefined &&
        !(await FileTools.fileIsExist(path)) && // 检测是否下载完毕
        !(await FileTools.fileIsExist(path + '_tmp')) && // 检测是否正在下载, _tmp后缀的文件为正在下载的文件
        id !== undefined
      ) {
        let cookie = undefined
        if (UserType.isIPortalUser(this.props.user.currentUser)) {
          cookie = await SIPortalService.getIPortalCookie()
        } else if (UserType.isOnlineUser(this.props.user.currentUser)) {
          cookie = await SOnlineService.getCookie()
        }
        const downloadOptions = {
          fromUrl: url,
          toFile: path,
          background: true,
          ...Platform.select({
            android: {
              headers: {
                cookie: cookie,
              },
            },
          }),
          progress: async res => {
            if (!isNaN(res?.progress)) {
              DownloadUtil.downloadMedia({
                type: 'Media',
                progress: res.progress / 100,
                data: {
                  toPath: path,
                  url: url,
                },
              })
              that?.mediaItemRef?.[i]?.undateProgress(res.progress / 100)
              if (res.progress === 100) {
                DownloadUtil.deleteDownloadMedia({
                  toPath: path,
                  url: url,
                })
                if (that) {
                  let paths = await that.dealData(that.state.mediaFilePaths)
                  that.setState({
                    paths,
                  })
                }
              }
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
      if (global.coworkMode && mediaFilePaths.length > 0) {
        // _mediaPaths = [] // 保存修改名称后的图片地址
        for (let mediaFilePath of  mediaFilePaths) {
          let name = mediaFilePath.substr(mediaFilePath.lastIndexOf('/') + 1)
          // let suffix = mediaFilePath.substr(mediaFilePath.lastIndexOf('.') + 1)
          //获取缩略图
          // let resizedImageUri = await ImageResizer.createResizedImage(
          //   mediaFilePath,
          //   60,
          //   100,
          //   'PNG',
          //   1,
          //   0,
          //   userPath,
          // )
          let resourceId = await this.onlineServicesUtils.uploadFileWithCheckCapacity(
            mediaFilePath,
            name,
            'PHOTOS',
          )
          if (resourceId) {
            resourceIds.push(resourceId)
          } else {
            Toast.show(getLanguage(this.props.language).Friends.RESOURCE_UPLOAD_FAILED)
            return []
          }
          // await RNFS.unlink(resizedImageUri.path)
          // TODO是否删除原图

          // let _newPath = `${mediaFilePath.replace(name, resourceId)}.${suffix}`
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

  saveHandler = async () => {
    let result = false
    if (!this.info.layerName) {
      return result
    }
    try {
      this.container && this.container.setLoading(true, getLanguage(global.language).Prompt.SAVEING)
      this._newMediaFiles = []
      this._ids = []
      let modifiedData = [],
        deleteMedia = false // 用于删除所有图片后，提示是否删除该对象
      for (let key in this.info) {
        if (key === 'mediaServiceIds') { // 后面处理ids
          this._ids = this.state.mediaServiceIds.concat([])
          continue
        }
        // 找出被修改的的信息,如果geoID没有,对象不存在,则所有信息都被认定为修改信息
        if (this.showInfo[key] !== this.state[key] || !this.info.geoID) {
          let _value = this.state[key]
          // 删除所有图片后，提示是否删除该对象
          if (key === 'mediaFilePaths' && this.state[key].length === 0) {
            deleteMedia = true
          }
          // mediaData对象需转成string保存
          if (key === 'mediaData') {
            _value = JSON.stringify(this.state[key])
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
            value: _value,
          })
        }
      }
      if (modifiedData.length === 0) {
        this.container && this.container.setLoading(false)
        Toast.show(getLanguage(this.props.language).Prompt.NO_NEED_TO_SAVE)
        return
      }

      this.modifiedData = modifiedData
      // 有geoID就是修改保存,没有则是添加,不需要删除
      if (deleteMedia && this.info.geoID) {
        this.deleteDialog && this.deleteDialog.setVisible(true)
      } else {
        result = await this.save(this.modifiedData, false)
      }
      this.container && this.container.setLoading(false)
      return result
    } catch (e) {
      this.container && this.container.setLoading(false)
      Toast.show(getLanguage(this.props.language).Prompt.SAVE_FAILED)
      return result
    }
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
      if (global.coworkMode) {
        const newPaths = await FileTools.copyFiles(this._newMediaFiles, targetPath)
        if (this._newMediaFiles.length > 0) {
          // let _newIds = await this.uploadMedia(this._newMediaFiles)
          let _newIds = await this.uploadMedia(newPaths)
          if (_newIds.length === 0) {
            return
          }
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
      let result = false
      // 有geoID就是修改保存,没有则是添加
      if (this.info.geoID) {
        result = await SMediaCollector.saveMediaByDataset(
          this.info.layerName,
          this.info.geoID,
          targetPath,
          modifiedData,
          addToMap,
          isDelete,
        )
      } else if (this.layerInfo) {
        let description = ''
        for (const item of modifiedData) {
          // if (item.name === 'mediaData') {
          //   mediaData = item.value
          // }
          if (item.name === 'description') {
            description = item.value
          }
        }
        result = await SMediaCollector.addMedia({
          datasourceName: this.layerInfo.datasourceAlias,
          datasetName: this.layerInfo.datasetName,
          mediaPaths: this.state.mediaFilePaths,
          mediaIds: this._ids,
          location: this.info.location,
          description: description,
          mediaData: JSON.stringify(this.state.mediaData),
          mediaType: this.showInfo.mediaData.type || '',
        })
      }
      let newState = {}
      if (global.coworkMode && result) {
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
        if (this.info.geoID && !isDelete) {
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
        }

        // 保存成功,清除临时数据
        this.modifiedData = []
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
      return result
    } catch (e) {
      this.container && this.container.setLoading(false)
      Toast.show(getLanguage(this.props.language).Prompt.SAVE_FAILED)
      return false
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
            that.mediaItemRef[rowIndex * COLUMNS + cellIndex] = ref
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
              imgPath.toLowerCase().indexOf('content://') !== 0 &&
              imgPath.toLowerCase().indexOf('file://') !== 0
            ) {
              imgPath = 'file://' + imgPath
            }
            // this.mediaViewer && this.mediaViewer.setVisible(true, imgPath)
            this.mediaViewer && this.mediaViewer.setVisible(true, index)
            // this.mediaViewer.setVisible(true, this.state.mediaFilePaths[rowIndex * COLUMNS + cellIndex])
          }
        }}
        showDelete={true}
        onDeletePress={item => {
          this.deleteMediaFile(item.index)
        }}
        // onLongPress={() => {
        //   for (let ref of this.mediaItemRef) {
        //     if (ref.props.data.uri !== '+') ref.setDelete && ref.setDelete(true)
        //   }
        //   this.setState({
        //     showDelete: true,
        //   })
        // }}
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
          onPress={async () => {
            this.popModal && this.popModal.setVisible(false)
            const isAR = global.Type === ChunkType.MAP_AR_MAPPING || global.Type === ChunkType.MAP_AR || global.Type === ChunkType.MAP_AR_ANALYSIS
            Platform.OS === 'android' && isAR && await SARMap.onPause() // Android相机和AR模块实景共用相机,要先暂停AR模块的相机,防止崩溃
            NavigationService.navigate('Camera', {
              limit: MAX_FILES - this.state.mediaFilePaths.length,
              cb: async data => {
                Platform.OS === 'android' && isAR && await SARMap.onResume()
                this.addMediaFiles(data)
              },
              cancelCb: async () => {
                Platform.OS === 'android' && isAR && await SARMap.onResume()
              },
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
          const result = await this.save(this.modifiedData, true)
          if (result) {
            SMap.refreshMap()
            NavigationService.goBack('MediaEdit')
            if(global.HAVEATTRIBUTE){
              this.gocb && typeof this.gocb === 'function' && this.gocb()
            }
          }
        }}
        confirmText={getLanguage(this.props.language).Prompt.DELETE}
        cancelAction={() => {
          this.save(this.modifiedData, false)
        }}
        cancelText={getLanguage(this.props.language).Prompt.SAVE_YES}
      />
    )
  }

  renderContent = () => {
    const mediaInfoType = this.state.mediaData?.type
    switch(mediaInfoType) {
      case 'AI_DETECT':
      case 'AI_AGGREGATE':
        return this.renderAIDetectContent(mediaInfoType)
      case 'AI_VEHICLE':
        return this.renderAIVehicleContent()
      case 'AI_CLASSIFY':
        return this.renderAIClassifyContent()
      default:
        return this.renderDefaultContent()
    }
  }

  renderDefaultContent = () => {
    // let coordinate =
    //   this.state.coordinate.x !== undefined &&
    //   this.state.coordinate.y !== undefined
    //     ? this.state.coordinate.x.toFixed(6) +
    //       ',' +
    //       this.state.coordinate.y.toFixed(6)
    //     : ''
    return (
      <>
        {this.renderItem({
          title: getLanguage(this.props.language).Map_Label.NAME,
          value: this.state.mediaName,
          type: 'arrow',
          action: () => {
            NavigationService.navigate('InputPage', {
              value: this.state.mediaName,
              headerTitle: getLanguage(global.language).Map_Label.NAME,
              type: 'name',
              cb: async value => {
                this.setState({
                  mediaName: value,
                })
                NavigationService.goBack('InputPage')
              },
            })
          },
        })}
        {/* {this.renderItem({
          title: getLanguage(this.props.language).Map_Main_Menu.COORDINATE,
          value: coordinate,
          type: 'arrow',
        })} */}
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
              headerTitle: getLanguage(global.language).Map_Main_Menu
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
              headerTitle: getLanguage(global.language).Map_Main_Menu
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
      </>
    )
  }

  getMediaDataByKey = key => {
    let mediaData = JSON.parse(JSON.stringify(this.state.mediaData)) || []
    for (const item of mediaData) {
      if (item.name === key) {
        return item.value
      }
    }
    return ''
  }

  /** AI识别内容 */
  renderAIDetectContent = type => {
    let category = '', confidence = ''
    if (this.state.mediaData?.recognitionInfos) {
      for (const recognitionInfo of this.state.mediaData.recognitionInfos) {
        if (type === 'AI_AGGREGATE') {
          category += `${(category ? ',' : '')}${recognitionInfo.label}:${recognitionInfo.countID}`
          confidence += `${(confidence ? ',' : '')}${recognitionInfo.label}:${recognitionInfo.confidence}`
        } else {
          const count = this.state.mediaData.recognitionInfos.filter(item => item.label === recognitionInfo.label).length
          if(category.indexOf(recognitionInfo.label) < 0)
          {
            category += (category ? ',' : '') + recognitionInfo.label + (count > 1 ? '(' + count + ')' : '')
          }
          if(this.state.mediaData.category ? true:false){
            category = this.state.mediaData.category
          }
        }
      }
    }
    return (
      <>
        {/* {this.renderItem({
          title: getLanguage(this.props.language).AI.NUMBER,
          value: 1 + '',
        })} */}
        {this.renderItem({
          title: getLanguage(this.props.language).AI.CATEGORY,
          value: this.state.category ? this.state.category : category,
          type: 'arrow',
          action: () => {
            NavigationService.navigate('InputPage', {
              value: this.state.category ? this.state.category:category,
              headerTitle: getLanguage(global.language).AI.CATEGORY,
              cb: async value => {
                let mediaData = JSON.parse(JSON.stringify(this.state.mediaData))
                mediaData.category = value
                this.modifiedData.push({category:value})
                this.setState({
                  category: value,
                  mediaData: mediaData,
                })
                NavigationService.goBack()
              },
            })
          },
        })}
        {type === 'AI_AGGREGATE' && this.renderItem({
          title: getLanguage(this.props.language).AI.CONFIDENCE,
          value: confidence,
        })}
        {this.renderItem({
          title: getLanguage(this.props.language).AI.DATE,
          value: this.state.modifiedDate,
          type: 'arrow',
          action: () => {
            NavigationService.navigate('InputPage', {
              value: this.state.modifiedDate,
              headerTitle: getLanguage(global.language).AI.DATE,
              cb: async value => {
                this.setState({
                  modifiedDate: value,
                })
                NavigationService.goBack()
              },
            })
          },
        })}
        {this.renderItem({
          title: getLanguage(this.props.language).AI.REMARK,
          value: this.state.description,
          type: 'arrow',
          action: () => {
            NavigationService.navigate('InputPage', {
              value: this.state.description,
              headerTitle: getLanguage(global.language).AI.REMARK,
              cb: async value => {
                this.setState({
                  description: value,
                })
                NavigationService.goBack()
              },
            })
          },
        })}
        {/* {this.renderItem({
          title: getLanguage(this.props.language).AI.MORE,
          value: '',
          type: 'arrow',
          action: () => {
            if (this.layerInfo) {
              this.props.setCurrentLayer(this.layerInfo, () => {
                ToolbarModule.getData()?.actions?.close()
                NavigationService.navigate('LayerAttribute')
              })
            } else {
              NavigationService.navigate('LayerAttribute')
            }
          },
        })} */}
      </>
    )
  }

  /** AI车辆识别内容 */
  renderAIVehicleContent = () => {
    let category = ''
    if (this.state.mediaData?.recognitionInfos) {
      for (const recognitionInfo of this.state.mediaData.recognitionInfos) {
        category += (category ? ',' : '') + recognitionInfo.title
      }
    }
    return (
      <>
        {this.renderItem({
          title: getLanguage(this.props.language).AI.CLIENT,
          value: this.state.mediaData.client || '',
          type: 'arrow',
          action: () => {
            NavigationService.navigate('InputPage', {
              value: this.state.mediaData.client || '',
              headerTitle: getLanguage(global.language).AI.CLIENT,
              cb: async value => {
                let mediaData = JSON.parse(JSON.stringify(this.state.mediaData))
                mediaData.client = value
                this.setState({
                  mediaData: mediaData,
                })
                NavigationService.goBack('InputPage')
              },
            })
          },
        })}
        {this.renderItem({
          title: getLanguage(this.props.language).AI.PLATE_NUMBER,
          value: this.state.mediaData.plateNubmer || '',
          type: 'arrow',
          action: () => {
            NavigationService.navigate('InputPage', {
              value: this.state.mediaData.plateNubmer || '',
              headerTitle: getLanguage(global.language).AI.PLATE_NUMBER,
              cb: async value => {
                let mediaData = JSON.parse(JSON.stringify(this.state.mediaData))
                mediaData.plateNubmer = value
                this.setState({
                  mediaData: mediaData,
                })
                NavigationService.goBack('InputPage')
              },
            })
          },
        })}
        {this.renderItem({
          title: getLanguage(this.props.language).AI.VEHICLE_TYPE,
          value: this.state.mediaData.vehicleType || '',
          type: 'arrow',
          action: () => {
            NavigationService.navigate('InputPage', {
              value: this.state.mediaData.vehicleType || '',
              headerTitle: getLanguage(global.language).AI.VEHICLE_TYPE,
              cb: async value => {
                let mediaData = JSON.parse(JSON.stringify(this.state.mediaData))
                mediaData.vehicleType = value
                this.setState({
                  mediaData: mediaData,
                })
                NavigationService.goBack('InputPage')
              },
            })
          },
        })}
        {this.renderItem({
          title: getLanguage(this.props.language).AI.VEHICLE_COLOR,
          value: this.state.mediaData.vehicleColor || '',
          type: 'arrow',
          action: () => {
            NavigationService.navigate('InputPage', {
              value: this.state.mediaData.vehicleColor || '',
              headerTitle: getLanguage(global.language).AI.VEHICLE_COLOR,
              cb: async value => {
                let mediaData = JSON.parse(JSON.stringify(this.state.mediaData))
                mediaData.vehicleColor = value
                this.setState({
                  mediaData: mediaData,
                })
                NavigationService.goBack('InputPage')
              },
            })
          },
        })}
        {this.renderItem({
          title: getLanguage(this.props.language).AI.ILLEGAL_TIME,
          value: this.state.modifiedDate,
          type: 'arrow',
        })}
        {this.renderItem({
          title: getLanguage(this.props.language).AI.VIOLATION_INFO,
          value: this.state.mediaData.vehicleInfo || '',
          type: 'arrow',
          action: () => {
            NavigationService.navigate('InputPage', {
              value: this.state.mediaData.vehicleInfo || '',
              headerTitle: getLanguage(global.language).AI.VIOLATION_INFO,
              cb: async value => {
                let mediaData = JSON.parse(JSON.stringify(this.state.mediaData))
                mediaData.vehicleInfo = value
                this.setState({
                  mediaData: mediaData,
                })
                NavigationService.goBack('InputPage')
              },
            })
          },
        })}
        {this.renderItem({
          title: getLanguage(this.props.language).AI.LAW_ENFORCER,
          value: this.state.mediaData.lawEnforcer || '',
          type: 'arrow',
          action: () => {
            NavigationService.navigate('InputPage', {
              value: this.state.mediaData.lawEnforcer || '',
              headerTitle: getLanguage(global.language).AI.LAW_ENFORCER,
              cb: async value => {
                let mediaData = JSON.parse(JSON.stringify(this.state.mediaData))
                mediaData.lawEnforcer = value
                this.setState({
                  mediaData: mediaData,
                })
                NavigationService.goBack('InputPage')
              },
            })
          },
        })}
        {/* {this.renderItem({
          title: getLanguage(this.props.language).AI.MORE,
          value: '',
          type: 'arrow',
          action: () => {
            if (this.layerInfo) {
              this.props.setCurrentLayer(this.layerInfo, () => {
                ToolbarModule.getData()?.actions?.close()
                NavigationService.navigate('LayerAttribute')
              })
            } else {
              NavigationService.navigate('LayerAttribute')
            }
          },
        })} */}
      </>
    )
  }

  /** AI目标识别内容 */
  renderAIClassifyContent = () => {
    let category = ''
    if (this.state.mediaData?.recognitionInfos) {
      for (const recognitionInfo of this.state.mediaData.recognitionInfos) {
        category += (category ? ',' : '') + recognitionInfo.label
      }
    }
    if(this.state.mediaData.category?true:false){
      category = this.state.mediaData.category
    }
    return (
      <>
        {this.renderItem({
          title: getLanguage(this.props.language).AI.CATEGORY,
          value: this.state.category? this.state.category:category,
          type: 'arrow',
          action: () => {
            NavigationService.navigate('InputPage', {
              value: category,
              headerTitle: getLanguage(global.language).Map_Label.CATEGORY,
              type: 'name',
              cb: async value => {
                let mediaData = JSON.parse(JSON.stringify(this.state.mediaData))
                mediaData.category = value
                this.modifiedData.push({category:value})
                this.setState({
                  category: value,
                  mediaData: mediaData,
                })
                NavigationService.goBack('InputPage')
              },
            })
          },
        })}
        {this.renderItem({
          title: getLanguage(this.props.language).Map_Main_Menu.COLLECT_TIME,
          value: this.state.modifiedDate,
          type: 'arrow',
        })}
        {this.renderItem({
          title: getLanguage(this.props.language).Map_Main_Menu.MAP_AR_AI_ASSISTANT_CLASSIFY_RESULT_REMARKS,
          value: this.state.description,
          type: 'arrow',
          action: () => {
            NavigationService.navigate('InputPage', {
              value: this.state.description,
              headerTitle: getLanguage(global.language).Map_Main_Menu.MAP_AR_AI_ASSISTANT_CLASSIFY_RESULT_REMARKS,
              cb: async value => {
                this.setState({
                  description: value,
                })
                NavigationService.goBack()
              },
            })
          },
        })}
      </>
    )
  }

  renderLocation = () => {
    let coordinate =
      this.state.coordinate.x !== undefined &&
      this.state.coordinate.y !== undefined
        ? this.state.coordinate.x.toFixed(6) +
          ',' +
          this.state.coordinate.y.toFixed(6)
        : ''
    return (
      <View style={styles.itemView}>
        <Image
          resizeMode={'contain'}
          style={styles.locationImg}
          source={getThemeAssets().setting.icon_location}
        />
        <Text style={styles.locationTitle}>{getLanguage(this.props.language).Map_Main_Menu.POSITION}</Text>
        <Text style={styles.locationTitle}>{coordinate}</Text>
      </View>
    )
  }

  back = () => {
    const _goBack = () => {
      if (this.backAction) {
        this.backAction()
      } else {
        NavigationService.goBack('MediaEdit')
      }
    }
    if (this.info.geoID) {
      _goBack()
    } else {
      global.SimpleDialog?.set({
        text: getLanguage(global.language).Prompt.SAVE_DATA_TITLE,
        confirmText: getLanguage(global.language).Prompt.YES,
        cancelText: getLanguage(global.language).Prompt.NO,
        disableBackTouch: false,
        confirmAction: async () => {
          const result = await this.saveHandler()
          result && _goBack()
        },
        cancelAction: _goBack,
        dismissAction: () => global.SimpleDialog?.setVisible(false),
      })
      global.SimpleDialog?.setVisible(true)
    }
  }

  render() {
    return (<>
      <Container
        ref={ref => (this.container = ref)}
        style={styles.container}
        headerProps={{
          title: this.state.title || '',
          navigation: this.props.navigation,
          backAction: this.back,
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
        <ScrollView style={{ flex: 1 }}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefresh}
              onRefresh={this.refresh}
              colors={['orange', 'red']}
              tintColor={'orange'}
              titleColor={'orange'}
              enabled={true}
            />
          }
        >
          <View style={styles.itemView}>
            <Text style={styles.title}>{getLanguage(this.props.language).Map_Main_Menu.BASIC_INFO}</Text>
          </View>
          {this.renderContent()}
          {this.renderLocation()}
          {this.renderAlbum()}
        </ScrollView>
        {this.renderPopView()}
        {/*<MediaViewer*/}
        {/*ref={ref => (this.mediaViewer = ref)}*/}
        {/*withBackBtn*/}
        {/*isModal*/}
        {/*/>*/}
        {this.renderDeleteDialog()}
      </Container>
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
      {/* 部分安卓设备竖屏进入MediaPager切换横屏 状态栏把MediaPager往下挤 看到底图 所以打开时显示个背景 zcj */}
      {Platform.OS === 'android' && this.state.showBg &&
        <View style={{width: '100%', height: '100%', position: 'absolute', backgroundColor: '#000'}}></View>}
    </>)
  }
}
