import React from 'react'
import { getThemeAssets } from '@/assets'
import constants from '@/containers/workspace/constants'
import ToolbarBtnType from '@/containers/workspace/components/ToolBar/ToolbarBtnType'
import { getLanguage } from '@/language'
import CheckAction from './CheckAction'
import { AppletsToolType } from '../../constants'
import ToolbarModule from '@/containers/workspace/components/ToolBar/modules/ToolbarModule'
import { CheckButtons } from './component'
import { ConstPath } from '@/constants'
import { FileTools } from 'imobile_for_reactnative'
import { MTBtn } from '@/components'
import { getImage } from '../../assets'
import { scaleSize, setSpText } from '@/utils'
import NavigationService from '@/containers/NavigationService'

interface DataItem {
  key: string;
  title: string;
  action: (type?: any) => (Promise<boolean | void> | void);
  size: string;
  image: any;
  selectMode?: string,
  disable?: boolean,
}

/**
 * 获取编辑操作
 * @param type
 * @returns {{data: Array, buttons: Array}}
 */
function getData(type: string | number) {
  let data: DataItem[] = [] // 底部弹出工具栏内容
  let buttons: any[] = []   // 底部弹出工具栏内容下面的按钮(例如:返回,收缩,确认等)
  let customView = null     // 自定义组件,代替data显示
  if (typeof type === 'string' && type.indexOf(AppletsToolType.APPLETS_CHECK_EDIT) === -1) {
    return { data, buttons }
  }
  // 核查工具类型为 APPLETS_CHECK_EDIT
  // 其子类型 同一命名 APPLETS_CHECK_EDIT_XXXXX (必须)
  switch (type) {
    case AppletsToolType.APPLETS_CHECK_EDIT_POINT:
      data = [
        {
          key: constants.MOVE,
          title: getLanguage(global.language).Map_Main_Menu.MOVE,
          action: CheckAction.move,
          size: 'large',
          image: getThemeAssets().edit.icon_translation,
        },
        {
          key: constants.DELETE,
          title: getLanguage(global.language).Map_Main_Menu.EDIT_DELETE,
          action: CheckAction.remove,
          size: 'large',
          image: getThemeAssets().edit.icon_delete,
        },
        {
          key: constants.UNDO,
          title: getLanguage(global.language).Map_Main_Menu.COLLECTION_UNDO,
          action: () => CheckAction.undo(),
          size: 'large',
          image: getThemeAssets().edit.icon_undo,
        },
        {
          key: 'redo',
          title: getLanguage(global.language).Map_Main_Menu.COLLECTION_REDO,
          action: () => CheckAction.redo(),
          size: 'large',
          image: getThemeAssets().edit.icon_redo,
        },
      ]
      break
    case AppletsToolType.APPLETS_CHECK_EDIT_LINE:
      data = [
        {
          key: constants.MOVE,
          title: getLanguage(global.language).Map_Main_Menu.MOVE,
          action: CheckAction.move,
          size: 'large',
          image: getThemeAssets().edit.icon_translation,
        },
        {
          key: constants.DELETE,
          title: getLanguage(global.language).Map_Main_Menu.EDIT_DELETE,
          action: CheckAction.remove,
          size: 'large',
          image: getThemeAssets().edit.icon_delete,
          selectMode: 'flash',
        },
        {
          key: constants.UNDO,
          title: getLanguage(global.language).Map_Main_Menu.COLLECTION_UNDO,
          action: CheckAction.undo,
          size: 'large',
          image: getThemeAssets().edit.icon_undo,
          selectMode: 'flash',
        },
        {
          key: constants.REDO,
          title: getLanguage(global.language).Map_Main_Menu.COLLECTION_REDO,
          action: CheckAction.redo,
          size: 'large',
          image: getThemeAssets().edit.icon_redo,
          selectMode: 'flash',
        },
        {
          key: constants.EDIT_NODE,
          title: getLanguage(global.language).Map_Main_Menu.EDIT_NODES,
          action: CheckAction.editNode,
          size: 'large',
          image: getThemeAssets().edit.icon_edit_node,
        },
        {
          key: constants.DELETE_NODE,
          title: getLanguage(global.language).Map_Main_Menu.EDIT_DELETE_NODES,
          action: CheckAction.deleteNode,
          size: 'large',
          image: getThemeAssets().edit.icon_delete_node,
        },
        {
          key: constants.ADD_NODE,
          title: getLanguage(global.language).Map_Main_Menu.EDIT_ADD_NODES,
          action: CheckAction.addNode,
          size: 'large',
          image: getThemeAssets().edit.icon_add_node,
        },
      ]
      break
    case AppletsToolType.APPLETS_CHECK_EDIT_REGION:
      data = [
        {
          key: constants.MOVE,
          title: getLanguage(global.language).Map_Main_Menu.MOVE,
          action: CheckAction.move,
          size: 'large',
          image: getThemeAssets().edit.icon_translation,
        },
        {
          key: constants.DELETE,
          title: getLanguage(global.language).Map_Main_Menu.EDIT_DELETE,
          size: 'large',
          action: CheckAction.remove,
          image: getThemeAssets().edit.icon_delete,
        },
        {
          key: constants.UNDO,
          title: getLanguage(global.language).Map_Main_Menu.COLLECTION_UNDO,
          size: 'large',
          action: CheckAction.undo,
          image: getThemeAssets().edit.icon_undo,
        },
        {
          key: constants.REDO,
          title: getLanguage(global.language).Map_Main_Menu.COLLECTION_REDO,
          size: 'large',
          action: CheckAction.redo,
          image: getThemeAssets().edit.icon_redo,
        },
        {
          key: constants.EDIT_NODE,
          title: getLanguage(global.language).Map_Main_Menu.EDIT_NODES,
          size: 'large',
          action: CheckAction.editNode,
          image: getThemeAssets().edit.icon_edit_node,
        },
        {
          key: constants.DELETE_NODE,
          title: getLanguage(global.language).Map_Main_Menu.EDIT_DELETE_NODES,
          size: 'large',
          action: CheckAction.deleteNode,
          image: getThemeAssets().edit.icon_delete_node,
        },
        {
          key: constants.ADD_NODE,
          title: getLanguage(global.language).Map_Main_Menu.EDIT_ADD_NODES,
          size: 'large',
          action: CheckAction.addNode,
          image: getThemeAssets().edit.icon_add_node,
        },
      ]
      //协作时暂不支持以下操作
      if(!global.coworkMode) {
        data.push(
          {
            key: constants.ERASE_REGION,
            title: getLanguage(global.language).Map_Main_Menu.EDIT_ERASE,
            size: 'large',
            action: CheckAction.eraseRegion,
            image: getThemeAssets().edit.icon_erase_noodles,
          },
          {
            key: constants.SPLIT_REGION,
            title: getLanguage(global.language).Map_Main_Menu.EDIT_SPLIT,
            size: 'large',
            action: CheckAction.splitRegion,
            image: getThemeAssets().edit.icon_cutting,
          },
          {
            key: constants.MERGE,
            title: getLanguage(global.language).Map_Main_Menu.EDIT_UNION,
            size: 'large',
            action: CheckAction.merge,
            image: getThemeAssets().edit.icon_merge,
          },
          {
            key: constants.DRAWREGION_ERASE_REGION,
            title: getLanguage(global.language).Map_Main_Menu.FREE_DRAW_ERASE,
            size: 'large',
            action: CheckAction.drawRegionEraseRegion,
            image: getThemeAssets().edit.icon_erase_spot,
          },
          {
            key: constants.DRAWREGION_HOLLOW_REGION,
            title: getLanguage(global.language).Map_Main_Menu.EDIT_DRAW_HOLLOW,
            size: 'large',
            action: CheckAction.drawRegionHollowRegion,
            image: getThemeAssets().edit.icon_hand_painted_Island_cave,
          },
          {
            key: constants.FILL_HOLLOW_REGION,
            title: getLanguage(global.language).Map_Main_Menu.EDIT_FILL_HOLLOW,
            size: 'large',
            action: CheckAction.fillHollowRegion,
            image: getThemeAssets().edit.icon_filling_Island_hole,
          },
          {
            key: constants.PATCH_HOLLOW_REGION,
            title: getLanguage(global.language).Map_Main_Menu.EDIT_PATCH_HOLLOW,
            size: 'large',
            action: CheckAction.patchHollowRegion,
            image: getThemeAssets().edit.icon_supplement_Island_cave,
          },
        )
      }
      break
    case AppletsToolType.APPLETS_CHECK_EDIT_TEXT:
      data = [
        {
          key: constants.MOVE,
          title: getLanguage(global.language).Map_Main_Menu.MOVE,
          action: CheckAction.move,
          size: 'large',
          image: getThemeAssets().edit.icon_translation,
        },
        {
          key: constants.DELETE,
          title: getLanguage(global.language).Map_Main_Menu.EDIT_DELETE,
          action: CheckAction.deleteLabel,
          size: 'large',
          image: getThemeAssets().edit.icon_delete,
        },
        {
          key: constants.UNDO,
          title: getLanguage(global.language).Map_Main_Menu.COLLECTION_UNDO,
          action: () => CheckAction.undo(),
          size: 'large',
          image: getThemeAssets().edit.icon_undo,
        },
        {
          key: 'redo',
          title: getLanguage(global.language).Map_Main_Menu.COLLECTION_REDO,
          action: () => CheckAction.redo(),
          size: 'large',
          image: getThemeAssets().edit.icon_redo,
        },
      ]
      break
    case AppletsToolType.APPLETS_CHECK_EDIT_PLOT:
      data = [
        {
          key: constants.EDIT_NODE,
          title: getLanguage(global.language).Map_Main_Menu.EDIT_NODES,
          size: 'large',
          action: CheckAction.editNode,
          image: getThemeAssets().edit.icon_edit_node,
        },
        {
          key: constants.DELETE,
          title: getLanguage(global.language).Map_Main_Menu.EDIT_DELETE,
          action: CheckAction.remove,
          size: 'large',
          image: getThemeAssets().edit.icon_delete,
        },
        {
          key: constants.UNDO,
          title: getLanguage(global.language).Map_Main_Menu.COLLECTION_UNDO,
          size: 'large',
          action: CheckAction.undo,
          image: getThemeAssets().edit.icon_undo,
        },
        {
          key: constants.REDO,
          title: getLanguage(global.language).Map_Main_Menu.COLLECTION_REDO,
          size: 'large',
          action: CheckAction.redo,
          image: getThemeAssets().edit.icon_redo,
        },
      ]
      break
    case AppletsToolType.APPLETS_CHECK_EDIT_ADD_REGION:
      buttons = [
        ToolbarBtnType.TOOLBAR_BACK,
        {
          type: constants.UNDO,
          action: CheckAction.undo,
          image: getThemeAssets().edit.icon_undo,
        },
        {
          type: constants.REDO,
          action: CheckAction.redo,
          image: getThemeAssets().edit.icon_redo,
        },
        {
          type: ToolbarBtnType.SHOW_ATTRIBUTE,
          action: CheckAction.showAttribute,
          image: getThemeAssets().publicAssets.icon_bar_attribute_selected,
        },
        ToolbarBtnType.TOOLBAR_COMMIT,
      ]
      break
  }
  if (
    type === AppletsToolType.APPLETS_CHECK_EDIT_POINT ||
    type === AppletsToolType.APPLETS_CHECK_EDIT_LINE ||
    type === AppletsToolType.APPLETS_CHECK_EDIT_REGION
  ) {
    // console.warn(type)
    // const params: any = ToolbarModule.getParams()
    // const layerType = LayerUtils.getLayerType(params.currentLayer)
    // data.unshift({
    //   key: 'captureImage',
    //   title: getLanguage(global.language).Map_Main_Menu.CAMERA,
    //   action: CheckAction.captureImage,
    //   size: 'large',
    //   disable: layerType !== 'TAGGINGLAYER' && layerType !== 'CADLAYER' && layerType !== 'POINTLAYER',
    //   image:
    //     layerType !== 'TAGGINGLAYER' && layerType !== 'CADLAYER' && layerType !== 'POINTLAYER'
    //       ? getThemeAssets().mapTools.icon_tool_multi_media_ash
    //       : getThemeAssets().mapTools.icon_tool_multi_media,
    // })
    // data.unshift({
    //   key: 'captureImage',
    //   title: getLanguage(global.language).Map_Main_Menu.ATTRIBUTE,
    //   action: () => {
    //     if(global.HAVEATTRIBUTE){
    //       NavigationService.navigate('LayerSelectionAttribute',{isCollection:true,preType:'SM_MAP_MARKS_DRAW'})
    //     }
    //   },
    //   size: 'large',
    //   disable: layerType !== 'TAGGINGLAYER' && layerType !== 'CADLAYER' && layerType !== 'POINTLAYER',
    //   image: getThemeAssets().publicAssets.icon_bar_attribute_selected,
    // })
    buttons = [
      ToolbarBtnType.TOOLBAR_BACK,
      ToolbarBtnType.FLEX,
      {
        type: ToolbarBtnType.SHOW_ATTRIBUTE,
        action: CheckAction.showAttribute,
        image: getThemeAssets().publicAssets.icon_bar_attribute_selected,
      },
      ToolbarBtnType.TOOLBAR_COMMIT,
    ]
  }
  if (type === AppletsToolType.APPLETS_CHECK_EDIT) {
    customView = () => <CheckButtons />
    buttons = [
      ToolbarBtnType.CANCEL,
      ToolbarBtnType.PLACEHOLDER,
      ToolbarBtnType.TOOLBAR_COMMIT,
    ]
  } else if (type === AppletsToolType.APPLETS_CHECK_EDIT_TAGGING) {
    buttons = [
      ToolbarBtnType.CANCEL,
      ToolbarBtnType.PLACEHOLDER,
      ToolbarBtnType.TOOLBAR_COMMIT,
    ]
  } else if (type === AppletsToolType.APPLETS_CHECK_EDIT_TAGGING_SETTING) {
    buttons = [
      ToolbarBtnType.TAGGING_BACK,
      ToolbarBtnType.PLACEHOLDER,
      ToolbarBtnType.TOOLBAR_COMMIT,
    ]
  } else if (buttons.length === 0) {
    buttons = [
      ToolbarBtnType.TOOLBAR_BACK,
      ToolbarBtnType.FLEX,
      ToolbarBtnType.TOOLBAR_COMMIT,
    ]
  }
  return { data, buttons, customView }
}

