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
export const MAP_AR_PIPE_LINE_ATTRIBUTE = 'MAP_AR_PIPE_LINE_ATTRIBUTE'

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

interface PipeLineAttributeType {
  title: string
  value: string
}
interface PipeLineAttribute {
  type: string,
  payload: Array<PipeLineAttributeType> | null,
}

// Actions
// --------------------------------------------------

export const getARLayers = () => async (dispatch: (params: DispatchParams) => any) => {
  try {
    // 将获取到的数组反序
    const layers = await (await SARMap.getLayers()).reverse()
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
  layer?: ARLayer
) => (dispatch: (params: DispatchParams) => any) => {
  dispatch({
    type: SET_CURRENT_AR_LAYER,
    payload: layer,
  })
}

/** 设置ar三维管线属性 */
export const setPipeLineAttribute = (attributeArr: Array<PipeLineAttributeType> = []) => async (dispatch:(params: PipeLineAttribute) => void) => {
  try {
    dispatch({
      type: MAP_AR_PIPE_LINE_ATTRIBUTE,
      payload: attributeArr,
    })
  } catch (error) {
    console.warn("设置ar三维管线属性出错啦！")
  }
}

const initialState = fromJS({
  layers: [],
  currentLayer: undefined,
  pipeLineAttribute:[], // AR管线的属性数组
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
    [`${MAP_AR_PIPE_LINE_ATTRIBUTE}`]: (state: any, { payload }) => {
      return  state.setIn(['pipeLineAttribute'], fromJS(payload))
    },
    // [REHYDRATE]: (state: any, { payload }: ARLayerAction<ARMapInfo>) => {
    //   return state
    // },
  },
  initialState,
)
