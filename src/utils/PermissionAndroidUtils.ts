import {
  PermissionsAndroid,
  Permission,
  NativeModules,
  Platform,
} from 'react-native'

const AppUtils = NativeModules.AppUtils

export const permissionList: Array<Permission> = [
  'android.permission.READ_PHONE_STATE',
  'android.permission.ACCESS_FINE_LOCATION',
  'android.permission.READ_EXTERNAL_STORAGE',
  'android.permission.WRITE_EXTERNAL_STORAGE',
  'android.permission.CAMERA',
  'android.permission.RECORD_AUDIO',
  'android.permission.BLUETOOTH_CONNECT',
  'android.permission.BLUETOOTH_SCAN',
  'android.permission.BLUETOOTH_ADVERTISE'

]
export async function checkAllPermission(): Promise<boolean> {

  if(Platform.OS === "android"){
    let permission = false
    for (let i = 0; i < permissionList.length; i++) {
      permission = await PermissionsAndroid.check(permissionList[i])
      if (!permission) {
        console.log(permissionList[i])
      }
    }
    //  申请 android 11 读写权限
    const permisson11 = await AppUtils.checkStoragePermissionR()

    return permission && permisson11
  }
  return true
}

export async function requestAllPermission(): Promise<boolean> {

  if(Platform.OS === "android"){
    const results = await PermissionsAndroid.requestMultiple(permissionList)
    let isAllGranted = true
    let key : keyof typeof results
    for (key in results) {
      isAllGranted = results[key] === 'granted' && isAllGranted
    }
    //申请 android 11 读写权限
    const permisson11 = await AppUtils.requestStoragePermissionR()
    return isAllGranted&&permisson11
  }
  return true
}