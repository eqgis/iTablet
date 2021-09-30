import { fromJS } from 'immutable'
import { REHYDRATE } from 'redux-persist'
import { handleActions } from 'redux-actions'
import { SMap, WorkspaceType } from 'imobile_for_reactnative'
import xml2js from 'react-native-xml2js'
import { FileTools, RNFS as fs } from '../../native'
import { ConstInfo } from '../../constants'

const parser = new xml2js.Parser()
// Constants
// --------------------------------------------------
export const SET_TEMPLATE = 'SET_TEMPLATE'
export const SET_CURRENT_TEMPLATE_INFO = 'SET_CURRENT_TEMPLATE_INFO'
export const SET_CURRENT_TEMPLATE_SYMBOL_LIST =
  'SET_CURRENT_TEMPLATE_SYMBOL_LIST'
export const GET_SYMBOL_TEMPLATES = 'GET_SYMBOL_TEMPLATES'
export const SET_PLOT_LIBIDS = 'SET_PLOT_LIBIDS'
export const SET_PLOT_LIB_PATHS = 'SET_PLOT_LIB_PATHS'
export const SET_CURRENT_PLOT_INFO = 'SET_CURRENT_PLOT_INFO'
export const SET_CURRENT_PLOT_SYMBOL_LIST = 'SET_CURRENT_PLOT_SYMBOL_LIST'

// let isExporting = false

// Actions
// --------------------------------------------------
// 导入模板
// export const openTemplate = (params, cb = () => {}) => async (
//   dispatch,
//   getState,
// ) => {
//   let workspace = getState().map.toJS().workspace
//   let payload = {}
//   let copyResult = true,
//     openResult = false
//   try {
//     // 查看模板工作空间是否存在
//     // 拷贝模板文件
//     let userPath = params.path.substr(0, params.path.indexOf('/Data/Template'))
//     let fileName = params.path.substr(params.path.lastIndexOf('/') + 1)
//     // let alias = fileName.split('.')[0].toString()
//     let fileType = fileName.split('.')[1].toString()
//     let tempDirPath = params.path.substr(0, params.path.lastIndexOf('/'))
//     let tempParentDirName = tempDirPath.substr(tempDirPath.lastIndexOf('/') + 1)
//     let targetPath =
//       userPath + '/' + ConstPath.RelativePath.Workspace + tempParentDirName // 目标文件目录，不含文件名
//     let targetFilePath = targetPath + '/' + fileName
//
//     let type
//     switch (fileType) {
//       case 'SXW':
//         type = WorkspaceType.SXW
//         break
//       case 'SMW':
//         type = WorkspaceType.SMW
//         break
//       case 'SXWU':
//         type = WorkspaceType.SXWU
//         break
//       case 'SMWU':
//       default:
//         type = WorkspaceType.SMWU
//     }
//
//     if (workspace.server === targetFilePath) {
//       cb &&
//         cb({ copyResult, openResult, msg: ConstInfo.WORKSPACE_ALREADY_OPENED })
//     } else {
//       copyResult = await FileTools.copyFile(tempDirPath, targetPath)
//       openResult = false
//       if (copyResult) {
//         // 关闭所有地图
//         await SMap.closeMap()
//         await SMap.closeWorkspace()
//         let data = { server: targetFilePath, type }
//         openResult = await SMap.openWorkspace(data)
//         // 导入新的模板工作空间
//         if (params.isImportWorkspace) {
//           let importWSData = { server: params.path, type }
//           await SMap.importWorkspace(importWSData)
//         }
//         params.isImportWorkspace !== undefined &&
//           delete params.isImportWorkspace
//
//         // let maps = await SMap.getMaps()
//         // await SMap.openMap(maps.length > 0 ? maps.length - 1 : -1)
//         // let mapInfo = await SMap.getMapInfo()
//
//         Object.assign(params, { path: targetFilePath })
//         payload = params
//       }
//     }
//     await dispatch({
//       type: SET_TEMPLATE,
//       payload: payload || {},
//     })
//     cb && cb({ copyResult, openResult })
//     return { copyResult, openResult }
//   } catch (e) {
//     cb && cb({ copyResult, openResult })
//     return { copyResult, openResult }
//   }
// }
export const importWorkspace = (params, cb = () => {}) => async (
  dispatch,
  getState,
) => {
  const { workspace } = getState().map.toJS()
  let payload = {}
  let mapsInfo = []
  try {
    // 查看模板工作空间是否存在
    // 拷贝模板文件
    const paths = params.path.split('/')
    const fileName = paths[paths.length - 1]
    const fileType = fileName
      .split('.')[1]
      .toString()
      .toUpperCase()
    let type
    switch (fileType) {
      case 'SXW':
        type = WorkspaceType.SXW
        break
      case 'SMW':
        type = WorkspaceType.SMW
        break
      case 'SXWU':
        type = WorkspaceType.SXWU
        break
      case 'SMWU':
      default:
        type = WorkspaceType.SMWU
    }

    if (workspace.server === params.path) {
      cb && cb({ mapsInfo, msg: ConstInfo.WORKSPACE_ALREADY_OPENED })
    } else {
      // 关闭所有地图
      await SMap.closeMap()

      let data
      if (params && params.mapName) {
        data = {
          server: params.path,
          type,
          mapName: params.mapName,
        }
      } else {
        data = { server: params.path, type }
      }
      mapsInfo = await SMap.importWorkspaceInfo(data, params.module)
      payload = params
    }
    await dispatch({
      type: SET_TEMPLATE,
      payload: payload || {},
    })
    cb && cb({ mapsInfo })
    return { mapsInfo }
  } catch (e) {
    cb && cb({ mapsInfo, msg: e })
    return { mapsInfo, msg: e }
  }
}

