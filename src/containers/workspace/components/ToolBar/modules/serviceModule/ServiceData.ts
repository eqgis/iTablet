/**
 * 获取地图工具数据
 */
import { SMap } from 'imobile_for_reactnative'
import { ConstToolType, ConstPath } from '../../../../../../constants'
import { getThemeAssets } from '../../../../../../assets'
import { getLanguage } from '../../../../../../language'
import { LayerUtils, DialogUtils, Toast } from '../../../../../../utils'
import * as Type from '../../../../../../types'
import ToolbarModule from '../ToolbarModule'
import ServiceAction, { DataServiceUrlParams } from './ServiceAction'
import { FileTools } from '../../../../../../native'
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
            if (datasetDescription?.type !== 'onlineService') {
              return
            }
            ServiceAction.updateToLocal({
              url: datasetDescription.url,
              datasourceAlias: layerData.datasourceAlias,
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
            if (datasetDescription?.type !== 'onlineService') {
              return
            }
            ServiceAction.uploadToService({
              // layerName: layerData.name,
              url: datasetDescription.url,
              datasourceAlias: layerData.datasourceAlias,
              datasetName: layerData.datasetName,
              onlineDatasourceAlias: datasetDescription.datasourceAlias,
            })
          },
          image: getThemeAssets().mapTools.icon_submitdata,
        },
      ]
      break
    case ConstToolType.SM_MAP_SERVICE_UPLOAD:
      data = [
        {
          key: 'upload_service',
          title: getLanguage(GLOBAL.language).Profile.PUBLISH_SERVICE,
          action: ({ layerData }: ActionParams) => {
            const _params: any = ToolbarModule.getParams()
            const name = layerData.datasourceAlias?.indexOf('Label_') === 0 ? ('Tagging_' + _params.map.currentMap.name) : layerData.datasourceAlias
            GLOBAL.SimpleDialog.set({
              text: getLanguage(GLOBAL.language).Profile.PUBLISH_SERVICE + ' ' + name,
              cancelText: getLanguage(GLOBAL.language).Prompt.NO,
              cancelAction: async () => {
                GLOBAL.Loading.setLoading(false)
              },
              confirmText: getLanguage(GLOBAL.language).Prompt.YES,
              confirmAction: async () => {
                await SMap.checkCurrentModule()
                if (!name) return
                const datasetDescription = LayerUtils.getDatasetDescriptionByLayer(layerData)
                if (datasetDescription?.type === 'onlineService') {
                  return
                }
                if (!layerData.datasetName) return
                DialogUtils.hideInputDailog()
                const _params: any = ToolbarModule.getParams()
                // 设置开始发布
                await _params.setCoworkService({
                  groupId: _params.currentTask.groupID,
                  taskId: _params.currentTask.id,
                  service: {
                    layerName: layerData.name,
                    status: 'publish',
                  },
                })
                // _params.setContainerLoading?.(true, getLanguage(_params.language).Prompt.PUBLISHING)

                let datasourcePath = await FileTools.appendingHomeDirectory()
                if (layerData?.datasourceAlias?.indexOf('Label_' + _params.user.currentUser.userName) === 0) {
                  datasourcePath += ConstPath.UserPath + _params.user.currentUser.userName + '/' +
                  ConstPath.RelativePath.Label +
                  'Label_' +
                  _params.user.currentUser.userName +
                  '#.udb'
                } else {
                  datasourcePath += ConstPath.UserPath + _params.user.currentUser.userName + '/' +
                  ConstPath.RelativePath.Datasource +
                  layerData.datasourceAlias + '.udb'
                }
                if (layerData.datasourceAlias) {
                  const {result, content} = await ServiceAction.publishServiceToGroup(name, {
                    layerName: layerData.name,
                    datasourceAlias: layerData.datasourceAlias,
                    datasourcePath,
                    datasets: [layerData.datasetName],
                  }, [{
                    groupId: _params.currentGroup.id,
                    groupName: _params.currentGroup.groupName,
                  }])
                  // _params.setContainerLoading?.(false)

                  if (result) {
                    let keywords: string[] = []
                    let _content: DataServiceUrlParams[] = []
                    content?.forEach(item => {
                      _content.push({
                        id: item.id,
                        datasourceAlias: layerData.datasourceAlias || '',
                        datasetName: layerData.datasetName || '',
                      })
                      keywords.push(item.resTitle)
                    })
                    await ServiceAction.setDataService({
                      groupID: _params.currentGroup.id,
                      keywords: keywords,
                      content: _content,
                    })
                    await _params.getLayers?.()
                    if (_params.currentLayer?.name === layerData.name) {
                      const _layer = await SMap.getLayerInfo?.(layerData.path)
                      _params.setCurrentLayer?.(_layer)
                    }
                    Toast.show(getLanguage(GLOBAL.language).Prompt.PUBLISH_SUCCESS)
                  } else {
                    Toast.show(getLanguage(GLOBAL.language).Prompt.PUBLISH_FAILED)
                  }
                } else {
                  Toast.show(getLanguage(GLOBAL.language).Prompt.PUBLISH_FAILED)
                }
              },
            })
            GLOBAL.SimpleDialog.setVisible(true)
            // DialogUtils.showInputDailog({
            //   type: 'name',
            //   value: layerData.datasetName,
            //   placeholder: getLanguage(GLOBAL.language).Cowork.PLEASE_ENTER_SERCICE_NAME,
            //   confirmAction: async name => {
            //     await SMap.checkCurrentModule()
            //     if (!name) return
            //     const datasetDescription = LayerUtils.getDatasetDescriptionByLayer(layerData)
            //     if (datasetDescription?.type === 'onlineService') {
            //       return
            //     }
            //     if (!layerData.datasetName) return
            //     DialogUtils.hideInputDailog()
            //     const _params: any = ToolbarModule.getParams()
            //     // 设置开始发布
            //     await _params.setCoworkService({
            //       groupId: _params.currentTask.groupID,
            //       taskId: _params.currentTask.id,
            //       service: {
            //         layerName: layerData.name,
            //         status: 'publish',
            //       },
            //     })
            //     // _params.setContainerLoading?.(true, getLanguage(_params.language).Prompt.PUBLISHING)

            //     let datasourcePath = await FileTools.appendingHomeDirectory()
            //     if (layerData?.datasourceAlias?.indexOf('Label_' + _params.user.currentUser.userName) === 0) {
            //       datasourcePath += ConstPath.UserPath + _params.user.currentUser.userName + '/' +
            //       ConstPath.RelativePath.Label +
            //       'Label_' +
            //       _params.user.currentUser.userName +
            //       '#.udb'
            //     } else {
            //       datasourcePath += ConstPath.UserPath + _params.user.currentUser.userName + '/' +
            //       ConstPath.RelativePath.Datasource +
            //       layerData.datasourceAlias + '.udb'
            //     }
            //     if (layerData.datasourceAlias) {
            //       const {result, content} = await ServiceAction.publishServiceToGroup(name, {
            //         layerName: layerData.name,
            //         datasourceAlias: layerData.datasourceAlias,
            //         datasourcePath,
            //         datasets: [layerData.datasetName],
            //       }, [{
            //         groupId: _params.currentGroup.id,
            //         groupName: _params.currentGroup.groupName,
            //       }])
            //       // _params.setContainerLoading?.(false)

            //       if (result) {
            //         let keywords: string[] = []
            //         let _content: DataServiceUrlParams[] = []
            //         content?.forEach(item => {
            //           _content.push({
            //             id: item.id,
            //             datasourceAlias: layerData.datasourceAlias || '',
            //             datasetName: layerData.datasetName || '',
            //           })
            //           keywords.push(item.resTitle)
            //         })
            //         await ServiceAction.setDataService({
            //           groupID: _params.currentGroup.id,
            //           keywords: keywords,
            //           content: _content,
            //         })
            //         await _params.getLayers?.()
            //         if (_params.currentLayer?.name === layerData.name) {
            //           const _layer = await SMap.getLayerInfo?.(layerData.path)
            //           _params.setCurrentLayer?.(_layer)
            //         }
            //         Toast.show(getLanguage(GLOBAL.language).Prompt.PUBLISH_SUCCESS)
            //       } else {
            //         Toast.show(getLanguage(GLOBAL.language).Prompt.PUBLISH_FAILED)
            //       }
            //     } else {
            //       Toast.show(getLanguage(GLOBAL.language).Prompt.PUBLISH_FAILED)
            //     }
            //   },
            // })
          },
          image: getThemeAssets().cowork.icon_nav_export,
        },
      ]
  }
  return { data, buttons, customView }
}

export default {
  getData,
}
