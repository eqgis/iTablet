import * as React from 'react'
import { Platform } from 'react-native'
import { SScene } from 'imobile_for_reactnative'
import { ConstToolType } from '../../../../../../constants'
import { getLanguage } from '../../../../../../language'
import ToolbarModule from '../ToolbarModule'
import ToolbarBtnType from '../../ToolbarBtnType'
import Tool3DAction from './Tool3DAction'
import { SelectList } from './CustomViews'
import { getPublicAssets, getThemeAssets } from '../../../../../../assets'

async function getData(type, params) {
  if (params) {
    ToolbarModule.setParams(params)
  } else {
    params = ToolbarModule.getParams()
  }
  let data = []
  let buttons = []
  let customView = null
  switch (type) {
    case ConstToolType.SM_MAP3D_TOOL:
      data = [
        {
          key: 'distanceMeasure',
          title: getLanguage(params.language).Map_Main_Menu
            .TOOLS_DISTANCE_MEASUREMENT,
          action: Tool3DAction.measureDistance,
          size: 'large',
          image: getThemeAssets().mapTools.icon_tool_horizontal_distance,
        },
        {
          key: 'suerfaceMeasure',
          title: getLanguage(params.language).Map_Main_Menu
            .TOOLS_AREA_MEASUREMENT,
          action: Tool3DAction.measureArea,
          size: 'large',
          image: getThemeAssets().mapTools.icon_tool_spacearea,
        },
        {
          key: 'action3d',
          title: getLanguage(params.language).Map_Main_Menu.TOOLS_SELECT,
          action: Tool3DAction.select,
          size: 'large',
          image: getThemeAssets().mapTools.icon_tool_click,
        },
        {
          key: 'pointAnalyst',
          title: getLanguage(params.language).Map_Main_Menu.TOOLS_PATH_ANALYSIS,
          action: Tool3DAction.pathAnalyst,
          size: 'large',
          image: getThemeAssets().mapTools.icon_path_analysis,
        },
        // {
        //   key: 'planeClip',
        //   title: getLanguage(params.language).Map_Main_Menu
        //     .TOOLS_PLANE_CLIP,
        //   //'平面裁剪',
        //   action: () => {
        //     if (!GLOBAL.openWorkspace) {
        //       Toast.show(
        //         getLanguage(params.language).Prompt.PLEASE_OPEN_SCENE,
        //       )
        //       //'请打开场景')
        //       return
        //     }
        //     try {
        //       // SScene.startDrawLine()
        //       this.showMap3DTool(ConstToolType.SM_MAP3D_TOOL_PLANE_CLIP)
        //     } catch (error) {
        //       Toast.show('点绘线失败')
        //     }
        //   },
        //   size: 'large',
        //   image: require('../../../../assets/mapToolbar/icon_sence_plane_clip.png'),
        // },
        // {
        //   key: 'crossClip',
        //   title: getLanguage(params.language).Map_Main_Menu
        //     .TOOLS_CROSS_CLIP,
        //   //'cross裁剪',
        //   action: () => {
        //     if (!GLOBAL.openWorkspace) {
        //       Toast.show(
        //         getLanguage(params.language).Prompt.PLEASE_OPEN_SCENE,
        //       )
        //       //'请打开场景')
        //       return
        //     }
        //     try {
        //       // SScene.startDrawLine()
        //       this.showMap3DTool(ConstToolType.SM_MAP3D_TOOL_CROSS_CLIP)
        //     } catch (error) {
        //       Toast.show('点绘线失败')
        //     }
        //   },
        //   size: 'large',
        //   image: require('../../../../assets/mapToolbar/icon_sence_cross_clip.png'),
        // },
      ]
      if (Platform.OS === 'android') {
        data.push({
          key: 'boxClip',
          title: getLanguage(params.language).Map_Main_Menu.TOOLS_BOX_CLIP,
          action: Tool3DAction.boxClip,
          size: 'large',
          image: getThemeAssets().mapTools.icon_tool_box,
        })
      }
      break
    case ConstToolType.SM_MAP3D_TOOL_SELECT:
      data = [
        {
          key: 'cancel',
          title: getLanguage(GLOBAL.language).Prompt.CANCEL,
          action: () => {
            SScene.clearSelection()
            params.setAttributes && params.setAttributes({})
          },
          size: 'large',
          image: getThemeAssets().mapTools.icon_tool_cancel,
        },
      ]
      buttons = [ToolbarBtnType.CANCEL, ToolbarBtnType.SHOW_MAP3D_ATTRIBUTE]
      break
    case ConstToolType.SM_MAP3D_TOOL_BOX_CLIPPING:
      buttons = [
        ToolbarBtnType.CANCEL,
        {
          type: ToolbarBtnType.COMMIT_3D_CUT,
          image: require('../../../../../../assets/mapEdit/icon_function_theme_param_commit.png'),
          action: Tool3DAction.map3dCut,
        },
      ]
      break
    case ConstToolType.SM_MAP3D_TOOL_BOX_CLIP:
    case ConstToolType.SM_MAP3D_TOOL_PLANE_CLIP:
    case ConstToolType.SM_MAP3D_TOOL_CROSS_CLIP:
    case ConstToolType.SM_MAP3D_TOOL_CLIP_SHOW:
    case ConstToolType.SM_MAP3D_TOOL_CLIP_HIDDEN:
    case ConstToolType.SM_MAP3D_TOOL_BOX_CLIP_IN:
    case ConstToolType.SM_MAP3D_TOOL_BOX_CLIP_OUT: {
      const _data = await getClipData(type)
      data = _data.data
      buttons = _data.buttons
      customView = _data.customView
      break
    }
    case ConstToolType.SM_MAP3D_TOOL_CIRCLE_FLY:
      data = [
        {
          key: 'startFly',
          title: getLanguage(GLOBAL.language).Map_Main_Menu.FLY_AROUND_POINT,
          // '绕点飞行',
          action: () => {
            GLOBAL.isCircleFlying = true
            SScene.startCircleFly()
          },
          size: 'large',
          image: getThemeAssets().mapTools.icon_tool_play,
          selectedImage: getThemeAssets().mapTools.icon_tool_play,
        },
      ]
      buttons = [ToolbarBtnType.CANCEL, ToolbarBtnType.FLEX]
      break
  }
  return { data, buttons, customView }
}