interface MapTaskItem {
  title: string,
  image: any,
  name: string,
  path: string,
  info: {
    infoType: string,
    lastModifiedDate: string,
    isTemplate: boolean,
  },
}
async function getTasks(): Promise<MapTaskItem[]> {
  const userList: MapTaskItem[] = []
  try {
    const _params: any = ToolbarModule.getParams()
    const path =
      (await FileTools.appendingHomeDirectory(
        _params.user && _params.user.currentUser.userName
          ? `${ConstPath.UserPath + _params.user.currentUser.userName}/`
          : ConstPath.CustomerPath,
      )) + ConstPath.RelativeFilePath.Map
    const userFileList = await FileTools.getMaps(path)
    if (userFileList && userFileList.length > 0) {
      userFileList.forEach(item => {
        const _item: MapTaskItem = {
          title: item.name,
          name: item.name.split('.')[0],
          image: item.isTemplate
            ? getThemeAssets().dataType.icon_map_template
            : getThemeAssets().dataType.icon_mapdata,
          path: item.path,
          info: {
            infoType: 'mtime',
            lastModifiedDate: item.mtime,
            isTemplate: !!item.isTemplate,
          },
        }
        userList.push(_item)
      })
    }
    return userList
  } catch (error) {
    __DEV__ && console.warn(error)
    return userList
  }
}

