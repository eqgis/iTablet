/**
 * @author ysl
 * @description 群组资源管理界面
 */
import React, { Component } from 'react'
import { StyleSheet, FlatList, RefreshControl, Text, View, Image } from 'react-native'
import { Container, PopMenu, ListSeparator, ImageButton, Dialog } from '@/components'
import { getLanguage } from '@/language'
import { getLanguage as getMyLanguage } from '../../language'
import { scaleSize, Toast, ResultInfo, SCoordinationUtils } from '@/utils'
import { size, color } from '@/styles'
import { UserType } from '@/constants'
import { getThemeAssets } from '@/assets'
import { downloadSourceFile, deleteSourceDownloadFile } from '@/redux/models/down'
import { openMap, closeMap } from '@/redux/models/map'
import { setCurrentGroup } from '@/redux/models/cowork'
import { getLayers } from '@/redux/models/layers'
import { connect, ConnectedProps } from 'react-redux'
import { SCoordination, SMediaCollector } from 'imobile_for_reactnative'
import { ResultDataBase, ResourceType } from 'imobile_for_reactnative/types/interface/iserver/types'
import TaskItem, { MoreParams } from './TaskItem'
// import BatchHeadBar from '../../../Mine/component/BatchHeadBar'
import { MainStackScreenNavigationProps, MainStackScreenRouteProp } from '@/types'
import NavigationService from '@/containers/NavigationService'
import { MapToolbar } from '@/containers/workspace/components'
import ServiceAction from '@/containers/workspace/components/ToolBar/modules/serviceModule/ServiceAction'
import { getImage } from '../../assets'

const ITEM_HEIGHT = scaleSize(80)

const styles = StyleSheet.create({
  headerBtnTitle: {
    fontSize: scaleSize(24),
    color: color.fontColorBlack,
  },
  dialogStyle: {
    height: scaleSize(300),
  },
  dropdown: {
    width: '100%',
    height: ITEM_HEIGHT,
    justifyContent: 'center',
  },
  dropdownText: {
    fontSize: size.fontSize.fontSizeLg,
    color: color.fontColorBlack,
    marginLeft: scaleSize(30),
  },
  dropdownContent: {
    width: '100%',
    justifyContent: 'center',
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    height: ITEM_HEIGHT,
  },
  dropdownItemImage: {
    width: scaleSize(48),
    height: scaleSize(48),
    marginRight: scaleSize(30),
    marginLeft: scaleSize(60),
  },
  dropdownItemText: {
    flex: 1,
    fontSize: size.fontSize.fontSizeLg,
  },
  dropdownItemRightText: {
    fontSize: size.fontSize.fontSizeLg,
    marginRight: scaleSize(30),
  },
  nullView: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: scaleSize(100),
    bottom: 0,
    alignItems: 'center',
  },
  nullSubView: {
    flex: 2,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nullImage: {
    height: scaleSize(270),
    width: scaleSize(270),
  },
  nullTitle: {
    marginTop: scaleSize(40),
    fontSize: size.fontSize.fontSizeLg,
    color: color.fontColorGray3,
  },
  bottomView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopLeftRadius: scaleSize(40),
    borderTopRightRadius: scaleSize(40),
    height: scaleSize(160),
    backgroundColor: 'white',
    elevation: 1,
    shadowOffset: { width: 0, height: 0 },
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowOpacity: 1,
    shadowRadius: 2,
  },
  bottomViewBtn: {
    // width: scaleSize(100),
    height: scaleSize(100),
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnStyle: {
    marginTop: scaleSize(8),
    color: '#1D1D1D',
    fontSize: size.fontSize.fontSizeMd,
  },
})

interface Props extends ReduxProps {
  navigation: MainStackScreenNavigationProps<'GuoTuTasks'>
  route: MainStackScreenRouteProp<'GuoTuTasks'>
}

type SelectedData = {
  download?: () => Promise<void>
} & ResourceType


interface State {
  data: Array<ResourceType>,
  isRefresh: boolean,
  firstLoad: boolean,
  // isDelete: boolean, // 是否是删除模式
  isMutiChoice: boolean, // 多选模式
  selectedData: Map<string, SelectedData>,
  currentModule: any,
  currentModuleIndex: number,
}

class GuoTuTasks extends Component<Props, State> {

