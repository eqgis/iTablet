import { fromJS, Record } from 'immutable'
import { REHYDRATE } from 'redux-persist'
import { Action, handleActions } from 'redux-actions'
import { DatasetType, SMap, SLanguage, SLocation } from 'imobile_for_reactnative'
import { NativeModules } from 'react-native'
import { getMapSettings } from '../../containers/mapSetting/settingData'
import { ModelUtils } from '../../utils'
import { ChunkType } from '../../constants'
import { setCurrentLanguage } from '@/language'
import { setLastLaunchState } from '../store'

const { AppUtils } = NativeModules
// Constants
// --------------------------------------------------
export const SETTING_DATA = 'SETTING_DATA'
export const MAP_SETTING = 'MAP_SETTING'
export const SETTING_LANGUAGE = 'SETTING_LANGUAGE'
export const SETTING_LANGUAGE_AUTO = 'SETTING_LANGUAGE_AUTO'
export const SETTING_CONFIG_LANGUAGE_SET = 'SETTING_CONFIG_LANGUAGE_SET'
export const SETTING_DEVICE = 'SETTING_DEVICE'
export const MAP_LEGEND = 'MAP_LEGEND'
export const MAP_SCALEVIEW = 'MAP_SCALEVIEW'
export const MAP_NAVIGATION = 'MAP_NAVIGATION'
export const MAP_2DTO3D = 'MAP_2DTO3D'
export const MAP_IS3D = 'MAP_IS3D'
export const MAP_INDOORNAViGATION = 'MAP_INDOORNAViGATION'
export const NAVIGATION_CHANGEAR = 'NAVIGATION_CHANGEAR'
export const NAVIGATION_POIVIEW = 'NAVIGATION_POIVIEW'
export const MAP_SELECT_POINT = 'MAP_SELECT_POINT'
export const AGREE_TO_PROTOCOL = 'AGREE_TO_PROTOCOL'
export const NAVIGATION_HISTORY = 'NAVIGATION_HISTORY'
export const ONLINEMAP = 'ONLINEMAP'
export const COLUMN_NAV_BAR = 'COLUMN_NAV_BAR'
export const NAV_BAR_DISPLAY = 'NAV_BAR_DISPLAY'
export const TOGGLE_FIND_ITEM = 'TOGGLE_FIND_ITEM'
export const TOGGLE_LABORATORY_ITEM = 'TOGGLE_LABORATORY_ITEM'
export const SHOW_DATUM_POINT = 'SHOW_DATUM_POINT'
export const SHOW_AR = 'SHOW_AR'
export const SHOW_AR_SCENE_NOTIFY = 'SHOW_AR_SCENE_NOTIFY'
const SHOW_COMPASS = 'SHOW_COMPASS'
export const ARPOISEARCH_VIEW = 'ARPOISEARCH_VIEW'
export const SET_AI_DETECT_MODEL = 'SET_AI_DETECT_MODEL'
export const SET_AI_CLASSIFY_MODEL = 'SET_AI_CLASSIFY_MODEL'
const SET_ARLABEL = 'SET_ARLABEL'
// Actions
// --------------------------------------------------

export const setSettingData = (data = [], cb = () => {}) => async (dispatch: (arg0: { type: string; payload: never[] }) => any) => {
  await dispatch({
    type: SETTING_DATA,
    payload: data,
  })
  cb && cb()
}

export const setMapSetting = (cb = () => {}) => async (dispatch: (arg0: { type: string; payload: never[] }) => any) => {
  await dispatch({
    type: MAP_SETTING,
    payload: [],
  })
  cb && cb()
}

