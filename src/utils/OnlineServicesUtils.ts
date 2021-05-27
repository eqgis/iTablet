import { request } from './index'
import cheerio from 'react-native-cheerio'
import { SOnlineService, SIPortalService } from 'imobile_for_reactnative'
import { Platform } from 'react-native'
import axios from 'axios'
// eslint-disable-next-line import/default
import CookieManager from 'react-native-cookies'
import RNFS from 'react-native-fs'
import { UserType } from '../constants'

/** 上传回调 */
interface UploadCallBack {
  /** 开始回调 */
  onBegin?: (res: any) => void
  /** 进度回调 */
  onProgress?: (res: number) => void
}

/** 数据查询参数 */
interface QueryParam {
  orderBy?: string
  orderType?: string
  pageSize?: number
  currentPage?: number
  keywords?: string
}

interface CommonUserInfo {
  nickname: string
  name: string
  email: string
  /** iportal或online用户 */
  userType: string
}

/** online / iportal 上的数据类型 */
export interface OnlineDataType {
  AUDIO: 'AUDIO'                       //音频文件 
  COLOR: 'COLOR'                       //Color 颜色 
  COLORSCHEME: 'COLORSCHEME'           //ColorScheme 颜色方案 
  CSV: 'CSV'                           //csv数据 
  EXCEL: 'EXCEL'                       //excel数据 
  FILLSYMBOL: 'FILLSYMBOL'             //FillSymbol 填充符号库 
  GEOJSON: 'GEOJSON'                   //geojson数据。 
  HDFS: 'HDFS'
  IMAGE: 'IMAGE'                       //图片类型 
  JSON: 'JSON'                         //json数据，可以是普通json串。 
  LAYERTEMPLATE: 'LAYERTEMPLATE'       //LayerTemplate 图层模板 
  LAYOUTTEMPLATE: 'LAYOUTTEMPLATE'     //LayoutTemplate 布局模板 
  LINESYMBOL: 'LINESYMBOL'             //LineSymbol 线符号库 
  MAPTEMPLATE: 'MAPTEMPLATE'           //MapTemplate 地图模板 
  MARKERSYMBOL: 'MARKERSYMBOL'         //MarkerSymbol 点符号库 
  MBTILES: 'MBTILES'                   //mbtiles 
  PHOTOS: 'PHOTOS'                     //照片 
  SHP: 'SHP'                           //shp空间数据 
  SMTILES: 'SMTILES'                   //smtiles 
  SVTILES: 'SVTILES'                   //svtiles 
  THEMETEMPLATE: 'THEMETEMPLATE'       //ThemeTemplate 专题图模板 
  TPK: 'TPK'                           //tpk 
  UDB: 'UDB'                           //udb 数据源 
  UGCV5: 'UGCV5'                       //ugc v5 
  UGCV5_MVT: 'UGCV5_MVT'
  UNKNOWN: 'UNKNOWN'                   //其他类型（普通文件） 
  VIDEO: 'VIDEO'                       //视频文件 
  WORKENVIRONMENT: 'WORKENVIRONMENT'   //WorkEnvironment 工作环境 
  WORKSPACE: 'WORKSPACE'               //工作空间 sxwu, smwu, sxw, smw 
}

export default class OnlineServicesUtils {
  /** iportal还是online */
  type: 'iportal' | 'online'
  /** iportal服务器地址或online地址 */
  serverUrl: string
  /** android only - 登录后的用户凭证 */
  cookie: string

  constructor(type: 'iportal' | 'online') {
    this.type = type
    this.serverUrl = ''
    this.cookie = ''
    if (type === 'iportal') {
      let url = SIPortalService.getIPortalUrl()
      if (url) {
        this.serverUrl = url
        if (url.indexOf('http') !== 0) {
          this.serverUrl = 'http://' + url
        }
        if (Platform.OS === 'android') {
          SIPortalService.getIPortalCookie().then((cookie: string) => {
            this.cookie = cookie
          })
        }
      }
    } else {
      this.serverUrl = 'https://www.supermapol.com/web'
      if (Platform.OS === 'android') {
        SOnlineService.getAndroidSessionID().then((cookie: string )=> {
          this.cookie = cookie
        })
      }
    }
  }

