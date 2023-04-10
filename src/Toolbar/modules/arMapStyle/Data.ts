import { ImagePicker } from "@/components"
import DataHandler from "@/utils/DataHandler"
import { FileTools, SARMap, SData } from "imobile_for_reactnative"
import { ARLayer, ARLayerType, ARTextAlign, GeoStyle3D, TARTextAlign } from "imobile_for_reactnative/NativeModule/interfaces/ar/SARMap"
import { ModuleList } from ".."
import { getImage } from "../../../assets"
import { getLanguage } from "../../../language"
import { IToolbarOption, ToolBarListItem, ToolbarOption } from "imobile_for_reactnative/components/ToolbarKit"
import { AppToolBar, AppUser } from "../../../utils"
import { Platform } from "react-native"


export function getData(key: ModuleList['ARMAP_STYLE']): IToolbarOption {
  const option = new ToolbarOption()

  switch(key) {
    case 'AR_MAP_STYLE_POI_LAYER':
      stylePoiOption(option)
      break
    case 'AR_MAP_STYLE_TEXT_LAYER':
      styleTextOption(option)
      break
    case 'AR_MAP_STYLE_EFFECT_LAYER':
      styleEffect(option)
      break
    case 'AR_MAP_STYLE_WIDGET_LAYER':
      styleWidgetOption(option)
      break
    // 矢量线风格
    case 'AR_MAP_STYLE_LINE_LAYER':
      styleLineOption(option)
      break
    // 矢量符号线风格
    case 'AR_MAP_STYLE_MARKER_LINE_LAYER':
      styleMarkerLineOption(option)
      break
    /** 三维图层风格设置 */
    case 'AR_MAP_STYLE_3D_LAYER':
      style3D(option)
      break
  }


  return option
}

/** poi图层风格 */
function stylePoiOption(option: IToolbarOption) {
  const { currentLayerStyle } = AppToolBar.getData()
  const selectARLayer = AppToolBar.getProps().arMapInfo?.currentLayer

  option.bottomData = [{
    image: getImage().icon_toolbar_quit,
    onPress: () => {
      selectARLayer && currentLayerStyle &&  SARMap.setLayerStyle(selectARLayer.name, currentLayerStyle)
      AppToolBar.goBack()
    }
  },{
    image: getImage().icon_submit,
    onPress: AppToolBar.goBack,
  }]

  option.menuOption.data = [
    {
      title: getLanguage().OPACITY,
      type: 'slide',
      slideData: [
        {
          type: 'single',
          left: {type: 'image', image: getImage().ar_opacity},
          right: {type: 'indicator', unit: '%'},
          range: [0,100],
          onMove: loc => {
            const layerName = selectARLayer?.name
            if(layerName) {
              SARMap.setLayerStyle(layerName, {opacity: loc / 100})
            }
          },
          defaultValue:  currentLayerStyle ? Math.round(currentLayerStyle.opacity * 100) : 0,
        }
      ]
    },
    {
      title: getLanguage().ARMap.BORDER_WIDTH,
      type: 'slide',
      slideData: [
        {
          type: 'single',
          left: {type: 'image', image: getImage().ar_border_width},
          range: [0,100],
          onMove: loc => {
            const layerName = selectARLayer?.name
            if(layerName) {
              SARMap.setLayerStyle(layerName, {borderWidth: loc / 100})
            }
          },
          defaultValue: currentLayerStyle && Math.round(currentLayerStyle.borderWidth * 100) || 0,
        }
      ]
    },
    {
      title: getLanguage().BORDER_COLOR,
      type: 'color',
      data: {
        colors: COLORS,
        initColor: currentLayerStyle?.borderColor,
        onSelect: color => {
          const layerName = selectARLayer?.name
          if(layerName) {
            SARMap.setLayerStyle(layerName, {borderColor: color})
          }
        }
      }
    },
  ]
}

