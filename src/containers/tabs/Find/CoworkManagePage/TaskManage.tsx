import React from 'react'
import { View, FlatList, Text, Image, StyleSheet, Platform, RefreshControl } from 'react-native'
import { scaleSize, Toast, SCoordinationUtils } from '../../../../utils'
import { addCoworkMsg, setCoworkTaskGroup, deleteTaskMembers, TaskMemberDeleteParams } from '../../../../redux/models/cowork'
import { setCurrentMapModule } from '../../../../redux/models/mapModules'
import { UserInfo } from '../../../../redux/models/user'
import { ListSeparator, ImageButton, PopMenu, Dialog, TextBtn } from '../../../../components'
import { getLanguage } from '../../../../language'
import { getThemeAssets } from '../../../../assets'
import { setCurrentTask } from '../../../../redux/models/cowork'
import { downloadSourceFile, deleteSourceDownloadFile, DownloadData, IDownloadProps } from '../../../../redux/models/down'
import { SMap } from 'imobile_for_reactnative'
import { MsgConstant } from '../../../../constants'
import { size, color, zIndexLevel } from '../../../../styles'
import { TaskMessageItem } from './components'
import CoworkInfo from '../../Friend/Cowork/CoworkInfo'
import NavigationService from '../../../NavigationService'
import CoworkFileHandle from './CoworkFileHandle'
import SMessageServiceHTTP from '../../Friend/SMessageServiceHTTP'
import BatchHeadBar from '../../Mine/component/BatchHeadBar'
import { DataItemServices } from 'imobile_for_reactnative/types/interface/iserver/types'

import { connect } from 'react-redux'

