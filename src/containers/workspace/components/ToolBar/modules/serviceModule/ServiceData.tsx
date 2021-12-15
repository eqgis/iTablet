/**
 * 获取地图工具数据
 */
import React from 'react'
import { SMap } from 'imobile_for_reactnative'
import { ConstToolType, ConstPath, ToolbarType } from '../../../../../../constants'
import { ImageButton } from '../../../../../../components'
import { getThemeAssets } from '../../../../../../assets'
import { getLanguage } from '../../../../../../language'
import { LayerUtils, DialogUtils, Toast, SCoordinationUtils, scaleSize } from '../../../../../../utils'
import * as Type from '../../../../../../types'
import ToolbarModule from '../ToolbarModule'
import ServiceAction, { DataServiceUrlParams } from './ServiceAction'
import { FileTools } from '../../../../../../native'
import ToolbarBtnType from '../../ToolbarBtnType'
interface ActionParams {
  layerData: SMap.LayerInfo,
}

/**
 * 获取工具操作
 * @param type
 * @param params
 * @returns {{data: Array, buttons: Array}}
 */
async function getData(type: string, params: any) {
  let data: Type.ListItem[] = []
  let buttons: Type.ToolbarBottomButton[] = []
  let customView = null
  params && ToolbarModule.setParams(params)
  switch (type) {
    case ConstToolType.SM_MAP_SERVICE: {
      const result = await ServiceAction.getGroupServices(params.currentTask.groupID)
      let _data: any = []
      if (result?.content?.length > 0) {
        let datasources = await SMap.getDatasources() || []
        // let services = []
        const mapName = params.map?.currentMap?.name?.replace(/_[0-9]+$/g, '') || ''
        result.content.forEach(item => {
          let exist = false
          // 查询服务所在数据源是否在当前地图已经打开
          // 若没打开,则过滤掉
          for (const datasource of datasources) {
            let serviceUDBName = item.resourceName.substring(item.resourceName.indexOf('_') + 1, item.resourceName.lastIndexOf('_'))
            // 判断是否发布时,本地打包的名字自动添加了 -数字- 后缀
            const reg = /-[0-9]+-$/
            serviceUDBName = serviceUDBName.replace(reg, '')
            if (
              exist ||
              serviceUDBName.toLocaleLowerCase() === mapName.toLocaleLowerCase() || // 服务数据是地图数据
              serviceUDBName.toLocaleLowerCase() === datasource.alias.toLocaleLowerCase() || // 服务数据是数据源数据
              serviceUDBName.toLocaleLowerCase().indexOf('tagging_') === 0 ||
              serviceUDBName.toLocaleLowerCase().indexOf('default_tagging') === 0
            ) {
              exist = true
              break
            }
          }
          exist && _data.push({
            key: item.resourceId,
            title: item.resourceName,
            subTitle: new Date(item.createTime).Format("yyyy-MM-dd hh:mm:ss"),
            data: item,
            size: 'large',
            image: getThemeAssets().dataType.icon_data_source,
            rightView: _renderRightView(item),
          })
        })
      }
      data = [{
        key: getLanguage(GLOBAL.language).Profile.MY_SERVICE,
        title: getLanguage(GLOBAL.language).Profile.MY_SERVICE,
        image: getThemeAssets().mine.my_service,
        data: _data,
      }]
      break
    }
    case ConstToolType.SM_MAP_SERVICE_DATASET:{
      const _data: any = ToolbarModule.getData()

      let result = await SCoordinationUtils.getScoordiantion().getServiceData(_data.datasourceUrl, _data.datasourceName)

      let _subData: any[] = []
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
      data = [{
        key: _data.datasourceName,
        // title: getLanguage(GLOBAL.language).Map_Settings.DATASETS,
        title: _data.datasourceName,
        image: getThemeAssets().dataType.icon_data_set,
        data: _subData,
        allSelectType: true,
      }]
      buttons = [ToolbarBtnType.TOOLBAR_BACK, ToolbarBtnType.TOOLBAR_COMMIT]
      break
    }
    case ConstToolType.SM_MAP_SERVICE_UPDATE:
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
            const isTaggingLayer = layerData.datasourceAlias?.indexOf('Label_') === 0
            const name = isTaggingLayer ? ('Tagging_' + _params.map.currentMap.name) : layerData.datasourceAlias
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

                if (!isTaggingLayer && !datasetDescription && _params?.currentTask?.resource?.resourceId && layerData.datasourceAlias) {
                  const {result, content} = await ServiceAction.publishService(_params?.currentTask?.resource?.resourceId, layerData.datasourceAlias, [{
                    groupId: _params.currentGroup.id,
                    groupName: _params.currentGroup.groupName,
                  }])
                  content.length > 0 && await SCoordinationUtils.initMapDataWithService(content[0].proxiedUrl)
                  await SMap.refreshMap()
                  await _params.getLayers()
                  _params.setCoworkService({
                    groupId: _params.currentTask.groupID,
                    taskId: _params.currentTask.id,
                    service: {
                      layerName: layerData.name,
                      status: 'done',
                    },
                  })
                  if (result) {
                    Toast.show(getLanguage(GLOBAL.language).Prompt.PUBLISH_SUCCESS)
                  } else {
                    Toast.show(getLanguage(GLOBAL.language).Prompt.PUBLISH_FAILED)
                  }
                } else {
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

function _renderRightView(item: any) {
  return (
    <ImageButton
      containerStyle={{
        width: scaleSize(80),
        height: scaleSize(80),
        justifyContent: 'center',
        alignItems: 'center',
        backgroudColor: 'red',
        marginRight: scaleSize(30),
      }}
      iconStyle={{width: scaleSize(44), height: scaleSize(44)}}
      icon={getThemeAssets().cowork.icon_nav_import}
      onPress={() => {
        ServiceAction.downloadService(item?.linkPage)
      }}
    />
  )
}

export default {
  getData,
}