  title: string
  servicesUtils: SCoordination | undefined
  popData: Array<any>
  popSourceData: Array<any>
  pagePopModal: PopMenu | null | undefined
  sourcePopModal: PopMenu | null | undefined
  container: any
  pageSize: number
  currentPage: number
  isLoading: boolean // 防止同时重复加载多次
  isNoMore: boolean // 是否能加载更多
  isManage: boolean // 是否是资源管理模式
  hasDownload: boolean // 是否有下载按钮
  keywords: string // 获取数据的关键词
  list: FlatList<any> | null | undefined
  deleteDialog: Dialog | undefined | null
  // dropdown: ModalDropdown
  modules: Array<any>
  tempSelectedData: Map<string, SelectedData>

  currentSelectData: MoreParams | undefined | null

  constructor(props: Props) {
    super(props)
    this.title = this.props.route?.params?.title || getMyLanguage().MY_TASK
    this.isManage = this.props.route?.params?.isManage !== undefined
      ? this.props.route?.params?.isManage
      : true
    this.hasDownload = this.props.route?.params?.hasDownload !== undefined
      ? this.props.route?.params?.hasDownload
      : true

    if (UserType.isOnlineUser(this.props.user.currentUser)) {
      this.servicesUtils = new SCoordination('online')
    } else if (UserType.isIPortalUser(this.props.user.currentUser)) {
      this.servicesUtils = new SCoordination('iportal')
    }

    if (!this.isManage) {
      this.modules = this.props.mapModules.modules[this.props.user.currentUser.userName].map(item =>
        item.getChunk(this.props.language),
      )
    } else {
      this.modules = []
    }

    this.state = {
      data: [],
      firstLoad: true,
      isRefresh: false,
      selectedData: new Map<string, SelectedData>(),
      isMutiChoice: false,
      currentModuleIndex: 0,
      currentModule: this.modules.length > 0 ? this.modules[0] : null,
    }
    this.pageSize = 20
    this.currentPage = 1
    this.isLoading = false // 防止同时重复加载多次
    this.isNoMore = false // 是否能加载更多
    this.tempSelectedData = new Map<string, SelectedData>()
    this.keywords = this.props.route?.params?.keywords || ''

    this.popData = [
      {
        title: getLanguage(this.props.language).Friends.GROUP_RESOURCE_UPLOAD,
        action: () => {
          NavigationService.navigate('GroupSourceUploadPage', {
            title: getLanguage(this.props.language).Profile.MAP,
            cb: () => {
              this.getGroupResources({
                pageSize: this.pageSize,
                currentPage: 1,
              })
            },
          })
        },
      },
      {
        title: getLanguage(this.props.language).Friends.GROUP_RESOURCE_DELETE,
        action: () => this._setMutiChoice(true),
      },
    ]

    this.popSourceData = [
      {
        title: getLanguage(this.props.language).Prompt.DOWNLOAD,
        action: () => this.currentSelectData?.download?.(),
      },
      {
        title: getLanguage(this.props.language).Cowork.UPDATE_LOCAL_SERVICE,
        action: () => {
          this.getGroupServices(this.props.currentGroup.id).then(result => {
            console.warn(result)
            if (result?.content?.[0].linkPage) {
              ServiceAction.downloadService(result?.content?.[0].linkPage)
            }
          })
        },
      },
      {
        title: getLanguage(this.props.language).Prompt.DELETE,
        action: () => {
          this.currentSelectData?.data.resourceId && this._delete([this.currentSelectData?.data.resourceId])
        },
      },
      // {
      //   title: getLanguage(this.props.language).Prompt.RENAME,
      //   action: () => {
      //   },
      // },
      {
        title: getLanguage(this.props.language).Prompt.CANCEL,
      },
    ]
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    const shouldUpdate = JSON.stringify(nextState) !== JSON.stringify(this.state) ||
      JSON.stringify(nextProps) !== JSON.stringify(this.props) ||
      !this.state.selectedData.compare(nextState.selectedData)
    console.warn(JSON.stringify(nextProps.currentGroup) !== JSON.stringify(this.props.currentGroup))
    return shouldUpdate
  }

  componentDidUpdate(prevProps: Props) {
    if (JSON.stringify(prevProps.currentGroup) !== JSON.stringify(this.props.currentGroup)) {
      this.getData()
    }
  }

  componentDidMount() {
    if (!this.props?.currentGroup?.id) {
      Toast.show('请选择地区')
      return
    }
    this.getData()
  }

