import { Module } from '../../src/class'
import { getLanguage } from '../../src/language'
import { getThemeAssets } from '../../src/assets'
import { UserType } from '../../src/constants'
import { UserInfo } from '../../src/types'
import { SCoordinationUtils, Toast } from '../../src/utils'
import NavigationService from '../../src/containers/NavigationService'
import { GroupInfo, CreateGroupResponse } from 'imobile_for_reactnative/types/interface/iserver/types'
import CoworkFileHandle from '../../src/containers/tabs/Find/CoworkManagePage/CoworkFileHandle'

type USER_TYPE = 'online' | 'iportal' | undefined
const COWORK_GROUP_NAME = '外业采集协作'

/**
 * 首页显示的协作模块
 */
export default class CoworkModule extends Module {
  static key = 'Cowork'
  // groupName = '外业采集协作'
  setCurrentGroup: ((groupInfo: GroupInfo) => Promise<void>) | undefined
  userType: USER_TYPE = undefined
  currentUser: UserInfo | undefined

  constructor () {
    super({
      key: CoworkModule.key,
    })
    this.setCurrentGroup = undefined
    this.currentUser = undefined
  }

  initCoworkList = async () => {
    try {
      await CoworkFileHandle.initLocalCoworkList(this.currentUser)
      await CoworkFileHandle.syncOnlineCoworkList()
      GLOBAL.getFriend?.().getOnlineGroup(this.userType)
    } catch(e) {
      // eslint-disable-next-line no-console
      __DEV__ && console.warn(error)
    }
  }

  createGroup = async () => {
    try {
      const scoordination = SCoordinationUtils.getScoordiantion(this.userType)
      const result: CreateGroupResponse = await scoordination?.createGroup({
        groupName: COWORK_GROUP_NAME,
        tags: COWORK_GROUP_NAME,
        isPublic: true,
        description: '',
        resourceSharer: 'MEMBER',
        isNeedCheck: false,
      })
      await this.initCoworkList()
      if (result.succeed && this.currentUser) {
        const groupInfo = await getGroups(this.currentUser, COWORK_GROUP_NAME, {pageSize: 100, currentPage: 1, orderBy: 'CREATETIME', orderType: 'DESC'})
        this.goToGroup(groupInfo)
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      __DEV__ && console.warn(error)
    }
  }

  goToGroup = (groupInfo: GroupInfo) => {
    this.setCurrentGroup?.(groupInfo)
    NavigationService.navigate('CoworkManagePage')
  }

  action = async (currentUser: UserInfo | undefined) => {
    this.currentUser = currentUser
    if (UserType.isIPortalUser(this.currentUser)) {
      this.userType = 'iportal'
    } else if (UserType.isOnlineUser(this.currentUser)) {
      this.userType = 'online'
    }
    if (this.userType !== undefined && currentUser) {
      let groupInfo = await getGroups(currentUser, COWORK_GROUP_NAME, {pageSize: 100, currentPage: 1, orderBy: 'CREATETIME', orderType: 'DESC'})
      if (groupInfo) {
        // 若有群组并已加入,则直接进入群组
        await this.initCoworkList()
        this.goToGroup(groupInfo)
      } else {
        groupInfo = await getGroups(currentUser, COWORK_GROUP_NAME, {pageSize: 100, currentPage: 1, orderBy: 'CREATETIME', orderType: 'DESC', joinTypes: ['CANJOIN']})
        if (groupInfo) {
          // 若群组存在,但未加入群组,则直接加入并进入群组
          // this.joinGroup(groupInfo)
          let result = await joinGroup(currentUser, groupInfo)
          if (result?.succeed) {
            this.goToGroup(groupInfo)
          }
        } else {
          if (this.userType === 'online' || this.userType === 'iportal' && currentUser?.roles?.indexOf('ADMIN') >= 0) {
            // 若群组不存在,则直接创建并进入群组
            this.createGroup()
          } else {
            Toast.show(getLanguage(GLOBAL.language).Prompt.TO_CREATE_COWROK_GROUP)
          }
        }
      }
    } else {
      NavigationService.navigate('Login')
    }
  }

  // 首页模块数据
  getChunk = (language: string, params?: {
    setCurrentGroup: (groupInfo: GroupInfo) => Promise<void>,
  }) => {
    return this.createChunk(language, {
      key: CoworkModule.key,
      // 根据语言获取地图模块名称
      title: '我的任务',
      // 模块图片
      moduleImage: getThemeAssets().find.onlineCowork,
      // 点击时模块高亮图片
      moduleImageTouch: getThemeAssets().find.onlineCowork,
      action: (user: UserInfo) => {
        this.setCurrentGroup = params?.setCurrentGroup
        this.action(user)
      },
    })
  }
}



async function joinGroup(user: UserInfo, groupInfo: GroupInfo) {
  try {
    if (groupInfo && groupInfo.id !== undefined) {
      let userType: USER_TYPE
      if (UserType.isIPortalUser(user)) {
        userType = 'iportal'
      } else if (UserType.isOnlineUser(user)) {
        userType = 'online'
      }
      if (userType === undefined) return null
      const scoordination = SCoordinationUtils.getScoordiantion(userType)
      const result = await scoordination?.applyToGroup({
        groupIds: [groupInfo.id + ''],
        applyReason: '',
        applicant: user.userName || user.userId || '',
      })
      await CoworkFileHandle.initLocalCoworkList(user)
      await CoworkFileHandle.syncOnlineCoworkList()
      GLOBAL.getFriend?.().getOnlineGroup(userType)
      // if (result.succeed) {
      //   this.goToGroup(groupInfo)
      // }
      return result
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    __DEV__ && console.warn(error)
    return null
  }
}

async function getGroups(user: UserInfo, groupName: string, {pageSize = 100, currentPage = 1, orderBy = 'CREATETIME', orderType = 'DESC', joinTypes = ['CREATE', 'JOINED']}): Promise<any> {
  let currentGroup
  try {
    let userType: USER_TYPE
    if (UserType.isIPortalUser(user)) {
      userType = 'iportal'
    } else if (UserType.isOnlineUser(user)) {
      userType = 'online'
    }
    if (userType === undefined) return null
    const result = await SCoordinationUtils.getScoordiantion(userType)?.getGroupInfos({
      orderBy: orderBy,
      orderType: orderType,
      pageSize: pageSize,
      currentPage: currentPage,
      keywords: groupName.replace(/#/g, ''), // 搜索带#,无法搜索到指定结果
      joinTypes: joinTypes,
    })
    if (result && result.content) {
      for (const group of result.content) {
        if (group.groupName === groupName) {
          currentGroup = group
          break
        }
      }
    }
    return currentGroup
  } catch (error) {
    return null
  }
}

export {
  joinGroup,
  getGroups,
  COWORK_GROUP_NAME,
}