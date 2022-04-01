import React from 'react'
import {View, TextInput, Text, Switch} from 'react-native'
import { Container, PopMenu, ImageButton } from '../../../../components'
import { scaleSize, SCoordinationUtils } from '../../../../utils'
import * as OnlineServicesUtils from '../../../../utils/OnlineServicesUtils'
import NavigationService from '../../../NavigationService'
import { getLanguage } from '../../../../language'
import { SMessageService, SCoordination } from 'imobile_for_reactnative'
import { UserType, MsgConstant } from '../../../../constants'
import { getThemeAssets } from '../../../../assets'
import TaskManage from './TaskManage'
import { Users } from '../../../../redux/models/user'
import { ReadMsgParams, DeleteInviteParams, setThreeServiceIpUrl } from '../../../../redux/models/cowork'
import CoworkInfo from '../../Friend/Cowork/CoworkInfo'
import SMessageServiceHTTP from '../../Friend/SMessageServiceHTTP'
import CoworkFileHandle from './CoworkFileHandle'
import { DataItemServices, GroupType } from 'imobile_for_reactnative/types/interface/iserver/types'

import { connect } from 'react-redux'
import { getMainAndSubTaskInfo, login } from '../../../../utils/TaskThreeServiceUrtils'
import RadioButton from '../../../aiClassifyView/RadioButton'


interface Props {
  navigation: Object,
  user: Users,
  // cowork: Cowork,
  appConfig: Object,
  latestMap: Object,
  currentGroup: GroupType,
  device: any,
  setCurrentMapModule: (index: number) => void,
  deleteInvite: (params: DeleteInviteParams) => Promise<any>,
  addCoworkMsg: (params: any, cb?: () => {}) => void,
  readCoworkGroupMsg: (params: ReadMsgParams) => Promise<any>,
  setCurrentGroup: (data: any) => any,
}

type State = {
  isMutiChoice: boolean,
  isEnabled: boolean,
}
export default class CoworkManagePage extends React.Component<Props, State> {

  PagePopModal: PopMenu | null | undefined
  container: any
  callBack: (data?: any) => any
  servicesUtils: SCoordination | undefined
  urlText: string
  FirstRB: React.Component
  checkedItem: number

  constructor(props: Props) {
    super(props)
    this.callBack = this.props.navigation?.state?.params?.callBack
    this.state = {
      isMutiChoice: false,
      isEnabled: false,
    }

    if (UserType.isOnlineUser(this.props.user.currentUser)) {
      this.servicesUtils = new SCoordination('online')
    } else if (UserType.isIPortalUser(this.props.user.currentUser)) {
      this.servicesUtils = new SCoordination('iportal')
    }
    // this.urlText = 'http://192.168.11.21:6932'
    this.urlText = ''
    this.checkedItem = 1
  }

  shouldComponentUpdate(nextProps: any, nextState: any) {
    let shouldUpdate = JSON.stringify(nextState) !== JSON.stringify(this.state) ||
    JSON.stringify(nextProps) !== JSON.stringify(this.props)
    return shouldUpdate
  }

  componentDidMount() {
    (async function() {
      GLOBAL.cookie = await OnlineServicesUtils.getService()?.getCookie()
    }.bind(this)())
    this.props.readCoworkGroupMsg({
      target: {
        groupId: this.props.currentGroup.id + '',
      },
      type: MsgConstant.MSG_ONLINE_GROUP_TASK,
    })
    CoworkFileHandle.refreshCallback = () => {
      if (this.props.currentGroup.id === undefined && this.props.currentGroup.id === '') return
      this.props.readCoworkGroupMsg({
        target: {
          groupId: this.props.currentGroup.id + '',
        },
        type: MsgConstant.MSG_ONLINE_GROUP_TASK,
      })
    }
  }

  componentWillUnmount() {
    this.props.setCurrentGroup(undefined)
    CoworkInfo.reset()
  }

