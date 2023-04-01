import { UserType } from '../../src/constants'
import { SOnlineService, SIPortalService } from 'imobile_for_reactnative'
import { ConstOnline } from '../../src/constants'

interface CurrentUserObjType {
  userId: string,
  nickname: string,
  isEmail: boolean,
  userType: string,
  userName: string,
  password: string,
}
interface DSParamsType {
  alias: string,
  engineType: number,
  server: string,
  layerIndex?: number,
}

interface BaseMapsType {
  layerIndex: number,
  layerName?: string,
  mapName: string,
  type: string,
  DSParams: DSParamsType,
  index?: number,
  userAdd?: boolean,
  nodeleteBT?: boolean,
}

interface SearchParameterType {
  orderType: string,
  isDataItemService: any,
  keywords: any,
  shareToMe: any,
  orderBy: string,
  pageSize: number,
  dirIds: any,
  isBatch: any,
  filterFields: any,
  departmentIds: any,
  accessMode: any,
  offline: any,
  checkStatus: any,
  enable: any,
  createEnd: number,
  groupIds: any,
  authorizedOnly: boolean,
  resourceIds: any,
  permissionType: any,
  types: any,
  visitEnd: number,
  returnSubDir: any,
  searchScope: any,
  isNotInDir: any,
  visitStart: number,
  createStart: number,
  tags: any,
  currentUser: any,
  userNames: Array<string>,
  ids: any,
  currentPage: number,
}

interface MapInfosType {
  mapTitle: string,
  mapUrl: string,
  id: any,
  serviceId: number,
  mapThumbnail: string,
}

interface AuthorizeSettingType {
  permissionType: string,
  aliasName: string,
  entityRoles: Array<any>,
  entityType: string,
  entityName: string,
  entityId: any,
}

interface ServerListContentItemType {
  addedSceneNames: any,
  linkPage: any,
  metadata: any,
  isDataItemService: boolean,
  previewUrl: any,
  metadataString: string,
  description: string,
  verifyReason: any,
  isBatch: boolean,
  serviceRootUrlId: any,
  type: string,
  addedMapNames: any,
  offline: boolean,
  checkStatus: string,
  visitCount: 0,
  enable: boolean,
  nickname: string,
  id: number,
  thumbnail: string,
  proxiedUrl: string,
  authorizeSetting: Array<AuthorizeSettingType>,
  updateTime: number,
  userName: string,
  version: any,
  tags: any,
  resTitle: string,
  checkUser: any,
  checkUserNick: any,
  checkTime: any,
  createTime: number,
  tokenRefreshUrl: any,
  scenes: Array<any>,
  mapInfos: Array<MapInfosType>,
}

interface ServerListType {
  currentPage: number,
  pageSize: number,
  total: number,
  totalPage: number,
  searchParameter: SearchParameterType,
}




// 私有服务列表数组
let _arrPrivateServiceList: Array<ServerListContentItemType> = []
// 公有服务列表数组
let _arrPublishServiceList: Array<ServerListContentItemType> = []
// 当前登录用户的底图数组
let curUserBaseMaps: Array<BaseMapsType> = []
// 当前登录的用户
let currentUser: CurrentUserObjType


/**
  * 加载用户底图
  * @author lyx
  * @param currentUser  当前登录用户
  * @param baseMaps 当前用户的底图数组
  */
const loadUserBaseMaps = async (currentUserObj: CurrentUserObjType, baseMaps: Array<BaseMapsType>) => {
  currentUser = currentUserObj
  // curUserBaseMaps = baseMaps
  // 等_arrPublishServiceList的值被修改完成后再返回它的值
  await _initFirstSectionData(baseMaps)
  return _arrPublishServiceList
}

/**
 * 添加公共底图并初始化SectionsData
 * @author lyx
 */
const _initFirstSectionData = async () => {

  //添加公共底图
  if(curUserBaseMaps.length === 0) {
    curUserBaseMaps = getCommonBaseMap()
  }
  curUserBaseMaps = curUserBaseMaps.concat(curUserBaseMaps)
  const count: number = curUserBaseMaps.length
  // 矫正当前用户底图数组里元素的index的值，让index的值与他的位置保持相同
  for (let i = 0; i < count; i++) {
    curUserBaseMaps[i].index = i
  }
  if (UserType.isOnlineUser(currentUser) || UserType.isIPortalUser(currentUser)) {
    try {
      await _initSectionsData(9, 9)
    } catch (error) {
      console.log(error)
    }
  }

}

/**
  * 初始化SectionsData 主要是修改_arrPublishServiceList的值
  * @param {Number} currentPage 当前页码
  * @param {Number} pageSize    当前页条数
  */
