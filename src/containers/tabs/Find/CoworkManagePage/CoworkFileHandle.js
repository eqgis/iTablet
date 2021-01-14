/**
 * Created by imobile-xzy on 2019/3/18.
 */

// eslint-disable-next-line
import { Platform } from 'react-native'
import RNFS from 'react-native-fs'
import { SOnlineService } from 'imobile_for_reactnative'
import { FileTools } from '../../../../native'
import ConstPath from '../../../../constants/ConstPath'
import { OnlineServicesUtils } from '../../../../utils'

function isJSON(str) {
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
export default class CoworkFileHandle {
  static user = undefined
  static friends = undefined
  static refreshCallback = undefined
  static refreshMessageCallback = undefined
  static friendListFile = ''
  static friendListFile_ol = ''
  static uploading = false
  static waitUploading = false

  /**
   * 初始化friendlist路径
   * @param {*} user currentUser
   */
  static async init(user) {
    CoworkFileHandle.user = undefined
    CoworkFileHandle.friends = undefined
    CoworkFileHandle.friendListFile = ''
    CoworkFileHandle.friendListFile_ol = ''

    if (user.userId === undefined) {
      return
    }
    CoworkFileHandle.user = user

    let userPath = await FileTools.appendingHomeDirectory(
      ConstPath.UserPath + user.userName + '/Data/Temp',
    )

    let friendListFile = userPath + '/cowork.list'
    let onlineList = userPath + '/ol_fl'

    CoworkFileHandle.friendListFile = friendListFile
    CoworkFileHandle.friendListFile_ol = onlineList
  }

  /**
   * 初始化后读取本地列表
   * @param {*} user currentUser
   */
  static async initLocalFriendList(user) {
    await CoworkFileHandle.init(user)
    //读取本地文件并刷新
    CoworkFileHandle.getLocalFriendList()
  }

  /**
   * 初始化后读取本地列表，再读取online列表
   * @param {*} user currentUser
   */
  static async initFriendList(user) {
    await CoworkFileHandle.init(user)
    //读取本地文件并刷新
    await CoworkFileHandle.getLocalFriendList()
    //同步online文件并刷新
    return await CoworkFileHandle.syncOnlineFriendList()
  }

  /**
   * 读取本地列表，删除online列表
   */
  static async getLocalFriendList() {
    if (CoworkFileHandle.friendListFile !== '') {
      if (await FileTools.fileIsExist(CoworkFileHandle.friendListFile)) {
        let value = await RNFS.readFile(CoworkFileHandle.friendListFile)
        if (isJSON(value) === true) {
          CoworkFileHandle.friends = JSON.parse(value)
        }
      }

      if (await FileTools.fileIsExist(CoworkFileHandle.friendListFile_ol)) {
        await RNFS.unlink(CoworkFileHandle.friendListFile_ol)
      }
    }

    CoworkFileHandle.checkFriendList()
    CoworkFileHandle.refreshCallback()
    CoworkFileHandle.refreshMessageCallback()
    return CoworkFileHandle.friends
  }

  /**
   * 保持本地和online的文件一致
   */
  static async syncOnlineFriendList() {
    if (CoworkFileHandle.friendListFile_ol === '') {
      return false
    }
    let JSOnlineService = new OnlineServicesUtils('online')
    if (
      (await JSOnlineService.getDataIdByName('cowork.list.zip')) !== undefined
    ) {
      let promise = new Promise((resolve, reject) => {
        SOnlineService.downloadFileWithCallBack(
          CoworkFileHandle.friendListFile_ol,
          'cowork.list',
          {
            onResult: async value => {
              try {
                if (value === true) {
                  let value = await RNFS.readFile(
                    CoworkFileHandle.friendListFile_ol,
                  )
                  let onlineVersion = JSON.parse(value)
                  if (
                    !CoworkFileHandle.friends ||
                    onlineVersion.rev > CoworkFileHandle.friends.rev
                  ) {
                    //没有本地friendlist或online的版本较新，更新本地文件
                    CoworkFileHandle.friends = onlineVersion
                    await RNFS.writeFile(
                      CoworkFileHandle.friendListFile,
                      value,
                    )
                    CoworkFileHandle.checkFriendList()
                    CoworkFileHandle.refreshCallback()
                    CoworkFileHandle.refreshMessageCallback()
                  } else if (
                    onlineVersion.rev < CoworkFileHandle.friends.rev
                  ) {
                    //本地版本较新，将本地文件更新到online
                    await CoworkFileHandle.upload()
                  }
                  await RNFS.unlink(CoworkFileHandle.friendListFile_ol)
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
      if (CoworkFileHandle.friends !== undefined) {
        //没有online文件，更新本地到online
        await CoworkFileHandle.upload()
      }
      return true
    }
  }

  /**
   * 直接获取friendlist,friendlist更新完成后调用
   */
  static getFriendList() {
    return CoworkFileHandle.friends
  }

  static checkFriendList() {
    let fl = CoworkFileHandle.friends
    if (!fl) {
      return
    }

    if (fl.user !== undefined) {
      if (fl.user !== CoworkFileHandle.user.userId) {
        CoworkFileHandle.friends = undefined
        return
      }
    } else {
      fl.user = CoworkFileHandle.user.userId
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
    if (CoworkFileHandle.uploading) {
      if (CoworkFileHandle.waitUploading) {
        return
      }
      CoworkFileHandle.waitUploading = true
      setTimeout(() => {
        CoworkFileHandle.upload()
      }, 3000)
      return
    }
    CoworkFileHandle.uploading = true
    //上传
    await SOnlineService.deleteData('cowork.list')
    let UploadFileName = 'cowork.list.zip'
    if (Platform.OS === 'android') {
      UploadFileName = 'cowork.list'
    }
    let promise = new Promise(resolve => {
      SOnlineService.uploadFile(
        CoworkFileHandle.friendListFile,
        UploadFileName,
        {
          onResult: () => {
            resolve(true)
            CoworkFileHandle.uploading = false
            CoworkFileHandle.waitUploading = false
          },
        },
      )
    })
    return promise
  }

  static async saveHelper(friendsStr, callback) {
    if (await FileTools.fileIsExist(CoworkFileHandle.friendListFile)) {
      await RNFS.unlink(CoworkFileHandle.friendListFile)
    }
    await RNFS.writeFile(CoworkFileHandle.friendListFile, friendsStr)
    if (CoworkFileHandle.refreshCallback) {
      CoworkFileHandle.refreshCallback(true)
    }
    await CoworkFileHandle.upload()
    if (callback) {
      callback(true)
    }
  }

  static async addToFriendList(obj) {
    let bFound = CoworkFileHandle.findFromFriendList(obj.id)

    if (!bFound) {
      if (!CoworkFileHandle.friends) {
        CoworkFileHandle.friends = {}
        CoworkFileHandle.friends['rev'] = 1
        CoworkFileHandle.friends['user'] = CoworkFileHandle.user.userId
        CoworkFileHandle.friends['userInfo'] = []
        CoworkFileHandle.friends['groupInfo'] = []
      } else {
        CoworkFileHandle.friends['rev'] += 1
      }
      CoworkFileHandle.friends.userInfo.push(obj)
      let friendsStr = JSON.stringify(CoworkFileHandle.friends)
      await CoworkFileHandle.saveHelper(friendsStr)
    }
  }

  //管理关系
  static async modifyIsFriend(id, isFriend) {
    for (
      let key = 0;
      key < CoworkFileHandle.friends.userInfo.length;
      key++
    ) {
      let friend = CoworkFileHandle.friends.userInfo[key]
      if (id === friend.id) {
        friend.info.isFriend = isFriend

        CoworkFileHandle.friends['rev'] += 1
        let friendsStr = JSON.stringify(CoworkFileHandle.friends)
        await CoworkFileHandle.saveHelper(friendsStr)
        break
      }
    }
  }

  static async modifyFriendList(id, name) {
    for (
      let key = 0;
      key < CoworkFileHandle.friends.userInfo.length;
      key++
    ) {
      let friend = CoworkFileHandle.friends.userInfo[key]
      if (id === friend.id) {
        if (name !== '') {
          friend.markName = name
        } else {
          friend.markName = friend.name
        }
        break
      }
    }

    CoworkFileHandle.friends['rev'] += 1

    let friendsStr = JSON.stringify(CoworkFileHandle.friends)
    await CoworkFileHandle.saveHelper(friendsStr)
  }

  // eslint-disable-next-line
  static async delFromFriendList(id, callback) {
    for (
      let key = 0;
      key < CoworkFileHandle.friends.userInfo.length;
      key++
    ) {
      let friend = CoworkFileHandle.friends.userInfo[key]
      if (id === friend.id) {
        CoworkFileHandle.friends.userInfo.splice(key, 1)
        break
      }
    }

    CoworkFileHandle.friends['rev'] += 1

    let friendsStr = JSON.stringify(CoworkFileHandle.friends)
    await CoworkFileHandle.saveHelper(friendsStr)
  }

  static findFromFriendList(id) {
    let bFound
    if (CoworkFileHandle.friends) {
      for (
        let key = 0;
        key < CoworkFileHandle.friends.userInfo.length;
        key++
      ) {
        let friend = CoworkFileHandle.friends.userInfo[key]
        if (id === friend.id) {
          bFound = friend
          break
        }
      }
    }

    return bFound
  }

  //判断是否是好友，以后可能会改变判断逻辑
  static isFriend(id) {
    let isFriend = CoworkFileHandle.getIsFriend(id)
    if (isFriend === 1) {
      return true
    }
    return false
  }

  static getFriend(id) {
    if (CoworkFileHandle.friends) {
      for (
        let key = 0;
        key < CoworkFileHandle.friends.userInfo.length;
        key++
      ) {
        if (CoworkFileHandle.friends.userInfo[key].id === id) {
          return CoworkFileHandle.friends.userInfo[key]
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
  static getIsFriend(id) {
    if (CoworkFileHandle.friends) {
      for (
        let key = 0;
        key < CoworkFileHandle.friends.userInfo.length;
        key++
      ) {
        if (CoworkFileHandle.friends.userInfo[key].id === id) {
          return CoworkFileHandle.friends.userInfo[key].info.isFriend
        }
      }
    }
    return undefined
  }

  static findFromGroupList(id) {
    let bFound
    if (CoworkFileHandle.friends) {
      for (
        let key = 0;
        key < CoworkFileHandle.friends.groupInfo.length;
        key++
      ) {
        let friend = CoworkFileHandle.friends.groupInfo[key]
        if (id === friend.id) {
          bFound = friend
          break
        }
      }
    }
    return bFound
  }

  static getGroup(id) {
    if (CoworkFileHandle.friends) {
      for (
        let key = 0;
        key < CoworkFileHandle.friends.groupInfo.length;
        key++
      ) {
        if (CoworkFileHandle.friends.groupInfo[key].id === id) {
          return CoworkFileHandle.friends.groupInfo[key]
        }
      }
    }
    return undefined
  }

  static getGroupMember(groupId, userId) {
    let group = CoworkFileHandle.getGroup(groupId)
    for (let key = 0; key < group.members.length; key++) {
      if (group.members[key].id === userId) {
        return group.members[key]
      }
    }
    return undefined
  }

  static readGroupMemberList(groupId) {
    let members = JSON.stringify(CoworkFileHandle.getGroup(groupId)?.members || [])
    return JSON.parse(members)
  }

  static isInGroup(groupId, userId) {
    let group = CoworkFileHandle.getGroup(groupId)
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
  static async addToGroupList(obj) {
    let bFound = CoworkFileHandle.findFromGroupList(obj.id)

    if (!bFound) {
      if (!CoworkFileHandle.friends) {
        CoworkFileHandle.friends = {}
        CoworkFileHandle.friends['rev'] = 1
        CoworkFileHandle.friends['user'] = CoworkFileHandle.user.userId
        CoworkFileHandle.friends['userInfo'] = []
        CoworkFileHandle.friends['groupInfo'] = []
      } else {
        CoworkFileHandle.friends['rev'] += 1
      }
      CoworkFileHandle.friends.groupInfo.push(obj)
      let friendsStr = JSON.stringify(CoworkFileHandle.friends)
      await CoworkFileHandle.saveHelper(friendsStr)
    }
  }
  // 删除群
  static async delFromGroupList(id, callback) {
    for (
      let key = 0;
      key < CoworkFileHandle.friends.groupInfo.length;
      key++
    ) {
      let friend = CoworkFileHandle.friends.groupInfo[key]
      if (id === friend.id) {
        CoworkFileHandle.friends.groupInfo.splice(key, 1)
        break
      }
    }

    CoworkFileHandle.friends['rev'] += 1

    let friendsStr = JSON.stringify(CoworkFileHandle.friends)
    await CoworkFileHandle.saveHelper(friendsStr)

    callback && callback()
  }
  //更改群名
  static async modifyGroupList(id, name) {
    for (
      let key = 0;
      key < CoworkFileHandle.friends.groupInfo.length;
      key++
    ) {
      let friend = CoworkFileHandle.friends.groupInfo[key]
      if (id === friend.id) {
        if (name !== '') {
          friend.groupName = name
        }
        break
      }
    }

    CoworkFileHandle.friends['rev'] += 1

    let friendsStr = JSON.stringify(CoworkFileHandle.friends)
    await CoworkFileHandle.saveHelper(friendsStr)
  }

  static async addGroupMember(groupId, members) {
    let group = CoworkFileHandle.getGroup(groupId)
    if (group) {
      for (let key = 0; key < members.length; key++) {
        if (!CoworkFileHandle.isInGroup(groupId, members[key].id)) {
          group.members.push(members[key])
        }
      }
      CoworkFileHandle.friends['rev'] += 1
      let friendsStr = JSON.stringify(CoworkFileHandle.friends)
      await CoworkFileHandle.saveHelper(friendsStr)
    }
  }

  static async removeGroupMember(groupId, members) {
    let group = CoworkFileHandle.getGroup(groupId)
    if (group) {
      for (let member = 0; member < members.length; member++) {
        for (let key = 0; key < group.members.length; key++) {
          if (group.members[key].id === members[member].id) {
            group.members.splice(key, 1)
            break
          }
        }
      }
      CoworkFileHandle.friends['rev'] += 1
      let friendsStr = JSON.stringify(CoworkFileHandle.friends)
      await CoworkFileHandle.saveHelper(friendsStr)
    }
  }
}
