import { DatasetType } from 'imobile_for_reactnative'
import { getLanguage } from '../../../../language'
import { getPublicAssets, getThemeAssets } from '../../../../assets'
import { ChunkType, ConstPath } from '../../../../constants'
import { FileTools } from '../../../../native'

// 获取外部导入目录下的xml
async function getXmlTemplateData() {
  const data = []
  const dir = await FileTools.appendingHomeDirectory(
    `${ConstPath.ExternalData}/${ConstPath.Module.XmlTemplate}/`
  )
  if(await FileTools.fileIsExist(dir)){
    const files = await FileTools.getDirectoryContent(dir)
    files.forEach(item => {
      if(item.type === 'file' && (item.name.indexOf('.xml') != -1)) {
        data.push({title: item.name.replace('.xml','')})
      }
    })
  }
  return [
    {
      title: '',
      data,
      type: 'GET_XML_TEMPLATE',
    },
  ]
}

function getNaviData(language) {
  let data = [
    {
      title: getLanguage(language).Map_Layer.LAYERS_FULL_VIEW_LAYER,
      // '全副显示图层',
      image: getThemeAssets().mapTools.icon_tool_full,
    },
    {
      title: getLanguage(language).Map_Layer.LAYERS_SET_AS_CURRENT_LAYER,
      // '设置为当前图层',
      // image: getPublicAssets().mapTools.tools_set_current_layer,
      image: getThemeAssets().layer.icon_layer_set_current,
    },
    {
      title: getLanguage(language).Map_Main_Menu.ADD_DATASET,
      // '追加数据集',
      // image: getPublicAssets().mapTools.tools_set_current_layer,
      image: getThemeAssets().mine.my_import,
    },
    {
      title: getLanguage(language).Map_Layer.LAYERS_RENAME,
      // '重命名',
      image: getThemeAssets().layer.icon_layer_rename,
    },
    {
      title: getLanguage(language).Map_Layer.LAYERS_REMOVE,
      // '移除',
      image: getThemeAssets().layer.icon_remove_layer,
    },
  ]
  return [
    {
      title: '',
      data,
    },
  ]
}


function getGroupData(language) {
  return [
    {
      title: getLanguage(language).Map_Layer.LAYERS_FULL_VIEW_LAYER,
      // '全副显示图层',
      image: getThemeAssets().mapTools.icon_tool_full,
    },
    {
      title: getLanguage(language).Map_Layer.LAYERS_RENAME,
      // '重命名',
      image: getThemeAssets().layer.icon_layer_rename,
    },
    {
      title: getLanguage(language).Map_Layer.LAYERS_REMOVE,
      // '移除',
      image: getThemeAssets().layer.icon_remove_layer,
    },
  ]
}

function layersetting(language, isGroup = false) {
  let data = []
  if (isGroup) {
    data = getGroupData(language)
  } else {
    data = [
      {
        title: getLanguage(language).Map_Layer.LAYERS_FULL_VIEW_LAYER,
        // '全副显示图层',
        image: getThemeAssets().mapTools.icon_tool_full,
      },
      {
        title: getLanguage(language).Map_Layer.LAYERS_SET_AS_CURRENT_LAYER,
        // '设置为当前图层',
        // image: getPublicAssets().mapTools.tools_set_current_layer,
        image: getThemeAssets().layer.icon_layer_set_current,
      },
      {
        title: getLanguage(language).Map_Layer.LAYERS_SET_VISIBLE_SCALE,
        // '可见比例尺范围',
        // image: getPublicAssets().mapTools.tools_visible_scale_range,
        image: getThemeAssets().layer.icon_layer_visible_scale,
      },
      {
        title: getLanguage(language).Map_Layer.LAYERS_LAYER_STYLE,
        // '图层风格',
        // image: require('../../../../assets/function/icon_function_style.png'),
        image: getThemeAssets().layer.icon_layer_style,
      },
      {
        title: getLanguage(language).Map_Layer.LAYERS_RENAME,
        // '重命名',
        // image: getPublicAssets().mapTools.tools_layer_rename,
        image: getThemeAssets().layer.icon_layer_rename,
      },
      // {
      //   title: getLanguage(language).Map_Layer.LAYERS_MOVE_UP,
      //   image: require('../../../../assets/layerToolbar/layer_moveup.png'),
      // },
      // {
      //   title: getLanguage(language).Map_Layer.LAYERS_MOVE_DOWN,
      //   image: require('../../../../assets/layerToolbar/layer_movedown.png'),
      // },
      // {
      //   title: getLanguage(language).Map_Layer.LAYERS_TOP,
      //   image: require('../../../../assets/layerToolbar/layer_move_top.png'),
      // },
      // {
      //   title: getLanguage(language).Map_Layer.LAYERS_BOTTOM,
      //   image: require('../../../../assets/layerToolbar/layer_move_bottom.png'),
      // },
      // {
      //   title: '复制',
      //   data: [],
      // },
      // {
      //   title: '插入复制的图层',
      //   data: [],
      // },
      // 屏蔽分享图层
      // {
      //   title: getLanguage(language).Map_Layer.LAYERS_SHARE,
      //   // '分享图层',
      //   image: getThemeAssets().nav.icon_nav_share,
      // },
      {
        title: getLanguage(language).Map_Layer.LAYERS_REMOVE,
        // '移除',
        image: getThemeAssets().layer.icon_remove_layer,
      },
      // {
      //   title: '取消',
      //   data: [],
      //   image: require('../../../../assets/mapToolbar/list_type_udb.png'),
      // },
    ]
  }
  if (GLOBAL.Type === ChunkType.MAP_EDIT) {
    data.splice(3, 1)
  }
  return [
    {
      title: '',
      data,
    },
  ]
}

