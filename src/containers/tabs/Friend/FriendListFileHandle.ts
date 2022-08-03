/**
 * Created by imobile-xzy on 2019/3/18.
 */

// eslint-disable-next-line
import { Platform } from 'react-native'
import { SOnlineService, SIPortalService, RNFS } from 'imobile_for_reactnative'
import { FileTools} from '../../../native'
import ConstPath from '../../../constants/ConstPath'
import * as OnlineServicesUtils from '../../../utils/OnlineServicesUtils'
import { UserType } from '../../../constants'
import { UserInfo } from '../../../types'
import RNFetchBlob from 'rn-fetch-blob'
import CookieManager from 'react-native-cookies'


function isJSON(str: string) {
  if (typeof str === 'string') {
    try {
      var obj = JSON.parse(str)
      if (typeof obj === 'object' && obj) {
        return true
      } else {
        return false
      }
    } catch (e) {
      return false
    }
  }
}

interface FriendListInfo {
  /** 文件版本 */
  rev: number,
  /** 文件所有人的 userName */
  user: string,
  /** 好友列表 */
  userInfo: Friend[],
  /** 群组列表 */
  groupInfo: Group[],
}

interface Friend {
  markName: string,
  name: string,
  id: string,
  info: {
    /**
     * 0： 对方删除了自己，此时向对方发消息会提示不是好友
     * 1： 互为好友，正常显示和收发消息
     * 2： 申请中，此时不显示此好友
     */
    isFriend: 0 | 1 | 2 // 0: 不是好友; 1: 好友; 2: 申请还未同意
  }
}

interface Group {
  id: string,
  groupName: string,
  masterID: string,
  members: Array<{
    id: string,
    name: string,
  }>,
}

export default class FriendListFileHandle {
  static user: UserInfo
  static friends: FriendListInfo | undefined = undefined
  static refreshCallback:( () => void ) | undefined = undefined
  static refreshMessageCallback:( () => void ) | undefined = undefined
  static friendListFile = ''
  static friendListFile_ol = ''
  static uploading = false
  static waitUploading = false
  static adminInfoFile = ''
  static adminInfo = {
    userName: '',
    password: '',
  }
  static adminInfoUploading = false
  static adminInfoWaitUploading = false

  /**
   * 初始化friendlist路径
   * @param {*} user currentUser
   */
  static async init(user: UserInfo) {
    if (FriendListFileHandle.user?.userName !== user.userName || !UserType.isIPortalUser(user)) {
      // 非iportal用户使用friend.list文件,或非相同用户初始化清空好友列表
      // iportal用户使用在线好友数据,则不初始化好友列表
      FriendListFileHandle.friends = undefined
    }
    FriendListFileHandle.user = user
    FriendListFileHandle.friendListFile = ''
    FriendListFileHandle.friendListFile_ol = ''

    if (!UserType.isOnlineUser(user) && !UserType.isIPortalUser(user)) {
      return
    }

    let userPath = await FileTools.appendingHomeDirectory(
      ConstPath.UserPath + user.userName + '/Data/Temp',
    )

    let friendListFile = userPath + '/friend.list'
    let onlineList = userPath + '/ol_fl'

    FriendListFileHandle.friendListFile = friendListFile
    FriendListFileHandle.friendListFile_ol = onlineList

    FriendListFileHandle.adminInfoFile = userPath + '/adminInfo'

    if (UserType.isIPortalUser(FriendListFileHandle.user) && FriendListFileHandle.user.roles?.indexOf('ADMIN') >= 0) {
      FriendListFileHandle.adminInfo = {
        userName: FriendListFileHandle.user.userName,
        password: FriendListFileHandle.user.password || '',
      }
    }
  }

  /**
   * 初始化后读取本地列表
   * @param {*} user currentUser
   */
  static async initLocalFriendList(user: UserInfo) {
    if (!UserType.isOnlineUser(user) && !UserType.isIPortalUser(user)) {
      return
    }
    await FriendListFileHandle.init(user)
    //读取本地文件并刷新
    FriendListFileHandle.getLocalFriendList()
  }

