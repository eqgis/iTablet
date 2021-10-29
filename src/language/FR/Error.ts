import CN from "../CN"

const RequestError: typeof CN.RequestError = {
  ERROR_400: "Demande erronée",
  ERROR_401: "Non autorisé",
  // ERROR_402: "Payment Required",
  // ERROR_403: "Forbidden",
  ERROR_404: "Pas trouvé",
  // ERROR_405: "Method Not Allowed",
  // ERROR_406: "Not Acceptable",
  ERROR_407: "Authentification proxy requise",
  ERROR_408: "Demande expirée",
}

export {
  RequestError,
}