/** 获取裁剪数据 * */
async function getClipData(type) {
  const params = ToolbarModule.getParams()
  const clipSetting = params.getClipSetting && params.getClipSetting()
  const isClipInner = clipSetting.clipInner
  let customView
  const data = clipSetting.layers
  switch (type) {
    case ConstToolType.SM_MAP3D_TOOL_CLIP_SHOW:
      if (data[0].selected === undefined) {
        data.map(item => {
          item.selected = true
        })
      }
      customView = () => (
        <SelectList
          data={data}
          onSelect={layers => {
            Tool3DAction.layerChange(layers)
          }}
        />
      )
      break
  }

  const buttons = [
    {
      type: ToolbarBtnType.CANCEL,
      image: require('../../../../../../assets/mapEdit/icon_function_cancel.png'),
      action: () => Tool3DAction.closeClip(),
    },
    {
      type: ToolbarBtnType.CLIP_LAYER,
      image: getPublicAssets().mapTools.tab_layer,
      action: () => Tool3DAction.showLayerList(),
    },
    {
      type: ToolbarBtnType.MENU,
      action: () => Tool3DAction.showMenuDialog(),
    },
    {
      type: ToolbarBtnType.CHANGE_CLIP,
      image: isClipInner
        ? getPublicAssets().mapTools.scene_tool_clip_in
        : getPublicAssets().mapTools.scene_tool_clip_out,
      action: () => Tool3DAction.changeClip(),
    },
    {
      type: ToolbarBtnType.CLEAR,
      image: require('../../../../../../assets/mapEdit/icon_clear.png'),
      action: () => Tool3DAction.clearMeasure(type),
    },
  ]
  return { data, buttons, customView }
}

