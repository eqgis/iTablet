/**
 * 获取地图工具数据
 */
import { SMap } from 'imobile_for_reactnative'
import { ConstToolType } from '../../../../../../constants'
import { getThemeAssets } from '../../../../../../assets'
import { getLanguage } from '../../../../../../language'
import { LayerUtils, DialogUtils, Toast } from '../../../../../../utils'
import * as Type from '../../../../../../types'
import ToolbarModule from '../ToolbarModule'
import ServiceAction from './ServiceAction'

// const datasetUrl = 'http://192.168.11.206:8090/iserver/services/data_potdensity_1/rest/data/datasources/datasourceName643053088/datasets/PotDensity_1'
// const datasetUrl_Online = 'https://www.supermapol.com/proxy/iserver/services/data_potdensity_1_884a1jfk/rest/data/datasources/datasourceName2059137087/datasets/PotDensity_1'

// const serviceId = 1269024791
// const _datasourceName = 'PopulationHubei'
// const _datasetName = 'PotDensity_1'
// const _SCoordination = new SCoordination('online')
// _SCoordination.addDataServiceLitsener({
//   downloadHandler: res => {
//     console.warn(JSON.stringify(res))
//     let _datasetUrl = res.content.urlDataset
//     let datasetName = _datasetUrl.substring(_datasetUrl.lastIndexOf('/') + 1).replace('.json', '').replace('.rjson', '')

//     console.warn(_datasetUrl, datasetName)
//     if (res.result) {
//       SMap.addLayers([datasetName], res.content.datasource).then(resultArr => {
//         if (resultArr?.length) {
//           _SCoordination.updateToLocal(_datasetUrl.replace('.json', '').replace('.rjson', ''), res.content.datasource, datasetName).then(result => {
//             console.warn(result)
//             resultArr?.length > 0 && SMap.refreshMap()
//           }, e => {
//             console.warn(e)
//             resultArr?.length > 0 && SMap.refreshMap()
//           })
//         }
//       })
//     } else if (res.error?.reason?.includes('exist')) {
//       const params = ToolbarModule.getParams()
//       let isAdded = false
//       for (let i = 0; i < params.layers.length; i++) {
//         if (params.layers[i].datasetName === datasetName) {
//           isAdded = true
//           break
//         }
//       }
//       if (isAdded) {
//         console.warn('update layer', datasetName)
//         _SCoordination.updateToLocal(_datasetUrl.replace('.json', '').replace('.rjson', ''), res.content.datasource, datasetName).then(result => {
//           console.warn(result)
//         }, e => {
//           console.warn(e)
//         })
//       } else {
//         console.warn('add layer', datasetName)
//         SMap.addLayers([datasetName], res.content.datasource).then(resultArr => {
//           if (resultArr?.length) {
//             _SCoordination.updateToLocal(_datasetUrl.replace('.json', '').replace('.rjson', ''), res.content.datasource, datasetName).then(result => {
//               console.warn(result)
//               resultArr?.length > 0 && SMap.refreshMap()
//             }, e => {
//               console.warn(e)
//               resultArr?.length > 0 && SMap.refreshMap()
//             })
//           }
//         })
//       }
//     }
//   },
//   updateHandler: res => {
//     console.warn(JSON.stringify(res))
//   },
//   commitHandler: res => {
//     console.warn(JSON.stringify(res))
//   },
// })

