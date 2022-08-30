import { AppToolBar, AttributeUtils } from "@/utils"
import { Attributes, AttributesResp } from "@/utils/AttributeUtils"
import { ARElementType, ARLayerType, SARMap, TARElementType, TARLayerType } from "imobile_for_reactnative"
import { SandTableData } from "./component/LayerAttribute/pages/AttributeDetail"


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


const PAGE_SIZE = 30
interface sandAttributeDataType {
  modelID: number,
  data: SandTableData | null,
}
let sandAttributeData: sandAttributeDataType
sandAttributeData = {
  modelID: -1,
  data: null,
}
export function getSandtableData(){
  return sandAttributeData
}

export async function getSandtableAttributeData(): Promise<sandAttributeDataType | undefined> {
  try {
    const currentPage = 0, pageSize = 30, type = 'reset'

    const selectARElement = AppToolBar.getData().selectARElement
    const layer = AppToolBar.getProps()?.arMapInfo?.currentLayer
    let result: AttributesResp | undefined

    let attributes: Attributes = {
      head: [],
      data: [],
    }
    // : JSON.parse(JSON.stringify(this.state.attributes))

    let layername = ''
    if(selectARElement?.layerName) {
      layername = selectARElement.layerName
      result = await AttributeUtils.getSelectionAttributeByData(attributes, selectARElement.layerName, 0, pageSize !== undefined ? pageSize : PAGE_SIZE, type)
    } else if (layer) {
      layername = layer.name
      result = await AttributeUtils.getLayerAttribute(attributes, layer.name, currentPage, pageSize !== undefined ? pageSize : PAGE_SIZE, {}, type)
    }

    if(result) {
      attributes = result.attributes || []

      // 获取沙盘的子项属性值

      const rowdata = (attributes.data)[0]
      let modelID = -1
      let elementType: TARElementType | null = null
      for (const key in rowdata) {
        if (Object.prototype.hasOwnProperty.call(rowdata, key)) {
          const element = rowdata[key]
          if (element.name.toLowerCase() === 'smid') {
            modelID = element.value
          } else if(element.name.toLowerCase() === 'ar_eletype') {
            elementType = element.value as TARElementType
          }
        }
      }
      if (modelID >= 0 && elementType === ARElementType.AR_SAND_TABLE) {
        const modalData = await SARMap.getARSandTableData(layername, modelID)
        let data = undefined
        try {
          data = JSON.parse(modalData)
        } catch (e) {/** */}
        sandAttributeData = {
          modelID,
          data,
        }
        return sandAttributeData
      } else {
        // Toast.show(getLanguage().NULL_DATA)
      }
      sandAttributeData = {
        modelID: -1,
        data: null,
      }
      return sandAttributeData
    }

  } catch (error) {
    sandAttributeData = {
      modelID: -1,
      data: null,
    }
    return sandAttributeData
  }
}