  createTask = () => {
    if (UserType.isOnlineUser(this.props.user.currentUser) || UserType.isIPortalUser(this.props.user.currentUser) ) {
      NavigationService.navigate('SelectModulePage', {
        callBack: (moduleData: {module: any, index: number}) => {
          NavigationService.navigate('GroupSourceManagePage', {
            isManage: false,
            hasDownload: false, // 是否有下载按钮
            keywords: '.zip',
            title: getLanguage(GLOBAL.language).Friends.SELECT_MAP,
            itemAction: async ({data}: any) => {
              // TODO 查询数据信息,新增传递数据是否发布服务
              const dataDetail = await SCoordinationUtils.getScoordiantion()?.getResourceDetail(data.resourceId)
              let restService: DataItemServices | null = null
              if (dataDetail?.dataItemServices?.length > 0) {
                for (const service of dataDetail.dataItemServices) {
                  if (service.serviceType === 'RESTDATA' && service.serviceStatus === 'PUBLISHED') {
                    restService = service
                    break
                  }
                }
              }

              NavigationService.navigate('GroupFriendListPage', {
                mode: 'multiSelect', // 多选模式
                includeMe: true, // 是否包含当前用户
                hasSettingBtn: false, // 是否含有右上角设置按钮
                callBack: async (members: any) => {
                  NavigationService.goBack('SelectModulePage', null)

                  // 向用户发送信息
                  let timeStr = new Date().getTime()
                  let id = `Group_Task_${this.props.currentGroup.id}_${timeStr}`

                  let _members = []
                  let hasMine = false
                  for (const member of members) {
                    if (this.props.user.currentUser.userName === member.userName) {
                      hasMine = true
                    }
                    _members.push({
                      name: member.nickname,
                      id: member.userName,
                    })
                  }
                  if (!hasMine) {
                    _members.unshift({
                      name: this.props.user.currentUser.nickname || '',
                      id: this.props.user.currentUser.userName || '',
                    })
                  }

                  // 任务的数据结构的构造
                  let message = {
                    id: id,
                    groupID: this.props.currentGroup.id,
                    user: {
                      name: this.props.user.currentUser.nickname || '',
                      id: this.props.user.currentUser.userName || '',
                    },
                    creator: this.props.user.currentUser.userName,
                    members: _members,
                    name: data.resourceName.replace('.zip', ''),
                    module: {
                      key: moduleData.module.key,
                      index: moduleData.index,
                    },
                    resource: {
                      resourceId: data.resourceId,
                      resourceName: data.resourceName,
                      nickname: data.nickname,
                      resourceCreator: data.resourceCreator,
                      restService: restService,
                    },
                    type: MsgConstant.MSG_ONLINE_GROUP_TASK,
                    time: timeStr,
                    isThreeTask: false, // 是否是第三方加载的任务 
                  }
                  let temp = []
                  for (const member of members) {
                    if (
                      member.id === this.props.user.currentUser.userName ||
                      member.userName === this.props.user.currentUser.userName
                    ) continue
                    // SMessageService.sendMessage(
                    //   JSON.stringify(message),
                    //   member.userName,
                    // )
                    temp.push(member.userName)
                  }

                  SMessageServiceHTTP.sendMessage(
                    message,
                    temp,
                  )
                  // TODO 底层同样declare个人队列
                  await SMessageService.declareSession(_members, id)
                  this.props.addCoworkMsg(message)
                },
              })
            },
          })
        },
      })
    } else {
      NavigationService.navigate('Login')
    }
  }

  deleteInvite = (data: any) => {
    GLOBAL.SimpleDialog.set({
      text: getLanguage(GLOBAL.language).Friends.DELETE_COWORK_ALERT,
      confirmAction: () => this.props.deleteInvite(data),
    })
    GLOBAL.SimpleDialog.setVisible(true)
  }

  RadioButtonOnChange = index => {
    if (index === 0) {
      this.FirstRB?.setChecked(true)
    } else if (index === 1) {
      this.FirstRB?.setChecked(false)
    } 
    this.checkedItem = index
  }

