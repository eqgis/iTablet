import { printLog } from './langchaoServer'
import { RNFS } from 'imobile_for_reactnative'
import RNFetchBlob from 'rn-fetch-blob'

interface Props {
  /** 服务器地址 */
  url: string,
  /** 上传文件路径 */
  path: string,
  /** 分片大小 */
  chunkSize?: number,
  /** 同时上传的分片个数 */
  chunkNum?: number,

  onFetchBlobError?: (e: any) => void,
  onWriteFileError?: (e: any) => void,
  onComplate?: (e: any) => void
  onProgress?: (e: any) => void
}

interface Headers {
  [key: string]: any,
}

interface Chunk {
  name: string,
  type: string,
  uri: string,
}

interface ChunkFile {
  number: number,
  path: string,
  headers: Headers,
  // blob: this.getBlobObject(path),
  blob: Chunk,
}

interface Queue {
  index: number,
  file: ChunkFile,
}

class ChunkUpload {
  defaultProps = {
    chunkNum: 1,
    onFetchBlobError: () => { },
    onWriteFileError: () => { },
    onComplate: () => { },
    onProgress: () => { },
  }

  data: {
    /** 服务器地址 */
    url: string,
    /** 文件路径 */
    path: string,
    chunkSize: number,
    fileName: string,
    fileSize: number,
    fileIdentity: string,
    fileShortId: string | null,
    destinationPath: string,
    totalNumber: number,
    lastModifiedDate: number,
    chunkNum: number,
  }

  chunks: (string | number[])[]
  waittingAddNum: number
  // file: any

  /** 上传列表 */
  queues: Queue[] = []

  /** 等待上传列表 */
  waitQueues: Queue[] = []

  /** 上传列表中最新的一个分片的index */
  lastUploadIndex: number = -1

  onFetchBlobError?: (e: any) => void
  onWriteFileError?: (e: any) => void
  onComplate?: (e: any) => void
  onProgress?: (e: any) => void

  constructor(props: Props) {
    const fileName = props.path.substring(props.path.lastIndexOf("/") + 1, props.path.length)
    this.data = {
      url: props.url,
      path: props.path,
      chunkSize: parseInt(props.chunkSize + ''),
      fileName: fileName,
      fileSize: 0,
      fileIdentity: this.generateFileIdentity(),
      fileShortId: null,
      destinationPath: RNFS.TemporaryDirectoryPath,
      totalNumber: 0,
      lastModifiedDate: 0,
      chunkNum: props.chunkNum || 1,
    }

    this.chunks = []
    this.waittingAddNum = 0
    // this.file = null

    // Errors
    this.onFetchBlobError = props.onFetchBlobError
    this.onWriteFileError = props.onWriteFileError
    this.onComplate = props.onComplate
    this.onProgress = props.onProgress
  }

  start = async () => {
    let statResult = await RNFS.stat(this.data.path)

    this.data.fileSize = parseInt(statResult.size + '')
    this.data.lastModifiedDate = statResult.mtime

    this.data.fileShortId = this.data.fileIdentity.substring(0, 10)
    this.data.totalNumber = this.getTotalNumber()

    this.startDate = new Date().getTime()
    this.getBase64Chunks()
  }

  getBase64Chunks = () => {
    let i = 0
    const total = this.getTotalNumber()

    if (this.queues.length < this.data.chunkNum) {
    }

    const path = `${this.data.destinationPath}/chunk-${this.data.fileShortId}-${i}.tmp`
    RNFetchBlob.fs.readStream(
      this.data.path,
      'base64',
      this.data.chunkSize
    )
      .then((ifstream) => {
        ifstream.open()

        ifstream.onData(async (chunk) => {
          this.chunks.push(chunk)

          if (i < this.data.chunkNum) {
            this.store(i)
          }

          i++
        })

        ifstream.onError(e => this.onFetchBlobError?.(e))

        ifstream.onEnd(() => {
          //
        })
      })
  }

  /**
   * 添加并上传下一个分片
   * @param completeIndex 完成的分片
   * @param resp 上传完成，服务器返回的结果
   * @returns 
   */
  next = async(completeIndex: number, resp?: any) => {

    let unlinkFile = this.getQueueFile(completeIndex)
    // 删除已完成的分片文件，并从上传队列中移除
    if (unlinkFile) {
      await this.unlink(unlinkFile.path)
      this.deleteQueue(completeIndex)
    }

    const lastUploadIndex = ++this.lastUploadIndex
    const total = this.getTotalNumber()
    if (lastUploadIndex < this.getTotalNumber()) {
      this.store(this.lastUploadIndex)
      this.onProgress?.((this.lastUploadIndex - 1) / total)
    } else if (this.lastUploadIndex <= total) {
      console.warn(new Date().getTime() - this.startDate)
      this.onProgress?.(this.lastUploadIndex / total)
      this.onComplate?.(resp)
    }
  }