  /**
   * 初始化后读取本地列表，再读取online列表
   * @param {*} user currentUser
   */
  static async initFriendList(user: UserInfo) {
    if (!UserType.isOnlineUser(user) && !UserType.isIPortalUser(user)) {
      return
    }
    await FriendListFileHandle.init(user)
    //读取本地文件并刷新
    await FriendListFileHandle.getLocalFriendList()

    if (UserType.isIPortalUser(FriendListFileHandle.user)) {
      // 判断是否开启公开用户列表
      const adminInfoId = await FriendListFileHandle.isAdminOpenFriends()
      if (adminInfoId) {
        await FriendListFileHandle.getAdminInfo(adminInfoId)
      } else if (FriendListFileHandle.user.roles?.indexOf('ADMIN') < 0) {
        // iportal中没有Admin信息,非Admin用户清空当前信息
        FriendListFileHandle.adminInfo = {
          userName: '',
          password: '',
        }
      }
    }
    //同步online文件并刷新
    return await FriendListFileHandle.syncOnlineFriendList()
  }

  /**
   * 读取本地列表，删除online列表
   */
  static async getLocalFriendList() {
    if (FriendListFileHandle.friendListFile !== '' && FriendListFileHandle.user && !UserType.isIPortalUser(FriendListFileHandle.user)) {
      if (await FileTools.fileIsExist(FriendListFileHandle.friendListFile)) {
        let value = await RNFS.readFile(FriendListFileHandle.friendListFile)
        if (isJSON(value) === true) {
          FriendListFileHandle.friends = JSON.parse(value)
        }
      } else {
        FriendListFileHandle.friends = undefined
      }

      if (await FileTools.fileIsExist(FriendListFileHandle.friendListFile_ol)) {
        await RNFS.unlink(FriendListFileHandle.friendListFile_ol)
      }
    }

    FriendListFileHandle.checkFriendList()
    FriendListFileHandle.refreshCallback?.()
    FriendListFileHandle.refreshMessageCallback?.()
    return FriendListFileHandle.friends
  }