/** 文字图层风格 */
function styleTextOption(option: IToolbarOption) {
  const { currentLayerStyle } = AppToolBar.getData()
  const selectARLayer = AppToolBar.getProps().arMapInfo?.currentLayer

  option.bottomData = [{
    image: getImage().icon_toolbar_quit,
    onPress: () => {
      selectARLayer && currentLayerStyle &&  SARMap.setLayerStyle(selectARLayer.name, currentLayerStyle)
      AppToolBar.goBack()
    }
  },{
    image: getImage().icon_submit,
    onPress: AppToolBar.goBack,
  }]

  option.menuOption.data = [
    {
      title: getLanguage().COLOR,
      type: 'color',
      data: {
        colors: COLORS,
        initColor: currentLayerStyle?.strokeColor,
        onSelect: (color) => {
          const layerName = selectARLayer?.name
          if(layerName) {
            SARMap.setLayerStyle(layerName, {strokeColor: color})
          }
        }
      }
    },
    {
      title: getLanguage().OPACITY,
      type: 'slide',
      slideData: [
        {
          type: 'single',
          left: {type: 'image', image: getImage().ar_opacity},
          right: {type: 'indicator', unit: '%'},
          range: [0,100],
          onMove: loc => {
            const layerName = selectARLayer?.name
            if(layerName) {
              SARMap.setLayerStyle(layerName, {strokeOpacity: loc / 100})
            }
          },
          defaultValue: currentLayerStyle ? Math.round(currentLayerStyle.strokeOpacity * 100) : 0,
        }
      ]
    },
    {
      title: getLanguage().ARMap.BACKGROUND_COLOR,
      type: 'color',
      data: {
        colors: COLORS,
        initColor: currentLayerStyle?.fillColor,
        onSelect: (color) => {
          const layerName = selectARLayer?.name
          if(layerName) {
            SARMap.setLayerStyle(layerName, {fillColor: color})
          }
        }
      }
    },
    {
      title: getLanguage().ARMap.BACKGROUND_OPACITY,
      type: 'slide',
      slideData: [
        {
          type: 'single',
          left: {type: 'image', image: getImage().ar_opacity},
          right: {type: 'indicator', unit: '%'},
          range: [0,100],
          onMove: loc => {
            const layerName = selectARLayer?.name
            if(layerName) {
              SARMap.setLayerStyle(layerName, {fillOpacity: loc / 100})
            }
          },
          defaultValue: currentLayerStyle ? Math.round(currentLayerStyle.fillOpacity * 100) : 0,
        }
      ]
    },
    {
      title: getLanguage().ARMap.TEXT_SIZE,
      type: 'slide',
      slideData: [
        {
          type: 'single',
          left: {type: 'image', image: getImage().ar_distance},
          range: [1,100],
          onMove: (loc) => {
            const layerName = selectARLayer?.name
            if(layerName) {
              SARMap.setLayerStyle(layerName, {textSize: loc})
            }
          },
          defaultValue: currentLayerStyle?.textSize || 1,
        }
      ]
    },
    {
      title: getLanguage().ARMap.BORDER_WIDTH,
      type: 'slide',
      slideData: [
        {
          type: 'single',
          left: {type: 'image', image: getImage().ar_distance},
          range: [0,100],
          onMove: (loc) => {
            const layerName = selectARLayer?.name
            if(layerName) {
              SARMap.setLayerStyle(layerName, {borderWidth: loc / 100})
            }
          },
          defaultValue: currentLayerStyle && Math.round(currentLayerStyle.borderWidth * 100) || 0,
        }
      ]
    },
    {
      title: getLanguage().BORDER_COLOR,
      type: 'color',
      data: {
        colors: COLORS,
        initColor: currentLayerStyle?.borderColor,
        onSelect: (color) => {
          const layerName = selectARLayer?.name
          if(layerName) {
            SARMap.setLayerStyle(layerName, {borderColor: color})
          }
        }
      }
    },
    {
      title: getLanguage().ALIGNMENT,
      type: 'list',
      data: getTextAlignSettingData(selectARLayer),
    },
  ]
}

