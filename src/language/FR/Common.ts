import CN from "../CN"

const Protocol: typeof CN.Protocol = {
  PROTOCOL: "Contrat de service utilisateurs SuperMap",
  AGREE: "D'accord",
  READ_AND_AGREE: "J'ai lu et j'accepte les conditions ci-dessus",
  AGAIN:"Voir encore",
  CONFIRM_EXIT:"Confirmer la sortie",
  REMINDER:"Rappel",
  AGREEMENT:"Nous attachons une grande importance à la protection de vos informations personnelles et nous promettons de protéger et de traiter vos informations en stricte conformité avec la politique de confidentialité d'hypergraph. Si nous ne sommes pas d'accord avec la politique, nous regrettons de ne pas être en mesure de fournir des services",
}

const Common: typeof CN.Common = {
  UP: "Haut",
  DOWN: "Bas",
  LEFT: "Gauche",
  RIGHT: "Droit",
  FRONT: "Avant",
  BACK: "Arrière",

  PARAMETER: "Paramètre",
  CONFIRM: "confirmer",

  ADD: "Ajouter",
  NONE: "Aucun",

  DELETE_CURRENT_OBJ_CONFIRM: "Voulez-vous supprimer l'objet actuel ?",
  NO_SELECTED_OBJ: "Aucun objet sélectionné",

  CURRENT: 'Actuel',
  SELECTED: 'Sélectionné',
  DEFAULT: 'Defaut',

  SELECT_MODEL: 'Sélectionner le Modèle',

  PLEASE_SELECT_MODEL: 'Please select model', // To be translated
  
  SHOULD_BE_DECIMAL_FRACTION: 'should be a ddecimal fraction',
  SHOULD_BE_INTEGER: 'shoud be an integer',
  SHOULD_BE_POSITIVE_NUMBER: 'shoud be a positive number',

  
  TRANVERSE: 'Tranverse',
  LONGITUDINAL: 'Longitudinal',
  HORIZONTAL: 'Horizontal',
  VERTICAL: 'Vertical',
  
  EXIT_SAND_TABLE_CONFIRM: 'Do you want to quit editing the sand table?',
  PLEASE_INPUT_MODEL_NAME: 'Please input model name',
  SAND_TABLE: 'Sand Table',
  EXPORT_SAND_TABLE_CONFIRM: 'Do you want to export the sand table?',
  MODEL_LIST: 'Model List',

  ALIGN: 'Alignment',
}

export { Protocol, Common }
