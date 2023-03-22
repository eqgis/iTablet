import { ImagePicker, MediaPager } from "@/components"
import TableList from "@/components/TableList"
import { ChunkType, ConstPath, UserType } from "@/constants"
import NavigationService from "@/containers/NavigationService"
import { getLanguage } from "@/language"
// import MediaItem from "@/containers/mediaEdit/MediaItem"
import { RootState } from "@/redux/types"
import { AppEvent, checkType, dataUtil, dp, OnlineServicesUtils, Toast } from "@/utils"
import { FileTools, RNFS, SARMap, SCoordination, SMap, SMediaCollector } from "imobile_for_reactnative"
import React, { Component } from "react"
import { View, Text, StyleSheet, Platform, ScrollView } from "react-native"
import { connect, ConnectedProps } from "react-redux"
import TourAction from "../../mapFunctionModules/Langchao/TourAction"
import MediaItem from "./MediaItem"
import styles from './styles'

export interface fieldInfoType {
  caption: string,
  name: string,
  type: number,
  maxLength: number,
  defaultValue: unknown,
  isRequired: boolean,
  isSystemField: boolean,
}

export interface attributeDataType {
  name: string,
  fieldInfo: fieldInfoType,
  value: unknown
}

export interface callAttributeType {
  SmID: number,
  isUploaded: boolean,
  myName: string,
  myPhoneNumber: string,
  callName: string,
  callPhoneNumber: string,
  localTime_User: string,
  bjTime: string,
  duration: string | number,
  locationInfo: string,
  attributeInfo: Array<attributeDataType>,
}

interface pathInfoType {
  uri: string,
  type: string,
}

interface cameraReturnType {
  datasourceName: string,
  datasetName: string,
  mediaPaths: Array<string>,
}

interface Props extends ReduxProps {
  data: callAttributeType,
}

interface State {
  data: callAttributeType,
  mediaFilePaths: Array<string>,
  paths: Array<pathInfoType>,
  showBg: boolean,
  showDelete: boolean,
  mediaServiceIds: Array<number>,
}


const COLUMNS = 3
const MAX_FILES = 9


class CallDetailPage extends Component<Props, State> {
  mediaItemRef = []
  mediaViewer: MediaPager | null = null
  _newMediaFiles = []
  _ids: Array<number> = []
  info: any
  showInfo: any
  servicesUtils: SCoordination =  new SCoordination('online')
  onlineServicesUtils: OnlineServicesUtils = new OnlineServicesUtils('online')

  constructor(props: Props) {
    super(props)
    this.state = {
      data: this.props.data,
      mediaFilePaths: [],
      paths: [],
      showBg:false,
      showDelete: false,
      mediaServiceIds: [],
    }

    if (global.coworkMode && global.Type.indexOf('3D') < 0 && this.props.currentUser) {
      if (UserType.isOnlineUser(this.props.currentUser)) {
        this.servicesUtils = new SCoordination('online')
        this.onlineServicesUtils = new OnlineServicesUtils('online')
      } else if (UserType.isIPortalUser(this.props.currentUser)){
        this.servicesUtils = new SCoordination('iportal')
        this.onlineServicesUtils = new OnlineServicesUtils('iportal')
      }
    }
  }

