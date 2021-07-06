/* global GLOBAL */
import {
  SCoordination,
  SMediaCollector,
  SMap,
} from 'imobile_for_reactnative'
import {
  ConstToolType,
  ToolbarType,
  MsgConstant,
} from '../../../../../../constants'
import { getLanguage } from '../../../../../../language'
import { Toast } from '../../../../../../utils'
import * as Type from '../../../../../../types'
import { getThemeAssets } from '../../../../../../assets'
import ToolbarModule from '../ToolbarModule'
import ToolbarBtnType from '../../ToolbarBtnType'
import CoworkInfo from '../../../../../tabs/Friend/Cowork/CoworkInfo'

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

    if (res.result) {
      addServiceLayer(datasetName)
    } else if (res.error?.reason?.includes('exist')) {
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
    if (res.result && res.content?.dataset) {
      const params: any = ToolbarModule.getParams()
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
          // layerName: res.content.layerName,
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
      if (url.includes('/datasourceName')) {
        datasourceName = `Label_${
          _params.user.currentUser.userName
        }#`
      }
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
    return _SCoordination.downloadToLocal(layerData.url, datasourceAlias)
  }
  return _SCoordination.updateToLocal(layerData.url, datasourceAlias, datasetName)
}

/**
 * 提交到服务器
 * @param layerData
 * @returns
 */
async function uploadToService(layerData: {
  url: string, datasourceAlias?: string, datasetName?: string,
}) {
  const _params: any = ToolbarModule.getParams()
  if (!layerData.url) {
    Toast.show(getLanguage(GLOBAL.language).Cowork.ERROR_SERVICE_DATA_LOSE_URL)
    return
  }
  const datasourceAlias = layerData.datasourceAlias || `Label_${
    _params.user.currentUser.userName
  }#`
  const datasetName = layerData.datasetName || layerData.url.substr(layerData.url.lastIndexOf('/') + 1)
  return _SCoordination.uploadToService(layerData.url, datasourceAlias, datasetName)
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

async function getGroupServices(groupID: string) {
  return _SCoordination.getGroupResources({
    groupId: groupID,
    // resourceCreator: this.props.user.currentUser.userId,
    currentPage: 1,
    pageSize: 10000,
    orderType: 'DESC',
    groupResourceType: 'SERVICE',
  })
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
}
