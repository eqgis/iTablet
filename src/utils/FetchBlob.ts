
import { HttpRequest, HttpRequestParam, HttpResponse, HttpRequestFailed } from 'imobile_for_reactnative'
import RNFetchBlob from 'rn-fetch-blob'

/** rn-fetch-blob 实现的网络请求接口 */
export class FetchBlob implements HttpRequest {

  request = async (param: HttpRequestParam): Promise<HttpResponse | HttpRequestFailed> => {

    const fetchPromise = await RNFetchBlob.config({trusty: true}).fetch(
      param.method,
      param.url,
      param.headers,
      param.body
    )

    const response = await Promise.race([fetchPromise, timeout(40)])

    if(response === 'timeout') {
      return { error: 'timeout' }
    }
    return {
      headers: response.respInfo.headers,
      status: response.respInfo.status,
      json: response.json,
      text: response.text,
    }
  }
}

/**
 * 超时返回‘timeout’
 * @param sec 超时秒数
 */
function timeout(sec: number): Promise<'timeout'> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('timeout')
    }, 1000 * sec)
  })
}