// 导入标绘库
// export const importPlotLib= async (params) => {
export const importPlotLib = (params, cb = () => {}) => async () => {
  const result = await SMap.importPlotLibData(params.path)
  cb && cb({ result })
  return { result }
}

// 导入模板
// export const importTemplate = (params, cb = () => {}) => async dispatch => {
//   // 关闭所有地图
//   await SMap.closeMap()
//   // 导入工作空间
//   const result = await SMap.importWorkspace(params)
//   // // 默认打开第一幅地图
//   // let mapList = (await SMap.getMaps(0)) || []
//   // mapList.length > 0 && (await SMap.openMap(mapList.length - 1))
//   // let mapInfo = await SMap.getMapInfo()
//   // Object.assign(params, mapInfo)
//   // let payload = {
//   //   templateInfo: params,
//   //   mapInfo,
//   // }
//   const payload = params
//   await dispatch({
//     type: SET_TEMPLATE,
//     payload: payload || {},
//   })
//   cb && cb(result)
//   return result
// }

// 设置模板
export const setTemplate = (params, cb = () => {}) => async dispatch => {
  await dispatch({
    type: SET_TEMPLATE,
    payload: params || {},
  })
  cb && cb()
}

// 设置当前选中的模板符号
export const setCurrentTemplateInfo = (
  params,
  cb = () => {},
) => async dispatch => {
  let data = {}
  if (params && params.field) {
    const tempInfo = params.field
    const fieldInfo = []
    tempInfo.forEach(item => {
      fieldInfo.push(item.$)
    })
    data = {
      ...params.$,
      layerPath: params.layerPath,
      field: fieldInfo,
      originData: params,
    }
  }
  await dispatch({
    type: SET_CURRENT_TEMPLATE_INFO,
    payload: data || {},
  })
  cb && cb(params)
}

