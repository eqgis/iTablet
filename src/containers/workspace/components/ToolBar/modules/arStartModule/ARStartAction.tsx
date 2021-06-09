/* global GLOBAL */
import React from 'react'
import { Text, View } from 'react-native'
import {
  SARMap,
  FiltedData,
} from 'imobile_for_reactnative'
import { color, size } from '../../../../../../styles'
import { getThemeAssets } from '../../../../../../assets'
import {
  ConstToolType,
  ToolbarType,
} from '../../../../../../constants'
import { Toast, scaleSize } from '../../../../../../utils'
import NavigationService from '../../../../../NavigationService'
import { getLanguage } from '../../../../../../language'
import ToolbarModule from '../ToolbarModule'
import DataHandler from '../../../../../tabs/Mine/DataHandler'

interface ListData extends FiltedData {
  title: string,
  image?: any,
  isTemplate?: boolean,
  info?: {
    infoType: string,
    lastModifiedDate: string,
    isTemplate: boolean,
  },
  rightView?: React.ReactElement,
}

/** 打开地图 * */
function openMap() {
  const _params: any = ToolbarModule.getParams()
  if (!_params.setToolbarVisible) return
  _params.showFullMap && _params.showFullMap(true)
  ;(async function() {
    const data = []

    let userFileList
    userFileList = await await DataHandler.getLocalData(
      _params.user.currentUser,
      'ARMAP',
    )
    if (userFileList && userFileList.length > 0) {
      const userList = []
      userFileList.forEach((item: ListData) => {
        const { name } = item
        item.title = name
        item.name = name.split('.')[0]
        item.image = getThemeAssets().mine.my_armap
        item.info = {
          infoType: 'mtime',
          lastModifiedDate: item.mtime,
          isTemplate: !!item.isTemplate,
        }
        if (_params.armap.currentMap?.mapName === item.name) {
          item.rightView = (
            <View
              style={{
                height: '100%',
                flexDirection: 'column',
                alignItems: 'flex-start',
              }}
            >
              <View
                style={{
                  marginTop: scaleSize(8),
                  marginRight: scaleSize(8),
                  paddingHorizontal: scaleSize(8),
                  borderRadius: scaleSize(4),
                  backgroundColor: color.bgG,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    fontSize: size.fontSize.fontSizeSm,
                    color: 'white',
                    backgroundColor: 'transparent',
                  }}
                >
                  {getLanguage(_params.language).Map_Main_Menu.CURRENT_MAP}
                </Text>
              </View>
            </View>
          )
        }
        userList.push(item)
      })
    }
    data.push({
      title: getLanguage(GLOBAL.language).Map_Main_Menu.OPEN_MAP,
      image: getThemeAssets().mine.my_armap,
      data: userFileList || [],
    })
    _params.setToolbarVisible(true, ConstToolType.SM_AR_START_OPEN_MAP, {
      containerType: ToolbarType.list,
      data,
    })
  })()
}

/** 判断是否保存 * */
function isNeedToSave(cb: () => void) {
  const _params: any = ToolbarModule.getParams()
  if (_params.armap.currentMap?.mapName) {
    setSaveViewVisible(true, cb)
  } else {
    cb()
  }
}

function setSaveViewVisible(visible: boolean, cb: () => void) {
  const _params: any = ToolbarModule.getParams()
  if (!_params.setSaveViewVisible) return
  let mapName = _params.armap.currentMap.mapName
  mapName =
    mapName.substr(0, mapName.lastIndexOf('.')) ||
    _params.armap.currentMap.mapName
  GLOBAL.SaveMapView && GLOBAL.SaveMapView.setVisible(visible, {
    cb,
    customSave: async ()=>await _saveMap(mapName),
  })
}

async function _saveMap(name: string) {
  try {
    const _params: any = ToolbarModule.getParams()
    const result = await _params.saveARMap(name)
    _params.setContainerLoading &&
      _params.setContainerLoading(false)
    result &&
      _params.setToolbarVisible &&
      _params.setToolbarVisible(false)
    Toast.show(
      result
        ? getLanguage(GLOBAL.language).Prompt.SAVE_SUCCESSFULLY
        : getLanguage(GLOBAL.language).Prompt.SAVE_FAILED,
    )
    return result
  } catch(e) {
    throw e
  }
}