  /**
   * 保持本地和online的文件一致
   */
  static async syncOnlineFriendList() {
    if (FriendListFileHandle.friendListFile_ol === '') {
      return false
    }
    const isIPortalUser = UserType.isIPortalUser(FriendListFileHandle.user)
    const JSOnlineService = OnlineServicesUtils.getService(isIPortalUser ? 'iportal' : 'online')
    if (isIPortalUser && FriendListFileHandle.adminInfo.userName && FriendListFileHandle.adminInfo.password) {
      // iportal使用admin中读取的用户列表,不用文件下载;群组使用本地数据
      let admingLoginResult,
        cookie = '',
        isAdmin = FriendListFileHandle.user.roles?.indexOf('ADMIN') >= 0
      if (!isAdmin) {
        // admin登录
        const adminLoginResponse = await RNFetchBlob.config({trusty:true}).fetch('POST', JSOnlineService.serverUrl + '/login.json', {
          'Content-Type': 'application/json; charset=utf-8',
        }, JSON.stringify({
          username: FriendListFileHandle.adminInfo.userName,
          password: FriendListFileHandle.adminInfo.password,
          rememberme: true,
        }))
        cookie = adminLoginResponse.respInfo.headers['Set-Cookie'].split('; ')[0]

        // let result = await SIPortalService.login(JSOnlineService.serverUrl + '/login.json', FriendListFileHandle.adminInfo.userName, FriendListFileHandle.adminInfo.password, true)


        admingLoginResult = await adminLoginResponse.json()
      } else {
        cookie = await SIPortalService.getIPortalCookie()
      }

      if (isAdmin || admingLoginResult?.succeed && cookie) {
        // 获取用户列表
        let adminURL = JSOnlineService.serverUrl.replace('/web', '') + '/manager/security/v811/portalusers.json?t=1641345231317&orderType=ASC&orderBy=USERNAME&pageSize=100&currentPage=1&keywords=%5B%22%22%5D'
        const response = await RNFetchBlob.config({trusty:true}).fetch('GET', adminURL, {
          cookie: cookie,
        })
        const data = await response.json()
        if (data) {
          FriendListFileHandle.friends = {
            /** 文件版本 */
            rev: 1,
            /** 文件所有人的 userName */
            user: FriendListFileHandle.user.userName,
            /** 好友列表 */
            userInfo: data.content.map((item: { name: any; nickname: any }) => {
              let _item: Friend = {
                id: item.name,
                markName: item.nickname,
                name: item.name,
                info: {
                  isFriend: 1,
                },
              }
              return _item
            }),
            /** 群组列表 */
            groupInfo: FriendListFileHandle?.friends?.groupInfo || [],
          }
          FriendListFileHandle.refreshCallback?.()
          FriendListFileHandle.refreshMessageCallback?.()

          // 退出admin登录
          await RNFetchBlob.config({trusty:true}).fetch('GET', JSOnlineService.serverUrl + '/services/security/logout.json', {
            cookie: cookie,
          })
        }
      }
      // cookie发生改变,需要重新登录
      if (admingLoginResult?.succeed && cookie) {
        await CookieManager.clearAll()
        if (FriendListFileHandle.user.password && FriendListFileHandle.user.userName) {
          await SIPortalService.login(FriendListFileHandle.user.serverUrl, FriendListFileHandle.user.userName, FriendListFileHandle.user.password, true)
        }
      }
    } else {
      // TODO 临时用于删除online上多余的friend.list 和 friend.list.zip
      const allFriendData = await JSOnlineService?.findMyCreateData({
        keywords: 'friend',
        pageSize: 10000,
        currentPage: 1,
        typeId: 4,
      })
      if (allFriendData?.content?.length > 0) {
        for (const item of allFriendData.content) {
          if (item.title === 'friend.list.zip') {
            continue
          }
          if (
            item.title.startsWith('friend')
            && (
              item.title.endsWith('.list') ||
              item.title.endsWith('.zip')
            )
          ) {
            JSOnlineService?.deleteMyCreateData(item.iptResId)
          }
        }
      }
      // TODO end

      const dataId = await JSOnlineService?.getDataIdByName('friend.list.zip')
      if (dataId !== undefined) {
        const callback = async (result: boolean | string | RNFS.DownloadResult, resolve: (value: any) => void, reject: (value: any) => void) => {
          try {
            if (result === true || typeof result === 'object' && result.jobId) {
              let value = await RNFS.readFile(
                FriendListFileHandle.friendListFile_ol,
              )
              let onlineVersion: FriendListInfo = JSON.parse(value)
              //确保是当前用户的好友列表
              if(onlineVersion.user && onlineVersion.user === FriendListFileHandle.user?.userName) {
                if (
                  !FriendListFileHandle.friends ||
                  onlineVersion.rev > FriendListFileHandle.friends.rev
                ) {
                  //没有本地friendlist或online的版本较新，更新本地文件
                  FriendListFileHandle.friends = onlineVersion
                  await RNFS.writeFile(
                    FriendListFileHandle.friendListFile,
                    value,
                  )
                  FriendListFileHandle.checkFriendList()
                  FriendListFileHandle.refreshCallback?.()
                  FriendListFileHandle.refreshMessageCallback?.()
                } else if (
                  onlineVersion.rev < FriendListFileHandle.friends.rev
                ) {
                  //本地版本较新，将本地文件更新到online
                  await FriendListFileHandle.upload()
                }
              } else if(FriendListFileHandle.friends){
                await FriendListFileHandle.upload()
              }
              await RNFS.unlink(FriendListFileHandle.friendListFile_ol)
              resolve(true)
            } else {
              resolve(false)
            }
          } catch (error) {
            reject(error)
          }
        }
        return new Promise(async (resolve, reject) => {
          SOnlineService.downloadFileWithCallBack(
            FriendListFileHandle.friendListFile_ol,
            'friend.list',
            {
              onResult: async value => {
                callback(value, resolve, reject)
              },
            },
          )
        })
      } else {
        if (FriendListFileHandle.friends !== undefined) {
          //没有online文件，更新本地到online
          await FriendListFileHandle.upload()
        }
        return true
      }
    }
  }