const _initSectionsData = async (currentPage: number, pageSize: number) => {
  try {
    // 公有服务列表数组
    const arrPublishServiceList: Array<ServerListContentItemType> = []
    // 私有服务列表数组
    const arrPrivateServiceList: Array<ServerListContentItemType> = []
    // 获取服务列表数据（是json字符串类型）
    let strServiceList
    if (UserType.isOnlineUser(currentUser)) {
      // 是online用户，就调用online的方法，获取服务列表数据
      strServiceList = await SOnlineService.getServiceList(1, pageSize)
    } else if (UserType.isIPortalUser(currentUser)) {
      // 是iPortal用户，就调用iPortal的方法，获取服务列表数据
      strServiceList = await SIPortalService.getMyServices(1, pageSize)
    }
    if (typeof strServiceList === 'string') {
      // 将服务列表数据的json字符串转成js对象
      let objServiceList = JSON.parse(strServiceList)
      // 服务列表里服务的总数
      // this.serviceListTotal = objServiceList.total
      /** 构造SectionsData数据*/
      for (let page = 1; page <= currentPage; page++) {
        // 当page的值大于1时，重新获取服务列表数据（值为1的前面已经获取过了）
        if (page > 1) {
          if (UserType.isOnlineUser(currentUser)) {
            strServiceList = await SOnlineService.getServiceList(
              page,
              pageSize,
            )
          } else if (UserType.isIPortalUser(currentUser)) {
            strServiceList = await SIPortalService.getMyServices(
              page,
              pageSize,
            )
          }
          objServiceList = JSON.parse(strServiceList)
        }

        // 服务列表里（地图）服务对象的数组
        const objArrServiceContent = objServiceList?.content
        // 遍历服务列表里（地图）服务对象的数组
        for (const objContent of objArrServiceContent) {
          // 场景数组
          const arrScenes = objContent.scenes
          // 地图信息数组
          const arrMapInfos = objContent.mapInfos
          // 缩略图
          const strThumbnail = objContent.thumbnail
          // 地图名字
          const strRestTitle = objContent.resTitle
          const strID = objContent.id
          // 是否公有服务标识，true表示是公有服务，false表示是私有服务
          let bIsPublish = false
          // 批准设置数组对象
          const objArrAuthorizeSetting = objContent.authorizeSetting
          const authorizeSetting = objContent.authorizeSetting
          // 遍历批准设置数组对象
          for (const strPermission of objArrAuthorizeSetting) {
            const strPermissionType = strPermission.permissionType
            // 当许可类型为'READ'时，表示是公有服务类型，要将是否公有服务标识的值设置为true，然后终止遍历
            if (strPermissionType === 'READ') {
              bIsPublish = true
              break
            }
          }
          // 构造strSectionsData的JSON字符串数据
          const strSectionsData =
            '{"restTitle":"' +
            strRestTitle +
            '","thumbnail":"' +
            strThumbnail +
            '","id":"' +
            strID +
            '","scenes":' +
            JSON.stringify(arrScenes) +
            ',"mapInfos":' +
            JSON.stringify(arrMapInfos) +
            ',"isPublish":' +
            bIsPublish +
            ',"authorizeSetting":' +
            JSON.stringify(authorizeSetting) +
            '}'
          // 判断地图信息数组或着场景数组内是否有元素
          if (arrMapInfos.length > 0 || arrScenes.length > 0) {
            // strSectionsData的JSON字符串数据转成js对象
            const objSectionsData = JSON.parse(strSectionsData)
            if (bIsPublish) {
              // 当是否为公有服务标识为true时，将 strSectionsData的js对象放入公有服务列表数组
              arrPublishServiceList.push(objSectionsData)
            } else {
              // 当是否为公有服务标识为false时，将 strSectionsData的js对象放入私有服务列表数组
              arrPrivateServiceList.push(objSectionsData)
            }
          }
        }
      }
      /** 重新赋值，避免浅拷贝*/
      _arrPrivateServiceList = arrPrivateServiceList
      _arrPublishServiceList = arrPublishServiceList
    }


  } catch (e) {
    console.warn(e)
  }
}

/**
    * 更新当前用户的底图（构造底图图层对象,修改当前用户底图数组并对其进行持久化存储处理）
    * @param {String} strRestTitle 地图的名字
    * @param {String} server 地图的服务地址
    * @returns {Array<BaseMapsType>} 返回底图数组
    */
