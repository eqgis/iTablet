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

  DELETE_CURRENT_OBJ_CONFIRM: 'Do you want to delete current object?',  //to be translated
  NO_SELECTED_OBJ: 'No selected object',  //to be translated
}

export { Protocol, Common }
