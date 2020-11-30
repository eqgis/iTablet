import React from 'react'
import { Container, PopMenu, ImageButton } from '../../../../components'
import { View, TouchableOpacity, Text } from 'react-native'
import { scaleSize, OnlineServicesUtils, screen } from '../../../../utils'
import NavigationService from '../../../NavigationService'
import { getLanguage } from '../../../../language'
import { SMap, SCoordination, SMessageService } from 'imobile_for_reactnative'
import CoworkInfo from '../../Friend/Cowork/CoworkInfo'
import { UserType, MsgConstant } from '../../../../constants'
import { getThemeAssets } from '../../../../assets'
import { size } from '../../../../styles'
import ScrollableTabView, {
  DefaultTabBar,
} from 'react-native-scrollable-tab-view'
import GroupMessage from './GroupMessage'
import TaskManage from './TaskManage'
import { UserInfo, Users } from '../../../../redux/models/user'
import { GroupApplyMessageType } from './types'

interface Props {
  navigation: Object,
  user: Users,
  // cowork: Cowork,
  appConfig: Object,
  latestMap: Object,
  device: any,
  setCurrentMapModule: () => void,
  deleteInvite: () => void,
}

type State = {
  data: Array<GroupApplyMessageType>,
}

export default class CoworkManagePage extends React.Component<Props, State> {

  servicesUtils: SCoordination | undefined | null
  onlineServicesUtils: any
  popData: Array<any>
  PagePopModal: PopMenu | null | undefined
  container: any
  groupInfo: any
  callBack: (data?: any) => any