const addServer = (strRestTitle: string, server: string) => {
  const alias: string = strRestTitle

  // 拿到图层名字前面的组成部分（从服务地址的最后一个“/”后拿）
  const layerNameTitle: string = server.substring(
    server.lastIndexOf('/') + 1,
    server.length,
  )
  // [\u4e00-\u9fa5] 中文字符的范围
  const rex = /.*[\u4e00-\u9fa5]+.*$/g
  let layerName = ""
  if (rex.test(decodeURIComponent(layerNameTitle))) {
    // 这个图层名字的标题部分解码后包含中文，则直接简单拼接就好
    layerName = layerNameTitle + '@' + alias  //this.state.server.lastIndexOf('/')
  } else {
    // 这个图层名字的标题部分解码后不包含中文，就加一个前缀“en-”标识（注：如果其他地方需要用图层名字进行地址拼接的，需要先将前缀给去掉）
    layerName = 'en-' + layerNameTitle + '@' + alias
  }

  const _DSParams: DSParamsType = {
    server: server,
    engineType: 225,
    alias: alias,
    layerIndex: 0,
  }
  // 构造底图图层对象
  const item: BaseMapsType = {
    type: 'Datasource',
    DSParams: _DSParams,
    layerIndex: 0,
    mapName: strRestTitle,
    layerName: layerName,
    userAdd: true,
    nodeleteBT: true,
  }
  const list: Array<BaseMapsType> = Array.from(new Set(curUserBaseMaps))
  // 当底图图层对象的值不为undefined时，就遍历当前用户的底图数组
  if (item != undefined) {
    for (let i = 0, n: number = list.length; i < n; i++) {
      // 如果item对象，在当前用户的底图数组里已经存在了，就将存在的对象给删除掉，并退出遍历
      if (
        list[i].DSParams.server === item.DSParams.server &&
        list[i].mapName === item.mapName
      ) {
        list.splice(i, 1)
        break
      }
    }
  }
  // 将底图图层对象item放在当前用户的底图数组的末尾
  list.push(item)
  const count: number = list.length
  // 矫正当前用户的底图数组元素的index值，让index的值与他的位置保持相同（因为前面删除又添加，让原本正常的值乱掉了）
  for (let i = 0; i < count; i++) {
    list[i].index = i
  }
  return list
}

/**
  * @author zhangxt
  * @description 获取公共的底图列表
  * @returns {Array}
  */
const getCommonBaseMap = () => {
  const maps = [
    // ConstOnline.GAODE,
    ConstOnline.BingMap,
    ConstOnline.Baidu,
    ConstOnline.Google,
    ConstOnline.OSM,
    ConstOnline.tianditu(),
  ]
  // 如果语言是中文，就删除掉OSM这个底图
  if (global.language === 'CN') {
    maps.splice(3, 1)
  }
  return maps
}

/**
  * 获取用户底图
  * @author lyx
  * @param currentUser  当前登录用户
  * @param baseMaps 当前用户的底图数组
  * @returns {Array<BaseMapsType>} 返回当前用户底图数组
  */
const getUserBaseMaps = async (currentUserObj: CurrentUserObjType, baseMaps: Array<BaseMapsType>) => {
  try {
    const arrPublishServiceList = await loadUserBaseMaps(currentUserObj, baseMaps)
    let list: Array<BaseMapsType> = []
    // 当公有服务列表数组有元素时，就遍历这个数组
    if (arrPublishServiceList.length > 0) {
      for (let i = 0, n = arrPublishServiceList.length; i < n; i++) {
        // 当公有服务列表的元素的地图名字和地图信息数组，以及地图信息数组的地图服务地址都存在时，更新当前用户的底图
        if (arrPublishServiceList[i].restTitle && arrPublishServiceList[i].mapInfos[0] && arrPublishServiceList[i].mapInfos[0].mapUrl) {
          list = await addServer(arrPublishServiceList[i].restTitle, arrPublishServiceList[i].mapInfos[0].mapUrl)
        }
      }
    }

    let listResult: Array<BaseMapsType> = []
    if(list.length > 0){
      // 拿到本地数据里是用户添加的底图
      const userLocalList: Array<BaseMapsType> = baseMaps.filter(item => {
        return item.userAdd
      })
      // 拿到公有服务里是用户添加的底图
      const tempList: Array<BaseMapsType> = list.filter(item => {
        return item.userAdd
      })
      // 将公共底图和用户公有服务里的底图合并到目标数组
      listResult = getCommonBaseMap().concat(tempList)
      const tempListArr: Array<BaseMapsType> = []
      // 获取本地数据里，不属于服务的底图
      userLocalList.map((tempItem) => {
        let indexL = -1
        list.map((item, index) => {
          if(tempItem.mapName === item.mapName && JSON.stringify(tempItem.DSParams) === JSON.stringify(item.DSParams)) {
            indexL = index
          }
        })
        if(indexL === -1) {
          tempListArr.push(tempItem)
        }
      })
      // 将本地数据里，不属于服务的底图添加进目标数组
      listResult =  listResult.concat(tempListArr)
    } else {
      const userLocalList = baseMaps.filter(item => {
        return item.userAdd
      })
      listResult = getCommonBaseMap().concat(userLocalList)
    }

    const count = listResult.length
    for (let i = 0; i < count; i++) {
      listResult[i].index = i
    }
    return listResult
  } catch (error) {
    return getCommonBaseMap()
  }
}


export default {
  loadUserBaseMaps,
  addServer,
  getCommonBaseMap,
  getUserBaseMaps,
}