  getCookie = async (): Promise<string|undefined> => {
    if (Platform.OS === 'ios') {
      return undefined
    }
    if (this.cookie) {
      return this.cookie
    }

    let cookie = undefined
    if (this.type === 'iportal') {
      cookie = await SIPortalService.getIPortalCookie()
    } else if (this.type === 'online') {
      cookie = await SOnlineService.getAndroidSessionID()
    }

    this.cookie = cookie
    return cookie
  }

  /** 获取当前登录用户的详细信息 */
  async getLoginUserInfo(): Promise<CommonUserInfo|false> {
    try {
      let url = this.serverUrl + '/mycontent/account.json'
      
      let headers = {}
      let cookie = await this.getCookie()
      if (cookie) {
        headers = {
          cookie: cookie,
        }
      }

      let response = fetch(url, {
        headers: headers,
      })
      let result = await Promise.race([response, timeout(10)])
      if (result === 'timeout') {
        return false
      }

      if (result.status === 200) {
        let info = await result.json()

        return {
          name: info.name,
          nickname: info.nickname,
          email: info.email,
          userType: this.type === 'iportal' ? UserType.IPORTAL_COMMON_USER : UserType.COMMON_USER,
        }
      } else {
        return false
      }
    } catch{
      return false
    }
  }

  /**
   * 根据数据id发布服务
   * @param id 数据id
   * @param dataType 数据的类型
   */
  async publishService(id: string, dataType: keyof OnlineDataType): Promise<boolean> {
    let url: string
    if(dataType === 'UDB') {
      url =
        this.serverUrl +
        `/mycontent/datas/${id}/publishstatus.rjson?serviceType=RESTDATA`
    } else if(dataType === 'WORKSPACE') {
      url =
        this.serverUrl +
        `/mycontent/datas/${id}/publishstatus.rjson?serviceType=RESTMAP,RESTDATA`
    } else {
      return false
    }
    let headers = {}
    let cookie = await this.getCookie()
    if (cookie) {
      headers = {
        cookie: cookie,
      }
    }
    let result = await request(url, 'PUT', {
      headers: headers,
      body: true,
    })
    return result.succeed
  }

  /**
   * 根据数据名发布服务
   * @param dataName 数据名
   */
  async publishServiceByName(dataName: string, dataType: keyof OnlineDataType): Promise<boolean> {
    let id = await this.getDataIdByName(dataName)
    if (id) {
      return await this.publishService(id, dataType)
    } else {
      return false
    }
  }

  /**
   * 根据数据名获取其id
   * @param dataName 数据名
   */
  async getDataIdByName(dataName: string): Promise<string|undefined> {
    let url = this.serverUrl + `/mycontent/datas.rjson?fileName=${dataName}`
    let headers = {}
    let cookie = await this.getCookie()
    if (cookie) {
      headers = {
        cookie: cookie,
      }
    }
    let result = await request(url, 'GET', {
      headers: headers,
    })
    if (result && result.total === 1) {
      return result.content[0].id
    }
    return undefined
  }

  /**
   * 获取服务详情
   * @param id 服务id
   */
  async getService(id: string): Promise<any|boolean> {
    let url = this.serverUrl + `/services.rjson?ids=[${id}]`
    let headers = {}
    let cookie = await this.getCookie()
    if (cookie) {
      headers = {
        cookie: cookie,
      }
    }

    let result = await request(url, 'GET', {
      headers: headers,
    })
    if (result && result.total === 1) {
      return result.content[0]
    }
    return false
  }

  /**
   * 设置服务公开私有
   * @param id 服务id
   * @param isPublic 是否公开
   */
  async setServicesShareConfig(id: string, isPublic:boolean): Promise<boolean> {
    let url = this.serverUrl + `/services/sharesetting.rjson`
    let headers = {}
    let cookie = await this.getCookie()
    if (cookie) {
      headers = {
        cookie: cookie,
      }
    }
    let entities: any[]
    if (isPublic) {
      entities = [
        {
          entityType: 'USER',
          entityName: 'GUEST',
          permissionType: 'READ',
        },
      ]
    } else {
      entities = []
    }
    let result = await request(url, 'PUT', {
      headers: headers,
      body: {
        ids: [id],
        entities: entities,
      },
    })
    return result.succeed
  }

