import { request } from './index'
// import {cheerio as ch }from 'cheerio'
import cheerio from 'react-native-cheerio'
import { SOnlineService, SIPortalService ,SMap} from 'imobile_for_reactnative'
import { Platform } from 'react-native'
import axios from 'axios'
// eslint-disable-next-line import/default
import CookieManager from 'react-native-cookies'
import RNFS from 'react-native-fs'
import { UserType } from '../constants'
import { OnlineRouteAnalyzeParam, POISearchResultOnline, RouteAnalyzeResult } from 'imobile_for_reactnative/types/interface/ar'
import RNFetchBlob from 'rn-fetch-blob'
import { TLoginUserType } from '../constants/UserType'
import { UserInfo } from '../types'

/** 上传回调 */
interface UploadCallBack {
  /** 开始回调 */
  onBegin?: (res: unknown) => void,
  /** 进度回调 */
  onProgress?: (res: number) => void,
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
  userType: TLoginUserType
}

interface ILoginResult {
  userInfo?: UserInfo,
  errorInfo: string,
}

interface UserProfile {
  nickName: string
  userName: string
}

interface OnlineUserInfo {
  userId: string,
  nickname: string,
  phoneNumber: string,
  email: string | null
}

/** online / iportal 上的数据类型 */
export interface OnlineDataType {
  AUDIO: 'AUDIO',                       //音频文件 
  COLOR: 'COLOR',                       //Color 颜色 
  COLORSCHEME: 'COLORSCHEME',           //ColorScheme 颜色方案 
  CSV: 'CSV',                           //csv数据 
  EXCEL: 'EXCEL',                       //excel数据 
  FILLSYMBOL: 'FILLSYMBOL',             //FillSymbol 填充符号库 
  GEOJSON: 'GEOJSON',                   //geojson数据。 
  HDFS: 'HDFS',
  IMAGE: 'IMAGE',                       //图片类型 
  JSON: 'JSON',                         //json数据，可以是普通json串。 
  LAYERTEMPLATE: 'LAYERTEMPLATE',       //LayerTemplate 图层模板 
  LAYOUTTEMPLATE: 'LAYOUTTEMPLATE',     //LayoutTemplate 布局模板 
  LINESYMBOL: 'LINESYMBOL',             //LineSymbol 线符号库 
  MAPTEMPLATE: 'MAPTEMPLATE',           //MapTemplate 地图模板 
  MARKERSYMBOL: 'MARKERSYMBOL',         //MarkerSymbol 点符号库 
  MBTILES: 'MBTILES',                   //mbtiles 
  PHOTOS: 'PHOTOS',                     //照片 
  SHP: 'SHP',                           //shp空间数据 
  SMTILES: 'SMTILES',                   //smtiles 
  SVTILES: 'SVTILES',                   //svtiles 
  THEMETEMPLATE: 'THEMETEMPLATE',       //ThemeTemplate 专题图模板 
  TPK: 'TPK',                           //tpk 
  UDB: 'UDB',                           //udb 数据源 
  UGCV5: 'UGCV5',                       //ugc v5 
  UGCV5_MVT: 'UGCV5_MVT',
  UNKNOWN: 'UNKNOWN',                   //其他类型（普通文件） 
  VIDEO: 'VIDEO',                       //视频文件 
  WORKENVIRONMENT: 'WORKENVIRONMENT',   //WorkEnvironment 工作环境 
  WORKSPACE: 'WORKSPACE',               //工作空间 sxwu, smwu, sxw, smw 
}
export interface SMOnlineData {
  "lastModfiedTime": number,
  "fileName": string,
  "thumbnail": string,
  "dataItemServices": [],
  "dataCheckResult": null,
  "publishInfo": null,
  "authorizeSetting": [],
  "description": null,
  "userName": string,
  "type": keyof OnlineDataType,
  "tags": string[],
  "coordType": null,
  "size": number,
  "createTime": number,
  "serviceStatus": string //"UNPUBLISHED",
  "nickname": string,
  "id": number,
  "serviceId": null,
  "downloadCount": 1,
  "storageId": "51ab7b53_618a_416c_8082_58657a3b59a8",
  "status": "OK",
  "MD5": "DA460531CBE2A023643B36C4F9F7AEF2"
}

