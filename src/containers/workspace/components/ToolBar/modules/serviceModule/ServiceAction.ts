/* global GLOBAL */
import {
  SCoordination,
  SMediaCollector,
  SMap,
  AuthorizeSetting,
  PermissionType,
  EntityType,
  ServiceData,
} from 'imobile_for_reactnative'
import {
  ConstToolType,
  ToolbarType,
  MsgConstant,
  ConstPath,
  UserType,
} from '../../../../../../constants'
import { getLanguage } from '../../../../../../language'
import { Toast, OnlineServicesUtils, request } from '../../../../../../utils'
import * as Type from '../../../../../../types'
import { getThemeAssets } from '../../../../../../assets'
import { FileTools } from '../../../../../../native'
import ToolbarModule from '../ToolbarModule'
import ToolbarBtnType from '../../ToolbarBtnType'
import CoworkInfo from '../../../../../tabs/Friend/Cowork/CoworkInfo'
import DataHandler from '../../../../../tabs/Mine/DataHandler'

const _SCoordination = new SCoordination()

async function addServiceLayer(datasetName: string) {
  const _params: any = ToolbarModule.getParams()
  const labelUDB = `Label_${_params.user.currentUser.userName}#`
  const resultArr = await SMap.addLayers([datasetName], labelUDB)
  if (resultArr.length > 0) {
    SMap.refreshMap()
    await _params.getLayers()
    SMediaCollector.showMedia(resultArr[0].layerName, false)
    Toast.show(getLanguage(GLOBAL.language).Prompt.ADD_SUCCESS)
    _params.setToolbarVisible(false)
  } else {
    Toast.show(getLanguage(GLOBAL.language).Prompt.ADD_FAILED)
    SMap.refreshMap()
  }
}

/**
 * 数据服务回调监听
 */
_SCoordination.addDataServiceLitsener({
  downloadHandler: async res => {
    if (!res.content) return
    let _datasetUrl = res.content.urlDataset
    let datasetName = _datasetUrl.substring(_datasetUrl.lastIndexOf('/') + 1).replace('.json', '').replace('.rjson', '')
    const params: any = ToolbarModule.getParams()
    // 上传完成
    res.content && params.setCoworkService({
      groupId: params.currentTask.groupID,
      taskId: params.currentTask.id,
      service: {
        datasetUrl: res.content?.urlDataset,
        status: 'done',
      },
    })
    if (res.result) {
      addServiceLayer(datasetName)
    } else if (
      res.error?.reason?.includes('exist') ||
      res.error?.reason?.includes('failed to create local dataset according to the web dataset resource') // iOS
    ) {
      const params: any = ToolbarModule.getParams()
      let isAdded = false
      for (let layer of params.layers.layers) {
        if (layer.datasetName === datasetName) {
          isAdded = true
          break
        }
      }
      if (isAdded) {
        _SCoordination.updateToLocal(_datasetUrl.replace('.json', '').replace('.rjson', ''), res.content.datasource, datasetName)
      } else {
        addServiceLayer(datasetName)
      }
    }
  },
  updateHandler: async res => {
    Toast.show(res.result ? getLanguage(GLOBAL.language).Cowork.UPDATE_SUCCESSFUL : getLanguage(GLOBAL.language).Cowork.UPDATE_FAILED)
    const params: any = ToolbarModule.getParams()
    // 上传完成
    res.content && params.setCoworkService({
      groupId: params.currentTask.groupID,
      taskId: params.currentTask.id,
      service: {
        datasetUrl: res.content?.urlDataset,
        status: 'done',
      },
    })
    if (res.result && res.content?.dataset) {
      for (let layer of params.layers.layers) {
        if (layer.datasetName === res.content.dataset) {
          await SMediaCollector.hideMedia(layer.name)
          await SMediaCollector.showMedia(layer.name, false)
          break
        }
      }
      if (!res.content) return
      let _datasetUrl = res.content.urlDataset
      const coworkMessages = params.coworkInfo?.[params.user.currentUser.userName]?.[params.currentTask?.groupID]?.[params.currentTask?.id]?.messages || []
      if (coworkMessages.length > 0) {
        for (const message of coworkMessages) {
          if (message.message?.serviceUrl === _datasetUrl && message.status === 0) {
            CoworkInfo.consumeMessage(message.messageID)
          }
        }
      }
    }
  },
  uploadHandler: async res => {
    // 发送消息给其他组员
    Toast.show(res.result ? getLanguage(GLOBAL.language).Cowork.UPLOAD_SUCCESSFUL : getLanguage(GLOBAL.language).Cowork.UPLOAD_FAILED)
    const params: any = ToolbarModule.getParams()
    // 上传完成
    res.content && params.setCoworkService({
      groupId: params.currentTask.groupID,
      taskId: params.currentTask.id,
      service: {
        datasetUrl: res.content?.urlDataset,
        status: 'done',
      },
    })
    if (res.result && res.content) {
      if (!res.result) return
      const _params: any = ToolbarModule.getParams()
      let msgObj = {
        type: MsgConstant.MSG_COWORK,
        time: new Date().getTime(),
        user: {
          name: _params.user.currentUser.nickname,
          id: _params.user.currentUser.userName,
          groupID: _params.currentTask.id,     // 任务群组
          groupName: '',
          coworkGroupId: _params.currentTask.groupID,     // online协作群组
          coworkGroupName: _params.currentTask.groupName,
          taskId: _params.currentTask.id,
        },
        message: {
          type: MsgConstant.MSG_COWORK_SERVICE_UPDATE,
          datasetName: res.content.dataset,
          serviceUrl: res.content.urlDataset,
        },
      }
      let msgStr = JSON.stringify(msgObj)
      await GLOBAL.getFriend()._sendMessage(msgStr, _params.currentTask.id, false)
    }
  },
})