  /**
   * 直接获取friendlist,friendlist更新完成后调用
   */
  static getFriendList() {
    return FriendListFileHandle.friends
  }

  static checkFriendList() {
    if(!UserType.isOnlineUser(FriendListFileHandle.user) && !UserType.isIPortalUser(FriendListFileHandle.user)) {
      FriendListFileHandle.friends = undefined
      return
    }
    let fl = FriendListFileHandle.friends
    if (!fl) {
      return
    }

    if (fl.user !== undefined) {
      if (fl.user !== FriendListFileHandle.user?.userName) {
        FriendListFileHandle.friends = undefined
        return
      }
    } else {
      fl.user = FriendListFileHandle.user.userName
    }

    if (fl.rev === undefined || typeof fl.rev !== 'number') {
      fl.rev = 0
    }

    if (fl.userInfo === undefined) {
      fl.userInfo = []
    }

    if (fl.userInfo.length !== 0) {
      for (let user = fl.userInfo.length - 1; user > -1; user--) {
        if (
          fl.userInfo[user].markName === undefined ||
          fl.userInfo[user].markName === ''
        ) {
          fl.userInfo.splice(user, 1)
          continue
        }
        if (
          fl.userInfo[user].name === undefined ||
          fl.userInfo[user].name === ''
        ) {
          fl.userInfo.splice(user, 1)
          continue
        }
        if (fl.userInfo[user].id === undefined || fl.userInfo[user].id === '') {
          fl.userInfo.splice(user, 1)
          continue
        }
        if (
          fl.userInfo[user].info === undefined ||
          fl.userInfo[user].info.isFriend === undefined
        ) {
          fl.userInfo.splice(user, 1)
          continue
        }
      }
    }

    if (fl.groupInfo === undefined) {
      fl.groupInfo = []
    }

    if (fl.groupInfo.length !== 0) {
      for (let group = fl.groupInfo.length - 1; group > -1; group--) {
        if (
          fl.groupInfo[group].id === undefined ||
          fl.groupInfo[group].id === ''
        ) {
          fl.groupInfo.splice(group, 1)
          continue
        }
        if (
          fl.groupInfo[group].groupName === undefined ||
          fl.groupInfo[group].groupName === ''
        ) {
          fl.groupInfo.splice(group, 1)
          continue
        }
        if (
          fl.groupInfo[group].masterID === undefined ||
          fl.groupInfo[group].masterID === ''
        ) {
          fl.groupInfo.splice(group, 1)
          continue
        }
        if (fl.groupInfo[group].members === undefined) {
          fl.groupInfo.splice(group, 1)
          continue
        } else {
          let userErr = false
          for (
            let user = 0;
            user < fl.groupInfo[group].members.length;
            user++
          ) {
            if (
              fl.groupInfo[group].members[user].id === undefined ||
              fl.groupInfo[group].members[user].id === ''
            ) {
              userErr = true
              break
            }
            if (
              fl.groupInfo[group].members[user].name === undefined ||
              fl.groupInfo[group].members[user].name === ''
            ) {
              userErr = true
              break
            }
          }
          if (userErr) {
            fl.groupInfo.splice(group, 1)
            continue
          }
        }
      }
    }
  }