  /**
   * 设置数据公开私有
   * @param id 数据id
   * @param isPublic 是否公开
   */
  async setDatasShareConfig(id: string, isPublic: boolean): Promise<boolean> {
    let url = this.serverUrl + `/mycontent/datas/sharesetting.rjson`
    let headers = {}
    let cookie = await this.getCookie()
    if (cookie) {
      headers = {
        cookie: cookie,
      }
    }
    let entities: any[]
    if (isPublic) {
      entities = [
        {
          entityType: 'USER',
          entityName: 'GUEST',
          dataPermissionType: 'DOWNLOAD',
        },
      ]
    } else {
      entities = []
    }
    let result = await request(url, 'PUT', {
      headers: headers,
      body: {
        ids: [id],
        entities: entities,
      },
    })
    return result.succeed
  }



  /**
   * 上传文件
   * @param filePath 文件路径
   * @param fileName 文件名
   * @param fileType 文件类型
   * @param callback 上传回调
   */
  async uploadFile(filePath: string, fileName: string, fileType: keyof OnlineDataType, callback?: UploadCallBack) {
    try {
      let id = await this._getUploadId(fileName, fileType)
      if (id) {
        let url = this.serverUrl + `/mycontent/datas/${id}/upload.rjson`
        let headers = {}
        let cookie = await this.getCookie()
        if (cookie) {
          headers = {
            cookie: cookie,
          }
        }
        let uploadParams = {
          toUrl: url,
          headers: headers,
          files: [
            {
              name: fileName,
              filename: fileName,
              filepath: filePath,
            },
          ],
          background: true,
          method: 'POST',
          begin: (res: any) => {
            if (callback && typeof callback.onBegin === 'function') {
              callback.onBegin(res)
            }
          },
          progress: (res: any) => {
            try {
              if (callback && typeof callback.onProgress === 'function') {
                let progress = res.totalBytesSent / res.totalBytesExpectedToSend
                callback.onProgress(progress * 100)
              }
            } catch {
              /*** */
            }
          },
        }

        let result = await RNFS.uploadFiles(uploadParams).promise
        let body = JSON.parse(result.body)
        return body.childID
      } else {
        return false
      }
    } catch (error) {
      return false
    }
  }

