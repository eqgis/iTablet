import { SMap, EngineType, SScene, SARMap, AppInfo } from 'imobile_for_reactnative'
import { FileTools } from '../../../../native'
import { ConstPath } from '../../../../constants'

async function importExternalData(user, item) {
  let type = item.fileType
  let result = false
  switch (type) {
    case 'plotting':
      result = await importPlotLib(item)
      break
    case 'workspace':
      result = await importWorkspace(item)
      result = result ? result.length > 0 : false
      break
    case 'workspace3d':
      result = await importWorkspace3D(user, item)
      break
    case 'datasource':
      result = await importDatasource(user, item)
      break
    case 'sci':
      result = await importSCI(user, item)
      break
    case 'color':
      result = await importColor(user, item)
      break
    case 'symbol':
      result = await importSymbol(user, item)
      break
    case 'aimodel':
      result = await importAIModel(user, item)
      break
    case 'xmltemplate':
      result = await importXmlTemplate(user,item)
      break
    case 'armap':
      result = await importARMap(item)
      break
    case 'armodel':
      result = await importARModel(user, item)
      break
    case 'areffect':
      result = await importAREffect(user, item)
      break
    default:
      break
  }
  return result
}

async function importDataset(
  type,
  filePath,
  datasourceItem,
  importParams = {},
) {
  let params = {}
  let name = filePath.substr(filePath.lastIndexOf('/') + 1)
  name = name.split('.')[0]
  switch (type) {
    case 'kml':
    case 'kmz':
      params = {
        datasetName: name,
        importAsCAD: true,
      }
      break
    case 'dwg':
    case 'dxf':
      params = {
        inverseBlackWhite: false,
        importAsCAD: true,
      }
      break
    case 'gpx':
      params = {
        datasetName: name,
      }
      break
    case 'tif':
    case 'shp':
    case 'mif':
    case 'img':
    default:
      break
  }
  importParams = Object.assign(params, importParams)
  return await _importDataset(type, filePath, datasourceItem, importParams)
}

async function importXmlTemplate(user,item) {
  const userPath = await FileTools.appendingHomeDirectory(
    `${ConstPath.UserPath + user.userName}/${ConstPath.RelativePath.Attribute}`,
  )
  return await _copyFile(item, userPath)
}

async function importPlotLib(item) {
  try {
    return await SMap.importPlotLibData(item.filePath)
  } catch (error) {
    return false
  }
}

async function importWorkspace(item) {
  try {
    const { filePath } = item
    const type = _getWorkspaceType(filePath)
    const data = {
      server: filePath,
      type,
    }
    let result = await SMap.importWorkspaceInfo(data)
    return result
  } catch (error) {
    return false
  }
}

/**
 * 1.遍历scenes，获取可用的文件夹名
 * 2.生成对应的pxp
 * 3.复制工作空间和相关文件
 */
async function importWorkspace3D(user, item) {
  try {
    return await SScene.import3DWorkspace({server:item.filePath})
  } catch (error) {
    return false
  }
}

/**
 * 1.遍历scenes，获取可用的文件夹名
 * 2.生成对应的pxp
 * 3.复制工作空间和相关文件
 * 4.此接口用来过滤AR三维数据
 */
async function importWorkspace3DAR(user, item) {
  try {
    const userPath = await FileTools.appendingHomeDirectory(
      `${ConstPath.UserPath + user.userName}/Data/Scene`,
    )

    const contentList = await FileTools.getDirectoryContent(userPath)

    const workspaceName = item.fileName.substring(
      0,
      item.fileName.lastIndexOf('.'),
    )
    const workspaceFolder = _getAvailableName(
      workspaceName,
      contentList,
      'directory',
    )
    const workspaceInfo = {
      type: `${_getWorkspaceType(item.fileName)}`,
      server: `${workspaceFolder}/${item.fileName}`,
    }

    for (let i = 0; i < item.wsInfo.scenes.length; i++) {
      const scene = item.wsInfo.scenes[i]
      const pxp = _getAvailableName(scene, contentList, 'file', 'pxp')
      const pxpInfo = {
        Name: scene,
        Workspace: workspaceInfo,
        Type: 0,
      }
      await FileTools.writeFile(`${userPath}/${pxp}`, JSON.stringify(pxpInfo))

      const absoluteWorkspacePath = `${userPath}/${workspaceFolder}`
      await FileTools.createDirectory(absoluteWorkspacePath)
      await FileTools.copyFile(
        item.filePath,
        `${absoluteWorkspacePath}/${item.fileName}`,
      )

      for (let i = 0; i < item.relatedFiles.length; i++) {
        const filePath = item.relatedFiles[i]
        const fileName = filePath.substring(filePath.lastIndexOf('/') + 1)
        await FileTools.copyFile(
          filePath,
          `${absoluteWorkspacePath}/${fileName}`,
        )
      }
    }
    return true
  } catch (error) {
    return false
  }
}

