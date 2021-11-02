/* global GLOBAL */
import {
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
import { Toast, OnlineServicesUtils, SCoordinationUtils, pinyin } from '../../../../../../utils'
import { OnlineDataType } from '../../../../../../utils/OnlineServicesUtils'
import * as Type from '../../../../../../types'
import { getThemeAssets } from '../../../../../../assets'
import { FileTools } from '../../../../../../native'
import ToolbarModule from '../ToolbarModule'
import ToolbarBtnType from '../../ToolbarBtnType'
import CoworkInfo from '../../../../../tabs/Friend/Cowork/CoworkInfo'
import DataHandler from '../../../../../tabs/Mine/DataHandler'

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
 SCoordinationUtils.getScoordiantion().addDataServiceLitsener({
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
        SCoordinationUtils.getScoordiantion().updateToLocal(_datasetUrl.replace('.json', '').replace('.rjson', ''), res.content.datasource, datasetName)
      } else {
        addServiceLayer(datasetName)
      }
    }
  },
  updateHandler: async res => {
    try {
      let msg = res.result ? getLanguage(GLOBAL.language).Cowork.UPDATE_SUCCESSFUL : getLanguage(GLOBAL.language).Cowork.UPDATE_FAILED
      if (res?.error?.reason) {
        msg = res?.error?.reason
      }
      Toast.show(msg)
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
    } catch (error) {
      Toast.show(getLanguage(GLOBAL.language).Cowork.UPDATE_FAILED)
    }
  },
  uploadHandler: async res => {
    try {
      // 发送消息给其他组员
      let msg = res.result ? getLanguage(GLOBAL.language).Cowork.UPLOAD_SUCCESSFUL : getLanguage(GLOBAL.language).Cowork.UPLOAD_FAILED
      if (res?.error?.reason) {
        msg = res?.error?.reason
      }
      Toast.show(msg)
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
    } catch (error) {
      Toast.show(getLanguage(GLOBAL.language).Cowork.UPLOAD_FAILED)
    }
  },
})

// function setServiceType(type = 'online') {
//   SCoordinationUtils.getScoordiantion().setCoordinationType(type)
// }