// 设置当前选中的模板符号
export const setCurrentPlotInfo = (params, cb = () => {}) => async dispatch => {
  let data = {}
  if (params && params.field) {
    const tempInfo = params.field
    const fieldInfo = []
    tempInfo.forEach(item => {
      fieldInfo.push(item.$)
    })
    data = {
      ...params.$,
      layerPath: params.layerPath,
      field: fieldInfo,
      originData: params,
    }
  }
  await dispatch({
    type: SET_CURRENT_PLOT_INFO,
    payload: data || {},
  })
  cb && cb(params)
}
export const getPlotLibs = async (path, dispatch) => {
  try {
    const data = []
    const plotLibPaths = await FileTools.getPathList(path)

    if (plotLibPaths && plotLibPaths.length > 0) {
      plotLibPaths.forEach(item => {
        if (item.isDirectory) {
          const { name } = item
          item.title = name
          item.name = name
          item.path = item.path
          // item.image = require('../../../../assets/mapToolbar/list_type_template_black.png')
          data.push(item)
        }
      })
    }

    dispatch({
      type: SET_PLOT_LIB_PATHS,
      payload: data || [],
    })
    // cb && cb()
  } catch (e) {
    // cb && cb()
  }
}

export const getSymbolPlots = (params, cb = () => {}) => async (
  dispatch,
  getState,
) => {
  try {
    const templateData = getState().template.toJS()
    const { template } = templateData
    const path = (params && params.path) || template.path
    const isFirst = params && params.isFirst
    const newName = params && params.newName
    const isDefaultNew = params.hasOwnProperty('newName')
    // if (
    //   path === templateData.template.path &&
    //   templateData.template.symbols.length > 0
    // ) {
    //   cb && cb(params)
    //   return
    // }
    const plotLibPath = `${path}/Symbol`
    const plotIconPath = `${path}/SymbolIcon`

    const plotLibIds = []
    const plotlibIdAndNameArr = []

    if (isFirst) {
      const libPath = path.substring(0, path.lastIndexOf('/'))
      await getPlotLibs(libPath, dispatch)
    }

    await fs.readDir(plotLibPath).then(async data => {
      const plotLibPaths = []
      for (let i = 0; i < data.length; i++) {
        plotLibPaths.push(data[i].path)
      }
      // await SMap.addCadLayer('PlotEdit')
      const resultArr = await SMap.initPlotSymbolLibrary(
        plotLibPaths,
        isFirst,
        newName,
        isDefaultNew,
      )
      Object.keys(resultArr).forEach(key => {
        plotLibIds.push(resultArr[key])
        plotlibIdAndNameArr.push([key, resultArr[key]])
      })

      // plotLibIds = [22,421]
      // let plotlibIdAndNameArr = [['常用标号',22],['警用标号',421]]
      // let getPlotSymbolLibNameById = async function(libId) {
      //   let name = await SMap.getPlotSymbolLibNameById(libId)
      //   return name
      // }
      // for (let libIndex = 0; libIndex < plotLibIds.length; libIndex++) {
      //   let plotLibName = await getPlotSymbolLibNameById(plotLibIds[libIndex])
      //   plotlibIdAndNameArr.push([plotLibName, plotLibIds[libIndex]])
      // }
      await fs.readDir(plotIconPath).then(async data => {
        const rootFeature = []
        data = data.filter(item => item.isDirectory())
        data.sort((a, b) => {
          if (a.name < b.name) {
            return -1
          }
          if (a.name > b.name) {
            return 1
          }
          return 0
        })
        for (let i = 0; i < data.length; i++) {
          const subData = {}
          const obj = {}
          obj.name = data[i].name
          obj.code = (i + 1).toString()
          obj.type = data[i].name
          const getID = function(name) {
            let id
            for (
              let libIndex = 0;
              libIndex < plotlibIdAndNameArr.length;
              libIndex++
            ) {
              if (name === plotlibIdAndNameArr[libIndex][0]) {
                id = plotlibIdAndNameArr[libIndex][1]
              }
            }
            return id
          }
          let lib
          lib = getID(data[i].name)
          if (lib === undefined) {
            continue
          }
          const dealData = async function(path) {
            const mList = []
            await fs.readDir(path).then(async children => {
              children.sort((a, b) => {
                if (a.name < b.name) {
                  return -1
                }
                if (a.name > b.name) {
                  return 1
                }
                return 0
              })
              for (let j = 0; j < children.length; j++) {
                const childData = {}
                const obj1 = {}
                obj1.name = children[j].name
                // obj1.code = plotLibIds[i]
                obj1.code = lib
                obj1.type = children[j].type
                obj1.path = children[j].path
                const endWith = function(str, endStr) {
                  const d = str.length - endStr.length
                  return d >= 0 && str.lastIndexOf(endStr) == d
                }
                if (!endWith(children[j].name, '.png')) {
                  childData.feature = await dealData(children[j].path)
                } else {
                  obj1.name = children[j].name.substr(
                    0,
                    children[j].name.length - 4,
                  )
                }
                childData.$ = obj1
                childData.fields = [{ field: [{ name: children[j].name }] }]
                mList.push(childData)
              }
            })
            return mList
          }
          subData.$ = obj
          subData.feature = await dealData(data[i].path)
          rootFeature.push(subData)
        }
        dispatch({
          type: GET_SYMBOL_TEMPLATES,
          payload: {
            symbols: rootFeature || [],
            ...params,
          },
        })
        dispatch({
          type: SET_PLOT_LIBIDS,
          payload: plotLibIds || [],
        })
        cb && cb(params)
      })
    })
  } catch (e) {
    cb && cb(params)
  }
}

