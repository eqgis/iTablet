import { SData,SMap, EngineType, SScene, SARMap, AppInfo, FileInfo } from 'imobile_for_reactnative'
import { FileTools } from '../../native'
import { ConstPath } from '../../constants'
import { ExternalDatasetType, UserInfo } from '@/types'
import { IExternalData } from './DataExternal'
import { AppUser } from '@/utils'

async function importExternalData(user: UserInfo, item: IExternalData): Promise<boolean> {
  let type = item.fileType
  let result: boolean
  switch (type) {
    case 'tif':
    case 'shp':
    case 'mif':
    case 'kml':
    case 'kmz':
    case 'dwg':
    case 'dxf':
    case 'gpx':
    case 'img':
      //数据集导入调用 importDataset
      result = false
      break
    case 'online': 
      result = false
      break
    case 'plotting':
      result = await importPlotLib(item)
      break
    case 'workspace': {
      const importResult = await importWorkspace(item)
      result = importResult === false ? false : importResult.length > 0
    }
      break
    case 'workspace3d':
      result = await importWorkspace3D(item)
      break
    case 'datasource':
      result = await importDatasource(item)
      break
    case 'sci':
      result = await importSCI(item)
      break
    case 'color':
      result = await importColor(item)
      break
    case 'symbol':
      result = await importSymbol(item)
      break
    case 'aimodel':
      result = await importAIModel(item)
      break
    case 'xml_template':
      result = await importXmlTemplate(item)
      break
    case 'armap':
      result = await importARMap(item)
      break
    case 'armodel':
      result = await importARModel(item)
      break
    case 'areffect':
      result = await importAREffect(item)
      break
    case 'sandtable':
      result = await importSandTable(item)
  }
  return result
}

async function importDataset(
  type: ExternalDatasetType,
  filePath: string,
  datasourceItem: any,
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

async function importXmlTemplate(item: IExternalData) {
  const userPath = await FileTools.appendingHomeDirectory(
    ConstPath.ExternalData + '/XmlTemplate/',
  )
  return await _copyFile(item, userPath)
}

async function importPlotLib(item: IExternalData) {
  try {
    return await SMap.importPlotLibData(item.filePath)
  } catch (error) {
    return false
  }
}

async function importWorkspace(item: IExternalData) {
  try {
    const { filePath } = item
    const type = _getWorkspaceType(filePath)
    const data = {
      server: filePath,
      type,
    }
    let result = await SData.importWorkspace(data)
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
async function importWorkspace3D(item: IExternalData) {
  try {
    return await SScene.import3DWorkspace({server:item.filePath})
  } catch (error) {
    return false
  }
}

async function importARMap(item: IExternalData) {
  return await SARMap.importMap(item.filePath)
}

async function importARModel(item: IExternalData) {
  const homePath = await FileTools.getHomeDirectory()

  const targetPath = homePath + ConstPath.UserPath + AppUser.getCurrentUser().userName + '/' + ConstPath.RelativePath.ARModel
  return await _copyFile(item, targetPath)
}

async function importAREffect(item: IExternalData) {
  const homePath = await FileTools.getHomeDirectory()
  const targetPath = homePath + ConstPath.UserPath + AppUser.getCurrentUser().userName + '/' + ConstPath.RelativePath.AREffect
  return await _copyFile(item, targetPath)
}

async function importDatasource(item: IExternalData) {
  try {
    const userPath = await FileTools.appendingHomeDirectory(
      `${ConstPath.UserPath + AppUser.getCurrentUser().userName}/Data/Datasource`,
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
        `${ConstPath.UserPath + AppUser.getCurrentUser().userName}/Data/Media`,
      )
      const descriptionPath = `${mediaPath}/description.json`
      if (await FileTools.fileIsExist(descriptionPath)) {
        const descriptionStr = await FileTools.readFile(descriptionPath)
        const description = JSON.parse(descriptionStr)
        const keys = Object.keys(description)
        for (const key of keys) {
          let path = description[key]
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

async function importSCI(item: IExternalData) {
  try {
    const userPath = await FileTools.appendingHomeDirectory(
      `${ConstPath.UserPath + AppUser.getCurrentUser().userName}/Data/Datasource`,
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

    //  
    await FileTools.copydir(item.directory, `${userPath}/${datasourceName}`)
    //  
    return true
  } catch (e) {
    return false
    // console.warn(e)
  }

  // await FileTools.copyFile(sourceUdd, `${userPath}/${uddName}`)
}

async function importColor(item: IExternalData) {
  const userPath = await FileTools.appendingHomeDirectory(
    `${ConstPath.UserPath + AppUser.getCurrentUser().userName}/Data/Color`,
  )

  return await _copyFile(item, userPath)
}

async function importSymbol(item: IExternalData) {
  const userPath = await FileTools.appendingHomeDirectory(
    `${ConstPath.UserPath + AppUser.getCurrentUser().userName}/Data/Symbol`,
  )

  return await _copyFile(item, userPath)
}

async function importAIModel(item: IExternalData) {
  const userPath = await FileTools.appendingHomeDirectory(
    `${ConstPath.UserPath + AppUser.getCurrentUser().userName}/Data/AIModel`,
  )
  const contentList = await FileTools.getDirectoryContent(userPath)
  let name = item.fileName.substring(0, item.fileName.lastIndexOf('.'))
  name = _getAvailableName(name, contentList, 'directory')
  await FileTools.createDirectory(`${userPath}/${name}`)
  return await _copyFile(item, `${userPath}/${name}`)
}

async function importSandTable(item: IExternalData): Promise<boolean> {
  const homePath = await FileTools.getHomeDirectory()
  const targetPath = homePath +
    `${ConstPath.UserPath + AppUser.getCurrentUser().userName}/${ConstPath.RelativePath.ARSandTable}`

  const contentList = await FileTools.getDirectoryContent(targetPath)
  let name = item.fileName.substring(0, item.fileName.lastIndexOf('.'))
  name = _getAvailableName(name, contentList, 'directory')
  await FileTools.createDirectory(`${targetPath}/${name}`)
  return await _copyFile(item, `${targetPath}/${name}`)
}

async function _importDataset(
  type: ExternalDatasetType,
  filePath: string,
  datasourceItem: any,
  importParams = {},
) {
  try {
    const homePath = await FileTools.appendingHomeDirectory()
    let alias = datasourceItem.name
    const index = alias.lastIndexOf('.')
    if (index > 0) {
      alias = alias.substring(0, index)
    }

    //todo xiezhy 需要确认参数类型
    const result = await SData.importDataset(
      type,
      filePath,
      {
        server: homePath + datasourceItem.path,
        alias,
        engineType: EngineType.UDB,
      },
    )
    SData.closeDatasource(alias)
    return result
  } catch (error) {
    return false
  }
}

async function _copyFile(item: IExternalData, desDir: string): Promise<boolean> {
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

function _getAvailableName(name: string, fileList: FileInfo[], type: 'file' | 'directory', ext = '')  {
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

function _getWorkspaceType(path: string) {
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

  importWorkspace,
  importWorkspace3D,
  importColor,
  importSymbol,
}