/** poi搜索参数 */
export interface POISearchParamOnline {
  /** 搜索关键字，需要检索的POI关键字，如输入多个关键字，请使用空格隔开 */
  keywords: string
  /** POI查询中心点 */
  location: {x: number, y: number}
  /** POI查询半径，单位为米 */
  radius: number
  /**
   * 4326	GPS经纬度
   *
   *  3857	GPS墨卡托
   *
   * 910113	搜狗墨卡托
   *
   * 910102	百度经纬度
   *
   * 910112	百度墨卡托
   *
   * 910101	四维、高德经纬度。 GCJ02是由中国国家测绘局指定的地理信息系统的坐标系统，俗称火星坐标。它是一种对标准经纬度数据的加密算法，即加入了随机的偏差。腾讯、Google Map、高德、四维等图商用的都是此坐标系统。
   *
   * 910111	四维、高德墨卡托
   */
   to?: 4326 | 3857 | 910113 | 910102 | 910112 | 910101 | 910111
}

/** online 在线请求失败结果 */
interface OnlineRequestError {
  error: {code: number, errorMsg: string | null}
  succeed: false
}

type ServiceType = 'iportal' | 'online' | 'OnlineJP'

export default class OnlineServicesUtils {
  /** iportal还是online */
  type: ServiceType
  /** iportal服务器地址或online地址 */
  serverUrl: string
  onlineUrl: string
  /** online 登录地址 */
  ssoURL: string
  /** android only - 登录后的用户凭证 */
  cookie: string

  constructor(type: ServiceType) {
    this.type = type
    this.serverUrl = ''
    this.onlineUrl = ''
    this.ssoURL = ''
    this.cookie = ''
    this.setType(type)
  }