// 获取xml文件中的模板符号
export const getSymbolTemplates = (params, cb = () => {}) => async (
  dispatch,
  getState,
) => {
  try {
    const templateData = getState().template.toJS()
    const { template } = templateData
    const path = (params && params.path) || template.path
    if (
      path === templateData.template.path &&
      templateData.template.symbols.length > 0
    ) {
      cb && cb(params)
      return
    }
    if (path && path.substr(path.lastIndexOf('.') + 1) === 'xml') {
      fs.readFile(path).then(data => {
        parser.parseString(data, async (err, result) => {
          await dispatch({
            type: GET_SYMBOL_TEMPLATES,
            payload: {
              symbols: result.featureSymbol.template[0].feature || [],
              ...params,
            },
          })
          cb && cb(params)
        })
      })
    } else if (path) {
      const tempPath = path.substr(0, path.lastIndexOf('/') + 1)
      FileTools.getPathListByFilter(tempPath, {
        extension: 'xml',
        type: 'file',
      }).then(xmlList => {
        if (xmlList && xmlList.length > 0 && !xmlList[0].isDirectory) {
          const xmlInfo = xmlList[0]
          FileTools.appendingHomeDirectory(xmlInfo.path).then(xmlPath => {
            fs.readFile(xmlPath).then(data => {
              parser.parseString(data, async (err, result) => {
                await dispatch({
                  type: GET_SYMBOL_TEMPLATES,
                  payload: {
                    symbols: result.featureSymbol.template[0].feature || [],
                    path,
                  },
                })
                cb && cb(params)
              })
            })
          })
        }
      })
    } else {
      cb && cb(params)
    }
    return
  } catch (e) {
    cb && cb(params)
  }
}

// 设置模板符号
export const setSymbolTemplates = (params, cb = () => {}) => async dispatch => {
  try {
    await dispatch({
      type: GET_SYMBOL_TEMPLATES,
      payload: {
        symbols: params.data.featureSymbol.template[0].feature || [],
        path: params.path,
        name: params.name || '',
      },
    })
    cb && cb(params)
    return
  } catch (e) {
    cb && cb(params)
  }
}