// const BoxClipData = () => [
//   {
//     title: getLanguage(GLOBAL.language).Map_Main_Menu.CLIP_LAYER,
//     data: [], //获取图层数据
//   },
//   {
//     title: getLanguage(GLOBAL.language).Map_Main_Menu.CLIP_AREA_SETTINGS,
//     data: [
//       {
//         title: getLanguage(GLOBAL.language).Map_Main_Menu
//           .CLIP_AREA_SETTINGS_LENGTH,
//         value: 0,
//         iconType: 'Text',
//       },
//       {
//         title: getLanguage(GLOBAL.language).Map_Main_Menu
//           .CLIP_AREA_SETTINGS_WIDTH,
//         value: 0,
//         iconType: 'Text',
//       },
//       {
//         title: getLanguage(GLOBAL.language).Map_Main_Menu
//           .CLIP_AREA_SETTINGS_HEIGHT,
//         value: 0,
//         iconType: 'Text',
//       },
//       // {
//       //   title:getLanguage(GLOBAL.language).Map_Main_Menu.CLIP_AREA_SETTINGS_ZROT,
//       //   value:0,
//       //   iconType:"Input",
//       // },
//     ],
//   },
//   {
//     title: getLanguage(GLOBAL.language).Map_Main_Menu.POSITION,
//     data: [
//       {
//         title: 'X',
//         value: 0,
//         iconType: 'Input',
//       },
//       {
//         title: 'Y',
//         value: 0,
//         iconType: 'Input',
//       },
//       {
//         title: 'Z',
//         value: 0,
//         iconType: 'Input',
//       },
//     ],
//   },
//   {
//     title: getLanguage(GLOBAL.language).Map_Main_Menu.CLIP_SETTING,
//     data: [
//       // {
//       //   title:getLanguage(GLOBAL.language).Map_Main_Menu.LINE_COLOR,
//       //   iconType:"Arrow",
//       // },
//       {
//         title: getLanguage(GLOBAL.language).Map_Main_Menu.CLIP_INNER,
//         iconType: 'Switch',
//       },
//     ],
//   },
// ]
//
// const CrossClipData = () => [
//   {
//     title: getLanguage(GLOBAL.language).Map_Main_Menu.CLIP_LAYER,
//     data: [],
//   },
//   {
//     title: getLanguage(GLOBAL.language).Map_Main_Menu.CLIP_SETTING,
//     data: [
//       {
//         title: getLanguage(GLOBAL.language).Map_Main_Menu.LINE_COLOR,
//         iconType: 'Arrow',
//       },
//       {
//         title: getLanguage(GLOBAL.language).Map_Main_Menu.LINE_OPACITY,
//         value: 100,
//         maxValue: 100,
//         minValue: 0,
//         iconType: 'Input',
//       },
//       {
//         title: getLanguage(GLOBAL.language).Map_Main_Menu.SHOW_OTHER_SIDE,
//         iconType: 'Switch',
//       },
//     ],
//   },
//   {
//     title: getLanguage(GLOBAL.language).Map_Main_Menu.POSITION,
//     data: [
//       {
//         title: 'X',
//         value: 0,
//         iconType: 'Input',
//       },
//       {
//         title: 'Y',
//         value: 0,
//         iconType: 'Input',
//       },
//       {
//         title: 'Z',
//         value: 0,
//         iconType: 'Input',
//       },
//     ],
//   },
//   {
//     title: getLanguage(GLOBAL.language).Map_Main_Menu.ROTATE_SETTINGS,
//     data: [
//       {
//         title: getLanguage(GLOBAL.language).Map_Main_Menu
//           .CLIP_AREA_SETTINGS_XROT,
//         value: 0,
//         iconType: 'Input',
//       },
//       {
//         title: getLanguage(GLOBAL.language).Map_Main_Menu
//           .CLIP_AREA_SETTINGS_YROT,
//         value: 0,
//         iconType: 'Input',
//       },
//       {
//         title: getLanguage(GLOBAL.language).Map_Main_Menu
//           .CLIP_AREA_SETTINGS_ZROT,
//         value: 0,
//         iconType: 'Input',
//       },
//     ],
//   },
// ]
//
// const PlaneClipData = () => [
//   {
//     title: getLanguage(GLOBAL.language).Map_Main_Menu.CLIP_LAYER,
//     data: [],
//   },
//   {
//     title: getLanguage(GLOBAL.language).Map_Main_Menu.CLIP_SURFACE_SETTING,
//     data: [
//       {
//         title: getLanguage(GLOBAL.language).Map_Main_Menu
//           .CLIP_AREA_SETTINGS_LENGTH,
//         value: 10,
//         iconType: 'Input',
//       },
//       {
//         title: getLanguage(GLOBAL.language).Map_Main_Menu
//           .CLIP_AREA_SETTINGS_WIDTH,
//         value: 10,
//         iconType: 'Input',
//       },
//       {
//         title: getLanguage(GLOBAL.language).Map_Main_Menu
//           .CLIP_AREA_SETTINGS_HEIGHT,
//         value: 0,
//         iconType: 'Input',
//       },
//     ],
//   },
// ]

export default {
  getData,
  getClipData,
}
