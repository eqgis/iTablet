/**
 * @author ysl
 * @description 群组资源管理界面
 */
import React, { Component } from 'react'
import { StyleSheet, FlatList, RefreshControl, Text, View, Image, GestureResponderEvent } from 'react-native'
import { Container, PopMenu, ListSeparator, ImageButton, TextBtn, Dialog } from '../../../../../components'
import { getLanguage } from '../../../../../language'
import { scaleSize, Toast, screen, ResultInfo } from '../../../../../utils'
import { size, color } from '../../../../../styles'
import { UserType } from '../../../../../constants'
import { getThemeAssets } from '../../../../../assets'
import NavigationService from '../../../../NavigationService'
import { Users } from '../../../../../redux/models/user'
import { downloadSourceFile, deleteSourceDownloadFile, IDownloadProps, DownloadData } from '../../../../../redux/models/down'
import { setCurrentGroup } from '../../../../../redux/models/cowork'
import { connect } from 'react-redux'
import { SCoordination, GroupType } from 'imobile_for_reactnative'
import SourceItem, { MoreParams, ItemData } from '../components/SourceItem'
import BatchHeadBar from '../../../Mine/component/BatchHeadBar'
import ModalDropdown from 'react-native-modal-dropdown'

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
    width: scaleSize(100),
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

interface Props {
  navigation: any,
  user: Users,
  language: string,
  device: any,
  mapModules: any,
  currentGroup: GroupType,
  sourceDownloads: DownloadData,
  downloadSourceFile: (params: IDownloadProps) => Promise<any[]>,
  deleteSourceDownloadFile: (id: number | string) => Promise<any[]>,
  setCurrentGroup: (data: any) => Promise<any[]>,
}

type SelectedData =  {
  download?: () => Promise<void>
} & ItemData


interface State {
  data: Array<ItemData>,
  isRefresh: boolean,
  firstLoad: boolean,
  // isDelete: boolean, // 是否是删除模式
  isMutiChoice: boolean, // 多选模式
  selectedData: Map<string, SelectedData>,
  currentModule: any,
  currentModuleIndex: number,
}

class GroupSourceManagePage extends Component<Props, State> {

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
  dropdown: ModalDropdown
  modules: Array<any>
  tempSelectedData: Map<string, SelectedData>

  currentSelectData: MoreParams | undefined | null