  static async upload() {
    // iportal不使用文件保存好友和群组
    if(UserType.isIPortalUser(FriendListFileHandle.user)) {
      return
    }
    if (FriendListFileHandle.uploading) {
      if (FriendListFileHandle.waitUploading) {
        return
      }
      FriendListFileHandle.waitUploading = true
      setTimeout(() => {
        FriendListFileHandle.upload()
      }, 3000)
      return
    }
    FriendListFileHandle.uploading = true
    //上传
    const UploadFileName = 'friend.list.zip'
    // let promise
    const dataId = await OnlineServicesUtils.getService().getDataIdByName('friend.list.zip')
    // if (UserType.isIPortalUser(FriendListFileHandle.user)) {
    // await SIPortalService.deleteMyData(dataId + '')
    return new Promise(resolve => {
      // let action = OnlineServicesUtils.getService().uploadFileWithCheckCapacity
      if (dataId) {
        OnlineServicesUtils.getService().updateFileWithCheckCapacity(
          dataId,
          FriendListFileHandle.friendListFile,
          UploadFileName,
          'WORKSPACE',
        ).then(id => {
          resolve(!!id)
          FriendListFileHandle.uploading = false
          FriendListFileHandle.waitUploading = false
        })
      } else {
        OnlineServicesUtils.getService().uploadFileWithCheckCapacity(
          FriendListFileHandle.friendListFile,
          UploadFileName,
          'WORKSPACE',
        ).then(id => {
          resolve(!!id)
          FriendListFileHandle.uploading = false
          FriendListFileHandle.waitUploading = false
        })
      }
    })
    // } else {
    //   // if (Platform.OS === 'android') {
    //   //   UploadFileName = 'friend.list'
    //   // }
    //   // await SOnlineService.deleteData('friend.list')
    //   promise = new Promise(resolve => {
    //     if (dataId) {
    //       OnlineServicesUtils.getService().updateFileWithCheckCapacity(
    //         dataId,
    //         FriendListFileHandle.friendListFile,
    //         UploadFileName,
    //         'WORKSPACE',
    //       ).then(id => {
    //         resolve(!!id)
    //         FriendListFileHandle.uploading = false
    //         FriendListFileHandle.waitUploading = false
    //       })
    //     } else {
    //       OnlineServicesUtils.getService().uploadFileWithCheckCapacity(
    //         FriendListFileHandle.friendListFile,
    //         UploadFileName,
    //         'WORKSPACE',
    //       ).then(id => {
    //         resolve(!!id)
    //         FriendListFileHandle.uploading = false
    //         FriendListFileHandle.waitUploading = false
    //       })
    //     }
    //     // SOnlineService.uploadFile(
    //     //   FriendListFileHandle.friendListFile,
    //     //   UploadFileName,
    //     //   {
    //     //     onResult: () => {
    //     //       resolve(true)
    //     //       FriendListFileHandle.uploading = false
    //     //       FriendListFileHandle.waitUploading = false
    //     //     },
    //     //   },
    //     // )
    //   })
    // }
    // return promise
  }

  static async saveHelper(friendsStr: string) {
    if (await FileTools.fileIsExist(FriendListFileHandle.friendListFile)) {
      await RNFS.unlink(FriendListFileHandle.friendListFile)
    }
    await RNFS.writeFile(FriendListFileHandle.friendListFile, friendsStr)
    if (FriendListFileHandle.refreshCallback) {
      FriendListFileHandle.refreshCallback()
    }
    await FriendListFileHandle.upload()
    // if (callback) {
    //   callback(true)
    // }
  }

  static async addToFriendList(obj: Friend) {
    let bFound = FriendListFileHandle.findFromFriendList(obj.id)

    if (!bFound) {
      if (!FriendListFileHandle.friends) {
        FriendListFileHandle.friends = {
          rev: 1,
          user: FriendListFileHandle.user.userName,
          userInfo: [],
          groupInfo: [],
        }
      } else {
        FriendListFileHandle.friends['rev'] += 1
      }
      FriendListFileHandle.friends.userInfo.push(obj)
      let friendsStr = JSON.stringify(FriendListFileHandle.friends)
      await FriendListFileHandle.saveHelper(friendsStr)
    }
  }

  //管理关系
  static async modifyIsFriend(id: string, isFriend: 0 | 1 | 2) {
    if(!FriendListFileHandle.friends) return
    for (
      let key = 0;
      key < FriendListFileHandle.friends.userInfo.length;
      key++
    ) {
      let friend = FriendListFileHandle.friends.userInfo[key]
      if (id === friend.id) {
        friend.info.isFriend = isFriend

        FriendListFileHandle.friends['rev'] += 1
        let friendsStr = JSON.stringify(FriendListFileHandle.friends)
        await FriendListFileHandle.saveHelper(friendsStr)
        break
      }
    }
  }

