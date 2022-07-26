import { FileTools,RNFS } from 'imobile_for_reactnative'
import { ConstPath } from '../../constants'
// import RNFS, { downloadFile, DownloadFileOptions} from '../../../../native/RNFS'
import { OnlineServicesUtils } from '..'

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
  dir: 'AR3D/3Dpipe_EXAMPLE',
}

export const ARModelExample: ExampleData[] = [{
  userName: '927528',
  downloadName: 'SM@anim01.zip',
  dir: 'ARModal/SM@anim01',
}, {
  userName: '927528',
  downloadName: 'SM@anim02.zip',
  dir: 'ARModal/SM@anim02',
}, {
  userName: '927528',
  downloadName: 'flag.zip',
  dir: 'ARModal/flag',
}, {
  userName: '927528',
  downloadName: 'Airplane.zip',
  dir: 'ARModal/Airplane',
}, {
  userName: '927528',
  downloadName: 'terrain.zip',
  dir: 'ARModal/terrain',
}, {
  userName: '927528',
  downloadName: 'earth.zip',
  dir: 'ARModal/earth',
}, {
  userName: '927528',
  downloadName: 'snowtree.zip',
  dir: 'ARModal/snowtree',
}]

export const AREffectExample: ExampleData = {
  userName: '927528',
  downloadName: 'SpringFlower.mp4',
  toName: 'SpringFlower.areffect',
  dir: 'AREffect/SpringFlower',
}

export const AREffectExample2: ExampleData = {
  userName: '927528',
  downloadName: 'CloudLightening.mp4',
  toName: 'CloudLightening.areffect',
  dir: 'AREffect/CloudLightening',
}

export const AREffectExample3: ExampleData = {
  userName: '927528',
  downloadName: 'AutumnLeave.mp4',
  toName: 'AutumnLeave.areffect',
  dir: 'AREffect/AutumnLeave',
}

export const AREffectExample4: ExampleData = {
  userName: '927528',
  downloadName: 'Snow.mp4',
  toName: 'Snow.areffect',
  dir: 'AREffect/Snow',
}

async function downloadExampleData(exampleData: ExampleData, onProgress: (progress: number) => void): Promise<boolean> {
  const option = await getDataDownloadOption(exampleData)
  if(option) {
    option.progress = res => {
      onProgress(res.progress)
    }
    const { promise } = RNFS.downloadFile(option)

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

async function getDataDownloadOption(data: ExampleData): Promise<RNFS.DownloadFileOptions & { id: number, fileName: string } | undefined> {
  const homePath = await FileTools.getHomeDirectory()
  const commonPath = ConstPath.Common

  const onlineService = new OnlineServicesUtils('online')
  const result = await onlineService.getPublicDataByName(data.userName, data.downloadName)
  // const dir = _isZipData(data) ? '' : (data.dir + '/')
  const downloadPath = homePath + commonPath + data.dir + (data.dir.endsWith('/') ? '' : '/')
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