// function setServiceType(type = 'online') {
//   _SCoordination.setCoordinationType(type)
// }

async function listAction(type: string, params: any = {}) {
  const _params: any = ToolbarModule.getParams()
  switch (type) {
    case ConstToolType.SM_MAP_SERVICE_LIST: {
      let data = params.item.data

      let result = await _SCoordination.getServiceData(data.linkPage)

      if (result.errorMsg) {
        Toast.show(result.errorMsg)
        return
      }
      if (
        params.section &&
        params.section.title ===
          getLanguage(_params.language).Profile.SERVICE
      ) {
        let _subData: Type.ListItem[] = []
        result.datasourceNames.forEach((item: string) => {
          _subData.push({
            key: item,
            title: item,
            data: data,
            size: 'large',
            image: getThemeAssets().dataType.icon_data_source,
          })
        })
        let _data = [{
          title: getLanguage(GLOBAL.language).Map_Settings.DATASOURCES,
          image: getThemeAssets().dataType.icon_data_source,
          data: _subData,
        }]
        ToolbarModule.addData({
          datasources: _data,
        })
        _params.setToolbarVisible(true, ConstToolType.SM_MAP_SERVICE_DATASOURCE, {
          data: _data,
          buttons: [ToolbarBtnType.TOOLBAR_BACK],
          containerType: ToolbarType.list,
          isFullScreen: true,
        })
      }
      break
    }
    case ConstToolType.SM_MAP_SERVICE_DATASOURCE:{
      const data = params.item.data
      const datasourceName = params.item.title

      let result = await _SCoordination.getServiceData(data.linkPage, datasourceName)

      let _subData: Type.ListItem[] = []
      result.childUriList.forEach((item: string) => {
        if (!item.endsWith('_Table')) {
          _subData.push({
            key: item,
            title: item.substr(item.lastIndexOf('/') + 1),
            data: item,
            size: 'large',
            image: getThemeAssets().dataType.icon_data_set,
          })
        }
      })
      let _data = [{
        title: getLanguage(GLOBAL.language).Map_Settings.DATASETS,
        image: getThemeAssets().dataType.icon_data_set,
        data: _subData,
      }]
      _params.setToolbarVisible(true, ConstToolType.SM_MAP_SERVICE_DATASET, {
        data: _data,
        buttons: [ToolbarBtnType.TOOLBAR_BACK],
        containerType: ToolbarType.list,
        isFullScreen: true,
      })
      break
    }
    case ConstToolType.SM_MAP_SERVICE_DATASET: {
      const url = params.item.data
      let datasourceName = params.item.title
      if (url.includes('/datasources')) {
        datasourceName = `Label_${
          _params.user.currentUser.userName
        }#`
      }
      _params.setCoworkService({
        groupId: _params.currentTask.groupID,
        taskId: _params.currentTask.id,
        service: {
          datasetUrl: url,
          status: 'download',
        },
      })
      _SCoordination.downloadToLocal(url, datasourceName).then(() => {
        _params.setToolbarVisible(false)
        _params.showFullMap && _params.showFullMap(false)
      })
      break
    }
  }
}