  getData = () => {
    try {
      this.servicesUtils?.getGroupInfo(this.props.currentGroup.id).then(groupInfo => {
        if (!groupInfo) return
        this.props.setCurrentGroup(groupInfo.basicInfo)
        this.getGroupResources({
          pageSize: this.pageSize,
          currentPage: 1,
        })
      })
    } catch (error) {
      __DEV__ && console.warn(error)
    }
  }

  /**
   * 查找群组资源
   * @param param
   * {
   *    pageSize: number,
   *    currentPage: number,
   *    orderType: DESC | ASC,
   *    orderBy: ResourceOrderBy,
   *    keywords: string[], // 群资源名称关键字过滤
   *    resourceSubTypes: string[], // 群组数据类型过滤
   *    cb: () => void,
   * }
   */
  getGroupResources = ({ pageSize = this.pageSize, currentPage = 1, orderType = 'DESC', orderBy = 'UPDATETIME', keywords = this.keywords, resourceSubTypes = this.isManage ? [] : ['WORKSPACE'], cb = () => { } }: any) => {
    if (!this.props?.currentGroup?.id) {
      Toast.show('请选择地区')
      return
    }
    const filterData = (data: ResourceType[], resourceSubTypes: Array<string>) => {
      const _data = []
      for (const item of data) {
        const description = item.description && JSON.parse(item.description)
        if (resourceSubTypes.length === 0 && description?.executor === this.props.user.currentUser.userName) {
          _data.push(item)
        } else if (
          resourceSubTypes.indexOf(item.sourceSubtype) >= 0 &&
          (
            this.props.user.currentUser.userName === 'admin' ||
            description?.executor === this.props.user.currentUser.userName // 判断该任务是否是当前用户
          )
        ) {
          _data.push(item)
        }
      }
      return _data
    }
    this.servicesUtils?.getGroupResources({
      groupId: this.props.currentGroup.id,
      // resourceCreator: this.props.user.currentUser.userId,
      currentPage: currentPage,
      pageSize: pageSize,
      orderType: orderType,
      orderBy: orderBy,
      keywords: keywords,
    }).then((result: ResultDataBase<ResourceType>) => {
      if (result && result.content) {
        let _data = [], _filterData: ResourceType[] = []
        if (result.content.length > 0) {
          _filterData = filterData(result.content, resourceSubTypes)
          // const _filterData = result.content
          if (this.currentPage < currentPage) {
            _data = this.state.data.deepClone()
            _data = _data.concat(_filterData)
          } else {
            _data = _filterData
          }
        }
        // 判断是否还有更多数据
        // if (_data.length === result.total) {
        //   this.isNoMore = true
        // }
        if (currentPage === result.totalPage) {
          this.isNoMore = true
        }
        this.currentPage = currentPage
        this.setState({
          data: _data,
          isRefresh: false,
          firstLoad: false,
        }, () => {
          // 不满pageSize,继续到下一页查找相关数据
          if (result.totalPage != undefined && currentPage < result.totalPage && this.state.data.length <= pageSize * currentPage) {
            this.getGroupResources({
              pageSize: this.pageSize,
              currentPage: this.currentPage + 1,
              cb: cb,
            })
          } else {
            this.isLoading = false
            cb && cb()
          }
        })
      } else {
        this.setState({
          isRefresh: false,
          firstLoad: false,
        })
        this.isLoading = false
      }
    }).catch(() => {
      this.setState({
        isRefresh: false,
        firstLoad: false,
      })
    })
  }

  getGroupServices = async (groupID: string, keywords?: string[]) => {
    return SCoordinationUtils.getScoordiantion().getGroupResources({
      groupId: groupID,
      keywords: keywords,
      // resourceCreator: _params.user.currentUser.userId,
      currentPage: 1,
      pageSize: 10000,
      orderType: 'DESC',
      orderBy: 'UPDATETIME',
      groupResourceType: 'SERVICE',
    })
  }

  refresh = (cb?: () => any) => {
    if (this.isLoading) return
    this.isLoading = true
    this.isNoMore = false
    this.getGroupResources({
      pageSize: this.pageSize,
      currentPage: 1,
      cb,
    })
    this.setState({ isRefresh: false })
  }

  loadMore = () => {
    if (this.isLoading || this.isNoMore || this.state.data.length < this.pageSize) return
    this.isLoading = true
    this.getGroupResources({
      pageSize: this.pageSize,
      currentPage: this.currentPage + 1,
    })
  }

