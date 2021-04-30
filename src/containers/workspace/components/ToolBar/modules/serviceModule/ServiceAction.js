/* global GLOBAL */
import {
  SCoordination,
  SMediaCollector,
} from 'imobile_for_reactnative'
import {
  ConstToolType,
  ToolbarType,
} from '../../../../../../constants'
import { getLanguage } from '../../../../../../language'
import { request, Toast } from '../../../../../../utils'
import { getThemeAssets } from '../../../../../../assets'
import ToolbarModule from '../ToolbarModule'
import ToolbarBtnType from '../../ToolbarBtnType'

let currentLayerData = null
const _SCoordination = new SCoordination()
_SCoordination.addDataServiceLitsener({
  downloadHandler: res => {
    // console.warn(JSON.stringify(res))
    let _datasetUrl = res.content.urlDataset
    let datasetName = _datasetUrl.substring(_datasetUrl.lastIndexOf('/') + 1).replace('.json', '').replace('.rjson', '')

    // console.warn(_datasetUrl, datasetName)
    if (res.result) {
      // SMap.addLayers([datasetName], res.content.datasource).then(resultArr => {
      //   if (resultArr?.length) {
      //     SMediaCollector.showMedia(resultArr[0].layerName, false)
      //     _SCoordination.updateToLocal(_datasetUrl.replace('.json', '').replace('.rjson', ''), res.content.datasource, datasetName).then(result => {
      //       console.warn(result)
      //       resultArr?.length > 0 && SMap.refreshMap()
      //     }, e => {
      //       console.warn(e)
      //       resultArr?.length > 0 && SMap.refreshMap()
      //     })
      //   }
      // })
    } else if (res.error?.reason?.includes('exist')) {
      const params = ToolbarModule.getParams()
      let isAdded = false
      for (let i = 0; i < params.layers.length; i++) {
        if (params.layers[i].datasetName === datasetName) {
          isAdded = true
          break
        }
      }
      if (isAdded) {
        // console.warn('update layer', datasetName)
        _SCoordination.updateToLocal(_datasetUrl.replace('.json', '').replace('.rjson', ''), res.content.datasource, datasetName).then(result => {
          // console.warn(result)
        }, e => {
          // console.warn(e)
        })
      } else {
        // console.warn('add layer', datasetName)
        // SMap.addLayers([datasetName], res.content.datasource).then(resultArr => {
        //   if (resultArr?.length) {
        //     _SCoordination.updateToLocal(_datasetUrl.replace('.json', '').replace('.rjson', ''), res.content.datasource, datasetName).then(result => {
        //       console.warn(result)
        //       resultArr?.length > 0 && SMap.refreshMap()
        //     }, e => {
        //       console.warn(e)
        //       resultArr?.length > 0 && SMap.refreshMap()
        //     })
        //   }
        // })
      }
    }
  },
  updateHandler: async res => {
    // console.warn(JSON.stringify(res))
    Toast.show(res.result ? '更新成功' : '更新失败')
    if (res.result && currentLayerData) {
      await SMediaCollector.hideMedia(currentLayerData.name)
      await SMediaCollector.showMedia(currentLayerData.name, false)
      currentLayerData = null
    }
  },
  commitHandler: res => {
    // console.warn(JSON.stringify(res))
  },
})

function setServiceType(type = 'online') {
  _SCoordination.setCoordinationType(type)
}

async function _request(url, method = 'GET', params = {}) {
  let cookie = await _SCoordination.getCookie()
  if (!params.headers) {
    params.headers = {}
    params.headers.cookie = cookie
  }
  if (cookie) {
    params.headers.cookie = cookie
  }

  let result = await request(url, method, params)
  return result
}

async function listAction(type, params = {}) {
  const _params = ToolbarModule.getParams()
  switch (type) {
    case ConstToolType.SM_MAP_SERVICE_LIST: {
      let data = params.item.data

      let GetDatasourceURL = data.linkPage + '/data/datasources.json'

      let result = await _request(GetDatasourceURL, 'GET')

      if (
        params.section &&
        params.section.title ===
          getLanguage(_params.language).Profile.SERVICE
      ) {
        let _subData = []
        result.datasourceNames.forEach(item => {
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
      let downloadUrl = data.linkPage + '/data/datasources/' + datasourceName + '/datasets.json'

      let result = await _request(downloadUrl, 'GET')

      let _subData = []
      result.childUriList.forEach(item => {
        _subData.push({
          key: item,
          title: item.substr(item.lastIndexOf('/') + 1),
          data: item,
          size: 'large',
          image: getThemeAssets().dataType.icon_data_set,
        })
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
      _SCoordination.downloadToLocal(url, datasourceName).then(result => {
        // console.warn(JSON.stringify(result))
        _params.setToolbarVisible(false)
        _params.showFullMap && _params.showFullMap(false)
      }, e => {
        // console.warn(e)
      })
      break
    }
  }
}

function toolbarBack(type) {
  const _params = ToolbarModule.getParams()
  if (!_params) return
  if (type === ConstToolType.SM_MAP_SERVICE_DATASET) {
    _params.setToolbarVisible(true, ConstToolType.SM_MAP_SERVICE_DATASOURCE, {
      data: ToolbarModule.getData().datasources,
      buttons: [ToolbarBtnType.TOOLBAR_BACK],
      containerType: ToolbarType.list,
      isFullScreen: true,
    })
  } else if (type === ConstToolType.SM_MAP_SERVICE_DATASOURCE) {
    _params.setToolbarVisible(true, ConstToolType.SM_MAP_SERVICE_LIST, {
      data: ToolbarModule.getData().services,
      buttons: [],
      containerType: ToolbarType.list,
      isFullScreen: true,
    })
  }
}

function downloadToLocal(datasetUrl, layerData) {
  _SCoordination.downloadToLocal(datasetUrl, layerData.datasourceAlias)
}

function updateToLocal(datasetUrl, layerData) {
  currentLayerData = layerData
  _SCoordination.updateToLocal(datasetUrl, layerData.datasourceAlias, layerData.datasetName)
}

function uploadToService(datasetUrl, layerData) {
  _SCoordination.uploadToService(datasetUrl, layerData.datasourceAlias, layerData.datasetName)
}

function putService(serviceId, serviceInfo2) {
  _SCoordination.putService(serviceId, serviceInfo2)
}

function getAllService() {
  _SCoordination.getAllService({
    pageSize: 10000,
    currentPage: 1,
  }).then(result => {
    // console.warn(JSON.stringify(result))
  }, e => {
    // console.warn(e)
  })
}

function getUserServices() {
  _SCoordination.getUserServices({
    pageSize: 10000,
    currentPage: 1,
  }).then(result => {
    // console.warn(JSON.stringify(result))
  }, e => {
    // console.warn(e)
  })
}

async function getGroupServices(groupID) {
  return await _SCoordination.getGroupResources({
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

  setServiceType,
  downloadToLocal,
  updateToLocal,
  uploadToService,
  putService,
  getAllService,
  getUserServices,
  getGroupServices,
}