async function importARMap(item) {
  return await SARMap.importMap(item.filePath)
}

async function importARModel(user, item) {
  const homePath = await FileTools.getHomeDirectory()
  const targetPath = homePath + ConstPath.UserPath + user.userName + '/' + ConstPath.RelativePath.ARModel
  return await _copyFile(item, targetPath)
}

async function importAREffect(user, item) {
  const homePath = await FileTools.getHomeDirectory()
  const targetPath = homePath + ConstPath.UserPath + user.userName + '/' + ConstPath.RelativePath.AREffect
  return await _copyFile(item, targetPath)
}

async function importDatasource(user, item) {
  try {
    const userPath = await FileTools.appendingHomeDirectory(
      `${ConstPath.UserPath + user.userName}/Data/Datasource`,
    )

    const contentList = await FileTools.getDirectoryContent(userPath)

    const sourceUdb = item.filePath
    const sourceUdd = `${item.filePath.substring(
      0,
      item.filePath.lastIndexOf('.'),
    )}.udd`
    const mediaPath = `${item.directory}/Media`

    const datasourceName = item.fileName.substring(
      0,
      item.fileName.lastIndexOf('.'),
    )
    const udbName = _getAvailableName(
      datasourceName,
      contentList,
      'file',
      'udb',
    )
    const uddName = _getAvailableName(
      datasourceName,
      contentList,
      'file',
      'udd',
    )

    await FileTools.copyFile(sourceUdb, `${userPath}/${udbName}`)
    await FileTools.copyFile(sourceUdd, `${userPath}/${uddName}`)
    if (await FileTools.fileIsExist(mediaPath)) {
      const targetMediaPath = await FileTools.appendingHomeDirectory(
        `${ConstPath.UserPath + user.userName}/Data/Media`,
      )
      const descriptionPath = `${mediaPath}/description.json`
      if (await FileTools.fileIsExist(descriptionPath)) {
        const descriptionStr = await FileTools.readFile(descriptionPath)
        const description = JSON.parse(descriptionStr)
        const keys = Object.keys(description)
        for (const key of keys) {
          const path = description[key]
          //加上用户信息 add xiezhy
          //path = [NSString stringWithFormats:@"%@/User/%@/Data%@",[AppInfo getRootPath],[AppInfo getUserName], path];
          path = await AppInfo.getRootPath() + '/User/' + await AppInfo.getUserName() + '/Data' + path
          const fromMediaPath = mediaPath + '/' + path.substring(path.lastIndexOf('/') + 1)
          const toMediaPath = await FileTools.appendingHomeDirectory(path)
          await FileTools.copyFile(fromMediaPath, toMediaPath)
        }
      } else {
        await FileTools.copydir(mediaPath, targetMediaPath)
      }
    }
    return true
  } catch (error) {
    return false
  }
}

async function importSCI(user, item) {
  try {
    const userPath = await FileTools.appendingHomeDirectory(
      `${ConstPath.UserPath + user.userName}/Data/Datasource`,
    )

    let index = item.directory.lastIndexOf('/')
    let datasourceName = item.directory.substring(
      index + 1,
      item.directory.length,
    )
    datasourceName = datasourceName + '.sci'
    //sci文件多有可能不完整，所以直接覆盖吧
    // const contentList = await FileTools.getDirectoryContent(userPath)
    // for (let i = 0; i < contentList.length; i++) {
    //   if (datasourceName === contentList[i].name && 'directory' === contentList[i].type) {
    //     datasourceName = datasourceName+'#'
    //     break
    //   }
    // }

    // debugger
    await FileTools.copydir(item.directory, `${userPath}/${datasourceName}`)
    // debugger
    return true
  } catch (e) {
    return false
    // console.warn(e)
  }

  // await FileTools.copyFile(sourceUdd, `${userPath}/${uddName}`)
}

async function importColor(user, item) {
  const userPath = await FileTools.appendingHomeDirectory(
    `${ConstPath.UserPath + user.userName}/Data/Color`,
  )

  return await _copyFile(item, userPath)
}

async function importSymbol(user, item) {
  const userPath = await FileTools.appendingHomeDirectory(
    `${ConstPath.UserPath + user.userName}/Data/Symbol`,
  )

  return await _copyFile(item, userPath)
}

async function importAIModel(user, item) {
  const userPath = await FileTools.appendingHomeDirectory(
    `${ConstPath.UserPath + user.userName}/Data/AIModel`,
  )
  const contentList = await FileTools.getDirectoryContent(userPath)
  let name = item.fileName.substring(0, item.fileName.lastIndexOf('.'))
  name = _getAvailableName(name, contentList, 'directory')
  await FileTools.createDirectory(`${userPath}/${name}`)
  return await _copyFile(item, `${userPath}/${name}`)
}

