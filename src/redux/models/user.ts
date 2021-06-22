import { fromJS } from 'immutable'
import { handleActions } from 'redux-actions'
import { OnlineServicesUtils, Toast } from '../../utils'
import { ConstPath, UserType } from '../../constants'
import { FileTools } from '../../native'
import { ConfigUtils, AppInfo, SOnlineService, SIPortalService } from 'imobile_for_reactnative'
// Constants
// --------------------------------------------------
export const USER_SET = 'USER_SET'
export const USERS_SET = 'USERS_SET'
export const USER_DELETE = 'USER_DELETE'

const JSOnlineService = new OnlineServicesUtils('online')

/** 用户信息参数 */
export interface UserInfoParams {
  /**
   * 用户名，用户注册后不可改变
   * iportal为注册时使用的字符串
   * online为系统分配的数字的字符串，即id
   */
  userName: string,
  /** 昵称，用户可修改 */
  nickname?: string,
  /** 邮箱地址，用户可修改 */
  email?: string,
  /** 电话号码，用户可修改 */
  phoneNumber?: number,
  /** 密码 */
  password?: string,
  /** 用户类型，详见UserType */
  userType: string,
  /** iportal用户所使用的服务器地址 */
  serverUrl?: string,
  /** @deprecated 同userName */
  userId?: string,
  /** @deprecated 是否为邮箱登录 */
  isEmail?: string,
}
/** 用户信息 */
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

export interface Users {
  currentUser: UserInfo,
  users: Array<UserInfo>,
}


// Actions
// ---------------------------------.3-----------------
export const setUser = (params: UserInfoParams, cb = () => {}) => async (dispatch: (arg0: { type: string; payload: {} }) => any) => {
  GLOBAL.currentUser = params
  await dispatch({
    type: USER_SET,
    payload: params,
  })
  cb && cb()
}

export const setUsers = (params: UserInfoParams[], cb = () => {}) => async (dispatch: (arg0: { type: string; payload: {} }) => any) => {
  GLOBAL.currentUser = params[0]
  await dispatch({
    type: USERS_SET,
    payload: params,
  })
  cb && cb()
}

export const deleteUser = (params: UserInfoParams, cb = () => {}) => async (dispatch: (arg0: { type: string; payload: {} }) => any) => {
  await dispatch({
    type: USER_DELETE,
    payload: params,
  })
  cb && cb()
}

// 初始用户化文件目录
async function initUserDirectories(userName: string) {
  try {
    let paths = Object.keys(ConstPath.RelativePath)
    let isCreate = true,
      absolutePath = ''
    for (let path of paths) {
      let _path =
        ConstPath.UserPath + userName + '/' + ConstPath.RelativePath[path]
      absolutePath = await FileTools.appendingHomeDirectory(_path)
      let exist = await FileTools.fileIsExistInHomeDirectory(_path)
      let fileCreated =
        exist || (await FileTools.createDirectory(absolutePath))
      isCreate = fileCreated && isCreate
    }
    if (isCreate) {
      let result = await FileTools.initUserDefaultData(userName)
      !result && Toast.show('初始化用户数据失败')
    } else {
      Toast.show('创建用户目录失败')
    }
  } catch (e) {
    Toast.show('创建用户目录失败')
  }
}

let isLogging = false
/**
 * Online登录
 * @param userName
 * @param password
 * @param type
 * @returns
 */