function getTextAlignSettingData(selectARLayer?: ARLayer ): ToolBarListItem[] {

  const setAlign = (textAlign:TARTextAlign) => {
    const layerName = selectARLayer?.name
    if(layerName) {
      SARMap.setLayerStyle(layerName, {textAlign})
    }
  }

  return [{
    image: getImage().align_left,
    text: getLanguage().LEFT,
    onPress: () => setAlign(ARTextAlign.LEFT)
  },{
    image: getImage().align_left_start,
    text: getLanguage().LEFT_START,
    onPress: () => setAlign(ARTextAlign.LEFT_START)
  },{
    image: getImage().align_left_end,
    text: getLanguage().LEFT_END,
    onPress: () => setAlign(ARTextAlign.LEFT_END)
  },{
    image: getImage().align_top,
    text: getLanguage().UP,
    onPress: () => setAlign(ARTextAlign.TOP)
  },{
    image: getImage().align_top_start,
    text: getLanguage().TOP_START,
    onPress: () => setAlign(ARTextAlign.TOP_START)
  },{
    image: getImage().align_top_end,
    text: getLanguage().TOP_END,
    onPress: () => setAlign(ARTextAlign.TOP_END)
  },{
    image: getImage().align_right,
    text: getLanguage().RIGHT,
    onPress: () => setAlign(ARTextAlign.RIGHT)
  },{
    image: getImage().align_right_start,
    text: getLanguage().RIGHT_START,
    onPress: () => setAlign(ARTextAlign.RIGHT_START)
  },{
    image: getImage().align_right_end,
    text: getLanguage().RIGHT_END,
    onPress: () => setAlign(ARTextAlign.RIGHT_END)
  },{
    image: getImage().align_bottom,
    text: getLanguage().DOWN,
    onPress: () => setAlign(ARTextAlign.BOTTOM)
  },{
    image: getImage().align_bottom_start,
    text: getLanguage().BOTTOM_START,
    onPress: () => setAlign(ARTextAlign.BOTTOM_START)
  },{
    image: getImage().align_bottom_end,
    text: getLanguage().BOTTOM_END,
    onPress: () => setAlign(ARTextAlign.BOTTOM_END)
  },
  ]
}

function styleEffect(option: IToolbarOption) {
  option.bottomData = [{
    image: getImage().icon_toolbar_quit,
    onPress: () => {
      AppToolBar.goBack()
    }
  },]

  option.menuOption.data = [{
    title: getLanguage().ARMap.EFFECT,
    type: 'list',
    data: [],
    getExtraData: async () => {
      const data = await DataHandler.getLocalData(AppUser.getCurrentUser(), 'AREFFECT')
      return data.map(item => {
        return {
          image: getImage().ar_effect,
          text: item.name.substring(0, item.name.lastIndexOf('.')),
          onPress: async () => {
            const currentLayer = AppToolBar.getProps().arMapInfo?.currentLayer
            if(currentLayer) {
              const homePath = await FileTools.getHomeDirectory()
              if (Platform.OS === 'ios') {
                const targetPath = item.path.replace('.areffect', '.mp4')
                await FileTools.copyFile(homePath + item.path, homePath + targetPath)
                SARMap.setAREffect(currentLayer.name, homePath + targetPath)
              } else {
                SARMap.setAREffect(currentLayer.name, homePath + item.path)
              }
            }
            AppToolBar.goBack()
          }
        }
      })
    }
  }]

}

function styleWidgetOption(option: IToolbarOption) {
  const { currentLayerStyle } = AppToolBar.getData()
  const selectARLayer = AppToolBar.getProps().arMapInfo?.currentLayer

  option.bottomData = [{
    image: getImage().icon_toolbar_quit,
    onPress: () => {
      selectARLayer && currentLayerStyle &&  SARMap.setLayerStyle(selectARLayer.name, currentLayerStyle)
      AppToolBar.goBack()
    }
  },{
    image: getImage().icon_submit,
    onPress: AppToolBar.goBack,
  }]

  option.menuOption.data = [
    {
      title: getLanguage().OPACITY,
      type: 'slide',
      slideData: [
        {
          type: 'single',
          left: {type: 'image', image: getImage().ar_opacity},
          right: {type: 'indicator', unit: '%'},
          range: [0,100],
          onMove: loc => {
            const layerName = selectARLayer?.name
            if(layerName) {
              SARMap.setLayerStyle(layerName, {fillOpacity: loc / 100})
            }
          },
          defaultValue:  currentLayerStyle ? Math.round(currentLayerStyle.fillOpacity * 100) : 0,
        }
      ]
    },
    {
      title: getLanguage().ARMap.BACKGROUND_COLOR,
      type: 'color',
      data: {
        colors: COLORS,
        initColor: currentLayerStyle?.fillColor,
        onSelect: color => {
          const layerName = selectARLayer?.name
          if(layerName) {
            SARMap.setLayerStyle(layerName, {fillColor: color})
          }
        }
      }
    },
  ]
}