const base3DListData = [
  {
    title: '在线底图',
    index: 0,
    show: true,
    data: [
      // {
      //   title: 'bingmap',
      //   index: 0,
      //   show: true,
      //   type: 'l3dBingMaps',
      //   name: 'bingmap',
      //   url: 'http://t0.tianditu.com/img_c/wmts',
      // },
      {
        title: 'tianditu',
        index: 0,
        show: true,
        type: 'ImageFormatTypeJPG_PNG',
        name: 'tianditu',
        url:
          'http://t0.tianditu.com/img_c/wmts?tk=22f8a846ef9e3becd95a25b08bde8f36',
      },
    ],
  },
]

function layerThemeCreateSetting(language, isGroup = false) {
  let data = []
  if (isGroup) {
    data = getGroupData(language)
  } else {
    data = [
      {
        title: getLanguage(language).Map_Layer.LAYERS_FULL_VIEW_LAYER,
        // '全副显示图层',
        image: getThemeAssets().mapTools.icon_tool_full,
      },
      {
        title: getLanguage(language).Map_Layer.LAYERS_SET_AS_CURRENT_LAYER,
        // '设置为当前图层',
        image: getThemeAssets().layer.icon_layer_set_current,
      },
      {
        title: getLanguage(language).Map_Layer.LAYERS_SET_VISIBLE_SCALE,
        // '可见比例尺范围',
        image: getThemeAssets().layer.icon_layer_visible_scale,
      },
      {
        title: getLanguage(language).Map_Layer.LAYERS_CREATE_THEMATIC_MAP,
        // '新建专题图',
        image: getPublicAssets().mapTools.tools_new_thematic_map,
      },
      {
        title: getLanguage(language).Map_Layer.LAYERS_LAYER_STYLE,
        // '图层风格',
        image: getThemeAssets().layer.icon_layer_style,
      },
      {
        title: getLanguage(language).Map_Layer.LAYERS_RENAME,
        // '重命名',
        image: getThemeAssets().layer.icon_layer_rename,
      },
      // {
      //   title: getLanguage(language).Map_Layer.LAYERS_SHARE,
      //   // '分享图层',
      //   image: getThemeAssets().nav.icon_nav_share,
      // },
      {
        title: getLanguage(language).Map_Layer.LAYERS_REMOVE,
        // '移除',
        image: getThemeAssets().layer.icon_remove_layer,
      },
    ]
  }
  return [
    {
      title: '',
      data,
    },
  ]
}
function layerThemeModifySetting(language, isGroup = false) {
  let data = []
  if (isGroup) {
    data = getGroupData(language)
  } else {
    data = [
      {
        title: getLanguage(language).Map_Layer.LAYERS_FULL_VIEW_LAYER,
        // '全副显示图层',
        image: getThemeAssets().mapTools.icon_tool_full,
      },
      {
        title: getLanguage(language).Map_Layer.LAYERS_SET_AS_CURRENT_LAYER,
        // '设置为当前图层',
        image: getThemeAssets().layer.icon_layer_set_current,
      },
      {
        title: getLanguage(language).Map_Layer.LAYERS_SET_VISIBLE_SCALE,
        // '可见比例尺范围',
        image: getThemeAssets().layer.icon_layer_visible_scale,
      },
      {
        title: getLanguage(language).Map_Layer.LAYERS_MODIFY_THEMATIC_MAP,
        // '修改专题图',
        image: getPublicAssets().mapTools.tools_modify_thematic_map,
      },
      {
        title: getLanguage(language).Map_Layer.LAYERS_RENAME,
        // '重命名',
        image: getThemeAssets().layer.icon_layer_rename,
      },
      // {
      //   title: getLanguage(language).Map_Layer.LAYERS_SHARE,
      //   // '分享图层',
      //   image: getThemeAssets().nav.icon_nav_share,
      // },
      {
        title: getLanguage(language).Map_Layer.LAYERS_REMOVE,
        // '移除',
        image: getThemeAssets().layer.icon_remove_layer,
      },
    ]
  }
  return [
    {
      title: '',
      data,
    },
  ]
}