  /**
   * 修改备注名
   */
  static async modifyFriendList(id: string, name: string) {
    if(!FriendListFileHandle.friends) return
    for (
      let key = 0;
      key < FriendListFileHandle.friends.userInfo.length;
      key++
    ) {
      let friend = FriendListFileHandle.friends.userInfo[key]
      if (id === friend.id) {
        if (name !== '') {
          friend.markName = name
        } else {
          friend.markName = friend.name
        }
        FriendListFileHandle.friends['rev'] += 1
        let friendsStr = JSON.stringify(FriendListFileHandle.friends)
        await FriendListFileHandle.saveHelper(friendsStr)
        break
      }
    }

  }

  static async delFromFriendList(id: string) {
    if(!FriendListFileHandle.friends) return
    for (
      let key = 0;
      key < FriendListFileHandle.friends.userInfo.length;
      key++
    ) {
      let friend = FriendListFileHandle.friends.userInfo[key]
      if (id === friend.id) {
        FriendListFileHandle.friends.userInfo.splice(key, 1)
        FriendListFileHandle.friends['rev'] += 1
        let friendsStr = JSON.stringify(FriendListFileHandle.friends)
        await FriendListFileHandle.saveHelper(friendsStr)
        break
      }
    }
  }

  static findFromFriendList(id: string) {
    let bFound
    if (FriendListFileHandle.friends) {
      for (
        let key = 0;
        key < FriendListFileHandle.friends.userInfo.length;
        key++
      ) {
        let friend = FriendListFileHandle.friends.userInfo[key]
        if (id === friend.id) {
          bFound = friend
          break
        }
      }
    }

    return bFound
  }

  //判断是否是好友，以后可能会改变判断逻辑
  static isFriend(id: string) {
    let isFriend = FriendListFileHandle.getIsFriend(id)
    if (isFriend === 1) {
      return true
    }
    return false
  }

  static getFriend(id: string) {
    if (FriendListFileHandle.friends) {
      for (
        let key = 0;
        key < FriendListFileHandle.friends.userInfo.length;
        key++
      ) {
        if (FriendListFileHandle.friends.userInfo[key].id === id) {
          return FriendListFileHandle.friends.userInfo[key]
        }
      }
    }
    return undefined
  }

  /**
   * @param {*} id
   * @return:
   * undefiend: 没在好友列表
   * 0：被对方删除好友关系
   * 1：互相是好友关系
   * 2: 已添加好友，等待对方同意
   */
  static getIsFriend(id: string) {
    if (FriendListFileHandle.friends) {
      for (
        let key = 0;
        key < FriendListFileHandle.friends.userInfo.length;
        key++
      ) {
        if (FriendListFileHandle.friends.userInfo[key].id === id) {
          return FriendListFileHandle.friends.userInfo[key].info.isFriend
        }
      }
    }
    return undefined
  }

  static findFromGroupList(id: string) {
    let bFound
    if (FriendListFileHandle.friends) {
      for (
        let key = 0;
        key < FriendListFileHandle.friends.groupInfo.length;
        key++
      ) {
        let friend = FriendListFileHandle.friends.groupInfo[key]
        if (id === friend.id) {
          bFound = friend
          break
        }
      }
    }
    return bFound
  }

  static getGroup(id: string) {
    if (FriendListFileHandle.friends) {
      for (
        let key = 0;
        key < FriendListFileHandle.friends.groupInfo.length;
        key++
      ) {
        if (FriendListFileHandle.friends.groupInfo[key].id === id) {
          return FriendListFileHandle.friends.groupInfo[key]
        }
      }
    }
    return undefined
  }

  static getGroupMember(groupId: string, userId: string) {
    let group = FriendListFileHandle.getGroup(groupId)
    if(!group) return undefined
    for (let key = 0; key < group.members.length; key++) {
      if (group.members[key].id === userId) {
        return group.members[key]
      }
    }
    return undefined
  }

