import { fromJS } from 'immutable'
import { REHYDRATE } from 'redux-persist'
import { handleActions } from 'redux-actions'
import { DatasetType, SMap, SLanguage } from 'imobile_for_reactnative'
import { NativeModules } from 'react-native'
import { getMapSettings } from '../../containers/mapSetting/settingData'
import { ModelUtils } from '../../utils'
import { ChunkType } from '../../constants'

const { AppUtils } = NativeModules
// Constants
// --------------------------------------------------
export const BUFFER_SETTING_SET = 'BUFFER_SETTING_SET'
export const OVERLAY_SETTING_SET = 'OVERLAY_SETTING_SET'
export const ROUTE_SETTING_SET = 'ROUTE_SETTING_SET'
export const TRACKING_SETTING_SET = 'TRACKING_SETTING_SET'
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
// Actions
// --------------------------------------------------
export const setBufferSetting = (params, cb = () => {}) => async dispatch => {
  await dispatch({
    type: BUFFER_SETTING_SET,
    payload: params || {},
  })
  cb && cb()
}

export const setOverlaySetting = (params, cb = () => {}) => async dispatch => {
  await dispatch({
    type: OVERLAY_SETTING_SET || {},
    payload: params,
  })
  cb && cb()
}

export const setRouteSetting = (params, cb = () => {}) => async dispatch => {
  await dispatch({
    type: ROUTE_SETTING_SET,
    payload: params,
  })
  cb && cb()
}

export const setTrackingSetting = (params, cb = () => {}) => async dispatch => {
  await dispatch({
    type: TRACKING_SETTING_SET,
    payload: params,
  })
  cb && cb()
}

export const setSettingData = (data = [], cb = () => {}) => async dispatch => {
  await dispatch({
    type: SETTING_DATA,
    payload: data,
  })
  cb && cb()
}

export const setMapSetting = (cb = () => {}) => async dispatch => {
  await dispatch({
    type: MAP_SETTING,
    payload: [],
  })
  cb && cb()
}

