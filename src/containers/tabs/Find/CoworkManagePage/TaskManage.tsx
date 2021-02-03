import React from 'react'
import { View, FlatList, Text, Image, StyleSheet, Platform } from 'react-native'
import { scaleSize, Toast } from '../../../../utils'
import { addCoworkMsg, setCoworkTaskGroup, deleteTaskMembers, TaskMemberDeleteParams } from '../../../../redux/models/cowork'
import { setCurrentMapModule } from '../../../../redux/models/mapModules'
import { UserInfo } from '../../../../redux/models/user'
import { ListSeparator, ImageButton, PopMenu, Dialog, TextBtn } from '../../../../components'
import { getLanguage } from '../../../../language'
import { getThemeAssets } from '../../../../assets'
import { setCurrentTask } from '../../../../redux/models/cowork'
import { SCoordination, SMap, SMessageService } from 'imobile_for_reactnative'
import { UserType, MsgConstant } from '../../../../constants'
import { size, color } from '../../../../styles'
import { TaskMessageItem } from './components'
import CoworkInfo from '../../Friend/Cowork/CoworkInfo'
import NavigationService from '../../../NavigationService'
import CoworkFileHandle from './CoworkFileHandle'

import { connect } from 'react-redux'

const styles = StyleSheet.create({
  nullView: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
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
  createTask: () => void,
  setCurrentMapModule: (index: number) => void,
  addCoworkMsg: (params: any, cb?: () => {}) => void,
  deleteCoworkMsg: (params: any, cb?: () => {}) => void,
  setCoworkTaskGroup: (params: any, cb?: () => {}) => void,
  setCurrentTask: (params: any, cb?: () => {}) => void,
  deleteTaskMembers: (params: TaskMemberDeleteParams) => Promise<any>
}

class TaskManage extends React.Component<Props, State> {
  servicesUtils: any
  list: FlatList<any> | null | undefined
  taskItemPop: PopMenu | null | undefined
  popData: Array<any>
  currentData: any
  dialog: Dialog | null | undefined
  dialogAction: (() => void) | null | undefined

  static defaultProps = {
    tasks: [],
  }

  constructor(props: Props) {
    super(props)

    this.popData = [
      {
        title: getLanguage(GLOBAL.language).Friends.INVITE_CORWORK_MEMBERS,
        action: this.invite,
      },
      // {
      //   title: getLanguage(GLOBAL.language).Friends.DELETE_CORWORK_MEMBERS,
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
        title: getLanguage(GLOBAL.language).Friends.DELETE_CORWORK_TASK,
        action: () => {
          this._setDialogVisible(true, getLanguage(GLOBAL.language).Friends.GROUP_TASK_DELETE_INFO)
          this.dialogAction = () => {
            this.deleteTask()
          }
        },
      },
    ]
    this.currentData = undefined
    this.state = {
      dialogInfo: '',
      members: [],
    }

    if (UserType.isOnlineUser(this.props.user.currentUser)) {
      this.servicesUtils = new SCoordination('online')
    } else if (UserType.isIPortalUser(this.props.user.currentUser)){
      this.servicesUtils = new SCoordination('iportal')
    }
    CoworkInfo.setGroupId(this.props.groupInfo.id)
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    let shouldUpdate = JSON.stringify(nextState) !== JSON.stringify(this.state) ||
    JSON.stringify(nextProps) !== JSON.stringify(this.props)
    return shouldUpdate
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    // 切换用户，重新加载用户配置文件
    if (JSON.stringify(prevProps.tasks) !== JSON.stringify(this.props.tasks)) {
      // 当有新增数据时，自动滚动到首位
      if (
        prevProps.tasks[this.props.user.currentUser.userId] !== this.props.tasks[this.props.user.currentUser.userId] ||
        prevProps.tasks[this.props.user.currentUser.userId][this.props.groupInfo.id]?.length <
        this.props.tasks[this.props.user.currentUser.userId][this.props.groupInfo.id]?.length
      ) {
        // this.refresh()
        // this.list && this.list.scrollToEnd({
        //   animated: true,
        // })
      }
    }
  }

  componentDidMount() {
    let data = this.props.tasks && this.props.tasks[this.props.user.currentUser.userId]
      && this.props.tasks[this.props.user.currentUser.userId][this.props.groupInfo.id]
      ? this.props.tasks[this.props.user.currentUser.userId][this.props.groupInfo.id]
      : []
    // 若redux中数据为空，则从Online下载的cowork文件中读取是否有文件
    if (data.length === 0) {
      CoworkFileHandle.getLocalCoworkList().then(async cowork => {
        if (cowork && cowork.groups && cowork.groups[this.props.groupInfo.id]) {
          let tasks = JSON.parse(JSON.stringify(cowork.groups[this.props.groupInfo.id].tasks))
          if (tasks.length === 0) return
          await this.props.setCoworkTaskGroup({
            groupID: this.props.groupInfo.id,
            tasks: tasks.reverse(),
          })
        }
      })
    }
  }

  getMembers = async () => {
    if (!this.props.groupInfo.id) return
    let result = await this.servicesUtils?.getGroupMembers({
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
        for (const member of currentTask.members) {
          // CoworkInfo.addMember({
          //   id: member.id,
          //   name: member.name,
          // })
          if (member.id === this.props.user.currentUser.userName) continue
          SMessageService.sendMessage(
            JSON.stringify(currentTask),
            member.id,
          )
        }
        currentTask.type = MsgConstant.MSG_ONLINE_GROUP_TASK_MEMBER_JOIN
        this.props.addCoworkMsg(currentTask)
        // this.props.addTaskMembers({
        //   groupID: currentTask.groupID,
        //   id: currentTask.id,
        //   members: _members,
        // })
        // 添加协作任务成员
        // await CoworkFileHandle.addTaskGroupMember(
        //   currentTask.groupID,
        //   currentTask.id,
        //   _members,
        // )
      },
    })
  }

  /** 删除任务 */
  deleteTask = async () => {
    let members = this.currentData.members.concat()
    let message = this.currentData
    message.time = new Date().getTime()
    message.user = {
      name: this.props.user.currentUser.nickname || '',
      id: this.props.user.currentUser.userName || '',
    }
    if (this.currentData.creator === this.props.user.currentUser.userName) {
      // 群主删除任务
      message.type = MsgConstant.MSG_ONLINE_GROUP_TASK_DELETE
      for (const member of members) {
        if (member.id === this.props.user.currentUser.userName) continue
        SMessageService.sendMessage(
          JSON.stringify(message),
          member.id,
        )
      }
    } else {
      // 成员退出任务
      message.type = MsgConstant.MSG_ONLINE_GROUP_TASK
      for (let i = 0; i < members.length; i++) {
        let member = members[i]
        if (member.id === this.props.user.currentUser.userName) {
          members.splice(i, 1)
        }
      }
      message.members = members
      // 给其他成员发送修改任务信息
      for (const member of members) {
        await SMessageService.sendMessage(
          JSON.stringify(message),
          member.id,
        )
      }
      // 给自己发送删除信息
      message.type = MsgConstant.MSG_ONLINE_GROUP_TASK_DELETE
    }
    await this.props.addCoworkMsg(message)
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

  _onPress = (data: any) => {
    if (data.map) {
      let index = data.module.index
      let module = this._getModule(data.module.key, index)
      this.props.setCurrentTask(data)

      // let members = CoworkFileHandle.getTaskGroupMembers(data.groupID, data.id)
      let _members = this.props.coworkInfo?.[this.props.user.currentUser.userName]?.[data.groupID]?.[data.id]?.members || []
      // CoworkInfo.setMembers(members)
      this._checkMembers(data, _members)
      CoworkInfo.setMessages(this.props.coworkInfo?.[this.props.user.currentUser.userName]?.[data.groupID]?.[data.id]?.messages || [])
      this.createCowork(data.id, module, index, data.map)
    } else {
      Toast.show(getLanguage(GLOBAL.language).Friends.RESOURCE_DOWNLOAD_INFO)
    }
  }

  _showMore = ({event, data} : {event: any, data: any}) => {
    this.currentData = data
    this.taskItemPop && this.taskItemPop.setVisible(true, {
      x: event.nativeEvent.pageX,
      y: event.nativeEvent.pageY,
    })
  }

  createCowork = async (targetId: any, module: { action: (user: UserInfo, map: any) => void }, index: number, map: any) => {
    try {
      GLOBAL.Loading.setLoading(
        true,
        getLanguage(GLOBAL.language).Prompt.PREPARING,
      )
      let licenseStatus = await SMap.getEnvironmentStatus()
      GLOBAL.isLicenseValid = licenseStatus.isLicenseValid
      if (!GLOBAL.isLicenseValid) {
        GLOBAL.SimpleDialog.set({
          text: getLanguage(GLOBAL.language).Prompt.APPLY_LICENSE_FIRST,
        })
        GLOBAL.SimpleDialog.setVisible(true)
        return
      }
      CoworkInfo.setId(targetId)
      // CoworkInfo.setId(this.props.groupInfo.id + '')
      // CoworkInfo.setId(this.props.user.currentUser.userId + '')
      GLOBAL.getFriend().setCurMod(module)
      this.props.setCurrentMapModule(index).then(() => {
        module.action(this.props.user.currentUser, map)
      })
      GLOBAL.getFriend().curChat &&
        GLOBAL.getFriend().curChat.setCoworkMode(true)
      GLOBAL.coworkMode = true
      // CoworkInfo.setGroupId(this.props.groupInfo.id)
      setTimeout(() => GLOBAL.Loading.setLoading(false), 300)
    } catch (error) {
      GLOBAL.Loading.setLoading(false)
    }
  }

  renderItem = ({ item }: any) => {
    let unread = this.props.coworkMessages?.[this.props.user.currentUser.userName]
      ?.coworkGroupMessages?.[item.groupID]?.[item.id]?.unread || 0
    return (
      <TaskMessageItem
        data={item}
        getModule={this._getModule}
        user={this.props.user}
        isSelf={item?.applicant !== this.props.user.currentUser.id}
        onPress={(data: any) => this._onPress(data)}
        addCoworkMsg={this.props.addCoworkMsg}
        deleteCoworkMsg={this.props.deleteCoworkMsg}
        showMore={this._showMore}
        unread={unread}
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
      <View style={styles.nullView}>
        <View style={styles.nullSubView}>
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Image style={styles.nullImage} source={getThemeAssets().cowork.bg_photo_task} />
            <Text style={styles.nullTitle}>{getLanguage(GLOBAL.language).Friends.GROUP_TASK_NULL}</Text>
            {
              this.props.groupInfo.creator === this.props.user.currentUser.userId &&
              <Text style={styles.nullSubTitle}>{getLanguage(GLOBAL.language).Friends.CREATE_FIRST_GROUP_TASK}</Text>
            }
            {
              this.props.groupInfo.creator === this.props.user.currentUser.userId &&
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
        confirmBtnTitle={getLanguage(this.props.language).Prompt.CONFIRM}
        cancelBtnTitle={getLanguage(this.props.language).Prompt.CANCEL}
      />
    )
  }

  _renderBottom = () => {
    return (
      <TextBtn
        btnText={getLanguage(GLOBAL.language).Friends.TASK_DISTRIBUTION}
        containerStyle={styles.bottomBtn}
        textStyle={styles.bottomBtnText}
        btnClick={() => {
          this.props.createTask && this.props.createTask()
        }}
      />
    )
  }

  render() {
    let data = this.props.tasks && this.props.tasks[this.props.user.currentUser.userId]
      && this.props.tasks[this.props.user.currentUser.userId][this.props.groupInfo.id]
      ? this.props.tasks[this.props.user.currentUser.userId][this.props.groupInfo.id]
      : []
    return (
      <View style={{flex: 1}}>
        {
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
              />
            )
            : this._renderNull()
        }
        {
          data.length > 0 &&
          this.props.user.currentUser.userName === this.props.groupInfo.creator &&
          this._renderBottom()
        }
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
})

const mapDispatchToProps = {
  addCoworkMsg,
  setCurrentMapModule,
  setCoworkTaskGroup,
  setCurrentTask,
  deleteTaskMembers,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TaskManage)