async function listAction(type: string, params: any = {}) {
  const _params: any = ToolbarModule.getParams()
  switch (type) {
    case ConstToolType.SM_MAP_SERVICE_LIST: {
      let data = params.item.data

      let result = await SCoordinationUtils.getScoordiantion().getServiceData(data.linkPage)

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

      let result = await SCoordinationUtils.getScoordiantion().getServiceData(data.linkPage, datasourceName)

      let _subData: Type.ListItem[] = []
      result.childUriList.forEach((item: string) => {
        // if (!item.endsWith('_Table')) {
        if (item.indexOf('_Table', item.length - '_Table'.length) === -1) {
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
      await SMap.checkCurrentModule()
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
      SCoordinationUtils.getScoordiantion().downloadToLocal(url, datasourceName).then(() => {
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
  return SCoordinationUtils.getScoordiantion().downloadToLocal(datasetUrl, _datasourceAlias || '')
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
    await SMap.checkCurrentModule()
    _params.setCoworkService({
      groupId: _params.currentTask.groupID,
      taskId: _params.currentTask.id,
      service: {
        datasetUrl: layerData.url,
        status: 'update',
      },
    })
    let datasourceAlias
    if (layerData.datasourceAlias?.indexOf('Label_') === 0 && layerData.datasourceAlias?.indexOf('#') == layerData.datasourceAlias?.length - 1) {
      datasourceAlias = `Label_${
        _params.user.currentUser.userName
      }#`
    } else {
      datasourceAlias = layerData.datasourceAlias || `Label_${
        _params.user.currentUser.userName
      }#`
    }
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
      result = await SCoordinationUtils.getScoordiantion().downloadToLocal(layerData.url, datasourceAlias)
    }
    result = await SCoordinationUtils.getScoordiantion().updateToLocal(layerData.url, datasourceAlias, datasetName)
    // 失败直接改变状态,成功走回调
    if (!result) {
      _params.setCoworkService({
        groupId: _params.currentTask.groupID,
        taskId: _params.currentTask.id,
        service: {
          datasetUrl: layerData.url,
          status: 'done',
        },
      })
    }
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
    await SMap.checkCurrentModule()
    _params.setCoworkService({
      groupId: _params.currentTask.groupID,
      taskId: _params.currentTask.id,
      service: {
        datasetUrl: layerData.url,
        status: 'upload',
      },
    })
    let datasourceAlias
    if (layerData.datasourceAlias?.indexOf('Label_') === 0 && layerData.datasourceAlias?.indexOf('#') == layerData.datasourceAlias?.length - 1) {
      datasourceAlias = `Label_${
        _params.user.currentUser.userName
      }#`
    } else {
      datasourceAlias = layerData.datasourceAlias || `Label_${
        _params.user.currentUser.userName
      }#`
    }
    const datasetName = layerData.datasetName || layerData.url.substr(layerData.url.lastIndexOf('/') + 1)
    result = await SCoordinationUtils.getScoordiantion().uploadToService(layerData.url, datasourceAlias, datasetName)
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
  SCoordinationUtils.getScoordiantion().putService(serviceId, serviceInfo2)
}

function getAllService() {
  SCoordinationUtils.getScoordiantion().getAllService({
    pageSize: 10000,
    currentPage: 1,
  })
}

function getUserServices() {
  SCoordinationUtils.getScoordiantion().getUserServices({
    pageSize: 10000,
    currentPage: 1,
  })
}

async function getGroupServices(groupID: string, keywords?: string[]) {
  return SCoordinationUtils.getScoordiantion().getGroupResources({
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

async function exportData(name: string, datasourcePath: string, datasets: string[], dataType?: keyof OnlineDataType) {
  const _params: any = ToolbarModule.getParams()
  let homePath = await FileTools.appendingHomeDirectory()
  let userPath =
    homePath + ConstPath.UserPath + _params.user.currentUser.userName + '/'

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

    if (dataType === 'WORKSPACE') {
      let workspaceServer = userPath + ConstPath.RelativePath.Temp + name + '/' + name + '.smwu'
      result = await SMap.copyDatasetToNewWorkspace(datasourcePath, todatasourcePath, datasets, workspaceServer)
    } else {
      result = await SMap.copyDataset(datasourcePath, todatasourcePath, datasets)
    }

    result = result && await FileTools.zipFile(archivePath, targetPath)
    // FileTools.deleteFile(archivePath)
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
}> {
  const _params: any = ToolbarModule.getParams()
  let result = false
  let content: any[] | undefined
  try {
    const { datasourceAlias, datasourcePath, datasets } = publishData
    if (!fileName || datasets.length === 0 || UserType.isProbationUser(_params.user.currentUser)) return {
      result,
      content,
    }
    let Service: OnlineServicesUtils
    if (UserType.isIPortalUser(_params.user.currentUser)) {
      Service = new OnlineServicesUtils('iportal')
    } else {
      Service = new OnlineServicesUtils('online')
    }
    fileName = pinyin.getPinYin(fileName, '', false)

    let publishDataType: keyof OnlineDataType = 'WORKSPACE'
    // let publishDataType: keyof OnlineDataType = 'UDB'
    // if (UserType.isOnlineUser(_params.user.currentUser)) {
    //   publishDataType = 'WORKSPACE'
    // }

    let exportResult = await exportData(fileName, datasourcePath, datasets, publishDataType)
    result = exportResult.result
    const targetPath = exportResult.targetPath
    if (result) {
      let uploadResult
      uploadResult = await Service.uploadFileWithCheckCapacity(
        targetPath,
        fileName + '.zip',
        publishDataType,
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
        const publishResults = await Service.publishService(uploadResult, publishDataType, 'RESTDATA')
        result = publishResults?.[0]?.succeed || false
        if (result && publishResults[0].customResult) {
          const service = await SCoordinationUtils.getScoordiantion().getUserServices({keywords: [publishResults[0].customResult], orderBy: 'UPDATETIME', orderType: 'DESC'})
          // const service = await SCoordinationUtils.getScoordiantion().getUserServices({})
          if (service.content.length > 0) {
            content = service.content
            let ids: string[] = []
            service.content.forEach(item => {
              ids.push(item.id)
            })
            let shareResult = await SCoordinationUtils.getScoordiantion().shareServiceToGroup({
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
        } else {
          Toast.show(getLanguage(GLOBAL.language).Prompt.PUBLISH_FAILED)
        }
      } else {
        Toast.show(getLanguage(GLOBAL.language).Prompt.PUBLISH_FAILED)
      }
      await FileTools.deleteFile(targetPath)
    }
  } catch (error) {
    console.warn(error)
    //发布完成
    // _params.setCoworkService({
    //   groupId: _params.currentTask.groupID,
    //   taskId: _params.currentTask.id,
    //   service: {
    //     layerName: publishData.layerName,
    //     status: 'done',
    //   },
    // })
  } finally {
    //发布完成
    _params.setCoworkService({
      groupId: _params.currentTask.groupID,
      taskId: _params.currentTask.id,
      service: {
        layerName: publishData.layerName,
        status: 'done',
      },
    })
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
            let serviceData1 = await SCoordinationUtils.getScoordiantion().getServiceData(item.linkPage)
            if (serviceData1.datasourceNames.length === 0) return false
            for (const datasourceName of serviceData1.datasourceNames) {
              let serviceData2 = await SCoordinationUtils.getScoordiantion().getServiceData(item.linkPage, datasourceName)
              if (serviceData2.datasetNames.length === 0) continue
              for (let index in serviceData2.datasetNames) {
                if (item2.datasetName !== serviceData2.datasetNames[index]) continue
                const serviceData: ServiceData = {
                  url: serviceData2.childUriList[index],
                  datasourceAlias: datasourceName,
                  dataset: serviceData2.datasetNames[index],
                }
                result = await SCoordinationUtils.getScoordiantion().setDataService(item2.datasourceAlias, item2.datasetName, serviceData)
                break
              }
            }
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
