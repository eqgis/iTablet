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

function isJSON(str: any) {
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
  static user: any = undefined
  static cowork: any = undefined
  static refreshCallback: (params?: any) => void
  static refreshMessageCallback: () => void
  static coworkListFile: string = ''
  static coworkListFile_ol: string = ''
  static uploading: boolean = false
  static waitUploading: boolean = false

  /**
   * 初始化coworklist路径
   * @param {*} user currentUser
   */
  static async init(user: any) {
    CoworkFileHandle.user = undefined
    CoworkFileHandle.cowork = undefined
    CoworkFileHandle.coworkListFile = ''
    CoworkFileHandle.coworkListFile_ol = ''

    if (user.userId === undefined) {
      return
    }
    CoworkFileHandle.user = user

    let userPath = await FileTools.appendingHomeDirectory(
      ConstPath.UserPath + user.userName + '/Data/Temp',
    )

    let coworkListFile = userPath + '/cowork.list'
    let onlineList = userPath + '/ol_cl'

    CoworkFileHandle.coworkListFile = coworkListFile
    CoworkFileHandle.coworkListFile_ol = onlineList
  }

  /**
   * 初始化后读取本地列表
   * @param {*} user currentUser
   */
  static async initLocalCoworkList(user: any) {
    await CoworkFileHandle.init(user)
    //读取本地文件并刷新
    CoworkFileHandle.getLocalCoworkList()
  }

  /**
   * 初始化后读取本地列表，再读取online列表
   * @param {*} user currentUser
   */
  static async initCoworkList(user: any) {
    await CoworkFileHandle.init(user)
    //读取本地文件并刷新
    await CoworkFileHandle.getLocalCoworkList()
    //同步online文件并刷新
    return await CoworkFileHandle.syncOnlineCoworkList()
  }

  /**
   * 读取本地列表，删除online列表
   */
  static async getLocalCoworkList() {
    if (CoworkFileHandle.coworkListFile !== '') {
      if (await FileTools.fileIsExist(CoworkFileHandle.coworkListFile)) {
        let value = await RNFS.readFile(CoworkFileHandle.coworkListFile)
        if (isJSON(value) === true) {
          CoworkFileHandle.cowork = JSON.parse(value)
        }
      }

      if (await FileTools.fileIsExist(CoworkFileHandle.coworkListFile_ol)) {
        await RNFS.unlink(CoworkFileHandle.coworkListFile_ol)
      }
    }

    // CoworkFileHandle.checkCoworkList()
    CoworkFileHandle.refreshCallback && CoworkFileHandle.refreshCallback()
    CoworkFileHandle.refreshMessageCallback && CoworkFileHandle.refreshMessageCallback()
    return CoworkFileHandle.cowork
  }

  /**
   * 保持本地和online的文件一致
   */
  static async syncOnlineCoworkList() {
    if (CoworkFileHandle.coworkListFile_ol === '') {
      return false
    }
    let JSOnlineService = new OnlineServicesUtils('online')
    if (
      (await JSOnlineService.getDataIdByName('cowork.list.zip')) !== undefined
    ) {
      let promise = new Promise((resolve, reject) => {
        SOnlineService.downloadFileWithCallBack(
          CoworkFileHandle.coworkListFile_ol,
          'cowork.list',
          {
            onResult: async value => {
              try {
                if (value === true) {
                  let value = await RNFS.readFile(
                    CoworkFileHandle.coworkListFile_ol,
                  )
                  let onlineVersion = JSON.parse(value)
                  if (
                    !CoworkFileHandle.cowork ||
                    onlineVersion.rev > CoworkFileHandle.cowork.rev
                  ) {
                    //没有本地coworklist或online的版本较新，更新本地文件
                    CoworkFileHandle.cowork = onlineVersion
                    await RNFS.writeFile(
                      CoworkFileHandle.coworkListFile,
                      value,
                    )
                    // CoworkFileHandle.checkCoworkList()
                    CoworkFileHandle.refreshCallback && CoworkFileHandle.refreshCallback()
                    CoworkFileHandle.refreshMessageCallback && CoworkFileHandle.refreshMessageCallback()
                  } else if (
                    onlineVersion.rev < CoworkFileHandle.cowork.rev
                  ) {
                    //本地版本较新，将本地文件更新到online
                    await CoworkFileHandle.upload()
                  }
                  await RNFS.unlink(CoworkFileHandle.coworkListFile_ol)
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
      if (CoworkFileHandle.cowork !== undefined) {
        //没有online文件，更新本地到online
        await CoworkFileHandle.upload()
      }
      return true
    }
  }

  /**
   * 直接获取cowork，更新完成后调用
   */
  static getCowork() {
    return CoworkFileHandle.cowork
  }

  static checkCoworkList() {
    // let fl = CoworkFileHandle.cowork
    // if (!fl) {
    //   return
    // }

    // if (fl.user !== undefined) {
    //   if (fl.user !== CoworkFileHandle.user.userId) {
    //     CoworkFileHandle.cowork = undefined
    //     return
    //   }
    // } else {
    //   fl.user = CoworkFileHandle.user.userId
    // }

    // if (fl.rev === undefined || typeof fl.rev !== 'number') {
    //   fl.rev = 0
    // }

    // if (fl.groups === undefined) {
    //   fl.groups = []
    // }

    // if (fl.groups.length !== 0) {
    //   for (let group = fl.groups.length - 1; group > -1; group--) {
    //     if (
    //       fl.groups[group].id === undefined ||
    //       fl.groups[group].id === ''
    //     ) {
    //       fl.groups.splice(group, 1)
    //       continue
    //     }
    //     if (
    //       fl.groups[group].groupName === undefined ||
    //       fl.groups[group].groupName === ''
    //     ) {
    //       fl.groups.splice(group, 1)
    //       continue
    //     }
    //     if (
    //       fl.groups[group].masterID === undefined ||
    //       fl.groups[group].masterID === ''
    //     ) {
    //       fl.groups.splice(group, 1)
    //       continue
    //     }
    //     if (fl.groups[group].members === undefined) {
    //       fl.groups.splice(group, 1)
    //       continue
    //     } else {
    //       let userErr = false
    //       for (
    //         let user = 0;
    //         user < fl.groups[group].members.length;
    //         user++
    //       ) {
    //         if (
    //           fl.groups[group].members[user].id === undefined ||
    //           fl.groups[group].members[user].id === ''
    //         ) {
    //           userErr = true
    //           break
    //         }
    //         if (
    //           fl.groups[group].members[user].name === undefined ||
    //           fl.groups[group].members[user].name === ''
    //         ) {
    //           userErr = true
    //           break
    //         }
    //       }
    //       if (userErr) {
    //         fl.groups.splice(group, 1)
    //         continue
    //       }
    //     }
    //   }
    // }
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
        CoworkFileHandle.coworkListFile,
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

  static async saveHelper(coworksStr: string, callback?: (params: any) => any) {
    if (await FileTools.fileIsExist(CoworkFileHandle.coworkListFile)) {
      await RNFS.unlink(CoworkFileHandle.coworkListFile)
    }
    await RNFS.writeFile(CoworkFileHandle.coworkListFile, coworksStr)
    if (CoworkFileHandle.refreshCallback) {
      CoworkFileHandle.refreshCallback(true)
    }
    await CoworkFileHandle.upload()
    if (callback) {
      callback(true)
    }
  }

  /**
   * 获取指定任务群组
   * @param groupId 群组ID
   * @param taskId  任务群组ID
   */
  static getTaskGroup(groupId: string | number, taskId: string) {
    if (CoworkFileHandle?.cowork?.groups) {
      let tasks = CoworkFileHandle.cowork.groups[groupId + '']?.tasks || []
      for (let key = 0; key < tasks.length; key++) {
        if (tasks[key].id === taskId) {
          return tasks[key]
        }
      }
    }
    return undefined
  }

  /**
   * 获取任务群组中指定成员
   * @param groupId 群组ID
   * @param taskId  任务群组ID
   * @param userId  用户ID
   */
  static getTaskGroupMember(groupId: string|number, taskId: string, userId: string) {
    if (taskId === undefined || groupId === undefined || userId === undefined) return []
    let group = CoworkFileHandle.getTaskGroup(groupId, taskId)
    for (let key = 0; key < group.members.length; key++) {
      if (group.members[key].id === userId) {
        return group.members[key]
      }
    }
    return undefined
  }

  /**
   * 获取任务群组中所有成员
   * @param groupId 群组ID
   * @param taskId  任务群组ID
   */
  static getTaskGroupMembers(groupId: string|number, taskId: string) {
    let members = JSON.stringify(CoworkFileHandle.getTaskGroup(groupId, taskId)?.members || [])
    return JSON.parse(members) || []
  }

  /**
   * 查找成员是否在任务群组中
   * @param groupId 群组ID
   * @param taskId  任务群组ID
   * @param userId  用户ID
   */
  static isInTaskGroup(groupId: string|number, taskId: string, userId: string) {
    let group = CoworkFileHandle.getTaskGroup(groupId, taskId)
    if (group) {
      for (let key = 0; key < group.members.length; key++) {
        if (group.members[key].id === userId) {
          return true
        }
      }
    }
    return false
  }

  /**
   * 获取当前Online群组中的任务
   * @param groupId Online群组ID
   */
  static getTaskGroups(groupId: string | number) {
    return CoworkFileHandle.cowork.groups[groupId + ''].tasks
  }

  /**
   * 添加任务群
   * @param group Online群组
   * @param task  任务群组
   */
  static async addTaskGroup(group: {
    id: number,
    groupName: string,
  }, task: any) {
    let taskGroup = CoworkFileHandle.getTaskGroup(group.id, task.id)

    if (!taskGroup) {
      if (!CoworkFileHandle.cowork) {
        CoworkFileHandle.cowork = {
          rev: 1,
          groups: {
            [group.id + '']: {
              ...group,
              tasks: [],
            },
          },
        }
      } else {
        CoworkFileHandle.cowork['rev'] += 1
      }
      if (!CoworkFileHandle.cowork.groups) {
        CoworkFileHandle.cowork.groups = {}
      }
      if (!CoworkFileHandle.cowork.groups[group.id + '']) {
        CoworkFileHandle.cowork.groups[group.id + ''] = {
          ...group,
          tasks: [],
        }
      }
      CoworkFileHandle.cowork.groups[group.id + ''].tasks.push(task)
      let coworkStr = JSON.stringify(CoworkFileHandle.cowork)
      await CoworkFileHandle.saveHelper(coworkStr)
    }
  }

  /**
   * 修改任务群
   * @param group Online群组
   * @param task  任务群组
   */
  static async setTaskGroup(groupID: string, task: any) {
    let tasks = CoworkFileHandle.cowork.groups[groupID + ''].tasks
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].id === task.id) {
        tasks[i] = task

        let coworkStr = JSON.stringify(CoworkFileHandle.cowork)
        await CoworkFileHandle.saveHelper(coworkStr)
        break
      }
    }
  }

  /**
   * 删除任务群
   * @param groupId  Online群组
   * @param taskId   任务群组
   * @param callback 回调函数
   */
  static async delTaskGroup(groupId: string|number, taskId: string, callback?: () => void) {
    let group = CoworkFileHandle.cowork.groups[groupId + '']
    if (CoworkFileHandle.cowork && group) {
      for (let key = 0; key < group.tasks.length; key++) {
        if (group.tasks[key].id === taskId) {
          group.tasks.splice(key, 1)
          break
        }
      }
    }

    CoworkFileHandle.cowork['rev'] += 1

    let coworksStr = JSON.stringify(CoworkFileHandle.cowork)
    await CoworkFileHandle.saveHelper(coworksStr)

    callback && callback()
  }

  /**
   * 更改任务群名
   * @param groupId Online群组
   * @param taskId  任务群组
   * @param name    新任务群组名
   */
  static async modifyTaskGroup(groupId: string|number, taskId: string, name: string) {
    let taskGroup = CoworkFileHandle.getTaskGroup(groupId, taskId)
    taskGroup.name = name

    CoworkFileHandle.cowork['rev'] += 1

    let coworksStr = JSON.stringify(CoworkFileHandle.cowork)
    await CoworkFileHandle.saveHelper(coworksStr)
  }

  /**
   * 添加任务群组的成员
   * @param groupId Online群组
   * @param taskId  任务群组
   * @param members 成员
   */
  static async addTaskGroupMember(groupId: string | number, taskId: string, members: Array<{id: string, name: string}>) {
    let taskGroup = CoworkFileHandle.getTaskGroup(groupId, taskId)
    let _members = taskGroup.members.concat()
    if (taskGroup) {
      for (let key = 0; key < members.length; key++) {
        if (!CoworkFileHandle.isInTaskGroup(groupId, taskId, members[key].id)) {
          _members.push(members[key])
        }
      }
      taskGroup.members = _members
      CoworkFileHandle.cowork['rev'] += 1
      let coworksStr = JSON.stringify(CoworkFileHandle.cowork)
      await CoworkFileHandle.saveHelper(coworksStr)
    }
  }

  /**
   * 移除任务群组中的成员
   * @param groupId
   * @param taskId
   * @param members
   */
  static async removeTaskGroupMember(groupId: string | number, taskId: string, members: Array<{id: string, name: string}>) {
    let taskGroup = CoworkFileHandle.getTaskGroup(groupId, taskId)
    if (taskGroup) {
      for (let member = 0; member < members.length; member++) {
        for (let key = 0; key < taskGroup.members.length; key++) {
          if (taskGroup.members[key].id === members[member].id) {
            taskGroup.members.splice(key, 1)
            break
          }
        }
      }
      CoworkFileHandle.cowork['rev'] += 1
      let coworksStr = JSON.stringify(CoworkFileHandle.cowork)
      await CoworkFileHandle.saveHelper(coworksStr)
    }
  }
}
