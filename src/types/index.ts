import UserType, { TUserType } from "../constants/UserType"

export type ButtonSize = 'large' | 'normal' | 'small'

export interface BaseItem {
  key: string,
  title?: string,
  action?: (data?: any) => any,
  size?: ButtonSize,
  image: any,
}

export interface ListItem extends BaseItem {
  subTitle?: string,
  data?: any,
}

export type ToolbarBottomButton = {
  type: string,
  image: any,
  action: (data?: any) => any,
} | string

export interface UserInfo {
  /**
   * 用户名，用户注册后不可改变
   * iportal为注册时使用的字符串
   * online为系统分配的数字的字符串，即id
   */
  userName: string,
   /** 昵称，用户可修改 */
  nickname: string,
  email: string,
  phoneNumber?: number,
  password: string,
  userType: TUserType,
  /** iportal用户所使用的服务器地址 */
  serverUrl?: string,
}