  static readGroupMemberList(groupId: string) {
    let members = JSON.stringify(FriendListFileHandle.getGroup(groupId)?.members || [])
    return JSON.parse(members)
  }

  static isInGroup(groupId: string, userId: string) {
    let group = FriendListFileHandle.getGroup(groupId)
    if (group) {
      for (let key = 0; key < group.members.length; key++) {
        if (group.members[key].id === userId) {
          return true
        }
      }
    }
    return false
  }

  // 添加群
  static async addToGroupList(obj: Group) {
    let bFound = FriendListFileHandle.findFromGroupList(obj.id)

    if (!bFound) {
      if (!FriendListFileHandle.friends) {
        FriendListFileHandle.friends = {
          rev: 1,
          user: FriendListFileHandle.user.userName,
          userInfo: [],
          groupInfo: [],
        }
      } else {
        FriendListFileHandle.friends['rev'] += 1
      }
      FriendListFileHandle.friends.groupInfo.push(obj)
      let friendsStr = JSON.stringify(FriendListFileHandle.friends)
      await FriendListFileHandle.saveHelper(friendsStr)
    }
  }
  // 删除群
  static async delFromGroupList(id: string, callback: () => void) {
    if(!FriendListFileHandle.friends) return
    for (
      let key = 0;
      key < FriendListFileHandle.friends.groupInfo.length;
      key++
    ) {
      let friend = FriendListFileHandle.friends.groupInfo[key]
      if (id === friend.id) {
        FriendListFileHandle.friends.groupInfo.splice(key, 1)
        FriendListFileHandle.friends['rev'] += 1
        let friendsStr = JSON.stringify(FriendListFileHandle.friends)
        await FriendListFileHandle.saveHelper(friendsStr)
        break
      }
    }
    callback && callback()
  }
  //更改群名
  static async modifyGroupList(id: string, name: string) {
    if(!FriendListFileHandle.friends) return
    for (
      let key = 0;
      key < FriendListFileHandle.friends.groupInfo.length;
      key++
    ) {
      let friend = FriendListFileHandle.friends.groupInfo[key]
      if (id === friend.id) {
        if (name !== '') {
          friend.groupName = name
          FriendListFileHandle.friends['rev'] += 1
          let friendsStr = JSON.stringify(FriendListFileHandle.friends)
          await FriendListFileHandle.saveHelper(friendsStr)
        }
        break
      }
    }
  }

  static async addGroupMember(groupId: string, members: {id: string, name: string}[]) {
    if(!FriendListFileHandle.friends) return
    let group = FriendListFileHandle.getGroup(groupId)
    if (group) {
      for (let key = 0; key < members.length; key++) {
        if (!FriendListFileHandle.isInGroup(groupId, members[key].id)) {
          group.members.push(members[key])
        }
      }
      FriendListFileHandle.friends['rev'] += 1
      let friendsStr = JSON.stringify(FriendListFileHandle.friends)
      await FriendListFileHandle.saveHelper(friendsStr)
    }
  }

  static async removeGroupMember(groupId: string, members: {id: string, name: string}[]) {
    if(!FriendListFileHandle.friends) return
    let group = FriendListFileHandle.getGroup(groupId)
    if (group) {
      for (let member = 0; member < members.length; member++) {
        for (let key = 0; key < group.members.length; key++) {
          if (group.members[key].id === members[member].id) {
            group.members.splice(key, 1)
            break
          }
        }
      }
      FriendListFileHandle.friends['rev'] += 1
      let friendsStr = JSON.stringify(FriendListFileHandle.friends)
      await FriendListFileHandle.saveHelper(friendsStr)
    }
  }

  /**
   * IPortal管理员是否公开用户列表
   * @returns
   */
  static async isAdminOpenFriends() {
    try {
      const isIPortalUser = UserType.isIPortalUser(FriendListFileHandle.user)
      if(!isIPortalUser) return ''
      const keywords = 'adminInfo.zip'
      let JSOnlineService = OnlineServicesUtils.getService(isIPortalUser ? 'iportal' : 'online')
      let data = await JSOnlineService?.getPublicDataByTypes(['WORKSPACE'], {
        keywords,
      })
      let dataId = ''
      for (const item of data.content) {
        if (item.fileName === keywords) {
          dataId = item.id
          break
        }
      }
      return dataId || ''
    } catch (error) {
      return ''
    }
  }