  /**
   * 根据文件名和类型获取上传id
   * @param fileName 
   * @param fileType 
   */
  async _getUploadId(fileName: string, fileType: keyof OnlineDataType): Promise<string|boolean> {
    try {
      let url = this.serverUrl + `/mycontent/datas.rjson`
      let headers = {}
      let cookie = await this.getCookie()
      if (cookie) {
        headers = {
          cookie: cookie,
        }
      }
      let response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          fileName: fileName,
          type: fileType,
        }),
      })
      let result = await response.json()
      if (result.childID) {
        return result.childID
      } else {
        return false
      }
    } catch (error) {
      return false
    }
  }

  /************************ 公共数据相关（不用登陆） ******************************/

  /**
   * 通过用户id和文件名查询数据
   * @param {*} userName 用户id
   * @param {*} fileName 文件名
   */
  async getPublicDataByName(userName: string, fileName: string): Promise<object|boolean> {
    let url =
      this.serverUrl + `/datas.rjson?userName=${userName}&fileName=${fileName}`

    let response = await fetch(url)
    let responseObj = await response.json()

    if (responseObj && responseObj.total === 1) {
      return responseObj.content[0]
    } else {
      return false
    }
  }


  /**
   * 根据类型查找数据
   * @param {*} types 类型数组
   * @param {*} orderBy
   */
  async getPublicDataByTypes(types: Array<any>, params: QueryParam): Promise<any|boolean> {
    let { orderBy, orderType, pageSize, currentPage, keywords } = { ...params }
    orderBy = orderBy || 'LASTMODIFIEDTIME'
    orderType = orderType || 'DESC'
    pageSize = pageSize || 9
    currentPage = currentPage || 1
    let url
    if (!types || types.length === 0) {
      url = this.serverUrl + `/datas.rjson?`
    } else if (types.length === 1) {
      url = this.serverUrl + `/datas.rjson?type=${types[0]}`
    } else {
      url = this.serverUrl + `/datas.rjson?types=[${types}]`
    }

    url += '&isPublic=true'
    url += `&orderBy=${orderBy}&orderType=${orderType}`
    url += `&pageSize=${pageSize}&currentPage=${currentPage}`
    if (keywords) {
      url += `&keywords=${keywords}`
    }

    let response = await fetch(url)
    let responseObj = await response.json()

    if (responseObj) {
      return responseObj
    } else {
      return false
    }
  }
  /************************ 公共数据相关（不用登陆）end ***************************/

  /************************ online账号相关 ***********************/
  /**
   * 登录online
   * @param userName 用户昵称
   * @param password 用户密码
   * @param loginType 已弃用
   */
  async login(userName: string, password: string, loginType: string): Promise<boolean> {
    if (this.type === 'online') {
      try {
        let url =
          'https://sso.supermap.com/login?service=https://www.supermapol.com/shiro-cas'

        await CookieManager.clearAll()
        //请求登陆页面
        let response = await axios.get(url)
        let $ = cheerio.load(response.data)
        let cookie
        if (response.headers['set-cookie']) {
          cookie = response.headers['set-cookie'][0]
          cookie = cookie.substr(0, cookie.indexOf(';'))
        }

        let paramObj = {
          loginType: loginType,
          username: userName,
          password: password,
          lt: $('input[name=lt]').attr().value,
          execution: $('input[name=execution]').attr().value,
          _eventId: $('input[name=_eventId]').attr().value,
          // submit: '登录',
        }
        let paramStr
        if (Platform.OS === 'android') {
          paramStr = JSON.stringify(paramObj)
        } else {
          paramStr = this._obj2params(paramObj)
        }
        let result = await SOnlineService.loginWithParam(url, cookie, paramStr)
        this.cookie = await SOnlineService.getCookie()

        return result
      } catch (e) {
        return false
      }
    }
    return false
  }

  /**
   * 将对象转换为网址参数格式的字符串
   * @param obj 
   */
  _obj2params(obj: any): string {
    var result = ''
    var item
    for (item in obj) {
      result += '&' + item + '=' + encodeURIComponent(obj[item])
    }

    if (result) {
      result = result.slice(1)
    }

    return result
  }

  /**
   *  登录后获取用户名 online禁止手机号查找用户后需要此接口来获取手机登录用户的用户名，再根据用户名获取其他信息
   */
  getLoginUserName = async (): Promise<string> => {
    let username = ''
    try {
      let url = 'https://www.supermapol.com/web/mycontent/cloud/account'
      let cookie = await this.getCookie()
      let headers = {}
      if (cookie) {
        headers = {
          cookie: cookie,
        }
      }
      let response = fetch(url, {
        headers: headers,
      })
      let result = await Promise.race([response, timeout(10)])
      if (result === 'timeout') {
        return username
      }

      let text = await result.text()
      let page = cheerio.load(text)
      username = page('div[class="col-xs-8 userInfo"]').children().first().attr('title')
    } catch(e) { /** */}
    return username
  }

  /**
   * 获取online用户信息，未登陆时获取nickname和id
   * 登陆后还可获取相应账号的phone和email
   * @param userName nickname或email
   * @param isEmail 通过手机号查找已被禁止，请设置为true
   */
  getUserInfo = async (userName: string, isEmail: boolean): Promise<object|false> => {
    try {
      let url
      //仅支持邮箱，用户名 zhangxt
      isEmail = true
      if (isEmail) {
        url =
          'https://www.supermapol.com/web/users/online.json?nickname=' +
          userName
      } else {
        url =
          'https://www.supermapol.com/web/users/online.json?phoneNumber=' +
          userName
      }
      let headers = {}
      let cookie = await this.getCookie()
      if (cookie) {
        headers = {
          cookie: cookie,
        }
      }

      let response = fetch(url, {
        headers: headers,
      })
      let result = await Promise.race([response, timeout(10)])
      if (result === 'timeout') {
        return false
      }

      if (result.status === 200) {
        let info = await result.json()

        return {
          userId: info.name,
          nickname: info.nickname,
          phoneNumber: info.phoneNumber,
          email:
            (info.email && info.email.indexOf('@isupermap.com')) === -1
              ? info.email
              : null,
        }
      } else {
        return false
      }
    } catch (e) {
      return false
    }
  }

  /** cheerio加载的注册页面 */
  registerPage: any
  /** 注册页面cookie */
  registerCookie: string | undefined

  /** 加载注册页面 */
  loadPhoneRegisterPage = async (): Promise<void> => {
    try {
      let url =
        'https://sso.supermap.com/phoneregister?service=http://www.supermapol.com'
      await CookieManager.clearAll()
      let response = await axios.get(url)
      let registerPage = cheerio.load(response.data)
      let cookie
      if (Platform.OS === 'android' && response.headers['set-cookie']) {
        cookie = response.headers['set-cookie'][0]
        cookie = cookie.substr(0, cookie.indexOf(';'))
      }
      this.registerPage = registerPage
      this.registerCookie = cookie
    } catch (e) {
      return
    }
  }

  /**
   * 发送验证码
   * @param phoneNumber 手机号
   * @param area 国家区号
   */
  sendSMSVerifyCode = async (phoneNumber: string, area: string): Promise<string|boolean> => {
    try {
      let url =
        'https://sso.supermap.com/phoneregister?service=http://www.supermapol.com'
      let paramObj = {
        phoneNumber: phoneNumber,
        telArea: area,
        execution: this.registerPage('input[name=execution]').attr().value,
        _eventId_send: this.registerPage('input[name=_eventId_send]').attr()
          .value,
      }
      let paramStr = this._obj2params(paramObj)
      let headers: any
      headers = {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      }
      if (this.registerCookie) {
        headers.Cookie = this.registerCookie
      }
      let registerResponse = await fetch(url, {
        method: 'POST',
        headers,
        body: paramStr,
      })
      let responsedata = await registerResponse.text()
      let page = cheerio.load(responsedata)
      this.registerPage = page
      try {
        return page('.sso_tip_block').text()
      } catch (e) {
        return true
      }
    } catch (e) {
      return false
    }
  }

  /**
   * 注册online账号
   * @param type 已废弃
   * @param param 注册参数
   */
  register = async (type: string, param: any): Promise<string|boolean> => {
    try {
      let url
      // if (type === 'phone') {
        url =
          'https://sso.supermap.com/phoneregister?service=http://www.supermapol.com'
        let paramObj = {
          nickname: param.nickname,
          // realName: param.realName,
          // company: param.company,
          // email: param.email,
          password: param.password,
          confirmpassword: param.confirmpassword,
          phoneNumber: param.phoneNumber,
          telArea: param.telArea,
          SMSVerifyCode: param.SMSVerifyCode,
          execution: this.registerPage('input[name=execution]').attr().value,
          _eventId_register: this.registerPage(
            'input[name=_eventId_register]',
          ).attr().value,
        }
        let paramStr = this._obj2params(paramObj)
        let AcceptLanguage
        if (GLOBAL.language === 'CN') {
          AcceptLanguage = 'zh-CN,zh;q=0.9,ja;q=0.8,en;q=0.7'
        } else {
          AcceptLanguage = 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7'
        }
        let headers: any
        headers = {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'Accept-Language': AcceptLanguage,
        }
        if (this.registerCookie) {
          headers.Cookie = this.registerCookie
        }
        let registerResponse = await fetch(url, {
          method: 'POST',
          headers,
          body: paramStr,
        })
        let responsedata = await registerResponse.text()
        let page = cheerio.load(responsedata)
        this.registerPage = page
        try {
          let errorText = page('.sso_tip_block').text()
          if (errorText !== '') {
            return errorText
          } else {
            return true
          }
        } catch (e) {
          return true
        }
      // }
    } catch (e) {
      return false
    }
  }
}

/**
 * 超时返回‘timeout’
 * @param sec 超时秒数
 */
function timeout(sec: number): Promise<'timeout'> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('timeout')
    }, 1000 * sec)
  })
}
