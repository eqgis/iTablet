import { fromJS } from 'immutable'
import { handleActions } from 'redux-actions'
// Constants
// --------------------------------------------------
export const GUOTU_SET_CURRENT_GROUP = 'GUOTU_SET_CURRENT_GROUP'
export const GUOTU_GET_CURRENT_GROUP = 'GUOTU_GET_CURRENT_GROUP'
// Actions
// ---------------------------------.3-----------------

export const getGroups = (
  params = {},
  cb = () => {},
) => async (dispatch: (arg0: any) => any) => {
  await dispatch({
    type: GUOTU_GET_CURRENT_GROUP,
    payload: params,
  })
  cb && cb()
}

export const setCurrentGroup = (
  params = {},
  cb = () => {},
) => async (dispatch: (arg0: any) => any) => {
  await dispatch({
    type: GUOTU_SET_CURRENT_GROUP,
    payload: params,
  })
  cb && cb()
}

const initialState = fromJS({
  currentGroup: null,
  groups: [],
})

export default handleActions(
  {
    [`${GUOTU_SET_CURRENT_GROUP}`]: (state: any, { payload }: any) => {
      return state.setIn(['currentGroup'], fromJS(payload))
    },
    [`${GUOTU_GET_CURRENT_GROUP}`]: (state: any, { payload }: any) => {
      return state.setIn(['groups'], fromJS(payload))
    },
    // [REHYDRATE]: () => {
    //   // return payload && payload.down ? fromJS(payload.down) : state
    //   return initialState
    // },
  },
  initialState,
)