  /**
   * 获取IPortal管理员信息
   * @param dataId IPortal管理员信息文件ID
   * @returns
   */
  static async getAdminInfo(dataId: string) {
    try {
      // FriendListFileHandle.adminInfoFile = userPath + '/adminInfo'
      const isIPortalUser = UserType.isIPortalUser(FriendListFileHandle.user)
      if(!isIPortalUser) return ''
      let JSOnlineService = OnlineServicesUtils.getService(isIPortalUser ? 'iportal' : 'online')
      const result = await JSOnlineService.downloadFile(
        `${JSOnlineService.serverUrl}/mycontent/datas/${dataId}/download`,
        FriendListFileHandle.adminInfoFile,
      )
      if (result === true || typeof result === 'object' && result.jobId) {
        let value = await RNFS.readFile(
          FriendListFileHandle.adminInfoFile,
        )
        const data = await FileTools.decoder(value)
        FriendListFileHandle.adminInfo = JSON.parse(data)
        await RNFS.unlink(FriendListFileHandle.adminInfoFile)
        return value
      } else {
        FriendListFileHandle.adminInfo = {
          userName: '',
          password: '',
        }
        return ''
      }
    } catch (error) {
      return ''
    }
  }

  /**
   * 上传IPortal管理者信息
   */
  static async uploadAdminInfo() {
    try {
      if (FriendListFileHandle.adminInfoUploading) return
      const dataId = await FriendListFileHandle.isAdminOpenFriends()
      // 只有IPortal管理者可以上传
      if (UserType.isIPortalUser(FriendListFileHandle.user) && FriendListFileHandle.user.roles?.indexOf('ADMIN') >= 0) {
        FriendListFileHandle.adminInfoUploading = true
        let UploadFileName = 'adminInfo.zip'

        if (await FileTools.fileIsExist(FriendListFileHandle.adminInfoFile)) {
          await RNFS.unlink(FriendListFileHandle.adminInfoFile)
        }
        const data = await FileTools.encode(JSON.stringify({
          userName: FriendListFileHandle.user.userName,
          password: FriendListFileHandle.user.password,
        }))
        await RNFS.writeFile(FriendListFileHandle.adminInfoFile, data)

        const servicesUtils = OnlineServicesUtils.getService()
        if (dataId) {
          servicesUtils.updateFileWithCheckCapacity(
            dataId,
            FriendListFileHandle.adminInfoFile,
            UploadFileName,
            'WORKSPACE',
          ).then(id => {
            servicesUtils.setDatasShareConfig(id, true)
            FriendListFileHandle.adminInfoUploading = false
            RNFS.unlink(FriendListFileHandle.adminInfoFile)
          })
        } else {
          servicesUtils.uploadFileWithCheckCapacity(
            FriendListFileHandle.adminInfoFile,
            UploadFileName,
            'WORKSPACE',
          ).then(id => {
            servicesUtils.setDatasShareConfig(id, true)
            FriendListFileHandle.adminInfoUploading = false
            RNFS.unlink(FriendListFileHandle.adminInfoFile)
          })
        }
      }
    } catch (error) {
      FriendListFileHandle.adminInfoUploading = false
      await RNFS.unlink(FriendListFileHandle.adminInfoFile)
    }
  }

  static async deleteAdminInfo() {
    try {
      if (!UserType.isIPortalUser(FriendListFileHandle.user) || FriendListFileHandle.user.roles?.indexOf('ADMIN') < 0) return
      const dataId = await FriendListFileHandle.isAdminOpenFriends()
      await SIPortalService.deleteMyData(dataId + '')
    } catch (error) {
      // eslint-disable-next-line no-console
      __DEV__ && console.warn('删除失败')
    }
  }
}