  dealData = async (mediaPaths:Array<string> = []) => {
    const paths = []
    for (const item of mediaPaths) {
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

  getMediaInfo = async() => {
    const smID = this.state.data.SmID
    // const limit = 9
    const layerInfo = this.props.currentLayer

    const info = await SMediaCollector.getMediaInfo(layerInfo.name, smID)
    console.warn("info: " + JSON.stringify(info))
    this.info = info
    this.showInfo = {
      mediaName: this.info?.mediaName || '',
      coordinate: this.info?.coordinate || '',
      modifiedDate: this.info?.modifiedDate || '',
      description: this.info?.description || '',
      httpAddress: this.info?.httpAddress || '',
      mediaFilePaths: this.info?.mediaFilePaths && this.info?.mediaFilePaths !== '-' ? this.info?.mediaFilePaths : [],
      mediaServiceIds: this.info?.mediaServiceIds && this.info?.mediaServiceIds !== '-' ? this.info?.mediaServiceIds : [],
      mediaData: this.info?.mediaData && this.info?.mediaData !== '-' && (
        typeof this.info?.mediaData === 'string' ? JSON.parse(this.info?.mediaData) : this.info?.mediaData
      ) || {},
      isRefresh: false,
    }
    // let maxFiles = 9 - info.mediaFilePaths.length
    // limit = maxFiles
    // if(maxFiles <= 0){
    //   Toast.show(getLanguage(global.language).Prompt.CANT_PICTURE)
    //   return
    // }
    const paths = await this.dealData(info?.mediaFilePaths || [])
    this.setState({
      paths,
      mediaFilePaths: info?.mediaFilePaths || [],
      mediaServiceIds:  this.showInfo.mediaServiceIds,
    })

  }
  componentDidMount = (): void => {
    this.getMediaInfo()
    AppEvent.addListener("uploadData", this.uploadData)
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
    if(this.props.data.SmID !== prevProps.data.SmID) {
      console.warn("smId: " + this.props.data.SmID + "\n pre smId: " + prevProps.data.SmID)
      this.setState({
        data: this.props.data,
      }, () => {
        this.getMediaInfo()
      })
    }
  }

  uploadData = async () => {
    TourAction.uploadDialog(this.state.data.SmID, 'line')
  }

  deleteMediaFile = async (index: number) => {
    if (index >= this.state.mediaFilePaths.length) return
    const mediaFilePaths = [...this.state.mediaFilePaths]
    // 删除图片同时删除对应service id
    const mediaServiceIds = [...this.state.mediaServiceIds]

    if (mediaFilePaths.length > index) {
      mediaFilePaths.splice(index, 1)
    }
    if (mediaServiceIds.length > index) {
      mediaServiceIds.splice(index, 1)
    }

    const paths = await this.dealData(mediaFilePaths)

    this.mediaItemRef = []
    this.setState({
      mediaFilePaths,
      paths,
      mediaServiceIds,
    })
  }


  addMediaFiles = async (data:cameraReturnType) => {
    // {mediaPaths = []}
    // datasourceName,
    // datasetName,

    const mediaPaths = data.mediaPaths
    const datasourceName = data.datasourceName
    const datasetName = data.datasetName

    let mediaFilePaths = [...this.state.mediaFilePaths]

    for (const item of mediaPaths) {
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
        } else if(path.indexOf('ph://') === 0) {
          path = path.replace('ph://', '')
          path = await FileTools.getContentAbsolutePath(path)
          if (path.indexOf('file://') === 0) {
            path = path.replace('file://', '')
          }
        }
        mediaFilePaths.push(path)
      }
    }
    mediaFilePaths = [...new Set(mediaFilePaths)]

    const paths = await this.dealData(mediaFilePaths)

    this.mediaItemRef = []
    this.setState({
      mediaFilePaths,
      paths,
    })
  }

