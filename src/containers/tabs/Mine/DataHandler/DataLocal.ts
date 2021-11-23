import { SMap, EngineType, ARLayerType, DatasetType, FiltedData, TDatasetType, TARLayerType } from 'imobile_for_reactnative'
import { ConstPath } from '../../../../constants'
import { FileTools, NativeMethod } from '../../../../native'
import { dataUtil } from '../../../../utils'
import { UserInfo, LocalDataType } from '../../../../types'

export interface ILocalData extends FiltedData {
  /** ai模型相关信息 */
  aiModelInfo?: {
    modelName: string,
    labels: string[],
    paramJsonName?: string,
  }
}

async function getLocalData(user: UserInfo, type: LocalDataType) {
  let dataList = []
  switch (type) {
    case 'DATA':
    case 'MAP':
    case 'SCENE':
    case 'SYMBOL':
    case 'ARMAP':
    case 'ARMODEL':
    case 'AREFFECT':
    case 'WORKSPACE3D':
      dataList = await _getListByFilter(user, type)
      break
    case 'COLOR':
      dataList = await _getColorSchemeDataList(user)
      break
    case 'LABEL':
      dataList = await _getLabelDataList(user)
      break
    case 'TEMPLAE_PLOTTING':
      dataList = await _getPlotDataList(user)
      break
    case 'TEMPLAE_COLLECTING':
      dataList = await NativeMethod.getTemplatesList(
        user.userName,
        'Template',
      )
      break
    case 'MAPPING_COLLECTING':
      dataList = await NativeMethod.getTemplatesList(
        user.userName,
        'XmlTemplate',
      )
      break
    case 'AIMODEL':
      dataList = await _getAIModelDataList(user)
      break
  }
  return dataList
}

async function _getListByFilter(user: UserInfo, type: LocalDataType) {
  const homePath = await FileTools.appendingHomeDirectory()
  const userPath = `${homePath + ConstPath.UserPath + user.userName}/`

  let path
  let filter
  switch (type) {
    case 'DATA':
      path = userPath + ConstPath.RelativePath.Datasource
      filter = {
        extension: 'udb,sci',
        type: 'file',
        exclued: `Label_${user.userName}#.udb`,
      }
      break
    case 'MAP':
      path = userPath + ConstPath.RelativePath.Map
      filter = {
        extension: 'xml',
        type: 'file',
      }
      break
    case 'SCENE':
      path = userPath + ConstPath.RelativePath.Scene
      filter = {
        // type: 'Directory',
        type: 'file',
      }
      break
    case 'SYMBOL':
      path = userPath + ConstPath.RelativePath.Symbol
      filter = {
        type: 'file',
      }
      break
    case 'ARMAP':
      path = userPath + ConstPath.RelativePath.ARMap
      filter = {
        type: 'file',
        extension: 'arxml',
      }
      break
    case 'COLOR':
      path = userPath + ConstPath.RelativePath.Color
      filter = {
        extension: 'scs',
        type: 'file',
      }
      break
    case 'AIMODEL':
      path = userPath + ConstPath.RelativePath.AIModel
      filter = {
        type: 'Directory',
      }
      break
    case 'ARMODEL':
      path = userPath + ConstPath.RelativePath.ARModel
      filter = {
        type: 'file',
        extension: 'glb',
      }
      break
    case 'WORKSPACE3D':
      path = userPath + ConstPath.RelativePath.Scene
      filter = {
        type: 'file',
        extension: 'pxp',
      }
      break
    case 'AREFFECT':
      path = userPath + ConstPath.RelativePath.AREffect
      filter = {
        type: 'AREFFECT',
        extension: 'areffect',
      }
      break
  }
  let list
  if (type === 'MAP') {
    list = await FileTools.getMaps(path, filter)
  } else {
    list = await FileTools.getPathListByFilter(path, filter)
  }
  return list
}

async function _getLabelDataList(user: UserInfo) {
  const homePath = await FileTools.appendingHomeDirectory()
  const userPath = `${homePath + ConstPath.UserPath + user.userName}/`

  const path = `${userPath + ConstPath.RelativePath.Label}Label_${
    user.userName
  }#.udb`
  const result = await FileTools.fileIsExist(path)
  if (!result) {
    // creatLabelDatasource(user, path)
    return []
  }
  const list = await SMap.getUDBNameOfLabel(path)
  return list
}

