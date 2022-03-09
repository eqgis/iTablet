import CN from "../CN"

const RequestError: typeof CN.RequestError = {
  ERROR_400: "リクエストパラメータに誤りがあります",
  ERROR_401: "権限はありません",
  // ERROR_402: "パラメータ",
  // ERROR_403: "パラメータ",
  ERROR_404: "リクエストに失敗しました",
  // ERROR_405: "Method Not Allowed",
  // ERROR_406: "Not Acceptable",
  ERROR_407: "権限はありません",
  ERROR_408: "リクエストはタイムアウトしました",
}

export {
  RequestError,
}