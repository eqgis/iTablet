import { fromJS } from 'immutable'
import { REHYDRATE } from 'redux-persist'
import { handleActions } from 'redux-actions'
import { ModelUtils } from '../../utils'
// Constants
// --------------------------------------------------
export const LICENSE_INFO_SET = 'LICENSE_INFO_SET'
export const CLOUD_LICENSE_USER_SET = 'CLOUD_LICENSE_USER_SET'
export const LICENSE_SERVER_SET = 'LICENSE_SERVER_SET'
export const CLOUD_LICENSE_SITE_SET = 'CLOUD_LICENSE_SITE_SET'
export const EDUCATION_LICENSE_SERVER_SET = 'EDUCATION_LICENSE_SERVER_SET'

// Actions
// ---------------------------------.3-----------------

export const setLicenseInfo = (
  params = {},
  cb = () => {},
) => async dispatch => {
  await dispatch({
    type: LICENSE_INFO_SET,
    payload: params,
  })
  cb && cb()
}

export const setEducationServer = (
  params = {},
  cb = () => {},
) => async dispatch => {
  await dispatch({
    type: EDUCATION_LICENSE_SERVER_SET,
    payload: params,
  })
  cb && cb()
}

export const setCloudLicenseUser = (
  params = {},
  cb = () => {},
) => async dispatch => {
  await dispatch({
    type: CLOUD_LICENSE_USER_SET,
    payload: params,
  })
  cb && cb()
}

export const setPrivateLicenseServer = (
  params = {},
  cb = () => {},
) => async dispatch => {
  await dispatch({
    type: LICENSE_SERVER_SET,
    payload: params,
  })
  cb && cb()
}

export const setCloudLicenseSite = (
  params = {},
  cb = () => {},
) => async dispatch => {
  await dispatch({
    type: CLOUD_LICENSE_SITE_SET,
    payload: params,
  })
  cb && cb()
}

const initialState = fromJS({
  licenseInfo: {},
  cloudLicenseUser: {},
  privateLicenseServer: '',
  cloudLicenseSite: 'DEFAULT',
})

export default handleActions(
  {
    [`${LICENSE_INFO_SET}`]: (state, { payload }) => {
      return state.setIn(['licenseInfo'], fromJS(payload))
    },
    [`${CLOUD_LICENSE_USER_SET}`]: (state, { payload }) => {
      return state.setIn(['cloudLicenseUser'], fromJS(payload))
    },
    [`${LICENSE_SERVER_SET}`]: (state, { payload }) => {
      return state.setIn(['privateLicenseServer'], fromJS(payload))
    },
    [`${CLOUD_LICENSE_SITE_SET}`]: (state, { payload }) => {
      return state.setIn(['cloudLicenseSite'], fromJS(payload))
    },
    [`${EDUCATION_LICENSE_SERVER_SET}`]: (state, { payload }) => {
      return state.setIn(['educationServer'], fromJS(payload))
    },
    [REHYDRATE]: (state, { payload }) => {
      const _data = ModelUtils.checkModel(state, payload && payload.license)
      return _data
    },
  },
  initialState,
)