export const setLanguage = (params: string, isConfig = false, cb = () => {}) => async (
  dispatch: (arg0: { type: string; payload?: any }) => any,
  getState: () => { (): any; new(): any; appConfig: { (): any; new(): any; toJS: { (): { (): any; new(): any; supportLanguage: any }; new(): any } } },
) => {
  if (params === 'AUTO') {
    let supportLanguage = getState().appConfig.toJS().supportLanguage
    if (!supportLanguage) supportLanguage = []
    const allSupportLanguage = ['CN', 'EN', 'TR', 'JA', 'FR', 'AR']
    supportLanguage = supportLanguage.filter((item: string) => {
      return allSupportLanguage.indexOf(item) > -1
    })
    let isSupported = (language: string) => {
      return (
        supportLanguage.length === 0 || supportLanguage.indexOf(language) > -1
      )
    }
    const locale = await AppUtils.getLocale()
    let language
    if (locale === 'zh-CN' && isSupported('CN')) {
      language = 'CN'
    } else if (locale.indexOf('en-') === 0 && isSupported('EN')) {
      language = 'EN'
    } else if (locale.indexOf('tr-') === 0 && isSupported('TR')) {
      language = 'TR'
    } else if (locale.indexOf('ja-') === 0 && isSupported('JA')) {
      language = 'JA'
    } else if (locale.indexOf('fr-') === 0 && isSupported('FR')) {
      language = 'FR'
    } else if (locale.indexOf('ar-') === 0 && isSupported('AR')) {
      language = 'AR'
    } else {
      language = supportLanguage.length > 0 ? supportLanguage[0] : 'EN'
    }
    await SLanguage.setLanguage(language)
    await dispatch({
      type: SETTING_LANGUAGE_AUTO,
      payload: language,
    })
    global.language = language
    setCurrentLanguage(language)
  } else {
    await SLanguage.setLanguage(params)
    await dispatch({
      type: SETTING_LANGUAGE,
      payload: params,
    })
    global.language = params
    setCurrentLanguage(params)
  }
  if (isConfig) {
    await dispatch({
      type: SETTING_CONFIG_LANGUAGE_SET,
    })
  }
  cb && cb()
}
export const setDevice = (params: SLocation.LocationConnectionParam) => async (dispatch: (arg0: { type: string; payload: {} }) => any) => {
  await dispatch({
    type: SETTING_DEVICE,
    payload: params,
  })
}
export const setMapLegend = (params = {}) => async (dispatch: (arg0: { type: string; payload: {} }) => any) => {
  await dispatch({
    type: MAP_LEGEND,
    payload: params || false,
  })
}
export const setMapNavigation = (params = {}) => async (dispatch: (arg0: { type: string; payload: {} }) => any) => {
  await dispatch({
    type: MAP_NAVIGATION,
    payload: params || false,
  })
}

export const setNavigationChangeAR = (params = {}) => async (dispatch: (arg0: { type: string; payload: {} }) => any) => {
  await dispatch({
    type: NAVIGATION_CHANGEAR,
    payload: params || false,
  })
}
export const setNavigationPoiView = (params = {}) => async (dispatch: (arg0: { type: string; payload: {} }) => any) => {
  await dispatch({
    type: NAVIGATION_POIVIEW,
    payload: params || false,
  })
}
export const setOpenOnlineMap = (params = {}) => async (dispatch: (arg0: { type: string; payload: {} }) => any) => {
  await dispatch({
    type: ONLINEMAP,
    payload: params || false,
  })
}
export const setNavigationHistory = (
  data = [],
  cb = () => {},
) => async (dispatch: (arg0: { type: string; payload: never[] }) => any) => {
  await dispatch({
    type: NAVIGATION_HISTORY,
    payload: data,
  })
  cb && cb()
}
export const setMapScaleView = (params = {}) => async (dispatch: (arg0: { type: string; payload: {} }) => any) => {
  await dispatch({
    type: MAP_SCALEVIEW,
    payload: params || false,
  })
}
export const getMapSetting = (params = {}, cb?: (data?: unknown) => void) => async (dispatch: (arg0: { type: string; payload: { title: string; visible: boolean; data: { name: string; value: boolean }[] }[] | {} }) => any) => {
  try {
    const isAntialias = await SMap.isAntialias()
    const isOverlapDisplayed = await SMap.isOverlapDisplayed()
    const isVisibleScalesEnabled = await SMap.isVisibleScalesEnabled()

    const newData = getMapSettings()
    newData[0].data[0].value = isAntialias
    newData[0].data[1].value = isOverlapDisplayed
    newData[1].data[0].value = isVisibleScalesEnabled

    await dispatch({
      type: MAP_SETTING,
      payload: newData || [],
    })
    cb && cb(newData)
  } catch (e) {
    await dispatch({
      type: MAP_SETTING,
      payload: params || [],
    })
    cb && cb()
  }
}

export const setAgreeToProtocol = (params = {}) => async (dispatch: (arg0: { type: string; payload: {} }) => any) => {
  await dispatch({
    type: AGREE_TO_PROTOCOL,
    payload: params || false,
  })
}

