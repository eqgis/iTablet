import CN from '../CN'

const Protocol: typeof CN.Protocol = {
  PROTOCOL: 'スーパーマップユーザーサービス協議',
  AGREE: '同意',
  READ_AND_AGREE: '閲読済み、受け取ります。',
}

const Common: typeof CN.Common = {
  UP: '上',
  DOWN: '下',
  LEFT: '左',
  RIGHT: '右',
  FRONT: '前',
  BACK: '後',

  PARAMETER: 'パラメータ',
  CONFIRM: 'OK',

  ADD: '追加',
  NONE: 'なし',

  DELETE_CURRENT_OBJ_CONFIRM: '現在オブジェクトを削除しますか?',
  NO_SELECTED_OBJ: '選択中のオブジェクトはありません',
}

export { Protocol, Common }
