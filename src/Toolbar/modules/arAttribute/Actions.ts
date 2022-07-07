import { ARElementType, ARLayerType, TARElementType, TARLayerType } from "imobile_for_reactnative"


/** 当前对象是否支持在场景中显示属性 */
export  function checkSupportARAttributeByElement(type: TARElementType): boolean {
  return (
    type === ARElementType.AR_IMAGE
      || type === ARElementType.AR_LINE
      || type === ARElementType.AR_MARKER_LINE
      || type === ARElementType.AR_MODEL
      || type === ARElementType.AR_VIDEO
      || type === ARElementType.AR_WEBVIEW
      || type === ARElementType.AR_SAND_TABLE
  )
}


/** 当前图层是否支持在场景中显示属性 */
export  function checkSupportARAttributeByLayer(type: TARLayerType): boolean {
  return (
    type === ARLayerType.AR_POINT_LAYER
    || type === ARLayerType.AR_LINE_LAYER
    || type === ARLayerType.AR_MARKER_LINE_LAYER
    || type === ARLayerType.AR_REGION_LAYER
    || type === ARLayerType.AR_MEDIA_LAYER
    || type === ARLayerType.AR_MODEL_LAYER
  )
}