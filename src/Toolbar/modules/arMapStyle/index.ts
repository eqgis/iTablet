import { ConstPath } from "@/constants"
import NavigationService from "@/containers/NavigationService"
import { ARLayerType, FileTools, RNFS, SARMap } from "imobile_for_reactnative"
import { getImage } from "../../../assets"
import { getLanguage } from "../../../language"
import { ToolbarModuleData } from "imobile_for_reactnative/components/ToolbarKit"
import { AppToolBar, AppUser, Toast } from "../../../utils"
import { getData } from "./Data"

/** ar矢量线符号数据格式 */
interface ARSymbolObj {
  image: number | string  // 64位二进制图片
  text: string
  number: number
}

interface KEYS {
  //图层风格
  AR_MAP_STYLE_POI_LAYER: 'AR_MAP_STYLE_POI_LAYER'
  AR_MAP_STYLE_TEXT_LAYER: 'AR_MAP_STYLE_TEXT_LAYER'
  AR_MAP_STYLE_EFFECT_LAYER: 'AR_MAP_STYLE_EFFECT_LAYER'
  AR_MAP_STYLE_WIDGET_LAYER: 'AR_MAP_STYLE_WIDGET_LAYER'
  AR_MAP_STYLE_LINE_LAYER: 'AR_MAP_STYLE_LINE_LAYER'  // 矢量线风格
  AR_MAP_STYLE_MARKER_LINE_LAYER: 'AR_MAP_STYLE_MARKER_LINE_LAYER' // 矢量符号线风格

}

export interface ARMAP_STYLE {
  ARMAP_STYLE: keyof KEYS
}


const arMapStyleData: ToolbarModuleData<ARMAP_STYLE> = {
  name: 'ARMAP_STYLE',
  image: getImage().my_color,
  getTitle: () => getLanguage().STYLE,
  action: async () => {

    const preElement = AppToolBar.getData().selectARElement
    if(preElement) {
      await SARMap.hideAttribute(preElement.layerName, preElement.id)
      AppToolBar.addData({ selectARElement: undefined })
    }
    AppToolBar.getProps().setPipeLineAttribute([])

    const currentLayer = AppToolBar.getProps().arMapInfo?.currentLayer
    if(currentLayer) {
      if(currentLayer.type === ARLayerType.AR_MEDIA_LAYER) {
        const style = await SARMap.getLayerStyle(currentLayer.name)
        AppToolBar.addData({
          currentLayerStyle: style
        })
        AppToolBar.show('ARMAP_STYLE', 'AR_MAP_STYLE_POI_LAYER')
      } else if(currentLayer.type === ARLayerType.AR_TEXT_LAYER) {
        const style = await SARMap.getLayerStyle(currentLayer.name)
        AppToolBar.addData({
          currentLayerStyle: style
        })
        AppToolBar.show('ARMAP_STYLE', 'AR_MAP_STYLE_TEXT_LAYER')
      } else if( currentLayer.type === ARLayerType.EFFECT_LAYER) {
        AppToolBar.show('ARMAP_STYLE', 'AR_MAP_STYLE_EFFECT_LAYER')
      } else if(currentLayer.type === ARLayerType.AR_WIDGET_LAYER) {
        Toast.show(getLanguage().AR_LAYER_NOT_SUPPORT_STYLE)
        // const style = await SARMap.getLayerStyle(currentLayer.name)
        // AppToolBar.addData({currentLayerStyle: style})
        // AppToolBar.show('ARMAP', 'AR_MAP_STYLE_WIDGET_LAYER')
      } else if(currentLayer.type === ARLayerType.AR_LINE_LAYER) {
        // 矢量线的风格设置
        const style = await SARMap.getLayerStyle(currentLayer.name)
        AppToolBar.addData({
          currentLayerStyle: style
        })
        AppToolBar.show('ARMAP_STYLE', 'AR_MAP_STYLE_LINE_LAYER')

      } else if(currentLayer.type === ARLayerType.AR_MARKER_LINE_LAYER) {
        // 矢量符号线的风格设置
        const style = await SARMap.getLayerStyle(currentLayer.name)
        const homePath = await FileTools.getHomeDirectory()
        // 获取当前用户的用户名
        const userName = AppUser.getCurrentUser().userName
        // 拼接AR符号库的文件夹路径
        const arSymbolFilePath = homePath + ConstPath.UserPath + userName + '/' + ConstPath.RelativePath.ARSymbol
        const filePath = 'file://' + arSymbolFilePath

        // 符号列表
        const ARSymbolObjList: Array<ARSymbolObj> = new Array<ARSymbolObj>()
        const isExist = await FileTools.fileIsExist(arSymbolFilePath)
        if(isExist){
          const fileArr =  await FileTools.getDirectoryContent(arSymbolFilePath)
          for(let i = 0; i < fileArr.length; i ++){
            // 是文件（图片）就获取文件（图片）的二进制数据并构造符号数据放进符号数组
            if(fileArr[i].type === 'file') {
              // 获取二进制数据 readFile  Error: Invalid UTF-8 detected
              const imageBase64 = await RNFS.readFile(arSymbolFilePath + "/" + fileArr[i].name, 'base64')
              const uri = `data:image/png;base64,${imageBase64}`
              // 构造符号数据
              const ARSymbolObj: ARSymbolObj = {
                image: uri,
                text: fileArr[i].name,
                number: i,
              }
              // 将符号数据放进符号列表
              ARSymbolObjList.push(ARSymbolObj)
            }
          }

        }
        AppToolBar.addData({
          currentLayerStyle: style,
          arSymbolFilePath: filePath,
          ARSymbolObjList,
        })
        AppToolBar.show('ARMAP_STYLE', 'AR_MAP_STYLE_MARKER_LINE_LAYER')

      }else {
        Toast.show(getLanguage().AR_LAYER_NOT_SUPPORT_STYLE)
      }
    } else {
      NavigationService.navigate('ARLayer')
      Toast.show(getLanguage().CHOOSE_LAYER)
    }
  },
  getData: getData,
}



export {
  arMapStyleData
}