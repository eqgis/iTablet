import { FileTools, RNFS, SData } from 'imobile_for_reactnative'
import { DatasetType, TDatasetType } from 'imobile_for_reactnative/NativeModule/interfaces/data/SData'
import { ConstPath } from '../../constants'
import { NativeMethod } from '../../native'
import { dataUtil } from '..'
import { UserInfo, LocalDataType } from '../../types'
import { DatasourceConnectionInfo, EngineType } from 'imobile_for_reactnative/NativeModule/interfaces/data/SData'
import {
  ARLayerType,
  TARLayerType,
} from "imobile_for_reactnative/NativeModule/interfaces/ar/SARMap"
import { FiltedData, FileInfo } from 'imobile_for_reactnative/NativeModule/utility/FileTools'

export interface ILocalData extends FiltedData {
  /** ai模型相关信息 */
  aiModelInfo?: {
    modelName: string
    labels: string[]
    paramJsonName?: string
  }
  /** 沙盘模型相关信息 */
  sandTableInfo?: {
    models: string[]
    xml: string
  }
}

async function getLocalData(user: UserInfo, type: LocalDataType): Promise<ILocalData[]> {

  switch (type) {
    case 'DATA':
    case 'MAP':
    case 'SCENE':
    case 'SYMBOL':
    case 'ARMAP':
    case 'ARMODEL':
    case 'AREFFECT':
    case 'WORKSPACE3D':
      return await _getListByFilter(user, type)
    case 'COLOR':
      return await _getColorSchemeDataList(user)
    case 'LABEL':
      return await _getLabelDataList(user)
    case 'TEMPLAE_PLOTTING':
      return await _getPlotDataList(user)
    case 'TEMPLAE_COLLECTING':
      return await NativeMethod.getTemplatesList(
        user.userName,
        'Template',
      )
    case 'MAPPING_COLLECTING':
      return await NativeMethod.getTemplatesList(
        user.userName,
        'XmlTemplate',
      )
    case 'AIMODEL':
      return await _getAIModelDataList(user)
    case 'SANDTABLE':
      return await _getLocalSandTable(user.userName)
  }
}

async function deleteLocalData(item: ILocalData, type: LocalDataType): Promise<boolean> {
  switch(type) {
    case 'AIMODEL':
    case 'AREFFECT':
    case 'ARMAP':
    case 'ARMODEL':
    case 'COLOR':
    case 'DATA':
    case 'LABEL':
    case 'MAP':
    case 'MAPPING_COLLECTING':
    case 'SANDTABLE':
    case 'SCENE':
    case 'SYMBOL':
    case 'TEMPLAE_COLLECTING':
    case 'TEMPLAE_PLOTTING':
    case 'WORKSPACE3D':
      return false
  }
}

