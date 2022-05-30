import CN from "../CN"

const Protocol: typeof CN.Protocol = {
  PROTOCOL: "スーパーマップユーザーサービス協議",
  AGREE: "同意",
  READ_AND_AGREE: "閲読済み、受け取ります。",
  AGAIN:"もう一度確認",
  CONFIRM_EXIT:"アプリケーションを終了",
  REMINDER:"リマインダー",
  AGREEMENT:"弊社は個人情報の保護を非常に重要視し、SuperMapプライバシーポリシーに厳密に従ってあなたの情報を保護および処理することを約束します。あなたがこのポリシーに同意しない場合、残念ながら、サービスを提供することはできません",
}

const Common: typeof CN.Common = {
  UP: "上",
  DOWN: "下",
  LEFT: "左",
  RIGHT: "右",
  FRONT: "前",
  BACK: "後",

  PARAMETER: "パラメータ",
  CONFIRM: "OK",

  ADD: "追加",
  NONE: "なし",

  DELETE_CURRENT_OBJ_CONFIRM: "現在オブジェクトを削除しますか?",
  NO_SELECTED_OBJ: "選択中のオブジェクトはありません",

  CURRENT: '現在',
  SELECTED: '選択',
  DEFAULT: 'デフォルト',

  SELECT_MODEL: 'モデルの選択',

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

  ALIGNMENT: '配置',
  LEFT_START: '左上',
  LEFT_END: '左下',
  RIGHT_START: '右上',
  RIGHT_END: '右下',
  TOP_START: '上左',
  TOP_END: '上右',
  BOTTOM_START: '下左',
  BOTTOM_END: '下右',


  LINE_POINT_INTERVAL: 'Line point interval',  // To be translated
  LINE_MARKER_SPEED: 'Speed', // To be translated
  LINE_MARKER: 'Line marker',  // To be translated

}

export { Protocol, Common }
