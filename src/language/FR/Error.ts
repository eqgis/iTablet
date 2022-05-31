import CN from "../CN"

const RequestError: typeof CN.RequestError = {
  ERROR_400: "Demande erronée",
  ERROR_401: "Non autorisé",
  // ERROR_402: "Paiement requis",
  // ERROR_403: "Interdit",
  ERROR_404: "Pas trouvé",
  // ERROR_405: "Méthode Non autorisée",
  // ERROR_406: "Pas acceptable",
  ERROR_407: "Authentification proxy requise",
  ERROR_408: "Demande expirée",
}

export {
  RequestError,
}