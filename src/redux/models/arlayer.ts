import { fromJS } from 'immutable'
import { handleActions } from 'redux-actions'
import { ARLayer, SARMap } from 'imobile_for_reactnative'

import {
  NEW_AR_MAP,
  NewARMapAction,
  CLOSE_AR_MAP,
  OPEN_AR_MAP,
  OpenARMapAction,
} from "./armap"

const GET_AR_LAYERS = 'GET_AR_LAYERS'
const SET_CURRENT_AR_LAYER = 'SET_CURRENT_AR_LAYER'

export interface ARMapInfo {
  layers: ARLayer[],
  currentLayer: ARLayer | undefined,
}

export interface GetARLayerAction {
  type: typeof GET_AR_LAYERS,
  layers: ARLayer[],
}

export interface SetCurrentARLayerAction {
  type: typeof SET_CURRENT_AR_LAYER,
  layer: ARLayer | undefined,
}

interface ARLayerAction<T> {
  payload: T,
}

interface DispatchParams {
  type: string,
  [name: string]: any,
}

// Actions
// --------------------------------------------------

export const getARLayers = () => async (dispatch: (params: DispatchParams) => any) => {
  try {
    const layers = await SARMap.getLayers()
    dispatch({
      type: GET_AR_LAYERS,
      payload: layers,
    })
    return layers
  } catch(e) {
    return []
  }
}

export const setCurrentARLayer = (
  layer: ARLayer | undefined
) => (dispatch: (params: DispatchParams) => any) => {
  dispatch({
    type: SET_CURRENT_AR_LAYER,
    payload: layer,
  })
}

const initialState = fromJS({
  layers: [],
  currentLayer: undefined,
})

export default handleActions(
  {
    [`${NEW_AR_MAP}`]: (state: any, { payload }: ARLayerAction<NewARMapAction>) => {
      return state.setIn(['layers'], fromJS(payload.layers))
        .setIn(['currentLayer'], fromJS(undefined))
    },
    [`${GET_AR_LAYERS}`]: (state: any, { payload }: ARLayerAction<ARLayer[]>) => {
      return state.setIn(['layers'], fromJS(payload))
    },
    [`${SET_CURRENT_AR_LAYER}`]: (state: any, { payload }: ARLayerAction<ARLayer>) => {
      return state.setIn(['currentLayer'], fromJS(payload))
    },
    [`${CLOSE_AR_MAP}`]: (state: any) => {
      return state.setIn(['layers'], fromJS(undefined)).setIn(['currentLayer'], fromJS(undefined))
    },
    [`${OPEN_AR_MAP}`]: (state: any, { payload }: ARLayerAction<OpenARMapAction>) => {
      let currentLayer: ARLayer | undefined
      if (payload.layers?.length > 0) {
        currentLayer = payload.layers[0]
      }
      return state.setIn(['layers'], fromJS(payload.layers)).setIn(['currentLayer'], fromJS(currentLayer))
    },
    // [REHYDRATE]: (state: any, { payload }: ARLayerAction<ARMapInfo>) => {
    //   return state
    // },
  },
  initialState,
)