  // 添加第三方的服务的ip地址 是一个对话框的形式
  addIp = () => {
    GLOBAL.SimpleDialog.set({
      renderCustomeView: () =>{
        // let urlText = 'http://192.168.11.21:6932'
        let that = this
        return (
          <View
            style={{
              flexDirection: 'column',
              marginTop: scaleSize(16),
              width: '100%',
            }}
          >
            <Text
              style={{
                width: '100%',
                textAlign: 'left',
                marginLeft: scaleSize(16),
                marginBottom: scaleSize(16),
                fontsize: '25px'
              }}
            >{"请输入一个ip地址"}</Text>
            <View style={{
              width:'100%',
              height:scaleSize(1),
              backgroundColor:'#eee',
            }}></View>

            <TextInput
              style={{
                color:'#999',
                width: '100%',
                textAlign: 'center',
              }}
              placeholder = 'http://192.168.11.21:6932'
              onChangeText={text => {
                this.urlText = text
              }}
            />
            <View
              style={{
                flexDirection: 'row',
                color:'#999',
                width: '100%',
                marginLeft: scaleSize(16),
              }}
            >
              <RadioButton
                ref={ref => (this.FirstRB = ref)}
                onChange={() => {
                  if(this.checkedItem === 0){
                    this.RadioButtonOnChange(1)
                  } else {
                    this.RadioButtonOnChange(0)
                  }
                  
                }}
              />
              <Text>{'是否获取数据'}</Text>
            </View>

          </View>
       )
      },
      cancelText: '取消',
      cancelAction: () => { 
        GLOBAL.SimpleDialog.setVisible(false) 
      },
      confirmText: getLanguage(this.props.language).Profile.MAP_AR_DATUM_SURE,
      confirmAction: async () => {
        
        // 要先对输入框里的内容做判断
        // let threeServiceIpUrl = 'http://192.168.11.21:6932'
        // 更改redux里的三方IP地址 
        // this.props.setThreeServiceIpUrl({threeServiceIpUrl})

        await this.props.setThreeServiceIpUrl({threeServiceIpUrl:this.urlText})
        let tempurl = await this.props.threeServiceIpUrl
        debugger
        await login(this.urlText)
        if(this.checkedItem === 1) {
          return 
        }
        // await this.props.setThreeServiceIpUrl({threeServiceIpUrl})
        
        // 点击确认之后就要去获取服务数据，将他们的格式转换成我们自己的格式
        let info = await getMainAndSubTaskInfo()

        // 测接口
        // setMaintaskstate(56, 1)
        // setSubtaskState(102, 3)
        // getMainAndSubTaskInfo(threeServiceIpUrl)
        let maintaskLen = info.length
        for(let i = 0; i < maintaskLen; i++){
          // 获取主任务的信息
          let maintaskid = info[i].rwMaintask.taskid
          let maintaskName = info[i].rwMaintask.taskname
          let time = info[i].rwMaintask.createtime
          let subtaskInfoList = info[i].subtaskInfoList
          let substasklength = subtaskInfoList.length

          // 获取当前群组成员
          let result = await this.servicesUtils?.getGroupMembers({
            groupId: this.props.currentGroup.id,
          })
          let members = result.content

          for(let j = 0; j < substasklength; j ++) {
            // 获取子任务的信息
            let subtaskname = subtaskInfoList[j].subtaskname
            let principal = subtaskInfoList[j].principal
            let subtaskid = subtaskInfoList[j].subtaskid
            let process = subtaskInfoList[j].process

            // 向用户发送信息
            let timeStr = new Date().getTime()
            let id = `Group_Task_${this.props.currentGroup.id}_${timeStr}`

            // 群组成员
            let _members = []
            let hasMine = false
            for (const member of members) {
              if (this.props.user.currentUser.userName === member.userName) {
                hasMine = true
              }
              _members.push({
                name: member.nickname,
                id: member.userName,
              })
            }
            if (!hasMine) {
              _members.unshift({
                name: this.props.user.currentUser.nickname || '',
                id: this.props.user.currentUser.userName || '',
              })
            }

            // 任务的数据结构的构造
            let message = {
              id: id, 
              groupID: this.props.currentGroup.id,
              user: {
                name: this.props.user.currentUser.nickname || '',
                id: this.props.user.currentUser.userName || '',
              },
              creator: principal,
              members: _members,
              name: subtaskname,
              module: { 
                key: 'MAP_COLLECTION',
                index: 7,
              },
              resource: {
                resourceId: subtaskid,
                resourceName: subtaskname,
                nickname: principal,
                resourceCreator: principal,
                restService: null,
              },
              type: MsgConstant.MSG_ONLINE_GROUP_TASK,
              time: timeStr,
              isThreeTask: true, // 是否是第三方加载的任务 
              maintask: {  // 记录主任务的ID和名称 一个可选属性
                maintaskid,
                maintaskName,
              },
              process, // 完成进度
            }
            
            let temp = []
            for (const member of members) {
              if (
                member.nickname === this.props.user.currentUser.nickname ||
                member.userName === this.props.user.currentUser.userName
              ) continue
              // SMessageService.sendMessage(
              //   JSON.stringify(message),
              //   member.userName,
              // )
              temp.push(member.userName)
            }
            SMessageServiceHTTP.sendMessage(
              message,
              temp,
            )
            // TODO 底层同样declare个人队列
            await SMessageService.declareSession(_members, id)

            this.props.addCoworkMsg(message)

          }


        }
        // GLOBAL.SimpleDialog.setVisible(false) 
      },
    })
    GLOBAL.SimpleDialog.setVisible(true)
  }