function toolbarBack(type: string) {
  const _params: any = ToolbarModule.getParams()
  const _data: any = ToolbarModule.getData()
  if (!_params) return
  if (type === ConstToolType.SM_MAP_SERVICE_DATASET) {
    _params.setToolbarVisible(true, ConstToolType.SM_MAP_SERVICE_DATASOURCE, {
      data: _data.datasources,
      buttons: [ToolbarBtnType.TOOLBAR_BACK],
      containerType: ToolbarType.list,
      isFullScreen: true,
    })
  } else if (type === ConstToolType.SM_MAP_SERVICE_DATASOURCE) {
    _params.setToolbarVisible(true, ConstToolType.SM_MAP_SERVICE_LIST, {
      data: _data.services,
      buttons: [],
      containerType: ToolbarType.list,
      isFullScreen: true,
    })
  }
}

async function downloadToLocal(datasetUrl: string, datasourceAlias?: string) {
  if (!datasetUrl) {
    Toast.show(getLanguage(GLOBAL.language).Cowork.ERROR_SERVICE_DATA_LOSE_URL)
    return
  }
  const _params: any = ToolbarModule.getParams()
  const _datasourceAlias = datasourceAlias || `Label_${
    _params.user.currentUser.userName
  }#`
  return _SCoordination.downloadToLocal(datasetUrl, _datasourceAlias || '')
}

/**
 * 更新到本地
 * @param layerData
 * @returns
 */
async function updateToLocal (layerData: {
  url: string, datasourceAlias?: string, datasetName?: string,
}) {
  const _params: any = ToolbarModule.getParams()
  if (!layerData.url) {
    Toast.show(getLanguage(GLOBAL.language).Cowork.ERROR_SERVICE_DATA_LOSE_URL)
    return
  }
  let result = false
  try {
    _params.setCoworkService({
      groupId: _params.currentTask.groupID,
      taskId: _params.currentTask.id,
      service: {
        datasetUrl: layerData.url,
        status: 'update',
      },
    })
    const datasourceAlias = layerData.datasourceAlias || `Label_${
      _params.user.currentUser.userName
    }#`
    const datasetName = layerData.datasetName || layerData.url.substr(layerData.url.lastIndexOf('/') + 1)
    const params: any = ToolbarModule.getParams()
    let isAdded = false
    for (let layer of params.layers.layers) {
      if (layer.datasetName === datasetName) {
        isAdded = true
        break
      }
    }
    if (!isAdded) {
      result = await _SCoordination.downloadToLocal(layerData.url, datasourceAlias)
    }
    result = await _SCoordination.updateToLocal(layerData.url, datasourceAlias, datasetName)
  } catch (error) {
    _params.setCoworkService({
      groupId: _params.currentTask.groupID,
      taskId: _params.currentTask.id,
      service: {
        datasetUrl: layerData.url,
        status: 'done',
      },
    })
  } finally {
    return result
  }
}

/**
 * 提交到服务器
 * @param layerData
 * @returns
 */