async function _getPlotDataList(user: UserInfo) {
  const homePath = await FileTools.appendingHomeDirectory()
  const userPath = `${homePath + ConstPath.UserPath + user.userName}/`
  const plotPath = userPath + ConstPath.RelativePath.Plotting

  const list = []
  const arrDirContent = await FileTools.getDirectoryContent(plotPath)
  if (arrDirContent.length > 0) {
    for (const key in arrDirContent) {
      if (arrDirContent[key].type === 'directory') {
        const dirPath = plotPath + arrDirContent[key].name
        const dirContent = await FileTools.getDirectoryContent(dirPath)
        let hasSymbol
        let hasSymbolIcon
        if (dirContent.length === 0) continue
        for (const index in dirContent) {
          if (dirContent[index].type === 'directory') {
            if (dirContent[index].name === 'Symbol') {
              hasSymbol = true
            } else if (dirContent[index].name === 'SymbolIcon') {
              hasSymbolIcon = true
            }
          }
        }
        if (hasSymbol && hasSymbolIcon) {
          list.push({
            name: arrDirContent[key].name,
            path: plotPath + arrDirContent[key].name,
          })
        }
      }
    }
  }
  return list
}

async function _getColorSchemeDataList(user: UserInfo) {
  let dataList = await _getListByFilter(user, 'COLOR')
  for (let i = 0; i < dataList.length; i++) {
    await _getColorFromFile(dataList[i])
  }
  return dataList
}

async function _getColorFromFile(item: any) {
  const homePath = await FileTools.appendingHomeDirectory()
  let colorScheme = await FileTools.readFile(homePath + item.path)
  let resutl = await dataUtil.xml2js(colorScheme)
  let { ColorScheme } = resutl
  let colors = []
  if (ColorScheme && ColorScheme.DataBlock) {
    for (let key in ColorScheme.DataBlock) {
      let data = ColorScheme.DataBlock[key]
      colors.push({
        r: parseInt(data.Red),
        g: parseInt(data.Green),
        b: parseInt(data.Blue),
      })
    }
  }
  item.colors = colors
}

async function _getAIModelDataList(user: UserInfo) {
  let list = []
  const homePath = await FileTools.appendingHomeDirectory()
  let dataList = await _getListByFilter(user, 'AIMODEL')
  for (let n = 0; n < dataList.length; n++) {
    let item = dataList[n]
    let contentList = await FileTools.getDirectoryContent(homePath + item.path)
    let tflite
    let labels = []
    let param
    for (let i = 0; i < contentList.length; i++) {
      if (contentList[i].type === 'file') {
        let index = contentList[i].name.lastIndexOf('.')
        if (index > 0) {
          let type = contentList[i].name.substring(index + 1).toLowerCase()
          if (type === 'tflite') {
            tflite = contentList[i].name
          } else if (type === 'txt') {
            labels.push(contentList[i].name)
          } else if (type === 'json') {
            param = contentList[i].name
          }
        }
      }
    }
    if (tflite && labels.length > 0) {
      // item.tflite = tflite
      // item.labels = labels
      // item.param = param
      // list.push(item)

      const info = {
        modelName: tflite,
        labels: labels,
        paramJsonName: param,
      }
      list.push({
        ...dataList[n],
        aiModelInfo: info,
      })
    }
  }

  return list
}

async function createDatasourceFile(user: UserInfo, datasourcePath: string) {
  const result = await SMap.createDatasourceFile({
    server: datasourcePath,
    engineType: EngineType.UDB,
    alias: `Label_${user.userName}#`,
    description: 'Label',
  })
  return result
}

/**
 * 获取不带后缀的可用文件名
 * @param {*} path  绝对路径
 * @param {*} name  文件名
 * @param {*} ext   后缀名
 * @returns
 */
async function getAvailableFileNameNoExt (path: string, name: string, ext: string) {
  const result = await FileTools.fileIsExist(path)
  if (!result) {
    await FileTools.createDirectory(path)
  }
  let availableName = name + '.' + ext
  if (await FileTools.fileIsExist(path + '/' + availableName)) {
    for (let i = 1; ; i++) {
      availableName = name + '_' + i + '.' + ext
      if (!(await FileTools.fileIsExist(path + '/' + availableName))) {
        return name + '_' + i
      }
    }
  } else {
    return name
  }
}

/**
 * 获取带后缀的可用文件名
 * @param {*} path  绝对路径
 * @param {*} name  文件名
 * @param {*} ext   后缀名
 * @returns
 */