  setType = (type: ServiceType) => {
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
    } else if(type === 'OnlineJP') {
      this.serverUrl = 'https://online.supermap.jp/web'
      this.onlineUrl = 'https://online.suermap.jp'
      this.ssoURL = 'https://sso.supermap.jp'
      this.ssoURL = 'https://sso.supermap.com'
      SOnlineService.getCookie().then((cookie: string )=> {
        this.cookie = cookie
      })
    } else if(type === 'online'){
      this.serverUrl = 'https://www.supermapol.com/web'
      this.onlineUrl = 'https://www.supermapol.com'
      this.ssoURL = 'https://sso.supermap.com'
      SOnlineService.getCookie().then((cookie: string )=> {
        this.cookie = cookie
      })
    }
  }

  _getUserType(): TLoginUserType {
    switch (this.type) {
      case 'online':
        return UserType.COMMON_USER
      case 'iportal':
        return UserType.IPORTAL_COMMON_USER
      case 'OnlineJP': 
      return UserType.COMMON_USER_JP
    }
  }

  /**
   * @param getIOSCookie ios使用 fetch 接口时需设置为 false
   */
  getCookie = async (getIOSCookie = false): Promise<string|undefined> => {
    if(Platform.OS === 'ios' && !getIOSCookie) {
      return undefined
    }

    if (this.cookie) {
      return this.cookie
    }

    let cookie = undefined
    if (this.type === 'iportal') {
      cookie = await SIPortalService.getIPortalCookie()
    } else if (this.type === 'online' || this.type === 'OnlineJP') {
      cookie = await SOnlineService.getCookie()
    }

    this.cookie = cookie || ''
    return cookie
  }

  /** 获取当前登录用户的详细信息 */
  async getLoginUserInfo(): Promise<CommonUserInfo|false> {
    try {
      let url = this.serverUrl + '/mycontent/account.json'
      
      let headers = {}
      let cookie = await this.getCookie(true)
      if (cookie) {
        headers = {
          cookie: cookie,
        }
      }

      url = encodeURI(url)
      const response = RNFetchBlob.config({trusty:true}).fetch('GET', url, headers)
      let result = await Promise.race([response, timeout(10)])
      if (result === 'timeout') {
        return false
      }

      if (result.respInfo.status === 200) {
        let info = await result.json()

        return {
          name: info.name,
          nickname: info.nickname,
          email: info.email,
          userType: this._getUserType()
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
  async publishService(id: string, dataType: keyof OnlineDataType, serviceType?: string): Promise<{succeed: boolean, customResult?: string, error?: any}[]> {
    let publishUrl: string = this.serverUrl + `/mycontent/datas/${id}/publishstatus.rjson?serviceType=`
    if (serviceType) {
      publishUrl += serviceType
    } else if(dataType === 'UDB') {
      publishUrl += 'RESTDATA'
    } else if(dataType === 'WORKSPACE') {
      publishUrl += 'RESTMAP,RESTDATA'
    } else {
      return [{ succeed: false }]
    }
    let headers = {}
    let cookie = await this.getCookie()
    if (cookie) {
      headers = {
        cookie: cookie,
      }
    }
    let result = await request(encodeURI(publishUrl), 'PUT', {
      headers: headers,
      body: true,
    })

    let publishResults = []
    if (result.succeed && result.customResult) {
      let dataServiceIds = result.customResult.split(',')
      for (const dataServiceId of dataServiceIds) {
        let publishResultUrl = this.serverUrl + `/mycontent/datas/${id}/publishstatus.rjson?dataServiceId=${dataServiceId}&forPublish=true`
        let publishResult
        let overTime = 0 // 防止发布服务获取结果超时,返回undefined
        while (!publishResult && overTime < 3) {
          publishResult = await request(encodeURI(publishResultUrl), 'GET', {
            headers: headers,
            // body: null,
          })
          overTime++
        }
        if (publishResult) {
          publishResult.customResult = dataServiceId
          publishResults.push(publishResult)
        }
      }

      return publishResults
    } else {
      return result
    }
  }

  /**
   * 根据数据名发布服务
   * @param dataName 数据名
   */
  async publishServiceByName(dataName: string, dataType: keyof OnlineDataType): Promise<{succeed: boolean, customResult?: string, error?: any}[]> {
    let id = await this.getDataIdByName(dataName)
    if (id) {
      return await this.publishService(id, dataType)
    } else {
      return []
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
    url = encodeURI(url)
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

    url = encodeURI(url)
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
    url = encodeURI(url)
    // let response = await RNFetchBlob.config({trusty:true}).fetch('PUT', url, headers, 
    // JSON.stringify({
    //   ids: [id],
    //   entities: entities,
    // }))
    // let result = await response.json()
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
    try {
      let url = this.serverUrl + `/mycontent/datas/sharesetting.rjson`
      let headers = {}
      let cookie = await this.getCookie(true)
      if (cookie) {
        headers = {
          cookie: cookie,
          Accept: 'application/json',
          'Content-Type': 'application/json',
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
      url = encodeURI(url)
      let response = await RNFetchBlob.config({trusty:true}).fetch('PUT', url, headers, 
      JSON.stringify({
        ids: [id],
        entities: entities,
      }))
      let result = await response.json()
      // let result = await request(url, 'PUT', {
      //   headers: headers,
      //   body: {
      //     ids: [id],
      //     entities: entities,
      //   },
      // })
      return result.succeed
    } catch(e) {
      return false
    }
  }

  /** 获取云存储空间，上传前先检查下空间是否足够 */
  async getMyDataCapacity(): Promise<{usedCapacity: number, maxCapacity: number} | undefined> {
    try {
      const url = this.serverUrl + '/mycontent/datas/capacity.json'

      let headers = {}
      const cookie = await this.getCookie(true)
      if (cookie) {
        headers = {
          cookie: cookie,
        }
      }

      const response = RNFetchBlob.config({trusty : true}).fetch('GET', url, headers)

      const result = await Promise.race([response, timeout(10)])
      if (result === 'timeout') {
        return
      }

      if (result.respInfo.status === 200) {
        const info: {usedCapacity: number, maxCapacity: number}  = await result.json()

        return info
      } else {
        return
      }
    } catch(e){
      return
    }
  }

  /**
   * 上传文件前检查空间是否足够
   */
  async uploadFileWithCheckCapacity(filePath: string, fileName: string, fileType: keyof OnlineDataType, callback?: UploadCallBack, info?: {isCapacityEnough: boolean}) {
    const capacity = await this.getMyDataCapacity()
    if(capacity) {
      const stat = await RNFetchBlob.fs.stat(filePath)
      const isEnough = parseInt(stat.size) + capacity.usedCapacity < capacity.maxCapacity
      info && (info.isCapacityEnough = isEnough)
      if(!isEnough) {
        return false
      }
    }

    return await this.uploadFile(filePath, fileName, fileType, callback)

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
        url = encodeURI(url)
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
   * 下载文件
   * @param url
   * @param toPath
   * @param callback
   * @returns 
   */
  async downloadFile(url: string, toPath: string, callback?: UploadCallBack): Promise<RNFS.DownloadResult | boolean>{
    try {
      url = encodeURI(url)
      const downloadOptions: RNFS.DownloadFileOptions = {
        ...Platform.select({
          android: {
            headers: {
              cookie: await this.getCookie() || '',
            },
          },
        }),
        fromUrl: url,
        toFile: toPath || '',
        background: true,
        ...callback,
      }
  
      const result = RNFS.downloadFile(downloadOptions).promise
      return result
    } catch (e) {
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
      let cookie = await this.getCookie(true)
      if (cookie) {
        headers = {
          cookie: cookie,
        }
      }
      url = encodeURI(url)
      let response = await RNFetchBlob.config({trusty:true}).fetch('POST', url, headers, 
      JSON.stringify({
        fileName: fileName,
        type: fileType,
      }))
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
  async getPublicDataByName(userName: string, fileName: string): Promise<SMOnlineData|false> {
    let url =
      this.serverUrl + `/datas.rjson?userName=${userName}&fileName=${fileName}`

    url = encodeURI(url)
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

    url = encodeURI(url)
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
   * 注销
   * @param userName 用户昵称
   * @param password 用户密码
   */
   async cancellation(userName: string, password: string): Promise<string> {
     try {
       let url =
        //  'https://sso.supermap.com/account/manager/manager.do?manager=accountInfo'
         'https://sso.supermap.com/login?service=https%3A%2F%2Fsso.supermap.com%2Faccount%2Fmanager%2Fmanager.do%3Fmanager%3DaccountInfo'

       await CookieManager.clearAll()
       //请求登陆页面
       let response = await axios.get(encodeURI(url))
       let $ = cheerio.load(response.data)

       let cookie
       if (response.headers['set-cookie']) {
         cookie = response.headers['set-cookie'][0]
         cookie = cookie.substr(0, cookie.indexOf(';'))
       }
       let paramObj = {
         loginType: '',
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
       await SOnlineService.loginWithParam(encodeURI(url), cookie, paramStr)
       this.cookie = await SOnlineService.getCookie()
       SMap.setCookie(this.cookie)

       return this.cookie
     } catch (e) {
      // console.warn(e)
       return 'false'
     }

   }

  /**
   * 登录online
   * @param userName 用户昵称
   * @param password 用户密码
   */
   async login(userName: string, password: string): Promise<ILoginResult> {
    await CookieManager.clearAll()

    if(this.type === 'online') {
      await SOnlineService.setOnlineServiceSite('DEFAULT')
    } else if(this.type === 'OnlineJP') {
      await  SOnlineService.setOnlineServiceSite('JP')
    }

    const res = await Promise.race([SOnlineService.login(userName, password), timeout(40)])
    const result: ILoginResult = {
      userInfo: undefined,
      errorInfo: ''
    }

    if(typeof res === 'string') {
      result.errorInfo = res
    } else if(res) {
      this.cookie = await SOnlineService.getCookie()
      const myInfo = await this.getLoginUserInfo()
      if(myInfo) {
        result.userInfo = {
          userName: myInfo.name,
          password: password,
          nickname: myInfo.nickname,
          email: myInfo.email,
          userType: this._getUserType(),
        }
      } else {
        result.errorInfo = '获取信息失败'
      }
    } else {
      result.errorInfo = '登录失败'
    }
    return result
  }

   /**
   * 将对象转换为网址参数格式的字符串
   * @param obj
   */
    _obj2params(obj: any): string {
      let result = ''
      let item
      for (item in obj) {
        if(typeof obj[item] === 'object') {
          result += '&' + item + '=' + encodeURIComponent(JSON.stringify(obj[item]))
        } else {
          result += '&' + item + '=' + encodeURIComponent(obj[item])
        }
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
      // let url = 'https://www.supermapol.com/web/mycontent/cloud/account'
      let url = 'https://www.supermapol.com/web/config/userprofile.json'
      let cookie = await this.getCookie()
      let headers = {}
      if (cookie) {
        headers = {
          cookie: cookie,
        }
      }
      url = encodeURI(url)
      let response = fetch(url, {
        headers: headers,
      })
      let result = await Promise.race([response, timeout(10)])
      if (result === 'timeout') {
        return username
      }

      let text = await result.text()
      // let page = cheerio.load(text)
      // username = page('div[class="col-xs-8 userInfo"]').children().first().attr('title')
      const resultObj = JSON.parse(text)
      if (resultObj?.nickName != undefined) {
        username = resultObj.nickName
      }
    } catch(e) { /** */}
    return username
  }

  /**
   * 获取online用户信息，未登陆时获取nickname和id
   * 登陆后还可获取相应账号的phone和email
   * @param userName nickname或email
   * @param isEmail 通过手机号查找已被禁止，请设置为true
   */
  getUserInfo = async (userName: string, isEmail = true): Promise<OnlineUserInfo|false> => {
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
      let cookie = await this.getCookie(true)
      if (cookie) {
        headers = {
          cookie: cookie,
        }
      }

      url = encodeURI(url)
      const response = RNFetchBlob.config({trusty:true}).fetch('GET', url, headers)
      let result = await Promise.race([response, timeout(10)])
      if (result === 'timeout') {
        return false
      }

      if (result.respInfo.status === 200) {
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
      url = encodeURI(url)
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
      url = encodeURI(url)
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
        url = encodeURI(url)
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

  // online 公共服务api

  /** poi 在线搜索 */
  searchPoi = async (params: POISearchParamOnline): Promise<POISearchResultOnline | null> => {
    try {
      let url = 'https://www.supermapol.com/iserver/services/localsearch/rest/searchdatas/China/poiinfos.json?'
      url +=  this._obj2params(params) + '&key=fvV2osxwuZWlY0wJb8FEb2i5'

      const response = await fetch(url)
      if(response.status === 200) {
        const result: OnlineRequestError | POISearchResultOnline = await response.json()
        if('error' in result) {
          // AppLog.error(result)
          return null
        } else {
          return result
        }
      }
      return null
    } catch (e) {
      // AppLog.error(e)
      return null
    }
  }

  /** 在线路径分析 */
  routeAnalyze = async (params: OnlineRouteAnalyzeParam): Promise<RouteAnalyzeResult | null> => {
    try {
      let url = 'https://www.supermapol.com/iserver/services/navigation/rest/navigationanalyst/China/pathanalystresults.json?'
      url +=  this._obj2params({pathAnalystParameters: [params]}) + '&key=fvV2osxwuZWlY0wJb8FEb2i5'

      const response = await fetch(url)
      if(response.status === 200) {
        const result: OnlineRequestError | RouteAnalyzeResult[] = await response.json()
        if('error' in result) {
          // AppLog.error(result)
          return null
        } else if(result.length > 0) {
          return result[0]
        } else {
          return null
        }
      }
      return null
    } catch (e) {
      // AppLog.error(e)
      return null
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

let _OnlineServicesUtils: OnlineServicesUtils | null

function setServiceType(type: ServiceType) {
  if (_OnlineServicesUtils) {
    _OnlineServicesUtils.setType(type)
  } else {
    if (type) {
      _OnlineServicesUtils = new OnlineServicesUtils(type)
    } else {
      _OnlineServicesUtils = new OnlineServicesUtils('online')
    }
  }
}

function getService(type?: ServiceType) {
  if (!_OnlineServicesUtils || type && _OnlineServicesUtils.type !== type) {
    _OnlineServicesUtils = null
    if (type) {
      _OnlineServicesUtils = new OnlineServicesUtils(type)
    } else {
      _OnlineServicesUtils = new OnlineServicesUtils('online')
    }
  }
  return _OnlineServicesUtils
}

export {
  setServiceType,
  getService,
}