export const setColumnNavBar = (params = {}) => async (dispatch: (arg0: { type: string; payload: {} }) => any) => {
  await dispatch({
    type: COLUMN_NAV_BAR,
    payload: params || false,
  })
}

export const setNavBarDisplay = (params = {}) => async (dispatch: (arg0: { type: string; payload: {} }) => any) => {
  await dispatch({
    type: NAV_BAR_DISPLAY,
    payload: params || false,
  })
}

export const toggleFindItem = (params = {}) => async (dispatch: (arg0: { type: string; payload: {} }) => any) => {
  await dispatch({
    type: TOGGLE_FIND_ITEM,
    payload: params || {},
  })
}

export const toggleLaboratoryItem = (params = {}) => async (dispatch: (arg0: { type: string; payload: {} }) => any) => {
  await dispatch({
    type: TOGGLE_LABORATORY_ITEM,
    payload: params || {},
  })
}

/** 显示AR位置定位 */
export const setDatumPoint = (show = false) => async (dispatch: (arg0: { type: string; payload: boolean }) => any) => {
  await dispatch({
    type: SHOW_DATUM_POINT,
    payload: show,
  })
}

/** ar导航进入设置界面 */
export const arPoiSearch = (show = false) => async (dispatch: (arg0: { type: string; payload: boolean }) => any) => {
  await dispatch({
    type: ARPOISEARCH_VIEW,
    payload: show,
  })
}

/** 显示AR界面 */
export const showAR = (show = false) => async (dispatch: (arg0: { type: string; payload: boolean }) => any) => {
  await dispatch({
    type: SHOW_AR,
    payload: show,
  })
}

/** AR场景提示 */
export const setShowARSceneNotify = (show: any) => async (dispatch: (arg0: { type: string; payload: any }) => any) => {
  await dispatch({
    type: SHOW_AR_SCENE_NOTIFY,
    payload: show,
  })
}

/** ar显示标注结果 */
export const setARLabel = (show: any) => async (dispatch: (arg0: { type: string; payload: any }) => any) => {
  await dispatch({
    type: SET_ARLABEL,
    payload: show,
  })
}

/** AR场景提示 */
export const showCompass = (show: any) => async (dispatch: (arg0: { type: string; payload: any }) => any) => {
  await dispatch({
    type: SHOW_COMPASS,
    payload: show,
  })
}

export const setAIDetectModel = (model: any) => async (dispatch: (arg0: { type: string; payload: any }) => any) => {
  await dispatch({
    type: SET_AI_DETECT_MODEL,
    payload: model,
  })
}

export const setAIClassifyModel = (model: any) => async (dispatch: (arg0: { type: string; payload: any }) => any) => {
  await dispatch({
    type: SET_AI_CLASSIFY_MODEL,
    payload: model,
  })
}


const defaultMapLegend: {[key in keyof Legend]?: Legend[key]} = (() => {
  let _mapLegend: {[key in keyof Legend]?: Legend[key]} = {}
  const legendConfig = {
    isShow: false,
    backgroundColor: 'white',
    column: 2,
    widthPercent: 80,
    heightPercent: 80,
    fontPercent: 50,
    imagePercent: 50,
    legendPosition: 'topLeft',
    position: {x: -1, y: -1},
  }

  const moduleKeys = Object.keys(ChunkType)
  moduleKeys.map(item => {
    Object.assign(_mapLegend, {[item] : { ...legendConfig }})
  })
  return _mapLegend
})()

const initialState = fromJS({
  route: {
    mode: '',
  },
  settingData: [],
  mapSetting: [],
  language: 'CN',
  autoLanguage: true,
  configLangSet: false,
  peripheralDevice: {type: 'local'},
  mapLegend: { ...defaultMapLegend },
  mapNavigation: {
    isShow: false,
    name: '',
  },
  mapScaleView: true,
  navigationChangeAR: false,
  navigationPoiView: false,
  openOnlineMap: false,
  isAgreeToProtocol: false,
  navigationhistory: [],
  mapColumnNavBar: false,
  navBarDisplay: false,
  find: {
    showPublicMap: true,
    showPublicData: true,
    showSuperMapGroup: true,
    showSuperMapKnow: true,
    showSuperMapForum: true,
    showGisAcademy: true,
    showCowork: true,
    showLab: true,
  },
  laboratory: {
    gestureBone: false,
    estimation: false,
    // highPrecisionCollect: false,
  },
  /** 显示AR位置定位 */
  showDatumPoint: false,
  isAR: false,
  /** AR场景提示 */
  showARSceneNotify: true,
  /** ar显示标注结果 */
  showARLabel: true,
  /** 指南针 */
  isShowCompass: false,
  /** ar导航设置跳转 */
  poiSearch:false,
  aiDetectData: {},
  aiClassifyData: {},
})

