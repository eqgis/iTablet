import { ARAnimatorType } from "imobile_for_reactnative/NativeModule/dataTypes"
import { ARGroupAnimatorParameter, ARModelAnimatorParameter, ARNodeRotationAnimatorParameter, ARNodeScaleAnimatorParameter, ARNodeTranslationAnimatorParameter, ARAnimatorParameter } from "imobile_for_reactnative/NativeModule/interfaces/ar/SARMap"
import { ThunkAction } from "redux-thunk"
import { RootState } from "../types"


const SET_CURRENT_AR_ANIMATION = 'SET_CURRENT_ARANIMATION'
const EDIT_AR_ANIMATION = 'EDIT_AR_ANIMATION'
const DELETE_AR_ANIMATION = 'DELETE_AR_ANIMATION'
const MOVE_AR_ANIMATION = 'MOVE_AR_ANIMATION'

/** 给 T 类型增加一个 id 字段 */
export type AppendID<T> = T & {
  /** 通过 AppendID<T> 增加的 id 字段 */
  eid: string
}

export type ARAnimatorWithID = AppendID<ARNodeRotationAnimatorParameter>
                      | AppendID<ARNodeTranslationAnimatorParameter>
                      | AppendID<ARNodeScaleAnimatorParameter>
                      | AppendID<ARModelAnimatorParameter>
                      | AppendID<ARGroupAnimatorParameter<ARAnimatorWithID>>

interface SetARAnimationAction {
  type: typeof SET_CURRENT_AR_ANIMATION,
  animation: AppendID<ARGroupAnimatorParameter<ARAnimatorWithID>> | undefined
}

interface EditARAnimationAction {
  type: typeof EDIT_AR_ANIMATION
  id: string
  animation: ARAnimatorParameter
}

interface DeleteARAnimationAction {
  type: typeof DELETE_AR_ANIMATION
  id: string
}

interface MoveARAnimationAction {
  type: typeof MOVE_AR_ANIMATION
  id: string
  parentId: string
  moveIndex: number
}

type ARAnimationAction = SetARAnimationAction
                       | EditARAnimationAction
                       | DeleteARAnimationAction
                       | MoveARAnimationAction

interface ARAnimationState  {
  arAnimation?: AppendID<ARGroupAnimatorParameter<ARAnimatorWithID>>
}

const initState: ARAnimationState = {}

const encodeAnimation = (inputAnimator: ARAnimatorParameter) => {
  const data = new Date().getTime() + '_' + Math.random()
  const animator = inputAnimator as AppendID<ARGroupAnimatorParameter<ARAnimatorWithID>>
  animator.eid = data
  if(animator.type === ARAnimatorType.GROUP_TYPE) {
    animator.animations.map(item => {
      encodeAnimation(item)
    })
  }
}


export const setARAnimation = (animation: ARGroupAnimatorParameter<ARAnimatorParameter> | undefined): ThunkAction<void, RootState, unknown, SetARAnimationAction> => async(dispatch) => {
  if(animation !== undefined) encodeAnimation(animation)
  dispatch({
    type: SET_CURRENT_AR_ANIMATION,
    animation: animation as AppendID<ARGroupAnimatorParameter<ARAnimatorWithID>>
  })
}

export const editARAnimation = (
  id: string,
  animation: ARAnimatorParameter
): ThunkAction<void, RootState, unknown, EditARAnimationAction> => async(dispatch) => {
  dispatch({
    type: EDIT_AR_ANIMATION,
    animation,
    id,
  })
}

export const deleteARAnimation = (
  id: string,
): ThunkAction<void, RootState, unknown, DeleteARAnimationAction> => async(dispatch) => {
  dispatch({
    type: DELETE_AR_ANIMATION,
    id,
  })
}

export const moveARAnimation = (
  id: string,
  parentId: string,
  moveIndex: number,
): ThunkAction<void, RootState, unknown, MoveARAnimationAction> => async(dispatch) => {
  dispatch({
    type: MOVE_AR_ANIMATION,
    id,
    parentId,
    moveIndex
  })
}

/** 根据id从动画中找到animator */
function getSelectedAnimaor(animator: AppendID<ARGroupAnimatorParameter<ARAnimatorWithID>> | undefined, id:string): {animator: AppendID<ARGroupAnimatorParameter<ARAnimatorWithID>>, index:number} | undefined {
  if(animator === undefined) return undefined
  for(let i = 0; i < animator.animations.length; i++) {
    const _aniamtor = animator.animations[i]
    if(_aniamtor.eid === id) {
      return {animator: animator, index: i}
    }
    if(_aniamtor.type === ARAnimatorType.GROUP_TYPE) {
      const inner_animator = getSelectedAnimaor(_aniamtor, id)
      if(inner_animator !== undefined) {
        return inner_animator
      }
    }
  }
  return undefined
}

export default (state = initState, action: ARAnimationAction): ARAnimationState => {
  switch(action.type) {
    case SET_CURRENT_AR_ANIMATION:
      return { arAnimation: action.animation }
    case EDIT_AR_ANIMATION: {
      const newAnimator = JSON.parse(JSON.stringify(state.arAnimation))
      const selectAnimator = getSelectedAnimaor(newAnimator, action.id)
      if(selectAnimator) {
        selectAnimator.animator.animations[selectAnimator.index] = Object.assign(
          selectAnimator.animator.animations[selectAnimator.index],
          action.animation
        )
        return { arAnimation: newAnimator }
      }
      return state
    }
    case DELETE_AR_ANIMATION: {
      const newAnimator = JSON.parse(JSON.stringify(state.arAnimation))
      const selectAnimator = getSelectedAnimaor(newAnimator, action.id)
      if(selectAnimator) {
        selectAnimator.animator.animations.splice(
          selectAnimator.index,
          1
        )
        return { arAnimation: newAnimator }
      }
      return state
    }
    case MOVE_AR_ANIMATION: {
      const newAnimator: AppendID<ARGroupAnimatorParameter<ARAnimatorWithID>> = JSON.parse(JSON.stringify(state.arAnimation))
      const selectAnimator = getSelectedAnimaor(newAnimator, action.id)
      let parentAnimator: AppendID<ARGroupAnimatorParameter<ARAnimatorWithID>> | undefined
      if(action.parentId === newAnimator.eid) {
        parentAnimator = newAnimator
      } else {
        const parent = getSelectedAnimaor(newAnimator, action.parentId)
        if(parent && parent.animator.animations[parent.index].type === ARAnimatorType.GROUP_TYPE) {
          parentAnimator = parent.animator.animations[parent.index] as AppendID<ARGroupAnimatorParameter<ARAnimatorWithID>>
        }
      }

      if(selectAnimator && parentAnimator && action.moveIndex < parentAnimator.animations.length) {
        const arr = selectAnimator.animator.animations.splice(selectAnimator.index, 1)
        if(action.moveIndex < 0) {
          //移动到最后
          parentAnimator.animations.push(arr[0])
        } else {
          parentAnimator.animations.splice(action.moveIndex, 0, arr[0])
        }
        return { arAnimation: newAnimator}
      }
      return state
    }
    default:
      return state
  }
}