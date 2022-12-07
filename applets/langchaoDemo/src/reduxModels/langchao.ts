import { fromJS } from 'immutable'
import { handleActions } from 'redux-actions'
import { REHYDRATE } from 'redux-persist'
// Constants
// --------------------------------------------------
export const GUOTU_SET_CURRENT_GROUP = 'GUOTU_SET_CURRENT_GROUP'
export const LANGCHAO_SET_SERVER_IP = "LANGCHAO_SET_SERVER_IP"
// Actions
// ---------------------------------.3-----------------

export const setServerIP = (
  params = "",
  cb = () => {},
) => async (dispatch: (arg0: any) => any) => {
  await dispatch({
    type: LANGCHAO_SET_SERVER_IP,
    payload: params,
  })
  cb && cb()
}

const initialState = fromJS({
  serverIP: null,
})

export default handleActions(
  {
    [`${LANGCHAO_SET_SERVER_IP}`]: (state: any, { payload }: any) => {
      return state.setIn(['serverIP'], fromJS(payload))
    },
    [REHYDRATE]: (state,) => {
      return state
    },
  },
  initialState,
)