/** 矢量线图层风格 */
function styleLineOption(option: IToolbarOption) {
  const { currentLayerStyle } = AppToolBar.getData()
  const selectARLayer = AppToolBar.getProps().arMapInfo?.currentLayer
  // 底部按钮
  option.bottomData = [{
    image: getImage().icon_toolbar_quit,
    onPress: () => {
      selectARLayer && currentLayerStyle &&  SARMap.setLayerStyle(selectARLayer.name, currentLayerStyle)
      AppToolBar.goBack()
    }
  },{
    image: getImage().icon_submit,
    onPress: AppToolBar.goBack,
  }]

  // 线图层风格类别tab
  option.menuOption.data = [
    {
      title: getLanguage().COLOR,
      type: 'color',
      data: {
        colors: COLORS,
        initColor: currentLayerStyle?.strokeColor,
        onSelect: (color) => {
          const layerName = selectARLayer?.name
          if(layerName) {
            SARMap.setLayerStyle(layerName, {strokeColor: color})
          }
        }
      }
    },
    {
      title: getLanguage().LINE_WIDTH,
      type: 'slide',
      slideData: [
        {
          type: 'single',
          left: {type: 'image', image: getImage().ar_opacity},
          right: {type: 'indicator', unit: 'cm'},
          range: [0,10],
          onMove: loc => {
            // 线宽
            const layerName = selectARLayer?.name
            if(layerName) {
              SARMap.setLayerStyle(layerName, {lineWidth: loc / 100,pointSize: loc / 100})
            }
          },
          defaultValue: currentLayerStyle ? Math.round(currentLayerStyle.lineWidth * 100) : 1,
        }
      ]
    },
    // {
    //   title: getLanguage().ARMap.LINE_POINT_SIZE,
    //   type: 'slide',
    //   data: [
    //     {
    //       type: 'single',
    //       leftImage: getAssets().ToolBar.module.armap.ar_opacity,
    //       unit: 'cm',
    //       range: [0,10],
    //       onMove: loc => {
    //         // 节点大小
    //         const layerName = selectARLayer?.name
    //         if(layerName) {
    //           SARMap.setLayerStyle(layerName, {pointSize: loc / 100})
    //         }
    //       },
    //       defaultValue: currentLayerStyle ? currentLayerStyle.pointSize * 100: 2,
    //     }
    //   ]
    // },

  ]
}

/** 矢量符号线图层风格 */
function styleMarkerLineOption(option: IToolbarOption) {
  const { currentLayerStyle, markerLineContent} = AppToolBar.getData()
  const selectARLayer = AppToolBar.getProps().arMapInfo?.currentLayer
  // 底部按钮
  option.bottomData = [{
    image: getImage().icon_toolbar_quit,
    onPress: () => {
      // 点了返回按钮，恢复最初的值
      if(selectARLayer && currentLayerStyle) {
        // 恢复基本样式风格
        SARMap.setLayerStyle(selectARLayer.name, currentLayerStyle)
        AppToolBar.addData({markerLineContent: markerLineContent})
      }
      AppToolBar.goBack()
    }
  },{
    image: getImage().icon_submit,
    onPress: AppToolBar.goBack,
  }]

  // 符号线图层风格类别tab
  option.menuOption.data = [
    {
      title: getLanguage().LINE_MARKER,  // 符号切换
      type: 'list',
      data: getARMarkerLineImageList(),
    },
    {
      title: getLanguage().ROTATION,
      type: 'slide',
      slideData: [
        {
          type: 'single',
          left: {type: 'image', image: getImage().ar_opacity},
          right: {type: 'indicator', unit: '°'},
          range: [0,360],
          onMove: loc => {
            // 符号线的符号角度
            const layerName = selectARLayer?.name
            if(layerName) {
              SARMap.setLayerStyle(layerName, {markerLineRotation: loc})
            }
          },
          defaultValue: currentLayerStyle?.markerLineRotation ? Math.round(currentLayerStyle.markerLineRotation): 0,
        }
      ]
    },
    {
      title: getLanguage().LINE_POINT_SIZE,
      type: 'slide',
      slideData: [
        {
          type: 'single',
          left: {type: 'image', image: getImage().ar_opacity},
          right: {type: 'indicator', unit: 'cm'},
          range: [1,100],
          increment: 50,
          onMove: loc => {
            // 符号大小
            const layerName = selectARLayer?.name
            if(layerName) {
              SARMap.setLayerStyle(layerName, {pointSize: loc / 100})
            }
          },
          defaultValue: currentLayerStyle ? Math.round(currentLayerStyle.pointSize * 100): 3,
        }
      ]
    },
    {
      title: getLanguage().LINE_POINT_INTERVAL,
      type: 'slide',
      slideData: [
        {
          type: 'single',
          left: {type: 'image', image: getImage().ar_distance},
          right: {type: 'indicator', unit: 'cm'},
          range: [1,200],
          increment: 50,
          onMove: loc => {
            // 符号间距
            const layerName = selectARLayer?.name
            if(layerName) {
              SARMap.setLayerStyle(layerName, {pointInterval: loc / 100})
            }
          },
          defaultValue: currentLayerStyle?.pointInterval ? Math.round(currentLayerStyle.pointInterval * 100): 50,
        }
      ]
    },
    {
      title: getLanguage().LINE_MARKER_SPEED,
      type: 'slide',
      slideData: [
        {
          type: 'single',
          left: {type: 'image', image: getImage().ar_distance},
          right: {type: 'indicator', unit: ''},
          range: [0,100],
          // increment: 10,
          // upperLimitMaxValue: 100,
          onMove: loc => {
            // 符号线的符号流速
            const layerName = selectARLayer?.name
            if(layerName) {
              SARMap.setLayerStyle(layerName, {markerFlowVelocity: loc / 100})
            }
          },
          defaultValue: currentLayerStyle?.markerFlowVelocity ? Math.round(currentLayerStyle.markerFlowVelocity * 100): 0,
        }
      ]
    },

  ]
}


