import { FileTools } from "imobile_for_reactnative"


/**
 * 获取指定路径下可用地图名
 * @param path
 * @param name
 * @returns {Promise}
 */
async function getAvailableMapName(path: string, name: string): Promise<string> {
  const maps = await FileTools.getPathListByFilter(path, {
    name,
    extension: 'xml',
    type: 'file',
  })
  let _name = name
  const mapNames = []
  for (const map of maps) {
    mapNames.push(map.name.replace('.xml', ''))
  }

  const baseName = name
  let mapIndex = 0

  while (mapNames.indexOf(_name) >= 0) {
    _name = baseName + '_' + (++mapIndex)
  }

  return _name
}

/**
 * 深度遍历fileDir目录下的fileType数据,并添加到arrFilterFile中
 * fileDir 文件目录
 * fileType 文件类型 {smwu:'smwu',sxwu:'sxwu',sxw:'sxw',smw:'smw',udb:'udb'}
 * arrFilterFile 添加到arrFilterFile数组中保存
 * */
async function getFilterFiles(
  fileDir: string,
  fileType: any,
  arrFilterFile: any,
) {
  if (arrFilterFile === undefined) {
    arrFilterFile = []
  }
  try {
    if (typeof fileDir !== 'string') {
      return []
    }
    if (fileType === undefined) {
      fileType = {
        smwu: 'smwu',
        sxwu: 'sxwu',
        sxw: 'sxw',
        smw: 'smw',
      }
    }
    let isRecordFile = false
    const arrDirContent = await FileTools.getDirectoryContent(fileDir)
    for (let i = 0; i < arrDirContent.length; i++) {
      const fileContent = arrDirContent[i]
      const isFile = fileContent.type
      let fileName = fileContent.name
      const newPath = fileDir + '/' + fileName
      if (isFile === 'file' && !isRecordFile) {
        if (
          (fileType.smwu && fileName.indexOf(fileType.smwu) !== -1) ||
          (fileType.sxwu && fileName.indexOf(fileType.sxwu) !== -1) ||
          (fileType.sxw && fileName.indexOf(fileType.sxw) !== -1) ||
          (fileType.smw && fileName.indexOf(fileType.smw) !== -1) ||
          (fileType.udb && fileName.indexOf(fileType.udb) !== -1)
        ) {
          if (
            !(
              fileName.indexOf('~[') !== -1 &&
              fileName.indexOf(']') !== -1 &&
              fileName.indexOf('@') !== -1
            ) && !(
              newPath.indexOf('~[') !== -1 &&
              newPath.indexOf(']') !== -1 &&
              newPath.indexOf('@') !== -1
            )
          ) {
            fileName = fileName.substring(0, fileName.length - 5)
            arrFilterFile.push({
              filePath: newPath,
              fileName: fileName,
              directory: fileDir,
            })
            isRecordFile = true
          }
        }
      } else if (isFile === 'directory') {
        await getFilterFiles(newPath, fileType, arrFilterFile)
      }
    }
  } catch (e) {
    // Toast.show('没有数据')
  }
  return arrFilterFile
}

/**
 * 获取文件可用名字
 */
async function getAvailableFileName(path: string, name: string, ext: string) {
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




export default {
  ...FileTools,
  getFilterFiles,
  getAvailableMapName,
  getAvailableFileName,
}