async function getAvailableFileName (path: string, name: string, ext: string) {
  const result = await FileTools.fileIsExist(path)
  if (!result) {
    await FileTools.createDirectory(path)
  }
  let availableName = name + '.' + ext
  const slash = (path.length === path.lastIndexOf('/') + 1) ? '' : '/'
  if (await FileTools.fileIsExist(path + slash + availableName)) {
    for (let i = 1; ; i++) {
      availableName = name + '_' + i + '.' + ext
      if (!(await FileTools.fileIsExist(path + slash + availableName))) {
        return availableName
      }
    }
  } else {
    return availableName
  }
}

/**
 * 创建数据源文件和指定的数据集
 * @param datasourcePath 要创建的数据源存放路径
 * @param datasourceName 数据源文件名
 * @param datasetName 数据集名称
 * @param datastType 数据集类型
 * @param newDatasource 重名时去创建新的数据源
 * @param newDataset 重名时去创建新的数据集
 * @returns 创建后的数据源名和数据集名
 */
async function createDefaultDatasource(
  datasourcePath: string,
  datasourceName: string,
  datasetName: string,
  datastType: TDatasetType,
  newDatasource: string,
  newDataset: string,
) {
  let result = false
  try {
    let server = datasourcePath + datasourceName + '.udb'
    const exist = await FileTools.fileIsExist(server)
    if(!exist) {
      //不存在，创建并打开
      result = await SMap.createDatasource({
        alias: datasourceName,
        server: server,
        engineType: EngineType.UDB,
      })
    } else {
      if(newDatasource) {
        //存在，创建新的数据源
        datasourceName = await getAvailableFileNameNoExt(datasourcePath, datasourceName, 'udb')
        server = datasourcePath + datasourceName + '.udb'
        result = await SMap.createDatasource({
          alias: datasourceName,
          server: server,
          engineType: EngineType.UDB,
        })
      } else {
        //存在，检查是否打开
        const wsds = await SMap.getDatasources()
        const opends = wsds.filter(item => {
          return item.server === server
        })
        //未打开则在此打开
        if(opends.length === 0) {
          result = await SMap.openDatasource({
            alias: datasourceName,
            server: server,
            engineType: EngineType.UDB,
          }, -1)
        } else {
          result = true
        }
      }

    }
    if(result) {
    //检查打开的数据源中是否有默认的数据集
      const dsets = await SMap.getDatasetsByDatasource({alias: datasourceName})
      const defualtDset = dsets.list.filter(item => {
        return item.datasetName === datasetName
      })
      //没有则创建
      if(defualtDset.length === 0) {
        result = await SMap.createDataset(datasourceName, datasetName, datastType)
      } else {
        //重名则创建新的数据集
        if(newDataset) {
          datasetName = await SMap.getAvailableDatasetName(datasourceName, datasetName)
          result = await SMap.createDataset(datasourceName, datasetName, datastType)
        }
      }
      if(result) {
        return {
          success: true,
          datasourceName,
          datasetName,
        }
      }
    }
    return {
      success: false,
      error: 'fail',
    }
  } catch(e) {
    return {
      success: false,
      error: e,
    }
  }
}

async function createARElementDatasource(
  user: UserInfo,
  datasourceName: string,
  datasetName: string,
  newDatasource: string,
  newDataset: string,
  type: TARLayerType,
) {
  try {
    const homePath = await FileTools.getHomeDirectory()
    const datasourcePath = homePath + ConstPath.UserPath + user.userName + '/' + ConstPath.RelativePath.ARDatasource

    let datasetType
    if(type === ARLayerType.AR_LINE_LAYER) {
      datasetType = DatasetType.LineZ
    } else if(type === ARLayerType.AR_REGION_LAYER) {
      datasetType = DatasetType.RegionZ
    } else {
      datasetType = DatasetType.PointZ
    }
    return await createDefaultDatasource(datasourcePath, datasourceName, datasetName, datasetType, newDatasource, newDataset)
  } catch (e) {
    return {
      success: false,
      error: e,
    }
  }
}

async function createPoiSearchDatasource(
  user: UserInfo,
) {
  try {
    const homePath = await FileTools.getHomeDirectory()
    const datasourcePath = homePath + ConstPath.UserPath + user.userName + '/' + ConstPath.RelativePath.Temp
    const datasourceName = 'naviDatasource'
    const datasetName = 'naviDataset'

    return await createDefaultDatasource(datasourcePath, datasourceName, datasetName, DatasetType.PointZ, '', '')
  } catch (e) {
    return {
      success: false,
      error: e,
    }
  }
}

export default {
  getLocalData,
  createDatasourceFile,
  getAvailableFileName,
  getAvailableFileNameNoExt,
  createDefaultDatasource,
  createARElementDatasource,
  createPoiSearchDatasource,
}