interface Legend {
  isShow: boolean,
  backgroundColor: string,
  column: number,
  widthPercent: number,
  heightPercent: number,
  fontPercent: number,
  imagePercent: number,
  legendPosition: 'topLeft' | 'topRight' | 'leftBottom' | 'rightBottom',
  position: {x: number, y: number},
}

interface SettingState {
  settingData: {[key: string]: any}[],
  mapSetting: {[key: string]: any}[],
  language: string,
  autoLanguage: true,
  configLangSet: false,
  peripheralDevice: SLocation.LocationConnectionParam,
  mapLegend: Legend,
  mapNavigation: {
    isShow: boolean,
    name: string,
  },
  mapScaleView: boolean,
  navigationChangeAR: boolean,
  navigationPoiView: boolean,
  openOnlineMap: boolean,
  isAgreeToProtocol: boolean,
  navigationhistory: unknown[],
  mapColumnNavBar: boolean,
  navBarDisplay: boolean,
  find: {
    showPublicMap: boolean,
    showPublicData: boolean,
    showSuperMapGroup: boolean,
    showSuperMapKnow: boolean,
    showSuperMapForum: boolean,
    showGisAcademy: boolean,
    showCowork: boolean,
    showLab: boolean,
  },
  laboratory: {
    gestureBone: boolean,
    estimation: boolean,
    // highPrecisionCollect: false,
  },
  /** 显示AR位置定位 */
  showDatumPoint: boolean,
  isAR: boolean,
  /** AR场景提示 */
  showARSceneNotify: boolean,
  /** ar显示标注结果 */
  showARLabel: boolean,
  /** 指南针 */
  isShowCompass: boolean,
  /** ar导航设置跳转 */
  poiSearch: boolean,
  aiDetectData: {[key: string]: any},
  aiClassifyData: {[key: string]: any},
}

type SettingStateType = Record<SettingState> & SettingState

