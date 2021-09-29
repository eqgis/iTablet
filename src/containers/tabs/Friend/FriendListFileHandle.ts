/**
 * Created by imobile-xzy on 2019/3/18.
 */

// eslint-disable-next-line
import { Platform } from 'react-native'
import RNFS from 'react-native-fs'
import { SOnlineService } from 'imobile_for_reactnative'
import { FileTools } from '../../../native'
import ConstPath from '../../../constants/ConstPath'
import { OnlineServicesUtils } from '../../../utils'
import { UserType } from '../../../constants'
import { UserInfo } from '../../../types'


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
    isFriend: 0 | 1 | 2
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

  /**
   * 初始化friendlist路径
   * @param {*} user currentUser
   */
  static async init(user: UserInfo) {
    FriendListFileHandle.user = user
    FriendListFileHandle.friends = undefined
    FriendListFileHandle.friendListFile = ''
    FriendListFileHandle.friendListFile_ol = ''

    if (!UserType.isOnlineUser(user)) {
      return
    }

    let userPath = await FileTools.appendingHomeDirectory(
      ConstPath.UserPath + user.userName + '/Data/Temp',
    )

    let friendListFile = userPath + '/friend.list'
    let onlineList = userPath + '/ol_fl'

    FriendListFileHandle.friendListFile = friendListFile
    FriendListFileHandle.friendListFile_ol = onlineList
  }

  /**
   * 初始化后读取本地列表
   * @param {*} user currentUser
   */
  static async initLocalFriendList(user: UserInfo) {
    if (!UserType.isOnlineUser(user)) {
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
    if (!UserType.isOnlineUser(user)) {
      return
    }
    await FriendListFileHandle.init(user)
    //读取本地文件并刷新
    await FriendListFileHandle.getLocalFriendList()
    //同步online文件并刷新
    return await FriendListFileHandle.syncOnlineFriendList()
  }

  /**
   * 读取本地列表，删除online列表
   */
  static async getLocalFriendList() {
    if (FriendListFileHandle.friendListFile !== '') {
      if (await FileTools.fileIsExist(FriendListFileHandle.friendListFile)) {
        let value = await RNFS.readFile(FriendListFileHandle.friendListFile)
        if (isJSON(value) === true) {
          FriendListFileHandle.friends = JSON.parse(value)
        }
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
    let JSOnlineService = new OnlineServicesUtils('online')
    if (
      (await JSOnlineService.getDataIdByName('friend.list.zip')) !== undefined
    ) {
      let promise = new Promise((resolve, reject) => {
        SOnlineService.downloadFileWithCallBack(
          FriendListFileHandle.friendListFile_ol,
          'friend.list',
          {
            onResult: async value => {
              try {
                if (value === true) {
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
            },
          },
        )
      })
      return promise
    } else {
      if (FriendListFileHandle.friends !== undefined) {
        //没有online文件，更新本地到online
        await FriendListFileHandle.upload()
      }
      return true
    }
  }

  /**
   * 直接获取friendlist,friendlist更新完成后调用
   */
  static getFriendList() {
    return FriendListFileHandle.friends
  }

  static checkFriendList() {
    if(!UserType.isOnlineUser(FriendListFileHandle.user)) {
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
    await SOnlineService.deleteData('friend.list')
    let UploadFileName = 'friend.list.zip'
    if (Platform.OS === 'android') {
      UploadFileName = 'friend.list'
    }
    let promise = new Promise(resolve => {
      SOnlineService.uploadFile(
        FriendListFileHandle.friendListFile,
        UploadFileName,
        {
          onResult: () => {
            resolve(true)
            FriendListFileHandle.uploading = false
            FriendListFileHandle.waitUploading = false
          },
        },
      )
    })
    return promise
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
}
