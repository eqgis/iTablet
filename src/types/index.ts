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
  /** 邮箱地址，用户可修改 */
  email: string,
  /** 电话号码，用户可修改 */
  phoneNumber: number,
  /** 密码 */
  password?: string,
  /** 用户类型，详见UserType */
  userType: string,
  /** iportal用户所使用的服务器地址 */
  serverUrl: string,
  /** @deprecated 同userName */
  userId: string,
  /** @deprecated 是否为邮箱登录 */
  isEmail: string,
}