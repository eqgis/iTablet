import { SScene } from 'imobile_for_reactnative'
import { Action3D } from 'imobile_for_reactnative/NativeModule/interfaces/scene/SSceneType'
import { getLanguage } from '../../language/index'

async function getMap3DSettings() {
  const item = await SScene.getSetting()
  const data = [
    {
      title: getLanguage(global.language).Map_Setting.BASIC_SETTING,
      visible: true,
      index: 0,
      data: [
        {
          name: getLanguage(global.language).Map_Setting.SCENE_NAME,
          // '场景名称',
          value: item.sceneNmae,
          isShow: true,
          index: 0,
        },
        {
          name: getLanguage(global.language).Map_Setting.FOV,
          // '相机角度',
          value: item.heading,
          isShow: true,
          index: 0,
        },
        {
          name: getLanguage(global.language).Map_Setting.SCENE_OPERATION_STATUS,
          // '场景操作状态',
          value: global.action3d ? global.action3d : Action3D.NULL,
          isShow: true,
          index: 0,
        },
        {
          name: getLanguage(global.language).Map_Setting.VIEW_MODE,
          // '视图模式',
          value: getLanguage(global.language).Map_Setting.SPHERICAL,
          // '球面',
          isShow: true,
          index: 0,
        },
        // {
        //   name: '地形缩放比例',
        //   value: true,
        //   isShow: true,
        //   index: 0,
        // },
      ],
    },
  ]
  return data
}
export default {
  getMap3DSettings,
}