  constructor(props: Props) {
    super(props)
    this.title = this.props.navigation?.state?.params?.title || getLanguage(GLOBAL.language).Friends.GROUP_RESOURCE
    this.isManage = this.props.navigation?.state?.params?.isManage !== undefined
      ? this.props.navigation?.state?.params?.isManage
      : true
    this.hasDownload = this.props.navigation?.state?.params?.hasDownload !== undefined
      ? this.props.navigation?.state?.params?.hasDownload
      : true

    if (UserType.isOnlineUser(this.props.user.currentUser)) {
      this.servicesUtils = new SCoordination('online')
    } else if (UserType.isIPortalUser(this.props.user.currentUser)) {
      this.servicesUtils = new SCoordination('iportal')
    }

    if (!this.isManage) {
      this.modules = this.props.mapModules.modules.map(item =>
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
    this.keywords = this.props.navigation?.state?.params?.keywords || ''

    this.popData = [
      {
        title: getLanguage(GLOBAL.language).Friends.GROUP_RESOURCE_UPLOAD,
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
        title: getLanguage(GLOBAL.language).Friends.GROUP_RESOURCE_DELETE,
        action: () => this._setMutiChoice(true),
      },
    ]

    this.popSourceData = [
      {
        title: getLanguage(GLOBAL.language).Prompt.DOWNLOAD,
        action: () => this.currentSelectData?.download?.(),
      },
      // {
      //   title: getLanguage(GLOBAL.language).Cowork.PUBLISH,
      //   action: () => {
      //   },
      // },
      {
        title: getLanguage(GLOBAL.language).Prompt.DELETE,
        action: () => {
          this.currentSelectData?.data.resourceId && this._delete([this.currentSelectData?.data.resourceId])
        },
      },
      // {
      //   title: getLanguage(GLOBAL.language).Prompt.RENAME,
      //   action: () => {
      //   },
      // },
      {
        title: getLanguage(GLOBAL.language).Prompt.CANCEL,
      },
    ]
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    let shouldUpdate = JSON.stringify(nextState) !== JSON.stringify(this.state) ||
      JSON.stringify(nextProps) !== JSON.stringify(this.props) ||
      !this.state.selectedData.compare(nextState.selectedData)
    return shouldUpdate
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.device.orientation !== this.props.device.orientation) {
      this.dropdown?.hide()
    }
  }

  componentDidMount() {
    this.servicesUtils?.getGroupInfo(this.props.currentGroup.id).then(groupInfo => {
      this.props.setCurrentGroup(groupInfo.basicInfo)
      this.getGroupResources({
        pageSize: this.pageSize,
        currentPage: 1,
      })
    })
  }

  getGroupResources = ({ pageSize = this.pageSize, currentPage = 1, orderType = 'DESC', orderBy = 'UPDATETIME', keywords = this.keywords, cb = () => { } }: any) => {
    this.servicesUtils?.getGroupResources({
      groupId: this.props.currentGroup.id,
      // resourceCreator: this.props.user.currentUser.userId,
      currentPage: currentPage,
      pageSize: pageSize,
      orderType: orderType,
      orderBy: orderBy,
      keywords: keywords,
    }).then((result: any) => {
      if (result && result.content) {
        let _data = []
        if (result.content.length > 0) {
          if (this.currentPage < currentPage) {
            _data = this.state.data.deepClone()
            _data = _data.concat(result.content)
          } else {
            _data = result.content
          }
        }
        // 判断是否还有更多数据
        if (_data.length === result.total) {
          this.isNoMore = true
        }
        this.currentPage = currentPage
        this.setState({
          data: _data,
          isRefresh: false,
          firstLoad: false,
        }, () => {
          this.isLoading = false
          cb && cb()
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

  _selectAll = () => {
    const selected = new Map<string, SelectedData>()
    if (this.state.data.length > this.state.selectedData.size) {
      this.state.data.forEach(item => {
        selected.set(item.resourceId, item)
      })
    }
    this.setState({ selectedData: selected })
  }

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
          Toast.show(ResultInfo.resultError(result.error))
        }
      }
    })
  }

  _deleteSource = () => {
    if (this.state.isMutiChoice) {
      if (this.state.selectedData.size === 0) {
        Toast.show(getLanguage(GLOBAL.language).Friends.GROUP_SELECT_MEMBER)
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

  _onPress = (data: any) => {
    let itemAction = this.props.navigation?.state?.params?.itemAction
    if (itemAction) {
      let temp: any = {data}
      if (this.dropdown) {
        temp.module = this.state.currentModule
        temp.moduleIndex = this.state.currentModuleIndex
      }
      itemAction(temp)
    }
  }

  _renderBatchHead = () => {
    if (!this.state.isMutiChoice) return null
    return (
      <BatchHeadBar
        select={this.state.selectedData.size}
        total={this.state.data.length}
        selectAll={this._selectAll}
        deselectAll={this._selectAll}
      />
    )
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

  renderRight = () => {
    return (
      <ImageButton
        icon={getThemeAssets().cowork.icon_nav_set}
        onPress={(event: GestureResponderEvent) => {
          this.pagePopModal && this.pagePopModal.setVisible(true, {
            x: event.nativeEvent.pageX,
            y: event.nativeEvent.pageY,
          })
        }}
      />
    )
  }

  _renderHeaderRight = () => {
    if (!this.isManage) {
      return (
        <ImageButton
          containerStyle={{marginRight: scaleSize(6)}}
          icon={getThemeAssets().cowork.icon_nav_export}
          onPress={() => {
            NavigationService.navigate('GroupSourceUploadPage', {
              title: getLanguage(this.props.language).Profile.MAP,
              cb: () => {
                this.getGroupResources({
                  pageSize: this.pageSize,
                  currentPage: 1,
                })
              },
            })
          }}
        />
      )
    }
    return (
      <>
        <ImageButton
          // containerStyle={{marginRight: scaleSize(6)}}
          icon={getThemeAssets().nav.icon_nav_batch_operation}
          onPress={() => {
            this._setMutiChoice()
          }}
        />
        {
          (
            this.props.currentGroup?.resourceSharer === 'CREATOR' && this.props.currentGroup?.creator === this.props.user.currentUser.userName ||
            this.props.currentGroup?.resourceSharer === 'MEMBER'
          ) &&
          <ImageButton
            containerStyle={{
              marginRight: scaleSize(6),
              marginLeft: scaleSize(30),
            }}
            icon={getThemeAssets().cowork.icon_nav_export}
            onPress={() => {
              NavigationService.navigate('GroupSourceUploadPage', {
                cb: () => {
                  this.getGroupResources({
                    pageSize: this.pageSize,
                    currentPage: 1,
                  })
                },
              })
            }}
          />
        }
      </>
    )
    // if (this.state.isMutiChoice) {
    //   return (
    //     <TextBtn
    //       btnText={getLanguage(this.props.language).Prompt.DELETE}
    //       textStyle={[styles.headerBtnTitle, this.state.isMutiChoice && { color: 'red' }]}
    //       btnClick={() => {
    //         if (this.state.selectedData.size > 0) {
    //           this.deleteDialog?.setDialogVisible(true)
    //         }
    //       }}
    //     />
    //   )
    // } else {
    //   return (
    //     <ImageButton
    //       containerStyle={{marginRight: scaleSize(6)}}
    //       icon={getThemeAssets().cowork.icon_nav_set}
    //       onPress={(event: any) => {
    //         this.pagePopModal?.setVisible(true, {
    //           x: event.nativeEvent.pageX,
    //           y: event.nativeEvent.pageY,
    //         })
    //       }}
    //     />
    //   )
    // }
  }

  _renderHeaderLeft = () => {
    return (
      <TextBtn
        btnText={getLanguage(this.props.language).Friends.CANCEL}
        textStyle={[styles.headerBtnTitle]}
        btnClick={() => this._setMutiChoice(false, true)}
      />
    )
  }

  _renderItem = ({ item }: { item: ItemData }) => {
    return (
      <SourceItem
        user={this.props.user}
        data={item}
        onPress={this._onPress}
        openCheckBox={this.state.isMutiChoice}
        // hasDownload={this.hasDownload}
        downloadData={this.props.sourceDownloads[item.resourceId]}
        downloadSourceFile={this.props.downloadSourceFile}
        deleteSourceDownloadFile={this.props.deleteSourceDownloadFile}
        checked={!!this.state.selectedData.get(item.resourceId)}
        onChecked={({value, data, download}) => {
          let selected = new Map(this.tempSelectedData)
          const isSelected = selected.has(data.resourceId)
          if (isSelected) {
            const item = selected.get(data.resourceId)
            if (!item?.download) {
              selected.set(data.resourceId, {...data, download: download})
              this.setState({selectedData: selected})
            }
          } else if (value) {
            selected.set(data.resourceId, {...data, download: download})
            this.setState({selectedData: selected})
          }
          this.tempSelectedData = selected
        }}
        checkAction={({value, data, download}) => {
          this.setState(state => {
            const selected = new Map(state.selectedData)
            const isSelected = selected.has(data.resourceId)
            if (value && !isSelected) {
              selected.set(data.resourceId, {...data, download: download})
            } else {
              selected.delete(data.resourceId)
            }
            this.tempSelectedData = selected
            return { selectedData: selected }
          })
        }}
        onMoreAction={({event, data, download}) => {
          this.currentSelectData = {event, data, download}
          this.sourcePopModal?.setVisible(true, {
            x: event.nativeEvent.pageX,
            y: event.nativeEvent.pageY,
          })
        }}
      />
    )
  }

  _keyExtractor = (item: ItemData, index: number): string => index + ''

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
            title={getLanguage(GLOBAL.language).Friends.LOADING}
            enabled={true}
          />
        }
        onEndReachedThreshold={0.5}
        onEndReached={this.loadMore}
      />
    )
  }

  _renderMutiChoiceButtons = () => {
    if (!this.state.isMutiChoice) return null
    return (
      <View style={styles.bottomView}>
        <ImageButton
          key={'download'}
          containerStyle={styles.bottomViewBtn}
          icon={getThemeAssets().cowork.icon_nav_import}
          title={getLanguage(GLOBAL.language).Prompt.DOWNLOAD}
          titleStyle={styles.btnStyle}
          onPress={() => {
            if (this.state.selectedData.size > 0) {
              const keys = this.state.selectedData.keys()
              for(let key of keys) {
                const item = this.state.selectedData.get(key)
                if (typeof item.download === 'function') {
                  item.download()
                }
                // this.state.selectedData.get(key)?.download?.()
              }
            }
          }}
        />
        <ImageButton
          key={'delete'}
          containerStyle={styles.bottomViewBtn}
          icon={getThemeAssets().edit.icon_delete}
          title={getLanguage(GLOBAL.language).Prompt.DELETE}
          titleStyle={styles.btnStyle}
          onPress={() => {
            if (this.state.selectedData.size > 0) {
              this.deleteDialog?.setDialogVisible(true)
            }
          }}
        />
      </View>
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

  _renderPopMenu = () => {
    if (this.isManage) return null
    let maxHeight = this.modules.length * ITEM_HEIGHT
    let limitHeight = screen.getScreenHeight(this.props.device.orientation) - screen.getHeaderHeight() - ITEM_HEIGHT

    if (maxHeight > limitHeight) maxHeight = limitHeight

    return (
      <ModalDropdown
        ref={(ref: ModalDropdown) => this.dropdown = ref}
        style={styles.dropdown}
        textStyle={styles.dropdownText}
        dropdownStyle={[styles.dropdownContent, { height: maxHeight }]}
        options={this.modules}
        renderRow={this._renderDropdownItem}
        onSelect={this._dropDownOnSelect}
      >
        <View style={[styles.dropdownItem, { backgroundColor: color.itemColorGray2 }]}>
          <Image resizeMode={'contain'} style={styles.dropdownItemImage} source={this.state.currentModule.moduleImage} />
          <Text style={styles.dropdownItemText}>{this.state.currentModule.title}</Text>
          <Text style={styles.dropdownItemRightText}>{getLanguage(GLOBAL.language).Friends.SELECT_MODULE}</Text>
        </View>
      </ModalDropdown>
    )
  }

  _renderNull = () => {
    return (
      <View style={styles.nullView}>
        <View style={styles.nullSubView}>
          <Image style={styles.nullImage} source={getThemeAssets().cowork.bg_photo_data} />
          <Text style={styles.nullTitle}>{getLanguage(GLOBAL.language).Friends.GROUP_DATA_NULL}</Text>
        </View>
        <View style={{ flex: 1, backgroundColor: 'transparent' }} />
      </View>
    )
  }

  _closeDelete = () => {
    this._setMutiChoice(false)
  }

  render() {
    return (
      <Container
        showFullInMap={true}
        hideInBackground={false}
        headerProps={{
          title: this.title,
          navigation: this.props.navigation,
          headerRight: !this.state.firstLoad && this._renderHeaderRight(),
          // headerLeft: this.state.isMutiChoice && this._renderHeaderLeft(),
          // backAction: this.state.isMutiChoice && this._closeDelete,
          headerTitleViewStyle: {
            justifyContent: 'flex-start',
            marginLeft: scaleSize(80),
          },
        }}
      >

        {/* {this._renderPopMenu()} */}
        {this._renderBatchHead()}
        {this.state.data.length === 0 && !this.state.firstLoad && this._renderNull()}
        {this._renderGroupList()}
        {this._renderMutiChoiceButtons()}
        {this._renderPagePopup()}
        {this._renderSourcePopup()}
        {this._renderDeleteDialog()}
      </Container>
    )
  }
}


const mapStateToProps = (state: any) => ({
  user: state.user.toJS(),
  device: state.device.toJS().device,
  language: state.setting.toJS().language,
  currentGroup: state.cowork.toJS().currentGroup,
  mapModules: state.mapModules.toJS(),
  sourceDownloads: state.down.toJS().sourceDownloads,
})

const mapDispatchToProps = {
  downloadSourceFile,
  deleteSourceDownloadFile,
  setCurrentGroup,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GroupSourceManagePage)
