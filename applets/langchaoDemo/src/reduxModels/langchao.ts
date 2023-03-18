import { getLastLaunchState } from '@/redux/store'
import { fromJS } from 'immutable'
import { handleActions } from 'redux-actions'
import { REHYDRATE } from 'redux-persist'
import { setServerIPUtil, setServerTokenUtil, setServerClientidUtil, setUserId, setUserName, setSysOrgid, setPubKey, setPassword as setPw, setUserInfo } from '../utils/langchaoServer'
// Constants
// --------------------------------------------------
export const LANGCHAO_SET_SERVER_IP = "LANGCHAO_SET_SERVER_IP"
export const LANGCHAO_SET_SERVER_TOKEN = "LANGCHAO_SET_SERVER_TOKEN"
export const LANGCHAO_SET_SERVER_CLIENT_ID = "LANGCHAO_SET_SERVER_CLIENT_ID"
export const LANGCHAO_SET_USER_ID = "LANGCHAO_SET_USER_ID"
export const LANGCHAO_SET_USER_NAME = "LANGCHAO_SET_USER_NAME"
export const LANGCHAO_SET_DEPARTMENT_ID = "LANGCHAO_SET_DEPARTMENT_ID"
export const LANGCHAO_ADD_CONTACT = "LANGCHAO_ADD_CONTACT"
export const LANGCHAO_SET_COUNTRY = "LANGCHAO_SET_COUNTRY"
export const LANGCHAO_SET_CITY = "LANGCHAO_SET_CITY"
export const LANGCHAO_SET_PASSWORD = "LANGCHAO_SET_PASSWORD"
export const LANGCHAO_SET_PUBKEY = "LANGCHAO_SET_PUBKEY"
export const LANGCHAO_SET_USERINFO = "LANGCHAO_SET_USERINFO"
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

export const addContact = (
  params = "",
  cb = () => {},
) => async (dispatch: (arg0: any) => any) => {
  setSysOrgid(params)
  await dispatch({
    type: LANGCHAO_ADD_CONTACT,
    payload: params,
  })
  cb && cb()
}


export const setCountry = (
  params = "",
  cb = () => {},
) => async (dispatch: (arg0: any) => any) => {
  await dispatch({
    type: LANGCHAO_SET_COUNTRY,
    payload: params,
  })
  cb && cb()
}

export const setCity = (
  params = "",
  cb = () => {},
) => async (dispatch: (arg0: any) => any) => {
  await dispatch({
    type: LANGCHAO_SET_CITY,
    payload: params,
  })
  cb && cb()
}

export const setPassword = (
  params = "",
  cb = () => {},
) => async (dispatch: (arg0: any) => any) => {
  setPw(params)
  await dispatch({
    type: LANGCHAO_SET_PASSWORD,
    payload: params,
  })
  cb && cb()
}

export const setServerPubkey = (
  params = "",
  cb = () => {},
) => async (dispatch: (arg0: any) => any) => {
  setPubKey(params)
  await dispatch({
    type: LANGCHAO_SET_PUBKEY,
    payload: params,
  })
  cb && cb()
}

export const setLangchaoUserInfo = (
  params = null,
  cb = () => {},
) => async (dispatch: (arg0: any) => any) => {
  setUserInfo(params)
  await dispatch({
    type: LANGCHAO_SET_USERINFO,
    payload: params,
  })
  cb && cb()
}

export interface contactItemType {
  ID: number,
  userID: string,
  name: string, // displayName
  phone: string, // phoneNumbers[0].number
}




const initialState = fromJS({
  serverIP: null,
  token: null,
  clientid: "Gvvy19yU",
  userId: '',
  userName: '',
  departmentId: '',
  contacts: [],
  password: '',
  pubkey: `MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDYdvhxlmpCV5iE3iaWv7M0Fe/x
  /L1qfXzDuBovOoWkzN78/pYpatRouPOSO634Hl9mekWbuUXFwI3hCoTDvk1M/Kbc
  pcXAgIiavv/KvGxgeIdaHMAFH7gzHaF0fsayF9DrLdrgyDttw+qeV3z//DVpxUn6
  Gdig1KA4pvB/3DhfsQIDAQAB`,
  // pubkey: "",
  langchaoUserInfo: null,
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
    [`${LANGCHAO_ADD_CONTACT}`]: (state: any, { payload }: any) => {
      return state.setIn(['contacts'], fromJS(payload))
    },
    [`${LANGCHAO_SET_COUNTRY}`]: (state: any, { payload }: any) => {
      return state.setIn(['country'], fromJS(payload))
    },
    [`${LANGCHAO_SET_CITY}`]: (state: any, { payload }: any) => {
      return state.setIn(['city'], fromJS(payload))
    },
    [`${LANGCHAO_SET_PASSWORD}`]: (state: any, { payload }: any) => {
      return state.setIn(['password'], fromJS(payload))
    },
    [`${LANGCHAO_SET_PUBKEY}`]: (state: any, { payload }: any) => {
      return state.setIn(['pubkey'], fromJS(payload))
    },
    [`${LANGCHAO_SET_USERINFO}`]: (state: any, { payload }: any) => {
      return state.setIn(['langchaoUserInfo'], fromJS(payload))
    },
    [REHYDRATE]: (state, { payload }) => {
      const langchao = getLastLaunchState()?.langchao
      if(langchao) {
        const data = langchao
        setServerIPUtil(data.serverIP)
        setServerTokenUtil(data.token)
        setServerClientidUtil(data.clientid)
        setUserId(data.userId)
        setPw(data.password)
        setUserName(data.userName)
        setSysOrgid(data.departmentId)
        setPubKey(data.pubkey)
        setUserInfo(data.langchaoUserInfo)
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

