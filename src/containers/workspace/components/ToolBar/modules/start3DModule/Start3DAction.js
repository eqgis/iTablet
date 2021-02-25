import React from 'react'
import { TouchableOpacity, Text, Image, View } from 'react-native'
import { FileTools } from '../../../../../../native'
import {
  ConstToolType,
  ConstPath,
  ToolbarType,
} from '../../../../../../constants'
import { SScene } from 'imobile_for_reactnative'
import { Toast, scaleSize } from '../../../../../../utils'
import { size, color } from '../../../../../../styles'
import { getLanguage } from '../../../../../../language'
import ToolbarModule from '../ToolbarModule'
import NavigationService from '../../../../../NavigationService'
import { getThemeAssets } from '../../../../../../assets'

let onlineScenceData = [
  // {
  //   name: 'SKYCBD_webp',
  //   server: 'http://10.10.45.151:8090/iserver/services/3D-SKYCBD_webp/rest/realspace',
  //   mtime: '',
  //   isOnlineScence: true,
  //   image : getThemeAssets().share.online,
  // },
  // {
  //   name: 'SunCBD_webp',
  //   server: 'http://10.10.45.151:8090/iserver/services/3D-SunCBD_webp/rest/realspace',
  //   mtime: '',
  //   isOnlineScence: true,
  //   image : getThemeAssets().share.online,
  // }
]

async function getSceneData() {
  const params = ToolbarModule.getParams()
  const buttons = []
  const data = []
  try {
    // let buttons = [ToolbarBtnType.CANCEL, ToolbarBtnType.FLEX]
    const userName = params.user.currentUser.userName || 'Customer'
    const path = await FileTools.appendingHomeDirectory(
      `${ConstPath.UserPath + userName}/${ConstPath.RelativeFilePath.Scene}`,
    )
    const result = await FileTools.fileIsExist(path)
    if (result) {
      const fileList = await FileTools.getPathListByFilter(path, {
        extension: 'pxp',
        type: 'file',
      })
      const _data = []
      for (let index = 0; index < fileList.length; index++) {
        const element = fileList[index]
        if (element.name.indexOf('.pxp') > -1) {
          fileList[index].name = element.name.substr(
            0,
            element.name.lastIndexOf('.'),
          )
          if (params.language === 'EN') {
            const day = element.mtime
              .replace(/年|月|日/g, '/')
              .split('  ')[0]
              .split('/')
            const info = `${day[2]}/${day[1]}/${day[0]}  ${
              element.mtime.split('  ')[1]
            }`
            element.mtime = info
          }
          element.subTitle = element.mtime
          element.image = getThemeAssets().mine.my_scene
          if (element.name === GLOBAL.sceneName && !element.isOnlineScence) {
            element.rightView = (
              <View
                style={{
                  height: '100%',
                  flexDirection: 'column',
                  // justifyContent: 'center',
                  alignItems: 'flex-start',
                }}
              >
                <View
                  style={{
                    marginTop: scaleSize(8),
                    marginRight: scaleSize(8),
                    paddingHorizontal: scaleSize(8),
                    // height: scaleSize(30),
                    // width: scaleSize(120),
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
                    {getLanguage(params.language).Map_Main_Menu.CURRENT_SCENCE}
                  </Text>
                </View>
              </View>
            )
          }
          _data.push(element)
        }
      }
      data.push({
        // image: require('../../../../../../assets/mapToolbar/list_type_maps.png'),
        image: getThemeAssets().mine.my_scene,
        title: getLanguage(params.language).Map_Label.SCENE,
        data: _data,
      })
    }
  } catch (error) {
    Toast.show(getLanguage(params.language).Prompt.NO_SCENE_LIST)
  }

  // let _extraData = {
  //   title: getLanguage(params.language).Map_Main_Menu.OPEN,
  //   image: require('../../../../../../assets/mapTools/icon_add_white.png'),
  //   action: addOnlineScene,
  // }
  // data[0].extraData = _extraData
  // if (onlineScenceData.length > 0) {
  //   for (let i = 0; i < onlineScenceData.length; i++) {
  //     data[0].data.push({
  //       name: onlineScenceData[i].name,
  //       server: onlineScenceData[i].server,
  //       mtime: '',
  //       isOnlineScence: true,
  //       image: getThemeAssets().share.online,
  //     })
  //   }
  // }
  
  function renderRightButton ({title, image, action}) {
    return (
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          height: scaleSize(80),
          marginRight: scaleSize(30),
        }}
        onPress={() => action && action()}
      >
        {title && (
          <Text
            numberOfLines={1}
            ellipsizeMode={'tail'}
            style={{
              fontSize: size.fontSize.fontSizeMd,
              height: scaleSize(30),
              backgroundColor: 'transparent',
              color: color.fontColorBlack,
              textAlignVertical: 'center',
              textAlign: 'right',
            }}
          >
            {title}
          </Text>
        )}
        {image && (
          <Image
            source={image}
            resizeMode={'contain'}
            style={{
              width: scaleSize(40),
              height: scaleSize(40),
            }}
          />
        )}
      </TouchableOpacity>
    )
  }

  data[0].buttons = [
    renderRightButton({
      title: getLanguage(params.language).Map_Main_Menu.OPEN,
      // image: require('../../../../../../assets/mapTools/icon_add_white.png'),
      image: getThemeAssets().dataType.icon_newdata,
      action: addOnlineScene,
    }),
    renderRightButton({
      title: getLanguage(GLOBAL.language).Profile.SAMPLEDATA,
      action: () => {
        NavigationService.navigate('SampleMap', {
          refreshAction: getSceneData,
        })
      },
    }),
  ]
  if (onlineScenceData.length > 0) {
    for (let i = 0; i < onlineScenceData.length; i++) {
      data[0].data.push({
        name: onlineScenceData[i].name,
        server: onlineScenceData[i].server,
        mtime: '',
        isOnlineScence: true,
        image: getThemeAssets().share.online,
      })
    }
  }

  const type = ConstToolType.SM_MAP3D_WORKSPACE_LIST
  ToolbarModule.getParams().setToolbarVisible(true, type, {
    containerType: ToolbarType.list,
    isFullScreen: true,
    data,
    buttons,
  })
}

