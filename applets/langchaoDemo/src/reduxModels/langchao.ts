import { fromJS } from 'immutable'
import { handleActions } from 'redux-actions'
import { REHYDRATE } from 'redux-persist'
import { setServerIPUtil, setServerTokenUtil, setServerClientidUtil } from '../utils/langchaoServer'
// Constants
// --------------------------------------------------
export const LANGCHAO_SET_SERVER_IP = "LANGCHAO_SET_SERVER_IP"
export const LANGCHAO_SET_SERVER_TOKEN = "LANGCHAO_SET_SERVER_TOKEN"
export const LANGCHAO_SET_SERVER_CLIENT_ID = "LANGCHAO_SET_SERVER_CLIENT_ID"
// Actions
// ---------------------------------.3-----------------

export const setServerIP = (
  params = "",
  cb = () => {},
) => async (dispatch: (arg0: any) => any) => {
  setServerIPUtil(params)
  await dispatch({
    type: LANGCHAO_SET_SERVER_IP,
    payload: params,
  })
  cb && cb()
}

export const setServerToken = (
  params = "",
  cb = () => {},
) => async (dispatch: (arg0: any) => any) => {
  setServerTokenUtil(params)
  await dispatch({
    type: LANGCHAO_SET_SERVER_TOKEN,
    payload: params,
  })
  cb && cb()
}

export const setServerClientid = (
  params = "",
  cb = () => {},
) => async (dispatch: (arg0: any) => any) => {
  setServerClientidUtil(params)
  await dispatch({
    type: LANGCHAO_SET_SERVER_CLIENT_ID,
    payload: params,
  })
  cb && cb()
}

const initialState = fromJS({
  serverIP: null,
  token: null,
  clientid: "Gvvy19yU",
})

export default handleActions(
  {
    [`${LANGCHAO_SET_SERVER_IP}`]: (state: any, { payload }: any) => {
      return state.setIn(['serverIP'], fromJS(payload))
    },
    [`${LANGCHAO_SET_SERVER_TOKEN}`]: (state: any, { payload }: any) => {
      return state.setIn(['token'], fromJS(payload))
    },
    [`${LANGCHAO_SET_SERVER_CLIENT_ID}`]: (state: any, { payload }: any) => {
      return state.setIn(['clientid'], fromJS(payload))
    },
    [REHYDRATE]: (state,) => {
      return state
    },
  },
  initialState,
)