export default handleActions<SettingStateType>(
  {
    [`${SETTING_LANGUAGE}`]: (state, { payload }: Action<string>) =>
      state
        .setIn(['language'], fromJS(payload))
        .setIn(['autoLanguage'], fromJS(false)),
    [`${SETTING_LANGUAGE_AUTO}`]: (state, { payload }: Action<string>) =>
      state
        .setIn(['language'], fromJS(payload))
        .setIn(['autoLanguage'], fromJS(true)),
    [`${SETTING_CONFIG_LANGUAGE_SET}`]: state =>
      state.setIn(['configLangSet'], fromJS(true)),
    [`${SETTING_DEVICE}`]: (state, { payload }) =>
      state.setIn(['peripheralDevice'], fromJS(payload)),
    [`${SETTING_DATA}`]: (state, { payload }) => {
      let data = state.toJS().settingData
      if (payload) {
        data = payload
      } else {
        data = []
      }
      return state.setIn(['settingData'], fromJS(data))
    },
    [`${MAP_SETTING}`]: (state, { payload }) => {
      let data = state.toJS().mapSetting
      if (payload) {
        data = payload
      } else {
        data = []
      }
      return state.setIn(['mapSetting'], fromJS(data))
    },
    [`${MAP_SCALEVIEW}`]: (state, { payload }) => {
      let data = state.toJS().mapScaleView
      if (payload) {
        data = payload
      } else {
        data = false
      }
      return state.setIn(['mapScaleView'], fromJS(data))
    },
    [`${MAP_LEGEND}`]: (state, { payload }) => {
      let data = state.toJS().mapLegend
      if (payload) {
        data = payload
      } else {
        data = { ...defaultMapLegend }
      }
      return state.setIn(['mapLegend'], fromJS(data))
    },
    [`${MAP_NAVIGATION}`]: (state, { payload }) => {
      let data = state.toJS().mapNavigation
      if (payload) {
        data = payload
      } else {
        data = {
          isShow: false,
          name: '',
        }
      }
      return state.setIn(['mapNavigation'], fromJS(data))
    },
    [`${NAVIGATION_CHANGEAR}`]: (state, { payload }) => {
      let data = state.toJS().navigationChangeAR
      if (payload !== undefined) {
        data = payload
      } else {
        data = true
      }
      return state.setIn(['navigationChangeAR'], fromJS(data))
    },
    [`${NAVIGATION_POIVIEW}`]: (state, { payload }) => {
      let data = state.toJS().navigationPoiView
      if (payload !== undefined) {
        data = payload
      } else {
        data = true
      }
      return state.setIn(['navigationPoiView'], fromJS(data))
    },
    [`${ONLINEMAP}`]: (state, { payload }) => {
      let data = state.toJS().openOnlineMap
      if (payload !== undefined) {
        data = payload
      } else {
        data = false
      }
      return state.setIn(['openOnlineMap'], fromJS(data))
    },
    [`${NAVIGATION_HISTORY}`]: (state, { payload }) => {
      let data = state.toJS().navigationhistory
      if (payload) {
        data = payload
      } else {
        data = []
      }
      return state.setIn(['navigationhistory'], fromJS(data))
    },
    [`${AGREE_TO_PROTOCOL}`]: (state, { payload }) => {
      const data = payload || false
      return state.setIn(['isAgreeToProtocol'], fromJS(data))
    },
    [`${COLUMN_NAV_BAR}`]: (state, { payload }) => {
      const data = payload || false
      return state.setIn(['mapColumnNavBar'], fromJS(data))
    },
    [`${NAV_BAR_DISPLAY}`]: (state, { payload }) => {
      const data = payload || false
      return state.setIn(['navBarDisplay'], fromJS(data))
    },
    [`${TOGGLE_FIND_ITEM}`]: (state, { payload }) => {
      const data = payload || {}
      let curData = state.toJS().find
      Object.assign(curData, data)
      return state.setIn(['find'], fromJS(curData))
    },
    [`${TOGGLE_LABORATORY_ITEM}`]: (state, { payload }) => {
      const data = payload || {}
      let curData = state.toJS().laboratory
      Object.assign(curData, data)
      return state.setIn(['laboratory'], fromJS(curData))
    },
    [`${SHOW_DATUM_POINT}`]: (state, { payload }) => {
      return state.setIn(['showDatumPoint'], fromJS(payload))
    },
    [`${ARPOISEARCH_VIEW}`]: (state, { payload }) => {
      return state.setIn(['poiSearch'], fromJS(payload))
    },
    [`${SHOW_AR}`]: (state, { payload }) => {
      return state.setIn(['isAR'], fromJS(payload))
    },
    [`${SHOW_AR_SCENE_NOTIFY}`]: (state, { payload }) => {
      return state.setIn(['showARSceneNotify'], fromJS(payload))
    },
    [`${SET_ARLABEL}`]: (state, { payload }) => {
      return state.setIn(['showARLabel'], fromJS(payload))
    },
    [`${SHOW_COMPASS}`]: (state, { payload }) => {
      return state.setIn(['isShowCompass'], fromJS(payload))
    },
    [`${SET_AI_DETECT_MODEL}`]: (state, { payload }) => {
      return state.setIn(['aiDetectData'], fromJS(payload))
    },
    [`${SET_AI_CLASSIFY_MODEL}`]: (state, { payload }) => {
      return state.setIn(['aiClassifyData'], fromJS(payload))
    },
    [REHYDRATE]: (state, { payload }) => {
      let data: SettingStateType = ModelUtils.checkModel(
        state,
        payload && payload.setting,
      ).toJSON()
      let legendKeys = Object.keys(data.mapLegend)
      let defaultKeys = Object.keys(defaultMapLegend)
      for (let key of defaultKeys) {
        if (legendKeys.indexOf(key) < 0) {
          data.mapLegend[key] = defaultMapLegend[key]
        }
      }
      for (let key of legendKeys) {
        if (defaultKeys.indexOf(key) < 0) {
          delete data.mapLegend[key]
        }
      }
      data.showDatumPoint = false
      data.isAR = false
      data.poiSearch = false
      // data.showARLabel = true

      // 临时存放上一期关闭app时保存的数据
      payload && setLastLaunchState(payload)
      return fromJS(data)
    },
  },
  initialState,
)