function openScene(item) {
  const _params = ToolbarModule.getParams()
  if (item.name === GLOBAL.sceneName && !item.isOnlineScence) {
    Toast.show(getLanguage(_params.language).Prompt.THE_SCENE_IS_OPENED)
    // '场景已打开,请勿重复打开场景')
    return
  }
  SScene.openScence(item.name).then(() => {
    SScene.setNavigationControlVisible(false)
    SScene.setListener()
    SScene.getAttribute()
    SScene.setCircleFly()
    SScene.setAction('PAN3D')
    SScene.changeBaseLayer(1)
    GLOBAL.action3d = 'PAN3D'
    GLOBAL.openWorkspace = true
    GLOBAL.sceneName = item.name
    
    // let MapInfo = {name:item.name,path:item.path},userName:_params.user.currentUser.userId,moduleName:"Map3D"}
    //保存三维打开的历史场景 add xiezhy
    _params.setCurrentMap({name:item.name,path:item.path},{userName:_params.user.currentUser.userId,moduleName:"MAP_3D"})
    _params.refreshLayer3dList && _params.refreshLayer3dList()
    _params.existFullMap && _params.existFullMap(true)
    _params.setToolbarVisible(false)
    GLOBAL.OverlayView && GLOBAL.OverlayView.setVisible(false)

    _params.changeLayerList && _params.changeLayerList()
  })
}

//打开在线场景
function openOnlineScene(item) {
  const _params = ToolbarModule.getParams()
  if (item.name === GLOBAL.sceneName) {
    Toast.show(getLanguage(_params.language).Prompt.THE_SCENE_IS_OPENED)
    // '场景已打开,请勿重复打开场景')
    return
  }
  SScene.openOnlineScene(item.name, item.server).then(result => {
    // SScene.openOnlineScene(name,server).then((result) => {

    if (!result) {
      Toast.show(getLanguage(_params.language).Prompt.NO_SCENE)
      return
    }

    SScene.setNavigationControlVisible(false)
    SScene.setListener()
    SScene.getAttribute()
    SScene.setCircleFly()
    SScene.setAction('PAN3D')
    SScene.changeBaseLayer(1)
    GLOBAL.action3d = 'PAN3D'
    GLOBAL.openWorkspace = true
    GLOBAL.sceneName = item.name
    _params.refreshLayer3dList && _params.refreshLayer3dList()
    _params.existFullMap && _params.existFullMap(true)
    _params.setToolbarVisible(false)
    GLOBAL.OverlayView && GLOBAL.OverlayView.setVisible(false)

    _params.changeLayerList && _params.changeLayerList()
  })
}

async function listAction(type, params = {}) {
  switch (type) {
    case ConstToolType.SM_MAP3D_WORKSPACE_LIST:
      if (params.item.isOnlineScence) {
        openOnlineScene(params.item)
        return
      }
      openScene(params.item)
      break
  }
}

//添加在线三维场景
async function addOnlineScene() {
  NavigationService.navigate('AddOnlineScense', {
    cb: _onlineScenseData => {
      onlineScenceData.push(_onlineScenseData)
      getSceneData()
      NavigationService.goBack()
    },
  })
}

export default {
  listAction,
  getSceneData,
  addOnlineScene,
}
