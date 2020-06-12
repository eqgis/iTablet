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
    let isSupported = language => {
      return (
        supportLanguage.length === 0 || supportLanguage.indexOf(language) > -1
      )
    }
    const locale = await AppUtils.getLocale()
    let language
    if (locale === 'zh-CN' && isSupported('CN')) {
      language = 'CN'
    } else if (locale.indexOf('tr-') === 0 && isSupported('TR')) {
      language = 'TR'
    } else if (locale.indexOf('ja-') === 0 && isSupported('JA')) {
      language = 'JA'
    } else if (locale.indexOf('fr-') === 0 && isSupported('FR')) {
      language = 'FR'
    } else if (locale.indexOf('ar-') === 0 && isSupported('AR')) {
      language = 'AR'
    } else {
      language = 'EN'
    }
    await SLanguage.setLanguage(language)
    await dispatch({
      type: SETTING_LANGUAGE_AUTO,
      payload: language,
    })
    global.language = language
  } else {
    await SLanguage.setLanguage(params)
    await dispatch({
      type: SETTING_LANGUAGE,
      payload: params,
    })
    global.language = params
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
export const setMap2Dto3D = (params = {}) => async dispatch => {
  await dispatch({
    type: MAP_2DTO3D,
    payload: params || false,
  })
}
export const setMapIs3D = (params = {}) => async dispatch => {
  await dispatch({
    type: MAP_IS3D,
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
  mapLegend: {
    [ChunkType.MAP_EDIT]: {
      isShow: false,
      backgroundColor: 'white',
      column: 2,
      widthPercent: 80,
      heightPercent: 80,
      fontPercent: 50,
      imagePercent: 50,
      legendPosition: 'topLeft',
    },
    [ChunkType.MAP_THEME]: {
      isShow: false,
      backgroundColor: 'white',
      column: 2,
      widthPercent: 80,
      heightPercent: 80,
      fontPercent: 50,
      imagePercent: 50,
      legendPosition: 'topLeft',
    },
    [ChunkType.MAP_PLOTTING]: {
      isShow: false,
      backgroundColor: 'white',
      column: 2,
      widthPercent: 80,
      heightPercent: 80,
      fontPercent: 50,
      imagePercent: 50,
      legendPosition: 'topLeft',
    },
    [ChunkType.MAP_NAVIGATION]: {
      isShow: false,
      backgroundColor: 'white',
      column: 2,
      widthPercent: 80,
      heightPercent: 80,
      fontPercent: 50,
      imagePercent: 50,
      legendPosition: 'topLeft',
    },
    [ChunkType.MAP_ANALYST]: {
      isShow: false,
      backgroundColor: 'white',
      column: 2,
      widthPercent: 80,
      heightPercent: 80,
      fontPercent: 50,
      imagePercent: 50,
      legendPosition: 'topLeft',
    },
    [ChunkType.MAP_COLLECTION]: {
      isShow: false,
      backgroundColor: 'white',
      column: 2,
      widthPercent: 80,
      heightPercent: 80,
      fontPercent: 50,
      imagePercent: 50,
      legendPosition: 'topLeft',
    },
    [ChunkType.MAP_AR]: {
      isShow: false,
      backgroundColor: 'white',
      column: 2,
      widthPercent: 80,
      heightPercent: 80,
      fontPercent: 50,
      imagePercent: 50,
      legendPosition: 'topLeft',
    },
  },
  mapNavigation: {
    isShow: false,
    name: '',
  },
  map2Dto3D: false,
  mapIs3D: false,
  mapScaleView: true,
  navigationChangeAR: false,
  navigationPoiView: false,
  openOnlineMap: false,
  isAgreeToProtocol: false,
  navigationhistory: [],
  mapColumnNavBar: true,
  navBarDisplay: false,
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
        data = {
          [ChunkType.MAP_EDIT]: {
            isShow: false,
            backgroundColor: 'white',
            column: 2,
            widthPercent: 80,
            heightPercent: 80,
            fontPercent: 50,
            imagePercent: 50,
            legendPosition: 'topLeft',
          },
          [ChunkType.MAP_THEME]: {
            isShow: false,
            backgroundColor: 'white',
            column: 2,
            widthPercent: 80,
            heightPercent: 80,
            fontPercent: 50,
            imagePercent: 50,
            legendPosition: 'topLeft',
          },
          [ChunkType.MAP_PLOTTING]: {
            isShow: false,
            backgroundColor: 'white',
            column: 2,
            widthPercent: 80,
            heightPercent: 80,
            fontPercent: 50,
            imagePercent: 50,
            legendPosition: 'topLeft',
          },
          [ChunkType.MAP_NAVIGATION]: {
            isShow: false,
            backgroundColor: 'white',
            column: 2,
            widthPercent: 80,
            heightPercent: 80,
            fontPercent: 50,
            imagePercent: 50,
            legendPosition: 'topLeft',
          },
          [ChunkType.MAP_ANALYST]: {
            isShow: false,
            backgroundColor: 'white',
            column: 2,
            widthPercent: 80,
            heightPercent: 80,
            fontPercent: 50,
            imagePercent: 50,
            legendPosition: 'topLeft',
          },
          [ChunkType.MAP_COLLECTION]: {
            isShow: false,
            backgroundColor: 'white',
            column: 2,
            widthPercent: 80,
            heightPercent: 80,
            fontPercent: 50,
            imagePercent: 50,
            legendPosition: 'topLeft',
          },
          [ChunkType.MAP_AR]: {
            isShow: false,
            backgroundColor: 'white',
            column: 2,
            widthPercent: 80,
            heightPercent: 80,
            fontPercent: 50,
            imagePercent: 50,
            legendPosition: 'topLeft',
          },
        }
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
    [`${MAP_2DTO3D}`]: (state, { payload }) => {
      let data = state.toJS().map2Dto3D
      if (payload !== undefined) {
        data = payload
      } else {
        data = false
      }
      return state.setIn(['map2Dto3D'], fromJS(data))
    },
    [`${MAP_IS3D}`]: (state, { payload }) => {
      let data = state.toJS().mapIs3D
      if (payload !== undefined) {
        data = payload
      } else {
        data = false
      }
      return state.setIn(['mapIs3D'], fromJS(data))
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
    [REHYDRATE]: (state, { payload }) =>
      // if (payload && payload.setting) {
      //   payload.setting.language = payload.setting.language === undefined ? 'CN' : payload.setting.language
      // }
      // return payload && payload.setting ? fromJS(payload.setting) : state
      ModelUtils.checkModel(state, payload && payload.setting),
  },
  initialState,
)