export const setLanguage = (params, isConfig = false, cb = () => {}) => async (
  dispatch,
  getState,
) => {
  if (params === 'AUTO') {
    let supportLanguage = getState().appConfig.toJS().supportLanguage
    if (!supportLanguage) supportLanguage = []
    const allSupportLanguage = ['CN', 'EN', 'TR', 'JA', 'FR', 'AR']
    supportLanguage = supportLanguage.filter(item => {
      return allSupportLanguage.indexOf(item) > -1
    })
    let isSupported = language => {
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
    GLOBAL.language = language
  } else {
    await SLanguage.setLanguage(params)
    await dispatch({
      type: SETTING_LANGUAGE,
      payload: params,
    })
    GLOBAL.language = params
  }
  if (isConfig) {
    await dispatch({
      type: SETTING_CONFIG_LANGUAGE_SET,
    })
  }
  cb && cb()
}
export const setDevice = (params = {}) => async dispatch => {
  await dispatch({
    type: SETTING_DEVICE,
    payload: params || false,
  })
}
export const setMapLegend = (params = {}) => async dispatch => {
  await dispatch({
    type: MAP_LEGEND,
    payload: params || false,
  })
}
export const setMapNavigation = (params = {}) => async dispatch => {
  await dispatch({
    type: MAP_NAVIGATION,
    payload: params || false,
  })
}

export const setNavigationChangeAR = (params = {}) => async dispatch => {
  await dispatch({
    type: NAVIGATION_CHANGEAR,
    payload: params || false,
  })
}
export const setNavigationPoiView = (params = {}) => async dispatch => {
  await dispatch({
    type: NAVIGATION_POIVIEW,
    payload: params || false,
  })
}
export const setOpenOnlineMap = (params = {}) => async dispatch => {
  await dispatch({
    type: ONLINEMAP,
    payload: params || false,
  })
}
export const setNavigationHistory = (
  data = [],
  cb = () => {},
) => async dispatch => {
  await dispatch({
    type: NAVIGATION_HISTORY,
    payload: data,
  })
  cb && cb()
}
export const setMapScaleView = (params = {}) => async dispatch => {
  await dispatch({
    type: MAP_SCALEVIEW,
    payload: params || false,
  })
}
export const getMapSetting = (params = {}, cb = () => {}) => async dispatch => {
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

export const setAgreeToProtocol = (params = {}) => async dispatch => {
  await dispatch({
    type: AGREE_TO_PROTOCOL,
    payload: params || false,
  })
}

export const setColumnNavBar = (params = {}) => async dispatch => {
  await dispatch({
    type: COLUMN_NAV_BAR,
    payload: params || false,
  })
}

export const setNavBarDisplay = (params = {}) => async dispatch => {
  await dispatch({
    type: NAV_BAR_DISPLAY,
    payload: params || false,
  })
}

export const toggleFindItem = (params = {}) => async dispatch => {
  await dispatch({
    type: TOGGLE_FIND_ITEM,
    payload: params || {},
  })
}

export const toggleLaboratoryItem = (params = {}) => async dispatch => {
  await dispatch({
    type: TOGGLE_LABORATORY_ITEM,
    payload: params || {},
  })
}

/** 显示AR位置定位 */
export const setDatumPoint = (show = false) => async dispatch => {
  await dispatch({
    type: SHOW_DATUM_POINT,
    payload: show,
  })
}

/** 显示AR界面 */
export const showAR = (show = false) => async dispatch => {
  await dispatch({
    type: SHOW_AR,
    payload: show,
  })
}

/** AR场景提示 */
export const setShowARSceneNotify = show => async dispatch => {
  await dispatch({
    type: SHOW_AR_SCENE_NOTIFY,
    payload: show,
  })
}

/** AR场景提示 */
export const showCompass = show => async dispatch => {
  await dispatch({
    type: SHOW_COMPASS,
    payload: show,
  })
}

let defaultMapLegend = (() => {
  let _mapLegend = {}
  let legendConfig = {
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

  let moduleKeys = Object.keys(ChunkType)
  moduleKeys.map(item => {
    _mapLegend[item] = { ...legendConfig }
  })
  return _mapLegend
})()

const initialState = fromJS({
  buffer: {
    endType: 1,
    distance: 10,
    selectedLayer: {},
  },
  overlay: {
    datasetVector: {},
    targetDatasetVector: {},
    resultDataset: {},
    method: 'clip',
    overlayType: DatasetType.POINT,
  },
  route: {
    mode: '',
  },
  settingData: [],
  mapSetting: [],
  language: 'CN',
  autoLanguage: true,
  configLangSet: false,
  peripheralDevice: 'local',
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
  /** 指南针 */
  isShowCompass: false,
})

export default handleActions(
  {
    [`${SETTING_LANGUAGE}`]: (state, { payload }) =>
      state
        .setIn(['language'], fromJS(payload))
        .setIn(['autoLanguage'], fromJS(false)),
    [`${SETTING_LANGUAGE_AUTO}`]: (state, { payload }) =>
      state
        .setIn(['language'], fromJS(payload))
        .setIn(['autoLanguage'], fromJS(true)),
    [`${SETTING_CONFIG_LANGUAGE_SET}`]: state =>
      state.setIn(['configLangSet'], fromJS(true)),
    [`${SETTING_DEVICE}`]: (state, { payload }) =>
      state.setIn(['peripheralDevice'], fromJS(payload)),
    [`${BUFFER_SETTING_SET}`]: (state, { payload }) =>
      state.setIn(['buffer'], fromJS(payload)),
    [`${OVERLAY_SETTING_SET}`]: (state, { payload }) => {
      let data = state.toJS().overlay
      if (payload) {
        Object.assign(data, payload)
      } else {
        data = initialState.toJS().overlay
      }
      return state.setIn(['overlay'], fromJS(data))
    },
    [`${ROUTE_SETTING_SET}`]: (state, { payload }) => {
      let data = state.toJS().overlay
      if (payload) {
        Object.assign(data, payload)
      } else {
        data = initialState.toJS().overlay
      }
      return state.setIn(['overlay'], fromJS(data))
    },
    [`${TRACKING_SETTING_SET}`]: (state, { payload }) => {
      let data = state.toJS().overlay
      if (payload) {
        Object.assign(data, payload)
      } else {
        data = initialState.toJS().overlay
      }
      return state.setIn(['overlay'], fromJS(data))
    },
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
    [`${SHOW_AR}`]: (state, { payload }) => {
      return state.setIn(['isAR'], fromJS(payload))
    },
    [`${SHOW_AR_SCENE_NOTIFY}`]: (state, { payload }) => {
      return state.setIn(['showARSceneNotify'], fromJS(payload))
    },
    [`${SHOW_COMPASS}`]: (state, { payload }) => {
      return state.setIn(['isShowCompass'], fromJS(payload))
    },
    [REHYDRATE]: (state, { payload }) => {
      let data = ModelUtils.checkModel(
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
      return fromJS(data)
    },
  },
  initialState,
)