// 设置当前标绘库
export const setCurrentPlotList = (params, cb = () => {}) => async dispatch => {
  try {
    const list = []
    // if (params.$.datasetName && params.$.type !== 'Unknown') {
    //   list = [{ ...params.$, field: params.fields[0].field }]
    // }
    const getData = function(data) {
      if (!data.feature || data.feature.length === 0) return
      for (let i = 0; i < data.feature.length; i++) {
        const item = data.feature[i]
        // list.push({ ...item.$, field: item.fields[0].field })
        if (item.feature && item.feature.length > 0) {
          getData(item)
        } else {
          list.push({ ...item.$, field: item.fields[0].field })
        }
      }
    }
    getData(params)

    await dispatch({
      type: SET_CURRENT_PLOT_SYMBOL_LIST,
      payload: list || [],
    })
    return
  } catch (e) {
    cb && cb(params)
  }
}

// 设置当前选择模板符号列表
export const setCurrentTemplateList = (
  params,
  cb = () => {},
) => async dispatch => {
  try {
    let list = []
    if (params) {
      if (params.$.datasetName && params.$.type !== 'Unknown') {
        list = [{ ...params.$, field: params.fields[0].field }]
      }
      const getData = function(data) {
        if (!data.feature || data.feature.length === 0) return
        for (let i = 0; i < data.feature.length; i++) {
          const item = data.feature[i]
          list.push({ ...item.$, field: item.fields[0].field })
          if (item.feature && item.feature.length > 0) {
            getData(item)
          }
        }
      }
      getData(params)
    }

    await dispatch({
      type: SET_CURRENT_TEMPLATE_SYMBOL_LIST,
      payload: list || [],
    })
    return
  } catch (e) {
    cb && cb(params)
  }
}

const initialState = fromJS({
  template: {
    symbols: [],
    path: '',
    name: '',
  }, // 当前使用的模板
  templates: [], // 使用的模板列表，最近使用的在前面
  currentTemplateInfo: {},
  currentTemplateList: [],
  latestTemplateSymbols: [],
  currentPlotInfo: {},
  currentPlotList: [],
  latestPlotSymbols: [],
  plotLibIds: [],
  plotLibPaths: [],
})

