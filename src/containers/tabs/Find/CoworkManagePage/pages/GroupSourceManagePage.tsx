/**
 * @author ysl
 * @description 群组资源管理界面
 */
import React, { Component } from 'react'
import { StyleSheet, FlatList, RefreshControl, Text, View, Image } from 'react-native'
import { Container, PopMenu, ListSeparator, ImageButton, TextBtn, Dialog } from '../../../../../components'
import { getLanguage } from '../../../../../language'
import { scaleSize, Toast, screen } from '../../../../../utils'
import { size, color } from '../../../../../styles'
import { UserType } from '../../../../../constants'
import { getThemeAssets } from '../../../../../assets'
import NavigationService from '../../../../NavigationService'
import { Users } from '../../../../../redux/models/user'
import { GroupList } from '../components'
import { connect } from 'react-redux'
import { SCoordination } from 'imobile_for_reactnative'
import { SourceItem } from '../components'
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
})

interface Props {
  navigation: Object,
  user: Users,
  language: string,
  device: any,
  mapModules: any,
}

interface State {
  data: Array<any>,
  isRefresh: boolean,
  isDelete: boolean, // 是否是删除模式
  selectedData: Map<string, any>,
  currentModule: any,
  currentModuleIndex: number,
}

class GroupSourceManagePage extends Component<Props, State> {

  title: string
  servicesUtils: SCoordination | undefined
  popData: Array<any>
  pagePopModal: PopMenu | null | undefined
  container: any
  pageSize: number
  currentPage: number
  isLoading:boolean // 防止同时重复加载多次
  isNoMore: boolean // 是否能加载更多
  groupList: GroupList | null | undefined
  groupInfo: any
  isManage: boolean // 是否是资源管理模式
  list: FlatList<any> | null | undefined
  deleteDialog: Dialog | undefined | null
  modules: Array<any>
  itemAction?: (data?: any) => void

  constructor(props: Props) {
    super(props)
    this.groupInfo = this.props.navigation?.state?.params?.groupInfo
    this.title = this.props.navigation?.state?.params?.title || getLanguage(GLOBAL.language).Friends.GROUP_RESOURCE
    this.isManage = this.props.navigation?.state?.params?.isManage !== undefined
      ? this.props.navigation?.state?.params?.isManage
      : true

    if (UserType.isOnlineUser(this.props.user.currentUser)) {
      this.servicesUtils = new SCoordination('online')
    } else if (UserType.isIPortalUser(this.props.user.currentUser)){
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
      isRefresh: false,
      selectedData: new Map<string, Object>(),
      isDelete: false,
      currentModuleIndex: 0,
      currentModule: this.modules.length > 0 ? this.modules[0] : null,
    }
    this.pageSize = 20
    this.currentPage = 1
    this.isLoading = false // 防止同时重复加载多次
    this.isNoMore = false // 是否能加载更多


    this.popData = [
      {
        title: getLanguage(GLOBAL.language).Friends.GROUP_RESOURCE_UPLOAD,
        action: () => {
          NavigationService.navigate('GroupSourceUploadPage', {
            title: getLanguage(this.props.language).Profile.MAP,
            groupInfo: this.groupInfo,
            cb: () => {
              this.getGroupResources({
                pageSize: this.pageSize,
                currentPage: 1,
              })
            }
          })
        },
      },
      {
        title: getLanguage(GLOBAL.language).Friends.GROUP_RESOURCE_DELETE,
        action: () => this._setDelete(true),
      },
    ]
  }
  
  shouldComponentUpdate(nextProps: Props, nextState: State) {
    let shouldUpdate = JSON.stringify(nextState) !== JSON.stringify(this.state) ||
    JSON.stringify(nextProps) !== JSON.stringify(this.props) ||
    !this.state.selectedData.compare(nextState.selectedData)
    return shouldUpdate
  }

  componentDidMount() {
    this.getGroupResources({
      pageSize: this.pageSize,
      currentPage: 1,
    })
  }

  getGroupResources = ({pageSize = this.pageSize, currentPage = 1, orderType = 'DESC', cb = () => {}}: any) => {
    this.servicesUtils?.getGroupResources({
      groupId: this.groupInfo.id,
      // resourceCreator: this.props.user.currentUser.userId,
      currentPage: currentPage,
      pageSize: pageSize,
      orderType: orderType,
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
        }, () => {
          this.isLoading = false
          cb && cb()
        })
      } else {
        this.state.isRefresh && this.setState({ isRefresh: false })
        this.isLoading = false
      }
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

