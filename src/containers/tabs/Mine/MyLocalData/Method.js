import NetInfo from "@react-native-community/netinfo"
import {
  SOnlineService,
  SIPortalService,
} from 'imobile_for_reactnative'
import { UserType } from '../../../../constants'
import { FileTools } from '../../../../native'
import Toast from '../../../../utils/Toast'
import { getLanguage } from '../../../../language'


async function _getHomePath() {
  return await FileTools.appendingHomeDirectory()
}
async function getOnlineData(
  currentUser,
  currentPage,
  pageSize,
  types = [],
  cb = () => {},
) {
  const newData = []
  let objDataList = {
    content: [],
    total: 0,
  }
  try {
    if (UserType.isOnlineUser(currentUser)) {
      objDataList = await SOnlineService.getMyContentData({currentPage, pageSize, types, orderType: 'DESC', orderBy: 'CREATETIME'})
    } else if (UserType.isIPortalUser(currentUser)) {
      objDataList = await SIPortalService.getMyContentData({currentPage, pageSize, types, orderType: 'DESC', orderBy: 'CREATETIME'})
    }
    // const objDataList = JSON.parse(strDataList)
    if (objDataList.content) {
      // 过滤friendlist
      for (let i = objDataList.content.length - 1; i > -1; i--) {
        // if (objDataList.content[i].fileName.indexOf('friend.list') !== -1 || objDataList.content[i].fileName.indexOf('cowork.list') !== -1) {
        let fileName = objDataList.content[i].fileName
        // 过滤后缀为.list | (n).list | .list(n)
        if (fileName.lastIndexOf('.list') !== -1) {
          objDataList.content.splice(i, 1)
          objDataList.total -= 1
        }
      }
    }
    if (objDataList.content && objDataList.content.length > 0) {
      cb && cb(objDataList.total)
      const arrDataContent = objDataList.content
      const contentLength = arrDataContent.length
      for (let i = 0; i < contentLength; i++) {
        const objContent = arrDataContent[i]
        objContent.id += ''
        newData.push(objContent)
      }
      objDataList.content = newData
    }
  } catch (e) {
    // const result = await NetInfo.getConnectionInfo()
    // if (result.type === 'unknown' || result.type === 'none') {
    const result = true//await NetInfo.fetch()
    if (result.type === 'unknown' || result.type === 'none') {
      Toast.show(getLanguage(global.language).Prompt.NETWORK_ERROR)
    } else {
      // Toast.show('登录失效，请重新登录')
    }
    objDataList = {
      content: [],
      total: 0,
    }
  }
  return objDataList
}

export {
  _getHomePath,
  getOnlineData,
}