const styles = StyleSheet.create({
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
    color: color.black,
  },
  nullSubTitle: {
    marginTop: scaleSize(20),
    fontSize: size.fontSize.fontSizeMd,
    color: color.selected_blue,
    maxWidth: scaleSize(400),
    // textAlign: 'center',
  },
  newTaskBtn: {
    position: 'absolute',
    right: -scaleSize(120),
    bottom: -scaleSize(40),
    backgroundColor: color.contentColorGray,
    height: scaleSize(120),
    width: scaleSize(120),
    borderRadius: scaleSize(60),
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      android: {
        elevation: 5,
      },
      ios: {
        shadowOffset: { width: 5, height: 5 },
        shadowColor: '#eee',
        shadowOpacity: 1,
        shadowRadius: 2,
      },
    }),
    zIndex: zIndexLevel.ONE,
  },
  list: {
    paddingBottom: scaleSize(130),
  },
  // 底部按钮
  bottomBtn: {
    position: 'absolute',
    width: scaleSize(480),
    height: scaleSize(80),
    borderRadius: scaleSize(40),
    bottom: scaleSize(38),
    left: '50%',
    right: '50%',
    marginLeft: scaleSize(-240),
    backgroundColor: color.contentColorGray,
  },
  bottomBtnText: {
    fontSize: size.fontSize.fontSizeXXXl,
    color: color.white,
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

type Members = Array<{name: string, id: string}>
type Members2 = Array<{
  groupId: number,
  groupRole: string,
  id: number,
  joinTime: number,
  memberDescription: string | null,
  nickname: string,
  roleUpdateTime: number | null,
  userName: string,
}>

interface State {
  dialogInfo: string,
  members: Members2,
  isRefresh: boolean,
  selectedData: Map<string, any>,
}

interface Props {
  tabLabel: string,
  navigation: any,
  user: any,
  device: any,
  // invites: Array<any>,
  tasks: {[name: string]: Array<any>},
  groupInfo: any,
  coworkInfo: any,
  currentTask: any,
  coworkMessages: any,
  mapModules: any,
  language: string,
  sourceDownloads: DownloadData,
  isMutiChoice?: boolean,
  createTask: () => void,
  setCurrentMapModule: (index: number) => void,
  addCoworkMsg: (params: any, cb?: () => {}) => void,
  deleteCoworkMsg: (params: any, cb?: () => {}) => void,
  setCoworkTaskGroup: (params: any, cb?: () => {}) => void,
  setCurrentTask: (params: any, cb?: () => {}) => void,
  deleteTaskMembers: (params: TaskMemberDeleteParams) => Promise<any>,
  downloadSourceFile: (params: IDownloadProps) => Promise<any[]>,
  deleteSourceDownloadFile: (id: number | string) => Promise<any[]>,
  deleteGroupTasks: (params: {userId: string, groupID: string, taskIds: string[]}, cb?:() => any) => Promise<void>,
}

class TaskManage extends React.Component<Props, State> {
  list: FlatList<any> | null | undefined
  taskItemPop: PopMenu | null | undefined
  popData: Array<any>
  currentData: any
  dialog: Dialog | null | undefined
  dialogAction: (() => void) | null | undefined
  itemRefs: Map<string, any>

  static defaultProps = {
    tasks: [],
  }

  constructor(props: Props) {
    super(props)

    this.popData = [
      {
        title: getLanguage(this.props.language).Friends.INVITE_CORWORK_MEMBERS,
        action: this.invite,
      },
      // {
      //   title: getLanguage(this.props.language).Friends.DELETE_CORWORK_MEMBERS,
      //   action: () => {
      //     NavigationService.navigate('GroupFriendListPage', {
      //       mode: 'multiSelect', // 多选模式
      //       includeMe: false, // 是否包含当前用户
      //       hasSettingBtn: false, // 是否含有右上角设置按钮
      //       callBack: async (members: any) => {
      //       },
      //     })
      //   },
      // },
      {
        title: getLanguage(this.props.language).Friends.DELETE_CORWORK_TASK,
        action: () => {
          this._setDialogVisible(true, getLanguage(this.props.language).Friends.GROUP_TASK_DELETE_INFO)
          this.dialogAction = () => {
            this.deleteTasks([this.currentData])
          }
        },
      },
    ]
    this.currentData = undefined
    this.state = {
      dialogInfo: '',
      members: [],
      isRefresh: false,
      selectedData: new Map<string, any>(),
    }
    this.itemRefs = new Map<string, any>()

    CoworkInfo.setGroupId(this.props.groupInfo.id)
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    let shouldUpdate = JSON.stringify(nextState) !== JSON.stringify(this.state)
      || JSON.stringify(nextProps) !== JSON.stringify(this.props)
      || !nextState.selectedData.compare(this.state.selectedData)
    return shouldUpdate
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    // 切换用户，重新加载用户配置文件
    if (JSON.stringify(prevProps.tasks) !== JSON.stringify(this.props.tasks)) {
      // 当有新增数据时，自动滚动到首位
      if (
        prevProps.tasks[this.props.user.currentUser.userName] !== this.props.tasks[this.props.user.currentUser.userName] ||
        prevProps.tasks[this.props.user.currentUser.userName][this.props.groupInfo.id]?.length <
        this.props.tasks[this.props.user.currentUser.userName][this.props.groupInfo.id]?.length
      ) {
        // this.refresh()
        // this.list && this.list.scrollToEnd({
        //   animated: true,
        // })
      }
    }
    if (!this.props.isMutiChoice && prevProps.isMutiChoice) {
      this.setState({
        selectedData: new Map<string, any>(),
      })
    }
  }

  componentDidMount() {
    let data = this.props.tasks && this.props.tasks[this.props.user.currentUser.userName]
      && this.props.tasks[this.props.user.currentUser.userName][this.props.groupInfo.id]
      ? this.props.tasks[this.props.user.currentUser.userName][this.props.groupInfo.id]
      : []
    // 若redux中数据为空，则从Online下载的cowork文件中读取是否有文件
    if (data.length === 0) {
      CoworkFileHandle.initLocalCoworkList(this.props.user.currentUser).then(async cowork => {
        if (cowork && cowork.groups && cowork.groups[this.props.groupInfo.id]) {
          let tasks = JSON.parse(JSON.stringify(cowork.groups[this.props.groupInfo.id].tasks))
          if (tasks.length === 0) return
          await this.props.setCoworkTaskGroup({
            groupID: this.props.groupInfo.id,
            tasks: tasks.reverse(),
          })
        }
      })
      this.getData()
    }
  }

  getData = async (refresh?: boolean) => {
    try {
      refresh && !this.state.isRefresh && this.setState({
        isRefresh: true,
      })
      await CoworkFileHandle.syncOnlineCoworkList()
      const cowork = await CoworkFileHandle.getLocalCoworkList()
      if (cowork && cowork.groups && cowork.groups[this.props.groupInfo.id]) {
        let tasks = JSON.parse(JSON.stringify(cowork.groups[this.props.groupInfo.id].tasks))
        if (tasks.length === 0) {
          refresh && this.state.isRefresh && this.setState({
            isRefresh: false,
          })
          return
        }
        await this.props.setCoworkTaskGroup({
          groupID: this.props.groupInfo.id,
          tasks: tasks.reverse(),
        })
      }
      refresh && this.state.isRefresh && this.setState({
        isRefresh: false,
      })
    } catch(e) {
      refresh && this.state.isRefresh && this.setState({
        isRefresh: false,
      })
    }
  }

  getMembers = async () => {
    if (!this.props.groupInfo.id) return []
    let result = await SCoordinationUtils.getScoordiantion()?.getGroupMembers({
      groupId: this.props.groupInfo.id,
    })
    return result.content
  }

  /** 邀请协作人员 */
  invite = () => {
    let filter: {
      except: Array<string>,  // 过滤掉的成员ID
    } = {
      except: [],
    }
    for (let i = 0; i < this.currentData.members.length; i++) {
      filter.except.push(this.currentData.members[i].id)
    }
    NavigationService.navigate('GroupFriendListPage', {
      mode: 'multiSelect', // 多选模式
      includeMe: false, // 是否包含当前用户
      hasSettingBtn: false, // 是否含有右上角设置按钮
      filter,
      callBack: async (members: any) => {
        NavigationService.goBack('GroupFriendListPage', null)

        let currentTask = JSON.parse(JSON.stringify(this.currentData))
        currentTask.user = {
          name: this.props.user.currentUser.nickname || '',
          id: this.props.user.currentUser.userName || '',
        }

        let _members = []
        for (const member of members) {
          _members.push({
            name: member.nickname,
            id: member.userName,
          })
        }
        currentTask.members = currentTask.members.concat(_members)
        let temp = []
        for (const member of currentTask.members) {
          if (member.id === this.props.user.currentUser.userName) continue
          temp.push(member.id)
        }
        await SMessageServiceHTTP.sendMessage(
          currentTask,
          temp,
        )
        this.props.addCoworkMsg(Object.assign({}, currentTask, {type: MsgConstant.MSG_ONLINE_GROUP_TASK_MEMBER_JOIN}))
      },
    })
  }

  /** 删除任务 */
  deleteTasks = async (tasks: any[]) => {
    let taskIds = []
    for (const task of tasks) {
      taskIds.push(task.id)
      let members = task.members.concat()
      let message = task
      message.time = new Date().getTime()
      message.user = {
        name: this.props.user.currentUser.nickname || '',
        id: this.props.user.currentUser.userName || '',
      }
      if (task.creator === this.props.user.currentUser.userName) {
        // 群主删除任务
        message.type = MsgConstant.MSG_ONLINE_GROUP_TASK_DELETE
        let temp = []
        for (const member of members) {
          if (member.id === this.props.user.currentUser.userName) continue
          // SMessageService.sendMessage(
          //   JSON.stringify(message),
          //   member.id,
          // )
          temp.push(member.id)
        }
        SMessageServiceHTTP.sendMessage(
          message,
          temp,
        )
      } else {
        // 成员退出任务
        message.type = MsgConstant.MSG_ONLINE_GROUP_TASK_EXIST
        for (let i = 0; i < members.length; i++) {
          let member = members[i]
          if (member.id === this.props.user.currentUser.userName) {
            members.splice(i, 1)
          }
        }
        message.members = members
        let temp = []
        // 给其他成员发送修改任务信息
        for (const member of members) {
          // await SMessageService.sendMessage(
          //   JSON.stringify(message),
          //   member.id,
          // )
          temp.push(member.id)
        }
        await SMessageServiceHTTP.sendMessage(
          message,
          temp,
        )
        // 给自己发送删除信息
        message.type = MsgConstant.MSG_ONLINE_GROUP_TASK_DELETE
      }
    }
    // await this.props.addCoworkMsg(message)
    taskIds.length > 0 && await this.props.deleteGroupTasks({
      userId: this.props.user.currentUser.userName,
      groupID: this.props.groupInfo.id,
      taskIds: taskIds,
    })
    this._setDialogVisible(false)
  }

  _getModule = (key: string, index: number) => {
    let module
    if (index === undefined) {
      for (let i = 0; i < this.props.mapModules.modules.length; i++) {
        if (key === this.props.mapModules.modules[i].key) {
          index = i
          module = this.props.mapModules.modules[i].chunk
            ? this.props.mapModules.modules[i].chunk
            : this.props.mapModules.modules[i].getChunk()
          break
        }
      }
    } else {
      module = this.props.mapModules.modules[index].chunk
        ? this.props.mapModules.modules[index].chunk
        : this.props.mapModules.modules[index].getChunk()
    }
    return module
  }

  _checkMembers = async (data: any, members: Members): Promise<Members> =>  {
    let _members = []
    let groupMembers = await this.getMembers()
    for (let i = members.length - 1; i >= 0; i--) {
      let exist = false
      for (let j = 0; j < groupMembers.length; j++) {
        if (groupMembers[j].userName === members[i].id) {
          exist = true
          break
        }
      }
      if (!exist) {
        _members.push(members[i])
        // members.splice(i, 1)
      }
    }
    if (_members.length > 0) {
      this.props.deleteTaskMembers({
        groupId: data.groupID,
        taskId: data.id,
        members: _members,
      })
      // CoworkFileHandle.removeTaskGroupMember(
      //   data.groupID,
      //   data.id,
      //   _members,
      // )
    }
    return members
  }

  _onPress = async (data: any) => {
    if (data.map) {
      let restService = data.resource?.restService
      try {
        // 若分配的任务消息中没有服务数据,则去查询
        // 此情况运用在发布任务时,数据还没有服务,在协作过程中发布后,此后再次进入任务,可以获得数据服务信息
        if (!restService) {
          const dataDetail = await SCoordinationUtils.getScoordiantion()?.getResourceDetail(data.resource.resourceId)
          if (dataDetail?.dataItemServices?.length > 0) {
            for (const service of dataDetail.dataItemServices) {
              if (service.serviceType === 'RESTDATA' && service.serviceStatus === 'PUBLISHED') {
                restService = service
                break
              }
            }
          }
        }
      } catch (error) {
        restService = data.resource?.restService
      }
      let index = data.module.index
      let module = this._getModule(data.module.key, index)
      this.props.setCurrentTask(data)

      // let members = CoworkFileHandle.getTaskGroupMembers(data.groupID, data.id)
      let _members = this.props.coworkInfo?.[this.props.user.currentUser.userName]?.[data.groupID]?.[data.id]?.members || []
      // CoworkInfo.setMembers(members)
      this._checkMembers(data, _members)
      CoworkInfo.setMessages(this.props.coworkInfo?.[this.props.user.currentUser.userName]?.[data.groupID]?.[data.id]?.messages || [])
      this.createCowork(data.id, module, index, data.map, restService)
    } else {
      Toast.show(getLanguage(this.props.language).Friends.RESOURCE_DOWNLOAD_INFO)
    }
  }

  _showMore = ({event, data} : {event: any, data: any}) => {
    this.currentData = data
    this.taskItemPop && this.taskItemPop.setVisible(true, {
      x: event.nativeEvent.pageX,
      y: event.nativeEvent.pageY,
    })
  }

  createCowork = async (targetId: any, module: { action: (user: UserInfo, map: any, service?: DataItemServices) => void }, index: number, map: any, service?: DataItemServices) => {
    try {
      global.Loading.setLoading(
        true,
        getLanguage(this.props.language).Prompt.PREPARING,
      )
      let licenseStatus = await SMap.getEnvironmentStatus()
      global.isLicenseValid = licenseStatus.isLicenseValid
      if (!global.isLicenseValid) {
        global.SimpleDialog.set({
          text: getLanguage(this.props.language).Prompt.APPLY_LICENSE_FIRST,
        })
        global.SimpleDialog.setVisible(true)
        return
      }
      CoworkInfo.setId(targetId)
      // CoworkInfo.setId(this.props.groupInfo.id + '')
      // CoworkInfo.setId(this.props.user.currentUser.userName + '')
      global.getFriend().setCurMod(module)
      this.props.setCurrentMapModule(index).then(() => {
        module.action(this.props.user.currentUser, map, service)
      })
      global.getFriend().curChat &&
        global.getFriend().curChat.setCoworkMode(true)
      global.coworkMode = true
      // CoworkInfo.setGroupId(this.props.groupInfo.id)
      setTimeout(() => global.Loading.setLoading(false), 300)
    } catch (error) {
      global.Loading.setLoading(false)
    }
  }

  renderItem = ({ item }: any) => {
    let unread = this.props.coworkMessages?.[this.props.user.currentUser.userName]
      ?.coworkGroupMessages?.[item.groupID]?.[item.id]?.unread || 0
    return (
      <TaskMessageItem
        ref={ref => {
          if (ref) {
            this.itemRefs.set(item.id, ref)
          }
        }}
        data={item}
        openCheckBox={this.props.isMutiChoice}
        checked={!!this.state.selectedData.get(item.id)}
        getModule={this._getModule}
        user={this.props.user}
        // isSelf={item?.applicant !== this.props.user.currentUser.id}
        onPress={(data: any) => this._onPress(data)}
        checkAction={({value, data, download}) => {
          const _selectedData = new Map().clone(this.state.selectedData)
          if (this.state.selectedData.has(data.id)) {
            _selectedData.delete(data.id)
            this.setState({
              selectedData: _selectedData,
            })
          } else {
            _selectedData.set(data.id, data)
            this.setState({
              selectedData: _selectedData,
            })
          }
        }}
        addCoworkMsg={this.props.addCoworkMsg}
        deleteCoworkMsg={this.props.deleteCoworkMsg}
        showMore={this._showMore}
        unread={unread}
        // downloadData={this.props.sourceDownloads}
        downloadData={this.props.sourceDownloads[item.id]}
        downloadSourceFile={this.props.downloadSourceFile}
        deleteSourceDownloadFile={this.props.deleteSourceDownloadFile}
      />
    )
  }

  _renderItemSeparatorComponent = () => {
    return <ListSeparator color={color.itemColorGray2} style={{marginLeft: scaleSize(150), marginRight: scaleSize(50)}} />
  }

  /**
   * 没有任务的界面
   */
  _renderNull = () => {
    return (
      <View style={styles.nullView} pointerEvents={'box-none'}>
        <View style={styles.nullSubView}>
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Image style={styles.nullImage} source={getThemeAssets().cowork.bg_photo_task} />
            <Text style={styles.nullTitle}>{getLanguage(this.props.language).Friends.GROUP_TASK_NULL}</Text>
            {
              this.props.groupInfo.creator === this.props.user.currentUser.userName &&
              <Text style={styles.nullSubTitle}>{getLanguage(this.props.language).Friends.CREATE_FIRST_GROUP_TASK}</Text>
            }
            {
              this.props.groupInfo.creator === this.props.user.currentUser.userName &&
              // <View style={styles.newTaskBtn}/>
              <ImageButton
                icon={getThemeAssets().cowork.icon_group_join}
                iconStyle={{height: scaleSize(80), width: scaleSize(80)}}
                containerStyle={styles.newTaskBtn}
                onPress={() => {
                  this.props.createTask && this.props.createTask()
                }}
              />
            }
          </View>
        </View>
        <View style={{flex: 1, backgroundColor: 'black'}} />
      </View>
    )
  }

  _renderPagePopup = () => {
    return (
      <PopMenu
        ref={ref => (this.taskItemPop = ref)}
        data={this.popData}
        device={this.props.device}
        hasCancel={false}
      />
    )
  }

  _setDialogVisible = (visible: boolean, info?: string) => {
    if (visible === false) {
      this.dialogAction = null
    }
    if (info) {
      this.setState({
        dialogInfo: info,
      }, () => {
        this.dialog?.setDialogVisible(visible)
      })
    } else {
      this.dialog?.setDialogVisible(visible)
    }
  }

  _renderDeleteDialog = () => {
    return (
      <Dialog
        ref={ref => (this.dialog = ref)}
        type={Dialog.Type.MODAL}
        info={this.state.dialogInfo}
        confirmAction={() => {
          if (this.dialogAction) {
            this.dialogAction()
          }
        }}
        confirmBtnTitle={getLanguage(this.props.language).CONFIRM}
        cancelBtnTitle={getLanguage(this.props.language).Prompt.CANCEL}
      />
    )
  }

  _renderBottom = () => {
    return (
      <TextBtn
        btnText={getLanguage(this.props.language).Friends.TASK_DISTRIBUTION}
        containerStyle={styles.bottomBtn}
        textStyle={styles.bottomBtnText}
        btnClick={() => {
          this.props.createTask && this.props.createTask()
        }}
      />
    )
  }

  _selectAll = () => {
    let data = this.props.tasks && this.props.tasks[this.props.user.currentUser.userName]
      && this.props.tasks[this.props.user.currentUser.userName][this.props.groupInfo.id]
      ? this.props.tasks[this.props.user.currentUser.userName][this.props.groupInfo.id]
      : []
    const selected = new Map<string, any>()
    if (data.length > this.state.selectedData.size) {
      data.forEach((item: any) => {
        selected.set(item.id, item)
      })
    }
    this.setState({ selectedData: selected })
  }

  _renderBatchHead = () => {
    if (!this.props.isMutiChoice) return null
    let data = this.props.tasks && this.props.tasks[this.props.user.currentUser.userName]
      && this.props.tasks[this.props.user.currentUser.userName][this.props.groupInfo.id]
      ? this.props.tasks[this.props.user.currentUser.userName][this.props.groupInfo.id]
      : []
    return (
      <BatchHeadBar
        select={this.state.selectedData.size}
        total={data.length}
        selectAll={this._selectAll}
        deselectAll={this._selectAll}
      />
    )
  }

  _renderMutiChoiceButtons = () => {
    if (!this.props.isMutiChoice) return null
    return (
      <View style={styles.bottomView}>
        <ImageButton
          key={'download'}
          containerStyle={styles.bottomViewBtn}
          icon={getThemeAssets().cowork.icon_nav_import}
          title={getLanguage(this.props.language).Prompt.DOWNLOAD}
          titleStyle={styles.btnStyle}
          onPress={() => {
            if (this.state.selectedData.size > 0) {
              const keys = this.state.selectedData.keys()
              for(let key of keys) {
                if (this.state.selectedData.get(key)) {
                  const ref = this.itemRefs.get(key)
                  if (typeof ref._downloadFile === 'function') {
                    ref._downloadFile()
                  }
                }
              }
            }
          }}
        />
        <ImageButton
          key={'delete'}
          containerStyle={styles.bottomViewBtn}
          icon={getThemeAssets().edit.icon_delete}
          title={getLanguage(this.props.language).Prompt.DELETE}
          titleStyle={styles.btnStyle}
          onPress={() => {
            if (this.state.selectedData.size > 0) {
              this._setDialogVisible(true, getLanguage(this.props.language).Friends.GROUP_TASK_DELETE_INFO)
              this.dialogAction = () => {
                try {
                  let tasks: any[] = []
                  this.state.selectedData.forEach(item => {
                    const _ref = this.itemRefs.get(item.id)
                    if (_ref?.props?.data) {
                      tasks.push(_ref?.props?.data)
                    }
                  })
                  this.deleteTasks(tasks)
                  const selected = new Map<string, any>()
                  this.setState({
                    selectedData: selected,
                  })
                  this._setDialogVisible(false)
                } catch(e) {
                  this._setDialogVisible(false)
                }
              }
              // this.dialog?.setDialogVisible(true)
            }
          }}
        />
      </View>
    )
  }

  render() {
    let data = this.props.tasks && this.props.tasks[this.props.user.currentUser.userName]
      && this.props.tasks[this.props.user.currentUser.userName][this.props.groupInfo.id]
      ? this.props.tasks[this.props.user.currentUser.userName][this.props.groupInfo.id]
      : []
    return (
      <View style={{flex: 1}}>
        {this._renderBatchHead()}
        <FlatList
          ref={ref => this.list = ref}
          // style={styles.list}
          data={data}
          extraData={this.state}
          renderItem={this.renderItem}
          keyExtractor={(item, index) => item.id.toString()}
          contentContainerStyle={styles.list}
          // ItemSeparatorComponent={this._renderItemSeparatorComponent}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefresh}
              onRefresh={() => this.getData(true)}
              colors={['orange', 'red']}
              tintColor={'orange'}
              titleColor={'orange'}
              title={getLanguage(this.props.language).Friends.REFRESHING}
              enabled={true}
            />
          }
        />
        {data.length === 0 && this._renderNull()}
        {/* {
          data.length > 0
            ? (
              <FlatList
                ref={ref => this.list = ref}
                // style={styles.list}
                data={data}
                extraData={this.state}
                renderItem={this.renderItem}
                keyExtractor={(item, index) => item.id.toString()}
                contentContainerStyle={styles.list}
                // ItemSeparatorComponent={this._renderItemSeparatorComponent}
                refreshControl={
                  <RefreshControl
                    refreshing={this.state.isRefresh}
                    onRefresh={() => this.getData(true)}
                    colors={['orange', 'red']}
                    tintColor={'orange'}
                    titleColor={'orange'}
                    title={getLanguage(this.props.language).Friends.REFRESHING}
                    enabled={true}
                  />
                }
              />
            )
            : this._renderNull()
        } */}
        {
          !this.props.isMutiChoice &&
          data.length > 0 &&
          this.props.user.currentUser.userName === this.props.groupInfo.creator &&
          this._renderBottom()
        }
        {this._renderMutiChoiceButtons()}
        {this._renderPagePopup()}
        {this._renderDeleteDialog()}
      </View>
    )
  }
}

const mapStateToProps = (state: any) => ({
  user: state.user.toJS(),
  language: state.setting.toJS().language,
  tasks: state.cowork.toJS().tasks,
  coworkInfo: state.cowork.toJS().coworkInfo,
  currentTask: state.cowork.toJS().currentTask,
  coworkMessages: state.cowork.toJS().messages,
  mapModules: state.mapModules.toJS(),
  sourceDownloads: state.down.toJS().sourceDownloads,
})

const mapDispatchToProps = {
  addCoworkMsg,
  setCurrentMapModule,
  setCoworkTaskGroup,
  setCurrentTask,
  deleteTaskMembers,
  downloadSourceFile,
  deleteSourceDownloadFile,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TaskManage)
