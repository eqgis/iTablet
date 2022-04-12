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
}

export { Protocol, Common }
