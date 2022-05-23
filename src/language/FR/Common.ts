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

  VISIBILITY: 'Visibility', // to be translated
  SHOW: 'Show', // to be translated
  HIDE: 'Hide', // to be translated

  CUSTOME_ANIMATION: 'Custome Animation', // to be translated
  MODEL_ANIMATION: 'Model Animation', // to be translated
  BONE_ANIMATION: 'Bone Animation', // to be translated
  ANIMATION_BOUNDS: 'Animation Bounds', // to be translated
  ANIMATION_SETTING: 'Animation Settings', // to be translated
  REPEAT_COUNT: 'Repeat Count', // to be translated

  DELAY: 'Delay', // to be translated
  ORDER: 'Order', // to be translated
  AFTER_PREV_ANIMATION: 'Start After Previous', // to be translated
  WITH_PREV_ANIMATION: 'Start With Previous', // to be translated
  TOUCH_TO_START: 'Touch To Start', // to be translated

  START_FRAME: 'Start Frame', // to be translated
  END_FRAME: 'End Frame', // to be translated

  START_FROM_CURRENT_POSITION: 'Start From Current Position', // to be translated
  START_FROM_CURRENT_DGREE: 'Start From Current Degree', // to be translated

  START_POSITION: 'Start Postion', // to be translated
  END_POSITION: 'End Position', // to be translated
  START_DEGREE: 'Start Degree', // to be translated
  END_DEGREE: 'End Degree', // to be translated

  KEEP_VISIBLE: 'Keep Visible', // to be translated
  KEEP_REPEATE: 'Keep Repeat',  // to be translated

  ANIMATION_LIST: 'Animation list',  // to be translated
  ANIMATION_WINDOW: 'Animation window',  // to be translated
  
  PLEASE_SELECT_ANIMATION: 'Please Select Animation',   // to be translated
  
  DELETE_COMFIRM: 'Would you like to delete it?', // to be translated

}

export { Protocol, Common }