async function _getListByFilter(user: UserInfo, type: LocalDataType) {
  const homePath = await FileTools.appendingHomeDirectory()
  const userPath = `${homePath + ConstPath.UserPath + user.userName}/`

  let path = ''
  let filter = {}
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

interface IPxpContent {
  Name: string
  Workspace: {
    type: number | string //todo 这里android和ios的类型不一样，暂时在js层做兼容
    server: string
  }
  Type?: number //todo
}

/** 获取3维pxp文件内内容 */
async function getPxpContent(pxpPath: string): Promise<IPxpContent | null> {
  const content = await RNFS.readFile(pxpPath)
  const pxp = JSON.parse(content)
  if('Name' in pxp && typeof pxp['Name'] === 'string' &&
   ('Workspace' in pxp && ('type' in pxp['Workspace'] && (typeof pxp['Workspace']['type'] === 'string') || (typeof pxp['Workspace']['type'] === 'number')) &&
   ('server' in pxp['Workspace'] && typeof pxp['Workspace']['server'] === 'string')) &&
   (typeof pxp['Type'] === 'number' || typeof pxp['Type'] === 'undefined')
  ) {
    return pxp
  }
  return null
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
  const dsInfo:DatasourceConnectionInfo = {server:path,alias:`Label_${
    user.userName}`,engineType:EngineType.UDB}
  const list = await SData.getDatasetsByDatasource(dsInfo)
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
  const dataList = await _getListByFilter(user, 'COLOR')
  for (let i = 0; i < dataList.length; i++) {
    await _getColorFromFile(dataList[i])
  }
  return dataList
}

async function _getColorFromFile(item: any) {
  const homePath = await FileTools.appendingHomeDirectory()
  const colorScheme = await FileTools.readFile(homePath + item.path)
  const resutl = await dataUtil.xml2js(colorScheme)
  const { ColorScheme } = resutl
  const colors = []
  if (ColorScheme && ColorScheme.DataBlock) {
    for (const key in ColorScheme.DataBlock) {
      const data = ColorScheme.DataBlock[key]
      colors.push({
        r: parseInt(data.Red),
        g: parseInt(data.Green),
        b: parseInt(data.Blue),
      })
    }
  }
  item.colors = colors
}

async function _getAIModelDataList(user: UserInfo): Promise<ILocalData[]> {
  const list = []
  const homePath = await FileTools.appendingHomeDirectory()
  const dataList = await _getListByFilter(user, 'AIMODEL')
  for (let n = 0; n < dataList.length; n++) {
    const item = dataList[n]
    const contentList = await FileTools.getDirectoryContent(homePath + item.path)
    let tflite: string | undefined
    const labels: string[] = []
    let param: string | undefined
    for (let i = 0; i < contentList.length; i++) {
      if (contentList[i].type === 'file') {
        const index = contentList[i].name.lastIndexOf('.')
        if (index > 0) {
          const type = contentList[i].name.substring(index + 1).toLowerCase()
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

      const info: ILocalData['aiModelInfo']  = {
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


async function _getLocalSandTable(userName: string): Promise<ILocalData[]> {
  const homePath = await FileTools.getHomeDirectory()
  const userPath = `${homePath + ConstPath.UserPath + userName}/`

  const sandTablePath = userPath + ConstPath.RelativePath.ARSandTable

  const list = await FileTools.getPathListByFilter(sandTablePath, {type: 'Directory'})

  const results: ILocalData[] = []
  for(let i = 0; i < list.length; i++) {
    const content = await FileTools.getDirectoryContent(homePath + list[i].path)
    let path: string | undefined
    const glbs: string[] = []
    content.forEach(item => {
      if(item.type === 'file') {
        const index = item.name.lastIndexOf('.')
        if(index > 0) {
          const type = item.name.substring(index + 1).toLowerCase()
          if(type === 'stxml') {
            path = item.name
          } else if(type === 'glb') {
            glbs.push(item.name)
          }
        }
      }
    })
    if(path && glbs.length > 0) {
      results.push({
        ...list[i],
        sandTableInfo: {
          xml: path,
          models: glbs,
        }
      })
    }
  }

  return results
}

async function createDatasourceFile(user: UserInfo, datasourcePath: string) {
  const result = await SData.createDatasourceFile({
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

interface ICreateResultSuccess {
  success: true
  datasourceName: string
  datasetName: string
}

interface ICreateResultFail {
  success: false
  error: string
}

type ICreateResult = ICreateResultSuccess | ICreateResultFail

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
  newDatasource: boolean,
  newDataset: boolean,
): Promise<ICreateResult> {
  let result = ""
  try {
    let server = datasourcePath + datasourceName + '.udb'
    const exist = await FileTools.fileIsExist(server)
    if(!exist) {
      //不存在，创建并打开
      result = await SData.createDatasource({
        alias: datasourceName,
        server: server,
        engineType: EngineType.UDB,
      })
    } else {
      if(newDatasource) {
        //存在，创建新的数据源
        datasourceName = await getAvailableFileNameNoExt(datasourcePath, datasourceName, 'udb')
        server = datasourcePath + datasourceName + '.udb'
        result = await SData.createDatasource({
          alias: datasourceName,
          server: server,
          engineType: EngineType.UDB,
        })
      } else {
        //存在，检查是否打开
        const wsds = await SData.getDatasources()
        const opends = wsds.filter(item => {
          return item.server === server
        })
        //未打开则在此打开
        if(opends.length === 0) {
          result = await SData.openDatasource({
            alias: datasourceName,
            server: server,
            engineType: EngineType.UDB,
          })
        }
      }

    }
    if(result != "") {
    //检查打开的数据源中是否有默认的数据集
      const dsets = await SData.getDatasetsByDatasource({alias: datasourceName})
      const defualtDset = dsets.filter(item => {
        return item.datasetName === datasetName
      })
      let bDsCreate = false
      //没有则创建
      if(defualtDset.length === 0) {
        bDsCreate = await SData.createDataset(datasourceName, datasetName, datastType)
      } else {
        //重名则创建新的数据集
        if(newDataset) {
          datasetName = await SData.availableDatasetName(datasourceName, datasetName)
          bDsCreate = await SData.createDataset(datasourceName, datasetName, datastType)
        }
      }
      if(bDsCreate) {
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
      error: 'error',
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
): Promise<ICreateResult> {
  try {
    const homePath = await FileTools.getHomeDirectory()
    const datasourcePath = homePath + ConstPath.UserPath + user.userName + '/' + ConstPath.RelativePath.ARDatasource

    let datasetType
    if(type === ARLayerType.AR_LINE_LAYER|| type === ARLayerType.AR_MARKER_LINE_LAYER) {
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
      error: 'error',
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

    return await createDefaultDatasource(datasourcePath, datasourceName, datasetName, DatasetType.PointZ, false, false)
  } catch (e) {
    return {
      success: false,
      error: e,
    }
  }
}

async function getAvailableName(path: string, name: string, type: 'file' | 'directory', ext = ''): Promise<string> {
  const fileList = await FileTools.getDirectoryContent(path)

  let AvailabeName = name
  if (type === 'file' && ext !== '') {
    AvailabeName = `${name}.${ext}`
  }
  if (_isInlList(AvailabeName, fileList, type)) {
    for (let i = 1; ; i++) {
      AvailabeName = `${name}_${i}`
      if (type === 'file' && ext !== '') {
        AvailabeName = `${name}_${i}.${ext}`
      }
      if (!_isInlList(AvailabeName, fileList, type)) {
        return AvailabeName
      }
    }
  } else {
    return AvailabeName
  }
}

function _isInlList(name: string, fileList: FileInfo[], type: 'file' | 'directory') {
  for (let i = 0; i < fileList.length; i++) {
    if (name === fileList[i].name && type === fileList[i].type) {
      return true
    }
  }
  return false
}


export default {
  getLocalData,
  deleteLocalData,
  getPxpContent,
  createDatasourceFile,
  getAvailableFileName,
  getAvailableFileNameNoExt,
  createDefaultDatasource,
  createARElementDatasource,
  createPoiSearchDatasource,
  getAvailableName,
}
