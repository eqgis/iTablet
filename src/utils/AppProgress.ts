/**
 * 管理下载，导入等进度
 * 通过唯一的 key 来区分任务
 */
import Toast from "./Toast"


const _progressList: Array<{key: string, progress: number, downloaded: boolean}> = []
const _progressListeners: Array<{key: string, onProgress(progers: number): void, onEnd(): void}> = []

// ******************** 添加并更新任务进度 ********************

function addProgress(key: string) {
  if(_progressList.some(item => item.key === key)) {
    Toast.show('id or key is dupiliacateed')
  } else {
    _progressList.push({key, progress: 0, downloaded: false})
  }
}

function updateProgress(key: string, progress: number) {
  const job = _progressList.find(item => item.key === key)
  if(job) {
    job.progress = progress
    const listener = _progressListeners.find(item => item.key === key)
    listener && listener.onProgress(progress)
  } else {
    Toast.show('cannot find the progress')
  }
}

function onProgressEnd(key: string) {
  const job = _progressList.find(item => item.key === key)
  if(job) {
    job.downloaded = true
  }
  const listener = _progressListeners.find(item => item.key === key)
  listener && listener.onEnd()
}

function removeProgress(key: string) {
  _progressList.splice(_progressList.findIndex(item => item.key === key), 1)
}

// ******************** 监听任务进度变化 ********************

function addProgressListener(key: string, onProgress: (progerss: number) => void, onEnd: () => void) {
  if(_progressListeners.some(item => item.key === key)) {
    // Toast.show('key is duplicated')
  } else {
    _progressListeners.push({onProgress, key, onEnd})
  }
}

function removeProgressListener(key: string) {
  _progressListeners.splice(_progressListeners.findIndex(item => item.key === key), 1)
}

function isInProgress(key: string): boolean {
  const job = _progressList.find(item => item.key === key)
  return job !== undefined
}

function isProgressEnd(key: string): boolean {
  const job = _progressList.find(item => item.key === key)
  return job ? job.downloaded : false
}

export default {
  addProgress,
  updateProgress,
  onProgressEnd,
  addProgressListener,
  removeProgressListener,
  isInProgress,
  isProgressEnd,
  removeProgress,
}