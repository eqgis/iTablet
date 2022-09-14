import { ARAnimatorWithID } from "@/redux/models/aranimation"
import { ARAnimatorType, ARElementType } from "imobile_for_reactnative/NativeModule/dataTypes"
import { SARMap } from "imobile_for_reactnative"
import { ARAnimatorSettingParam } from "./component/AnimatorParamSetting"
import { AppToolBar } from "@/utils"
import { ARElement } from "imobile_for_reactnative/types/interface/ar"
import { ModelAnimation } from "imobile_for_reactnative/NativeModule/interfaces/ar/SARMap"

let arAnimatorSettingParam: ARAnimatorSettingParam = initArAnimatorSettingParam()

//todo 通过id判断
let currentAnimationListIndex = -1

function initArAnimatorSettingParam(): ARAnimatorSettingParam {
  return {
    arModelAnimations: [],
    editAnimator: undefined,
    element: {layerName: '', id: -1, type: 1}
  }
}

export function getARAnimatorSettingParam () {
  return arAnimatorSettingParam
}

/**
 * 点击添加对应ARElement的动画
 * @param element
 */
export async function onAddARAnimation(element: ARElement) {
  let animations: ModelAnimation[] = []

  if(element.type == ARElementType.AR_MODEL) {
    animations = await SARMap.getModelAnimation(
      element.layerName,
      element.id
    )
  }
  arAnimatorSettingParam = initArAnimatorSettingParam()
  arAnimatorSettingParam.arModelAnimations = animations
  arAnimatorSettingParam.element.layerName = element.layerName
  arAnimatorSettingParam.element.id = element.id
  arAnimatorSettingParam.element.type = element.type
  AppToolBar.show( 'ARANIMATION', 'AR_MAP_ANIMATION_ADD')
}


export async function onEditARAnimation(animator: ARAnimatorWithID) {
  let animations: ModelAnimation[] = []
  console.warn("onEditARAnimation: " + JSON.stringify(animator))
  if(animator.type === ARAnimatorType.MODEL_TYPE) {
    animations = await SARMap.getModelAnimation(
      animator.layerName,
      animator.elementID
    )
  }
  // arAnimatorSettingParam = initArAnimatorSettingParam()
  arAnimatorSettingParam.arModelAnimations = animations
  arAnimatorSettingParam.editAnimator = animator

  AppToolBar.show( 'ARANIMATION', 'AR_MAP_ANIMATION_ADD')
}

export function setCurrentAnimationIndex(index: number) {
  currentAnimationListIndex = index
}

export function getCurrentAnimationIndex(): number {
  return currentAnimationListIndex
}
