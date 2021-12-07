import React from 'react'
import { Container, PopMenu, ImageButton } from '../../../../components'
import { scaleSize, SCoordinationUtils } from '../../../../utils'
import * as OnlineServicesUtils from '../../../../utils/OnlineServicesUtils'
import NavigationService from '../../../NavigationService'
import { getLanguage } from '../../../../language'
import { SMessageService } from 'imobile_for_reactnative'
import { UserType, MsgConstant } from '../../../../constants'
import { getThemeAssets } from '../../../../assets'
import TaskManage from './TaskManage'
import { Users } from '../../../../redux/models/user'
import { ReadMsgParams, DeleteInviteParams } from '../../../../redux/models/cowork'
import CoworkInfo from '../../Friend/Cowork/CoworkInfo'
import SMessageServiceHTTP from '../../Friend/SMessageServiceHTTP'
import CoworkFileHandle from './CoworkFileHandle'
import { DataItemServices, GroupType } from 'imobile_for_reactnative/types/interface/iserver/types'
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
}

export default class CoworkManagePage extends React.Component<Props, State> {

  PagePopModal: PopMenu | null | undefined
  container: any
  callBack: (data?: any) => any

  constructor(props: Props) {
    super(props)
    this.callBack = this.props.navigation?.state?.params?.callBack
    this.state = {
      isMutiChoice: false,
    }
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
                includeMe: false, // 是否包含当前用户
                hasSettingBtn: false, // 是否含有右上角设置按钮
                callBack: async (members: any) => {
                  NavigationService.goBack('SelectModulePage', null)

                  // 向用户发送信息
                  let timeStr = new Date().getTime()
                  let id = `Group_Task_${this.props.currentGroup.id}_${timeStr}`

                  let _members = [{
                    name: this.props.user.currentUser.nickname || '',
                    id: this.props.user.currentUser.userName || '',
                  }]
                  for (const member of members) {
                    _members.push({
                      name: member.nickname,
                      id: member.userName,
                    })
                  }

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
                  }
                  let temp = []
                  for (const member of members) {
                    if (member.id === this.props.user.currentUser.userName) continue
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
