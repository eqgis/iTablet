import { FileTools } from 'imobile_for_reactnative'
import RNFS, { downloadFile, DownloadFileOptions} from 'react-native-fs'
import { ConstPath } from '../../../../constants'
import { OnlineServicesUtils } from '../../../../utils'

export interface ExampleData {
  /** 数据所在账户名 */
  userName: string,
  /** 数据在online上的名称 */
  downloadName: string,
  /** 下载时重命名 */
  toName?: string,
  /** zip文件解压后的文件夹/普通文件下载文件夹 */
  dir: string,
}

export const AR3DExample: ExampleData = {
  userName: '927528',
  downloadName: '3Dpipe_EXAMPLE.zip',
  dir: '3Dpipe_EXAMPLE',
}

export const ARModelExample: ExampleData[] = [{
  userName: '927528',
  downloadName: 'ARModel_EXAMPLE.zip',
  dir: 'ARModel',
}, {
  userName: '927528',
  downloadName: 'ARModel_EXAMPLE2.zip',
  dir: 'ARModel_EXAMPLE2',
}, {
  userName: '927528',
  downloadName: 'ARModel_EXAMPLE3.zip',
  dir: 'ARModel_EXAMPLE3',
}, {
  userName: '927528',
  downloadName: 'ARModel_EXAMPLE4.zip',
  dir: 'ARModel_EXAMPLE4',
}]

export const AREffectExample: ExampleData = {
  userName: '927528',
  downloadName: 'SpringFlower.mp4',
  toName: 'SpringFlower.areffect',
  dir: 'SpringFlower',
}

export const AREffectExample2: ExampleData = {
  userName: '927528',
  downloadName: 'CloudLightening.mp4',
  toName: 'CloudLightening.areffect',
  dir: 'CloudLightening',
}

export const AREffectExample3: ExampleData = {
  userName: '927528',
  downloadName: 'AutumnLeave.mp4',
  toName: 'AutumnLeave.areffect',
  dir: 'AutumnLeave',
}

export const AREffectExample4: ExampleData = {
  userName: '927528',
  downloadName: 'Snow.mp4',
  toName: 'Snow.areffect',
  dir: 'Snow',
}

async function downloadExampleData(exampleData: ExampleData, onProgress: (progress: number) => void): Promise<boolean> {
  const option = await getDataDownloadOption(exampleData)
  if(option) {
    option.progress = res => {
      onProgress(res.progress)
    }
    const { promise } = downloadFile(option)

    const toFile = option.toFile
    return promise.then(async () => {
      if(await RNFS.exists(toFile)) {
        if(_isZipData(exampleData)) {
          const result = await FileTools.unZipFile(toFile, toFile.substring(0, toFile.lastIndexOf('/')))
          result && FileTools.deleteFile(toFile)
          return result
        }
        return true
      }
      return false
    })
  } else {
    return false
  }
}

async function getDataDownloadOption(data: ExampleData): Promise<DownloadFileOptions & { id: number, fileName: string } | undefined> {
  const homePath = await FileTools.getHomeDirectory()
  const commonPath = ConstPath.Common

  const onlineService = new OnlineServicesUtils('online')
  const result = await onlineService.getPublicDataByName(data.userName, data.downloadName)
  const dir = _isZipData(data) ? '' : (data.dir + '/')
  const downloadPath = homePath + commonPath + dir
  if(!await RNFS.exists(downloadPath)) {
    await RNFS.mkdir(downloadPath)
  }
  if(result) {
    return {
      id: result.id,
      fileName: result.fileName,
      fromUrl: 'https://www.supermapol.com/web/datas/' + result.id + '/download',
      toFile: downloadPath + (data.toName ? data.toName : data.downloadName),
    }
  }
}

function _isZipData(data: ExampleData): boolean {
  const name = data.toName ? data.toName : data.downloadName
  return name.substring(name.lastIndexOf('.')).toLowerCase() === '.zip'
}


export default {
  downloadExampleData,
  getDataDownloadOption,
}