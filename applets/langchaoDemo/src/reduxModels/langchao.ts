import { getLastLaunchState } from '@/redux/store'
import { fromJS } from 'immutable'
import { handleActions } from 'redux-actions'
import { REHYDRATE } from 'redux-persist'
import { setServerIPUtil, setServerTokenUtil, setServerClientidUtil, setUserId, setUserName, setSysOrgid } from '../utils/langchaoServer'
// Constants
// --------------------------------------------------
export const LANGCHAO_SET_SERVER_IP = "LANGCHAO_SET_SERVER_IP"
export const LANGCHAO_SET_SERVER_TOKEN = "LANGCHAO_SET_SERVER_TOKEN"
export const LANGCHAO_SET_SERVER_CLIENT_ID = "LANGCHAO_SET_SERVER_CLIENT_ID"
export const LANGCHAO_SET_USER_ID = "LANGCHAO_SET_USER_ID"
export const LANGCHAO_SET_USER_NAME = "LANGCHAO_SET_USER_NAME"
export const LANGCHAO_SET_DEPARTMENT_ID = "LANGCHAO_SET_DEPARTMENT_ID"
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

export const setServerUserId = (
  params = "",
  cb = () => {},
) => async (dispatch: (arg0: any) => any) => {
  setUserId(params)
  await dispatch({
    type: LANGCHAO_SET_USER_ID,
    payload: params,
  })
  cb && cb()
}

export const setServerUserName = (
  params = "",
  cb = () => {},
) => async (dispatch: (arg0: any) => any) => {
  setUserName(params)
  await dispatch({
    type: LANGCHAO_SET_USER_NAME,
    payload: params,
  })
  cb && cb()
}

export const setServerDepartmentId = (
  params = "",
  cb = () => {},
) => async (dispatch: (arg0: any) => any) => {
  setSysOrgid(params)
  await dispatch({
    type: LANGCHAO_SET_DEPARTMENT_ID,
    payload: params,
  })
  cb && cb()
}

const initialState = fromJS({
  serverIP: null,
  token: null,
  clientid: "Gvvy19yU",
  userId: '',
  userName: '',
  departmentId: '',
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
    [`${LANGCHAO_SET_USER_ID}`]: (state: any, { payload }: any) => {
      return state.setIn(['userId'], fromJS(payload))
    },
    [`${LANGCHAO_SET_USER_NAME}`]: (state: any, { payload }: any) => {
      return state.setIn(['userName'], fromJS(payload))
    },
    [`${LANGCHAO_SET_DEPARTMENT_ID}`]: (state: any, { payload }: any) => {
      return state.setIn(['departmentId'], fromJS(payload))
    },
    [REHYDRATE]: (state, { payload }) => {
      const langchao = getLastLaunchState()?.langchao
      if(langchao) {
        const data = langchao
        setServerIPUtil(data.serverIP)
        setServerTokenUtil(data.token)
        setServerClientidUtil(data.clientid)
        setUserId(data.userId)
        setUserName(data.userName)
        setSysOrgid(data.departmentId)
      }
      // console.warn(" ======================= langchao demo   ==============================")
      // console.warn("langchao redux: " + JSON.stringify(langchao))
      // console.warn("langchao redux payload: " + JSON.stringify(payload?.langchao))
      // return payload && payload.langchao ? fromJS(payload.langchao) : state
      return fromJS(langchao) || state

    },
  },
  initialState,
)
