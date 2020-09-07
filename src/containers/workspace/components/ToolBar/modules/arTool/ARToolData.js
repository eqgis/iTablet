import { getLanguage } from '../../../../../../language'
import { getThemeAssets } from '../../../../../../assets'
import ARToolAction from './ARToolAction'
import { Platform } from 'react-native'

function getData() {
  let data = [
    {
      //AR沙盘
      key: 'arCastModelOperate',
      title: getLanguage(global.language).Map_Main_Menu
        .MAP_AR_AI_ASSISTANT_CAST_MODEL_OPERATE,
      action: ARToolAction.arCastModelOperate,
      size: 'large',
      image: getThemeAssets().ar.functiontoolbar.ar_sandtable,
    },
    {
      //AR视频
      key: 'arVideo',
      title: getLanguage(global.language).Map_Main_Menu.MAP_AR_VIDEO,
      action: ARToolAction.arVideo,
      size: 'large',
      image: getThemeAssets().ar.functiontoolbar.ar_video,
    },
    {
      //AR图片
      key: 'arImage',
      title: getLanguage(global.language).Map_Main_Menu.MAP_AR_IMAGE,
      action: ARToolAction.arImage,
      size: 'large',
      image: getThemeAssets().ar.functiontoolbar.ar_picture,
    },
    {
      //AR网页
      key: 'arWebView',
      title: getLanguage(global.language).Map_Main_Menu.MAP_AR_WEBVIEW,
      action: ARToolAction.arWebView,
      size: 'large',
      image: getThemeAssets().ar.functiontoolbar.ar_webpage,
    },
    {
      //AR文字
      key: 'arText',
      title: getLanguage(global.language).Map_Main_Menu.MAP_AR_TEXT,
      action: ARToolAction.arText,
      size: 'large',
      image: getThemeAssets().ar.functiontoolbar.ar_text,
    },
  ]

  data = data.filter(item => {
    if (Platform.OS === 'ios') {
      if (
        item.key === 'arCastModelOperate' ||
        //item.key === 'arVideo' ||
        //item.key === 'arImage' ||
        item.key === 'arWeather'
        //item.key === 'arWebView' ||
        // item.key === 'arText'
      ) {
        return false
      }
    }
    return true
  })

  return { data }
}

export default {
  getData,
}
