import { fromJS } from 'immutable'
import { handleActions } from 'redux-actions'
import RNFS, {DownloadFileOptions, DownloadProgressCallbackResult} from '../../native/RNFS'
// Constants
// --------------------------------------------------
export const DOWN_SET = 'DOWN_SET'
export const DOWNLOADING_FILE = 'DOWNLOADING_FILE'
export const DOWNLOADED_FILE_DELETE = 'DOWNLOADED_FILE_DELETE'
export const DOWNLOADED_SET_IGNORE = 'DOWNLOADED_SET_IGNORE'
export const SAMPLE_DATA_SHOW = 'SAMPLE_DATA_SHOW'
export const DOWNLOADING_SOURCE_FILE = 'DOWNLOADING_SOURCE_FILE'
export const DOWNLOADED_SOURCE_FILE_DELETE = 'DOWNLOADED_SOURCE_FILE_DELETE'
// Actions
// ---------------------------------.3-----------------
/** 下载参数 */
export type IDownloadProps  = {
  key?: string,
} & DownloadFileOptions

export type Download = {
  id: string | number,
  progress: number,
  downloaded: boolean,
}

/** downloads结构 */
export type Downloads = Array<Download>

export interface DownloadData {
  [id: string]: Download,
}

export const setSampleDataShow = (
  params = {},
  cb = () => {},
) => async (dispatch: (arg0: any) => any) => {
  await dispatch({
    type: SAMPLE_DATA_SHOW,
    payload: params,
  })
  cb && cb()
}

export const setDownInformation = (
  params = {},
  cb = () => {},
) => async (dispatch: (arg0: { type: string; payload: {} }) => any) => {
  await dispatch({
    type: DOWN_SET,
    payload: params,
  })
  cb && cb()
}

export const downloadFile = (params: IDownloadProps) => async (dispatch: (arg0: { type: string; payload: { id: any; progress: number; downloaded: boolean; params: {} } | { id: any; progress: number; downloaded: boolean; params: {} } }) => any, getState: () => { (): any; new(): any; down: { (): any; new(): any; toJS: { (): { downloads: any }; new(): any } } }) => {
  let value = 0
  let timer = setInterval(async () => {
    let shouldUpdate = false
    let isExist = false
    const { downloads } = getState().down.toJS()
    for (let index = 0; index < downloads.length; index++) {
      const element = downloads[index]
      if (element.id === params.key) {
        isExist = true
        shouldUpdate = value > downloads[index].progress
        break
      }
    }
    if (!isExist) {
      shouldUpdate = true
    }

    if (shouldUpdate && value !== 100) {
      const data = {
        id: params.key,
        progress: value,
        downloaded: false,
        params,
      }
      await dispatch({
        type: DOWNLOADING_FILE,
        payload: data,
      })
    }
    if (value === 100) {
      clearInterval(timer)
      // timer = null
    }
  }, 2000)
  params.progress = async (res: DownloadProgressCallbackResult) => {
    value = res.progress >= 0 ? ~~res.progress.toFixed(0) : 0
    if (value === 100) {
      const data = {
        id: params.key,
        progress: value,
        downloaded: true,
        params,
      }
      await dispatch({
        type: DOWNLOADING_FILE,
        payload: data,
      })
    }
  }
  const result = RNFS.downloadFile(params)
  return result.promise
}

export const deleteDownloadFile = (params = {}) => async (dispatch: (arg0: { type: string; payload: {} }) => any) => {
  await dispatch({
    type: DOWNLOADED_FILE_DELETE,
    payload: params,
  })
}

export const setIgnoreDownload = (params = {}) => async (dispatch: (arg0: { type: string; payload: {} }) => any) => {
  await dispatch({
    type: DOWNLOADED_SET_IGNORE,
    payload: params,
  })
}

export const downloadSourceFile = (params: IDownloadProps) => async (dispatch: (arg0: { type: string; payload: { id: any; progress: number; downloaded: boolean; params: {} } | { id: any; progress: number; downloaded: boolean; params: {} } }) => any, getState: () => { (): any; new(): any; down: { (): any; new(): any; toJS: { (): { sourceDownloads: any }; new(): any } } }) => {
  let value = 0
  let timer = setInterval(async () => {
    let shouldUpdate = false
    let isExist = false
    const { sourceDownloads } = getState().down.toJS()
    for (let index = 0; index < sourceDownloads.length; index++) {
      const element = sourceDownloads[index]
      if (element.id === params.key) {
        isExist = true
        shouldUpdate = value > sourceDownloads[index].progress
        break
      }
    }
    if (!isExist) {
      shouldUpdate = true
    }

    if (shouldUpdate && value !== 100) {
      const data = {
        id: params.key,
        progress: value,
        downloaded: false,
        params,
      }
      await dispatch({
        type: DOWNLOADING_SOURCE_FILE,
        payload: data,
      })
    }
    if (value === 100) {
      clearInterval(timer)
      // timer = null
    }
  }, 200)
  params.progress = async (res: DownloadProgressCallbackResult) => {
    value = res.progress >= 0 ? ~~res.progress.toFixed(0) : 0
    if (value === 100) {
      const data = {
        id: params.key,
        progress: value,
        downloaded: true,
        params,
      }
      await dispatch({
        type: DOWNLOADING_SOURCE_FILE,
        payload: data,
      })
    }
  }
  const result = RNFS.downloadFile(params)
  return result.promise
}