/** 获取矢量符号线的符号备选列表 */
function getARMarkerLineImageList(): ToolBarListItem[]{
  const selectARLayer = AppToolBar.getProps().arMapInfo?.currentLayer
  const filePath = AppToolBar.getData().arSymbolFilePath
  const ARSymbolObjList = AppToolBar.getData().ARSymbolObjList

  const setImage = (path: string) => {
    const layerName = selectARLayer?.name

    let markerSymbolPath = path
    if(markerSymbolPath && markerSymbolPath.indexOf('file://') === 0) {
      markerSymbolPath = markerSymbolPath.substring(7)
    }

    if(layerName) {
      SARMap.setLayerStyle(layerName, {markerSymbolPath})
    }
  }

  const data = [
    {
      image: getImage().marker_line,
      // text: '自定义',
      onPress: () => {
        // 自定义符号
        ImagePicker.AlbumListView.defaultProps.showDialog = false
        ImagePicker.AlbumListView.defaultProps.dialogConfirm = null
        ImagePicker.AlbumListView.defaultProps.assetType = 'Photos'
        ImagePicker.AlbumListView.defaultProps.groupTypes = 'All'
        ImagePicker.getAlbum({
          maxSize: 1,
          callback: data => {
            AppToolBar.addData({markerLineContent: data[0].uri})
            setImage(data[0].uri)
          },
        })
      }
    },
  //   {
  //   image: getImage().arnavi_arrow,
  //   text: getLanguage().LEFT,
  //   onPress: () => {},
  //  },
  ]

  if(ARSymbolObjList){
    const len: number = ARSymbolObjList.length
    for(let i = 0; i < len; i ++) {
      const  item = ARSymbolObjList[i]
      const image = item.image

      const dataItem = {
        image: image,
        // text: "arrow" +item.number,
        onPress: () => {
          const symbolPath = filePath + "/" + item.text
          AppToolBar.addData({markerLineContent: symbolPath})
          setImage(symbolPath)
        },
      }
      data.push(dataItem)

    }
  }

  return data


}