  renderRight = (): Array<React.ReactNode> => {
    return [
      <ImageButton
        key={'operation'}
        containerStyle={{
          width: scaleSize(44),
          height: scaleSize(44),
        }}
        icon={getThemeAssets().nav.icon_nav_batch_operation}
        onPress={() => {
          this.setState({
            isMutiChoice: !this.state.isMutiChoice,
          })
        }}
      />,
      <ImageButton
        key={'source'}
        containerStyle={{
          marginLeft: scaleSize(30),
          marginRight: scaleSize(6),
          width: scaleSize(44),
          height: scaleSize(44),
        }}
        icon={getThemeAssets().cowork.icon_nav_resource}
        onPress={() => {
          NavigationService.navigate('GroupSourceManagePage')
        }}
      />,
      <ImageButton
        key={'setting'}
        containerStyle={{
          marginLeft: scaleSize(30),
          marginRight: scaleSize(6),
          width: scaleSize(44),
          height: scaleSize(44),
        }}
        icon={getThemeAssets().cowork.icon_nav_set}
        onPress={() => {
          NavigationService.navigate('GroupSettingPage', {
            callBack: this.callBack,
          })
        }}
      />,
      // 添加设置服务ip的按钮
      <ImageButton
        key={'addip'}
        containerStyle={{
          marginLeft: scaleSize(30),
          marginRight: scaleSize(6),
          width: scaleSize(44),
          height: scaleSize(44),
        }}
        icon={getThemeAssets().mapTools.icon_enlarge}
        onPress={() => {
          // NavigationService.navigate('GroupSettingPage', {
          //   callBack: this.callBack,
          // })
          this.addIp()
          
        }}
      />,
    ]
  }

  // _renderPagePopup = () => {
  //   return (
  //     <PopMenu
  //       ref={ref => (this.PagePopModal = ref)}
  //       data={this.popData}
  //       device={this.props.device}
  //       hasCancel={false}
  //     />
  //   )
  // }

  render() {
    return (
      <Container
        ref={(ref: any) => (this.container = ref)}
        showFullInMap={true}
        hideInBackground={false}
        headerProps={{
          // title: getLanguage(GLOBAL.language).Find.ONLINE_COWORK,
          title: this.props.currentGroup.groupName,
          navigation: this.props.navigation,
          headerRight: this.renderRight(),
          headerTitleViewStyle: {
            justifyContent: 'flex-start',
            marginLeft: scaleSize(80),
            marginRight: scaleSize(150),
          },
        }}
      >
        <TaskManage
          tabLabel={getLanguage(GLOBAL.language).Friends.TASK}
          groupInfo={this.props.currentGroup}
          createTask={this.createTask}
          isMutiChoice={this.state.isMutiChoice}
          {...this.props}
        />
      </Container>
    )
  }
}



// const mapStateToProps = (state: any) => ({
//   user: state.user.toJS(),
//   language: state.setting.toJS().language,
//   tasks: state.cowork.toJS().tasks,
//   coworkInfo: state.cowork.toJS().coworkInfo,
//   currentTask: state.cowork.toJS().currentTask,
//   coworkMessages: state.cowork.toJS().messages,
//   threeServiceIpUrl: state.cowork.toJS().threeServiceIpUrl,
//   currentGroup: state.cowork.toJS().currentGroup,
//   groups: state.cowork.toJS().groups,
// })

// const mapDispatchToProps = {
//   setThreeServiceIpUrl,
// }

// export default connect(
//   mapStateToProps,
//   mapDispatchToProps,
// )(CoworkManagePage)