// function _headerLeft() {
//   return (
//     <MTBtn
//       key={'change_layer'}
//       image={getImage().layer}
//       style={{
//         backgroundColor: '#rgba(255, 255, 255, 0.8)',
//         borderRadius: scaleSize(8),
//         width: scaleSize(80),
//         height: scaleSize(80),
//         justifyContent: 'center',
//         alignItems: 'center',
//         marginVertical: scaleSize(8),
//       }}
//       imageStyle={{
//         width: scaleSize(44),
//         height: scaleSize(44),
//       }}
//       textStyle={{
//         width: scaleSize(70),
//         textAlign: 'center',
//         fontSize: setSpText(16),
//       }}
//       title={'切换图层'}
//       onPress={async() => {
//         // 切换图层
//         NavigationService.navigate('ChooseLayer')
//       }}
//     />
//   )
// }

/** 自定义Header数据 */
function getHeaderData(type: string) {
  if (type !== AppletsToolType.APPLETS_CHECK_EDIT) return
  const headerData = {
    type: 'floatNoTitle',
    withoutBack: true,
    headerRight: [{
      key: 'change_layer',
      title: '切换图层',
      action: () => NavigationService.navigate('ChooseLayer'),
      size: 'large',
      image: getImage().layer,
      style: [{
        marginTop: scaleSize(20),
        backgroundColor: '#rgba(255, 255, 255, 0.8)',
        borderRadius: scaleSize(8),
        width: scaleSize(74),
        height: scaleSize(80),
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: scaleSize(8),
      }],
      imgStyle: [{
        width: scaleSize(44),
        height: scaleSize(44),
      }],
      titleStyle: [{
        width: scaleSize(70),
        textAlign: 'center',
        fontSize: setSpText(14),
      }],
    }],
  }
  return headerData
}

export default {
  getData,
  getTasks,
  getHeaderData,
}