/** 三维图层风格设置 */
function style3D(option: IToolbarOption) {
  const { cur3DLayerStyle, currentLayerStyle } = AppToolBar.getData()
  const selectARLayer = AppToolBar.getProps().arMapInfo?.currentLayer

  // const ids: Array<number> = []
  // const length = 20000
  // if(length > 0) {
  //   for(let i = 1; i <= length; i ++) {
  //     ids.push(i)
  //   }
  // }

  option.bottomData = [{
    image: getImage().icon_toolbar_quit,
    onPress: async () => {
      // 点击了返回按钮，将设置的风格恢复初始风格
      // const opacity = cur3DLayerStyle ? cur3DLayerStyle.fillForeColor?.a : 0
      // const style: GeoStyle3D = {
      //   // FillOpacity: opacity,
      //   // LineOpacity: opacity,
      //   // MarkerOpacity: opacity,
      // }
      cur3DLayerStyle && setAR3DLayerStyle(cur3DLayerStyle)

      // const opacity = currentLayerStyle ? currentLayerStyle.opacity : 1
      // currentLayerStyle && setAR3DLayerStyle01(opacity, [])

      AppToolBar.goBack()
    }
  },{
    image: getImage().icon_submit,
    onPress: AppToolBar.goBack,
  }]

  // let lastDate: Date | null = null
  // option.menuOption.data = [
  //   {
  //     title: getLanguage().OPACITY,
  //     type: 'slide',
  //     slideData: [
  //       {
  //         type: 'single',
  //         left: {type: 'image', image: getImage().ar_opacity},
  //         right: {type: 'indicator', unit: '%'},
  //         range: [0,100],
  //         onMove: async (loc: number) => {

  //           // const style: GeoStyle3D = {
  //           //   FillOpacity: loc / 100,
  //           //   LineOpacity: loc / 100,
  //           //   MarkerOpacity: loc / 100,
  //           // }

  //           if(selectARLayer) {
  //             let layer3dStyle: GeoStyle3D | null = null
  //             if(selectARLayer.type === ARLayerType.AR3D_LAYER) {
  //             // 三维图层直接获取图层风格
  //               layer3dStyle = await SARMap.getAR3DLayerStyle(selectARLayer.name)
  //             } else if(selectARLayer.type === ARLayerType.AR_SCENE_LAYER) {
  //               const layer3ds = selectARLayer.ar3DLayers
  //               // 三维场景图层就获取这个三维场景图层组里的第一个三维图层的风格
  //               if(layer3ds.length > 0) {
  //                 layer3dStyle = await SARMap.getAR3DLayerStyle(layer3ds[0].name)
  //               }
  //             }
  //             // console.warn("layer3dStyle 01: " + JSON.stringify(layer3dStyle))
  //             if(layer3dStyle?.fillForeColor) {
  //               layer3dStyle.fillForeColor.a = loc / 100
  //             }

  //             if(layer3dStyle?.lineColor){
  //               layer3dStyle.lineColor.a = loc / 100
  //             }

  //             if(layer3dStyle?.markerColor){
  //               layer3dStyle.markerColor.a = loc / 100
  //             }
  //             // console.warn("layer3dStyle 02: " + JSON.stringify(layer3dStyle))

  //             layer3dStyle && setAR3DLayerStyle(layer3dStyle)
  //           }


  //           // console.warn("layer: " + JSON.stringify(selectARLayer))
  //           // const nowDate = new Date()
  //           // if(lastDate === null || (lastDate && (nowDate.getTime() - lastDate.getTime() > 1 * 1000)) ) {
  //           //   lastDate = nowDate
  //           //   console.log("loc: " + loc)
  //           //   setAR3DLayerStyle01(loc / 100, [])
  //           // }



  //         },
  //         defaultValue:  cur3DLayerStyle ? Math.round((cur3DLayerStyle?.fillForeColor?.a || 0) * 100) : 0,
  //         // defaultValue:  currentLayerStyle ? Math.round((currentLayerStyle.opacity) * 100) : 0,
  //       }
  //     ]
  //   },
  // ]

  option.menuOption.data = [
    {
      title: getLanguage().ARMap.OPACITY,
      type: 'list',
      data: getOpacityList(),
      showSelect: true,
      // onPress: async () => {
      // },
    },
  ]
}

/** 透明度列表 */
function getOpacityList(): ToolBarListItem[] {
  return [
    {
      image: getImage().icon_toolbar_transparent_0,
      text: "0%",
      onPress: () => {
        set3DLayerStylePrepare(0)
      }
    },
    {
      image: getImage().icon_toolbar_transparent_25,
      text: "25%",
      onPress: () => {
        set3DLayerStylePrepare(25)
      }
    },
    {
      image: getImage().icon_toolbar_transparent_50,
      text: "50%",
      onPress: () => {
        set3DLayerStylePrepare(50)
      }
    },
    {
      image: getImage().icon_toolbar_transparent_75,
      text: "75%",
      onPress: () => {
        set3DLayerStylePrepare(75)
      }
    },
    {
      image: getImage().icon_toolbar_transparent_100,
      text: "100%",
      onPress: () => {
        set3DLayerStylePrepare(100)
      }
    },
  ]
}

