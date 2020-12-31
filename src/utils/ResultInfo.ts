/**
 * 请求回复信息
 */
import { getLanguage } from '../language'

interface Error {
  code: number,
  errorMsg: string,
}

function resultError(error: Error) {
  let msg: string | undefined = getLanguage(GLOBAL.language).RequestError[`ERROR_${error.code}`]
  if (!msg && error.errorMsg) {
    msg = error.errorMsg
  }
  return msg
}

export default {
  resultError,
}