  /**
   * 储存临时切片，并加入下载队列
   * @param index 
   * @returns 
   */
  store = async (index: number) => {
    if (this.queues.length >= this.data.chunkNum || this.waittingAddNum >= this.data.chunkNum) return
    let chunk: string | number[]

    while (true) {
      if (index <= this.chunks.length) {
        chunk = this.chunks[index]

        break
      }
    }

    const path = `${this.data.destinationPath}/chunk-${this.data.fileShortId}-${index}.tmp`

    let file: ChunkFile | undefined = undefined

    // 等待加入上传队列数量，且不能大于最大数量
    this.waittingAddNum++
    await RNFetchBlob.fs.writeFile(path, chunk, 'base64')
      .then(() => {
        file = {
          number: index,
          path,
          headers: this.getHeaders(index),
          blob: this.getBlobObject(path),
        }
      })
      .catch(e => {
        this.onWriteFileError?.(e)
      })

    if (file) {
      this.addQueue({
        index,
        file,
      })
    }
    // 文件写入完成，并加入上传队列，等待加入上传队列数量 -1
    this.waittingAddNum--
  }

  /**
   * 获取队列中的file
   * @param index 
   * @returns 
   */
  getQueueFile = (index: number): ChunkFile | undefined => {
    for (const queue of this.queues) {
      if (queue.index === index) {
        return queue.file
      }
    }
    return undefined
  }

  /**
   * 加入上传队列
   * @param file 
   * @param index 
   */
  addQueue = (queue: Queue) => {
    if (this.queues.length < this.data.chunkNum) {
      this.queues.push(queue)
      if (this.lastUploadIndex < queue.index) {
        this.lastUploadIndex = queue.index
      }
      // 开始上传
      // this.eject(file)
      this.upload(queue)
    } else {
      // this.waitQueues.push(queue)
    }
  }

  /**
   * 重新下载队列中的分片
   * @param queue
   */
  retry = (queue: Queue) => {
    for (let i = 0; i < this.queues.length; i++) {
      const element = this.queues[i];
      if (element.index === queue.index) {
        this.upload(queue)
        break
      }
    }
  }

  /**
   * 从上传队列移除
   * @param index 
   */
  deleteQueue = (index: number) => {
    for (let i = 0; i < this.queues.length; i++) {
      const queue = this.queues[i]
      if (queue.index === index) {
        this.queues.splice(i, 1)
        break
      }
    }
  }

  /**
   * 上传文件
   */
  upload = (queue: Queue) => {
    const file = queue.file
    const body = new FormData()

    body.append('path', '/')
    body.append('id', file.headers.name)
    body.append('name', file.headers.name)
    body.append('type', file.blob.type)
    body.append('lastModifiedDate', file.headers.lastModifiedDate)
    body.append('size', file.headers.filesize)
    body.append('chunks', file.headers.chunks)
    body.append('chunk', file.headers.chunk)
    body.append('upload', file.blob)
    fetch(this.data.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data;',
      },
      body: body,
    }).then((response) => {

      printLog(`\n response.status ${response.status} | chunks: ${file.headers.chunks} | chunk: ${file.headers.chunk}`)
      console.log('responseData=', response)
      switch (response.status) {
        case 200:
          console.log(response.data)
          this.next(queue.index, response)
          break
      }
    }).catch(error => {
      if (error.response) {
        printLog(`\n error.response: ${JSON.stringify(error.response)}`)
        if ([400, 404, 415, 500, 501].includes(error.response.status)) {
          console.log(error.response.status, 'Failed to upload the chunk.')

          this.unlink(file.path)
        } else if (error.response.status === 422) {
          console.log('Validation Error', error.response.data)

          this.unlink(file.path)
        } else {
          console.log('Re-uploading the chunk...')

          // this.retry()
        }
      } else {
        console.log('Re-uploading the chunk...')
        printLog(`\n error: ${JSON.stringify(error)}`)

        // retry()
        this.next(queue.index, error)
      }
    })
  }

  // eject = (file: any) => {
  //   this.event(file, this.next.bind(this), this.retry.bind(this), this.unlink.bind(this))
  // }

  unlink = async (path: string) => {
    await RNFS.unlink(path)
      .then(() => {
        //
      })
      .catch((err) => {
        //
      })
  }

  getBlobObject = (path: string): Chunk => {
    return {
      name: 'blob',
      type: 'application/octet-stream',
      uri: 'file://' + path,
    }
  }

  getHeaders = (index: number) => {
    return {
      "chunk": index,
      "chunks": this.data.totalNumber,
      "chunkSize": this.data.chunkSize,
      "name": this.data.fileName,
      "filesize": this.data.fileSize,
      "id": this.data.fileIdentity,
      "lastModifiedDate": this.data.lastModifiedDate,
    }
  }

  generateFileIdentity = (length = 32) => {
    const id = [...Array(length)].map(() => (~~(Math.random() * 36)).toString(36)).join('')
    console.warn(id)
    return id
  }

  getTotalNumber = () => {
    const total = Math.ceil(this.data.fileSize / this.data.chunkSize)

    return total > 0 ? total : 1
  }
}

export default ChunkUpload