async function uploadToService(layerData: {
  url: string, datasourceAlias?: string, datasetName?: string, onlineDatasourceAlias: string
}) {
  const _params: any = ToolbarModule.getParams()
  if (!layerData.url) {
    Toast.show(getLanguage(GLOBAL.language).Cowork.ERROR_SERVICE_DATA_LOSE_URL)
    return
  }
  let result = false
  try {
    _params.setCoworkService({
      groupId: _params.currentTask.groupID,
      taskId: _params.currentTask.id,
      service: {
        datasetUrl: layerData.url,
        status: 'upload',
      },
    })
    const datasourceAlias = layerData.datasourceAlias || `Label_${
      _params.user.currentUser.userName
    }#`
    const datasetName = layerData.datasetName || layerData.url.substr(layerData.url.lastIndexOf('/') + 1)
    result = await _SCoordination.uploadToService(layerData.url, datasourceAlias, datasetName)
  } catch (error) {
    _params.setCoworkService({
      groupId: _params.currentTask.groupID,
      taskId: _params.currentTask.id,
      service: {
        datasetUrl: layerData.url,
        status: 'done',
      },
    })
  } finally {
    return result
  }
}

function putService(serviceId: string, serviceInfo2: any) {
  _SCoordination.putService(serviceId, serviceInfo2)
}

function getAllService() {
  _SCoordination.getAllService({
    pageSize: 10000,
    currentPage: 1,
  })
}

function getUserServices() {
  _SCoordination.getUserServices({
    pageSize: 10000,
    currentPage: 1,
  })
}

async function getGroupServices(groupID: string, keywords?: string[]) {
  return _SCoordination.getGroupResources({
    groupId: groupID,
    keywords: keywords,
    // resourceCreator: _params.user.currentUser.userId,
    currentPage: 1,
    pageSize: 10000,
    orderType: 'DESC',
    orderBy: 'UPDATETIME',
    groupResourceType: 'SERVICE',
  })
}

async function exportData(name: string, datasourcePath: string, datasets: string[]) {
  const _params: any = ToolbarModule.getParams()
  let homePath = await FileTools.appendingHomeDirectory()
  let userPath =
    homePath + ConstPath.UserPath + _params.user.currentUser.userName + '/'
  // let datasourcePath =
  //   userPath +
  //   ConstPath.RelativePath.Label +
  //   'Label_' +
  //   _params.user.currentUser.userName +
  //   '#.udb'

  let todatasourcePath =
    userPath + ConstPath.RelativePath.Temp + name + '/' + name + '.udb'

  let archivePath, targetPath = '', availableName = name
  archivePath = userPath + ConstPath.RelativePath.Temp + name
  if (await FileTools.fileIsExist(archivePath)) {
    FileTools.deleteFile(archivePath)
  }

  let result = await DataHandler.createDatasourceFile(
    _params.user.currentUser,
    todatasourcePath,
  )
  if (result) {
    let tempPath = homePath + ConstPath.ExternalData + '/' + ConstPath.RelativeFilePath.ExportData
    availableName = await FileTools.getAvailableFileName(
      tempPath,
      name,
      'zip',
    )
    targetPath = tempPath + availableName

    await SMap.copyDataset(datasourcePath, todatasourcePath, datasets)
    result = await FileTools.zipFile(archivePath, targetPath)
    FileTools.deleteFile(archivePath)
  }
  return {
    result,
    availableName,
    targetPath,
  }
}

export interface publishData {
  layerName: string,
  datasourceAlias: string,
  datasourcePath: string,
  datasets: string[],
}

export interface publishGroup {
  groupId: number,
  groupName: string,
  entityType?: keyof EntityType,
  permissionType?: keyof PermissionType,
}

