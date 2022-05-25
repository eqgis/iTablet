import CN from "../CN"

const Protocol: typeof CN.Protocol = {
  PROTOCOL: "SuperMap Kullanıcı Hizmet Sözleşmesi",
  AGREE: "Kabul Ediyorum",
  READ_AND_AGREE: "Yukarıdaki şartları okudum ve kabul ediyorum",
  AGAIN:"Tekrar Gör",
  CONFIRM_EXIT:"Çıkışı Onayla",
  REMINDER:"Hatırlatıcı",
  AGREEMENT:"Kişisel bilgilerinizin korunmasına büyük önem veriyoruz ve bilgilerinizi SuperMap gizlilik politikasına sıkı sıkıya uygun olarak korumayı ve işlemeyi taahhüt ediyoruz. Bu gizlilik politikasıyla aynı fikirde olmadığınız takdirde, hizmet sağlayamayacağımız için üzgünüz.",
}

const Common: typeof CN.Common = {
  UP: "Yukarı",
  DOWN: "Aşağı",
  LEFT: "Sol",
  RIGHT: "Sağ",
  FRONT: "Ön",
  BACK: "Arka",

  PARAMETER: "Parametre",
  CONFIRM: "Onayla",

  ADD: "Ekle",
  NONE: "hayır",

  DELETE_CURRENT_OBJ_CONFIRM: "Ağımdaki nesni silmek ister misiniz?",
  NO_SELECTED_OBJ: "Seçili nesne yok",

  CURRENT: 'Mevcut',
  SELECTED: 'Seçili',
  DEFAULT: 'Varsayılan',

  SELECT_MODEL: 'Model Seç',

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

  NULL_DATA: 'Null Data', // to be translated

  PLEASE_SELECT_OBJ: 'Please select object', // to be translated
  PLEASE_SELECT_LAYER_OR_OBJECT: "Please select a layer or object", // to be translated
  PLEASE_SELECT_AR_OBJECT_LAYER: "Please select ar object layer", // to be translated

  ATTRIBUTE_ADD_TO_AR_SCENE: "Add Attribute table to AR scene",  // to be translated
  
}

export { Protocol, Common }
