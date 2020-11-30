/**
 * @author ysl
 * @description 群组资源管理界面
 */
import React, { Component } from 'react'
import { StyleSheet, FlatList, RefreshControl } from 'react-native'
import { Container, PopMenu, ListSeparator, TextBtn } from '../../../../../components'
import { ConstPath, UserType } from '../../../../../constants'
import { getLanguage } from '../../../../../language'
import { scaleSize, Toast, OnlineServicesUtils } from '../../../../../utils'
import { color } from '../../../../../styles'
import NavigationService from '../../../../NavigationService'
import { Users } from '../../../../../redux/models/user'
import { GroupList } from '../components'
import { connect } from 'react-redux'
import { SCoordination } from 'imobile_for_reactnative'
import { UploadItem } from '../components'
import DataHandler from '../../../Mine/DataHandler'
import { exportWorkspace } from '../../../../../redux/models/map'
import { FileTools } from '../../../../../native'

const styles = StyleSheet.create({
  headerBtnTitle: {
    fontSize: scaleSize(24),
    color: color.fontColorBlack,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: scaleSize(30),
  },
  contentView: {
    flex: 1,
    height: scaleSize(80),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemTitle: {
    fontSize: scaleSize(26),
    color: color.fontColorBlack,
  },
  checkBox: {
    height: scaleSize(30),
    width: scaleSize(60),
  },
  itemImg: {
    width: scaleSize(48),
    height: scaleSize(48),
    marginRight: scaleSize(30),
  },
  itemStatus: {
    fontSize: scaleSize(26),
    color: color.fontColorGray,
  },
})

interface Props {
  navigation: Object,
  user: Users,
  language: string,
  device: any,
  exportWorkspace: (data: any, cb?: (result: boolean) => void) => Promise<{
    result: boolean,
    zipPath: string,
  }>,
}

interface LocalMapData {
  path: string,
  isDirectory: boolean,
  mtime: string,
  name: string,
  status?: string, // 上传状态
}

interface State {
  data: Array<any>,
  isRefresh: boolean
  isUploading: boolean
  selectedData: Map<string, LocalMapData>,
  uploadData: Map<string, LocalMapData>,
}

class GroupSourceUploadPage extends Component<Props, State> {

  servicesUtils: SCoordination | undefined | null
  onlineServicesUtils: any
  popData: Array<any>
  pagePopModal: PopMenu | null | undefined
  container: any
  pageSize: number
  currentPage: number
  isLoading:boolean // 防止同时重复加载多次
  isNoMore: boolean // 是否能加载更多
  groupList: GroupList | null | undefined
  groupInfo: any
  list: FlatList<any> | null | undefined
  cb: () => void

  constructor(props: Props) {
    super(props)
    this.groupInfo = this.props.navigation?.state?.params?.groupInfo
    this.cb = this.props.navigation?.state?.params?.cb
   
    if (UserType.isOnlineUser(this.props.user.currentUser)) {
      this.servicesUtils = new SCoordination('online')
      this.onlineServicesUtils = new OnlineServicesUtils('online')
    } else if (UserType.isIPortalUser(this.props.user.currentUser)){
      this.servicesUtils = new SCoordination('iportal')
      this.onlineServicesUtils = new OnlineServicesUtils('iportal')
    }

    this.state = {
      data: [],
      isRefresh: false,
      isUploading: false,
      selectedData: new Map<string, LocalMapData>(),
      uploadData: new Map<string, LocalMapData>(),
    }
    this.pageSize = 20
    this.currentPage = 1
    this.isLoading = false // 防止同时重复加载多次
    this.isNoMore = false // 是否能加载更多

    this.popData = [
      {
        title: getLanguage(GLOBAL.language).Friends.GROUP_RESOURCE_UPLOAD,
        action: () => {
          NavigationService.navigate('MyMap', {
            title: getLanguage(this.props.language).Profile.MAP,
          })
        },
      },
      {
        title: getLanguage(GLOBAL.language).Friends.GROUP_RESOURCE_DELETE,
        action: () => this._setManage(true),
      },
    ]
  }
  
  shouldComponentUpdate(nextProps: Props, nextState: State) {
    let shouldUpdate = JSON.stringify(nextState) !== JSON.stringify(this.state) ||
      JSON.stringify(nextProps) !== JSON.stringify(this.props) ||
      !this.state.selectedData.compare(nextState.selectedData) ||
      !this.state.uploadData.compare(nextState.uploadData)
    return shouldUpdate
  }

  componentWillUnmount() {
    this.servicesUtils = null
    this.onlineServicesUtils = null
  }

  componentDidMount() {
    this.getData(false)
  }

  getData = async (isRefresh = true) => {
    try {
      if (isRefresh) {
        this.setState({
          isRefresh: true,
        })
      }
      let data = await DataHandler.getLocalData(
        this.props.user.currentUser,
        'MAP',
      )
  
      this.setState({
        data: data,
        isRefresh: false,
      })
    } catch (error) {
      this.setState({
        isRefresh: false,
      })
    }
  }

  _itemPress = () => {
  }

  _exportData = async (name: string) => {
    let mapName = name
    let homePath = GLOBAL.homePath
    let path =
      homePath +
      ConstPath.ExternalData + '/' +
      ConstPath.RelativeFilePath.ExportData +
      mapName +
      '/' +
      mapName +
      '.smwu'
    let zipPath
    let userPath =
      ConstPath.UserPath + this.props.user.currentUser.userName + '/'
    let tempPath = homePath + userPath + ConstPath.RelativePath.Temp
    let availableName = await DataHandler.getAvailableFileName(
      tempPath,
      mapName,
      'zip',
    )
    zipPath = tempPath + availableName
    let resultData = await this.props.exportWorkspace(
      { maps: [mapName], outPath: path, isOpenMap: true, zipPath }
    )
    return resultData
  }

  setItemStatus = (item: any, status: string) => {
    // const selected = new Map(this.state.selectedData)
    // const hasItem = selected.has(item.name)
    // if (hasItem) {
    //   let _item = Object.assign({status: status}, item)
    //   selected.set(item.name, _item)
    // }
    // this.setState({
    //   selectedData: selected,
    // })
    this.setState(state => {
      const selected = new Map(state.selectedData)
      const isSelected = selected.has(item.name)
      if (isSelected) {
        if (status) {
          let _item = Object.assign({status: status}, item)
          selected.set(item.name, _item)
        } else {
          selected.delete(item.name)
        }
      }
      return { uploadData: selected }
    })
  }

  _renderPagePopup = () => {
    return (
      <PopMenu
        ref={ref => (this.pagePopModal = ref)}
        data={this.popData}
        device={this.props.device}
        hasCancel={false}
      />
    )
  }

  _renderHeaderRight = () => {
    return (
      <TextBtn
        btnText={getLanguage(this.props.language).Friends.RESOURCE_UPLOAD}
        textStyle={[styles.headerBtnTitle, this.state.selectedData.size === 0 && { color: color.fontColorGray3 }]}
        btnClick={async () => {
          if (this.state.selectedData.size === 0 || this.state.isUploading) {
            return
          }

          let result = true, resourceIds = []
          this.setState({ isUploading: true })
          for (const item of this.state.selectedData) {
            let name = item[1].name
            let index = name.lastIndexOf('.')
            if (index > 0) {
              name = name.substring(0, index)
            }
            this.setItemStatus(item[1], getLanguage(this.props.language).Friends.RESOURCE_EXPORTING)
            let _resultData = await this._exportData(name)

            result = result && _resultData.result
            console.warn(JSON.stringify(_resultData))

            try {
              if (_resultData.result) {
                this.setItemStatus(item[1], getLanguage(this.props.language).Friends.RESOURCE_UPLOADING)
                let resourceId = await this.onlineServicesUtils.uploadFile(
                  _resultData.zipPath,
                  `${name}.zip`,
                  'WORKSPACE',
                )
                if (resourceId) {
                  this.setItemStatus(item[1], '')
                  resourceIds.push(resourceId)
                  let deleteResult = await FileTools.deleteFile(_resultData.zipPath)
                  console.warn('deleteResult', deleteResult)
                }
              } else {
                this.setItemStatus(item[1], getLanguage(this.props.language).Friends.RESOURCE_EXPORT_FAILED)
              }
            } catch (error) {
              Toast.show(getLanguage(this.props.language).Friends.RESOURCE_EXPORT_FAILED)
            }
          }
          this.setState({ isUploading: false })

          if (resourceIds.length > 0 && this.groupInfo.id) {
            this.servicesUtils?.shareDataToGroup({
              groupId: this.groupInfo.id,
              ids: resourceIds,
            }).then(result => {
              if (result.succeed) {
                Toast.show(getLanguage(this.props.language).Friends.RESOURCE_UPLOAD_SUCCESS)
                this.cb && this.cb()
              } else {
                Toast.show(getLanguage(this.props.language).Friends.RESOURCE_UPLOAD_FAILED)
              }
            }).catch(() => {
              Toast.show(getLanguage(this.props.language).Friends.RESOURCE_UPLOAD_FAILED)
            })
          }
          console.warn(result)
        }}
      />
    )
  }

  _renderItem = ({item}: any) => {
    return (
      <UploadItem
        data={item}
        checked={!!this.state.selectedData.get(item.name)}
        onChange={value => {
          this.setState(state => {
            const selected = new Map(state.selectedData)
            const isSelected = selected.has(item.name)
            if (value && !isSelected) {
              selected.set(item.name, item)
            } else {
              selected.delete(item.name)
            }
            return { selectedData: selected }
          })
        }}
        isUploading={!!this.state.uploadData.get(item.name) && !!this.state.uploadData.get(item.name)?.status && this.state.isUploading}
        uploadingInfo={this.state.uploadData.get(item.name)?.status}
      />
    )
  }

  _keyExtractor = (item: object, index: number): string => index + ''

  _renderItemSeparatorComponent = () => {
    return <ListSeparator color={'transparent'} height={scaleSize(20)} />
  }

  _renderGroupList = () => {
    return (
      <FlatList
        ref={ref => this.list = ref}
        ItemSeparatorComponent={this._renderItemSeparatorComponent}
        data={this.state.data}
        renderItem={this._renderItem}
        keyExtractor={this._keyExtractor}
        extraData={this.state}
        refreshControl={
          <RefreshControl
            refreshing={this.state.isRefresh}
            onRefresh={this.getData}
            colors={['orange', 'red']}
            tintColor={'orange'}
            titleColor={'orange'}
            title={getLanguage(GLOBAL.language).Friends.LOADING}
            enabled={true}
          />
        }
      />
    )
  }

  render() {
    return (
      <Container
        showFullInMap={true}
        hideInBackground={false}
        headerProps={{
          title: getLanguage(GLOBAL.language).Friends.GROUP_RESOURCE,
          navigation: this.props.navigation,
          headerRight: this._renderHeaderRight(),
          // headerLeft: this.state.isManage && this._renderHeaderLeft(),
        }}
      >
        {this._renderGroupList()}
        {this._renderPagePopup()}
      </Container>
    )
  }
}


const mapStateToProps = (state: any) => ({
  user: state.user.toJS(),
  device: state.device.toJS().device,
  language: state.setting.toJS().language,
})

const mapDispatchToProps = {
  exportWorkspace,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GroupSourceUploadPage)
