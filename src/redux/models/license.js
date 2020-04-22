import { fromJS } from 'immutable'
import { REHYDRATE } from 'redux-persist'
import { handleActions } from 'redux-actions'
import { ModelUtils } from '../../utils'
// Constants
// --------------------------------------------------
export const INFO_SET = 'INFO_SET'
export const USER_SET = 'USER_SET'
export const SERVER_SET = 'SERVER_SET'

// Actions
// ---------------------------------.3-----------------

export const setLicenseInfo = (
  params = {},
  cb = () => {},
) => async dispatch => {
  await dispatch({
    type: INFO_SET,
    payload: params,
  })
  cb && cb()
}

export const setCloudLicenseUser = (
  params = {},
  cb = () => {},
) => async dispatch => {
  await dispatch({
    type: USER_SET,
    payload: params,
  })
  cb && cb()
}

export const setPrivateLicenseServer = (
  params = {},
  cb = () => {},
) => async dispatch => {
  await dispatch({
    type: SERVER_SET,
    payload: params,
  })
  cb && cb()
}

const initialState = fromJS({
  licenseInfo: {},
  cloudLicenseUser: {},
  privateLicenseServer: '',
})

export default handleActions(
  {
    [`${INFO_SET}`]: (state, { payload }) => {
      return state.setIn(['licenseInfo'], fromJS(payload))
    },
    [`${USER_SET}`]: (state, { payload }) => {
      return state.setIn(['cloudLicenseUser'], fromJS(payload))
    },
    [`${SERVER_SET}`]: (state, { payload }) => {
      return state.setIn(['privateLicenseServer'], fromJS(payload))
    },
    [REHYDRATE]: (state, { payload }) => {
      const _data = ModelUtils.checkModel(state, payload && payload.license)
      return _data
    },
  },
  initialState,
)
