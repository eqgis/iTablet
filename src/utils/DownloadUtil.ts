/**
 * 临时保存不需要可持续化的下载的数据和进度
 * 若保存在redux,会影响整体界面更新
 */
import { SMediaCollector } from 'imobile_for_reactnative'

const mediaDownloads: SMediaCollector.DownloadingData[] = []

function getDownloadMediaIndex(downloadData: {url: string, toPath: string}): number {
  try {
    for (let index in mediaDownloads) {
      let media = mediaDownloads[index]
      if (
        media.data.url === downloadData.url &&
        media.data.toPath.replace(/\/\//g, '/') === downloadData.toPath.replace(/\/\//g, '/')
        //  &&
        // media.data.geoID === downloadData.data.geoID &&
        // media.data.layerName === downloadData.data.layerName
      ) {
        return parseInt(index)
      }
    }
    return -1
  } catch (error) {
    return -1
  }
}

/**
 * 添加/更新下载的多媒体数据和进度
 * @param data 下载的多媒体数据
 */
function downloadMedia(downloadData: SMediaCollector.DownloadingData) {
  const index = getDownloadMediaIndex({
    url: downloadData.data.url,
    toPath: downloadData.data.toPath,
  })
  if (index < 0) { // 添加下载任务
    mediaDownloads.push(downloadData)
  } else {
    if (mediaDownloads[index].progress < downloadData.progress) { // 更新进度
      Object.assign(mediaDownloads[index], downloadData)
    }
  }
}

/**
 * 删除下载的多媒体数据和进度
 * @param data 下载的多媒体数据
 */
function deleteDownloadMedia(downloadData: SMediaCollector.DownloadingData): SMediaCollector.DownloadingData | undefined {
  try {
    for (let index in mediaDownloads) {
      let media = mediaDownloads[index]
      if (
        media.data.url === downloadData.data.url &&
        media.data.toPath === downloadData.data.toPath &&
        media.data.geoID === downloadData.data.geoID &&
        media.data.layerName === downloadData.data.layerName
      ) {
        mediaDownloads.splice(parseInt(index), 1)
        return media
      }
    }
    return undefined
  } catch (error) {
    return undefined
  }
}

function getDownloadMedia(downloadData: {url: string, toPath: string}): SMediaCollector.DownloadingData | undefined {
  try {
    const index = getDownloadMediaIndex(downloadData)
    if (index >= 0) {
      return mediaDownloads[index]
    }
    return undefined
  } catch (error) {
    return undefined
  }
}

export default {
  downloadMedia,
  deleteDownloadMedia,
  getDownloadMedia,
}