  constructor(props: Props) {
    super(props)
    this.groupInfo = this.props.navigation?.state?.params?.groupInfo
    this.callBack = this.props.navigation?.state?.params?.callBack
    if (UserType.isOnlineUser(this.props.user.currentUser)) {
      this.servicesUtils = new SCoordination('online')
      this.onlineServicesUtils = new OnlineServicesUtils('online')
    } else if (UserType.isIPortalUser(this.props.user.currentUser)){
      this.servicesUtils = new SCoordination('iportal')
      this.onlineServicesUtils = new OnlineServicesUtils('iportal')
    }

    this.popData = [
      {
        title: getLanguage(GLOBAL.language).Friends.GROUP_MEMBER_MANAGE,
        action: () => {
          if (UserType.isOnlineUser(this.props.user.currentUser)) {
            NavigationService.navigate('GroupFriendListPage', {
              groupInfo: this.groupInfo,
              mode: 'manage', // 管理模式
              title: getLanguage(GLOBAL.language).Friends.GROUP_MEMBER,
              callBack: this.callBack,
            })
          } else {
            NavigationService.navigate('Login', {
              show: ['Online'],
            })
          }
        },
      },
      {
        title: getLanguage(GLOBAL.language).Friends.GROUP_RESOURCE,
        action: () => {
          NavigationService.navigate('GroupSourceManagePage', {
            groupInfo: this.groupInfo,
          })
          // this.servicesUtils?.getGroupResources({
          //   groupId: this.groupInfo.id,
          //   currentPage: 1,
          //   pageSize: 100,
          //   orderType: 'DESC',
          //   orderBy: 'UPDATETIME',
          // }).then((result: any) => {
          //   console.warn(JSON.stringify(result))
          // })
        },
      },
      // {
      //   title: '上传数据',
      //   action: () => {
      //     this.onlineServicesUtils.uploadFile(
      //       GLOBAL.homePath + '/iTablet/ExternalData/ExportData/国情普查_示范数据.zip',
      //       `国情普查_示范数据.zip`,
      //       'WORKSPACE',
      //     ).then((result: any) => {
      //       this.resourceId = result
      //       console.warn(JSON.stringify(result))
      //     })
      //   },
      // },
      // {
      //   title: '分享数据',
      //   action: () => {
      //     this.servicesUtils?.shareDataToGroup({
      //       groupId: this.groupInfo.id,
      //       ids: [this.resourceId],
      //     }).then((result: any) => {
      //       console.warn(JSON.stringify(result))
      //     })
      //   },
      // },
      {
        title: '分配任务',
        action: () => {
          let timeStr = new Date().getTime()
          let message: any = {
            id: 'GROUP_TASK_' + timeStr,
            message: {
              type: MsgConstant.MSG_ONLINE_GROUP_TASK,
              resourceId: 123,
              groupId: this.groupInfo.id,
              resourceName: 'aafafafa',
              createTime: new Date().getTime(),
              resourceCreator: this.props.user.currentUser.userId,
              nickname: this.props.user.currentUser.nickname,
            },
            type: MsgConstant.MSG_ONLINE_GROUP,
            user: {
              name: this.props.user.currentUser.nickname || '',
              id: this.props.user.currentUser.userId || '',
            },
            group: {
              groupID: this.groupInfo.id,
              groupName: this.groupInfo.groupName,
              groupCreator: this.groupInfo.creator,
            },
            time: timeStr,
          }
          SMessageService.sendMessage(
            JSON.stringify(message),
            // '949941',
            '870694',
          )
        },
      },
    ]
    // 只有群主才能分配任务
    if (this.props.user.currentUser.userId === this.groupInfo.creator) {
      this.popData.unshift({
        title: getLanguage(GLOBAL.language).Friends.TASK_DISTRIBUTION,
        action: () => {
          if (UserType.isOnlineUser(this.props.user.currentUser)) {
            NavigationService.navigate('GroupFriendListPage', {
              groupInfo: this.groupInfo,
              mode: 'multiSelect', // 多选模式
              includeMe: false, // 是否包含当前用户
              hasSettingBtn: false, // 是否含有右上角设置按钮
              callBack: (members: any) => {
                NavigationService.navigate('SelectModule', {
                  callBack: (module: any, index: number) => {
                    NavigationService.navigate('GroupSourceManagePage', {
                      isManage: false,
                      title: getLanguage(GLOBAL.language).Friends.SELECT_MAP,
                      groupInfo: this.groupInfo,
                      itemAction: (data: any) => {
                        let item = data.item
                        let mapName = item.name.substring(
                          0,
                          item.name.lastIndexOf('.'),
                        )
                        let map = {
                          name: mapName,
                          path: item.path,
                        }
                        NavigationService.pop(3)
                        NavigationService.goBack('GroupFriendListPage', null)

                        // 向用户发送信息
                        let timeStr = new Date().getTime()
                        let message: any = {
                          id: 'GROUP_TASK_' + timeStr,
                          message: {
                            type: MsgConstant.MSG_ONLINE_GROUP_TASK,
                            ...data,
                          },
                          type: MsgConstant.MSG_ONLINE_GROUP,
                          user: {
                            name: this.props.user.currentUser.nickname || '',
                            id: this.props.user.currentUser.userId || '',
                          },
                          group: {
                            groupID: this.groupInfo.id,
                            groupName: this.groupInfo.groupName,
                            groupCreator: this.groupInfo.creator,
                          },
                          time: timeStr,
                        }
                        for (const mebmer of members) {
                          this.createCowork(mebmer.userName.toString(), module, index, map)
                          SMessageService.sendMessage(
                            JSON.stringify(message),
                            mebmer.userName,
                          )
                        }
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
        },
      })
    }
  }

  shouldComponentUpdate(nextProps: any, nextState: any) {
    let shouldUpdate = JSON.stringify(nextState) !== JSON.stringify(this.state) ||
    JSON.stringify(nextProps) !== JSON.stringify(this.props)
    return shouldUpdate
  }

  // componentDidMount() {
  //   this.getGroupApply()
  // }

  componentWillUnmount() {
    this.servicesUtils = null
    this.onlineServicesUtils = null
  }

  createCowork = async (targetId: any, module: { action: (arg0: UserInfo, arg1: any) => void }, index: any, map: any) => {
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
      GLOBAL.getFriend().setCurMod(module)
      this.props.setCurrentMapModule(index).then(() => {
        module.action(this.props.user.currentUser, map)
      })
      GLOBAL.getFriend().curChat &&
        GLOBAL.getFriend().curChat.setCoworkMode(true)
      GLOBAL.coworkMode = true
      CoworkInfo.setTalkId(targetId)
      setTimeout(() => GLOBAL.Loading.setLoading(false), 300)
    } catch (error) {
      GLOBAL.Loading.setLoading(false)
    }
  }

  deleteInvite = (data: any) => {
    GLOBAL.SimpleDialog.set({
      text: getLanguage(GLOBAL.language).Friends.DELETE_COWORK_ALERT,
      confirmAction: () => this.props.deleteInvite(data),
    })
    GLOBAL.SimpleDialog.setVisible(true)
  }

  renderRight = () => {
    return (
      <ImageButton
        icon={getThemeAssets().tabBar.tab_setting_selected}
        onPress={(event: any) => {
          this.PagePopModal && this.PagePopModal.setVisible(true, {
            x: event.nativeEvent.pageX,
            y: event.nativeEvent.pageY,
          })
        }}
      />
    )
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
            groupInfo={this.groupInfo}
          />
          <TaskManage
            tabLabel={getLanguage(GLOBAL.language).Friends.TASK}
            groupInfo={this.groupInfo}
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
          title: this.groupInfo.groupName,
          navigation: this.props.navigation,
          headerRight: this.renderRight(),
        }}
      >
        {/* {this.renderContent()} */}
        {this.renderTab()}
        {this._renderPagePopup()}
      </Container>
    )
  }
}
