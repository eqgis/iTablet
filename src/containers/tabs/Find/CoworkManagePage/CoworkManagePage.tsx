import React from 'react'
import { Container, PopMenu, ImageButton } from '../../../../components'
import { View, TouchableOpacity, Text } from 'react-native'
import { scaleSize, OnlineServicesUtils, screen } from '../../../../utils'
import NavigationService from '../../../NavigationService'
import { getLanguage } from '../../../../language'
import { SCoordination, SMessageService, GroupType, GroupApplyMessageType } from 'imobile_for_reactnative'
import { UserType, MsgConstant } from '../../../../constants'
import { getThemeAssets } from '../../../../assets'
import { size } from '../../../../styles'
import ScrollableTabView, {
  DefaultTabBar,
} from 'react-native-scrollable-tab-view'
import GroupMessage from './GroupMessage'
import TaskManage from './TaskManage'
import { Users } from '../../../../redux/models/user'
import { ReadMsgParams, DeleteInviteParams } from '../../../../redux/models/cowork'
import CoworkInfo from '../../Friend/Cowork/CoworkInfo'
import SMessageServiceHTTP from '../../Friend/SMessageServiceHTTP'
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
  data: Array<GroupApplyMessageType>,
}

export default class CoworkManagePage extends React.Component<Props, State> {

  servicesUtils: SCoordination | undefined | null
  onlineServicesUtils: any
  // popData: Array<any>
  PagePopModal: PopMenu | null | undefined
  container: any
  callBack: (data?: any) => any

  constructor(props: Props) {
    super(props)
    this.callBack = this.props.navigation?.state?.params?.callBack
    if (UserType.isOnlineUser(this.props.user.currentUser)) {
      this.servicesUtils = new SCoordination('online')
      this.onlineServicesUtils = new OnlineServicesUtils('online')
    } else if (UserType.isIPortalUser(this.props.user.currentUser)){
      this.servicesUtils = new SCoordination('iportal')
      this.onlineServicesUtils = new OnlineServicesUtils('iportal')
    }

    // this.popData = [
    //   {
    //     title: getLanguage(GLOBAL.language).Friends.GROUP_SETTING,
    //     action: () => {
    //       NavigationService.navigate('GroupSettingPage', {
    //         callBack: this.callBack,
    //       })
    //     },
    //   },
    // ]
    // 只有群主才能分配任务
    // if (this.props.user.currentUser.userName === this.props.currentGroup.creator) {
    //   this.popData.unshift({
    //     title: getLanguage(GLOBAL.language).Friends.TASK_DISTRIBUTION,
    //     action: this.createTask,
    //   })
    // }
  }

  shouldComponentUpdate(nextProps: any, nextState: any) {
    let shouldUpdate = JSON.stringify(nextState) !== JSON.stringify(this.state) ||
    JSON.stringify(nextProps) !== JSON.stringify(this.props)
    return shouldUpdate
  }

  componentDidMount() {
    (async function() {
      GLOBAL.cookie = await this.onlineServicesUtils.getCookie()
    }.bind(this)())
    this.props.readCoworkGroupMsg({
      target: {
        groupId: this.props.currentGroup.id + '',
      },
      type: MsgConstant.MSG_ONLINE_GROUP_TASK,
    })
  }

  componentWillUnmount() {
    this.props.setCurrentGroup(undefined)
    this.servicesUtils = null
    this.onlineServicesUtils = null
    CoworkInfo.reset()
  }

  createTask = () => {
    if (UserType.isOnlineUser(this.props.user.currentUser)) {
      NavigationService.navigate('SelectModulePage', {
        callBack: (moduleData: {module: any, index: number}) => {
          NavigationService.navigate('GroupSourceManagePage', {
            isManage: false,
            hasDownload: false, // 是否有下载按钮
            title: getLanguage(GLOBAL.language).Friends.SELECT_MAP,
            itemAction: async ({data}: any) => {
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
      NavigationService.navigate('Login', {
        show: ['Online'],
      })
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
        key={'source'}
        containerStyle={{
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
          // this.PagePopModal && this.PagePopModal.setVisible(true, {
          //   x: event.nativeEvent.pageX,
          //   y: event.nativeEvent.pageY,
          // })
        }}
      />,
    ]
  }

  renderTab() {
    let width = screen.getScreenWidth(this.props.device.orientation)
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <ScrollableTabView
          page={0}
          renderTabBar={() => (
            <DefaultTabBar
              style={{
                height: scaleSize(80),
                marginTop: scaleSize(20),
                borderWidth: 0,
              }}
              renderTab={(name: null | undefined, page: any, isTabActive: any, onPressHandler: (arg0: any) => void) => {
                let activeTextColor = 'rgba(70,128,223,1.0)'
                let inactiveTextColor = 'black'
                const textColor = isTabActive
                  ? activeTextColor
                  : inactiveTextColor
                const fontWeight = isTabActive ? 'bold' : 'normal'

                return (
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      justifyContent: 'center',
                      paddingTop: scaleSize(20),
                      paddingBottom: scaleSize(10),
                    }}
                    key={name}
                    accessibilityTraits="button"
                    onPress={() => onPressHandler(page)}
                  >
                    <Text
                      style={{
                        color: textColor,
                        fontWeight,
                        fontSize: size.fontSize.fontSizeLg,
                        textAlign: 'center',
                      }}
                    >
                      {name}
                    </Text>
                    {/* {name ===
                      getLanguage(this.props.language).Friends.MESSAGES && (
                      <InformSpot
                        style={{
                          top: scaleSize(15),
                          right: '38%',
                        }}
                      />
                    )} */}
                  </TouchableOpacity>
                )
              }}
            />
          )}
          initialPage={0}
          tabBarUnderlineStyle={{
            backgroundColor: 'rgba(70,128,223,1.0)',
            height: scaleSize(6),
            width: scaleSize(6),
            borderRadius: scaleSize(3),
            marginLeft: width / 2 / 2 - 3,
            marginBottom: scaleSize(12),
          }}
        >
          <GroupMessage
            tabLabel={getLanguage(GLOBAL.language).Friends.MESSAGES}
            user={this.props.user}
            servicesUtils={this.servicesUtils}
            groupInfo={this.props.currentGroup}
          />
          <TaskManage
            tabLabel={getLanguage(GLOBAL.language).Friends.TASK}
            groupInfo={this.props.currentGroup}
            {...this.props}
          />
        </ScrollableTabView>
      </View>
    )
  }

  _renderPagePopup = () => {
    return (
      <PopMenu
        ref={ref => (this.PagePopModal = ref)}
        data={this.popData}
        device={this.props.device}
        hasCancel={false}
      />
    )
  }

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
        {/* {this.renderContent()} */}
        {/* {this.renderTab()} */}
        <TaskManage
          tabLabel={getLanguage(GLOBAL.language).Friends.TASK}
          groupInfo={this.props.currentGroup}
          createTask={this.createTask}
          {...this.props}
        />
        {/* {this._renderPagePopup()} */}
      </Container>
    )
  }
}
