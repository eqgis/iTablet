import { NetInfo } from 'react-native'
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
  cb = () => {},
) {
  const newData = []
  try {
    let strDataList
    if (UserType.isOnlineUser(currentUser)) {
      strDataList = await SOnlineService.getDataList(currentPage, pageSize)
    } else if (UserType.isIPortalUser(currentUser)) {
      strDataList = await SIPortalService.getMyDatas(currentPage, pageSize)
    }
    const objDataList = JSON.parse(strDataList)
    if (objDataList.content) {
      // 过滤friendlist
      for (let i = objDataList.content.length - 1; i > -1; i--) {
        if (objDataList.content[i].fileName.indexOf('friend.list') !== -1 || objDataList.content[i].fileName.indexOf('cowork.list') !== -1) {
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
    }
  } catch (e) {
    const result = await NetInfo.getConnectionInfo()
    if (result.type === 'unknown' || result.type === 'none') {
      Toast.show(getLanguage(GLOBAL.language).Prompt.NETWORK_ERROR)
    } else {
      // Toast.show('登录失效，请重新登录')
    }
  }
  return newData
}

export {
  _getHomePath,
  getOnlineData,
}