/*
 * 顶部header菜单数据
 * */
const layerSettingCanVisit = language => [
  {
    title: getLanguage(language).Map_Layer.VISIBLE,
    // 设置图层可见
    image: getThemeAssets().layer.icon_layer_visible,
  },
]

const layerSettingCanNotVisit = language => [
  {
    title: getLanguage(language).Map_Layer.NOT_VISIBLE,
    // 设置图层不可见
    image: getThemeAssets().layer.icon_layer_unvisible,
  },
]

const layerSettingCanSelect = language => [
  {
    title: getLanguage(language).Map_Layer.OPTIONAL,
    image: getThemeAssets().layer.icon_layer_selectable,
  },
]

const layerSettingCanNotSelect = language => [
  {
    title: getLanguage(language).Map_Layer.NOT_OPTIONAL,
    image: getThemeAssets().layer.icon_layer_unselectable,
  },
]

const layerSettingCanEdit = language => [
  {
    title: getLanguage(language).Map_Layer.EDITABLE,
    image: getThemeAssets().layer.icon_layer_editable,
  },
]

const layerSettingCanNotEdit = language => [
  {
    title: getLanguage(language).Map_Layer.NOT_EDITABLE,
    image: getThemeAssets().layer.icon_layer_uneditable,
  },
]

const layerSettingCanSnap = language => [
  {
    title: getLanguage(language).Map_Layer.SNAPABLE,
    image: getThemeAssets().layer.icon_layer_snap,
  },
]

const layerSettingCanNotSnap = language => [
  {
    title: getLanguage(language).Map_Layer.NOT_SNAPABLE,
    image: getThemeAssets().layer.icon_layer_unsnap,
  },
]

const layer3dDefault = (language, selected) => {
  let data = {
    title: getLanguage(language).Map_Layer.NOT_OPTIONAL,
    image: getThemeAssets().layer.icon_layer_selectable,
    type: 'setLayerSelect',
  }
  if (selected === false) {
    data = {
      title: getLanguage(language).Map_Layer.OPTIONAL,
      image: getThemeAssets().layer.icon_layer_unselectable,
      type: 'setLayerSelect',
    }
  }
  return [
    {
      title: '',
      data: [
        {
          // title: getLanguage(language).Map_Layer.LAYERS_SET_AS_CURRENT_LAYER,
          title: getLanguage(language).Map_Layer.SCALE_TO_CURRENT_LAYER,
          image: getThemeAssets().layer.icon_layer_visible_scale,
          type: 'scaleToLayer',
        },
        data,
      ],
    },
  ]
}

function layere3dImage(language) {
  return [
    {
      title: '',
      data: [
        {
          // title: getLanguage(language).Map_Layer.LAYERS_SET_AS_CURRENT_LAYER,
          title: getLanguage(language).Map_Layer.SCALE_TO_CURRENT_LAYER,
          image: getThemeAssets().layer.icon_layer_visible_scale,
          type: 'scaleToLayer',
        },
        {
          title: getLanguage(language).Map_Layer.ADD_A_IMAGE_LAYER,
          image: getThemeAssets().start.icon_new_map,
          type: 'AddImage',
        },
        {
          title: getLanguage(language).Map_Layer.REMOVE_THE_CURRENT_LAYER,
          image: getThemeAssets().layer.icon_remove_layer,
          type: 'RemoveLayer3d_image',
        },
      ],
    },
  ]
}