async function publishServiceToGroup(fileName: string, publishData: publishData, groups: publishGroup[]): Promise<{
  result: boolean,
  content?: any[],
} | undefined> {
  const _params: any = ToolbarModule.getParams()
  let result = false
  let content: any[] | undefined
  try {
    const { datasourceAlias, datasourcePath, datasets } = publishData
    if (!fileName || datasets.length === 0) return
    let Service: OnlineServicesUtils
    if (UserType.isProbationUser(_params.user.currentUser)) return
    if (UserType.isIPortalUser(_params.user.currentUser)) {
      Service = new OnlineServicesUtils('iportal')
    } else {
      Service = new OnlineServicesUtils('online')
    }
    // 设置开始发布
    // _params.setCoworkService({
    //   groupId: _params.currentTask.groupID,
    //   taskId: _params.currentTask.id,
    //   service: {
    //     layerName: publishData.layerName,
    //     status: 'publish',
    //   },
    // })
    let exportResult = await exportData(fileName, datasourcePath, datasets)
    result = exportResult.result
    const targetPath = exportResult.targetPath
    if (result) {
      let uploadResult
      uploadResult = await Service.uploadFile(
        targetPath,
        fileName + '.zip',
        'UDB',
      )
      const entities: AuthorizeSetting[] = []
      for (const group of groups) {
        entities.push({
          entityId: group.groupId,
          entityName: group.groupName,
          entityType: group.entityType || 'IPORTALGROUP',
          permissionType: group.permissionType || 'READ',
        })
      }
      if(uploadResult) {
        const publishResults = await Service.publishService(uploadResult, 'UDB')
        result = publishResults[0].succeed
        if (publishResults[0].succeed && publishResults[0].customResult) {
          const service = await _SCoordination.getUserServices({keywords: [publishResults[0].customResult], orderBy: 'UPDATETIME', orderType: 'DESC'})
          // const service = await _SCoordination.getUserServices({})
          if (service.content.length > 0) {
            content = service.content
            let ids: string[] = []
            service.content.forEach(item => {
              ids.push(item.id)
            })
            let shareResult = await _SCoordination.shareServiceToGroup({
              ids: ids,
              entities: entities,
            })
            result = shareResult.succeed
          } else {
            result = false
          }
          // let msgObj = {
          //   type: MsgConstant.MSG_COWORK,
          //   time: new Date().getTime(),
          //   user: {
          //     name: _params.user.currentUser.nickname,
          //     id: _params.user.currentUser.userName,
          //     groupID: _params.currentTask.id,     // 任务群组
          //     groupName: '',
          //     coworkGroupId: _params.currentTask.groupID,     // online协作群组
          //     coworkGroupName: _params.currentTask.groupName,
          //     taskId: _params.currentTask.id,
          //   },
          //   message: {
          //     type: MsgConstant.MSG_COWORK_SERVICE_PUBLISH,
          //     datasetName: publishResults[0].customResult,
          //     serviceUrl: res.content.urlDataset,
          //   },
          // }
          // let msgStr = JSON.stringify(msgObj)
          // await GLOBAL.getFriend()._sendMessage(msgStr, _params.currentTask.id, false)
        }
      }
      await FileTools.deleteFile(targetPath)
    }
  } catch (error) {
    //发布完成
    _params.setCoworkService({
      groupId: _params.currentTask.groupID,
      taskId: _params.currentTask.id,
      service: {
        layerName: publishData.layerName,
        status: 'done',
      },
    })
  } finally {
    return {
      result,
      content,
    }
  }
}

export interface DataServiceUrlParams {
  id: string | number,
  datasourceAlias: string,
  datasetName: string,
  // datasetUrl: string,
}

async function setDataService(params: {
  groupID: string,
  keywords?: string[],
  content: DataServiceUrlParams[],
}) {
  let result = false
  try {
    const { groupID, keywords, content } = params
    const services = await getGroupServices(groupID, keywords)
    if (services?.content?.length > 0) {
      for (const item of services.content) {
        for (const item2 of content) {
          if (item.resourceId === item2.id) {
            let serviceData1 = await _SCoordination.getServiceData(item.linkPage)
            if (serviceData1.datasourceNames.length === 0) return false
            let serviceData2 = await _SCoordination.getServiceData(item.linkPage, serviceData1.datasourceNames[0])
            if (serviceData2.childUriList.length === 0) return false
            const datasetUrl = serviceData2.childUriList[0]
            const serviceData: ServiceData = {
              url: datasetUrl,
              datasourceAlias: serviceData1.datasourceNames[0],
              dataset: serviceData2.datasetNames[0],
            }
            result = await _SCoordination.setDataService(item2.datasourceAlias, item2.datasetName, serviceData)
            break
          }
        }
      }
    }
  } catch (error) {
  } finally {
    return result
  }
}

export default {
  listAction,
  toolbarBack,

  // setServiceType,
  downloadToLocal,
  updateToLocal,
  uploadToService,
  putService,
  getAllService,
  getUserServices,
  getGroupServices,
  publishServiceToGroup,
  setDataService,
}