// let serviceInfo2 = {
//   "metadata": {
//     "mdLang": null,
//     "mdContact": null,
//     "contInfo": null,
//     "spatRepInfo": null,
//     "mdDateSt": null,
//     "dqInfo": null,
//     "mdStanVer": null,
//     "dataIdInfo": {
//       "serIdent": null,
//       "dataIdent": {
//         "dsFormat": null,
//         "idAbs": "自动注册用户数据发布的服务",
//         "dataScale": null,
//         "resType": null,
//         "dataLang": null,
//         "idPurp": null,
//         "graphOver": null,
//         "refTheme": null,
//         "tpCat": null,
//         "resSubType": null,
//         "idStatus": null,
//         "dataExt": null,
//         "idCitation": {
//           "resRefDate": null,
//           "resTitle": "data_hunan_tgni8phr",
//           "resEd": null
//         },
//         "spatRpType": null,
//         "dataChar": null,
//         "keyword": null,
//         "aggrInfo": null,
//         "idPoC": null,
//         "resConst": null
//       }
//     },
//     "refSysInfo": null,
//     "mdChar": null,
//     "distInfo": {
//       "onLineSrc": {
//         "orFunct": null,
//         "orDesc": null,
//         "linkage": "https://www.supermapol.com/proxy/iserver/services/data_hunan_tgni8phr/rest"
//       },
//       "distFormat": null,
//       "distributor": null
//     },
//     "mdFileID": "445802437",
//     "createdBy": null,
//     "mdStanName": null
//   },
//   "thumbnail": "https://www.supermapol.com/services/../web/static/portal/img/map/cloud.png",
//   "authorizeSetting": [{
//     "permissionType": "DELETE",
//     "aliasName": "ysl0917",
//     "entityRoles": [],
//     "entityType": "USER",
//     "entityName": "870694",
//     "entityId": null
//   }, {
//     "permissionType": "READWRITE",
//     "aliasName": null,
//     "entityRoles": [],
//     "entityType": "IPORTALGROUP",
//     "entityName": "test_online2",
//     "entityId": 890773284
//   }, {
//     "permissionType": "READWRITE",
//     "aliasName": null,
//     "entityRoles": [],
//     "entityType": "IPORTALGROUP",
//     "entityName": "GroupYSL",
//     "entityId": 1940910328
//   }, {
//     "permissionType": "READWRITE",
//     "aliasName": null,
//     "entityRoles": [],
//     "entityType": "IPORTALGROUP",
//     "entityName": "iTablet产品组",
//     "entityId": 2010361101
//   }],
//   "tags": ["托管服务"],
// }

interface ActionParams {
  layerData: SMap.LayerInfo,
}

/**
 * 获取工具操作
 * @param type
 * @param params
 * @returns {{data: Array, buttons: Array}}
 */
function getData(type: string, params: any) {
  let data: Type.ListItem[] = []
  let buttons: Type.ToolbarBottomButton[] = []
  let customView = null
  params && ToolbarModule.setParams(params)
  switch (type) {
    case ConstToolType.SM_MAP_SERVICE:
      data = [
        {
          key: 'update_local_service',
          title: getLanguage(GLOBAL.language).Cowork.UPDATE_LOCAL_SERVICE,
          action: ({ layerData }: ActionParams) => {
            const datasetDescription = LayerUtils.getDatasetDescriptionByLayer(layerData)
            if (datasetDescription.type !== 'onlineService') {
              return
            }
            ServiceAction.updateToLocal({
              url: datasetDescription.url,
              datasetName: layerData.datasetName,
            })
          },
          size: 'large',
          image: getThemeAssets().edit.icon_redo,
        },
        {
          key: 'submit_service',
          title: getLanguage(GLOBAL.language).Cowork.SUBMIT_SERVICE,
          action: ({ layerData }: ActionParams) => {
            const datasetDescription = LayerUtils.getDatasetDescriptionByLayer(layerData)
            if (datasetDescription.type !== 'onlineService') {
              return
            }
            ServiceAction.uploadToService({
              url: datasetDescription.url,
            })
          },
          image: getThemeAssets().mapTools.icon_submitdata,
        },
      ]
      break
    // case ConstToolType.SM_MAP_SERVICE_UPLOAD:
    //   data = [
    //     {
    //       key: 'upload_service',
    //       title: getLanguage(GLOBAL.language).Profile.PUBLISH_SERVICE,
    //       action: ({ layerData }: ActionParams) => {
    //         DialogUtils.showInputDailog({
    //           type: 'name',
    //           value: layerData.datasetName,
    //           placeholder: getLanguage(GLOBAL.language).Cowork.PLEASE_ENTER_SERCICE_NAME,
    //           confirmAction: async name => {
    //             if (!name) return
    //             const datasetDescription = LayerUtils.getDatasetDescriptionByLayer(layerData)
    //             if (datasetDescription.type === 'onlineService') {
    //               return
    //             }
    //             if (!layerData.datasetName) return
    //             DialogUtils.hideInputDailog()
    //             const _params: any = ToolbarModule.getParams()
    //             _params.setContainerLoading?.(true, getLanguage(_params.language).Prompt.PUBLISHING)
    //             const result = await ServiceAction.publishServiceToGroup(name, [layerData.datasetName], [{
    //               groupId: _params.currentGroup.id,
    //               groupName: _params.currentGroup.groupName,
    //             }])
    //             _params.setContainerLoading?.(false)
    //             if (result) {
    //               Toast.show(getLanguage(GLOBAL.language).Prompt.PUBLISH_SUCCESS)
    //             } else {
    //               Toast.show(getLanguage(GLOBAL.language).Prompt.PUBLISH_FAILED)
    //             }
    //           },
    //         })
    //       },
    //       image: getThemeAssets().cowork.icon_nav_export,
    //     },
    //   ]
  }
  return { data, buttons, customView }
}

export default {
  getData,
}
