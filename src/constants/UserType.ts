/**
 *  游客用户
 *
 */
const PROBATION_USER: 'probation_user' = 'probation_user'
/**
 *  普通用户
 *
 */
const COMMON_USER: 'common_user' = 'common_user'
/**
 *  iPortal用户
 *
 */
const IPORTAL_COMMON_USER: 'iPortal_common_user' = 'iPortal_common_user'
/**
 * online 日本站点用户
 */
const COMMON_USER_JP: 'COMMON_USER_JP' = 'COMMON_USER_JP'

export type TLoginUserType =typeof COMMON_USER | typeof IPORTAL_COMMON_USER | typeof COMMON_USER_JP

export type TUserType = typeof PROBATION_USER | TLoginUserType

function isProbationUser(user: any) {
  if (user === undefined) {
    return false
  }
  if (user.userType === undefined) {
    return false
  }
  const type = user.userType
  if (type === PROBATION_USER) {
    return true
  }
  return false
}

function isOnlineUser(user:any) {
  if (user === undefined) {
    return false
  }
  if (user.userType === undefined) {
    return false
  }
  const type = user.userType
  if (
    type === COMMON_USER ||
    type === COMMON_USER_JP
  ) {
    return true
  }
  return false
}

function isIPortalUser(user:any) {
  if (user === undefined) {
    return false
  }
  if (user.userType === undefined) {
    return false
  }
  const type = user.userType
  if (type === IPORTAL_COMMON_USER) {
    return true
  }
  return false
}

export default {
  PROBATION_USER,
  COMMON_USER,
  COMMON_USER_JP,
  IPORTAL_COMMON_USER,
  isProbationUser,
  isOnlineUser,
  isIPortalUser,
}