function layere3dTerrain(language) {
  return [
    {
      title: '',
      data: [
        {
          // title: getLanguage(language).Map_Layer.LAYERS_SET_AS_CURRENT_LAYER,
          title: getLanguage(language).Map_Layer.SCALE_TO_CURRENT_LAYER,
          image: getThemeAssets().layer.icon_layer_visible_scale,
          type: 'scaleToLayer',
        },
        {
          title: getLanguage(language).Map_Layer.ADD_A_TERRAIN_LAYER,
          image: getThemeAssets().start.icon_new_map,
          type: 'AddTerrain',
        },
        {
          title: getLanguage(language).Map_Layer.REMOVE_THE_CURRENT_LAYER,
          image: getThemeAssets().layer.icon_remove_layer,
          type: 'RemoveLayer3d_terrain',
        },
      ],
    },
  ]
}

function layereditsetting(language) {
  return [
    {
      title: '',
      data: [
        {
          title: getLanguage(language).Map_Layer.BASEMAP_SWITH,
          image: getThemeAssets().start.icon_open_map,
        },
        {
          title: getLanguage(language).Map_Layer.LAYERS_REMOVE,
          // '移除',
          image: getThemeAssets().layer.icon_remove_layer,
        },
      ],
    },
  ]
}

function taggingData(language) {
  return [
    {
      title: '',
      data: [
        {
          title: getLanguage(language).Map_Layer.LAYERS_FULL_VIEW_LAYER,
          // '全副显示图层',
          image: getThemeAssets().mapTools.icon_tool_full,
        },
        {
          title: getLanguage(language).Map_Layer.LAYERS_SET_AS_CURRENT_LAYER,
          // '设置为当前图层',
          image: getThemeAssets().layer.icon_layer_set_current,
        },
        {
          title: getLanguage(language).Map_Layer.LAYERS_SET_VISIBLE_SCALE,
          // '可见比例尺范围',
          image: getThemeAssets().layer.icon_layer_visible_scale,
        },
      ],
    },
  ]
}

function layerPlottingSetting(language, isGroup = false) {
  let data = []
  if (isGroup) {
    data = getGroupData(language)
  } else {
    data = [
      {
        title: getLanguage(language).Map_Layer.LAYERS_FULL_VIEW_LAYER,
        // '全副显示图层',
        image: getThemeAssets().mapTools.icon_tool_full,
      },
      {
        title: getLanguage(language).Map_Layer.LAYERS_SET_AS_CURRENT_LAYER,
        // '设置为当前图层',
        image: getThemeAssets().layer.icon_layer_set_current,
      },
      {
        title: getLanguage(language).Map_Layer.LAYERS_SET_VISIBLE_SCALE,
        // '可见比例尺范围',
        image: getThemeAssets().layer.icon_layer_visible_scale,
      },
      {
        title: getLanguage(language).Map_Layer.LAYERS_RENAME,
        // '重命名',
        image: getThemeAssets().layer.icon_layer_rename,
      },
      // {
      //   title: getLanguage(language).Map_Layer.LAYERS_SHARE,
      //   // '分享图层',
      //   image: getThemeAssets().nav.icon_nav_share,
      // },
    ]
  }
  return [
    {
      title: '',
      data,
    },
  ]
}
function layerNavigationSetting(language, isGroup = false) {
  let data = []
  if (isGroup) {
    data = getGroupData(language)
  } else {
    data = [
      {
        title: getLanguage(language).Map_Layer.LAYERS_FULL_VIEW_LAYER,
        // '全副显示图层',
        image: getThemeAssets().mapTools.icon_tool_full,
      },
      {
        title: getLanguage(language).Map_Layer.LAYERS_SET_AS_CURRENT_LAYER,
        // '设置为当前图层',
        image: getThemeAssets().layer.icon_layer_set_current,
      },
      {
        title: getLanguage(language).Map_Layer.LAYERS_SET_VISIBLE_SCALE,
        // '可见比例尺范围',
        image: getThemeAssets().layer.icon_layer_visible_scale,
      },
      {
        title: getLanguage(language).Map_Layer.LAYERS_RENAME,
        // '重命名',
        image: getThemeAssets().layer.icon_layer_rename,
      },
      // {
      //   title: getLanguage(language).Map_Layer.LAYERS_SHARE,
      //   // '分享图层',
      //   image: getThemeAssets().nav.icon_nav_share,
      // },
      {
        title: getLanguage(language).Map_Layer.LAYERS_REMOVE,
        // '移除',
        image: getThemeAssets().layer.icon_remove_layer,
      },
    ]
  }
  return [
    {
      title: '',
      data,
    },
  ]
}
function layerCollectionSetting(language, isGroup = false, layerData) {
  let data = []
  if (isGroup) {
    data = getGroupData(language)
  } else {
    data = [
      {
        title: getLanguage(language).Map_Layer.LAYERS_FULL_VIEW_LAYER,
        // '全副显示图层',
        image: getThemeAssets().mapTools.icon_tool_full,
      },
      {
        title: getLanguage(language).Map_Layer.LAYERS_SET_AS_CURRENT_LAYER,
        // '设置为当前图层',
        image: getThemeAssets().layer.icon_layer_set_current,
      },
      {
        title: getLanguage(language).Map_Layer.LAYERS_SET_VISIBLE_SCALE,
        // '可见比例尺范围',
        image: getThemeAssets().layer.icon_layer_visible_scale,
      },
      {
        title: getLanguage(language).Map_Layer.LAYERS_COLLECT,
        // '当前图层采集',
        image: getThemeAssets().collection.icon_symbol,
      },
      {
        title: getLanguage(language).Map_Layer.LAYERS_RENAME,
        // '重命名',
        image: getThemeAssets().layer.icon_layer_rename,
      },
      // {
      //   title: getLanguage(language).Map_Layer.LAYERS_SHARE,
      //   // '分享图层',
      //   image: getThemeAssets().nav.icon_nav_share,
      // },
      {
        title: getLanguage(language).Map_Layer.LAYERS_REMOVE,
        // '移除',
        image: getThemeAssets().layer.icon_remove_layer,
      },
    ]
    if (layerData) {
      if (
        GLOBAL.Type.indexOf(ChunkType.MAP_AR) >= 0 ||
        layerData.themeType > 0 ||
        layerData.isHeatmap ||
        (layerData.type >= 0 &&
          (layerData.type === DatasetType.CAD ||
            layerData.type === DatasetType.IMAGE ||
            layerData.type === DatasetType.MBImage ||
            layerData.type === DatasetType.TEXT ||
            GLOBAL.Type === ChunkType.MAP_PLOTTING))
      ) {
        data.splice(3, 1) // 若当前图层为CAD或者TEXT，或当前模块为则没有'当前图层采集'选项
      }
    }
  }
  return [
    {
      title: '',
      data,
    },
  ]
}