// async function importTIF(filePath, datasourceItem) {
//   return await _importDataset('tif', filePath, datasourceItem)
// }

// async function importSHP(filePath, datasourceItem) {
//   return await _importDataset('shp', filePath, datasourceItem)
// }

// async function importMIF(filePath, datasourceItem) {
//   return await _importDataset('mif', filePath, datasourceItem)
// }

// async function importKML(filePath, datasourceItem) {
//   let name = filePath.substr(filePath.lastIndexOf('/') + 1)
//   name = name.split('.')[0]
//   return await _importDataset('kml', filePath, datasourceItem, {
//     datasetName: name,
//     importAsCAD: true,
//   })
// }

// async function importKMZ(filePath, datasourceItem) {
//   let name = filePath.substr(filePath.lastIndexOf('/') + 1)
//   name = name.split('.')[0]
//   return await _importDataset('kmz', filePath, datasourceItem, {
//     datasetName: name,
//     importAsCAD: true,
//   })
// }

// async function importDWG(filePath, datasourceItem) {
//   return await _importDataset('dwg', filePath, datasourceItem, {
//     inverseBlackWhite: false,
//     importAsCAD: true,
//   })
// }

// async function importDXF(filePath, datasourceItem) {
//   return await _importDataset('dxf', filePath, datasourceItem, {
//     inverseBlackWhite: false,
//     importAsCAD: true,
//   })
// }

// async function importGPX(filePath, datasourceItem) {
//   let name = filePath.substr(filePath.lastIndexOf('/') + 1)
//   name = name.split('.')[0]
//   return await _importDataset('gpx', filePath, datasourceItem, {
//     datasetName: name,
//   })
// }

// async function importIMG(filePath, datasourceItem) {
//   return await _importDataset('img', filePath, datasourceItem)
// }

async function _importDataset(
  type,
  filePath,
  datasourceItem,
  importParams = {},
) {
  try {
    const homePath = await FileTools.appendingHomeDirectory()
    let alias = datasourceItem.name
    const index = alias.lastIndexOf('.')
    if (index > 0) {
      alias = alias.substring(0, index)
    }
    const result = await SMap.importDataset(
      type,
      filePath,
      {
        server: homePath + datasourceItem.path,
        alias,
        engineType: EngineType.UDB,
      },
      importParams,
    )
    SMap.closeDatasource(alias)
    return result
  } catch (error) {
    return false
  }
}

async function _copyFile(item, desDir) {
  try {
    const fileName = item.fileName.substring(0, item.fileName.lastIndexOf('.'))
    const fileType = item.fileName.substring(item.fileName.lastIndexOf('.') + 1)
    const contentList = await FileTools.getDirectoryContent(desDir)
    const name = _getAvailableName(fileName, contentList, 'file', fileType)
    await FileTools.copyFile(item.filePath, `${desDir}/${name}`)
    if (item.relatedFiles) {
      for (let i = 0; i < item.relatedFiles.length; i++) {
        let relatedFileName = item.relatedFiles[i].substring(
          item.relatedFiles[i].lastIndexOf('/') + 1,
        )
        let itemName = relatedFileName.substring(
          0,
          relatedFileName.lastIndexOf('.'),
        )
        let itemType = relatedFileName.substring(
          relatedFileName.lastIndexOf('.') + 1,
        )
        let sname = _getAvailableName(itemName, contentList, 'file', itemType)
        await FileTools.copyFile(item.relatedFiles[i], `${desDir}/${sname}`)
      }
    }
    return true
  } catch (error) {
    return false
  }
}

function _getAvailableName(name, fileList, type, ext = '') {
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

function _isInlList(name, fileList, type) {
  for (let i = 0; i < fileList.length; i++) {
    if (name === fileList[i].name && type === fileList[i].type) {
      return true
    }
  }
  return false
}

function _getWorkspaceType(path) {
  const index = path.lastIndexOf('.')
  let type
  if (index < 1) {
    return 1
  }
  type = path.substr(index + 1)

  type = type.toUpperCase()
  let value
  switch (type) {
    case 'SMWU':
      value = 9
      break
    case 'SXWU':
      value = 8
      break
    case 'SMW':
      value = 5
      break
    case 'SXW':
      value = 4
      break
    case 'UDB':
      value = 219
      break
    default:
      value = 1
      break
  }
  return value
}

export default {
  importExternalData,
  importDataset,

  importPlotLib,
  importWorkspace,
  importWorkspace3D,
  importDatasource,
  importSCI,
  importColor,
  importSymbol,
  importWorkspace3DAR,
  // importTIF,
  // importSHP,
  // importMIF,
  // importKML,
  // importKMZ,
  // importDWG,
  // importDXF,
  // importGPX,
  // importIMG,
}
