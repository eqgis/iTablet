import { SMap, EngineType } from 'imobile_for_reactnative'
import { ConstPath } from '../../../../constants'
import { FileTools, NativeMethod } from '../../../../native'

async function getLocalData(user, type) {
  let dataList = []
  switch (type) {
    case 'DATA':
    case 'MAP':
    case 'SCENE':
    case 'SYMBOL':
    case 'COLOR':
      dataList = await _getListByFilter(user, type)
      break
    case 'LABEL':
      dataList = await _getLabelDataList(user)
      break
    case 'TEMPLAE_PLOTTING':
      dataList = await _getPlotDataList(user)
      break
    case 'TEMPLAE_COLLECTING':
      dataList = await NativeMethod.getTemplates(
        user.userName,
        ConstPath.Module.Collection,
      )
      break
  }
  return dataList
}

async function _getListByFilter(user, type) {
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
        type: 'Directory',
      }
      break
    case 'SYMBOL':
      path = userPath + ConstPath.RelativePath.Symbol
      filter = {
        type: 'file',
      }
      break
    case 'COLOR':
      path = userPath + ConstPath.RelativePath.Color
      filter = {
        extension: 'scs',
        type: 'file',
      }
      break
  }
  const list = await FileTools.getPathListByFilter(path, filter)
  return list
}

async function _getLabelDataList(user) {
  const homePath = await FileTools.appendingHomeDirectory()
  const userPath = `${homePath + ConstPath.UserPath + user.userName}/`

  const path = `${userPath + ConstPath.RelativePath.Label}Label_${
    user.userName
  }#.udb`
  // const result = await FileTools.fileIsExist(path)
  // if (!result) {
  //   creatLabelDatasource(user, path)
  // }
  const list = await SMap.getUDBNameOfLabel(path)
  return list
}

async function _getPlotDataList(user) {
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

async function createDatasourceFile(user, datasourcePath) {
  const result = await SMap.createDatasourceFile({
    server: datasourcePath,
    engineType: EngineType.UDB,
    alias: `Label_${user.userName}#`,
    description: 'Label',
  })
  return result
}

export default {
  getLocalData,
  createDatasourceFile,
}
