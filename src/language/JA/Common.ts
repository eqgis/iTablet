import CN from '../CN'

const Protocol: typeof CN.Protocol = {
  PROTOCOL: 'スーパーマップユーザーサービス協議',
  AGREE: '同意',
  READ_AND_AGREE: '閲読済み、受け取ります。',
  AGAIN:'See Again',//need to translate
  CONFIRM_EXIT:'Confirm Exit',//need to translate
  REMINDER:'Reminder',//need to translate
  AGREEMENT:'We attach great importance to the protection of your personal information and promise to protect and process your information in strict accordance with the hypergraph privacy policy. If we disagree with the policy, we regret that we will not be able to provide services',//need to translate
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