  _setDelete = (isDelete?: boolean, resetSelectData?: boolean) => {
    if (isDelete === undefined) {
      isDelete = !this.state.isDelete
    }
    if (resetSelectData) {
      this.setState(state => {
        const selected = new Map(state.selectedData)
        selected.clear()
        return { selectedData: selected, isDelete }
      })
    } else {
      this.setState({
        isDelete: isDelete,
      })
    }
  }

  _selectAll = () => {
    const selected = new Map<string, Object>()
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
      groupId: this.groupInfo.id,
      resourceIds: ids,
      groupResourceType: 'DATA',
    }).then(async result => {
      if (result.succeed) {
        this.getGroupResources({
          pageSize: this.pageSize,
          currentPage: 1,
          cb: this._setDelete,
        })
      }
    })
  }

  _deleteSource = () => {
    if (this.state.isDelete) {
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
      itemAction({
        data,
        module: this.state.currentModule,
        moduleIndex: this.state.currentModuleIndex,
      })
    }
  }

  _renderBatchHead = () => {
    if (!this.state.isDelete) return null
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

  renderRight = () => {
    return (
      <ImageButton
        icon={getThemeAssets().tabBar.tab_setting_selected}
        onPress={(event: any) => {
          this.pagePopModal && this.pagePopModal.setVisible(true, {
            x: event.nativeEvent.pageX,
            y: event.nativeEvent.pageY,
          })
        }}
      />
    )
  }

  _renderHeaderRight = () => {
    if (this.state.isDelete) {
      return (
        <TextBtn
          btnText={getLanguage(this.props.language).Prompt.DELETE}
          textStyle={[styles.headerBtnTitle, this.state.isDelete && {color: 'red'}]}
          btnClick={() => {
            if (this.state.selectedData.size > 0) {
              this.deleteDialog?.setDialogVisible(true)
            }
          }}
        />
      )
    } else {
      return (
        <ImageButton
          icon={getThemeAssets().tabBar.tab_setting_selected}
          onPress={(event: any) => {
            this.pagePopModal?.setVisible(true, {
              x: event.nativeEvent.pageX,
              y: event.nativeEvent.pageY,
            })
          }}
        />
      )
    }
  }

  _renderHeaderLeft = () => {
    return (
      <TextBtn
        btnText={getLanguage(this.props.language).Friends.CANCEL}
        textStyle={[styles.headerBtnTitle]}
        btnClick={() => this._setDelete(false, true)}
      />
    )
  }

  _renderItem = ({item}: any) => {
    return (
      <SourceItem
        user={this.props.user}
        data={item}
        onPress={this._onPress}
        openCheckBox={this.state.isDelete}
        hasDownload={this.isManage}
        checked={!!this.state.selectedData.get(item.resourceId)}
        checkAction={value => {
          this.setState(state => {
            const selected = new Map(state.selectedData)
            const isSelected = selected.has(item.resourceId)
            if (value && !isSelected) {
              selected.set(item.resourceId, item)
            } else {
              selected.delete(item.resourceId)
            }
            return { selectedData: selected }
          })
        }}
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
    let limitHeight = Math.max(screen.getScreenHeight(), screen.getScreenWidth()) - screen.getHeaderHeight() - ITEM_HEIGHT

    if (maxHeight > limitHeight) maxHeight = limitHeight
    
    return (
      <ModalDropdown
        style={styles.dropdown}
        textStyle={styles.dropdownText}
        dropdownStyle={[styles.dropdownContent, {height: maxHeight}]}
        options={this.modules}
        renderRow={this._renderDropdownItem}
        onSelect={this._dropDownOnSelect}
      >
        <View style={[styles.dropdownItem, {backgroundColor: color.itemColorGray2}]}>
          <Image resizeMode={'contain'} style={styles.dropdownItemImage} source={this.state.currentModule.moduleImage} />
          <Text style={styles.dropdownItemText}>{this.state.currentModule.title}</Text>
          <Text style={styles.dropdownItemRightText}>{getLanguage(GLOBAL.language).Friends.SELECT_MODULE}</Text>
        </View>
      </ModalDropdown>
    )
  }

  render() {
    return (
      <Container
        showFullInMap={true}
        hideInBackground={false}
        headerProps={{
          title: this.title,
          navigation: this.props.navigation,
          headerRight: this.isManage && this._renderHeaderRight(),
          headerLeft: this.state.isDelete && this._renderHeaderLeft(),
        }}
      >

        {this._renderPopMenu()}
        {this._renderBatchHead()}
        {this._renderGroupList()}
        {this._renderPagePopup()}
        {this._renderDeleteDialog()}
      </Container>
    )
  }
}


const mapStateToProps = (state: any) => ({
  user: state.user.toJS(),
  device: state.device.toJS().device,
  language: state.setting.toJS().language,
  mapModules: state.mapModules.toJS(),
})

const mapDispatchToProps = {}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GroupSourceManagePage)