  _setMutiChoice = (isMutiChoice?: boolean, resetSelectData?: boolean) => {
    if (isMutiChoice === undefined) {
      isMutiChoice = !this.state.isMutiChoice
    }
    if (resetSelectData) {
      this.setState(state => {
        const selected = new Map(state.selectedData)
        selected.clear()
        return { selectedData: selected, isMutiChoice }
      })
    } else {
      this.setState({
        isMutiChoice: isMutiChoice,
      })
    }
  }

  // _selectAll = () => {
  //   const selected = new Map<string, SelectedData>()
  //   if (this.state.data.length > this.state.selectedData.size) {
  //     this.state.data.forEach(item => {
  //       selected.set(item.resourceId, item)
  //     })
  //   }
  //   this.setState({ selectedData: selected })
  // }

  _delete = (ids: Array<string>) => {
    if (ids.length === 0) return
    this.servicesUtils?.deleteGroupResources({
      groupId: this.props.currentGroup.id,
      resourceIds: ids,
      groupResourceType: 'DATA',
    }).then(async result => {
      if (result.succeed) {
        this.setState(state => {
          const selected = new Map(state.selectedData)
          selected.clear()
          return { selectedData: selected }
        })
        this.getGroupResources({
          pageSize: this.pageSize,
          currentPage: 1,
          // cb: () => this._setMutiChoice(false),
        })
      } else {
        if (result.error?.errorMsg !== undefined) {
          Toast.show(ResultInfo.resultError(result.error) || 'error')
        }
      }
    })
  }

  _deleteSource = () => {
    if (this.state.isMutiChoice) {
      if (this.state.selectedData.size === 0) {
        Toast.show(getLanguage(this.props.language).Friends.GROUP_SELECT_MEMBER)
        return false
      }
      let ids: Array<string> = []
      this.state.selectedData.forEach(item => {
        ids.push(item.resourceId)
      })
      this._delete(ids)
      return true
    }
    return false
  }