/** 保存地图 * */
async function createMap() {
  const _params: any = ToolbarModule.getParams()
  try {
    NavigationService.navigate('InputPage', {
      headerTitle: getLanguage(GLOBAL.language).Map_Main_Menu.START_NEW_MAP,
      placeholder: getLanguage(GLOBAL.language).Prompt.ENTER_MAP_NAME,
      type: 'name',
      cb: async (value: string) => {
        let result = await _params.createARMap(value)
        result && NavigationService.goBack('InputPage')
        _params.setContainerLoading &&
          _params.setContainerLoading(false)
        _params.setToolbarVisible(false)
      },
    })
  } catch (e) {
    _params.setContainerLoading &&
      _params.setContainerLoading(false)
    Toast.show(getLanguage(GLOBAL.language).Prompt.SAVE_FAILED)
  }
}

/** 保存地图 * */
async function saveMap() {
  const _params: any = ToolbarModule.getParams()
  try {
    if (_params.armap.currentMap?.mapName) {
      _params.setContainerLoading &&
      _params.setContainerLoading(
        true,
        getLanguage(GLOBAL.language).Prompt.SAVING,
      )
      let mapName = _params.armap.currentMap.mapName
      mapName =
        mapName.substr(0, mapName.lastIndexOf('.')) ||
        _params.armap.currentMap.mapName
      const result = await _saveMap(mapName)
      _params.setContainerLoading && _params.setContainerLoading(false)
      Toast.show(result ? getLanguage(GLOBAL.language).Prompt.SAVE_SUCCESSFULLY : getLanguage(GLOBAL.language).Prompt.SAVE_FAILED)
    } else {
      NavigationService.navigate('InputPage', {
        headerTitle: getLanguage(GLOBAL.language).Map_Main_Menu.START_SAVE_MAP,
        placeholder: getLanguage(GLOBAL.language).Prompt.ENTER_MAP_NAME,
        type: 'name',
        cb: async (value: string) => {
          _params.setContainerLoading &&
          _params.setContainerLoading(
            true,
            getLanguage(GLOBAL.language).Prompt.SAVING,
          )
          const result = await _saveMap(value)
          result && NavigationService.goBack('InputPage')
          Toast.show(result ? getLanguage(GLOBAL.language).Prompt.SAVE_SUCCESSFULLY : getLanguage(GLOBAL.language).Prompt.SAVE_FAILED)
        },
      })
    }
  } catch (e) {
    _params.setContainerLoading &&
      _params.setContainerLoading(false)
    Toast.show(getLanguage(GLOBAL.language).Prompt.SAVE_FAILED)
  }
}

/** 切换地图 * */
async function changeMap(item: ListData) {
  const params: any = ToolbarModule.getParams()
  // 不是从xml加载地图
  GLOBAL.IS_MAP_FROM_XML = false
  try {
    if (params.armap.currentMap && params.armap.currentMap.mapName === item.title) {
      Toast.show(getLanguage(params.language).Prompt.THE_MAP_IS_OPENED)
      return
    }
    params.setContainerLoading(
      true,
      getLanguage(params.language).Prompt.SWITCHING,
    )
    await SARMap.close()
    await DataHandler.closeARRawDatasource()
    const result = await params.openARMap(item.name)
    if(result) {
      const layers = await params.getARLayers()
      if (layers.length > 0) {
        await params.setCurrentARLayer(layers[0])
      }
      ToolbarModule.addData({
        addNewDSourceWhenCreate: false,
      })
      params.setContainerLoading(false)
      Toast.show(getLanguage(params.language).Prompt.SWITCHING_SUCCESS)
      params.setToolbarVisible(false)
    } else {
      params.setContainerLoading(false)
      Toast.show(getLanguage(params.language).Prompt.THE_MAP_IS_NOTEXIST)
    }
  } catch (e) {
    Toast.show(getLanguage(params.language).Prompt.THE_MAP_IS_NOTEXIST)
    params.setContainerLoading(false)
  }
}

async function closeMap() {
  const params: any = ToolbarModule.getParams()
  await params.closeARMap()
  await params.getARLayers()
  params.setToolbarVisible(false)
}

async function listAction(type: string, params: any) {
  const _params: any = ToolbarModule.getParams()
  switch (type) {
    case ConstToolType.SM_AR_START_OPEN_MAP:
      changeMap(params.item)
      _params.getMapSetting()
      break
  }
}

export default {
  listAction,
  isNeedToSave,
  openMap,
  closeMap,
  saveMap,
  createMap,
}
