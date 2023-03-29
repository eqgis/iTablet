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
  'android.permission.BLUETOOTH',
  'android.permission.BLUETOOTH_ADMIN',
]
export async function checkAllPermission(): Promise<boolean> {

  if(Platform.OS === "android"){
    const sdkVesion = Platform.Version
    // android 12 的版本api编号 31 32 android 13的版本api编号 33
    if(sdkVesion >= 31) {
        if(permissionList.indexOf('android.permission.BLUETOOTH_CONNECT')==-1){
            permissionList.push('android.permission.BLUETOOTH_CONNECT')
        }
        if(permissionList.indexOf('android.permission.BLUETOOTH_SCAN')==-1){
            permissionList.push('android.permission.BLUETOOTH_SCAN')
        }
    }

    let permission = false
    for (let i = 0; i < permissionList.length; i++) {
      permission = await PermissionsAndroid.check(permissionList[i])
      if (!permission) {
          break
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
    const sdkVesion = Platform.Version
    // android 12 的版本api编号 31 32 android 13的版本api编号 33
    if(sdkVesion >= 31) {
        if(permissionList.indexOf('android.permission.BLUETOOTH_CONNECT')==-1){
            permissionList.push('android.permission.BLUETOOTH_CONNECT')
        }
        if(permissionList.indexOf('android.permission.BLUETOOTH_SCAN')==-1){
            permissionList.push('android.permission.BLUETOOTH_SCAN')
        }
    }
    const results = await PermissionsAndroid.requestMultiple(permissionList)
    let isAllGranted = true
    let key : keyof typeof results
    for (key in results) {
      isAllGranted = results[key] === 'granted' && isAllGranted
      if (!isAllGranted) {
        console.log(key + "+" + results[key])
        break
      }
    }
    //申请 android 11 读写权限
    const permisson11 = await AppUtils.requestStoragePermissionR()
    return isAllGranted&&permisson11
  }
  return true
}