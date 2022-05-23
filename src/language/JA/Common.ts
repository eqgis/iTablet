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
}

export { Protocol, Common }
