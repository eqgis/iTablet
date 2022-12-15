import { ConstPath } from "@/constants"
import { LocalDataType } from "@/types"
import { AppUser } from "@/utils"
import { FileTools, FiltedData, SARMap, SData, SMap, SScene } from "imobile_for_reactnative"
import { ILocalData } from "./DataLocal"


/**
 * 导出数据，成功返回导出的路径，失败返回 undefind
 * @param inUse 是否使用中（主要是地图）
 */
async function exportLocalData(data: ILocalData, dataType: LocalDataType, inUse: boolean): Promise<string | undefined> {
  const homePath = await FileTools.getHomeDirectory()
  const externalPath = homePath + ConstPath.ExternalData

  let fileName = data.name
  const index = fileName.lastIndexOf('.')
  if(index > 0) {
    fileName = fileName.substring(0, index)
  }

  const availableName = await _getAvailableFileName(
    externalPath,
    fileName,
    'zip'
  )
  const targetPath = externalPath + '/' + availableName

  let result: boolean
  switch (dataType) {
    case 'DATA':
      result = await _exportDatasource(data, targetPath)
      break
    case 'MAP':
      result = await _exportMap(data, targetPath, inUse)
      break
    case 'SYMBOL':
      result = await _exportSymbol(data, targetPath)
      break
    case 'ARMAP':
      result = await _exportARMap(data, targetPath)
      break
    case 'WORKSPACE3D':
      result = await _exportWS3D(data, targetPath)
      break
    case 'ARMODEL':
      result = await _exportARModel(data, targetPath)
      break
    case 'AREFFECT':
      result = await _exportAREffect(data, targetPath)
      break
    case 'AIMODEL':
      result = await _exportAIModel(data, targetPath)
      break
    case 'SANDTABLE':
      result = await _exportSandTable(data, targetPath)
      break
    case 'COLOR':
    case 'LABEL':
    case 'MAPPING_COLLECTING':
    case 'SCENE':
    case 'TEMPLAE_COLLECTING':
    case 'TEMPLAE_PLOTTING':
      //TODO 添加这些类型的导出方法
      result = false;
      break
  }
  if(result) {
    return  ConstPath.ExternalData + '/' + availableName
  }
}


//************************* 数据导出 ******************************/

async function _exportDatasource(data: FiltedData, targetPath: string): Promise<boolean> {
  const homePath = await FileTools.getHomeDirectory()

  const udbPath = homePath + data.path
  const uddPath = udbPath.substring(0, udbPath.lastIndexOf('.')) + '.udd'
  const archivePaths = [udbPath, uddPath]

  const result = await FileTools.zipFiles(archivePaths, targetPath)
  return result
}

async function _exportMap(data: FiltedData, targetPath: string, inUse: boolean): Promise<boolean> {
   
  const homePath = await FileTools.getHomeDirectory()
  const tempPath = homePath + ConstPath.UserPath + AppUser.getCurrentUser().userName + '/' + ConstPath.RelativePath.Temp
  const mapName = data.name.substring(0, data.name.lastIndexOf('.'))
  const tempDir = tempPath + '/' + mapName
  const wsPath = tempDir + '/' + mapName + '.smwu'
  await FileTools.deleteFile(tempDir)

  let result = false
  //接口统一 add xiezhy
   
  result = await SData.exportWorkspaceByMap(mapName, wsPath,true)
  // if(inUse) {
  //   result = await SMap.exportWorkspace([mapName], wsPath, false, {exportMedia: true})
  // } else {
  //   result = await SMap.exportWorkspaceByMap(mapName, wsPath,{exportMedia: true})
  // }
  result = result && (await FileTools.zipFile(tempDir, targetPath))
  result && FileTools.deleteFile(tempDir)
  return result
}

async function _exportARMap(data: FiltedData, targetPath: string): Promise<boolean> {
  const homePath = await FileTools.getHomeDirectory()
  const tempPath = homePath + ConstPath.UserPath + AppUser.getCurrentUser().userName + '/' + ConstPath.RelativePath.Temp
  const mapName = data.name.substring(0, data.name.lastIndexOf('.'))
  const tempDir = tempPath + '/' + mapName
  await FileTools.deleteFile(tempDir)

  let result = false
  result = await SARMap.exportMap(data.name, tempDir)
  result = result && (await FileTools.zipFile(tempDir, targetPath))
  result && FileTools.deleteFile(tempDir)
  return result
}

async function _exportSymbol(data: FiltedData, targetPath: string): Promise<boolean> {
  const homePath = await FileTools.getHomeDirectory()
  const symbolPath = homePath + data.path
  return await FileTools.zipFiles([symbolPath], targetPath)
}

async function _getAvailableFileName (path: string, name: string, ext: string): Promise<string> {
  const result = await FileTools.fileIsExist(path)
  if (!result) {
    await FileTools.createDirectory(path)
  }
  let availableName = name + '.' + ext
  if (await FileTools.fileIsExist(path + '/' + availableName)) {
    for (let i = 1; ; i++) {
      availableName = name + '_' + i + '.' + ext
      if (!(await FileTools.fileIsExist(path + '/' + availableName))) {
        return availableName
      }
    }
  } else {
    return availableName
  }
}

async function _exportWS3D(data: FiltedData, targetPath: string): Promise<boolean> {
  const homePath = await FileTools.getHomeDirectory()
  const tempPath = homePath + ConstPath.UserPath + AppUser.getCurrentUser().userName + '/' + ConstPath.RelativePath.Temp
  const sceneName = data.name.substring(0, data.name.lastIndexOf('.'))
  const tempDir = tempPath + '/' + sceneName
  await FileTools.deleteFile(tempDir)

  // export3DScenceName 把整个目录拷到目标目录 再进行压缩
  let result = await SScene.export3DScenceName(sceneName, tempDir)
  result = result && await FileTools.zipFiles([tempDir], targetPath)
  result && await FileTools.deleteFile(tempDir)
  return result
}

async function _exportARModel(data: FiltedData, targetPath: string): Promise<boolean> {
  const homePath = await FileTools.getHomeDirectory()
  const symbolPath = homePath + data.path
  return await FileTools.zipFiles([symbolPath], targetPath)
}

async function _exportAREffect(data: FiltedData, targetPath: string): Promise<boolean> {
  const homePath = await FileTools.getHomeDirectory()
  const effctPath = homePath + data.path
  return await FileTools.zipFiles([effctPath], targetPath)
}

async function _exportAIModel(data: ILocalData, targetPath: string): Promise<boolean> {
  const homePath = await FileTools.getHomeDirectory()
  const path = homePath + data.path
  return await FileTools.zipFiles([path], targetPath)
}

async function _exportSandTable(data: ILocalData, targetPath: string): Promise<boolean> {
  const homePath = await FileTools.getHomeDirectory()
  const path = homePath + data.path
  return await FileTools.zipFiles([path], targetPath)
}

export default {
  exportLocalData
}