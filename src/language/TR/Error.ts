import CN from "../CN"

const RequestError: typeof CN.RequestError = {
  ERROR_400: "Hatalı istek",
  ERROR_401: "Yetki yok",
  // ERROR_402: "Ödeme Gerekli",
  // ERROR_403: "Yasak",
  ERROR_404: "Bulunamadı",
  // ERROR_405: "İzin Verilmeyen Yöntem",
  // ERROR_406: "Kabul Edilemez",
  ERROR_407: "Proxy Yetkilendirmesi Gerekli",
  ERROR_408: "İstek Zamanaşımı",
}

export {
  RequestError,
}