  saveHandler = async () => {
    let result = false
    if (!this.info.layerName) {
      return result
    }
    try {
      global.Loading.setLoading(true, getLanguage(global.language).Prompt.SAVEING)
      this._newMediaFiles = []
      this._ids = []
      const modifiedData = []
      // deleteMedia = false // 用于删除所有图片后，提示是否删除该对象
      for (const key in this.info) {
        if (key === 'mediaServiceIds') { // 后面处理ids
          this._ids = this.state.mediaServiceIds.concat([])
          continue
        }
        // 找出被修改的的信息,如果geoID没有,对象不存在,则所有信息都被认定为修改信息
        // if (this.showInfo[key] !== this.state[key] || !this.info.geoID) {
        //   let _value = this.state[key]
        //   // 删除所有图片后，提示是否删除该对象
        //   if (key === 'mediaFilePaths' && this.state[key].length === 0) {
        //     deleteMedia = true
        //   }
        //   // mediaData对象需转成string保存
        //   if (key === 'mediaData') {
        //     _value = JSON.stringify(this.state[key])
        //   }

        //   if (key === 'mediaFilePaths') {
        //     this.state.mediaFilePaths.forEach(item => {
        //       if (item.indexOf('/iTablet/User/') !== 0) {
        //         // 把新添加的图片记录下来
        //         // TODO 区分同一张图片删除后重新添加
        //         this._newMediaFiles.push(item)
        //       }
        //     })
        //   }
        //   modifiedData.push({
        //     name: key,
        //     value: _value,
        //   })
        // }


        if(key === 'mediaFilePaths') {
          const value = this.state.mediaFilePaths
          modifiedData.push({
            name: key,
            value: value,
          })
        }

      }
      if (modifiedData.length === 0) {
        global.Loading.setLoading.setLoading(false)
        // Toast.show(getLanguage(this.props.language).Prompt.NO_NEED_TO_SAVE)
        Toast.show(getLanguage(this.props.language).Prompt.SAVE_SUCCESSFULLY)
        return
      }
      result = await this.save(modifiedData, false)

      // this.modifiedData = modifiedData
      // // 有geoID就是修改保存,没有则是添加,不需要删除
      // if (deleteMedia && this.info.geoID) {
      //   this.deleteDialog && this.deleteDialog.setVisible(true)
      // } else {
      //   result = await this.save(this.modifiedData, false)
      // }
      global.Loading.setLoading(false)
      return result
    } catch (e) {
      global.Loading.setLoading(false)
      Toast.show(getLanguage(this.props.language).Prompt.SAVE_FAILED)
      return result
    }
  }