/** 三维图层风格设置准备放方法 */
async function set3DLayerStylePrepare(loc: number) {
  const selectARLayer = AppToolBar.getProps().arMapInfo?.currentLayer
  if(selectARLayer) {
    let layer3dStyle: GeoStyle3D | null = null
    if(selectARLayer.type === ARLayerType.AR3D_LAYER) {
    // 三维图层直接获取图层风格
      layer3dStyle = await SARMap.getAR3DLayerStyle(selectARLayer.name)
    } else if(selectARLayer.type === ARLayerType.AR_SCENE_LAYER) {
      const layer3ds = selectARLayer.ar3DLayers
      // 三维场景图层就获取这个三维场景图层组里的第一个三维图层的风格
      if(layer3ds.length > 0) {
        layer3dStyle = await SARMap.getAR3DLayerStyle(layer3ds[0].name)
      }
    }
    // console.warn("layer3dStyle 01: " + JSON.stringify(layer3dStyle))
    if(layer3dStyle?.fillForeColor) {
      layer3dStyle.fillForeColor.a = loc / 100
    }

    if(layer3dStyle?.lineColor){
      layer3dStyle.lineColor.a = loc / 100
    }

    if(layer3dStyle?.markerColor){
      layer3dStyle.markerColor.a = loc / 100
    }
    // console.warn("layer3dStyle 02: " + JSON.stringify(layer3dStyle))

    layer3dStyle && setAR3DLayerStyle(layer3dStyle)
  }
}

/**
 * 设置三维图层和三维场景图层的风格
 * @param styleParam 三维图层的风格对象
 */
async function setAR3DLayerStyle(styleParam: GeoStyle3D) {
  const selectARLayer = AppToolBar.getProps().arMapInfo?.currentLayer
  if(selectARLayer) {
    if(selectARLayer.type === ARLayerType.AR3D_LAYER) {
      // 三维图层直接设置风格
      SARMap.setAR3DLayerStyle(selectARLayer.name, styleParam)

    } else if(selectARLayer.type === ARLayerType.AR_SCENE_LAYER) {
      // 三维场景图层，找到场景图层组里的三维图层，遍历设置风格
      const layer3ds = selectARLayer.ar3DLayers
      if(layer3ds.length > 0) {
        for(let j = 0; j < layer3ds.length; j ++) {
          const layer3d = layer3ds[j]
          SARMap.setAR3DLayerStyle(layer3d.name, styleParam)

        }
      }
    }
  }
}

/**
 * 设置三维图层和三维场景图层的风格 (设置图层对象版本)
 * @param styleParam 三维图层的风格对象
 */
