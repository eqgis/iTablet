import CN from "../CN"

const RequestError: typeof CN.RequestError = {
  ERROR_400: "リクエストパラメータが正しくありません",
  ERROR_401: "権限がありません",
  // ERROR_402: "パラメータ",
  // ERROR_403: "パラメータ",
  ERROR_404: "リクエストに失敗しました",
  // ERROR_405: "Method Not Allowed",
  // ERROR_406: "Not Acceptable",
  ERROR_407: "権限がありません",
  ERROR_408: "リクエストがタイムアウトしました",
}

export {
  RequestError,
}