const mscaleData = [
  {
    title: '',
    data: [
      {
        title: '1:5,000',
      },
      {
        title: '1:10,000',
      },
      {
        title: '1:25,000',
      },
      {
        title: '1:50,000',
      },
      {
        title: '1:100,000',
      },
      {
        title: '1:250,000',
      },
      {
        title: '1:500,000',
      },
      {
        title: '1:1,000,000',
      },
    ],
  },
]

function layerImageSetting(language, isGroup = false) {
  let data = []
  if (isGroup) {
    data = getGroupData(language)
  } else {
    data = [
      {
        title: getLanguage(language).Map_Layer.LAYERS_FULL_VIEW_LAYER,
        // '全副显示图层',
        image: getThemeAssets().mapTools.icon_tool_full,
      },
      // {
      //   title: getLanguage(language).Map_Layer.LAYERS_SET_AS_CURRENT_LAYER,
      //   // '设置为当前图层',
      //   image: getThemeAssets().layer.icon_layer_set_current,
      // },
      {
        title: getLanguage(language).Map_Layer.LAYERS_SET_VISIBLE_SCALE,
        // '可见比例尺范围',
        image: getThemeAssets().layer.icon_layer_visible_scale,
      },
      {
        title: getLanguage(language).Map_Layer.LAYERS_RENAME,
        // '重命名',
        image: getThemeAssets().layer.icon_layer_rename,
      },
      {
        title: getLanguage(language).Map_Layer.LAYERS_REMOVE,
        // '移除',
        image: getThemeAssets().layer.icon_remove_layer,
      },
    ]
  }
  return [
    {
      title: '',
      data,
    },
  ]
}

export {
  layersetting,
  layerThemeCreateSetting,
  layerPlottingSetting,
  layerCollectionSetting,
  layerNavigationSetting,
  layerThemeModifySetting,
  layereditsetting,
  // 3d
  layere3dImage,
  base3DListData,
  layere3dTerrain,
  layer3dDefault,
  taggingData,
  mscaleData,
  layerSettingCanSelect,
  layerSettingCanNotSelect,
  layerSettingCanVisit,
  layerSettingCanNotVisit,
  layerSettingCanEdit,
  layerSettingCanNotEdit,
  layerSettingCanSnap,
  layerSettingCanNotSnap,
  getXmlTemplateData,
  layerImageSetting,
  getNaviData,
}