async function setAR3DLayerStyle01(opacity: number, ids: Array<number>) {
  const selectARLayer = AppToolBar.getProps().arMapInfo?.currentLayer
  if(selectARLayer) {
    // 序号的数组（不等于SmId）  to do 获取三维图层的所有对象的 个数 或者是 序号数组

    if(selectARLayer.type === ARLayerType.AR3D_LAYER) {
      // console.warn("layer: " + JSON.stringify(selectARLayer))
      const tempColor = {
        r: opacity * 255,
        g: opacity * 255,
        b: opacity* 255,
        a: opacity,
      }
      SARMap.set3DLayerObjectsColor(selectARLayer.name, ids, tempColor)

      // const ids = await SARMap.get3DLayerObjectsIds(selectARLayer.name)
      // console.warn("ids: " + JSON.stringify(ids))
      // 当该图层的模型数量大于1时，修改各个模型的透明度
      // if(ids && ids.length > 0) {
      //   const tempColor = {
      //     r: opacity * 255,
      //     g: opacity * 255,
      //     b: opacity* 255,
      //     a: opacity,
      //   }
      //   SARMap.set3DLayerObjectsColor(selectARLayer.name, ids, tempColor)
      //   // const colors =  SARMap.get3DLayerObjectsColor(selectARLayer.name, ids)
      //   // if(colors && colors.length > 0) {
      //   //   SARMap.set3DLayerObjectsColor(selectARLayer.name, ids, colors[0])
      //   // }
      // }
    } else if(selectARLayer.type === ARLayerType.AR_SCENE_LAYER) {
      // console.warn("selectARLayer: " + JSON.stringify(selectARLayer))
      const layer3ds = selectARLayer.ar3DLayers
      if(layer3ds.length > 0) {
        for(let j = 0; j < layer3ds.length; j ++) {
          const layer3d = layer3ds[j]
          // console.warn("layer3d: " + JSON.stringify(layer3d))

          // const ids = await SARMap.get3DLayerObjectsIds(layer3d.name)
          const tempColor = {
            r: opacity* 255,
            g: opacity* 255,
            b: opacity* 255,
            a: opacity,
          }
          SARMap.set3DLayerObjectsColor(layer3d.name, ids, tempColor)

          // if(ids && ids.length > 0) {
          //   const tempColor = {
          //     r: opacity* 255,
          //     g: opacity* 255,
          //     b: opacity* 255,
          //     a: opacity,
          //   }
          //   SARMap.set3DLayerObjectsColor(layer3d.name, ids, tempColor)
          //   // const colors = await SARMap.get3DLayerObjectsColor(layer3d.name, ids)
          //   // if(colors && colors.length > 0) {
          //   //   const tempColor = {
          //   //     r: colors[0].r,
          //   //     g: colors[0].g,
          //   //     b: colors[0].b,
          //   //     a: opacity,
          //   //   }
          //   //   SARMap.set3DLayerObjectsColor(layer3d.name, ids, tempColor)
          //   // } else {
          //   //   const tempColor = {
          //   //     r: 255,
          //   //     g: 255,
          //   //     b: 255,
          //   //     a: opacity,
          //   //   }
          //   //   SARMap.set3DLayerObjectsColor(layer3d.name, ids, tempColor)
          //   // }
          // }
        }
      }
      // console.warn("设置透明度为: " + opacity)
    }
  }
}



const COLORS = [
  '#FFFFFF',
  '#000000',
  '#F0EDE1',
  '#1E477C',
  '#4982BC',
  '#00A1E9',
  '#803000',
  '#BD5747',
  '#36E106',
  '#9CBB58',
  '#8364A1',
  '#4AADC7',
  '#F89746',
  '#E7A700',
  '#E7E300',
  '#D33248',
  '#F1F1F1',
  '#7D7D7D',
  '#DDD9C3',
  '#C9DDF0',
  '#DBE4F3',
  '#BCE8FD',
  '#E5C495',
  '#F4DED9',
  '#DBE9CE',
  '#EBF4DE',
  '#E5E1ED',
  '#DDF0F3',
  '#FDECDC',
  '#FFE7C4',
  '#FDFACA',
  '#F09CA0',
  '#D7D7D7',
  '#585858',
  '#C6B797',
  '#8CB4EA',
  '#C1CCE4',
  '#7ED2F6',
  '#B1894F',
  '#E7B8B8',
  '#B0D59A',
  '#D7E3BD',
  '#CDC1D9',
  '#B7DDE9',
  '#FAD6B1',
  '#F5CE88',
  '#FFF55A',
  '#EF6C78',
  '#BFBFBF',
  '#3E3E3E',
  '#938953',
  '#548ED4',
  '#98B7D5',
  '#00B4F0',
  '#9A6C34',
  '#D79896',
  '#7EC368',
  '#C5DDA5',
  '#B1A5C6',
  '#93CDDD',
  '#F9BD8D',
  '#F7B550',
  '#FFF100',
  '#E80050',
  '#A6A6A7',
  '#2D2D2B',
  '#494428',
  '#1D3A5F',
  '#376192',
  '#825320',
  '#903635',
  '#13B044',
  '#76933C',
  '#5E467C',
  '#31859D',
  '#E46C07',
  '#F39900',
  '#B7AB00',
  '#A50036',
  '#979D99',
  '#0C0C0C',
  '#1C1A10',
  '#0C263D',
  '#005883',
  '#693904',
  '#622727',
  '#005E14',
  '#4F6028',
  '#3E3050',
  '#245B66',
  '#974805',
  '#AD6A00',
  '#8B8100',
  '#7C0022',
  '#F0DCBE',
  '#F2B1CF',
  '#D3FFBF',
  '#00165F',
  '#6673CB',
  '#006EBF',
  '#89CF66',
  '#70A900',
  '#93D150',
  '#70319F',
  '#D38968',
  '#FFBF00',
  '#FFFF00',
  '#C10000',
  '#F0F1A6',
  '#FF0000',
]
