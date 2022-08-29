import { SARMap } from "imobile_for_reactnative"
import { ARElement } from "imobile_for_reactnative/types/interface/ar"
import { Platform } from "react-native"
import { ThunkAction } from "redux-thunk"
import { RootState } from "../types"


const MAP_AR_PIPE_LINE_ATTRIBUTE = 'MAP_AR_PIPE_LINE_ATTRIBUTE'
const MAP_AR_SHOW_ATTRIBUTE_ELEMENT = 'MAP_AR_SHOW_ATTRIBUTE_ELEMENT'


interface PipeLineAttributeType {
  title: string
  value: string
}
interface PipeLineAttribute {
  type: typeof MAP_AR_PIPE_LINE_ATTRIBUTE,
  payload: Array<PipeLineAttributeType>,
}

interface ShowAttributeElementAction {
  type: typeof MAP_AR_SHOW_ATTRIBUTE_ELEMENT,
  element?: ARElement,
}


interface ARAttributeState {
  pipeLineAttribute?: Array<PipeLineAttributeType>
  elementAttribute?: Array<ARElement>
}

type ARAttributeAction = PipeLineAttribute | ShowAttributeElementAction

const initState: ARAttributeState = {
  pipeLineAttribute: [],
  elementAttribute: [],
}

/** 设置ar三维管线属性 */
export const setPipeLineAttribute = (
  attributeArr: Array<PipeLineAttributeType> = []
): ThunkAction<void, RootState, unknown, PipeLineAttribute> => async (dispatch:(params: PipeLineAttribute) => void) => {
  try {
    dispatch({
      type: MAP_AR_PIPE_LINE_ATTRIBUTE,
      payload: attributeArr,
    })
  } catch (error) {
    console.warn("设置ar三维管线属性出错啦！")
  }
}

/**
 * 修改属性表是否显示的element
 * @param {ARElement | undefined} element 触碰的对像，默认值为undefine， 当element为undefined即用户不传参时为清空已显示的所有element类型属性表
 */
export const changeShowAttributeElement = (
  element: ARElement | undefined = undefined
): ThunkAction<void, RootState, unknown, ShowAttributeElementAction> => async (dispatch:(params: ShowAttributeElementAction) => void) => {
  try {
    dispatch({
      type: MAP_AR_SHOW_ATTRIBUTE_ELEMENT,
      element: element,
    })
  } catch (error) {
    console.warn("添加已显示的属性element对象出错啦！")
  }
}


export default (state = initState, action: ARAttributeAction): ARAttributeState => {
  switch(action.type) {
    case MAP_AR_PIPE_LINE_ATTRIBUTE:
      if(state.pipeLineAttribute || action.payload) {
        return {
          ...state,
          pipeLineAttribute: action.payload,
        }
      }
      return state
    case MAP_AR_SHOW_ATTRIBUTE_ELEMENT:
      if(state.elementAttribute || action.element) {
        // 判断是加还是减
        const element: ARElement | undefined = action.element
        let elemneArray = state.elementAttribute
        if(element) {
          if(elemneArray) {
            let i = 0
            const length = elemneArray.length
            for(; i < length; i ++) {
              const elementTemp = elemneArray[i]
              if(element.layerName === elementTemp.layerName && element.id === elementTemp.id) {
                break
              }
            }

            // 未找到，索引i大与等于数组长度，是添加
            if(i >= length) {
              elemneArray.push(element)
            } else {
              // 找到了，索引i小于数组长度，是减少
              elemneArray.splice(i, 1)
            }

          } else {
            // 是添加的第一个元素
            elemneArray = new Array<ARElement>()
            elemneArray.push(element)
          }
        } else {
          // 原生显示清空
          if(elemneArray && Platform.OS === 'android') {
            const length = elemneArray.length
            for(let i = 0; i < length; i ++) {
              const elementTemp = elemneArray[i]
              SARMap.hideAttribute(elementTemp.layerName, elementTemp.id)
            }
          }
          // 数据清空
          elemneArray = new Array<ARElement>()

        }
        return {
          ...state,
          elementAttribute: elemneArray
        }
      }
      return state
    default:
      return state
  }
}