export const loginOnline = (
  userName: string,
  password: string,
  type: 'EMAIL_TYPE' | 'PHONE_TYPE',
) => async (dispatch: (arg0: { type: string; payload: {} }) => any) => {
  try {
    if (isLogging) return false
    isLogging = true
    let loginResult: boolean | string = await JSOnlineService.login(
      userName,
      password,
      type,
    )
    if (loginResult === true) {
      if (type === 'EMAIL_TYPE') {
        loginResult = await SOnlineService.login(userName, password)
      } else {
        loginResult = await SOnlineService.loginWithPhoneNumber(
          userName,
          password,
        )
      }
    }
    isLogging = false

    if (loginResult) {
      const userInfo = await JSOnlineService.getUserInfo(userName, type === 'EMAIL_TYPE')
      if (typeof userInfo === 'object') {
        await dispatch({
          type: USER_SET,
          payload: {
            userName: userInfo.userId,
            password: password,
            nickname: userInfo.nickname,
            email: userInfo.email,
            phoneNumber: userInfo.phoneNumber,
            userId: userInfo.userId,
            isEmail: type === 'EMAIL_TYPE',
            userType: UserType.COMMON_USER,
          },
        })
      }
    }
    return loginResult
  } catch (error) {
    isLogging = false
    return false
  }
}

/**
 * iPortal登录
 * @param url
 * @param userName
 * @param password
 * @param remember
 * @returns
 */
export const loginIPortal = (
  url: string,
  userName: string,
  password: string,
  remember: boolean,
) => async (dispatch: (arg0: { type: string; payload: {} }) => any) => {
  try {
    if (isLogging) return false
    isLogging = true
    let loginResult = await SIPortalService.login(url, userName, password, remember)
    if (loginResult === true) {
      let info = await SIPortalService.getMyAccount()
      if (info) {
        let userInfo = JSON.parse(info)
        await initUserDirectories(userInfo.name)
        await dispatch({
          type: USER_SET,
          payload: {
            serverUrl: url,
            userName: userInfo.name,
            password: password,
            nickname: userInfo.nickname,
            email: userInfo.email,
            userType: UserType.IPORTAL_COMMON_USER,
          },
        })
      }
    }
    isLogging = false
    return loginResult
  } catch (error) {
    isLogging = false
    return false
  }
}

const initialState = fromJS({
  currentUser: {},
  users: [],
})

export default handleActions(
  {
    [`${USER_SET}`]: (state: { toJS: () => { users: any }; setIn: (arg0: string[], arg1: any) => { (): any; new(): any; setIn: { (arg0: string[], arg1: any): any; new(): any } } }, { payload }: any) => {
      const { users } = state.toJS()
      for (let i = 0; i < users.length; i++) {
        //判断类型后有id判断id，没有id判断userName
        if (users[i].userType === payload.userType &&
            ((users[i].userId !== undefined &&  payload.userId !== undefined && users[i].userId === payload.userId) ||
              users[i].userName === payload.userName)) {
          users[i] = payload
          users.splice(i, 1)
          break
        }
      }
      if (payload.userName) {
        users.unshift(payload)
      }
      ConfigUtils.recordUsers(users)
      AppInfo.setUserName(payload.userName)
      return state
        .setIn(['currentUser'], fromJS(payload))
        .setIn(['users'], fromJS(users))
    },
    [`${USERS_SET}`]: (state: { setIn: (arg0: string[], arg1: any) => any }, { payload }: any) => {
      if (payload.length > 0) {
        state = state.setIn(['currentUser'], fromJS(payload[0]))
        AppInfo.setUserName(payload[0].userName)
      }
      return state.setIn(['users'], fromJS(payload))
    },
    [`${USER_DELETE}`]: (state: { toJS: () => { users: any }; setIn: (arg0: string[], arg1: any) => any }, { payload }: any) => {
      const { users } = state.toJS()
      for (let i = 0; i < users.length; i++) {
       //判断类型后有id判断id，没有id判断userName
       if (users[i].userType === payload.userType &&
        ((users[i].userId !== undefined &&  payload.userId !== undefined && users[i].userId === payload.userId) ||
          users[i].userName === payload.userName))  {
          users.splice(i, 1)
          break
        }
      }
      ConfigUtils.recordUsers(users)
      return state.setIn(['users'], fromJS(users))
    },
    // [REHYDRATE]: (state, { payload }) => {
    //   const _data = ModelUtils.checkModel(state, payload && payload.user)
    //   // return payload && payload.user ? fromJS(payload.user) : state
    //   return _data
    // },
  },
  initialState,
)
