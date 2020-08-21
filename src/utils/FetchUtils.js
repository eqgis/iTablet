import Toast from './Toast'
import { getLanguage } from '../language'

export default class FetchUtils {
  /*
   *获取url的json串对象
   */
  static getObjJson = (url, timeout) => {
    try {
      if (!timeout) {
        return new Promise((resolve, reject) => {
          fetch(url, {})
            .then(response => response.json())
            .then(result => {
              resolve(result)
            })
            .catch(error => reject(error))
        })
      } else {
        const request = new Promise((resolve, reject) => {
          fetch(url)
            .then(response => response.json())
            .then(result => {
              resolve(result)
            })
            .catch(error => reject(error))
        })
        const timeoutRequest = new Promise((resolve, reject) => {
          setTimeout(reject, timeout, 'Request time out')
        })
        return Promise.race([request, timeoutRequest]).then(
          res => {
            return res
          },
          () => ({}),
        )
      }
    } catch (e) {
      return {}
    }
  }

  /**
   * 获取用户数据的下载详情
   * @param downloadData   查询数据结果
   * @param keywords       获取数据结果的关键字  String | Array
   * @param type
   * @returns {Promise.<{}>}
   */
  static getDataInfoByUrl = async (downloadData = {}, keywords, type) => {
    let resultData = {}
    let arr = []
    try {
      let time = new Date().getTime()
      let _keywords = ''
      if (keywords instanceof Array) {
        keywords.forEach((item, index) => {
          _keywords += '\"' + item + '\"' + (index < keywords.length ? ',' : '')
        })
      } else {
        _keywords = keywords
      }
      let uri = downloadData.checkUrl // 查询数据结果url
        ? downloadData.checkUrl + _keywords
        : `https://www.supermapol.com/web/datas.json?currentPage=1&keywords=[${_keywords}]&filterFields=%5B%22FILENAME%22%5D&orderBy=LASTMODIFIEDTIME&orderType=DESC&t=${time}`
      resultData = await FetchUtils.getObjJson(uri)
      let arrContent = resultData.content
      for (let i = 0; i < arrContent.length; i++) {
        // let fileName = keyword + type
        if (
          (downloadData.nickname === arrContent[i].nickname || !downloadData.nickname) &&
          // fileName === arrContent[i].fileName &&
          (type && arrContent[i].fileName.lastIndexOf(type) >= 0 || !type)
        ) {
          arrContent[i].url =
            downloadData.downloadUrl ||
            `https://www.supermapol.com/web/datas/${arrContent[i].id}/download`
          // break
          arr.push(arrContent[i])
        }
      }
      resultData.content = arr
    } catch (e) {
      Toast.show(getLanguage(global.language).Prompt.NETWORK_ERROR)
    }
    return resultData
  }

  /** 获取用户数据的下载url*/
  static getFindUserDataUrl = async (nickname, keyword, type) => {
    let url
    try {
      let obj = await FetchUtils.getDataInfoByUrl({ nickname }, keyword, type)
      url = obj && obj.url
    } catch (e) {
      Toast.show(getLanguage(global.language).Prompt.NETWORK_ERROR)
    }
    return url
  }

  /****** 在线路径分析 *******/
  static routeAnalyst = async (startX, startY, endX, endY) => {
    let data
    try {
      let params = `{startPoint:{"x":${startX},"y":${startY}},endPoint:{"x":${endX},"y":${endY}},routeType:MINLENGTH,to:910111}`
      let url = `http://www.supermapol.com/iserver/services/navigation/rest/navigationanalyst/China/pathanalystresults.json?pathAnalystParameters=[${params}]&key=fvV2osxwuZWlY0wJb8FEb2i5`
      data = await FetchUtils.getObjJson(url)
    } catch (e) {
      Toast.show(getLanguage(global.language).Prompt.NETWORK_ERROR)
    }
    return data
  }

  /****** 逆地理编码 *******/
  static getPointName = async (x, y) => {
    let data
    try {
      let url = `http://www.supermapol.com/iserver/services/location-china/rest/locationanalyst/China/geodecoding.json?location={"x":${x},"y":${y}}&key=fvV2osxwuZWlY0wJb8FEb2i5`
      let rel = await FetchUtils.getObjJson(url, 2000)
      if (rel.formatedAddress) {
        data = rel.formatedAddress
      }
    } catch (e) {
      Toast.show(getLanguage(global.language).Prompt.NETWORK_ERROR)
    }
    return data
  }
}