export const deleteSourceDownloadFile = (id: number | string) => async (dispatch: (arg0: { type: string; payload: {} }) => any) => {
  await dispatch({
    type: DOWNLOADED_SOURCE_FILE_DELETE,
    payload: {id},
  })
}

const initialState = fromJS({
  downList: [
    {
      isShowProgressView: false,
      progress: '',
      disabled: false,
      index: 0,
    },
    {
      isShowProgressView: false,
      progress: '',
      disabled: false,
      index: 1,
    },
    {
      isShowProgressView: false,
      progress: '',
      disabled: false,
      index: 2,
    },
    {
      isShowProgressView: false,
      progress: '',
      disabled: false,
      index: 3,
    },
  ],
  downloads: [],
  sourceDownloads: {}, // {[id]: data}
  downloadInfos: [],
  ignoreDownloads: [],
  showSampleData: false,
})

export default handleActions(
  {
    [`${SAMPLE_DATA_SHOW}`]: (state: any, { payload }: any) => {
      return state.setIn(['showSampleData'], fromJS(payload))
    },
    [`${DOWN_SET}`]: (state: { toJS: () => { downList: any }; setIn: (arg0: string[], arg1: any) => any }, { payload }: any) => {
      const { downList } = state.toJS()
      if (payload.index) {
        const { index } = payload
        downList[index].index = payload.index

        if (payload.isShowProgressView) {
          downList[index].isShowProgressView = payload.isShowProgressView
        }
        if (payload.progress) {
          downList[index].progress = payload.progress
        }
        if (payload.disabled) {
          downList[index].disabled = payload.disabled
        }
      }
      return state.setIn(['downList'], fromJS(downList))
    },
    [`${DOWNLOADING_FILE}`]: (state: { toJS: () => { downloads: any }; setIn: (arg0: string[], arg1: any) => any }, { payload }: any) => {
      const { downloads } = state.toJS()
      if (payload.id) {
        if (downloads.length > 0) {
          let isItem = false
          for (let index = 0; index < downloads.length; index++) {
            const element = downloads[index]
            if (
              element.id === payload.id &&
              payload.progress !== downloads[index].progress
            ) {
              isItem = true
              downloads[index] = payload
              break
            }
          }
          if (!isItem) {
            downloads.push(payload)
          }
        } else {
          downloads.push(payload)
        }
      }
      return state.setIn(['downloads'], fromJS(downloads))
    },
    [`${DOWNLOADED_FILE_DELETE}`]: (state: { toJS: () => { downloads: any }; setIn: (arg0: string[], arg1: any) => any }, { payload }: any) => {
      const { downloads } = state.toJS()
      if (payload.id) {
        if (downloads.length > 0) {
          for (let index = 0; index < downloads.length; index++) {
            const element = downloads[index]
            if (element.id === payload.id) {
              downloads.splice(index, 1)
              break
            }
          }
        }
      }
      return state.setIn(['downloads'], fromJS(downloads))
    },
    [`${DOWNLOADED_SET_IGNORE}`]: (state: { toJS: () => { ignoreDownloads: any }; setIn: (arg0: string[], arg1: any) => any }, { payload }: any) => {
      const { ignoreDownloads } = state.toJS()
      if (payload.id) {
        if (ignoreDownloads.length > 0) {
          let isItem = false
          for (let index = 0; index < ignoreDownloads.length; index++) {
            const element = ignoreDownloads[index]
            if (element.id === payload.id) {
              isItem = true
              break
            }
          }
          if (!isItem) {
            ignoreDownloads.push(payload)
          }
        } else {
          ignoreDownloads.push(payload)
        }
      }
      return state.setIn(['ignoreDownloads'], fromJS(ignoreDownloads))
    },
    [`${DOWNLOADING_SOURCE_FILE}`]: (state: { toJS: () => { sourceDownloads: any }; setIn: (arg0: string[], arg1: any) => any }, { payload }: any) => {
      const { sourceDownloads } = state.toJS()
      if (payload.id) {
        sourceDownloads[payload.id] = payload
      }
      return state.setIn(['sourceDownloads'], fromJS(sourceDownloads))
    },
    [`${DOWNLOADED_SOURCE_FILE_DELETE}`]: (state: { toJS: () => { sourceDownloads: any }; setIn: (arg0: string[], arg1: any) => any }, { payload }: { payload: {id: number} }) => {
      const { sourceDownloads } = state.toJS()
      if (payload.id && sourceDownloads[payload.id]) {
        delete sourceDownloads[payload.id]
      }
      return state.setIn(['sourceDownloads'], fromJS(sourceDownloads))
    },
    // [REHYDRATE]: () => {
    //   // return payload && payload.down ? fromJS(payload.down) : state
    //   return initialState
    // },
  },
  initialState,
)