  save = async (modifiedData: Array<{[name: string]: unknown}>, isDelete = true) => {
    try {
      const targetPath = await FileTools.appendingHomeDirectory(
        ConstPath.UserPath +
          this.props.user.currentUser.userName +
          '/' +
          ConstPath.RelativeFilePath.Media,
      )
      let addToMap = this.info.addToMap !== undefined ? this.info.addToMap : true
      // 若原本有图片,且修改后的图片第一张与修改前一致,或者所有图片都被清除,并有callout则不添加到地图上
      if (this.info.mediaFilePaths.length > 0) {
        for (const item of modifiedData) {
          if (
            item.name === 'mediaFilePaths' && (
              item?.value.length > 0 && item?.value[0] === this.info.mediaFilePaths[0] || // 修改图片,且第一张图片没有变化
              item?.value.length === 0 // 删除所有图片
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
      } else if (this.props.currentLayer) {
        const description = ''
        // for (const item of modifiedData) {
        //   // if (item.name === 'mediaData') {
        //   //   mediaData = item.value
        //   // }
        //   if (item.name === 'description') {
        //     description = item.value
        //   }
        // }
        result = await SMediaCollector.addMedia({
          datasourceName: this.props.currentLayer.datasourceAlias,
          datasetName: this.props.currentLayer.datasetName,
          mediaPaths: this.state.mediaFilePaths,
          mediaIds: this._ids,
          location: this.info.location,
          description: description,
          mediaData: '', // JSON.stringify(this.state.mediaData),
          mediaType: this.showInfo.mediaData.type || '',
        })
      }
      const newState = {}
      if (global.coworkMode && result) {
        this.info.mediaServiceIds = this._ids
        newState.mediaServiceIds = this._ids
        // this.setState({mediaServiceIds: this._ids})
      }
      // if (
      //   result &&
      //   Object.keys(modifiedData).length > 0 &&
      //   typeof this.cb === 'function'
      // ) {
      //   // this.deleteDialog && this.deleteDialog.setVisible(false)
      //   this.cb(modifiedData)
      // }
      if (result) {
        if (this.info.geoID && !isDelete) {
          const info = await SMediaCollector.getMediaInfo(this.info.layerName, this.info.geoID)

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
        // this.modifiedData = []
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
      global.Loading.setLoading(false)
      Toast.show(getLanguage(this.props.language).Prompt.SAVE_FAILED)
      return false
    }
  }

  renderLocationInfo = () => {
    return (
      <View
        style={[{
          maxWidth:'90%',
          flexDirection: 'row',
          alignItems: 'center',
        }]}
      >
        <Text
          style={[{
            fontSize: dp(10),
            color: '#fff',
            lineHeight: dp(15),
            backgroundColor: 'rgba(0,0,0, .5)',
            padding: dp(5),
            minWidth: dp(100),
          }]}
        >{this.state.data.locationInfo}</Text>
      </View>
    )
  }

  _renderCallInfo() {
    const item = this.state.data
    return (
      <View
        style={[{
          width:'100%',
          height: dp(60),
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: dp(20),
          marginVertical: dp(10),
          // borderBottomColor: color.grayLight,
          // borderBottomWidth: dp(1),
        }]}
      >
        <View
          style={[{
            flex: 1,
            height: '100%',
            justifyContent: 'space-evenly',
          },
          item.callPhoneNumber === "" && {
            justifyContent: 'center',
          },
          ]}
        >
          <Text
            style={[{
              fontSize: dp(20),
            }]}
          >
            {item.callName || getLanguage(global.language).Map_Settings.MANUAL_ACQUISITION}
          </Text>
          {item.callPhoneNumber !== "" && (
            <Text>{item.callPhoneNumber}</Text>
          )}
          {/* <Text>{item.callPhoneNumber || ""}</Text> */}
        </View>

        <View
          style={[{
            width:dp(150),
            height: '100%',
            justifyContent: 'space-evenly',
            alignItems: 'flex-end'
          }]}
        >
          <Text
            style={[{
            }]}
          >
            {item.localTime_User}
          </Text>
          {/* <Text>{`时长：${Number(item.duration).toFixed(2)} 分钟`}</Text> */}
          <Text>{`${getLanguage(global.language).Map_Settings.DURATION}：${Number(item.duration).toFixed(2)} ${getLanguage(global.language).Map_Settings.TIME_MINUTE}`}</Text>
        </View>
      </View>
    )
  }

  renderAlbum = () => {
    const data = [...this.state.paths]
    if (!this.state.showDelete && this.state.paths.length < 9) {
      data.push({uri: '+', type: 'addMedia'})
    }
    return (
      <TableList
        // ref={ref => this.tableList = ref}
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

  renderImage = ({ item, rowIndex, cellIndex }: {item: any, rowIndex: number, cellIndex: number}) => {
    return (
      <MediaItem
        ref={ref => {
          if (ref && ref.props.data.uri !== '+') {
            this.mediaItemRef[rowIndex * COLUMNS + cellIndex] = ref
          }
        }}
        data={item}
        index={rowIndex * COLUMNS + cellIndex}
        onPress={async ({ data, index }) => {
          if (data.uri === '+') {
            if(this.state.mediaFilePaths.length <= 0) {

              // to do

              let layerInfo = this.props.currentLayer

              if (layerInfo) {
                let datasourceAlias = layerInfo?.datasourceAlias // 标注数据源名称
                let datasetName = layerInfo?.datasetName // 标注图层名称
                if (
                  datasourceAlias === '' || datasourceAlias === undefined || datasourceAlias === null ||
                  datasetName === '' || datasetName === undefined || datasetName === null
                ) {
                  layerInfo = await SMap.getLayerInfo(this.props.currentLayer.path)
                  datasourceAlias = layerInfo.datasourceAlias // 标注数据源名称
                  datasetName = layerInfo.datasetName // 标注图层名称
                }

                const selectionAttribute = false
                const index = this.state.data.SmID - 1
                const layerAttribute = false

                NavigationService.navigate('Camera', {
                  datasourceAlias,
                  datasetName,
                  index,
                  attribute: true,
                  selectionAttribute,
                  layerAttribute,
                  limit: 9,
                  cb: async ({
                    datasourceName,
                    datasetName,
                    mediaPaths,
                  }: cameraReturnType) => {
                    // cb: async mediaPaths => {
                    try {
                      console.warn("call new maedia: " + JSON.stringify(mediaPaths))
                      if (global.coworkMode) {
                        const resourceIds = [],
                          _mediaPaths = [] // 保存修改名称后的图片地址
                        let name = '', suffix = ''
                        let dest = await FileTools.appendingHomeDirectory(ConstPath.UserPath + this.props.currentUser.userName + '/' + ConstPath.RelativeFilePath.Media)
                        const newPaths = await FileTools.copyFiles(mediaPaths, dest)
                        for (let mediaPath of newPaths) {
                          if (mediaPath.indexOf('assets-library://') === 0) { // 处理iOS相册文件
                            suffix = dataUtil.getUrlQueryVariable(mediaPath, 'ext') || ''
                            name = dataUtil.getUrlQueryVariable(mediaPath, 'id') || ''
                            dest += `${name}.${suffix}`
                            mediaPath = await RNFS.copyAssetsFileIOS(mediaPath, dest, 0, 0)
                          } else if (mediaPath.indexOf('ph://') === 0) { // 处理iOS相册文件
                            suffix = 'png'
                            name = mediaPath.substr(mediaPath.lastIndexOf('/') + 1)
                            dest += `${name}.${suffix}`
                            mediaPath = await RNFS.copyAssetsFileIOS(mediaPath, dest, 0, 0)
                          } else if (mediaPath.indexOf('content://') === 0) { // 处理android相册文件
                            const filePath = await FileTools.getContentAbsolutePath(mediaPath)
                            name = filePath.substring(filePath.lastIndexOf('/') + 1, filePath.lastIndexOf('.'))
                            suffix = filePath.substr(filePath.lastIndexOf('.') + 1)
                            dest += `${name}.${suffix}`
                            await RNFS.copyFile(filePath, dest)
                            mediaPath = dest
                          } else { // 处理文件目录中的文件
                            name = mediaPath.substring(mediaPath.lastIndexOf('/') + 1, mediaPath.lastIndexOf('.'))
                            suffix = mediaPath.substr(mediaPath.lastIndexOf('.') + 1)
                            dest += `${name}.${suffix}`
                          }
                          const resourceId = await this.onlineServicesUtils.uploadFileWithCheckCapacity(
                            mediaPath,
                            `${name}.${suffix}`,
                            'PHOTOS',
                          )
                          // TODO是否删除原图
                          if (resourceId) {
                            resourceIds.push(resourceId)

                            const _newPath = `${mediaPath.replace(name, resourceId)}`
                            _mediaPaths.push(_newPath)
                          }
                        }
                        if (resourceIds.length > 0) {
                          const result = await SMediaCollector.addMedia({
                            datasourceName,
                            datasetName,
                            mediaPaths,
                            mediaIds: resourceIds,
                          }, false, { index: 0, selectionAttribute: selectionAttribute, ids: [this.state.data.SmID],layerAttribute: layerAttribute}) // global.layerSelection?.ids || []
                        } else {
                          Toast.show(getLanguage(global.language).Friends.RESOURCE_UPLOAD_FAILED)
                        }
                        // // 分享到群组中
                        // if (resourceIds.length > 0 && this.props.currentTask?.groupID) {
                        //   this.servicesUtils?.shareDataToGroup({
                        //     groupId: this.props.currentTask.groupID,
                        //     ids: resourceIds,
                        //   }).then(result => {
                        //     if (result.succeed) {
                        //       Toast.show(getLanguage(global.language).Friends.RESOURCE_UPLOAD_SUCCESS)
                        //       this.cb && this.cb()
                        //     } else {
                        //       Toast.show(getLanguage(global.language).Friends.RESOURCE_UPLOAD_FAILED)
                        //     }
                        //   }).catch(() => {
                        //     Toast.show(getLanguage(global.language).Friends.RESOURCE_UPLOAD_FAILED)
                        //   })
                        // }
                      } else {
                        const result = await SMediaCollector.addMedia({
                          datasourceName: datasourceAlias,
                          datasetName: datasetName,
                          mediaPaths,
                        }, false, { index: 0, selectionAttribute: selectionAttribute, ids: [this.state.data.SmID] ,layerAttribute: layerAttribute})
                      }
                      // if (
                      //   this.props.refreshAction &&
                      // typeof this.props.refreshAction === 'function'
                      // ) {
                      //   this.props.refreshAction()
                      // }
                      if (await SMediaCollector.isMediaLayer(layerInfo.name)){
                        await SMediaCollector.hideMedia(layerInfo.name, false)
                        // await this.addMediaFiles({
                        //   datasourceName,
                        //   datasetName,
                        //   mediaPaths,
                        // })
                        // await this.saveHandler()
                        await this.getMediaInfo()
                      }
                    } catch (e) {
                    // eslint-disable-next-line no-console
                      __DEV__ && console.warn('error')
                    }
                  },
                })
              }
            } else {
              const isAR = global.Type === ChunkType.MAP_AR_MAPPING || global.Type === ChunkType.MAP_AR || global.Type === ChunkType.MAP_AR_ANALYSIS
              Platform.OS === 'android' && isAR && await SARMap.onPause() // Android相机和AR模块实景共用相机,要先暂停AR模块的相机,防止崩溃
              NavigationService.navigate('Camera', {
                limit: MAX_FILES - this.state.mediaFilePaths.length,
                cb: async data => {
                  Platform.OS === 'android' && isAR && await SARMap.onResume()
                  await this.addMediaFiles(data)
                  await this.saveHandler()
                  await this.getMediaInfo()
                // NavigationService.goBack()
                },
                cancelCb: async () => {
                  Platform.OS === 'android' && isAR && await SARMap.onResume()
                },
              })
            }


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
        onDeletePress={async item => {
          await this.deleteMediaFile(item.index)
          await this.saveHandler()
          await this.getMediaInfo()
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

  render() {
    return (
      <View
        style={[{
          width: '100%',
          // height: '100%',
          height: dp(88 * 6),
          backgroundColor: 'transparent',
          // paddingHorizontal: dp(10),
        }]}
      >
        <ScrollView
          // scrollEnabled={false}
          style={[{
            height: '100%',
            width: '100%',
            flexDirection: 'column',
          }]}
        >
          {/* <Text>{"我是自定义的toolbar界面" + this.props.data.SmID}</Text> */}
          {/* {this.renderLocationInfo()} */}
          {this._renderCallInfo()}
          <View
            style={[{
              width: '100%',
              height: dp(24),
              borderLeftColor: '#add8e6',
              borderLeftWidth: dp(2),
              paddingLeft: dp(15),
              paddingRight: dp(10),
              flexDirection: 'row',
              alignContent: 'flex-end',
            }]}
          >
            <Text
              style={[{
                fontSize: dp(18),
                fontWeight: 'bold',
              }]}
            >{getLanguage(global.language).Map_Settings.MEDIA_INFO}</Text>
          </View>
          {this.renderAlbum()}
          <View style={[{
            width:'100%',
            height: dp(300),
            // backgroundColor: '#f00',
          }]}></View>
        </ScrollView>
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
      </View>
    )
  }
}

// export default CallDetailPage

const mapStateToProp = (state: RootState) => ({
  mapModules: state.mapModules.toJS(),
  device: state.device.toJS().device,
  language: state.setting.toJS().language,
  // contacts: state.langchao.toJS().contacts,
  currentLayer: state.layers.toJS().currentLayer,
  user: state.user.toJS(),
  currentUser: state.user.toJS().currentUser,
})

const mapDispatch = {
  // setCurrentSymbol,
  // addContact,
}

type ReduxProps = ConnectedProps<typeof connector>
const connector = connect(mapStateToProp, mapDispatch)

export default connector(CallDetailPage)

