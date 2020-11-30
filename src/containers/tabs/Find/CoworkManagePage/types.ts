
import { GroupCheckStatus, GroupRole } from 'imobile_for_reactnative'

export interface Message {
  id: string,
  type: string | number,
  user: {
    name: string,
    id: string,
  },
  group: {
    groupName: string,
    groupID: string,
    groupCreator: string,
  },
  time: number,
}

export interface ResourceType {
  permissionType: string | null,
  resourceId: number | string,
  thumbnail: string,
  linkPage: string | null,
  groupResourceType: string | null,
  proxiedUrl: string | null,
  groupId: number | string,
  description: string | null,
  resourceName: string,
  updateTime: number | string,
  serviceRootUrlId: number | string | null,
  sourceSubtype: string,
  /** 
   * [ '用户数据' ],
   */
  tags: Array<string>
  visitCount: number,
  sourceType: string | null,
  createTime: number | string,
  /**
   * DOWNLOAD
   */
  dataPermissionType: string,
  nickname: string,
  resourceCreator: number,
  mapInfos: any,
}

export interface TaskMessageType extends Message {
  message: ResourceType,
}

export interface GroupMessageType extends Message {
  message: {
    applyTime: number,
    applicant: string | number,
    type: string | number,
    checkStatus: string | GroupCheckStatus,
  },
}

export interface Person {
  groupId: string,
  groupRole: string | GroupRole,
  id: number,
  joinTime: string,
  memberDescription: string | null,
  nickname: string,
  roleUpdateTime: string | null,
  userName: string,
}

export interface GroupApplyMessageType {
  checkUser: any
  checkUserNick: any
  groupName: string
  checkStatus: string
  applicantNick: string
  checkTime: string | number
  groupId: number
  applyReason: string
  checkInfo: any
  id: number
  applyTime: string | number
  applicant: string
}