  _onPress = async (data: {
    path: string,
    name: string,
  }) => {
    try {
      console.warn(data)
      if (this.props.map.currentMap.name === data.name) {
        Toast.show('地图已经打开')
        return
      }
      if (this.props.map.currentMap.name) {
        await this.props.closeMap()
      }
      // 移除地图上所有callout
      await SMediaCollector.removeMedias()
      Toast.show('正在打开地图')
      await this.props.openMap({
        path: data.path,
        name: data.name,
      })
      await this.props.getLayers()

      Toast.show('正在加载服务')
      this.getGroupServices(this.props.currentGroup.id).then(result => {
        console.warn(result)
        if (result?.content?.[0].linkPage) {
          ServiceAction.downloadService(result?.content?.[0].linkPage)
        }
      })
    } catch (error) {
      Toast.show('地图打开失败,请检查地图诗句是否完整')
      __DEV__ && console.warn(error)
    }
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

  _renderSourcePopup = () => {
    return (
      <PopMenu
        ref={ref => (this.sourcePopModal = ref)}
        data={this.popSourceData}
        device={this.props.device}
        hasCancel={false}
      />
    )
  }

  _renderHeaderRight = () => {
    return (
      <ImageButton
        containerStyle={{ marginRight: scaleSize(6) }}
        icon={getImage().location}
        onPress={() => {
          NavigationService.navigate('GuoTuLocation')
        }}
      />
    )
  }

  _renderItem = ({ item }: { item: ResourceType }) => {
    return (
      <TaskItem
        user={this.props.user}
        data={item}
        onPress={this._onPress}
        openCheckBox={this.state.isMutiChoice}
        // hasDownload={this.hasDownload}
        downloadData={this.props.sourceDownloads[item.resourceId]}
        downloadSourceFile={this.props.downloadSourceFile}
        deleteSourceDownloadFile={this.props.deleteSourceDownloadFile}
        checked={!!this.state.selectedData.get(item.resourceId)}
        onChecked={({ value, data, download }) => {
          let selected = new Map(this.tempSelectedData)
          const isSelected = selected.has(data.resourceId)
          if (isSelected) {
            if (!value) {
              selected.delete(data.resourceId)
              this.setState({ selectedData: selected })
            } else {
              const item = selected.get(data.resourceId)
              if (!item?.download) {
                selected.set(data.resourceId, { ...data, download: download })
                this.setState({ selectedData: selected })
              }
            }
          } else if (value) {
            selected.set(data.resourceId, { ...data, download: download })
            this.setState({ selectedData: selected })
          }
          this.tempSelectedData = selected
        }}
        checkAction={({ value, data, download }) => {
          this.setState(state => {
            const selected = new Map(state.selectedData)
            const isSelected = selected.has(data.resourceId)
            if (value && !isSelected) {
              selected.set(data.resourceId, { ...data, download: download })
            } else {
              selected.delete(data.resourceId)
            }
            this.tempSelectedData = selected
            return { selectedData: selected }
          })
        }}
        onMoreAction={({ event, data, download }) => {
          this.currentSelectData = { event, data, download }
          this.sourcePopModal?.setVisible(true, {
            x: event.nativeEvent.pageX,
            y: event.nativeEvent.pageY,
          })
        }}
      />
    )
  }

  _keyExtractor = (item: ResourceType, index: number): string => index + ''

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
            onRefresh={this.refresh}
            colors={['orange', 'red']}
            tintColor={'orange'}
            titleColor={'orange'}
            title={getLanguage(this.props.language).Friends.REFRESHING}
            enabled={true}
          />
        }
        onEndReachedThreshold={0.5}
        onEndReached={this.loadMore}
      />
    )
  }

  _renderDeleteDialog = () => {
    return (
      <Dialog
        ref={ref => (this.deleteDialog = ref)}
        type={Dialog.Type.MODAL}
        info={getLanguage(this.props.language).Friends.RESOURCE_DELETE_INFO}
        confirmAction={() => {
          if (this._deleteSource()) {
            this.deleteDialog?.setDialogVisible(false)
          }
        }}
        // opacityStyle={styles.dialogStyle}
        confirmBtnTitle={getLanguage(this.props.language).Prompt.DELETE}
        cancelBtnTitle={getLanguage(this.props.language).Prompt.CANCEL}
      />
    )
  }

  _dropDownOnSelect = (idx: string, value: any) => {
    this.setState({
      currentModule: value.props,
      currentModuleIndex: parseInt(idx),
    })
  }

  _renderDropdownItem = (rowData: any) => {
    return (
      <View style={styles.dropdownItem}>
        <Image resizeMode={'contain'} style={styles.dropdownItemImage} source={rowData.moduleImage} />
        <Text style={styles.dropdownItemText}>{rowData.title}</Text>
      </View>
    )
  }

  _renderNull = () => {
    return (
      <View style={styles.nullView}>
        <View style={styles.nullSubView}>
          <Image style={styles.nullImage} source={getThemeAssets().cowork.bg_photo_data} />
          <Text style={styles.nullTitle}>{getLanguage(this.props.language).Friends.GROUP_DATA_NULL}</Text>
        </View>
        <View style={{ flex: 1, backgroundColor: 'transparent' }} />
      </View>
    )
  }

  _closeDelete = () => {
    this._setMutiChoice(false)
  }

  renderToolBar = () => {
    return (
      <MapToolbar
        navigation={this.props.navigation}
        type={global.Type || undefined}
        initIndex={4}
        mapModules={this.props.mapModules}
      />
    )
  }

  render() {
    return (
      <Container
        showFullInMap={true}
        hideInBackground={false}
        headerProps={{
          withoutBack: true,
          title: this.title,
          navigation: this.props.navigation,
          headerRight: this._renderHeaderRight(),
          headerTitleViewStyle: {
            justifyContent: 'flex-start',
            marginLeft: scaleSize(80),
          },
        }}
        bottomBar={this.renderToolBar()}
      >
        {this.state.data.length === 0 && !this.state.firstLoad && this._renderNull()}
        {this._renderGroupList()}
        {this._renderPagePopup()}
        {this._renderSourcePopup()}
        {this._renderDeleteDialog()}
      </Container>
    )
  }
}

type ReduxProps = ConnectedProps<typeof connector>

const mapStateToProps = (state: any) => ({
  user: state.user.toJS(),
  device: state.device.toJS().device,
  language: state.setting.toJS().language,
  currentGroup: state.guotu.toJS().currentGroup,
  mapModules: state.mapModules.toJS(),
  sourceDownloads: state.down.toJS().sourceDownloads,
  map: state.map.toJS(),
})

const mapDispatchToProps = {
  downloadSourceFile,
  deleteSourceDownloadFile,
  setCurrentGroup,
  openMap,
  closeMap,
  getLayers,
}

const connector = connect(
  mapStateToProps,
  mapDispatchToProps,
)

export default connector(GuoTuTasks)
