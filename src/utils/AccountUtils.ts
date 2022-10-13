/**
 * 账号工具类
 */
import { UserType } from "@/constants"
import { UserInfo } from "@/types"
import { SIPortalService, SOnlineService } from "imobile_for_reactnative"

/**
 * 用户登录
 * @param user
 * @returns
 */
async function login(user: UserInfo) {
  try {
    let result = false
    if (!user.nickname || !user.password) return false
    if (UserType.isOnlineUser(user)) {
      const nickname = user.nickname
      const password = user.password
      const userType = user.userType
      if (userType === UserType.COMMON_USER) {
        await SOnlineService.setOnlineServiceSite('DEFAULT')
      } else {
        await SOnlineService.setOnlineServiceSite('JP')
      }
      result = !!await SOnlineService.login(nickname, password)
    } else if (UserType.isIPortalUser(user) && user.serverUrl) {
      const url = user.serverUrl
      const userName = user.userName
      const password = user.password
      result = await SIPortalService.login(url, userName, password, true)
    }
    return result
  } catch (e) {
    __DEV__ && console.warn(e)
  }
}

export default {
  login,
}