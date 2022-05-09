import { FileTools, SMap, SARMap } from 'imobile_for_reactnative'
import { ConstPath } from '../../../../constants'

/** 数据源名称 */
let rawDatasource = 'ARMAP_DEFAULT'

/** 是否将此数据源添加到 AR 地图 */
let isAdded = false

/** 此数据源是否保存到 AR 地图 */
let isSaved = false

/**
 * 地图保存前记录此数据源，保存后清除
 *
 * 若在保存前退出，则删除此数据源文件
 */
function setARRawDatasource(datasource: string): void {
  isAdded = true
  rawDatasource = datasource
  // AppLog.log('创建数据 ' + rawDatasource)
}

function saveARRawDatasource(): void {
  isSaved = true
  // AppLog.log('保存数据 ' + rawDatasource)
}

function getARRawDatasource(): string {
  return rawDatasource
}

async function closeARRawDatasource() {
  if(isAdded && !isSaved) {
    await SMap.closeDatasource(rawDatasource)
    const homePath = await FileTools.getHomeDirectory()
    const datasourcePath = homePath + ConstPath.UserPath + global.currentUser.userName + '/' + ConstPath.RelativePath.ARDatasource
    const udbPath = datasourcePath + '/' + rawDatasource + '.udb'
    const uddPath = datasourcePath + '/' + rawDatasource + '.udd'
    await FileTools.deleteFile(udbPath)
    await FileTools.deleteFile(uddPath)

    // AppLog.log('删除数据 ' + rawDatasource)
  } else {
    // AppLog.log('不删除数据 ' + rawDatasource)
  }
  rawDatasource = 'ARMAP_DEFAULT'
  isAdded = false
  isSaved = false
}

async function exportARMap(fileName: string, targetPath: string): Promise<boolean> {
  const homePath = await FileTools.getHomeDirectory()
  const tempPath = homePath + ConstPath.UserPath + global.currentUser.userName + '/' + ConstPath.RelativePath.Temp
  const mapName = fileName.substring(0, fileName.lastIndexOf('.'))
  const tempDir = tempPath + mapName
  await FileTools.deleteFile(tempDir)

  let result = false
  result = await SARMap.exportMap(fileName, tempDir)
  result = result && (await FileTools.zipFile(tempDir, targetPath))
  result && FileTools.deleteFile(tempDir)
  return result
}

export default {
  setARRawDatasource,
  saveARRawDatasource,
  getARRawDatasource,
  closeARRawDatasource,
  exportARMap,
}