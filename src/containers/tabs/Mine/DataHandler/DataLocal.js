import { SMap, EngineType } from 'imobile_for_reactnative'
import { ConstPath } from '../../../../constants'
import { FileTools, NativeMethod } from '../../../../native'
import { dataUtil } from '../../../../utils'

async function getLocalData(user, type) {
  let dataList = []
  switch (type) {
    case 'DATA':
    case 'MAP':
    case 'SCENE':
    case 'SYMBOL':
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
      dataList = await NativeMethod.getTemplates(
        user.userName,
        ConstPath.Module.Collection,
      )
      break
    case 'AIMODEL':
      dataList = await _getAIModelDataList(user)
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

async function _getColorSchemeDataList(user) {
  let dataList = await _getListByFilter(user, 'COLOR')
  for (let i = 0; i < dataList.length; i++) {
    await _getColorFromFile(dataList[i])
  }
  return dataList
}

async function _getColorFromFile(item) {
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

async function _getAIModelDataList(user) {
  let list = []
  const homePath = await FileTools.appendingHomeDirectory()
  let dataList = await _getListByFilter(user, 'AIMODEL')
  for (let n = 0; n < dataList.length; n++) {
    let item = dataList[n]
    let contentList = await FileTools.getDirectoryContent(homePath + item.path)
    let tflite
    let labels = []
    for (let i = 0; i < contentList.length; i++) {
      if (contentList[i].type === 'file') {
        let index = contentList[i].name.lastIndexOf('.')
        if (index > 0) {
          let type = contentList[i].name.substring(index + 1).toLowerCase()
          if (type === 'tflite') {
            tflite = contentList[i].name
          } else if (type === 'txt') {
            labels.push(contentList[i].name)
          }
        }
      }
    }
    if (tflite && labels.length > 0) {
      item.tflite = tflite
      item.labels = labels
      list.push(item)
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