const maxLength = 20
export default handleActions(
  {
    [`${SET_CURRENT_TEMPLATE_INFO}`]: (state, { payload }) => {
      let newData = state.toJS().latestTemplateSymbols || []
      let isExist = false
      const { originData } = payload
      for (let i = 0; i < newData.length; i++) {
        if (originData && newData[i].code === originData.code) {
          newData[i] = originData
          const temp = newData[0]
          newData[0] = newData[i]
          newData[i] = temp
          isExist = true
          break
        }
      }
      if (!isExist && originData) {
        newData.unshift(originData)
      }
      if (newData.length >= maxLength) {
        newData = newData.slice(0, maxLength)
      }
      delete payload.originData
      return state
        .setIn(['currentTemplateInfo'], fromJS(payload))
        .setIn(['latestTemplateSymbols'], fromJS(newData))
    },
    [`${SET_CURRENT_TEMPLATE_SYMBOL_LIST}`]: (state, { payload }) =>
      state.setIn(['currentTemplateList'], fromJS(payload)),
    [`${SET_PLOT_LIBIDS}`]: (state, { payload }) =>
      state.setIn(['plotLibIds'], fromJS(payload)),
    [`${SET_PLOT_LIB_PATHS}`]: (state, { payload }) =>
      state.setIn(['plotLibPaths'], fromJS(payload)),
    [`${SET_TEMPLATE}`]: (state, { payload }) => {
      const newData = state.toJS().templates || []
      let isExist = false
      if (payload.path) {
        for (let i = 0; i < newData.length; i++) {
          if (newData[i].path === payload.path) {
            newData[i] = payload
            const temp = newData[0]
            newData[0] = newData[i]
            newData[i] = temp
            isExist = true
            break
          }
        }
      }
      if (!isExist && payload && payload.path) {
        newData.unshift(payload)
      }
      return state
        .setIn(['template'], fromJS({ ...payload, symbols: [] }))
        .setIn(['templates'], fromJS(newData))
      // .setIn(['currentMap'], fromJS(payload.currentMap))
      // .setIn(['workspace'], fromJS({ server: payload.templateInfo.path }))
    },
    // [`${SET_TEMPLATE}`]: (state, { payload }) => {
    //   return state.setIn(['template'], fromJS(payload))
    // },
    [`${GET_SYMBOL_TEMPLATES}`]: (state, { payload }) => {
      const newData = state.toJS().templates || []
      const oldTemplate = state.toJS().template || []
      const latestTemplateSymbols = state.toJS().latestTemplateSymbols || []
      const currentTemplateInfo = state.toJS().currentTemplateInfo || {}
      const currentTemplateList = state.toJS().currentTemplateList || []
      let isExist = false
      if (newData.length > 0) {
        for (let i = 0; i < newData.length; i++) {
          if (!newData[i].path || newData[i].path === payload.path) {
            isExist = true
            Object.assign(newData[i], payload)
            // Object.assign(template, payload)
            break
          }
        }
      }
      if (!isExist) {
        newData.push(payload)
      }
      let _latestTemplateSymbols = latestTemplateSymbols
      let _currentTemplateList = currentTemplateList
      let _currentTemplateInfo = currentTemplateInfo
      if (
        oldTemplate.path !== payload.path ||
        JSON.stringify(oldTemplate.symbols) !== JSON.stringify(payload.symbols)
      ) {
        let _firstData =
          payload.symbols && payload.symbols.length > 0
            ? payload.symbols[0]
            : {}

        let _list = []
        if (_firstData) {
          if (_firstData.$.datasetName && _firstData.$.type !== 'Unknown') {
            _list = [{ ..._firstData.$, field: _firstData.fields[0].field }]
          }
          const getData = function(data) {
            if (!data.feature || data.feature.length === 0) return
            for (let i = 0; i < data.feature.length; i++) {
              const item = data.feature[i]
              _list.push({ ...item.$, field: item.fields[0].field })
              if (item.feature && item.feature.length > 0) {
                getData(item)
              }
            }
          }

          getData(_firstData)
          _currentTemplateList = _list
        }

        _latestTemplateSymbols = []
        _currentTemplateInfo = {}
      }
      return state
        .setIn(['templates'], fromJS(newData))
        .setIn(['template'], fromJS(payload))
        .setIn(['latestTemplateSymbols'], fromJS(_latestTemplateSymbols))
        .setIn(['currentTemplateList'], fromJS(_currentTemplateList))
        .setIn(['currentTemplateInfo'], fromJS(_currentTemplateInfo))
    },

    [`${SET_CURRENT_PLOT_INFO}`]: (state, { payload }) => {
      let newData = state.toJS().latestPlotSymbols || []
      let isExist = false
      const { originData } = payload
      for (let i = 0; i < newData.length; i++) {
        if (
          originData &&
          newData[i].code === originData.code &&
          newData[i].name === originData.name
        ) {
          newData[i] = originData
          const temp = newData[0]
          newData[0] = newData[i]
          newData[i] = temp
          isExist = true
          break
        }
      }
      if (!isExist && originData) {
        newData.unshift(originData)
      }
      if (newData.length >= maxLength) {
        newData = newData.slice(0, maxLength)
      }
      delete payload.originData
      return state
        .setIn(['currentPlotInfo'], fromJS(payload))
        .setIn(['latestPlotSymbols'], fromJS(newData))
    },
    [`${SET_CURRENT_PLOT_SYMBOL_LIST}`]: (state, { payload }) =>
      state.setIn(['currentPlotList'], fromJS(payload)),

    [REHYDRATE]: (state, { payload }) => {
      if (payload && payload.template) {
        const data = payload.template
        data.template = {
          symbols: [],
          path: '',
          name: '',
        }
        data.currentTemplateInfo = {}
        data.currentTemplateList = []
        data.plotLibIds = []
        data.plotLibPaths = []
        data.currentPlotInfo = {}
        data.currentPlotList = []
        if (data.latestPlotSymbols === undefined) data.latestPlotSymbols = []
        return fromJS(data)
      }
      return state
    },
  },
  initialState,
)
